# Trazabilidad operativa del Sprint 2

Última revisión: 2026-10-09

Esta matriz resume el estado del prototipo frontend. La matriz oficial de RF y sus criterios de aceptación continúa siendo la fuente normativa.

| Área | Flujo | Estado | Evidencia en el prototipo |
|---|---|---|---|
| Clientes | Consulta, alta, DNI/RUC, duplicados y teléfono | Implementado | `CustomersComponent`, `CustomerService`, validadores documentales |
| Clientes | Edición e inactivación controlada | Implementado | Acciones de ficha y persistencia local |
| Clientes | Historial de compras | Parcial | Vista de historial con datos mock; no existe integración con pedidos |
| Clientes | Expediente B2B y documentos de crédito | Parcial | Vista de expediente y documentos simulados |
| Oportunidades | Registro Retail/B2B y cliente asociado | Implementado | `OpportunitiesComponent`, formularios reactivos y persistencia |
| Oportunidades | Adjuntos, próxima actividad e historial | Parcial | Nombres de archivos, fecha e historial simulados |
| Oportunidades | Seguimiento y avance de estado | Implementado | Bandeja, filtros, historial y avance autorizado |
| Disponibilidad MTS | Catálogo y físico/reservado/disponible por sede | Implementado | `AvailabilityService` y vista de stock |
| Disponibilidad MTS | Reserva, liberación, traslado y reposición | Parcial | Operaciones simuladas con validación en `localStorage` |
| Costeo MTO | Solicitud, cliente/oportunidad y fecha compromiso | Implementado | Formulario, relaciones y validación de fecha |
| Costeo MTO | Adjuntos y validación de tipo/tamaño | Parcial | Nombres de archivos; no se almacena contenido real |
| Costeo MTO | Estados, alertas e historial | Implementado | Bandeja ING, alertas y `statusHistory` |
| Costeo MTO | Comentarios y hoja de costo electrónica | Pendiente | La hoja de costo está fuera del alcance actual; comentarios requieren UI adicional |

## Pendientes para el cierre formal

- Completar pruebas de componentes, formularios, relaciones y criterios de aceptación de cada RF.
- Validar control por sede contra la matriz oficial.
- Añadir evidencia de prueba por rol.
- Confirmar si los flujos de reserva, reposición y seguimiento requieren aprobación adicional.
- Mantener fuera del Sprint 2 la hoja de costo electrónica, producción y las integraciones reales.
