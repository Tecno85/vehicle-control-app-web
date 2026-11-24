import { HttpStatus, Injectable } from '@nestjs/common';
import { errorApi } from '../common/errores.js';
import { formatoInesperado } from '../hasura/hasura.errors.js';
import { HasuraService } from '../hasura/hasura.service.js';

// Busca por id y por cuenta a la vez: si el vehículo es de otra cuenta, la
// consulta no lo encuentra, igual que si no existiera.
export const VEHICULO_DE_LA_CUENTA = `query VehiculoDeLaCuenta($id: Int!, $usuarioId: Int!) {
  vehiculos(where: { id: { _eq: $id }, usuario_id: { _eq: $usuarioId } }) {
    id placa marca modelo tipo habilitado_indrive conductor cuota_diaria activo
  }
}`;

export interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  tipo: 'TAXI' | 'PARTICULAR';
  habilitado_indrive: boolean;
  conductor: string | null;
  cuota_diaria: number | null;
  activo: boolean;
}

@Injectable()
export class VehiculosService {
  constructor(private readonly hasura: HasuraService) {}

  async obtener(id: number, cuentaId: number): Promise<Vehiculo> {
    const { vehiculos } = await this.hasura.request<{ vehiculos?: Vehiculo[] }>(
      VEHICULO_DE_LA_CUENTA,
      { id, usuarioId: cuentaId },
    );
    if (!Array.isArray(vehiculos)) {
      throw formatoInesperado();
    }
    const vehiculo = vehiculos[0];
    if (!vehiculo) {
      // 404 y no 403: así no se revela que el vehículo existe en otra cuenta.
      throw errorApi(
        HttpStatus.NOT_FOUND,
        'VEHICULO_NO_ENCONTRADO',
        'No encontramos ese vehículo en tu cuenta.',
      );
    }
    return vehiculo;
  }
}
