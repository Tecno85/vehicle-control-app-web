-- Deshace la migración de sesiones: borra la tabla y todas las sesiones
-- guardadas. Quien tenga una sesión abierta tendrá que volver a ingresar.

drop table sesiones;
