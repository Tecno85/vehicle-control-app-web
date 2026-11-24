// Crea el hash Argon2id de la contraseña de una cuenta de prueba, para cargarlo
// en la base con SQL. No hay registro propio en la primera versión, así que solo
// este script crea contraseñas. Se ejecuta con:
//   npm run contrasena --workspace apps/core-service
// Pide la contraseña dos veces sin mostrarla e imprime solo el hash. Las
// preguntas y los errores van a la salida de errores, y la contraseña no se
// guarda en archivos ni en registros.
import { createInterface, type Interface } from 'node:readline';
import { crearHashContrasena } from './contrasenas.js';

const LONGITUD_MINIMA = 12;

// Cuenta los caracteres como los ve una persona: una letra con tilde o un emoji
// cuentan como uno.
const segmentador = new Intl.Segmenter('es', { granularity: 'grapheme' });

let lector: Interface | undefined;
let lineas: AsyncIterator<string> | undefined;

async function main(): Promise<void> {
  const contrasena = await leerContrasena(
    `Contraseña (mínimo ${LONGITUD_MINIMA} caracteres): `,
  );
  if (caracteres(contrasena).length < LONGITUD_MINIMA) {
    throw new Error(
      `La contraseña debe tener al menos ${LONGITUD_MINIMA} caracteres.`,
    );
  }
  const repetida = await leerContrasena('Escríbela otra vez: ');
  if (repetida !== contrasena) {
    throw new Error('Las dos contraseñas no coinciden.');
  }
  process.stdout.write(`${await crearHashContrasena(contrasena)}\n`);
}

function leerContrasena(pregunta: string): Promise<string> {
  process.stderr.write(pregunta);
  return process.stdin.isTTY ? leerSinMostrar() : leerLinea();
}

// En la terminal: lee tecla por tecla, sin mostrar lo que se escribe.
function leerSinMostrar(): Promise<string> {
  const entrada = process.stdin;
  return new Promise((resolve, reject) => {
    let texto = '';
    const terminar = () => {
      entrada.off('data', alRecibir);
      entrada.setRawMode(false);
      entrada.pause();
      process.stderr.write('\n');
    };
    const alRecibir = (datos: string) => {
      for (const caracter of datos) {
        if (caracter === '\r' || caracter === '\n') {
          terminar();
          resolve(texto);
          return;
        }
        if (caracter === '\u0003') {
          terminar();
          reject(new Error('Cancelado.'));
          return;
        }
        if (caracter === '\u007f' || caracter === '\b') {
          texto = caracteres(texto).slice(0, -1).join('');
        } else if (caracter >= ' ') {
          texto += caracter;
        }
      }
    };
    entrada.setRawMode(true);
    entrada.setEncoding('utf8');
    entrada.on('data', alRecibir);
    entrada.resume();
  });
}

function caracteres(texto: string): string[] {
  return Array.from(segmentador.segment(texto), ({ segment }) => segment);
}

// Con la entrada redirigida, por ejemplo desde otro programa: lee una línea.
async function leerLinea(): Promise<string> {
  lector ??= createInterface({ input: process.stdin });
  lineas ??= lector[Symbol.asyncIterator]();
  const { value, done } = await lineas.next();
  if (done) {
    throw new Error('No se recibió la contraseña.');
  }
  process.stderr.write('\n');
  return value;
}

try {
  await main();
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'No se pudo crear el hash.'}\n`,
  );
  process.exitCode = 1;
} finally {
  lector?.close();
}
