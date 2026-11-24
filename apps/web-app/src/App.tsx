import { BrowserRouter } from 'react-router'
import { AppRoutes } from './app/routes/AppRoutes.tsx'
import { AccesoProvider } from './features/auth/AccesoProvider.tsx'

function App() {
  return (
    <BrowserRouter>
      <AccesoProvider>
        <AppRoutes />
      </AccesoProvider>
    </BrowserRouter>
  )
}

export default App
