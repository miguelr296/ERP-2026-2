# Pantallas de Logística

[Índice](../../README.md) · [Fuente](../fuentes/sesion-10-gestion-logistica.pdf) · [Reglas y pruebas](../reglas-logisticas.md) · [Contratos](../contratos/integracion-logistica.md)

## Alcance implementado

Para la mueblería con tres sedes se eligió el recorrido necesidad → abastecimiento → recepción/calidad → inventario → reserva/preparación → despacho/entrega, con retornos, traslados, conteo y control. Compras y Despachos conservan sus entradas en Aplicaciones; comparten el servicio propietario de Logística. Inventarios pasa a llamarse Logística; las rutas antiguas `#inventarios` siguen abriendo el área.

| Proceso | Pantallas y comportamiento |
|---|---|
| Planificación | Previsión por mes/producto y sede, mínimos/objetivo configurables, demanda comercial, compras pendientes y sugerencia de necesidad |
| Abastecimiento | Necesidades con revisión independiente; proveedores propuestos/revisados; petición a proveedores, ofertas comparables por importe/plazo/calidad y adjudicación motivada |
| Compra | Acuerdo marco con vigencia y máximo acumulado; OC desde oferta o acuerdo, copia de precios/proveedor, aprobación, emisión registrada y confirmación del proveedor |
| Recepción y calidad | Recepciones parciales con documento/lote; ingreso en cuarentena; inspección conforme/no conforme; devolución al proveedor y reposición pendiente |
| Almacén | Existencia física, disponible, reservada, cuarentena y dañada; kardex con referencias; posiciones/capacidades configuradas; conteo de disponible y ajuste tras otra revisión |
| Distribución | Pedido comercial aprobado, reserva por ubicación/lote, picking, embalaje, salida y guía interna, ruta y entrega total/parcial/fallida con receptor/constancia |
| Retornos | Lo no entregado vuelve solo con recepción física. Devolución de cliente requiere autorización de Comercial y conserva su referencia; cuarentena con resolución motivada |
| Traslados | Solicitud y revisión, salida de origen, tránsito y recepción parcial/completa desde la sede destino; no duplica existencias durante el transporte |
| Facturas | Cotejo OC/recepción conforme/factura; diferencias observadas, revalidación con historial y consulta para Finanzas. No registra pagos |
| Control | Evaluación del proveedor desde recepciones, indicadores de entrega/calidad/conteo y acciones de mejora con evidencia/cierre independiente |

Cada ficha conserva estado, responsable, sede, historia y referencias de origen/derivados disponibles. Se imprime la ficha con marca y referencias, sin controles. Los catálogos compartidos se consultan mediante contratos; no se editan documentos comerciales desde Logística.

## Entradas y responsabilidades

