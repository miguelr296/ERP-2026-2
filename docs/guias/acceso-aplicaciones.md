# Interfaz inicial

[Índice](../../README.md)

Los HTML, CSS y JavaScript de src/Erp.Api/wwwroot se conservan sin cambios.
Puede abrirse index.html directamente en el navegador.
Su acceso es simulado y su catálogo no acredita módulos implementados.
Textos, fechas y roles presentes son parte del material inicial; COM-003 los revisó para el alcance vigente y registró el inventario siguiente, sin modificar wwwroot.
La conexión real a API se construye y valida durante las tarjetas del sprint.

## Revisión de Luis · 2026-11-07 · COM-003

Luis confirmó que probó Asesor, Jefatura y Tesorería, la búsqueda de `logistica`, las tarjetas, Salir y la recarga de sesión. Todo funcionó según lo esperado, incluidos los avisos de pantallas pendientes. Es evidencia manual comunicada por Luis; no una prueba automatizada del navegador.

Los tres roles coinciden con [el alcance Comercial](../alcance/comercial.md). Su selección solo identifica una sesión simulada: no acredita autenticación, permisos ni reglas por rol en la API. Comercial y Logística tienen `ruta: null`; sus tarjetas muestran avisos, sin pantallas comerciales implementadas.

## Inventario de adecuaciones pendientes

Las ubicaciones corresponden a los archivos conservados bajo `src/Erp.Api/wwwroot`. Este inventario no aplica cambios al código.

| Ubicación | Texto o referencia | Adecuación propuesta y fuente |
|---|---|---|
| `aplicaciones.js:11` | `Sprint 1 · demos 05/11 a 19/11` | Cambiar a `Sprint 1 · 5–11 de noviembre de 2026`, conforme al [calendario](../plan/sprints.md). |
| `aplicaciones.js:3` | `D07` | Sustituir la referencia antigua por el calendario vigente para la regla de un área por sprint. |
| `index.html:12` y `aplicaciones.js:23` | `D12` | Sustituir la referencia antigua por el alcance Comercial vigente sobre roles simulados. |
| `aplicaciones.js:5` | Pantalla atribuida a `S1-18 (Luis)` | Retirar la atribución antigua; no asignar automáticamente una tarjeta nueva. Consultar el [plan vigente](../plan/sprint-01.md) al implementar la navegación. |
| `index.html:40–42` y avisos de interfaz | Asesor, Jefatura, Tesorería; acceso simulado y pantallas pendientes | Conservar: coherentes con el alcance y el comportamiento confirmado. |

Comprobación del inventario: lectura de HTML y JavaScript, contraste con calendario y alcance, y revisión manual confirmada por Luis. No se introducen reglas de negocio nuevas.
