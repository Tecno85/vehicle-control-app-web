# Evidencia de sesión 7: conexión de core-service con Hasura

| Proyecto | Integrantes y versión |
|---|---|
| VehicleControlApp Web · DazaDev | Ivan Dario Madrid Daza, trabajo individual. Versión 0.4 del 20 de noviembre de 2026. Entrega: por definir. |

**Por qué hay una sesión 7.** El 12 de noviembre de 2026 no hubo encuentro con el instructor. Ese día, por WhatsApp, indicó seguir avanzando con el desarrollo del proyecto, y no pidió entregar la evidencia de sesión 6. Por eso el 15 de noviembre decidí continuar con el siguiente paso de su «Cartilla de acompañamiento técnico»: completar la semana 5, «Monorepo, Neon, Hasura y cliente interno». La sesión 6 dejó el monorepo; aquí conecto core-service con Hasura. Si en el próximo encuentro el instructor pide otro tema, ajusto esta evidencia antes de entregarla.

## 1. Cumplimiento de la semana 5 de la cartilla

| Punto pedido | Dónde se ve | Resultado comprobado |
|---|---|---|
| Versiones de las herramientas registradas | Apartado 3 | Node, npm y NestJS, desde la sesión 6. Hasura Cloud y PostgreSQL en Neon, leídas en sus consolas el 19 de noviembre |
| Migraciones SQL, metadata y datos de prueba en el repositorio | `infra/hasura/` (prompt 1) | Creados y probados en un PostgreSQL 15 temporal: la migración se aplica, se deshace y se vuelve a aplicar, y la metadata no tiene claves |
| Cliente interno de Hasura en core-service, con tiempo límite y errores de GraphQL | `apps/core-service/src/hasura/` (prompt 2) y pruebas automáticas del apartado 5 | Creado. Pasan sus 13 pruebas unitarias, y en la prueba real consultó Hasura Cloud |
| Consulta interna de prueba sobre datos ficticios | `GET /api/health/hasura` (prompt 3) | Con Hasura Cloud respondió 200 con `vehiculos: 1`. En cada falla probada responde 503 con la causa |
| Cliente HTTP de la web-app hacia core-service | `apps/web-app/src/api/api-client.ts` (prompt 3) | Creado. El panel mostró las tres fases de la sesión 6 con los mismos mensajes |
| README para configurar y reproducir el entorno | README, apartado «Conectar core-service con Hasura» (prompt 3) | Escrito. Seguí sus pasos de conexión en la prueba real, y los de reconstrucción en un proyecto nuevo |
| Se ejecuta desde un clon limpio | Apartado 5 | Sí: sin `.env`, se instala, compila y pasan las pruebas y el lint |
| El esquema y la configuración se pueden reconstruir | Apartado 4 | Sí: se reconstruyó todo en una base de Neon y un proyecto de Hasura Cloud nuevos, solo con `infra/hasura/` y el README (apartado 5) |
| No hay secretos en Git ni en el código que llega al navegador | Apartado 5 | Sin claves en los archivos del commit ni en el código compilado de la web. El `.env` queda fuera de Git |

**Alcance.** Es una conexión técnica: no incluye el acceso con correo y contraseña, los servicios S01 a S12 ni las pantallas del MVP de Katerin. Tampoco cambia nada en la base de Neon ni en el proyecto de Hasura Cloud que ya existen; de ellos solo exporto la configuración.

**Dos diferencias con la cartilla:**
- **Sin la CLI de Hasura.** La cartilla la menciona en sus referencias para manejar migraciones y metadata. Decidí no instalarla por ahora: los archivos siguen la misma estructura de carpetas y se aplican con psql o desde la consola de Hasura. Si el instructor la pide, se puede adoptar sin rehacer las migraciones ni los datos de prueba.
- **Endpoint de prueba sin protección por sesión.** La cartilla dice que un endpoint de prueba protegido «puede» verificar una consulta interna. El mío todavía no exige sesión, porque el acceso llega en la semana 6; por eso solo devuelve un conteo de vehículos ficticios y no acepta consultas del navegador.

**Autoría.** Escribo en primera persona lo que decidí, aprobé o pedí hacer. Claude Code redactó y ejecutó los prompts y las comprobaciones, y redactó esta evidencia según lo que le pedí.

## 2. Registro de trabajo real

| Fecha real | Trabajo realizado | Comprobación o resultado | Archivos |
|---|---|---|---|
| 15 nov 2026 | Revisé con Claude Code qué sigue en la cartilla y aprobé el plan de esta sesión, después de comprobar que cubre lo que pide la semana 5. Registré en el README, el contexto y AGENTS.md que el 12 de noviembre no hubo encuentro y que el instructor indicó por WhatsApp seguir avanzando. Revisé los tres prompts y los aprobé sin cambios, y pedí detallar en el apartado 5 las pruebas automáticas previstas | Commit `8d13845`. Plan copiado en `Asesor_Técnico` | README, contexto, AGENTS.md y esta evidencia |
| 16 nov 2026 | Exporté la metadata desde la consola de Hasura Cloud. Aprobé el texto de los prompts 1, 2 y 3 sin pegarlos y pedí ejecutarlos. Creé `apps/core-service/.env` con la dirección y el secreto de Hasura | Metadata revisada sin mostrar su contenido: usa `from_env` y no tiene claves. Migración y datos de prueba comprobados en un PostgreSQL 15 temporal. Cliente de Hasura con 13 pruebas unitarias nuevas. Endpoint de prueba, cliente HTTP de la web y README, comprobados con un Hasura falso (apartado 6) | `infra/hasura/`, `apps/` y README |
| 17 nov 2026 | Arranqué core-service con mi `.env` para la prueba real, también con un secreto incorrecto, y revisé el panel en el navegador | Hasura Cloud respondió el conteo de vehículos, y con el secreto incorrecto, `access-denied`. Commit `1f17490`. Pasa el clon limpio (apartado 5) | Esta evidencia, README, contexto y AGENTS.md |
| 19 nov 2026 | Subí a GitHub los commits de la sesión. Leí la versión de Hasura Cloud abriendo la dirección de mi proyecto terminada en `/v1/version`, y la de PostgreSQL con `select version();` en el SQL Editor de Neon | Hasura Cloud v2.51.8-cloud.2 y PostgreSQL 18.7 (apartado 3) | Esta evidencia, README y contexto |
| 20 nov 2026 | Reconstruí la base de datos y Hasura en un proyecto nuevo siguiendo el README, guiado por Claude Code. Al terminar, borré el proyecto y la base de prueba y restauré mi `.env` | La base, la metadata y la conexión de core-service funcionaron. Al borrar el proyecto, core-service falló, así que lo estaba usando (apartado 5) | Esta evidencia, README y contexto |
| 20 nov 2026 | Le pedí a Claude Code analizar npm 12 y hacer el cambio sin afectar el trabajo | Pasaron todas las comprobaciones en copias limpias. npm 12.2.3 quedó instalado en Node 24, y `package.json` registra que `fsevents` no necesita su script de instalación (apartado 5) | `package.json`, esta evidencia, README, contexto y AGENTS.md |

