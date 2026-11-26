import { PartialType } from '@nestjs/mapped-types';
import { Equals, IsBoolean, ValidateIf } from 'class-validator';
import { CrearVehiculoDto } from './crear-vehiculo.dto.js';

// Cambios de un vehículo (S07 y la desactivación de S08): los mismos campos que
// al crear, todos opcionales y con las mismas reglas. Con skipNullProperties
// en false, un null se revisa como cualquier valor: la placa no puede llegar
// en null, pero el conductor y la cuota sí, porque null quiere decir «sin».
export class ActualizarVehiculoDto extends PartialType(CrearVehiculoDto, {
  skipNullProperties: false,
}) {
  // Solo sirve para desactivar: reactivar un vehículo sigue «Por definir».
  @ValidateIf((_, valor) => valor !== undefined)
  @IsBoolean({ message: 'Indica si el vehículo sigue activo.' })
  @Equals(false, { message: 'Por ahora un vehículo desactivado no se puede reactivar.' })
  activo?: false;
}
