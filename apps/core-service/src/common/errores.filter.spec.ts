import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  type ArgumentsHost,
} from '@nestjs/common';
import { HasuraError } from '../hasura/hasura.errors.js';
import { errorApi } from './errores.js';
import { ErroresFilter } from './errores.filter.js';

function responder(error: unknown) {
  const respuesta = { status: vi.fn().mockReturnThis(), json: vi.fn() };
  const host = {
    switchToHttp: () => ({ getResponse: () => respuesta }),
  } as unknown as ArgumentsHost;
  new ErroresFilter().catch(error, host);
  return {
    estado: respuesta.status.mock.calls[0][0] as number,
    cuerpo: respuesta.json.mock.calls[0][0] as unknown,
  };
}

describe('ErroresFilter', () => {
  let avisos: ReturnType<typeof vi.spyOn>;
  let errores: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    avisos = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    errores = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envía igual un error que ya trae { codigo, mensaje }, con sus campos', () => {
    const campos = { placa: 'Escribe la placa.' };
    expect(
      responder(errorApi(HttpStatus.BAD_REQUEST, 'DATOS_INVALIDOS', 'Revisa los datos marcados.', campos)),
    ).toEqual({
      estado: 400,
      cuerpo: { codigo: 'DATOS_INVALIDOS', mensaje: 'Revisa los datos marcados.', campos },
    });
    expect(
      responder(errorApi(HttpStatus.UNAUTHORIZED, 'SESION_REQUERIDA', 'Necesitas ingresar para ver esta información.')),
    ).toEqual({
      estado: 401,
      cuerpo: { codigo: 'SESION_REQUERIDA', mensaje: 'Necesitas ingresar para ver esta información.' },
    });
  });

  it('responde 503 a un HasuraError y registra solo su tipo y sus códigos', () => {
    const error = new HasuraError('GRAPHQL', 'Hasura rechazó la consulta.', ['validation-failed']);

    expect(responder(error)).toEqual({
      estado: 503,
      cuerpo: {
        codigo: 'SERVICIO_NO_DISPONIBLE',
        mensaje: 'No pudimos consultar tus datos en este momento. Intenta de nuevo en unos minutos.',
      },
    });
    expect(avisos).toHaveBeenCalledWith('Falló una consulta a Hasura: GRAPHQL (validation-failed)');
  });

  it('responde 400 DATOS_INVALIDOS a un JSON roto, sin repetir lo que se envió', () => {
    const { estado, cuerpo } = responder(
      new BadRequestException('Unexpected token c in JSON: {"contrasena":"clave-de-prueba'),
    );

    expect(estado).toBe(400);
    expect(cuerpo).toEqual({
      codigo: 'DATOS_INVALIDOS',
      mensaje: 'Los datos enviados no tienen el formato esperado.',
    });
    expect(JSON.stringify(cuerpo)).not.toContain('clave-de-prueba');
  });

  it('distingue el rechazo de CSRF de los demás 403', () => {
    expect(
      responder(new ForbiddenException('Cross-origin request detected from Sec-Fetch-Site header')),
    ).toEqual({
      estado: 403,
      cuerpo: { codigo: 'ORIGEN_NO_PERMITIDO', mensaje: 'Esta acción solo se puede hacer desde la web-app.' },
    });
    expect(responder(new ForbiddenException('Forbidden resource'))).toEqual({
      estado: 403,
      cuerpo: { codigo: 'ACCESO_DENEGADO', mensaje: 'No tienes permiso para hacer esta acción.' },
    });
  });

  it('responde 404 RUTA_NO_ENCONTRADA a una ruta que no existe', () => {
    expect(responder(new NotFoundException('Cannot GET /api/no-existe'))).toEqual({
      estado: 404,
      cuerpo: { codigo: 'RUTA_NO_ENCONTRADA', mensaje: 'Esa dirección no existe en core-service.' },
    });
  });

  it('da un código genérico a los demás errores HTTP, según su estado', () => {
    expect(responder(new HttpException('request entity too large', 413))).toEqual({
      estado: 413,
      cuerpo: { codigo: 'SOLICITUD_RECHAZADA', mensaje: 'No pudimos atender esta solicitud.' },
    });
    expect(responder(new HttpException('Bad Gateway', 502))).toEqual({
      estado: 502,
      cuerpo: { codigo: 'ERROR_INTERNO', mensaje: 'Algo falló en core-service. Intenta de nuevo en unos minutos.' },
    });
  });

  it('responde 500 ERROR_INTERNO a un error inesperado y registra solo su tipo', () => {
    const interno = {
      estado: 500,
      cuerpo: { codigo: 'ERROR_INTERNO', mensaje: 'Algo falló en core-service. Intenta de nuevo en unos minutos.' },
    };

    expect(responder(new TypeError('dato-privado-de-la-solicitud'))).toEqual(interno);
    expect(responder('un texto lanzado como error')).toEqual(interno);
    expect(errores.mock.calls).toEqual([['Error inesperado: TypeError'], ['Error inesperado: string']]);
  });
});
