import { HttpStatus, Injectable } from '@nestjs/common';
import { errorApi } from '../common/errores.js';
import { esRechazoPor, formatoInesperado } from '../hasura/hasura.errors.js';
import { HasuraService } from '../hasura/hasura.service.js';
import type { ActualizarVehiculoDto } from './dto/actualizar-vehiculo.dto.js';
import type { CrearVehiculoDto, TipoVehiculo } from './dto/crear-vehiculo.dto.js';
import {
  ACTUALIZAR_VEHICULO,
  CREAR_VEHICULO,
  ELIMINAR_VEHICULO,
  FLOTA_DE_LA_CUENTA,
  VEHICULO_DE_LA_CUENTA,
} from './graphql/vehiculos.graphql.js';

export interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  tipo: TipoVehiculo;
  habilitado_indrive: boolean;
  conductor: string | null;
  cuota_diaria: number | null;
  activo: boolean;
}

export interface Registros {
  ingresos: number;
  gastos: number;
  documentos: number;
}

export interface VehiculoConRegistros extends Vehiculo {
  registros: Registros;
}

export interface Flota {
  vehiculos: Vehiculo[];
  conteos: { vehiculos: number; taxis: number; particulares: number };
}

// Los datos que la titular puede elegir; el id, la cuenta, el estado y la
// fecha de creación no se reciben del navegador.
type DatosVehiculo = Omit<Vehiculo, 'id' | 'activo'>;

type Conteo = { aggregate?: { count?: unknown } } | undefined;
interface VehiculoGuardado extends Vehiculo {
  ingresos_aggregate?: Conteo;
  gastos_aggregate?: Conteo;
  documentos_aggregate?: Conteo;
}

// Nombres reales en la base, confirmados con la migración inicial.
const PLACA_UNICA = 'vehiculos_usuario_id_placa_key';
const REGISTROS_DEL_VEHICULO = [
  'ingresos_vehiculo_id_fkey',
  'gastos_vehiculo_id_fkey',
  'documentos_vehiculo_id_fkey',
];

// S02, S06 (flota y detalle), S07 y S08. La cuenta siempre sale de la sesión.
@Injectable()
export class VehiculosService {
  constructor(private readonly hasura: HasuraService) {}

  async listar(cuentaId: number): Promise<Flota> {
    const { vehiculos } = await this.hasura.request<{ vehiculos?: Vehiculo[] }>(
      FLOTA_DE_LA_CUENTA,
      { usuarioId: cuentaId },
    );
    if (!Array.isArray(vehiculos)) {
      throw formatoInesperado();
    }
    // Los conteos de la flota cuentan solo los vehículos activos.
    const activos = vehiculos.filter((v) => v.activo);
    return {
      vehiculos,
      conteos: {
        vehiculos: activos.length,
        taxis: activos.filter((v) => v.tipo === 'TAXI').length,
        particulares: activos.filter((v) => v.tipo === 'PARTICULAR').length,
      },
    };
  }

  async obtener(id: number, cuentaId: number): Promise<VehiculoConRegistros> {
    const { vehiculos } = await this.hasura.request<{ vehiculos?: VehiculoGuardado[] }>(
      VEHICULO_DE_LA_CUENTA,
      { id, usuarioId: cuentaId },
    );
    if (!Array.isArray(vehiculos)) {
      throw formatoInesperado();
    }
    const guardado = vehiculos[0];
    if (!guardado) {
      throw noEncontrado();
    }
    const { ingresos_aggregate, gastos_aggregate, documentos_aggregate, ...vehiculo } = guardado;
    return {
      ...vehiculo,
      registros: {
        ingresos: contar(ingresos_aggregate),
        gastos: contar(gastos_aggregate),
        documentos: contar(documentos_aggregate),
      },
    };
  }

  async crear(dto: CrearVehiculoDto, cuentaId: number): Promise<Vehiculo> {
    const datos = coherente({
      placa: dto.placa,
      marca: dto.marca,
      modelo: dto.modelo,
      tipo: dto.tipo,
      habilitado_indrive: dto.habilitado_indrive ?? false,
      conductor: dto.conductor ?? null,
      cuota_diaria: dto.cuota_diaria ?? null,
    });
    try {
      const { insert_vehiculos_one: creado } = await this.hasura.request<{
        insert_vehiculos_one?: Vehiculo | null;
      }>(CREAR_VEHICULO, { vehiculo: { usuario_id: cuentaId, ...datos } });
      if (!creado) {
        throw formatoInesperado();
      }
      return creado;
    } catch (error) {
      throw traducirPlacaRepetida(error);
    }
  }

