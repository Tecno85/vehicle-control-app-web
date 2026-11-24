import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp, WEB_APP_ORIGIN } from './../src/configure-app.js';

const SECRETO = 'secreto-solo-para-pruebas-e2e-de-core-service';

describe('core-service (e2e)', () => {
  let app: INestApplication<App> | undefined;

  // Sin Hasura, aunque sus variables existan en la terminal: estas pruebas no
  // dependen del .env ni consultan Hasura Cloud.
  async function crearApp(jwtSecret: string): Promise<INestApplication<App>> {
    vi.stubEnv('HASURA_GRAPHQL_URL', '');
    vi.stubEnv('HASURA_ADMIN_SECRET', '');
    vi.stubEnv('JWT_SECRET', jwtSecret);
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication({ logger: false });
    configureApp(app);
    await app.init();
    return app;
  }

  afterEach(async () => {
    await app?.close();
    app = undefined;
    vi.unstubAllEnvs();
  });

  it('GET /api/health responde el estado y permite el origen de la web-app', async () => {
    return request((await crearApp(SECRETO)).getHttpServer())
      .get('/api/health')
      .set('Origin', WEB_APP_ORIGIN)
      .expect(200)
      .expect('Access-Control-Allow-Origin', WEB_APP_ORIGIN)
      .expect({ status: 'ok', service: 'core-service' });
  });

  it('GET /api/health/hasura exige sesión', async () => {
    return request((await crearApp(SECRETO)).getHttpServer())
      .get('/api/health/hasura')
      .set('Origin', WEB_APP_ORIGIN)
      .expect(401)
      .expect('Access-Control-Allow-Origin', WEB_APP_ORIGIN)
      .expect({
        codigo: 'SESION_REQUERIDA',
        mensaje: 'Necesitas ingresar para ver esta información.',
      });
  });

  it('GET /api/health/hasura con sesión responde 503 si Hasura no está configurado', async () => {
    const token = new JwtService().sign(
      { sub: '1' },
      { secret: SECRETO, expiresIn: 60 },
    );
    return request((await crearApp(SECRETO)).getHttpServer())
      .get('/api/health/hasura')
      .set('Origin', WEB_APP_ORIGIN)
      .set('Authorization', `Bearer ${token}`)
      .expect(503)
      .expect({
        message:
          'Hasura no está configurado: faltan HASURA_GRAPHQL_URL o HASURA_ADMIN_SECRET en apps/core-service/.env.',
        error: 'Service Unavailable',
        statusCode: 503,
      });
  });

  it('POST /api/sesion responde 503 ACCESO_NO_CONFIGURADO si falta JWT_SECRET', async () => {
    return request((await crearApp('')).getHttpServer())
      .post('/api/sesion')
      .send({ correo: 'titular@ejemplo.test', contrasena: 'cualquier-contrasena' })
      .expect(503)
      .expect({
        codigo: 'ACCESO_NO_CONFIGURADO',
        mensaje:
          'El ingreso no está configurado: falta JWT_SECRET en apps/core-service/.env.',
      });
  });

  it('POST /api/sesion responde 503 SERVICIO_NO_DISPONIBLE si Hasura falla', async () => {
    return request((await crearApp(SECRETO)).getHttpServer())
      .post('/api/sesion')
      .send({ correo: 'titular@ejemplo.test', contrasena: 'cualquier-contrasena' })
      .expect(503)
      .expect({
        codigo: 'SERVICIO_NO_DISPONIBLE',
        mensaje:
          'No pudimos consultar tus datos en este momento. Intenta de nuevo en unos minutos.',
      });
  });

  it('un JWT_SECRET de menos de 32 caracteres detiene el arranque', async () => {
    await expect(crearApp('corto')).rejects.toThrow(
      'JWT_SECRET debe tener al menos 32 caracteres.',
    );
  });
});
