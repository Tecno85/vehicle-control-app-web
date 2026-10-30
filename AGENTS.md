# Instrucciones para trabajar en este repositorio

## Alcance del producto

- Este repositorio corresponde a VehicleControlApp Web. No modificar desde aquí el código del proyecto Android.
- DazaDev es la empresa desarrolladora. Ivan Dario Madrid Daza es el desarrollador responsable. El trabajo es individual; Codex no es integrante del equipo.
- El producto de este repositorio es una Web App responsive para escritorio y móvil; no se desarrolla una aplicación nativa Android en este alcance. Conservar menciones históricas de Android solo cuando ayuden a explicar decisiones previas, sin incluir sus pantallas ni funciones como parte del diseño web.
- El MVP contempla crear y clasificar vehículos; registrar ingresos, gastos y documentos; y consultar la información por vehículo.
- Los tipos de ingreso iniciales son la cuota fija diaria del taxi y el total diario variable de inDrive en vehículos particulares habilitados para esa modalidad.
- Katerin puede cambiar la cuota de un taxi cuando lo decida. También quiere registrar el valor recibido si es menor que la cuota esperada o es cero, y anotar el motivo. Ese valor queda en el registro del día y no cambia la cuota configurada, como se decidió en la evidencia de sesión 3. Falta definir desde cuándo aplica un cambio de cuota.
- Los $5.000 diarios del taxi son un ahorro que Katerin aparta cada día trabajado para pagar al conductor una prima a mitad y a final de año; no son su sueldo. En la primera versión se registran como gasto diario y la prima no se vuelve a registrar al pagarla. El sueldo del conductor no se registra en la aplicación. No llamarlo «pago al conductor».
- Los gastos tienen fecha, valor, descripción y categoría. Categorías iniciales: Combustible, Lavado, Mantenimiento y Repuestos, indicadas por Katerin, y «Ahorro prima conductor», que Ivan agregó el 30 de octubre de 2026 para registrar el ahorro diario. Se pueden agregar y renombrar categorías; si una ya está usada, se desactiva para conservar los gastos anteriores.
- Para SOAT y tecnomecánica, registrar nombre y vencimiento. Permitir guardar esos datos antes de adjuntar un archivo. Se contempla un archivo por registro, que se podrá visualizar o descargar. El almacenamiento de archivos queda para una fase posterior a la primera versión.
- PDF, Word (.doc/.docx) e imágenes comunes (JPG/JPEG, PNG) son formatos candidatos, no una lista técnica cerrada. No inventar límites, almacenamiento ni conservación.
- Cada cuenta tendrá su propia flota. El MVP considera a la persona titular con acceso a sus datos; no se definieron roles para compartir flotas.
- Se acordó permitir registro propio, ingreso con correo y contraseña y recuperación de contraseña por correo. Estos flujos están diseñados en la evidencia de sesión 3, pero no implementados. Las reglas técnicas de contraseña, verificación del correo y vigencia del enlace de recuperación siguen pendientes. La primera versión solo contempla el ingreso con correo y contraseña a una cuenta creada previamente; el registro propio, la verificación y la recuperación quedan para una fase posterior.
- Vehículos, ingresos, gastos y documentos se pueden editar según las reglas de la evidencia de sesión 3. Vehículos con registros se desactivan; vehículos sin registros pueden eliminarse con confirmación. Ingresos y gastos se eliminan definitivamente con confirmación. Al eliminar un documento también se elimina su archivo asociado, con confirmación.

## Fuentes y precisión

