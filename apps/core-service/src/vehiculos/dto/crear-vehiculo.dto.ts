import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export const TIPOS_VEHICULO = ['TAXI', 'PARTICULAR'] as const;
export type TipoVehiculo = (typeof TIPOS_VEHICULO)[number];

// Mayor valor de una columna integer de PostgreSQL, como cuota_diaria.
const ENTERO_MAXIMO = 2_147_483_647;

const sinEspaciosEnMayusculas = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.replace(/\s/g, '').toUpperCase() : value;
const recortado = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
// Un conductor en blanco quiere decir «sin conductor».
const recortadoOVacioANulo = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() || null : value;

// Datos de un vehículo nuevo (S02). Solo se aceptan estos campos: la cuenta
// sale de la sesión, y el id, el estado y la fecha los pone la base.
// En cada campo, la regla de más arriba es la más básica: si fallan varias, el
// mensaje que se muestra es el suyo (common/validacion.ts).
// Lo que depende del tipo (cuota, conductor e inDrive) lo revisa el servicio.
export class CrearVehiculoDto {
  @IsString({ message: 'Escribe la placa.' })
  @IsNotEmpty({ message: 'Escribe la placa.' })
  @Matches(/^[A-Z0-9]{1,10}$/, { message: 'La placa lleva solo letras y números, hasta 10.' })
  @Transform(sinEspaciosEnMayusculas)
  placa!: string;

  @IsString({ message: 'Escribe la marca.' })
  @IsNotEmpty({ message: 'Escribe la marca.' })
  @MaxLength(60, { message: 'La marca tiene hasta 60 caracteres.' })
  @Transform(recortado)
  marca!: string;

  @IsString({ message: 'Escribe el modelo.' })
  @IsNotEmpty({ message: 'Escribe el modelo.' })
  @MaxLength(60, { message: 'El modelo tiene hasta 60 caracteres.' })
  @Transform(recortado)
  modelo!: string;

  @IsIn(TIPOS_VEHICULO, { message: 'Elige si es taxi o particular.' })
  tipo!: TipoVehiculo;

  // Puede faltar, pero no llegar en null: la columna no acepta vacíos.
  @ValidateIf((_, valor) => valor !== undefined)
  @IsBoolean({ message: 'Indica si está habilitado para inDrive.' })
  habilitado_indrive?: boolean;

  @IsOptional()
  @IsString({ message: 'Escribe el nombre del conductor.' })
  @MaxLength(80, { message: 'El nombre del conductor tiene hasta 80 caracteres.' })
  @Transform(recortadoOVacioANulo)
  conductor?: string | null;

  @IsOptional()
  @IsInt({ message: 'Escribe la cuota en pesos, sin decimales.' })
  @Min(0, { message: 'La cuota no puede ser negativa.' })
  @Max(ENTERO_MAXIMO, { message: 'La cuota es demasiado alta.' })
  cuota_diaria?: number | null;
}
