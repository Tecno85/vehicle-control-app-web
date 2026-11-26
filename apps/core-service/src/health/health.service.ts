import { Injectable } from '@nestjs/common';
import { HealthResponseDto } from './health-response.dto.js';

@Injectable()
export class HealthService {
  check(): HealthResponseDto {
    return { status: 'ok', service: 'core-service' };
  }
}