## 3. Cómo se conecta core-service con Hasura

El camino de cada consulta es el que orientó el instructor:

```text
React (web-app) → NestJS (core-service) → Hasura (GraphQL) → Neon (PostgreSQL)
```

- **Hasura** publica las tablas de Neon como una API GraphQL, un lenguaje para pedir exactamente los datos que se necesitan.
- **El secreto de administración** es la clave que permite a core-service consultar Hasura sin restricciones. Por eso solo vive en `apps/core-service/.env`, que no se sube al repositorio, y nunca llega al navegador.
- **core-service** envía siempre consultas fijas, escritas en su código. El navegador no puede mandarle consultas propias.

**¿Dónde se cambia la URL de Hasura?** En `apps/core-service/.env`, en la variable `HASURA_GRAPHQL_URL`. La plantilla es `apps/core-service/.env.example`. core-service la lee al arrancar, en `src/hasura/hasura.config.ts`, así que después de cambiarla hay que reiniciarlo. En el mismo archivo van el secreto (`HASURA_ADMIN_SECRET`) y el tiempo límite (`HASURA_TIMEOUT_MS`). La web-app no cambia, porque nunca habla con Hasura.

El **tiempo límite** es lo máximo que core-service espera una respuesta de Hasura. Si se cumple, deja de esperar y avisa, en vez de quedarse colgado.

**Versiones.** Las registro para que el entorno se pueda reproducir con las mismas herramientas:

| Herramienta | Versión | Cómo la leí |
|---|---|---|
| Node.js | 24.22.2 | `node --version` |
| npm | 12.2.3, desde el 20 de noviembre de 2026. Antes, 11.19.1 | `npm --version` |
| NestJS | 12.4.0 | `npm ls @nestjs/core` |
| Hasura Cloud | v2.51.8-cloud.2 | La dirección de mi proyecto terminada en `/v1/version`, que no pide el secreto. La leí el 19 de noviembre de 2026 |
| PostgreSQL en Neon | 18.7 | `select version();` en el SQL Editor de Neon, el 19 de noviembre de 2026 |

Hasura Cloud y Neon actualizan sus servidores por su cuenta, así que esas dos versiones pueden cambiar con el tiempo. Por eso anoto la fecha en que las leí.

## 4. Reconstruir la base de datos

Una **migración** es un archivo SQL que crea o cambia tablas, con otro que deshace el cambio. La **metadata** es la configuración de Hasura: qué tablas publica y cómo se relacionan. Los **datos de prueba** son filas ficticias para probar sin datos reales.

Todo está en `infra/hasura/`, con la estructura de carpetas que usa la CLI de Hasura:

```text
infra/hasura/
├── metadata/metadata.json                     # Configuración de Hasura, exportada de la consola
├── migrations/default/1794872424463_modelo_inicial/
│   ├── up.sql                                 # Crea las seis tablas
│   └── down.sql                               # Las borra, en orden inverso
└── seeds/default/datos_ficticios.sql          # Caso ficticio del taxi XYZ789
```

`default` es el nombre de la conexión a la base en Hasura.

**¿Qué falta para reproducir la base de datos?** Solo dos cosas que no van en el repositorio, porque llevan claves:
- una base PostgreSQL vacía, con su cadena de conexión;
- un proyecto de Hasura con la variable `PG_DATABASE_URL` apuntando a esa base.

El esquema, la configuración de Hasura y los datos de prueba ya están en `infra/hasura/`. El SQL lo comprobé en una base temporal (apartado 6, prompt 1). Los pasos para una base y un proyecto nuevos están en el README, en «Reconstruir la base de datos y Hasura en un proyecto nuevo». El 20 de noviembre los seguí de principio a fin en una base y un proyecto nuevos (apartado 5).

## 5. Pruebas

### Pruebas automáticas

Una **prueba automática** es un pequeño programa que revisa una parte del código y se puede repetir con un comando cada vez que algo cambia. Uso dos tipos:
- **Unitarias** (`npm test`): revisan una pieza sola. Lo que la rodea se reemplaza por una versión simulada; por ejemplo, la respuesta de Hasura.
- **De extremo a extremo, o e2e** (`npm run test:e2e`): arrancan core-service completo y le hacen peticiones HTTP reales, como lo haría la web.

Ninguna de estas pruebas usa Hasura Cloud ni el secreto, así que se pueden ejecutar en cualquier computador. La conexión real la compruebo aparte, en «Otras comprobaciones».

