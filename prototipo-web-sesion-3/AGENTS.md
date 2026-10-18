# Prototype Instructions

## Dirección visual en evaluación

- Diseñar únicamente la Web App responsive para escritorio y móvil. No incluir pantallas ni funciones de una aplicación nativa Android; las menciones históricas que aparezcan en documentación sirven solo para contextualizar decisiones previas.
- Probar una identidad de «bitácora vehicular contemporánea»: fondo cálido, tinta verde petróleo, un acento color latón, encabezados editoriales y placas con tipografía monoespaciada.
- Dar prioridad a una lectura cómoda: sans serif para textos y controles, serif editorial para títulos y monoespaciada para placas; mantener una escala de tamaños y espacios coherente.
- En esta propuesta, usar 15 px para el texto principal, 14 px para el secundario y 12 px para ayudas; construir espacios en una escala de 4 px y mantener controles táctiles de al menos 44 px.
- En móvil, conservar visibles los datos principales del vehículo por encima de la navegación fija.
- Evitar una apariencia genérica: construir la identidad a partir del contexto vehicular y usar los detalles con moderación. Esta dirección es una propuesta para revisar, no una aprobación definitiva de Katerin.
- Mantener la jerarquía clara y las proporciones equilibradas. Evitar adornos, avisos y tarjetas que compitan con las tareas principales.
- Usar esquinas redondeadas de forma consistente en imágenes y superficies, sin convertir cada control en una cápsula.
- Conservar las pantallas y acciones acordadas; mejorar su presentación no autoriza a ampliar el alcance funcional.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
