import { useEffect, useRef, useState } from 'react'
import BlockOutlined from '@mui/icons-material/BlockOutlined'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link, useNavigate, useParams } from 'react-router'
import { BackButton } from '../../components/BackButton.tsx'
import { SectionCard } from '../../components/SectionCard.tsx'
import { AppShell } from '../../components/layout/AppShell.tsx'
import type { VehiculoConRegistros } from '../../types/vehiculo.ts'
import { BotonCerrarSesion } from '../auth/BotonCerrarSesion.tsx'
import { AvisoExito } from './AvisoExito.tsx'
import { Dato } from './Dato.tsx'
import { DialogoQuitarVehiculo, type AccionQuitar } from './DialogoQuitarVehiculo.tsx'
import { EstadoDeCarga } from './EstadoDeCarga.tsx'
import { EtiquetasVehiculo } from './EtiquetasVehiculo.tsx'
import { IconoVehiculo } from './IconoVehiculo.tsx'
import { useVehiculo } from './useDatosRemotos.ts'
import { contar, formatearPesos, nombreTipo, type EstadoConAviso } from './vehiculo-formato.ts'

// Pantallas 11 y 12 de la evidencia de sesión 3, por ahora con los datos del
// vehículo y cuántos registros tiene; registrar ingresos, gastos y documentos
// llega en las próximas sesiones.
export function PaginaVehiculo() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const carga = useVehiculo(id)
  const vehiculo = carga.datos

  return (
    <AppShell acciones={<BotonCerrarSesion />}>
      <title>{vehiculo ? `${vehiculo.placa} · Control Vehicular` : 'Vehículo · Control Vehicular'}</title>
      <Box sx={{ mb: 2, ml: -1 }}>
        <BackButton onClick={() => navigate('/vehiculos')} />
      </Box>
      <AvisoExito />
      <EstadoDeCarga carga={carga} textoCargando="Cargando el vehículo…">
        {vehiculo && <DetalleVehiculo vehiculo={vehiculo} recargar={carga.recargar} />}
      </EstadoDeCarga>
    </AppShell>
  )
}

interface DetalleVehiculoProps {
  vehiculo: VehiculoConRegistros
  recargar: () => void
}

function DetalleVehiculo({ vehiculo, recargar }: DetalleVehiculoProps) {
  const navigate = useNavigate()
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const titulo = useRef<HTMLHeadingElement>(null)
  const enfocarTitulo = useRef(false)

  const { ingresos, gastos, documentos } = vehiculo.registros
  const tieneRegistros = ingresos + gastos + documentos > 0
  // Con registros se desactiva para conservarlos; sin registros se puede eliminar.
  const accion: AccionQuitar | null = tieneRegistros ? (vehiculo.activo ? 'desactivar' : null) : 'eliminar'

  // Al desactivarlo desaparece el botón que tenía el foco: el foco pasa al
  // título cuando llega el vehículo actualizado.
  useEffect(() => {
    if (enfocarTitulo.current && !vehiculo.activo) {
      enfocarTitulo.current = false
      titulo.current?.focus()
    }
  }, [vehiculo])

  function alTerminar() {
    if (accion === 'eliminar') {
      // Con replace, «Atrás» no regresa al vehículo que ya no existe.
      navigate('/vehiculos', { replace: true, state: { aviso: 'Vehículo eliminado.' } satisfies EstadoConAviso })
      return
    }
    setDialogoAbierto(false)
    enfocarTitulo.current = true
    navigate(`/vehiculos/${vehiculo.id}`, {
      replace: true,
      state: { aviso: 'Vehículo desactivado.' } satisfies EstadoConAviso,
    })
    recargar()
  }

  function alCerrar(huboError: boolean) {
    setDialogoAbierto(false)
    if (huboError) recargar()
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <IconoVehiculo vehiculo={vehiculo} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h1" ref={titulo} tabIndex={-1} sx={{ overflowWrap: 'anywhere' }}>
            {vehiculo.placa}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1, overflowWrap: 'anywhere' }}>
            {vehiculo.marca} · {vehiculo.modelo}
          </Typography>
          <EtiquetasVehiculo vehiculo={vehiculo} />
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button
          component={Link}
          to={`/vehiculos/${vehiculo.id}/editar`}
          variant="outlined"
          startIcon={<EditOutlined />}
        >
          Editar
        </Button>
        {accion && (
          <Button
            variant="outlined"
            color={accion === 'eliminar' ? 'error' : 'primary'}
            startIcon={accion === 'eliminar' ? <DeleteOutlined /> : <BlockOutlined />}
            onClick={() => setDialogoAbierto(true)}
          >
            {accion === 'eliminar' ? 'Eliminar' : 'Desactivar'}
          </Button>
        )}
      </Stack>

      {!vehiculo.activo && (
        <Alert severity="info">
          Este vehículo está desactivado: ya no cuenta en tu flota. Por ahora no se puede volver a activar.
        </Alert>
      )}

      <SectionCard title="Datos del vehículo">
        <Box
          component="dl"
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2, m: 0 }}
        >
          <Dato nombre="Tipo">{nombreTipo(vehiculo.tipo)}</Dato>
          <Dato nombre="Estado">{vehiculo.activo ? 'Activo' : 'Desactivado'}</Dato>
          <Dato nombre="Marca">{vehiculo.marca}</Dato>
          <Dato nombre="Modelo">{vehiculo.modelo}</Dato>
          {vehiculo.tipo === 'TAXI' ? (
            <>
              <Dato nombre="Conductor">{vehiculo.conductor ?? 'Sin conductor'}</Dato>
              <Dato nombre="Cuota diaria">
                {vehiculo.cuota_diaria === null ? '—' : formatearPesos(vehiculo.cuota_diaria)}
              </Dato>
            </>
          ) : (
            <Dato nombre="inDrive">{vehiculo.habilitado_indrive ? 'Habilitado' : 'No habilitado'}</Dato>
          )}
        </Box>
      </SectionCard>

      <SectionCard title="Registros">
        <Box
          component="dl"
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2, m: 0 }}
        >
          <Dato nombre="Ingresos">{ingresos}</Dato>
          <Dato nombre="Gastos">{gastos}</Dato>
          <Dato nombre="Documentos">{documentos}</Dato>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {!tieneRegistros
            ? 'Aún no tiene ingresos, gastos ni documentos: se puede eliminar.'
            : vehiculo.activo
              ? `Tiene ${contar(ingresos + gastos + documentos, 'registro', 'registros')}: se puede desactivar para conservarlos, pero no eliminar.`
              : `Tiene ${contar(ingresos + gastos + documentos, 'registro', 'registros')}: por eso no se puede eliminar.`}
        </Typography>
      </SectionCard>

      {accion && (
        <DialogoQuitarVehiculo
          vehiculo={vehiculo}
          accion={accion}
          abierto={dialogoAbierto}
          onCerrar={alCerrar}
          onHecho={alTerminar}
        />
      )}
    </Stack>
  )
}
