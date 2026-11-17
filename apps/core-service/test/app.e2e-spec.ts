import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp, WEB_APP_ORIGIN } from './../src/configure-app.js';

describe('core-service (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    // Sin variables de Hasura, aunque existan en la terminal: la prueba no
    // debe depender del .env ni consultar Hasura Cloud.
    vi.stubEnv('HASURA_GRAPHQL_URL', '');
    vi.stubEnv('HASURA_ADMIN_SECRET', '');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('GET /api/health responde el estado y permite el origen de la web-app', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .set('Origin', WEB_APP_ORIGIN)
      .expect(200)
      .expect('Access-Control-Allow-Origin', WEB_APP_ORIGIN)
      .expect({ status: 'ok', service: 'core-service' });
  });

  it('GET /api/health/hasura responde 503 si Hasura no está configurado', () => {
    return request(app.getHttpServer())
      .get('/api/health/hasura')
      .set('Origin', WEB_APP_ORIGIN)
      .expect(503)
      .expect('Access-Control-Allow-Origin', WEB_APP_ORIGIN)
      .expect({
        message:
          'Hasura no está configurado: faltan HASURA_GRAPHQL_URL o HASURA_ADMIN_SECRET en apps/core-service/.env.',
        error: 'Service Unavailable',
        statusCode: 503,
      });
  });

  afterEach(async () => {
    await app.close();
    vi.unstubAllEnvs();
  });
});
