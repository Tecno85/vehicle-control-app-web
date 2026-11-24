import { HttpException } from '@nestjs/common';
import type { HasuraService } from '../hasura/hasura.service.js';
import { VehiculosController } from './vehiculos.controller.js';
import { VEHICULO_DE_LA_CUENTA, VehiculosService } from './vehiculos.service.js';

const XYZ789 = {
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

async function rechazo(promesa: Promise<unknown>) {
  const error: unknown = await promesa.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(HttpException);
  return {
    estado: (error as HttpException).getStatus(),
    cuerpo: (error as HttpException).getResponse(),
  };
}

describe('vehículos', () => {
  const request = vi.fn();
  const service = new VehiculosService({ request } as unknown as HasuraService);
  const controller = new VehiculosController(service);

  beforeEach(() => request.mockReset());

  it('busca el vehículo con el id y la cuenta de la sesión', async () => {
    request.mockResolvedValue({ vehiculos: [XYZ789] });

    await expect(controller.obtener('1', 7)).resolves.toEqual(XYZ789);
    expect(request).toHaveBeenCalledWith(VEHICULO_DE_LA_CUENTA, { id: 1, usuarioId: 7 });
    expect(VEHICULO_DE_LA_CUENTA).toContain('usuario_id: { _eq: $usuarioId }');
  });

  it('responde 404 VEHICULO_NO_ENCONTRADO si no es de la cuenta', async () => {
    request.mockResolvedValue({ vehiculos: [] });

    await expect(rechazo(controller.obtener('1', 8))).resolves.toEqual({
      estado: 404,
      cuerpo: {
        codigo: 'VEHICULO_NO_ENCONTRADO',
        mensaje: 'No encontramos ese vehículo en tu cuenta.',
      },
    });
  });

  it.each(['0', '-1', 'abc', '1.5', '01', '2147483648', '99999999999'])(
    'responde 400 DATOS_INVALIDOS con el id «%s», sin consultar Hasura',
    async (id) => {
      const { estado, cuerpo } = await rechazo(
        Promise.resolve().then(() => controller.obtener(id, 7)),
      );
      expect(estado).toBe(400);
      expect(cuerpo).toMatchObject({ codigo: 'DATOS_INVALIDOS' });
      expect(request).not.toHaveBeenCalled();
    },
  );

  it('acepta el id más alto de la base', async () => {
    request.mockResolvedValue({ vehiculos: [] });
    await rechazo(controller.obtener('2147483647', 7));
    expect(request).toHaveBeenCalledWith(VEHICULO_DE_LA_CUENTA, { id: 2147483647, usuarioId: 7 });
  });
});
