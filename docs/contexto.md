# Contexto del proyecto

- Inicio desde cero. COM-001 y COM-002 están integradas mediante el PR #104 y COM-005 mediante el PR #107 (`500174e`), comprobado el 2026-11-08. No se deduce de estos documentos el estado actual del tablero.
- Código conservado: únicamente HTML, CSS y JavaScript de src/Erp.Api/wwwroot.
- Fuente: PDF de Comercial; análisis nuevo en docs/fuentes/analisis-comercial.md.
- Sprint 1: Comercial, 5–11 de noviembre de 2026; recorrido PO.02 MTS trazable.
- Capacidad: Miguel, Luis y Pablo, 3 h diarias cada uno, incluidos fines de semana.
- Plan: 42 h; reserva: 21 h. Miguel tiene mayor experiencia, Luis la segunda y Pablo la menor.
- Primeras tarjetas: COM-001 a COM-004; no hay preparación previa acreditada.
- COM-001 acordó estados de OV y parámetros ficticios (DEC-001). Por acuerdo del equipo, los horarios escalonados no se documentan.
- Calendario y método: docs/plan/sprints.md. Estado de COM-005 en In Progress reportado por Miguel el 2026-11-07; no fue verificado en el tablero remoto.
- Existe `Erp.slnx` con `Erp.Api`, los tres proyectos de Comercial (`Dominio`, `Aplicacion`, `Infraestructura`) y las pruebas. Al 2026-11-07 la base local `ErpFamihogar` tiene el esquema `Comercial` con la migración `Inicial` aplicada; siguen pendientes la cotización, el descuento, el resto del recorrido y el CI.
- 2026-11-08 · COM-006: búsqueda por documento implementada localmente en `luis/com-006-clientes`, reutilizando alta, consulta por ID e historial de COM-005. Build correcto y 19 pruebas superadas. En la máquina de Luis se comprobó el recorrido SQL y la recuperación del mismo cliente e historial tras reiniciar la API, usando la base aislada `ErpFamihogarPruebasLuis` con la migración existente de Miguel aplicada con autorización expresa. Evidencia en `docs/borradores/com-006-preparacion.md`; COM-R01 solo parcialmente demostrada. Cierre local validado y preparación lista para PR; sin commit, subida ni PR de COM-006. Revisión e integración pendientes; no se declara Done.
