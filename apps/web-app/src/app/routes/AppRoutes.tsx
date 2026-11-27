import { Navigate, Route, Routes } from 'react-router'
import { PaginaIngreso } from '../../features/auth/PaginaIngreso.tsx'
import { RutaProtegida } from '../../features/auth/RutaProtegida.tsx'
import {
  PaginaEditarVehiculo,
  PaginaNuevoVehiculo,
} from '../../features/vehiculos/PaginaFormularioVehiculo.tsx'
import { PaginaFlota } from '../../features/vehiculos/PaginaFlota.tsx'
import { PaginaVehiculo } from '../../features/vehiculos/PaginaVehiculo.tsx'
import { PaginaIngresos } from '../../features/vehiculos/PaginaIngresos.tsx'

// /ingresar es pública; las páginas dentro de RutaProtegida exigen sesión.
// Las rutas de vehículos son las que propuso la evidencia de sesión 3. La flota
// es el inicio: / y cualquier otra dirección llevan a /vehiculos.
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/ingresar" element={<PaginaIngreso />} />
      <Route element={<RutaProtegida />}>
        <Route path="/vehiculos" element={<PaginaFlota />} />
        <Route path="/vehiculos/nuevo" element={<PaginaNuevoVehiculo />} />
        <Route path="/vehiculos/:id" element={<PaginaVehiculo />} />
        <Route path="/vehiculos/:id/ingresos" element={<PaginaIngresos />} />
        <Route path="/vehiculos/:id/editar" element={<PaginaEditarVehiculo />} />
      </Route>
      <Route path="*" element={<Navigate to="/vehiculos" replace />} />
    </Routes>
  )
}
