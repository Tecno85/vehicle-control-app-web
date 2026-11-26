import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CuentaActual } from '../auth/cuenta-actual.decorator.js';
import { errorApi } from '../common/errores.js';
import { leerId } from '../common/ids.js';
import { ActualizarVehiculoDto } from './dto/actualizar-vehiculo.dto.js';
import { CrearVehiculoDto } from './dto/crear-vehiculo.dto.js';
import {
  VehiculosService,
  type Flota,
  type Vehiculo,
  type VehiculoConRegistros,
} from './vehiculos.service.js';

// Recibe la ruta, el body ya validado por su DTO y la cuenta de la sesión, y se
// los pasa al servicio, que aplica las reglas. Todas las rutas exigen sesión.
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculos: VehiculosService) {}

  @Get()
  listar(@CuentaActual() cuentaId: number): Promise<Flota> {
    return this.vehiculos.listar(cuentaId);
  }

  @Get(':id')
  obtener(
    @Param('id') idTexto: string,
    @CuentaActual() cuentaId: number,
  ): Promise<VehiculoConRegistros> {
    return this.vehiculos.obtener(idDeVehiculo(idTexto), cuentaId);
  }

  @Post()
  crear(
    @Body() dto: CrearVehiculoDto,
    @CuentaActual() cuentaId: number,
  ): Promise<Vehiculo> {
    return this.vehiculos.crear(dto, cuentaId);
  }

  @Patch(':id')
  actualizar(
    @Param('id') idTexto: string,
    @Body() dto: ActualizarVehiculoDto,
    @CuentaActual() cuentaId: number,
  ): Promise<Vehiculo> {
    return this.vehiculos.actualizar(idDeVehiculo(idTexto), dto, cuentaId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(
    @Param('id') idTexto: string,
    @CuentaActual() cuentaId: number,
  ): Promise<void> {
    return this.vehiculos.eliminar(idDeVehiculo(idTexto), cuentaId);
  }
}

function idDeVehiculo(texto: string): number {
  const id = leerId(texto);
  if (id === null) {
    throw errorApi(
      HttpStatus.BAD_REQUEST,
      'DATOS_INVALIDOS',
      'El número del vehículo no es válido.',
    );
  }
  return id;
}
