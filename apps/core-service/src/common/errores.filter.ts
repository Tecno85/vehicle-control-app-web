import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { HasuraError } from '../hasura/hasura.errors.js';
import { esErrorApi, type ErrorApi } from './errores.js';

// Inicio del mensaje con que NestJS 12 rechaza un POST, PATCH o DELETE enviado
// desde otro sitio (enableCsrfProtection en configure-app.ts).
const RECHAZO_CSRF = 'Cross-origin request detected';

const ORIGEN_NO_PERMITIDO: ErrorApi = {
  codigo: 'ORIGEN_NO_PERMITIDO',
  mensaje: 'Esta acción solo se puede hacer desde la web-app.',
};

// Los errores que no traen { codigo, mensaje } y que NestJS o Express pueden
// lanzar. Sus mensajes originales no se envían: pueden repetir parte de lo que
// llegó, como una contraseña dentro de un JSON roto.
const SEGUN_ESTADO: Partial<Record<number, ErrorApi>> = {
  [HttpStatus.BAD_REQUEST]: {
    codigo: 'DATOS_INVALIDOS',
    mensaje: 'Los datos enviados no tienen el formato esperado.',
  },
  [HttpStatus.FORBIDDEN]: {
    codigo: 'ACCESO_DENEGADO',
    mensaje: 'No tienes permiso para hacer esta acción.',
  },
  [HttpStatus.NOT_FOUND]: {
    codigo: 'RUTA_NO_ENCONTRADA',
    mensaje: 'Esa dirección no existe en core-service.',
  },
};

const SOLICITUD_RECHAZADA: ErrorApi = {
  codigo: 'SOLICITUD_RECHAZADA',
  mensaje: 'No pudimos atender esta solicitud.',
};

const ERROR_INTERNO: ErrorApi = {
  codigo: 'ERROR_INTERNO',
  mensaje: 'Algo falló en core-service. Intenta de nuevo en unos minutos.',
};

// Da a toda respuesta de error la forma { codigo, mensaje } (y `campos` en los
// de validación), para que la web-app los trate a todos igual.
@Catch()
export class ErroresFilter implements ExceptionFilter {
  private readonly logger = new Logger('Errores');

  catch(error: unknown, host: ArgumentsHost): void {
    const respuesta = host.switchToHttp().getResponse<Response>();
    const [estado, cuerpo] = this.traducir(error);
    respuesta.status(estado).json(cuerpo);
  }

  private traducir(error: unknown): [number, ErrorApi] {
    if (error instanceof HasuraError) {
      // Solo el tipo y los códigos de GraphQL: nunca la consulta ni sus datos.
      const codigos = error.codes.length > 0 ? ` (${error.codes.join(', ')})` : '';
      this.logger.warn(`Falló una consulta a Hasura: ${error.kind}${codigos}`);
      return [
        HttpStatus.SERVICE_UNAVAILABLE,
        {
          codigo: 'SERVICIO_NO_DISPONIBLE',
          mensaje:
            'No pudimos consultar tus datos en este momento. Intenta de nuevo en unos minutos.',
        },
      ];
    }

    if (!(error instanceof HttpException)) {
      // Solo el tipo: el mensaje o la pila podrían llevar datos de la solicitud.
      const tipo = error instanceof Error ? error.name : typeof error;
      this.logger.error(`Error inesperado: ${tipo}`);
      return [HttpStatus.INTERNAL_SERVER_ERROR, ERROR_INTERNO];
    }

    const estado = error.getStatus();
    const cuerpo = error.getResponse();
    if (esErrorApi(cuerpo)) {
      return [estado, cuerpo];
    }
    if (estado === HttpStatus.FORBIDDEN && error.message.startsWith(RECHAZO_CSRF)) {
      return [estado, ORIGEN_NO_PERMITIDO];
    }
    const generico =
      SEGUN_ESTADO[estado] ?? (estado >= 500 ? ERROR_INTERNO : SOLICITUD_RECHAZADA);
    return [estado, generico];
  }
}
