import type { CookieOptions, Request, Response } from 'express';

export const COOKIE_RENOVACION = 'sesion_renovacion';

// - httpOnly: el código de la página no puede leerla; solo viaja al servidor.
// - secure: solo viaja por HTTPS, o a localhost, que los navegadores aceptan.
// - sameSite strict: no viaja en peticiones que empiezan en otro sitio.
// - path: solo viaja a /api/sesion (el prefijo /api viene de configure-app.ts),
//   no a las demás rutas de la API.
const OPCIONES: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/api/sesion',
};

export function guardarCookieRenovacion(
  respuesta: Response,
  token: string,
  venceEn: Date,
): void {
  respuesta.cookie(COOKIE_RENOVACION, token, { ...OPCIONES, expires: venceEn });
}

export function borrarCookieRenovacion(respuesta: Response): void {
  respuesta.clearCookie(COOKIE_RENOVACION, OPCIONES);
}

export function leerCookieRenovacion(solicitud: Request): string | undefined {
  const valor: unknown = solicitud.cookies?.[COOKIE_RENOVACION];
  return typeof valor === 'string' ? valor : undefined;
}
