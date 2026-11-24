import {
  BadRequestException,
  Catch,
  ForbiddenException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { HasuraError } from '../hasura/hasura.errors.js';
import type { ErrorApi } from './errores.js';

// Da la forma { codigo, mensaje } a dos errores que no nacen en los servicios:
// - HasuraError: lo puede lanzar cualquier consulta. GET /api/health/hasura lo
//   atiende antes, con su propio mensaje, porque su trabajo es mostrar la falla.
// - ForbiddenException: en core-service solo la lanza la protección contra CSRF
//   de NestJS, al rechazar un POST o DELETE enviado desde otro sitio.
// - BadRequestException: NestJS la lanza cuando el cuerpo no es un JSON válido.
//   Su mensaje puede repetir parte de lo enviado, como una contraseña, así que
//   se reemplaza. Los 400 de los servicios usan errorApi() y no pasan por aquí.
@Catch(HasuraError, ForbiddenException, BadRequestException)
export class ErroresFilter implements ExceptionFilter {
  private readonly logger = new Logger('Errores');

  catch(
    error: HasuraError | ForbiddenException | BadRequestException,
    host: ArgumentsHost,
  ): void {
    const respuesta = host.switchToHttp().getResponse<Response>();

    if (error instanceof HasuraError) {
      // Solo el tipo y los códigos de GraphQL: nunca la consulta ni sus datos.
      const codigos = error.codes.length > 0 ? ` (${error.codes.join(', ')})` : '';
      this.logger.warn(`Falló una consulta a Hasura: ${error.kind}${codigos}`);
      enviar(respuesta, HttpStatus.SERVICE_UNAVAILABLE, {
        codigo: 'SERVICIO_NO_DISPONIBLE',
        mensaje:
          'No pudimos consultar tus datos en este momento. Intenta de nuevo en unos minutos.',
      });
      return;
    }

    if (error instanceof BadRequestException) {
      enviar(respuesta, HttpStatus.BAD_REQUEST, {
        codigo: 'DATOS_INVALIDOS',
        mensaje: 'Los datos enviados no tienen el formato esperado.',
      });
      return;
    }

    enviar(respuesta, HttpStatus.FORBIDDEN, {
      codigo: 'ORIGEN_NO_PERMITIDO',
      mensaje: 'Esta acción solo se puede hacer desde la web-app.',
    });
  }
}

function enviar(respuesta: Response, estado: HttpStatus, cuerpo: ErrorApi): void {
  respuesta.status(estado).json(cuerpo);
}
