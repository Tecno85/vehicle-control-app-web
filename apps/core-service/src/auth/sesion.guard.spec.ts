import { HttpException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { HasuraError } from '../hasura/hasura.errors.js';
import type { CuentasActivasService } from './cuentas-activas.service.js';
import { Publico } from './publico.decorator.js';
import { SesionGuard, type SolicitudConSesion } from './sesion.guard.js';
import { TokenAccesoService } from './token-acceso.service.js';

const SECRETO = 'secreto-solo-para-pruebas-unitarias-del-guard';
// La cuenta 8 está desactivada; las demás, activas.
const CUENTA_DESACTIVADA = 8;

class RutasDePrueba {
  @Publico()
  publica() {}

  protegida() {}
}

function contexto(
  ruta: 'publica' | 'protegida',
  solicitud: Partial<SolicitudConSesion>,
): ExecutionContext {
  return {
    getHandler: () => RutasDePrueba.prototype[ruta],
    getClass: () => RutasDePrueba,
    switchToHttp: () => ({ getRequest: () => solicitud }),
  } as unknown as ExecutionContext;
}

function conToken(token: string): Partial<SolicitudConSesion> {
  return { headers: { authorization: `Bearer ${token}` } };
}

async function rechazo(promesa: Promise<boolean>) {
  const error: unknown = await promesa.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(HttpException);
  return {
    estado: (error as HttpException).getStatus(),
    cuerpo: (error as HttpException).getResponse(),
  };
}

describe('SesionGuard', () => {
  const jwt = new JwtService();
  const tokens = new TokenAccesoService(jwt, { jwtSecret: SECRETO });
  const estaActiva = vi.fn((cuentaId: number) => Promise.resolve(cuentaId !== CUENTA_DESACTIVADA));
  const cuentas = { estaActiva } as unknown as CuentasActivasService;
  const guard = new SesionGuard(new Reflector(), tokens, cuentas);
  const ahora = () => Math.floor(Date.now() / 1000);

  beforeEach(() => {
    estaActiva.mockClear();
  });

  it('deja pasar una ruta pública sin token y sin consultar la cuenta', async () => {
    await expect(guard.canActivate(contexto('publica', { headers: {} }))).resolves.toBe(true);
    expect(estaActiva).not.toHaveBeenCalled();
  });

  it('acepta un token válido y deja el id de la cuenta en la solicitud', async () => {
    const { token } = await tokens.crear(7);
    const solicitud = conToken(token);

    await expect(guard.canActivate(contexto('protegida', solicitud))).resolves.toBe(true);
    expect(solicitud.cuentaId).toBe(7);
    expect(estaActiva).toHaveBeenCalledWith(7);
  });

  it('responde 401 SESION_REQUERIDA a un token válido de una cuenta desactivada', async () => {
    const { token } = await tokens.crear(CUENTA_DESACTIVADA);
    const solicitud = conToken(token);

    await expect(
      rechazo(guard.canActivate(contexto('protegida', solicitud))),
    ).resolves.toEqual({
      estado: 401,
      cuerpo: {
        codigo: 'SESION_REQUERIDA',
        mensaje: 'Necesitas ingresar para ver esta información.',
      },
    });
    expect(solicitud.cuentaId).toBeUndefined();
  });

  it('no deja pasar a nadie si no puede comprobar la cuenta', async () => {
    const { token } = await tokens.crear(7);
    estaActiva.mockRejectedValueOnce(new HasuraError('TIMEOUT', 'Hasura no respondió en 5000 ms.'));

    await expect(
      guard.canActivate(contexto('protegida', conToken(token))),
    ).rejects.toBeInstanceOf(HasuraError);
  });

  it('el token solo lleva sub, iat y exp, y vence a los 15 minutos', async () => {
    const { token, venceEn } = await tokens.crear(7);
    const datos = jwt.decode<Record<string, unknown>>(token);

    expect(Object.keys(datos).sort()).toEqual(['exp', 'iat', 'sub']);
    expect(datos.sub).toBe('7');
    expect(Number(datos.exp) - Number(datos.iat)).toBe(15 * 60);
    expect(venceEn.getTime()).toBe(Number(datos.exp) * 1000);
  });

  it.each([
    ['sin encabezado', {}],
    ['con otro esquema', { authorization: 'Basic abc' }],
    ['con «Bearer» y nada más', { authorization: 'Bearer ' }],
  ])('responde 401 SESION_REQUERIDA %s', async (_caso, headers) => {
    await expect(
      rechazo(guard.canActivate(contexto('protegida', { headers }))),
    ).resolves.toEqual({
      estado: 401,
      cuerpo: {
        codigo: 'SESION_REQUERIDA',
        mensaje: 'Necesitas ingresar para ver esta información.',
      },
    });
  });

  it('rechaza un token alterado, vencido, de otra firma, de otro algoritmo o con un id inválido', async () => {
    const { token } = await tokens.crear(7);
    const [cabecera, datos, firma] = token.split('.');
    const otraFirma = `${firma.slice(0, -2)}${firma.endsWith('AA') ? 'BB' : 'AA'}`;
    const invalidos = [
      `${cabecera}.${datos}.${otraFirma}`,
      jwt.sign({ sub: '7', iat: ahora() - 1000, exp: ahora() - 100 }, { secret: SECRETO }),
      jwt.sign({ sub: '7' }, { secret: 'otro-secreto-de-pruebas-con-32-caracteres', expiresIn: 60 }),
      jwt.sign({ sub: '7' }, { secret: SECRETO, algorithm: 'HS512', expiresIn: 60 }),
      jwt.sign({ sub: 'abc' }, { secret: SECRETO, expiresIn: 60 }),
      jwt.sign({ sub: 7 }, { secret: SECRETO, expiresIn: 60 }),
      jwt.sign({ sub: '2147483648' }, { secret: SECRETO, expiresIn: 60 }),
      `${Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')}.${datos}.`,
    ];

    for (const invalido of invalidos) {
      const { estado } = await rechazo(
        guard.canActivate(contexto('protegida', conToken(invalido))),
      );
      expect(estado).toBe(401);
    }
    // Un token inválido se rechaza sin consultar Hasura.
    expect(estaActiva).not.toHaveBeenCalled();
  });

  it('sin JWT_SECRET ningún token sirve', async () => {
    const { token } = await tokens.crear(7);
    const sinConfig = new SesionGuard(
      new Reflector(),
      new TokenAccesoService(jwt, null),
      cuentas,
    );

    const { estado } = await rechazo(
      sinConfig.canActivate(contexto('protegida', conToken(token))),
    );
    expect(estado).toBe(401);
  });
});
