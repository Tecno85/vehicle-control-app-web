import { createContext, useContext } from 'react'
import type { Titular } from '../../types/sesion.ts'

// comprobando: al abrir la página, mientras se intenta renovar con la cookie.
export type EstadoAcceso = 'comprobando' | 'con-sesion' | 'sin-sesion'

export interface Acceso {
  estado: EstadoAcceso
  titular: Titular | null
  // Mensaje para la página de ingreso después de cerrar la sesión o de que venza.
  aviso: string | null
  ingresar: (correo: string, contrasena: string) => Promise<void>
  cerrarSesion: () => Promise<void>
  // Hace una petición con el token de acceso. Si core-service responde 401,
  // renueva una vez y la repite; si no se puede renovar, termina la sesión.
  conSesion: <T>(peticion: (token: string) => Promise<T>) => Promise<T>
}

export const AccesoContext = createContext<Acceso | null>(null)

export function useAcceso(): Acceso {
  const acceso = useContext(AccesoContext)
  if (!acceso) throw new Error('useAcceso necesita un AccesoProvider.')
  return acceso
}
