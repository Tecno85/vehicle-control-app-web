import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { leerId } from '../common/ids.js';
import { AUTH_CONFIG, type AuthConfig } from './auth.config.js';
import { DURACION_ACCESO_SEGUNDOS } from './sesion.reglas.js';

export interface TokenAcceso {
  token: string;
  venceEn: Date;
}

// El token de acceso es un JWT firmado con JWT_SECRET (HS256). Solo lleva el id
// de la cuenta (sub), cuándo se creó (iat) y cuándo vence (exp): nada más sale
// de core-service. Dura 15 minutos y no se guarda en la base.
@Injectable()
export class TokenAccesoService {
  constructor(
    private readonly jwt: JwtService,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig | null,
  ) {}

  get configurado(): boolean {
    return this.config !== null;
  }

  async crear(cuentaId: number): Promise<TokenAcceso> {
    if (!this.config) {
      throw new Error('Falta JWT_SECRET: no se puede crear el token.');
    }
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + DURACION_ACCESO_SEGUNDOS;
    const token = await this.jwt.signAsync(
      { sub: String(cuentaId), iat, exp },
      { secret: this.config.jwtSecret, algorithm: 'HS256' },
    );
    return { token, venceEn: new Date(exp * 1000) };
  }

  // Devuelve el id de la cuenta, o null si el token no sirve por cualquier
  // motivo: otra firma, otro algoritmo, vencido o con un id mal formado.
  async verificar(token: string): Promise<number | null> {
    if (!this.config) {
      return null;
    }
    try {
      const datos = await this.jwt.verifyAsync<{ sub?: unknown }>(token, {
        secret: this.config.jwtSecret,
        algorithms: ['HS256'],
      });
      return leerId(datos.sub);
    } catch {
      return null;
    }
  }
}
