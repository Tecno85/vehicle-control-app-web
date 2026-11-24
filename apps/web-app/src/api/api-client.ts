// Cliente HTTP de la web-app hacia core-service. Reúne la dirección base y los
// errores comunes; cada archivo de src/api solo revisa la forma de su respuesta.

// Error con un mensaje listo para mostrar en pantalla. Si core-service respondió,
// guarda el estado HTTP y su código, para que cada pantalla decida qué hacer.
export class ApiError extends Error {
  readonly status?: number
  readonly codigo?: string

  constructor(message: string, status?: number, codigo?: string) {
    super(message)
    this.status = status
    this.codigo = codigo
  }
}

interface OpcionesPeticion {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  token?: string
}

// Devuelve el cuerpo JSON, o null si no hay cuerpo o no es JSON.
export async function requestJson(
  path: string,
  { method = 'GET', body, token }: OpcionesPeticion = {},
): Promise<unknown> {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) {
    throw new ApiError('Falta configurar VITE_API_URL en apps/web-app/.env.')
  }

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      // La cookie de renovación solo se usa en /sesion; las demás rutas no la necesitan.
      credentials: path.startsWith('/sesion') ? 'include' : 'same-origin',
    })
  } catch {
    // fetch solo falla así cuando no hay respuesta: servicio detenido, dirección equivocada o CORS.
    throw new ApiError(
      'No se pudo conectar con core-service. Revisa que esté en marcha y vuelve a intentarlo.',
    )
  }

  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    // Los errores de core-service traen { codigo, mensaje }; el mensaje ya está escrito para la usuaria.
    const error = isApiErrorBody(data) ? data : undefined
    throw new ApiError(
      error?.mensaje ?? `core-service respondió con un error (HTTP ${response.status}).`,
      response.status,
      error?.codigo,
    )
  }
  return data
}

export function getJson(path: string): Promise<unknown> {
  return requestJson(path)
}

function isApiErrorBody(data: unknown): data is { codigo: string; mensaje: string } {
  if (typeof data !== 'object' || data === null) return false
  const value = data as Record<string, unknown>
  return typeof value.codigo === 'string' && typeof value.mensaje === 'string'
}
