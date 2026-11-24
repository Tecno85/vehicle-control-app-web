import type { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';

// core-service solo acepta peticiones del navegador desde la web-app local.
export const WEB_APP_ORIGIN = 'http://localhost:5173';

// La usan main.ts y las pruebas e2e, para que tengan la misma configuración.
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  // Con credenciales, el navegador puede enviar la cookie de renovación.
  app.enableCors({ origin: WEB_APP_ORIGIN, credentials: true });
  // CORS no impide que otro sitio envíe un POST o un DELETE: solo le impide leer
  // la respuesta. Esta protección los rechaza con 403 cuando el navegador indica
  // que vienen de otro sitio. La web-app (puerto 5173) y core-service (3000)
  // están en el mismo sitio, localhost, pero no en el mismo origen, así que la
  // web-app va como único origen de confianza.
  app.enableCsrfProtection({ trustedOrigins: [WEB_APP_ORIGIN] });
  app.use(cookieParser());
}
