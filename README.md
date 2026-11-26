# VehicleControlApp Web

VehicleControlApp Web es la versión web, para escritorio y celular, de VehicleControlApp. DazaDev desarrolla el producto e Ivan Dario Madrid Daza es el responsable. El trabajo es individual. Katerin, propietaria y administradora de una pequeña flota, es la usuaria inicial.

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

## Estado actual

Es un monorepo con dos aplicaciones: `apps/web-app` (React, TypeScript y Material UI) y `apps/core-service` (NestJS). La web-app solo habla con core-service, y core-service consulta la base de datos, en Neon, a través de Hasura Cloud. Hoy la titular ingresa con su correo y su contraseña y maneja sus vehículos: los agrega, los consulta, los edita, los desactiva o los elimina. **Del MVP faltan ingresos, gastos, documentos y categorías.** Todo funciona en desarrollo, en mi equipo; no está publicado ni probado en producción.

El avance de cada sesión está en la tabla «Evidencias», y los acuerdos y decisiones pendientes, en el [contexto del proyecto](docs/contexto-proyecto.md). El [prototipo de la sesión 3](https://tecno85.github.io/vehicle-control-app-web/) sigue publicado en GitHub Pages para recorrer las pantallas; sus acciones son simuladas y no guarda nada.

## Cómo ejecutarlo

Necesitas Node.js 24 LTS y npm 12. Si usas fnm, `fnm use` toma la versión del archivo `.node-version`.

1. Instala las dependencias desde la raíz: `npm install`.
2. Crea el archivo de entorno de la web: `cp apps/web-app/.env.example apps/web-app/.env`.
3. Crea y completa el de core-service, como explica la [guía de desarrollo](docs/guia-desarrollo.md) en «Conectar core-service con Hasura».
4. En una terminal, arranca core-service: `npm run dev:api`. En otra, la web: `npm run dev:web`.
5. Abre http://localhost:5173 e ingresa con una cuenta de prueba («Ingresar con las cuentas de prueba», en la guía).

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila las dos apps |
| `npm test` | Pruebas unitarias. Por ahora solo core-service tiene pruebas |
| `npm run test:e2e` | Pruebas de core-service con un Hasura simulado |
| `npm run lint` | Revisión de estilo con oxlint en las dos apps |

Si algo falla, la guía de desarrollo tiene una tabla de «Solución de problemas».

## Documentación

| Documento | Qué tiene |
|---|---|
| [Guía de desarrollo](docs/guia-desarrollo.md) | Requisitos, solución de problemas, conexión con Hasura y cómo reconstruirla, cuentas de prueba, pantallas de vehículos, guía visual, prototipo y versiones comprobadas |
| [API de core-service](docs/api-core-service.md) | Qué permite cada ruta, cómo funciona la sesión, los errores y el contrato de vehículos |
| [Contexto del proyecto](docs/contexto-proyecto.md) | Alcance, acuerdos con Katerin y con el instructor, y decisiones pendientes |
| Evidencias (abajo) | El registro de cada sesión, con sus prompts y comprobaciones |

## Organización del repositorio

```text
.
├── apps/
│   ├── core-service/          # NestJS: ingreso, sesión, vehículos y cliente de Hasura
│   └── web-app/               # React, TypeScript, Vite y Material UI
├── docs/                      # Guía, API, contexto y evidencias
│   └── evidencia-sesion-N/    # Capturas y recursos de cada evidencia
├── infra/hasura/              # Migraciones, datos de prueba y metadata de Hasura
├── prototipo-web-sesion-3/    # Prototipo de revisión, con su propio npm
├── .github/workflows/         # Publicación manual del prototipo en Pages
├── .node-version              # Node 24 para el monorepo
└── package.json               # Workspaces de npm y atajos del monorepo
```

Por indicación del instructor en la sesión 6, el monorepo usa React con TypeScript, Vite y Material UI, NestJS y npm workspaces.

### Evidencias

| Sesión | Evidencia | Fecha | Estado |
|---|---|---|---|
| Semana 1 | [Evidencia de semana 1](docs/evidencia-sesion-1.md): registro histórico de la actividad | 8 oct 2026 | Entregada |
| 2 | [Requerimientos y backlog](docs/evidencia-sesion-2-requerimientos-backlog.md): consulta, requerimientos e historias priorizadas | 15 oct 2026 | Entregada |
| 3 | [Diseño de pantallas](docs/evidencia-sesion-3-diseno-pantallas.md): mapa de 35 pantallas, rutas propuestas, 11 fichas, 24 capturas y resultados de la prueba con Katerin del 20 de octubre de 2026 | 22 oct 2026 | Entregada |
| 4 y 5 | [Modelo de datos y servicios](docs/evidencia-sesion-4-modelo-datos-servicios.md): alcance de la primera versión, proceso del MVP, seis tablas con su diagrama, campos y relaciones, modelo cargado en Neon y Hasura, servicios S01 a S12 con sus contratos, revisión del diseño y dudas abiertas | 6 nov 2026 | Entregada (versión 0.8) |
| 6 | [Monorepo con React y NestJS](docs/evidencia-sesion-6-monorepo-react-nestjs.md): base del monorepo, prueba de conexión con éxito, error y recuperación, y registro de tres prompts con sus comprobaciones | 12 nov 2026 | No solicitada (versión 0.1) |
| 7 | [Conexión de core-service con Hasura](docs/evidencia-sesion-7-conexion-hasura.md): base de datos versionada en `infra/hasura/`, cliente interno de Hasura, prueba real con Hasura Cloud y registro de tres prompts | 20 nov 2026 | Entregada (versión 1.0) |
| 8 | [Base visual de la web-app](docs/evidencia-sesion-8-base-visual.md): tema con la identidad de Android en modo claro y oscuro, estructura común, panel con el nuevo estilo, guía visual solo para desarrollo y registro de tres prompts | 22 nov 2026 | Cerrada (versión 1.0) |
| 9 | [Ingreso con correo y contraseña](docs/evidencia-sesion-9-acceso.md): tabla `sesiones`, contraseñas con Argon2id, ingreso, renovación y cierre de la sesión en core-service, matriz de autorización, página de ingreso con rutas protegidas, prueba con dos cuentas y registro de tres prompts | 23 nov 2026 | Cerrada (versión 1.0) |
| 10 | [CRUD de vehículos](docs/evidencia-sesion-10-crud-vehiculos.md): paso 0 con siete hallazgos de la revisión del cierre, CRUD de vehículos en core-service con su contrato, pantallas de flota, detalle y formulario, prueba con Neon y Hasura Cloud, y registro de tres prompts | 25 nov 2026 | Cerrada (versión 1.0) |

Hasta la sesión 7, la columna «Fecha» es la de entrega. Desde el 17 de noviembre de 2026 el instructor no pide entregas: desde la sesión 8 es la fecha en que cierro la sesión, y su estado es «Cerrada». Los cambios de fecha de las sesiones 4 a 6 están en el [contexto del proyecto](docs/contexto-proyecto.md).
