import { Navigate, Route, Routes } from 'react-router'
import { PaginaIngreso } from '../../features/auth/PaginaIngreso.tsx'
import { RutaProtegida } from '../../features/auth/RutaProtegida.tsx'
import { Inicio } from './Inicio.tsx'

// /ingresar es pública; las páginas dentro de RutaProtegida exigen sesión.
// Cualquier otra dirección lleva al inicio.
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/ingresar" element={<PaginaIngreso />} />
      <Route element={<RutaProtegida />}>
        <Route path="/" element={<Inicio />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
