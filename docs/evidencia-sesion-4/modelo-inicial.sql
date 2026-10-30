-- Modelo de la primera versión de VehicleControlApp Web para PostgreSQL (Neon).
-- Traduce la versión 0.6 de docs/evidencia-sesion-4-modelo-datos-servicios.md,
-- que cubre solo la primera versión: sin archivos ni registro automático del
-- ahorro para la prima del conductor.
--
-- Aquí solo van las reglas que se comprueban dentro de una misma fila o con
-- restricciones únicas. Las reglas que cruzan tablas se validan en los
-- servicios de la semana 5: que el tipo del ingreso coincida con el vehículo,
-- que la categoría sea de la misma cuenta y que el vehículo esté activo.

create table usuarios (
  id              integer generated always as identity primary key,
  nombre          varchar(80)  not null,
  correo          varchar(120) not null unique,
  contrasena_hash text         not null,
  activo          boolean      not null default true,
  creado_en       timestamptz  not null default now()
);

create table vehiculos (
  id                 integer generated always as identity primary key,
  usuario_id         integer     not null references usuarios (id),
  placa              varchar(10) not null check (placa = upper(placa)),
  marca              varchar(60) not null,
  modelo             varchar(60) not null,
  tipo               varchar(12) not null check (tipo in ('TAXI', 'PARTICULAR')),
  habilitado_indrive boolean     not null default false,
  conductor          varchar(80),
  cuota_diaria       integer     check (cuota_diaria >= 0),
  activo             boolean     not null default true,
  creado_en          timestamptz not null default now(),
  unique (usuario_id, placa),
  check (tipo = 'PARTICULAR' or not habilitado_indrive),
  check (tipo = 'TAXI' or conductor is null),
  check ((tipo = 'TAXI') = (cuota_diaria is not null))
);

create table ingresos (
  id               integer generated always as identity primary key,
  vehiculo_id      integer     not null references vehiculos (id),
  tipo             varchar(10) not null check (tipo in ('TAXI', 'INDRIVE')),
  fecha            date        not null,
  valor            integer     not null check (valor >= 0),
  cuota_referencia integer     check (cuota_referencia >= 0),
  motivo           text,
  nota             text,
  creado_en        timestamptz not null default now(),
  unique (vehiculo_id, fecha),
  check ((tipo = 'TAXI') = (cuota_referencia is not null)),
  -- El taxi necesita motivo cuando el valor recibido difiere de su cuota.
  check (tipo <> 'TAXI' or valor = cuota_referencia or coalesce(btrim(motivo), '') <> '')
);

create table categorias_gasto (
  id         integer generated always as identity primary key,
  usuario_id integer     not null references usuarios (id),
  nombre     varchar(40) not null,
  activo     boolean     not null default true
);

-- Nombre único dentro de cada cuenta sin distinguir mayúsculas.
create unique index categorias_gasto_usuario_nombre_key
  on categorias_gasto (usuario_id, lower(nombre));

create table gastos (
  id           integer generated always as identity primary key,
  vehiculo_id  integer      not null references vehiculos (id),
  categoria_id integer      not null references categorias_gasto (id),
  fecha        date         not null,
  valor        integer      not null check (valor > 0),
  descripcion  varchar(120) not null,
  creado_en    timestamptz  not null default now()
);

create index gastos_vehiculo_id_idx on gastos (vehiculo_id);
create index gastos_categoria_id_idx on gastos (categoria_id);

create table documentos (
  id          integer generated always as identity primary key,
  vehiculo_id integer     not null references vehiculos (id),
  tipo        varchar(15) not null check (tipo in ('SOAT', 'TECNOMECANICA')),
  nombre      varchar(80) not null,
  vencimiento date        not null,
  creado_en   timestamptz not null default now()
);

create index documentos_vehiculo_id_idx on documentos (vehiculo_id);
