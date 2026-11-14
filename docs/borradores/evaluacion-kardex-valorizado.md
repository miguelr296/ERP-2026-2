# Evaluación aislada del Kardex valorizado

**Fecha:** 2026-11-11  
**Producto:** SOF-001 · Sofá Nube · 3 cuerpos  
**Sede/almacén:** Lima Centro  
**Método aplicado:** Promedio Ponderado Móvil por producto y sede.

## Alcance y aislamiento

El escenario también queda disponible dentro de la aplicación: inicia sesión con Almacén, Compras o Jefatura, abre Logística → Kardex valorizado y pulsa **Ejecutar escenario de evaluación**. Se renderiza una copia temporal con las reglas de negocio reales; al cerrar la vista vuelves al inventario normal. No escribe ni modifica el almacenamiento de la aplicación.

La generación automatizada se comprueba con `node --test --test-isolation=none tests/interfaz/kardex-evaluacion.test.cjs`. El informe local se genera mediante `node scripts/generar-evaluacion-kardex.cjs`, invocando la misma rutina. No se requiere abrir Edge para generar o validar el escenario.

Los actores son roles ficticios de evaluación (`Asesor de prueba`, `Compras de prueba`, `Jefatura de prueba`, `Almacén de prueba`, `Transporte de prueba`). La aprobación atribuida a Jefatura es simulada; no representa una aprobación de Miguel. La confirmación de proveedor y la constancia de entrega también son referencias ficticias. Se cotejó una factura de compra, pero no se registró ningún pago.

## Recorrido trazable generado

1. Existencia inicial de evaluación: 12 unidades a S/ 1,050.00 por unidad, valor total S/ 12,600.00.
2. `REQ-00001`: solicitud de una unidad, aprobada independientemente.
3. `RFQ-00001`: comparación de dos ofertas. `OFE-00001` de prov-madera por S/ 1,200.00 fue seleccionada frente a `OFE-00002` de prov-hogar por S/ 1,250.00.
4. `OC-00001`: compra por S/ 1,200.00, aprobada, emitida y confirmada con referencia ficticia `CP-EVAL-001`.
5. `REC-00001`: ingreso de una unidad en cuarentena, lote `LOTE-EVAL-001`; inspección conforme y liberación a inventario. `VF-00001` quedó verificada por cotejo, sin pago.
6. `COT-2026-00001` → `PV-2026-00001`: pedido de una unidad derivado de la oportunidad del cliente retail y aprobado tras los controles comerciales.
7. `RES-00001` → `PICK-00001` → `DES-00001`: reserva, preparación, embalaje, salida y entrega con constancia de evaluación `CONST-EVAL-001`.

## Resultado del movimiento de salida

Después de recibir la unidad comprada, el saldo previo a la venta fue 13 unidades y S/ 13,800.00. El promedio previo fue S/ 1,061.53846…, redondeado a S/ 1,061.54 (106,154 céntimos). La salida de una unidad se valorizó a ese promedio:

| Saldo antes | Salida | Saldo después |
|---|---|---|
| 13 unidades · S/ 13,800.00 | 1 unidad · S/ 1,061.54 | 12 unidades · S/ 12,738.46 |

El Kardex conserva cinco movimientos en el recorrido del producto: carga inicial, recepción en cuarentena, salida por inspección, liberación a inventario y salida por venta. La salida física tomó el lote inicial `INICIAL`; la regla de valorización actual calcula el costo al nivel de producto y sede, no por PEPS/lote. Los movimientos internos de inspección retiraron y repusieron el mismo valor neto.

## Archivos de consulta local

El script vuelve a generar los siguientes informes ignorados por Git en `TestResults/`:

- `kardex-evaluacion.html`: vista legible con encabezados agrupados de Entradas, Salidas y Saldos finales.
- `kardex-evaluacion.json`: documentos, historiales, cantidades, costos y movimientos usados para el resultado.

La evaluación confirma el comportamiento implementado para este caso reproducible. No valida por sí sola el tratamiento contable de ajustes, devoluciones, traslados, reparaciones o bajas; esos casos requieren revisión con Contabilidad.
