import { Injectable } from '@nestjs/common';
import { formatoInesperado } from '../hasura/hasura.errors.js';
import { HasuraService } from '../hasura/hasura.service.js';
import {
  HasuraHealthResponseDto,
  HealthResponseDto,
} from './health-response.dto.js';

// Consulta fija: solo cuenta los vehículos de la cuenta, sin datos personales.
// El navegador no puede enviar otra.
export const VEHICULOS_COUNT_QUERY =
  'query ConteoVehiculos($usuarioId: Int!) { vehiculos_aggregate(where: { usuario_id: { _eq: $usuarioId } }) { aggregate { count } } }';

interface VehiculosCountData {
  vehiculos_aggregate?: { aggregate?: { count?: unknown } };
}

@Injectable()
export class HealthService {
  constructor(private readonly hasuraService: HasuraService) {}

  check(): HealthResponseDto {
    return { status: 'ok', service: 'core-service' };
  }

  async checkHasura(cuentaId: number): Promise<HasuraHealthResponseDto> {
    const data = await this.hasuraService.request<VehiculosCountData | null>(
      VEHICULOS_COUNT_QUERY,
      { usuarioId: cuentaId },
    );
    const count = data?.vehiculos_aggregate?.aggregate?.count;
    if (typeof count !== 'number') {
      throw formatoInesperado();
    }
    return { status: 'ok', service: 'hasura', vehiculos: count };
  }
}
