import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { checkHealth, HealthCheckError } from '../api/health.api.ts'
import type { HealthResponse } from '../types/health.ts'

// Un solo resultado a la vez: éxito, error o ninguno mientras se verifica.
type Result =
  | { kind: 'success'; health: HealthResponse }
  | { kind: 'error'; message: string }
  | null

export function HealthPanel() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result>(null)

  async function verify() {
    setLoading(true)
    setResult(null)
    try {
      setResult({ kind: 'success', health: await checkHealth() })
    } catch (error) {
      const message =
        error instanceof HealthCheckError
          ? error.message
          : 'Ocurrió un error inesperado. Vuelve a intentarlo.'
      setResult({ kind: 'error', message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Button variant="contained" onClick={verify} disabled={loading}>
        {loading ? 'Verificando…' : 'Verificar conexión'}
      </Button>
      {result?.kind === 'success' && (
        <Alert severity="success">Conectado: {result.health.service}</Alert>
      )}
      {result?.kind === 'error' && <Alert severity="error">{result.message}</Alert>}
    </Stack>
  )
}
