import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module.js';
import { ErroresFilter } from './common/errores.filter.js';
import { HealthModule } from './health/health.module.js';
import { VehiculosModule } from './vehiculos/vehiculos.module.js';

@Module({
  imports: [AuthModule, HealthModule, VehiculosModule],
  providers: [{ provide: APP_FILTER, useClass: ErroresFilter }],
})
export class AppModule {}
