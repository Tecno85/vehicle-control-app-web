# VehicleControlApp Web

VehicleControlApp Web es la versión web de VehicleControlApp y tendrá un repositorio propio. DazaDev es la empresa desarrolladora e Ivan Dario Madrid Daza es el desarrollador responsable. El trabajo es individual. Katerin, propietaria y administradora de una pequeña flota, es la usuaria inicial.

## Objetivo

Quiero trasladar a una aplicación web el control manual de vehículos, ingresos, gastos y documentos que actualmente se lleva en un cuaderno, con la información organizada y consultable por vehículo.

## Alcance acordado para el MVP

- Crear vehículos y clasificarlos como taxi o particular.
- Registrar ingresos y gastos por vehículo. Cada taxi tiene una cuota diaria fija que Katerin puede cambiar cuando lo decida. En un vehículo particular habilitado para inDrive se registra el total variable del día.
- Registrar gastos con fecha, valor, descripción y categoría. Las categorías iniciales son Combustible, Lavado, Mantenimiento y Repuestos; se podrán agregar y renombrar. Si ya se usan, se podrán desactivar para conservar el historial.
- Registrar documentos SOAT y tecnomecánica con nombre y vencimiento; guardar el registro antes de adjuntar un archivo; después visualizarlo o descargarlo. Se contempla un archivo por registro.
- Consultar la información guardada por vehículo.

PDF es el formato de soporte más común indicado. Word (.doc/.docx) e imágenes comunes (JPG/JPEG, PNG) son formatos candidatos; la lista final, límites y almacenamiento siguen pendientes de definición.

El diseño de sesión 3 incluye registro propio, inicio con correo y contraseña y recuperación por correo. Cada cuenta tendrá su propia flota; el MVP considera a la persona titular y no define roles para compartir datos. La autenticación no está implementada. El producto de este repositorio es una Web App responsive para escritorio y móvil, no una aplicación nativa.

## Estado y evidencias

Este repositorio contiene documentación de descubrimiento, planificación y diseño, además de un prototipo local de revisión en HTML, CSS y JavaScript. No hay funcionalidades del producto listas para producción. El prototipo simula los recorridos principales y mantiene cambios solo mientras la página está abierta; no implementa autenticación real, servidor ni almacenamiento persistente.

- [Contexto del proyecto](docs/contexto-proyecto.md): contexto general, evidencia, alcance y decisiones abiertas.
- [Evidencia de avance de semana 1](docs/evidencia-sesion-1.md): registro histórico de la primera actividad, con entrega indicada para el 8 de octubre de 2026.
- [Requerimientos y backlog de sesión 2](docs/evidencia-sesion-2-requerimientos-backlog.md): consulta a Katerin del 12 de octubre, historias BDD y backlog de la actividad con entrega indicada para el 15 de octubre de 2026.
- [Diseño de pantallas de sesión 3](docs/evidencia-sesion-3-diseno-pantallas.md): mapa, fichas de pantallas, reglas de acceso y edición, recorrido de escritorio y móvil y prueba pendiente con Katerin. La entrega indicada es el 22 de octubre de 2026.

El [prototipo web local de sesión 3](prototipo-web-sesion-3/) permite recorrer las pantallas de acceso, vehículos, detalle, ingresos, gastos, documentos y categorías. Sus datos son ficticios y se pierden al recargar; la carga de archivos funciona solo dentro de la sesión del navegador. Katerin aún no lo ha probado.

Para este prototipo de revisión usé React y Vite junto con HTML, CSS y JavaScript. Es una herramienta temporal para validar pantallas; no define la arquitectura del producto. Las vistas para móvil son una adaptación responsive de la Web App.

El diseño previo en [Figma](https://www.figma.com/design/pyVd1exSYW5O5B2Qt2cy2V) se conserva como referencia visual de la evidencia. No se actualizó durante la preparación del prototipo HTML.

Para abrir el prototipo localmente, desde su carpeta ejecuta `npm ci` y luego `npm run dev`. Vite mostrará la dirección local en la terminal.

## Orientación técnica

React con Material UI, NestJS, Hasura GraphQL Engine y PostgreSQL en Neon aparecen en los materiales del instructor como orientación. No son decisiones técnicas definitivas ni tecnologías implementadas en este repositorio.
