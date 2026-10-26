# Requerimientos y backlog de VehicleControlApp Web

**Actividad:** Sesión 2 — Gestión de requerimientos y backlog del MVP  
**Responsable:** Ivan Dario Madrid Daza, trabajo individual  
**Empresa desarrolladora:** DazaDev  
**Usuaria inicial consultada:** Katerin, propietaria y administradora de una pequeña flota  
**Fecha de entrega indicada por el instructor:** 15 de octubre de 2026  
**Estado:** evidencia redactada para revisión

## 1. Proyecto, problema y objetivo

Mi proyecto, VehicleControlApp Web, busca trasladar a una aplicación web el control de vehículos, ingresos, gastos y documentos que actualmente se lleva manualmente en un cuaderno. Quiero que la información quede organizada por vehículo y se pueda consultar desde un solo lugar.

El 28 de septiembre de 2026, Katerin necesitó consultar el vencimiento del SOAT de un vehículo. Lo buscó en otras páginas y encontró el documento original. No medimos cuánto tiempo tomó la búsqueda. A partir de este caso, identifiqué la necesidad de poder consultar en la aplicación tanto los datos del documento como su soporte.

## 2. Personas usuarias y responsabilidades

| Persona | Rol y participación |
|---|---|
| Katerin | Es la propietaria y administradora de la flota y la usuaria inicial. Lleva actualmente el control en el cuaderno y participó en la validación de necesidades. |
| Ivan Dario Madrid Daza | Soy el desarrollador responsable de DazaDev. Realizo individualmente el levantamiento, la organización de requerimientos y el desarrollo del producto. |

Jean Carlos no utilizará la aplicación web. No he definido otros usuarios, roles o permisos. Codex es una herramienta de apoyo y no forma parte del equipo.

## 3. Alcance inicial del MVP

Para la primera etapa propongo estas capacidades, acordadas como base del producto:

1. Crear vehículos y clasificarlos como taxi o particular.
2. Registrar los ingresos y gastos asociados a un vehículo. Cada taxi tendrá una cuota fija diaria que Katerin podrá ajustar cuando lo considere conveniente. Para un vehículo particular que trabaje con inDrive, incluiré el registro del total variable de cada día.
3. Registrar documentos SOAT y tecnomecánica con nombre y fecha de vencimiento. Se podrá guardar el registro antes de adjuntar un archivo; después se podrá visualizar o descargar el soporte. Se contempla un archivo por registro.
4. Consultar por vehículo la información que se haya guardado.

Para los gastos, acordé incluir fecha, valor, descripción y categoría. Las categorías iniciales serán Combustible, Lavado, Mantenimiento y Repuestos. También se podrá agregar una categoría o editar las existentes.

Katerin indicó que le gusta la organización visual y funcional que tiene la aplicación Android como punto de partida. La usaré como referencia revisable; no asumiré que todas sus pantallas y funciones deben entrar en este MVP.

El login con usuario y contraseña se conserva para una etapa posterior del plan, de acuerdo con la secuencia de actividades del instructor. No está implementado y aún no he definido roles ni permisos.

## 4. Proceso actual y recorrido web

### Proceso actual

Katerin consulta o registra la información en la sección de cada vehículo en su cuaderno. En el caso del 28 de septiembre, buscó el vencimiento del SOAT y encontró el soporte original en otras páginas. Katerin confirmó que no quiere conservar los pasos del cuaderno: el propósito es reemplazar ese control manual con el uso de la aplicación.

### Recorrido web propuesto

La usuaria abre la aplicación, crea o selecciona un vehículo, registra sus ingresos o gastos, o registra un documento SOAT o tecnomecánica. Puede adjuntar el soporte después de guardar los datos. Luego consulta la información desde el vehículo y, si lo necesita, visualiza o descarga el archivo.

El 28 de septiembre Katerin revisó inicialmente el flujo de cuatro capacidades y dijo que le gustaba, aunque está abierta a modificarlo si nueva evidencia lo requiere. Esa revisión ocurrió antes de definir el login y los adjuntos, por lo que no la presento como aprobación de esos elementos ni como aprobación definitiva de todas las pantallas.

## 5. Requerimientos y reglas de negocio

