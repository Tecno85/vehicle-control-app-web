import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import bienvenida from '../../assets/marca/bienvenida.svg'
import { ColorModeToggle } from './ColorModeToggle.tsx'

// Estructura del ingreso y de la comprobación de sesión (propuesta C de la sesión 11): una franja
// de bienvenida con la marca y, montada sobre ella, la tarjeta con el contenido. Las medidas son
// las de la maqueta, en el celular y desde 600 px.
export function PantallaBienvenida({ children }: { children: ReactNode }) {
  return (
    <>
      <Box
        component="header"
        sx={(theme) => {
          // La línea de vía, con el azul principal al 30 %. Es solo un fondo: no tiene texto que leer.
          const via = theme.alpha((theme.vars || theme).palette.primary.main, 0.3)
          return {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 0.75, sm: 1 },
            pt: { xs: 3, sm: 7 },
            px: { xs: 2, sm: 3 },
            pb: { xs: 7, sm: 12 },
            bgcolor: 'tones.blue.soft',
            textAlign: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              insetInline: 0,
              bottom: { xs: 42, sm: 26 },
              height: { xs: 3, sm: 4 },
              backgroundImage: {
                xs: `repeating-linear-gradient(90deg, ${via} 0 22px, transparent 22px 38px)`,
                sm: `repeating-linear-gradient(90deg, ${via} 0 36px, transparent 36px 60px)`,
              },
            },
          }
        }}
      >
        {/* Decorativo: el nombre de la app está escrito debajo. */}
        <Box
          component="img"
          src={bienvenida}
          alt=""
          width={250}
          height={112}
          sx={{ display: 'block', width: { xs: 220, sm: 300 }, height: 'auto' }}
        />
        <Typography
          component="p"
          sx={{ fontSize: { xs: '1.5rem', sm: '1.875rem' }, lineHeight: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 700 }}
        >
          Control Vehicular
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: '28em', typography: { xs: 'body2', sm: 'body1' } }}>
          Organiza la información de tus vehículos en un solo lugar.
        </Typography>
        <Box sx={{ position: 'absolute', top: { xs: 16, sm: 24 }, right: { xs: 16, sm: 24 } }}>
          <ColorModeToggle />
        </Box>
      </Box>
      {/* Con position: relative, la tarjeta queda por encima de la línea de vía. */}
      <Box component="main" sx={{ position: 'relative', mt: { xs: -4, sm: -7 }, px: { xs: 2, sm: 3 }, pb: { xs: 3, sm: 6 } }}>
        <Card sx={{ maxWidth: 440, mx: 'auto', p: { xs: 2.5, sm: 4 } }}>{children}</Card>
      </Box>
    </>
  )
}
