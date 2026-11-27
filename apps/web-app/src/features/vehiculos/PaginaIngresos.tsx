import { useCallback, useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useNavigate, useParams } from 'react-router'
import { BackButton } from '../../components/BackButton.tsx'
import { SectionCard } from '../../components/SectionCard.tsx'
import { AppShell } from '../../components/layout/AppShell.tsx'
import { listarIngresos, crearIngreso } from '../../api/vehiculos.api.ts'
import { useAcceso } from '../auth/acceso-context.ts'
import type { Ingreso } from '../../types/vehiculo.ts'
import { formatearPesos } from './vehiculo-formato.ts'

export function PaginaIngresos() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { conSesion } = useAcceso()
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState('')
  const [fecha, setFecha] = useState(fechaHoy)
  const [valor, setValor] = useState('')
  const [motivo, setMotivo] = useState('')
  const [nota, setNota] = useState('')

  const cargar = useCallback(() => conSesion((token) => listarIngresos(Number(id), token)).then(setIngresos).catch((e: Error) => setError(e.message)), [conSesion, id])
  useEffect(() => { void cargar() }, [cargar])

  async function guardar() {
    setError(''); setGuardado('')
    try {
      await conSesion((token) => crearIngreso(Number(id), { fecha, valor: Number(valor), motivo: motivo || undefined, nota: nota || undefined }, token))
      setGuardado('Ingreso guardado.'); setValor(''); setMotivo(''); setNota(''); await cargar()
    } catch (e) { setError(e instanceof Error ? e.message : 'No pudimos guardar el ingreso.') }
  }

  return <AppShell acciones={<Button onClick={() => navigate(`/vehiculos/${id}`)}>Volver al vehículo</Button>}>
    <title>Ingresos · Control Vehicular</title>
    <BackButton onClick={() => navigate(`/vehiculos/${id}`)} />
    <Typography variant="h1" sx={{ mb: 3 }}>Ingresos</Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {guardado && <Alert severity="success" sx={{ mb: 2 }}>{guardado}</Alert>}
    <SectionCard title="Registrar ingreso"><Stack spacing={2}>
      <TextField label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
      <TextField label="Valor recibido" type="number" value={valor} onChange={(e) => setValor(e.target.value)} slotProps={{ htmlInput: { min: 0, step: 1 } }} helperText="Escribe el valor en pesos. Puede ser 0." />
      <TextField label="Motivo (si aplica)" value={motivo} onChange={(e) => setMotivo(e.target.value)} helperText="Obligatorio si el valor del taxi no coincide con su cuota." />
      <TextField label="Nota (opcional)" value={nota} onChange={(e) => setNota(e.target.value)} multiline minRows={2} />
      <Button variant="contained" onClick={() => void guardar()} disabled={!fecha || valor === ''}>Guardar ingreso</Button>
    </Stack></SectionCard>
    <SectionCard title="Ingresos registrados"><Stack spacing={1.5}>{ingresos.length === 0 ? <Typography color="text.secondary">Aún no hay ingresos para este vehículo.</Typography> : ingresos.map((ingreso) => <Stack key={ingreso.id} direction="row" sx={{ justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', pb: 1 }}><span>{ingreso.fecha} · {ingreso.tipo === 'TAXI' ? 'Taxi' : 'inDrive'}</span><strong>{formatearPesos(ingreso.valor)}</strong></Stack>)}</Stack></SectionCard>
  </AppShell>
}

function fechaHoy(): string { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date()) }
