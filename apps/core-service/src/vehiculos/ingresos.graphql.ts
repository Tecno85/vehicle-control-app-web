export const VEHICULO_PARA_INGRESO = `query VehiculoParaIngreso($id: Int!, $usuarioId: Int!) {
  vehiculos(where: { id: { _eq: $id }, usuario_id: { _eq: $usuarioId } }) {
    id activo tipo habilitado_indrive cuota_diaria
  }
}`;

export const CREAR_INGRESO = `mutation CrearIngreso($ingreso: ingresos_insert_input!) {
  insert_ingresos_one(object: $ingreso) {
    id vehiculo_id tipo fecha valor cuota_referencia motivo nota
  }
}`;

export const INGRESOS_DEL_VEHICULO = `query IngresosDelVehiculo($id: Int!, $usuarioId: Int!) {
  vehiculos(where: { id: { _eq: $id }, usuario_id: { _eq: $usuarioId } }) {
    ingresos(order_by: [{ fecha: desc }, { id: desc }]) {
      id vehiculo_id tipo fecha valor cuota_referencia motivo nota
    }
  }
}`;
