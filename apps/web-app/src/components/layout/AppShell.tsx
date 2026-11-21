import type { ReactNode } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { ColorModeToggle } from './ColorModeToggle.tsx'

const pagePadding = { px: { xs: 2, sm: 3 } }

// Estructura común de las páginas: el encabezado con el nombre y el botón de modo, y el contenido.
// Como en Android, el encabezado va sobre el fondo de la página, sin barra de color.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Container
        component="header"
        maxWidth="md"
        sx={{
          ...pagePadding,
          pt: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography component="p" variant="h2">
          Control Vehicular
        </Typography>
        <ColorModeToggle />
      </Container>
      <Container component="main" maxWidth="md" sx={{ ...pagePadding, py: { xs: 2, sm: 3 } }}>
        {children}
      </Container>
    </>
  )
}
