import { HasuraError } from '../src/hasura/hasura.errors.js';

// Hasura en memoria para las pruebas e2e: responde solo las consultas que usa
// core-service, reconocidas por su nombre, y aplica las mismas reglas de las
// tablas: en sesiones, token_hash único y vencimiento dentro del límite total;
// en vehiculos, la placa única por cuenta, las reglas de tipo y las claves
// foráneas de sus registros. Rechaza los campos que no son de la tabla, como
// Hasura con vehiculos_insert_input y vehiculos_set_input.
export interface UsuarioSimulado {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
  contrasena_hash: string;
}

export interface VehiculoSimulado {
  id: number;
  usuario_id: number;
  placa: string;
  marca: string;
  modelo: string;
  tipo: 'TAXI' | 'PARTICULAR';
  habilitado_indrive: boolean;
  conductor: string | null;
  cuota_diaria: number | null;
  activo: boolean;
}

export interface SesionSimulada {
  id: number;
  usuario_id: number;
  token_hash: string;
  familia: string;
  familia_vence_en: string;
  expira_en: string;
  revocada_en: string | null;
}

export interface IngresoSimulado {
  id: number;
  vehiculo_id: number;
  tipo: 'TAXI' | 'INDRIVE';
  fecha: string;
  valor: number;
  cuota_referencia: number | null;
  motivo: string | null;
  nota: string | null;
}

// Cuántos ingresos, gastos y documentos tiene cada vehículo, por su id.
export type RegistrosSimulados = Record<number, { ingresos: number; gastos: number; documentos: number }>;

const CAMPOS_EDITABLES = ['placa', 'marca', 'modelo', 'tipo', 'habilitado_indrive', 'conductor', 'cuota_diaria'];
const CAMPOS_AL_CREAR = ['usuario_id', ...CAMPOS_EDITABLES];
const CAMPOS_AL_CAMBIAR = [...CAMPOS_EDITABLES, 'activo'];

// Como responde Hasura cuando PostgreSQL rechaza un dato (ver hasura.service.ts).
function rechazo(restriccion: string): HasuraError {
  return new HasuraError(
    'GRAPHQL',
    'Hasura rechazó la consulta (código: constraint-violation).',
    ['constraint-violation'],
    [restriccion],
  );
}

function camposDesconocidos(objeto: Record<string, unknown>, permitidos: string[]): void {
  const extra = Object.keys(objeto).filter((campo) => !permitidos.includes(campo));
  if (extra.length > 0) {
    throw new HasuraError('GRAPHQL', 'Hasura rechazó la consulta (código: validation-failed).', ['validation-failed']);
  }
}

type Filtro = {
  token_hash?: { _eq: string };
  familia?: { _eq: string };
  revocada_en?: { _is_null: boolean };
};

export class HasuraSimulado {
  sesiones: SesionSimulada[] = [];
  consultas: string[] = [];
  ingresos: IngresoSimulado[] = [];

  constructor(
    readonly usuarios: UsuarioSimulado[],
    readonly vehiculos: VehiculoSimulado[],
    readonly registros: RegistrosSimulados = {},
  ) {}

  request<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const operacion = /^(?:query|mutation)\s+(\w+)/.exec(query.trim())?.[1] ?? '';
    this.consultas.push(operacion);
    try {
      return Promise.resolve(this.responder(operacion, variables) as T);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  }