  // Junta lo guardado con lo que cambia y revisa el resultado completo, para
  // que una edición parcial no deje un vehículo incoherente.
  async actualizar(
    id: number,
    dto: ActualizarVehiculoDto,
    cuentaId: number,
  ): Promise<Vehiculo> {
    const { registros, ...guardado } = await this.obtener(id, cuentaId);
    const datos: DatosVehiculo = {
      placa: dto.placa ?? guardado.placa,
      marca: dto.marca ?? guardado.marca,
      modelo: dto.modelo ?? guardado.modelo,
      tipo: dto.tipo ?? guardado.tipo,
      habilitado_indrive: dto.habilitado_indrive ?? guardado.habilitado_indrive,
      // En estos dos, null quiere decir «sin»; solo se conserva si no llegó.
      conductor: dto.conductor === undefined ? guardado.conductor : dto.conductor,
      cuota_diaria: dto.cuota_diaria === undefined ? guardado.cuota_diaria : dto.cuota_diaria,
    };

    // S07: los ingresos guardados dependen del tipo y de inDrive.
    const cambiaTipo = datos.tipo !== guardado.tipo;
    const pierdeInDrive = guardado.habilitado_indrive && !datos.habilitado_indrive;
    if (registros.ingresos > 0 && (cambiaTipo || pierdeInDrive)) {
      throw errorApi(
        HttpStatus.CONFLICT,
        'VEHICULO_CON_INGRESOS',
        'Este vehículo ya tiene ingresos: no puede cambiar de tipo ni dejar de estar habilitado para inDrive.',
      );
    }

    const cambios = { ...coherente(datos), ...(dto.activo === false ? { activo: false } : {}) };
    if (!hayCambios(guardado, cambios)) {
      return guardado;
    }

    try {
      const { update_vehiculos: resultado } = await this.hasura.request<{
        update_vehiculos?: { affected_rows?: unknown; returning?: Vehiculo[] } | null;
      }>(ACTUALIZAR_VEHICULO, { id, usuarioId: cuentaId, cambios });
      if (typeof resultado?.affected_rows !== 'number' || !Array.isArray(resultado.returning)) {
        throw formatoInesperado();
      }
      // 0 filas: el vehículo se eliminó entre la consulta y el cambio.
      const actualizado = resultado.returning[0];
      if (resultado.affected_rows === 0 || !actualizado) {
        throw noEncontrado();
      }
      return actualizado;
    } catch (error) {
      throw traducirPlacaRepetida(error);
    }
  }

  // S08: solo sin ingresos, gastos ni documentos. Con registros, la titular
  // puede desactivarlo para conservarlos.
  async eliminar(id: number, cuentaId: number): Promise<void> {
    const { registros } = await this.obtener(id, cuentaId);
    if (registros.ingresos + registros.gastos + registros.documentos > 0) {
      throw conRegistros();
    }
    try {
      const { delete_vehiculos: resultado } = await this.hasura.request<{
        delete_vehiculos?: { affected_rows?: unknown } | null;
      }>(ELIMINAR_VEHICULO, { id, usuarioId: cuentaId });
      if (typeof resultado?.affected_rows !== 'number') {
        throw formatoInesperado();
      }
      if (resultado.affected_rows === 0) {
        throw noEncontrado();
      }
    } catch (error) {
      // Segunda barrera: si llegó un registro después de contarlos, la base
      // rechaza la eliminación por la clave foránea.
      if (esRechazoPor(error, ...REGISTROS_DEL_VEHICULO)) {
        throw conRegistros();
      }
      throw error;
    }
  }
}

// Reglas de S02 que dependen del tipo. Devuelve los datos tal como se guardan.
function coherente(datos: DatosVehiculo): DatosVehiculo {
  if (datos.tipo === 'TAXI') {
    if (datos.cuota_diaria === null) {
      throw tipoIncoherente('cuota_diaria', 'Un taxi necesita su cuota diaria.');
    }
    if (datos.habilitado_indrive) {
      throw tipoIncoherente('habilitado_indrive', 'Un taxi no se habilita para inDrive.');
    }
  } else {
    if (datos.cuota_diaria !== null) {
      throw tipoIncoherente('cuota_diaria', 'Un particular no lleva cuota diaria.');
    }
    if (datos.conductor !== null) {
      throw tipoIncoherente('conductor', 'Un particular no lleva conductor.');
    }
  }
  return datos;
}

function hayCambios(guardado: Vehiculo, cambios: Partial<Vehiculo>): boolean {
  return (Object.keys(cambios) as (keyof Vehiculo)[]).some(
    (campo) => cambios[campo] !== guardado[campo],
  );
}

function contar(conteo: Conteo): number {
  const total = conteo?.aggregate?.count;
  if (typeof total !== 'number') {
    throw formatoInesperado();
  }
  return total;
}

function traducirPlacaRepetida(error: unknown): unknown {
  if (esRechazoPor(error, PLACA_UNICA)) {
    const mensaje = 'Ya tienes un vehículo con esa placa.';
    return errorApi(HttpStatus.CONFLICT, 'PLACA_REPETIDA', mensaje, { placa: mensaje });
  }
  return error;
}

function tipoIncoherente(campo: keyof DatosVehiculo, mensaje: string) {
  return errorApi(HttpStatus.UNPROCESSABLE_ENTITY, 'TIPO_INCOHERENTE', mensaje, {
    [campo]: mensaje,
  });
}

function conRegistros() {
  return errorApi(
    HttpStatus.CONFLICT,
    'VEHICULO_CON_REGISTROS',
    'Este vehículo tiene ingresos, gastos o documentos. Desactívalo para conservarlos.',
  );
}

// 404 y no 403: así no se revela que el vehículo existe en otra cuenta.
function noEncontrado() {
  return errorApi(
    HttpStatus.NOT_FOUND,
    'VEHICULO_NO_ENCONTRADO',
    'No encontramos ese vehículo en tu cuenta.',
  );
}
