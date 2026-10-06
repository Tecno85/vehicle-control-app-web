# Evidencia de avance — Semana 1

**Proyecto:** VehicleControlApp Web  
**Empresa desarrolladora:** DazaDev  
**Desarrollador responsable:** Ivan Dario Madrid Daza  
**Usuaria inicial:** Katerin, propietaria y administradora de una pequeña flota  
**Modalidad:** trabajo individual  
**Fecha de entrega indicada:** 8 de octubre de 2026  
**Estado de esta evidencia:** avance de descubrimiento y backlog inicial; no describe funcionalidades web implementadas.

## 1. Problema, usuaria y contexto

Katerin administra una pequeña flota y actualmente registra o consulta la información en un cuaderno que tiene una sección específica por vehículo. El objetivo principal del proyecto es pasar ese control manual a un sistema de software web para gestionar los vehículos de la flota, incluidos los taxis, sus ingresos y gastos, y los documentos asociados. El control de ingresos acordado contempla tanto la cuota diaria fija de cada taxi como el total variable diario generado mediante inDrive.

El 28 de septiembre de 2026, al necesitar la fecha de vencimiento del SOAT de un vehículo, Katerin buscó en otras páginas y encontró el documento original. Esta situación muestra que el soporte no estaba disponible en el punto donde lo necesitaba. No se midió cuánto duró la búsqueda.

**Necesidad identificada:** centralizar en la web el control que hoy se lleva en la libreta y consultar desde la aplicación el registro y el documento original asociado, sin tener que salir a buscarlo cada vez. La expectativa de reducir demoras es una hipótesis; no se midió el ahorro de tiempo.

## 2. Evidencia de contacto con la usuaria

| Fecha | Evidencia reportada | Resultado y alcance |
|---|---|---|
| 28 sep 2026 | Katerin revisó el flujo web inicial de cuatro capacidades. | Comentó que inicialmente le gusta y que está abierta a modificarlo si hace falta. El flujo revisado no incluía login ni carga de archivos; ambos temas se definieron después. |
| 28 sep 2026 | Katerin buscó en otras páginas el vencimiento del SOAT y encontró el documento original. | Sustenta la necesidad de tener acceso al soporte desde el registro del vehículo. No se conoce el tiempo invertido. |
| 2 oct 2026 | Katerin pidió poder cargar el documento correspondiente al registro y luego visualizarlo o descargarlo. | Se concreta el alcance deseado de adjuntos para documentos. |

Los contactos y resultados fueron reportados por Ivan Dario Madrid Daza, desarrollador de DazaDev. No hubo preguntas formales en estas conversaciones; al final se incluye una lista de preguntas propuestas para seguimiento, sin presentarlas como preguntas ya realizadas.

## 3. Proceso actual y recorrido web objetivo

### Proceso actual observado y reportado

1. Katerin abre en el cuaderno la sección correspondiente al vehículo.
2. Allí registra o busca la información que necesita.
3. Para el caso del SOAT del 28 de septiembre, buscó el vencimiento y el documento original en otras páginas; encontró el documento.

Está confirmado que el cuaderno se organiza por vehículo y que Katerin registra o busca allí la información. También se conoce el caso del SOAT del 28 de septiembre. Aún no se ha levantado el paso a paso específico para registrar cada tipo de ingreso, gasto u otro documento; ese detalle queda como tema para una conversación posterior.

### Recorrido web inicial

1. La usuaria ingresa a la URL de VehicleControlApp Web.
2. Se contempla un login de usuario y contraseña como punto de entrada futuro, por la sensibilidad de la información. La cartilla ubica el desarrollo de autenticación en una actividad posterior; no es parte de la entrega de semana 1.
3. La usuaria crea o selecciona un vehículo clasificado como taxi o particular.
4. Registra ingresos y gastos asociados al vehículo.
5. Registra documentos SOAT o tecnomecánica con nombre y vencimiento. Puede guardar el registro antes de cargar un archivo; después adjunta un archivo y puede visualizarlo o descargarlo.
6. Consulta la información guardada por vehículo.

