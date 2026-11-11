# Pantallas de Logística

[Índice](../../README.md) · [Fuente](../fuentes/sesion-10-gestion-logistica.pdf) · [Reglas y pruebas](../reglas-logisticas.md) · [Contratos](../contratos/integracion-logistica.md)

## Alcance implementado

Para la mueblería con tres sedes se eligió el recorrido necesidad → abastecimiento → recepción/calidad → inventario → reserva/preparación → despacho/entrega, con retornos, traslados, conteo y control. Compras y Despachos conservan sus entradas en Aplicaciones; comparten el servicio propietario de Logística. Inventarios pasa a llamarse Logística; las rutas antiguas `#inventarios` siguen abriendo el área.

| Proceso | Pantallas y comportamiento |
|---|---|
| Planificación | Previsión por mes/producto y sede, mínimos/objetivo configurables, demanda comercial, compras pendientes y sugerencia de necesidad |
| Abastecimiento | Necesidades con revisión independiente; proveedores propuestos/revisados; petición a proveedores, ofertas comparables por importe/plazo/calidad y adjudicación motivada |
| Compra | Acuerdo marco con vigencia y máximo acumulado; OC desde oferta o acuerdo, copia de precios/proveedor, aprobación, emisión registrada y confirmación del proveedor |
| Recepción y calidad | Recepciones parciales con documento/lote; inspección por producto con conformes, observadas y pendientes; devolución de observadas, reparación/reinspección y baja documentada |
| Almacén | Existencia física, disponible, reservada, retenida por incidencia, cuarentena, dañada y en reparación; kardex; maestros de almacenes/ubicaciones; reubicación interna y conteo por estado con revisión |
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
6. **Luis / Almacén:** Recepción y calidad → recibir unidades con documento y lote. El físico en cuarentena aumenta; disponible no aumenta. La inspección permite Conforme, No conforme o Parcial. En Parcial indicar cantidades conformes/observadas por producto; el resto queda pendiente. Solo las conformes aumentan el disponible. Devolver al proveedor afecta únicamente observadas y deja reposición pendiente, sin retirar las conformes.
7. **Pablo / Compras:** abrir la factura observada → Revalidar cotejo. Debe quedar Verificada, IGV S/ 540 y pago Pendiente de Finanzas. Con precio/base incorrectos conserva las diferencias.
8. **Luis / Asesor:** en Comercial crear cotización desde una oportunidad, marcar enviada/aceptada y crear pedido. Validar y aprobar con Miguel. Su disponibilidad debe indicar Logística como origen.
9. **Luis / Almacén:** Reservas → pedido aprobado; luego Picking → preparar → embalar; Despachos → seleccionar picking y completar vehículo/conductor. Reservar reduce disponible; despachar reduce físico. Ninguna de esas acciones confirma entrega.
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
- Lotes y costes sirven a trazabilidad; no hay cálculo contable de valorización. Guías internas, sin emisión tributaria/SUNAT, geolocalización, transporte contratado ni envío automático a proveedores.
- Crédito, facturas de venta y ajustes financieros conservan respuestas de contrato pendientes de sus módulos. No hay cobro, pago, nota de crédito ni asiento producido por Logística. El cotejo de proveedor entrega evidencia a Finanzas.
- El [PR #119](https://github.com/miguelr296/ERP-2026-2/pull/119), asociado a #118, ya está integrado. Estas ampliaciones están en `luis/logistica-pulido` desde `upstream/main` (`dc0fc80`), vinculadas a la [tarjeta #120](https://github.com/miguelr296/ERP-2026-2/issues/120). Luis solicitó su PR; revisión manual de cuatro cambios, revisión de código de Miguel e integración pendientes, sin Done. [Detalle del pulido](../borradores/logistica-pulido.md).
