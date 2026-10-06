# Contexto del proyecto VehicleControlApp Web

**Estado del contexto:** 6 de octubre de 2026  
**Actividad actual:** taller y evidencia de avance de semana 1; entrega indicada para el 8 de octubre de 2026.  
**Modalidad de trabajo:** individual.

## 1. Ficha del proyecto

| Campo | Descripción |
|---|---|
| Producto | VehicleControlApp Web, versión web de VehicleControlApp con repositorio propio. |
| Empresa desarrolladora | DazaDev. |
| Desarrollador responsable | Ivan Dario Madrid Daza. |
| Usuaria inicial | Katerin, propietaria y administradora de una pequeña flota. |
| Situación actual | El control de ingresos, gastos y datos de documentos de vehículos se lleva manualmente en un cuaderno. |
| Objetivo principal | Pasar el control de vehículos de la flota —actualmente llevado manualmente en una libreta— a un sistema de software web. La solución contempla taxis y el control de ingresos diarios generados mediante inDrive. |
| Alcance del primer flujo | Crear y clasificar vehículos como taxi o particular, registrar ingresos y gastos, registrar documentos y consultar la información por vehículo. |
| Modalidad | Trabajo individual; no se registran integrantes adicionales. |

## 2. Evidencia, observaciones e hipótesis

| Fecha | Tipo | Contenido | Alcance y límite |
|---|---|---|---|
| 28 sep 2026 | Validación inicial del flujo reportada por DazaDev | Katerin revisó la secuencia web de cuatro capacidades, comentó que inicialmente le gusta y que está abierta a modificarla si hace falta más adelante. | La revisó antes de definir el login y la carga de archivos; esos elementos no fueron parte de esta validación. No es una aprobación definitiva de pantallas, reglas o arquitectura. |
| 28 sep 2026 | Caso de consulta del SOAT reportado por DazaDev | Katerin buscó en otras páginas la fecha de vencimiento del SOAT de un vehículo y encontró el documento original. Los registros de la flota se llevan manualmente en un cuaderno. | Confirma que salió a otra página y encontró el soporte. La necesidad es poder consultar el original desde la app. |
| 2 oct 2026 | Retroalimentación de Katerin documentada por DazaDev | Katerin pidió que se pueda cargar el documento correspondiente al registro para visualizarlo o descargarlo después. | La retroalimentación concreta la necesidad de adjuntar y acceder al archivo desde el registro. |
| Sin fecha especificada | Observación previa de Katerin sobre Android | El término “Registro de documentos” le resultó confuso; también sugirió adjuntar imágenes de facturas. | Mantener como observación distinta de la retroalimentación del 2 de octubre. La propuesta de facturas no se incorpora automáticamente al alcance inicial. |
| Fechas y condiciones distintas, no detalladas aquí | Antecedente de pruebas Android | Katerin y Jean Carlos probaron el MVP Android en momentos y condiciones distintos. | No combinar sus pruebas ni atribuir resultados específicos sin evidencia separada. |

### Interpretación de la evidencia

- **Necesidad respaldada:** poder conservar el soporte documental asociado a un registro de SOAT o tecnomecánica y acceder a él desde la aplicación.
- **Consecuencia observada:** para consultar el soporte original del SOAT, Katerin tuvo que buscarlo en otras páginas y lo encontró.
- **Necesidad expresada:** consultar el soporte original desde la app, sin salir a buscarlo cada vez.
- **Hipótesis de impacto:** guardar el archivo junto al registro puede reducir demoras y complicaciones. No se midió el tiempo de búsqueda ni el ahorro esperado.
- **Pendiente de validación:** si la carga de facturas u otros documentos, además de SOAT y tecnomecánica, debe entrar en el primer alcance web.

La validación del flujo del 28 de septiembre y la retroalimentación sobre adjuntos del 2 de octubre se registran como contactos directos con Katerin, según lo reportado por el desarrollador. Katerin indicó que el flujo de cuatro capacidades inicialmente le gusta y puede modificarse si la evidencia posterior lo requiere. No hubo preguntas formales en esas conversaciones; las preguntas para un seguimiento se identifican por separado como propuestas, no como realizadas.

## 3. Recorrido actual y referencia Android

### Registro manual actual

