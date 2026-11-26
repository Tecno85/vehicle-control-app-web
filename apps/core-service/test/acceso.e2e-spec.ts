import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { createHash } from 'node:crypto';
import request, { type Response, type Test as Peticion } from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { crearHashContrasena } from './../src/auth/contrasenas.js';
import { configureApp, WEB_APP_ORIGIN } from './../src/configure-app.js';
import { HasuraService } from './../src/hasura/hasura.service.js';
import { HasuraSimulado, type UsuarioSimulado, type VehiculoSimulado } from './hasura-simulado.js';

// Datos ficticios de prueba: las contraseñas solo existen en este archivo y sus
// hashes se calculan al empezar, así que no quedan hashes en el repositorio.
const SECRETO = 'secreto-solo-para-pruebas-e2e-del-acceso-0123';
const CONTRASENAS = {
  titular: 'contrasena-e2e-de-la-titular',
  segunda: 'contrasena-e2e-de-la-segunda',
  inactiva: 'contrasena-e2e-de-la-inactiva',
};
const DIA = 24 * 60 * 60 * 1000;

let hashes: Record<keyof typeof CONTRASENAS, string>;
beforeAll(async () => {
  hashes = {
    titular: await crearHashContrasena(CONTRASENAS.titular),
    segunda: await crearHashContrasena(CONTRASENAS.segunda),
    inactiva: await crearHashContrasena(CONTRASENAS.inactiva),
  };
});

function usuarios(): UsuarioSimulado[] {
  return [
    { id: 1, nombre: 'Titular de prueba', correo: 'titular@ejemplo.test', activo: true, contrasena_hash: hashes.titular },
    { id: 2, nombre: 'Segunda titular de prueba', correo: 'segunda.prueba@example.com', activo: true, contrasena_hash: hashes.segunda },
    { id: 3, nombre: 'Cuenta desactivada', correo: 'inactiva@example.com', activo: false, contrasena_hash: hashes.inactiva },
  ];
}

function vehiculos(): VehiculoSimulado[] {
  const base = { marca: 'Vehículo de ejemplo', activo: true };
  return [
    { ...base, id: 1, usuario_id: 1, placa: 'XYZ789', modelo: 'Taxi', tipo: 'TAXI', habilitado_indrive: false, conductor: 'Conductor de ejemplo', cuota_diaria: 60000 },
    { ...base, id: 2, usuario_id: 1, placa: 'ABC123', modelo: 'Particular', tipo: 'PARTICULAR', habilitado_indrive: false, conductor: null, cuota_diaria: null },
    { ...base, id: 3, usuario_id: 2, placa: 'KLM456', modelo: 'Particular', tipo: 'PARTICULAR', habilitado_indrive: true, conductor: null, cuota_diaria: null },
  ];
}