- Separar hechos reportados, observaciones de Katerin, decisiones confirmadas, hipótesis y propuestas. No presentar hipótesis de ahorro de tiempo como resultados medidos.
- Mantener separadas las observaciones de Katerin y Jean Carlos sobre Android. Jean Carlos no utilizará la aplicación web.
- Katerin validó inicialmente el flujo el 28 de septiembre de 2026; buscó y encontró el SOAT en un caso distinto ese mismo día; pidió adjuntos el 2 de octubre; revisó Android el 8 de octubre; y respondió la consulta breve de requerimientos el 12 de octubre. La prueba del prototipo web se realizó el 20 de octubre de 2026; allí revisó la identidad visual y le pareció adecuada. No combinar los eventos ni cambiar sus fechas.
- Katerin dijo que le gusta el flujo inicial y está abierta a modificarlo si nueva evidencia lo requiere. La revisión de identidad visual del 20/10/2026 no es una aprobación definitiva de pantallas, reglas, login o arquitectura.
- La segunda prueba del prototipo web con Katerin no se realizó. Queda pendiente con fecha «Por definir»; no atribuirle resultados ni presentarla como realizada.
- La verificación móvil de la evidencia de sesión 3 se hizo en emulación de navegador a 360 × 800 px, no en un dispositivo real. No presentarla como prueba en dispositivo.
- Usar `docs/evidencia-sesion-1.md` como registro histórico de la semana 1 y `docs/evidencia-sesion-2-requerimientos-backlog.md` para los requerimientos y acuerdos posteriores. Si hay discrepancias, respetar fechas y aclarar el cambio posterior, no borrar la historia.
- Usar `docs/evidencia-sesion-3-diseno-pantallas.md` para el mapa y las fichas de pantallas, el prototipo Figma y los acuerdos posteriores sobre acceso y edición/eliminación.
- Usar `docs/evidencia-sesion-4-modelo-datos-servicios.md` para el modelo de datos, sus decisiones de diseño y los servicios de las sesiones 4 y 5. Sus tablas, campos y relaciones son un diseño previo a la programación.
- No inventar usuarios, integrantes, resultados de pruebas ni decisiones técnicas.
- Cuando no haya una fecha acordada para un pendiente, escribir «Por definir». No asignar fechas supuestas.

## Límites de implementación y etapa

- La actividad documental vigente es el modelo de datos y servicios de las sesiones 4 y 5: el instructor trasladó la revisión de los apartados 1 y 2 del 29 al 30 de octubre de 2026, y la entrega del documento completo del 5 al 6 de noviembre de 2026. Es una actividad de diseño. Por indicación del instructor, el modelo de la primera versión ya está cargado en Neon y expuesto por Hasura Cloud con datos de prueba ficticios; no crear otras tablas, permisos, migraciones, servicios ni código sin solicitud expresa. No guardar en el repositorio cadenas de conexión, secretos de administración ni otras credenciales de esas plataformas. La evidencia de sesión 3 (entrega del 22 de octubre de 2026) y la prueba del prototipo con Katerin del 20 de octubre de 2026 se conservan como registro. No afirmar que las funciones web o la autenticación están implementadas o probadas en producción.
- Tras la prueba del 20 de octubre de 2026, el prototipo incluye filtro por mes en las listas, creación de categoría desde el formulario de gasto, motivo obligatorio cuando el valor del taxi difiere de la cuota y registro automático de $5.000 para el conductor (el ahorro para su prima) al guardar un ingreso de taxi mayor que cero. Son ajustes de demostración; no están implementados en un producto con persistencia.
- El login y la recuperación se incluyen en el diseño de sesión 3; no se implementan como parte de esta evidencia. No inventar roles, permisos compartidos ni políticas técnicas de autenticación.
- Las rutas de la sección 4 de la evidencia de sesión 3 y la pantalla «Resumen mensual» son propuestas de diseño. El prototipo navega por estado y no cambia la URL; no están implementadas ni deben presentarse como arquitectura final.
- Por recomendación del instructor técnico, la primera versión prioriza vehículos, ingresos, gastos, categorías, registro de SOAT y tecnomecánica sin archivo, consulta por vehículo e ingreso básico. El registro propio, la recuperación de contraseña, el almacenamiento de archivos, el resumen mensual y el registro automático del ahorro para la prima del conductor quedan para una fase posterior; no presentarlos como parte de la primera versión ni descartar las necesidades de Katerin que los originaron.
- React/Material UI, NestJS, Hasura GraphQL Engine y PostgreSQL en Neon son orientación del instructor, no decisiones cerradas.
- No adelantar actividades posteriores ni implementar funcionalidades sin solicitud expresa.
- No modificar el prototipo ni el CSS para obtener o mejorar una captura. Si una captura revela un problema de layout, reportarlo antes de tocar el código.
- No hacer commits salvo que Ivan lo solicite.
- En los mensajes de commit usar los prefijos `docs`, `feat`, `fix` y `chore`. No reescribir los commits anteriores para unificarlos.
- Al hacer el commit de una entrega, crear una etiqueta anotada con la sesión y la versión del documento, por ejemplo `sesion-4-v0.1`, solo cuando Ivan lo pida.
- Reglas de edición/eliminación acordadas: un vehículo con registros se desactiva para conservarlos; sin registros se puede eliminar con confirmación. Los ingresos y gastos se eliminan definitivamente con confirmación. Los documentos se pueden editar y reemplazar; al eliminarlos también se elimina su archivo. Las categorías usadas se renombrarán o desactivarán para conservar los gastos históricos.
- En criterios BDD, presentar cada escenario completo con las etiquetas **Dado**, **Cuando** y **Entonces**. Mantener notas pendientes, reglas y criterios de calidad fuera de escenarios incompletos.

