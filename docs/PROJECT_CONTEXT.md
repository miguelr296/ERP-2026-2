# Contexto del proyecto

## Actualización

- Sprint vigente: Sprint 2 (cierre funcional pendiente)
- Última revisión: 2026-10-09

## Estado actual

- El proyecto es un prototipo frontend-only del ERP Comercial Famihogar para el macroproceso PO.02.
- Sprint 1 está cerrado técnicamente con navegación explícita, permisos operativos y pruebas de foundation.
- Sprint 2 está funcionalmente avanzado, pero mantiene pendientes de negocio, trazabilidad y pruebas.
- El Sprint 3 aún no debe iniciarse hasta cerrar o aceptar formalmente las pendientes del Sprint 2.
- El plan oficial de alcance es `Sprints.txt`; la matriz de trazabilidad define los RF y criterios de aceptación.

## Funcionalidad implementada

- Login simulado para los roles definidos, menú dinámico por permisos, sede activa y shell ERP.
- Clientes: búsqueda, alta, edición, activación/inactivación, historial de compras y expediente B2B simulado.
- Oportunidades: registro Retail/B2B, adjuntos, próximas actividades, historial y seguimiento.
- Disponibilidad MTS: catálogo, stock físico/reservado/disponible, reservas, liberaciones y traslados locales.
- Costeo MTO: creación, adjuntos validados, relaciones cliente-oportunidad, fechas, historial y bandeja de Oficina Técnica.

## Navegación contextual

- Las opciones que reutilizan una pantalla se diferencian con rutas o query params gestionados desde `app-shell.component.ts`.
- Contextos actuales: clientes `view=new|search`, oportunidades `type=retail|b2b`, disponibilidad `view=catalog|stock` y costeo `view=create|tracking`.
- Ingeniería usa `/engineering/costing` con `mode=engineering` y permisos del subsistema ING.
- Las opciones todavía no implementadas navegan a una ruta jerárquica `planned/:system/:subsystem/:module/:option/:suboption` y muestran su estado explícitamente.
- Los accesos del menú requieren el permiso operativo correspondiente: crear (`C`), consultar (`R`), aprobar (`A`) o parametrizar (`P`).

## Próximo alcance

El siguiente paso es completar la auditoría y los pendientes del Sprint 2 según los RF oficiales. El Sprint 3 cubrirá posteriormente listas de precios, cotizador web, cálculo de subtotales e IGV, descuentos y aprobación cuando corresponda, además de la vista previa simulada de PDF.
