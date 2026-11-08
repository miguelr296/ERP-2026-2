# Tablero Kanban

[Índice](../../README.md)

No se presupone un tablero configurado ni tarjetas cargadas. La configuración se verifica con el equipo.
Estado reportado por Miguel el 2026-11-07: COM-001 y COM-002 en Done (PR #104), COM-003 y COM-004 en Ready y COM-005 en In Progress, lista para PR. El tablero remoto no se verificó desde esta sesión; Done requiere revisión e integración comprobadas.
Borrador aprobado en sprint-NN.md → carga explícitamente autorizada → tablero como fuente del estado real.

## Columnas y límites
Backlog: trabajo pendiente o bloqueado. Ready: trabajo cuyo alcance y dependencias están resueltos.
In Progress: máximo una tarjeta por persona. In Review: máximo dos para el equipo. Done: aceptación e integración comprobadas.
La primera carga solo propone Ready a tarjetas sin dependencias. El resto permanece en Backlog hasta resolverlas.

## Campos
Status: Backlog, Ready, In Progress, In Review, Done.
Priority: P0 (Núcleo), P1 (Si alcanza). Prioridad: Núcleo, Si alcanza.
Size: S (0,5 h), M (1 h), L (1,5 h), XL (bloque de 2–3 h dividido en pasos de 30–90 min) por persona. Estimate: suma de horas de todos los participantes.
Start date y Target date: fechas ISO. Sprint: iteración de siete días con título Sprint 1, Sprint 2, etc.
Assignees: responsables. Milestone: área y fecha de inicio, como Comercial 2026-11-05.
Blocked by: relaciones de dependencia entre Issues.

## Script de carga
Desde la raíz, bash scripts/crear-tarjetas.sh hace un ensayo local sin escribir en GitHub.
Para una carga autorizada: bash scripts/crear-tarjetas.sh --ejecutar docs/plan/sprint-01.md.
Requiere GitHub CLI con acceso al repositorio y al proyecto; comprobar autenticación existente antes de solicitar otra.
Variables: GH_PROPIETARIO, GH_PROYECTO; opcionales GH_TIPO (user u organization), GH_MIGUEL, GH_LUIS y GH_PABLO.
Crear/verificar los campos y la iteración con las fechas del calendario antes de cargar.
El script rechaza IDs ya existentes para evitar sobrescribir estados o reutilizar trabajo anterior. Tras la primera carga, actualizar las tarjetas en el tablero.
No ejecutar la carga para limpiar un tablero anterior. Archivar o reorganizar Issues existentes requiere una decisión explícita del equipo.
El script no demuestra que los permisos, automatizaciones ni protecciones de GitHub estén configurados.
