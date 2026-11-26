import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { useLocation, useNavigate } from 'react-router'
import { avisoDe } from './vehiculo-formato.ts'

// Aviso de éxito que llega con la navegación, por ejemplo «Vehículo guardado.».
// Es un aviso dentro de la página y no uno flotante que se esconde solo: así se
// puede leer con calma. La región role="status" está desde que se abre la
// página, y el texto llega un momento después: si llegaran juntos, el lector
// de pantalla podría no anunciarlo.
export function AvisoExito() {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()
  const avisoNuevo = avisoDe(state)
  const [aviso, setAviso] = useState<string | null>(null)

  useEffect(() => {
    if (!avisoNuevo) return
    const espera = setTimeout(() => {
      setAviso(avisoNuevo)
      // Se borra de la navegación para que no se repita al recargar la página.
      navigate(pathname, { replace: true, state: null })
    }, 100)
    return () => clearTimeout(espera)
  }, [avisoNuevo, navigate, pathname])

  return (
    <Box role="status">
      {aviso && (
        <Alert severity="success" role="none" sx={{ mb: 2 }}>
          {aviso}
        </Alert>
      )}
    </Box>
  )
}
