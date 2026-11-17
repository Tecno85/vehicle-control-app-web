import type { HealthResponse } from '../types/health.ts'
import { ApiError, getJson } from './api-client.ts'

// El panel de verificación usa este nombre; es el mismo error del cliente HTTP.
export { ApiError as HealthCheckError }

function isHealthResponse(data: unknown): data is HealthResponse {
  if (typeof data !== 'object' || data === null) return false
  const value = data as Record<string, unknown>
  return value.status === 'ok' && typeof value.service === 'string'
}

export async function checkHealth(): Promise<HealthResponse> {
  const data = await getJson('/health')
  if (!isHealthResponse(data)) {
    throw new ApiError('core-service respondió, pero con un formato inesperado.')
  }
  return data
}
