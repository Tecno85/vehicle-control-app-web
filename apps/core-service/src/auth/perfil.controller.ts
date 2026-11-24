import { Controller, Get } from '@nestjs/common';
import { CuentaActual } from './cuenta-actual.decorator.js';
import { SesionService, type Titular } from './sesion.service.js';

@Controller('perfil')
export class PerfilController {
  constructor(private readonly sesiones: SesionService) {}

  @Get()
  perfil(@CuentaActual() cuentaId: number): Promise<Titular> {
    return this.sesiones.perfil(cuentaId);
  }
}
