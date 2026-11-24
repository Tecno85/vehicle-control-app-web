import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { AppShell } from '../../components/layout/AppShell.tsx'

// Se ve un instante al abrir la página, mientras se comprueba si hay sesión.
export function CargandoSesion() {
  return (
    <AppShell>
      <Box role="status" sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 6 }}>
        <CircularProgress size={28} aria-hidden />
        <Typography>Comprobando tu sesión…</Typography>
      </Box>
    </AppShell>
  )
}
