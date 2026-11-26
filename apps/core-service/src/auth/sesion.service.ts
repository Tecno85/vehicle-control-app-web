import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { errorApi } from '../common/errores.js';
import { formatoInesperado } from '../hasura/hasura.errors.js';
import { HasuraService } from '../hasura/hasura.service.js';
import { crearHashContrasena, verificarContrasena } from './contrasenas.js';
import {
  DURACION_RENOVACION_MS,
  LIMITE_TOTAL_MS,
} from './sesion.reglas.js';
import { TokenAccesoService, type TokenAcceso } from './token-acceso.service.js';

// Consultas fijas: el navegador no puede enviar otras. Los filtros van como
// variables, con los tipos que Hasura genera para cada tabla.
export const CUENTA_POR_CORREO = `query CuentaPorCorreo($correo: String!) {
  usuarios(where: { correo: { _eq: $correo } }) { id nombre correo activo contrasena_hash }
}`;
export const PERFIL = `query Perfil($id: Int!) {
  usuarios_by_pk(id: $id) { nombre correo activo }
}`;
export const CREAR_SESION = `mutation CrearSesion($sesion: sesiones_insert_input!) {
  insert_sesiones_one(object: $sesion) { id }
}`;
export const SESION_POR_TOKEN = `query SesionPorToken($filtro: sesiones_bool_exp!) {
  sesiones(where: $filtro) {
    usuario_id familia familia_vence_en expira_en revocada_en
    usuario { nombre correo activo }
  }
}`;
export const REVOCAR_SESIONES = `mutation RevocarSesiones($filtro: sesiones_bool_exp!, $cambios: sesiones_set_input!) {
  update_sesiones(where: $filtro, _set: $cambios) { affected_rows }
}`;

// 32 bytes al azar en base64url: 43 caracteres.
const FORMATO_TOKEN_RENOVACION = /^[A-Za-z0-9_-]{43}$/;

export interface Titular {
  nombre: string;
  correo: string;
}

export interface SesionAbierta {
  acceso: TokenAcceso;
  titular: Titular;
  renovacion: { token: string; venceEn: Date };
}

interface CuentaGuardada extends Titular {
  id: number;
  activo: boolean;
  contrasena_hash: string;
}

interface SesionGuardada {
  usuario_id: number;
  familia: string;
  familia_vence_en: string;
  expira_en: string;
  revocada_en: string | null;
  usuario: Titular & { activo: boolean };
}

// Ciclo de la sesión (evidencia de sesión 9, apartado 3). La base solo guarda
// el SHA-256 de cada token de renovación, nunca el token.
@Injectable()
export class SesionService {
  private readonly logger = new Logger(SesionService.name);
  private hashDeRelleno?: Promise<string>;

  constructor(
    private readonly hasura: HasuraService,
    private readonly tokens: TokenAccesoService,
  ) {}

  // El correo llega sin espacios y en minúsculas (lo prepara el controller).
  async ingresar(correo: string, contrasena: string): Promise<SesionAbierta> {
    this.exigirConfiguracion();
    const { usuarios } = await this.hasura.request<{
      usuarios?: CuentaGuardada[];
    }>(CUENTA_POR_CORREO, { correo });
    if (!Array.isArray(usuarios)) {
      throw formatoInesperado();
    }
    const cuenta = usuarios[0];

    // Sin cuenta, o con la cuenta desactivada, verifica igual contra un hash de
    // relleno: la respuesta tarda lo mismo y no revela qué correos existen.
    const hashGuardado = cuenta?.activo
      ? cuenta.contrasena_hash
      : await this.obtenerHashDeRelleno();
    const coincide = await verificarContrasena(contrasena, hashGuardado);
    if (!cuenta?.activo || !coincide) {
      throw errorApi(
        HttpStatus.UNAUTHORIZED,
        'CREDENCIALES_INVALIDAS',
        'El correo o la contraseña no coinciden.',
      );
    }

    // Cada ingreso con contraseña abre una familia nueva, con su límite total.
    return this.abrirSesion(
      cuenta.id,
      cuenta,
      randomUUID(),
      new Date(Date.now() + LIMITE_TOTAL_MS),
    );
  }

