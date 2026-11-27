import { HttpException } from '@nestjs/common';
import type { HasuraService } from '../hasura/hasura.service.js';
import type { CrearIngresoDto } from './dto/crear-ingreso.dto.js';
import { CREAR_INGRESO, VEHICULO_PARA_INGRESO } from './ingresos.graphql.js';
import { IngresosService } from './ingresos.service.js';

const TAXI = { id: 1, activo: true, tipo: 'TAXI' as const, habilitado_indrive: false, cuota_diaria: 60000 };
const INDRIVE = { id: 2, activo: true, tipo: 'PARTICULAR' as const, habilitado_indrive: true, cuota_diaria: null };

async function rechazo(promesa: Promise<unknown>) {
  const error: unknown = await promesa.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(HttpException);
  return (error as HttpException).getResponse();
}

describe('ingresos', () => {
  const request = vi.fn();
  const service = new IngresosService({ request } as unknown as HasuraService);
  const dto = (datos: Partial<CrearIngresoDto>) => datos as CrearIngresoDto;

  beforeEach(() => request.mockReset());

  it('toma del taxi el tipo y la cuota de referencia; nunca los acepta del navegador', async () => {
    request.mockImplementation((query: string) => query === VEHICULO_PARA_INGRESO
      ? Promise.resolve({ vehiculos: [TAXI] })
      : Promise.resolve({ insert_ingresos_one: { id: 1, vehiculo_id: 1, tipo: 'TAXI', fecha: '2026-11-25', valor: 60000, cuota_referencia: 60000, motivo: null, nota: null } }));

    await expect(service.crear(1, dto({ fecha: '2026-11-25', valor: 60000 }), 7)).resolves.toMatchObject({ tipo: 'TAXI', cuota_referencia: 60000 });
    expect(request).toHaveBeenLastCalledWith(CREAR_INGRESO, { ingreso: {
      vehiculo_id: 1, tipo: 'TAXI', fecha: '2026-11-25', valor: 60000,
      cuota_referencia: 60000, motivo: null, nota: null,
    } });
  });

  it.each([
    ['taxi con valor distinto y sin motivo', TAXI, { fecha: '2026-11-25', valor: 0 }, 'MOTIVO_REQUERIDO'],
    ['particular sin inDrive', { ...INDRIVE, habilitado_indrive: false }, { fecha: '2026-11-25', valor: 50000 }, 'VEHICULO_SIN_INDRIVE'],
    ['vehículo desactivado', { ...TAXI, activo: false }, { fecha: '2026-11-25', valor: 60000 }, 'VEHICULO_INACTIVO'],
    ['fecha futura', TAXI, { fecha: '2099-01-01', valor: 60000 }, 'FECHA_FUTURA'],
  ] as const)('rechaza %s antes de guardar', async (_, vehiculo, datos, codigo) => {
    request.mockResolvedValue({ vehiculos: [vehiculo] });
    await expect(rechazo(service.crear(vehiculo.id, dto(datos), 7))).resolves.toMatchObject({ codigo });
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('crea inDrive sin cuota y permite una nota', async () => {
    request.mockImplementation((query: string) => query === VEHICULO_PARA_INGRESO
      ? Promise.resolve({ vehiculos: [INDRIVE] })
      : Promise.resolve({ insert_ingresos_one: { id: 2, vehiculo_id: 2, tipo: 'INDRIVE', fecha: '2026-11-25', valor: 45000, cuota_referencia: null, motivo: null, nota: 'Turno completo' } }));
    await service.crear(2, dto({ fecha: '2026-11-25', valor: 45000, nota: 'Turno completo' }), 7);
    expect(request).toHaveBeenLastCalledWith(CREAR_INGRESO, { ingreso: expect.objectContaining({ tipo: 'INDRIVE', cuota_referencia: null, nota: 'Turno completo' }) });
  });
});
