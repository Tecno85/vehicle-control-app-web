import type { SesionIniciada, Titular } from '../types/sesion.ts'
import { ApiError, requestJson } from './api-client.ts'

export function isTitular(data: unknown): data is Titular {
  if (typeof data !== 'object' || data === null) return false
  const value = data as Record<string, unknown>
  return typeof value.nombre === 'string' && typeof value.correo === 'string'
}

function toSesion(data: unknown): SesionIniciada {
  const value = (typeof data === 'object' && data !== null ? data : {}) as Record<string, unknown>
  if (typeof value.token_acceso !== 'string' || !isTitular(value.titular)) {
    throw new ApiError('core-service respondió, pero con un formato inesperado.')
  }
  return { tokenAcceso: value.token_acceso, titular: value.titular }
}

export async function ingresar(correo: string, contrasena: string): Promise<SesionIniciada> {
  return toSesion(await requestJson('/sesion', { method: 'POST', body: { correo, contrasena } }))
}

// Usa la cookie de renovación, que el navegador envía solo; la web-app no puede leerla.
export async function renovarSesion(): Promise<SesionIniciada> {
  return toSesion(await requestJson('/sesion/renovar', { method: 'POST' }))
}

export async function cerrarSesion(): Promise<void> {
  await requestJson('/sesion', { method: 'DELETE' })
}
