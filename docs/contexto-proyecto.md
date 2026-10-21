# Contexto del proyecto VehicleControlApp Web

**Estado del contexto:** 21 de octubre de 2026
**Actividad actual:** diseño de pantallas de sesión 3; prueba con Katerin realizada el 20 de octubre y entrega indicada para el 22 de octubre de 2026.
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
| 8 oct 2026 | Conversación de validación reportada por DazaDev | Katerin, propietaria y administradora de la flota, indicó que considera adecuado el proceso actual. Revisó lo realizado en la app Android y manifestó que le gustó el trabajo hasta ese momento. | No se hicieron preguntas formales en esta conversación. La validación corresponde al proceso actual y al estado de Android, no a una aprobación del login o de todas las funciones web. |
| 12 oct 2026 | Consulta breve de requerimientos realizada por Ivan | Katerin respondió preguntas sobre el proceso web, los ingresos de taxi e inDrive, gastos y categorías, documentos de vehículos y la información a consultar. | Los acuerdos se resumen en el alcance web y se detallan en la [evidencia de sesión 2](evidencia-sesion-2-requerimientos-backlog.md). No se debe atribuir esta consulta a la conversación del 8 de octubre. |
| 16 oct 2026 | Decisiones de diseño acordadas con Ivan | Se definió el modelo de cuentas independientes, el registro propio, el ingreso con correo y contraseña, la recuperación por correo y reglas de edición y eliminación para el MVP. | Son decisiones para diseñar el flujo; la autenticación y las funciones web no están implementadas. Se documentan en la [evidencia de sesión 3](evidencia-sesion-3-diseno-pantallas.md). |
| 18 oct 2026 | Alcance responsive y publicación documentados por Ivan | Se confirmó que el producto de este repositorio es una Web App para escritorio y móvil; la vista móvil es responsive y no se desarrollará una aplicación nativa. Se publicó el prototipo de sesión 3 en GitHub Pages. | La publicación permite revisar el prototipo; en esa fecha no significaba que las funciones estuvieran implementadas en el producto ni que Katerin ya lo hubiera probado. |
| 20 oct 2026 | Prueba del prototipo con Katerin | Katerin recorrió el prototipo publicado y revisó sus hojas de cálculo actuales. Validó el flujo general y propuso ajustes: estimado mensual, filtro por mes, creación de categoría desde el formulario de gasto y pago al conductor. | Los resultados y ajustes están en la [evidencia de sesión 3](evidencia-sesion-3-diseno-pantallas.md), §9 y §10. La prueba no implementa persistencia, autenticación ni subida real de archivos. |
| Sin fecha especificada | Observación previa de Katerin sobre Android | El término “Registro de documentos” le resultó confuso; también sugirió adjuntar imágenes de facturas. | Mantener como observación distinta de la retroalimentación del 2 de octubre. La propuesta de facturas no se incorpora automáticamente al alcance inicial. |
| Fechas y condiciones distintas, no detalladas aquí | Antecedente de pruebas Android | Katerin y Jean Carlos probaron el MVP Android en momentos y condiciones distintos. | No combinar sus pruebas ni atribuir resultados específicos sin evidencia separada. |

### Interpretación de la evidencia

- **Necesidad respaldada:** poder conservar el soporte documental asociado a un registro de SOAT o tecnomecánica y acceder a él desde la aplicación.
- **Consecuencia observada:** para consultar el soporte original del SOAT, Katerin tuvo que buscarlo en otras páginas y lo encontró.
- **Necesidad expresada:** consultar el soporte original desde la app, sin salir a buscarlo cada vez.
- **Hipótesis de impacto:** guardar el archivo junto al registro puede reducir demoras y complicaciones. No se midió el tiempo de búsqueda ni el ahorro esperado.
- **Pendiente de validación:** si la carga de facturas u otros documentos, además de SOAT y tecnomecánica, debe entrar en el primer alcance web.

La validación del flujo del 28 de septiembre, la retroalimentación sobre adjuntos del 2 de octubre y la conversación del 8 de octubre son contactos distintos con Katerin. En esas conversaciones no se hicieron preguntas formales. La consulta breve se realizó después, el 12 de octubre, y sus respuestas se registran en la evidencia de sesión 2.

## 3. Recorrido actual y referencia Android

### Registro manual actual

Está confirmado que el cuaderno contiene una sección específica por vehículo donde Katerin registra o busca la información que necesita. Para consultar el documento SOAT original, buscó en otras páginas y encontró el archivo. 

