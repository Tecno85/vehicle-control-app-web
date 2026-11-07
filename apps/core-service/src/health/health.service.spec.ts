import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service.js';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('devuelve el estado de core-service', () => {
    expect(service.check()).toEqual({
      status: 'ok',
      service: 'core-service',
    });
  });
});