## Buenas prácticas de desarrollo

- Antes de cambiar código, revisar la estructura y las convenciones existentes. Seguirlas cuando sean claras y proponer cambios de arquitectura solo cuando hagan falta y estén dentro del alcance acordado.
- Mantener el código sencillo, legible y fácil de mantener. Usar nombres claros, funciones y componentes con responsabilidades acotadas, y evitar duplicación, abstracciones innecesarias y dependencias sin justificación.
- Escribir comentarios solo cuando ayuden a entender por qué existe una decisión, una regla o una excepción difícil de deducir. No comentar línea por línea ni repetir en palabras lo que el código ya muestra. Mantener los comentarios actualizados y en lenguaje sencillo.
- Validar los datos en los límites de entrada y manejar errores de forma clara. No incluir contraseñas, credenciales, archivos privados ni otros datos sensibles en el código, los mensajes de error o los registros.
- En pantallas y formularios, cuidar accesibilidad y uso desde distintos tamaños de pantalla: etiquetas comprensibles, navegación por teclado, foco visible, contraste suficiente y mensajes claros para estados de carga, éxito, vacío y error.
- No presentar una función como terminada ni una comprobación como realizada si no se implementó o verificó. Explicar cualquier límite pendiente.
- No agregar herramientas, dependencias ni patrones de arquitectura por costumbre; primero confirmar que la tecnología elegida para el proyecto los necesita.

## Documentación

- Mantener la documentación en español y sincronizar README, contexto y evidencias cuando cambien decisiones confirmadas.
- Cada vez que una nueva evidencia quede terminada, revisar el estado general del repositorio y actualizar los documentos afectados para que reflejen los acuerdos más recientes. Como mínimo, revisar README y contexto; actualizar AGENTS.md, índices y enlaces cuando corresponda.
- Mantener AGENTS.md como reglas estables: no incluir métricas de una entrega, hashes de commit ni rutas absolutas; esos datos van en README o en la evidencia.
- Conservar las evidencias anteriores como registros históricos. Añadir una nota o referencia a la evidencia nueva si un pendiente antiguo ya fue resuelto; no borrar ni reescribir el historial para hacerlo parecer contemporáneo.
- Al cerrar una evidencia, verificar que los documentos enlazados existan, que no haya fechas o decisiones contradictorias y que el estado del proyecto no presente como implementado lo que solo está planeado. Actualizar el estado de la entrega solo cuando esté confirmada; no dejar una fecha vencida como si todavía fuera futura.
- Desde la evidencia de sesión 4, cada evidencia indica en el encabezado su versión y fecha, y cierra con un historial de versiones: 0.x para borradores y revisiones parciales, 1.0 para la entrega completa. No añadir versiones a las evidencias anteriores.
- El Markdown es la fuente de verdad de cada evidencia. El PDF es un derivado para entrega, no se versiona y se guarda en la ruta externa que indique Ivan. Al generarlo, verificar que cada ficha quede junto a sus capturas y que las tablas no dupliquen filas ni dejen una fila huérfana.
- Compactar una evidencia puede reducir fichas o capturas, pero no debe reducir el mapa completo de pantallas ni la cobertura de historias. Las variantes no capturadas se describen en el mapa y en las fichas.
- Conservar las capturas antiguas no referenciadas como archivo; no borrarlas al actualizar una evidencia.
- Las fichas de pantalla deben conservar objetivo, usuario/HU, acción principal, regreso y capturas, según la plantilla del instructor.
- En todo el proyecto, usar lenguaje sencillo, claro y natural en la documentación, los textos de interfaz, los mensajes y los comentarios cuando corresponda. Evitar tecnicismos innecesarios sin perder precisión.
- Usar primera persona cuando el texto exprese la voz, decisiones o trabajo de Ivan. En la interfaz, hablar directamente con la usuaria de forma natural; en historias de usuario, criterios BDD, tablas y especificaciones, conservar la estructura que facilite la comprensión, sin forzar la primera persona.
- Antes de añadir datos que dependan de la experiencia de Katerin o de una decisión del responsable del producto, pedir confirmación o marcarlos claramente como pendientes.
