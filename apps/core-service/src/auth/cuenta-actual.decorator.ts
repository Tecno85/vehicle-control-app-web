import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { SolicitudConSesion } from './sesion.guard.js';

// Entrega el id de la cuenta que SesionGuard sacó del token firmado. Las rutas
// nunca leen la cuenta del cuerpo ni de la URL, así que nadie puede elegirla.
export const CuentaActual = createParamDecorator(
  (_dato: unknown, contexto: ExecutionContext): number => {
    const { cuentaId } = contexto
      .switchToHttp()
      .getRequest<SolicitudConSesion>();
    if (cuentaId === undefined) {
      throw new Error('@CuentaActual() solo sirve en rutas que exigen sesión.');
    }
    return cuentaId;
  },
);
