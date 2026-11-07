import type { HealthResponse } from '../types/health.ts'

// Error con un mensaje listo para mostrar en pantalla.
export class HealthCheckError extends Error {}

function isHealthResponse(data: unknown): data is HealthResponse {
  if (typeof data !== 'object' || data === null) return false
  const value = data as Record<string, unknown>
  return value.status === 'ok' && typeof value.service === 'string'
}

export async function checkHealth(): Promise<HealthResponse> {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) {
    throw new HealthCheckError('Falta configurar VITE_API_URL en apps/web-app/.env.')
  }

  let response: Response
  try {
    response = await fetch(`${baseUrl}/health`)
  } catch {
    // fetch solo falla así cuando no hay respuesta: servicio detenido, dirección equivocada o CORS.
    throw new HealthCheckError(
      'No se pudo conectar con core-service. Revisa que esté en marcha y vuelve a intentarlo.',
    )
  }

  if (!response.ok) {
    throw new HealthCheckError(`core-service respondió con un error (HTTP ${response.status}).`)
  }

  const data: unknown = await response.json().catch(() => null)
  if (!isHealthResponse(data)) {
    throw new HealthCheckError('core-service respondió, pero con un formato inesperado.')
  }
  return data
}
