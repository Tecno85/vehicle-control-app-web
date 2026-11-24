import {
  HttpStatus,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { errorApi } from '../common/errores.js';
import { ES_PUBLICO } from './publico.decorator.js';
import { TokenAccesoService } from './token-acceso.service.js';

export interface SolicitudConSesion extends Request {
  cuentaId?: number;
}

// Se aplica a toda la API (APP_GUARD). Salvo en las rutas marcadas con
// @Publico(), exige «Authorization: Bearer <token de acceso>» y deja el id de
// la cuenta en la solicitud, para @CuentaActual().
@Injectable()
export class SesionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokenAccesoService,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const esPublica = this.reflector.getAllAndOverride<boolean | undefined>(
      ES_PUBLICO,
      [contexto.getHandler(), contexto.getClass()],
    );
    if (esPublica) {
      return true;
    }

    const solicitud = contexto.switchToHttp().getRequest<SolicitudConSesion>();
    const [tipo, token] = solicitud.headers.authorization?.split(' ') ?? [];
    const cuentaId =
      tipo === 'Bearer' && token ? await this.tokens.verificar(token) : null;
    if (cuentaId === null) {
      throw errorApi(
        HttpStatus.UNAUTHORIZED,
        'SESION_REQUERIDA',
        'Necesitas ingresar para ver esta información.',
      );
    }
    solicitud.cuentaId = cuentaId;
    return true;
  }
}
