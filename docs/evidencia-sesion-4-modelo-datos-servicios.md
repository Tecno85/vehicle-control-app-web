# Modelo de datos y servicios de VehicleControlApp Web

| Proyecto | Responsable y versión |
|---|---|
| VehicleControlApp Web · DazaDev | Ivan Dario Madrid Daza, trabajo individual. Versión 0.1 del 26 de octubre de 2026: borrador de los apartados 1 y 2 para la revisión del 29 de octubre de 2026. |

- **Actividad:** Sesiones 4 y 5 — Modelo de datos y servicios del MVP
- **Usuaria inicial:** Katerin, propietaria y administradora de una pequeña flota
- **Estado:** modelo inicial para revisión. Es un diseño previo a la programación: no hay base de datos, API ni autenticación implementadas.

Esta evidencia sigue la plantilla del instructor. En esta versión desarrollo los apartados 1 y 2, que corresponden a la semana 4. Los apartados 3 (servicios) y 4 (revisión y compromisos) se completan para el 5 de noviembre de 2026.

Parto de las historias HU-01 a HU-05 de la [evidencia de sesión 2](evidencia-sesion-2-requerimientos-backlog.md), de las pantallas, reglas y ajustes de la [evidencia de sesión 3](evidencia-sesion-3-diseno-pantallas.md) y de las validaciones del prototipo. Los datos del ejemplo son ficticios.

## 1. Proceso y entidades

### Proceso del MVP

El MVP registra la información diaria de cada vehículo de la flota y permite consultarla en un solo lugar. Cada cuenta tiene su propia flota y no hay roles compartidos. El recorrido principal, con datos ficticios, es el siguiente:

1. La titular ingresa con su correo y contraseña y ve su flota.
2. Crea el taxi XYZ789 con una cuota diaria de $60.000.
3. Registra el ingreso de un día por $60.000. Junto con el ingreso se guarda el gasto de $5.000 del pago al conductor.
4. Registra el SOAT del taxi con su nombre y vencimiento, sin archivo. Más tarde adjunta el PDF.
5. Consulta el taxi y ve el ingreso de $60.000, el gasto de $5.000 y el SOAT con su soporte. Si intenta registrar otro día por $40.000 sin escribir el motivo, la aplicación rechaza el ingreso y no guarda el ingreso ni el gasto del conductor.

### Qué información necesitamos guardar

| Entidad o tabla | Para qué sirve |
|---|---|
| `usuarios` | Identificar a la persona titular de cada cuenta y permitirle ingresar. |
| `vehiculos` | Conservar los vehículos de cada cuenta, su clasificación como taxi o particular, la cuota del taxi y si un particular trabaja con inDrive. |
| `ingresos` | Guardar el ingreso diario de cada vehículo: el valor recibido del taxi frente a su cuota o el total variable de inDrive. |
| `categorias_gasto` | Conservar las categorías de gasto de cada cuenta y saber cuáles siguen activas. |
| `gastos` | Guardar los gastos de cada vehículo con fecha, valor, descripción y categoría, incluido el pago automático al conductor. |
| `documentos` | Guardar el SOAT y la tecnomecánica de cada vehículo con su vencimiento y la referencia a su archivo de soporte. |

### Historias y tablas

| Historia | Tablas que utiliza |
|---|---|
| Acceso transversal: crear cuenta e ingresar | `usuarios` |
| HU-01 · Crear y clasificar vehículos | `vehiculos`, `usuarios` |
| HU-02 · Registrar ingresos y ajustar la cuota del taxi | `ingresos`, `vehiculos`; `gastos` y `categorias_gasto` para el pago al conductor |
| HU-03 · Registrar gastos y mantener categorías | `gastos`, `categorias_gasto`, `vehiculos` |
| HU-04 · Registrar y consultar documentos | `documentos`, `vehiculos` |
| HU-05 · Consultar información por vehículo | `vehiculos`, `ingresos`, `gastos`, `documentos` |

### Trabajo en dos semanas

| Semana y encuentro | Avance esperado | Revisión |
|---|---|---|
| 4 · 22 de octubre | Proceso, entidades, diagrama y campos iniciales (esta versión). | 29 de octubre |
| 5 · 29 de octubre | Modelo ajustado, servicios principales y comprobación del flujo. | 5 de noviembre |

Las funciones que quedan para después del MVP son:
- El resumen mensual que propuso Katerin en la prueba del 20 de octubre.
- Las novedades, los impuestos, las alertas y recordatorios de vencimiento, los reportes y las facturas.
- Los roles para compartir una flota.

