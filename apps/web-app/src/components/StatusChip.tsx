import Chip from '@mui/material/Chip'
import type { Palette } from '@mui/material/styles'

type ChipTone = keyof Palette['tones'] | 'neutral'

interface StatusChipProps {
  label: string
  tone: ChipTone
}

// Etiqueta de tipo o de estado, como las de Android: fondo suave y texto del mismo color.
// «neutral» es para estados apagados, como un vehículo inactivo.
export function StatusChip({ label, tone }: StatusChipProps) {
  const colors =
    tone === 'neutral'
      ? { bgcolor: 'background.default', color: 'text.secondary', border: 1, borderColor: 'divider' }
      : { bgcolor: `tones.${tone}.soft`, color: `tones.${tone}.text` }

  return <Chip label={label} size="small" sx={{ ...colors, px: 0.5 }} />
}
