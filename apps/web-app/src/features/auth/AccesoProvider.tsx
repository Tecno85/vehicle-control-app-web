import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ApiError } from '../../api/api-client.ts'
import {
  cerrarSesion as cerrarSesionApi,
  ingresar as ingresarApi,
  renovarSesion,
} from '../../api/sesion.api.ts'
import type { SesionIniciada, Titular } from '../../types/sesion.ts'
import { AccesoContext, type Acceso, type EstadoAcceso } from './acceso-context.ts'

const SESION_TERMINADA = 'Tu sesión terminó. Vuelve a ingresar.'
const LLAVE_SESION = 'control-vehicular-sesion'

// Si la misma renovación llega dos veces a core-service, este cierra ese ingreso.
// navigator.locks hace esperar a las demás pestañas mientras una renueva o cierra.
function enOrden<T>(tarea: () => Promise<T>): Promise<T> {
  if (!('locks' in navigator)) return tarea()
  return navigator.locks.request(LLAVE_SESION, () => tarea())
}

function esNoAutorizado(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401
}

// El 401 del guard de core-service, que rechaza el token antes de hacer nada.
// Solo ese se puede repetir sin riesgo de hacer dos veces la misma acción.
function esSesionRequerida(error: unknown): boolean {
  return esNoAutorizado(error) && (error as ApiError).codigo === 'SESION_REQUERIDA'
}

export function AccesoProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoAcceso>('comprobando')
  const [titular, setTitular] = useState<Titular | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  // El token de acceso vive solo en memoria, nunca en localStorage ni sessionStorage.
  // Al recargar se pierde, y la cookie de renovación trae uno nuevo.
  const token = useRef<string | null>(null)
  // Una sola renovación a la vez dentro de la pestaña: en desarrollo, StrictMode
  // ejecuta dos veces el efecto de abajo.
  const renovacionEnCurso = useRef<Promise<string> | null>(null)

  const abrir = useCallback((sesion: SesionIniciada) => {
    token.current = sesion.tokenAcceso
    setTitular(sesion.titular)
    setAviso(null)
    setEstado('con-sesion')
  }, [])

  const terminar = useCallback((mensaje: string | null) => {
    token.current = null
    setTitular(null)
    setAviso(mensaje)
    setEstado('sin-sesion')
  }, [])

  const renovar = useCallback((): Promise<string> => {
    renovacionEnCurso.current ??= enOrden(renovarSesion)
      .then((sesion) => {
        abrir(sesion)
        return sesion.tokenAcceso
      })
      .finally(() => {
        renovacionEnCurso.current = null
      })
    return renovacionEnCurso.current
  }, [abrir])

  // Si la cookie de renovación sigue vigente, la sesión continúa sin pedir la
  // contraseña. Un 401 quiere decir que no hay sesión y lleva a la página de
  // ingreso; cualquier otra falla (sin conexión, tiempo agotado o Hasura
  // caído) no dice nada de la sesión, así que se ofrece reintentar.
  const comprobar = useCallback(() => {
    renovar().catch((error: unknown) => {
      if (esNoAutorizado(error)) terminar(null)
      else setEstado('sin-conexion')
    })
  }, [renovar, terminar])

  // Al abrir la página.
  useEffect(() => {
    comprobar()
  }, [comprobar])

  const reintentar = useCallback(() => {
    setEstado('comprobando')
    comprobar()
  }, [comprobar])

  const conSesion = useCallback(
    async <T,>(peticion: (token: string) => Promise<T>): Promise<T> => {
      if (token.current) {
        try {
          return await peticion(token.current)
        } catch (error) {
          if (!esSesionRequerida(error)) throw error
        }
      }
      // El token de acceso dura 15 minutos: si venció, se renueva una vez y se repite.
      try {
        return await peticion(await renovar())
      } catch (error) {
        if (esNoAutorizado(error)) terminar(SESION_TERMINADA)
        throw error
      }
    },
    [renovar, terminar],
  )

  const ingresar = useCallback(
    async (correo: string, contrasena: string) => {
      abrir(await ingresarApi(correo, contrasena))
    },
    [abrir],
  )

  // Si core-service no confirma, el error llega a quien llamó: borrar solo el
  // token de memoria dejaría la cookie vigente, y al recargar la sesión volvería.
  const cerrarSesion = useCallback(async () => {
    await enOrden(cerrarSesionApi)
    terminar('Cerraste tu sesión.')
  }, [terminar])

  const valor = useMemo<Acceso>(
    () => ({ estado, titular, aviso, ingresar, cerrarSesion, reintentar, conSesion }),
    [estado, titular, aviso, ingresar, cerrarSesion, reintentar, conSesion],
  )

  return <AccesoContext value={valor}>{children}</AccesoContext>
}
