# Guía de desarrollo de VehicleControlApp Web

Cómo ejecutar y probar el proyecto en mi equipo. El [README](../README.md) tiene lo esencial para empezar; aquí está el detalle. Las rutas y los contratos de core-service están en la [API de core-service](api-core-service.md).

## Ejecutar el monorepo

**Requisitos:** Node.js 24 LTS, desde la 24.15, y npm 12. Node 24 trae npm 11; para pasar a npm 12, ejecuta `npm install -g npm@12` con Node 24. Con npm 11 el proyecto también se instala igual.
- **fnm.** El archivo `.node-version` indica la 24. Si usas fnm, `fnm use` toma esa versión en esta carpeta, y `fnm install` la instala la primera vez.
- **Prototipo.** El prototipo de la sesión 3 y su flujo de GitHub Pages siguen con Node 22 y su propio `package-lock.json`.

1. Instala las dependencias desde la raíz: `npm install`. Para una instalación limpia, igual al lockfile, usa `npm ci`.
2. Crea el archivo de entorno de la web: `cp apps/web-app/.env.example apps/web-app/.env`.
3. En una terminal, arranca core-service: `npm run dev:api`. Queda en http://localhost:3000/api.
4. En otra terminal, arranca la web: `npm run dev:web`. Queda en http://localhost:5173.
5. Abre http://localhost:5173. Sin sesión, la web muestra la página de ingreso. Para entrar necesitas una cuenta de prueba con contraseña (ver «Ingresar con las cuentas de prueba»). Con la sesión abierta, la web muestra «Mis vehículos», con los vehículos de esa cuenta.

Para comprobar core-service sin la web, abre http://localhost:3000/api/health. Debe responder:

```json
{ "status": "ok", "service": "core-service" }
```

**Comandos útiles,** desde la raíz:

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila las dos apps |
| `npm test` | Pruebas unitarias de core-service: acceso, vehículos e ingresos |
| `npm run test:e2e` | Pruebas de core-service con un Hasura simulado: salud, ingreso, renovación, cierre, vehículos e ingresos con sus reglas |
| `npm run lint` | Revisión de estilo con oxlint en las dos apps |

**Notas:**
- **core-service** lee `apps/core-service/.env` si existe. Sin ese archivo arranca igual, pero no se conecta con Hasura ni permite ingresar. Siempre usa el puerto 3000.
- **web-app** lee `VITE_API_URL` de `apps/web-app/.env`.
- **Archivos `.env`.** No se suben al repositorio; solo se suben los `.env.example`.
- **CORS.** core-service solo acepta peticiones del navegador desde http://localhost:5173, así que la web se abre con `localhost` y no con `127.0.0.1`.
- **Puerto de Vite.** Usa `strictPort`: si el 5173 está ocupado, se detiene en lugar de pasar a otro puerto.

