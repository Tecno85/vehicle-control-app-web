# Evidencia de sesión 12: ingresos por vehículo

| Proyecto | Integrantes y versión |
|---|---|
| VehicleControlApp Web · DazaDev | Ivan Dario Madrid Daza, trabajo individual. Versión 1.0 del 27 de noviembre de 2026. Cerrada el 27 de noviembre de 2026. |

## 1. Propósito y alcance

**Autoría.** Escribo en primera persona lo que decidí, pedí y probé. Codex ejecutó los dos prompts: programó los cambios, corrió las pruebas y redactó el borrador de esta evidencia. Claude Code completó la documentación de cierre el 27 de noviembre de 2026.

Implementé el primer recorrido vertical de ingresos: la titular abre un vehículo, registra el ingreso diario y consulta los ya guardados. La web sigue hablando solo con core-service, y core-service consulta Hasura; no agregué una conexión directa desde el navegador.

Esta sesión implementa solo crear y consultar ingresos. Editarlos, eliminarlos, filtrarlos por mes y registrar gastos siguen pendientes. Tampoco registra automáticamente el ahorro para la prima del conductor: en la primera versión ese ahorro será un gasto normal de su categoría.

La tabla `ingresos` y sus restricciones ya existen desde el modelo inicial de la sesión 4. No creé una migración nueva porque no cambié el esquema.

## 2. Reglas implementadas

| Situación | Resultado |
|---|---|
| Taxi activo | Guarda tipo `TAXI` y copia la cuota vigente del vehículo como cuota de referencia. |
| Taxi con un valor distinto de su cuota, incluso $0 | Exige un motivo antes de guardar. |
| Particular habilitado para inDrive | Guarda tipo `INDRIVE`, sin cuota de referencia; puede llevar una nota. |
| Particular sin inDrive | Rechaza el ingreso con `VEHICULO_SIN_INDRIVE`. |
| Vehículo desactivado | Rechaza el ingreso con `VEHICULO_INACTIVO`. |
| Fecha posterior al día actual | Rechaza el ingreso con `FECHA_FUTURA`. |
| Mismo vehículo y fecha | Rechaza el segundo ingreso con `INGRESO_DUPLICADO`. |
| Vehículo de otra cuenta | Responde 404, sin revelar que existe. |

El tipo y la cuota no vienen del formulario: core-service los obtiene del vehículo de la cuenta con sesión. El contrato completo quedó en [API de core-service](api-core-service.md).

## 3. Cambios realizados

| Área | Cambio |
|---|---|
| core-service | DTO de entrada, consultas GraphQL fijas, `IngresosService` y rutas `GET` y `POST /api/vehiculos/:id/ingresos`. |
| web-app | Botón «Registrar ingreso» en el detalle, formulario de fecha/valor/motivo/nota y listado del vehículo. |
| pruebas | Pruebas unitarias de reglas y pruebas e2e con Hasura simulado. El simulador ahora conserva ingresos y aplica su unicidad por vehículo y fecha. |
| documentación | README, contexto, guía de desarrollo y contrato de API actualizados. |

## 4. Comprobaciones reales

Las comprobaciones se ejecutaron el 26 de noviembre de 2026 desde la raíz del monorepo, con Node 24 y npm 12.

| Comprobación | Resultado real |
|---|---|
| `npm test` | 14 archivos y 146 pruebas correctas. Incluye seis pruebas nuevas de ingresos. |
| `npm run test:e2e` | 3 archivos y 34 pruebas correctas. Incluye el recorrido de taxi, duplicado, motivo, inDrive, fecha futura y cuenta ajena. Usa Hasura simulado, sin Neon ni Hasura Cloud. |
| `npm run lint` | Termina sin errores ni advertencias. |
| `npm run build` | Compila core-service y web-app correctamente. Vite mantiene su aviso conocido: el archivo JavaScript principal supera 500 kB. |
| Prueba manual en desarrollo local | El 26 de noviembre probé con la cuenta de prueba conectada a Neon y Hasura Cloud. Salieron bien el ingreso del taxi por su cuota, el valor menor y el valor cero con sus motivos, el ingreso de inDrive, el rechazo de un particular sin inDrive y la persistencia del ingreso y su cuota de referencia después de recargar. |
| Revisión visual responsive | Revisé los modos claro y oscuro a 1280 × 800 y 360 × 800 px. La vista móvil se comprobó con emulación del navegador. Todo salió bien. |

