# Evidencia de avance — Semana 1

**Proyecto:** VehicleControlApp Web  
**Empresa desarrolladora:** DazaDev  
**Desarrollador responsable:** Ivan Dario Madrid Daza  
**Usuaria inicial:** Katerin, propietaria y administradora de una pequeña flota  
**Modalidad:** trabajo individual  
**Fecha de entrega indicada:** 8 de octubre de 2026  
**Estado de esta evidencia:** avance de descubrimiento y backlog inicial; no describe funcionalidades web implementadas.

## 1. Problema, usuaria y contexto

Katerin administra una pequeña flota y actualmente registra o consulta la información en un cuaderno con una sección por vehículo. Con VehicleControlApp Web quiero trasladar ese control manual a un sistema web para organizar los vehículos, los ingresos y gastos, y los documentos asociados. El alcance acordado incluye la cuota diaria fija de cada taxi y el total variable diario generado mediante inDrive.

El 28 de septiembre de 2026, al necesitar la fecha de vencimiento del SOAT de un vehículo, Katerin buscó en otras páginas y encontró el documento original. Esta situación muestra que el soporte no estaba disponible en el punto donde lo necesitaba. No se midió cuánto duró la búsqueda.

**Necesidad identificada:** quiero centralizar en la web el control que hoy se lleva en el cuaderno y permitir consultar el registro y su documento original desde la aplicación. Reducir demoras es una hipótesis; no medimos el tiempo de búsqueda ni el posible ahorro.

## 2. Evidencia de contacto con la usuaria

| Fecha | Evidencia reportada | Resultado y alcance |
|---|---|---|
| 28 sep 2026 | Katerin revisó el flujo web inicial de cuatro capacidades. | Comentó que inicialmente le gusta y que está abierta a modificarlo si hace falta. El flujo revisado no incluía login ni carga de archivos; ambos temas se definieron después. |
| 28 sep 2026 | Katerin buscó en otras páginas el vencimiento del SOAT y encontró el documento original. | Sustenta la necesidad de tener acceso al soporte desde el registro del vehículo. No se conoce el tiempo invertido. |
| 2 oct 2026 | Katerin pidió poder cargar el documento correspondiente al registro y luego visualizarlo o descargarlo. | Se concreta el alcance deseado de adjuntos para documentos. |
| 8 oct 2026 | Conversación de validación con Katerin, propietaria y administradora de la flota. | Indicó que considera adecuado el proceso actual. Revisó lo realizado en la app Android y manifestó que le gustó el trabajo hasta ese momento. No se hicieron preguntas formales en esta conversación. |

Registré en esta tabla los contactos que tuve con Katerin. En las conversaciones del 28 de septiembre, 2 de octubre y 8 de octubre no hice preguntas formales. Al cierre de la semana 1 dejé propuestas unas preguntas para una conversación posterior; todavía no las había realizado.

## 3. Proceso actual y recorrido web objetivo

### Proceso actual observado y reportado

1. Katerin abre en el cuaderno la sección correspondiente al vehículo.
2. Allí registra o busca la información que necesita.
3. Para el caso del SOAT del 28 de septiembre, buscó el vencimiento y el documento original en otras páginas; encontró el documento.

Confirmé que el cuaderno se organiza por vehículo y que Katerin registra o busca allí la información. También documenté el caso del SOAT del 28 de septiembre. Todavía no he levantado el paso a paso específico para registrar cada tipo de ingreso, gasto u otro documento; lo dejé como tema para una conversación posterior.

### Recorrido web inicial

1. La usuaria ingresa a la URL de VehicleControlApp Web.
2. Considero el login con usuario y contraseña para una etapa posterior, por la sensibilidad de la información. La cartilla ubica la autenticación en una actividad posterior; no forma parte de la entrega de semana 1.
3. La usuaria crea o selecciona un vehículo clasificado como taxi o particular.
4. Registra ingresos y gastos asociados al vehículo.
5. Registra documentos SOAT o tecnomecánica con nombre y vencimiento. Puede guardar el registro antes de cargar un archivo; después adjunta un archivo y puede visualizarlo o descargarlo.
6. Consulta la información guardada por vehículo.

