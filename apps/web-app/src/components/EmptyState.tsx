import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface EmptyStateProps {
  title: string
  description: string
}

// Mensaje para una sección sin datos, en un recuadro suave como en Android.
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box sx={{ bgcolor: 'background.default', borderRadius: '10px', p: 2 }}>
      <Typography component="p" variant="subtitle2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  )
}
