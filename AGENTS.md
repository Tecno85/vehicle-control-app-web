# Instrucciones para trabajar en este repositorio

## Alcance del producto

- Este repositorio corresponde a VehicleControlApp Web. No modificar desde aquí el código del proyecto Android.
- DazaDev es la empresa desarrolladora. Ivan Dario Madrid Daza es el desarrollador responsable. El trabajo es individual; Codex no es integrante del equipo.
- El producto de este repositorio es una Web App responsive para escritorio y móvil; no se desarrolla una aplicación nativa Android en este alcance. Conservar menciones históricas de Android solo cuando ayuden a explicar decisiones previas, sin incluir sus pantallas ni funciones como parte del diseño web.
- Por decisión de Ivan del 20 de noviembre de 2026, la identidad visual de la web-app se basa en la de Android: colores, letra Roboto, tarjetas, etiquetas y modo claro u oscuro, con el contraste ajustado a WCAG. Sus pantallas y funciones siguen fuera del diseño web. No presentar esta identidad como revisada por Katerin mientras no se le muestre.
- El MVP contempla crear y clasificar vehículos; registrar ingresos, gastos y documentos; y consultar la información por vehículo.
- Los tipos de ingreso iniciales son la cuota fija diaria del taxi y el total diario variable de inDrive en vehículos particulares habilitados para esa modalidad.
- Katerin puede cambiar la cuota de un taxi cuando lo decida. También quiere registrar el valor recibido si es menor que la cuota esperada o es cero, y anotar el motivo. Ese valor queda en el registro del día y no cambia la cuota configurada, como se decidió en la evidencia de sesión 3. Falta definir desde cuándo aplica un cambio de cuota.
- Los $5.000 diarios del taxi son un ahorro que Katerin aparta cada día trabajado para pagar al conductor una prima a mitad y a final de año; no son su sueldo. En la primera versión se registran como gasto diario y la prima no se vuelve a registrar al pagarla. El sueldo del conductor no se registra en la aplicación. No llamarlo «pago al conductor». El campo propuesto `es_ahorro_prima` no entra en el modelo hasta crear y ejecutar su migración, como recomendó el instructor el 20 de noviembre de 2026; mientras tanto, el ahorro es un gasto más de su categoría, sin cálculo de ahorro acumulado.
- Los gastos tienen fecha, valor, descripción y categoría. Categorías iniciales: Combustible, Lavado, Mantenimiento y Repuestos, indicadas por Katerin, y «Ahorro prima conductor», que Ivan agregó el 30 de octubre de 2026 para registrar el ahorro diario. Se pueden agregar y renombrar categorías; si una ya está usada, se desactiva para conservar los gastos anteriores.
- Para SOAT y tecnomecánica, registrar nombre y vencimiento. Permitir guardar esos datos antes de adjuntar un archivo. Se contempla un archivo por registro, que se podrá visualizar o descargar. El almacenamiento de archivos queda para una fase posterior a la primera versión.
- PDF, Word (.doc/.docx) e imágenes comunes (JPG/JPEG, PNG) son formatos candidatos, no una lista técnica cerrada. No inventar límites, almacenamiento ni conservación.
- Cada cuenta tendrá su propia flota. El MVP considera a la persona titular con acceso a sus datos; no se definieron roles para compartir flotas.
- Se acordó permitir registro propio, ingreso con correo y contraseña y recuperación de contraseña por correo. Estos flujos están diseñados en la evidencia de sesión 3. Desde la sesión 9, el ingreso con correo y contraseña está implementado en desarrollo local; el registro propio, la verificación y la recuperación no. Las reglas de contraseña del registro propio, la verificación del correo y la vigencia del enlace de recuperación siguen pendientes; los valores del ingreso están en la evidencia de sesión 9. La primera versión solo contempla el ingreso con correo y contraseña a una cuenta creada previamente; el registro propio, la verificación y la recuperación quedan para una fase posterior. Por recomendación del instructor del 20 de noviembre de 2026, la cuenta de prueba y sus cinco categorías se crean con un script SQL, y su contraseña real no se guarda en el repositorio.
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
- Usar `docs/evidencia-sesion-6-monorepo-react-nestjs.md` para la base del monorepo, la prueba de conexión y el registro de prompts de la sesión 6.
- Usar `docs/evidencia-sesion-7-conexion-hasura.md` para la conexión de core-service con Hasura, la base de datos versionada en `infra/hasura/` y el registro de prompts de la sesión 7.
- Usar `docs/evidencia-sesion-8-base-visual.md` para la base visual de la web-app con la identidad de Android, la guía visual y el registro de prompts de la sesión 8.
- Usar `docs/evidencia-sesion-9-acceso.md` para el ingreso con correo y contraseña, la sesión, la matriz de autorización y el registro de prompts de la sesión 9.
- No inventar usuarios, integrantes, resultados de pruebas ni decisiones técnicas.
- Cuando no haya una fecha acordada para un pendiente, escribir «Por definir». No asignar fechas supuestas.

