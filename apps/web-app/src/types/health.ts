// Espejo de HealthResponseDto en core-service: si el contrato cambia allá, se cambia aquí.
export interface HealthResponse {
  status: 'ok'
  service: string
}
