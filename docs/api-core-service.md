# API de core-service

core-service es la única puerta de la web-app a los datos: la web-app le habla por HTTP y core-service consulta la base de datos a través de Hasura. En desarrollo responde en http://localhost:3000/api. Cómo ejecutarlo y probarlo está en la [guía de desarrollo](guia-desarrollo.md).

## Salud

`GET /api/health` responde a cualquiera, sin sesión, con `{ "status": "ok", "service": "core-service" }`. Sirve para comprobar que core-service está en marcha. La ruta de prueba `GET /api/health/hasura` se retiró en la sesión 10, porque las rutas de vehículos ya comprueban la conexión.

## Sesión

- **Token de acceso.** Dura 15 minutos y vive solo en la memoria de la página, no en el almacenamiento del navegador.
- **Renovación.** Va en la cookie `sesion_renovacion`, que la página no puede leer. Al recargar, la web-app la usa para seguir sin pedir la contraseña, y cambia en cada uso.
- **Cuándo se vuelve a pedir la contraseña.** Después de 7 días sin usar la web-app, o a los 30 días del ingreso aunque se siga usando.
- **Cerrar sesión.** Revoca la renovación. Si core-service no confirma el cierre, la sesión no se da por cerrada: la web avisa y deja intentarlo otra vez. Un token de acceso ya entregado sigue sirviendo hasta que vence, como máximo 15 minutos: por eso otra pestaña abierta puede seguir mostrando la flota hasta entonces.
- **Cuenta desactivada.** Deja de recibir datos en 1 minuto como máximo, aunque su token siga vigente: core-service comprueba en cada petición que la cuenta siga activa y recuerda la respuesta durante un minuto.
- **Tiempo límite.** La web-app espera hasta 15 segundos cada respuesta. Si al abrir la página core-service no responde, muestra «No pudimos comprobar tu sesión…» con un botón «Reintentar», en lugar de pedir la contraseña.
- **Varias pestañas.** Las renovaciones se hacen una por una con `navigator.locks`, porque si la misma renovación llega dos veces, core-service cierra ese ingreso.
- **Límite conocido.** Si recargas dos veces en menos de un segundo, la web-app puede volver a pedir la contraseña. Lo explica «Solución de problemas», en la [guía de desarrollo](guia-desarrollo.md).

## Qué permite cada ruta

El detalle está en la [evidencia de sesión 9](evidencia-sesion-9-acceso.md).

| Ruta | Quién puede usarla |
|---|---|
| `GET /api/health` | Cualquiera |
| `POST /api/sesion` | Cualquiera, con un máximo de 5 intentos por minuto |
| `POST /api/sesion/renovar` y `DELETE /api/sesion` | El navegador con la cookie de renovación, y solo desde la web-app |
| `GET /api/perfil` | Quien tiene sesión. Responde solo con los datos de su cuenta |
| `GET /api/vehiculos` y `POST /api/vehiculos` | Quien tiene sesión. Lista y crea solo en su cuenta |
| `GET`, `PATCH` y `DELETE /api/vehiculos/:id` | Quien tiene sesión, si el vehículo es de su cuenta. Si no, responde 404 |

Las rutas que exigen sesión también exigen que la cuenta siga activa. Los `POST`, `PATCH` y `DELETE` solo se aceptan desde la web-app: desde otro sitio responden 403 `ORIGEN_NO_PERMITIDO`.

## Errores

Desde la sesión 10, toda respuesta de error de `/api` trae `{ "codigo", "mensaje" }`, con un mensaje listo para mostrar. Los errores de validación (400 `DATOS_INVALIDOS`) suman `campos`, con un mensaje por campo. Una ruta de `/api` que no existe responde 404 `RUTA_NO_ENCONTRADA`; fuera de `/api` responde Express, con su página en HTML.

