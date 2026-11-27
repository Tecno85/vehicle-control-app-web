import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router'
import { ApiError } from '../../api/api-client.ts'
import { PantallaBienvenida } from '../../components/layout/PantallaBienvenida.tsx'
import { useAcceso } from './acceso-context.ts'
import { CargandoSesion } from './CargandoSesion.tsx'

interface CamposVacios {
  correo?: boolean
  contrasena?: boolean
}

// Pantalla 01 de la evidencia de sesión 3, con la franja de bienvenida de la sesión 11 y sin
// los enlaces de registro y recuperación de contraseña, que llegan en una fase posterior.
export function PaginaIngreso() {
  const { estado, aviso, ingresar } = useAcceso()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [enviando, setEnviando] = useState(false)
  // Los campos vacíos se marcan debajo de cada uno solo al pulsar «Ingresar», y la marca se quita
  // al escribir en el campo. El rechazo de core-service va en el aviso de arriba.
  const [vacios, setVacios] = useState<CamposVacios>({})
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
    const faltan = { correo: !correo.trim(), contrasena: !contrasena }
    if (faltan.correo || faltan.contrasena) {
      setVacios(faltan)
      setError(null)
      const primerVacio = faltan.correo ? campoCorreo : campoContrasena
      primerVacio.current?.focus()
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

  // En el celular, la tecla Enter del correo dice «Siguiente»: si falta la contraseña, lleva a
  // ella en lugar de enviar el formulario y marcarla como vacía antes de tiempo.
  function siguienteDesdeCorreo(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Enter' && !contrasena) {
      evento.preventDefault()
      campoContrasena.current?.focus()
    }
  }

  return (
    <PantallaBienvenida>
      <title>Ingresar · Control Vehicular</title>
      <Typography variant="h2" component="h1" sx={{ mb: 3, textWrap: 'balance' }}>
        Ingresa a tu cuenta
      </Typography>
      <Stack component="form" spacing={2.5} onSubmit={enviar} noValidate>
        {error && <Alert severity="error">{error}</Alert>}
        {aviso && !intentoIngresar && <Alert severity="info">{aviso}</Alert>}
        <TextField
          label="Correo"
          name="correo"
          type="email"
          autoComplete="username"
          value={correo}
          onChange={(e) => {
            setCorreo(e.target.value)
            setVacios((actual) => ({ ...actual, correo: false }))
          }}
          onKeyDown={siguienteDesdeCorreo}
          inputRef={campoCorreo}
          error={vacios.correo}
          helperText={vacios.correo ? 'Escribe tu correo.' : undefined}
          required
          fullWidth
          slotProps={{ htmlInput: { spellCheck: false, autoCapitalize: 'none', enterKeyHint: 'next' } }}
        />
        <TextField
          label="Contraseña"
          name="contrasena"
          type={mostrarContrasena ? 'text' : 'password'}
          autoComplete="current-password"
          value={contrasena}
          onChange={(e) => {
            setContrasena(e.target.value)
            setVacios((actual) => ({ ...actual, contrasena: false }))
          }}
          inputRef={campoContrasena}
          error={vacios.contrasena}
          helperText={vacios.contrasena ? 'Escribe tu contraseña.' : undefined}
          required
          fullWidth
          slotProps={{
            htmlInput: { enterKeyHint: 'go' },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {/* El nombre no cambia: aria-pressed dice si la contraseña está a la vista. */}
                  <IconButton
                    aria-label="Mostrar contraseña"
                    title="Mostrar contraseña"
                    aria-pressed={mostrarContrasena}
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
    </PantallaBienvenida>
  )
}