| ID | Requerimiento | Regla o estado conocido |
|---|---|---|
| RF-01 | Crear y clasificar vehículos. | Las opciones iniciales son taxi y particular. Como base revisable, usaré los datos de Android: placa, marca, modelo, tipo y estado. Para taxi se contempla conductor y cuota diaria. |
| RF-02 | Registrar ingresos por vehículo. | El taxi tiene una cuota diaria fija que Katerin puede cambiar cuando lo considere conveniente. Para inDrive se registra el total variable diario por vehículo y fecha. |
| RF-03 | Registrar gastos por vehículo. | Cada gasto contempla fecha, valor, descripción y categoría. Se parte de cuatro categorías comunes y se permitirá agregar o editar categorías. |
| RF-04 | Registrar documentos del vehículo. | El alcance inicial incluye SOAT y tecnomecánica, con nombre y vencimiento. Se contempla un archivo por registro, que puede adjuntarse después de guardar los datos y luego visualizarse o descargarse. |
| RF-05 | Consultar la información por vehículo. | La consulta debe reunir la información y los registros asociados al vehículo elegido. |

### Reglas confirmadas

- Taxi y particular son las clasificaciones iniciales del vehículo. inDrive es una modalidad de ingreso, no una clasificación de vehículo.
- La cuota del taxi es fija como referencia diaria y Katerin decide cuándo cambiarla.
- El total diario de inDrive es variable y se registra para el vehículo y la fecha correspondientes.
- Los gastos se organizan con fecha, valor, descripción y categoría. Katerin identificó Combustible, Lavado, Mantenimiento y Repuestos como categorías comunes.
- En documentos, primero se pueden guardar nombre y vencimiento y luego adjuntar un archivo. La usuaria podrá visualizarlo o descargarlo.

### Decisiones por precisar antes de implementar

- Cómo registrar el ingreso real de un taxi cuando en un día recibe menos de la cuota esperada o no recibe ingreso. Se acordó permitir anotar el valor y el motivo; falta definir si ese valor modifica solo el registro del día o también la cuota fija configurada.
- Si se permitirá más de un registro de ingreso inDrive para el mismo vehículo y fecha y cómo corregir un registro guardado.
- Qué campos serán obligatorios para cada tipo de vehículo y qué validaciones tendrán los formularios.
- La lista definitiva de formatos de archivo, el tamaño máximo, el almacenamiento y el tiempo de conservación. PDF es el formato más común indicado; PDF, Word (.doc/.docx) e imágenes JPG/JPEG o PNG son formatos candidatos, no una especificación técnica cerrada.
- Si se necesitan usuarios adicionales en el futuro y qué accesos tendría cada uno. Jean Carlos no utilizará esta versión web.

**Actualización posterior:** el 26 de octubre de 2026, en la [evidencia de sesiones 4 y 5](evidencia-sesion-4-modelo-datos-servicios.md), decidí que cada vehículo tenga un solo ingreso por fecha y que un ingreso se corrija editándolo. Esta sección conserva los pendientes tal como estaban al cierre de la sesión 2.

## 6. Historias de usuario y criterios de aceptación BDD

### HU-01 — Crear y clasificar vehículos

**Como** administradora de la flota, **quiero** crear un vehículo y clasificarlo como taxi o particular, **para** organizar y consultar su información.

- **Dado:** que ingreso los datos del vehículo y elijo taxi o particular. **Cuando:** guardo el registro. **Entonces:** el vehículo queda disponible para consultarlo con esa clasificación.
- **Dado:** que no he elegido una clasificación. **Cuando:** intento guardar. **Entonces:** la aplicación no confirma el vehículo como creado.
- **Pendiente:** definir los campos obligatorios de cada tipo.

### HU-02 — Registrar ingresos y ajustar la cuota del taxi

**Como** administradora de la flota, **quiero** consultar la cuota de cada taxi, cambiarla cuando lo decida y registrar el ingreso diario de inDrive, **para** llevar el control de los ingresos de mis vehículos.

- **Dado:** un taxi con una cuota diaria configurada. **Cuando:** consulto el vehículo. **Entonces:** puedo identificar el valor de esa cuota.
- **Dado:** un taxi con una cuota diaria configurada y un nuevo valor decidido por Katerin. **Cuando:** guardo el cambio. **Entonces:** el nuevo valor queda guardado como cuota del taxi.
- **Dado:** un taxi y una fecha en la que el ingreso es menor que la cuota esperada o es cero. **Cuando:** registro el valor recibido y el motivo. **Entonces:** el valor y el motivo quedan asociados a ese día.
- **Dado:** un vehículo que trabaja con inDrive y una fecha. **Cuando:** registro el total diario. **Entonces:** el ingreso queda asociado a ese vehículo y fecha y puedo consultarlo.
- **Pendiente:** definir desde cuándo aplica una cuota cambiada y si el valor diario recibido afecta solo el registro de ese día o también la cuota configurada.

