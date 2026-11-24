import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ApiError } from '../../api/api-client.ts'
import { obtenerPerfil } from '../../api/perfil.api.ts'
import { SectionCard } from '../../components/SectionCard.tsx'
import type { Titular } from '../../types/sesion.ts'
import { useAcceso } from './acceso-context.ts'

type Resultado = { kind: 'ok'; perfil: Titular } | { kind: 'error'; mensaje: string } | null

// Los datos salen de GET /api/perfil, que responde solo con la cuenta del token.
export function TarjetaCuenta() {
  const { conSesion } = useAcceso()
  const [resultado, setResultado] = useState<Resultado>(null)

  useEffect(() => {
    let vigente = true
    conSesion(obtenerPerfil)
      .then((perfil) => vigente && setResultado({ kind: 'ok', perfil }))
      .catch((error: unknown) => {
        const mensaje =
          error instanceof ApiError ? error.message : 'Ocurrió un error inesperado. Vuelve a intentarlo.'
        if (vigente) setResultado({ kind: 'error', mensaje })
      })
    return () => {
      vigente = false
    }
  }, [conSesion])

  return (
    <SectionCard title="Tu cuenta">
      {resultado === null && <Typography role="status">Cargando tus datos…</Typography>}
      {resultado?.kind === 'error' && <Alert severity="error">{resultado.mensaje}</Alert>}
      {resultado?.kind === 'ok' && (
        <Stack component="dl" spacing={1.5} sx={{ m: 0 }}>
          <Dato nombre="Nombre" valor={resultado.perfil.nombre} />
          <Dato nombre="Correo" valor={resultado.perfil.correo} />
        </Stack>
      )}
    </SectionCard>
  )
}

function Dato({ nombre, valor }: { nombre: string; valor: string }) {
  return (
    <div>
      <Typography component="dt" variant="body2" color="text.secondary">
        {nombre}
      </Typography>
      <Typography component="dd" sx={{ m: 0, fontWeight: 500, overflowWrap: 'anywhere' }}>
        {valor}
      </Typography>
    </div>
  )
}
