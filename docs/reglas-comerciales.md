# Reglas de la interfaz Comercial

[Índice](../README.md) · [Fuente](fuentes/sesion-06-sistema-gestion-comercial.pdf) · [Alcance](pantallas/comercial.md)

La evidencia corresponde al frontend y a contratos locales de consulta. Las reglas no acreditan servicios de otros módulos ni seguridad de servidor.

| Regla | Fuente / decisión | Evidencia ejecutada |
|---|---|---|
| Revisar altas y cambios de maestros antes de utilizarlos; otra persona resuelve | PDF pp. 6, 23; decisión de esta interfaz | Cliente pendiente no cotiza; producto no se publica antes de revisar; cambio de lista mantiene versión vigente hasta aprobación |
| Usar una sola lista vigente por canal y segmento, con productos y precios aprobados | PDF pp. 6–7 | Listas vencida, futura, inactiva, ambigua, ausente y solapada; canal y segmento; precio faltante |
| Conservar copia de líneas, cantidades, precios, descuento e impuesto | PDF pp. 4, 7–8 | Cambiar catálogo no modifica cotización ni pedido; cantidades cero y productos repetidos rechazados |
| Calcular dinero en céntimos; separar bruto, descuento, base e impuesto | PDF pp. 7, 12, 14; DEC-003/004 | Ejemplo 3547,00 + 638,46 = 4185,46; con 10 %: descuento 354,70, base 3192,30, IGV 574,61, total 3766,91 |
| Hasta 5 % con motivo; más de 5 % hasta 20 % necesita otra Jefatura; más de 20 % se rechaza | Límites confirmados expresamente por Luis; PDF pp. 7, 23 | Fronteras, motivo, rechazo, rol y no autoaprobación, incluso cambiando el rol del mismo nombre |
| Promoción vigente y aplicable, sin acumular rebaja manual | PDF p. 7; DEC-004 | Caducidad, canal/segmento, precio Web y promoción 3 %, no acumulación |
| No enviar/aceptar propuestas vencidas ni con excepción pendiente; registrar rechazo, anulación y vencimiento | PDF pp. 4, 7, 23; DEC-003/004 | Transiciones y motivo; vencimiento explícito; bloqueo antes de autorización |
| Pedido deriva de cotización aceptada, sin redigitación ni duplicar al consultar | PDF pp. 4, 8 | Mismo pedido al repetir; historial sin evento duplicado; copia de importes |
| Aprobar pedido solo con identificación, disponibilidad y crédito favorables, revisados nuevamente por otra Jefatura | PDF pp. 5, 9, 23 | Stock insuficiente/ausente, crédito insuficiente/vencido/ausente, control que cambia después de validar; autoaprobación rechazada |
| Consultar cantidades atendidas y pendientes sin registrar salidas desde Comercial | PDF pp. 8, 10–11 | Atención parcial/completa, sobreentrega rechazada, misma referencia idempotente, respuesta contradictoria no sobrescribe la anterior |
| Anulación con motivo y revisión, sin borrar documentos ni ignorar entregas/facturas nuevas | PDF pp. 8, 15, 23 | Pedido conservado; entrega externa aparecida después de solicitar impide autorizar anulación |
| Devolver hasta la cantidad entregada disponible; esperar recepción, nota y ajuste de sus áreas | PDF pp. 15–16 | Excesos y doble solicitud rechazados; booleans sin documentos no completan; referencias de tres áreas completan el seguimiento |
| Separar roles, sede y registro de operaciones de otros módulos | PDF pp. 3, 5, 23; indicación de Luis | Siete roles, documentos de otra sede no operables, ausencia de formularios de cobro en áreas pendientes |
| Reportar conversión, descuentos, ticket, margen estimado y pendientes sin confundirlos con cobros/asientos | PDF p. 24 | Indicadores y filtros de fecha/canal/sede; costes solo para Jefatura; anulación no deja unidades pendientes |

Pruebas: [46 casos de reglas](../tests/interfaz/comercial.test.cjs) y [54 comprobaciones de pantalla](../tests/interfaz/navegador.cjs). Los resultados de la primera entrega (41 comprobaciones) se conservan como históricos y no sustituyen esta regresión.
