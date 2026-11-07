import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp, WEB_APP_ORIGIN } from './../src/configure-app.js';

describe('GET /api/health (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('responde el estado y permite el origen de la web-app', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .set('Origin', WEB_APP_ORIGIN)
      .expect(200)
      .expect('Access-Control-Allow-Origin', WEB_APP_ORIGIN)
      .expect({ status: 'ok', service: 'core-service' });
  });

  afterEach(async () => {
    await app.close();
  });
});
