import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'node:crypto';
import type { HasuraService } from '../hasura/hasura.service.js';
import { crearHashContrasena } from './contrasenas.js';
import {
  CREAR_SESION,
  CUENTA_POR_CORREO,
  PERFIL,
  REVOCAR_SESIONES,
  SESION_POR_TOKEN,
  SesionService,
} from './sesion.service.js';
import { TokenAccesoService } from './token-acceso.service.js';

const SECRETO = 'secreto-solo-para-pruebas-unitarias-de-sesion';
const CONTRASENA = 'contrasena-de-prueba-unitaria';
const DIA = 24 * 60 * 60 * 1000;
const TOKEN = 'A'.repeat(43);
const HASH_TOKEN = createHash('sha256').update(TOKEN).digest('hex');

let hashContrasena: string;
beforeAll(async () => {
  hashContrasena = await crearHashContrasena(CONTRASENA);
});

function cuenta(cambios: Record<string, unknown> = {}) {
  return {
    id: 7,
    nombre: 'Titular de prueba',
    correo: 'titular@ejemplo.test',
    activo: true,
    contrasena_hash: hashContrasena,
    ...cambios,
  };
}

function sesionGuardada(cambios: Record<string, unknown> = {}) {
  return {
    usuario_id: 7,
    familia: '11111111-1111-4111-8111-111111111111',
    familia_vence_en: new Date(Date.now() + 20 * DIA).toISOString(),
    expira_en: new Date(Date.now() + 3 * DIA).toISOString(),
    revocada_en: null,
    usuario: { nombre: 'Titular de prueba', correo: 'titular@ejemplo.test', activo: true },
    ...cambios,
  };
}

async function rechazo(promesa: Promise<unknown>) {
  const error: unknown = await promesa.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(HttpException);
  return {
    estado: (error as HttpException).getStatus(),
    codigo: ((error as HttpException).getResponse() as { codigo: string }).codigo,
  };
}

