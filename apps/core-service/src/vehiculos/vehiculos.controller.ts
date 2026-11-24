import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { CuentaActual } from '../auth/cuenta-actual.decorator.js';
import { errorApi } from '../common/errores.js';
import { leerId } from '../common/ids.js';
import { VehiculosService, type Vehiculo } from './vehiculos.service.js';

// Por ahora solo la parte «un vehículo» de S06, sin registros ni totales.
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculos: VehiculosService) {}

  @Get(':id')
  obtener(
    @Param('id') idTexto: string,
    @CuentaActual() cuentaId: number,
  ): Promise<Vehiculo> {
    const id = leerId(idTexto);
    if (id === null) {
      throw errorApi(
        HttpStatus.BAD_REQUEST,
        'DATOS_INVALIDOS',
        'El número del vehículo no es válido.',
      );
    }
    return this.vehiculos.obtener(id, cuentaId);
  }
}
