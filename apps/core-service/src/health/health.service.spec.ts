import { HealthService } from './health.service.js';

describe('HealthService', () => {
  it('devuelve el estado de core-service', () => {
    expect(new HealthService().check()).toEqual({
      status: 'ok',
      service: 'core-service',
    });
  });
});
