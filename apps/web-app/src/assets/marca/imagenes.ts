import bienvenida600 from './bienvenida-600.webp'
import bienvenida900 from './bienvenida-900.webp'
import particular138 from './particular-138.webp'
import taxi138 from './taxi-138.webp'

// Imágenes de los vehículos desde la sesión 11 (27/11/2026): el sedán lo generó Ivan con ChatGPT y
// el taxi con Gemini; sin logos ni nombres de fabricantes. Van en WebP, más livianas que PNG.
// `width` y `height` dan la proporción, para que la página no salte mientras cargan.

// La pareja del ingreso se ve a 220 px en el celular y a 300 px desde 600 px.
export const imagenBienvenida = {
  src: bienvenida600,
  srcSet: `${bienvenida600} 600w, ${bienvenida900} 900w`,
  sizes: '(min-width: 600px) 300px, 220px',
  width: 900,
  height: 463,
}

// Los carros de las tarjetas se ven a 46 px de ancho. Basta una versión de 138 px (nítida hasta en
// pantallas 3x): pesa unos 5 kB, y una de 92 px quedaría dentro del JavaScript y lo haría más pesado.
export const imagenesVehiculo = {
  TAXI: { src: taxi138, width: 138, height: 62 },
  PARTICULAR: { src: particular138, width: 138, height: 71 },
}
