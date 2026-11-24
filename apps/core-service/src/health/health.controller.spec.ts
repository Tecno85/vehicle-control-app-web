import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HasuraError } from '../hasura/hasura.errors.js';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

describe('HealthController', () => {
  let controller: HealthController;
  const healthService = {
    check: vi.fn(() => ({ status: 'ok', service: 'core-service' })),
    checkHasura: vi.fn(),
  };

  beforeEach(async () => {
    healthService.checkHasura.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: healthService }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('responde el estado de core-service', () => {
    expect(controller.check()).toEqual({
      status: 'ok',
      service: 'core-service',
    });
  });

  it('responde el conteo de vehículos de la cuenta cuando Hasura contesta', async () => {
    healthService.checkHasura.mockResolvedValue({
      status: 'ok',
      service: 'hasura',
      vehiculos: 1,
    });

    await expect(controller.checkHasura(7)).resolves.toEqual({
      status: 'ok',
      service: 'hasura',
      vehiculos: 1,
    });
    expect(healthService.checkHasura).toHaveBeenCalledWith(7);
  });

  it('responde 503 con el mensaje del error cuando Hasura falla', async () => {
    healthService.checkHasura.mockRejectedValue(
      new HasuraError('TIMEOUT', 'Hasura no respondió en 5000 ms.'),
    );

    const error: unknown = await controller.checkHasura(7).catch((e) => e);

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getStatus()).toBe(503);
    expect((error as ServiceUnavailableException).message).toBe(
      'Hasura no respondió en 5000 ms.',
    );
  });
});
