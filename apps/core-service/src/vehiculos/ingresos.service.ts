import { HttpStatus, Injectable } from '@nestjs/common';
import { errorApi } from '../common/errores.js';
import { esRechazoPor, formatoInesperado } from '../hasura/hasura.errors.js';
import { HasuraService } from '../hasura/hasura.service.js';
import type { CrearIngresoDto } from './dto/crear-ingreso.dto.js';
import { CREAR_INGRESO, INGRESOS_DEL_VEHICULO, VEHICULO_PARA_INGRESO } from './ingresos.graphql.js';

export type TipoIngreso = 'TAXI' | 'INDRIVE';
export interface Ingreso {
  id: number; vehiculo_id: number; tipo: TipoIngreso; fecha: string; valor: number;
  cuota_referencia: number | null; motivo: string | null; nota: string | null;
}
interface VehiculoIngreso { id: number; activo: boolean; tipo: 'TAXI' | 'PARTICULAR'; habilitado_indrive: boolean; cuota_diaria: number | null }

@Injectable()
export class IngresosService {
  constructor(private readonly hasura: HasuraService) {}

  async listar(vehiculoId: number, cuentaId: number): Promise<Ingreso[]> {
    const { vehiculos } = await this.hasura.request<{ vehiculos?: Array<{ ingresos?: Ingreso[] }> }>(INGRESOS_DEL_VEHICULO, { id: vehiculoId, usuarioId: cuentaId });
    if (!Array.isArray(vehiculos) || !vehiculos[0] || !Array.isArray(vehiculos[0].ingresos)) throw formatoInesperado();
    return vehiculos[0].ingresos;
  }

  async crear(vehiculoId: number, dto: CrearIngresoDto, cuentaId: number): Promise<Ingreso> {
    const { vehiculos } = await this.hasura.request<{ vehiculos?: VehiculoIngreso[] }>(VEHICULO_PARA_INGRESO, { id: vehiculoId, usuarioId: cuentaId });
    const vehiculo = vehiculos?.[0];
    if (!vehiculo) throw noEncontrado();
    if (!vehiculo.activo) throw errorApi(HttpStatus.CONFLICT, 'VEHICULO_INACTIVO', 'Este vehículo está desactivado y no recibe nuevos ingresos.');
    if (dto.fecha > fechaHoy()) throw errorApi(HttpStatus.UNPROCESSABLE_ENTITY, 'FECHA_FUTURA', 'La fecha no puede ser posterior a hoy.', { fecha: 'La fecha no puede ser posterior a hoy.' });
    const taxi = vehiculo.tipo === 'TAXI';
    if (!taxi && !vehiculo.habilitado_indrive) throw errorApi(HttpStatus.UNPROCESSABLE_ENTITY, 'VEHICULO_SIN_INDRIVE', 'Este particular no está habilitado para inDrive.');
    if (taxi && dto.valor !== vehiculo.cuota_diaria && !dto.motivo) throw errorApi(HttpStatus.UNPROCESSABLE_ENTITY, 'MOTIVO_REQUERIDO', 'Escribe el motivo porque el valor recibido es distinto de la cuota.', { motivo: 'Escribe el motivo porque el valor recibido es distinto de la cuota.' });
    try {
      const { insert_ingresos_one: ingreso } = await this.hasura.request<{ insert_ingresos_one?: Ingreso | null }>(CREAR_INGRESO, { ingreso: { vehiculo_id: vehiculoId, tipo: taxi ? 'TAXI' : 'INDRIVE', fecha: dto.fecha, valor: dto.valor, cuota_referencia: taxi ? vehiculo.cuota_diaria : null, motivo: dto.motivo || null, nota: dto.nota || null } });
      if (!ingreso) throw formatoInesperado();
      return ingreso;
    } catch (error) {
      if (esRechazoPor(error, 'ingresos_vehiculo_id_fecha_key')) throw errorApi(HttpStatus.CONFLICT, 'INGRESO_DUPLICADO', 'Ya existe un ingreso para ese vehículo y esa fecha.');
      throw error;
    }
  }
}

function fechaHoy(): string { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date()); }
function noEncontrado() { return errorApi(HttpStatus.NOT_FOUND, 'VEHICULO_NO_ENCONTRADO', 'No encontramos ese vehículo en tu cuenta.'); }
