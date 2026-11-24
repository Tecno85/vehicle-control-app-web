import { HttpException, type HttpStatus } from '@nestjs/common';

// Forma de los errores de la API, definida en la evidencia de sesiones 4 y 5.
// El mensaje se muestra a la titular: nunca lleva datos de la sesión ni secretos.
export interface ErrorApi {
  codigo: string;
  mensaje: string;
}

export function errorApi(
  estado: HttpStatus,
  codigo: string,
  mensaje: string,
): HttpException {
  return new HttpException({ codigo, mensaje } satisfies ErrorApi, estado);
}
