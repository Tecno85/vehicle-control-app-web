import type { Titular } from '../types/sesion.ts'
import { ApiError, requestJson } from './api-client.ts'
import { isTitular } from './sesion.api.ts'

export async function obtenerPerfil(token: string): Promise<Titular> {
  const data = await requestJson('/perfil', { token })
  if (!isTitular(data)) {
    throw new ApiError('core-service respondió, pero con un formato inesperado.')
  }
  return { nombre: data.nombre, correo: data.correo }
}