Abrir [http://localhost:5300/](http://localhost:5300/) con el servidor indicado en README. Seleccionar rol y sede antes de elegir módulo. Se mantienen ocho aplicaciones y se añade el rol Transporte al selector.

| Persona/rol de prueba | Entrada | Responsabilidad |
|---|---|---|
| Luis / Asesor | Logística → Necesidades | Plantear abastecimiento, incluida la acción desde un pedido bloqueado por stock; consultar sus solicitudes |
| Pablo / Compras | Compras o Logística | Proveedores, necesidades, ofertas, OC, cotejo, planificación y evaluación |
| Luis / Almacén | Logística o Despachos | Recibir/inspeccionar, reservar, preparar, embalar, registrar salida, recibir retornos/traslados y contar |
| Ana / Transporte | Despachos | Confirmar ruta y entrega con constancia; sin movimientos de almacén ni compras |
| Miguel / Jefatura | Logística | Revisiones, adjudicación, parámetros, resolución de cuarentena y cierre de acciones |

Una persona no resuelve su propuesta cambiándose a Jefatura. Los roles son de interfaz y no sustituyen autenticación/autorización de servidor. Tesorería, Facturación y Contabilidad no operan Logística.

## Recorrido para comprobar manualmente

Usar documentos ficticios únicos para no repetir los ya guardados. No borrar el almacenamiento para repetir una prueba con registros que interese conservar.

1. **Luis / Asesor / Lima Centro:** Logística → Necesidades → Nueva necesidad; SOF-001, 3 unidades, almacén Lima Centro, fecha requerida y motivo. Debe quedar Pendiente.
2. **Miguel / Jefatura:** abrir la necesidad y aprobar con motivo. El autor con otro rol no puede aprobarla.
3. **Pablo / Compras:** Peticiones de oferta → seleccionar necesidad e invitar Muebles del Bosque y Diseño y Hogar. Registrar ofertas de S/ 1000 y S/ 1100 por unidad, con vigencia, plazo y calidad. Comparar sus bases: S/ 3000 y S/ 3300.
4. **Miguel / Jefatura:** adjudicar una oferta con motivo. **Pablo / Compras:** preparar OC desde ella. Miguel aprueba; Pablo marca emitida y registra referencia de confirmación. La acción no envía mensajes externos.
5. **Pablo / Compras:** verificar factura por 3 unidades a S/ 1000, base S/ 3000. Antes de la recepción conforme debe quedar Observada.
6. **Luis / Almacén:** Recepción y calidad → recibir 2 unidades con documento y lote. El físico en cuarentena aumenta; disponible no aumenta. Inspeccionar Conforme hacia RACK-A: disponible aumenta en 2. Recibir la unidad restante y probar No conforme → Devolver al proveedor → recibir reposición con otro documento/lote → Conforme.
7. **Pablo / Compras:** abrir la factura observada → Revalidar cotejo. Debe quedar Verificada, IGV S/ 540 y pago Pendiente de Finanzas. Con precio/base incorrectos conserva las diferencias.
8. **Luis / Asesor:** en Comercial crear cotización desde una oportunidad, marcar enviada/aceptada y crear pedido. Validar y aprobar con Miguel. Su disponibilidad debe indicar Logística como origen.
9. **Luis / Almacén:** Reservas → pedido aprobado; luego Picking → preparar → embalar; Despachos → seleccionar picking y completar vehículo/conductor. Reservar reduce disponible; despachar reduce físico. Ninguna de esas acciones confirma entrega.
10. **Ana / Transporte:** abrir despacho → salida a ruta → entrega con fecha, receptor y constancia. Probar parcial/0 en otro despacho: genera retorno pendiente sin reponer stock. Luis recibe físicamente ese retorno y elige calidad/ubicación.
11. **Luis / Asesor:** consultar seguimiento del pedido en Comercial: muestra las cantidades realmente entregadas. Solicitar devolución y autorizar con Miguel. En Logística, Luis recibe el retorno autorizado: entra en cuarentena. Comercial recupera la referencia DEV; sigue pendiente de nota y ajuste de sus áreas.
12. **Luis / Almacén:** solicitar traslado a Los Olivos, aprobar con Miguel y registrar salida. Cambiar a sede Los Olivos para recibirlo con documento/fecha; puede ser parcial. Verificar origen, tránsito y destino.
13. Registrar conteo del lote/ubicación disponible; revisar teórico, contado y diferencia antes de aprobar con otra Jefatura. Un movimiento posterior al conteo o un ajuste que invada reservas bloquean su aplicación.
14. Revisar previsión/parámetros/sugerencia, acuerdo marco y su OC, evaluación e indicadores. Una acción correctiva pasa Pendiente → En curso → Por verificar → Completada, con evidencia y cierre por otra Jefatura.
15. Recargar una ficha, cambiar sede, salir y volver. Imprimir despacho y comprobar cliente, fecha, productos, cantidades, referencias y responsables. Probar móvil: menú, tablas desplazables y formularios.

## Validación ejecutada por el asistente

- Reglas: **54 casos Logística + 46 de Comercial = 100 superados**, 0 fallidos/omitidos, Node.js sin dependencias.
- Navegador: **49 comprobaciones de Logística** con sus contratos y **56 de regresión Comercial**, 0 excepciones JavaScript. Se prueban escritorio, móvil de 390 px, ocho roles, sedes, recarga y salida. Contextos aislados eliminados al terminar, sin escribir en el perfil del usuario.
- PDF de despacho: **A4, una página** para la ficha de prueba. Se comprueba ausencia de controles y conservación de origen, responsables y constancia. No acredita impresión física.
- Evidencias locales: `%TEMP%/famihogar-logistica-validacion` y `%TEMP%/famihogar-comercial-validacion`; scripts reproducibles en README. Los resultados no se presentan como CI ni como comprobaciones manuales de Luis.

## Límites concretos

Confirmación personal de Luis: **1 hora real (60 minutos)** dedicada a Logística y revisión de las pantallas de Luis/Asesor, Compras, Despachos y Jefatura. Esta declaración es distinta de las comprobaciones automatizadas anteriores; no confirma individualmente todos sus casos.

- Persistencia y correlativos por navegador; comandos secuenciales sobre copia con una escritura final, sin transacciones distribuidas ni garantía entre pestañas/equipos. Los datos del sitio no son una base compartida.
- Tres almacenes configurados, uno por sede; posiciones y capacidades en unidades. La previsión es una comparación de demanda/saldo/entradas, no un optimizador ni pronóstico estadístico.
- La inspección resuelve la recepción completa. Los no conformes se devuelven al proveedor; no se implementan reparaciones, eliminación física, inspección parcial por línea ni fabricación/subcontratación industrial. El conteo cubre stock Disponible, no la existencia en cuarentena/dañada.
- Lotes y costes sirven a trazabilidad; no hay cálculo contable de valorización. Guías internas, sin emisión tributaria/SUNAT, geolocalización, transporte contratado ni envío automático a proveedores.
- Crédito, facturas de venta y ajustes financieros conservan respuestas de contrato pendientes de sus módulos. No hay cobro, pago, nota de crédito ni asiento producido por Logística. El cotejo de proveedor entrega evidencia a Finanzas.
- [Tarjeta #118](https://github.com/miguelr296/ERP-2026-2/issues/118) y [PR #119](https://github.com/miguelr296/ERP-2026-2/pull/119) publicados con autorización de Luis. Revisión de Miguel e integración pendientes; no se marca Done.
