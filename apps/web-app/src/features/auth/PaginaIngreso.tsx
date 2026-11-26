import { useRef, useState, type FormEvent } from 'react'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router'
import { ApiError } from '../../api/api-client.ts'
import { AppShell } from '../../components/layout/AppShell.tsx'
import { useAcceso } from './acceso-context.ts'
import { CargandoSesion } from './CargandoSesion.tsx'

// Pantalla 01 de la evidencia de sesión 3, sin los enlaces de registro y
// recuperación de contraseña, que llegan en una fase posterior.
export function PaginaIngreso() {
  const { estado, aviso, ingresar } = useAcceso()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // El aviso de cierre de sesión se oculta en cuanto la usuaria intenta ingresar.
  const [intentoIngresar, setIntentoIngresar] = useState(false)
  const campoCorreo = useRef<HTMLInputElement>(null)
  const campoContrasena = useRef<HTMLInputElement>(null)

  // Sin conexión tampoco se podría ingresar: se ofrece reintentar.
  if (estado === 'comprobando' || estado === 'sin-conexion') return <CargandoSesion />
  if (estado === 'con-sesion') return <Navigate to="/" replace />

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setIntentoIngresar(true)
    if (!correo.trim() || !contrasena) {
      setError('Escribe tu correo y tu contraseña.')
      const campoVacio = correo.trim() ? campoContrasena : campoCorreo
      campoVacio.current?.focus()
      return
    }
    setEnviando(true)
    setError(null)
    try {
      // Si sale bien, el estado pasa a «con-sesión» y esta página lleva al inicio.
      await ingresar(correo, contrasena)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Ocurrió un error inesperado. Vuelve a intentarlo.')
      setEnviando(false)
      // El botón se desactivó mientras esperaba; el foco vuelve a la contraseña.
      campoContrasena.current?.focus()
    }
  }

  const etiquetaMostrar = mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'

  return (
    <AppShell>
      <title>Ingresar · Control Vehicular</title>
      <Card sx={{ maxWidth: 440, mx: 'auto', p: { xs: 2.5, sm: 4 } }}>
        <Typography variant="h1" sx={{ mb: 1 }}>
          Ingresa a tu cuenta
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Escribe el correo y la contraseña de tu cuenta.
        </Typography>
        <Stack component="form" spacing={2.5} onSubmit={enviar} noValidate>
          {error && <Alert severity="error">{error}</Alert>}
          {aviso && !intentoIngresar && <Alert severity="info">{aviso}</Alert>}
          <TextField
            label="Correo"
            type="email"
            autoComplete="username"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            inputRef={campoCorreo}
            required
            fullWidth
          />
          <TextField
            label="Contraseña"
            type={mostrarContrasena ? 'text' : 'password'}
            autoComplete="current-password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            inputRef={campoContrasena}
            required
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={etiquetaMostrar}
                      title={etiquetaMostrar}
                      onClick={() => setMostrarContrasena((valor) => !valor)}
                      edge="end"
                    >
                      {mostrarContrasena ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button type="submit" variant="contained" size="large" disabled={enviando} fullWidth>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </Stack>
      </Card>
    </AppShell>
  )
}
