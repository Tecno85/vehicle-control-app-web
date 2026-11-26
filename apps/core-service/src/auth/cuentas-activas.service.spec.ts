import { HasuraError } from '../hasura/hasura.errors.js';
import type { HasuraService } from '../hasura/hasura.service.js';
import { CuentasActivasService } from './cuentas-activas.service.js';

describe('CuentasActivasService', () => {
  let request: ReturnType<typeof vi.fn>;
  let cuentas: CuentasActivasService;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    request = vi.fn();
    cuentas = new CuentasActivasService({ request } as unknown as HasuraService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('consulta si la cuenta está activa, solo con su id', async () => {
    request.mockResolvedValue({ usuarios_by_pk: { activo: true } });

    await expect(cuentas.estaActiva(7)).resolves.toBe(true);
    expect(request).toHaveBeenCalledWith(expect.stringContaining('query CuentaActiva'), { id: 7 });
  });

  it('una cuenta desactivada o borrada no está activa', async () => {
    request
      .mockResolvedValueOnce({ usuarios_by_pk: { activo: false } })
      .mockResolvedValueOnce({ usuarios_by_pk: null });

    await expect(cuentas.estaActiva(7)).resolves.toBe(false);
    await expect(cuentas.estaActiva(8)).resolves.toBe(false);
  });

  it('recuerda la respuesta un minuto por cuenta y después vuelve a consultar', async () => {
    request.mockResolvedValue({ usuarios_by_pk: { activo: true } });
    const inicio = Date.now();

    await cuentas.estaActiva(7);
    vi.setSystemTime(inicio + 59_000);
    await cuentas.estaActiva(7);
    expect(request).toHaveBeenCalledTimes(1);

    await cuentas.estaActiva(8);
    expect(request).toHaveBeenCalledTimes(2);

    request.mockResolvedValue({ usuarios_by_pk: { activo: false } });
    vi.setSystemTime(inicio + 60_000);
    await expect(cuentas.estaActiva(7)).resolves.toBe(false);
    expect(request).toHaveBeenCalledTimes(3);
  });

  it('no recuerda una respuesta con un formato inesperado', async () => {
    request
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ usuarios_by_pk: { activo: 'sí' } })
      .mockResolvedValueOnce({ usuarios_by_pk: { activo: true } });

    await expect(cuentas.estaActiva(7)).rejects.toThrow('Hasura respondió con un formato inesperado.');
    await expect(cuentas.estaActiva(7)).rejects.toBeInstanceOf(HasuraError);
    await expect(cuentas.estaActiva(7)).resolves.toBe(true);
  });

  it('deja pasar el error si Hasura falla, sin recordarlo', async () => {
    request
      .mockRejectedValueOnce(new HasuraError('TIMEOUT', 'Hasura no respondió en 5000 ms.'))
      .mockResolvedValueOnce({ usuarios_by_pk: { activo: true } });

    await expect(cuentas.estaActiva(7)).rejects.toBeInstanceOf(HasuraError);
    await expect(cuentas.estaActiva(7)).resolves.toBe(true);
  });
});
