import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../api/api-client.ts'
import { obtenerVehiculo } from '../../api/vehiculos.api.ts'
import type { VehiculoConRegistros } from '../../types/vehiculo.ts'
import { useAcceso } from '../auth/acceso-context.ts'

export type EstadoDatos = 'cargando' | 'listo' | 'error'

export interface DatosRemotos<T> {
  estado: EstadoDatos
  // Mientras se recargan, siguen los datos anteriores: así la página no
  // desaparece ni pierde el foco en cada recarga.
  datos: T | null
  error: ApiError | null
  recargar: () => void
}

interface Respuesta<T> {
  cargar: (token: string) => Promise<T>
  version: number
  datos: T | null
  error: ApiError | null
}

// Datos que vienen de core-service, separados del estado de los formularios.
// `cargar` debe ser estable (una función del módulo o un useCallback): si
// cambia, por ejemplo con otro id, se vuelve a cargar desde cero.
export function useDatosRemotos<T>(cargar: (token: string) => Promise<T>): DatosRemotos<T> {
  const { conSesion } = useAcceso()
  const [version, setVersion] = useState(0)
  const [respuesta, setRespuesta] = useState<Respuesta<T> | null>(null)

  useEffect(() => {
    let vigente = true
    conSesion(cargar).then(
      (datos) => {
        if (vigente) setRespuesta({ cargar, version, datos, error: null })
      },
      (error: unknown) => {
        if (vigente) setRespuesta({ cargar, version, datos: null, error: comoApiError(error) })
      },
    )
    return () => {
      vigente = false
    }
  }, [conSesion, cargar, version])

  const recargar = useCallback(() => setVersion((anterior) => anterior + 1), [])

  // Cada respuesta guarda con qué `cargar` y qué versión se pidió; así se sabe
  // si es la actual sin cambiar el estado dentro del efecto.
  const propia = respuesta?.cargar === cargar ? respuesta : null
  const alDia = propia?.version === version
  return {
    estado: !alDia ? 'cargando' : propia.error ? 'error' : 'listo',
    datos: propia?.datos ?? null,
    error: alDia ? propia.error : null,
    recargar,
  }
}

// Un vehículo de la cuenta con sus conteos de registros, para el detalle y la edición.
export function useVehiculo(id: string): DatosRemotos<VehiculoConRegistros> {
  const cargar = useCallback((token: string) => obtenerVehiculo(id, token), [id])
  return useDatosRemotos(cargar)
}

export function comoApiError(error: unknown): ApiError {
  return error instanceof ApiError
    ? error
    : new ApiError('Ocurrió un error inesperado. Vuelve a intentarlo.')
}