describe('acceso (e2e)', () => {
  let app: INestApplication<App>;
  let hasura: HasuraSimulado;
  let respuestas: Response[];

  beforeEach(async () => {
    vi.stubEnv('JWT_SECRET', SECRETO);
    vi.stubEnv('HASURA_GRAPHQL_URL', '');
    vi.stubEnv('HASURA_ADMIN_SECRET', '');
    hasura = new HasuraSimulado(usuarios(), vehiculos());
    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(HasuraService)
      .useValue(hasura)
      .compile();
    app = modulo.createNestApplication({ logger: false });
    configureApp(app);
    await app.init();
    respuestas = [];
  });

  afterEach(async () => {
    // Ninguna respuesta lleva hashes, contraseñas ni tokens de renovación en el cuerpo.
    const tokensRenovacion = respuestas.map(tokenDeCookie).filter(Boolean);
    for (const { text } of respuestas) {
      for (const prohibido of ['contrasena_hash', '$argon2id$', ...Object.values(CONTRASENAS), ...tokensRenovacion]) {
        expect(text ?? '').not.toContain(prohibido);
      }
    }
    vi.useRealTimers();
    await app.close();
    vi.unstubAllEnvs();
  });

  // Las peticiones llevan los encabezados que pone el navegador desde la web-app.
  const desdeLaWeb = (peticion: Peticion) =>
    peticion.set('Origin', WEB_APP_ORIGIN).set('Sec-Fetch-Site', 'same-site');
  const registrar = (respuesta: Response) => {
    respuestas.push(respuesta);
    return respuesta;
  };
  const servidor = () => request(app.getHttpServer());
  const ingresar = (correo: string, contrasena: string) =>
    desdeLaWeb(servidor().post('/api/sesion')).send({ correo, contrasena }).then(registrar);
  const renovar = (token: string) =>
    desdeLaWeb(servidor().post('/api/sesion/renovar'))
      .set('Cookie', `sesion_renovacion=${token}`)
      .then(registrar);
  const cerrar = (token: string) =>
    desdeLaWeb(servidor().delete('/api/sesion'))
      .set('Cookie', `sesion_renovacion=${token}`)
      .then(registrar);
  const consultar = (ruta: string, tokenAcceso?: string) => {
    const peticion = desdeLaWeb(servidor().get(ruta));
    return (tokenAcceso ? peticion.set('Authorization', `Bearer ${tokenAcceso}`) : peticion).then(registrar);
  };
  const ingresarComo = async (cuenta: 'titular' | 'segunda') => {
    const correo = cuenta === 'titular' ? 'titular@ejemplo.test' : 'segunda.prueba@example.com';
    const respuesta = await ingresar(correo, CONTRASENAS[cuenta]);
    expect(respuesta.status).toBe(200);
    return { acceso: respuesta.body.token_acceso as string, renovacion: tokenDeCookie(respuesta) };
  };

  it('el ingreso correcto entrega el token de acceso y la cookie de renovación con sus protecciones', async () => {
    const respuesta = await ingresar('  TITULAR@ejemplo.test ', CONTRASENAS.titular);

    expect(respuesta.status).toBe(200);
    expect(respuesta.headers['access-control-allow-origin']).toBe(WEB_APP_ORIGIN);
    expect(respuesta.headers['access-control-allow-credentials']).toBe('true');
    expect(Object.keys(respuesta.body).sort()).toEqual(['titular', 'token_acceso', 'vence_en']);
    expect(respuesta.body.titular).toEqual({ nombre: 'Titular de prueba', correo: 'titular@ejemplo.test' });
    expect(Date.parse(respuesta.body.vence_en) - Date.now()).toBeGreaterThan(14 * 60 * 1000);

    const cookie = cookieRenovacion(respuesta);
    expect(cookie).toMatch(/; Path=\/api\/sesion(;|$)/);
    expect(cookie).toMatch(/; HttpOnly(;|$)/);
    expect(cookie).toMatch(/; Secure(;|$)/);
    expect(cookie).toMatch(/; SameSite=Strict(;|$)/);
    const expira = Date.parse(/Expires=([^;]+)/.exec(cookie)![1]);
    expect(expira - Date.now()).toBeGreaterThan(6.9 * DIA);

    // La base guarda el SHA-256 del token, nunca el token.
    const token = tokenDeCookie(respuesta);
    expect(hasura.sesiones).toHaveLength(1);
    expect(hasura.sesiones[0].token_hash).toBe(createHash('sha256').update(token).digest('hex'));
    expect(JSON.stringify(hasura.sesiones)).not.toContain(token);
  });

  it('responde lo mismo a un correo inexistente, a una contraseña equivocada y a una cuenta desactivada', async () => {
    const casos = [
      await ingresar('nadie@example.com', CONTRASENAS.titular),
      await ingresar('titular@ejemplo.test', 'otra-contrasena-equivocada'),
      await ingresar('inactiva@example.com', CONTRASENAS.inactiva),
    ];

    for (const respuesta of casos) {
      expect(respuesta.status).toBe(401);
      expect(respuesta.body).toEqual({
        codigo: 'CREDENCIALES_INVALIDAS',
        mensaje: 'El correo o la contraseña no coinciden.',
      });
      expect(respuesta.headers['set-cookie']).toBeUndefined();
    }
    expect(hasura.sesiones).toHaveLength(0);
  });

  it('rechaza datos incompletos o mal escritos sin repetir lo que se envió', async () => {
    const sinContrasena = await desdeLaWeb(servidor().post('/api/sesion')).send({ correo: 'titular@ejemplo.test' }).then(registrar);
    expect(sinContrasena.status).toBe(400);
    expect(sinContrasena.body).toEqual({ codigo: 'DATOS_INVALIDOS', mensaje: 'Escribe tu correo y tu contraseña.' });

    // Node incluye en algunos de estos errores los primeros caracteres del texto.
    for (const cuerpo of [
      `{"correo":"titular@ejemplo.test","contrasena":"${CONTRASENAS.titular}"`,
      `${CONTRASENAS.titular}&correo=titular@ejemplo.test`,
    ]) {
      const jsonRoto = await desdeLaWeb(servidor().post('/api/sesion'))
        .set('Content-Type', 'application/json')
        .send(cuerpo)
        .then(registrar);
      expect(jsonRoto.status).toBe(400);
      expect(jsonRoto.body).toEqual({
        codigo: 'DATOS_INVALIDOS',
        mensaje: 'Los datos enviados no tienen el formato esperado.',
      });
      expect(jsonRoto.text).not.toContain(CONTRASENAS.titular.slice(0, 8));
    }
  });

  it('el sexto intento de ingreso en un minuto responde 429, aunque la contraseña sea correcta', async () => {
    for (let intento = 1; intento <= 5; intento++) {
      expect((await ingresar('titular@ejemplo.test', 'otra-contrasena-equivocada')).status).toBe(401);
    }

    const sexto = await ingresar('titular@ejemplo.test', CONTRASENAS.titular);
    expect(sexto.status).toBe(429);
    expect(sexto.body).toEqual({
      codigo: 'DEMASIADOS_INTENTOS',
      mensaje: 'Hiciste demasiados intentos. Espera un minuto y vuelve a intentarlo.',
    });
  });

  it('el perfil responde con un token válido y 401 sin token, con uno alterado o con uno vencido', async () => {
    const { acceso } = await ingresarComo('titular');
    const ahora = Math.floor(Date.now() / 1000);
    const vencido = new JwtService().sign({ sub: '1', iat: ahora - 1000, exp: ahora - 100 }, { secret: SECRETO });
    const alterado = `${acceso.slice(0, -2)}${acceso.endsWith('AA') ? 'BB' : 'AA'}`;

    const conToken = await consultar('/api/perfil', acceso);
    expect(conToken.status).toBe(200);
    expect(conToken.body).toEqual({ nombre: 'Titular de prueba', correo: 'titular@ejemplo.test' });

    for (const token of [undefined, alterado, vencido]) {
      const respuesta = await consultar('/api/perfil', token);
      expect(respuesta.status).toBe(401);
      expect(respuesta.body).toEqual({
        codigo: 'SESION_REQUERIDA',
        mensaje: 'Necesitas ingresar para ver esta información.',
      });
    }
  });

  it('cada cuenta ve sus vehículos y recibe 404 con los de otra cuenta', async () => {
    const titular = await ingresarComo('titular');
    const segunda = await ingresarComo('segunda');

    const propio = await consultar('/api/vehiculos/1', titular.acceso);
    expect(propio.status).toBe(200);
    expect(propio.body).toMatchObject({ id: 1, placa: 'XYZ789', tipo: 'TAXI' });
    expect(propio.body).not.toHaveProperty('usuario_id');

    const ajeno = await consultar('/api/vehiculos/3', titular.acceso);
    expect(ajeno.status).toBe(404);
    expect(ajeno.body).toEqual({ codigo: 'VEHICULO_NO_ENCONTRADO', mensaje: 'No encontramos ese vehículo en tu cuenta.' });
    // Igual que un vehículo que no existe.
    expect((await consultar('/api/vehiculos/999', titular.acceso)).body).toEqual(ajeno.body);

    expect((await consultar('/api/vehiculos/3', segunda.acceso)).body).toMatchObject({ placa: 'KLM456' });
    expect((await consultar('/api/vehiculos/1', segunda.acceso)).status).toBe(404);

    const invalido = await consultar('/api/vehiculos/abc', titular.acceso);
    expect(invalido.status).toBe(400);
    expect(invalido.body).toMatchObject({ codigo: 'DATOS_INVALIDOS' });
    expect((await consultar('/api/vehiculos/1')).status).toBe(401);

    // La flota trae solo los vehículos de cada cuenta.
    expect((await consultar('/api/vehiculos', titular.acceso)).body.vehiculos.map((v: { placa: string }) => v.placa)).toEqual(['ABC123', 'XYZ789']);
    expect((await consultar('/api/vehiculos', segunda.acceso)).body.vehiculos.map((v: { placa: string }) => v.placa)).toEqual(['KLM456']);
    expect((await consultar('/api/vehiculos')).status).toBe(401);
  });

  it('una cuenta desactivada deja de recibir datos en un minuto, aunque su token siga vigente', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const inicio = Date.now();
    const { acceso } = await ingresarComo('titular');
    const sesionRequerida = { codigo: 'SESION_REQUERIDA', mensaje: 'Necesitas ingresar para ver esta información.' };
    expect((await consultar('/api/vehiculos/1', acceso)).status).toBe(200);

    hasura.usuarios[0].activo = false;
    // El perfil lee la cuenta en cada consulta: la rechaza en el acto.
    expect((await consultar('/api/perfil', acceso)).body).toEqual(sesionRequerida);
    // El guard recuerda la cuenta hasta un minuto.
    vi.setSystemTime(inicio + 59_000);
    expect((await consultar('/api/vehiculos/1', acceso)).status).toBe(200);
    vi.setSystemTime(inicio + 61_000);
    const vehiculo = await consultar('/api/vehiculos/1', acceso);
    expect(vehiculo.status).toBe(401);
    expect(vehiculo.body).toEqual(sesionRequerida);

    // Un token firmado para una cuenta que ya estaba desactivada no sirve desde el principio.
    const deLaInactiva = new JwtService().sign({ sub: '3' }, { secret: SECRETO, expiresIn: 60 });
    expect((await consultar('/api/vehiculos/1', deLaInactiva)).status).toBe(401);
    expect((await consultar('/api/vehiculos', deLaInactiva)).status).toBe(401);
  });

  it('la renovación entrega otra cookie y otro token de acceso, y el token anterior queda usado', async () => {
    const { renovacion } = await ingresarComo('titular');

    const respuesta = await renovar(renovacion);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.titular).toEqual({ nombre: 'Titular de prueba', correo: 'titular@ejemplo.test' });
    const nueva = tokenDeCookie(respuesta);
    expect(nueva).toBeTruthy();
    expect(nueva).not.toBe(renovacion);
    expect((await consultar('/api/perfil', respuesta.body.token_acceso as string)).status).toBe(200);
    expect(hasura.sesiones.map((s) => s.revocada_en === null)).toEqual([false, true]);
    expect(new Set(hasura.sesiones.map((s) => s.familia)).size).toBe(1);
  });

  it('una renovación reutilizada responde 401 y cierra su ingreso, pero no otro ingreso de la misma cuenta', async () => {
    const ingresoA = await ingresarComo('titular');
    const ingresoB = await ingresarComo('titular');
    const a2 = tokenDeCookie(await renovar(ingresoA.renovacion));

    const reutilizada = await renovar(ingresoA.renovacion);
    expect(reutilizada.status).toBe(401);
    expect(reutilizada.body).toEqual({ codigo: 'SESION_VENCIDA', mensaje: 'Tu sesión terminó. Vuelve a ingresar.' });
    expect(cookieRenovacion(reutilizada)).toMatch(/^sesion_renovacion=;.*Expires=Thu, 01 Jan 1970/);

    expect((await renovar(a2)).status).toBe(401);
    expect((await renovar(ingresoB.renovacion)).status).toBe(200);
  });

  it('después del límite total de 30 días, la renovación responde 401 aunque se haya usado hace poco', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const inicio = Date.now();
    let { renovacion } = await ingresarComo('titular');

    for (const dia of [6, 12, 18, 24, 29]) {
      vi.setSystemTime(inicio + dia * DIA);
      const respuesta = await renovar(renovacion);
      expect(respuesta.status).toBe(200);
      renovacion = tokenDeCookie(respuesta);
    }
    // La última renovación vence en el límite total, no a los 7 días.
    expect(Date.parse(hasura.sesiones.at(-1)!.expira_en)).toBe(Date.parse(hasura.sesiones[0].familia_vence_en));

    vi.setSystemTime(inicio + 30 * DIA + 60_000);
    expect((await renovar(renovacion)).status).toBe(401);
  });

  it('el cierre revoca la renovación y borra la cookie; después, renovar responde 401', async () => {
    const { renovacion } = await ingresarComo('titular');

    const cierre = await cerrar(renovacion);
    expect(cierre.status).toBe(204);
    expect(cookieRenovacion(cierre)).toMatch(/^sesion_renovacion=;.*Path=\/api\/sesion/);
    expect(hasura.sesiones[0].revocada_en).not.toBeNull();

    expect((await renovar(renovacion)).status).toBe(401);
  });

  it('el ingreso, la renovación y el cierre desde otro sitio responden 403, sin tocar la sesión', async () => {
    const { renovacion } = await ingresarComo('titular');
    const otrosSitios = [
      { 'Sec-Fetch-Site': 'cross-site', Origin: 'https://otro-sitio.example' },
      // Mismo sitio (localhost), pero no es la web-app.
      { 'Sec-Fetch-Site': 'same-site', Origin: 'http://localhost:4000' },
    ];

    for (const encabezados of otrosSitios) {
      const peticiones = [
        servidor().post('/api/sesion').send({ correo: 'titular@ejemplo.test', contrasena: CONTRASENAS.titular }),
        servidor().post('/api/sesion/renovar').set('Cookie', `sesion_renovacion=${renovacion}`),
        servidor().delete('/api/sesion').set('Cookie', `sesion_renovacion=${renovacion}`),
      ];
      for (const peticion of peticiones) {
        const respuesta = await peticion.set(encabezados).then(registrar);
        expect(respuesta.status).toBe(403);
        expect(respuesta.body).toEqual({
          codigo: 'ORIGEN_NO_PERMITIDO',
          mensaje: 'Esta acción solo se puede hacer desde la web-app.',
        });
      }
    }
    expect(hasura.sesiones).toHaveLength(1);
    expect(hasura.sesiones[0].revocada_en).toBeNull();
    expect((await renovar(renovacion)).status).toBe(200);
  });
});

function cookieRenovacion(respuesta: Response): string {
  const cookies = (respuesta.headers['set-cookie'] as unknown as string[] | undefined) ?? [];
  return cookies.find((c) => c.startsWith('sesion_renovacion=')) ?? '';
}

function tokenDeCookie(respuesta: Response): string {
  return /^sesion_renovacion=([^;]*)/.exec(cookieRenovacion(respuesta))?.[1] ?? '';
}
