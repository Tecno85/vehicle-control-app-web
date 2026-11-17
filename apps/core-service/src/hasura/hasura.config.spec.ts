import { readHasuraConfig } from './hasura.config.js';

const URL_DE_PRUEBA = 'https://proyecto-de-prueba.hasura.app/v1/graphql';

describe('readHasuraConfig', () => {
  it('devuelve null si falta la dirección o el secreto', () => {
    expect(readHasuraConfig({})).toBeNull();
    expect(readHasuraConfig({ HASURA_GRAPHQL_URL: URL_DE_PRUEBA })).toBeNull();
    expect(
      readHasuraConfig({
        HASURA_GRAPHQL_URL: URL_DE_PRUEBA,
        HASURA_ADMIN_SECRET: '  ',
      }),
    ).toBeNull();
  });

  it('usa 5000 ms de tiempo límite si no se indica otro', () => {
    expect(
      readHasuraConfig({
        HASURA_GRAPHQL_URL: URL_DE_PRUEBA,
        HASURA_ADMIN_SECRET: 'secreto',
      }),
    ).toEqual({
      url: URL_DE_PRUEBA,
      adminSecret: 'secreto',
      timeoutMs: 5000,
    });
  });

  it('rechaza una dirección o un tiempo límite mal escritos', () => {
    const base = {
      HASURA_GRAPHQL_URL: URL_DE_PRUEBA,
      HASURA_ADMIN_SECRET: 'secreto',
    };

    expect(() =>
      readHasuraConfig({ ...base, HASURA_GRAPHQL_URL: 'proyecto.hasura.app' }),
    ).toThrow('HASURA_GRAPHQL_URL no es una dirección válida');
    expect(() =>
      readHasuraConfig({ ...base, HASURA_TIMEOUT_MS: 'cinco segundos' }),
    ).toThrow('HASURA_TIMEOUT_MS debe ser un número entero');
    expect(() => readHasuraConfig({ ...base, HASURA_TIMEOUT_MS: '0' })).toThrow(
      'HASURA_TIMEOUT_MS debe ser un número entero',
    );
  });
});