| Prueba | Archivo | Qué comprueba | Prompt | Resultado real |
|---|---|---|---|---|
| Estado de core-service | `health.service.spec.ts` y `health.controller.spec.ts` | `GET /api/health` sigue respondiendo `{ status: 'ok', service: 'core-service' }` | Sesión 6 | Pasan las 2 |
| Respuesta correcta | `hasura.service.spec.ts` | El cliente devuelve los datos que responde Hasura | 2 | Pasa |
| Cabecera del secreto | `hasura.service.spec.ts` | Cada consulta va por POST, con `x-hasura-admin-secret`, la consulta y sus variables | 2 | Pasa |
| Errores de GraphQL | `hasura.service.spec.ts` | Si Hasura responde con `errors`, el cliente avisa con sus códigos, como `permission-error`, y sin el mensaje original | 2 | Pasa |
| HTTP 500 | `hasura.service.spec.ts` | Se informa como servicio no disponible: «Hasura respondió con un error (HTTP 500).» | 2 | Pasa |
| Respuesta que no es GraphQL | `hasura.service.spec.ts` | Una página HTML se informa como servicio no disponible: «Hasura respondió con un formato inesperado.» | 2 | Pasa |
| Falla de red | `hasura.service.spec.ts` | Se informa como servicio no disponible | 2 | Pasa |
| Tiempo agotado | `hasura.service.spec.ts` | Con un tiempo límite de 20 ms y una respuesta que nunca llega, el cliente deja de esperar y avisa: «Hasura no respondió en 20 ms.» | 2 | Pasa |
| Sin configurar | `hasura.service.spec.ts` | Si faltan las variables, avisa sin intentar la consulta | 2 | Pasa |
| Secreto protegido | `hasura.service.spec.ts` | En cuatro fallas que traen el secreto o la dirección en la respuesta, ninguno de los dos aparece en el error | 2 | Pasa |
| Entrega por inyección | `hasura.service.spec.ts` | `HasuraModule` entrega el cliente con las variables del entorno | 2 | Pasa |
| Variables de entorno | `hasura.config.spec.ts` | Sin dirección o sin secreto queda «sin configurar»; el tiempo límite es 5000 ms si no se indica, y un valor mal escrito se rechaza. Son 3 pruebas | 2 | Pasan las 3 |
| Endpoint de prueba | `health.controller.spec.ts` | `GET /api/health/hasura` responde el conteo de vehículos, o 503 con el mensaje del error si el cliente falla. Son 2 pruebas | 3 | Pasan las 2 |
| Consulta fija | `health.service.spec.ts` | El servicio envía siempre la misma consulta, y avisa si Hasura no devuelve un número. Son 2 pruebas | 3 | Pasan las 2 |
| Endpoint e2e sin Hasura | `test/app.e2e-spec.ts` | Sin variables, `/api/health/hasura` responde 503 «no configurado» y `/api/health` sigue respondiendo 200 con CORS | 3 | Pasan las 2 |

En total pasan 19 pruebas unitarias y 2 e2e.

**Límite.** La web-app no tiene pruebas automáticas, igual que en la sesión 6. Su nuevo cliente HTTP lo compruebo en el navegador, con las tres fases del panel. La cartilla deja las pruebas para su semana 10.

### Otras comprobaciones

| Comprobación | Cómo | Resultado real |
|---|---|---|
| Prueba real con Hasura Cloud (17 nov) | Arranqué `npm run dev:api` con mi `.env`; Claude Code consultó `/api/health/hasura` | `{"status":"ok","service":"hasura","vehiculos":1}`, HTTP 200, en 1,0 s la primera vez y en 0,17 s la segunda. El 1 es el taxi XYZ789 |
| Secreto incorrecto en Hasura Cloud | Arranqué con `env HASURA_ADMIN_SECRET=secreto-incorrecto npm run dev:api`. La variable escrita en la terminal tiene prioridad sobre el `.env`, así que el archivo no cambió | HTTP 503 con `{"message":"Hasura rechazó la consulta (código: access-denied).","error":"Service Unavailable","statusCode":503}`, en 0,33 s. Al volver a arrancar normal, de nuevo 200 con `vehiculos: 1` |
| Panel de la web | Revisé en el navegador las tres fases de la sesión 6 | «Conectado: core-service»; con core-service detenido, «No se pudo conectar con core-service. Revisa que esté en marcha y vuelve a intentarlo.»; y de nuevo «Conectado» al arrancarlo |
| Secretos en Git | Antes del commit, búsqueda en todos los archivos que se iban a subir | Ningún `.env` real, ninguna cadena de conexión y ninguna variable de secreto con valor. Las 4 menciones de `hasura.app` son ejemplos de `.env.example` y de las pruebas |
| Secretos en la web | Búsqueda de `hasura` y `admin-secret` en `apps/web-app/dist` | 0 archivos. La web solo conoce `VITE_API_URL`, con la dirección de core-service |
| Clon limpio | `git clone` del commit `1f17490` en una carpeta temporal, sin `.env`; `npm ci`, `npm run build`, `npm test`, `npm run test:e2e` y `npm run lint` | `npm ci` instaló 364 paquetes con 0 vulnerabilidades. Compilación y lint con código 0, 19 de 19 unitarias y 2 de 2 e2e |
| Reconstrucción en un proyecto nuevo (20 nov) | Siguiendo el README, en una base y un proyecto nuevos | Se reconstruyeron la base, los datos de prueba y la metadata, y core-service consultó el proyecto nuevo. Detalle abajo |

### Reconstrucción completa en un proyecto nuevo (20 de noviembre)

Seguí los pasos del README en las consolas de Neon y Hasura Cloud, guiado por Claude Code. Claude Code redactó la consulta de comprobación e hizo con `curl` las consultas a core-service. La cadena de conexión y el secreto los copié directamente de una consola a otra: no pasaron por el chat ni por el repositorio.

| Paso | Qué hice | Resultado |
|---|---|---|
| 1. Base de datos | En Neon creé la base `reconstruccion_prueba`, en la rama production. En el SQL Editor comprobé con `select current_database();` que estaba en ella. Luego ejecuté `up.sql` y después `datos_ficticios.sql` | `up.sql` respondió 10 «CREATE»: las 6 tablas y los 4 índices. Con los datos de prueba quedaron 1 usuario, 5 categorías, 1 vehículo, 1 ingreso, 1 gasto y 1 documento |
| 2. Proyecto de Hasura | Creé un proyecto gratuito en Hasura Cloud, en AWS US East (Ohio), la misma región de Neon. Le agregué `PG_DATABASE_URL` con la cadena de conexión de la base nueva | Se creó. Al principio mostró un aviso de Hasura que desapareció solo (apartado 7) |
| 3. Metadata | Importé `infra/hasura/metadata/metadata.json` con Import metadata | Metadata Status no mostró inconsistencias. En la pestaña API, una consulta devolvió el taxi XYZ789 con su titular, las 5 categorías, el ingreso de 60000, el gasto de 5000 con su categoría y el SOAT. Usó 6 de las 12 relaciones, entre ellas la que está configurada a mano |
| 4. core-service | Puse `#` al comienzo de mis dos líneas del `.env` y agregué debajo la dirección y el secreto del proyecto nuevo | `/api/health/hasura` respondió 200 con `vehiculos: 1`, en 0,95 s la primera vez y en 0,15 s la segunda |
| Contraprueba | Mi proyecto actual también tiene 1 vehículo, así que la respuesta no mostraba de cuál proyecto venía. Por eso borré el proyecto nuevo sin detener core-service | 503 con «Hasura respondió con un error (HTTP 500).». Las respuestas anteriores venían del proyecto nuevo |
| Restauración | Borré las dos líneas nuevas, quité los `#` y reinicié core-service. Después borré en Neon la base `reconstruccion_prueba` | `/api/health/hasura` respondió de nuevo 200 con `vehiculos: 1`, ahora desde mi proyecto actual, en 0,43 s y 0,17 s |

