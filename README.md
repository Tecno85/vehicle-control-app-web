# VehicleControlApp Web

VehicleControlApp Web es la versión responsive para escritorio y móvil de VehicleControlApp y tiene su propio repositorio. DazaDev desarrolla el producto e Ivan Dario Madrid Daza es el responsable. El trabajo es individual. Katerin, propietaria y administradora de una pequeña flota, es la usuaria inicial.

## Objetivo

Quiero pasar a una aplicación web el control de vehículos, ingresos, gastos y documentos que actualmente se lleva en un cuaderno, para consultar esa información por vehículo.

## Alcance inicial

El MVP contempla:

- Crear vehículos y clasificarlos como taxi o particular.
- Registrar los ingresos diarios: cuota del taxi, que Katerin puede cambiar, o total variable de inDrive en particulares habilitados.
- Registrar gastos por fecha, valor, descripción y categoría. Las categorías iniciales son Combustible, Lavado, Mantenimiento, Repuestos y Ahorro prima conductor.
- Registrar SOAT y tecnomecánica con su vencimiento, adjuntar un archivo y luego visualizarlo o descargarlo.
- Consultar la información por vehículo.

Por recomendación del instructor técnico (27 de octubre de 2026), la primera versión se limita a vehículos, ingresos, gastos, categorías, registro de SOAT y tecnomecánica sin archivo, consulta por vehículo e ingreso con correo y contraseña. Pasan a una fase posterior el registro propio y la recuperación de contraseña, el almacenamiento de archivos, el resumen mensual y el registro automático del ahorro diario para la prima del conductor.

El formato PDF es el más común indicado por Katerin. Word (.doc/.docx) e imágenes comunes (JPG/JPEG, PNG) son formatos candidatos. La lista final, los límites y el almacenamiento aún están por definir.

## Estado actual

El repositorio es un monorepo con dos aplicaciones: `apps/web-app` (React, TypeScript y Material UI) y `apps/core-service` (NestJS). Por ahora solo se conectan mediante una prueba de salud: la web consulta `GET /api/health` y muestra si core-service responde. **La aplicación web no contiene funciones del MVP:** no hay pantallas de vehículos, ingresos, gastos ni documentos, ni acceso, autenticación o conexión con la base de datos.

También reúne la documentación de descubrimiento y diseño, y el prototipo responsive de la sesión 3 para revisar los recorridos. El prototipo representa las pantallas de acceso, creación de cuenta y recuperación de contraseña, pero sus acciones son simuladas. **El prototipo no es una aplicación lista para producción.** No implementa autenticación real, servidor ni almacenamiento persistente: usa datos de demostración y los cambios se pierden al recargar la página. Los archivos seleccionados solo se muestran durante la sesión del navegador. Katerin probó el prototipo el 20 de octubre de 2026 y revisó la identidad visual; sus observaciones y los ajustes acordados están en la [evidencia de sesión 3](docs/evidencia-sesion-3-diseno-pantallas.md).

La [evidencia de sesiones 4 y 5](docs/evidencia-sesion-4-modelo-datos-servicios.md) se entregó el 6 de noviembre de 2026 en su versión 0.8. Completa el diseño: alcance de la primera versión, proceso del MVP, seis tablas con sus campos y relaciones, servicios principales con sus contratos y revisión del diseño. Por indicación del instructor, el script [`modelo-inicial.sql`](docs/evidencia-sesion-4/modelo-inicial.sql) ya se ejecutó en Neon y Hasura Cloud expone esas tablas como API GraphQL, con datos de prueba ficticios. Todavía no están programados los servicios S01 a S12, la autenticación ni los permisos, y la aplicación no está conectada a esa API.

La actividad más reciente es la sesión 6. Su [evidencia](docs/evidencia-sesion-6-monorepo-react-nestjs.md) documenta la base del monorepo, la prueba de conexión entre React y NestJS y el registro de tres prompts. El 12 de noviembre de 2026 no hubo encuentro con el instructor y él no pidió entregarla, así que queda en la versión 0.1. Ese día indicó por WhatsApp seguir avanzando con el desarrollo del proyecto.