Como propuesta de navegación después del login, se plantea una lista de vehículos con acciones para crear o seleccionar uno, basada en la app Android. Katerin validó inicialmente las cuatro capacidades del flujo; no se considera que haya aprobado el login, las pantallas web ni las reglas de adjuntos que se definieron después.

## 4. Alcance inicial y límites

### Incluido en el primer flujo web

- Crear un vehículo y clasificarlo como taxi o particular.
- Registrar ingresos y gastos asociados a un vehículo.
- Considerar el ingreso fijo diario por cada taxi y el total variable diario de inDrive. El fijo pertenece a cada taxi; inDrive se registra por vehículo y fecha.
- Registrar documentos SOAT y tecnomecánica con nombre y vencimiento.
- Adjuntar un archivo por registro, con posibilidad de guardar primero los datos y adjuntar después; permitir visualizar o descargar el original.
- Consultar la información guardada por vehículo.

### Referencia Android y decisiones no trasladadas automáticamente

La app Android es antecedente, no especificación completa de la web. Como base provisional aceptada por Ivan, el vehículo usa placa, marca, modelo, tipo y estado; para taxis, conductor e ingreso fijo diario. Los campos obligatorios, novedades, reportes, recordatorios, historial y demás pantallas Android no se incorporan al MVP web sin validación.

Para los soportes se proponen inicialmente PDF, documentos Word (.doc/.docx) e imágenes comunes (JPG/JPEG y PNG). La expresión “.Docs” se interpreta provisionalmente como documentos Word. Los formatos finales, tamaño máximo y almacenamiento deberán definirse antes de implementar.

## 5. Backlog inicial

Las cuatro historias centrales se consideran P1 por formar el flujo solicitado. El orden sigue las dependencias del recorrido y queda sujeto a revisión con nueva evidencia de Katerin.

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

Se considera un login de usuario y contraseña antes de acceder a la información, por solicitud del responsable del producto. No se afirma que esté implementado; roles, permisos y otros detalles de autenticación siguen sin definición y no pertenecen a la entrega de semana 1.

## 6. Organización individual

DazaDev es la empresa desarrolladora y Ivan Dario Madrid Daza es el desarrollador responsable. El trabajo es individual; no se registran integrantes adicionales.

Ivan consolida la ficha, mantiene la evidencia separada de los supuestos, organiza el backlog inicial y registra las decisiones pendientes. La validación de producto se apoya en la retroalimentación reportada de Katerin.

## 7. Preguntas propuestas para seguimiento

No se hicieron preguntas formales durante los contactos del 28 de septiembre y 2 de octubre. Para cumplir el ejercicio de preparar preguntas de entrevista y profundizar la validación, se proponen las siguientes; deben formularse en una conversación posterior y sus respuestas registrarse por separado:

1. ¿Qué pasos sigue cuando necesita registrar o encontrar un ingreso, gasto o documento en el cuaderno?
2. ¿Qué información espera encontrar al consultar un vehículo?
3. ¿El total diario de inDrive y la cuota fija de taxi cubren los ingresos que necesita controlar en la web?
4. ¿Un archivo por registro es suficiente para SOAT y tecnomecánica? ¿Qué formatos usa normalmente para esos documentos?
5. Después de guardar el nombre y el vencimiento, ¿en qué momento suele tener disponible el archivo para adjuntarlo?

## 8. Hallazgos, hipótesis y asuntos posteriores

- **Hallazgo reportado:** Katerin lleva la información en un cuaderno con una sección por vehículo y tuvo que consultar otras páginas para encontrar el SOAT original.
- **Hallazgo de validación inicial:** Katerin está de acuerdo inicialmente con el flujo de cuatro capacidades y abierta a revisarlo con nueva evidencia.
- **Necesidad confirmada:** conservar y consultar archivos de SOAT y tecnomecánica desde el registro.
- **Hipótesis pendiente de medir:** tener el soporte dentro de la app reducirá demoras y complicaciones.
- **Pendiente técnico, no bloqueante para esta evidencia:** definir extensiones aceptadas, límites de tamaño y almacenamiento para los archivos.
- **Actividad posterior:** diseñar e implementar autenticación y definir roles y permisos.
