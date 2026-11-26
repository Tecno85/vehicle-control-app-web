import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link, useNavigate } from 'react-router'
import { actualizarVehiculo, crearVehiculo } from '../../api/vehiculos.api.ts'
import type { TipoVehiculo, VehiculoConRegistros } from '../../types/vehiculo.ts'
import { useAcceso } from '../auth/acceso-context.ts'
import { comoApiError } from './useDatosRemotos.ts'
import type { EstadoConAviso } from './vehiculo-formato.ts'
import {
  datosParaEnviar,
  erroresDelServidor,
  limpiarPlaca,
  primerCampoConError,
  validar,
  validarCampo,
  valoresIniciales,
  type CampoVehiculo,
  type ErroresVehiculo,
  type ValoresVehiculo,
} from './vehiculo-formulario.ts'

// Campos que dependen del tipo: al cambiarlo se borran sus mensajes.
const CAMPOS_DEL_TIPO: CampoVehiculo[] = ['conductor', 'cuota', 'indrive']

// Pantallas 09, 10 y 27 de la evidencia de sesión 3. Sin `vehiculo` crea uno
// nuevo; con él, lo edita.
export function FormularioVehiculo({ vehiculo }: { vehiculo?: VehiculoConRegistros }) {
  const { conSesion } = useAcceso()
  const navigate = useNavigate()
  const [valores, setValores] = useState(() => valoresIniciales(vehiculo))
  const [errores, setErrores] = useState<ErroresVehiculo>({})
  const [editados, setEditados] = useState<ReadonlySet<CampoVehiculo>>(new Set())
  const [enviando, setEnviando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  // Cada envío rechazado aumenta este número; el efecto lleva el foco al
  // primer campo con error o al aviso cuando ya están en pantalla.
  const [rechazos, setRechazos] = useState(0)
  const destinoFoco = useRef<CampoVehiculo | 'aviso' | null>(null)
  const campos = useRef<Partial<Record<CampoVehiculo, HTMLInputElement | null>>>({})
  const aviso = useRef<HTMLDivElement>(null)
  const ids = { tipo: useId(), ayudaTipo: useId(), ayudaIndrive: useId() }

  const volverA = vehiculo ? `/vehiculos/${vehiculo.id}` : '/vehiculos'
  // Regla de core-service: con ingresos no cambia de tipo ni deja inDrive.
  const tieneIngresos = (vehiculo?.registros.ingresos ?? 0) > 0
  const indriveBloqueado = tieneIngresos && vehiculo?.habilitado_indrive === true

  useEffect(() => {
    const destino = destinoFoco.current
    destinoFoco.current = null
    if (destino === 'aviso') aviso.current?.focus()
    else if (destino) campos.current[destino]?.focus()
  }, [rechazos])

  function rechazar(destino: CampoVehiculo | 'aviso') {
    destinoFoco.current = destino
    setRechazos((anterior) => anterior + 1)
  }

  function cambiar<C extends CampoVehiculo>(campo: C, valor: ValoresVehiculo[C]) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }))
    setEditados((anteriores) => (anteriores.has(campo) ? anteriores : new Set(anteriores).add(campo)))
    // El mensaje se borra mientras se corrige; vuelve a revisarse al salir del campo.
    const quitar = campo === 'tipo' ? [campo, ...CAMPOS_DEL_TIPO] : [campo]
    setErrores((anteriores) => {
      const siguientes = { ...anteriores }
      for (const nombre of quitar) delete siguientes[nombre]
      return siguientes
    })
  }

  // Solo se revisa un campo que se editó: no se marca un error en un campo que
  // la usuaria apenas recorrió con el tabulador.
  function alSalir(campo: CampoVehiculo) {
    if (!editados.has(campo)) return
    const mensaje = validarCampo(campo, valores)
    if (mensaje) setErrores((anteriores) => ({ ...anteriores, [campo]: mensaje }))
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (enviando) return
    setErrorGeneral(null)
    const encontrados = validar(valores)
    const primero = primerCampoConError(encontrados)
    setErrores(encontrados)
    if (primero) {
      rechazar(primero)
      return
    }

    setEnviando(true)
    const datos = datosParaEnviar(valores)
    try {
      const guardado = await conSesion((token) =>
        vehiculo ? actualizarVehiculo(vehiculo.id, datos, token) : crearVehiculo(datos, token),
      )
      // Con replace, «Atrás» no vuelve al formulario que ya se guardó.
      navigate(`/vehiculos/${guardado.id}`, {
        replace: true,
        state: { aviso: 'Vehículo guardado.' } satisfies EstadoConAviso,
      })
    } catch (e) {
      setEnviando(false)
      const error = comoApiError(e)
      // PLACA_REPETIDA y los datos rechazados traen un mensaje por campo.
      const { errores: delServidor, sinCampo } = erroresDelServidor(error.campos, valores.tipo)
      const campoConError = primerCampoConError(delServidor)
      setErrores(delServidor)
      if (sinCampo || !campoConError) setErrorGeneral(error.message)
      rechazar(campoConError ?? 'aviso')
    }
  }

  // Muestra el mensaje de error o, si no hay, la ayuda del campo.
  function ayuda(campo: CampoVehiculo, texto?: string) {
    return { error: Boolean(errores[campo]), helperText: errores[campo] ?? texto }
  }

  function guardarCampo(campo: CampoVehiculo) {
    return (elemento: HTMLInputElement | null) => {
      campos.current[campo] = elemento
    }
  }

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, maxWidth: 560 }}>
      <Stack component="form" spacing={2.5} onSubmit={enviar} noValidate>
        {errorGeneral && (
          <Alert severity="error" ref={aviso} tabIndex={-1}>
            {errorGeneral}
          </Alert>
        )}
        <Typography variant="body2" color="text.secondary">
          Los campos con * son obligatorios.
        </Typography>

        <TextField
          name="placa"
          label="Placa"
          value={valores.placa}
          onChange={(e) => cambiar('placa', limpiarPlaca(e.target.value))}
          onBlur={() => alSalir('placa')}
          inputRef={guardarCampo('placa')}
          required
          fullWidth
          {...ayuda('placa', 'Letras y números, sin espacios.')}
          slotProps={{
            htmlInput: { maxLength: 10, autoComplete: 'off', autoCapitalize: 'characters', autoCorrect: 'off', spellCheck: false },
          }}
        />
        <TextField
          name="marca"
          label="Marca"
          value={valores.marca}
          onChange={(e) => cambiar('marca', e.target.value)}
          onBlur={() => alSalir('marca')}
          inputRef={guardarCampo('marca')}
          required
          fullWidth
          {...ayuda('marca')}
          slotProps={{ htmlInput: { maxLength: 60, autoComplete: 'off' } }}
        />
        <TextField
          name="modelo"
          label="Modelo"
          value={valores.modelo}
          onChange={(e) => cambiar('modelo', e.target.value)}
          onBlur={() => alSalir('modelo')}
          inputRef={guardarCampo('modelo')}
          required
          fullWidth
          {...ayuda('modelo')}
          slotProps={{ htmlInput: { maxLength: 60, autoComplete: 'off' } }}
        />

        <FormControl component="fieldset" required error={Boolean(errores.tipo)} disabled={tieneIngresos}>
          <FormLabel component="legend" id={ids.tipo}>
            Tipo de vehículo
          </FormLabel>
          <RadioGroup
            row
            name="tipo"
            value={valores.tipo}
            onChange={(_, valor) => cambiar('tipo', valor as TipoVehiculo)}
            aria-labelledby={ids.tipo}
            aria-describedby={errores.tipo || tieneIngresos ? ids.ayudaTipo : undefined}
          >
            <FormControlLabel value="TAXI" label="Taxi" control={<Radio slotProps={{ input: { ref: guardarCampo('tipo') } }} />} />
            <FormControlLabel value="PARTICULAR" label="Particular" control={<Radio />} />
          </RadioGroup>
          {(errores.tipo || tieneIngresos) && (
            // Dentro del grupo desactivado, Material UI la pondría en el gris de
            // lo desactivado (2,68:1 en claro); es una explicación para leer,
            // así que lleva el gris de las demás ayudas.
            <FormHelperText
              id={ids.ayudaTipo}
              sx={{ mx: 0, '&.Mui-disabled:not(.Mui-error)': { color: 'text.secondary' } }}
            >
              {errores.tipo ?? 'Este vehículo ya tiene ingresos, así que no puede cambiar de tipo.'}
            </FormHelperText>
          )}
        </FormControl>

        {valores.tipo === 'TAXI' && (
          <>
            <TextField
              name="conductor"
              label="Conductor (opcional)"
              value={valores.conductor}
              onChange={(e) => cambiar('conductor', e.target.value)}
              onBlur={() => alSalir('conductor')}
              inputRef={guardarCampo('conductor')}
              fullWidth
              {...ayuda('conductor', 'Si aún no tiene conductor, déjalo en blanco.')}
              slotProps={{ htmlInput: { maxLength: 80, autoComplete: 'off' } }}
            />
            <TextField
              name="cuota_diaria"
              label="Cuota diaria"
              value={valores.cuota}
              onChange={(e) => cambiar('cuota', e.target.value)}
              onBlur={() => alSalir('cuota')}
              inputRef={guardarCampo('cuota')}
              required
              fullWidth
              {...ayuda('cuota', 'En pesos, sin decimales.')}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                htmlInput: { inputMode: 'numeric', autoComplete: 'off' },
              }}
            />
          </>
        )}

        {valores.tipo === 'PARTICULAR' && (
          <FormControl error={Boolean(errores.indrive)}>
            <FormControlLabel
              label="Habilitado para inDrive"
              control={
                <Checkbox
                  name="habilitado_indrive"
                  checked={valores.indrive}
                  onChange={(_, marcado) => cambiar('indrive', marcado)}
                  disabled={indriveBloqueado}
                  slotProps={{
                    input: {
                      ref: guardarCampo('indrive'),
                      'aria-describedby': errores.indrive || indriveBloqueado ? ids.ayudaIndrive : undefined,
                    },
                  }}
                />
              }
            />
            {(errores.indrive || indriveBloqueado) && (
              <FormHelperText id={ids.ayudaIndrive} sx={{ mx: 0 }}>
                {errores.indrive ?? 'Este vehículo ya tiene ingresos, así que debe seguir habilitado para inDrive.'}
              </FormHelperText>
            )}
          </FormControl>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
          <Button type="submit" variant="contained" disabled={enviando}>
            {enviando ? 'Guardando…' : 'Guardar'}
          </Button>
          <Button component={Link} to={volverA} variant="outlined">
            Cancelar
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
}
