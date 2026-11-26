// Valores aprobados por Ivan para la sesión (evidencia de sesión 9, apartado 3).
export const DURACION_ACCESO_SEGUNDOS = 15 * 60;
export const DURACION_RENOVACION_MS = 7 * 24 * 60 * 60 * 1000;
export const LIMITE_TOTAL_MS = 30 * 24 * 60 * 60 * 1000;
export const INTENTOS_INGRESO_POR_MINUTO = 5;

// Aprobado por Ivan para la sesión 10 (paso 0): una cuenta desactivada deja de
// recibir datos en 1 minuto como máximo, aunque su token siga vigente.
export const MEMORIA_CUENTA_ACTIVA_MS = 60 * 1000;