## Límites de implementación y etapa

- La actividad más reciente es la sesión 9, el ingreso con correo y contraseña según la semana 6 de la cartilla. Antes, la sesión 8 hizo la base visual de la web-app. La sesión 7 siguió la semana 5 de la cartilla del instructor porque él indicó por WhatsApp seguir avanzando. No pidió entregar la evidencia de sesión 6, que queda en la versión 0.1. Es un monorepo con `apps/web-app` (React, TypeScript, Vite y Material UI) y `apps/core-service` (NestJS), conectados por la prueba de salud `GET /api/health` y un panel de verificación. core-service consulta Hasura Cloud con un cliente interno para el ingreso, la sesión, el perfil, la consulta de un vehículo de la cuenta y la prueba `GET /api/health/hasura`.
- Las evidencias de las sesiones 1 a 5 y 7 ya se entregaron y se conservan como registro, igual que la prueba del prototipo con Katerin del 20 de octubre de 2026.
- El modelo de la primera versión está cargado en Neon y expuesto por Hasura Cloud con datos ficticios. Está versionado en `infra/hasura/`: migración, datos de prueba y metadata. core-service lo usa para el ingreso y la sesión, y lee el perfil y un vehículo de la cuenta con sesión; no hay servicios del MVP que guarden vehículos, ingresos, gastos o documentos.
- Los cambios futuros del esquema van en migraciones nuevas dentro de `infra/hasura/migrations/default/`. `docs/evidencia-sesion-4/modelo-inicial.sql` se conserva como parte de esa evidencia.
- No crear tablas, permisos, migraciones, servicios o pantallas del MVP ni acceso sin solicitud expresa.
- La guía visual (`apps/web-app/guia-visual.html`) es solo para desarrollo: usa datos ficticios, no entra en la compilación y no es una pantalla del producto.
- No guardar en el repositorio cadenas de conexión, secretos de administración ni otras credenciales. Los `.env` no se versionan; solo `.env.example`, sin secretos. El secreto de Hasura solo vive en `apps/core-service/.env`, nunca en la web-app ni en variables `VITE_`.
- No afirmar que las funciones web o la autenticación están implementadas o probadas en producción.
- Tras la prueba del 20 de octubre de 2026, el prototipo incluye filtro por mes en las listas, creación de categoría desde el formulario de gasto, motivo obligatorio cuando el valor del taxi difiere de la cuota y registro automático de $5.000 para el conductor (el ahorro para su prima) al guardar un ingreso de taxi mayor que cero. Son ajustes de demostración; no están implementados en un producto con persistencia.
- El login y la recuperación se incluyen en el diseño de sesión 3. El ingreso con correo y contraseña se implementó en la sesión 9, solo en desarrollo local, con los valores de acceso que Ivan aprobó en esa evidencia; la recuperación no está implementada. No inventar roles, permisos compartidos ni políticas de autenticación distintas de las aprobadas.
- El ingreso tiene un límite conocido: recargar dos veces en menos de un segundo puede cerrar la sesión (evidencia de sesión 9, apartado 6). Ivan decidió resolverlo después de presentar el trabajo final en el SENA, con un margen de gracia en core-service. No presentarlo como resuelto, y retomarlo cuando Ivan siga con el proyecto después del SENA.
- Las rutas de la sección 4 de la evidencia de sesión 3 y la pantalla «Resumen mensual» son propuestas de diseño. El prototipo navega por estado y no cambia la URL; no están implementadas ni deben presentarse como arquitectura final.
- Por recomendación del instructor técnico, la primera versión prioriza vehículos, ingresos, gastos, categorías, registro de SOAT y tecnomecánica sin archivo, consulta por vehículo e ingreso básico. El registro propio, la recuperación de contraseña, el almacenamiento de archivos, el resumen mensual y el registro automático del ahorro para la prima del conductor quedan para una fase posterior; no presentarlos como parte de la primera versión ni descartar las necesidades de Katerin que los originaron.
- Por indicación del instructor, la base del monorepo usa React con TypeScript, Vite y Material UI en `apps/web-app`, y NestJS en `apps/core-service`, con npm workspaces. El monorepo se ejecuta con Node 24 LTS (`.node-version`) y npm 12. npm 12 bloquea los scripts de instalación de las dependencias: si una dependencia nueva los trae, decidir en `allowScripts` de `package.json` si se permiten.
- El prototipo de sesión 3 conserva Node 22 y su propio npm y `package-lock.json` para el flujo de GitHub Pages.
- core-service se conecta a Hasura Cloud para la consulta de prueba de la sesión 7 y para el ingreso de la sesión 9. No presentar la aplicación como conectada a los datos del MVP: solo lee el perfil y un vehículo de la cuenta con sesión, y no guarda vehículos, ingresos, gastos ni documentos.
- No adelantar actividades posteriores ni implementar funcionalidades sin solicitud expresa.
- No modificar el prototipo ni el CSS para obtener o mejorar una captura. Si una captura revela un problema de layout, reportarlo antes de tocar el código.
- No hacer commits ni push salvo que Ivan lo solicite.
- En los mensajes de commit usar los prefijos `docs`, `feat`, `fix` y `chore`. No reescribir los commits anteriores para unificarlos.
- Al hacer el commit de una entrega o de un cierre, crear una etiqueta anotada con la sesión y la versión del documento, por ejemplo `sesion-4-v0.1`, solo cuando Ivan lo pida.
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
- Usar la versión estable recomendada de cada herramienta, como la etiqueta `latest` de npm o la LTS de Node, aunque la clase muestre otra. Antes de adoptarla, comprobar que funciona. Registrar el cambio en la evidencia.

