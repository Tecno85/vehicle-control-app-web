-- Datos de prueba ficticios para un entorno nuevo: el caso del taxi XYZ789 de la
-- evidencia de sesiones 4 y 5. No son datos reales de Katerin.
--
-- Las filas se buscan por correo y placa, así que no dependen de los ids que
-- asigne la base. Se cargan una sola vez: si se repiten, el correo único de la
-- titular lo rechaza y no se duplican.

-- No es un hash válido: ninguna contraseña coincide con él, así que esta cuenta
-- no sirve para entrar. El ingreso con correo y contraseña llega con el acceso.
insert into usuarios (nombre, correo, contrasena_hash)
values ('Titular de prueba', 'titular.prueba@example.com', 'sin-contrasena: cuenta de prueba');

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
where u.correo = 'titular.prueba@example.com';

insert into vehiculos (usuario_id, placa, marca, modelo, tipo, conductor, cuota_diaria)
select id, 'XYZ789', 'Vehículo de ejemplo', 'Taxi', 'TAXI', 'Conductor de ejemplo', 60000
from usuarios
where correo = 'titular.prueba@example.com';

insert into ingresos (vehiculo_id, tipo, fecha, valor, cuota_referencia)
select v.id, 'TAXI', date '2026-10-01', 60000, v.cuota_diaria
from vehiculos v
join usuarios u on u.id = v.usuario_id
where u.correo = 'titular.prueba@example.com' and v.placa = 'XYZ789';

insert into gastos (vehiculo_id, categoria_id, fecha, valor, descripcion)
select v.id, c.id, date '2026-10-01', 5000, 'Ahorro para la prima del conductor'
from usuarios u
join vehiculos v on v.usuario_id = u.id and v.placa = 'XYZ789'
join categorias_gasto c on c.usuario_id = u.id and c.nombre = 'Ahorro prima conductor'
where u.correo = 'titular.prueba@example.com';

insert into documentos (vehiculo_id, tipo, nombre, vencimiento)
select v.id, 'SOAT', 'SOAT de ejemplo', date '2027-01-15'
from vehiculos v
join usuarios u on u.id = v.usuario_id
where u.correo = 'titular.prueba@example.com' and v.placa = 'XYZ789';
