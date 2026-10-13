# Instrucciones para trabajar en este repositorio

## Alcance del producto

- Este repositorio corresponde a VehicleControlApp Web. No modificar desde aquí el código del proyecto Android.
- DazaDev es la empresa desarrolladora. Ivan Dario Madrid Daza es el desarrollador responsable. El trabajo es individual; Codex no es integrante del equipo.
- Usar Android como antecedente visual y funcional. No asumir que todas sus pantallas o funciones entran en el primer MVP web.
- El MVP contempla crear y clasificar vehículos; registrar ingresos, gastos y documentos; y consultar la información por vehículo.
- Los tipos de ingreso iniciales son la cuota fija diaria del taxi y el total diario variable de inDrive en vehículos particulares habilitados para esa modalidad.
- Katerin puede cambiar la cuota de un taxi cuando lo decida. También quiere registrar el valor recibido si es menor que la cuota esperada o es cero, y anotar el motivo. Falta definir si ese valor solo afecta el registro del día y desde cuándo aplica un cambio de cuota.
- Los gastos tienen fecha, valor, descripción y categoría. Categorías iniciales: Combustible, Lavado, Mantenimiento y Repuestos. Se acordó permitir agregar y editar categorías; definir qué pasa con gastos previos si cambia una categoría.
- Para SOAT y tecnomecánica, registrar nombre y vencimiento. Permitir guardar esos datos antes de adjuntar un archivo. Se contempla un archivo por registro, que se podrá visualizar o descargar.
- PDF, Word (.doc/.docx) e imágenes comunes (JPG/JPEG, PNG) son formatos candidatos, no una lista técnica cerrada. No inventar límites, almacenamiento ni conservación.

## Fuentes y precisión

- Separar hechos reportados, observaciones de Katerin, decisiones confirmadas, hipótesis y propuestas. No presentar hipótesis de ahorro de tiempo como resultados medidos.
- Mantener separadas las observaciones de Katerin y Jean Carlos sobre Android. Jean Carlos no utilizará la aplicación web.
- Katerin validó inicialmente el flujo el 28 de septiembre de 2026; buscó y encontró el SOAT en un caso distinto ese mismo día; pidió adjuntos el 2 de octubre; y revisó Android el 8 de octubre. La consulta breve de requerimientos se realizó el 12 de octubre. No combinar los eventos ni cambiar sus fechas.
- Katerin dijo que le gusta el flujo inicial y está abierta a modificarlo si nueva evidencia lo requiere. No tratarlo como aprobación definitiva de pantallas o reglas.
- Usar `docs/evidencia-sesion-1.md` como registro histórico de la semana 1 y `docs/evidencia-sesion-2-requerimientos-backlog.md` para los requerimientos y acuerdos posteriores. Si hay discrepancias, respetar fechas y aclarar el cambio posterior, no borrar la historia.
- No inventar usuarios, integrantes, resultados de pruebas ni decisiones técnicas.

## Límites de implementación y etapa

- La actividad documental vigente es la evidencia de requerimientos y backlog de sesión 2, con entrega indicada para el 15 de octubre de 2026. No afirmar que las funciones web están implementadas o probadas.
- El login queda para una etapa posterior del plan. No definir por inferencia roles, permisos ni detalles de autenticación.
- React/Material UI, NestJS, Hasura GraphQL Engine y PostgreSQL en Neon son orientación del instructor, no decisiones cerradas.
- No adelantar actividades posteriores ni implementar funcionalidades sin solicitud expresa.
- No hacer commits salvo que Ivan lo solicite.
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
- Conservar las evidencias anteriores como registros históricos. Añadir una nota o referencia a la evidencia nueva si un pendiente antiguo ya fue resuelto; no borrar ni reescribir el historial para hacerlo parecer contemporáneo.
- Al cerrar una evidencia, verificar que los documentos enlazados existan, que no haya fechas o decisiones contradictorias y que el estado del proyecto no presente como implementado lo que solo está planeado.
- En todo el proyecto, usar lenguaje sencillo, claro y natural en la documentación, los textos de interfaz, los mensajes y los comentarios cuando corresponda. Evitar tecnicismos innecesarios sin perder precisión.
- Usar primera persona cuando el texto exprese la voz, decisiones o trabajo de Ivan. En la interfaz, hablar directamente con la usuaria de forma natural; en historias de usuario, criterios BDD, tablas y especificaciones, conservar la estructura que facilite la comprensión, sin forzar la primera persona.
- Antes de añadir datos que dependan de la experiencia de Katerin o de una decisión del responsable del producto, pedir confirmación o marcarlos claramente como pendientes.