**Resultado.** Con los archivos de `infra/hasura/` y los pasos del README se reconstruyen el esquema, los datos de prueba y la configuración de Hasura. Solo hacen falta dos datos que no están en el repositorio: la cadena de conexión de la base y el secreto del proyecto.

**Aclaraciones al README.** Los pasos funcionaron sin cambios. Les agregué tres aclaraciones que me sirvieron:
- elegir la base nueva en el SQL Editor y al copiar la cadena de conexión;
- escribir a mano el nombre `PG_DATABASE_URL` en Hasura, porque no está entre sus sugerencias;
- conservar con `#` los valores actuales del `.env` mientras dura la prueba.

### Cambio a npm 12 (20 de noviembre)

Al ejecutar las pruebas del prompt 2, npm avisó que había una versión nueva. Mi regla es usar la versión estable recomendada, comprobar que funciona y registrar el cambio. Por eso, el 20 de noviembre le pedí a Claude Code analizar npm 12 y hacer el cambio sin afectar el trabajo. Claude Code leyó las notas de la versión 12.0.0 y probó en copias limpias del repositorio, con npm 12 instalado en una carpeta temporal. Solo después lo instaló en mi computador.

**Lo que se revisó:**
- La versión «latest» de npm era la 12.2.3. La rama 11 sigue recibiendo arreglos.
- npm 12 pide Node 22.22.2, 24.15.0 o superior. El monorepo usa Node 24.22.2. En mi computador, el prototipo de la sesión 3 usa Node 22.13, que npm 12 no admite. Pero el prototipo tiene su propio npm y no se tocó.
- El cambio de npm 12 que podía afectarnos es que bloquea los scripts que algunas dependencias ejecutan al instalarse. Solo deja correr los que permita la lista `allowScripts` de `package.json`. En nuestro proyecto, el único paquete marcado así es `fsevents` 2.3.3, que Vite usa en macOS para vigilar archivos. Ese paquete ya trae su parte compilada y no necesita el script.
- npm 12 también cambia cómo trata las dependencias que vienen de Git y el archivo `npm-shrinkwrap.json`. El proyecto no usa ninguno de los dos.

| Comprobación | Cómo | Resultado real |
|---|---|---|
| Instalación | `npm ci` en dos copias limpias del commit `e9ef159`, una con npm 11.19.1 y otra con npm 12.2.3 | Las dos instalaron 364 paquetes, sin vulnerabilidades, y el `package-lock.json` no cambió. Comparadas paquete por paquete, las dos copias tienen los mismos 361 paquetes con las mismas versiones |
| `fsevents` | `npm install-scripts ls`, y cargar el paquete con Node en las dos copias | npm 12 bloqueó su script, y npm 11 solo avisaba. En las dos copias sus archivos son idénticos y el paquete funciona |
| Decisión sobre `fsevents` | `npm install-scripts deny fsevents`, que agrega a `package.json` la línea `"allowScripts": { "fsevents": false }` | Con npm 12 y con npm 11, `npm ci` termina sin avisos |
| Proyecto con npm 12 | En la copia limpia: `npm run build`, `npm test`, `npm run test:e2e`, `npm run lint`, `npm audit` y `npm install` | Compilación y lint con código 0, 19 de 19 unitarias, 2 de 2 e2e y 0 vulnerabilidades. `npm install` no cambió el lockfile. Los `npm run` internos de los scripts también usaron npm 12.2.3 |
| Web en modo desarrollo | `npm run dev:web` con npm 12 | Vite respondió 200 en http://localhost:5173 |
| Instalación en mi computador | `npm install -g npm@12.2.3`, con Node 24 | Node 24 quedó con npm 12.2.3, y Node 22, el del prototipo, siguió con su npm 10.9.2 |
| Repositorio real | `npm install`, `npm test`, `npm run test:e2e` y `npm run lint` | El lockfile no cambió. Pasaron 19 de 19 unitarias y 2 de 2 e2e, y el lint terminó con código 0. No reinstalé ni compilé aquí porque core-service estaba en marcha; eso quedó comprobado en la copia limpia |

**Observación: opciones de más.** Si se le agregan opciones a un script de la raíz, por ejemplo `npm run dev:web -- --port 5199`, no llegan a Vite ni a NestJS, sino al `npm run` interno. npm 11 las ignoraba con un aviso, y npm 12 se detiene con «Unknown cli flags». Para pasarlas hay que llamar directamente al workspace: `npm run dev --workspace apps/web-app -- --port 5199`. Lo comprobé con npm 12 y lo anoté en «Solución de problemas» del README.

**Cómo volver atrás.** Con Node 24, `npm install -g npm@11.19.1`. La línea de `allowScripts` también funciona con npm 11.

## 6. Registro de prompts

| Rol | Quién o qué herramienta |
|---|---|
| Redacción y ejecución | Claude Code (Claude Opus 5.5) |
| Revisión y envío | Ivan Dario Madrid Daza revisa cada texto del documento y pide ejecutarlo |

### Prompt 1 · Base de datos versionada (16 de noviembre de 2026)

**Antes de enviarlo:** el 16 de noviembre exporté la metadata desde la consola de Hasura Cloud (Settings → Metadata Actions → Export metadata). Claude Code revisó el archivo sin mostrar su contenido y lo copió, sin cambios, como `infra/hasura/metadata/metadata.json`. La conexión a la base usa la variable `PG_DATABASE_URL` (`from_env`), y el archivo no contiene cadenas de conexión ni claves. Registra las seis tablas y sus seis relaciones en ambos sentidos.

Texto exacto enviado:

