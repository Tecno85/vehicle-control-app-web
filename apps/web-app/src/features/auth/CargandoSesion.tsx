import { useEffect, useRef } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { AppShell } from '../../components/layout/AppShell.tsx'
import { useAcceso } from './acceso-context.ts'

// Se ve un instante al abrir la página, mientras se comprueba si hay sesión.
// Si core-service no responde, ofrece reintentar en lugar de pedir la
// contraseña, porque la sesión puede seguir vigente.
export function CargandoSesion() {
  const { estado, reintentar } = useAcceso()
  const botonReintentar = useRef<HTMLButtonElement>(null)
  const reintento = useRef(false)

  // Al reintentar, el botón desaparece mientras se comprueba. Si vuelve a
  // fallar, el foco regresa a él para poder intentarlo otra vez con el teclado.
  useEffect(() => {
    if (estado === 'sin-conexion' && reintento.current) botonReintentar.current?.focus()
  }, [estado])

  function reintentarAhora() {
    reintento.current = true
    reintentar()
  }

  return (
    <AppShell>
      {estado === 'sin-conexion' ? (
        <Alert
          severity="error"
          sx={{ my: 4 }}
          action={
            <Button color="inherit" size="small" onClick={reintentarAhora} ref={botonReintentar}>
              Reintentar
            </Button>
          }
        >
          No pudimos comprobar tu sesión. Revisa la conexión y vuelve a intentarlo.
        </Alert>
      ) : (
        <Box role="status" sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 6 }}>
          <CircularProgress size={28} aria-hidden />
          <Typography>Comprobando tu sesión…</Typography>
        </Box>
      )}
    </AppShell>
  )
}
