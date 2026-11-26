import { Controller, Get } from '@nestjs/common';
import { Publico } from '../auth/publico.decorator.js';
import { HealthResponseDto } from './health-response.dto.js';
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
}
