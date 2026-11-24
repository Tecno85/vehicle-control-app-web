import { Module } from '@nestjs/common';
import { HasuraModule } from '../hasura/hasura.module.js';
import { VehiculosController } from './vehiculos.controller.js';
import { VehiculosService } from './vehiculos.service.js';

@Module({
  imports: [HasuraModule],
  controllers: [VehiculosController],
  providers: [VehiculosService],
})
export class VehiculosModule {}
