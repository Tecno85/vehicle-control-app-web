import Box from '@mui/material/Box'
import { imagenesVehiculo } from '../../assets/marca/imagenes.ts'
import type { Vehiculo } from '../../types/vehiculo.ts'

// Círculo con el carro del tipo, como en las tarjetas de Android: fondo naranja para el taxi,
// verde para el particular y gris si el vehículo está desactivado. Es decorativo: el tipo
// también está escrito en su etiqueta.
export function IconoVehiculo({ vehiculo }: { vehiculo: Vehiculo }) {
  const esTaxi = vehiculo.tipo === 'TAXI'
  const fondo = vehiculo.activo
    ? { bgcolor: `tones.${esTaxi ? 'orange' : 'green'}.soft` }
    : { bgcolor: 'background.default', border: 1, borderColor: 'divider' }

  return (
    <Box
      aria-hidden
      sx={{
        width: 56,
        height: 56,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        ...fondo,
      }}
    >
      <Box
        component="img"
        {...imagenesVehiculo[vehiculo.tipo]}
        alt=""
        sx={{ width: 46, height: 'auto', ...(!vehiculo.activo && { filter: 'grayscale(1)', opacity: 0.7 }) }}
      />
    </Box>
  )
}
