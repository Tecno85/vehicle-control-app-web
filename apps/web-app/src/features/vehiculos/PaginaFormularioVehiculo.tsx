import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useNavigate, useParams } from 'react-router'
import { BackButton } from '../../components/BackButton.tsx'
import { AppShell } from '../../components/layout/AppShell.tsx'
import { BotonCerrarSesion } from '../auth/BotonCerrarSesion.tsx'
import { EstadoDeCarga } from './EstadoDeCarga.tsx'
import { FormularioVehiculo } from './FormularioVehiculo.tsx'
import { useVehiculo } from './useDatosRemotos.ts'

// /vehiculos/nuevo: «Volver» y «Cancelar» llevan a la flota.
export function PaginaNuevoVehiculo() {
  const navigate = useNavigate()
  return (
    <AppShell acciones={<BotonCerrarSesion />}>
      <title>Agregar vehículo · Control Vehicular</title>
      <Box sx={{ mb: 2, ml: -1 }}>
        <BackButton onClick={() => navigate('/vehiculos')} />
      </Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Agregar vehículo
      </Typography>
      <FormularioVehiculo />
    </AppShell>
  )
}

// /vehiculos/:id/editar: carga el vehículo con sus registros, porque con
// ingresos el tipo queda bloqueado. «Volver» y «Cancelar» llevan al detalle.
export function PaginaEditarVehiculo() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const carga = useVehiculo(id)
  const vehiculo = carga.datos

  return (
    <AppShell acciones={<BotonCerrarSesion />}>
      <title>{vehiculo ? `Editar ${vehiculo.placa} · Control Vehicular` : 'Editar vehículo · Control Vehicular'}</title>
      <Box sx={{ mb: 2, ml: -1 }}>
        <BackButton onClick={() => navigate(`/vehiculos/${encodeURIComponent(id)}`)} />
      </Box>
      <Typography variant="h1" sx={{ mb: 3, overflowWrap: 'anywhere' }}>
        {vehiculo ? `Editar ${vehiculo.placa}` : 'Editar vehículo'}
      </Typography>
      <EstadoDeCarga carga={carga} textoCargando="Cargando el vehículo…">
        {vehiculo && <FormularioVehiculo key={vehiculo.id} vehiculo={vehiculo} />}
      </EstadoDeCarga>
    </AppShell>
  )
}