### HU-03 — Registrar gastos y mantener categorías

**Como** administradora de la flota, **quiero** registrar gastos con fecha, valor, descripción y categoría, y poder agregar o editar categorías, **para** organizar los gastos de cada vehículo.

- **Dado:** un vehículo y un gasto con fecha, valor, descripción y categoría. **Cuando:** guardo el gasto. **Entonces:** queda asociado al vehículo y aparece en su consulta.
- **Dado:** que necesito una categoría que no existe. **Cuando:** la agrego. **Entonces:** puedo seleccionarla al registrar un gasto.
- **Dado:** una categoría existente que requiere un cambio. **Cuando:** la edito. **Entonces:** la categoría queda actualizada para su uso.
- **Categorías iniciales:** Combustible, Lavado, Mantenimiento y Repuestos.
- **Pendiente:** definir el tratamiento de categorías que ya estén usadas si luego se editan.

### HU-04 — Registrar y consultar documentos

**Como** administradora de la flota, **quiero** guardar SOAT o tecnomecánica con su nombre, vencimiento y archivo de soporte, **para** consultar los datos y abrir o descargar el documento desde la aplicación.

- **Dado:** un vehículo. **Cuando:** guardo el nombre y vencimiento de SOAT o tecnomecánica. **Entonces:** puedo consultar el registro aunque todavía no tenga un archivo adjunto.
- **Dado:** un registro de documento con un archivo adjunto. **Cuando:** elijo visualizar el soporte. **Entonces:** puedo abrir el archivo desde ese registro.
- **Dado:** un registro de documento con un archivo adjunto. **Cuando:** elijo descargar el soporte. **Entonces:** puedo obtener el archivo desde ese registro.
- **Dado:** que falta el nombre o el vencimiento. **Cuando:** intento guardar el registro. **Entonces:** la aplicación no lo confirma como completo.
- **Pendiente:** cerrar extensiones y límites permitidos antes de implementar la carga.

### HU-05 — Consultar información por vehículo

**Como** administradora de la flota, **quiero** consultar los datos, ingresos, gastos y documentos de un vehículo, **para** encontrar su información relacionada en un solo lugar.

- **Dado:** un vehículo seleccionado con registros asociados. **Cuando:** consulto su información. **Entonces:** veo los registros que pertenecen a ese vehículo.
- **Dado:** que no he seleccionado un vehículo. **Cuando:** consulto sus movimientos. **Entonces:** la aplicación no presenta esos movimientos como pertenecientes a un vehículo específico.

## 7. Criterios de calidad

Estos son criterios iniciales que propongo para hacer verificable la calidad. Aún no son resultados de pruebas ni todos han sido confirmados con Katerin.

| Tema | Criterio propuesto | Estado |
|---|---|---|
| Guardado | Al guardar un registro y volver a abrir la aplicación, el registro continúa disponible. | Propuesta por validar. |
| Asociación | Un ingreso, gasto o documento aparece bajo el vehículo al que fue asociado. | Derivado del requerimiento de consulta; falta acordar el detalle de prueba. |
| Archivos | El archivo adjunto se puede abrir o descargar desde su registro correspondiente. | Capacidad acordada; extensiones y límites pendientes. |
| Uso en navegador | El recorrido principal se puede completar en un navegador móvil sin perder acceso a los campos y acciones. | Propuesta por validar; dispositivos y criterio visual pendientes. |
| Acceso | El acceso a la información de la flota se protegerá mediante autenticación. | Necesidad considerada para una etapa posterior; implementación, usuarios y permisos pendientes. |

## 8. Backlog priorizado por etapas

