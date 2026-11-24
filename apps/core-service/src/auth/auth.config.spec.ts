import { readAuthConfig } from './auth.config.js';

describe('readAuthConfig', () => {
  it('devuelve null si falta JWT_SECRET, para que core-service arranque igual', () => {
    expect(readAuthConfig({})).toBeNull();
    expect(readAuthConfig({ JWT_SECRET: '   ' })).toBeNull();
  });

  it('detiene el arranque si JWT_SECRET tiene menos de 32 caracteres', () => {
    expect(() => readAuthConfig({ JWT_SECRET: 'x'.repeat(31) })).toThrow(
      'JWT_SECRET debe tener al menos 32 caracteres.',
    );
  });

  it('devuelve el secreto sin espacios alrededor', () => {
    const secreto = 'a'.repeat(44);
    expect(readAuthConfig({ JWT_SECRET: ` ${secreto}\n` })).toEqual({
      jwtSecret: secreto,
    });
  });
});
