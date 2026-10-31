# Modelo de datos y servicios de VehicleControlApp Web

| Proyecto | Integrantes y versión |
|---|---|
| VehicleControlApp Web · DazaDev | Ivan Dario Madrid Daza, trabajo individual. Versión 0.7 del 31 de octubre de 2026, para la entrega del 6 de noviembre de 2026. |

- **Actividad:** Sesiones 4 y 5 — Modelo de datos y servicios del MVP
- **Usuaria inicial:** Katerin, propietaria y administradora de una pequeña flota
- **Estado:** diseño completo para revisión: modelo de la primera versión, servicios y comprobación del recorrido. Las tablas ya están creadas en Neon y expuestas por Hasura con datos de prueba ficticios; no hay aplicación, servicios, autenticación ni permisos implementados.

Sigo la plantilla del instructor: los apartados 1 y 2 corresponden a la semana 4, y los apartados 3 y 4, a la semana 5. Parto de las historias HU-01 a HU-05 de la [evidencia de sesión 2](evidencia-sesion-2-requerimientos-backlog.md), de las pantallas y reglas de la [evidencia de sesión 3](evidencia-sesion-3-diseno-pantallas.md), de las validaciones del prototipo y de la retroalimentación del instructor técnico. Los datos del ejemplo son ficticios.

## 1. Proceso y entidades

### Alcance de la primera versión

El 27 de octubre de 2026 el instructor técnico revisó la evidencia de sesión 3 y recomendó reducir el alcance de implementación para conservar un MVP viable. El 28 de octubre de 2026 acepté la recomendación y ajusté el modelo a esa primera versión.

- **Entra en la primera versión:**
  - Vehículos taxi y particular, con la cuota del taxi y la opción de inDrive.
  - Ingresos diarios, gastos y categorías.
  - Registro de SOAT y tecnomecánica con nombre y vencimiento.
  - Consulta por vehículo.
  - Ingreso con correo y contraseña a una cuenta creada previamente.
- **Pasa a una fase posterior:**
  - Registro propio de cuentas, verificación del correo y recuperación de contraseña.
  - Almacenamiento, visualización y descarga de archivos de soporte.
  - Registro automático del ahorro para la prima del conductor y otras automatizaciones contables.
  - Resumen mensual.

Las necesidades que expresó Katerin se conservan: adjuntar el soporte del documento (2 de octubre) y replicar su resultado contable con los $5.000 diarios del conductor (20 de octubre). Solo cambia la fase en que se implementan.

El 29 de octubre de 2026 Katerin aclaró que esos $5.000 no son el sueldo del conductor: son un **ahorro** que aparta cada día trabajado para pagarle una **prima a mitad y a final de año**. El sueldo es aparte.

**Pantallas de la primera versión:** usa 26 de las 35 pantallas de la evidencia de sesión 3. Pasan a la fase posterior la 02 y 03 (crear cuenta), la 04 a 07 (recuperar la contraseña), la 15, 16 y 26 (documento con archivo, vista previa y descarga del soporte) y la propuesta de resumen mensual (P). La 01 (iniciar sesión) queda sin los enlaces para crear cuenta y recuperar la contraseña. La 13 y la 29 (registrar y editar documento) quedan sin archivo, la 14 (documento guardado) sin la opción de adjuntar y la 30 (confirmar eliminación) ya no menciona un archivo.

### Proceso del MVP

El MVP registra la información diaria de cada vehículo de la flota y permite consultarla en un solo lugar. Cada cuenta tiene su propia flota y no hay roles compartidos. El recorrido principal, con datos ficticios, es el siguiente:

1. La titular ingresa con el correo y la contraseña de su cuenta y ve su flota.
2. Crea el taxi XYZ789 con una cuota diaria de $60.000.
3. Registra el ingreso de un día por $60.000 y, aparte, el gasto de $5.000 del ahorro diario para la prima del conductor.
4. Registra el SOAT del taxi con su nombre y vencimiento.
5. Consulta el taxi y ve el ingreso de $60.000, el gasto de $5.000 y el SOAT. Si intenta registrar otro día por $40.000 sin escribir el motivo, la aplicación rechaza el ingreso y no guarda nada.

### Qué información necesitamos guardar

| Entidad o tabla | Para qué sirve |
|---|---|
| `usuarios` | Identificar a la persona titular de cada cuenta y permitirle ingresar. |
| `vehiculos` | Conservar los vehículos de cada cuenta, su clasificación como taxi o particular, la cuota del taxi y si un particular trabaja con inDrive. |
| `ingresos` | Guardar el ingreso diario de cada vehículo: el valor recibido del taxi frente a su cuota o el total variable de inDrive. |
| `categorias_gasto` | Conservar las categorías de gasto de cada cuenta y saber cuáles siguen activas. |
| `gastos` | Guardar los gastos de cada vehículo con fecha, valor, descripción y categoría, incluido el ahorro diario para la prima del conductor. |
| `documentos` | Guardar el SOAT y la tecnomecánica de cada vehículo con su nombre y vencimiento. |

### Trabajo en dos semanas

| Semana y encuentro | Avance esperado | Revisión |
|---|---|---|
| 4 · 22 de octubre | Proceso, entidades, diagrama y campos iniciales. | 29 de octubre, trasladada al 30 de octubre |
| 5 · 29 de octubre | Modelo ajustado, servicios principales y comprobación del flujo (esta versión). | 5 de noviembre, trasladada al 6 de noviembre |

El 30 de octubre de 2026 el instructor indicó continuar con los apartados 3 y 4. A esa fecha aún no había revisado los apartados 1 y 2.

Además de lo que pasa a la fase posterior, quedan para después del MVP las novedades, los impuestos, las alertas y recordatorios de vencimiento, los reportes, las facturas y los roles para compartir una flota.

## 2. Modelo de datos

Cada vehículo pertenece a una cuenta. Los ingresos, gastos y documentos pertenecen a un vehículo y, a través de él, a la misma cuenta. Las categorías también son de cada cuenta. PK identifica la fila y FK la conecta con otra tabla.

![Diagrama del modelo de datos de VehicleControlApp Web](evidencia-sesion-4/diagrama-modelo-datos.png)

### Campos de cada tabla

En **Tipo** uso tipos simples y, entre paréntesis, su equivalente en PostgreSQL:
- Los valores en dinero son pesos colombianos sin decimales.
- `fecha` es el día del registro que elige la titular. No puede ser posterior al día actual en Colombia; lo valida el servicio, porque la base cargada en Neon no tiene esa regla.
- `creado_en` es la fecha y hora en que el servidor guarda la fila.