**Recorrido actual respaldado:** Katerin abre la sección del vehículo en el cuaderno y registra o busca allí la información. En el caso del 28 de septiembre, buscó la fecha de vencimiento del SOAT en otras páginas y encontró el documento original.

Todavía no he documentado el paso a paso para registrar cada tipo de ingreso, gasto u otro documento. Lo dejo como tema para una conversación posterior y no lo completo por inferencia.

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

**Decisión de trabajo para la web:** priorizaré por etapas las funciones acordadas para el producto web y mantendré el MVP como primera etapa. El alcance de este repositorio es una Web App responsive para escritorio y móvil; no desarrollaré una aplicación nativa.

## 4. Alcance web inicial

### Capacidades confirmadas

1. Crear un vehículo y clasificarlo como taxi o particular.
2. Registrar ingresos y gastos asociados a un vehículo.
3. Registrar documentos asociados a un vehículo.
4. Consultar la información guardada por vehículo.

En el alcance web incluiré la **cuota fija diaria de cada taxi** y el **total variable diario de inDrive** en vehículos particulares habilitados para esa modalidad. Katerin podrá cambiar la cuota del taxi cuando lo decida. También acordamos que pueda registrar el valor recibido si es menor que la cuota esperada o es cero, y anotar el motivo. Debo definir si ese valor afecta solo el registro del día o también la cuota configurada, y desde cuándo surte efecto un cambio. Taxi/particular son clasificaciones de vehículo; inDrive es una modalidad de ingreso.

Incluiré en los gastos la fecha, el valor, la descripción y la categoría. Las categorías iniciales son **Combustible, Lavado, Mantenimiento y Repuestos**. Katerin podrá agregar y renombrar categorías; si una categoría ya está usada, se desactiva para conservar los gastos anteriores.

Para el primer alcance documental se consideran **SOAT y tecnomecánica**. Cada registro conserva nombre y vencimiento, y admite un archivo de soporte que se pueda visualizar o descargar. Está acordado que el registro puede guardarse antes de adjuntar el archivo y que después se añade el soporte; se plantea un archivo por registro.

PDF es el formato de soporte más común que indicó Katerin. PDF, documentos de Word (.doc/.docx) e imágenes comunes (JPG/JPEG y PNG) son formatos candidatos; antes de implementar la carga, debo definir la lista técnica, los límites de tamaño, el almacenamiento y la conservación.

### Recorrido principal propuesto

Para el MVP, la usuaria crea su cuenta o ingresa y luego consulta la lista de vehículos. Desde allí crea o selecciona un vehículo, registra ingresos o gastos y registra SOAT o tecnomecánica. Puede adjuntar el soporte antes o después de guardar los datos y después consultar la información del vehículo y visualizar o descargar el archivo.

Propongo que, después del acceso, se muestre la lista de vehículos como pantalla principal de la Web App responsive. El recorrido está representado en el diseño de Figma y en un prototipo publicado en GitHub Pages, hecho con HTML, CSS y JavaScript; aún no es una función del producto ni ha sido aprobado definitivamente por Katerin. La pantalla de acceso contempla correo y contraseña, creación de cuenta propia y recuperación por correo. Cada cuenta tendrá su propia flota; el MVP considera a la persona titular con acceso a sus propios datos y no incorpora roles para compartir una flota. El login forma parte del diseño de sesión 3 porque el instructor pidió incluirlo en esta entrega; no está implementado. Katerin aún debe revisar estas pantallas.

El prototipo de sesión 3 también refleja que los vehículos se editan; los que tienen registros asociados se desactivan para conservarlos y los que no tienen registros se pueden eliminar con confirmación. Los ingresos y gastos se editan y se eliminan definitivamente con confirmación. Los documentos se pueden editar, reemplazar y eliminar con su archivo; las categorías usadas se pueden renombrar o desactivar de acuerdo con las reglas descritas en la [evidencia de sesión 3](evidencia-sesion-3-diseno-pantallas.md). La fecha desde la que aplica una cuota nueva de taxi sigue pendiente.

Después de la prueba del 20 de octubre de 2026, el prototipo incluye además: filtro por mes en las listas de ingresos, gastos y documentos; creación de categoría desde el formulario de gasto; motivo obligatorio cuando el valor recibido del taxi difiere de la cuota; y registro automático del pago al conductor por $5.000 al guardar un ingreso de taxi mayor que cero. Son ajustes de demostración y siguen sin persistencia ni autenticación real.

