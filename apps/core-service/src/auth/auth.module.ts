import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { HasuraModule } from '../hasura/hasura.module.js';
import { AUTH_CONFIG, readAuthConfig } from './auth.config.js';
import { PerfilController } from './perfil.controller.js';
import { SesionController } from './sesion.controller.js';
import { SesionGuard } from './sesion.guard.js';
import { INTENTOS_INGRESO_POR_MINUTO } from './sesion.reglas.js';
import { SesionService } from './sesion.service.js';
import { TokenAccesoService } from './token-acceso.service.js';

@Module({
  imports: [
    HasuraModule,
    // Sin secreto aquí: TokenAccesoService lo pasa en cada firma, porque puede
    // faltar en el .env.
    JwtModule.register({}),
    // Solo el ingreso usa este límite, con LimiteIngresoGuard.
    ThrottlerModule.forRoot([
      { ttl: 60_000, limit: INTENTOS_INGRESO_POR_MINUTO },
    ]),
  ],
  controllers: [SesionController, PerfilController],
  providers: [
    // Se lee al crear la app, después de que main.ts carga el .env.
    { provide: AUTH_CONFIG, useFactory: () => readAuthConfig(process.env) },
    TokenAccesoService,
    SesionService,
    // Exige sesión en toda la API, salvo en las rutas marcadas con @Publico().
    { provide: APP_GUARD, useClass: SesionGuard },
  ],
})
export class AuthModule {}