Está confirmado que el cuaderno contiene una sección específica por vehículo donde Katerin registra o busca la información que necesita. Para consultar el documento SOAT original, buscó en otras páginas y encontró el archivo. 

**Recorrido actual respaldado:** Katerin abre la sección del vehículo en el cuaderno y registra o busca allí la información. En el caso del 28 de septiembre, buscó la fecha de vencimiento del SOAT en otras páginas y encontró el documento original.

Aún no se ha levantado el paso a paso específico para registrar cada tipo de ingreso, gasto u otro documento. Este detalle queda como tema para una conversación posterior y no se completa por inferencia.

### Aplicación Android existente

La app Android es antecedente funcional, no especificación automática de la web. Según el contexto proporcionado:

- Corresponde a la versión candidata 1.0.0-rc1, compilada y probada manualmente según la documentación del proyecto original; usa almacenamiento local Room/SQLite.
- Incluye vehículos, gastos, novedades y documentos; vencimientos y recordatorios internos; historial por vehículo; resumen económico diario para taxis y reportes básicos.
- Abre en una lista de vehículos sin login. Presenta conteos por tipo, próximos vencimientos, vehículos registrados y acceso a Reportes. Desde allí se agrega un vehículo o se abre su detalle.
- El detalle del vehículo reúne información del vehículo, documentos y vencimientos, gastos, novedades, resúmenes económicos y acciones rápidas para registrar gasto, novedad o documento y ver historial.
- El formulario del vehículo captura placa, marca, modelo, tipo y estado; para taxis agrega conductor e ingreso fijo diario.
- El ingreso de inDrive guarda fecha, total del día y nota opcional; la opción aparece solo para vehículos habilitados para inDrive.
- Los gastos guardan fecha, categoría, valor y descripción. Las novedades guardan fecha, tipo, prioridad y descripción, con ajuste de ingreso para taxis.
- Los documentos registran tipo (SOAT, tecnomecánica o impuestos), vencimiento y notas, sin adjuntar archivos.
- El historial agrupa por fecha ingresos de inDrive, gastos, novedades y documentos. Reportes resume la flota, algunos ingresos y vencimientos.

**Nota de precisión:** según lo reportado, el código Android contiene el formulario y la ruta de ingreso de inDrive. `docs/04-flujo-navegacion.md` no menciona esa pantalla y está desactualizado en ese punto. Este repositorio web no modifica el código Android.

## 4. Alcance web inicial

### Capacidades confirmadas

1. Crear un vehículo y clasificarlo como taxi o particular.
2. Registrar ingresos y gastos asociados a un vehículo.
3. Registrar documentos asociados a un vehículo.
4. Consultar la información guardada por vehículo.

El control de ingresos web debe contemplar ambos tipos: **ingreso fijo diario por taxi** y **total variable diario de inDrive**. Está confirmado que cada taxi tiene una cuota diaria fija y que el ingreso de inDrive varía día a día. Como estructura de trabajo aceptada por Ivan por ahora y coherente con Android, el valor fijo se configura en los datos de cada taxi y los ingresos de inDrive se registran por vehículo y fecha. La estructura puede revisarse con nueva evidencia antes de implementar. Aquí, taxi/particular son clasificaciones de vehículo; inDrive identifica una modalidad de ingreso, no una clasificación confirmada.

Para el primer alcance documental se consideran **SOAT y tecnomecánica**. Cada registro conserva nombre y vencimiento, y admite un archivo de soporte que se pueda visualizar o descargar. Está acordado que el registro puede guardarse antes de adjuntar el archivo y que después se añade el soporte; se plantea un archivo por registro.

**Formatos candidatos para la primera versión:** PDF, documentos de Word (.doc/.docx) e imágenes comunes (JPG/JPEG y PNG). El usuario mencionó “PDF y .Docs”; se interpreta provisionalmente `.Docs` como documentos tipo Word. DazaDev deberá confirmar extensiones, límites de tamaño, almacenamiento y conservación antes de implementar la carga.

### Recorrido principal propuesto

El recorrido puede comenzar en la URL de la web app y mostrar un login de usuario y contraseña, solicitado para proteger datos que el usuario considera sensibles. Después del acceso, la usuaria completaría el recorrido acordado: crear o seleccionar vehículo, registrar ingresos o gastos, registrar un documento con su soporte y consultar la información por vehículo.