## Organización del trabajo

- El código del producto va en `apps/<app>`. El prototipo de la sesión 3 queda aparte, con su propio npm.
- Cada evidencia nueva va en `docs/evidencia-sesion-N-tema.md`, y sus recursos en `docs/evidencia-sesion-N/` (las capturas, en `capturas/`). Las evidencias anteriores conservan su nombre y ruta, porque los PDF entregados enlazan a ellas.
- Fuera del repositorio, cada sesión tiene su carpeta en `Asesor_Técnico/Sesión_N`, con los materiales del instructor y el PDF de la evidencia. Conservar allí la planificación de trabajo es opcional. En la raíz de `Asesor_Técnico` solo va lo que abarca varias sesiones.
- La tabla «Evidencias» del README es el índice: cada sesión suma una fila y cambia su estado cuando se entrega o se cierra.
- Por decisión de Ivan del 22 de noviembre de 2026, las sesiones se numeran en el orden en que él trabaja, sin esperar una indicación del instructor.
- Desde el 17 de noviembre de 2026 el instructor no pide entregas: el avance se revisa en las asesorías de clase. Ivan decidió seguir documentando cada sesión igual que antes. Desde la sesión 8, una sesión se cierra en lugar de entregarse: su fecha es la de cierre que decida Ivan («Por definir» mientras tanto), su estado es «Cerrada (versión 1.0)» y, si el instructor la revisa en una asesoría, también se anota esa fecha. No presentar como entregado lo que el instructor no recibió.
- Orden para cerrar una sesión: commit `feat` del código; evidencia, README, contexto y AGENTS.md; comprobaciones; PDF; commit `docs`; push y etiqueta, cuando Ivan lo pida; y la fecha real de entrega o de cierre en el README y el contexto.