```text
[Rol] Actúa como desarrollador backend con experiencia en PostgreSQL y Hasura GraphQL Engine. Explícame cada paso en lenguaje sencillo.

[Objetivo] Versiona en infra/hasura/ la base de datos que hoy solo existe en Neon y Hasura Cloud: la migración del esquema inicial, los datos de prueba y la metadata, para que se pueda reconstruir desde el repositorio.

[Contexto]
- VehicleControlApp Web es una Web App responsive para que Katerin controle su flota pequeña: taxis con cuota diaria y particulares en inDrive.
- El 28 de octubre de 2026 ejecuté docs/evidencia-sesion-4/modelo-inicial.sql en Neon y registré en Hasura Cloud, desde la consola, las seis tablas y sus relaciones en ambos sentidos. Nada de eso está en el repositorio.
- La semana 5 de la cartilla del instructor pide migraciones SQL, metadata y datos de prueba versionados, y que el esquema y la configuración se puedan reconstruir.
- No uso la CLI de Hasura: los archivos siguen su estructura de carpetas, pero se aplican con psql o desde la consola.

[Datos o archivos]
- docs/evidencia-sesion-4/modelo-inicial.sql
- El caso ficticio del apartado 4 de docs/evidencia-sesion-4-modelo-datos-servicios.md: titular de prueba; cinco categorías iniciales (Combustible, Lavado, Mantenimiento, Repuestos y Ahorro prima conductor); taxi XYZ789 con cuota de $60.000; ingreso de $60.000 del 1 de octubre de 2026; gasto de $5.000, «Ahorro para la prima del conductor», del mismo día, y «SOAT de ejemplo», que vence el 15 de enero de 2027.
- infra/hasura/metadata/metadata.json, que exporté desde la consola de Hasura Cloud.

[Restricciones]
- Crea infra/hasura/migrations/default/<marca de tiempo en milisegundos>_modelo_inicial/up.sql con el mismo esquema de modelo-inicial.sql, y down.sql, que borre las tablas en orden inverso.
- Crea infra/hasura/seeds/default/datos_ficticios.sql. Relaciona las filas por correo y placa, sin ids fijos. Usa un correo de example.com y, en contrasena_hash, un texto que no sirva como contraseña.
- No cambies docs/evidencia-sesion-4/modelo-inicial.sql.
- No ejecutes nada en Neon ni en Hasura Cloud.
- Revisa metadata.json sin mostrar su contenido. Si trae una cadena de conexión o una clave en lugar de una variable de entorno (from_env), detente y avísame.
- Comprueba los SQL en un PostgreSQL 15 temporal, en una carpeta fuera del repositorio, y bórralo al terminar.
- No hagas commits ni push.

[Formato de salida] Archivos creados, con una frase cada uno; los comandos ejecutados y una tabla de comprobaciones con su resultado real.

[Criterios de aceptación]
- up.sql y los datos de prueba se aplican sin errores en una base vacía.
- La base queda con 1 titular, 5 categorías, 1 vehículo, 1 ingreso, 1 gasto y 1 documento.
- Un ingreso de taxi de $40.000 sin motivo se rechaza por la restricción de ingresos.
- down.sql deja la base sin tablas, y up.sql se puede volver a aplicar.
- metadata.json registra las seis tablas y sus relaciones, usa from_env para la base y no contiene cadenas de conexión ni claves.
```

**Archivos creados**

| Archivo | Para qué sirve |
|---|---|
| `infra/hasura/migrations/default/1794872424463_modelo_inicial/up.sql` | Crea las seis tablas. Las instrucciones son las mismas de `modelo-inicial.sql`; solo cambia el comentario inicial, que explica de dónde viene. El número es la hora de creación en milisegundos, como lo nombra la CLI de Hasura: 16 de noviembre de 2026, 18:40 |
| `infra/hasura/migrations/default/1794872424463_modelo_inicial/down.sql` | Deshace la migración: borra las tablas en orden inverso. Borra también los datos, así que es solo para bases de prueba |
| `infra/hasura/seeds/default/datos_ficticios.sql` | Carga el caso ficticio del taxi XYZ789 en una base nueva. La titular usa `titular.prueba@example.com` y una contraseña guardada que no sirve para entrar |
| `infra/hasura/metadata/metadata.json` | La metadata exportada de Hasura Cloud, copiada sin cambios |

**Comprobaciones**, en un PostgreSQL 15.18 temporal, creado en una carpeta fuera del repositorio y que solo aceptaba conexiones del mismo computador:

| Comprobación | Comando | Resultado real |
|---|---|---|
| Migración en una base vacía | `psql -v ON_ERROR_STOP=1 --single-transaction -f up.sql` | Código de salida 0 |
| Datos de prueba | `psql -v ON_ERROR_STOP=1 --single-transaction -f datos_ficticios.sql` | Código de salida 0. Quedan 1 titular, 5 categorías, 1 vehículo, 1 ingreso, 1 gasto y 1 documento |
| Caso ficticio completo | Consulta que une las seis tablas | XYZ789 con cuota de 60000; ingreso del 2026-10-01 por 60000, con cuota de referencia de 60000; gasto de 5000 en «Ahorro prima conductor», y «SOAT de ejemplo», que vence el 2027-01-15 |
| Rechazo sin motivo | Ingreso de taxi de 40000 del 2026-10-04, sin motivo | `ERROR: new row for relation "ingresos" violates check constraint "ingresos_check1"`. Sigue habiendo 1 ingreso |
| Control con motivo | El mismo ingreso con motivo, en una transacción que después deshice | Se aceptó: 2 ingresos dentro de la transacción. Al deshacerla queda 1 |
| Datos de prueba repetidos | Cargar otra vez `datos_ficticios.sql` | `ERROR: duplicate key value violates unique constraint "usuarios_correo_key"`. No se duplicó nada: siguen 1 titular y 5 categorías |
| Mismo esquema que la evidencia 4 | `pg_dump -s` de una base creada con `up.sql` y otra con `modelo-inicial.sql`, y `diff` | Iguales. Solo cambian las líneas `\restrict`, que `pg_dump` genera al azar en cada volcado |
| Deshacer la migración | `down.sql` | Código de salida 0 y 0 tablas en el esquema `public` |
| Volver a aplicar | `up.sql` y los datos de prueba otra vez | Código de salida 0, con 6 tablas y las mismas filas |
| Metadata sin secretos | Un script que solo muestra la estructura y cuenta coincidencias | La base se conecta con `from_env: PG_DATABASE_URL`. Hay 0 coincidencias de `postgres://`, usuario y contraseña en una URL, `admin_secret`, `password`, `secret`, `token`, `neon.tech` y `hasura.app` |
| Metadata y base coinciden | Un script que compara la metadata con las claves foráneas de la base temporal | Las 6 tablas coinciden. Las 12 relaciones registradas, 6 en cada sentido, tienen su clave foránea |
| Limpieza | `pg_ctl stop` y borrado de la carpeta temporal | Base temporal borrada. `modelo-inicial.sql` sin cambios. En git solo aparecen `infra/` y esta evidencia |

