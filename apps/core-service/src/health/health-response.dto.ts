export class HealthResponseDto {
  status: 'ok';
  service: string;
}

export class HasuraHealthResponseDto {
  status: 'ok';
  service: 'hasura';
  vehiculos: number;
}
