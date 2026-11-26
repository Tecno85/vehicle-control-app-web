// Espejo del contrato de vehículos de core-service (evidencia de sesión 10,
// apartado 3): si el contrato cambia allá, se cambia aquí.

export type TipoVehiculo = 'TAXI' | 'PARTICULAR'

export interface Vehiculo {
  id: number
  placa: string
  marca: string
  modelo: string
  tipo: TipoVehiculo
  habilitado_indrive: boolean
  conductor: string | null
  cuota_diaria: number | null
  activo: boolean
}

export interface Registros {
  ingresos: number
  gastos: number
  documentos: number
}

export interface VehiculoConRegistros extends Vehiculo {
  registros: Registros
}

export interface Flota {
  vehiculos: Vehiculo[]
  // Cuentan solo los vehículos activos.
  conteos: { vehiculos: number; taxis: number; particulares: number }
}

// Lo que el formulario envía al crear o editar. La cuenta, el id y el estado no
// se envían: core-service los toma de la sesión o de la base.
export type DatosVehiculo = Omit<Vehiculo, 'id' | 'activo'>
