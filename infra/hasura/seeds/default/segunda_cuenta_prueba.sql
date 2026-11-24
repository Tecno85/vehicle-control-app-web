-- Segunda cuenta ficticia, para demostrar que una cuenta no puede ver los datos
-- de otra (sesión 9). No son datos reales de Katerin.
--
-- Como en datos_ficticios.sql, las filas se buscan por correo y placa, así que
-- no dependen de los ids que asigne la base. Se carga una sola vez: si se
-- repite, el correo único de la titular lo rechaza y no se duplica.

-- No es un hash válido: ninguna contraseña coincide con él, así que esta cuenta
-- no sirve para entrar. La contraseña se crea con
-- `npm run contrasena --workspace apps/core-service` y su hash se carga
-- directamente en la base, sin pasar por el repositorio.
insert into usuarios (nombre, correo, contrasena_hash)
values ('Segunda titular de prueba', 'segunda.prueba@example.com', 'sin-contrasena: cuenta de prueba');

insert into categorias_gasto (usuario_id, nombre)
select u.id, c.nombre
from usuarios u
cross join (values
  ('Combustible'),
  ('Lavado'),
  ('Mantenimiento'),
  ('Repuestos'),
  ('Ahorro prima conductor')
) as c (nombre)
where u.correo = 'segunda.prueba@example.com';

-- Un particular habilitado para inDrive: no tiene cuota ni conductor.
insert into vehiculos (usuario_id, placa, marca, modelo, tipo, habilitado_indrive)
select id, 'KLM456', 'Vehículo de ejemplo', 'Particular', 'PARTICULAR', true
from usuarios
where correo = 'segunda.prueba@example.com';
