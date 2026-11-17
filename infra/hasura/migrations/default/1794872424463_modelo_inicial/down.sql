-- Deshace la migración inicial: borra las tablas en orden inverso al de up.sql,
-- para que ninguna quede apuntando a una tabla que ya no existe.
-- Borra también todos los datos, así que solo se usa en una base de prueba.

drop table documentos;
drop table gastos;
drop table categorias_gasto;
drop table ingresos;
drop table vehiculos;
drop table usuarios;
