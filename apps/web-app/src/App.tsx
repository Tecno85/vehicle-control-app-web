import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { HealthPanel } from './components/HealthPanel.tsx'

function App() {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        VehicleControlApp Web
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Comprueba si la aplicación web se conecta con core-service.
      </Typography>
      <HealthPanel />
    </Container>
  )
}

export default App