| Orden | Historia o capacidad | Prioridad | Etapa y estado |
|---|---|---|---|
| 1 | HU-01 Crear y clasificar vehículos. | P1 | MVP; estructura inicial revisable. |
| 2 | HU-02 Registrar ingresos, consultar la cuota del taxi y permitir su ajuste. | P1 | MVP; falta definir desde cuándo aplica una cuota cambiada y si el valor diario modifica la cuota configurada. |
| 3 | HU-03 Registrar gastos y agregar o editar categorías. | P1 | MVP; campos y categorías iniciales acordados. |
| 4 | HU-04 Registrar SOAT y tecnomecánica y acceder a sus soportes. | P1 | MVP; necesidad acordada; límites técnicos de archivos pendientes. |
| 5 | HU-05 Consultar información por vehículo. | P1 | MVP; capacidad inicial acordada. |
| Posterior | Login y definición de usuarios y permisos. | Por priorizar | Etapa posterior del plan; no implementado ni definido. |
| Posterior | Panel de flota, vencimientos, documentos de impuestos, novedades, alertas, recordatorios, historial, resumen económico e informes. | Por priorizar | Funciones conocidas de Android para evaluar en etapas posteriores; no son parte del MVP acordado. |

Mantendré el MVP como primera etapa. Consideraré las demás funciones de Android en el backlog del producto web y decidiré su orden con nueva evidencia, sin presentarlas como comprometidas para esta entrega.

## 9. Consulta y validación con Katerin

### Validaciones anteriores

- **28 de septiembre de 2026:** Katerin revisó inicialmente el flujo de cuatro capacidades. Comentó que le gustaba y que está abierta a cambiarlo si se requiere. Esa revisión ocurrió antes de definir login y adjuntos.
- **28 de septiembre de 2026:** en un caso distinto, Katerin buscó el vencimiento del SOAT y encontró el documento original en otras páginas. No medimos el tiempo de búsqueda.
- **2 de octubre de 2026:** Katerin pidió poder adjuntar el documento de soporte y visualizarlo o descargarlo desde la aplicación.
- **8 de octubre de 2026:** Katerin indicó que considera adecuado el proceso actual y revisó lo realizado en la aplicación Android. Le gustó lo que se había realizado hasta ese momento. En esa conversación no se hicieron preguntas formales.

### Consulta breve del 12 de octubre de 2026

El 12 de octubre le hice preguntas breves a Katerin para precisar el alcance web. Registré estas respuestas:

- No quiere conservar los pasos del cuaderno; quiere llevar el control por medio de la aplicación.
- El taxi maneja una cuota diaria fija. La cuota se puede ajustar cuando Katerin lo considere conveniente. También le sirve registrar el valor recibido cuando sea menor o no haya ingreso, y anotar el motivo.
- El ingreso de inDrive es variable y se registra por día. La estructura Android lo contempla en vehículos particulares habilitados para inDrive.
- Los gastos comunes son Combustible, Lavado, Mantenimiento y Repuestos. Cada gasto llevará fecha, valor, descripción y categoría. Se podrá agregar o editar categorías.
- Los archivos corresponden a documentos del vehículo, como SOAT y tecnomecánica. PDF es el formato más común; se aceptarán formatos comunes, cuya lista técnica se cerrará antes de implementar.
- La información necesaria para consultar un vehículo tomará como referencia inicial la estructura de Android, que puede cambiar si más adelante se requiere.
- Jean Carlos no utilizará la aplicación web.

## 10. Pendientes y siguiente paso

Con la información reunida puedo describir el problema, las personas involucradas, el alcance del MVP, las reglas conocidas, las historias de usuario y el backlog priorizado. Para esta evidencia no dejo preguntas de entrevista pendientes. Sí registro decisiones que deben detallarse antes de implementar: reglas de vigencia de la cuota, corrección y duplicados de ingresos, validaciones de formularios, formatos y límites de archivos, y la autenticación y permisos de una etapa posterior.

Como siguiente paso, revisaré este backlog con el instructor y usaré las decisiones de diseño posteriores para concretar las reglas que aún están abiertas. No afirmo que estas funciones web estén implementadas ni probadas.

## Fuentes de trabajo

- Sesión 02, *Gestión de Requerimientos y Backlog del MVP*, material del instructor, octubre de 2026.
- *Modelo de Requerimientos Inventarios HATS*, usado como referencia de estructura. Los datos y reglas ficticias del ejemplo no se trasladan al proyecto VehicleControlApp Web.
- Contexto del proyecto y conversaciones reportadas con Katerin el 28 de septiembre, 2, 8 y 12 de octubre de 2026.
- Aplicación Android VehicleControlApp, consultada como antecedente para la estructura de vehículos y el registro de ingresos y gastos. No afirmo que sus funciones ya estén implementadas en la versión web.
