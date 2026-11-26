import { HttpException } from '@nestjs/common';
import { crearValidationPipe } from '../../common/validacion.js';
import { ActualizarVehiculoDto } from './actualizar-vehiculo.dto.js';
import { CrearVehiculoDto } from './crear-vehiculo.dto.js';

// Se prueban con el mismo ValidationPipe global de configure-app.ts.
const pipe = crearValidationPipe();
const validar = (valor: unknown, metatype: new () => unknown): Promise<unknown> =>
  Promise.resolve().then(() => pipe.transform(valor, { type: 'body', metatype }));

async function campos(valor: unknown, metatype: new () => unknown) {
  const error: unknown = await validar(valor, metatype).catch((e: unknown) => e);
  expect(error).toBeInstanceOf(HttpException);
  expect((error as HttpException).getStatus()).toBe(400);
  const cuerpo = (error as HttpException).getResponse() as { codigo: string; campos: Record<string, string> };
  expect(cuerpo.codigo).toBe('DATOS_INVALIDOS');
  return cuerpo.campos;
}

const TAXI = { placa: 'TLV144', marca: 'Marca de ejemplo', modelo: '2014', tipo: 'TAXI', cuota_diaria: 70000 };

describe('DTO para crear un vehículo', () => {
  it('limpia la placa, la marca, el modelo y el conductor', async () => {
    const dto = await validar(
      { ...TAXI, placa: ' tlv 144 ', marca: '  Marca de ejemplo ', modelo: ' 2014 ', conductor: '   ' },
      CrearVehiculoDto,
    );

    expect(dto).toBeInstanceOf(CrearVehiculoDto);
    expect(dto).toMatchObject({ placa: 'TLV144', marca: 'Marca de ejemplo', modelo: '2014', conductor: null });
  });

  it.each(['usuario_id', 'id', 'activo', 'creado_en'])('rechaza el campo reservado %s', async (campo) => {
    await expect(campos({ ...TAXI, [campo]: 1 }, CrearVehiculoDto)).resolves.toEqual({
      [campo]: 'Este campo no está permitido.',
    });
  });

  it('pide los campos obligatorios con el mensaje de la regla básica', async () => {
    await expect(campos({}, CrearVehiculoDto)).resolves.toEqual({
      placa: 'Escribe la placa.',
      marca: 'Escribe la marca.',
      modelo: 'Escribe el modelo.',
      tipo: 'Elige si es taxi o particular.',
    });
  });

  it.each([
    [{ placa: 'ABC-123' }, 'placa', 'La placa lleva solo letras y números, hasta 10.'],
    [{ placa: 'ABCDEFGHIJK' }, 'placa', 'La placa lleva solo letras y números, hasta 10.'],
    [{ placa: '   ' }, 'placa', 'Escribe la placa.'],
    [{ placa: 123 }, 'placa', 'Escribe la placa.'],
    [{ marca: 'm'.repeat(61) }, 'marca', 'La marca tiene hasta 60 caracteres.'],
    [{ modelo: 'm'.repeat(61) }, 'modelo', 'El modelo tiene hasta 60 caracteres.'],
    [{ tipo: 'taxi' }, 'tipo', 'Elige si es taxi o particular.'],
    [{ habilitado_indrive: null }, 'habilitado_indrive', 'Indica si está habilitado para inDrive.'],
    [{ habilitado_indrive: 'true' }, 'habilitado_indrive', 'Indica si está habilitado para inDrive.'],
    [{ conductor: 'c'.repeat(81) }, 'conductor', 'El nombre del conductor tiene hasta 80 caracteres.'],
    [{ conductor: 5 }, 'conductor', 'Escribe el nombre del conductor.'],
    [{ cuota_diaria: 1.5 }, 'cuota_diaria', 'Escribe la cuota en pesos, sin decimales.'],
    [{ cuota_diaria: '70000' }, 'cuota_diaria', 'Escribe la cuota en pesos, sin decimales.'],
    [{ cuota_diaria: -1 }, 'cuota_diaria', 'La cuota no puede ser negativa.'],
    [{ cuota_diaria: 2_147_483_648 }, 'cuota_diaria', 'La cuota es demasiado alta.'],
  ])('%o → %s: «%s»', async (cambio, campo, mensaje) => {
    await expect(campos({ ...TAXI, ...cambio }, CrearVehiculoDto)).resolves.toEqual({ [campo]: mensaje });
  });

  it('acepta los límites: placa de 10, marca de 60, conductor de 80 y cuota 0', async () => {
    await expect(
      validar({ ...TAXI, placa: 'ABCDE12345', marca: 'm'.repeat(60), conductor: 'c'.repeat(80), cuota_diaria: 0 }, CrearVehiculoDto),
    ).resolves.toMatchObject({ placa: 'ABCDE12345', cuota_diaria: 0 });
  });
});

describe('DTO para editar un vehículo', () => {
  it('acepta un cambio parcial y limpia la placa igual que al crear', async () => {
    const dto = await validar({ placa: ' xyz 790' }, ActualizarVehiculoDto);

    expect(dto).toBeInstanceOf(ActualizarVehiculoDto);
    expect(dto).toMatchObject({ placa: 'XYZ790' });
  });

  it('el conductor y la cuota pueden llegar en null, que quiere decir «sin»', async () => {
    await expect(validar({ conductor: null, cuota_diaria: null }, ActualizarVehiculoDto)).resolves.toMatchObject({
      conductor: null,
      cuota_diaria: null,
    });
  });

  it('la placa, la marca, el modelo, el tipo e inDrive no pueden llegar en null', async () => {
    const nulos = { placa: null, marca: null, modelo: null, tipo: null, habilitado_indrive: null };
    await expect(campos(nulos, ActualizarVehiculoDto)).resolves.toEqual({
      placa: 'Escribe la placa.',
      marca: 'Escribe la marca.',
      modelo: 'Escribe el modelo.',
      tipo: 'Elige si es taxi o particular.',
      habilitado_indrive: 'Indica si está habilitado para inDrive.',
    });
  });

  it('activo solo acepta false: reactivar sigue por definir', async () => {
    await expect(validar({ activo: false }, ActualizarVehiculoDto)).resolves.toMatchObject({ activo: false });
    await expect(campos({ activo: true }, ActualizarVehiculoDto)).resolves.toEqual({
      activo: 'Por ahora un vehículo desactivado no se puede reactivar.',
    });
    await expect(campos({ activo: 'false' }, ActualizarVehiculoDto)).resolves.toEqual({
      activo: 'Indica si el vehículo sigue activo.',
    });
  });

  it.each(['usuario_id', 'id', 'creado_en'])('rechaza el campo reservado %s', async (campo) => {
    await expect(campos({ marca: 'Otra', [campo]: 2 }, ActualizarVehiculoDto)).resolves.toEqual({
      [campo]: 'Este campo no está permitido.',
    });
  });
});
