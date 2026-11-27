import type { ReactNode } from 'react'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useColorScheme, useTheme } from '@mui/material/styles'
import bienvenida from '../assets/marca/bienvenida.svg'
import icono from '../assets/marca/icono.svg'
import { BackButton } from '../components/BackButton.tsx'
import { EmptyState } from '../components/EmptyState.tsx'
import { SectionCard } from '../components/SectionCard.tsx'
import { StatusChip } from '../components/StatusChip.tsx'
import { AppShell } from '../components/layout/AppShell.tsx'
import { IconoVehiculo } from '../features/vehiculos/IconoVehiculo.tsx'
import { darkColors, lightColors } from '../theme/colors.ts'
import type { Vehiculo } from '../types/vehiculo.ts'

// Catálogo de los componentes con el estilo de Android, solo para desarrollo.
// Los datos son ficticios: el taxi XYZ789 es el de los datos de prueba de infra/hasura.
export function GuiaVisual() {
  return (
    <AppShell>
      <Typography variant="h1" sx={{ mb: 1 }}>
        Guía visual
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Los componentes de la web-app con el estilo de la app Android. Usa el botón del encabezado
        para verlos en el otro modo.
      </Typography>
      <Alert severity="info" sx={{ mb: 5 }}>
        <strong>Datos ficticios.</strong> Esta página solo existe en desarrollo y no es una pantalla
        de la aplicación.
      </Alert>
      <Stack spacing={6}>
        <BrandSection />
        <ColorsSection />
        <TypographySection />
        <GuideSection title="Botones">
          <Stack direction="row" useFlexGap spacing={1.5} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="contained">Guardar</Button>
            <Button variant="outlined">Cancelar</Button>
            <Button variant="text">Ver todos</Button>
            <Button variant="outlined" color="error" startIcon={<DeleteOutlined />}>
              Eliminar gasto
            </Button>
            <Button variant="contained" color="error">
              Eliminar
            </Button>
            <BackButton onClick={() => undefined} />
          </Stack>
        </GuideSection>
        <GuideSection title="Etiquetas">
          <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
            <StatusChip label="Taxi" tone="orange" />
            <StatusChip label="Particular" tone="green" />
            <StatusChip label="Activo" tone="green" />
            <StatusChip label="Inactivo" tone="neutral" />
          </Stack>
        </GuideSection>
        <GuideSection title="Tarjeta con título">
          <SectionCard title="Documentos y vencimientos">
            <Typography sx={{ fontWeight: 600 }}>SOAT de ejemplo</Typography>
            <Typography variant="body2" color="text.secondary">
              Vence el 15 de enero de 2027
            </Typography>
          </SectionCard>
        </GuideSection>
        <GuideSection title="Estado vacío">
          <SectionCard title="Gastos">
            <EmptyState
              title="Sin gastos registrados"
              description="Cuando registres un gasto de este vehículo, aparecerá aquí."
            />
          </SectionCard>
        </GuideSection>
        <GuideSection title="Mensajes">
          <Stack spacing={2}>
            <Alert severity="success">Gasto guardado.</Alert>
            <Alert severity="error">
              No se pudo guardar el gasto. Revisa tu conexión y vuelve a intentarlo.
            </Alert>
            <Stack role="status" direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <CircularProgress size={20} aria-hidden="true" />
              <Typography>Cargando gastos…</Typography>
            </Stack>
          </Stack>
        </GuideSection>
        <GuideSection title="Campos de formulario">
          <Stack spacing={2.5} sx={{ maxWidth: 420 }}>
            <TextField
              label="Fecha"
              type="date"
              defaultValue="2026-10-01"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField select label="Categoría" defaultValue="Combustible">
              {['Combustible', 'Lavado', 'Mantenimiento', 'Repuestos', 'Ahorro prima conductor'].map(
                (category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ),
              )}
            </TextField>
            <TextField
              label="Valor"
              required
              error
              helperText="Escribe el valor del gasto."
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                htmlInput: { inputMode: 'numeric' },
              }}
            />
            <TextField label="Descripción" defaultValue="Gasto de ejemplo" />
          </Stack>
        </GuideSection>
        <GuideSection title="Tarjeta de vehículo (ejemplo de estilo)">
          <VehicleCardExample />
        </GuideSection>
      </Stack>
    </AppShell>
  )
}

function GuideSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box component="section">
      <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

