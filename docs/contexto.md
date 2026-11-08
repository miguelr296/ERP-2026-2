# Contexto del proyecto

- Inicio desde cero. COM-001 y COM-002 están integradas mediante el PR #104 y COM-005 mediante el PR #107 (`500174e`), comprobado el 2026-11-08. COM-003 y COM-020 tienen PR abiertos; no se infiere de ello el estado del tablero.
- Código conservado: únicamente HTML, CSS y JavaScript de src/Erp.Api/wwwroot.
- Fuente: PDF de Comercial; análisis nuevo en docs/fuentes/analisis-comercial.md.
- Sprint 1: Comercial, 5–11 de noviembre de 2026; recorrido PO.02 MTS trazable.
- Capacidad: Miguel, Luis y Pablo, 3 h diarias cada uno, incluidos fines de semana.
- Plan: 42 h; reserva: 21 h. Miguel tiene mayor experiencia, Luis la segunda y Pablo la menor.
- Primeras tarjetas: COM-001 a COM-004; no hay preparación previa acreditada.
- COM-001 acordó estados de OV y parámetros ficticios (DEC-001). Por acuerdo del equipo, los horarios escalonados no se documentan.
- Calendario y método: docs/plan/sprints.md. Estado de COM-005 en In Progress reportado por Miguel el 2026-11-07; no fue verificado en el tablero remoto.
- Existe `Erp.slnx` con `Erp.Api`, los tres proyectos de Comercial (`Dominio`, `Aplicacion`, `Infraestructura`) y las pruebas. Al 2026-11-07 la base local `ErpFamihogar` tiene el esquema `Comercial` con la migración `Inicial` aplicada; siguen pendientes la cotización, el descuento, el resto del recorrido y el CI.
- 2026-11-07 · COM-020: workflow de CI implementado y validado en la rama de Luis, pendiente de revisión e integración. Se comprobaron una ejecución correcta, otra con fallo controlado y la configuración final correcta tras restaurar la expectativa original. Evidencia y enlaces en `docs/guias/ci.md`; preparación local lista para PR. No acredita base de datos ni recorrido comercial, ni cambia protecciones de main. No se declara Done.
- 2026-11-08 · Actualización de COM-020 con COM-005: build Release con 0 advertencias y 0 errores, seguido de 8 pruebas superadas, 0 fallidas y 0 omitidas. Las seis pruebas nuevas usan EF Core InMemory; no acreditan SQL Server en la máquina de Luis. Los datos de SQL mencionados arriba corresponden a la comprobación de Miguel.