## 2. Modelo de datos

Cada vehículo pertenece a una cuenta. Los ingresos, gastos y documentos pertenecen a un vehículo y, a través de él, a la misma cuenta. Las categorías también son de cada cuenta. PK identifica la fila y FK la conecta con otra tabla.

![Diagrama del modelo de datos de VehicleControlApp Web](evidencia-sesion-4/diagrama-modelo-datos.png)

### Campos de cada tabla

En **Tipo** uso tipos simples y, entre paréntesis, su equivalente en PostgreSQL:
- Los valores en dinero son pesos colombianos sin decimales.
- `fecha` es el día del registro que elige la titular.
- `creado_en` es la fecha y hora en que el servidor guarda la fila.

**Tabla: `usuarios`**

| Campo | Tipo | Regla o explicación |
|---|---|---|
| id | entero (`integer`) | PK. Lo genera el sistema. |
| nombre | texto (`varchar(80)`) | Obligatorio. Nombre visible de la titular. |
| correo | texto (`varchar(120)`) | Obligatorio y único. Sirve para ingresar y recuperar la contraseña. |
| contrasena_hash | texto (`text`) | Obligatorio. Contraseña protegida mediante hash; nunca se muestra ni se devuelve. |
| activo | sí/no (`boolean`) | Inicia en sí. Solo una cuenta activa puede ingresar. |
| creado_en | fecha y hora (`timestamptz`) | La establece el servidor. |

**Tabla: `vehiculos`**

| Campo | Tipo | Regla o explicación |
|---|---|---|
| id | entero (`integer`) | PK. Lo genera el sistema. |
| usuario_id | entero (`integer`) | FK obligatoria a `usuarios.id`. Se toma de la sesión, no del formulario. |
| placa | texto (`varchar(10)`) | Obligatoria y en mayúsculas. Única dentro de la misma cuenta. Otra cuenta puede registrar la misma placa. |
| marca | texto (`varchar(60)`) | Obligatoria. |
| modelo | texto (`varchar(60)`) | Obligatorio. Modelo o año. |
| tipo | texto (`varchar(12)`) | Obligatorio: TAXI o PARTICULAR. |
| habilitado_indrive | sí/no (`boolean`) | Inicia en no. Solo puede ser sí en un vehículo particular. |
| conductor | texto (`varchar(80)`) | Opcional. Solo aplica al taxi. |
| cuota_diaria | entero (`integer`) | Obligatoria en el taxi y mayor o igual a cero; vacía en el particular. Es la cuota vigente; Katerin puede cambiarla. |
| activo | sí/no (`boolean`) | Inicia en sí. Un vehículo con registros se desactiva en lugar de eliminarse. |
| creado_en | fecha y hora (`timestamptz`) | La establece el servidor. |

**Tabla: `ingresos`**

| Campo | Tipo | Regla o explicación |
|---|---|---|
| id | entero (`integer`) | PK. Lo genera el sistema. |
| vehiculo_id | entero (`integer`) | FK obligatoria a `vehiculos.id`. El vehículo debe estar activo y pertenecer a la cuenta. |
| tipo | texto (`varchar(10)`) | Obligatorio: TAXI o INDRIVE. Debe coincidir con el vehículo: TAXI para un taxi e INDRIVE para un particular habilitado. |
| fecha | fecha (`date`) | Obligatoria. Solo un ingreso por vehículo y fecha; para corregirlo se edita el registro. |
| valor | entero (`integer`) | Obligatorio y mayor o igual a cero. Se admite cero cuando no hubo ingreso. |
| cuota_referencia | entero (`integer`) | Solo en el taxi. Copia la cuota del vehículo al registrar, para que un cambio de cuota no altere los ingresos anteriores. |
| motivo | texto (`text`) | Obligatorio en el taxi cuando el valor es distinto de la cuota de referencia. |
| nota | texto (`text`) | Opcional. Se usa en inDrive. |
| creado_en | fecha y hora (`timestamptz`) | La establece el servidor. |

**Tabla: `categorias_gasto`**