**Propuesta de recorrido después del login:** mostrar una lista de vehículos con acciones para crear o seleccionar uno. Se inspira en el Android existente y sirve al flujo web validado inicialmente, pero debe tratarse como estructura revisable. Después, gestionar ingresos, gastos y documentos, y consultar la información por vehículo.

La pantalla posterior al login y el orden detallado de navegación web siguen pendientes. El login queda en el backlog y el plan para una actividad posterior; no forma parte de la entrega de semana 1. No están definidos los roles, permisos, recuperación de contraseña ni otros detalles de autenticación.

## 5. Backlog inicial para conversar

Historias iniciales derivadas de las capacidades confirmadas. Las cuatro capacidades principales quedan como imprescindibles del primer flujo (P1) y se ordenan según sus dependencias. Es una priorización inicial propuesta que debe contrastarse con Katerin.

### HU-01 — Crear y clasificar un vehículo

**Como** administradora de la flota, **quiero** crear un vehículo y clasificarlo como taxi o particular, **para** consultar su información por vehículo.

- **Éxito:** dado un vehículo con clasificación taxi o particular, cuando se guarda, entonces queda asociado a esa clasificación y disponible para consulta.
- **Rechazo:** si no se elige una de las dos clasificaciones, el sistema no confirma el vehículo como creado.
- **Estructura inicial aceptada por Ivan por ahora, basada en Android:** placa, marca, modelo, tipo y estado; para taxi, conductor e ingreso fijo diario. Es una base de diseño revisable, no una afirmación de que esos campos ya estén implementados.
- **Pendiente de detalle:** marcar cuáles campos son obligatorios en cada formulario.

### HU-02 — Registrar ingresos y gastos por vehículo

**Como** administradora de la flota, **quiero** registrar ingresos y gastos asociados a un vehículo, **para** consultar sus movimientos.

- **Éxito — inDrive:** al registrar el total diario para un vehículo y una fecha, el ingreso queda asociado al vehículo y puede consultarse.
- **Éxito — taxi:** cada taxi tiene configurada su cuota fija diaria, disponible al consultar ese vehículo. La cuota es por vehículo, según la definición confirmada.
- **Éxito — gasto:** al guardar un gasto asociado a un vehículo, aparece en la consulta de ese vehículo.
- **Rechazo:** si no se selecciona el vehículo al que pertenece el ingreso o el gasto, no confirmar el registro. Otros campos obligatorios deben definirse al diseñar el formulario.
- **Campos candidatos basados en Android, no cerrados para web:** inDrive guarda fecha, total del día y nota opcional; el gasto guarda fecha, categoría, valor y descripción.
- **Regla confirmada:** el total de inDrive es variable y se registra por día; no se modela como una cuota fija diaria.

### HU-03 — Registrar y consultar soportes de SOAT y tecnomecánica

**Como** administradora de la flota, **quiero** guardar el nombre y el vencimiento de SOAT o tecnomecánica junto con un documento o imagen, **para** poder visualizarlo o descargarlo desde el registro.

- **Éxito:** dado un vehículo, cuando se guarda SOAT o tecnomecánica con nombre y vencimiento, el registro puede consultarse por vehículo; el archivo se puede adjuntar antes o después y luego visualizar o descargar.
- **Rechazo:** si falta el nombre o la fecha de vencimiento, el registro no se confirma como completo; ambos datos se necesitan según la definición de producto.
- **Regla confirmada:** puede guardarse el registro antes de adjuntar el archivo; se plantea un archivo por registro.
- **Formatos candidatos:** PDF, .doc/.docx, JPG/JPEG y PNG, sujetos a comprobación y decisión de DazaDev antes de implementar.

### HU-04 — Consultar información por vehículo

**Como** administradora de la flota, **quiero** consultar por vehículo la información guardada, **para** encontrar sus datos, movimientos y documentos.

- **Éxito:** dado un vehículo seleccionado, cuando se consulta su información, entonces aparecen los registros guardados para ese vehículo.
- **Rechazo:** si no se selecciona un vehículo, la consulta no se presenta como información de un vehículo específico.
- **Propuesta de datos visibles:** vehículo, ingresos, gastos y documentos asociados. Reportes, novedades, filtros y resúmenes adicionales no pertenecen al alcance inicial confirmado.

