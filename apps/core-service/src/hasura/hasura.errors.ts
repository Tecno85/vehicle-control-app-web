export type HasuraErrorKind =
  | 'NOT_CONFIGURED'
  | 'TIMEOUT'
  | 'UNAVAILABLE'
  | 'GRAPHQL';

// Su mensaje se puede mostrar fuera de core-service: nunca lleva el secreto,
// la dirección de Hasura ni la respuesta cruda. Para que cada servicio decida
// qué responder, guarda los códigos de GraphQL (extensions.code) en `codes` y,
// si la base rechazó un dato, los nombres de las restricciones en
// `restricciones`, sin el resto del mensaje, que puede traer datos guardados.
export class HasuraError extends Error {
  constructor(
    readonly kind: HasuraErrorKind,
    message: string,
    readonly codes: string[] = [],
    readonly restricciones: string[] = [],
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

// Para los servicios: ¿la base rechazó el cambio por alguna de estas restricciones?
export function esRechazoPor(error: unknown, ...nombres: string[]): boolean {
  return (
    error instanceof HasuraError &&
    error.restricciones.some((nombre) => nombres.includes(nombre))
  );
}
