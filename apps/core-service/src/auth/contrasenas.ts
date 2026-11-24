import { argon2, randomBytes, timingSafeEqual } from 'node:crypto';

interface ParametrosArgon2 {
  memory: number;
  passes: number;
  parallelism: number;
  tagLength: number;
}

// Configuración mínima que recomienda OWASP para Argon2id: 19 MiB de memoria,
// 2 pasadas y 1 hilo. Cada hash guarda la configuración con que se creó, así
// que si algún día se sube, los hashes anteriores siguen verificando.
const CONFIGURACION: ParametrosArgon2 = {
  memory: 19456,
  passes: 2,
  parallelism: 1,
  tagLength: 32,
};
const BYTES_SAL = 16;

// Formato PHC: $argon2id$v=19$m=<memoria>,t=<pasadas>,p=<hilos>$<sal>$<hash>,
// con la sal y el hash en base64 sin relleno.
const FORMATO_PHC =
  /^\$argon2id\$v=19\$m=(\d{1,7}),t=(\d{1,2}),p=(\d{1,2})\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/;

export async function crearHashContrasena(contrasena: string): Promise<string> {
  const sal = randomBytes(BYTES_SAL);
  const hash = await calcularArgon2id(contrasena, sal, CONFIGURACION);
  const { memory, passes, parallelism } = CONFIGURACION;
  return `$argon2id$v=19$m=${memory},t=${passes},p=${parallelism}$${base64(sal)}$${base64(hash)}`;
}

// Devuelve false, sin lanzar error, si la contraseña no coincide o si el hash no
// tiene el formato esperado, como el texto que dejan los datos de prueba.
export async function verificarContrasena(
  contrasena: string,
  hashGuardado: string,
): Promise<boolean> {
  const partes = FORMATO_PHC.exec(hashGuardado);
  if (!partes) {
    return false;
  }
  const [memory, passes, parallelism] = partes.slice(1, 4).map(Number);
  const sal = Buffer.from(partes[4], 'base64');
  const esperado = Buffer.from(partes[5], 'base64');
  // Límites para un hash guardado: evitan que un valor mal escrito en la base
  // pida, por ejemplo, gigas de memoria en cada intento de ingreso.
  const parametrosRazonables =
    parallelism >= 1 &&
    parallelism <= 4 &&
    memory >= 8 * parallelism &&
    memory <= 262144 &&
    passes >= 1 &&
    passes <= 10 &&
    sal.length >= 8 &&
    esperado.length >= 16 &&
    esperado.length <= 64;
  if (!parametrosRazonables) {
    return false;
  }

  try {
    const calculado = await calcularArgon2id(contrasena, sal, {
      memory,
      passes,
      parallelism,
      tagLength: esperado.length,
    });
    // Compara en tiempo constante, para no revelar cuántos bytes coinciden.
    return timingSafeEqual(calculado, esperado);
  } catch {
    return false;
  }
}

function calcularArgon2id(
  contrasena: string,
  sal: Buffer,
  parametros: ParametrosArgon2,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    argon2(
      'argon2id',
      { message: contrasena, nonce: sal, ...parametros },
      (error, clave) => (error ? reject(error) : resolve(clave)),
    );
  });
}

function base64(bytes: Buffer): string {
  return bytes.toString('base64').replace(/=+$/, '');
}