### Solución de problemas

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| La terminal no encuentra `npm` o `node` | Node no está instalado o la terminal no se actualizó | Comprueba con `node --version` y `npm --version`, y reinicia la terminal |
| `npm run dev:api` o `npm run build` fallan con `ERR_REQUIRE_CYCLE_MODULE` | Se está usando una versión anterior de Node, como la 22.13 | Cambia a Node 24 (`fnm use`) y vuelve a ejecutar el comando |
| `npm error Unknown cli flags` al agregar opciones, como en `npm run dev:web -- --port 5199` | Las opciones llegan al `npm run` interno del script de la raíz, no a Vite ni a NestJS. npm 12 ya no acepta opciones que no conoce | Pásalas directamente al workspace: `npm run dev --workspace apps/web-app -- --port 5199` |
| La web muestra «Falta configurar VITE_API_URL…» | No existe `apps/web-app/.env` | Copia `.env.example` como `.env` y reinicia `npm run dev:web` |
| 404 en `/api/health` | Falta el prefijo `api` o el módulo de salud no está registrado | Revisa `apps/core-service/src/configure-app.ts` y `AppModule` |
| La API responde, pero la web dice «No se pudo conectar…» | CORS o `VITE_API_URL` | Revisa que `.env` diga `http://localhost:3000/api` y abre la web en http://localhost:5173 |
| Puerto ocupado (`EADDRINUSE` o «Port 5173 is already in use») | Otra instancia sigue abierta | Ciérrala, o búscala con `lsof -i :3000` o `lsof -i :5173` y termina ese proceso |
| core-service no arranca: «HASURA_GRAPHQL_URL no es una dirección válida…» o «HASURA_TIMEOUT_MS debe ser un número entero…» | Un valor mal escrito en `apps/core-service/.env` | Corrige el valor que indica el mensaje |
| Al ingresar: «El ingreso no está configurado: falta JWT_SECRET en apps/core-service/.env.» | Falta `JWT_SECRET` en `apps/core-service/.env` | Agrégala como indica «Ingresar con las cuentas de prueba» y reinicia core-service |
| core-service no arranca: «JWT_SECRET debe tener al menos 32 caracteres…» | La clave es demasiado corta | Créala otra vez con `openssl rand -base64 32` y reinicia core-service |
| «Hiciste demasiados intentos. Espera un minuto y vuelve a intentarlo.» | Hubo 5 intentos de ingreso en un minuto desde el mismo equipo. Cuentan también los ingresos correctos | Espera un minuto. El contador vive en la memoria de core-service, así que reiniciarlo también lo borra |
| «El correo o la contraseña no coinciden.» con la contraseña correcta | La cuenta no tiene su hash, tiene el de otra cuenta, está desactivada o el correo es otro | En Neon, revisa `select correo, activo, contrasena_hash like '$argon2id$%' as contrasena_lista from usuarios;`. Si hace falta, crea otra vez el hash y guárdalo con el `update` |
| La página de ingreso, la flota o un vehículo dicen «No pudimos consultar tus datos en este momento…» | core-service no pudo consultar Hasura. Con sesión, lo consulta en cada petición, también para comprobar que la cuenta siga activa | En la terminal de core-service, la línea «Falló una consulta a Hasura:» dice el tipo de falla. `NOT_CONFIGURED`: falta `apps/core-service/.env` o una de sus variables de Hasura; créalo desde `.env.example` y reinicia. `GRAPHQL (access-denied)`: el secreto no es el correcto; cópialo otra vez desde la pestaña General del proyecto. `GRAPHQL` con otro código: Hasura rechazó la consulta, por ejemplo porque la tabla `sesiones` no está registrada. `TIMEOUT`: Hasura tardó más que `HASURA_TIMEOUT_MS`; vuelve a intentarlo y, si se repite, revisa el proyecto en Hasura Cloud o aumenta ese valor. `UNAVAILABLE`: sin internet o con `HASURA_GRAPHQL_URL` mal escrita, que debe terminar en `/v1/graphql` |
| La flota o un vehículo dicen «No se pudo conectar con core-service…» con un botón «Reintentar» | core-service se detuvo después de abrir la página | Arranca core-service (`npm run dev:api`) y pulsa «Reintentar» |
| Al abrir la web: «No pudimos comprobar tu sesión. Revisa la conexión y vuelve a intentarlo.» | core-service está detenido, tardó más de 15 segundos o no pudo consultar Hasura. La sesión puede seguir vigente, por eso la web no pide la contraseña | Arranca core-service (`npm run dev:api`) o revisa su terminal, y pulsa «Reintentar» |
| «core-service no respondió a tiempo. Vuelve a intentarlo.» | core-service tardó más de 15 segundos en responder | Vuelve a intentarlo. Si se repite, revisa la terminal de core-service: Hasura puede estar tardando |
| Al cerrar sesión: «No pudimos cerrar tu sesión. Revisa la conexión y vuelve a intentarlo.» | core-service no respondió. La sesión sigue abierta: si recargas, continúa | Arranca core-service y pulsa otra vez «Cerrar sesión» |
| Al recargar, la web vuelve a pedir la contraseña | El navegador no guardó o no envía la cookie de renovación. Chrome, Edge y Safari la aceptan en http://localhost | Abre la web en http://localhost:5173. En las herramientas para desarrolladores, Application → Cookies debe mostrar `sesion_renovacion` |
| La web vuelve a la página de ingreso con «Tu sesión terminó. Vuelve a ingresar.» | Pasaron 7 días sin uso o 30 desde el ingreso, cerraste la sesión en otra pestaña, o core-service recibió dos veces la misma renovación | Vuelve a ingresar |
| Al recargar dos veces seguidas, la web vuelve a pedir la contraseña | Es un límite conocido. La primera recarga interrumpe la renovación: core-service ya cambió la cookie, pero el navegador no la recibe. Con la segunda recarga llega la cookie anterior, y core-service cierra ese ingreso y escribe en su terminal «Llegó un token de renovación ya usado o cerrado…» | Vuelve a ingresar. Lo resolveré después de presentar el trabajo final en el SENA, con un margen de gracia en core-service (apartado 6 de la [evidencia de sesión 9](evidencia-sesion-9-acceso.md)) |