describe('SesionService', () => {
  const request = vi.fn();
  const jwt = new JwtService();
  const tokens = new TokenAccesoService(jwt, { jwtSecret: SECRETO });
  let service: SesionService;

  // Responde según la consulta, como lo haría Hasura.
  function hasura(respuestas: Partial<Record<string, unknown>>) {
    request.mockImplementation((consulta: string) => {
      if (!(consulta in respuestas)) {
        throw new Error('Consulta no esperada en la prueba.');
      }
      return Promise.resolve(respuestas[consulta]);
    });
  }
  const llamadas = (consulta: string) =>
    request.mock.calls.filter(([q]) => q === consulta).map(([, v]) => v as Record<string, any>);

  beforeEach(() => {
    request.mockReset();
    service = new SesionService({ request } as unknown as HasuraService, tokens);
  });

  describe('ingresar', () => {
    it('con la contraseña correcta guarda el hash del token, nunca el token', async () => {
      hasura({
        [CUENTA_POR_CORREO]: { usuarios: [cuenta()] },
        [CREAR_SESION]: { insert_sesiones_one: { id: 1 } },
      });

      const sesion = await service.ingresar('titular@ejemplo.test', CONTRASENA);

      expect(llamadas(CUENTA_POR_CORREO)).toEqual([{ correo: 'titular@ejemplo.test' }]);
      const [{ sesion: fila }] = llamadas(CREAR_SESION);
      expect(fila.usuario_id).toBe(7);
      expect(fila.token_hash).toBe(createHash('sha256').update(sesion.renovacion.token).digest('hex'));
      expect(JSON.stringify(fila)).not.toContain(sesion.renovacion.token);
      expect(fila.familia).toMatch(/^[0-9a-f-]{36}$/);
      expect(Date.parse(fila.familia_vence_en) - Date.now()).toBeGreaterThan(29.9 * DIA);
      expect(Date.parse(fila.expira_en) - Date.now()).toBeGreaterThan(6.9 * DIA);
      expect(Date.parse(fila.expira_en)).toBeLessThan(Date.now() + 7.1 * DIA);
      expect(sesion.titular).toEqual({ nombre: 'Titular de prueba', correo: 'titular@ejemplo.test' });
      expect(await tokens.verificar(sesion.acceso.token)).toBe(7);
    });

    it.each([
      ['la contraseña es otra', [cuenta()], 'otra-contrasena-de-prueba'],
      ['el correo no existe', [], CONTRASENA],
      ['la cuenta está desactivada', [cuenta({ activo: false })], CONTRASENA],
    ])('responde 401 CREDENCIALES_INVALIDAS si %s, sin abrir sesión', async (_caso, usuarios, contrasena) => {
      hasura({ [CUENTA_POR_CORREO]: { usuarios } });

      await expect(rechazo(service.ingresar('titular@ejemplo.test', contrasena))).resolves.toEqual({
        estado: 401,
        codigo: 'CREDENCIALES_INVALIDAS',
      });
      expect(llamadas(CREAR_SESION)).toHaveLength(0);
    });

    it('responde 503 ACCESO_NO_CONFIGURADO sin JWT_SECRET, sin consultar Hasura', async () => {
      const sinConfig = new SesionService(
        { request } as unknown as HasuraService,
        new TokenAccesoService(jwt, null),
      );

      await expect(rechazo(sinConfig.ingresar('titular@ejemplo.test', CONTRASENA))).resolves.toEqual({
        estado: 503,
        codigo: 'ACCESO_NO_CONFIGURADO',
      });
      expect(request).not.toHaveBeenCalled();
    });
  });

  describe('renovar', () => {
    it('marca el token como usado solo si sigue abierto y crea el siguiente en la misma familia', async () => {
      const guardada = sesionGuardada();
      hasura({
        [SESION_POR_TOKEN]: { sesiones: [guardada] },
        [REVOCAR_SESIONES]: { update_sesiones: { affected_rows: 1 } },
        [CREAR_SESION]: { insert_sesiones_one: { id: 2 } },
      });

      const sesion = await service.renovar(TOKEN);

      expect(llamadas(SESION_POR_TOKEN)).toEqual([{ filtro: { token_hash: { _eq: HASH_TOKEN } } }]);
      const [revocacion] = llamadas(REVOCAR_SESIONES);
      expect(revocacion.filtro).toEqual({ token_hash: { _eq: HASH_TOKEN }, revocada_en: { _is_null: true } });
      const [{ sesion: fila }] = llamadas(CREAR_SESION);
      expect(fila.familia).toBe(guardada.familia);
      expect(fila.familia_vence_en).toBe(guardada.familia_vence_en);
      expect(sesion.renovacion.token).not.toBe(TOKEN);
      expect(sesion.titular).toEqual({ nombre: 'Titular de prueba', correo: 'titular@ejemplo.test' });
    });

    it('cerca del límite total, la nueva renovación vence en el límite y no a los 7 días', async () => {
      const limite = new Date(Date.now() + 2 * DIA).toISOString();
      hasura({
        [SESION_POR_TOKEN]: { sesiones: [sesionGuardada({ familia_vence_en: limite, expira_en: limite })] },
        [REVOCAR_SESIONES]: { update_sesiones: { affected_rows: 1 } },
        [CREAR_SESION]: { insert_sesiones_one: { id: 2 } },
      });

      const sesion = await service.renovar(TOKEN);

      expect(llamadas(CREAR_SESION)[0].sesion.expira_en).toBe(limite);
      expect(sesion.renovacion.venceEn.toISOString()).toBe(limite);
    });

    it.each([
      ['ya estaba revocado', { revocada_en: new Date().toISOString() }, 0],
      ['otra petición lo usó primero', {}, 1],
    ])('si el token %s, cierra toda su familia y responde 401', async (_caso, cambios, revocacionesPrevias) => {
      const guardada = sesionGuardada(cambios);
      const afectadas = [0, 2];
      if (revocacionesPrevias === 0) afectadas.shift();
      request.mockImplementation((consulta: string) => {
        if (consulta === SESION_POR_TOKEN) return Promise.resolve({ sesiones: [guardada] });
        if (consulta === REVOCAR_SESIONES) {
          return Promise.resolve({ update_sesiones: { affected_rows: afectadas.shift() } });
        }
        throw new Error('Consulta no esperada en la prueba.');
      });

      await expect(rechazo(service.renovar(TOKEN))).resolves.toEqual({ estado: 401, codigo: 'SESION_VENCIDA' });
      const revocaciones = llamadas(REVOCAR_SESIONES);
      expect(revocaciones.at(-1)?.filtro).toEqual({
        familia: { _eq: guardada.familia },
        revocada_en: { _is_null: true },
      });
      expect(llamadas(CREAR_SESION)).toHaveLength(0);
    });

    it.each([
      ['venció', { expira_en: new Date(Date.now() - 1000).toISOString() }],
      ['pasó el límite total', { familia_vence_en: new Date(Date.now() - 1000).toISOString() }],
      ['la cuenta está desactivada', { usuario: { nombre: 'Titular de prueba', correo: 'titular@ejemplo.test', activo: false } }],
    ])('responde 401 sin tocar la base si la renovación %s', async (_caso, cambios) => {
      hasura({ [SESION_POR_TOKEN]: { sesiones: [sesionGuardada(cambios)] } });

      await expect(rechazo(service.renovar(TOKEN))).resolves.toEqual({ estado: 401, codigo: 'SESION_VENCIDA' });
      expect(request).toHaveBeenCalledTimes(1);
    });

    it.each([
      ['no hay cookie', undefined],
      ['el token tiene otro formato', 'corto'],
    ])('responde 401 sin consultar Hasura si %s', async (_caso, token) => {
      await expect(rechazo(service.renovar(token))).resolves.toEqual({ estado: 401, codigo: 'SESION_VENCIDA' });
      expect(request).not.toHaveBeenCalled();
    });

    it('responde 401 si el token no existe', async () => {
      hasura({ [SESION_POR_TOKEN]: { sesiones: [] } });

      await expect(rechazo(service.renovar(TOKEN))).resolves.toEqual({ estado: 401, codigo: 'SESION_VENCIDA' });
    });
  });

  describe('cerrar y perfil', () => {
    it('el cierre revoca solo esa renovación', async () => {
      hasura({ [REVOCAR_SESIONES]: { update_sesiones: { affected_rows: 1 } } });

      await service.cerrar(TOKEN);

      expect(llamadas(REVOCAR_SESIONES)[0].filtro).toEqual({
        token_hash: { _eq: HASH_TOKEN },
        revocada_en: { _is_null: true },
      });
    });

    it('el cierre sin cookie no consulta Hasura', async () => {
      await service.cerrar(undefined);
      expect(request).not.toHaveBeenCalled();
    });

    it('el perfil devuelve nombre y correo, y 401 si la cuenta ya no está activa', async () => {
      hasura({ [PERFIL]: { usuarios_by_pk: { nombre: 'Titular de prueba', correo: 'titular@ejemplo.test', activo: true } } });
      await expect(service.perfil(7)).resolves.toEqual({ nombre: 'Titular de prueba', correo: 'titular@ejemplo.test' });
      expect(llamadas(PERFIL)).toEqual([{ id: 7 }]);

      hasura({ [PERFIL]: { usuarios_by_pk: { nombre: 'x', correo: 'x', activo: false } } });
      await expect(rechazo(service.perfil(7))).resolves.toEqual({ estado: 401, codigo: 'SESION_REQUERIDA' });
    });
  });
});
