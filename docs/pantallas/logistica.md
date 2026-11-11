# Pantallas de Logística

[Índice](../../README.md) · [Fuente](../fuentes/sesion-10-gestion-logistica.pdf) · [Reglas y pruebas](../reglas-logisticas.md) · [Contratos](../contratos/integracion-logistica.md)

## Alcance implementado

Para la mueblería con tres sedes se eligió el recorrido solicitud de pedido → orden de compra → orden de ingreso → kardex valorizado → reserva/preparación → orden de salida, con retornos, traslados, conteo y control. Compras y Despachos conservan sus entradas en Aplicaciones; comparten el servicio propietario de Logística. Inventarios pasa a llamarse Logística; las rutas antiguas `#inventarios` siguen abriendo el área.

| Proceso | Pantallas y comportamiento |
|---|---|
| Planificación | Previsión por mes/producto y sede, mínimos/objetivo configurables, demanda comercial, compras pendientes y sugerencia de solicitud de pedido |
| Abastecimiento | Solicitudes de pedido con revisión independiente; proveedores propuestos/revisados; petición a proveedores, ofertas comparables por importe/plazo/calidad y adjudicación motivada |
| Compra | Orden de compra desde oferta o acuerdo, copia de precios/proveedor, aprobación, emisión registrada y confirmación del proveedor |
| Orden de ingreso | Ingresos parciales con documento/lote y control de calidad; inspección por producto con conformes, observadas y pendientes; devolución de observadas, reparación/reinspección y baja documentada |
| Kardex valorizado | Existencias y movimientos por producto, con saldos y costos valorizados; reubicación interna y conteo por estado con revisión |
| Orden de salida | Pedido comercial aprobado, reserva por ubicación/lote, picking, embalaje, salida y guía interna, ruta y entrega total/parcial/fallida con receptor/constancia |
| Retornos | Lo no entregado vuelve solo con recepción física. Devolución de cliente requiere autorización de Comercial y conserva su referencia; cuarentena con resolución motivada |
| Traslados | Solicitud y revisión, salida de origen, tránsito y recepción parcial/completa desde la sede destino; no duplica existencias durante el transporte |
| Facturas | Cotejo OC/recepción conforme/factura; diferencias observadas, revalidación con historial y consulta para Finanzas. No registra pagos |
| Almacén | Maestros de almacenes/ubicaciones, reubicación interna y conteo por estado con revisión |
| Control | Evaluación del proveedor desde recepciones, indicadores de entrega/calidad/conteo y acciones de mejora con evidencia/cierre independiente |

Cada ficha conserva estado, responsable, sede, historia y referencias de origen/derivados disponibles. Se imprime la ficha con marca y referencias, sin controles. Los catálogos compartidos se consultan mediante contratos; no se editan documentos comerciales desde Logística.

## Entradas y responsabilidades

