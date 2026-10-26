# VehicleControlApp Web

VehicleControlApp Web es la versión responsive para escritorio y móvil de VehicleControlApp y tiene su propio repositorio. DazaDev desarrolla el producto e Ivan Dario Madrid Daza es el responsable. El trabajo es individual. Katerin, propietaria y administradora de una pequeña flota, es la usuaria inicial.

## Objetivo

Quiero pasar a una aplicación web el control de vehículos, ingresos, gastos y documentos que actualmente se lleva en un cuaderno, para consultar esa información por vehículo.

## Alcance inicial

El MVP contempla:

- Crear vehículos y clasificarlos como taxi o particular.
- Registrar los ingresos diarios: cuota del taxi, que Katerin puede cambiar, o total variable de inDrive en particulares habilitados.
- Registrar gastos por fecha, valor, descripción y categoría. Las categorías iniciales son Combustible, Lavado, Mantenimiento y Repuestos.
- Registrar SOAT y tecnomecánica con su vencimiento, adjuntar un archivo y luego visualizarlo o descargarlo.
- Consultar la información por vehículo.

El formato PDF es el más común indicado por Katerin. Word (.doc/.docx) e imágenes comunes (JPG/JPEG, PNG) son formatos candidatos. La lista final, los límites y el almacenamiento aún están por definir.

## Estado actual

El repositorio reúne documentación de descubrimiento y diseño, y un prototipo responsive para revisar los recorridos. El prototipo representa las pantallas de acceso, creación de cuenta y recuperación de contraseña, pero sus acciones son simuladas. **No contiene una aplicación lista para producción.** No implementa autenticación real, servidor ni almacenamiento persistente: usa datos de demostración y los cambios se pierden al recargar la página. Los archivos seleccionados solo se muestran durante la sesión del navegador. Katerin probó el prototipo el 20 de octubre de 2026 y revisó la identidad visual; sus observaciones y los ajustes acordados están en la [evidencia de sesión 3](docs/evidencia-sesion-3-diseno-pantallas.md).

La actividad actual es el modelo de datos y servicios de las sesiones 4 y 5. La versión 0.2 de la [evidencia](docs/evidencia-sesion-4-modelo-datos-servicios.md) define el proceso del MVP, seis tablas, sus campos y relaciones. Es un diseño para revisión: no existe todavía una base de datos ni una API.

El [prototipo de sesión 3 está publicado en GitHub Pages](https://tecno85.github.io/vehicle-control-app-web/). Se puede recorrer en escritorio y móvil; la vista móvil es adaptable y no es una aplicación nativa.

## Organización del repositorio

```text
.
├── .github/workflows/              # Publicación manual del prototipo en Pages
├── docs/                            # Contexto y evidencias de las sesiones
│   ├── evidencia-sesion-3/capturas/ # Capturas incluidas en la evidencia de diseño
│   └── evidencia-sesion-4/          # Diagrama del modelo de datos (SVG y PNG)
└── prototipo-web-sesion-3/           # Código React y Vite del prototipo
```

- [Contexto del proyecto](docs/contexto-proyecto.md): alcance, acuerdos y decisiones pendientes.
- [Evidencia de semana 1](docs/evidencia-sesion-1.md): registro histórico de la actividad.
- [Evidencia de sesión 2](docs/evidencia-sesion-2-requerimientos-backlog.md): consulta, requerimientos e historias priorizadas.
- [Evidencia de sesión 3](docs/evidencia-sesion-3-diseno-pantallas.md): mapa de 35 pantallas, rutas propuestas, 11 fichas, 24 capturas y resultados de la prueba con Katerin del 20 de octubre de 2026.
- [Evidencia de sesiones 4 y 5](docs/evidencia-sesion-4-modelo-datos-servicios.md), versión 0.2: proceso del MVP, seis tablas, diagrama, campos, relaciones con su tipo en Hasura y dudas para la revisión.

Las fechas de entrega indicadas en las evidencias son: semana 1, 8 de octubre; sesión 2, 15 de octubre; sesión 3, 22 de octubre; y sesiones 4 y 5, revisión de los apartados 1 y 2 el 29 de octubre y documento completo el 5 de noviembre de 2026.

## Abrir el prototipo en macOS

Con Node.js y npm instalados, desde la carpeta raíz del repositorio ejecuta:

```bash
cd prototipo-web-sesion-3
npm ci
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir en el navegador.

## Publicar una nueva versión del prototipo

La publicación no se ejecuta automáticamente al subir cambios. En GitHub, abre **Actions**, selecciona **Publicar prototipo de sesión 3** y ejecútalo manualmente. El flujo publica el prototipo en GitHub Pages.

## Referencias técnicas

El prototipo de revisión está hecho con React y Vite, usando HTML, CSS y JavaScript. Esta elección sirve para validar las pantallas y no define la arquitectura final del producto. React con Material UI, NestJS, Hasura GraphQL Engine y PostgreSQL en Neon son orientación de los materiales del instructor, no decisiones técnicas definitivas.

El [diseño previo en Figma](https://www.figma.com/design/pyVd1exSYW5O5B2Qt2cy2V) se conserva como referencia visual de la evidencia; no se actualizó al preparar el prototipo HTML.
