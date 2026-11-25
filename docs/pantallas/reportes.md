# Reportes

[Inicio](../../README.md) · [Arquitectura y perfiles](../arquitectura.md)

En **Aplicaciones → Reportes**, el **Dashboard** muestra indicadores, gráficos y alertas calculados con los registros de la sede activa que puede consultar tu perfil. Los gráficos vacíos indican la ausencia de datos. Entre las alertas se incluyen los pedidos bloqueados, los productos sin disponibilidad, las entregas parciales o fallidas, los vencimientos de tesorería y los asientos pendientes, según el acceso.

La vista abre inicialmente con el mes actual. Usa **Aplicar filtro** para actualizar el rango y el mes contable. Cada área explica el criterio de fechas que usa. **Ver detalle** lleva a la consulta y conserva los filtros.

| Consulta | Datos y criterio | Perfiles principales |
|---|---|---|
| Ventas | Pedidos y cotizaciones por fecha de registro, y comprobantes por fecha de emisión. El total emitido incluye IGV | Asesor consulta pedidos y cotizaciones. Facturación consulta los comprobantes |
| Inventario y compras | Existencias actuales por almacén con físico, reservado, retenido, disponible y estados de calidad. Órdenes y facturas verificadas por fecha | Almacén consulta existencias. Compras también consulta órdenes y facturas |
| Entregas | Órdenes de salida del rango con estado actual, fechas y unidades entregadas | Almacén y Transporte |
| Tesorería | Cuentas pendientes y saldos por cuenta a la fecha final. Ingresos y egresos dentro del rango | Tesorería |
| Contabilidad | Balance mensual de asientos contabilizados, listado de asientos pendientes y contabilizados, y estado de cierre | Contabilidad |

Jefatura y Super Admin pueden consultar todas las vistas. Cada reporte usa los datos de la sede activa y respeta los permisos al abrir una ruta directa. Las consultas, exportaciones y copias impresas se generan a partir de los registros guardados en el navegador.

En Tesorería el corte incluye documentos y movimientos anteriores al inicio del rango si afectan el saldo final. Las existencias de Inventario reflejan el estado actual y las fechas filtran las compras. En Contabilidad, el saldo inicial acumula los asientos contabilizados de meses anteriores.

En el Dashboard, Excel y CSV descargan los indicadores, las alertas y los valores de los gráficos. En el detalle, descargan la tabla elegida. Excel genera un archivo `.xlsx` con hojas **Datos** y **Contexto** (sede, período y perfil). El CSV está en UTF-8, usa punto y coma como separador y expresa los importes en soles. Para el informe completo con el diseño y gráficos disponibles, elige **Exportar PDF** y selecciona **Guardar como PDF** en el navegador.