| Campo | Tipo | Regla o explicación |
|---|---|---|
| id | entero (`integer`) | PK. Lo genera el sistema. |
| usuario_id | entero (`integer`) | FK obligatoria a `usuarios.id`. Cada cuenta tiene sus categorías. |
| nombre | texto (`varchar(40)`) | Obligatorio y único dentro de la cuenta, sin distinguir mayúsculas. Al crear la cuenta se generan Combustible, Lavado, Mantenimiento y Repuestos. «Conductor» se crea con el primer pago automático. |
| activo | sí/no (`boolean`) | Inicia en sí. Una categoría desactivada no aparece en gastos nuevos y se conserva en los anteriores. |

**Tabla: `gastos`**

| Campo | Tipo | Regla o explicación |
|---|---|---|
| id | entero (`integer`) | PK. Lo genera el sistema. |
| vehiculo_id | entero (`integer`) | FK obligatoria a `vehiculos.id`. El vehículo debe estar activo y pertenecer a la cuenta. |
| categoria_id | entero (`integer`) | FK obligatoria a `categorias_gasto.id`. Debe ser una categoría activa de la misma cuenta. |
| fecha | fecha (`date`) | Obligatoria. |
| valor | entero (`integer`) | Obligatorio y mayor que cero. |
| descripcion | texto (`varchar(120)`) | Obligatoria. |
| ingreso_id | entero (`integer`) | FK opcional y única a `ingresos.id`. Solo la tiene el pago automático de $5.000 al conductor; indica qué ingreso lo generó. |
| creado_en | fecha y hora (`timestamptz`) | La establece el servidor. |

Al guardar un ingreso de taxi mayor que cero, el ingreso y el gasto del conductor se guardan juntos: si uno falla, no se guarda ninguno. El gasto queda en la categoría «Conductor» y Katerin lo puede editar si ese día no se pagó.

**Tabla: `documentos`**

| Campo | Tipo | Regla o explicación |
|---|---|---|
| id | entero (`integer`) | PK. Lo genera el sistema. |
| vehiculo_id | entero (`integer`) | FK obligatoria a `vehiculos.id`. |
| tipo | texto (`varchar(15)`) | Obligatorio: SOAT o TECNOMECANICA. |
| nombre | texto (`varchar(80)`) | Obligatorio. Por ejemplo, «SOAT 2026». |
| vencimiento | fecha (`date`) | Obligatoria. |
| archivo_nombre | texto (`varchar(255)`) | Opcional. Nombre original del archivo; vacío mientras no se adjunte. |
| archivo_tipo | texto (`varchar(100)`) | Opcional. Formato del archivo, por ejemplo PDF o imagen. |
| archivo_ruta | texto (`text`) | Opcional. Referencia al archivo guardado. El lugar de almacenamiento está pendiente. |
| creado_en | fecha y hora (`timestamptz`) | La establece el servidor. |

Un registro admite un solo archivo. Al reemplazarlo cambian los tres campos `archivo_*`; al eliminar el documento también se elimina su archivo.

### Datos que se calculan

Estos datos no se guardan en una columna, para evitar copias que puedan quedar desactualizadas:
- Totales de ingresos y gastos por vehículo y por mes, y el neto.
- Próximos vencimientos de la flota.
- Si un documento tiene archivo, a partir de `archivo_ruta`.
- Si un documento está vigente o vencido, a partir de `vencimiento`.
- Si un vehículo tiene registros, que decide si se desactiva o se puede eliminar.

### Cómo se relacionan las tablas

| Relación | Explicación y campo que conecta | Hasura |
|---|---|---|
| `usuarios` con `vehiculos` | Uno a muchos: una cuenta tiene cero o muchos vehículos; cada vehículo pertenece a una cuenta. FK obligatoria `vehiculos.usuario_id`. | `usuario.vehiculos`: array. `vehiculo.usuario`: object. |
| `usuarios` con `categorias_gasto` | Uno a muchos: una cuenta tiene sus categorías; cada categoría pertenece a una cuenta. FK obligatoria `categorias_gasto.usuario_id`. | `usuario.categorias_gasto`: array. `categoria_gasto.usuario`: object. |
| `vehiculos` con `ingresos` | Uno a muchos: un vehículo tiene cero o muchos ingresos, uno por fecha. FK obligatoria `ingresos.vehiculo_id`. | `vehiculo.ingresos`: array. `ingreso.vehiculo`: object. |
| `vehiculos` con `gastos` | Uno a muchos: un vehículo tiene cero o muchos gastos. FK obligatoria `gastos.vehiculo_id`. | `vehiculo.gastos`: array. `gasto.vehiculo`: object. |
| `vehiculos` con `documentos` | Uno a muchos: un vehículo tiene cero o muchos documentos. FK obligatoria `documentos.vehiculo_id`. | `vehiculo.documentos`: array. `documento.vehiculo`: object. |
| `categorias_gasto` con `gastos` | Uno a muchos: una categoría clasifica cero o muchos gastos. FK obligatoria `gastos.categoria_id`. | `categoria_gasto.gastos`: array. `gasto.categoria`: object. |
| `ingresos` con `gastos` | Uno a cero o uno: un ingreso de taxi genera como máximo un pago al conductor. FK opcional y única `gastos.ingreso_id`. | `ingreso.pago_conductor`: object. `gasto.ingreso`: object. |

