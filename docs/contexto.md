# Contexto del proyecto

- Inicio desde cero. Al 2026-11-07, COM-001 tiene acuerdos registrados y COM-002 tiene solución mínima, API y pruebas; ambas quedan pendientes de PR y revisión.
- Código conservado: únicamente HTML, CSS y JavaScript de src/Erp.Api/wwwroot.
- Fuente: PDF de Comercial; análisis nuevo en docs/fuentes/analisis-comercial.md.
- Sprint 1: Comercial, 5–11 de noviembre de 2026; recorrido PO.02 MTS trazable.
- Capacidad: Miguel, Luis y Pablo, 3 h diarias cada uno, incluidos fines de semana.
- Plan: 42 h; reserva: 21 h. Miguel tiene mayor experiencia, Luis la segunda y Pablo la menor.
- Primeras tarjetas: COM-001 a COM-004; no hay preparación previa acreditada.
- COM-001 acordó estados de OV y parámetros ficticios (DEC-001). Por acuerdo del equipo, los horarios escalonados no se documentan.
- Calendario y método: docs/plan/sprints.md. El tablero remoto no ha sido alterado por este reinicio.
- Existe `Erp.slnx`, API y pruebas de arranque en la máquina de Miguel. Al 2026-11-07 aún no hay base de datos, migraciones ni CI.
- 2026-11-07 · COM-020: workflow de CI implementado y validado en la rama de Luis, pendiente de revisión e integración. Se comprobaron una ejecución correcta, otra con fallo controlado y la configuración final correcta tras restaurar la expectativa original. Evidencia y enlaces en `docs/guias/ci.md`; preparación local lista para PR. No acredita base de datos ni recorrido comercial, ni cambia protecciones de main. No se declara Done.