// El dibujo de bienvenida va sobre el azul suave de la franja del ingreso.
function BrandSection() {
  return (
    <GuideSection title="Marca">
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Dibujos originales, sin el logo ni el nombre de ningún fabricante.
      </Typography>
      <Stack spacing={3}>
        <Box sx={{ p: 3, borderRadius: 1, bgcolor: 'tones.blue.soft', maxWidth: 420 }}>
          <Box component="img" src={bienvenida} alt="" sx={{ display: 'block', width: 300, maxWidth: '100%', height: 'auto' }} />
        </Box>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-end' }}>
          {[16, 32, 48].map((size) => (
            <Box key={size} sx={{ textAlign: 'center' }}>
              <Box component="img" src={icono} alt="" sx={{ display: 'block', width: size, height: size, mx: 'auto', mb: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {size} px
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </GuideSection>
  )
}

const toneNames = [
  ['blue', 'Azul'],
  ['green', 'Verde'],
  ['orange', 'Naranja'],
  ['red', 'Rojo'],
  ['purple', 'Morado'],
] as const

// Fórmula de contraste de WCAG con colores #RRGGBB. No uso getContrastRatio de Material UI
// porque redondea la luminancia y puede dar unas centésimas distintas a la medición de la evidencia.
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(foreground: string, background: string) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return `${((light + 0.05) / (dark + 0.05)).toFixed(2).replace('.', ',')}:1`
}

function ColorsSection() {
  const { mode, systemMode } = useColorScheme()
  const resolvedMode = mode === 'system' ? systemMode : mode
  // Material UI no conoce el modo en el primer render.
  if (!resolvedMode) return null
  const colors = resolvedMode === 'dark' ? darkColors : lightColors

  return (
    <GuideSection title="Colores">
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Contraste en modo {resolvedMode === 'dark' ? 'oscuro' : 'claro'}. El texto necesita al
        menos 4,5:1, y el borde de los campos, 3:1.
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {toneNames.map(([key, name]) => {
          const tone = colors[key]
          return (
            <Card key={key}>
              <Box sx={{ height: 40, bgcolor: tone.fill }} />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="h3">
                  {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Relleno {tone.fill} · texto {tone.text}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1.5, p: 1, borderRadius: '10px', bgcolor: tone.soft, color: tone.text, fontWeight: 600 }}
                >
                  Sobre su fondo suave: {ratio(tone.text, tone.soft)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: tone.text, fontWeight: 600 }}>
                  Sobre la tarjeta: {ratio(tone.text, colors.surface)}
                </Typography>
              </Box>
            </Card>
          )
        })}
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" component="h3">
            Textos y bordes
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Texto principal: {ratio(colors.text, colors.surface)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Texto secundario: {ratio(colors.textSecondary, colors.surface)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, p: 1, borderRadius: '10px', border: 1, borderColor: colors.inputBorder }}
          >
            Borde de campo: {ratio(colors.inputBorder, colors.surface)}
          </Typography>
        </Card>
      </Box>
    </GuideSection>
  )
}

const typeSamples = [
  ['h1', 'Título de la página'],
  ['h2', 'Nombre en el encabezado'],
  ['h3', 'Título de sección'],
  ['h4', 'Placa del vehículo'],
  ['h5', 'Subtítulo'],
  ['h6', 'Título de tarjeta'],
  ['body1', 'Texto normal, para leer con calma.'],
  ['body2', 'Texto secundario y de detalles.'],
  ['caption', 'Notas pequeñas'],
  ['button', 'Texto de botón'],
] as const

const weightNames: Record<string, string> = {
  '400': 'normal',
  '500': 'media',
  '600': 'seminegrita',
  '700': 'negrita',
}

function TypographySection() {
  const { typography } = useTheme()

  return (
    <GuideSection title="Tipografía">
      <Stack spacing={2}>
        {typeSamples.map(([variant, text]) => {
          const { fontSize, fontWeight } = typography[variant]
          const px = typeof fontSize === 'string' ? parseFloat(fontSize) * 16 : fontSize
          return (
            <Box key={variant}>
              <Typography variant={variant} component="p">
                {text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {variant} · {px} px · {weightNames[String(fontWeight)] ?? fontWeight}
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </GuideSection>
  )
}

const taxiDeEjemplo: Vehiculo = {
  id: 1,
  placa: 'XYZ789',
  marca: 'Vehículo de ejemplo',
  modelo: 'Taxi',
  tipo: 'TAXI',
  habilitado_indrive: false,
  conductor: 'Conductor de ejemplo',
  cuota_diaria: 60000,
  activo: true,
}

function VehicleCardExample() {
  return (
    <Card sx={{ p: 2, maxWidth: 520 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <IconoVehiculo vehiculo={taxiDeEjemplo} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" component="h3">
                XYZ789
              </Typography>
              <Typography color="text.secondary" noWrap>
                Vehículo de ejemplo
              </Typography>
            </Box>
            <StatusChip label="Activo" tone="green" />
          </Stack>
          <Box sx={{ mt: 1 }}>
            <StatusChip label="Taxi" tone="orange" />
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Stack component="dl" direction="row" spacing={2} sx={{ m: 0 }}>
            <InfoItem label="Conductor" value="Conductor de ejemplo" />
            <InfoItem label="Cuota diaria" value="$60.000" />
          </Stack>
        </Box>
      </Stack>
    </Card>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography component="dt" variant="body2" sx={{ color: 'primary.main', fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
        {value}
      </Typography>
    </Box>
  )
}
