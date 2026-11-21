// Colores de la app Android de VehicleControlApp (ui/theme/Color.kt y Theme.kt).
// Cada tono tiene tres usos: relleno (fill), texto (text) y fondo suave (soft).
// En modo claro, el verde, el naranja y el rojo de Android no llegaban a 4,5:1 como texto
// sobre sus fondos, así que su tono de texto es un poco más oscuro. El relleno no cambia.
// En modo oscuro todos cumplen tal como están.

export interface Tone {
  fill: string
  text: string
  soft: string
}

export interface ColorSet {
  blue: Tone
  green: Tone
  orange: Tone
  red: Tone
  purple: Tone
  onBlue: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  // El borde de Android (#E4E7EC) no llega a 3:1 sobre el fondo; los campos usan uno más visible.
  inputBorder: string
}

export const lightColors: ColorSet = {
  blue: { fill: '#2C5EF5', text: '#2C5EF5', soft: '#E8F1FF' },
  green: { fill: '#188038', text: '#187E37', soft: '#E8F5E9' },
  orange: { fill: '#E8710A', text: '#B25708', soft: '#FFF7DB' },
  red: { fill: '#D93025', text: '#D02E24', soft: '#FFECEC' },
  purple: { fill: '#6F35D4', text: '#6F35D4', soft: '#F0E7FF' },
  onBlue: '#FFFFFF',
  background: '#F4F5F7',
  surface: '#FFFFFF',
  text: '#1A1D23',
  textSecondary: '#5F6570',
  border: '#E4E7EC',
  inputBorder: '#878D99',
}

export const darkColors: ColorSet = {
  blue: { fill: '#8AA7FF', text: '#8AA7FF', soft: '#1E2440' },
  green: { fill: '#34D399', text: '#34D399', soft: '#0F2E24' },
  orange: { fill: '#FBBF24', text: '#FBBF24', soft: '#2E2410' },
  red: { fill: '#F87171', text: '#F87171', soft: '#2E1515' },
  purple: { fill: '#C4B5FD', text: '#C4B5FD', soft: '#2A2340' },
  onBlue: '#081A4A',
  background: '#0F1117',
  surface: '#1A1D27',
  text: '#E9ECF2',
  textSecondary: '#B0B5C2',
  border: '#2A2D3A',
  inputBorder: '#6B7080',
}
