# Prueba integrada del ERP

[Configuración local](../README.md#ejecutar-desde-vs-code) · [Arquitectura y perfiles](arquitectura.md) · [Facturación, Finanzas y Contabilidad](pantallas/facturacion-finanzas-contabilidad.md)

## Preparación

Abre el ERP en [localhost](http://localhost:5300/). Para una demostración en una sola sesión, ingresa como **Super Admin** en **Lima Centro**. Para probar con cuentas separadas, usa los perfiles de cada paso y conserva la misma sede. Las revisiones que exigen independencia requieren nombres diferentes. Usa un perfil de navegador separado si quieres un conjunto de datos de prueba independiente.

Los registros se guardan en la vista en que estás. Usa **Ver registro guardado**, la tabla o el menú para abrir otra ficha. Los botones **?** muestran la ayuda y el **Paso sugerido** ofrece un acceso opcional.

## 1. Venta, entrega y comprobante

1. En **Comercial → Ventas**, crea una oportunidad con un cliente aprobado y un producto con stock disponible. Para una primera prueba puedes elegir una unidad de SOF-001 si aún hay stock.
2. Genera una cotización vigente, marca su envío, registra la aceptación y crea el pedido. Valida los controles y aprueba con Jefatura o Super Admin. Comprueba el estado **Aprobado**.
3. En **Logística** o **Despachos**, reserva el pedido. Genera el picking, registra preparación y embalaje y crea la orden de salida.
4. Desde la orden de salida, inicia ruta y registra entrega completa con receptor y constancia. El caso debe figurar como **Entregado**.
5. En **Facturación → Comprobantes**, selecciona el pedido en **Pedidos listos para emitir**. Elige Boleta para un cliente con DNI o Factura para un cliente con RUC, revisa los importes y emite. Comprueba que la ficha aparezca en **Comprobantes emitidos** y que se pueda imprimir.
6. Si quieres seguir la venta desde Comercial, abre el pedido y usa **Consultar seguimiento**. Comprueba que se incorpore el número de comprobante y que el pedido quede **Facturado**.

## 2. Compra y factura verificada

1. En **Compras** o **Logística**, registra una solicitud de pedido y apruébala. Pide y registra ofertas de proveedores aprobados. Compara y adjudica una oferta, o usa el recorrido de acuerdo vigente cuando corresponda.
2. Prepara la orden de compra, registra su aprobación, emítela y confirma la respuesta del proveedor.
3. Crea la orden de ingreso, indica documento y lote, e inspecciona las cantidades. Usa unidades conformes para la primera prueba.
4. En **Compras → Facturas**, registra el número del proveedor y coteja la orden, la recepción conforme y los importes. Para pasar a Finanzas, el resultado debe ser **Verificada**. Si aparece **Observada**, revisa las diferencias antes de revalidar.

## 3. Cobro, pago y conciliación

1. En **Finanzas → Por cobrar**, abre la cuenta creada en la emisión. Registra un cobro por una parte del saldo, con cuenta, fecha y referencia única. Comprueba el nuevo saldo y el asiento del cobro.
2. En **Finanzas → Por pagar**, incorpora la factura verificada del proveedor. Confirma la fecha y el vencimiento y revisa su referencia de Logística.
3. Programa un pago que no exceda el saldo disponible. Jefatura lo aprueba con motivo. Cuando corresponda, confirma el pago con su referencia. Debe haber fondos suficientes en la cuenta elegida. Para una prueba nueva, un cobro en banco puede aportar esos fondos, o Jefatura puede registrar un fondo inicial en una cuenta que todavía esté sin movimientos.
4. Si usas efectivo, abre antes el turno de caja del día. Si usas banco, agrega una partida de extracto con el mismo tipo e importe, verifica la referencia y concilia con el movimiento. Comprueba el estado **Conciliada**. Al finalizar el turno, registra el efectivo contado y explica las diferencias cuando correspondan.

## 4. Asientos, activos y cierre

1. En **Contabilidad → Asientos**, consulta los eventos generados por la emisión, la compra, el cobro y el pago. Abre cada ficha, verifica que Debe y Haber cuadren y contabiliza.
2. Para probar activos, crea una compra de activo con fecha de un período disponible. En **Activos fijos**, registra el alta y la puesta en uso. Si quieres generar depreciación en el primer mes de uso, elige el día 1 de un mes ya transcurrido y abierto, con una compra válida para esa fecha.
3. Genera la depreciación del mes elegible y contabiliza el asiento propuesto.
4. En **Cierre y libros**, selecciona el período y revisa el balance, el diario y el mayor. Cuando el mes haya concluido, resuelve los pendientes mostrados y registra el cierre con observación. Una venta registrada hoy se consulta en el mes actual y su cierre corresponde cuando el mes termine.

## Puntos de control para la presentación

| Momento | Resultado esperado |
|---|---|
| Pedido aprobado | Disponible para reservar en la sede |
| Entrega completa | Pedido disponible para Facturación |
| Comprobante emitido | Cuenta por cobrar y asiento de venta pendiente |
| Factura del proveedor verificada | Disponible para incorporar en Por pagar |
| Confirmación del cobro o pago | El saldo cambia y aparece el asiento de tesorería |
| Contabilización | La operación figura en los libros del mes correspondiente |
| Cierre | Período cerrado y disponible para consulta |
