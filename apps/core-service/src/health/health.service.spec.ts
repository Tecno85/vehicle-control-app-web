import { Test, TestingModule } from '@nestjs/testing';
import { HasuraError } from '../hasura/hasura.errors.js';
import { HasuraService } from '../hasura/hasura.service.js';
import { HealthService, VEHICULOS_COUNT_QUERY } from './health.service.js';

describe('HealthService', () => {
  let service: HealthService;
  const hasuraService = { request: vi.fn() };

  beforeEach(async () => {
    hasuraService.request.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: HasuraService, useValue: hasuraService },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('devuelve el estado de core-service', () => {
    expect(service.check()).toEqual({
      status: 'ok',
      service: 'core-service',
    });
  });

  it('cuenta solo los vehículos de la cuenta, con una consulta fija', async () => {
    hasuraService.request.mockResolvedValue({
      vehiculos_aggregate: { aggregate: { count: 1 } },
    });

    await expect(service.checkHasura(7)).resolves.toEqual({
      status: 'ok',
      service: 'hasura',
      vehiculos: 1,
    });
    expect(hasuraService.request).toHaveBeenCalledWith(VEHICULOS_COUNT_QUERY, {
      usuarioId: 7,
    });
    expect(VEHICULOS_COUNT_QUERY).toContain('usuario_id: { _eq: $usuarioId }');
  });

  it('avisa si Hasura no devuelve el conteo', async () => {
    hasuraService.request.mockResolvedValue({ vehiculos_aggregate: null });

    await expect(service.checkHasura(7)).rejects.toThrow(
      new HasuraError(
        'UNAVAILABLE',
        'Hasura respondió con un formato inesperado.',
      ),
    );
  });
});