### Pendiente posterior: acceso con login

**Como** usuaria registrada, **quiero** ingresar con usuario y contraseña, **para** que la información de la flota tenga acceso limitado.

La necesidad de login queda considerada para el backlog y el plan. La cartilla ubica su desarrollo en una actividad posterior, así que no se presenta como implementado ni como parte de la entrega de semana 1. Roles y permisos todavía no están definidos.

## 6. Organización y entrega de semana 1

- **Modalidad y responsable:** trabajo individual. Empresa desarrolladora: DazaDev. Desarrollador responsable: Ivan Dario Madrid Daza. No agregar integrantes ficticios ni presentar a Codex como integrante.
- **Entregable previsto:** ficha del proyecto, resumen de evidencia, flujo principal, backlog inicial y organización individual del trabajo.
- **Validación de usuaria:** Katerin revisó el flujo de cuatro capacidades el 28 de septiembre; el 2 de octubre aportó retroalimentación sobre adjuntar y consultar documentos. El contacto del 2 de octubre ocurrió durante la semana de trabajo previa a la entrega. Mantener ambos eventos separados.
- **Responsabilidades:** Ivan Dario Madrid Daza consolida ficha, evidencia, flujo y backlog; las preguntas de negocio abiertas quedan registradas para una próxima conversación con Katerin.
- **Orden inicial:** P1 vehículo → P1 ingresos/gastos → P1 documentos → P1 consulta por vehículo. Login queda para una actividad posterior.
- **Criterios de revisión:** problema y usuaria concretos; flujo con inicio y resultado; historias con valor y criterios observables; separación explícita entre hallazgos y supuestos.
- **Fecha indicada de entrega:** 8 de octubre de 2026, según el calendario del instructor confirmado por la persona aprendiz.

## 7. Orientación técnica, no decisión

Los materiales del instructor presentan React y Material UI, NestJS, Hasura GraphQL Engine y PostgreSQL en Neon; describen React consumiendo NestJS por HTTP/REST y NestJS consultando Hasura por GraphQL. Esta combinación es orientación, no decisión definitiva ni arquitectura implementada. No se debe seleccionar o describir como tecnología oficial sin confirmación.

## 8. Decisiones abiertas antes de implementar

- **Documento `.Docs`:** se interpreta provisionalmente como documentos de Word `.doc`/`.docx`. Confirmar esta interpretación y la lista final de formatos antes de implementar. Como propuesta para una primera versión, aceptar PDF, .doc/.docx, JPG/JPEG y PNG.
- **Adjunto:** un archivo por registro y posibilidad de guardar metadatos antes de cargar el archivo están acordados. DazaDev debe especificar tamaño máximo, almacenamiento y conservación antes de implementación.
- **Campos obligatorios:** la estructura base del vehículo está aceptada por ahora; definir reglas de obligatoriedad y validación de campos al diseñar cada formulario.
- **Gastos:** los campos de Android (fecha, categoría, valor y descripción) son una referencia candidata; su traslado a web requiere validación de alcance.
- **Inicio tras login:** se propone una lista de vehículos con acciones para crear o seleccionar, basada en Android. Es una propuesta de navegación; validar antes de tratarla como decisión.
- **Autenticación:** roles, permisos, recuperación de contraseña y otros detalles quedan para la actividad posterior de login.

### Preguntas propuestas para seguimiento con Katerin

No se hicieron preguntas formales durante los contactos reportados. Estas preguntas quedan preparadas para una próxima conversación y no se presentan como evidencia ya obtenida:

1. Cuando buscó el SOAT el 28 de septiembre, ¿qué pasos siguió y qué información necesitaba encontrar?
2. ¿Qué datos necesita revisar al consultar los ingresos y gastos de un vehículo?
3. ¿Qué información adicional, si alguna, debe acompañar el total diario variable de inDrive y la cuota fija diaria del taxi?
4. ¿El soporte en PDF, Word o imagen cubre los documentos de SOAT y tecnomecánica que necesita consultar?

Estas decisiones abiertas no impiden documentar la evidencia de semana 1 ni el alcance del flujo inicial.
