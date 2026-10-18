# Prototipo web de la sesión 3

Este prototipo sirve para revisar el diseño responsive y los recorridos de VehicleControlApp Web antes de implementarlos. Está publicado en [GitHub Pages](https://tecno85.github.io/vehicle-control-app-web/), usa datos ficticios y no se conecta a un servidor.

## Abrirlo en local

Desde esta carpeta, instala las dependencias y ejecuta el servidor de desarrollo:

```bash
npm ci
npm run dev
```

El navegador mostrará la dirección local que indique Vite. Para preparar los archivos de Sites:

```bash
npm run build
```

## Compartirlo para revisión

El prototipo se publicó por primera vez el 18 de octubre de 2026. El flujo manual de GitHub Actions permite publicar las versiones siguientes: desde la pestaña **Actions**, ejecuta **Publicar prototipo de sesión 3**. La fuente de Pages ya está configurada como **GitHub Actions**.

GitHub Pages puede dejar el sitio accesible públicamente, incluso si el repositorio es privado, según el plan y la configuración. Por eso el prototipo muestra datos ficticios y no incluye datos de la flota. `npm run build` conserva la preparación existente para Sites; el flujo de Pages usa `npm run build:pages` y publica solo `dist/client/`.

## Límites de la demostración

- El acceso, la creación de cuenta y la recuperación de contraseña son simulaciones.
- Los datos que agrego o edito se pierden al recargar la página.
- Los archivos que selecciono permanecen solo en la sesión del navegador.
- Las fechas, placas y valores de ejemplo no corresponden a la flota de Katerin.

La evidencia y el alcance de sesión 3 están descritos en [la documentación del proyecto](../docs/evidencia-sesion-3-diseno-pantallas.md).
