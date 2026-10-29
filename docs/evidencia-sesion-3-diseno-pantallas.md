# Diseño de pantallas de VehicleControlApp Web

- **Actividad:** Sesión 3 — Diseño de pantallas y prototipo interactivo
- **Responsable:** Ivan Dario Madrid Daza, trabajo individual
- **Empresa desarrolladora:** DazaDev
- **Usuaria inicial:** Katerin, propietaria y administradora de una pequeña flota
- **Fecha de preparación:** 18 de octubre de 2026; última actualización: 21 de octubre de 2026
- **Fecha de prueba con la usuaria:** 20 de octubre de 2026
- **Fecha de entrega indicada por el instructor:** 22 de octubre de 2026
- **Estado:** Evidencia compacta con prueba realizada. Se incorporan los ajustes acordados con Katerin; el prototipo sigue siendo de demostración, sin persistencia ni autenticación real.

## 1. Propósito y fuentes

En esta actividad convierto los requerimientos priorizados en pantallas y recorridos para revisar antes de implementar la aplicación. Tomo como base el contexto del proyecto, la evidencia de sesión 2 y la guía y plantilla de sesión 3. El alcance es una Web App responsive para escritorio y móvil; las pantallas móviles son adaptaciones de la misma aplicación, no una aplicación nativa.

