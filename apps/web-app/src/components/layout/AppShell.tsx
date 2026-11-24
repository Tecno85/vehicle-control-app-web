import type { ReactNode } from 'react'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ColorModeToggle } from './ColorModeToggle.tsx'

const pagePadding = { px: { xs: 2, sm: 3 } }

interface AppShellProps {
  children: ReactNode
  // Botones extra del encabezado, junto al de modo; por ejemplo, «Cerrar sesión».
  acciones?: ReactNode
}

// Estructura común de las páginas: el encabezado con el nombre y sus botones, y el contenido.
// Como en Android, el encabezado va sobre el fondo de la página, sin barra de color.
export function AppShell({ children, acciones }: AppShellProps) {
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
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
          {acciones}
          <ColorModeToggle />
        </Stack>
      </Container>
      <Container component="main" maxWidth="md" sx={{ ...pagePadding, py: { xs: 2, sm: 3 } }}>
        {children}
      </Container>
    </>
  )
}
