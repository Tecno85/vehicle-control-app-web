import '@fontsource-variable/roboto'
import type { ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme.ts'

// Tema común de todas las páginas de la web-app. Al inicio sigue el modo claro u oscuro del
// dispositivo; si la persona elige otro, Material UI lo recuerda en el navegador.
export function AppTheme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}