Si Hasura falla, core-service responde 503 con `{ "codigo": "SERVICIO_NO_DISPONIBLE", "mensaje": "No pudimos consultar tus datos en este momento. Intenta de nuevo en unos minutos." }`, y la causa queda en su terminal. Las consultas a Hasura son fijas, están en el código de core-service y reciben los datos como variables: el navegador no puede enviar otras.

## Vehículos

Desde la sesión 10, core-service guarda en la base, a través de Hasura, los vehículos de la cuenta con sesión. Las pantallas de la web-app que los usan están en la [guía de desarrollo](guia-desarrollo.md).

**Contrato de core-service.** Todas las rutas exigen sesión. La cuenta sale de la sesión, nunca del body.

| Método y ruta | Body | Respuesta |
|---|---|---|
| `GET /api/vehiculos` | — | 200 `{ "vehiculos": [...], "conteos": { "vehiculos", "taxis", "particulares" } }`. Primero los activos, por placa. Los conteos solo cuentan los activos |
| `GET /api/vehiculos/:id` | — | 200 con el vehículo y `"registros": { "ingresos", "gastos", "documentos" }` |
| `POST /api/vehiculos` | `placa`, `marca`, `modelo`, `tipo` (`TAXI` o `PARTICULAR`), `habilitado_indrive`, `conductor` y `cuota_diaria` | 201 con el vehículo |
| `PATCH /api/vehiculos/:id` | Los mismos campos, todos opcionales, o `"activo": false` para desactivarlo | 200 con el vehículo |
| `DELETE /api/vehiculos/:id` | — | 204, sin cuerpo |

Un vehículo, como lo devuelve core-service:

```json
{ "id": 1, "placa": "XYZ789", "marca": "Vehículo de ejemplo", "modelo": "Taxi", "tipo": "TAXI", "habilitado_indrive": false, "conductor": "Conductor de ejemplo", "cuota_diaria": 60000, "activo": true }
```

**Reglas:**
- **Placa:** obligatoria. core-service le quita los espacios y la pasa a mayúsculas. Lleva solo letras y números, hasta 10, y no se repite en la misma cuenta.
- **Marca y modelo:** obligatorios, hasta 60 caracteres cada uno.
- **Taxi:** lleva la cuota diaria, un número entero de pesos, de 0 en adelante. Puede llevar conductor, hasta 80 caracteres. No se habilita para inDrive.
- **Particular:** puede estar habilitado para inDrive. No lleva cuota ni conductor.
- **Con ingresos:** el vehículo no cambia de tipo ni deja de estar habilitado para inDrive.
- **Con ingresos, gastos o documentos:** no se elimina; se desactiva para conservarlos. Por ahora, un vehículo desactivado no se puede volver a activar.
- **Campos reservados:** `usuario_id`, `id` o cualquier campo que no sea del vehículo responden 400, y el vehículo no cambia.

**Errores de vehículos:**

| Estado y código | Cuándo |
|---|---|
| 400 `DATOS_INVALIDOS` | Un dato no cumple las reglas o llega un campo reservado. Trae `campos`, con un mensaje por campo. Si el id de la dirección no es un número, el mensaje es «El número del vehículo no es válido.», sin `campos` |
| 404 `VEHICULO_NO_ENCONTRADO` | El vehículo no existe o es de otra cuenta |
| 409 `PLACA_REPETIDA` | Ya hay un vehículo con esa placa en la cuenta. Trae `campos.placa`: «Ya tienes un vehículo con esa placa.» |
| 409 `VEHICULO_CON_INGRESOS` | Se intenta cambiar el tipo, o quitar inDrive, a un vehículo con ingresos |
| 409 `VEHICULO_CON_REGISTROS` | Se intenta eliminar un vehículo con ingresos, gastos o documentos |
| 422 `TIPO_INCOHERENTE` | Los datos no corresponden al tipo, por ejemplo un taxi sin cuota. Trae `campos` |
| 401 `SESION_REQUERIDA`, 403 `ORIGEN_NO_PERMITIDO` y 503 `SERVICIO_NO_DISPONIBLE` | Sin sesión, desde otro sitio o cuando Hasura falla |
