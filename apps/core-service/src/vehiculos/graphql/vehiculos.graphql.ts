// Operaciones fijas de vehículos: el navegador no puede enviar otras. Los
// datos van como variables, con los tipos que Hasura genera para la tabla, y
// toda operación filtra por el usuario_id de la sesión: un vehículo de otra
// cuenta no aparece, igual que si no existiera.

const CAMPOS = 'id placa marca modelo tipo habilitado_indrive conductor cuota_diaria activo';

// Primero los activos y, dentro de cada grupo, por placa.
export const FLOTA_DE_LA_CUENTA = `query FlotaDeLaCuenta($usuarioId: Int!) {
  vehiculos(where: { usuario_id: { _eq: $usuarioId } }, order_by: [{ activo: desc }, { placa: asc }]) {
    ${CAMPOS}
  }
}`;

// Con cuántos ingresos, gastos y documentos tiene: deciden si se puede
// eliminar o cambiar de tipo.
export const VEHICULO_DE_LA_CUENTA = `query VehiculoDeLaCuenta($id: Int!, $usuarioId: Int!) {
  vehiculos(where: { id: { _eq: $id }, usuario_id: { _eq: $usuarioId } }) {
    ${CAMPOS}
    ingresos_aggregate { aggregate { count } }
    gastos_aggregate { aggregate { count } }
    documentos_aggregate { aggregate { count } }
  }
}`;

export const CREAR_VEHICULO = `mutation CrearVehiculo($vehiculo: vehiculos_insert_input!) {
  insert_vehiculos_one(object: $vehiculo) { ${CAMPOS} }
}`;

export const ACTUALIZAR_VEHICULO = `mutation ActualizarVehiculo($id: Int!, $usuarioId: Int!, $cambios: vehiculos_set_input!) {
  update_vehiculos(where: { id: { _eq: $id }, usuario_id: { _eq: $usuarioId } }, _set: $cambios) {
    affected_rows
    returning { ${CAMPOS} }
  }
}`;

export const ELIMINAR_VEHICULO = `mutation EliminarVehiculo($id: Int!, $usuarioId: Int!) {
  delete_vehiculos(where: { id: { _eq: $id }, usuario_id: { _eq: $usuarioId } }) {
    affected_rows
  }
}`;
