import { createContext, useContext } from 'react'
import type { Titular } from '../../types/sesion.ts'

// comprobando: al abrir la página, mientras se intenta renovar con la cookie.
// sin-conexion: core-service no respondió o falló al comprobarla; la cookie
// puede seguir vigente, así que no se pide la contraseña.
export type EstadoAcceso = 'comprobando' | 'con-sesion' | 'sin-sesion' | 'sin-conexion'

export interface Acceso {
  estado: EstadoAcceso
  titular: Titular | null
  // Mensaje para la página de ingreso después de cerrar la sesión o de que venza.
  aviso: string | null
  ingresar: (correo: string, contrasena: string) => Promise<void>
  // Falla si core-service no confirma el cierre: la cookie de renovación sigue
  // vigente, así que la sesión no se da por cerrada.
  cerrarSesion: () => Promise<void>
  // Vuelve a comprobar la sesión después de «sin-conexion».
  reintentar: () => void
  // Hace una petición con el token de acceso. Si core-service responde 401
  // SESION_REQUERIDA, renueva una vez y la repite; si no se puede renovar,
  // termina la sesión.
  conSesion: <T>(peticion: (token: string) => Promise<T>) => Promise<T>
}

export const AccesoContext = createContext<Acceso | null>(null)

export function useAcceso(): Acceso {
  const acceso = useContext(AccesoContext)
  if (!acceso) throw new Error('useAcceso necesita un AccesoProvider.')
  return acceso
}
