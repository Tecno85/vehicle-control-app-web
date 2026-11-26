import { useEffect, useId, useRef, useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { desactivarVehiculo, eliminarVehiculo } from '../../api/vehiculos.api.ts'
import type { Vehiculo } from '../../types/vehiculo.ts'
import { useAcceso } from '../auth/acceso-context.ts'
import { comoApiError } from './useDatosRemotos.ts'

export type AccionQuitar = 'desactivar' | 'eliminar'

interface DialogoQuitarVehiculoProps {
  vehiculo: Vehiculo
  accion: AccionQuitar
  abierto: boolean
  // huboError: la página recarga el vehículo, porque pudo cambiar en otra pestaña.
  onCerrar: (huboError: boolean) => void
  onHecho: () => void
}

// Pantalla 28 de la evidencia de sesión 3. Usa el diálogo de Material UI, que
// encierra el foco mientras está abierto y lo devuelve al botón que lo abrió.
// Al abrir, Material UI enfoca el diálogo entero, y el lector de pantalla lee
// su título y su texto; al terminar la animación, el foco pasa a «Cancelar»,
// la opción que no cambia nada. Con autoFocus en el botón, la prueba en Chrome
// mostró que el foco se quedaba en el diálogo entero.
export function DialogoQuitarVehiculo({
  vehiculo,
  accion,
  abierto,
  onCerrar,
  onHecho,
}: DialogoQuitarVehiculoProps) {
  const { conSesion } = useAcceso()
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const botonCancelar = useRef<HTMLButtonElement>(null)
  const idTexto = useId()
  const eliminar = accion === 'eliminar'

  // Mientras espera, los botones se desactivan y pierden el foco; si falla,
  // vuelve a «Cancelar», desde donde se lee el aviso y se puede cerrar.
  useEffect(() => {
    if (error) botonCancelar.current?.focus()
  }, [error])

  function cerrar() {
    if (enviando) return
    onCerrar(error !== null)
    setError(null)
  }

  async function confirmar() {
    setEnviando(true)
    setError(null)
    try {
      await conSesion(async (token) => {
        if (eliminar) await eliminarVehiculo(vehiculo.id, token)
        else await desactivarVehiculo(vehiculo.id, token)
      })
      setEnviando(false)
      onHecho()
    } catch (e) {
      setEnviando(false)
      setError(comoApiError(e).message)
    }
  }

  const { placa } = vehiculo
  const texto = eliminar
    ? `${placa} no tiene ingresos, gastos ni documentos. Lo eliminaremos de tu flota de forma definitiva y no se podrá deshacer.`
    : `${placa} tiene ingresos, gastos o documentos, así que no se puede eliminar. Lo desactivaremos para conservarlos: dejará de contar en tu flota, pero lo seguirás viendo al final de la lista. Por ahora no se puede volver a activar.`

  return (
    <Dialog
      open={abierto}
      onClose={cerrar}
      aria-describedby={idTexto}
      maxWidth="xs"
      fullWidth
      slotProps={{ transition: { onEntered: () => botonCancelar.current?.focus() } }}
    >
      <DialogTitle>{eliminar ? `¿Eliminar ${placa}?` : `¿Desactivar ${placa}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id={idTexto}>{texto}</DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1, flexWrap: 'wrap' }}>
        <Button onClick={cerrar} disabled={enviando} ref={botonCancelar}>
          Cancelar
        </Button>
        <Button
          onClick={confirmar}
          disabled={enviando}
          variant="contained"
          color={eliminar ? 'error' : 'primary'}
        >
          {eliminar ? (enviando ? 'Eliminando…' : 'Eliminar') : enviando ? 'Desactivando…' : 'Desactivar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
