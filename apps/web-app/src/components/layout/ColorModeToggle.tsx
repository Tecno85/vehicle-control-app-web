import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlined from '@mui/icons-material/LightModeOutlined'
import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'

// Botón sol/luna, como el de Android. Material UI guarda la elección en el navegador.
export function ColorModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme()
  // Material UI no conoce el modo en el primer render; el botón aparece un instante después.
  if (!mode) return null

  const isDark = (mode === 'system' ? systemMode : mode) === 'dark'
  const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <IconButton
      aria-label={label}
      title={label}
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      sx={{
        width: 42,
        height: 42,
        color: 'primary.main',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
      }}
    >
      {isDark ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
    </IconButton>
  )
}