La prueba se hizo en desarrollo local; no publiqué la aplicación ni la probé en producción.

## 5. Límites de la comprobación

- La vista de 360 × 800 px se comprobó con emulación de navegador, no en un teléfono físico.
- A 360 px, el encabezado de la página de ingresos se parte en dos líneas. Se revisa en la sesión 13, con los ingresos completos.
- Durante el trabajo quedó una carpeta de migración vacía, `1795700000000_ingresos_reglas`, que no se usó ni se versionó. La borré el 27 de noviembre de 2026; el esquema no cambió.
- Cerré la sesión el 27 de noviembre de 2026, junto con la sesión 11, antes de seguir con las sesiones 13 a 15 de la primera versión.

## 6. Registro de prompts

### Prompt 1 · Implementar el flujo inicial de ingresos

| Elemento | Registro |
|---|---|
| Rol | No se indicó explícitamente. Codex actuó como desarrollador del repositorio. |
| Objetivo | Implementar el flujo vertical de ingresos recomendado. |
| Contexto | El proyecto ya tenía ingreso con correo y contraseña y CRUD de vehículos; la tabla `ingresos` existía en el modelo inicial. |
| Datos o archivos | Las evidencias de sesiones 3, 4 y 10, y el código de vehículos, autenticación y Hasura. |
| Restricciones | Respetar las reglas confirmadas de taxi e inDrive; no adelantar gastos, documentos ni automatización del ahorro. |
| Formato de salida | No se indicó explícitamente. Se entregó código y una explicación breve. |
| Criterios de aceptación | No se indicaron explícitamente. Se interpretaron como registrar, consultar y validar las reglas acordadas. |

Texto exacto enviado:

```text
Listo, hagamos lo que me recomiendas sobre ingresos. Graicas
```

Comprobaciones: al terminar esta primera parte, `npm run build`, `npm test` y `npm run lint` terminaron bien. La cobertura específica se amplía en el siguiente prompt.

### Prompt 2 · Pruebas específicas y evidencia

| Elemento | Registro |
|---|---|
| Rol | No se indicó explícitamente. Codex actuó como desarrollador y redactor de la evidencia. |
| Objetivo | Agregar pruebas específicas de ingresos y actualizar la documentación. |
| Contexto | El registro y la consulta de ingresos ya estaban implementados localmente. |
| Datos o archivos | Servicio de ingresos, Hasura simulado, pruebas e2e, README, contexto, guía de desarrollo y API. |
| Restricciones | No hacer commit ni push; no presentar las pruebas simuladas como una comprobación en Neon o producción. |
| Formato de salida | No se indicó explícitamente. Se entrega el código probado y la evidencia en Markdown. |
| Criterios de aceptación | Pruebas unitarias y e2e específicas, y documentación sincronizada. |

Texto exacto enviado:

```text
Listo, sigamos con las pruebas especificas y actualizar evidencia. Graicas
```

Comprobaciones: `npm test` dio 146 de 146, `npm run test:e2e` dio 34 de 34 y `npm run lint` terminó sin errores ni advertencias. `npm run build` también terminó correctamente.

## Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 26 nov 2026 | Borrador inicial: implementación local, pruebas específicas y documentación. |
| 0.2 | 26 nov 2026 | Registré la prueba manual local con Neon y Hasura Cloud y la revisión responsive en modo claro y oscuro. |
| 1.0 | 27 nov 2026 | Versión de cierre: autoría de Codex, límites pendientes para la sesión 13 y PDF. |
