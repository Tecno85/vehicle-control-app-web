import { useState } from 'react'
import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { useAcceso } from './acceso-context.ts'

// En pantallas angostas solo se ve el ícono, con su etiqueta para el lector de pantalla.
export function BotonCerrarSesion() {
  const { cerrarSesion } = useAcceso()
  const [cerrando, setCerrando] = useState(false)

  function cerrar() {
    setCerrando(true)
    void cerrarSesion()
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
    </>
  )
}