**Tabla: `usuarios`**

| Campo | Tipo | Regla o explicación |
|---|---|---|
| id | entero (`integer`) | PK. Lo genera el sistema. |
| nombre | texto (`varchar(80)`) | Obligatorio. Nombre visible de la titular. |
| correo | texto (`varchar(120)`) | Obligatorio y único. Sirve para ingresar. |
| contrasena_hash | texto (`text`) | Obligatorio. Contraseña protegida mediante hash; nunca se muestra ni se devuelve. |
| activo | sí/no (`boolean`) | Propuesta. Inicia en sí y permitiría desactivar una cuenta sin borrar sus datos. No hay reglas acordadas para desactivar cuentas. |
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
| vehiculo_id | entero (`integer`) | FK obligatoria a `vehiculos.id`. El vehículo pertenece a la cuenta y, al registrar, debe estar activo. |
| tipo | texto (`varchar(10)`) | Obligatorio: TAXI o INDRIVE. Debe coincidir con el vehículo: TAXI para un taxi e INDRIVE para un particular habilitado. |
| fecha | fecha (`date`) | Obligatoria y no posterior al día actual. Solo un ingreso por vehículo y fecha; para corregirlo se edita el registro. |
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
| nombre | texto (`varchar(40)`) | Obligatorio y único dentro de la cuenta, sin distinguir mayúsculas. Al crear la cuenta se generan cinco categorías: Combustible, Lavado, Mantenimiento, Repuestos y Ahorro prima conductor. |
| activo | sí/no (`boolean`) | Inicia en sí. Una categoría desactivada no aparece en gastos nuevos y se conserva en los anteriores. |

**Tabla: `gastos`**

| Campo | Tipo | Regla o explicación |
|---|---|---|
| id | entero (`integer`) | PK. Lo genera el sistema. |
| vehiculo_id | entero (`integer`) | FK obligatoria a `vehiculos.id`. El vehículo pertenece a la cuenta y, al registrar, debe estar activo. |
| categoria_id | entero (`integer`) | FK obligatoria a `categorias_gasto.id`. Es una categoría de la misma cuenta; al registrar o cambiar la categoría, debe estar activa. |
| fecha | fecha (`date`) | Obligatoria y no posterior al día actual. |
| valor | entero (`integer`) | Obligatorio y mayor que cero. |
| descripcion | texto (`varchar(120)`) | Obligatoria. |
| creado_en | fecha y hora (`timestamptz`) | La establece el servidor. |

**Tabla: `documentos`**

| Campo | Tipo | Regla o explicación |
|---|---|---|
| id | entero (`integer`) | PK. Lo genera el sistema. |
| vehiculo_id | entero (`integer`) | FK obligatoria a `vehiculos.id`. El vehículo pertenece a la cuenta y, al registrar, debe estar activo. |
| tipo | texto (`varchar(15)`) | Obligatorio: SOAT o TECNOMECANICA. |
| nombre | texto (`varchar(80)`) | Obligatorio. Por ejemplo, «SOAT 2026». |
| vencimiento | fecha (`date`) | Obligatoria. |
| creado_en | fecha y hora (`timestamptz`) | La establece el servidor. |

### Datos que se calculan

Estos datos no se guardan en una columna, para evitar copias que puedan quedar desactualizadas:
- Totales de ingresos y gastos por vehículo y por mes, y el neto.
- Los conteos de vehículos, taxis y particulares, y los próximos vencimientos de la flota.
- Si un documento está vigente o vencido, a partir de `vencimiento`.
- Si un vehículo tiene registros, que decide si se desactiva o se puede eliminar.
- El ahorro acumulado para la prima del conductor, como suma de los gastos de la categoría «Ahorro prima conductor». Para reconocerla aunque cambie de nombre propongo la marca `es_ahorro_prima`, descrita más abajo.

### Cómo se relacionan las tablas

| Relación | Explicación y campo que conecta | Hasura |
|---|---|---|
| `usuarios` con `vehiculos` | Uno a muchos: una cuenta tiene cero o muchos vehículos; cada vehículo pertenece a una cuenta. FK obligatoria `vehiculos.usuario_id`. | `usuario.vehiculos`: array. `vehiculo.usuario`: object. |
| `usuarios` con `categorias_gasto` | Uno a muchos: una cuenta tiene sus categorías; cada categoría pertenece a una cuenta. FK obligatoria `categorias_gasto.usuario_id`. | `usuario.categorias_gasto`: array. `categoria_gasto.usuario`: object. |
| `vehiculos` con `ingresos` | Uno a muchos: un vehículo tiene cero o muchos ingresos, uno por fecha. FK obligatoria `ingresos.vehiculo_id`. | `vehiculo.ingresos`: array. `ingreso.vehiculo`: object. |
| `vehiculos` con `gastos` | Uno a muchos: un vehículo tiene cero o muchos gastos. FK obligatoria `gastos.vehiculo_id`. | `vehiculo.gastos`: array. `gasto.vehiculo`: object. |
| `vehiculos` con `documentos` | Uno a muchos: un vehículo tiene cero o muchos documentos. FK obligatoria `documentos.vehiculo_id`. | `vehiculo.documentos`: array. `documento.vehiculo`: object. |
| `categorias_gasto` con `gastos` | Uno a muchos: una categoría clasifica cero o muchos gastos. FK obligatoria `gastos.categoria_id`. | `categoria_gasto.gastos`: array. `gasto.categoria`: object. |

No hay relaciones muchos a muchos, así que no se necesita una tabla intermedia.

**Regla de pertenencia:** cada ingreso, gasto o documento llega a su cuenta a través de `vehiculos.usuario_id`. La categoría de un gasto debe pertenecer a la misma cuenta que el vehículo.

### Modelo cargado en Neon y Hasura

Por indicación del instructor, el 28 de octubre de 2026 me registré en Neon y en Hasura Cloud y cargué en ellos el modelo de la primera versión. No es una aplicación implementada: no hay pantallas conectadas, servicios de NestJS, autenticación ni permisos por cuenta.

