import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

const recortado = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CrearIngresoDto {
  @IsDateString({}, { message: 'Escribe una fecha válida.' })
  fecha!: string;

  @IsInt({ message: 'Escribe el valor recibido en pesos, sin decimales.' })
  @Min(0, { message: 'El valor no puede ser negativo.' })
  valor!: number;

  @IsOptional()
  @IsString({ message: 'Escribe un motivo válido.' })
  @MaxLength(500, { message: 'El motivo tiene hasta 500 caracteres.' })
  @Transform(recortado)
  motivo?: string;

  @IsOptional()
  @IsString({ message: 'Escribe una nota válida.' })
  @MaxLength(500, { message: 'La nota tiene hasta 500 caracteres.' })
  @Transform(recortado)
  nota?: string;
}
