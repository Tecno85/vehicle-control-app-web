import { Injectable } from '@nestjs/common';
import { HasuraError } from '../hasura/hasura.errors.js';
import { HasuraService } from '../hasura/hasura.service.js';
import {
  HasuraHealthResponseDto,
  HealthResponseDto,
} from './health-response.dto.js';

// Consulta fija: solo cuenta vehículos, sin datos personales. El navegador no
// puede enviar otra.
const VEHICULOS_COUNT_QUERY =
  'query ConteoVehiculos { vehiculos_aggregate { aggregate { count } } }';

interface VehiculosCountData {
  vehiculos_aggregate?: { aggregate?: { count?: unknown } };
}

@Injectable()
export class HealthService {
  constructor(private readonly hasuraService: HasuraService) {}

  check(): HealthResponseDto {
    return { status: 'ok', service: 'core-service' };
  }

  async checkHasura(): Promise<HasuraHealthResponseDto> {
    const data = await this.hasuraService.request<VehiculosCountData | null>(
      VEHICULOS_COUNT_QUERY,
    );
    const count = data?.vehiculos_aggregate?.aggregate?.count;
    if (typeof count !== 'number') {
      throw new HasuraError(
        'UNAVAILABLE',
        'Hasura respondió con un formato inesperado.',
      );
    }
    return { status: 'ok', service: 'hasura', vehiculos: count };
  }
}