Después del login, propongo mostrar una lista de vehículos con acciones para crear o seleccionar uno, basada en la app Android. Katerin validó inicialmente las cuatro capacidades del flujo; no presento esa validación como aprobación del login, de las pantallas web ni de las reglas de adjuntos que definí después.

## 4. Alcance inicial y límites

### Incluido en el primer flujo web

- Crear un vehículo y clasificarlo como taxi o particular.
- Registrar ingresos y gastos asociados a un vehículo.
- Considerar el ingreso fijo diario por cada taxi y el total variable diario de inDrive. El fijo pertenece a cada taxi; inDrive se registra por vehículo y fecha.
- Registrar documentos SOAT y tecnomecánica con nombre y vencimiento.
- Adjuntar un archivo por registro, con posibilidad de guardar primero los datos y adjuntar después; permitir visualizar o descargar el original.
- Consultar la información guardada por vehículo.

### Android como referencia para el producto web

Usaré la app Android como referencia visual y funcional para el producto web. Consideraré sus funciones conocidas en el backlog y las priorizaré por etapas. El MVP acordado sigue siendo la primera etapa; esto no significa que vaya a incluir todas las funciones Android en ese MVP.

Tomaré como punto de partida la estructura visual y de navegación de Android: lista de vehículos, detalle del vehículo como centro de gestión, acciones rápidas y consulta del historial. Por ahora, usaré como base provisional placa, marca, modelo, tipo y estado; para los taxis, también conductor y cuota diaria. Aún debo definir los campos obligatorios y cómo adaptar las pantallas al navegador.

Evaluaré por etapas las funciones Android conocidas: panel de flota con conteos y próximos vencimientos, gastos, novedades, documentos (incluidos impuestos), vencimientos y recordatorios, historial por vehículo, resumen económico diario de taxis, reportes básicos e ingreso diario variable de inDrive. Definiré su orden y etapa de incorporación en el backlog web.

Como formatos iniciales para los soportes, propongo PDF, documentos Word (.doc/.docx) e imágenes comunes (JPG/JPEG y PNG). Interpreto provisionalmente “.Docs” como documentos Word. Antes de implementar, debo definir los formatos finales, el tamaño máximo y el almacenamiento.

## 5. Backlog inicial

Considero P1 las cuatro historias centrales porque forman el flujo solicitado. Ordené las historias según las dependencias del recorrido; revisaré la prioridad con nueva evidencia de Katerin.

### HU-01 — Crear y clasificar vehículos (P1)

**Como** administradora de la flota, **quiero** crear un vehículo y clasificarlo como taxi o particular, **para** organizar y consultar su información.

- **Éxito:** al guardar un vehículo con una de las dos clasificaciones, queda disponible para consulta.
- **Rechazo:** si no se selecciona taxi o particular, el vehículo no se confirma como creado.
- **Base provisional:** placa, marca, modelo, tipo y estado; para taxi, conductor e ingreso fijo diario.

### HU-02 — Registrar ingresos y gastos por vehículo (P1)

**Como** administradora de la flota, **quiero** registrar los ingresos y gastos asociados a un vehículo, **para** consultar sus movimientos.

- **Éxito — taxi:** cada taxi tiene una cuota fija diaria configurada por vehículo, disponible al consultar ese vehículo.
- **Éxito — inDrive:** el total variable de un día se registra asociado al vehículo y a la fecha, y luego se puede consultar.
- **Éxito — gastos:** al guardar un gasto asociado a un vehículo, aparece en la consulta de ese vehículo.
- **Rechazo:** si no se selecciona el vehículo asociado, el registro no se confirma.
- **Pendiente de detalle:** campos de gasto y validaciones adicionales. Android propone como referencia fecha, categoría, valor y descripción; inDrive usa fecha, total del día y nota opcional.

