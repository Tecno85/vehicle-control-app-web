export type HasuraErrorKind =
  | 'NOT_CONFIGURED'
  | 'TIMEOUT'
  | 'UNAVAILABLE'
  | 'GRAPHQL';

// Su mensaje se puede mostrar fuera de core-service: nunca lleva el secreto,
// la dirección de Hasura ni la respuesta cruda. `codes` guarda los códigos de
// GraphQL (extensions.code) para que cada servicio decida qué responder.
export class HasuraError extends Error {
  constructor(
    readonly kind: HasuraErrorKind,
    message: string,
    readonly codes: string[] = [],
  ) {
    super(message);
    this.name = 'HasuraError';
  }
}

// Para los servicios que reciben de Hasura algo distinto de lo que pidieron.
export function formatoInesperado(): HasuraError {
  return new HasuraError(
    'UNAVAILABLE',
    'Hasura respondió con un formato inesperado.',
  );
}
