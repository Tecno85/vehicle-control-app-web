import { Navigate, Outlet } from 'react-router'
import { useAcceso } from './acceso-context.ts'
import { CargandoSesion } from './CargandoSesion.tsx'

// La web-app solo protege la navegación: quien impone el acceso es core-service,
// que revisa el token en cada petición.
export function RutaProtegida() {
  const { estado } = useAcceso()
  if (estado === 'comprobando' || estado === 'sin-conexion') return <CargandoSesion />
  if (estado === 'sin-sesion') return <Navigate to="/ingresar" replace />
  return <Outlet />
}
