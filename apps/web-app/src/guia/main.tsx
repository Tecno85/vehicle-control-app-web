import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppTheme } from '../theme/AppTheme.tsx'
import { GuiaVisual } from './GuiaVisual.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppTheme>
      <GuiaVisual />
    </AppTheme>
  </StrictMode>,
)
