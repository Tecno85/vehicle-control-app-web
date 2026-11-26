import Add from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router'
import { listarVehiculos } from '../../api/vehiculos.api.ts'
import { EmptyState } from '../../components/EmptyState.tsx'
import { AppShell } from '../../components/layout/AppShell.tsx'
import type { Flota, Vehiculo } from '../../types/vehiculo.ts'
import { BotonCerrarSesion } from '../auth/BotonCerrarSesion.tsx'
import { useAcceso } from '../auth/acceso-context.ts'
import { AvisoExito } from './AvisoExito.tsx'
import { Dato } from './Dato.tsx'
import { EstadoDeCarga } from './EstadoDeCarga.tsx'
import { EtiquetasVehiculo } from './EtiquetasVehiculo.tsx'
import { IconoVehiculo } from './IconoVehiculo.tsx'
import { useDatosRemotos } from './useDatosRemotos.ts'
import { formatearPesos } from './vehiculo-formato.ts'

// Pantalla 08 de la evidencia de sesión 3, sin los próximos vencimientos, que
// llegan con los documentos.
export function PaginaFlota() {
  const { titular } = useAcceso()
  const carga = useDatosRemotos(listarVehiculos)

  return (
    <AppShell acciones={<BotonCerrarSesion />}>
      <title>Mis vehículos · Control Vehicular</title>
      <AvisoExito />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, mb: 3 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
            Hola, {titular?.nombre}
          </Typography>
          <Typography variant="h1">Mis vehículos</Typography>
        </Box>
        <Button component={Link} to="/vehiculos/nuevo" variant="contained" startIcon={<Add />}>
          Agregar vehículo
        </Button>
      </Stack>
      <EstadoDeCarga carga={carga} textoCargando="Cargando tus vehículos…">
        {carga.datos && <ContenidoFlota flota={carga.datos} />}
      </EstadoDeCarga>
    </AppShell>
  )
}

function ContenidoFlota({ flota }: { flota: Flota }) {
  const { vehiculos, conteos } = flota
  if (vehiculos.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes vehículos"
        description="Agrega el primero con el botón «Agregar vehículo»."
      />
    )
  }

  return (
    <Stack spacing={3}>
      <div>
        <Box
          component="dl"
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1.5, m: 0 }}
        >
          <Conteo tono="blue" etiqueta={conteos.vehiculos === 1 ? 'Vehículo' : 'Vehículos'} valor={conteos.vehiculos} />
          <Conteo tono="orange" etiqueta={conteos.taxis === 1 ? 'Taxi' : 'Taxis'} valor={conteos.taxis} />
          <Conteo
            tono="green"
            etiqueta={conteos.particulares === 1 ? 'Particular' : 'Particulares'}
            valor={conteos.particulares}
          />
        </Box>
        {vehiculos.some((vehiculo) => !vehiculo.activo) && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Los conteos no incluyen los vehículos desactivados.
          </Typography>
        )}
      </div>
      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0,
          display: 'grid',
          gap: 2,
          // minmax(0, …): sin él, una línea larga que no se parte ensancha la
          // columna y la página se desplaza a lo ancho en el celular.
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {vehiculos.map((vehiculo) => (
          <li key={vehiculo.id}>
            <TarjetaVehiculo vehiculo={vehiculo} />
          </li>
        ))}
      </Box>
    </Stack>
  )
}

interface ConteoProps {
  tono: 'blue' | 'orange' | 'green'
  etiqueta: string
  valor: number
}

function Conteo({ tono, etiqueta, valor }: ConteoProps) {
  return (
    <Box sx={{ bgcolor: `tones.${tono}.soft`, color: `tones.${tono}.text`, borderRadius: '10px', p: 1.5, minWidth: 0 }}>
      <Typography component="dt" variant="body2" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
        {etiqueta}
      </Typography>
      <Typography component="dd" variant="h3" sx={{ m: 0 }}>
        {valor}
      </Typography>
    </Box>
  )
}

// Toda la tarjeta es un enlace al detalle.
function TarjetaVehiculo({ vehiculo }: { vehiculo: Vehiculo }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        component={Link}
        to={`/vehiculos/${vehiculo.id}`}
        sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
      >
        <Stack direction="row" spacing={2} sx={{ width: '100%', minWidth: 0 }}>
          <IconoVehiculo vehiculo={vehiculo} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h4" component="h2" sx={{ overflowWrap: 'anywhere' }}>
              {vehiculo.placa}
            </Typography>
            <Typography color="text.secondary" noWrap sx={{ mb: 1 }}>
              {vehiculo.marca} · {vehiculo.modelo}
            </Typography>
            <EtiquetasVehiculo vehiculo={vehiculo} />
            {vehiculo.tipo === 'TAXI' && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Box
                  component="dl"
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2, m: 0 }}
                >
                  <Dato nombre="Conductor">{vehiculo.conductor ?? 'Sin conductor'}</Dato>
                  <Dato nombre="Cuota diaria">
                    {vehiculo.cuota_diaria === null ? '—' : formatearPesos(vehiculo.cuota_diaria)}
                  </Dato>
                </Box>
              </>
            )}
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  )
}
