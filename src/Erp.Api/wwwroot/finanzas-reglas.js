"use strict";

window.Finanzas = (() => {
  const L = window.Libros;
  const permitir = actor => L.permitir(actor, ["Tesorería", "Jefatura"]);
  const cuentas = { caja: { nombre: "Caja", contable: "101" }, banco: { nombre: "Banco principal", contable: "104" } };
  const tiposComprobante = { factura: "Factura", boleta: "Boleta" };
  const rutaComprobante = d => "facturacion/comprobantes/" + d.id;
  const aprobados = new Set(["Aprobado", "Parcialmente atendido", "Atendido", "Facturado"]);
  const rutaDocumento = d => "finanzas/" + (d.tipo === "venta" ? "cobrar/" : "pagar/") + d.id;
  const movimientosDocumento = (d, doc) => d.movimientos.filter(m => m.documentoId === doc.id);
  const saldo = (d, doc) => doc.total - movimientosDocumento(d, doc).reduce((n, m) => n + m.importe, 0);
  const signo = m => m.direccion === "Ingreso" ? m.importe : -m.importe;
  const saldoCuenta = (d, sede, cuenta, fecha = "9999-12-31") => L.enSede(d.movimientos, sede)
    .filter(m => m.cuenta === cuenta && m.fecha <= fecha).reduce((n, m) => n + signo(m), 0);
  const pagosPendientes = (d, id) => d.pagos.filter(p => p.documentoId === id && ["Programado", "Aprobado"].includes(p.estado));
  const disponibleParaProgramar = (d, doc) => saldo(d, doc) - pagosPendientes(d, doc.id).reduce((n, p) => n + p.importe, 0);

  function estadoCuenta(d, doc) {
    const pendiente = saldo(d, doc);
    if (!pendiente) return doc.tipo === "venta" ? "Cobrada" : "Pagada";
    if (doc.vence < L.hoy()) return "Vencida";
    return pendiente < doc.total ? "Parcial" : "Pendiente";
  }

  function documento(d, actor, id, tipo) {
    const doc = L.obtener(d.documentos, id, actor);
    L.exigir(doc.tipo === tipo, "Selecciona un documento del tipo correcto.");
    return doc;
  }

  function registrarDocumento(d, actor, doc, lineas) {
    const { fecha, vence, base, igv } = doc;
    L.fechaOperacion(d, actor, fecha, doc.fechaOrigen);
    L.exigir(L.fechaValida(vence) && vence >= (doc.fechaFactura || fecha), "El vencimiento debe ser igual o posterior a la fecha del comprobante.");
    L.exigir(L.entero(base, 1) && L.entero(igv) && L.entero(base + igv, 1), "Importes del documento no válidos.");
    L.exigir(!d.documentos.some(x => x.tipo === doc.tipo && x.origenId === doc.origenId), "El documento ya está registrado.");
    L.exigir(!d.documentos.some(x => x.tipo === doc.tipo && (doc.tipo === "venta" || x.terceroId === doc.terceroId) && x.referencia === doc.referencia), "La referencia ya está registrada.");
    const registro = L.crear(d.documentos, doc.tipo === "venta" ? "CXC" : "CXP", { ...doc, total: base + igv }, actor, "Cuenta registrada con su documento de origen");
    L.proponer(d, actor, { clave: "documento:" + registro.id, ruta: rutaDocumento(registro), numero: registro.referencia },
      fecha, doc.tipo === "venta" ? "Registro de venta" : "Registro de compra", lineas);
    return registro;
  }

  function ventasDisponibles(d, sede) {
    return window.ContratosComerciales.listarPedidos(sede).filter(p => aprobados.has(p.estado) && !p.facturas?.length &&
      !d.documentos.some(doc => doc.tipo === "venta" && doc.origenId === p.id));
  }

  function entregaCompleta(pedido, entregas) {
    const lineasEntregadas = entregas.flatMap(e => e.lineas);
    return pedido.lineas.length > 0 && pedido.lineas.every(l => lineasEntregadas.filter(x => x.codigo === l.codigo).reduce((n, x) => n + x.cantidad, 0) === l.cantidad);
  }

  function pedidosPorFacturar(d, sede) {
    return ventasDisponibles(d, sede)
      .filter(p => entregaCompleta(p, window.ContratosLogisticos.consultarSeguimiento(p.id).entregas));
  }

  function numerarComprobante(d, tipo) {
    const prefijo = tipo === "factura" ? "FAC-INT-" : "BOL-INT-";
    const referencias = new Set(d.documentos.filter(doc => doc.tipo === "venta").map(doc => doc.referencia));
    let secuencia = d.documentos.filter(doc => doc.tipoComprobante === tipo).length + 1;
    const numero = n => prefijo + String(n).padStart(6, "0");
    while (referencias.has(numero(secuencia))) secuencia++;
    return numero(secuencia);
  }

  function registrarVenta(d, actor, datos) {
    L.permitir(actor, ["Facturación", "Jefatura"]);
    const pedido = ventasDisponibles(d, actor.sede).find(p => p.id === datos.pedidoId);
    L.exigir(pedido, "Selecciona un pedido aprobado y sin comprobante informado.");
    const entregas = window.ContratosLogisticos.consultarSeguimiento(pedido.id).entregas;
    L.exigir(entregaCompleta(pedido, entregas), "El pedido debe tener todas sus unidades entregadas.");
    const fechaOrigen = entregas.map(e => e.fecha).sort().at(-1);
    L.fechaOperacion(d, actor, datos.fecha, fechaOrigen);
    const { tipoComprobante } = datos;
    L.exigir(Object.hasOwn(tiposComprobante, tipoComprobante), "Selecciona Factura o Boleta.");
    L.exigir(tipoComprobante !== "factura" || (pedido.cliente.tipoDocumento === "RUC" && /^\d{11}$/.test(pedido.cliente.documento)),
      "Para emitir una factura interna, el cliente del pedido debe tener RUC.");
    const referencia = numerarComprobante(d, tipoComprobante);
    const { subtotal: base, igv, total } = pedido;
    L.exigir(base + igv === total, "El total del pedido no coincide con su base e IGV.");
    const coste = window.ContratosLogisticos.costoEntregado(pedido.id);
    L.exigir(L.entero(coste), "El costo de salida aún no se puede verificar en el Kardex.");
    const vence = pedido.condicion === "Crédito 30 días" ? L.sumarDias(datos.fecha, 30) : datos.fecha;
    const lineas = pedido.lineas.map(({ codigo, nombre, cantidad, precio, descuento, importe }) =>
      ({ codigo, nombre, cantidad, precio, descuento, importe }));
    return registrarDocumento(d, actor, { tipo: "venta", tipoComprobante, referencia, fecha: datos.fecha, vence, base, igv,
      fechaOrigen, condicion: pedido.condicion, tercero: pedido.cliente.nombre, terceroId: pedido.cliente.id,
      identificacion: [pedido.cliente.tipoDocumento, pedido.cliente.documento].filter(Boolean).join(" "),
      origenId: pedido.id, origenNumero: pedido.numero, entregas: entregas.map(e => e.numero), lineas,
      bruto: pedido.bruto, descuento: pedido.descuento, descuentoBps: pedido.descuentoBps, igvPorcentaje: pedido.igvPorcentaje },
    [L.linea("12", total), L.linea("70", 0, base), L.linea("4011", 0, igv), L.linea("69", coste), L.linea("20", 0, coste)]);
  }

  function comprasDisponibles(d, sede) {
    return window.ContratosLogisticos.listarFacturasVerificadas(sede).filter(f => !d.documentos.some(doc => doc.tipo === "compra" && doc.origenId === f.id));
  }

  function registrarCompra(d, actor, datos) {
    permitir(actor);
    const f = comprasDisponibles(d, actor.sede).find(x => x.id === datos.facturaId);
    L.exigir(f, "Selecciona una factura de proveedor verificada por Logística.");
    const referencia = L.texto(f.documento, "Referencia de factura").toUpperCase();
    return registrarDocumento(d, actor, { tipo: "compra", referencia, fecha: datos.fecha, vence: datos.vence, fechaOrigen: f.fecha, fechaFactura: f.fecha,
      base: f.base, igv: f.igv, condicion: f.condicion, tercero: f.proveedor, terceroId: f.proveedorId, origenId: f.id,
      origenNumero: f.numero, ordenId: f.ordenId, ordenNumero: f.ordenNumero, recepciones: f.recepciones },
    [L.linea("20", f.base), L.linea("4011", f.igv), L.linea("42", 0, f.base + f.igv)]);
  }

  function registrarCompraActivo(d, actor, datos) {
    permitir(actor);
    const proveedor = window.ContratosLogisticos.listarProveedoresAprobados().find(p => p.id === datos.proveedorId);
    L.exigir(proveedor, "Selecciona un proveedor aprobado.");
    const referencia = L.texto(datos.referencia, "Referencia de factura").toUpperCase();
    const recepcion = L.texto(datos.recepcion, "Constancia de recepción");
    L.exigir(!window.ContratosLogisticos.listarFacturasVerificadas().some(f => f.proveedorId === proveedor.id && f.documento.trim().toUpperCase() === referencia), "La factura ya pertenece a un expediente de Logística.");
    L.exigir(L.entero(datos.base, 1) && L.entero(datos.igv), "Importes de adquisición no válidos.");
    return registrarDocumento(d, actor, { tipo: "compra", clase: "activo", referencia, fecha: datos.fecha, vence: datos.vence,
      base: datos.base, igv: datos.igv, tercero: proveedor.nombre, terceroId: proveedor.id, origenId: "activo:" + proveedor.id + ":" + referencia,
      origenNumero: recepcion, descripcion: L.texto(datos.descripcion, "Descripción del bien") },
    [L.linea("33", datos.base), L.linea("4011", datos.igv), L.linea("46", 0, datos.base + datos.igv)]);
  }

  function fijarCredito(d, actor, entrada) {
    L.permitir(actor, ["Jefatura"]);
    L.exigir(L.entero(entrada.limite), "El límite debe ser un importe igual o mayor que cero.");
    L.exigir(window.ContratosComerciales.listarClientes().some(c => c.id === entrada.clienteId), "Selecciona un cliente aprobado.");
    const motivo = L.texto(entrada.motivo, "Motivo", 3);
    const credito = d.creditos.find(c => c.clienteId === entrada.clienteId);
    if (!credito) return L.crear(d.creditos, "CRE", { clienteId: entrada.clienteId, limite: entrada.limite }, actor, motivo);
    credito.limite = entrada.limite;
    L.evento(credito, actor, motivo);
    return credito;
  }

  function consultarCredito(clienteId, pedidoId, inicial) {
    const d = L.leer();
    const credito = d.creditos.find(c => c.clienteId === clienteId);
    if (!credito && !inicial) return null;
    const facturados = d.documentos.filter(doc => doc.tipo === "venta" && doc.terceroId === clienteId && doc.origenId !== pedidoId);
    const pedidos = window.ContratosComerciales?.listarPedidos().filter(p => p.cliente.id === clienteId && p.id !== pedidoId &&
      p.condicion !== "Contado" && aprobados.has(p.estado) && !facturados.some(doc => doc.origenId === p.id)) || [];
    return {
      limite: credito?.limite ?? inicial.limite,
      exposicion: (credito ? 0 : inicial.exposicion) + pedidos.reduce((n, p) => n + p.total, 0) + facturados.reduce((n, doc) => n + saldo(d, doc), 0),
      vencido: (credito ? 0 : inicial.vencido) + facturados.filter(doc => doc.vence < L.hoy()).reduce((n, doc) => n + saldo(d, doc), 0)
    };
  }

  function validarMovimiento(d, actor, entrada, desde = "") {
    L.fechaOperacion(d, actor, entrada.fecha, desde);
    L.exigir(Object.hasOwn(cuentas, entrada.cuenta) && L.entero(entrada.importe, 1), "Selecciona una cuenta e ingresa un importe válido.");
    const referencia = L.texto(entrada.referencia, "Referencia del movimiento").toUpperCase();
    L.exigir(!d.movimientos.some(m => m.sede === actor.sede && m.cuenta === entrada.cuenta && m.referencia === referencia), "La referencia ya está registrada en esta cuenta.");
    if (entrada.cuenta === "caja") {
      const turno = turnoAbierto(d, actor.sede);
      L.exigir(turno && entrada.fecha === turno.fecha, "Abre un turno de caja para la fecha del movimiento.");
    }
    return referencia;
  }

  function movimiento(d, actor, datos, concepto, contrapartida) {
    const turnoId = datos.cuenta === "caja" ? turnoAbierto(d, actor.sede).id : null;
    const registro = L.crear(d.movimientos, "TES", { ...datos, turnoId }, actor, concepto);
    const cuenta = cuentas[registro.cuenta].contable, importe = registro.importe;
    const lineas = registro.direccion === "Ingreso"
      ? [L.linea(cuenta, importe), L.linea(contrapartida, 0, importe)]
      : [L.linea(contrapartida, importe), L.linea(cuenta, 0, importe)];
    const ruta = registro.documentoId ? rutaDocumento(L.obtener(d.documentos, registro.documentoId, actor)) : "finanzas/caja";
    L.proponer(d, actor, { clave: "movimiento:" + registro.id, ruta, numero: registro.numero }, registro.fecha, concepto, lineas);
    return registro;
  }

  function cobrar(d, actor, id, entrada) {
    permitir(actor);
    const doc = documento(d, actor, id, "venta");
    const referencia = validarMovimiento(d, actor, entrada, doc.fecha);
    L.exigir(entrada.importe <= saldo(d, doc), "El cobro supera el saldo pendiente.");
    const registro = movimiento(d, actor, { ...entrada, referencia, documentoId: id, direccion: "Ingreso", tipo: "Cobro" }, "Cobro de " + doc.referencia, "12");
    L.evento(doc, actor, "Cobro aplicado: " + registro.numero);
    return registro;
  }

  function programarPago(d, actor, id, entrada) {
    permitir(actor);
    const doc = documento(d, actor, id, "compra");
    L.exigir(L.fechaValida(entrada.fecha) && entrada.fecha >= L.hoy() && entrada.fecha >= doc.fecha, "Selecciona una fecha de programación igual o posterior a hoy.");
    L.exigir(Object.hasOwn(cuentas, entrada.cuenta) && L.entero(entrada.importe, 1) && entrada.importe <= disponibleParaProgramar(d, doc), "El pago supera el saldo disponible para programar.");
    return L.crear(d.pagos, "PAG", { documentoId: id, fecha: entrada.fecha, cuenta: entrada.cuenta, importe: entrada.importe, estado: "Programado" }, actor, "Pago programado");
  }

  function decidirPago(d, actor, id, decision, motivo) {
    L.permitir(actor, ["Jefatura"]);
    const p = L.obtener(d.pagos, id, actor);
    L.exigir(["Aprobado", "Rechazado", "Cancelado"].includes(decision) &&
      (decision === "Cancelado" ? p.estado === "Aprobado" : p.estado === "Programado"), "La decisión no corresponde al estado del pago.");
    L.revisar(actor, p.registradoPor);
    p.estado = decision;
    L.evento(p, actor, decision + ": " + L.texto(motivo, "Motivo", 3));
    return p;
  }

  function debitoDisponible(d, actor, p, fecha) {
    const posteriores = new Set([fecha, ...L.enSede(d.movimientos, actor.sede).filter(m => m.cuenta === p.cuenta && m.fecha > fecha).map(m => m.fecha)]);
    return [...posteriores].every(dia => p.importe <= saldoCuenta(d, actor.sede, p.cuenta, dia));
  }

  function confirmarPago(d, actor, id, entrada) {
    permitir(actor);
    const p = L.obtener(d.pagos, id, actor);
    L.exigir(p.estado === "Aprobado", "Se requiere un pago aprobado y pendiente de confirmar.");
    const doc = documento(d, actor, p.documentoId, "compra");
    const datos = { ...entrada, cuenta: p.cuenta, importe: p.importe };
    const referencia = validarMovimiento(d, actor, datos, p.fecha);
    L.exigir(p.importe <= saldo(d, doc) && debitoDisponible(d, actor, p, datos.fecha), "Saldo insuficiente en la obligación o en la cuenta.");
    const registro = movimiento(d, actor, { ...datos, referencia, documentoId: doc.id, pagoId: id, direccion: "Egreso", tipo: "Pago" }, "Pago de " + doc.referencia, doc.clase === "activo" ? "46" : "42");
    p.estado = "Confirmado";
    L.evento(p, actor, "Pago confirmado: " + registro.numero);
    L.evento(doc, actor, "Pago aplicado: " + registro.numero);
    return registro;
  }

  const turnoAbierto = (d, sede) => d.turnos.find(t => t.sede === sede && t.estado === "Abierto");
  function abrirTurno(d, actor) {
    permitir(actor);
    const fecha = L.hoy();
    L.fechaOperacion(d, actor, fecha);
    L.exigir(!turnoAbierto(d, actor.sede), "Ya hay un turno abierto en esta sede.");
    return L.crear(d.turnos, "CAJ", { fecha, inicial: saldoCuenta(d, actor.sede, "caja"), estado: "Abierto" }, actor, "Turno de caja abierto");
  }

  function cerrarTurno(d, actor, importe, motivo) {
    permitir(actor);
    const t = turnoAbierto(d, actor.sede);
    L.exigir(t && L.entero(importe), "Se requiere un turno abierto y un efectivo contado válido.");
    L.fechaOperacion(d, actor, t.fecha);
    t.esperado = saldoCuenta(d, actor.sede, "caja", t.fecha);
    t.contado = importe;
    t.diferencia = importe - t.esperado;
    t.motivo = t.diferencia ? L.texto(motivo, "Explicación de la diferencia", 3) : "";
    t.estado = "Cerrado";
    L.evento(t, actor, "Cuadre de caja registrado");
    return t;
  }

  function fondoInicial(d, actor, entrada) {
    L.permitir(actor, ["Jefatura"]);
    const referencia = validarMovimiento(d, actor, entrada);
    L.exigir(!L.enSede(d.movimientos, actor.sede).some(m => m.cuenta === entrada.cuenta), "El fondo inicial requiere una cuenta sin movimientos.");
    return movimiento(d, actor, { ...entrada, referencia, direccion: "Ingreso", tipo: "Fondo inicial" }, "Fondo inicial de " + cuentas[entrada.cuenta].nombre, "50");
  }

  function registrarExtracto(d, actor, entrada) {
    permitir(actor);
    L.fechaOperacion(d, actor, entrada.fecha);
    L.exigir(["Ingreso", "Egreso"].includes(entrada.direccion) && L.entero(entrada.importe, 1), "Completa el tipo e importe del extracto.");
    const referencia = L.texto(entrada.referencia, "Referencia bancaria").toUpperCase();
    L.exigir(!L.enSede(d.extractos, actor.sede).some(e => e.referencia === referencia), "La referencia bancaria ya está registrada.");
    return L.crear(d.extractos, "EXT", { ...entrada, referencia, movimientoId: null }, actor, "Partida de extracto registrada");
  }

  function coincidencias(d, extracto) {
    return L.enSede(d.movimientos, extracto.sede).filter(m => m.cuenta === "banco" && m.direccion === extracto.direccion &&
      m.importe === extracto.importe && !d.extractos.some(e => e.movimientoId === m.id));
  }

  function conciliar(d, actor, id, movimientoId) {
    permitir(actor);
    const extracto = L.obtener(d.extractos, id, actor);
    L.exigir(!extracto.movimientoId, "La partida ya está conciliada.");
    const registro = coincidencias(d, extracto).find(m => m.id === movimientoId);
    L.exigir(registro, "El movimiento no coincide o ya está conciliado.");
    extracto.movimientoId = movimientoId;
    L.evento(extracto, actor, "Conciliada con " + registro.numero);
    L.evento(registro, actor, "Conciliado con " + extracto.numero);
    return extracto;
  }

  function consultarComprobantes(pedidoId) {
    return L.leer().documentos.filter(d => d.tipo === "venta" && d.origenId === pedidoId)
      .map(d => ({ id: d.id, numero: d.referencia, total: d.total }));
  }

  function consultarPagoFactura(facturaId, sede) {
    const d = L.leer();
    const doc = L.enSede(d.documentos, sede).find(x => x.tipo === "compra" && x.origenId === facturaId);
    if (!doc) return null;
    const pendiente = saldo(d, doc);
    const estado = pendiente === 0 ? "Pagada" : pendiente < doc.total ? "Pago parcial" : "Cuenta por pagar registrada";
    return { estado };
  }

  return { cuentas, saldo, saldoCuenta, movimientosDocumento, disponibleParaProgramar, estadoCuenta, pedidosPorFacturar, comprasDisponibles, tiposComprobante, rutaComprobante,
    registrarVenta, registrarCompra, registrarCompraActivo, fijarCredito, consultarCredito, cobrar, programarPago, decidirPago, confirmarPago,
    turnoAbierto, abrirTurno, cerrarTurno, fondoInicial, registrarExtracto, coincidencias, conciliar, consultarComprobantes, consultarPagoFactura, rutaDocumento };
})();
