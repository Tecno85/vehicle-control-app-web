import type {
  DatosVehiculo,
  Flota,
  Registros,
  Vehiculo,
  VehiculoConRegistros,
} from '../types/vehiculo.ts'
import { ApiError, requestJson } from './api-client.ts'

// Todas las rutas exigen sesión: cada función recibe el token de acceso, y las
// páginas las llaman a través de conSesion.

function esObjeto(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null
}

const esTextoONulo = (valor: unknown) => typeof valor === 'string' || valor === null

function esVehiculo(data: unknown): data is Vehiculo {
  return (
    esObjeto(data) &&
    Number.isInteger(data.id) &&
    typeof data.placa === 'string' &&
    typeof data.marca === 'string' &&
    typeof data.modelo === 'string' &&
    (data.tipo === 'TAXI' || data.tipo === 'PARTICULAR') &&
    typeof data.habilitado_indrive === 'boolean' &&
    esTextoONulo(data.conductor) &&
    (Number.isInteger(data.cuota_diaria) || data.cuota_diaria === null) &&
    typeof data.activo === 'boolean'
  )
}

function esRegistros(data: unknown): data is Registros {
  return (
    esObjeto(data) &&
    Number.isInteger(data.ingresos) &&
    Number.isInteger(data.gastos) &&
    Number.isInteger(data.documentos)
  )
}

function esFlota(data: unknown): data is Flota {
  if (!esObjeto(data) || !Array.isArray(data.vehiculos) || !esObjeto(data.conteos)) return false
  const { conteos } = data
  return (
    data.vehiculos.every(esVehiculo) &&
    Number.isInteger(conteos.vehiculos) &&
    Number.isInteger(conteos.taxis) &&
    Number.isInteger(conteos.particulares)
  )
}

function formatoInesperado(): ApiError {
  return new ApiError('core-service respondió, pero con un formato inesperado.')
}

function comoVehiculo(data: unknown): Vehiculo {
  if (!esVehiculo(data)) throw formatoInesperado()
  return data
}

export async function listarVehiculos(token: string): Promise<Flota> {
  const data = await requestJson('/vehiculos', { token })
  if (!esFlota(data)) throw formatoInesperado()
  return data
}

export async function obtenerVehiculo(id: string, token: string): Promise<VehiculoConRegistros> {
  const data = await requestJson(`/vehiculos/${encodeURIComponent(id)}`, { token })
  if (!esVehiculo(data) || !esRegistros((data as Partial<VehiculoConRegistros>).registros)) {
    throw formatoInesperado()
  }
  return data as VehiculoConRegistros
}

export async function crearVehiculo(datos: DatosVehiculo, token: string): Promise<Vehiculo> {
  return comoVehiculo(await requestJson('/vehiculos', { method: 'POST', body: datos, token }))
}

export async function actualizarVehiculo(
  id: number,
  datos: DatosVehiculo,
  token: string,
): Promise<Vehiculo> {
  return comoVehiculo(await requestJson(`/vehiculos/${id}`, { method: 'PATCH', body: datos, token }))
}

// Para un vehículo con registros: se conservan y deja de contar en la flota.
export async function desactivarVehiculo(id: number, token: string): Promise<Vehiculo> {
  return comoVehiculo(
    await requestJson(`/vehiculos/${id}`, { method: 'PATCH', body: { activo: false }, token }),
  )
}

// Solo para un vehículo sin registros; core-service responde 204, sin cuerpo.
export async function eliminarVehiculo(id: number, token: string): Promise<void> {
  await requestJson(`/vehiculos/${id}`, { method: 'DELETE', token })
}
