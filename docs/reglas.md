# Reglas candidatas derivadas del PDF

[Índice](../README.md) · [Fuente](fuentes/Documento_TO_BE_FAMIHOGAR.pdf)

Los estados se actualizan solo con evidencia; no son resultados ni reglas heredadas. COM-001 contrasta detalles; la prueba concreta se escribe con cada tarjeta.
Una regla se marca Verificada solo tras ejecutar su prueba y registrar evidencia.

| ID | Regla | Fuente | Prueba prevista | Estado |
|---|---|---|---|---|
| COM-R01 | Buscar cliente existente antes de crear y vincular oportunidad a cliente/productos/responsable | p. 15, PO.02.P01.SP01.A01 | Crear oportunidad y recuperar relaciones | Verificada: COM-006 + COM-009; ficha y persistencia SQL comprobadas |
| COM-R02 | Usar lista vigente y rechazar cambio manual de precio | p. 22, PO.02.P02.SP01.A01 | Lista vencida y precio manipulado rechazados | Pendiente |
| COM-R03 | Descuento exige motivo; fuera de límite requiere aprobación auditada | pp. 4, 23, PO.02.P02.SP01.A02 | Aprobación, rechazo y rol inválido | Pendiente |
| COM-R04 | Cotización deriva de oportunidad y tiene correlativo, vigencia, impuesto y plazo | p. 25, PO.02.P02.SP02.A01 | Origen y cálculo con parámetros de prueba | Pendiente |
| COM-R05 | Registrar envío y aceptación, rechazo con motivo o vencimiento | p. 27, PO.02.P02.SP02.A02 | Transición inválida y rechazo sin motivo | Pendiente |
| COM-R06 | Anticipo requiere comprobante y confirmación de Tesorería para validar pago | p. 29, PO.02.P03.SP01.A01 | Asesor no puede confirmar; pago rechazado bloquea | Pendiente |
| COM-R07 | Sin pago confirmado no hay OV; copiar cliente, líneas y precios sin redigitar | pp. 27, 34–35, PO.02.P04.SP01.A01 | Bloqueo sin pago y copia exacta | Pendiente |
| COM-R08 | La reserva debe poder comprometerse antes de liberar la OV | pp. 18, 34–35 | Reserva vencida bloquea liberación | Pendiente |
| COM-R09 | Aprobaciones registran responsable y momento | p. 4, principios | Recuperar aprobador, rol y fecha | Pendiente |
| COM-T01 | Guardar documento, origen e historial como operación consistente | Diseño del prototipo | Fallo no deja documento sin trazabilidad | Parcial: rechazo de reserva no deja documento ni historial (COM-008) |
| COM-T02 | Repetir conversión no duplica OV ni despacho | Diseño del prototipo | Misma solicitud produce una OV | Pendiente |
| COM-T03 | Historial inmutable y navegación de relaciones preservadas | Diseño del prototipo | Cambio y borrado de historial rechazados | Pendiente |

No se presuponen porcentajes, plazos ni formatos legales: valores de demostración configurables, acordados y etiquetados como supuestos en COM-001.

## Evidencia parcial de COM-R01 · 2026-11-08

COM-006 agrega búsqueda exacta por documento y reutiliza el alta/consulta por ID de COM-005. `ClientesApiTests` comprueba buscar antes de crear, recuperar el mismo cliente, rechazar duplicados y errores sin crear datos parciales; regresión total: 19 superadas, 0 fallidas y 0 omitidas. La búsqueda facilita el recorrido; no es una precondición HTTP obligatoria del alta.

La comprobación real en SQL Server de Luis, base `ErpFamihogarPruebasLuis`, recuperó por ID y búsqueda el cliente `091cec05-c3e1-4443-ab33-4bb3f2a78743` después de reiniciar la API, con un único evento de alta. [Detalle y límites](borradores/com-006-preparacion.md).

La evidencia de COM-006 cubre la búsqueda por documento; la de COM-009 completa la relación con cliente, productos, sede y responsable. La búsqueda por documento y su límite de 20 caracteres son decisiones técnicas compatibles con el modelo de COM-005, no nuevos formatos legales atribuidos al PDF.

## Evidencia de COM-R01 · 2026-11-09

`OportunidadesApiTests` crea un cliente y una oportunidad por HTTP, consulta su ficha y verifica cliente, documento, productos del catálogo, cantidades, sede, responsable e historial. También comprueba el rechazo de producto desconocido, canal sin catálogo, cantidad inválida, oportunidad sin productos y rol no autorizado, sin persistir oportunidades inválidas. En SQL Server (`ErpFamihogar`), la oportunidad `d8fbc99d-f123-44e8-8432-d048d7a9a260` se recuperó después de reiniciar la API con dos productos y un evento de historial. La migración `20261109181126_OportunidadConProductos` está aplicada. Validación automatizada final: build Release con 0 advertencias y 0 errores; 47 pruebas superadas, 0 fallidas y 0 omitidas. La pantalla no se implementó en COM-009; COM-010/COM-013 cubren el selector y su integración.

## Evidencia parcial de COM-T01 · 2026-11-09

COM-008 agrega los contratos simulados `IReservaDeStock` e `IPagoDeTesoreria` y sus adaptadores de demostración. La reserva se pide al proveedor **antes** de agregar nada a la unidad de trabajo: si Logística simulada rechaza, no se guarda reserva ni historial. `ReservasApiTests` comprueba reserva aceptada con identificador, vigencia e historial, y rechazo por stock con 400, cero reservas y sin evento nuevo. `SimulacionesTests` comprueba aceptación, rechazo por stock, pago confirmado con comprobante y rechazos por comprobante ausente o monto inválido. Total ejecutado: 33 superadas, 0 fallidas y 0 omitidas.

Límites: las pruebas automáticas usan el proveedor en memoria, que no demuestra la clave foránea ni el comportamiento de SQL Server; esa parte se comprobó manualmente en `ErpFamihogar` con la migración `20261109165802_ReservaSimulada` aplicada y una reserva recuperada tras reiniciar la API. COM-R06 sigue Pendiente porque la compuerta de pago y el rol Tesorería se implementan en COM-014; COM-R08 sigue Pendiente porque la liberación de la OV se prueba en COM-017. El adaptador de pago existe y rechaza, pero todavía no lo consume un documento de anticipo.
