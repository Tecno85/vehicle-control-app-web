import ArrowBack from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'

// «Volver» con flecha, como el botón de regreso de Android.
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="text" startIcon={<ArrowBack />} onClick={onClick}>
      Volver
    </Button>
  )
}
