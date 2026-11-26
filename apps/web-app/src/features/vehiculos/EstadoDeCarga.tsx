import { useEffect, useRef, type ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import type { DatosRemotos } from './useDatosRemotos.ts'

interface EstadoDeCargaProps {
  carga: Pick<DatosRemotos<unknown>, 'estado' | 'error' | 'recargar'>
  textoCargando: string
  // Lo que se muestra cuando ya hay datos; null mientras no los hay.
  children: ReactNode
}

// Muestra el indicador de carga, el error o el contenido de una página.
export function EstadoDeCarga({ carga, textoCargando, children }: EstadoDeCargaProps) {
  const { estado, error, recargar } = carga
  const botonReintentar = useRef<HTMLButtonElement>(null)
  const reintento = useRef(false)

  // Al reintentar, el aviso desaparece mientras se carga. Si vuelve a fallar,
  // el foco regresa al botón para intentarlo otra vez con el teclado.
  useEffect(() => {
    if (estado === 'error' && reintento.current) botonReintentar.current?.focus()
  }, [estado])

  if (estado === 'error' && error) {
    // Sin respuesta o con el servicio caído vale la pena reintentar; si el
    // vehículo no existe o la dirección está mal, no.
    const sirveReintentar = error.status === undefined || error.status >= 500
    return (
      <Alert
        severity="error"
        action={
          sirveReintentar && (
            <Button
              color="inherit"
              size="small"
              ref={botonReintentar}
              onClick={() => {
                reintento.current = true
                recargar()
              }}
            >
              Reintentar
            </Button>
          )
        }
      >
        {error.message}
      </Alert>
    )
  }

  if (children) return children

  return (
    <Box role="status" sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
      <CircularProgress size={28} aria-hidden />
      <Typography>{textoCargando}</Typography>
    </Box>
  )
}