Abrir [http://localhost:5300/](http://localhost:5300/) con el servidor indicado en README. Seleccionar rol y sede antes de elegir módulo. Se mantienen ocho aplicaciones y se añade el rol Transporte al selector.

| Persona/rol de prueba | Entrada | Responsabilidad |
|---|---|---|
| Luis / Asesor | Logística → Solicitudes de pedido | Plantear abastecimiento, incluida la acción desde un pedido bloqueado por stock; consultar sus solicitudes |
| Pablo / Compras | Compras o Logística | Proveedores, solicitudes de pedido, ofertas, órdenes de compra, cotejo, planificación y evaluación |
| Luis / Almacén | Logística o Despachos | Recibir/inspeccionar, reservar, preparar, embalar, crear órdenes de salida, recibir retornos/traslados y contar |
| Ana / Transporte | Despachos | Confirmar ruta y entrega con constancia; sin movimientos de almacén ni compras |
| Miguel / Jefatura | Logística | Revisiones, adjudicación, parámetros, resolución de cuarentena y cierre de acciones |

Una persona no resuelve su propuesta cambiándose a Jefatura. Los roles son de interfaz y no sustituyen autenticación/autorización de servidor. Tesorería, Facturación y Contabilidad no operan Logística.

## Recorrido para comprobar manualmente

Usar documentos ficticios únicos para no repetir los ya guardados. No borrar el almacenamiento para repetir una prueba con registros que interese conservar.

1. **Luis / Asesor / Lima Centro:** Logística → Solicitudes de pedido → Nueva solicitud de pedido; SOF-001, 3 unidades, almacén Lima Centro, fecha requerida y motivo. Debe quedar Pendiente.
2. **Miguel / Jefatura:** abrir la solicitud de pedido y aprobar con motivo. El autor con otro rol no puede aprobarla.
3. **Pablo / Compras:** Peticiones de oferta → seleccionar solicitud de pedido e invitar Muebles del Bosque y Diseño y Hogar. Registrar ofertas de S/ 1000 y S/ 1100 por unidad, con vigencia, plazo y calidad. Comparar sus bases: S/ 3000 y S/ 3300.
4. **Miguel / Jefatura:** adjudicar una oferta con motivo. **Pablo / Compras:** preparar orden de compra desde ella. Miguel aprueba; Pablo marca emitida y registra referencia de confirmación. La acción no envía mensajes externos.
5. **Pablo / Compras:** verificar factura por 3 unidades a S/ 1000, base S/ 3000. Antes de la recepción conforme debe quedar Observada.
6. **Luis / Almacén:** Órdenes de ingreso → crear el ingreso de unidades con documento y lote. El físico en cuarentena aumenta; disponible no aumenta. La inspección permite Conforme, No conforme o Parcial. En Parcial indicar cantidades conformes/observadas por producto; el resto queda pendiente. Solo las conformes aumentan el disponible. Devolver al proveedor afecta únicamente observadas y deja reposición pendiente, sin retirar las conformes.
7. **Pablo / Compras:** abrir la factura observada → Revalidar cotejo. Debe quedar Verificada, IGV S/ 540 y pago Pendiente de Finanzas. Con precio/base incorrectos conserva las diferencias.
8. **Luis / Asesor:** en Comercial crear cotización desde una oportunidad, marcar enviada/aceptada y crear pedido. Validar y aprobar con Miguel. Su disponibilidad debe indicar Logística como origen.
9. **Luis / Almacén:** Reservas → pedido aprobado; luego Picking → preparar → embalar; Órdenes de salida → seleccionar picking y completar vehículo/conductor. Reservar reduce disponible; despachar reduce físico. Ninguna de esas acciones confirma entrega.
10. **Ana / Transporte:** abrir despacho → salida a ruta → entrega con fecha, receptor y constancia. Probar parcial/0 en otro despacho: genera retorno pendiente sin reponer stock. Luis recibe físicamente ese retorno y elige calidad/ubicación.
11. **Luis / Asesor:** consultar seguimiento del pedido en Comercial: muestra las cantidades realmente entregadas. Solicitar devolución y autorizar con Miguel. En Logística, Luis recibe el retorno autorizado: entra en cuarentena. Comercial recupera la referencia DEV; sigue pendiente de nota y ajuste de sus áreas.
12. **Luis / Almacén:** solicitar traslado a Los Olivos, aprobar con Miguel y registrar salida. Cambiar a sede Los Olivos para recibirlo con documento/fecha; puede ser parcial. Verificar origen, tránsito y destino.
13. Registrar conteo del lote/ubicación disponible; revisar teórico, contado y diferencia antes de aprobar con otra Jefatura. Un movimiento posterior al conteo o un ajuste que invada reservas bloquean su aplicación.
14. Revisar previsión/parámetros/sugerencia, acuerdo marco y su OC, evaluación e indicadores. Una acción correctiva pasa Pendiente → En curso → Por verificar → Completada, con evidencia y cierre por otra Jefatura.
15. Recargar una ficha, cambiar sede, salir y volver. Imprimir despacho y comprobar cliente, fecha, productos, cantidades, referencias y responsables. Probar móvil: menú, tablas desplazables y formularios.

## Nuevas comprobaciones del pulido

1. **Jefatura → Almacenes → Almacenes:** crear un depósito en la sede actual. Recibe posiciones iniciales propias; se pueden añadir más en Ubicaciones. Editar capacidad, nombre y estados admitidos con motivo. No se puede desactivar un almacén/ubicación ocupado o con operaciones pendientes, reducir capacidad bajo su ocupación ni retirar un estado que aún tenga mercancía.
2. **Almacén → Reubicaciones internas:** elegir producto/lote/posición y otro destino del mismo almacén. Se registran salida y entrada enlazadas; no cambia el físico total. Las unidades reservadas o retenidas no se mueven. Los documentos de calidad conservan sus posiciones hasta resolverse.
3. Recibir, por ejemplo, 10 muebles e inspeccionar 8 conformes/2 observados en una operación. La ficha muestra recibido, pendiente, conforme, observado, en reparación, devuelto y baja. El cotejo de factura admite solo cantidades conformes, aunque la OC esté recibida físicamente.
4. En una recepción observada, **Tratar no conformes → Reparación**. Otra Jefatura autoriza. Las unidades pasan a TALLER, estado En reparación, sin volverse disponibles. Almacén presenta evidencia; otra persona con Jefatura reinspecciona. Si pasan, vuelve el disponible y se actualiza la conformidad de compra; si fallan, permanecen no conformes/dañadas según su origen.
5. Para un daño encontrado en inventario, **Deterioro, reparación y bajas → Solicitar tratamiento → Deterioro**. Hasta revisar la solicitud sus unidades quedan retenidas y no se ofrecen a otra venta. La aprobación pasa las unidades a Dañado. Para retirar unidades irrecuperables, solicitar Baja y aprobar con otra Jefatura: resta físico mediante movimiento e historial, sin borrar documentos ni producir asientos.
6. **Inventario físico:** seleccionar Disponible, Cuarentena, Dañado o En reparación. El conteo conserva teórico/contado/diferencia por estado/lote/posición. Los ajustes de Disponible respetan reservas/retenciones. Un movimiento posterior invalida el conteo, incluso si el saldo vuelve a ser el mismo. Una diferencia en mercancía vinculada a calidad pendiente o reparación requiere resolver su documento antes de ajustar, para conservar la trazabilidad.

La planificación reparte la demanda una sola vez entre los almacenes activos de una sede: primero por existencia/entradas disponibles y el faltante en el último almacén. Los mínimos/objetivos siguen siendo por almacén/producto. La conformidad del panel se calcula sobre unidades inspeccionadas, incluidas las recuperadas, y no declara conforme una recepción completa por aceptar solo una parte.

## Validación ejecutada por el asistente

- Reglas: **77 casos Logística + 46 de Comercial = 123 superados**, 0 fallidos/omitidos, Node.js sin dependencias.
- Navegador: **71 comprobaciones de Logística** con sus contratos y **56 de regresión Comercial**, 0 excepciones JavaScript. Incluye ampliaciones de calidad/maestros/reubicación, escritorio, móvil de 390 px, ocho roles, sedes, recarga y salida. Contextos aislados eliminados al terminar, sin escribir en el perfil del usuario.
- PDF de despacho, reparación y cotización: **A4, una página cada ficha de prueba**. Se comprueba ausencia de controles y conservación de producto, resultado, origen, responsables y constancia. No acredita impresión física.
- Evidencias locales: `%TEMP%/famihogar-logistica-validacion` y `%TEMP%/famihogar-comercial-validacion`; scripts reproducibles en README. Los resultados no se presentan como CI ni como comprobaciones manuales de Luis.

## Límites concretos

Confirmación personal de Luis: la entrega anterior (#119) tuvo su propia hora y revisión de pantallas de Asesor, Compras, Despachos y Jefatura. Para este pulido declaró **otra hora real (60 minutos)** y verificó el **punto 1 de la guía nueva: administración de almacenes y ubicaciones**. Inspección parcial, dañados/reparación/baja, conteos por calidad y reubicaciones quedan pendientes de comprobación manual con ayuda de Miguel. Las pruebas automatizadas se registran por separado.

- Persistencia y correlativos por navegador; comandos secuenciales sobre copia con una escritura final, sin transacciones distribuidas ni garantía entre pestañas/equipos. Los datos del sitio no son una base compartida.
- Tres almacenes iniciales, ampliables por sede; posiciones y capacidades en unidades. La previsión es una comparación de demanda/saldo/entradas, no un optimizador ni pronóstico estadístico. RECEPCION, CUARENTENA y TALLER identifican zonas de los recorridos de calidad.
- La inspección parcial, reparación, reinspección, baja con motivo/revisión, reubicación y administración de maestros están implementadas. El conteo incluye estados de calidad; no fuerza diferencias sobre unidades ligadas a un documento de calidad/reparación todavía pendiente. No se implementa fabricación/subcontratación industrial.
- El kardex calcula valorización logística por Promedio Ponderado Móvil; su tratamiento contable y tributario requiere validación de Finanzas/Contabilidad. Guías internas, sin emisión tributaria/SUNAT, geolocalización, transporte contratado ni envío automático a proveedores.
- Crédito, facturas de venta y ajustes financieros conservan respuestas de contrato pendientes de sus módulos. No hay cobro, pago, nota de crédito ni asiento producido por Logística. El cotejo de proveedor entrega evidencia a Finanzas.
- Los PR [#119](https://github.com/miguelr296/ERP-2026-2/pull/119) y [#121](https://github.com/miguelr296/ERP-2026-2/pull/121) están integrados; GitHub muestra #120 cerrada por el PR, aunque su cuerpo conserva cuatro comprobaciones manuales sin marcar. [Detalle del pulido](../borradores/logistica-pulido.md).

## Nombres y valoración del inventario

Los nombres de pantalla son **Orden de compra**, **Orden de ingreso**, **Orden de salida**, **Kardex valorizado** y **Solicitud de pedido**. El sistema presenta un único kardex, valorizado. El Kardex filtra un producto por vez y presenta bloques de Entradas, Salidas y Saldos finales, conservando fecha, tipo, almacén, ubicación, lote, calidad y documento de referencia. Aplica **Promedio Ponderado Móvil por producto y sede**: las entradas toman el costo documentado; cada salida usa el promedio valorizado anterior; el costo unitario final es saldo final valorizado dividido entre cantidad final, redondeado a dos decimales. Los cambios de ubicación y calidad conservan su valor.

En la pantalla Kardex, el botón **Ejecutar escenario de evaluación** construye una corrida temporal de compra, aprobación, recepción, venta y salida con actores simulados. La tarjeta de evaluación usa el mismo cálculo y no escribe en los registros guardados. Se puede cerrar para volver a las existencias de la aplicación.

La política de Promedio Ponderado Móvil requiere validación funcional con Miguel/Contabilidad, en especial traslados, ajustes, devoluciones, reparación y bajas. El libro de compras/ventas, cuentas por pagar/cobrar y Tesorería pertenecen a los módulos financieros/contables y no quedan cubiertos por el kardex logístico.

El caso reproducible de compra a otro costo y salida quedó generado en un entorno Node aislado por `scripts/generar-evaluacion-kardex.cjs`; el alcance, referencias, resultado y limitaciones están en [evaluación del Kardex valorizado](../borradores/evaluacion-kardex-valorizado.md). El informe HTML/JSON se guarda localmente en `TestResults/` y no se importa al navegador.

### Caso manual para distinguir el método

En almacenamiento de prueba, registra una compra de un producto existente a un costo distinto del saldo inicial y luego una salida, sin otros movimientos intermedios. Si el saldo antes de la compra es `q0` unidades y `v0` céntimos, y se reciben `q1` unidades a `c1` céntimos por unidad, la salida debe usar el promedio `redondear((v0 + q1 × c1) / (q0 + q1))`. La tarjeta debe mostrar solo ese producto, la compra en Entradas, la venta en Salidas y el nuevo saldo en Saldos finales. Una salida valorizada al costo promedio y no al costo de la compra más antigua permite distinguir este método de PEPS.
