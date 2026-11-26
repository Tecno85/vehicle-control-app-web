import {
  HttpStatus,
  ValidationPipe,
  type HttpException,
  type ValidationError,
} from '@nestjs/common';
import { errorApi } from './errores.js';

const CAMPO_NO_PERMITIDO = 'Este campo no está permitido.';

// Valida los cuerpos que llegan como DTO (una clase con reglas de
// class-validator). Los que se reciben como `unknown`, como el del ingreso, no
// pasan por aquí: su controlador los revisa.
// - whitelist y forbidNonWhitelisted: un campo que el DTO no declara, como
//   usuario_id, responde 400 en lugar de llegar al servicio.
// - transform: el controlador recibe una instancia del DTO, ya limpia.
export function crearValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: erroresDeValidacion,
  });
}

// Un 400 DATOS_INVALIDOS con un mensaje por campo, para mostrarlo debajo de cada
// uno. Los mensajes salen de las reglas del DTO: nunca repiten el valor enviado.
export function erroresDeValidacion(errores: ValidationError[]): HttpException {
  const campos: Record<string, string> = {};
  juntarCampos(errores, '', campos);
  return errorApi(
    HttpStatus.BAD_REQUEST,
    'DATOS_INVALIDOS',
    'Revisa los datos marcados.',
    campos,
  );
}

function juntarCampos(
  errores: ValidationError[],
  prefijo: string,
  campos: Record<string, string>,
): void {
  for (const error of errores) {
    const campo = `${prefijo}${error.property}`;
    const reglas = error.constraints ?? {};
    if (reglas.whitelistValidation) {
      campos[campo] = CAMPO_NO_PERMITIDO;
    } else {
      // Basta un mensaje por campo: la titular corrige un problema a la vez.
      // class-validator revisa las reglas de abajo hacia arriba, así que el
      // último mensaje es el de la regla escrita más arriba en el DTO. Allí va
      // la más básica: que el campo exista y sea del tipo correcto.
      const mensaje = Object.values(reglas).at(-1);
      if (mensaje) {
        campos[campo] = mensaje;
      }
    }
    juntarCampos(error.children ?? [], `${campo}.`, campos);
  }
}
