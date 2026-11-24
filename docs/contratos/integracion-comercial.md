# Contratos de consulta de Comercial

[Índice](../../README.md) · [Fuente](../fuentes/sesion-06-sistema-gestion-comercial.pdf) · [Alcance](../pantallas/comercial.md)

`IntegracionesComerciales` publica estas consultas en `integraciones-locales.js`. Delega existencias y entregas a los [contratos de Logística](integracion-logistica.md), y consulta crédito y comprobantes internos de venta en Finanzas/Libros. `FAMIHOGAR_RESPUESTAS` conserva parámetros de ejemplo y respuestas auxiliares para pruebas. La nota de crédito y el ajuste financiero de devolución siguen pendientes.

| Consulta | Propietario | Solicitud / respuesta |
|---|---|---|
| `consultarDisponibilidad(pedido)` | Inventarios | Sede y líneas → código y cantidad disponible o null, origen y momento de consulta |
| `consultarCredito(clienteId, pedidoId)` | Finanzas | Cliente → límite, exposición y vencido en céntimos, excluyendo el pedido evaluado. Datos null si falta configuración |
| `consultarSeguimiento(pedidoId)` | Logística / Facturación | Pedido → salidas, entregas con ID/número/líneas/cantidades y facturas con ID/número/total; fecha de consulta |
| `consultarDevolucion(solicitudId)` | Inventarios / Facturación / Finanzas | Solicitud → referencias de recepción, nota de crédito y ajuste financiero; ausencia significa pendiente |

## Consumo de respuestas

- Datos ausentes no equivalen a stock/crédito favorable. Un pedido a contado no necesita consulta de crédito; ello no afirma que esté pagado.
- Validar el pedido conserva el resultado y su origen. Aprobarlo vuelve a consultar: una respuesta anterior favorable no permite omitir un cambio posterior.
- Aprobar no reserva existencias. Logística informa disponible menos reservas ajenas y retenciones de calidad, y gestiona reserva/salida desde sus pantallas. Anular un pedido sin salida no libera automáticamente su reserva: Almacén anula preparación pendiente y la libera conservando historial.
- Las entregas/facturas se conservan como referencias externas. Se evitan duplicados por ID, sobreentregas y sobreprecios facturados. Una referencia que cambia importes/cantidades se rechaza para revisión; no se reescribe la anterior.
- Una anulación/bloqueo consulta también las salidas nuevas antes de autorizar; una salida aún sin entrega impide cancelar directamente. No borra documentos ni confirma liberaciones de inventario o reversos financieros.
- Una devolución no se completa sin las tres referencias documentales. Comercial no emite nota de crédito ni contabiliza el ajuste.

## Pruebas y límites

Las [pruebas de reglas](../../tests/interfaz/comercial.test.cjs) configuran las respuestas para verificar insuficiencia, ausencia, vencido, cambio después de validar, entrega parcial/completa, exceso y documentos de devolución. El [recorrido de navegador](../../tests/interfaz/navegador.cjs) introduce datos de respuesta únicamente en su contexto aislado, que elimina al finalizar.

Las [pruebas integradas en navegador](../../tests/interfaz/logistica-navegador.cjs) verifican disponibilidad, entrega, comprobante, exposición tras un cobro y referencias de devolución. El crédito inicial es de demostración. Jefatura puede ajustar el límite en Finanzas.
