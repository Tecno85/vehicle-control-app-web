import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { errorApi } from '../common/errores.js';
import {
  borrarCookieRenovacion,
  guardarCookieRenovacion,
  leerCookieRenovacion,
} from './cookie-renovacion.js';
import { LimiteIngresoGuard } from './limite-ingreso.guard.js';
import { Publico } from './publico.decorator.js';
import { SesionService, type SesionAbierta, type Titular } from './sesion.service.js';

// Largo de la columna usuarios.correo, y un tope para la contraseña que evita
// calcular hashes de textos enormes.
const LARGO_MAXIMO_CORREO = 120;
const LARGO_MAXIMO_CONTRASENA = 256;

export interface RespuestaSesion {
  token_acceso: string;
  vence_en: string;
  titular: Titular;
}

// S01 y el resto del ciclo de la sesión. Son rutas públicas: el ingreso todavía
// no tiene token, y la renovación y el cierre usan la cookie, no el token.
@Controller('sesion')
export class SesionController {
  constructor(private readonly sesiones: SesionService) {}

  @Publico()
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LimiteIngresoGuard)
  async ingresar(
    @Body() cuerpo: unknown,
    @Res({ passthrough: true }) respuesta: Response,
  ): Promise<RespuestaSesion> {
    const { correo, contrasena } = leerCredenciales(cuerpo);
    const sesion = await this.sesiones.ingresar(correo, contrasena);
    return responder(sesion, respuesta);
  }

  @Publico()
  @Post('renovar')
  @HttpCode(HttpStatus.OK)
  async renovar(
    @Req() solicitud: Request,
    @Res({ passthrough: true }) respuesta: Response,
  ): Promise<RespuestaSesion> {
    try {
      const sesion = await this.sesiones.renovar(
        leerCookieRenovacion(solicitud),
      );
      return responder(sesion, respuesta);
    } catch (error) {
      // Si la renovación se rechaza, se borra la cookie para que el navegador
      // no la siga enviando.
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.UNAUTHORIZED
      ) {
        borrarCookieRenovacion(respuesta);
      }
      throw error;
    }
  }

  @Publico()
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async cerrar(
    @Req() solicitud: Request,
    @Res({ passthrough: true }) respuesta: Response,
  ): Promise<void> {
    await this.sesiones.cerrar(leerCookieRenovacion(solicitud));
    borrarCookieRenovacion(respuesta);
  }
}

function responder(sesion: SesionAbierta, respuesta: Response): RespuestaSesion {
  guardarCookieRenovacion(
    respuesta,
    sesion.renovacion.token,
    sesion.renovacion.venceEn,
  );
  return {
    token_acceso: sesion.acceso.token,
    vence_en: sesion.acceso.venceEn.toISOString(),
    titular: sesion.titular,
  };
}

// Solo lee correo y contraseña; los demás campos se ignoran.
function leerCredenciales(cuerpo: unknown): {
  correo: string;
  contrasena: string;
} {
  const { correo, contrasena } = (
    typeof cuerpo === 'object' && cuerpo !== null ? cuerpo : {}
  ) as Record<string, unknown>;
  const correoNormalizado =
    typeof correo === 'string' ? correo.trim().toLowerCase() : '';
  if (
    !correoNormalizado ||
    correoNormalizado.length > LARGO_MAXIMO_CORREO ||
    typeof contrasena !== 'string' ||
    !contrasena ||
    contrasena.length > LARGO_MAXIMO_CONTRASENA
  ) {
    throw errorApi(
      HttpStatus.BAD_REQUEST,
      'DATOS_INVALIDOS',
      'Escribe tu correo y tu contraseña.',
    );
  }
  return { correo: correoNormalizado, contrasena };
}
