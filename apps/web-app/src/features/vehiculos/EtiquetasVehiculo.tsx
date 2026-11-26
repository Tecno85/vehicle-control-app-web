import Stack from '@mui/material/Stack'
import { StatusChip } from '../../components/StatusChip.tsx'
import type { Vehiculo } from '../../types/vehiculo.ts'
import { nombreTipo } from './vehiculo-formato.ts'

// Tipo, inDrive e Inactivo, con los tonos de la guía visual.
export function EtiquetasVehiculo({ vehiculo }: { vehiculo: Vehiculo }) {
  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
      <StatusChip label={nombreTipo(vehiculo.tipo)} tone={vehiculo.tipo === 'TAXI' ? 'orange' : 'green'} />
      {vehiculo.habilitado_indrive && <StatusChip label="inDrive" tone="blue" />}
      {!vehiculo.activo && <StatusChip label="Inactivo" tone="neutral" />}
    </Stack>
  )
}