| Paso | Resultado |
|---|---|
| Base de datos en Neon | Proyecto `vehicle-control-app-web` en AWS US East 2 (Ohio). Ejecuté [`modelo-inicial.sql`](evidencia-sesion-4/modelo-inicial.sql) sin errores: seis tablas y cuatro índices explícitos, además de los que crean las claves primarias y las restricciones únicas. |
| API GraphQL en Hasura Cloud | Proyecto `vehicle-control-app` en el plan gratuito y en la misma región. Se conecta a Neon mediante una variable de entorno; la cadena de conexión y el secreto de administración no se guardan en el repositorio. |
| Tablas y relaciones | Registré las seis tablas y las seis relaciones en ambos sentidos con los nombres de este documento, por ejemplo `vehiculo.ingresos` (array) y `gasto.categoria` (object). Hasura propuso `usuario.categorias_gasto` como object, porque el índice único de categorías usa `lower(nombre)`; la registré a mano como array, que es lo que define el modelo. |

Las pruebas con datos ficticios del 28 y del 30 de octubre están en el apartado 4.

### Ajuste propuesto en la semana 5

Al diseñar los servicios propongo el campo `categorias_gasto.es_ahorro_prima`, sí/no (`boolean`), que **no está cargado en Neon**: el diagrama, las tablas de campos y `modelo-inicial.sql` siguen mostrando el modelo cargado. Inicia en no y marca la categoría del ahorro para la prima del conductor: como máximo una por cuenta, la que se crea con la cuenta. Permite sumar el ahorro aunque la titular cambie el nombre de la categoría; ella no cambia la marca desde la aplicación. En PostgreSQL sería una columna con un índice único por cuenta, limitado a las filas marcadas. Lo cargaré en Neon cuando empiece la programación.

### Cómo crece el modelo en la fase posterior

Es una propuesta para las funciones que pasan a la fase posterior; no forma parte de la primera versión ni del diagrama:
- **Archivos de soporte:** en `documentos`, `archivo_nombre`, `archivo_tipo` y `archivo_ruta`, opcionales y que se guardan o se vacían juntos. Un archivo por registro; al eliminar el documento se elimina también su archivo.
- **Registro automático del ahorro para la prima:** en `gastos`, `ingreso_id`, FK opcional y única a `ingresos.id`, para saber qué ingreso generó cada ahorro. Es una relación de uno a cero o uno; en Hasura, `ingreso.ahorro_prima` y `gasto.ingreso` serían object.
- **Registro, verificación y recuperación:** datos para verificar el correo y enlaces de recuperación con vigencia; la tabla y sus campos están por definir.

Quedan abiertos los formatos, el tamaño, el almacenamiento y la conservación de los archivos; si el ahorro para la prima es siempre de $5.000 o distinto en cada taxi, y dónde se guarda ese valor; qué pasa con el ahorro al editar o eliminar su ingreso, y las reglas de verificación del correo y de vigencia del enlace de recuperación.

### Decisiones y pendientes del modelo

Tomé estas decisiones de diseño como responsable del producto. No son decisiones de Katerin ni están implementadas:

- **26 de octubre de 2026:** los ingresos de taxi e inDrive van en una sola tabla con el campo `tipo`; solo hay un ingreso por vehículo y fecha, lo que resuelve el pendiente de duplicados de la evidencia de sesión 2; la placa es única dentro de cada cuenta, y las categorías son de cada cuenta: Combustible, Lavado, Mantenimiento y Repuestos se generan al crear la cuenta. Ese día también decidí conectar el pago automático al conductor con su ingreso mediante `gastos.ingreso_id`, crear la categoría «Conductor» con el primer pago y eliminar ese gasto si el pago no se hizo.
- **28 de octubre de 2026,** al aplicar la retroalimentación del 27 de octubre: el acceso es un ingreso con correo y contraseña a una cuenta creada previamente; los $5.000 diarios del conductor se registran a mano como un gasto normal, y los documentos se registran con tipo, nombre y vencimiento, sin archivo. El pago automático del 26 de octubre pasa a la fase posterior, junto con el registro propio, la verificación del correo y la recuperación.
- **29 de octubre de 2026,** con la aclaración de Katerin: los $5.000 se registran como gasto en la categoría «Ahorro prima conductor» el día en que se apartan; cuando se paga la prima no se registra otro gasto, para no contar dos veces el mismo dinero, y el sueldo del conductor no se registra en la aplicación.
- **30 de octubre de 2026:** «Ahorro prima conductor» se crea con la cuenta, como quinta categoría inicial junto a las cuatro que indicó Katerin. Al diseñar los servicios decidí además que un vehículo con ingresos no cambia de tipo ni deja de estar habilitado para inDrive (409); que el tipo y la cuota de referencia de un ingreso salen del vehículo; que un recurso de otra cuenta responde 404; que un vehículo inactivo tampoco recibe documentos, como en el prototipo, y propuse la marca `es_ahorro_prima`. Se detallan en el apartado 3.
- **31 de octubre de 2026:** los ingresos y los gastos no aceptan una fecha posterior al día actual; lo valida el servicio y no se agrega a la base. Además, S06 incluye las listas de ingresos, gastos y documentos por mes y los próximos vencimientos de la flota, que usan las pantallas 08 y 33 a 35.

En las decisiones del 26 y 28 de octubre y en la versión 0.2 del historial, «pago al conductor» y la categoría «Conductor» corresponden a lo que, desde la aclaración de Katerin del 29 de octubre, se llama ahorro para la prima del conductor y categoría «Ahorro prima conductor». Se conservan como se escribieron.

Frente al borrador de la sección 9.3 de la evidencia de sesión 3, agrego el `nombre` del documento, que exige HU-04; calculo su estado en lugar de guardarlo, y quito las marcas `conductorPagado` y `esConductor`.

| Pendiente de la primera versión | Fecha |
|---|---|
| Desde cuándo aplica una cuota nueva del taxi. El modelo ya conserva la cuota de referencia de cada ingreso. | Por definir |
| Si se puede reactivar un vehículo o una categoría. El campo `activo` lo permitiría. | Por definir |
| Cómo se crea la cuenta de la titular, que en la primera versión ya debe existir antes de ingresar. | Por definir |
| Reglas de la contraseña para el ingreso y si una cuenta se puede desactivar. | Por definir |
| Si se pueden editar o eliminar los registros de un vehículo inactivo. El prototipo lo permite; falta confirmarlo. | Por definir |
| Cuántos próximos vencimientos muestra la flota y con cuánta anticipación se marca uno como próximo. El prototipo muestra dos de ejemplo. | Por definir |

## 3. Servicios principales a construir

Un servicio es una acción útil que hará el backend. Definí los servicios a partir del proceso del MVP y de las reglas del modelo. Todavía no están programados: son el diseño que guiará la implementación.

### Cómo se organizan

Sigo la orientación del instructor: la aplicación web en React llamará a un servicio central en NestJS, y ese servicio usará Hasura para leer y guardar en Neon. El navegador no consulta Hasura directamente; así las reglas y la cuenta de la sesión se revisan siempre en el servicio. Es una orientación, no una decisión cerrada.

