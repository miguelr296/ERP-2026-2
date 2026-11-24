# Contratos de Logística

[Índice](../../README.md) · [Pantallas](../pantallas/logistica.md) · [Reglas](../reglas-logisticas.md)

Las funciones públicas conectan áreas dentro del navegador. Cada área conserva su clave y publica copias; ningún consumidor escribe en el almacenamiento del otro módulo.

## Comercial → Logística

`ContratosComerciales`, publicado en `aplicaciones.js`:

| Consulta | Resultado |
|---|---|
| `listarProductos()` | Catálogo con código, nombre, unidad, coste y estado; solo los aprobados se seleccionan para necesidades |
| `listarPedidos(sede)` | Copia de pedidos, cliente/líneas y condiciones; Logística solo reserva/prepara/despacha si sigue aprobado en su sede |
| `listarDevoluciones(sede)` | Solicitudes comerciales de devolución con origen, estado y cantidades; Logística exige Autorizada y limita recepción acumulada |

Un pedido bloqueado por stock puede abrir Nueva necesidad con sus líneas y referencia; no crea automáticamente OC ni altera inventario.

## Logística → otras áreas

`ContratosLogisticos`, publicado en `logistica-aplicacion.js`:

| Consulta | Resultado / consumidor |
|---|---|
| `consultarDisponibilidad(pedido)` | Físico Disponible menos reservas ajenas y unidades retenidas por incidencias pendientes, por SKU y sede; excluye compromiso del propio pedido para no bloquear su revalidación. Comercial consulta de nuevo al aprobar |
| `consultarSeguimiento(pedidoId)` | `salidas` con identidad/estado para impedir bloqueo/anulación posterior a salida; `entregas` solo con cantidades realmente entregadas, receptor y constancia. Preparado/En ruta/No entregado no generan entrega ficticia |
| `consultarRecepcionDevolucion(solicitudId)` | Referencia `recepcion` cuando se recibe toda la cantidad autorizada; referencias parciales separadas. No produce nota de crédito ni ajuste financiero |
| `listarFacturasVerificadas(sede)` | Identidad del cotejo, comprobante, base, IGV, fecha, proveedor, orden, condición y recepciones. Finanzas usa la referencia al incorporar la cuenta por pagar |
| `listarProveedoresAprobados()` | Identificador y nombre. Finanzas lo usa para registrar compras de activos |
| `consultarInventarioInicial(sede)` | Fecha y valor de las existencias iniciales. Contabilidad lo usa para abrir inventario |
| `costoEntregado(pedidoId)` | Costo valorizado de las unidades entregadas. La emisión de venta exige que pueda verificarse |

`IntegracionesComerciales` delega disponibilidad, salidas, entregas y recepción de devolución a Logística. Facturación valida entrega y costo antes de emitir. La ficha de factura verificada llama a `Finanzas.consultarPagoFactura(facturaId, sede)` para mostrar el estado. La nota de crédito y el ajuste financiero de devolución continúan pendientes.

## Persistencia y límites

- Clave propia `famihogar.logistica.v1`, **esquema 2**, con conversión del esquema 1 sobre copia y publicación en la siguiente operación válida; no borra documentos/movimientos ni importes. Las ubicaciones pertenecen a su almacén, las recepciones conservan cantidades por resultado y se añaden reubicaciones/tratamientos. Comercial conserva `famihogar.comercial.v1` (esquema 2). Se mantienen las sesiones existentes.
- `LogisticaAplicacion.ejecutar` relee, copia, ejecuta y comprueba posiciones/reservas antes de publicar una vez. Un fallo conserva el estado persistido, incluidos los movimientos anteriores.
- No ofrece una transacción entre áreas/pestañas/equipos. Cada preparación/salida vuelve a comprobar el pedido, y los consumidores consultan estado fresco; eso no equivale a un bloqueo distribuido.
- Los movimientos se añaden, no se reescriben. Una devolución/ajuste agrega movimientos con referencia y responsable.
- Los roles limitan los comandos de pantalla; el JavaScript y localStorage son accesibles al navegador. No se afirma autenticación de servidor ni servicio API.

El [recorrido automatizado](../../tests/interfaz/logistica-navegador.cjs) usa datos aislados y verifica compras, recepción, inspección, reparación, reservas, entrega, emisión interna y consulta de pago de proveedor. La reparación conforme aumenta la cantidad aceptada que utiliza el cotejo y conserva la referencia a su recepción.
