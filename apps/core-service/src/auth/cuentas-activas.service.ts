import { Injectable } from '@nestjs/common';
import { formatoInesperado } from '../hasura/hasura.errors.js';
import { HasuraService } from '../hasura/hasura.service.js';
import { MEMORIA_CUENTA_ACTIVA_MS } from './sesion.reglas.js';

export const CUENTA_ACTIVA = `query CuentaActiva($id: Int!) {
  usuarios_by_pk(id: $id) { activo }
}`;

// El token de acceso dura 15 minutos y no se puede retirar. Para que una cuenta
// desactivada deje de recibir datos antes, SesionGuard pregunta aquí en cada
// petición. La respuesta se recuerda un minuto por cuenta, para no consultar
// Hasura cada vez. La memoria es de este proceso: con varias copias de
// core-service, cada una recordaría por su lado.
@Injectable()
export class CuentasActivasService {
  private readonly memoria = new Map<number, { activa: boolean; hasta: number }>();

  constructor(private readonly hasura: HasuraService) {}

  async estaActiva(cuentaId: number): Promise<boolean> {
    const ahora = Date.now();
    const recordada = this.memoria.get(cuentaId);
    if (recordada && recordada.hasta > ahora) {
      return recordada.activa;
    }

    const { usuarios_by_pk: cuenta } = await this.hasura.request<{
      usuarios_by_pk?: { activo?: unknown } | null;
    }>(CUENTA_ACTIVA, { id: cuentaId });
    if (cuenta === undefined || (cuenta !== null && typeof cuenta.activo !== 'boolean')) {
      throw formatoInesperado();
    }
    // Una cuenta borrada cuenta como desactivada.
    const activa = cuenta?.activo === true;
    this.memoria.set(cuentaId, { activa, hasta: ahora + MEMORIA_CUENTA_ACTIVA_MS });
    return activa;
  }
}
