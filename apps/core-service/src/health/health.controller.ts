import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HasuraError } from '../hasura/hasura.errors.js';
import {
  HasuraHealthResponseDto,
  HealthResponseDto,
} from './health-response.dto.js';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): HealthResponseDto {
    return this.healthService.check();
  }

  // Prueba la conexión real con Hasura. Cualquier falla responde 503 con el
  // mensaje de HasuraError, que no lleva el secreto ni la respuesta cruda.
  @Get('hasura')
  async checkHasura(): Promise<HasuraHealthResponseDto> {
    try {
      return await this.healthService.checkHasura();
    } catch (error) {
      if (error instanceof HasuraError) {
        throw new ServiceUnavailableException(error.message);
      }
      throw error;
    }
  }
}
