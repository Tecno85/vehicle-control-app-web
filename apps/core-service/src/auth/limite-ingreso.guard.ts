import { HttpStatus, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { errorApi } from '../common/errores.js';

// Cuenta los intentos de ingreso por dirección, en memoria. Si core-service se
// reinicia, la cuenta empieza de cero: basta para una sola instancia local.
@Injectable()
export class LimiteIngresoGuard extends ThrottlerGuard {
  protected override throwThrottlingException(): Promise<void> {
    throw errorApi(
      HttpStatus.TOO_MANY_REQUESTS,
      'DEMASIADOS_INTENTOS',
      'Hiciste demasiados intentos. Espera un minuto y vuelve a intentarlo.',
    );
  }
}
