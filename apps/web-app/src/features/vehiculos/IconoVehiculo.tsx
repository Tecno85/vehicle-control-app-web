import DirectionsCarOutlined from '@mui/icons-material/DirectionsCarOutlined'
import LocalTaxiOutlined from '@mui/icons-material/LocalTaxiOutlined'
import Box from '@mui/material/Box'
import type { Vehiculo } from '../../types/vehiculo.ts'

// Círculo con el ícono del tipo, como en las tarjetas de Android: naranja para
// el taxi, verde para el particular y gris si el vehículo está desactivado.
export function IconoVehiculo({ vehiculo }: { vehiculo: Vehiculo }) {
  const Icono = vehiculo.tipo === 'TAXI' ? LocalTaxiOutlined : DirectionsCarOutlined
  const tono = vehiculo.tipo === 'TAXI' ? 'orange' : 'green'
  const colores = vehiculo.activo
    ? { bgcolor: `tones.${tono}.soft`, color: `tones.${tono}.text` }
    : { bgcolor: 'background.default', color: 'text.secondary', border: 1, borderColor: 'divider' }

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
        ...colores,
      }}
    >
      <Icono fontSize="large" />
    </Box>
  )
}