**Ajustes:** no hice ninguno en el texto del prompt.

**Observaciones:**
- **Los datos de prueba no se cargan en Neon.** La base actual ya tiene su propio caso ficticio, del 28 de octubre. Si su titular usa otro correo, se agregaría una segunda titular.
- **Una relación manual.** `usuarios.categorias_gasto` está configurada a mano y no por la clave foránea. Coincide con la evidencia de sesiones 4 y 5: Hasura la propuso como objeto por el índice de `lower(nombre)`, y la registré como arreglo.
- **Versión de PostgreSQL.** Probé con la 15.18, que es la que tengo instalada. La de Neon la registro cuando la lea en su consola. El SQL no usa nada propio de una versión más nueva. **Nota del 19 de noviembre:** Neon usa PostgreSQL 18.7 (apartado 3). Ese mismo esquema ya se había ejecutado allí el 28 de octubre, desde `modelo-inicial.sql`.

### Prompt 2 · Cliente interno de Hasura en core-service (16 de noviembre de 2026)

Texto exacto enviado:

```text
[Rol] Actúa como desarrollador backend con NestJS y tutor. Explícame las decisiones en lenguaje sencillo.

[Objetivo] Crea en core-service un cliente interno de Hasura (HasuraModule y HasuraService) que envíe consultas GraphQL con el secreto de administración solo desde el servidor, con tiempo límite y errores claros.

[Contexto]
- core-service es la app NestJS 12 del monorepo (ESM, Vitest y oxlint) y hoy solo tiene GET /api/health.
- La arquitectura que orientó el instructor es React → NestJS → Hasura → Neon. El navegador nunca habla con Hasura ni conoce el secreto.
- Según la cartilla (semana 5 y anexo A), el cliente envía x-hasura-admin-secret, revisa los fallos HTTP y el campo errors, usa un tiempo límite y nunca muestra secretos ni respuestas crudas en los errores públicos. Los servicios del dominio lo usarán por inyección.
- Todavía no hay acceso con correo y contraseña, servicios del MVP ni pantallas que usen Hasura.

[Datos o archivos]
- apps/core-service/src/main.ts, app.module.ts y configure-app.ts
- apps/core-service/src/health/, como ejemplo de módulo, servicio y pruebas
- Variables: HASURA_GRAPHQL_URL, HASURA_ADMIN_SECRET y HASURA_TIMEOUT_MS (5000 si no se indica)

[Restricciones]
- Crea src/hasura/ con hasura.module.ts, hasura.service.ts, hasura.errors.ts y hasura.service.spec.ts. La lectura y validación de las variables puede ir en hasura.config.ts.
- No agregues dependencias: usa fetch y AbortSignal.timeout de Node 24.
- main.ts carga apps/core-service/.env con process.loadEnvFile() solo si el archivo existe. Si faltan las variables, core-service arranca igual y GET /api/health sigue respondiendo.
- request<T>(consulta, variables) distingue cuatro casos: sin configurar, tiempo agotado, servicio no disponible (falla de red, HTTP con error o respuesta que no es GraphQL) y errores de GraphQL, con sus códigos extensions.code.
- Ningún mensaje de error incluye el secreto, la URL ni la respuesta cruda de Hasura.
- Crea apps/core-service/.env.example sin valores secretos y con comentarios en español.
- No leas ni muestres apps/core-service/.env.
- No crees endpoints en este prompt.
- No hagas commits ni push.

[Formato de salida] Archivos creados o cambiados, con una frase cada uno; los comandos ejecutados y una tabla de comprobaciones con su resultado real.

[Criterios de aceptación]
- Pruebas unitarias con fetch simulado para: respuesta correcta, errores de GraphQL, HTTP 500, falla de red, tiempo agotado, sin configurar, envío de la cabecera x-hasura-admin-secret y que el secreto no aparezca en ningún mensaje de error.
- npm run build, npm test, npm run test:e2e y npm run lint terminan bien desde la raíz.
- core-service arranca sin .env y GET /api/health responde como antes.
- git check-ignore confirma que apps/core-service/.env queda ignorado.
```

**Archivos creados o cambiados**

| Archivo | Para qué sirve |
|---|---|
| `src/hasura/hasura.config.ts` | Lee y valida las tres variables. Si falta la dirección o el secreto, devuelve «sin configurar»; si un valor está mal escrito, detiene el arranque con un mensaje claro |
| `src/hasura/hasura.errors.ts` | Define `HasuraError`, con el tipo de falla (`NOT_CONFIGURED`, `TIMEOUT`, `UNAVAILABLE` o `GRAPHQL`) y los códigos de GraphQL |
| `src/hasura/hasura.service.ts` | `request<T>(consulta, variables)`: envía la consulta por POST con el secreto, espera como máximo el tiempo límite y convierte cada falla en un `HasuraError` |
| `src/hasura/hasura.module.ts` | Entrega `HasuraService` por inyección, con la configuración leída al crear la app |
| `src/hasura/hasura.service.spec.ts` y `hasura.config.spec.ts` | Pruebas unitarias del cliente y de la configuración (apartado 5) |
| `src/main.ts` | Carga `apps/core-service/.env` con `process.loadEnvFile()`, solo si existe |
| `.env.example` | Plantilla de las tres variables, sin valores reales y con comentarios en español |

**Comprobaciones**, con Node 24.22.2 y npm 11.19.1:

| Comprobación | Comando | Resultado real |
|---|---|---|
| Pruebas unitarias | `npm test` | 15 de 15 pasan en 4 archivos: las 2 de la sesión 6 y 13 nuevas (apartado 5) |
| Prueba e2e | `npm run test:e2e` | 1 de 1 pasa: `GET /api/health` no cambió |
| Compilación | `npm run build` | Código de salida 0. Las pruebas no se incluyen en `dist/` |
| Lint | `npm run lint` | Código de salida 0, sin avisos |
| Arranque sin `.env` | `node dist/main.js` desde `apps/core-service`, sin `.env`, y `curl -i localhost:3000/api/health` | «Nest application successfully started» y `HTTP/1.1 200 OK` con `{"status":"ok","service":"core-service"}` |
| `.env` ignorado | `git check-ignore -v apps/core-service/.env` | Lo ignora la regla `.env` del `.gitignore` de la raíz. `.env.example` sí se sube, por la regla `!.env.example` |

**Ajustes:** no hice ninguno en el texto del prompt.

**Observaciones y decisiones:**
- **Tres pruebas más de las pedidas:** una respuesta que no es GraphQL, la entrega por inyección desde `HasuraModule` y la validación de las variables.
- **Valores mal escritos.** Si falta una variable, core-service arranca igual. Si está mal escrita, por ejemplo una dirección sin `https://`, no arranca y dice cuál corregir. Así el error aparece al iniciar y no en la primera consulta.
- **Errores de GraphQL con HTTP de error.** Si Hasura responde con `errors`, los trato como errores de GraphQL aunque el HTTP no sea 200, para no perder sus códigos.
- **Mensajes de Hasura.** El cliente no guarda el mensaje original de Hasura, porque puede traer detalles internos. Las reglas de la semana 8 necesitarán el nombre de la restricción, por ejemplo `ingresos_check1`, para responder 422 `MOTIVO_REQUERIDO`. Lo agregaré cuando un servicio lo use.
- **Dónde se lee el `.env`.** Desde la carpeta donde arranca core-service, que con los scripts del proyecto es `apps/core-service`.
- **El módulo todavía no se usa.** `HasuraModule` existe, pero ningún endpoint lo usa. Lo conecto en el prompt 3, con `GET /api/health/hasura`.
- **npm 12.** Al ejecutar las pruebas, npm avisó que existe la versión 12.2.2. No la cambié, porque afecta a todo el monorepo; queda como pendiente. **Nota del 20 de noviembre:** pasé el monorepo a npm 12.2.3 (apartado 5).

### Prompt 3 · Endpoint de prueba, cliente HTTP de la web y README (16 y 17 de noviembre de 2026)

**Antes de enviarlo:** el 16 de noviembre copié `apps/core-service/.env.example` como `apps/core-service/.env` y escribí la dirección GraphQL y el secreto de administración. Claude Code comprobó, sin mostrar los valores, que las dos variables tenían valor, que la dirección era de `hasura.app` y terminaba en `/v1/graphql`, y que Git ignoraba el archivo.

Texto exacto enviado:

```text
[Rol] Actúa como desarrollador full stack con NestJS y React, y tutor. Explícame las decisiones en lenguaje sencillo.

[Objetivo] Demuestra la conexión real entre core-service y Hasura con un endpoint de prueba, centraliza en la web-app las llamadas HTTP a core-service y documenta en el README cómo configurar y reconstruir el entorno.

[Contexto]
- core-service ya tiene HasuraModule y HasuraService, del prompt anterior.
- La cartilla da como ejemplo un endpoint de prueba que verifica una consulta interna sobre datos ficticios, y pide que la web-app tenga un api-client HTTP hacia el core.
- La base de prueba en Neon solo tiene datos ficticios.
- El panel de verificación de la sesión 6 debe verse y comportarse igual.

[Datos o archivos]
- apps/core-service/src/health/ y apps/core-service/test/app.e2e-spec.ts
- apps/web-app/src/api/health.api.ts y apps/web-app/src/components/HealthPanel.tsx
- README.md, apartados «Ejecutar el monorepo» y «Solución de problemas»
- infra/hasura/, del primer prompt

[Restricciones]
- Agrega GET /api/health/hasura en HealthModule. HealthService recibe HasuraService por inyección y ejecuta una consulta fija: vehiculos_aggregate { aggregate { count } }.
- Si todo va bien, responde 200 con { "status": "ok", "service": "hasura", "vehiculos": N }; si falla, 503 con un mensaje claro y sin detalles internos.
- El endpoint no acepta consultas ni parámetros desde el navegador y no devuelve datos personales.
- Crea apps/web-app/src/api/api-client.ts con la URL base, el error de conexión, el error HTTP y la lectura del JSON, y haz que health.api.ts lo use con los mismos mensajes de ahora.
- No cambies el panel ni agregues dependencias.
- En el README, agrega «Conectar core-service con Hasura»: crear el .env, comprobar /api/health/hasura y reconstruir la base y la metadata en un proyecto nuevo con infra/hasura/. Suma a «Solución de problemas» el secreto inválido, el tiempo agotado y Hasura sin configurar.
- No leas ni muestres apps/core-service/.env.
- No hagas commits ni push.

[Formato de salida] Archivos creados o cambiados, con una frase cada uno; los comandos ejecutados y una tabla de comprobaciones con su resultado real.

[Criterios de aceptación]
- Pruebas del controller con el servicio simulado: éxito y 503.
- Prueba e2e sin variables de Hasura: GET /api/health/hasura responde 503 por falta de configuración y GET /api/health sigue respondiendo 200.
- Con el .env de Ivan, curl http://localhost:3000/api/health/hasura responde ok con el conteo de vehículos de Neon.
- npm run build, npm test, npm run test:e2e y npm run lint terminan bien.
- El código compilado de la web-app no contiene HASURA ni el secreto.
- El panel muestra éxito, error y recuperación como en la sesión 6.
```

**Archivos creados o cambiados**

