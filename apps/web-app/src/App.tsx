import Typography from '@mui/material/Typography'
import { AppShell } from './components/layout/AppShell.tsx'
import { HealthPanel } from './components/HealthPanel.tsx'

function App() {
  return (
    <AppShell>
      <Typography variant="h1" sx={{ mb: 1 }}>
        Verificación de conexión
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Comprueba si la aplicación web se conecta con core-service.
      </Typography>
      <HealthPanel />
    </AppShell>
  )
}

export default App
