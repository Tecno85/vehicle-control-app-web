import { SetMetadata } from '@nestjs/common';

export const ES_PUBLICO = 'esPublico';

// Marca una ruta que no exige sesión. Todas las demás la exigen: SesionGuard se
// aplica a toda la API, así que una ruta nueva queda protegida si nadie la marca.
export const Publico = () => SetMetadata(ES_PUBLICO, true);
