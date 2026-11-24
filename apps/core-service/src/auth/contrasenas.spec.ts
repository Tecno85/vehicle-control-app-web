import { crearHashContrasena, verificarContrasena } from './contrasenas.js';

const CONTRASENA = 'Contraseña-de-prueba-ñandú-2026';

describe('contraseñas con Argon2id', () => {
  it('crea un hash en formato PHC con la configuración de OWASP', async () => {
    const hash = await crearHashContrasena(CONTRASENA);

    expect(hash).toMatch(
      /^\$argon2id\$v=19\$m=19456,t=2,p=1\$[A-Za-z0-9+/]{22}\$[A-Za-z0-9+/]{43}$/,
    );
    expect(hash).not.toContain(CONTRASENA);
  });

  it('verifica la contraseña correcta y rechaza una equivocada', async () => {
    const hash = await crearHashContrasena(CONTRASENA);

    await expect(verificarContrasena(CONTRASENA, hash)).resolves.toBe(true);
    await expect(
      verificarContrasena('Contraseña-de-prueba-ñandú-2027', hash),
    ).resolves.toBe(false);
    await expect(verificarContrasena('', hash)).resolves.toBe(false);
  });

  it('crea un hash distinto cada vez, porque la sal es aleatoria', async () => {
    const primero = await crearHashContrasena(CONTRASENA);
    const segundo = await crearHashContrasena(CONTRASENA);

    expect(primero).not.toBe(segundo);
    await expect(verificarContrasena(CONTRASENA, segundo)).resolves.toBe(true);
  });

  it('rechaza, sin lanzar error, el texto de los datos de prueba y los hashes mal formados', async () => {
    const hash = await crearHashContrasena(CONTRASENA);
    const invalidos = [
      'sin-contrasena: cuenta de prueba',
      '',
      hash.replace('$argon2id$', '$argon2i$'),
      hash.replace('m=19456', 'm=99999999'),
      hash.replace('p=1', 'p=0'),
      hash.replace('t=2', 't=0'),
      hash.slice(0, hash.lastIndexOf('$')),
      `${hash}$extra`,
      hash.replace(/\$[^$]+$/, '$no-es-base64!'),
    ];

    for (const invalido of invalidos) {
      await expect(verificarContrasena(CONTRASENA, invalido)).resolves.toBe(
        false,
      );
    }
  });
});
