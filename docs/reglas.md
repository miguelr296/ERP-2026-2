# Reglas candidatas derivadas del PDF

[Índice](../README.md) · [Fuente](fuentes/Documento_TO_BE_FAMIHOGAR.pdf)

Los estados se actualizan solo con evidencia; no son resultados ni reglas heredadas. COM-001 contrasta detalles; la prueba concreta se escribe con cada tarjeta.
Una regla se marca Verificada solo tras ejecutar su prueba y registrar evidencia.

| ID | Regla | Fuente | Prueba prevista | Estado |
|---|---|---|---|---|
| COM-R01 | Buscar cliente existente antes de crear y vincular oportunidad a cliente/productos/responsable | p. 15, PO.02.P01.SP01.A01 | Crear oportunidad y recuperar relaciones | Parcial: cliente comprobado en COM-006; recorrido completo pendiente |
| COM-R02 | Usar lista vigente y rechazar cambio manual de precio | p. 22, PO.02.P02.SP01.A01 | Lista vencida y precio manipulado rechazados | Pendiente |
| COM-R03 | Descuento exige motivo; fuera de límite requiere aprobación auditada | pp. 4, 23, PO.02.P02.SP01.A02 | Aprobación, rechazo y rol inválido | Pendiente |
| COM-R04 | Cotización deriva de oportunidad y tiene correlativo, vigencia, impuesto y plazo | p. 25, PO.02.P02.SP02.A01 | Origen y cálculo con parámetros de prueba | Pendiente |
| COM-R05 | Registrar envío y aceptación, rechazo con motivo o vencimiento | p. 27, PO.02.P02.SP02.A02 | Transición inválida y rechazo sin motivo | Pendiente |
| COM-R06 | Anticipo requiere comprobante y confirmación de Tesorería para validar pago | p. 29, PO.02.P03.SP01.A01 | Asesor no puede confirmar; pago rechazado bloquea | Pendiente |
| COM-R07 | Sin pago confirmado no hay OV; copiar cliente, líneas y precios sin redigitar | pp. 27, 34–35, PO.02.P04.SP01.A01 | Bloqueo sin pago y copia exacta | Pendiente |
| COM-R08 | La reserva debe poder comprometerse antes de liberar la OV | pp. 18, 34–35 | Reserva vencida bloquea liberación | Pendiente |
| COM-R09 | Aprobaciones registran responsable y momento | p. 4, principios | Recuperar aprobador, rol y fecha | Pendiente |
| COM-T01 | Guardar documento, origen e historial como operación consistente | Diseño del prototipo | Fallo no deja documento sin trazabilidad | Pendiente |
| COM-T02 | Repetir conversión no duplica OV ni despacho | Diseño del prototipo | Misma solicitud produce una OV | Pendiente |
| COM-T03 | Historial inmutable y navegación de relaciones preservadas | Diseño del prototipo | Cambio y borrado de historial rechazados | Pendiente |

No se presuponen porcentajes, plazos ni formatos legales: valores de demostración configurables, acordados y etiquetados como supuestos en COM-001.

## Evidencia parcial de COM-R01 · 2026-11-08

COM-006 agrega búsqueda exacta por documento y reutiliza el alta/consulta por ID de COM-005. `ClientesApiTests` comprueba buscar antes de crear, recuperar el mismo cliente, rechazar duplicados y errores sin crear datos parciales; regresión total: 19 superadas, 0 fallidas y 0 omitidas. La búsqueda facilita el recorrido; no es una precondición HTTP obligatoria del alta.

La comprobación real en SQL Server de Luis, base `ErpFamihogarPruebasLuis`, recuperó por ID y búsqueda el cliente `091cec05-c3e1-4443-ab33-4bb3f2a78743` después de reiniciar la API, con un único evento de alta. [Detalle y límites](borradores/com-006-preparacion.md).

La vinculación completa de oportunidad, productos y responsable no fue comprobada en COM-006 y corresponde al recorrido de COM-009. COM-R01 no se marca Verificada. La búsqueda por documento y su límite de 20 caracteres son decisiones técnicas compatibles con el modelo de COM-005, no nuevos formatos legales atribuidos al PDF.
