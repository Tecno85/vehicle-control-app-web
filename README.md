# VehicleControlApp Web

Versión web de VehicleControlApp a desarrollar por DazaDev. Ivan Dario Madrid Daza es el desarrollador responsable. La usuaria inicial es Katerin, propietaria y administradora de una pequeña flota.

## Problema y propósito

El objetivo principal de VehicleControlApp Web es pasar el control de la flota —actualmente llevado a mano en una libreta— a un sistema de software accesible desde la web. La solución contempla los taxis y el control de ingresos diarios generados mediante inDrive. Como primer alcance, permitirá crear vehículos y clasificarlos como taxi o particular, registrar ingresos y gastos, registrar documentos y consultar la información por vehículo.

Para los ingresos, el alcance inicial considera la cuota fija diaria de cada taxi y el total variable diario de inDrive. Para SOAT y tecnomecánica, se registra el nombre y la fecha de vencimiento; se puede guardar primero el registro, adjuntar después un archivo y visualizarlo o descargarlo. Se plantea un archivo por registro; PDF, Word y formatos comunes de imagen son candidatos por confirmar antes de implementar.

## Estado del proyecto

La revisión previa a esta documentación encontró el repositorio sin archivos de proyecto ni commits. Este README y los documentos enlazados establecen el contexto inicial; no afirman que haya funciones implementadas.

El login con usuario y contraseña es una necesidad propuesta para proteger los datos de la usuaria. Queda en el backlog y en el plan; no es parte de la entrega de semana 1 y sus roles y permisos aún no están definidos.

## Semana 1

La actividad actual es preparar la ficha del proyecto, resumir la evidencia, describir el flujo principal, iniciar el backlog y registrar la organización individual del trabajo. La entrega indicada es el 8 de octubre de 2026.

Consulta el [contexto del proyecto](docs/contexto-proyecto.md) para conocer la evidencia, el antecedente Android, las historias iniciales, las decisiones pendientes y las reglas de alcance.

La [evidencia de avance de semana 1](docs/evidencia-semana-1.md) reúne la ficha del proyecto, la evidencia resumida, el flujo principal, el backlog inicial y la organización individual del trabajo.

## Orientación técnica

React con Material UI, NestJS, Hasura GraphQL Engine y PostgreSQL en Neon aparecen en los materiales del instructor como orientación. No se han confirmado como decisiones definitivas ni están implementados en este repositorio.