## Conectar core-service con Hasura

core-service consulta la base de datos de Neon a través de Hasura Cloud, con el secreto de administración. La web-app nunca habla con Hasura ni conoce ese secreto: solo habla con core-service.

1. Crea el archivo de entorno de core-service: `cp apps/core-service/.env.example apps/core-service/.env`.
2. En [Hasura Cloud](https://cloud.hasura.io/projects), entra al proyecto. En la pestaña **General** copia **GraphQL API** en `HASURA_GRAPHQL_URL` y **Admin Secret** en `HASURA_ADMIN_SECRET`. Si el secreto tiene espacios o `#`, escríbelo entre comillas dobles.
3. Arranca core-service: `npm run dev:api`.
4. Comprueba la conexión ingresando en la web, como explica «Ingresar con las cuentas de prueba»: el ingreso busca la cuenta en la base a través de Hasura. Si algo falla, la página de ingreso dice «No pudimos consultar tus datos en este momento…», y la terminal de core-service muestra el tipo de falla (ver «Solución de problemas»).

Si la conexión funciona, después de ingresar verás tu flota en «Mis vehículos». Si Hasura falla, core-service responde 503 `SERVICIO_NO_DISPONIBLE`, y la causa queda en su terminal (ver «Solución de problemas»). La respuesta completa está en la [API de core-service](api-core-service.md).

**Dónde se cambia la dirección de Hasura:** en `HASURA_GRAPHQL_URL`, dentro de `apps/core-service/.env`. Después de cambiarla, reinicia core-service. En el mismo archivo están el secreto y `HASURA_TIMEOUT_MS`, el tiempo máximo que core-service espera a Hasura (5000 ms si no se indica).

**El secreto da acceso total a la base.** No lo pegues en el código, en una variable `VITE_` ni en un mensaje. El `.env` no se sube al repositorio.

### Reconstruir la base de datos y Hasura en un proyecto nuevo

`infra/hasura/` guarda lo necesario, con la estructura de carpetas de la CLI de Hasura. No hace falta instalar la CLI:

| Archivo | Qué contiene |
|---|---|
| `migrations/default/1794872424463_modelo_inicial/up.sql` | Crea las seis tablas |
| `migrations/default/1794872424463_modelo_inicial/down.sql` | Las borra, con sus datos; solo para bases de prueba |
| `migrations/default/1795392786279_sesiones/up.sql` y `down.sql` | Crea la tabla `sesiones`, donde core-service guarda las renovaciones de cada ingreso, y la borra |
| `seeds/default/datos_ficticios.sql` | Datos de prueba ficticios: el taxi XYZ789 con un ingreso, un gasto y su SOAT |
| `seeds/default/segunda_cuenta_prueba.sql` | Una segunda cuenta ficticia con el particular KLM456, para comprobar que una cuenta no ve los datos de otra |
| `metadata/metadata.json` | Configuración de Hasura: las tablas que publica y sus relaciones |

Lo único que no está en el repositorio, porque lleva claves, es la cadena de conexión de la base y el secreto de Hasura.

1. **Base de datos.** En Neon, crea una base vacía. En su editor SQL, elige arriba esa base y ejecuta los dos `up.sql`, en el orden de sus carpetas, y después `datos_ficticios.sql` y `segunda_cuenta_prueba.sql`. Si prefieres psql, usa `psql "<cadena de conexión>" -v ON_ERROR_STOP=1 --single-transaction -f <archivo>` con cada uno, en ese orden. Carga los datos de prueba solo en una base nueva: la base actual ya tiene su propio caso ficticio.
2. **Proyecto de Hasura.** Crea un proyecto en Hasura Cloud y, en **Env vars**, agrega `PG_DATABASE_URL` con la cadena de conexión de esa base. La cadena se copia con el botón **Connect** de Neon, eligiendo esa base. El nombre no está entre las sugerencias de Hasura: escríbelo a mano en **Key** y elige crearlo. La metadata usa ese nombre para conectarse.
3. **Metadata.** En la consola del proyecto, entra a Settings → Metadata Actions → Import metadata y elige `infra/hasura/metadata/metadata.json`. Revisa en Settings → Metadata Status que no haya inconsistencias.
4. **Comprobación.** En `apps/core-service/.env`, pon `#` al comienzo de las dos líneas de Hasura para conservarlas, y agrega debajo la dirección GraphQL y el secreto del proyecto nuevo. Reinicia core-service y, en la web, intenta ingresar con `titular.prueba@example.com` y una contraseña cualquiera. Si aparece «El correo o la contraseña no coinciden.», core-service consultó la base nueva: las cuentas de los datos de prueba no tienen contraseña hasta que guardes su hash. Al terminar, borra las líneas nuevas, quita los `#` y reinicia core-service.

Estos pasos los seguí el 20 de noviembre de 2026 en una base y un proyecto nuevos, y funcionaron; entonces la comprobación era abrir `GET /api/health/hasura`, que todavía no exigía sesión y se retiró en la sesión 10. El detalle está en la [evidencia de sesión 7](evidencia-sesion-7-conexion-hasura.md). La migración de `sesiones` y la segunda cuenta se probaron en un PostgreSQL temporal ([evidencia de sesión 9](evidencia-sesion-9-acceso.md)); la metadata con `sesiones` todavía no se ha importado en un proyecto nuevo.

## Ingresar con las cuentas de prueba

La web-app pide correo y contraseña. core-service busca la cuenta en la base a través de Hasura, revisa la contraseña y abre la sesión. No hay registro propio: las cuentas de prueba se crean con SQL, y su contraseña, con un script. Las contraseñas no se guardan en el repositorio; la base solo guarda su hash (una huella de la contraseña que no permite recuperarla).

**Antes de empezar:** core-service debe estar conectado con Hasura (ver «Conectar core-service con Hasura»), y la base debe tener la tabla `sesiones`, de la migración `1795392786279_sesiones`, registrada en Hasura. La metadata del repositorio ya la incluye.

1. **Contraseña de cada cuenta.** Ejecuta `npm run contrasena --workspace apps/core-service`. Pide la contraseña dos veces sin mostrarla, exige al menos 12 caracteres e imprime solo el hash, que empieza con `$argon2id$`. Guarda la contraseña en tu gestor de contraseñas: el hash no sirve para entrar.
2. **Hash en la base.** En el SQL Editor de Neon, consulta los correos con `select id, nombre, correo, activo from usuarios;` y guarda el hash de cada cuenta:

   ```sql
   update usuarios set contrasena_hash = '<hash>' where correo = '<correo de la cuenta>';
   ```

   La segunda cuenta ficticia, `segunda.prueba@example.com`, se crea con `infra/hasura/seeds/default/segunda_cuenta_prueba.sql`.
3. **Clave para firmar las sesiones.** Agrega `JWT_SECRET` a `apps/core-service/.env` sin verla en pantalla:

   ```sh
   printf '\nJWT_SECRET=%s\n' "$(openssl rand -base64 32)" >> apps/core-service/.env
   ```

   Debe tener al menos 32 caracteres. Si algún día la cambias, la web-app renueva la sesión sola y no hace falta volver a ingresar.
4. **Ingresar.** Reinicia core-service (`npm run dev:api`), arranca la web (`npm run dev:web`) y abre http://localhost:5173. Ingresa con el correo y la contraseña de una cuenta: verás «Hola», su nombre y la página «Mis vehículos», con los vehículos de esa cuenta.

Cómo se comporta la sesión, qué permite cada ruta y qué errores responde core-service está en la [API de core-service](api-core-service.md).

## Vehículos en la web

Desde la sesión 10, la titular maneja sus vehículos en la web-app, y core-service los guarda en la base a través de Hasura. Las pantallas siguen la [evidencia de sesión 3](evidencia-sesion-3-diseno-pantallas.md) (08 a 12, 27 y 28), por ahora sin los próximos vencimientos ni el registro de ingresos, gastos y documentos.

| Dirección | Qué muestra |
|---|---|
| `/vehiculos` | «Mis vehículos»: el saludo, los conteos de vehículos activos, una tarjeta por vehículo y «Agregar vehículo». Es el inicio: `/` y cualquier dirección desconocida llevan aquí |
| `/vehiculos/nuevo` | El formulario para agregar un taxi o un particular |
| `/vehiculos/:id` | El detalle: sus datos, la cuota en pesos, cuántos registros tiene, «Editar» y «Desactivar» o «Eliminar» |
| `/vehiculos/:id/editar` | El mismo formulario, con los datos guardados |

**Cómo probarlo:**

1. **Sin Neon:** `npm run test:e2e` recorre el CRUD con un Hasura simulado: crear, listar, ver, editar, desactivar y eliminar; campos reservados; la otra cuenta; placa repetida; tipo incoherente; editar con ingresos y eliminar con registros.
2. **En la web, con Neon:** con core-service conectado (ver «Conectar core-service con Hasura»), ingresa y pulsa «Agregar vehículo». Crea un vehículo de prueba, ábrelo, edítalo y recarga la página: los cambios deben seguir. Al terminar, elimínalo desde su detalle para dejar la base como estaba.
3. **Con cuidado en Neon:** no desactives XYZ789 ni otro vehículo con registros que quieras conservar activo: por ahora no se puede volver a activar.

## Guía visual (solo en desarrollo)

La web-app toma su aspecto de la app Android: colores, letra Roboto, tarjetas, etiquetas y modo claro u oscuro. La guía visual reúne esos componentes en una página, para revisarlos y mejorarlos antes de construir las pantallas.

1. Arranca la web: `npm run dev:web`. La guía no necesita core-service.
2. Abre http://localhost:5173/guia-visual.html.
3. Para ver el otro modo, usa el botón del sol o la luna en el encabezado.

- **Qué muestra:**
  - los colores con su contraste y la tipografía;
  - botones, etiquetas, una tarjeta con título y el estado vacío;
  - mensajes, campos de formulario y una tarjeta de vehículo de ejemplo.
- **Datos ficticios.** El taxi XYZ789 es el de los datos de prueba de `infra/hasura`. La guía no es una pantalla de la aplicación.
- **Solo en desarrollo.** `npm run build` compila solo `index.html`, así que la guía no queda en `apps/web-app/dist`.
- **Dónde está el código:**
  - el tema, en `apps/web-app/src/theme/`;
  - los componentes, en `src/components/`;
  - la guía, en `guia-visual.html` y `src/guia/`.

## Prototipo de la sesión 3

El prototipo responsive de la sesión 3 sirve para revisar los recorridos. Representa las pantallas de acceso, creación de cuenta y recuperación de contraseña, pero sus acciones son simuladas. **El prototipo no es una aplicación lista para producción.** No implementa autenticación real, servidor ni almacenamiento persistente: usa datos de demostración y los cambios se pierden al recargar la página. Los archivos seleccionados solo se muestran durante la sesión del navegador. Katerin probó el prototipo el 20 de octubre de 2026 y revisó la identidad visual; sus observaciones y los ajustes acordados están en la [evidencia de sesión 3](evidencia-sesion-3-diseno-pantallas.md).

### Abrir el prototipo en macOS

El prototipo se prueba con Node 22, la misma versión de su flujo de GitHub Pages. Desde la carpeta raíz del repositorio ejecuta:

```bash
cd prototipo-web-sesion-3
npm ci
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir en el navegador.

### Publicar una nueva versión del prototipo

La publicación no se ejecuta automáticamente al subir cambios. En GitHub, abre **Actions**, selecciona **Publicar prototipo de sesión 3** y ejecútalo manualmente. El flujo publica el prototipo en [GitHub Pages](https://tecno85.github.io/vehicle-control-app-web/), donde se puede recorrer en escritorio y en el celular.

## Versiones y referencias

El monorepo se ejecuta con Node 24 LTS. Lo comprobé con Node 24.22.2, npm 12.2.3 y NestJS 12.4.0. Hasta el 19 de noviembre de 2026 usé npm 11.19.1. El 19 de noviembre de 2026, Hasura Cloud estaba en la versión v2.51.8-cloud.2 y Neon usaba PostgreSQL 18.7. Esos dos servicios actualizan sus versiones por su cuenta.

El modelo de datos está cargado en PostgreSQL en Neon, y Hasura Cloud lo expone. core-service se conecta a Hasura con su cliente interno: desde la sesión 9, para el ingreso y la sesión, y desde la sesión 10, para leer y guardar vehículos. Ingresos, gastos, documentos y categorías todavía no tienen servicios. La validación de los datos que llegan a core-service usa class-validator y class-transformer, y `@nestjs/mapped-types` para que editar reutilice las reglas de crear.

El prototipo de la sesión 3 sigue hecho con React y Vite en JavaScript. Sirve para revisar pantallas y no es el código del producto.

El [diseño previo en Figma](https://www.figma.com/design/pyVd1exSYW5O5B2Qt2cy2V) se conserva como referencia visual de la evidencia; no se actualizó al preparar el prototipo HTML.
