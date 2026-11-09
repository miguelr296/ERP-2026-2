# ERP FAMIHOGAR — inicio del proyecto

Proyecto académico de Miguel, Luis y Pablo. Un área por sprint de una semana, de jueves a miércoles.
**Comercial: 5–11 de noviembre de 2026.** Cierre y demo interna el 11; planning del área siguiente el 12. Una presentación de clase en otro día es una revisión intermedia, no cambia la duración del sprint.

## Punto de partida
Solo se conserva el HTML, CSS y JavaScript de src/Erp.Api/wwwroot. Es material inicial de interfaz; no equivale a un módulo implementado.
El PDF de Comercial se conserva como fuente de requisitos. La solución mínima, API y pruebas de arranque se crearon en COM-002 y están integradas en `main` mediante el PR #104. COM-005 creó el módulo Comercial en tres proyectos —`Dominio`, `Aplicacion` e `Infraestructura`— y la base local `ErpFamihogar` con el esquema `Comercial`; COM-020 aporta el workflow de CI, con comandos, resultados y enlaces en [Validación y CI](docs/guias/ci.md). COM-008 está en Done en el tablero. En esta sesión, COM-024 y el recorrido por API/ficha de COM-009 quedaron implementados localmente, con migración aplicada y validación SQL; esperan el flujo Git y revisión. El estado y límites están en [contexto](docs/contexto.md) y [bitácora](BITACORA.md).
La interfaz puede abrirse directamente desde src/Erp.Api/wwwroot/index.html. Sus textos y roles son los del material conservado; su adecuación al nuevo sprint está planificada.
`dotnet build` y `dotnet test` se ejecutaron con éxito en la máquina de Miguel el 2026-11-06; esa ejecución solo acredita su máquina.
El 2026-11-07 también se verificaron build, pruebas y arranque en la máquina de Luis; Luis confirmó la revisión manual de la interfaz. Evidencia en [preparación técnica](docs/guias/preparacion.md) e inventario en [interfaz inicial](docs/guias/acceso-aplicaciones.md). La máquina de Pablo sigue sin acreditarse.

## Índice
- [Guía del equipo](AGENTS.md)
- [Enfoque](docs/plan/enfoque.md)
- [Flujo de trabajo](docs/plan/flujo-de-trabajo.md)
- [Calendario y definición de terminado](docs/plan/sprints.md)
- [Método de alcance](docs/plan/alcance.md)
- [Sprint 1: Comercial desde cero](docs/plan/sprint-01.md)
- [Tablero Kanban](docs/plan/kanban.md)
- [Alcance Comercial](docs/alcance/comercial.md)
- [Arquitectura objetivo](docs/arquitectura.md)
- [Plantilla de contrato](docs/contratos/_plantilla.md)
- [Fuentes](docs/fuentes/README.md) · [Análisis del PDF](docs/fuentes/analisis-comercial.md)
- [Catálogo de reglas](docs/reglas.md)
- [Acuerdos de trabajo](docs/decisiones.md)
- [Glosario](docs/glosario.md)
- [Contexto inicial](docs/contexto.md)
- [Bitácora](BITACORA.md)
- [Plantilla del capítulo semanal](docs/capitulos/_plantilla.md)
- [Preparación técnica](docs/guias/preparacion.md)
- [Validación y CI](docs/guias/ci.md)
- [Interfaz conservada](docs/guias/acceso-aplicaciones.md)
- Comandos: [iniciar](docs/comandos/iniciar.md), [planning](docs/comandos/planning.md), [cierre](docs/comandos/cierre.md), [retro](docs/comandos/retro.md)

Los alcances y contratos de las áreas siguientes se redactan en su planning, usando las plantillas y la fuente vigente. Este repositorio no declara el estado del tablero remoto.
