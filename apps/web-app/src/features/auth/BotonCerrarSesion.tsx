import { useEffect, useRef, useState, type MouseEvent } from 'react'
import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar'
import { useAcceso } from './acceso-context.ts'

// En pantallas angostas solo se ve el ícono, con su etiqueta para el lector de pantalla.
// Si el cierre sale bien, la web-app pasa a la página de ingreso. Si falla, la
// sesión sigue abierta: se avisa y el botón queda listo para intentarlo otra vez.
export function BotonCerrarSesion() {
  const { cerrarSesion } = useAcceso()
  const [cerrando, setCerrando] = useState(false)
  const [fallo, setFallo] = useState(false)
  const botonUsado = useRef<HTMLButtonElement | null>(null)

  // Mientras espera, el botón se desactiva y pierde el foco. Si el cierre falla,
  // el foco vuelve a él para reintentar con el teclado.
  useEffect(() => {
    if (fallo) botonUsado.current?.focus()
  }, [fallo])

  async function cerrar(evento: MouseEvent<HTMLButtonElement>) {
    botonUsado.current = evento.currentTarget
    setCerrando(true)
    setFallo(false)
    try {
      await cerrarSesion()
    } catch {
      setCerrando(false)
      setFallo(true)
    }
  }

  // Un clic en otra parte de la página no cierra el aviso: se cierra con su
  // botón o con Escape.
  function cerrarAviso(_evento: unknown, motivo?: SnackbarCloseReason) {
    if (motivo !== 'clickaway') setFallo(false)
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<LogoutOutlined />}
        onClick={cerrar}
        disabled={cerrando}
        sx={{ display: { xs: 'none', sm: 'inline-flex' }, bgcolor: 'background.paper' }}
      >
        Cerrar sesión
      </Button>
      <IconButton
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        onClick={cerrar}
        disabled={cerrando}
        sx={{
          display: { xs: 'inline-flex', sm: 'none' },
          width: 42,
          height: 42,
          color: 'primary.main',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <LogoutOutlined fontSize="small" />
      </IconButton>
      <Snackbar
        open={fallo}
        onClose={cerrarAviso}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={cerrarAviso} sx={{ width: '100%' }}>
          No pudimos cerrar tu sesión. Revisa la conexión y vuelve a intentarlo.
        </Alert>
      </Snackbar>
    </>
  )
}
