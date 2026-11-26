import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Un par nombre y valor dentro de una lista <dl>, con el estilo de la guía visual.
export function Dato({ nombre, children }: { nombre: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography component="dt" variant="body2" sx={{ color: 'primary.main', fontWeight: 700 }}>
        {nombre}
      </Typography>
      <Typography component="dd" sx={{ m: 0, overflowWrap: 'anywhere' }}>
        {children}
      </Typography>
    </Box>
  )
}