```text
React (pantallas) → NestJS (servicios y reglas) → Hasura (GraphQL) → Neon (PostgreSQL)
```

Reglas comunes a todos los servicios:
- Todos, salvo S01, exigen una sesión iniciada. Sin sesión responden 401.
- La cuenta (`usuario_id`) sale de la sesión, nunca del formulario.
- Si el vehículo o el registro no existe o es de otra cuenta, responden 404, para no revelar datos de otra flota.
- Un rechazo no guarda nada. Los errores devuelven `{ "codigo": "...", "mensaje": "..." }`, con un mensaje claro para la titular.
- Cuando la base rechaza un dato, el servicio reconoce la restricción por su nombre y la traduce sin mostrar el mensaje técnico: `ingresos_check1` pasa a 422 `MOTIVO_REQUERIDO` e `ingresos_vehiculo_id_fecha_key`, a 409 `INGRESO_DUPLICADO`.
- Si algo falla dentro del servidor (código 5xx), la titular ve un mensaje amable y el error se registra sin datos sensibles.

Ninguno de los servicios S01 a S12 escribe en más de una tabla, así que no hay operaciones que deban deshacerse entre tablas. La validación ocurre antes de escribir y las restricciones de la base son la segunda barrera. Si el vehículo o la categoría se desactivan entre la consulta y el guardado, el registro podría entrar; queda como limitación conocida de la primera versión. La creación de la cuenta con sus cinco categorías sí escribiría en dos tablas; se resolverá cuando se defina cómo se crea la cuenta.

Uso los códigos de respuesta de las diapositivas del instructor así:

| Código | Cuándo se usa |
|---|---|
| 200 | Consulta o edición correcta. Una consulta sin resultados también es 200, con la lista vacía. |
| 201 | Registro creado. |
| 204 | Registro eliminado o vehículo desactivado. |
| 400 | La petición está incompleta o mal formada: falta un dato obligatorio, un valor es negativo, un tipo no existe o una fecha no es válida. |
| 401 | No hay sesión, o el correo y la contraseña no coinciden. |
| 404 | El recurso no existe o es de otra cuenta. |
| 409 | La acción choca con lo que ya está guardado: un duplicado, un vehículo inactivo o un vehículo con registros. |
| 422 | Los datos están completos pero no son coherentes: falta el motivo, la fecha es posterior al día actual, la cuota o inDrive no corresponden al tipo de vehículo o la categoría no es válida. |

No uso 403: la primera versión no tiene roles y cada titular solo trabaja con su propia flota. Un recurso de otra cuenta responde 404, para no revelar que existe.

### Servicios del proceso del MVP

| ID | Servicio o acción | Quién lo utiliza | Resultado que espera |
|---|---|---|---|
| S01 | Ingresar a la cuenta | Titular | Sesión iniciada y acceso a su flota. |
| S02 | Crear un vehículo | Titular | Vehículo activo en su flota, como taxi o particular. |
| S03 | Registrar el ingreso diario | Titular | Ingreso del día guardado; en el taxi, con su cuota de referencia. |
| S04 | Registrar un gasto | Titular | Gasto guardado en el vehículo con su categoría. |
| S05 | Registrar un documento | Titular | SOAT o tecnomecánica guardado con nombre y vencimiento. |
| S06 | Consultar la flota, un vehículo y las listas por mes | Titular | Flota con sus próximos vencimientos; por vehículo, los ingresos y gastos del mes con sus totales y todos sus documentos; listas de ingresos, gastos y documentos de la cuenta, filtradas por mes. |

Estos seis completan el proceso del MVP. Los servicios S07 a S12 también son de la primera versión, se construyen después y se describen al final de este apartado.

### Ficha de cada servicio

**S01 · Ingresar a la cuenta**

- **Quién lo utiliza y qué datos necesita:** la titular, con su correo y su contraseña.
- **Tablas que consulta o modifica:** consulta `usuarios`.
- **Regla y resultado esperado:** el correo debe existir y la contraseña debe coincidir con `contrasena_hash`. El mensaje es el mismo si falla el correo o la contraseña, para no revelar qué cuentas existen, y la contraseña nunca se devuelve ni queda en los registros de errores. Resultado: sesión iniciada; la aplicación muestra su flota con S06.
- **Contrato y rechazos:** `POST /api/sesion` con `{ "correo", "contrasena" }` → 200 con la sesión y el nombre de la titular. 400 si falta el correo o la contraseña; 401 `CREDENCIALES_INVALIDAS` si no coinciden.
- **Pendiente:** siguen «Por definir» el formato y la vigencia de la sesión, las reglas de la contraseña, si una cuenta desactivada puede ingresar y cómo se crea la cuenta.

**S02 · Crear un vehículo**

- **Quién lo utiliza y qué datos necesita:** la titular, con la placa, la marca, el modelo y el tipo. Si es taxi, la cuota diaria y, si quiere, el conductor; si es particular, si está habilitado para inDrive.
- **Tablas que consulta o modifica:** consulta y crea en `vehiculos`.
- **Regla y resultado esperado:** placa obligatoria y única dentro de la cuenta; el servicio la pasa a mayúsculas. Un taxi tiene cuota y no tiene inDrive; un particular no tiene cuota ni conductor. Resultado: el taxi XYZ789 queda activo, con cuota de $60.000 y sin registros.
- **Contrato y rechazos:** `POST /api/vehiculos` con `{ "placa": "XYZ789", "marca": "Vehículo de ejemplo", "modelo": "Taxi", "tipo": "TAXI", "cuota_diaria": 60000, "conductor": "Conductor de ejemplo" }` → 201 con el vehículo creado. 400 si falta un dato obligatorio, el tipo no es TAXI ni PARTICULAR o la cuota es negativa; 422 `TIPO_INCOHERENTE` si un taxi llega sin cuota o habilitado para inDrive, o un particular con cuota o conductor; 409 `PLACA_REPETIDA` si la cuenta ya tiene esa placa.

**S03 · Registrar el ingreso diario**

Es la historia que usaré en la demostración.

