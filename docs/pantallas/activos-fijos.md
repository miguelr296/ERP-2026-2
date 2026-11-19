# Activos Fijos

[ERP FAMIHOGAR](../../README.md) · [Sesión 10 — Gestión de activos fijos](../fuentes/sesion-10-gestion-activos-fijos.pdf)

Desde Aplicaciones → Activos Fijos, selecciona la sede en la cabecera. Para un recorrido con revisión independiente, usa nombres distintos al ingresar con los roles que registran y revisan.

## Recorrido por rol

| Rol | Pantalla y acción |
| --- | --- |
| Asesor, Almacén, Compras o Jefatura | **Adquisiciones** → **Solicitar inversión**. Registra la clase, centro de costo, descripción del bien, presupuesto sin IGV, fecha requerida y justificación. Cada solicitud cubre un bien. |
| Jefatura | Abre la solicitud de otra persona. Aprueba o rechaza con motivo. |
| Compras | Desde **Compras → Compras de activos fijos**, abre la solicitud aprobada y emite la orden con un proveedor aprobado en Logística. Indica el precio y los costos directamente atribuibles a la puesta en servicio. |
| Almacén | Desde **Logística → Recepción de activos fijos**, abre la orden y registra guía, fecha, serie y resultado de inspección. Una observación exige otra recepción conforme antes del cotejo. |
| Compras | Coteja el número, la fecha, la base y el IGV de la factura contra la orden y la recepción. Identifica si el IGV será recuperable. |
| Contabilidad | Capitaliza y asigna fecha de puesta en servicio, etiqueta, ubicación, custodio, criticidad y los libros. Si la factura corresponde a un mes anterior, registra primero la adquisición en curso. El **Diario patrimonial** muestra las partidas. |
| Tesorería | Desde **Finanzas → Pagos patrimoniales**, registra la referencia y fecha del pago de una obligación. El pago cubre el total pendiente de ese documento. |
| Contabilidad | En **Depreciación**, ejecuta un mes completo automático por libro o registra las unidades desde el plan individual. Revisa saldos en **Conciliación y cierres** antes de cerrar el mes. |
| Almacén y Jefatura | En la ficha, solicita traslado o mantenimiento. Jefatura revisa la solicitud. Almacén puede iniciar y completar la orden técnica con evidencia y documento del gasto cuando corresponda. |
| Contabilidad y Jefatura | Contabilidad solicita mejoras, deterioros, ventas o retiros desde la ficha. Jefatura revisa el movimiento de otra persona y el ERP genera las partidas al aplicarlo. |
| Almacén y Jefatura | Desde la ficha, registra el conteo físico con etiqueta, serie, ubicación, custodio y evidencia. En **Inventario físico**, Jefatura revisa las diferencias y documenta la acción acordada. |

## Ejemplo de la sesión

1. Registra una inversión de S/ 120,000 para el tractor, con centro de costo Campo 30301015. Emite la orden y registra la recepción conforme.
2. Coteja una factura con base S/ 120,000 e IGV recuperable de S/ 21,600. El total es S/ 141,600.
3. Pon el bien en servicio en el mismo mes de la factura. Usa línea recta, 120 meses y residual cero en el libro Contable.
4. En un mes posterior, ejecuta el primer mes completo depreciable. El cargo es S/ 1,000 y el valor neto queda en S/ 119,000.
5. Registra el pago por S/ 141,600 y revisa la compra, la depreciación y el pago en el diario.

## Reglas y decisiones de la interfaz

| Fuente física del PDF | Aplicación en FAMIHOGAR |
| --- | --- |
| pp. 4–6, 8–9 y 18–19 | Flujo de inversión, compra, recepción, factura y puesta en servicio. Los costos directos y el IGV no recuperable integran el costo. La cuenta 339 sirve para adquisiciones en curso y se salda con la capitalización. |
| pp. 10–11 y 16 | Importes en céntimos de PEN. Libros Contable y Tributario con planes independientes y configuración manual. Se admiten línea recta, unidades de producción y saldos decrecientes. Solo el Contable genera partidas por depreciación. |
| pp. 10–12 | La depreciación comienza el mes posterior a la puesta en servicio. Los meses se procesan en orden. Saldos decrecientes aplica la tasa anual al valor neto en doce partes y ajusta al residual al agotar la vida útil. Mejora y deterioro recalculan la base remanente. Para traslado y baja se exige depreciar hasta el mes previo. |
| pp. 4–5 y 12 | Traslados con historial de ubicación, custodio y centro de costo. El mantenimiento rutinario va a gasto. La mejora incrementa costo, el deterioro reduce el valor recuperable del libro Contable y venta o retiro dan de baja costo, depreciación y deterioro. |
| pp. 15–17 | Las cuentas PCGE de referencia se configuran por clase. El cierre bloquea registros patrimoniales con fecha de los periodos cerrados. La conciliación contrasta costo, depreciación y deterioro por activo y recibe el saldo neto del mayor con referencia. Usa el diario completo de los activos asignados a la sede a la fecha de consulta, incluyendo movimientos registrados antes de un traslado. |
| pp. 5 y 17 | El inventario admite el identificador escrito o leído como texto. Contrasta serie, ubicación y custodio y guarda evidencia. El panel incluye valor neto, depreciación, antigüedad, diferencias pendientes y cumplimiento de órdenes técnicas. Se considera disponible un bien crítico en servicio sin una orden de mantenimiento en ejecución. |

## Integración local

- `ContratosLogisticos.listarProveedoresAprobados()` provee una copia del maestro aprobado. Las órdenes, recepciones y facturas patrimoniales se consultan en el circuito de Activos Fijos. Una compra para uso propio queda fuera de las existencias comerciales.
- `ContratosActivos.listarAsientos(sede)` y `ContratosActivos.listarObligaciones(sede)` exponen consultas locales. El pago es un registro con referencia bancaria. El saldo mayor para conciliación se ingresa desde un documento externo.
- `famihogar.activos.v1` guarda los registros en el navegador, con lectura fresca y una escritura por operación. Los roles y sedes son controles de la interfaz local. La foto se referencia por URL y los identificadores QR/RFID se capturan como texto. La emisión de etiquetas, la conexión a bancos, lectores físicos o un libro mayor externo y la sincronización entre equipos quedan fuera del circuito local.
- Las cuentas PCGE, métodos y tasas se usan como parámetros de la interfaz. La configuración tributaria depende de los criterios aplicables al bien de cada empresa.

## Verificación

Desde la raíz del repositorio:

```sh
node --test --test-isolation=none tests/interfaz/*.test.cjs
node tests/interfaz/activos-navegador.cjs 9248
```

El segundo comando usa el servidor estático y un Chromium headless ya iniciado con el puerto indicado. Reproduce el ejemplo con fechas de prueba, recarga, roles, sedes, pantallas móviles y ficha A4. Las pruebas de reglas cubren también libro tributario, mejoras, deterioro, baja, cierres y conciliación.
