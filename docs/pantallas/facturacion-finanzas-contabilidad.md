# Facturación, Finanzas y Contabilidad

[Inicio](../../README.md) · [Arquitectura y permisos](../arquitectura.md) · [Prueba integrada](../prueba-integrada.md)

## Facturación

**Aplicaciones → Facturación → Comprobantes** agrupa los pedidos entregados listos para emitir y los comprobantes emitidos. Los perfiles Facturación, Jefatura y Super Admin pueden abrir un pedido elegible o elegirlo en **Emitir comprobante**.

1. El ERP comprueba que todas las cantidades hayan sido entregadas y que el pedido carezca de otro comprobante.
2. El formulario sugiere Factura para cliente con RUC y Boleta para cliente con DNI. Para elegir Factura se exige un RUC en el pedido. Selecciona la fecha y revisa subtotal, IGV y total, tomados de la venta.
3. Al guardar se asigna un correlativo interno `FAC-INT-…` o `BOL-INT-…`. La ficha conserva cliente, líneas, entregas, condición y vencimiento. Se puede imprimir como documento de demostración.
4. Se crean la cuenta por cobrar y el asiento pendiente en la misma operación. Se toma el costo de las unidades entregadas del Kardex. La ficha ofrece enlaces a la cuenta y al asiento para los perfiles con acceso.

La cuenta vence en la fecha del comprobante para contado y a 30 días para el crédito de 30 días. La condición de venta indica el vencimiento, y el cobro se registra como una operación aparte. Los comprobantes históricos guardados se conservan y se pueden consultar desde el listado.

## Finanzas

| Pantalla | Qué puedes hacer | Validaciones relevantes |
|---|---|---|
| **Por cobrar** | Abrir la cuenta creada en Facturación y registrar cobros parciales o totales en caja o banco | Importe dentro del saldo, fecha dentro del período abierto y referencia única por sede y cuenta. Caja requiere turno abierto para la fecha |
| **Por pagar** | Incorporar facturas de proveedor verificadas en Logística o registrar la compra de un activo fijo | Una cuenta por documento de origen. La compra de activo exige proveedor aprobado, comprobante, constancia de recepción, descripción, fecha, vencimiento e importes |
| **Pagos de una cuenta** | Programar, aprobar/rechazar o cancelar según estado y confirmar cuando se efectúa el pago | Programar reserva el importe. Jefatura revisa con motivo y separación de funciones. Confirmar exige aprobación, fecha válida y fondos suficientes en la obligación y la cuenta |
| **Caja y bancos** | Abrir turno, registrar fondo inicial, hacer arqueo, consultar movimientos y conciliar extractos | Un turno abierto por sede. Las diferencias de arqueo requieren explicación. El fondo inicial se registra por Jefatura en una cuenta sin movimientos |
| **Conciliación** | Registrar una partida manual del extracto y vincularla con un movimiento de banco | La coincidencia sugerida usa sede, tipo e importe. Se revisan fecha y referencia antes de confirmar. Cada movimiento admite una conciliación |
| **Crédito de clientes** | Configurar límites con motivo y consultar la exposición | Jefatura ajusta el límite. Comercial consulta exposición y vencidos al revisar pedidos a crédito |

Tesorería ejecuta las operaciones de cobro, pago y caja. Jefatura realiza las decisiones reservadas a su perfil. Super Admin permite mostrar todas las tareas en una misma sesión. La ficha de proveedor verificada refleja el estado de pago que informa Finanzas.

## Contabilidad

### Asientos

**Asientos** muestra los pendientes primero. Cada ficha enlaza el origen disponible y presenta las líneas del Debe y el Haber. **Contabilizar** revisa sede, estado, fecha y cuadre. Al contabilizar, la operación se incorpora al diario, mayor y balance del período.

| Origen | Debe | Haber |
|---|---|---|
| Venta | Clientes (12) y Costo de ventas (69), según el costo registrado | Ventas (70), IGV (4011) y Mercaderías (20), según el costo registrado |
| Compra de mercadería | Mercaderías (20) e IGV (4011) | Proveedores (42) |
| Compra de activo | Propiedad, planta y equipo (33) e IGV (4011) | Obligaciones por activos (46) |
| Cobro | Caja (101) o Bancos (104) | Clientes (12) |
| Pago | Proveedores (42) u Obligaciones por activos (46) | Caja (101) o Bancos (104) |
| Fondo inicial | Caja (101) o Bancos (104) | Capital (50) |
| Apertura de inventario | Mercaderías (20) | Resultados acumulados (59) |
| Depreciación del período | Gasto por depreciación (68) | Depreciación acumulada (39) |

Las cuentas y reglas corresponden al plan simplificado del prototipo. **Incorporar inventario inicial** propone un asiento por sede con el valor de apertura que entrega Logística. Su fecha debe ser igual o anterior al primer registro contable de mercaderías y respetar la fecha del inventario inicial.

### Activos fijos

1. En Finanzas, registra la compra de un activo fijo.
2. En **Activos fijos**, da de alta la ficha desde esa compra con código interno, ubicación, responsable, vida útil y valor residual. El costo de alta toma la base de la compra.
3. Registra la fecha de puesta en uso. La depreciación lineal considera meses completos y distribuye el costo menos el residual a lo largo de la vida útil.
4. Selecciona un período disponible en **Generar depreciación mensual**. El ERP propone un asiento por activo elegible y guarda su referencia en la ficha. Puedes revisar y contabilizar esos asientos desde **Asientos**.

### Cierre y libros

Elige un mes y consulta el balance de comprobación, el diario y el mayor. Los libros se alimentan de los asientos contabilizados. **Cerrar período** registra una observación y valida que el mes haya terminado y que no queden asientos, depreciaciones, turnos abiertos ni partidas de extracto pendientes para ese período. Un mes cerrado queda disponible para consulta y restringe nuevos registros con fecha de ese período.

## Alcance

Los comprobantes son internos y sin validez tributaria. El prototipo registra operaciones de tesorería y conciliaciones manuales. La emisión electrónica, la conexión a bancos, la nota de crédito de devoluciones y su regularización financiera están pendientes.
