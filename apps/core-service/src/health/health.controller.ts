import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { CuentaActual } from '../auth/cuenta-actual.decorator.js';
import { Publico } from '../auth/publico.decorator.js';
import { HasuraError } from '../hasura/hasura.errors.js';
import {
  HasuraHealthResponseDto,
  HealthResponseDto,
} from './health-response.dto.js';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // Pública: solo dice que core-service responde, sin datos.
  @Publico()
  @Get()
  check(): HealthResponseDto {
    return this.healthService.check();
  }

  // Prueba la conexión real con Hasura. Exige sesión y cuenta solo los
  // vehículos de esa cuenta. Cualquier falla responde 503 con el mensaje de
  // HasuraError, que no lleva el secreto ni la respuesta cruda.
  @Get('hasura')
  async checkHasura(
    @CuentaActual() cuentaId: number,
  ): Promise<HasuraHealthResponseDto> {
    try {
      return await this.healthService.checkHasura(cuentaId);
    } catch (error) {
      if (error instanceof HasuraError) {
        throw new ServiceUnavailableException(error.message);
      }
      throw error;
    }
  }
}