- **Quién lo utiliza y qué datos necesita:** la titular, con el vehículo en la ruta, la fecha y el valor recibido. En el taxi, el motivo si el valor no coincide con la cuota; en inDrive, una nota opcional.
- **Tablas que consulta o modifica:** consulta `vehiculos` y crea en `ingresos`.
- **Regla y resultado esperado:** el vehículo es de la cuenta y está activo. El tipo del ingreso y la cuota de referencia no vienen del formulario: el servicio los toma del vehículo. Un taxi genera TAXI con su cuota vigente; un particular habilitado genera INDRIVE. El taxi necesita motivo si el valor es distinto de la cuota. Solo hay un ingreso por vehículo y fecha, y la fecha no puede ser posterior al día actual. Se admite valor cero, con motivo en el taxi. Resultado: en el taxi XYZ789, con cuota de $60.000, el ingreso de $60.000 queda guardado con cuota de referencia de $60.000.
- **Contrato y rechazos:** `POST /api/vehiculos/1/ingresos` con `{ "fecha": "2026-10-02", "valor": 60000 }` → 201 con el ingreso creado. 400 si falta la fecha o el valor, o el valor es negativo; 404 si el vehículo no existe o es de otra cuenta; 409 `VEHICULO_INACTIVO`; 422 `VEHICULO_SIN_INDRIVE` si es un particular no habilitado; 422 `MOTIVO_REQUERIDO` si llegan $40.000 sin motivo; 422 `FECHA_FUTURA` si la fecha es posterior al día actual; 409 `INGRESO_DUPLICADO` si ese día ya tiene un ingreso.

El servicio valida el motivo y la fecha antes de guardar. Las restricciones de la tabla `ingresos` son una segunda barrera: si algo pasara la primera, la base lo rechaza igual. Estos son los borradores de GraphQL que usaría el servicio:

```graphql
# 1. Leer el vehículo para validar la cuenta, el estado, el tipo y la cuota.
query VehiculoParaIngreso($id: Int!) {
  vehiculos_by_pk(id: $id) {
    id usuario_id tipo habilitado_indrive cuota_diaria activo
  }
}

# 2. Guardar el ingreso con el tipo y la cuota tomados del vehículo.
mutation RegistrarIngreso($ingreso: ingresos_insert_input!) {
  insert_ingresos_one(object: $ingreso) {
    id fecha valor cuota_referencia motivo
  }
}
```

Si `usuario_id` no es el de la sesión, el servicio responde 404 y no ejecuta la mutación.

**S04 · Registrar un gasto**

- **Quién lo utiliza y qué datos necesita:** la titular, con el vehículo en la ruta, la fecha, el valor, la descripción y la categoría.
- **Tablas que consulta o modifica:** consulta `vehiculos` y `categorias_gasto`, y crea en `gastos`.
- **Regla y resultado esperado:** el vehículo es de la cuenta y está activo. El valor es mayor que cero, la descripción es obligatoria y la fecha no puede ser posterior al día actual. La categoría está activa y es de la misma cuenta que el vehículo. Resultado: en el taxi XYZ789 queda el gasto de $5.000 del 1 de octubre, «Ahorro para la prima del conductor», en la categoría «Ahorro prima conductor».
- **Contrato y rechazos:** `POST /api/vehiculos/1/gastos` con `{ "fecha": "2026-10-01", "valor": 5000, "descripcion": "Ahorro para la prima del conductor", "categoria_id": 5 }` → 201 con el gasto creado. 400 si falta un dato o el valor es cero o negativo; 404 si el vehículo no existe o es de otra cuenta; 409 `VEHICULO_INACTIVO`; 422 `CATEGORIA_NO_VALIDA` si la categoría no existe, está inactiva o es de otra cuenta, y 422 `FECHA_FUTURA` si la fecha es posterior al día actual.

**S05 · Registrar un documento**

- **Quién lo utiliza y qué datos necesita:** la titular, con el vehículo en la ruta, el tipo (SOAT o tecnomecánica), el nombre y el vencimiento. En la primera versión no lleva archivo.
- **Tablas que consulta o modifica:** consulta `vehiculos` y crea en `documentos`.
- **Regla y resultado esperado:** el vehículo es de la cuenta y está activo, como en el prototipo, que no deja registrar nada nuevo en un vehículo inactivo. Tipo, nombre y vencimiento son obligatorios. Resultado: el taxi XYZ789 queda con el «SOAT de ejemplo», que vence el 15 de enero de 2027.
- **Contrato y rechazos:** `POST /api/vehiculos/1/documentos` con `{ "tipo": "SOAT", "nombre": "SOAT de ejemplo", "vencimiento": "2027-01-15" }` → 201 con el documento creado. 400 si falta el nombre o el vencimiento, o el tipo no es SOAT ni TECNOMECANICA; 404 si el vehículo no existe o es de otra cuenta; 409 `VEHICULO_INACTIVO`.

**S06 · Consultar la flota, un vehículo y las listas por mes**

- **Quién lo utiliza y qué datos necesita:** la titular. Para la flota, solo su sesión; para un vehículo, el vehículo y el mes que quiere ver; para las listas de ingresos, gastos y documentos, el mes si quiere filtrar.
- **Tablas que consulta o modifica:** consulta `vehiculos`, `ingresos`, `gastos`, `categorias_gasto` (para el nombre de la categoría) y `documentos`. No modifica nada.
- **Regla y resultado esperado:** solo muestra datos de la cuenta, de vehículos activos e inactivos; los inactivos se consultan pero no reciben registros nuevos. La flota trae los conteos de vehículos, taxis y particulares, y los próximos vencimientos, del más cercano al más lejano. Las listas filtran los ingresos y los gastos por el mes de su fecha, y los documentos por el mes de su vencimiento, como en el prototipo; sin mes, muestran todos. Cada registro de una lista indica la placa de su vehículo. Los totales, el neto y el estado vigente o vencido de cada documento se calculan al consultar y no se guardan. Resultado: con los datos que conserva la base de prueba (apartado 4), en octubre de 2026 el taxi XYZ789 muestra el ingreso de $60.000 del 1 de octubre, el gasto de $5.000, un neto de $55.000 y el SOAT vigente hasta el 15 de enero de 2027. La lista de gastos de octubre muestra ese gasto con la placa XYZ789.
- **Contrato y rechazos:** `GET /api/vehiculos` → 200 con la flota, sus conteos y los próximos vencimientos. `GET /api/vehiculos/1?mes=2026-10` → 200 con el vehículo, sus ingresos y gastos del mes, los totales y sus documentos. `GET /api/ingresos?mes=2026-10`, `GET /api/gastos?mes=2026-10` y `GET /api/documentos?mes=2027-01` → 200 con la lista de la cuenta; sin `mes`, con todos los registros. 400 si el mes no tiene la forma AAAA-MM; 404 si el vehículo no existe o es de otra cuenta. Un mes sin registros no es un error: responde 200 con listas vacías y totales en cero.
- **Pendiente:** cuántos vencimientos muestra la flota y con cuánta anticipación se marca uno como próximo siguen «Por definir».

