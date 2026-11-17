import { Test } from '@nestjs/testing';
import type { HasuraConfig } from './hasura.config.js';
import { HasuraError } from './hasura.errors.js';
import { HasuraModule } from './hasura.module.js';
import { HasuraService } from './hasura.service.js';

const URL_DE_PRUEBA = 'https://proyecto-de-prueba.hasura.app/v1/graphql';
const SECRETO = 'secreto-de-prueba-123';
const CONSULTA = 'query { vehiculos_aggregate { aggregate { count } } }';
const CONFIG: HasuraConfig = {
  url: URL_DE_PRUEBA,
  adminSecret: SECRETO,
  timeoutMs: 1000,
};

function respuestaJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

function simularFetch(
  implementacion: (url: string, init: RequestInit) => Promise<Response>,
) {
  const fetchSimulado = vi.fn(implementacion);
  vi.stubGlobal('fetch', fetchSimulado);
  return fetchSimulado;
}

async function errorDe(promesa: Promise<unknown>): Promise<HasuraError> {
  try {
    await promesa;
  } catch (error) {
    expect(error).toBeInstanceOf(HasuraError);
    return error as HasuraError;
  }
  throw new Error('Se esperaba un HasuraError');
}

describe('HasuraService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('devuelve los datos cuando Hasura responde bien', async () => {
    const data = { vehiculos_aggregate: { aggregate: { count: 1 } } };
    simularFetch(() => Promise.resolve(respuestaJson({ data })));

    await expect(new HasuraService(CONFIG).request(CONSULTA)).resolves.toEqual(
      data,
    );
  });

  it('envía la consulta por POST con la cabecera x-hasura-admin-secret', async () => {
    const fetchSimulado = simularFetch(() =>
      Promise.resolve(respuestaJson({ data: {} })),
    );

    await new HasuraService(CONFIG).request(CONSULTA, { placa: 'XYZ789' });

    const [url, init] = fetchSimulado.mock.calls[0];
    expect(url).toBe(URL_DE_PRUEBA);
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({ 'x-hasura-admin-secret': SECRETO });
    expect(JSON.parse(init.body as string)).toEqual({
      query: CONSULTA,
      variables: { placa: 'XYZ789' },
    });
  });

  it('avisa los errores de GraphQL con sus códigos, sin el mensaje crudo', async () => {
    simularFetch(() =>
      Promise.resolve(
        respuestaJson({
          errors: [
            {
              message:
                'Check constraint violation. new row violates check constraint "ingresos_check1"',
              extensions: { path: '$', code: 'permission-error' },
            },
          ],
        }),
      ),
    );

    const error = await errorDe(new HasuraService(CONFIG).request(CONSULTA));

    expect(error.kind).toBe('GRAPHQL');
    expect(error.codes).toEqual(['permission-error']);
    expect(error.message).toBe(
      'Hasura rechazó la consulta (código: permission-error).',
    );
  });

  it('trata un HTTP 500 como servicio no disponible', async () => {
    simularFetch(() =>
      Promise.resolve(new Response('Internal Server Error', { status: 500 })),
    );

    const error = await errorDe(new HasuraService(CONFIG).request(CONSULTA));

    expect(error.kind).toBe('UNAVAILABLE');
    expect(error.message).toBe('Hasura respondió con un error (HTTP 500).');
  });

  it('trata una respuesta que no es GraphQL como servicio no disponible', async () => {
    simularFetch(() =>
      Promise.resolve(new Response('<html>Hola</html>', { status: 200 })),
    );

    const error = await errorDe(new HasuraService(CONFIG).request(CONSULTA));

    expect(error.kind).toBe('UNAVAILABLE');
    expect(error.message).toBe('Hasura respondió con un formato inesperado.');
  });

  it('trata una falla de red como servicio no disponible', async () => {
    simularFetch(() =>
      Promise.reject(new TypeError(`fetch failed: ${URL_DE_PRUEBA}`)),
    );

    const error = await errorDe(new HasuraService(CONFIG).request(CONSULTA));

    expect(error.kind).toBe('UNAVAILABLE');
    expect(error.message).toContain('No se pudo conectar con Hasura');
  });

  it('deja de esperar cuando se agota el tiempo límite', async () => {
    // Una respuesta que nunca llega: solo termina si se cancela la petición.
    simularFetch(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () =>
            reject(init.signal?.reason),
          );
        }),
    );

    const error = await errorDe(
      new HasuraService({ ...CONFIG, timeoutMs: 20 }).request(CONSULTA),
    );

    expect(error.kind).toBe('TIMEOUT');
    expect(error.message).toBe('Hasura no respondió en 20 ms.');
  });

  it('avisa si falta la configuración, sin llamar a Hasura', async () => {
    const fetchSimulado = simularFetch(() =>
      Promise.resolve(respuestaJson({ data: {} })),
    );

    const error = await errorDe(new HasuraService(null).request(CONSULTA));

    expect(error.kind).toBe('NOT_CONFIGURED');
    expect(fetchSimulado).not.toHaveBeenCalled();
  });

  it('no incluye el secreto ni la dirección de Hasura en ningún error', async () => {
    const respuestas: (() => Promise<Response>)[] = [
      () =>
        Promise.resolve(
          respuestaJson({
            errors: [
              {
                message: `invalid x-hasura-admin-secret ${SECRETO}`,
                extensions: { code: 'access-denied' },
              },
            ],
          }),
        ),
      () => Promise.resolve(new Response(SECRETO, { status: 500 })),
      () => Promise.resolve(new Response(SECRETO, { status: 200 })),
      () => Promise.reject(new TypeError(`${URL_DE_PRUEBA} ${SECRETO}`)),
    ];

    for (const respuesta of respuestas) {
      simularFetch(respuesta);
      const error = await errorDe(new HasuraService(CONFIG).request(CONSULTA));
      const textoVisible = `${error.message} ${JSON.stringify(error)}`;
      expect(textoVisible).not.toContain(SECRETO);
      expect(textoVisible).not.toContain(URL_DE_PRUEBA);
    }
  });

  it('HasuraModule lo entrega por inyección con la configuración del entorno', async () => {
    vi.stubEnv('HASURA_GRAPHQL_URL', URL_DE_PRUEBA);
    vi.stubEnv('HASURA_ADMIN_SECRET', SECRETO);
    const fetchSimulado = simularFetch(() =>
      Promise.resolve(respuestaJson({ data: {} })),
    );

    const moduleRef = await Test.createTestingModule({
      imports: [HasuraModule],
    }).compile();
    await moduleRef.get(HasuraService).request(CONSULTA);

    expect(fetchSimulado.mock.calls[0][0]).toBe(URL_DE_PRUEBA);
  });
});
