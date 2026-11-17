import { Inject, Injectable } from '@nestjs/common';
import { HASURA_CONFIG, type HasuraConfig } from './hasura.config.js';
import { HasuraError } from './hasura.errors.js';

interface GraphQLBody {
  data?: unknown;
  errors?: unknown;
}

// Cliente interno: los servicios de core-service lo reciben por inyección.
// El navegador nunca habla con Hasura ni conoce el secreto de administración.
@Injectable()
export class HasuraService {
  constructor(
    @Inject(HASURA_CONFIG) private readonly config: HasuraConfig | null,
  ) {}

  // Devuelve `data` sin revisar su forma: cada servicio valida lo que pidió.
  async request<T>(
    query: string,
    variables: Record<string, unknown> = {},
  ): Promise<T> {
    if (!this.config) {
      throw new HasuraError(
        'NOT_CONFIGURED',
        'Hasura no está configurado: faltan HASURA_GRAPHQL_URL o HASURA_ADMIN_SECRET en apps/core-service/.env.',
      );
    }

    const { status, text } = await this.post(this.config, query, variables);
    const body = parseJson(text);

    const codes = graphQLErrorCodes(body);
    if (codes) {
      throw new HasuraError(
        'GRAPHQL',
        codes.length > 0
          ? `Hasura rechazó la consulta (código: ${codes.join(', ')}).`
          : 'Hasura rechazó la consulta.',
        codes,
      );
    }
    if (status < 200 || status >= 300) {
      throw new HasuraError(
        'UNAVAILABLE',
        `Hasura respondió con un error (HTTP ${status}).`,
      );
    }
    if (!isGraphQLBody(body) || body.data == null) {
      throw new HasuraError(
        'UNAVAILABLE',
        'Hasura respondió con un formato inesperado.',
      );
    }
    return body.data as T;
  }

  private async post(
    { url, adminSecret, timeoutMs }: HasuraConfig,
    query: string,
    variables: Record<string, unknown>,
  ): Promise<{ status: number; text: string }> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-hasura-admin-secret': adminSecret,
        },
        body: JSON.stringify({ query, variables }),
        // El tiempo límite cubre también la lectura de la respuesta.
        signal: AbortSignal.timeout(timeoutMs),
      });
      return { status: response.status, text: await response.text() };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new HasuraError(
          'TIMEOUT',
          `Hasura no respondió en ${timeoutMs} ms.`,
        );
      }
      // El error original puede incluir la dirección de Hasura; no se propaga.
      throw new HasuraError(
        'UNAVAILABLE',
        'No se pudo conectar con Hasura. Revisa la conexión a internet y HASURA_GRAPHQL_URL.',
      );
    }
  }
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function isGraphQLBody(body: unknown): body is GraphQLBody {
  return typeof body === 'object' && body !== null;
}

// null si la respuesta no trae errores de GraphQL; si los trae, sus códigos sin repetir.
function graphQLErrorCodes(body: unknown): string[] | null {
  if (
    !isGraphQLBody(body) ||
    !Array.isArray(body.errors) ||
    body.errors.length === 0
  ) {
    return null;
  }
  const codes = body.errors.map(
    (error: { extensions?: { code?: unknown } } | null) =>
      error?.extensions?.code,
  );
  return [
    ...new Set(
      codes.filter((code): code is string => typeof code === 'string'),
    ),
  ];
}
