# Reportes

[Inicio](../../README.md) · [Arquitectura y perfiles](../arquitectura.md)

En **Aplicaciones → Reportes**, elige una consulta, activa la sede en la cabecera y selecciona las fechas o el mes. La vista abre inicialmente con el mes actual. **Aplicar filtro** actualiza la consulta. Puedes abrir los documentos enlazados, exportar las tablas con datos a CSV o imprimir el reporte completo desde el navegador.

| Consulta | Datos y criterio | Perfiles principales |
|---|---|---|
| Ventas | Pedidos y cotizaciones por fecha de registro, y comprobantes por fecha de emisión. El total emitido incluye IGV | Asesor consulta pedidos y cotizaciones. Facturación consulta los comprobantes |
| Inventario y compras | Existencias actuales por almacén con físico, reservado, retenido, disponible y estados de calidad. Órdenes y facturas verificadas por fecha | Almacén consulta existencias. Compras también consulta órdenes y facturas |
| Entregas | Órdenes de salida del rango con estado actual, fechas y unidades entregadas | Almacén y Transporte |
| Tesorería | Cuentas pendientes y saldos por cuenta a la fecha final. Ingresos y egresos dentro del rango | Tesorería |
| Contabilidad | Balance mensual de asientos contabilizados, listado de asientos pendientes y contabilizados, y estado de cierre | Contabilidad |

Jefatura y Super Admin pueden consultar todas las vistas. Cada reporte usa los datos de la sede activa y respeta los permisos al abrir una ruta directa. Las consultas, exportaciones y copias impresas se generan a partir de los registros guardados en el navegador.

En Tesorería el corte incluye documentos y movimientos anteriores al inicio del rango si afectan el saldo final. Las existencias de Inventario reflejan el estado actual y las fechas filtran las compras. En Contabilidad, el saldo inicial acumula los asientos contabilizados de meses anteriores.

El CSV contiene encabezados y filas de la tabla elegida. Está en UTF-8, usa punto y coma como separador y expresa los importes en soles. Para guardar un PDF, elige **Imprimir reporte** y selecciona la opción de guardar como PDF del navegador.
