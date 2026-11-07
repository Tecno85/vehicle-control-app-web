import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  // Puerto fijo: la web-app y su VITE_API_URL apuntan a http://localhost:3000/api.
  await app.listen(3000);
}
await bootstrap();