## 5. Backlog vigente

El backlog de sesión 2 contiene cinco historias de usuario priorizadas para el MVP: crear y clasificar vehículos; registrar ingresos y ajustar la cuota del taxi; registrar gastos y administrar categorías; registrar documentos y consultar sus soportes; y consultar la información por vehículo. Los criterios BDD y sus pendientes están detallados en la [evidencia de requerimientos y backlog](evidencia-sesion-2-requerimientos-backlog.md).

El login se incluyó como pantalla y recorrido del prototipo de sesión 3, a solicitud del instructor. No está implementado. Las funciones que queden fuera del MVP se priorizarán para etapas posteriores; este repositorio no incluye una aplicación nativa.

## 6. Organización y evidencias

- El trabajo es individual. DazaDev es la empresa desarrolladora e Ivan Dario Madrid Daza es el desarrollador responsable.
- La [evidencia de semana 1](evidencia-sesion-1.md) conserva el registro de esa actividad y su fecha de entrega indicada: 8 de octubre de 2026.
- En la [evidencia de sesión 2](evidencia-sesion-2-requerimientos-backlog.md) registré la consulta breve que realicé con Katerin el 12 de octubre y la entrega indicada para el 15 de octubre de 2026.
- La [evidencia de sesión 3](evidencia-sesion-3-diseno-pantallas.md) documenta el diseño de pantallas, los prototipos visuales y los acuerdos posteriores sobre cuentas y edición/eliminación. La entrega indicada es el 22 de octubre de 2026; la prueba con Katerin se realizó el 20 de octubre de 2026 y sus resultados están en esa evidencia.
- Katerin revisó inicialmente el flujo web el 28 de septiembre, pidió adjuntar soportes el 2 de octubre, validó el proceso y el avance Android el 8 de octubre, respondió preguntas breves el 12 de octubre y probó el prototipo web el 20 de octubre. Estos contactos no se deben combinar.

## 7. Orientación técnica, no decisión

Los materiales del instructor presentan React y Material UI, NestJS, Hasura GraphQL Engine y PostgreSQL en Neon; describen React consumiendo NestJS por HTTP/REST y NestJS consultando Hasura por GraphQL. Esta combinación es orientación, no decisión definitiva ni arquitectura implementada. No se debe seleccionar o describir como tecnología oficial sin confirmación.

## 8. Decisiones abiertas antes de implementar

- **Cuota e ingreso diario del taxi:** acordamos permitir cambiar la cuota y registrar el valor real del día, incluso si es menor o cero, con su motivo. Debo definir desde cuándo aplica una cuota modificada y si el valor diario afecta solo ese día o también la cuota configurada.
- **Ingresos de inDrive:** debo definir cómo corregir registros y si se admite más de un total para el mismo vehículo y fecha.
- **Formularios:** debo precisar los campos obligatorios y las validaciones del vehículo y de cada registro.
- **Categorías de gastos:** acordamos los campos y las categorías iniciales, además de permitir agregar y renombrar categorías. Si una categoría ya está usada, se desactiva para conservar los gastos anteriores.
- **Archivos:** acordamos permitir un archivo por registro y guardar primero los datos. PDF es el formato más común señalado; debo definir los formatos finales, el tamaño máximo, el almacenamiento y la conservación. Interpreto provisionalmente “.Docs” como Word (.doc/.docx).
- **Autenticación:** se acordó crear cuentas independientes con registro propio, correo y contraseña, y recuperación mediante correo. El MVP considera a la persona titular con acceso a su flota; no se definieron roles para compartir datos. Las políticas técnicas de contraseña, verificación del correo y validez del enlace de recuperación siguen pendientes. El flujo está representado en el diseño de Figma y en el prototipo local; no está implementado en el producto.

Para ampliar las reglas de edición y eliminación y revisar cada pantalla, consulta la [evidencia de diseño de sesión 3](evidencia-sesion-3-diseno-pantallas.md). La evidencia de sesión 2 se conserva como registro histórico de esa actividad.

La consulta breve con Katerin se realizó el 12 de octubre de 2026. No quedan preguntas de esa consulta pendientes; los asuntos anteriores son reglas de producto y decisiones técnicas por precisar antes de implementar. Sus respuestas se detallan en la [evidencia de sesión 2](evidencia-sesion-2-requerimientos-backlog.md).
