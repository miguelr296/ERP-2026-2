
# Gestión de Tesorería

Entra en **Aplicaciones → Finanzas** y selecciona la sede. El recorrido usa la moneda PEN y registra los importes en céntimos.

## Recorrido por rol

| Rol | Qué hacer |
| --- | --- |
| Jefatura | En **Caja y bancos**, crea una caja o cuenta bancaria con fecha y saldo inicial. En **Pagos programados**, verifica el beneficiario de un pago preparado por otra persona y registra el motivo de aprobación o rechazo. |
| Tesorería | En **Por cobrar**, registra la referencia del documento, cliente, importe y vencimiento. Abre la ficha, elige la cuenta y aplica un cobro parcial o total con la referencia del banco o de la caja. |
| Tesorería | En **Por pagar**, registra el documento o incorpora una factura cotejada de Logística. Indica el vencimiento confirmado con el proveedor. En la ficha, programa un pago parcial o total y selecciona la cuenta bancaria de origen y el identificador de destino. |
| Tesorería | Tras la aprobación, registra el envío desde la fecha programada. Se comprueba el saldo disponible y se reserva ese importe. Registra la confirmación del banco para aplicar el pago a la obligación y crear el movimiento. Un rechazo bancario documentado libera la reserva. |
| Tesorería | En **Conciliación**, importa las líneas del extracto desde un CSV o regístralas una a una. Ingresa el saldo de corte. Confirma la coincidencia exacta o selecciona un movimiento de la misma cuenta, tipo e importe y explica por qué difieren la fecha o referencia. Registra las excepciones pendientes y, desde **Caja y bancos**, las comisiones o intereses que correspondan. |
| Contabilidad o Jefatura | Abre el corte y revisa el saldo del extracto, el tránsito y el libro. Una persona distinta de quien registró el corte puede cerrarlo cuando el saldo ajustado cuadra y las líneas de extracto están conciliadas. El cierre guarda los totales y protege la cuenta de registros con fecha del corte o anterior. |
| Contabilidad | Consulta saldos, partidas y evidencias de pago. El diario patrimonial se consulta desde Contabilidad y sus pagos desde **Finanzas → Pagos patrimoniales**. |

## Escenario de revisión

1. Crea una cuenta de prueba con **S/ 80 000** de saldo inicial.
2. Registra una cuenta por cobrar de **S/ 45 000** y una por pagar de **S/ 70 000**, con vencimiento dentro del horizonte. En **Inicio**, el saldo registrado será **S/ 80 000** y el proyectado **S/ 55 000**.
3. Registra un cobro de **S/ 30 000**. El saldo registrado sube a **S/ 110 000** y quedan **S/ 15 000** por cobrar. Programa el pago de **S/ 70 000** y apruébalo con otra identidad de Jefatura.
4. Registra el envío. En **Caja y bancos**, el saldo continúa en **S/ 110 000** y el disponible baja a **S/ 40 000**. Al confirmar el pago, el saldo registrado también queda en **S/ 40 000**.
5. Registra una línea de salida por **S/ 70 000** con la fecha y referencia de confirmación y concíliala. Si el cobro de **S/ 30 000** sigue en tránsito, el extracto de prueba para el corte puede quedar en **S/ 10 000**. Tesorería registra ese saldo y Contabilidad revisa que el ajustado y el libro coincidan en **S/ 40 000** antes de cerrar.

## Importación de extractos

En **Finanzas → Conciliación → Importar extracto CSV**, selecciona la cuenta bancaria e indica el archivo UTF-8. Usa los encabezados `fecha,referencia,tipo,importe` en ese orden. Este ejemplo usa coma como separador y punto decimal.

```csv
fecha,referencia,tipo,importe
2026-11-19,PAGO-DEMO-01,Salida,70000.00
```

Usa la fecha del extracto en formato AAAA-MM-DD, un tipo `Entrada` o `Salida` y un importe positivo en PEN. Se admiten punto y coma como separador de columnas y coma decimal en un campo entre comillas o separado por punto y coma. Si una referencia contiene un separador, ponla entre comillas dobles. El límite es de 1000 movimientos y 256 KB por archivo.

El sistema valida todas las filas antes de guardar. Si encuentra un error, indica la fila para corregir y volver a intentar. Las líneas ya registradas con la misma cuenta, fecha, referencia, tipo e importe se omiten y se contabilizan al final. El saldo de corte y la confirmación de coincidencias se registran en sus pantallas.

## Estado de la revisión manual

Al cierre, el usuario confirmó las comprobaciones marcadas como confirmadas. Las filas pendientes de revisión manual cuentan con evidencia automatizada del recorrido.

| Verificación | Estado |
| --- | --- |
| Apertura de `Banco de prueba` en Lima Centro, con saldo y disponible de S/ 80 000 | Confirmada por el usuario |
| Cobro de S/ 30 000 de `FV-DEMO-01`, con S/ 15 000 pendientes y saldo/disponible de S/ 110 000 | Confirmada por el usuario |
| Programación y aprobación por Jefatura del pago de S/ 70 000 de `FC-DEMO-01`, con saldo y disponible de S/ 110 000 | Confirmada por el usuario |
| Registro del envío con `ENVIO-DEMO-01`, con saldo de S/ 110 000 y disponible de S/ 40 000 | Pendiente de revisión manual |
| Confirmación con `PAGO-DEMO-01`, con saldo de S/ 40 000 y deuda pendiente de S/ 0 | Pendiente de revisión manual |
| Conciliación de la salida de S/ 70 000 y cierre independiente con extracto de S/ 10 000, cobro en tránsito de S/ 30 000 y saldo ajustado igual al libro de S/ 40 000 | Pendiente de revisión manual |

## Fuente y alcance

| Diapositivas físicas del PPTX | Aplicación en el ERP |
| --- | --- |
| 4–7, 9–14 | Vencimientos, saldos abiertos, cobros parciales, incorporación de facturas verificadas y aprobación de pagos por otra persona. |
| 15–20 | Maestro de caja y bancos, posición por sede, flujo a 7/30/60/90 días y estados de envío y confirmación con referencias documentales. El flujo proyecta las partidas abiertas por vencimiento y desplaza a su fecha programada la porción cubierta por un pago. |
| 21–25 | Libro de bancos, coincidencia exacta o asistida de una línea con un movimiento, comisiones e intereses, partidas en tránsito y cierre con historial. |
| 3, 25–28 | Finanzas consume facturas verificadas mediante el contrato de Logística. Las cuentas por cobrar sin emisión en Facturación se registran por referencia documental. Contabilidad consulta el expediente y el libro como respaldo para sus asientos. |

El circuito se ejecuta en el navegador con almacenamiento local por origen y control de sede y roles de interfaz. Cuando el navegador ofrece Web Locks, la lectura y escritura de cada operación se serializan entre pestañas del mismo origen. Envíos y confirmaciones se registran con datos ingresados por el operador. Las líneas de extracto también se pueden incorporar por archivo CSV. La conexión bancaria, la emisión de comprobantes, el mayor general, la multimoneda y los anticipos sin documento quedan para una entrega posterior. Los pagos de Activos Fijos se registran en su circuito patrimonial.

## Verificación local

```powershell
node --test --test-isolation=none 'tests/interfaz/*.test.cjs'
node tests/interfaz/tesoreria-navegador.cjs 9245
```

La prueba de navegador utiliza el servidor estático y el Chrome headless de prueba indicados en el [README](../../README.md).
