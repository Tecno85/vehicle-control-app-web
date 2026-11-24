// Mayor valor de una columna integer de PostgreSQL, como los id de la base.
const ID_MAXIMO = 2_147_483_647;

// Convierte un id escrito como texto (en la URL o en el token) en número.
// Devuelve null si no es un entero entre 1 y ID_MAXIMO, sin ceros a la izquierda.
export function leerId(texto: unknown): number | null {
  if (typeof texto !== 'string' || !/^[1-9]\d{0,9}$/.test(texto)) {
    return null;
  }
  const id = Number(texto);
  return id <= ID_MAXIMO ? id : null;
}