No hay relaciones muchos a muchos, así que no se necesita una tabla intermedia.

**Regla de pertenencia:** cada ingreso, gasto o documento llega a su cuenta a través de `vehiculos.usuario_id`. La categoría de un gasto debe pertenecer a la misma cuenta que el vehículo, y el gasto del conductor debe ser del mismo vehículo que su ingreso.

### Decisiones y pendientes del modelo

El 26 de octubre de 2026 tomé estas decisiones de diseño como responsable del producto. No son decisiones de Katerin ni están implementadas:

- Los ingresos de taxi e inDrive van en una sola tabla con el campo `tipo`.
- Solo hay un ingreso por vehículo y fecha. Esto resuelve el pendiente de duplicados que dejó abierto la evidencia de sesión 2.
- La placa es única dentro de cada cuenta.
- Las categorías son de cada cuenta.
- El pago al conductor se conecta con su ingreso mediante `gastos.ingreso_id`.

Frente al borrador de la sección 9.3 de la evidencia de sesión 3:
- Agrego el `nombre` del documento, que exige HU-04.
- Calculo el estado del documento en lugar de guardarlo.
- Reemplazo las marcas `conductorPagado` y `esConductor` por la FK `gastos.ingreso_id`.

| Pendiente | Fecha |
|---|---|
| Qué pasa con el gasto del conductor al editar o eliminar su ingreso. Se define con los servicios de la semana 5. | 5 de noviembre de 2026 |
| Desde cuándo aplica una cuota nueva del taxi. El modelo ya conserva la cuota de referencia de cada ingreso. | Por definir |
| Si se puede reactivar un vehículo o una categoría. El campo `activo` lo permitiría. | Por definir |
| Formatos, tamaño, almacenamiento y conservación de los archivos. | Por definir |
| Reglas de contraseña, verificación del correo y vigencia del enlace de recuperación, y si se necesita una tabla para esos enlaces. | Por definir |

### Dudas para la revisión del 29 de octubre

1. ¿Es adecuado reunir los ingresos de taxi e inDrive en una sola tabla con `tipo`, o es preferible separarlos?
2. ¿Conviene guardar el dinero como entero en pesos (`integer`) o como `numeric`?
3. Mientras no se define dónde se guardan los archivos, ¿es suficiente registrar en `documentos` la referencia al archivo?
4. ¿La tabla para los enlaces de recuperación de contraseña se debe modelar ahora o puede esperar a la actividad de autenticación?

La orientación técnica del instructor es React, NestJS, Hasura GraphQL Engine y PostgreSQL en Neon. La uso como referencia para los tipos y las relaciones; no es una decisión cerrada. Los apartados 3 y 4 se completan para el 5 de noviembre de 2026.

La plantilla sugiere la carpeta `docs/04-datos-servicios`. Conservo la convención del repositorio: la evidencia en `docs/evidencia-sesion-4-modelo-datos-servicios.md` y el diagrama en `docs/evidencia-sesion-4/`.

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1 | 26 de octubre de 2026 | Proceso, entidades, diagrama, campos y relaciones iniciales para la revisión del 29 de octubre. |

## Fuentes

- Instructor: *Sesiones 04 y 05 — Modelo de Datos y Contratos de API*, *Plantilla de Datos y API* y *Ejemplo de Datos y API — Horizonte*. Uso el ejemplo solo como referencia de estructura.
- [Evidencia de requerimientos y backlog de sesión 2](evidencia-sesion-2-requerimientos-backlog.md).
- [Evidencia de diseño de pantallas de sesión 3](evidencia-sesion-3-diseno-pantallas.md).
- [Contexto del proyecto](contexto-proyecto.md).
- Prototipo de sesión 3: las validaciones de vehículos, ingresos, gastos, categorías y documentos.
