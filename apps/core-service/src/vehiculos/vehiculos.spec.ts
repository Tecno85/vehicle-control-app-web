import { HttpException } from '@nestjs/common';
import { HasuraError } from '../hasura/hasura.errors.js';
import type { HasuraService } from '../hasura/hasura.service.js';
import type { ActualizarVehiculoDto } from './dto/actualizar-vehiculo.dto.js';
import type { CrearVehiculoDto } from './dto/crear-vehiculo.dto.js';
import {
  ACTUALIZAR_VEHICULO,
  CREAR_VEHICULO,
  ELIMINAR_VEHICULO,
  FLOTA_DE_LA_CUENTA,
  VEHICULO_DE_LA_CUENTA,
} from './graphql/vehiculos.graphql.js';
import { VehiculosController } from './vehiculos.controller.js';
import { VehiculosService, type Vehiculo } from './vehiculos.service.js';

const TAXI: Vehiculo = {
  id: 1,
  placa: 'XYZ789',
  marca: 'Vehículo de ejemplo',
  modelo: 'Taxi',
  tipo: 'TAXI',
  habilitado_indrive: false,
  conductor: 'Conductor de ejemplo',
  cuota_diaria: 60000,
  activo: true,
};

const PARTICULAR: Vehiculo = {
  id: 2,
  placa: 'ABC123',
  marca: 'Vehículo de ejemplo',
  modelo: 'Particular',
  tipo: 'PARTICULAR',
  habilitado_indrive: true,
  conductor: null,
  cuota_diaria: null,
  activo: true,
};

// Como responde Hasura a VehiculoDeLaCuenta: el vehículo con sus conteos.
function guardado(vehiculo: Vehiculo, ingresos = 0, gastos = 0, documentos = 0) {
  const conteo = (count: number) => ({ aggregate: { count } });
  return {
    vehiculos: [
      {
        ...vehiculo,
        ingresos_aggregate: conteo(ingresos),
        gastos_aggregate: conteo(gastos),
        documentos_aggregate: conteo(documentos),
      },
    ],
  };
}

// Como responde Hasura cuando PostgreSQL rechaza un dato.
const rechazoDeLaBase = (restriccion: string) =>
  new HasuraError('GRAPHQL', 'Hasura rechazó la consulta (código: constraint-violation).', ['constraint-violation'], [restriccion]);

async function rechazo(promesa: Promise<unknown>) {
  const error: unknown = await promesa.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(HttpException);
  return {
    estado: (error as HttpException).getStatus(),
    cuerpo: (error as HttpException).getResponse(),
  };
}

const NO_ENCONTRADO = {
  estado: 404,
  cuerpo: { codigo: 'VEHICULO_NO_ENCONTRADO', mensaje: 'No encontramos ese vehículo en tu cuenta.' },
};

