import { HttpException, type ValidationError } from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';
import { crearValidationPipe, erroresDeValidacion } from './validacion.js';

class PlacaDePrueba {
  @IsString({ message: 'Escribe la placa.' })
  @MaxLength(10, { message: 'La placa tiene hasta 10 caracteres.' })
  placa!: string;
}

const pipe = crearValidationPipe();
const comoCuerpo = (metatype: new () => unknown) =>
  ({ type: 'body', metatype }) as const;

async function rechazo(valor: unknown) {
  const error: unknown = await Promise.resolve()
    .then(() => pipe.transform(valor, comoCuerpo(PlacaDePrueba)))
    .catch((e: unknown) => e);
  expect(error).toBeInstanceOf(HttpException);
  return {
    estado: (error as HttpException).getStatus(),
    cuerpo: (error as HttpException).getResponse(),
  };
}

describe('validación de los DTO', () => {
  it('entrega una instancia del DTO cuando los datos cumplen las reglas', async () => {
    const dto: unknown = await pipe.transform({ placa: 'ABC123' }, comoCuerpo(PlacaDePrueba));

    expect(dto).toBeInstanceOf(PlacaDePrueba);
    expect(dto).toEqual({ placa: 'ABC123' });
  });

  it('responde 400 DATOS_INVALIDOS con un mensaje por campo', async () => {
    await expect(rechazo({})).resolves.toEqual({
      estado: 400,
      cuerpo: {
        codigo: 'DATOS_INVALIDOS',
        mensaje: 'Revisa los datos marcados.',
        campos: { placa: 'Escribe la placa.' },
      },
    });
  });

  it('rechaza un campo que el DTO no declara, como usuario_id', async () => {
    const { cuerpo } = await rechazo({ placa: 'ABC123', usuario_id: 2 });

    expect(cuerpo).toMatchObject({ campos: { usuario_id: 'Este campo no está permitido.' } });
  });

  it('no repite en la respuesta el valor enviado', async () => {
    const valor = 'valor-que-no-debe-volver';

    const { cuerpo } = await rechazo({ placa: valor });

    expect(cuerpo).toMatchObject({ campos: { placa: 'La placa tiene hasta 10 caracteres.' } });
    expect(JSON.stringify(cuerpo)).not.toContain(valor);
  });

  it('nombra los campos internos con su ruta, separada por puntos', () => {
    const errores: ValidationError[] = [
      {
        property: 'documento',
        children: [
          { property: 'vence_en', constraints: { isDateString: 'Escribe una fecha válida.' }, children: [] },
        ],
      },
    ];

    expect(erroresDeValidacion(errores).getResponse()).toMatchObject({
      campos: { 'documento.vence_en': 'Escribe una fecha válida.' },
    });
  });

  it('deja pasar sin cambios un cuerpo sin DTO, como el del ingreso', async () => {
    const cuerpo = { correo: 'titular@ejemplo.test', otro: 1 };

    await expect(pipe.transform(cuerpo, comoCuerpo(Object))).resolves.toBe(cuerpo);
  });
});
