import type { TipoVehiculo } from '../../types/vehiculo.ts'

const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const miles = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })

// «$ 70.000», como se escriben los pesos en Colombia.
export function formatearPesos(valor: number): string {
  return pesos.format(valor)
}

// «70.000», para mostrar la cuota guardada dentro de su campo.
export function formatearMiles(valor: number): string {
  return miles.format(valor)
}

export function nombreTipo(tipo: TipoVehiculo): string {
  return tipo === 'TAXI' ? 'Taxi' : 'Particular'
}

// «1 vehículo», «3 vehículos».
export function contar(cantidad: number, singular: string, plural: string): string {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`
}

// Clave del estado de la navegación con el que una página le pasa a la
// siguiente el aviso de éxito («Vehículo guardado.»).
export interface EstadoConAviso {
  aviso: string
}

export function avisoDe(estado: unknown): string | null {
  if (typeof estado !== 'object' || estado === null) return null
  const aviso = (estado as Partial<EstadoConAviso>).aviso
  return typeof aviso === 'string' ? aviso : null
}
