import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request, { type Test as Peticion } from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp, WEB_APP_ORIGIN } from './../src/configure-app.js';
import { HasuraService } from './../src/hasura/hasura.service.js';
import { HasuraSimulado, type UsuarioSimulado, type VehiculoSimulado } from './hasura-simulado.js';

// El acceso tiene su propia e2e (acceso.e2e-spec.ts): aquí cada cuenta usa un
// token de acceso firmado con el secreto de la prueba.
const SECRETO = 'secreto-solo-para-pruebas-e2e-de-vehiculos-01';

function usuarios(): UsuarioSimulado[] {
  return [
    { id: 1, nombre: 'Titular de prueba', correo: 'titular@ejemplo.test', activo: true, contrasena_hash: 'sin-contrasena' },
    { id: 2, nombre: 'Segunda titular de prueba', correo: 'segunda.prueba@example.com', activo: true, contrasena_hash: 'sin-contrasena' },
  ];
}

function vehiculos(): VehiculoSimulado[] {
  const base = { marca: 'Vehículo de ejemplo', activo: true };
  return [
    { ...base, id: 1, usuario_id: 1, placa: 'XYZ789', modelo: 'Taxi', tipo: 'TAXI', habilitado_indrive: false, conductor: 'Conductor de ejemplo', cuota_diaria: 60000 },
    { ...base, id: 2, usuario_id: 1, placa: 'ABC123', modelo: 'Particular', tipo: 'PARTICULAR', habilitado_indrive: false, conductor: null, cuota_diaria: null },
    { ...base, id: 3, usuario_id: 2, placa: 'KLM456', modelo: 'Particular', tipo: 'PARTICULAR', habilitado_indrive: true, conductor: null, cuota_diaria: null },
  ];
}

const TAXI_NUEVO = { placa: ' tlv 144 ', marca: 'Marca de ejemplo', modelo: '2014', tipo: 'TAXI', cuota_diaria: 70000, conductor: 'Conductor de prueba' };

