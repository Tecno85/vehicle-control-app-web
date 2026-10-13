# VehicleControlApp Web

VehicleControlApp Web es la versión web de VehicleControlApp y tendrá un repositorio propio. DazaDev es la empresa desarrolladora e Ivan Dario Madrid Daza es el desarrollador responsable. El trabajo es individual. Katerin, propietaria y administradora de una pequeña flota, es la usuaria inicial.

## Objetivo

Quiero trasladar a una aplicación web el control manual de vehículos, ingresos, gastos y documentos que actualmente se lleva en un cuaderno, con la información organizada y consultable por vehículo.

## Alcance acordado para el MVP

- Crear vehículos y clasificarlos como taxi o particular.
- Registrar ingresos y gastos por vehículo. Cada taxi tiene una cuota diaria fija que Katerin puede cambiar cuando lo decida. En un vehículo particular habilitado para inDrive se registra el total variable del día.
- Registrar gastos con fecha, valor, descripción y categoría. Las categorías iniciales son Combustible, Lavado, Mantenimiento y Repuestos; se podrán agregar o editar categorías.
- Registrar documentos SOAT y tecnomecánica con nombre y vencimiento; guardar el registro antes de adjuntar un archivo; después visualizarlo o descargarlo. Se contempla un archivo por registro.
- Consultar la información guardada por vehículo.

PDF es el formato de soporte más común indicado. Word (.doc/.docx) e imágenes comunes (JPG/JPEG, PNG) son formatos candidatos; la lista final, límites y almacenamiento siguen pendientes de definición.

El login con usuario y contraseña está considerado para una etapa posterior del plan. No está implementado y no se han definido roles ni permisos. Las funciones Android se consideran candidatas para etapas posteriores; no todas forman parte del MVP.

## Estado y evidencias

Este repositorio contiene documentación de descubrimiento y planificación. No hay funcionalidades web implementadas en el estado actual.

- [Contexto del proyecto](docs/contexto-proyecto.md): contexto general, evidencia, antecedente Android, alcance y decisiones abiertas.
- [Evidencia de avance de semana 1](docs/evidencia-sesion-1.md): registro histórico de la primera actividad, con entrega indicada para el 8 de octubre de 2026.
- [Requerimientos y backlog de sesión 2](docs/evidencia-sesion-2-requerimientos-backlog.md): consulta a Katerin del 12 de octubre, historias BDD y backlog de la actividad con entrega indicada para el 15 de octubre de 2026.

## Orientación técnica

React con Material UI, NestJS, Hasura GraphQL Engine y PostgreSQL en Neon aparecen en los materiales del instructor como orientación. No son decisiones técnicas definitivas ni tecnologías implementadas en este repositorio.
