export interface Titular {
  nombre: string
  correo: string
}

export interface SesionIniciada {
  tokenAcceso: string
  titular: Titular
}
