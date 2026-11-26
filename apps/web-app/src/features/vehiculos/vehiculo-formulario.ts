import type { DatosVehiculo, TipoVehiculo, Vehiculo } from '../../types/vehiculo.ts'
import { formatearMiles } from './vehiculo-formato.ts'

// Estado del formulario de vehículo y sus reglas. Son las mismas de
// core-service, con sus mensajes, para avisar antes de enviar; core-service
// las vuelve a revisar al recibir los datos.

export interface ValoresVehiculo {
  placa: string
  marca: string
  modelo: string
  tipo: TipoVehiculo | ''
  conductor: string
  // Texto tal como se escribe, por ejemplo «70.000».
  cuota: string
  indrive: boolean
}

export type CampoVehiculo = keyof ValoresVehiculo
export type ErroresVehiculo = Partial<Record<CampoVehiculo, string>>

// En el orden de la pantalla: el foco va al primero que tenga un error.
const ORDEN: CampoVehiculo[] = ['placa', 'marca', 'modelo', 'tipo', 'conductor', 'cuota', 'indrive']

// Nombres de los campos en las respuestas de core-service.
const CAMPO_DEL_SERVIDOR: Record<string, CampoVehiculo> = {
  placa: 'placa',
  marca: 'marca',
  modelo: 'modelo',
  tipo: 'tipo',
  conductor: 'conductor',
  cuota_diaria: 'cuota',
  habilitado_indrive: 'indrive',
}

const ENTERO_MAXIMO = 2_147_483_647

export function valoresIniciales(vehiculo?: Vehiculo): ValoresVehiculo {
  if (!vehiculo) {
    return { placa: '', marca: '', modelo: '', tipo: '', conductor: '', cuota: '', indrive: false }
  }
  return {
    placa: vehiculo.placa,
    marca: vehiculo.marca,
    modelo: vehiculo.modelo,
    tipo: vehiculo.tipo,
    conductor: vehiculo.conductor ?? '',
    cuota: vehiculo.cuota_diaria === null ? '' : formatearMiles(vehiculo.cuota_diaria),
    indrive: vehiculo.habilitado_indrive,
  }
}

// Como core-service: sin espacios y en mayúsculas.
export function limpiarPlaca(texto: string): string {
  return texto.replace(/\s/g, '').toUpperCase()
}

// Acepta «70000», «70.000» o «$ 70.000».
function sinSeparadores(cuota: string): string {
  return cuota.replace(/[.\s$]/g, '')
}

export function camposVisibles(tipo: ValoresVehiculo['tipo']): CampoVehiculo[] {
  if (tipo === 'TAXI') return ORDEN.filter((campo) => campo !== 'indrive')
  if (tipo === 'PARTICULAR') return ORDEN.filter((campo) => campo !== 'conductor' && campo !== 'cuota')
  return ORDEN.filter((campo) => campo !== 'conductor' && campo !== 'cuota' && campo !== 'indrive')
}

export function validarCampo(campo: CampoVehiculo, valores: ValoresVehiculo): string | undefined {
  switch (campo) {
    case 'placa':
      if (!valores.placa) return 'Escribe la placa.'
      if (!/^[A-Z0-9]{1,10}$/.test(valores.placa)) return 'La placa lleva solo letras y números, hasta 10.'
      return undefined
    case 'marca':
      if (!valores.marca.trim()) return 'Escribe la marca.'
      if (valores.marca.trim().length > 60) return 'La marca tiene hasta 60 caracteres.'
      return undefined
    case 'modelo':
      if (!valores.modelo.trim()) return 'Escribe el modelo.'
      if (valores.modelo.trim().length > 60) return 'El modelo tiene hasta 60 caracteres.'
      return undefined
    case 'tipo':
      return valores.tipo ? undefined : 'Elige si es taxi o particular.'
    case 'conductor':
      return valores.conductor.trim().length > 80
        ? 'El nombre del conductor tiene hasta 80 caracteres.'
        : undefined
    case 'cuota': {
      const cuota = sinSeparadores(valores.cuota)
      if (!cuota) return 'Escribe la cuota diaria del taxi.'
      if (/^-\d+$/.test(cuota)) return 'La cuota no puede ser negativa.'
      if (!/^\d+$/.test(cuota)) return 'Escribe la cuota en pesos, sin decimales.'
      if (Number(cuota) > ENTERO_MAXIMO) return 'La cuota es demasiado alta.'
      return undefined
    }
    case 'indrive':
      return undefined
  }
}

export function validar(valores: ValoresVehiculo): ErroresVehiculo {
  const errores: ErroresVehiculo = {}
  for (const campo of camposVisibles(valores.tipo)) {
    const mensaje = validarCampo(campo, valores)
    if (mensaje) errores[campo] = mensaje
  }
  return errores
}

export function primerCampoConError(errores: ErroresVehiculo): CampoVehiculo | undefined {
  return ORDEN.find((campo) => errores[campo])
}

// Separa los mensajes por campo de core-service: los de un campo que está en
// pantalla van debajo de él; si queda alguno sin campo, la página muestra el
// mensaje general.
export function erroresDelServidor(
  campos: Record<string, string> | undefined,
  tipo: ValoresVehiculo['tipo'],
): { errores: ErroresVehiculo; sinCampo: boolean } {
  const errores: ErroresVehiculo = {}
  let sinCampo = false
  const visibles = camposVisibles(tipo)
  for (const [nombre, mensaje] of Object.entries(campos ?? {})) {
    const campo = CAMPO_DEL_SERVIDOR[nombre]
    if (campo && visibles.includes(campo)) errores[campo] = mensaje
    else sinCampo = true
  }
  return { errores, sinCampo }
}

// Cada tipo envía solo lo suyo: el taxi no se habilita para inDrive, y el
// particular no lleva conductor ni cuota. Solo se llama con datos válidos.
export function datosParaEnviar(valores: ValoresVehiculo): DatosVehiculo {
  const esTaxi = valores.tipo === 'TAXI'
  return {
    placa: valores.placa,
    marca: valores.marca.trim(),
    modelo: valores.modelo.trim(),
    tipo: esTaxi ? 'TAXI' : 'PARTICULAR',
    habilitado_indrive: esTaxi ? false : valores.indrive,
    conductor: esTaxi ? valores.conductor.trim() || null : null,
    cuota_diaria: esTaxi ? Number(sinSeparadores(valores.cuota)) : null,
  }
}
