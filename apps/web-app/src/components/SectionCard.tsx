import type { ReactNode } from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

interface SectionCardProps {
  title: string
  children: ReactNode
}

// Tarjeta con título, como las de Android («Documentos y vencimientos», «Gastos recientes»).
export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Card component="section" sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Card>
  )
}
