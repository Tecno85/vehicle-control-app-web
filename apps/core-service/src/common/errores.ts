import { HttpException, type HttpStatus } from '@nestjs/common';

// Forma de los errores de la API, definida en la evidencia de sesiones 4 y 5.
// El mensaje se muestra a la titular: nunca lleva datos de la sesión ni secretos.
// `campos` solo aparece en los errores de validación: un mensaje por campo.
export interface ErrorApi {
  codigo: string;
  mensaje: string;
  campos?: Record<string, string>;
}

export function errorApi(
  estado: HttpStatus,
  codigo: string,
  mensaje: string,
  campos?: Record<string, string>,
): HttpException {
  const cuerpo: ErrorApi = campos ? { codigo, mensaje, campos } : { codigo, mensaje };
  return new HttpException(cuerpo, estado);
}

export function esErrorApi(cuerpo: unknown): cuerpo is ErrorApi {
  if (typeof cuerpo !== 'object' || cuerpo === null) {
    return false;
  }
  const { codigo, mensaje } = cuerpo as Record<string, unknown>;
  return typeof codigo === 'string' && typeof mensaje === 'string';
}
