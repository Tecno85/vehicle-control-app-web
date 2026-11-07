import type { INestApplication } from '@nestjs/common';

// core-service solo acepta peticiones del navegador desde la web-app local.
export const WEB_APP_ORIGIN = 'http://localhost:5173';

// La usan main.ts y la prueba e2e, para que las dos tengan el mismo prefijo y el mismo CORS.
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.enableCors({ origin: WEB_APP_ORIGIN });
}