## Documentación

- Mantener la documentación en español y sincronizar README, contexto y evidencias cuando cambien decisiones confirmadas.
- Cada vez que una nueva evidencia quede terminada, revisar el estado general del repositorio y actualizar los documentos afectados para que reflejen los acuerdos más recientes. Como mínimo, revisar README y contexto; actualizar AGENTS.md, índices y enlaces cuando corresponda.
- Mantener AGENTS.md como reglas estables: no incluir métricas de una entrega, hashes de commit ni rutas absolutas; esos datos van en README o en la evidencia.
- Conservar las evidencias anteriores como registros históricos. Añadir una nota o referencia a la evidencia nueva si un pendiente antiguo ya fue resuelto; no borrar ni reescribir el historial para hacerlo parecer contemporáneo.
- Al cerrar una evidencia, verificar que los documentos enlazados existan, que no haya fechas o decisiones contradictorias y que el estado del proyecto no presente como implementado lo que solo está planeado. Actualizar el estado de la entrega solo cuando esté confirmada; no dejar una fecha vencida como si todavía fuera futura.
- Desde la evidencia de sesión 4, cada evidencia indica en el encabezado su versión y fecha, y cierra con un historial de versiones: 0.x para borradores y revisiones parciales, 1.0 para la entrega o el cierre completo, salvo que Ivan decida cerrar con una versión 0.x. No añadir versiones a las evidencias anteriores.
- Registrar cada prompt usado para programar con:
  - Sus siete elementos: rol, objetivo, contexto, datos o archivos, restricciones, formato de salida y criterios de aceptación.
  - El texto exacto enviado.
  - Las comprobaciones con su resultado real.
- El Markdown es la fuente de verdad de cada evidencia. El PDF es un derivado para la entrega o el cierre, no se versiona y se guarda en la ruta externa que indique Ivan. Al generarlo, verificar que cada ficha quede junto a sus capturas y que las tablas no dupliquen filas ni dejen una fila huérfana.
- Compactar una evidencia puede reducir fichas o capturas, pero no debe reducir el mapa completo de pantallas ni la cobertura de historias. Las variantes no capturadas se describen en el mapa y en las fichas.
- Conservar las capturas antiguas no referenciadas como archivo; no borrarlas al actualizar una evidencia.
- Las fichas de pantalla deben conservar objetivo, usuario/HU, acción principal, regreso y capturas, según la plantilla del instructor.
- En todo el proyecto, usar lenguaje sencillo, claro y natural en la documentación, los textos de interfaz, los mensajes y los comentarios cuando corresponda. Evitar tecnicismos innecesarios sin perder precisión.
- Usar primera persona cuando el texto exprese la voz, decisiones o trabajo de Ivan. En la interfaz, hablar directamente con la usuaria de forma natural; en historias de usuario, criterios BDD, tablas y especificaciones, conservar la estructura que facilite la comprensión, sin forzar la primera persona.
- Desde la evidencia de sesión 6, aplicar ese lenguaje a párrafos, viñetas y observaciones, y explicar una sola vez, en palabras sencillas, cada término técnico que haga falta. No cambiar el texto exacto de los prompts, los comandos, los resultados, los mensajes de las herramientas o de la aplicación ni las palabras textuales de Katerin o del instructor. La primera persona incluye el trabajo hecho a pedido de Ivan, siempre que la evidencia indique qué redactó o ejecutó una herramienta de IA.
- Antes de añadir datos que dependan de la experiencia de Katerin o de una decisión del responsable del producto, pedir confirmación o marcarlos claramente como pendientes.