Los seis tienen prioridad «Primero» y su responsable es Ivan Dario Madrid Daza.

### Servicios que siguen en la primera versión

Completan las historias HU-01 a HU-05 con la edición, la desactivación y las categorías. Tienen prioridad «Segundo» y el mismo responsable.

Los seis los usa la titular. Para editar, desactivar o eliminar reciben el identificador en la ruta y, al editar, los datos que cambian. Devuelven el registro actualizado (200) o 204 al desactivar o eliminar; listar categorías devuelve la lista (200) y crear una, la categoría creada (201).

| ID | Servicio | Contrato | Regla principal |
|---|---|---|---|
| S07 | Editar un vehículo y cambiar la cuota | `PATCH /api/vehiculos/:id` → 200 | Al editar se aplican las reglas de S02; una placa que ya existe en la cuenta responde 409 `PLACA_REPETIDA`. Si el vehículo tiene ingresos, no puede cambiar de taxi a particular o al revés ni dejar de estar habilitado para inDrive: 409 `VEHICULO_CON_INGRESOS`. Una cuota nueva no cambia la cuota de referencia de los ingresos ya guardados. |
| S08 | Desactivar o eliminar un vehículo | `DELETE /api/vehiculos/:id` → 204 si no tiene registros; 409 `VEHICULO_CON_REGISTROS` si los tiene. `PATCH /api/vehiculos/:id` con `{ "activo": false }` → 204. | Un vehículo con registros (ingresos, gastos o documentos) se desactiva para conservarlos. La eliminación pide confirmación. |
| S09 | Administrar las categorías | `GET /api/categorias` → 200; `POST /api/categorias` → 201; `PATCH /api/categorias/:id` → 200 al renombrar y 204 al desactivar | Nombre obligatorio y único en la cuenta, sin distinguir mayúsculas: 409 `CATEGORIA_REPETIDA`. Una categoría usada se desactiva y sigue en los gastos anteriores. |
| S10 | Editar o eliminar un ingreso | `PATCH /api/ingresos/:id` → 200; `DELETE /api/ingresos/:id` → 204 | Al editar se aplican las reglas de S03, salvo la del vehículo activo; la cuota de referencia se conserva. Pasarlo a un día que ya tiene ingreso: 409 `INGRESO_DUPLICADO`. Se elimina de forma definitiva, con confirmación. |
| S11 | Editar o eliminar un gasto | `PATCH /api/gastos/:id` → 200; `DELETE /api/gastos/:id` → 204 | Al editar se aplican las reglas de S04, salvo la del vehículo activo. El gasto puede conservar su categoría aunque se haya desactivado después, como en el prototipo; si cambia de categoría, la nueva debe estar activa. Se elimina de forma definitiva, con confirmación. |
| S12 | Editar o eliminar un documento | `PATCH /api/documentos/:id` → 200; `DELETE /api/documentos/:id` → 204 | Al editar se aplican las reglas de S05, salvo la del vehículo activo. Se elimina con confirmación; en la fase posterior también se eliminará su archivo. |

Todos responden 401 sin sesión y 404 si el registro no existe o es de otra cuenta.

La regla del vehículo activo queda fuera de S10 a S12 mientras se define si se pueden editar o eliminar los registros de un vehículo inactivo, uno de los pendientes del apartado 2. El prototipo lo permite.

## 4. Revisión del diseño y compromisos

Relaciono las historias con las tablas y los servicios, y compruebo el recorrido con los datos ficticios del taxi XYZ789 antes de programarlo. Salvo lo que indico como probado en Hasura, los resultados describen lo que el diseño debe producir; no son pruebas de una aplicación.

### Historias, tablas y servicios

| Historia | Tablas y servicio | Cómo comprobar el resultado |
|---|---|---|
| Acceso: ingresar a la cuenta | `usuarios` · S01 | Con la cuenta de prueba ya creada, el correo y la contraseña correctos abren la sesión y muestran la flota. Una contraseña equivocada responde 401 y no abre sesión. |
| HU-01 · Crear y clasificar vehículos | `vehiculos`, `usuarios` · S02, S07 y S08 | Con la flota vacía, crear el taxi XYZ789 con cuota de $60.000 lo deja activo. Crearlo otra vez responde 409 y la cuenta sigue con un solo XYZ789. |
| HU-02 · Registrar ingresos y ajustar la cuota del taxi | `vehiculos`, `ingresos` · S03 y S07 | XYZ789 ya tiene el ingreso del 1 de octubre. Registrar $60.000 el 2 de octubre lo guarda con cuota de referencia de $60.000. Registrar $40.000 sin motivo el 4 de octubre responde 422 y no guarda nada. Si la cuota pasa, por ejemplo, a $65.000, los ingresos anteriores conservan $60.000. |
| HU-03 · Registrar gastos y mantener categorías | `gastos`, `categorias_gasto`, `vehiculos` · S04 y S09 | El gasto de $5.000 del 1 de octubre queda en «Ahorro prima conductor». Un gasto de $0 responde 400. Crear «lavado» cuando ya existe «Lavado» responde 409. |
| HU-04 · Registrar y consultar documentos | `documentos`, `vehiculos` · S05 y S06 | Registrar el «SOAT de ejemplo» con vencimiento el 15 de enero de 2027 lo guarda, y la lista de documentos de enero de 2027 lo muestra con la placa XYZ789. Sin vencimiento responde 400 y no guarda nada. |
| HU-05 · Consultar información por vehículo | `vehiculos`, `ingresos`, `gastos`, `categorias_gasto`, `documentos` · S06 | La base de prueba conserva el ingreso de $60.000 del 1 de octubre, el gasto de $5.000 y el SOAT; los ingresos de prueba se borraron. Con esos datos, octubre de 2026 muestra $60.000 de ingresos, $5.000 de gastos, $55.000 de neto y el SOAT vigente. La lista de gastos de octubre muestra el gasto de $5.000 con la placa XYZ789. Noviembre responde 200 con listas vacías. Pedir un vehículo de otra cuenta responde 404. |

### Reglas que debemos verificar