  async renovar(token: string | undefined): Promise<SesionAbierta> {
    this.exigirConfiguracion();
    if (!token || !FORMATO_TOKEN_RENOVACION.test(token)) {
      throw sesionVencida();
    }
    const tokenHash = hashDeToken(token);
    const { sesiones } = await this.hasura.request<{
      sesiones?: SesionGuardada[];
    }>(SESION_POR_TOKEN, { filtro: { token_hash: { _eq: tokenHash } } });
    if (!Array.isArray(sesiones)) {
      throw formatoInesperado();
    }
    const sesion = sesiones[0];
    if (!sesion) {
      throw sesionVencida();
    }
    // Un token ya usado o cerrado no debería volver a llegar. Si llega, alguien
    // más puede tenerlo: se cierra todo ese ingreso, pero no los demás.
    if (sesion.revocada_en !== null) {
      await this.cerrarFamilia(sesion.familia);
      throw sesionVencida();
    }
    const ahora = Date.now();
    const familiaVenceEn = new Date(sesion.familia_vence_en);
    if (
      new Date(sesion.expira_en).getTime() <= ahora ||
      familiaVenceEn.getTime() <= ahora ||
      !sesion.usuario.activo
    ) {
      throw sesionVencida();
    }

    // Solo cambia la fila si nadie usó el token antes. Si dos peticiones llegan
    // con el mismo token, una sola lo logra; la otra se trata como reutilización.
    const usadas = await this.revocar({ token_hash: { _eq: tokenHash } });
    if (usadas === 0) {
      await this.cerrarFamilia(sesion.familia);
      throw sesionVencida();
    }
    return this.abrirSesion(
      sesion.usuario_id,
      sesion.usuario,
      sesion.familia,
      familiaVenceEn,
    );
  }

  async cerrar(token: string | undefined): Promise<void> {
    if (token && FORMATO_TOKEN_RENOVACION.test(token)) {
      await this.revocar({ token_hash: { _eq: hashDeToken(token) } });
    }
  }

  async perfil(cuentaId: number): Promise<Titular> {
    const { usuarios_by_pk: cuenta } = await this.hasura.request<{
      usuarios_by_pk?: (Titular & { activo: boolean }) | null;
    }>(PERFIL, { id: cuentaId });
    if (cuenta === undefined) {
      throw formatoInesperado();
    }
    // SesionGuard ya rechaza una cuenta desactivada, pero recuerda su respuesta
    // hasta un minuto. Como esta consulta ya trae la fila, el perfil la rechaza
    // en el acto.
    if (!cuenta?.activo) {
      throw errorApi(
        HttpStatus.UNAUTHORIZED,
        'SESION_REQUERIDA',
        'Necesitas ingresar para ver esta información.',
      );
    }
    return { nombre: cuenta.nombre, correo: cuenta.correo };
  }

  private async abrirSesion(
    cuentaId: number,
    titular: Titular,
    familia: string,
    familiaVenceEn: Date,
  ): Promise<SesionAbierta> {
    const token = randomBytes(32).toString('base64url');
    // Vence a los 7 días o en el límite total de su familia, lo que llegue antes.
    const venceEn = new Date(
      Math.min(Date.now() + DURACION_RENOVACION_MS, familiaVenceEn.getTime()),
    );
    await this.hasura.request(CREAR_SESION, {
      sesion: {
        usuario_id: cuentaId,
        token_hash: hashDeToken(token),
        familia,
        familia_vence_en: familiaVenceEn.toISOString(),
        expira_en: venceEn.toISOString(),
      },
    });
    return {
      acceso: await this.tokens.crear(cuentaId),
      titular: { nombre: titular.nombre, correo: titular.correo },
      renovacion: { token, venceEn },
    };
  }

  // Revoca las sesiones del filtro que sigan abiertas y dice cuántas cambió.
  private async revocar(filtro: Record<string, unknown>): Promise<number> {
    const { update_sesiones: resultado } = await this.hasura.request<{
      update_sesiones?: { affected_rows?: unknown } | null;
    }>(REVOCAR_SESIONES, {
      filtro: { ...filtro, revocada_en: { _is_null: true } },
      cambios: { revocada_en: new Date().toISOString() },
    });
    if (typeof resultado?.affected_rows !== 'number') {
      throw formatoInesperado();
    }
    return resultado.affected_rows;
  }

  private async cerrarFamilia(familia: string): Promise<void> {
    const cerradas = await this.revocar({ familia: { _eq: familia } });
    // Sin el token ni la cuenta: solo que pasó.
    this.logger.warn(
      `Llegó un token de renovación ya usado o cerrado. Se cerró su ingreso; renovaciones abiertas que se cerraron: ${cerradas}.`,
    );
  }

  private exigirConfiguracion(): void {
    if (!this.tokens.configurado) {
      throw errorApi(
        HttpStatus.SERVICE_UNAVAILABLE,
        'ACCESO_NO_CONFIGURADO',
        'El ingreso no está configurado: falta JWT_SECRET en apps/core-service/.env.',
      );
    }
  }

  // Un hash de una contraseña al azar que nadie conoce. Se crea al primer uso y
  // no se guarda en ninguna parte.
  private obtenerHashDeRelleno(): Promise<string> {
    this.hashDeRelleno ??= crearHashContrasena(
      randomBytes(32).toString('base64url'),
    );
    return this.hashDeRelleno;
  }
}

function hashDeToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function sesionVencida() {
  return errorApi(
    HttpStatus.UNAUTHORIZED,
    'SESION_VENCIDA',
    'Tu sesión terminó. Vuelve a ingresar.',
  );
}
