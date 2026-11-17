export interface HasuraConfig {
  url: string;
  adminSecret: string;
  timeoutMs: number;
}

export const HASURA_CONFIG = Symbol('HASURA_CONFIG');

const DEFAULT_TIMEOUT_MS = 5000;

// Sin URL o sin secreto devuelve null: core-service arranca igual y el cliente
// avisa que Hasura no está configurado cuando alguien lo usa. Un valor mal
// escrito, en cambio, detiene el arranque para que se corrija.
export function readHasuraConfig(env: NodeJS.ProcessEnv): HasuraConfig | null {
  const url = env.HASURA_GRAPHQL_URL?.trim();
  const adminSecret = env.HASURA_ADMIN_SECRET?.trim();
  if (!url || !adminSecret) {
    return null;
  }

  if (!URL.canParse(url) || !/^https?:$/.test(new URL(url).protocol)) {
    throw new Error(
      'HASURA_GRAPHQL_URL no es una dirección válida: debe empezar por https:// o http://.',
    );
  }

  const timeoutText = env.HASURA_TIMEOUT_MS?.trim();
  const timeoutMs = timeoutText ? Number(timeoutText) : DEFAULT_TIMEOUT_MS;
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error(
      'HASURA_TIMEOUT_MS debe ser un número entero de milisegundos mayor que cero.',
    );
  }

  return { url, adminSecret, timeoutMs };
}
