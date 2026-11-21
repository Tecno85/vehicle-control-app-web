import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppTheme } from './theme/AppTheme.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppTheme>
      <App />
    </AppTheme>
  </StrictMode>,
)
