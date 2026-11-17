import { Module } from '@nestjs/common';
import { HasuraModule } from '../hasura/hasura.module.js';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

@Module({
  imports: [HasuraModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
