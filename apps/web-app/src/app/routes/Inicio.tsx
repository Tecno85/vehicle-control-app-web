import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { HealthPanel } from '../../components/HealthPanel.tsx'
import { AppShell } from '../../components/layout/AppShell.tsx'
import { BotonCerrarSesion } from '../../features/auth/BotonCerrarSesion.tsx'
import { TarjetaCuenta } from '../../features/auth/TarjetaCuenta.tsx'
import { useAcceso } from '../../features/auth/acceso-context.ts'

// Por ahora es la única página con sesión; la flota llega con la semana 7.
export function Inicio() {
  const { titular } = useAcceso()

  return (
    <AppShell acciones={<BotonCerrarSesion />}>
      <title>Inicio · Control Vehicular</title>
      <Typography variant="h1" sx={{ mb: 1, overflowWrap: 'anywhere' }}>
        Hola, {titular?.nombre}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Ingresaste a tu cuenta de Control Vehicular.
      </Typography>
      <Stack spacing={3}>
        <TarjetaCuenta />
        <HealthPanel />
      </Stack>
    </AppShell>
  )
}