El [prototipo de sesión 3 está publicado en GitHub Pages](https://tecno85.github.io/vehicle-control-app-web/). Se puede recorrer en escritorio y móvil; la vista móvil es adaptable y no es una aplicación nativa.

## Organización del repositorio

```text
.
├── .github/workflows/              # Publicación manual del prototipo en Pages
├── .node-version                    # Node 24 para el monorepo
├── apps/
│   ├── core-service/                # NestJS: prueba de salud y cliente interno de Hasura
│   └── web-app/                     # React, TypeScript, Vite y Material UI
├── docs/                            # Contexto y evidencias de las sesiones
│   ├── evidencia-sesion-3/capturas/ # Capturas incluidas en la evidencia de diseño
│   ├── evidencia-sesion-4/          # Diagrama (SVG y PNG) y script SQL del modelo
│   └── evidencia-sesion-6/capturas/ # Capturas de la prueba de conexión
├── infra/hasura/                    # Migración, datos de prueba y metadata de Hasura
├── package.json                     # Workspaces de npm y atajos del monorepo
└── prototipo-web-sesion-3/          # Prototipo de revisión, con su propio npm
```

- [Contexto del proyecto](docs/contexto-proyecto.md): alcance, acuerdos y decisiones pendientes.

### Evidencias

| Sesión | Evidencia | Entrega indicada | Estado |
|---|---|---|---|
| Semana 1 | [Evidencia de semana 1](docs/evidencia-sesion-1.md): registro histórico de la actividad | 8 oct 2026 | Entregada |
| 2 | [Requerimientos y backlog](docs/evidencia-sesion-2-requerimientos-backlog.md): consulta, requerimientos e historias priorizadas | 15 oct 2026 | Entregada |
| 3 | [Diseño de pantallas](docs/evidencia-sesion-3-diseno-pantallas.md): mapa de 35 pantallas, rutas propuestas, 11 fichas, 24 capturas y resultados de la prueba con Katerin del 20 de octubre de 2026 | 22 oct 2026 | Entregada |
| 4 y 5 | [Modelo de datos y servicios](docs/evidencia-sesion-4-modelo-datos-servicios.md): alcance de la primera versión, proceso del MVP, seis tablas con su diagrama, campos y relaciones, modelo cargado en Neon y Hasura, servicios S01 a S12 con sus contratos, revisión del diseño y dudas abiertas | 6 nov 2026 | Entregada (versión 0.8) |
| 6 | [Monorepo con React y NestJS](docs/evidencia-sesion-6-monorepo-react-nestjs.md): base del monorepo, prueba de conexión con éxito, error y recuperación, y registro de tres prompts con sus comprobaciones | 12 nov 2026 | No solicitada (versión 0.1) |

El instructor trasladó dos fechas de las sesiones 4 y 5: la revisión de los apartados 1 y 2 pasó del 29 al 30 de octubre, y el documento completo, del 5 al 6 de noviembre de 2026. El 12 de noviembre de 2026 no hubo encuentro con el instructor y él no pidió entregar la evidencia de sesión 6. Ese día indicó por WhatsApp seguir avanzando con el desarrollo del proyecto.

## Ejecutar el monorepo

**Requisitos:** Node.js 24 LTS y npm 11.
- **fnm.** El archivo `.node-version` indica la 24. Si usas fnm, `fnm use` toma esa versión en esta carpeta, y `fnm install` la instala la primera vez.
- **Prototipo.** El prototipo de la sesión 3 y su flujo de GitHub Pages siguen con Node 22 y su propio `package-lock.json`.

1. Instala las dependencias desde la raíz: `npm install`. Para una instalación limpia, igual al lockfile, usa `npm ci`.
2. Crea el archivo de entorno de la web: `cp apps/web-app/.env.example apps/web-app/.env`.
3. En una terminal, arranca core-service: `npm run dev:api`. Queda en http://localhost:3000/api.
4. En otra terminal, arranca la web: `npm run dev:web`. Queda en http://localhost:5173.
5. Abre http://localhost:5173 y pulsa «Verificar conexión». Debe aparecer «Conectado: core-service».

Para comprobar core-service sin la web, abre http://localhost:3000/api/health. Debe responder:

```json
{ "status": "ok", "service": "core-service" }
```

**Comandos útiles,** desde la raíz:

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila las dos apps |
| `npm test` | Pruebas unitarias. Por ahora solo core-service tiene pruebas |
| `npm run test:e2e` | Pruebas de `GET /api/health` con el origen de la web, y de `GET /api/health/hasura` sin Hasura configurado |
| `npm run lint` | Revisión de estilo con oxlint en las dos apps |

**Notas:**
- **core-service** lee `apps/core-service/.env` si existe. Sin ese archivo arranca igual, pero no se conecta con Hasura. Siempre usa el puerto 3000.
- **web-app** lee `VITE_API_URL` de `apps/web-app/.env`.
- **Archivos `.env`.** No se suben al repositorio; solo se suben los `.env.example`.
- **CORS.** core-service solo acepta peticiones del navegador desde http://localhost:5173, así que la web se abre con `localhost` y no con `127.0.0.1`.
- **Puerto de Vite.** Usa `strictPort`: si el 5173 está ocupado, se detiene en lugar de pasar a otro puerto.

### Solución de problemas

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| La terminal no encuentra `npm` o `node` | Node no está instalado o la terminal no se actualizó | Comprueba con `node --version` y `npm --version`, y reinicia la terminal |
| `npm run dev:api` o `npm run build` fallan con `ERR_REQUIRE_CYCLE_MODULE` | Se está usando una versión anterior de Node, como la 22.13 | Cambia a Node 24 (`fnm use`) y vuelve a ejecutar el comando |
| La web muestra «Falta configurar VITE_API_URL…» | No existe `apps/web-app/.env` | Copia `.env.example` como `.env` y reinicia `npm run dev:web` |
| 404 en `/api/health` | Falta el prefijo `api` o el módulo de salud no está registrado | Revisa `apps/core-service/src/configure-app.ts` y `AppModule` |
| La API responde, pero la web dice «No se pudo conectar…» | CORS o `VITE_API_URL` | Revisa que `.env` diga `http://localhost:3000/api` y abre la web en http://localhost:5173 |
| Puerto ocupado (`EADDRINUSE` o «Port 5173 is already in use») | Otra instancia sigue abierta | Ciérrala, o búscala con `lsof -i :3000` o `lsof -i :5173` y termina ese proceso |
| `/api/health/hasura` responde 503 «Hasura no está configurado…» | Falta `apps/core-service/.env` o una de sus dos variables | Crea el `.env` desde `.env.example`, completa las variables y reinicia `npm run dev:api` |
| 503 «Hasura rechazó la consulta (código: access-denied).» | El secreto de administración no es el correcto | Cópialo otra vez desde la pestaña General del proyecto y reinicia core-service |
| 503 «Hasura no respondió en 5000 ms.» | Hasura o la base tardaron más que el tiempo límite | Vuelve a intentarlo. Si se repite, revisa el proyecto en Hasura Cloud o aumenta `HASURA_TIMEOUT_MS` |
| 503 «No se pudo conectar con Hasura…» | Sin internet, o `HASURA_GRAPHQL_URL` está mal escrita | Revisa la conexión y la dirección, que debe terminar en `/v1/graphql` |
| core-service no arranca: «HASURA_GRAPHQL_URL no es una dirección válida…» o «HASURA_TIMEOUT_MS debe ser un número entero…» | Un valor mal escrito en `apps/core-service/.env` | Corrige el valor que indica el mensaje |

## Conectar core-service con Hasura

core-service consulta la base de datos de Neon a través de Hasura Cloud, con el secreto de administración. La web-app nunca habla con Hasura ni conoce ese secreto: solo habla con core-service.

1. Crea el archivo de entorno de core-service: `cp apps/core-service/.env.example apps/core-service/.env`.
2. En [Hasura Cloud](https://cloud.hasura.io/projects), entra al proyecto. En la pestaña **General** copia **GraphQL API** en `HASURA_GRAPHQL_URL` y **Admin Secret** en `HASURA_ADMIN_SECRET`. Si el secreto tiene espacios o `#`, escríbelo entre comillas dobles.
3. Arranca core-service: `npm run dev:api`.
4. Abre http://localhost:3000/api/health/hasura. Debe responder con la cantidad de vehículos que hay en la base, por ejemplo:

```json
{ "status": "ok", "service": "hasura", "vehiculos": 1 }
```

Si algo falla, responde 503 con un mensaje que dice la causa (ver «Solución de problemas»). La consulta es fija: solo cuenta vehículos y no acepta consultas desde el navegador.

**Dónde se cambia la dirección de Hasura:** en `HASURA_GRAPHQL_URL`, dentro de `apps/core-service/.env`. Después de cambiarla, reinicia core-service. En el mismo archivo están el secreto y `HASURA_TIMEOUT_MS`, el tiempo máximo que core-service espera a Hasura (5000 ms si no se indica).

**El secreto da acceso total a la base.** No lo pegues en el código, en una variable `VITE_` ni en un mensaje. El `.env` no se sube al repositorio.

### Reconstruir la base de datos y Hasura en un proyecto nuevo

`infra/hasura/` guarda lo necesario, con la estructura de carpetas de la CLI de Hasura. No hace falta instalar la CLI:

| Archivo | Qué contiene |
|---|---|
| `migrations/default/1794872424463_modelo_inicial/up.sql` | Crea las seis tablas |
| `migrations/default/1794872424463_modelo_inicial/down.sql` | Las borra, con sus datos; solo para bases de prueba |
| `seeds/default/datos_ficticios.sql` | Datos de prueba ficticios: el taxi XYZ789 con un ingreso, un gasto y su SOAT |
| `metadata/metadata.json` | Configuración de Hasura: las tablas que publica y sus relaciones |

Lo único que no está en el repositorio, porque lleva claves, es la cadena de conexión de la base y el secreto de Hasura.

1. **Base de datos.** En Neon, crea una base vacía. En su editor SQL, ejecuta `up.sql` y después `datos_ficticios.sql`. Si prefieres psql, usa `psql "<cadena de conexión>" -v ON_ERROR_STOP=1 --single-transaction -f <archivo>` con cada uno, en ese orden. Carga los datos de prueba solo en una base nueva: la base actual ya tiene su propio caso ficticio.
2. **Proyecto de Hasura.** Crea un proyecto en Hasura Cloud y, en **Env vars**, agrega `PG_DATABASE_URL` con la cadena de conexión de esa base. La metadata usa ese nombre para conectarse.
3. **Metadata.** En la consola del proyecto, entra a Settings → Metadata Actions → Import metadata y elige `infra/hasura/metadata/metadata.json`. Revisa en Settings → Metadata Status que no haya inconsistencias.
4. **Comprobación.** Pon en `apps/core-service/.env` la dirección GraphQL y el secreto del proyecto nuevo, reinicia core-service y abre http://localhost:3000/api/health/hasura.

## Abrir el prototipo en macOS

El prototipo se prueba con Node 22, la misma versión de su flujo de GitHub Pages. Desde la carpeta raíz del repositorio ejecuta:

```bash
cd prototipo-web-sesion-3
npm ci
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir en el navegador.

## Publicar una nueva versión del prototipo

La publicación no se ejecuta automáticamente al subir cambios. En GitHub, abre **Actions**, selecciona **Publicar prototipo de sesión 3** y ejecútalo manualmente. El flujo publica el prototipo en GitHub Pages.

## Referencias técnicas

Por indicación del instructor en la sesión 6, la base del monorepo usa:
- React con TypeScript, Vite y Material UI en `apps/web-app`.
- NestJS en `apps/core-service`.
- npm workspaces.

El monorepo se ejecuta con Node 24 LTS.

El modelo de datos ya está cargado en PostgreSQL en Neon y Hasura Cloud lo expone. Pero core-service todavía no se conecta a ellos, así que no forman parte de la arquitectura implementada.

El prototipo de la sesión 3 sigue hecho con React y Vite en JavaScript. Sirve para revisar pantallas y no es el código del producto.

El [diseño previo en Figma](https://www.figma.com/design/pyVd1exSYW5O5B2Qt2cy2V) se conserva como referencia visual de la evidencia; no se actualizó al preparar el prototipo HTML.
