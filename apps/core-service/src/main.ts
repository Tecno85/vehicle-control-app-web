import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

async function bootstrap() {
  // La configuración de Hasura vive en apps/core-service/.env, que no se sube al
  // repositorio. Los scripts arrancan core-service desde su carpeta. Sin ese
  // archivo, core-service arranca igual y GET /api/health sigue respondiendo.
  if (existsSync('.env')) {
    process.loadEnvFile('.env');
  }

  const app = await NestFactory.create(AppModule);
  configureApp(app);
  // Puerto fijo: la web-app y su VITE_API_URL apuntan a http://localhost:3000/api.
  await app.listen(3000);
}
await bootstrap();