describe('vehículos', () => {
  const request = vi.fn();
  const service = new VehiculosService({ request } as unknown as HasuraService);
  const controller = new VehiculosController(service);

  beforeEach(() => {
    request.mockReset();
  });

  // El DTO ya llega validado y limpio: aquí se arma como lo entrega el ValidationPipe.
  const nuevo = (datos: Partial<CrearVehiculoDto>) => datos as CrearVehiculoDto;
  const cambios = (datos: Partial<ActualizarVehiculoDto>) => datos as ActualizarVehiculoDto;

  describe('listar', () => {
    it('pide la flota de la cuenta de la sesión y cuenta solo los activos', async () => {
      const inactivo = { ...TAXI, id: 3, placa: 'OLD001', activo: false };
      request.mockResolvedValue({ vehiculos: [PARTICULAR, TAXI, inactivo] });

      await expect(controller.listar(7)).resolves.toEqual({
        vehiculos: [PARTICULAR, TAXI, inactivo],
        conteos: { vehiculos: 2, taxis: 1, particulares: 1 },
      });
      expect(request).toHaveBeenCalledWith(FLOTA_DE_LA_CUENTA, { usuarioId: 7 });
      expect(FLOTA_DE_LA_CUENTA).toContain('usuario_id: { _eq: $usuarioId }');
    });

    it('con un formato inesperado responde con un HasuraError (503)', async () => {
      request.mockResolvedValue({ otra: 'cosa' });
      await expect(service.listar(7)).rejects.toBeInstanceOf(HasuraError);
    });
  });

  describe('obtener', () => {
    it('busca el vehículo con el id y la cuenta de la sesión, con sus registros', async () => {
      request.mockResolvedValue(guardado(TAXI, 3, 2, 1));

      await expect(controller.obtener('1', 7)).resolves.toEqual({
        ...TAXI,
        registros: { ingresos: 3, gastos: 2, documentos: 1 },
      });
      expect(request).toHaveBeenCalledWith(VEHICULO_DE_LA_CUENTA, { id: 1, usuarioId: 7 });
      expect(VEHICULO_DE_LA_CUENTA).toContain('usuario_id: { _eq: $usuarioId }');
    });

    it('responde 404 VEHICULO_NO_ENCONTRADO si no es de la cuenta', async () => {
      request.mockResolvedValue({ vehiculos: [] });
      await expect(rechazo(controller.obtener('1', 8))).resolves.toEqual(NO_ENCONTRADO);
    });

    it('si falta un conteo responde con un HasuraError (503), no con un vehículo sin registros', async () => {
      request.mockResolvedValue({ vehiculos: [{ ...TAXI, ingresos_aggregate: null }] });
      await expect(service.obtener(1, 7)).rejects.toBeInstanceOf(HasuraError);
    });

    it.each(['0', '-1', 'abc', '1.5', '01', '2147483648', '99999999999'])(
      'responde 400 DATOS_INVALIDOS con el id «%s», sin consultar Hasura',
      async (id) => {
        for (const llamada of [
          () => controller.obtener(id, 7),
          () => controller.actualizar(id, cambios({ marca: 'Otra' }), 7),
          () => controller.eliminar(id, 7),
        ]) {
          const { estado, cuerpo } = await rechazo(Promise.resolve().then(llamada));
          expect(estado).toBe(400);
          expect(cuerpo).toEqual({ codigo: 'DATOS_INVALIDOS', mensaje: 'El número del vehículo no es válido.' });
        }
        expect(request).not.toHaveBeenCalled();
      },
    );

    it('acepta el id más alto de la base', async () => {
      request.mockResolvedValue({ vehiculos: [] });
      await rechazo(controller.obtener('2147483647', 7));
      expect(request).toHaveBeenCalledWith(VEHICULO_DE_LA_CUENTA, { id: 2147483647, usuarioId: 7 });
    });
  });

  describe('crear', () => {
    it('arma el vehículo campo por campo, con la cuenta de la sesión y los valores por omisión', async () => {
      const creado = { ...PARTICULAR, id: 9, habilitado_indrive: false };
      request.mockResolvedValue({ insert_vehiculos_one: creado });
      // Aunque llegara un campo de más, el servicio no lo copia.
      const dto = nuevo({ placa: 'ABC123', marca: 'Vehículo de ejemplo', modelo: 'Particular', tipo: 'PARTICULAR' });
      Object.assign(dto, { usuario_id: 99, activo: false });

      await expect(controller.crear(dto, 7)).resolves.toEqual(creado);
      expect(request).toHaveBeenCalledWith(CREAR_VEHICULO, {
        vehiculo: {
          usuario_id: 7,
          placa: 'ABC123',
          marca: 'Vehículo de ejemplo',
          modelo: 'Particular',
          tipo: 'PARTICULAR',
          habilitado_indrive: false,
          conductor: null,
          cuota_diaria: null,
        },
      });
    });

    it.each([
      [{ tipo: 'TAXI' }, 'cuota_diaria', 'Un taxi necesita su cuota diaria.'],
      [{ tipo: 'TAXI', cuota_diaria: 0, habilitado_indrive: true }, 'habilitado_indrive', 'Un taxi no se habilita para inDrive.'],
      [{ tipo: 'PARTICULAR', cuota_diaria: 0 }, 'cuota_diaria', 'Un particular no lleva cuota diaria.'],
      [{ tipo: 'PARTICULAR', conductor: 'Alguien' }, 'conductor', 'Un particular no lleva conductor.'],
    ] as const)('responde 422 TIPO_INCOHERENTE sin llamar a Hasura (%o)', async (datos, campo, mensaje) => {
      const dto = nuevo({ placa: 'ABC123', marca: 'Marca', modelo: 'Modelo', ...datos });

      await expect(rechazo(service.crear(dto, 7))).resolves.toEqual({
        estado: 422,
        cuerpo: { codigo: 'TIPO_INCOHERENTE', mensaje, campos: { [campo]: mensaje } },
      });
      expect(request).not.toHaveBeenCalled();
    });

    it('un taxi con cuota 0 es válido: la cuota va de 0 en adelante', async () => {
      request.mockResolvedValue({ insert_vehiculos_one: { ...TAXI, cuota_diaria: 0 } });
      const dto = nuevo({ placa: 'XYZ789', marca: 'Marca', modelo: 'Modelo', tipo: 'TAXI', cuota_diaria: 0 });

      await expect(service.crear(dto, 7)).resolves.toMatchObject({ cuota_diaria: 0 });
    });

    it('traduce la placa repetida a 409 PLACA_REPETIDA, con el mensaje en su campo', async () => {
      request.mockRejectedValue(rechazoDeLaBase('vehiculos_usuario_id_placa_key'));
      const dto = nuevo({ placa: 'ABC123', marca: 'Marca', modelo: 'Modelo', tipo: 'PARTICULAR' });

      await expect(rechazo(service.crear(dto, 7))).resolves.toEqual({
        estado: 409,
        cuerpo: {
          codigo: 'PLACA_REPETIDA',
          mensaje: 'Ya tienes un vehículo con esa placa.',
          campos: { placa: 'Ya tienes un vehículo con esa placa.' },
        },
      });
    });

    it('cualquier otro rechazo de Hasura sigue como HasuraError (503)', async () => {
      const error = rechazoDeLaBase('vehiculos_check');
      request.mockRejectedValue(error);
      const dto = nuevo({ placa: 'ABC123', marca: 'Marca', modelo: 'Modelo', tipo: 'PARTICULAR' });

      await expect(service.crear(dto, 7)).rejects.toBe(error);
    });
  });

  describe('actualizar', () => {
    // Primero responde VehiculoDeLaCuenta y después ActualizarVehiculo.
    function hasuraCon(vehiculo: Vehiculo, ingresos = 0) {
      request.mockImplementation((query: string, variables: { cambios?: Partial<Vehiculo> }) =>
        Promise.resolve(
          query === VEHICULO_DE_LA_CUENTA
            ? guardado(vehiculo, ingresos)
            : { update_vehiculos: { affected_rows: 1, returning: [{ ...vehiculo, ...variables.cambios }] } },
        ),
      );
    }
    const enviado = () => request.mock.calls.find(([query]) => query === ACTUALIZAR_VEHICULO)?.[1] as unknown;

    it('junta lo guardado con lo nuevo y envía el vehículo completo, filtrado por la cuenta', async () => {
      hasuraCon(TAXI);

      await expect(controller.actualizar('1', cambios({ cuota_diaria: 65000 }), 7)).resolves.toMatchObject({ cuota_diaria: 65000 });
      expect(enviado()).toEqual({
        id: 1,
        usuarioId: 7,
        cambios: {
          placa: 'XYZ789',
          marca: 'Vehículo de ejemplo',
          modelo: 'Taxi',
          tipo: 'TAXI',
          habilitado_indrive: false,
          conductor: 'Conductor de ejemplo',
          cuota_diaria: 65000,
        },
      });
      expect(ACTUALIZAR_VEHICULO).toContain('usuario_id: { _eq: $usuarioId }');
    });

    it('un conductor en null lo quita; si no llega, se conserva', async () => {
      hasuraCon(TAXI);
      await service.actualizar(1, cambios({ conductor: null }), 7);
      expect(enviado()).toMatchObject({ cambios: { conductor: null } });

      request.mockReset();
      hasuraCon(TAXI);
      await service.actualizar(1, cambios({ marca: 'Otra marca' }), 7);
      expect(enviado()).toMatchObject({ cambios: { conductor: 'Conductor de ejemplo', marca: 'Otra marca' } });
    });

    it('revisa el resultado completo: un particular que pasa a taxi necesita su cuota', async () => {
      hasuraCon(PARTICULAR);

      await expect(rechazo(service.actualizar(2, cambios({ tipo: 'TAXI' }), 7))).resolves.toMatchObject({
        estado: 422,
        cuerpo: { codigo: 'TIPO_INCOHERENTE', campos: { cuota_diaria: 'Un taxi necesita su cuota diaria.' } },
      });
      expect(enviado()).toBeUndefined();
    });

    it.each([
      ['cambiar de tipo', TAXI, { tipo: 'PARTICULAR', cuota_diaria: null, conductor: null }],
      ['dejar de estar habilitado para inDrive', PARTICULAR, { habilitado_indrive: false }],
    ] as const)('con ingresos no puede %s: 409 VEHICULO_CON_INGRESOS', async (_, vehiculo, datos) => {
      hasuraCon(vehiculo, 1);

      await expect(rechazo(service.actualizar(vehiculo.id, cambios(datos), 7))).resolves.toEqual({
        estado: 409,
        cuerpo: {
          codigo: 'VEHICULO_CON_INGRESOS',
          mensaje: 'Este vehículo ya tiene ingresos: no puede cambiar de tipo ni dejar de estar habilitado para inDrive.',
        },
      });
      expect(enviado()).toBeUndefined();
    });

    it('con ingresos sí puede cambiar los demás datos', async () => {
      hasuraCon(TAXI, 4);
      await expect(service.actualizar(1, cambios({ placa: 'XYZ790', cuota_diaria: 70000 }), 7)).resolves.toMatchObject({
        placa: 'XYZ790',
        cuota_diaria: 70000,
      });
    });

    it('desactivar envía activo en false', async () => {
      hasuraCon(TAXI, 4);
      await expect(service.actualizar(1, cambios({ activo: false }), 7)).resolves.toMatchObject({ activo: false });
      expect(enviado()).toMatchObject({ cambios: { activo: false } });
    });

    it('si nada cambia, devuelve lo guardado sin escribir en Hasura', async () => {
      hasuraCon(TAXI);
      await expect(service.actualizar(1, cambios({ marca: TAXI.marca, cuota_diaria: TAXI.cuota_diaria }), 7)).resolves.toEqual(TAXI);
      expect(enviado()).toBeUndefined();
    });

    it('responde 404 si el vehículo no es de la cuenta, sin escribir', async () => {
      request.mockResolvedValue({ vehiculos: [] });
      await expect(rechazo(service.actualizar(1, cambios({ marca: 'Ajena' }), 8))).resolves.toEqual(NO_ENCONTRADO);
      expect(request).toHaveBeenCalledTimes(1);
    });

    it('responde 404 si el cambio afecta 0 filas: se eliminó entre la consulta y el cambio', async () => {
      request
        .mockResolvedValueOnce(guardado(TAXI))
        .mockResolvedValueOnce({ update_vehiculos: { affected_rows: 0, returning: [] } });
      await expect(rechazo(service.actualizar(1, cambios({ marca: 'Otra' }), 7))).resolves.toEqual(NO_ENCONTRADO);
    });

    it('traduce la placa repetida a 409 PLACA_REPETIDA', async () => {
      request.mockResolvedValueOnce(guardado(TAXI)).mockRejectedValueOnce(rechazoDeLaBase('vehiculos_usuario_id_placa_key'));
      await expect(rechazo(service.actualizar(1, cambios({ placa: 'ABC123' }), 7))).resolves.toMatchObject({
        estado: 409,
        cuerpo: { codigo: 'PLACA_REPETIDA' },
      });
    });

    it('con un formato inesperado responde con un HasuraError (503)', async () => {
      request.mockResolvedValueOnce(guardado(TAXI)).mockResolvedValueOnce({ update_vehiculos: null });
      await expect(service.actualizar(1, cambios({ marca: 'Otra' }), 7)).rejects.toBeInstanceOf(HasuraError);
    });
  });

  describe('eliminar', () => {
    it('sin registros elimina el vehículo de la cuenta', async () => {
      request.mockResolvedValueOnce(guardado(PARTICULAR)).mockResolvedValueOnce({ delete_vehiculos: { affected_rows: 1 } });

      await expect(controller.eliminar('2', 7)).resolves.toBeUndefined();
      expect(request).toHaveBeenLastCalledWith(ELIMINAR_VEHICULO, { id: 2, usuarioId: 7 });
      expect(ELIMINAR_VEHICULO).toContain('usuario_id: { _eq: $usuarioId }');
    });

    it.each([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ])('con registros (ingresos %i, gastos %i, documentos %i) responde 409 sin eliminar', async (ingresos, gastos, documentos) => {
      request.mockResolvedValue(guardado(TAXI, ingresos, gastos, documentos));

      await expect(rechazo(service.eliminar(1, 7))).resolves.toEqual({
        estado: 409,
        cuerpo: {
          codigo: 'VEHICULO_CON_REGISTROS',
          mensaje: 'Este vehículo tiene ingresos, gastos o documentos. Desactívalo para conservarlos.',
        },
      });
      expect(request).toHaveBeenCalledTimes(1);
    });

    it.each(['ingresos_vehiculo_id_fkey', 'gastos_vehiculo_id_fkey', 'documentos_vehiculo_id_fkey'])(
      'si la base lo rechaza por %s (un registro nuevo), también responde 409',
      async (restriccion) => {
        request.mockResolvedValueOnce(guardado(PARTICULAR)).mockRejectedValueOnce(rechazoDeLaBase(restriccion));
        await expect(rechazo(service.eliminar(2, 7))).resolves.toMatchObject({
          estado: 409,
          cuerpo: { codigo: 'VEHICULO_CON_REGISTROS' },
        });
      },
    );

    it('responde 404 si no es de la cuenta o si se eliminó entre la consulta y el cambio', async () => {
      request.mockResolvedValueOnce({ vehiculos: [] });
      await expect(rechazo(service.eliminar(2, 8))).resolves.toEqual(NO_ENCONTRADO);

      request.mockResolvedValueOnce(guardado(PARTICULAR)).mockResolvedValueOnce({ delete_vehiculos: { affected_rows: 0 } });
      await expect(rechazo(service.eliminar(2, 7))).resolves.toEqual(NO_ENCONTRADO);
    });

    it('cualquier otro error de Hasura sigue como HasuraError (503)', async () => {
      const caido = new HasuraError('UNAVAILABLE', 'Hasura no respondió.');
      request.mockResolvedValueOnce(guardado(PARTICULAR)).mockRejectedValueOnce(caido);
      await expect(service.eliminar(2, 7)).rejects.toBe(caido);
    });
  });
});