  private responder(operacion: string, v: Record<string, any>): unknown {
    switch (operacion) {
      case 'CuentaPorCorreo':
        return { usuarios: this.usuarios.filter((u) => u.correo === v.correo).map((u) => ({ ...u })) };
      case 'Perfil': {
        const u = this.usuarios.find((x) => x.id === v.id);
        return { usuarios_by_pk: u ? { nombre: u.nombre, correo: u.correo, activo: u.activo } : null };
      }
      case 'CuentaActiva': {
        const u = this.usuarios.find((x) => x.id === v.id);
        return { usuarios_by_pk: u ? { activo: u.activo } : null };
      }
      case 'CrearSesion': {
        const s = v.sesion as Omit<SesionSimulada, 'id' | 'revocada_en'>;
        if (this.sesiones.some((x) => x.token_hash === s.token_hash)) {
          throw new Error('token_hash repetido');
        }
        if (Date.parse(s.expira_en) > Date.parse(s.familia_vence_en)) {
          throw new Error('expira_en después del límite total');
        }
        const id = this.sesiones.length + 1;
        this.sesiones.push({ ...s, id, revocada_en: null });
        return { insert_sesiones_one: { id } };
      }
      case 'SesionPorToken':
        return {
          sesiones: this.filtrar(v.filtro as Filtro).map((s) => {
            const u = this.usuarios.find((x) => x.id === s.usuario_id)!;
            return { ...s, usuario: { nombre: u.nombre, correo: u.correo, activo: u.activo } };
          }),
        };
      case 'RevocarSesiones': {
        const afectadas = this.filtrar(v.filtro as Filtro);
        for (const s of afectadas) s.revocada_en = v.cambios.revocada_en as string;
        return { update_sesiones: { affected_rows: afectadas.length } };
      }
      case 'FlotaDeLaCuenta':
        return {
          vehiculos: this.vehiculos
            .filter((x) => x.usuario_id === v.usuarioId)
            .sort((a, b) => Number(b.activo) - Number(a.activo) || a.placa.localeCompare(b.placa))
            .map(sinCuenta),
        };
      case 'VehiculoDeLaCuenta':
        return {
          vehiculos: this.deLaCuenta(v.id as number, v.usuarioId as number).map((x) => {
            const r = this.registros[x.id] ?? { ingresos: 0, gastos: 0, documentos: 0 };
            return {
              ...sinCuenta(x),
              ingresos_aggregate: { aggregate: { count: r.ingresos } },
              gastos_aggregate: { aggregate: { count: r.gastos } },
              documentos_aggregate: { aggregate: { count: r.documentos } },
            };
          }),
        };
      case 'CrearVehiculo': {
        camposDesconocidos(v.vehiculo, CAMPOS_AL_CREAR);
        const id = Math.max(0, ...this.vehiculos.map((x) => x.id)) + 1;
        const nuevo = this.revisar({ habilitado_indrive: false, conductor: null, cuota_diaria: null, ...v.vehiculo, id, activo: true });
        this.vehiculos.push(nuevo);
        return { insert_vehiculos_one: sinCuenta(nuevo) };
      }
      case 'ActualizarVehiculo': {
        camposDesconocidos(v.cambios, CAMPOS_AL_CAMBIAR);
        const afectados = this.deLaCuenta(v.id as number, v.usuarioId as number);
        const cambiados = afectados.map((x) => this.revisar({ ...x, ...v.cambios }));
        cambiados.forEach((x) => Object.assign(this.vehiculos.find((y) => y.id === x.id)!, x));
        return { update_vehiculos: { affected_rows: cambiados.length, returning: cambiados.map(sinCuenta) } };
      }
      case 'EliminarVehiculo': {
        const afectados = this.deLaCuenta(v.id as number, v.usuarioId as number);
        for (const x of afectados) {
          const r = this.registros[x.id];
          if (r?.ingresos) throw rechazo('ingresos_vehiculo_id_fkey');
          if (r?.gastos) throw rechazo('gastos_vehiculo_id_fkey');
          if (r?.documentos) throw rechazo('documentos_vehiculo_id_fkey');
        }
        this.vehiculos.splice(0, this.vehiculos.length, ...this.vehiculos.filter((x) => !afectados.includes(x)));
        return { delete_vehiculos: { affected_rows: afectados.length } };
      }
      case 'VehiculoParaIngreso':
        return { vehiculos: this.deLaCuenta(v.id as number, v.usuarioId as number).map(({ usuario_id: _cuenta, ...vehiculo }) => ({
          id: vehiculo.id, activo: vehiculo.activo, tipo: vehiculo.tipo,
          habilitado_indrive: vehiculo.habilitado_indrive, cuota_diaria: vehiculo.cuota_diaria,
        })) };
      case 'CrearIngreso': {
        const ingreso = v.ingreso as Omit<IngresoSimulado, 'id'>;
        camposDesconocidos(ingreso, ['vehiculo_id', 'tipo', 'fecha', 'valor', 'cuota_referencia', 'motivo', 'nota']);
        if (this.ingresos.some((x) => x.vehiculo_id === ingreso.vehiculo_id && x.fecha === ingreso.fecha)) {
          throw rechazo('ingresos_vehiculo_id_fecha_key');
        }
        const nuevo = { ...ingreso, id: Math.max(0, ...this.ingresos.map((x) => x.id)) + 1 };
        this.ingresos.push(nuevo);
        const registros = this.registros[nuevo.vehiculo_id] ?? { ingresos: 0, gastos: 0, documentos: 0 };
        this.registros[nuevo.vehiculo_id] = { ...registros, ingresos: registros.ingresos + 1 };
        return { insert_ingresos_one: nuevo };
      }
      case 'IngresosDelVehiculo': {
        const vehiculos = this.deLaCuenta(v.id as number, v.usuarioId as number);
        return { vehiculos: vehiculos.map((vehiculo) => ({
          ingresos: this.ingresos.filter((x) => x.vehiculo_id === vehiculo.id).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id),
        })) };
      }
      default:
        throw new Error(`Consulta no simulada: ${operacion}`);
    }
  }

  private deLaCuenta(id: number, usuarioId: number): VehiculoSimulado[] {
    return this.vehiculos.filter((x) => x.id === id && x.usuario_id === usuarioId);
  }

  // Las restricciones de la tabla vehiculos, con sus nombres reales.
  private revisar(x: VehiculoSimulado): VehiculoSimulado {
    if (this.vehiculos.some((y) => y.id !== x.id && y.usuario_id === x.usuario_id && y.placa === x.placa)) {
      throw rechazo('vehiculos_usuario_id_placa_key');
    }
    if (x.placa !== x.placa.toUpperCase()) throw rechazo('vehiculos_placa_check');
    if (x.tipo !== 'PARTICULAR' && x.habilitado_indrive) throw rechazo('vehiculos_check');
    if (x.tipo !== 'TAXI' && x.conductor !== null) throw rechazo('vehiculos_check1');
    if ((x.tipo === 'TAXI') !== (x.cuota_diaria !== null)) throw rechazo('vehiculos_check2');
    return x;
  }

  private filtrar(filtro: Filtro): SesionSimulada[] {
    return this.sesiones.filter(
      (s) =>
        (!filtro.token_hash || s.token_hash === filtro.token_hash._eq) &&
        (!filtro.familia || s.familia === filtro.familia._eq) &&
        (!filtro.revocada_en || (s.revocada_en === null) === filtro.revocada_en._is_null),
    );
  }
}

function sinCuenta({ usuario_id: _cuenta, ...vehiculo }: VehiculoSimulado) {
  return vehiculo;
}
