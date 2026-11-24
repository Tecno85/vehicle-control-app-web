export interface AuthConfig {
  jwtSecret: string;
}

export const AUTH_CONFIG = Symbol('AUTH_CONFIG');

const LONGITUD_MINIMA_SECRETO = 32;

// Igual que hasura.config.ts: sin JWT_SECRET devuelve null, core-service arranca
// y el ingreso avisa que falta. Un secreto corto, en cambio, detiene el arranque:
// sería más fácil de adivinar, y con él cualquiera podría firmar tokens.
export function readAuthConfig(env: NodeJS.ProcessEnv): AuthConfig | null {
  const jwtSecret = env.JWT_SECRET?.trim();
  if (!jwtSecret) {
    return null;
  }
  if (jwtSecret.length < LONGITUD_MINIMA_SECRETO) {
    throw new Error(
      `JWT_SECRET debe tener al menos ${LONGITUD_MINIMA_SECRETO} caracteres. Créalo con: openssl rand -base64 32`,
    );
  }
  return { jwtSecret };
}
