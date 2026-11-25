"use strict";

window.GuiasERP = {
  acceso: [
    "Escribe tu nombre y selecciona el rol que corresponde a tu trabajo.",
    "Elige la sede para empezar. Podrás cambiarla desde la cabecera.",
    "Pulsa Ingresar y abre el módulo que necesitas. Para recorrer varios procesos en una presentación, elige Super Admin."
  ],
  aplicaciones: [
    "Elige en la cabecera la sede donde quieres trabajar.",
    "Usa el buscador para encontrar un módulo o abre su botón de ayuda para saber qué tareas reúne.",
    "Las opciones que aparecen al entrar dependen de tu rol."
  ],
  comercial: [
    "En el Recorrido de venta, abre Clientes y verifica que el cliente esté aprobado.",
    "Crea una oportunidad, prepara una cotización y registra la aceptación del cliente.",
    "Crea el pedido y valida sus controles. Jefatura lo revisa antes de que Almacén lo prepare."
  ],
  logistica: [
    "Comprueba la sede en la cabecera y elige Recorrido de compra o Recorrido de entrega. Las demás tareas siguen en el menú.",
    "Para abastecerte, empieza en Planificación o Solicitudes de pedido. Para recibir una compra, abre Órdenes de ingreso.",
    "Si vas a atender una venta, empieza en Reservas con un pedido aprobado. Luego sigue con Picking, embalaje y orden de salida."
  ],
  compras: [
    "Busca una solicitud aprobada y reúne ofertas de proveedores aprobados, o utiliza un acuerdo marco vigente.",
    "Prepara la orden de compra. Tras la aprobación de Jefatura, marca su emisión y registra la confirmación del proveedor.",
    "Cuando Almacén registre la recepción conforme, verifica la factura para que Finanzas pueda incorporarla."
  ],
  despachos: [
    "Comprueba que el pedido comercial esté aprobado. Almacén reserva las unidades, prepara el picking y confirma el embalaje.",
    "Crea una orden de salida con el picking embalado y los datos del transporte.",
    "Transporte inicia la ruta y confirma qué entregó, a quién y con qué constancia. Si quedaron unidades sin entregar, Almacén registra su retorno físico."
  ],
  finanzas: [
    "En Por cobrar, consulta los comprobantes emitidos en Facturación y aplica los cobros.",
    "En Por pagar, incorpora la factura verificada de un proveedor. Programa el pago, pide su aprobación y confirma la operación.",
    "En Caja y bancos, revisa saldos y concilia los movimientos. Contabilidad revisa los asientos que se generan."
  ],
  facturacion: [
    "En Comprobantes, elige un pedido entregado por completo y abre Emitir comprobante.",
    "Revisa el tipo, la fecha y los importes. El ERP asigna el número interno. Puedes abrir la ficha y desde allí imprimirla.",
    "Finanzas puede aplicar el cobro a la cuenta creada. Contabilidad puede revisar el asiento de venta."
  ],
  contabilidad: [
    "En Asientos, abre una operación pendiente y verifica el documento de origen y los importes del Debe y el Haber.",
    "En Activos fijos, registra los bienes comprados por la empresa, su puesta en uso y la depreciación del período.",
    "En Cierre y libros, resuelve los pendientes y consulta el diario, el mayor y el balance de comprobación."
  ],
  reportes: [
    "Abre el Dashboard para ver indicadores, gráficos y alertas de tu sede. Cada sección muestra las consultas de tu perfil.",
    "Indica las fechas y, para Contabilidad, el mes. Pulsa Aplicar filtro antes de exportar.",
    "Descarga Excel o CSV. Para el PDF completo, elige Exportar PDF y selecciona Guardar como PDF en la ventana del navegador."
  ],

  "comercial/clientes": [
    "Busca al cliente por nombre o documento antes de registrar uno nuevo.",
    "En Nuevo cliente, indica su DNI o RUC, segmento y direcciones de entrega, facturación y cobranza.",
    "Jefatura revisa el alta o la actualización en Aprobaciones. Con el cliente aprobado, crea una oportunidad."
  ],
  "comercial/oportunidades": [
    "Selecciona un cliente aprobado en la sede activa y registra qué necesita, por qué canal llegó y qué productos le interesan.",
    "Actualiza el seguimiento en la ficha. Si la oportunidad se pierde, registra el motivo.",
    "Si el cliente quiere una propuesta, abre Cotizaciones y elige esta oportunidad."
  ],
  "comercial/cotizaciones": [
    "Abre Nueva cotización y elige la oportunidad. Revisa la lista vigente del canal, cantidades, fecha de entrega y condición de pago.",
    "Si aplicas un descuento manual, indica el motivo. Los descuentos de más de 5 % hasta 20 % pasan por aprobación.",
    "Marca Enviada y luego registra la decisión del cliente. Una cotización aceptada y vigente permite crear un pedido."
  ],
  "comercial/pedidos": [
    "Crea el pedido desde una cotización aceptada y abre su ficha.",
    "Selecciona Validar controles. Si queda bloqueado, revisa el motivo de identificación, stock o crédito. Si falta stock, puedes solicitar abastecimiento.",
    "Jefatura revisa y aprueba. Después, Almacén reserva el pedido en Logística y aquí puedes actualizar el seguimiento."
  ],
  "comercial/catalogo": [
    "Consulta los productos y su estado. Jefatura puede registrar o proponer cambios en el catálogo.",
    "Completa código, nombre, familia y unidad. Para un producto ya creado, conserva su código.",
    "Cuando se apruebe, verifica que tenga un precio en una lista vigente antes de usarlo al cotizar."
  ],
  "comercial/precios": [
    "Revisa la lista del canal y segmento, su vigencia y los productos incluidos.",
    "Jefatura registra cambios o una promoción. Comprueba sus fechas antes de enviar la propuesta a revisión.",
    "Tras la aprobación, comprueba los precios al preparar una cotización. Las cotizaciones anteriores conservan sus importes."
  ],
  "comercial/aprobaciones": [
    "Abre la propuesta pendiente y comprueba qué datos cambian o qué condición requiere revisión.",
    "Selecciona Aprobar o Rechazar e indica el motivo. Normalmente revisa otra persona de Jefatura.",
    "Vuelve al documento de origen para verificar el nuevo estado y continuar."
  ],
  "comercial/solicitudes": [
    "Abre el pedido de origen. Solicita anulación antes de la salida, o devolución para las unidades ya entregadas.",
    "Indica las cantidades y el motivo. Jefatura revisa la solicitud.",
    "Si se autorizó la devolución, Almacén recibe el retorno. Consulta el seguimiento de la recepción y las referencias de regularización."
  ],
  "comercial/indicadores": [
    "Selecciona las fechas y el canal. Comprueba que la sede de la cabecera sea la que quieres consultar.",
    "Compara cotizaciones, pedidos y conversión. Los importes reflejan la actividad comercial.",
    "Para conocer el saldo o los cobros registrados de una venta, abre Finanzas → Por cobrar."
  ],

  "logistica/grupo/Planificación": [
    "Abre Planificación para comparar demanda, stock disponible y compras en camino.",
    "Registra una previsión cuando corresponda y revisa las cantidades sugeridas.",
    "Si falta stock, genera y envía una solicitud de pedido a revisión."
  ],
  "logistica/grupo/Compras": [
    "Empieza con una solicitud de pedido aprobada y verifica el proveedor.",
    "Pide y compara ofertas o utiliza un acuerdo marco vigente. Prepara la orden de compra y tramita su aprobación.",
    "Después de recibir e inspeccionar los productos, verifica la factura."
  ],
  "logistica/grupo/Recepción": [
    "Abre Órdenes de ingreso para recibir una compra o Retornos y devoluciones para recibir mercadería devuelta.",
    "Registra documento, lote, cantidades y condición física.",
    "Libera las unidades conformes. Usa Deterioro, reparación y bajas si el caso requiere tratamiento."
  ],
  "logistica/grupo/Almacenes": [
    "Comprueba la sede y el almacén. Usa el Kardex para consultar existencias y movimientos.",
    "Gestiona ubicaciones o reubicaciones si cambió la posición interna. Usa Traslados para mover mercadería entre sedes.",
    "Si hay una diferencia con el físico, registra un conteo y envíalo a revisión."
  ],
  "logistica/grupo/Distribución": [
    "Busca el pedido aprobado y reserva sus unidades.",
    "Genera el picking, confirma la preparación y confirma el embalaje.",
    "Crea la orden de salida. Transporte confirma la ruta y la entrega."
  ],
  "logistica/grupo/Control": [
    "Revisa los indicadores de entrega, inspecciones y conteos de la sede.",
    "Usa Evaluación de proveedores para revisar compras recibidas o registra una acción de mejora.",
    "Adjunta evidencia del resultado y solicita revisión para cerrar la acción."
  ],

  "logistica/planificacion": [
    "Revisa los disponibles, la demanda pendiente y lo que viene de compras.",
    "Registra la previsión del período. Jefatura puede ajustar los mínimos y objetivos de reposición.",
    "Si hay una cantidad sugerida, crea una solicitud y envíala a aprobación."
  ],
  "logistica/requisiciones": [
    "En Nueva solicitud de pedido, indica almacén, fecha requerida, motivo y cantidades.",
    "Revisa la solicitud en su ficha. Jefatura la aprueba o rechaza con motivo.",
    "Cuando esté aprobada, Compras puede pedir ofertas o preparar una orden desde un acuerdo vigente."
  ],
  "logistica/proveedores": [
    "Busca el proveedor por su nombre o RUC.",
    "Si falta, registra su identificación, contacto y condición de pago. Si ya existe, propone una actualización.",
    "Tras la aprobación de Jefatura, el proveedor queda disponible para ofertas y acuerdos."
  ],
  "logistica/peticionesOferta": [
    "Elige una solicitud de pedido aprobada que aún permita pedir ofertas.",
    "Selecciona a los proveedores aprobados que cotizarán y guarda la petición.",
    "Cuando lleguen las respuestas, abre Comparación de ofertas y regístralas."
  ],
  "logistica/ofertas": [
    "Registra cada oferta contra la misma petición, con precios, plazo, calidad, vigencia y condición de pago.",
    "Compara las propuestas. Jefatura abre la oferta elegida y adjudica con un motivo.",
    "Usa la oferta adjudicada para preparar una orden de compra."
  ],
  "logistica/acuerdos": [
    "Selecciona un proveedor aprobado e indica productos, cantidades máximas, precios y vigencia.",
    "Jefatura revisa y aprueba el acuerdo.",
    "Al preparar una orden, selecciona el acuerdo vigente y una necesidad compatible."
  ],
  "logistica/ordenes": [
    "Desde la oferta adjudicada, puedes usar el Paso sugerido para preparar la orden con esa oferta seleccionada. También puedes partir de un acuerdo vigente.",
    "Solicita aprobación. Al quedar aprobada, marca la emisión y registra la confirmación recibida del proveedor.",
    "Cuando llegue la mercadería, abre Órdenes de ingreso y vincula la recepción a esta orden."
  ],
  "logistica/facturas": [
    "Selecciona la orden de compra e ingresa documento, cantidades, precio y base de la factura.",
    "El sistema coteja orden, recepción conforme y factura. Si figura Observada, revisa las diferencias y revalida cuando se resuelvan.",
    "Una factura Verificada queda disponible en Finanzas → Por pagar."
  ],
  "logistica/evaluaciones": [
    "Selecciona al proveedor con recepciones registradas.",
    "Revisa los datos de entregas y conformidad. Agrega el comentario de evaluación.",
    "Registra una acción de mejora si identificas una causa que requiere seguimiento."
  ],
  "logistica/recepciones": [
    "Crea la orden de ingreso desde la orden de compra. Ingresa documento, fecha, lote y unidades recibidas.",
    "Abre la ficha y registra la inspección. Puedes separar conformes y observadas o dejar parte pendiente.",
    "Las unidades conformes quedan disponibles. Trata las observadas o devuelve al proveedor las que correspondan."
  ],
  "logistica/tratamientos": [
    "Selecciona las unidades afectadas por lote y ubicación e indica deterioro, reparación o baja, con motivo.",
    "Jefatura revisa la solicitud. Si hay reparación, Almacén presenta su evidencia.",
    "La reinspección define si se recuperan las unidades. Consulta el resultado y los movimientos en el Kardex."
  ],
  "logistica/inventario": [
    "Revisa existencias por almacén. El disponible descuenta las reservas y retenciones de las unidades aptas.",
    "Selecciona un producto para ver entradas, salidas y saldos valorizados por promedio ponderado móvil.",
    "Para ver un ejemplo completo sin guardar operaciones, usa Ejecutar escenario de evaluación."
  ],
  "logistica/almacenes": [
    "Consulta los almacenes de la sede y su estado.",
    "Jefatura puede registrar o editar un almacén. Verifica antes si tiene existencias u operaciones pendientes.",
    "Abre Ubicaciones para revisar las posiciones habilitadas."
  ],
  "logistica/ubicaciones": [
    "Selecciona el almacén correcto y consulta sus posiciones.",
    "Jefatura registra o edita la ubicación, su capacidad y los estados de calidad admitidos.",
    "Con una posición habilitada, Almacén puede usarla al recibir o reubicar existencias."
  ],
  "logistica/reubicaciones": [
    "Elige almacén, producto, lote y ubicación de origen.",
    "Indica cuántas unidades mover y elige una posición de destino que admita su estado y cantidad.",
    "Guarda el movimiento y confirma en el Kardex la salida y la entrada en el mismo almacén."
  ],
  "logistica/reservas": [
    "Selecciona un pedido comercial aprobado en esta sede.",
    "Elige almacén y cantidades. Revisa lo disponible antes de confirmar la reserva.",
    "Abre Picking y embalaje para preparar los artículos reservados."
  ],
  "logistica/picking": [
    "Genera el picking a partir de una reserva activa.",
    "Recoge las unidades indicadas y confirma la preparación. Protégelas y confirma el embalaje.",
    "Con el picking embalado, crea una orden de salida en Despachos."
  ],
  "logistica/despachos": [
    "Selecciona un picking embalado y completa los datos de fecha, transporte y destino.",
    "Transporte abre la orden y confirma la salida a ruta.",
    "En Confirmar entrega, indica las cantidades realmente entregadas, receptor y constancia. Las unidades no entregadas quedan pendientes de retorno físico."
  ],
  "logistica/retornos": [
    "Busca el retorno generado por una entrega incompleta o selecciona la devolución autorizada por Comercial.",
    "Registra la recepción física con documento y cantidades. Elige la ubicación y condición cuando corresponda.",
    "Revisa qué quedó disponible y qué necesita resolución de cuarentena. En una devolución comercial, actualiza su seguimiento."
  ],
  "logistica/traslados": [
    "Solicita el traslado indicando origen, destino, productos y cantidades.",
    "Jefatura aprueba y Almacén despacha desde la sede de origen.",
    "Cambia a la sede de destino y registra las unidades que llegaron. Puedes recibir una parte y completar el resto después."
  ],
  "logistica/conteos": [
    "Selecciona almacén, ubicación, lote, producto y estado de calidad.",
    "Registra el conteo físico y revisa la diferencia respecto al saldo del sistema.",
    "Jefatura revisa el ajuste. Si el saldo cambió desde el conteo, realiza un nuevo conteo antes de enviarlo otra vez."
  ],
  "logistica/acciones": [
    "Registra la causa, el responsable y el plazo de la acción de mejora.",
    "Al iniciarla, actualiza su estado. Al terminar, presenta evidencia del resultado.",
    "Jefatura verifica la evidencia y confirma el cierre."
  ],
  "logistica/control": [
    "Verifica la sede para leer sus indicadores de entrega, calidad y conteo.",
    "Abre los procesos relacionados para ver las operaciones detrás de una diferencia.",
    "Si se necesita seguimiento, registra una acción de mejora con responsable y plazo."
  ],
  "logistica/pedido": [
    "Verifica qué productos y cantidades se pidieron y confirma el destino.",
    "Abre Reservas para comprometer unidades si el pedido está aprobado.",
    "Continúa en Picking y embalaje antes de crear la orden de salida."
  ],

  "finanzas/cobrar": [
    "Abre la cuenta del cliente. Los comprobantes de venta se incorporan al emitirlos en Facturación.",
    "Revisa el vencimiento y el saldo. En Registrar cobro, elige la cuenta, indica el importe real, la fecha y una referencia única.",
    "Verifica el saldo restante y abre el asiento generado. Si cobraste en banco, puedes conciliar el movimiento en Caja y bancos."
  ],
  "finanzas/pagar": [
    "Incorpora la factura verificada por Logística y revisa su vencimiento. Para un bien de uso propio, puedes registrar una compra de activo con su constancia.",
    "En la ficha, Paso sugerido destaca una acción. La tabla de pagos muestra las opciones de cada programación. Jefatura revisa la programación.",
    "Cuando el pago esté efectuado, confírmalo con la fecha y una referencia única. Revisa el saldo y concilia si se pagó por banco."
  ],
  "finanzas/caja": [
    "Abre un turno si vas a usar efectivo. Consulta los saldos antes de pagar.",
    "Al cerrar caja, ingresa lo que contaste y explica la diferencia si existe.",
    "Para conciliar, puedes añadir la partida desde la ficha del cobro o pago. Contrasta los datos sugeridos con el extracto y elige el movimiento del ERP."
  ],
  "contabilidad/asientos": [
    "Abre un asiento Pendiente y revisa el concepto, la fecha y el documento de origen.",
    "Verifica las cuentas y que el total del Debe coincida con el Haber. Selecciona Contabilizar cuando esté conforme.",
    "Consulta el asiento contabilizado en Cierre y libros para el período correspondiente."
  ],
  "contabilidad/activos": [
    "Registra primero la compra del activo en Finanzas → Por pagar.",
    "Da de alta el bien, completa código, responsable, ubicación, vida útil en meses y valor residual. Abre su ficha y registra la fecha de puesta en uso.",
    "Genera la depreciación de un período terminado. Revisa y contabiliza el asiento resultante."
  ],
  "contabilidad/cierre": [
    "Elige el período y revisa su diario, mayor y balance de comprobación.",
    "Paso sugerido propone un pendiente para revisar. Puedes consultar los demás en el orden que prefieras. Revisa los asientos, la depreciación, la caja o las partidas sin conciliar según corresponda.",
    "Cuando el período haya terminado y esté al día, selecciona Cerrar período. El cierre impide registrar nuevas operaciones contables en ese período y sede."
  ],

  "accion/validar-pedido": [
    "Abre un pedido creado desde una cotización aceptada.",
    "Pulsa Validar controles y revisa la identificación, el stock y, si aplica, el crédito.",
    "Si queda pendiente, pide la revisión de Jefatura. Si queda bloqueado, corrige el motivo y vuelve a validar."
  ],
  "accion/inspeccion": [
    "Abre una orden de ingreso con unidades pendientes de inspección.",
    "Indica las cantidades conformes y observadas y la ubicación para las conformes. Puedes dejar unidades pendientes.",
    "Revisa el resultado. Las observadas pueden requerir tratamiento o devolución al proveedor."
  ],
  "accion/entrega": [
    "Abre una orden de salida En ruta y verifica la constancia de entrega.",
    "Indica fecha, receptor y unidades entregadas. Si la entrega fue parcial o fallida, registra el motivo.",
    "Comprueba el estado final. Si hay unidades pendientes de retorno, Almacén registra cuándo regresaron físicamente."
  ],
  "accion/emitir-comprobante": [
    "Elige un pedido con todas sus unidades entregadas.",
    "Selecciona Factura o Boleta y revisa la fecha, el subtotal, el IGV y el total. Para Factura, el pedido debe tener un cliente con RUC.",
    "Confirma la emisión interna. Puedes abrir el comprobante guardado o seguir con otro pedido."
  ],
  "accion/cobro": [
    "Abre la cuenta del cliente y comprueba su saldo.",
    "Indica el importe recibido, la cuenta, la fecha y una referencia única. Si eliges efectivo, debe haber un turno abierto para esa fecha.",
    "Comprueba el saldo actualizado y abre el asiento del cobro si quieres revisar su registro contable."
  ],
  "accion/credito": [
    "Selecciona un cliente aprobado y escribe su nuevo límite en soles.",
    "Registra el motivo del cambio y guarda.",
    "Comercial consultará este límite junto al saldo y las deudas vencidas al validar el próximo pedido a crédito."
  ],
  "accion/compra": [
    "Verifica que la factura esté Verificada en Logística y corresponda a la sede activa.",
    "Selecciónala y revisa la fecha de registro y el vencimiento sugerido.",
    "Abre la cuenta por pagar. Desde la ficha, programa el pago cuando corresponda."
  ],
  "accion/compra-activo": [
    "Elige un proveedor aprobado y reúne su factura y la constancia de recepción.",
    "Ingresa la descripción del bien, las fechas, la base y el IGV. Usa una factura distinta de las ya incorporadas desde Logística.",
    "Ve a Contabilidad → Activos fijos para dar de alta esa compra y registrar la puesta en uso."
  ],
  "accion/programar": [
    "Revisa qué importe sigue disponible para programar en la factura.",
    "Selecciona la cuenta, el importe y la fecha prevista. Guarda el pago como Programado.",
    "Pide aprobación a Jefatura. El saldo se reduce cuando se confirma el pago."
  ],
  "accion/confirmar": [
    "Comprueba que el pago esté aprobado y que la cuenta tenga fondos suficientes.",
    "Registra la fecha y referencia del pago efectuado. El sistema aplica el importe previsto a la factura.",
    "Verifica el saldo y, si el pago fue bancario, concilia el movimiento con el extracto."
  ],
  "accion/conciliar": [
    "Agrega la partida de extracto con su fecha, referencia, tipo e importe.",
    "Pulsa Conciliar junto a esa partida y selecciona un movimiento del mismo tipo e importe. Revisa también la fecha y la referencia antes de elegir.",
    "Confirma y verifica qué movimiento del ERP quedó vinculado."
  ],
  "accion/apertura": [
    "Confirma la sede y revisa el saldo inicial en el Kardex de Logística.",
    "Selecciona una fecha de apertura igual o anterior al primer registro contable de mercaderías.",
    "Abre el asiento generado, revisa el importe y contabilízalo. La apertura se incorpora una sola vez por sede."
  ],
  "accion/contabilizar": [
    "Abre el asiento pendiente y verifica su documento de origen.",
    "Comprueba las cuentas, la fecha y los totales del Debe y Haber.",
    "Pulsa Contabilizar. El asiento quedará disponible en los libros del período."
  ],
  "accion/depreciar": [
    "Comprueba que los activos tengan registrada la fecha de puesta en uso, la vida útil y el valor residual.",
    "Elige un período terminado y pulsa Generar asientos. Se calculan los meses completos de uso.",
    "Revisa y contabiliza los asientos. Cada activo puede generar depreciación una sola vez por período."
  ],
  "accion/cerrar-periodo": [
    "Selecciona un período terminado e identifica los pendientes que muestra la pantalla.",
    "Contabiliza los asientos, genera la depreciación que corresponda y resuelve los pendientes de caja y extracto.",
    "Registra la observación y confirma el cierre. Los libros quedan disponibles para consulta."
  ]
};
