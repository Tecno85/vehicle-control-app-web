// Cliente HTTP de la web-app hacia core-service. Reúne la dirección base y los
// errores comunes; cada archivo de src/api solo revisa la forma de su respuesta.

// Error con un mensaje listo para mostrar en pantalla.
export class ApiError extends Error {}

// Devuelve el cuerpo JSON, o null si no lo es.
export async function getJson(path: string): Promise<unknown> {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) {
    throw new ApiError('Falta configurar VITE_API_URL en apps/web-app/.env.')
  }

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`)
  } catch {
    // fetch solo falla así cuando no hay respuesta: servicio detenido, dirección equivocada o CORS.
    throw new ApiError(
      'No se pudo conectar con core-service. Revisa que esté en marcha y vuelve a intentarlo.',
    )
  }

  if (!response.ok) {
    throw new ApiError(`core-service respondió con un error (HTTP ${response.status}).`)
  }

  return response.json().catch(() => null)
}