| Regla del proyecto | Caso que funciona y caso que se rechaza | Qué pasa con los datos al rechazar |
|---|---|---|
| Motivo cuando el valor del taxi difiere de la cuota | Acepta $60.000 sin motivo, o $40.000 con el motivo «El conductor no completó la cuota». Rechaza $40.000 sin motivo: 422 `MOTIVO_REQUERIDO`. | No se guarda el ingreso. |
| Un ingreso por vehículo y día | Acepta el primer ingreso del 2 de octubre. Rechaza otro el mismo día: 409 `INGRESO_DUPLICADO`. | El primero queda sin cambios. |
| La fecha no puede ser futura | Acepta el ingreso del 2 de octubre. Rechaza un ingreso o un gasto con la fecha del día siguiente: 422 `FECHA_FUTURA`. | No se guarda el registro. |
| El tipo del ingreso sale del vehículo | En el taxi XYZ789 guarda TAXI con su cuota. En un particular sin inDrive rechaza: 422 `VEHICULO_SIN_INDRIVE`. | No se guarda nada. |
| Solo un vehículo activo recibe registros | Acepta ingresos, gastos y documentos en XYZ789 activo. Si está inactivo, rechaza: 409 `VEHICULO_INACTIVO`. | El historial se sigue consultando; no se agrega nada. |
| Placa única en la cuenta | Acepta XYZ789 la primera vez. Rechaza XYZ789 otra vez en la misma cuenta: 409 `PLACA_REPETIDA`. Otra cuenta sí puede registrarla. | La cuenta conserva un solo XYZ789. |
| Datos que corresponden al tipo de vehículo | Acepta un taxi con cuota de $60.000. Rechaza un taxi sin cuota o un particular con cuota: 422 `TIPO_INCOHERENTE`. | No se crea el vehículo. |
| Cambio de tipo con ingresos | Acepta cambiar la cuota de XYZ789. Rechaza convertirlo en particular porque tiene ingresos: 409 `VEHICULO_CON_INGRESOS`. | El vehículo y sus ingresos quedan como estaban. |
| Gasto válido | Acepta $5.000 con descripción y una categoría activa de la cuenta. Rechaza $0 (400) o una categoría desactivada o de otra cuenta: 422 `CATEGORIA_NO_VALIDA`. | No se guarda el gasto. |
| Categoría única y conservada | Acepta «Seguros». Rechaza «lavado» si ya existe «Lavado»: 409 `CATEGORIA_REPETIDA`. Una categoría usada se desactiva en lugar de borrarse. | Los gastos anteriores conservan su categoría. |
| Vehículo con registros | Elimina un vehículo sin registros: 204. Rechaza eliminar XYZ789, que tiene registros (409 `VEHICULO_CON_REGISTROS`), y ofrece desactivarlo. | Se conservan el vehículo y su historial. |
| Cada cuenta ve solo su flota | Muestra XYZ789 con la sesión de su titular. Responde 404 a otra cuenta y 401 sin sesión. | No se muestra ni se cambia nada. |

### Comprobación en Hasura

| Fecha | Qué probé | Resultado |
|---|---|---|
| 28 de octubre de 2026 | El recorrido del proceso con datos ficticios. | Se guardaron la titular de prueba, sus categorías, el taxi XYZ789 con cuota de $60.000, un ingreso de $60.000 del 1 de octubre, el gasto de $5.000 del ahorro para la prima del conductor y el SOAT. Un ingreso de $40.000 sin motivo se rechazó por la restricción de la tabla `ingresos` y no se guardó. La consulta del taxi devolvió en una sola respuesta su titular, su ingreso, su gasto y su SOAT. |
| 30 de octubre de 2026 | Los rechazos, con ingresos de prueba del 3 de octubre. | Un ingreso de $60.000 se guardó. Uno de $40.000 sin motivo se rechazó con el código `permission-error` y el mensaje «Check constraint violation», por la restricción `ingresos_check1`; el mismo ingreso, con motivo, se guardó. Un segundo ingreso del mismo día se rechazó con el código `constraint-violation`, por la restricción `ingresos_vehiculo_id_fecha_key`. |
| 30 de octubre de 2026 | Los borradores de S03, con los valores del ejemplo escritos en la consulta. | `vehiculos_by_pk` del vehículo 1 devolvió XYZ789 de la cuenta 1, como TAXI, activo y con cuota de $60.000; con esos datos el servicio decide el tipo y la cuota del ingreso. `insert_ingresos_one` con $60.000 del 2 de octubre guardó el ingreso con cuota de referencia de $60.000. El mismo insert con $40.000 del 4 de octubre, sin motivo, fue rechazado por `ingresos_check1`; Hasura respondió `permission-error` y el servicio lo traducirá a 422 `MOTIVO_REQUERIDO`. |

Se borraron los ingresos de prueba; la base conserva el recorrido inicial (titular, taxi, gasto de $5.000 y SOAT) y el ingreso del 1 de octubre, con las cinco categorías.

Las reglas que cruzan tablas, como la cuenta de la sesión, el vehículo activo, el tipo según el vehículo y la categoría de la misma cuenta, no se pueden probar en Hasura sin los servicios. Se comprobarán al programarlos.

### Lista de verificación

- [x] Cada tabla tiene un propósito, sus campos y un identificador: las seis tablas del apartado 2, cada una con su PK `id`.
- [x] Las relaciones permiten explicar a quién pertenece cada registro: ingresos, gastos y documentos llegan a su cuenta por `vehiculos.usuario_id`, y las categorías por `categorias_gasto.usuario_id`.
- [x] Cada servicio indica usuario, datos, regla y resultado: fichas de S01 a S06 y tabla de S07 a S12.
- [x] Las historias prioritarias pueden completar el proceso del MVP: la tabla de historias cubre el acceso y HU-01 a HU-05.
- [x] Podemos explicar un caso correcto y un rechazo sin cambiar los datos por error: el ingreso de $40.000 sin motivo se rechazó en Hasura y la base no cambió.

### Asuntos para resolver al implementar

- Si la titular envía dos veces el mismo formulario, `unique (vehiculo_id, fecha)` evita el ingreso repetido. El servicio debe responder 409 con un mensaje claro, no con el error de la base.
- Hasura no usa el mismo código para todos los rechazos de la base. El servicio los traduce por el nombre de la restricción, como se describe en el apartado 3.
- La marca `es_ahorro_prima` se cargará en Neon cuando empiece la programación.
- El prototipo permite elegir una fecha futura en ingresos y gastos. Al programar, el formulario deberá limitarla al día actual, además de la validación del servicio.

### Entrega y demostración