| Archivo | Para qué sirve |
|---|---|
| `apps/core-service/src/health/health.service.ts` | `checkHasura()`: envía la consulta fija `ConteoVehiculos` y revisa que Hasura devuelva un número |
| `apps/core-service/src/health/health.controller.ts` | `GET /api/health/hasura`. Si el cliente falla, responde 503 con el mensaje del error |
| `apps/core-service/src/health/health.module.ts` y `health-response.dto.ts` | Importa `HasuraModule` y define la forma de la respuesta |
| `health.service.spec.ts`, `health.controller.spec.ts` y `test/app.e2e-spec.ts` | Pruebas del endpoint (apartado 5) |
| `apps/web-app/src/api/api-client.ts` | Cliente HTTP de la web: dirección base, error de conexión, error HTTP y lectura del JSON |
| `apps/web-app/src/api/health.api.ts` | Usa el cliente y solo revisa la forma de su respuesta, con los mismos mensajes |
| `README.md` | Sección «Conectar core-service con Hasura», reconstrucción con `infra/hasura/`, 5 filas en «Solución de problemas» y notas al día |

**Comprobaciones**, con Node 24.22.2 y npm 11.19.1:

| Comprobación | Comando | Resultado real |
|---|---|---|
| Pruebas unitarias | `npm test` | 19 de 19 pasan: 4 nuevas del endpoint |
| Pruebas e2e | `npm run test:e2e` | 2 de 2 pasan |
| Compilación y lint | `npm run build` y `npm run lint` | Código de salida 0, sin avisos |
| Código de la web | Búsqueda en `apps/web-app/dist` | Sin `hasura` ni `admin-secret` |
| Prueba real, secreto incorrecto y panel | Apartado 5, «Otras comprobaciones» | Las tres pasan |

**Casos de error con un Hasura falso.** Para probar las fallas sin tocar Hasura Cloud ni el secreto real, Claude Code arrancó core-service ya compilado con un `.env` de prueba en una carpeta temporal. En lugar de Hasura respondía un pequeño servidor local:

| Caso | Respuesta de `/api/health/hasura` |
|---|---|
| Sin `.env` | HTTP 503: «Hasura no está configurado: faltan HASURA_GRAPHQL_URL o HASURA_ADMIN_SECRET en apps/core-service/.env.» |
| Conexión correcta | HTTP 200: `{"status":"ok","service":"hasura","vehiculos":3}`, en 0,012 s |
| Secreto incorrecto | HTTP 503: «Hasura rechazó la consulta (código: access-denied).» |
| Servidor que no responde, con tiempo límite de 500 ms | HTTP 503: «Hasura no respondió en 500 ms.», a los 0,51 s |
| Dirección sin servicio | HTTP 503: «No se pudo conectar con Hasura. Revisa la conexión a internet y HASURA_GRAPHQL_URL.» |
| Dirección mal escrita | core-service no arranca: «HASURA_GRAPHQL_URL no es una dirección válida: debe empezar por https:// o http://.» |
| Consulta enviada en la dirección, `?query=…` | HTTP 200 con el conteo. El servidor falso solo recibió la consulta fija `ConteoVehiculos` |

El servidor falso registró que todas las consultas fueron por POST con la cabecera del secreto. En los registros de core-service no apareció ninguno de los secretos de prueba.

**Ajustes:** no hice ninguno en el texto del prompt.

**Observaciones y decisiones:**
- **El panel no cambió.** El panel reconoce los errores con el nombre `HealthCheckError`. Para no tocarlo, `health.api.ts` exporta con ese nombre el mismo `ApiError` del cliente HTTP.
- **El servicio no sabe de HTTP.** `HealthService` lanza `HasuraError`, y es el controlador el que lo convierte en un 503.
- **Primera consulta más lenta.** La primera consulta real tardó 1,0 s, y las siguientes menos de medio segundo. Puede ser que la base de Neon estuviera en reposo, pero no lo comprobé.
- **README.** Los pasos de conexión los seguí en la prueba real. Los de reconstrucción en un proyecto nuevo todavía no. **Nota del 20 de noviembre:** ya los seguí (apartado 5).
- **Revisión del panel.** Esta sesión de Claude Code no tenía navegador, así que revisé yo el panel.

## 7. Problemas encontrados

| Síntoma | Causa | Solución |
|---|---|---|
| Con el Hasura falso, el caso correcto tardó 5 s y respondió «Hasura no respondió en 5000 ms.» | La consulta no llegó al servidor falso. Lo más probable es que todavía no estuviera listo cuando empezó la prueba | Repetí el caso esperando a que el servidor escuchara, y respondió 200 en 0,012 s, dos veces. No era un fallo de core-service |
| Al crear el proyecto de prueba, Hasura Cloud mostró «Your project has an infrastructure issue» y una X junto al nombre | Hasura no explicó la causa. Puede ser que el proyecto, recién creado, todavía se estuviera preparando | Esperé unos minutos y recargué la página. El aviso desapareció y el proyecto quedó listo, sin enviar el ticket de soporte que proponía |
## 8. Pendientes y próximo paso

| Pendiente | Responsable | Fecha |
|---|---|---|
| Guardar en el cliente el nombre de la restricción que rechaza un dato, para las reglas | Ivan | Por definir |
| Acceso con correo y contraseña (semana 6 de la cartilla) | Ivan | Por definir |

## Fuentes

- «Cartilla de acompañamiento técnico» del instructor: semana 5, «Monorepo, Neon, Hasura y cliente interno», y anexo A, sobre el cliente de Hasura en el core.
- Indicación del instructor por WhatsApp, del 12 de noviembre de 2026, reportada por Ivan.
- [Evidencia de sesiones 4 y 5](evidencia-sesion-4-modelo-datos-servicios.md), con el modelo cargado en Neon y Hasura Cloud, y [evidencia de sesión 6](evidencia-sesion-6-monorepo-react-nestjs.md).
- [README del repositorio](../README.md).

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1 | 17 de noviembre de 2026 | Primera versión: base de datos versionada en `infra/hasura/`, cliente interno de Hasura, endpoint de prueba, cliente HTTP de la web, README y registro de los tres prompts. La empecé el 15 de noviembre. El 16 ejecuté los prompts, y el 17 hice la prueba real, el commit y el clon limpio. |
| 0.2 | 19 de noviembre de 2026 | Versiones de Hasura Cloud y de PostgreSQL en Neon, leídas en sus consolas, y subida de los commits a GitHub. |
| 0.3 | 20 de noviembre de 2026 | Reconstrucción completa en una base de Neon y un proyecto de Hasura Cloud nuevos, con su contraprueba, y tres aclaraciones al README. |
| 0.4 | 20 de noviembre de 2026 | Cambio del monorepo a npm 12.2.3, con su análisis y sus comprobaciones. |
