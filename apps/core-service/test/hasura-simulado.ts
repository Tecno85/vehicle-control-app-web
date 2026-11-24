// Hasura en memoria para las pruebas e2e: responde solo las consultas que usa
// core-service, reconocidas por su nombre, y aplica las mismas reglas de la
// tabla sesiones (token_hash único y vencimiento dentro del límite total).
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

type Filtro = {
  token_hash?: { _eq: string };
  familia?: { _eq: string };
  revocada_en?: { _is_null: boolean };
};

export class HasuraSimulado {
  sesiones: SesionSimulada[] = [];
  consultas: string[] = [];

  constructor(
    readonly usuarios: UsuarioSimulado[],
    readonly vehiculos: VehiculoSimulado[],
  ) {}

  request<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const operacion = /^(?:query|mutation)\s+(\w+)/.exec(query.trim())?.[1] ?? '';
    this.consultas.push(operacion);
    return Promise.resolve(this.responder(operacion, variables) as T);
  }

  private responder(operacion: string, v: Record<string, any>): unknown {
    switch (operacion) {
      case 'CuentaPorCorreo':
        return { usuarios: this.usuarios.filter((u) => u.correo === v.correo).map((u) => ({ ...u })) };
      case 'Perfil': {
        const u = this.usuarios.find((x) => x.id === v.id);
        return { usuarios_by_pk: u ? { nombre: u.nombre, correo: u.correo, activo: u.activo } : null };
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
      case 'VehiculoDeLaCuenta':
        return {
          vehiculos: this.vehiculos
            .filter((x) => x.id === v.id && x.usuario_id === v.usuarioId)
            .map(({ usuario_id: _cuenta, ...resto }) => resto),
        };
      case 'ConteoVehiculos':
        return {
          vehiculos_aggregate: {
            aggregate: { count: this.vehiculos.filter((x) => x.usuario_id === v.usuarioId).length },
          },
        };
      default:
        throw new Error(`Consulta no simulada: ${operacion}`);
    }
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