Preparé un [prototipo navegable](../prototipo-web-sesion-3/) con datos ficticios y lo publiqué en [GitHub Pages](https://tecno85.github.io/vehicle-control-app-web/) el 18 de octubre de 2026. La dirección permite revisar la misma Web App responsive en escritorio y móvil. La publicación es accesible públicamente; el prototipo solo muestra datos de demostración.

Esta versión compacta conserva el mapa completo de 35 pantallas y la cobertura de HU-01 a HU-05. Incluye 24 capturas: 20 de escritorio y 4 del recorrido principal en móvil.

## 2. Contexto, alcance y decisiones

### Antecedentes

- Katerin administra una pequeña flota y hoy lleva el control en un cuaderno. El 28 de septiembre revisó el flujo general; el 2 de octubre pidió adjuntar documentos para consultarlos en la aplicación. El 8 de octubre comentó que le gustaba el avance Android. Estas revisiones no validan por sí solas las pantallas web de esta evidencia.
- El 12 de octubre realicé la consulta de requerimientos de sesión 2. Jean Carlos no utilizará la Web App. Mantengo separados estos eventos y sus resultados; los acuerdos están en [la evidencia de sesión 2](evidencia-sesion-2-requerimientos-backlog.md).

### Decisiones para el MVP

- Cada cuenta tiene su propia flota. El diseño contempla registro propio, acceso con correo y contraseña y recuperación por correo; no define roles para compartir flotas.
- Los vehículos se editan. Si tienen registros, se desactivan para conservarlos; si no, se pueden eliminar con confirmación. Ingresos y gastos se editan o eliminan definitivamente con confirmación.
- Los documentos se editan y admiten reemplazar el archivo. Al eliminar un documento también se elimina su archivo, previa confirmación. Se puede guardar el registro antes de adjuntar un archivo; se contempla uno por registro.
- Las categorías se pueden agregar y renombrar. Si ya se usan, se desactivan para conservar los gastos anteriores.
- En taxis se registra el valor recibido y el motivo sin cambiar la cuota configurada. La vigencia de una cuota nueva sigue pendiente. En particulares habilitados se registra el total diario variable de inDrive.
- **Ajustes de demostración incorporados después de la prueba:** filtro por mes en las listas, creación de categoría desde el formulario de gasto, motivo obligatorio cuando el valor del taxi difiere de la cuota y pago al conductor de $5.000 al guardar un ingreso taxi mayor que cero, editable si ese día no se paga. Son cambios del prototipo, no funcionalidad persistente.

### Propuesta visual

Propongo una identidad de «bitácora vehicular contemporánea»: fondo cálido, verde petróleo, acento latón y tipografía diferenciada para títulos y placas. Katerin revisó la identidad visual el 20 de octubre de 2026 y le pareció adecuada. Esa revisión no equivale a una aprobación definitiva de todas las pantallas ni de las reglas del producto.

### Límites del prototipo

El prototipo simula la navegación y algunas acciones. No verifica cuentas, envía correos ni guarda datos en un servidor; los cambios se pierden al recargar y los archivos solo se muestran en el navegador durante la sesión. Nombres, placas, importes, vencimientos y archivos son ficticios. Está publicado como prototipo de revisión; no es una aplicación implementada.

## 3. Personas, roles y acceso

| Persona | Rol en el diseño |
|---|---|
| Titular de la cuenta | Crear su cuenta, ingresar, recuperar la contraseña y administrar su flota según las reglas acordadas. |
| Katerin | Usuaria inicial. **Probó el prototipo el 20/10/2026**, validó el flujo general y revisó la identidad visual; sus observaciones están en la sección 9. |
| Ivan Dario Madrid Daza | Soy el desarrollador responsable de DazaDev y preparo individualmente esta evidencia. |

El MVP no define roles para compartir flotas: la persona titular accede a sus propios datos. El acceso está diseñado, pero no implementado.

## 4. Recorrido principal y rutas propuestas

**Crear cuenta o ingresar → ver la flota → crear y clasificar un vehículo → abrir su detalle → registrar ingresos, gastos o documentos → consultar los registros del vehículo → abrir el soporte guardado.**

En un taxi se muestra la cuota diaria de referencia y se permite guardar el valor recibido y el motivo para una fecha. Para un particular habilitado para inDrive, se registra el total variable del día. En documentos, se puede guardar primero el nombre y el vencimiento y adjuntar después un archivo.

### Rutas propuestas

“Ruta” significa aquí una dirección propuesta para la implementación. El prototipo navega por estado y no cambia la URL; las rutas de esta tabla **no están implementadas**. Las confirmaciones se resolverían como estado o diálogo, no como una URL independiente.

| Flujo | Rutas propuestas | Acceso | Pantallas |
|---|---|---|---|
| Acceso y cuenta | `/ingresar`, `/crear-cuenta`, `/recuperar-contrasena`, `/recuperar-contrasena/nueva` | Público | 01–07 |
| Flota | `/vehiculos` | Titular | 08 |
| Vehículo | `/vehiculos/nuevo`, `/vehiculos/:id`, `/vehiculos/:id/editar` | Titular | 09–12, 27–28 |
| Ingresos | `/ingresos`, `/vehiculos/:id/ingresos/nuevo`, `/ingresos/:id/editar` | Titular | 17–18, 31–33 |
| Gastos | `/gastos`, `/vehiculos/:id/gastos/nuevo`, `/gastos/:id/editar`, `/gastos/categorias` | Titular | 19–25, 34 |
| Documentos | `/documentos`, `/vehiculos/:id/documentos/nuevo`, `/documentos/:id`, `/documentos/:id/editar` | Titular | 13–16, 26, 29–30, 35 |
| Resumen mensual (propuesta) | `/resumen` | Titular | P |

Las rutas de edición pueden resolverse como página o como formulario dentro de la misma pantalla. Se proponen con identificador para conservar un enlace directo cuando se implemente el producto. La protección de rutas, la sesión y la autorización son parte del trabajo de implementación y no de este prototipo. La vista previa y la descarga del soporte se resolverían dentro de `/documentos/:id`, sin una ruta adicional.

### Relación entre historias y recorridos

| Historia | Pantallas relacionadas | Recorrido y resultado esperado |
|---|---|---|
| HU-01 · Crear y clasificar vehículos | 08–12, 27–28 | Mis vehículos → Crear vehículo → elegir taxi o particular → guardar → consultar el detalle; editar y confirmar desactivación o eliminación según existan registros. |
| HU-02 · Registrar ingresos | 11–12, 17–18, 31–32, 33 | Detalle del taxi o particular habilitado para inDrive → registrar ingreso del tipo correspondiente → consultar el registro; editarlo o confirmar su eliminación definitiva. |
| HU-03 · Registrar gastos y gestionar categorías | 19–25, 34 | Detalle del vehículo → registrar gasto → administrar categorías si se requiere → consultar el gasto → editarlo o confirmar su eliminación definitiva. |
| HU-04 · Registrar y consultar documentos | 13–16, 26, 29–30, 35 | Detalle del vehículo → registrar nombre y vencimiento → guardar sin archivo o adjuntarlo → consultar, visualizar o descargar; editar o confirmar la eliminación del registro y su archivo. |
| HU-05 · Consultar por vehículo | 08, 11–12, 23, 26, 33–35 | Mis vehículos → elegir uno → consultar sus datos, ingresos, gastos y documentos asociados. |
| Acceso transversal | 01–07 | Iniciar sesión, crear cuenta o recorrer la recuperación de contraseña hasta la confirmación. Es una simulación; no crea cuentas ni envía correos. |

## 5. Mapa de pantallas de escritorio

El mapa describe pantallas y estados previstos para el MVP. Algunas filas son modos de un mismo formulario o cuadros de confirmación, no páginas independientes. Los IDs son propios de este mapa y no corresponden al prefijo de las capturas. El prototipo adapta el contenido al tamaño de la ventana y usa navegación por estado; la tabla de rutas de la sección 4 es una propuesta de implementación.

| N.º | Pantalla | Elementos principales y acciones | Destino o resultado en el prototipo |
|---:|---|---|---|
| 01 | Iniciar sesión | Marca, correo, contraseña, botón Ingresar, enlaces para crear cuenta y recuperar contraseña, nota de cuenta propia. | Ingresar abre la flota; los enlaces abren registro o recuperación. |
| 02 | Crear cuenta | Nombre, correo, contraseña, confirmación y acciones para crear cuenta o volver al acceso. | Crear cuenta abre la confirmación de demostración; volver regresa al acceso. |
| 03 | Cuenta creada | Mensaje de confirmación y acción para iniciar sesión. | Vuelve al acceso. |
| 04 | Recuperar contraseña | Campo de correo, envío de instrucciones y regreso al acceso. | Enviar abre una confirmación que no revela si el correo está registrado. |
| 05 | Solicitud de recuperación | Confirma que, si existe una cuenta, llegará un enlace; incluye acción de demostración. | La acción abre la pantalla para crear una contraseña nueva. |
| 06 | Crear contraseña nueva | Nueva contraseña, confirmación, guardar o cancelar. | Guardar abre la confirmación; cancelar vuelve a recuperación. |
| 07 | Contraseña actualizada | Confirmación del cambio y acción para iniciar sesión. | Vuelve al acceso. |
| 08 | Mis vehículos: lista y estado vacío | Navegación principal, conteos, próximos vencimientos, tarjetas y estado vacío cuando no hay vehículos. | Elegir un vehículo abre el detalle; «Agregar vehículo» abre el formulario. Si no hay vehículos, el estado vacío ofrece crear el primero. |
| 09 | Crear o editar vehículo particular | Placa, marca, modelo, tipo, opción de inDrive, guardar y cancelar. | Al seleccionar particular se muestran sus campos; guardar crea o actualiza el detalle de demostración. |
| 10 | Variante del formulario para taxi | Placa, marca, modelo, conductor y cuota diaria, además de guardar y cancelar. | Al seleccionar taxi, estos campos aparecen en el mismo formulario; guardar abre el detalle del taxi. |
| 11 | Detalle de vehículo particular | Datos de demostración, acciones para documento, ingreso inDrive y gasto, y áreas para documentos e ingresos/gastos. | Cada acción abre el formulario correspondiente. |
| 12 | Detalle de taxi | Tipo y cuota de referencia, con acciones para registrar ingreso diario, gasto y documento. | Abre los formularios correspondientes. |
| 13 | Registrar documento | Vehículo, tipo (SOAT o tecnomecánica), nombre, vencimiento, archivo opcional, guardar o cancelar. | Se puede guardar sin archivo o adjuntarlo durante el registro. |
| 14 | Documento guardado sin archivo | Confirma nombre y vencimiento, informa que falta el soporte y permite adjuntarlo después. | Adjuntar abre el estado con archivo; volver regresa al vehículo. |
| 15 | Documento con archivo | Datos de demostración, nombre de archivo y acciones Visualizar y Descargar. | Visualizar abre la vista previa; Descargar inicia la descarga simulada. |
| 16 | Vista previa del soporte | Representación del archivo con aviso de que es una demostración, descargar y volver. | Descargar inicia la descarga simulada; volver regresa al registro con archivo. |
| 17 | Registrar ingreso inDrive | Vehículo particular, fecha, total variable del día, nota opcional, guardar y cancelar. | Guardar vuelve al detalle particular. |
| 18 | Registrar ingreso de taxi | Fecha, valor recibido, motivo y referencia de la cuota diaria configurada. | Guardar vuelve al detalle del taxi; el formulario aclara que no cambia la cuota. |
| 19 | Registrar gasto | Vehículo, fecha, valor, descripción, categoría, administración de categorías, guardar y cancelar. | Administración abre categorías; guardar vuelve al vehículo. |
| 20 | Categorías de gasto | Lista de categorías, estado y acciones para agregar, editar, desactivar o volver al gasto. | Agregar y editar abren el formulario; desactivar abre confirmación; volver regresa al gasto. |
| 21 | Editar gasto | Campos de fecha, valor, descripción y categoría; acciones para guardar, eliminar o cancelar. | Guardar vuelve al listado; eliminar pide confirmación. |
| 22 | Confirmar eliminación de gasto | Explica que el borrado es permanente y afecta historial y totales; permite cancelar o eliminar. | Cancelar conserva el registro; confirmar lo elimina definitivamente. |
| 23 | Gastos recientes del vehículo | Sección del detalle con gastos ficticios y acciones para registrar, editar o pedir eliminación. | Las acciones abren el formulario o el cuadro de confirmación correspondiente. |

| N.º | Pantalla | Elementos principales y acciones | Destino o resultado en el prototipo |
|---:|---|---|---|
| 24 | Agregar o renombrar categoría | Formulario integrado en la pantalla de categorías, con nombre y acciones para guardar o cancelar. | Guarda la categoría o vuelve a la administración sin aplicar el cambio. |
| 25 | Confirmar desactivación de categoría | Explica que dejará de aparecer en nuevos gastos y se conservará en los anteriores. | Permite conservarla o desactivarla y volver a categorías. |
| 26 | Descargar soporte | Acción disponible desde la vista del documento cuando hay un archivo adjunto. | Inicia la descarga del archivo seleccionado en la demostración; no abre una pantalla nueva. |
| 27 | Editar vehículo | Permite cambiar los datos del vehículo y guardar los cambios. | Vuelve al detalle del vehículo. |
| 28 | Confirmar desactivación o eliminación del vehículo | Si tiene registros, informa que se desactivará para conservarlos; si no tiene registros, confirma su eliminación. | Confirma la acción o permite cancelarla. |
| 29 | Editar documento | Permite cambiar tipo, nombre, vencimiento o reemplazar el archivo. | Vuelve a la confirmación del documento guardado. |
| 30 | Confirmar eliminación de documento | Aclara que también se elimina el archivo asociado, si existe. | Confirma la eliminación o permite cancelarla. |
| 31 | Editar ingreso | Permite corregir la fecha, el valor y la nota o motivo. | Vuelve al detalle del vehículo. |
| 32 | Confirmar eliminación de ingreso | Informa que el borrado es definitivo y afecta el historial y los totales. | Confirma la eliminación o permite cancelarla. |
| 33 | Lista de ingresos | Muestra los ingresos asociados a vehículos y sus acciones de consulta. | Elegir un registro abre el vehículo; la lista vacía ofrece elegir vehículo. |
| 34 | Lista de gastos | Muestra gastos de distintos vehículos y permite abrir, editar o solicitar eliminación. | «Registrar gasto» lleva a elegir un vehículo antes del formulario. |
| 35 | Lista de documentos | Muestra documentos asociados a vehículos y sus acciones de consulta. | Elegir un registro abre el documento; para crear uno se elige primero un vehículo. |
| **P** | **Resumen mensual (propuesta)** | Proyección de ingreso (cuota × días laborables), pago a conductor, otros gastos, neto estimado; con filtro por mes. | **Propuesta de evolución** (punto 1 de la prueba); no implementada en el prototipo actual. |

La navegación lateral del diseño presenta Vehículos, Ingresos, Gastos y Documentos. En el prototipo HTML, esos accesos navegan a sus pantallas; para registrar un ingreso se elige primero un vehículo.

### 5.1 Fichas de las pantallas principales

Para no repetir la explicación, cada ficha resume su objetivo, usuario/historia, acción principal, regreso y capturas. Esta versión agrupa variantes del mismo recorrido; el mapa conserva las 35 pantallas y sus estados. Las capturas adicionales de variantes, listas y confirmaciones se conservan en la carpeta como archivo.

| Grupo de fichas | Fichas | Pantallas que cubre |
|---|---|---|
| Acceso | 01–03 | 01–07 |
| Flota y vehículo | 04–06 | 08–12, 27–28 |
| Ingresos y gastos | 07–09 | 17–25, 31–34 |
| Documentos | 10–11 | 13–16, 26, 29–30, 35 |

#### Ficha 01 · Iniciar sesión
**Objetivo:** acceder a la flota. **Quién/HU:** titular · acceso transversal. **Continuar:** «Ingresar» abre la flota simulada; los enlaces abren registro o recuperación. **Volver:** esta es la entrada del flujo. La cuenta es propia y no hay roles compartidos.

![Inicio de sesión](evidencia-sesion-3/capturas/01-inicio-sesion.png)

#### Ficha 02 · Crear cuenta
**Objetivo:** representar el registro propio. **Quién/HU:** persona que crea una cuenta · acceso transversal. **Guardar:** muestra la confirmación simulada de la pantalla 03. **Cancelar:** vuelve al acceso. No se crea una cuenta real.

![Crear cuenta](evidencia-sesion-3/capturas/07-crear-cuenta.png)

#### Ficha 03 · Recuperación de contraseña
**Objetivo:** solicitar instrucciones y representar el cambio de contraseña. **Quién/HU:** titular · acceso transversal. **Continuar:** el envío muestra una confirmación genérica (pantalla 05); el enlace de demostración permite crear una contraseña nueva (06) y confirmar el cambio (07). **Cancelar:** vuelve al acceso. No envía correos ni cambia contraseñas reales.

![Recuperar contraseña](evidencia-sesion-3/capturas/09-recuperar-contrasena.png)

**Estados del acceso representados.** Las confirmaciones y el cambio de contraseña se describen aquí; no se incluyen capturas adicionales para mantener la versión compacta.

| Pantalla | Qué muestra | Resultado |
|---|---|---|
| 03 · Cuenta creada | Confirmación del registro de demostración. | Vuelve al acceso; no crea una cuenta real. |
| 05 · Solicitud de recuperación | Aviso genérico si el correo está registrado. | Abre el enlace de demostración. |
| 06 · Crear contraseña nueva | Nueva contraseña y confirmación. | Guarda y muestra la confirmación; no cambia una contraseña real. |
| 07 · Contraseña actualizada | Confirmación final del recorrido. | Vuelve al acceso. |

#### Ficha 04 · Mis vehículos
**Objetivo:** consultar la flota, conteos y vencimientos. **Quién/HU:** titular · HU-01, HU-05. **Continuar:** agregar abre el formulario; elegir una tarjeta abre el detalle. El estado vacío permite crear el primer vehículo. **Salir:** vuelve al acceso.

![Mis vehículos](evidencia-sesion-3/capturas/02-mis-vehiculos.png)
![Flota sin vehículos](evidencia-sesion-3/capturas/37-flota-sin-vehiculos.png)

#### Ficha 05 · Crear o editar vehículo
**Objetivo:** clasificar y guardar los datos del vehículo. **Quién/HU:** titular · HU-01. **Variantes:** particular muestra la opción inDrive; taxi muestra conductor y cuota. **Guardar:** abre el detalle. **Cancelar:** vuelve a la flota al crear o al detalle al editar. La edición reutiliza este formulario (pantalla 27).

![Formulario de vehículo particular](evidencia-sesion-3/capturas/13-formulario-vehiculo-particular.png)
![Formulario de vehículo taxi](evidencia-sesion-3/capturas/14-formulario-vehiculo-taxi.png)

#### Ficha 06 · Detalle del vehículo
**Objetivo:** consultar datos, documentos, ingresos y gastos. **Quién/HU:** titular · HU-01 a HU-05. **Continuar:** permite editar o iniciar registros; el taxi muestra la cuota y el particular habilitado muestra inDrive. **Volver:** regresa a la flota. Si tiene movimientos, se ofrece desactivar; sin ellos, eliminar con confirmación.

![Detalle de taxi](evidencia-sesion-3/capturas/03-detalle-taxi.png)
![Detalle de particular habilitado para inDrive](evidencia-sesion-3/capturas/33-detalle-particular.png)
![Confirmación de desactivación de vehículo](evidencia-sesion-3/capturas/23-confirmar-desactivar-vehiculo.png)

#### Ficha 07 · Ingresos
**Objetivo:** registrar el ingreso del día y consultar el historial. **Quién/HU:** titular · HU-02. **Variantes:** taxi, valor recibido, motivo y referencia de la cuota; inDrive, total variable y nota. **Guardar/cancelar:** vuelve al detalle; un valor menor o cero no cambia la cuota. **Editar/eliminar:** requiere confirmación definitiva (pantallas 31–32). El motivo es obligatorio cuando el valor del taxi difiere de la cuota.

![Registrar ingreso de taxi](evidencia-sesion-3/capturas/04-registro-ingreso-taxi.png)
![Registrar ingreso de inDrive](evidencia-sesion-3/capturas/34-registro-ingreso-indrive.png)

#### Ficha 08 · Gastos
**Objetivo:** registrar fecha, valor, descripción y categoría; consultar y filtrar. **Quién/HU:** titular · HU-03, HU-05. **Guardar/cancelar:** vuelve al detalle. **Continuar:** administrar categorías abre la ficha 09; editar y eliminar piden confirmación. **Ajustes de la prueba:** botón «+ Nueva categoría» dentro del formulario y filtro por mes en la lista.

![Registrar gasto](evidencia-sesion-3/capturas/18-registro-gasto.png)
![Nueva categoría desde el formulario de gasto](evidencia-sesion-3/capturas/40-registrar-gasto-nueva-categoria.png)
![Lista de gastos con filtro por mes](evidencia-sesion-3/capturas/39-lista-gastos-filtro-mes.png)

#### Ficha 09 · Categorías de gasto
**Objetivo:** agregar, renombrar o desactivar categorías. **Quién/HU:** titular · HU-03. **Continuar:** desactivar abre confirmación; los gastos anteriores conservan la categoría. **Cancelar o volver:** regresa al formulario de gasto. La creación desde el formulario también está disponible en la ficha 08.

![Administrar categorías](evidencia-sesion-3/capturas/19-categorias-gasto.png)
![Renombrar categoría](evidencia-sesion-3/capturas/38-renombrar-categoria.png)

#### Ficha 10 · Documentos
**Objetivo:** registrar y consultar SOAT y tecnomecánica. **Quién/HU:** titular · HU-04, HU-05. **Guardar:** muestra la confirmación e indica si falta adjuntar el soporte. **Continuar:** permite adjuntar o reemplazar el archivo, editar el registro o eliminarlo con confirmación y borrado del archivo. La lista y la edición se describen en el mapa.

![Registrar documento](evidencia-sesion-3/capturas/05-registro-documento.png)
![Documento guardado sin archivo](evidencia-sesion-3/capturas/30-documento-guardado.png)

#### Ficha 11 · Ver soporte
**Objetivo:** consultar, visualizar o descargar el archivo. **Quién/HU:** titular · HU-04, HU-05. **Continuar:** con archivo, ofrece vista previa o descarga; sin archivo, muestra el registro. **Volver:** regresa al detalle. El archivo de demostración es ficticio. La visualización y la descarga reales requieren almacenamiento; el prototipo las simula.

![Vista previa del soporte](evidencia-sesion-3/capturas/32-vista-previa-soporte.png)

Las capturas adicionales de variantes, listas y confirmaciones se conservan en la carpeta de capturas como archivo. Esta versión incluye las 24 que sostienen el recorrido principal y las reglas del MVP.

## 6. Vistas responsive para móvil

Revisé el recorrido principal a 360 × 800 px en emulación de navegador: inicio de sesión, flota, detalle del taxi y formulario de gasto con creación de categoría. Las capturas muestran el primer tramo de cada pantalla; el contenido completo se puede desplazar.

Después de la prueba ajusté los recorridos móviles de formularios, listas y confirmaciones: controles de al menos 44 px, campos de 16 px para evitar el zoom del navegador, navegación inferior fija, espacio para el área segura y acciones que se apilan cuando no caben. Aún falta verificar en un dispositivo móvil real, revisar el orden con teclado y documentar las pantallas restantes.

| Criterio de revisión móvil | Estado |
|---|---|
| Controles táctiles de al menos 44 px | Aplicado en las pantallas revisadas. |
| Campos de 16 px para evitar el zoom | Aplicado en formularios. |
| Navegación inferior y área segura | Aplicadas en la vista móvil. |
| Prueba en dispositivo móvil real | Pendiente, con fecha por definir. |
| Orden de tabulación y lectores de pantalla | Pendiente de revisión. |

![Inicio de sesión en móvil a 360 px](evidencia-sesion-3/capturas/43-inicio-sesion-movil-360.png)
![Mis vehículos en móvil a 360 px](evidencia-sesion-3/capturas/44-mis-vehiculos-movil-360.png)
![Detalle del taxi en móvil a 360 px](evidencia-sesion-3/capturas/45-detalle-taxi-movil-360.png)
![Registrar gasto con nueva categoría en móvil a 360 px](evidencia-sesion-3/capturas/46-registrar-gasto-movil-360.png)

Las capturas anteriores de 390 px se conservan como archivo y no se usan en esta versión compacta.

## 7. Elementos comunes, mensajes y estados

La guía propone responder «¿dónde estoy?», «¿qué puedo hacer?» y «¿qué resultado obtuve?». En el diseño uso títulos y el vehículo visible, acciones directas y confirmaciones breves. Falta validar los textos con Katerin.

Matriz propuesta para el recorrido del vehículo y sus documentos. Los textos son borradores; no todos aparecen en el prototipo.

| Estado | Mensaje propuesto | Situación |
|---|---|---|
| Carga | «Guardando el documento…» | Pendiente; no hay servicio conectado. |
| Vacío | «Este vehículo aún no tiene documentos. Registra el SOAT o la tecnomecánica.» | Pendiente para documentos; la demostración sí incluye el estado vacío de vehículos e ingresos. |
| Éxito | «Documento guardado. Puedes adjuntar el soporte ahora o después.» | Simulado en la confirmación. |
| Dato incorrecto | «Completa el nombre y la fecha de vencimiento.» | Propuesta; falta representar la validación de campos. |
| Regla del negocio | «Este vehículo tiene registros. Desactívalo para conservar su historial.» | Regla y confirmación representadas; texto por validar con Katerin. |
| Error de servicio | «No pudimos guardar el documento. Inténtalo de nuevo.» | Pendiente; el prototipo no se conecta a un servicio. |

| Elemento común | Uso |
|---|---|
| Encabezado y navegación | Identifican el producto y llevan a vehículos, ingresos, gastos y documentos. |
| Formularios | Mantienen etiquetas visibles y acciones para guardar o cancelar. |
| Confirmaciones | Se usan para eliminaciones permanentes y desactivaciones. |
| Soportes | Distinguen registro sin archivo, adjunto, vista previa y descarga simulada. |

## 8. Reglas de edición y eliminación reflejadas

| Dato | Regla de edición/eliminación del MVP | Cómo aparece en el diseño |
|---|---|---|
| Vehículo | Se edita. Sin registros asociados se puede eliminar con confirmación; si tiene registros, se desactiva. | El prototipo permite editar. En el detalle presenta desactivación cuando hay registros o eliminación cuando no los hay. |
| Ingreso o gasto | Se edita o se elimina definitivamente con confirmación. Al borrarlo, desaparece del historial y totales. | El prototipo permite editar y muestra una confirmación antes del borrado definitivo. |
| Documento | Se editan sus datos, se puede reemplazar el archivo y al eliminar se borra también el adjunto, con confirmación. | El prototipo permite editar, reemplazar el archivo y confirmar el borrado del registro y su soporte. |
| Categoría | Se agrega o renombra. Si una categoría ya está usada, se desactiva para conservar los gastos anteriores. | El prototipo permite agregar, renombrar y desactivar categorías. Los gastos asociados conservan su etiqueta al desactivarla; al renombrar, se actualiza la etiqueta de los gastos demostrativos. |

Las reglas de edición y eliminación se acordaron antes de la prueba del 20 de octubre de 2026 y no cambiaron con ella. La prueba añadió validaciones de captura y atajos, no nuevas reglas de borrado.

## 9. Prueba con Katerin (20/10/2026)

**Participante:** Katerin. **Responsable:** Ivan Dario Madrid Daza. **Fecha:** 20 de octubre de 2026.  
**Formato:** revisión guiada del prototipo publicado en GitHub Pages y de sus hojas de cálculo actuales de ingresos diarios de taxis.

### 9.1 Qué validó

- El flujo general: crear vehículo → detalle → registrar ingreso, gasto o documento → consultar.
- La separación **Ingreso taxi / Ingreso inDrive / Gasto / Documento** resuelve su hoja diaria, donde hoy mezcla todo en «Novedad».
- Los formularios de ingreso taxi (valor recibido, motivo y referencia de cuota) y de documento (tipo, vencimiento y archivo opcional) cubren sus necesidades.
- La identidad visual de «bitácora vehicular contemporánea» le pareció adecuada.
- Las confirmaciones de borrado y desactivación se entienden como acciones que conservan o eliminan el historial.

### 9.2 Observaciones y ajustes

| Tarea o tema | Observación de Katerin | Decisión | Estado en el prototipo |
|---|---|---|---|
| Crear vehículo y abrir el detalle | Distingue taxi y particular; encuentra la información. | Sin cambios. | Fluido. |
| Registrar ingreso diario de taxi | Entiende «valor recibido» frente a «cuota» y usa el motivo para viajes o días parciales. | Motivo obligatorio si el valor difiere de la cuota. | Aplicado. |
| Registrar gasto | Encuentra la categoría y pide crear «Seguros» en ese momento. | Botón «+ Nueva categoría» dentro del formulario. | Aplicado. |
| Guardar SOAT sin archivo, adjuntar y abrirlo | Entiende el flujo y valida que el archivo se vea. | Subida real como requisito técnico. | Simulado. |
| Revisar eliminación | Entiende el borrado definitivo y la cancelación. | Confirmaciones ya representadas. | Fluido. |
| Filtrar por mes | Quiere ver las novedades y gastos de cada mes. | Filtro por mes en las listas. | Aplicado; falta en el detalle del vehículo. |
| Pago al conductor | Quiere replicar su resultado contable diario. | Gasto automático de $5.000 por día laborado al guardar un ingreso taxi mayor que cero; editable. | Aplicado. |
| Resumen mensual | Quiere ver el ingreso estimado del mes y los gastos que surjan. | Pantalla «Resumen mensual» con proyección y acumulación real. | Propuesta; no implementada. |

Los ajustes se incorporaron al prototipo, pero **no se hizo una segunda prueba con Katerin**. Esa repetición queda pendiente, con fecha por definir. La prueba revisó una demostración, no una implementación con persistencia, autenticación o subida real de archivos.

### 9.3 Decisiones de modelo para la siguiente cartilla

- `IngresoTaxi`: {fecha, vehículo, valorRecibido, cuotaReferencia, motivo, conductorPagado: boolean}.
- `Gasto`: {fecha, vehículo, valor, descripción, categoría, esConductor: boolean}.
- `Documento`: {vehículo, tipo, vencimiento, archivo?, estado}.

**Actualización posterior:** la [evidencia de sesiones 4 y 5](evidencia-sesion-4-modelo-datos-servicios.md) reemplaza este borrador. Reúne los ingresos de taxi e inDrive en una sola tabla, agrega el nombre del documento, calcula su estado en lugar de guardarlo y quita las marcas del conductor. Desde su versión 0.3, el pago al conductor se registra a mano como un gasto en la primera versión; su conexión automática con el ingreso queda para una fase posterior.

## 10. Cierre, pendientes y revisión

### 10.1 Pendientes

| Pendiente | Estado | Fecha |
|---|---|---|
| Repetir la prueba con Katerin después de los ajustes y registrar sus observaciones. | Pendiente | Por definir |
| Verificar en un dispositivo móvil real los recorridos, el orden con teclado y los mensajes de validación. | Pendiente | Por definir |
| Precisar la vigencia de cambios en la cuota, las reglas técnicas de acceso y los formatos, tamaño y conservación de archivos. | Pendiente | Por definir |
| Evaluar la propuesta de «Resumen mensual» antes de incorporarla al alcance. | Pendiente | Por definir |

La implementación de rutas, autenticación y persistencia no forma parte de esta evidencia. Las rutas de la sección 4 son una propuesta de diseño; el prototipo actual navega por estado.

### 10.2 Revisión de entrega

| Elemento | Estado |
|---|---|
| Recorrido, mapa y fichas con capturas | Incluidos; mapa de 35 pantallas, 11 fichas y 24 capturas. |
| Rutas propuestas | Incluidas en la sección 4; no implementadas. |
| Elementos comunes y estados | Incluidos; algunos estados siguen como propuesta o pendiente. |
| Recorrido móvil a 360 px | Cuatro capturas del recorrido principal; falta la verificación en un dispositivo real. |
| Prototipo y enlace accesible | Publicado y comprobado en [GitHub Pages](https://tecno85.github.io/vehicle-control-app-web/). |
| Ajustes de la prueba incorporados | Filtro por mes, categoría inline, motivo obligatorio y pago al conductor en la demostración. |
| Prueba con Katerin | **Realizada el 20/10/2026**; la segunda prueba queda pendiente. |
| Límites declarados | Sin persistencia, autenticación real ni subida real de archivos. |

La evidencia queda lista para revisión y conserva la trazabilidad entre historias, pantallas, rutas propuestas, capturas y reglas. No presenta el prototipo como una aplicación implementada ni la revisión de Katerin como una aprobación definitiva.

**Actualización posterior:** el 27 de octubre de 2026 el instructor técnico revisó esta evidencia. Destacó la coherencia de los mockups y el valor de la prueba con Katerin, y recomendó reducir el alcance de implementación de la primera versión. Las 35 pantallas de este documento se conservan como diseño; la primera versión usa 26 de ellas. El alcance de la primera versión se detalla en la [evidencia de sesiones 4 y 5](evidencia-sesion-4-modelo-datos-servicios.md): pasan a una fase posterior el registro y la recuperación de cuenta, el almacenamiento de archivos, el resumen mensual y el pago automático al conductor.

**Actualización posterior:** el 29 de octubre de 2026 Katerin aclaró que los $5.000 diarios que esta evidencia llama «pago al conductor» son un ahorro para la prima del conductor de mitad y fin de año, no su sueldo. El detalle está en la [evidencia de sesiones 4 y 5](evidencia-sesion-4-modelo-datos-servicios.md).

## Fuentes

- Instructor, *Sesión 03 — Diseño de Pantallas*, *Plantilla de Diseño de Pantallas* y *Ejemplo de Diseño de Pantallas — Horizonte*. Uso el ejemplo solo como referencia de estructura.
- [Contexto del proyecto](contexto-proyecto.md).
- [Evidencia de requerimientos y backlog de sesión 2](evidencia-sesion-2-requerimientos-backlog.md).
- Conversaciones y decisiones de Ivan sobre acceso, cuentas y reglas de edición y eliminación.