### HU-03 — Registrar y consultar documentos (P1)

**Como** administradora de la flota, **quiero** guardar SOAT o tecnomecánica con su nombre y vencimiento, y adjuntar después un archivo, **para** consultar el soporte original desde la aplicación.

- **Éxito:** el registro con nombre y vencimiento se puede guardar aunque todavía no tenga archivo; al adjuntar un archivo, se puede visualizar o descargar.
- **Alcance:** SOAT y tecnomecánica; un archivo por registro.
- **Rechazo:** si falta el nombre o el vencimiento, el registro no se confirma como completo.
- **Formatos propuestos:** PDF, .doc/.docx, JPG/JPEG y PNG; lista pendiente de definición técnica.

### HU-04 — Consultar por vehículo (P1)

**Como** administradora de la flota, **quiero** consultar la información guardada por vehículo, **para** encontrar sus datos, movimientos y documentos.

- **Éxito:** al seleccionar un vehículo, se muestran los registros asociados a ese vehículo.
- **Rechazo:** sin seleccionar un vehículo, la aplicación no presenta los registros como pertenecientes a uno específico.
- **Límite inicial:** ingresos, gastos y documentos. Reportes y novedades no se incluyen en este flujo confirmado.

### Pendiente para una actividad posterior: login

Dejo el login con usuario y contraseña para una etapa posterior, de acuerdo con la secuencia del instructor y la solicitud de proteger la información. No está implementado; todavía no he definido roles, permisos ni otros detalles de autenticación. El login no pertenece a la entrega de semana 1.

## 6. Organización individual

Trabajo individualmente en el proyecto. DazaDev es la empresa desarrolladora y soy el desarrollador responsable.

Me encargo de consolidar la ficha, separar la evidencia de los supuestos, organizar el backlog inicial y registrar las decisiones pendientes. Para validar el producto, tomo en cuenta la retroalimentación de Katerin.

## 7. Preguntas propuestas para seguimiento

No hice preguntas formales durante los contactos del 28 de septiembre, 2 de octubre y 8 de octubre. Para profundizar la validación, propuse estas preguntas para una conversación posterior y registrar sus respuestas por separado:

1. ¿Qué pasos sigue cuando necesita registrar o encontrar un ingreso, gasto o documento en el cuaderno?
2. ¿Qué información espera encontrar al consultar un vehículo?
3. ¿El total diario de inDrive y la cuota fija de taxi cubren los ingresos que necesita controlar en la web?
4. ¿Un archivo por registro es suficiente para SOAT y tecnomecánica? ¿Qué formatos usa normalmente para esos documentos?
5. Después de guardar el nombre y el vencimiento, ¿en qué momento suele tener disponible el archivo para adjuntarlo?

**Actualización posterior:** realicé una consulta breve con Katerin el 12 de octubre de 2026. Las respuestas y los requerimientos precisados quedaron registrados en la [evidencia de sesión 2](evidencia-sesion-2-requerimientos-backlog.md). Esta sección conserva el estado de las preguntas al cierre de la actividad de semana 1.

## 8. Hallazgos, hipótesis y asuntos posteriores

- **Hallazgo reportado:** Katerin lleva la información en un cuaderno con una sección por vehículo y tuvo que consultar otras páginas para encontrar el SOAT original.
- **Hallazgo de validación inicial:** Katerin está de acuerdo inicialmente con el flujo de cuatro capacidades y abierta a revisarlo con nueva evidencia.
- **Necesidad confirmada:** conservar y consultar archivos de SOAT y tecnomecánica desde el registro.
- **Hipótesis pendiente de medir:** tener el soporte dentro de la app reducirá demoras y complicaciones.
- **Pendiente técnico, no bloqueante para esta evidencia:** definir extensiones aceptadas, límites de tamaño y almacenamiento para los archivos.
- **Actividad posterior:** diseñar e implementar autenticación y definir roles y permisos.