El 6 de noviembre de 2026 entrego el documento completo y explico en cinco minutos la historia HU-02:
1. La historia: registrar el ingreso diario del taxi y anotar el motivo cuando no se completa la cuota.
2. Las tablas: `vehiculos`, que da el tipo y la cuota vigente, e `ingresos`, que guarda el día con su cuota de referencia.
3. El servicio: S03, `POST /api/vehiculos/:id/ingresos`.
4. El caso correcto: $60.000 del 2 de octubre, que responde 201.
5. El rechazo: $40.000 sin motivo, que responde 422 `MOTIVO_REQUERIDO` sin guardar nada. Lo respaldo con la prueba real en Hasura.

La plantilla sugiere la carpeta `docs/04-datos-servicios`. Conservo la convención del repositorio: la evidencia en `docs/evidencia-sesion-4-modelo-datos-servicios.md` y el diagrama en `docs/evidencia-sesion-4/`.

### Dudas pendientes, responsable y próximo compromiso

Al 30 de octubre de 2026 el instructor aún no había revisado los apartados 1 y 2, así que estas dudas siguen abiertas:
1. ¿Es adecuado reunir los ingresos de taxi e inDrive en una sola tabla con `tipo`, o es preferible separarlos?
2. ¿Conviene guardar el dinero como entero en pesos (`integer`) o como `numeric`?
3. ¿Es suficiente para la primera versión un ingreso con correo y contraseña a una cuenta creada previamente, dejando el registro propio y la recuperación para después?

- **Responsable:** Ivan Dario Madrid Daza.
- **Próximo compromiso:** entregar el documento completo el 6 de noviembre de 2026 y ajustar el modelo y los servicios con la revisión del instructor. Los pendientes sin fecha acordada siguen «Por definir» en la tabla del apartado 2.

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1 | 26 de octubre de 2026 | Proceso, entidades, diagrama, campos y relaciones iniciales para la revisión del 29 de octubre. |
| 0.2 | 26 de octubre de 2026 | Ajustes antes de la revisión: `usuarios.activo` queda como propuesta; el gasto del conductor se elimina si ese día no se pagó; se completa la lista de decisiones con las categorías iniciales de cada cuenta; se agregan los pendientes del valor del pago al conductor, del cambio de tipo o de habilitación para inDrive de un vehículo con ingresos y de la desactivación de cuentas; las evidencias de sesiones 2 y 3 enlazan a esta. |
| 0.3 | 28 de octubre de 2026 | Aplica la retroalimentación del instructor técnico del 27 de octubre: se define el alcance de la primera versión, con 26 de las 35 pantallas de la sesión 3; salen `gastos.ingreso_id` y los campos de archivo; el acceso queda como ingreso básico; se agrega cómo crece el modelo en la fase posterior; se actualizan el proceso, las historias, los pendientes y las dudas, incluido quién crea la cuenta de la titular. |
| 0.4 | 28 de octubre de 2026 | Registra la carga del modelo en Neon y Hasura Cloud por indicación del instructor, la prueba con datos ficticios y dos hallazgos para la semana 5. |
| 0.5 | 29 de octubre de 2026 | Registra la aclaración de Katerin: los $5.000 diarios son un ahorro para la prima del conductor de mitad y fin de año, no su sueldo. El ahorro se registra como gasto diario, la prima no se registra otra vez y el sueldo queda fuera de la aplicación. |
| 0.6 | 30 de octubre de 2026 | Registra que el instructor trasladó la revisión al 30 de octubre y la entrega completa al 6 de noviembre. «Ahorro prima conductor» pasa a ser la quinta categoría inicial, y queda pendiente cómo reconocerla si cambia de nombre. Documenta la nueva prueba en Hasura, con el código de cada rechazo (motivo faltante y fecha repetida) y un caso de control que confirma que el rechazo del motivo viene de la restricción de la tabla, y precisa los índices creados en Neon. Actualiza el pie del diagrama y la cabecera del script SQL, sin cambiar sus instrucciones. |
| 0.7 | 30 y 31 de octubre de 2026 | Completa los apartados 3 y 4. Agrega seis servicios del proceso con su ficha y contrato (S01 a S06) y seis más de la primera versión (S07 a S12), los códigos de respuesta y los borradores de GraphQL del registro de ingreso, probados en Hasura. Agrega la tabla de historias, las reglas con caso aceptado y rechazado, la lista de verificación y el guion de la demostración. Decide que un vehículo con ingresos no cambia de tipo, propone la marca `es_ahorro_prima` sin cargarla en Neon y alinea el documento con el prototipo: un vehículo inactivo tampoco recibe documentos nuevos. Indica quién usa los servicios S07 a S12, qué reciben y qué devuelven, y agrega una nota: ninguno de los servicios S01 a S12 escribe en más de una tabla. Compacta el documento: quita repeticiones, resume las decisiones con su fecha, reúne las pruebas en Hasura en el apartado 4 y presenta las fichas con el bloque de la plantilla. El 31 de octubre, tras dos revisiones con la plantilla, las diapositivas y las evidencias anteriores: amplía S06 con los conteos y los próximos vencimientos de la flota y con las listas de ingresos, gastos y documentos por mes (pantallas 08 y 33 a 35); decide que ingresos y gastos no aceptan fechas futuras (422 `FECHA_FUTURA`); aclara que S07 aplica las reglas de S02, que S10 a S12 no exigen un vehículo activo mientras siga pendiente esa regla, que un gasto editado conserva su categoría aunque se haya desactivado y con qué datos se comprueba la consulta de octubre; explica por qué no se usa 403, y agrega la simplificación de la pantalla 01 y una nota sobre el término «pago al conductor». |

## Fuentes

- Instructor: *Sesiones 04 y 05 — Modelo de Datos y Contratos de API*, *Plantilla de Datos y API* y *Ejemplo de Datos y API — Horizonte*. Uso el ejemplo solo como referencia de estructura.
- Retroalimentación del instructor técnico sobre la evidencia de sesión 3, recibida el 27 de octubre de 2026.
- [Evidencia de requerimientos y backlog de sesión 2](evidencia-sesion-2-requerimientos-backlog.md).
- [Evidencia de diseño de pantallas de sesión 3](evidencia-sesion-3-diseno-pantallas.md).
- [Contexto del proyecto](contexto-proyecto.md).
- Indicación del instructor de registrarse en Neon y Hasura Cloud.
- Indicación del instructor del 30 de octubre de 2026 de continuar con los apartados 3 y 4.
- Cambio de fechas indicado por el instructor: revisión de los apartados 1 y 2 el 30 de octubre y entrega completa el 6 de noviembre de 2026.
- Aclaración de Katerin sobre el ahorro para la prima del conductor, 29 de octubre de 2026.
- Prototipo de sesión 3: las validaciones de vehículos, ingresos, gastos, categorías y documentos.