describe('vehículos (e2e)', () => {
  let app: INestApplication<App>;
  let hasura: HasuraSimulado;
  const jwt = new JwtService();
  const token = (cuenta: 1 | 2) => jwt.sign({ sub: String(cuenta) }, { secret: SECRETO, expiresIn: 60 });

  beforeEach(async () => {
    vi.stubEnv('JWT_SECRET', SECRETO);
    vi.stubEnv('HASURA_GRAPHQL_URL', '');
    vi.stubEnv('HASURA_ADMIN_SECRET', '');
    // XYZ789 tiene un ingreso, un gasto y un documento; ABC123 y KLM456, ninguno.
    hasura = new HasuraSimulado(usuarios(), vehiculos(), { 1: { ingresos: 1, gastos: 1, documentos: 1 } });
    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(HasuraService)
      .useValue(hasura)
      .compile();
    app = modulo.createNestApplication({ logger: false });
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    vi.unstubAllEnvs();
  });

  // Los encabezados que pone el navegador desde la web-app.
  const desdeLaWeb = (peticion: Peticion, cuenta: 1 | 2 | null = 1) => {
    const conOrigen = peticion.set('Origin', WEB_APP_ORIGIN).set('Sec-Fetch-Site', 'same-site');
    return cuenta === null ? conOrigen : conOrigen.set('Authorization', `Bearer ${token(cuenta)}`);
  };
  const servidor = () => request(app.getHttpServer());
  const ver = (id: number | string, cuenta: 1 | 2 = 1) => desdeLaWeb(servidor().get(`/api/vehiculos/${id}`), cuenta);
  const listar = (cuenta: 1 | 2 = 1) => desdeLaWeb(servidor().get('/api/vehiculos'), cuenta);
  const crear = (body: object, cuenta: 1 | 2 = 1) => desdeLaWeb(servidor().post('/api/vehiculos'), cuenta).send(body);
  const editar = (id: number, body: object, cuenta: 1 | 2 = 1) => desdeLaWeb(servidor().patch(`/api/vehiculos/${id}`), cuenta).send(body);
  const eliminar = (id: number, cuenta: 1 | 2 = 1) => desdeLaWeb(servidor().delete(`/api/vehiculos/${id}`), cuenta);
  const placas = async (cuenta: 1 | 2 = 1) => ((await listar(cuenta)).body.vehiculos as { placa: string }[]).map((v) => v.placa);

  it('recorrido completo: crear 201, listar, ver, editar 200, eliminar 204 y después ver 404', async () => {
    const creado = await crear(TAXI_NUEVO);
    expect(creado.status).toBe(201);
    expect(creado.body).toEqual({
      id: 4, placa: 'TLV144', marca: 'Marca de ejemplo', modelo: '2014', tipo: 'TAXI',
      habilitado_indrive: false, conductor: 'Conductor de prueba', cuota_diaria: 70000, activo: true,
    });

    const flota = await listar();
    expect(flota.status).toBe(200);
    expect(flota.body.vehiculos.map((v: { placa: string }) => v.placa)).toEqual(['ABC123', 'TLV144', 'XYZ789']);
    expect(flota.body.conteos).toEqual({ vehiculos: 3, taxis: 2, particulares: 1 });

    const visto = await ver(4);
    expect(visto.status).toBe(200);
    expect(visto.body).toEqual({ ...creado.body, registros: { ingresos: 0, gastos: 0, documentos: 0 } });

    const editado = await editar(4, { cuota_diaria: 75000, conductor: '' });
    expect(editado.status).toBe(200);
    expect(editado.body).toMatchObject({ placa: 'TLV144', cuota_diaria: 75000, conductor: null });

    const eliminado = await eliminar(4);
    expect(eliminado.status).toBe(204);
    expect(eliminado.text).toBe('');
    expect((await ver(4)).body).toEqual({ codigo: 'VEHICULO_NO_ENCONTRADO', mensaje: 'No encontramos ese vehículo en tu cuenta.' });
    expect(await placas()).toEqual(['ABC123', 'XYZ789']);
  });

  it('un campo reservado en el body responde 400 y el vehículo no cambia', async () => {
    const nuevo = await crear({ ...TAXI_NUEVO, usuario_id: 2, id: 99, creado_en: '2020-01-01' });
    expect(nuevo.status).toBe(400);
    expect(nuevo.body).toEqual({
      codigo: 'DATOS_INVALIDOS',
      mensaje: 'Revisa los datos marcados.',
      campos: {
        usuario_id: 'Este campo no está permitido.',
        id: 'Este campo no está permitido.',
        creado_en: 'Este campo no está permitido.',
      },
    });
    expect(await placas(2)).toEqual(['KLM456']);
    expect(await placas(1)).toEqual(['ABC123', 'XYZ789']);

    const antes = (await ver(2)).body;
    const cambio = await editar(2, { marca: 'Otra marca', usuario_id: 2 });
    expect(cambio.status).toBe(400);
    expect(cambio.body.campos).toEqual({ usuario_id: 'Este campo no está permitido.' });
    expect((await ver(2)).body).toEqual(antes);
  });

  it('ningún body acepta una consulta GraphQL ni un id mal escrito', async () => {
    const consulta = await crear({ ...TAXI_NUEVO, query: 'mutation { delete_vehiculos(where: {}) { affected_rows } }' });
    expect(consulta.status).toBe(400);
    expect(consulta.body.campos).toEqual({ query: 'Este campo no está permitido.' });
    expect(hasura.consultas).not.toContain('CrearVehiculo');

    for (const id of ['abc', '0', '1.5', '99999999999']) {
      const respuesta = await ver(id);
      expect(respuesta.status).toBe(400);
      expect(respuesta.body).toEqual({ codigo: 'DATOS_INVALIDOS', mensaje: 'El número del vehículo no es válido.' });
    }
  });

  it('valida cada campo con un mensaje claro', async () => {
    const respuesta = await crear({ placa: 'ABC-123', marca: '   ', tipo: 'MOTO', cuota_diaria: -1, habilitado_indrive: 'sí' });
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.campos).toEqual({
      placa: 'La placa lleva solo letras y números, hasta 10.',
      marca: 'Escribe la marca.',
      modelo: 'Escribe el modelo.',
      tipo: 'Elige si es taxi o particular.',
      cuota_diaria: 'La cuota no puede ser negativa.',
      habilitado_indrive: 'Indica si está habilitado para inDrive.',
    });
  });

  it('la otra cuenta recibe 404 al ver, editar o eliminar, y el vehículo no cambia', async () => {
    const noEncontrado = { codigo: 'VEHICULO_NO_ENCONTRADO', mensaje: 'No encontramos ese vehículo en tu cuenta.' };
    for (const respuesta of [await ver(2, 2), await editar(2, { marca: 'Ajena' }, 2), await eliminar(2, 2)]) {
      expect(respuesta.status).toBe(404);
      expect(respuesta.body).toEqual(noEncontrado);
    }
    expect((await ver(2)).body).toMatchObject({ placa: 'ABC123', marca: 'Vehículo de ejemplo' });
  });

  it('una placa repetida responde 409 en la misma cuenta y 201 en la otra', async () => {
    const repetida = await crear({ ...TAXI_NUEVO, placa: 'xyz 789' });
    expect(repetida.status).toBe(409);
    expect(repetida.body).toEqual({
      codigo: 'PLACA_REPETIDA',
      mensaje: 'Ya tienes un vehículo con esa placa.',
      campos: { placa: 'Ya tienes un vehículo con esa placa.' },
    });
    expect((await editar(2, { placa: 'XYZ789' })).status).toBe(409);

    const enOtraCuenta = await crear({ ...TAXI_NUEVO, placa: 'XYZ789' }, 2);
    expect(enOtraCuenta.status).toBe(201);
    expect(await placas(2)).toEqual(['KLM456', 'XYZ789']);
  });

  it('un tipo incoherente responde 422 TIPO_INCOHERENTE', async () => {
    const casos: [object, string, string][] = [
      [{ ...TAXI_NUEVO, cuota_diaria: undefined }, 'cuota_diaria', 'Un taxi necesita su cuota diaria.'],
      [{ ...TAXI_NUEVO, habilitado_indrive: true }, 'habilitado_indrive', 'Un taxi no se habilita para inDrive.'],
      [{ placa: 'PAR001', marca: 'Marca', modelo: 'Modelo', tipo: 'PARTICULAR', cuota_diaria: 10 }, 'cuota_diaria', 'Un particular no lleva cuota diaria.'],
      [{ placa: 'PAR001', marca: 'Marca', modelo: 'Modelo', tipo: 'PARTICULAR', conductor: 'Alguien' }, 'conductor', 'Un particular no lleva conductor.'],
    ];
    for (const [body, campo, mensaje] of casos) {
      const respuesta = await crear(body);
      expect(respuesta.status).toBe(422);
      expect(respuesta.body).toEqual({ codigo: 'TIPO_INCOHERENTE', mensaje, campos: { [campo]: mensaje } });
    }
    // Al editar se revisa el resultado completo: el particular pasa a taxi sin cuota.
    expect((await editar(2, { tipo: 'TAXI' })).status).toBe(422);
    expect(await placas()).toEqual(['ABC123', 'XYZ789']);
  });

  it('un vehículo con ingresos no cambia de tipo; sin ingresos, sí', async () => {
    const conIngresos = await editar(1, { tipo: 'PARTICULAR', cuota_diaria: null, conductor: null });
    expect(conIngresos.status).toBe(409);
    expect(conIngresos.body.codigo).toBe('VEHICULO_CON_INGRESOS');
    expect((await ver(1)).body).toMatchObject({ tipo: 'TAXI', cuota_diaria: 60000 });

    const sinIngresos = await editar(2, { tipo: 'TAXI', cuota_diaria: 50000 });
    expect(sinIngresos.status).toBe(200);
    expect(sinIngresos.body).toMatchObject({ tipo: 'TAXI', cuota_diaria: 50000, habilitado_indrive: false });
  });

  it('eliminar con registros responde 409, y desactivarlo responde 200', async () => {
    const conRegistros = await eliminar(1);
    expect(conRegistros.status).toBe(409);
    expect(conRegistros.body).toEqual({
      codigo: 'VEHICULO_CON_REGISTROS',
      mensaje: 'Este vehículo tiene ingresos, gastos o documentos. Desactívalo para conservarlos.',
    });

    const desactivado = await editar(1, { activo: false });
    expect(desactivado.status).toBe(200);
    expect(desactivado.body).toMatchObject({ placa: 'XYZ789', activo: false });

    // Un vehículo inactivo se consulta y se edita; en la flota va al final y no cuenta.
    expect((await ver(1)).body).toMatchObject({ activo: false, registros: { ingresos: 1, gastos: 1, documentos: 1 } });
    expect((await editar(1, { conductor: 'Otro conductor' })).body).toMatchObject({ conductor: 'Otro conductor', activo: false });
    const flota = (await listar()).body;
    expect(flota.vehiculos.map((v: { placa: string }) => v.placa)).toEqual(['ABC123', 'XYZ789']);
    expect(flota.conteos).toEqual({ vehiculos: 1, taxis: 0, particulares: 1 });
  });

  it('activo true responde 400: reactivar sigue por definir', async () => {
    await editar(1, { activo: false });
    const reactivar = await editar(1, { activo: true });
    expect(reactivar.status).toBe(400);
    expect(reactivar.body.campos).toEqual({ activo: 'Por ahora un vehículo desactivado no se puede reactivar.' });
    expect((await ver(1)).body.activo).toBe(false);
  });

  it('sin sesión responde 401 en todas las rutas', async () => {
    const sinSesion = [
      desdeLaWeb(servidor().get('/api/vehiculos'), null),
      desdeLaWeb(servidor().get('/api/vehiculos/1'), null),
      desdeLaWeb(servidor().post('/api/vehiculos'), null).send(TAXI_NUEVO),
      desdeLaWeb(servidor().patch('/api/vehiculos/1'), null).send({ marca: 'X' }),
      desdeLaWeb(servidor().delete('/api/vehiculos/2'), null),
    ];
    for (const peticion of sinSesion) {
      const respuesta = await peticion;
      expect(respuesta.status).toBe(401);
      expect(respuesta.body.codigo).toBe('SESION_REQUERIDA');
    }
    expect(await placas()).toEqual(['ABC123', 'XYZ789']);
  });

  it('la web-app puede enviar PATCH y DELETE: la verificación previa del navegador los permite', async () => {
    for (const metodo of ['PATCH', 'DELETE']) {
      const respuesta = await servidor()
        .options('/api/vehiculos/1')
        .set('Origin', WEB_APP_ORIGIN)
        .set('Access-Control-Request-Method', metodo)
        .set('Access-Control-Request-Headers', 'authorization, content-type');
      expect(respuesta.status).toBe(204);
      expect(respuesta.headers['access-control-allow-origin']).toBe(WEB_APP_ORIGIN);
      expect(respuesta.headers['access-control-allow-methods']).toContain(metodo);
    }
  });

  it('crear, editar o eliminar desde otro sitio responde 403, sin tocar los vehículos', async () => {
    const otroSitio = { Origin: 'https://otro-sitio.example', 'Sec-Fetch-Site': 'cross-site', Authorization: `Bearer ${token(1)}` };
    for (const peticion of [
      servidor().post('/api/vehiculos').send(TAXI_NUEVO),
      servidor().patch('/api/vehiculos/2').send({ marca: 'Desde otro sitio' }),
      servidor().delete('/api/vehiculos/2'),
    ]) {
      const respuesta = await peticion.set(otroSitio);
      expect(respuesta.status).toBe(403);
      expect(respuesta.body).toEqual({ codigo: 'ORIGEN_NO_PERMITIDO', mensaje: 'Esta acción solo se puede hacer desde la web-app.' });
    }
    expect((await ver(2)).body).toMatchObject({ marca: 'Vehículo de ejemplo' });
    expect(await placas()).toEqual(['ABC123', 'XYZ789']);
  });
});
