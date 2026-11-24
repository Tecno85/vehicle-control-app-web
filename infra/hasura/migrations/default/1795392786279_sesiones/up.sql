-- Sesiones del ingreso con correo y contraseña (sesión 9).
--
-- Cada fila es un token de renovación: el permiso largo que la web-app guarda en
-- una cookie para pedir un token de acceso nuevo sin volver a escribir la
-- contraseña. El token de acceso no se guarda: dura 15 minutos y core-service lo
-- comprueba con su firma.
--
-- Solo se guarda el SHA-256 del token, nunca el token. Cada renovación revoca su
-- fila y crea otra. Las filas que salen de un mismo ingreso con contraseña
-- comparten la familia y su límite total de 30 días. Si llega un token ya
-- revocado, alguien más puede tenerlo, y core-service revoca toda su familia.
--
-- Aquí solo van las reglas de una misma fila. Las demás (vencimiento, límite
-- total y revocación) las aplica core-service.

create table sesiones (
  id               integer generated always as identity primary key,
  usuario_id       integer     not null references usuarios (id),
  token_hash       char(64)    not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  familia          uuid        not null,
  familia_vence_en timestamptz not null,
  expira_en        timestamptz not null,
  revocada_en      timestamptz,
  creado_en        timestamptz not null default now(),
  -- Una renovación nunca dura más que el límite total de su familia.
  check (expira_en <= familia_vence_en)
);

create index sesiones_usuario_id_idx on sesiones (usuario_id);
create index sesiones_familia_idx on sesiones (familia);
