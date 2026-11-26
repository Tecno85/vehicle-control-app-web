// Cliente HTTP de la web-app hacia core-service. Reúne la dirección base y los
// errores comunes; cada archivo de src/api solo revisa la forma de su respuesta.

// Error con un mensaje listo para mostrar en pantalla. Si core-service respondió,
// guarda el estado HTTP y su código, para que cada pantalla decida qué hacer, y
// los mensajes por campo de un formulario rechazado.
export class ApiError extends Error {
  readonly status?: number
  readonly codigo?: string
  readonly campos?: Record<string, string>

  constructor(message: string, status?: number, codigo?: string, campos?: Record<string, string>) {
    super(message)
    this.status = status
    this.codigo = codigo
    this.campos = campos
  }
}

// Sin un límite, una petición colgada dejaría la página esperando y, con el
// bloqueo entre pestañas de AccesoProvider, también frenaría a las demás.
const TIEMPO_LIMITE_MS = 15_000

interface OpcionesPeticion {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
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
      // La cookie de renovación solo se usa en /sesion; las demás rutas no envían cookies.
      credentials: path.startsWith('/sesion') ? 'include' : 'omit',
      signal: AbortSignal.timeout(TIEMPO_LIMITE_MS),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError('core-service no respondió a tiempo. Vuelve a intentarlo.')
    }
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
      error ? camposDe(error) : undefined,
    )
  }
  return data
}

function isApiErrorBody(data: unknown): data is { codigo: string; mensaje: string; campos?: unknown } {
  if (typeof data !== 'object' || data === null) return false
  const value = data as Record<string, unknown>
  return typeof value.codigo === 'string' && typeof value.mensaje === 'string'
}

// Solo los mensajes de texto: si `campos` no tiene la forma esperada, se ignora.
function camposDe({ campos }: { campos?: unknown }): Record<string, string> | undefined {
  if (typeof campos !== 'object' || campos === null) return undefined
  const mensajes = Object.entries(campos).filter(
    (entrada): entrada is [string, string] => typeof entrada[1] === 'string',
  )
  return mensajes.length > 0 ? Object.fromEntries(mensajes) : undefined
}
