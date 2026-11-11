"use strict";

window.ComprasReglas = (() => {
  const L = window.LogisticaReglas;
  const compras = actor => L.permitir(actor, ["Compras", "Jefatura"]);
  const almacen = actor => L.permitir(actor, ["Almacén", "Jefatura"]);
  const proveedor = (datos, id) => { const p = datos.proveedores.find(p => p.id === id && p.estado === "Aprobado"); L.exigir(p, "Selecciona un proveedor aprobado."); return p; };

  function guardarProveedor(datos, entrada, actor) {
    compras(actor);
    L.exigir(/^[0-9]{11}$/.test(entrada.ruc) && entrada.nombre?.trim() && entrada.direccion?.trim(), "Completa RUC, razón social y dirección.");
    L.exigir(!datos.proveedores.some(p => p.ruc === entrada.ruc && p.id !== entrada.id), "Ya existe un proveedor con ese RUC.");
    if (entrada.id) {
      const p = L.obtener(datos.proveedores, entrada.id, actor, true);
      L.exigir(!p.propuesta, "El proveedor tiene una modificación pendiente.");
      p.propuesta = { ...L.copiar(entrada), registradoPor: actor.nombre }; p.historial.push(L.evento(actor, "Actualización de proveedor propuesta")); return p;
    }
    return L.crear(datos.proveedores, "PROV", { ...entrada, estado: "Pendiente" }, actor, "Alta de proveedor propuesta");
  }

  function resolverProveedor(datos, id, aceptar, motivo, actor) {
    L.permitir(actor, ["Jefatura"]); const p = L.obtener(datos.proveedores, id, actor, true);
    L.exigir(p.estado === "Pendiente" || p.propuesta, "No hay una propuesta pendiente.");
    L.independiente(actor, p.propuesta?.registradoPor || p.registradoPor); L.motivo(motivo);
    if (p.propuesta) {
      if (aceptar) { const { id: ignorado, registradoPor: autor, ...cambios } = p.propuesta; Object.assign(p, cambios); }
      delete p.propuesta;
    } else p.estado = aceptar ? "Aprobado" : "Rechazado";
    p.historial.push(L.evento(actor, `${aceptar ? "Aprobación" : "Rechazo"} de proveedor: ${motivo}`));
  }

  function crearRequisicion(datos, entrada, actor, productos) {
    L.permitir(actor, ["Asesor", "Compras", "Almacén", "Jefatura"]);
    L.almacenDe(datos, entrada.almacen, actor); L.validarLineas(entrada.lineas, productos);
    L.exigir(L.fechaValida(entrada.requerida), "Indica una fecha requerida válida.");
    const lineas = entrada.lineas.map(l => ({ ...L.copiar(l), nombre: productos.find(p => p.codigo === l.codigo).nombre, unidad: productos.find(p => p.codigo === l.codigo).unidad }));
    return L.crear(datos.requisiciones, "REQ", { ...entrada, lineas, motivo: L.motivo(entrada.motivo), estado: "Pendiente" }, actor, "Necesidad de abastecimiento registrada");
  }

  function resolverRequisicion(datos, id, aceptar, motivo, actor) {
    L.permitir(actor, ["Jefatura"]); const req = L.obtener(datos.requisiciones, id, actor);
    L.independiente(actor, req.registradoPor); L.exigir(req.estado === "Pendiente", "La solicitud ya está resuelta."); L.motivo(motivo);
    req.estado = aceptar ? "Aprobada" : "Rechazada"; req.historial.push(L.evento(actor, `${req.estado}: ${motivo}`));
  }

  function crearPeticion(datos, entrada, actor) {
    compras(actor); const req = L.obtener(datos.requisiciones, entrada.requisicionId, actor);
    L.exigir(req.estado === "Aprobada", "La necesidad debe estar aprobada.");
    L.exigir(entrada.proveedores.length && new Set(entrada.proveedores).size === entrada.proveedores.length, "Selecciona proveedores sin repetir.");
    entrada.proveedores.forEach(id => proveedor(datos, id));
    L.exigir(!datos.peticionesOferta.some(p => p.requisicionId === req.id && p.estado !== "Anulada"), "La solicitud ya tiene una petición de ofertas.");
    const rfq = L.crear(datos.peticionesOferta, "RFQ", { requisicionId: req.id, proveedores: L.copiar(entrada.proveedores), lineas: L.copiar(req.lineas), requerida: req.requerida, almacen: req.almacen, estado: "Abierta" }, actor, "Petición de ofertas preparada");
    req.historial.push(L.evento(actor, `Petición derivada ${rfq.numero}`)); return rfq;
  }

  function registrarOferta(datos, entrada, actor, hoy) {
    compras(actor); const rfq = L.obtener(datos.peticionesOferta, entrada.peticionId, actor);
    proveedor(datos, entrada.proveedorId);
    L.exigir(rfq.estado === "Abierta" && rfq.proveedores.includes(entrada.proveedorId), "La petición no está abierta para este proveedor.");
    L.exigir(!datos.ofertas.some(o => o.peticionId === rfq.id && o.proveedorId === entrada.proveedorId), "Ya se registró una oferta de ese proveedor.");
    L.exigir(L.fechaValida(entrada.vigenteHasta) && entrada.vigenteHasta >= hoy && L.entero(entrada.plazoDias) && Number.isInteger(entrada.calidad) && entrada.calidad >= 1 && entrada.calidad <= 5, "Revisa vigencia, plazo y valoración de calidad.");
    L.exigir(entrada.lineas.length === rfq.lineas.length && new Set(entrada.lineas.map(l => l.codigo)).size === entrada.lineas.length && entrada.lineas.every(l => rfq.lineas.some(r => r.codigo === l.codigo && r.cantidad === l.cantidad) && L.entero(l.precio)), "La oferta debe cubrir los productos y cantidades solicitados, con precios positivos.");
    const base = entrada.lineas.reduce((n, l) => n + l.cantidad * l.precio, 0);
    const lineas = entrada.lineas.map(l => ({ ...L.copiar(rfq.lineas.find(r => r.codigo === l.codigo)), precio: l.precio }));
    return L.crear(datos.ofertas, "OFE", { ...entrada, lineas, base, estado: "Recibida" }, actor, "Oferta de proveedor registrada");
  }

  function adjudicar(datos, ofertaId, motivo, actor, hoy) {
    L.permitir(actor, ["Jefatura"]); const oferta = L.obtener(datos.ofertas, ofertaId, actor), rfq = L.obtener(datos.peticionesOferta, oferta.peticionId, actor);
    L.independiente(actor, oferta.registradoPor); L.motivo(motivo); proveedor(datos, oferta.proveedorId);
    L.exigir(rfq.estado === "Abierta" && oferta.estado === "Recibida" && oferta.vigenteHasta >= hoy, "La oferta o petición ya no está disponible.");
    rfq.estado = "Adjudicada"; rfq.ofertaId = oferta.id; oferta.estado = "Seleccionada";
    for (const o of datos.ofertas.filter(o => o.peticionId === rfq.id && o.id !== oferta.id)) o.estado = "No seleccionada";
    rfq.historial.push(L.evento(actor, `Proveedor seleccionado: ${motivo}`)); oferta.historial.push(L.evento(actor, `Oferta adjudicada: ${motivo}`));
  }

  function guardarAcuerdo(datos, entrada, actor, productos) {
    compras(actor); proveedor(datos, entrada.proveedorId); L.validarLineas(entrada.lineas, productos);
    L.exigir(L.fechaValida(entrada.desde) && L.fechaValida(entrada.hasta) && entrada.desde <= entrada.hasta && entrada.lineas.every(l => L.entero(l.precio)), "Vigencia o precios del acuerdo no válidos.");
    const lineas = entrada.lineas.map(l => ({ ...L.copiar(l), nombre: productos.find(p => p.codigo === l.codigo).nombre, unidad: productos.find(p => p.codigo === l.codigo).unidad }));
    return L.crear(datos.acuerdos, "ACU", { ...entrada, lineas, estado: "Pendiente" }, actor, "Acuerdo marco propuesto");
  }

  function resolverAcuerdo(datos, id, aceptar, motivo, actor) {
    L.permitir(actor, ["Jefatura"]); const a = L.obtener(datos.acuerdos, id, actor);
    L.independiente(actor, a.registradoPor); L.exigir(a.estado === "Pendiente", "El acuerdo ya fue resuelto."); L.motivo(motivo);
    a.estado = aceptar ? "Aprobado" : "Rechazado"; a.historial.push(L.evento(actor, `${a.estado}: ${motivo}`));
  }

  function crearOrden(datos, entrada, actor, hoy) {
    compras(actor); let req, origen, lineas, proveedorId, condicion;
    if (entrada.ofertaId) {
      const oferta = L.obtener(datos.ofertas, entrada.ofertaId, actor), rfq = L.obtener(datos.peticionesOferta, oferta.peticionId, actor);
      req = L.obtener(datos.requisiciones, rfq.requisicionId, actor); origen = oferta.numero;
      L.exigir(oferta.estado === "Seleccionada" && oferta.vigenteHasta >= hoy, "Selecciona una oferta adjudicada y vigente.");
      lineas = L.copiar(oferta.lineas); proveedorId = oferta.proveedorId; condicion = oferta.condicion;
    } else {
      const acuerdo = L.obtener(datos.acuerdos, entrada.acuerdoId, actor);
      req = L.obtener(datos.requisiciones, entrada.requisicionId, actor); origen = acuerdo.numero;
      L.exigir(acuerdo.estado === "Aprobado" && acuerdo.desde <= hoy && hoy <= acuerdo.hasta, "El acuerdo no está vigente.");
      lineas = req.lineas.map(l => {
        const a = acuerdo.lineas.find(a => a.codigo === l.codigo);
        const comprometida = datos.ordenes.filter(o => o.acuerdoId === acuerdo.id && o.requisicionId !== req.id && !["Anulada", "Rechazada"].includes(o.estado)).flatMap(o => o.lineas).filter(pl => pl.codigo === l.codigo).reduce((n, pl) => n + pl.cantidad, 0);
        L.exigir(a && a.cantidad >= comprometida + l.cantidad, "El acuerdo no cubre la cantidad acumulada solicitada.");
        return { ...L.copiar(l), precio: a.precio };
      });
      proveedorId = acuerdo.proveedorId; condicion = acuerdo.condicion;
    }
    const proveedorElegido = proveedor(datos, proveedorId);
    L.exigir(req.estado === "Aprobada", "La necesidad no está aprobada.");
    L.almacenDe(datos, req.almacen, actor);
    const anterior = datos.ordenes.find(o => o.requisicionId === req.id && !["Anulada", "Rechazada"].includes(o.estado)); if (anterior) return anterior;
    L.exigir(L.fechaValida(entrada.entregaPrevista) && entrada.entregaPrevista >= hoy, "Indica una fecha prevista válida.");
    const base = lineas.reduce((n, l) => n + l.precio * l.cantidad, 0);
    const orden = L.crear(datos.ordenes, "OC", { requisicionId: req.id, ofertaId: entrada.ofertaId || null, acuerdoId: entrada.acuerdoId || null, proveedorId, proveedor: L.copiar(proveedorElegido), origen, almacen: req.almacen, lineas, condicion, base, moneda: "PEN", entregaPrevista: entrada.entregaPrevista, fecha: hoy, estado: "Pendiente" }, actor, "Orden de compra preparada desde documento aprobado");
    req.historial.push(L.evento(actor, `Orden derivada ${orden.numero}`)); return orden;
  }

  function resolverOrden(datos, id, aceptar, motivo, actor) {
    L.permitir(actor, ["Jefatura"]); const o = L.obtener(datos.ordenes, id, actor);
    L.independiente(actor, o.registradoPor); L.exigir(o.estado === "Pendiente", "La orden ya fue resuelta."); L.motivo(motivo);
    o.estado = aceptar ? "Aprobada" : "Rechazada"; o.historial.push(L.evento(actor, `${o.estado}: ${motivo}`));
  }

  function emitirOrden(datos, id, actor, hoy) {
    compras(actor); const o = L.obtener(datos.ordenes, id, actor); proveedor(datos, o.proveedorId);
    L.exigir(o.estado === "Aprobada", "La orden necesita aprobación independiente.");
    o.estado = "Emitida"; o.emitidaEn = hoy; o.historial.push(L.evento(actor, "Orden marcada como emitida; comunicación externa no automatizada"));
  }

  function confirmarOrden(datos, id, referencia, actor) {
    compras(actor); const o = L.obtener(datos.ordenes, id, actor);
    L.exigir(o.estado === "Emitida", "La orden no está pendiente de confirmación.");
    o.confirmacionProveedor = L.motivo(referencia); o.estado = "Confirmada"; o.historial.push(L.evento(actor, `Confirmación del proveedor: ${referencia}`));
  }

  function recibido(datos, ordenId, codigo, soloConforme = false) {
    return datos.recepciones.filter(r => r.ordenId === ordenId).flatMap(r => r.lineas).filter(l => l.codigo === codigo).reduce((n, l) => n + (soloConforme ? l.conforme : l.cantidad - l.devuelta), 0);
  }

  const pendienteInspeccion = l => l.cantidad - l.conforme - l.noConforme - l.devuelta - l.enReparacion - l.baja;
  function actualizarRecepcion(r) {
    const total = campo => r.lineas.reduce((n, l) => n + (campo === "pendiente" ? pendienteInspeccion(l) : l[campo]), 0);
    const cantidad = total("cantidad"), pendiente = total("pendiente");
    r.estado = pendiente ? pendiente === cantidad ? "En inspección" : "Parcialmente inspeccionada" : total("enReparacion") ? "En tratamiento" : total("conforme") === cantidad ? "Conforme" : total("devuelta") === cantidad ? "Devuelta" : total("noConforme") === cantidad ? "No conforme" : total("noConforme") ? "Con observaciones" : total("conforme") ? "Conforme parcial" : "Baja";
  }

  function actualizarOrden(datos, orden) {
    orden.estado = orden.lineas.every(l => recibido(datos, orden.id, l.codigo) === l.cantidad) ? "Recibida" : "Parcialmente recibida";
  }

  function recibir(datos, entrada, actor, config) {
    almacen(actor); const orden = L.obtener(datos.ordenes, entrada.ordenId, actor);
    L.exigir(["Emitida", "Confirmada", "Parcialmente recibida", "Recibida"].includes(orden.estado), "La orden no admite recepción.");
    L.exigir(L.fechaValida(entrada.fecha) && entrada.fecha >= orden.fecha && entrada.documento?.trim() && entrada.lote?.trim(), "Indica fecha, documento de proveedor y lote.");
    L.exigir(!datos.recepciones.some(r => r.ordenId === orden.id && r.documento === entrada.documento), "Ese documento de recepción ya está registrado.");
    L.exigir(entrada.lineas.length && new Set(entrada.lineas.map(l => l.codigo)).size === entrada.lineas.length, "Selecciona productos sin repetir.");
    const lineas = entrada.lineas.map(l => {
      const pedida = orden.lineas.find(p => p.codigo === l.codigo);
      L.exigir(pedida && L.entero(l.cantidad) && recibido(datos, orden.id, l.codigo) + l.cantidad <= pedida.cantidad, "La recepción supera las cantidades de la orden o contiene productos ajenos.");
      return { ...L.copiar(l), nombre: pedida.nombre, unidad: pedida.unidad, coste: pedida.precio, conforme: 0, noConforme: 0, devuelta: 0, enReparacion: 0, baja: 0 };
    });
    const recepcion = L.crear(datos.recepciones, "REC", { ...entrada, lineas, proveedorId: orden.proveedorId, almacen: orden.almacen, estado: "En inspección" }, actor, "Mercancía recibida en cuarentena");
    for (const l of lineas) L.registrarMovimiento(datos, { tipo: "Recepción en cuarentena", almacen: orden.almacen, ubicacion: "RECEPCION", calidad: "Cuarentena", codigo: l.codigo, lote: entrada.lote, cantidad: l.cantidad, coste: l.coste, referencia: recepcion.numero, fecha: entrada.fecha }, actor, config);
    actualizarOrden(datos, orden);
    orden.historial.push(L.evento(actor, `Recepción derivada ${recepcion.numero}`)); return recepcion;
  }

  function inspeccionar(datos, id, conforme, motivo, ubicacion, actor, config) {
    const r = L.obtener(datos.recepciones, id, actor), lineas = r.lineas.filter(l => pendienteInspeccion(l) > 0).map(l => ({ codigo: l.codigo, conformes: conforme ? pendienteInspeccion(l) : 0, observadas: conforme ? 0 : pendienteInspeccion(l) }));
    L.exigir(lineas.length, "La recepción ya fue inspeccionada.");
    return inspeccionarParcial(datos, { recepcionId: id, fecha: r.fecha, motivo, ubicacion, lineas }, actor, config);
  }

  function inspeccionarParcial(datos, entrada, actor, config) {
    almacen(actor); const r = L.obtener(datos.recepciones, entrada.recepcionId, actor); L.motivo(entrada.motivo);
    L.exigir(L.fechaValida(entrada.fecha) && entrada.fecha >= r.fecha, "La fecha de inspección no es válida.");
    L.exigir(entrada.lineas.length && new Set(entrada.lineas.map(l => l.codigo)).size === entrada.lineas.length, "Selecciona líneas sin repetir.");
    let inspeccionadas = 0;
    for (const e of entrada.lineas) {
      const l = r.lineas.find(l => l.codigo === e.codigo), cantidad = e.conformes + e.observadas;
      L.exigir(l && [e.conformes, e.observadas].every(n => Number.isSafeInteger(n) && n >= 0) && cantidad <= pendienteInspeccion(l), "La inspección supera las unidades pendientes.");
      if (!cantidad) continue; inspeccionadas += cantidad;
      const movimiento = { almacen: r.almacen, codigo: l.codigo, lote: r.lote, coste: l.coste, referencia: r.numero, fecha: entrada.fecha };
      L.registrarMovimiento(datos, { ...movimiento, tipo: "Inspección", ubicacion: "RECEPCION", calidad: "Cuarentena", cantidad: -cantidad }, actor, config);
      if (e.conformes) L.registrarMovimiento(datos, { ...movimiento, tipo: "Liberación a inventario", ubicacion: entrada.ubicacion, calidad: "Disponible", cantidad: e.conformes }, actor, config);
      if (e.observadas) L.registrarMovimiento(datos, { ...movimiento, tipo: "No conformidad", ubicacion: "CUARENTENA", calidad: "Cuarentena", cantidad: e.observadas }, actor, config);
      l.conforme += e.conformes; l.noConforme += e.observadas;
    }
    L.exigir(inspeccionadas, "Indica al menos una unidad para inspeccionar.");
    r.inspecciones ??= []; r.inspecciones.push({ fecha: entrada.fecha, ubicacion: entrada.ubicacion, lineas: L.copiar(entrada.lineas), responsable: actor.nombre, motivo: entrada.motivo });
    actualizarRecepcion(r); r.historial.push(L.evento(actor, `${r.estado}: ${entrada.motivo}`)); return r;
  }

  function devolverProveedor(datos, id, motivo, actor, config) {
    almacen(actor); const r = L.obtener(datos.recepciones, id, actor); L.motivo(motivo);
    L.exigir(r.lineas.some(l => l.noConforme > 0), "Solo se devuelven unidades no conformes.");
    for (const l of r.lineas.filter(l => l.noConforme > 0)) {
      L.registrarMovimiento(datos, { tipo: "Devolución a proveedor", almacen: r.almacen, ubicacion: "CUARENTENA", calidad: "Cuarentena", codigo: l.codigo, lote: r.lote, cantidad: -l.noConforme, coste: l.coste, referencia: r.numero, fecha: r.fecha }, actor, config);
      l.devuelta += l.noConforme; l.noConforme = 0;
    }
    actualizarRecepcion(r); r.historial.push(L.evento(actor, `Devolución al proveedor: ${motivo}`));
    const orden = L.obtener(datos.ordenes, r.ordenId, actor); actualizarOrden(datos, orden);
    orden.historial.push(L.evento(actor, `${r.numero} devuelta; reposición pendiente`));
  }

  function verificarFactura(datos, entrada, actor, config) {
    compras(actor); const orden = L.obtener(datos.ordenes, entrada.ordenId, actor);
    L.exigir(!["Pendiente", "Aprobada", "Rechazada", "Anulada"].includes(orden.estado), "La orden aún no está emitida.");
    L.exigir(entrada.documento?.trim() && L.fechaValida(entrada.fecha) && entrada.fecha >= orden.fecha && L.dinero(entrada.baseInformada), "Documento, fecha o base no válidos.");
    L.exigir(!datos.facturas.some(f => f.proveedorId === orden.proveedorId && f.documento === entrada.documento), "La factura del proveedor ya está registrada.");
    L.exigir(entrada.lineas.length && new Set(entrada.lineas.map(l => l.codigo)).size === entrada.lineas.length, "Selecciona líneas sin repetir.");
    const cotejo = cotejarFactura(datos, entrada, orden, config);
    const factura = L.crear(datos.facturas, "VF", { ...entrada, proveedorId: orden.proveedorId, ...cotejo, pago: "Pendiente de Finanzas" }, actor, "Cotejo de orden, recepción y factura");
    orden.historial.push(L.evento(actor, `${factura.numero}: ${factura.estado}`)); return factura;
  }

  function cotejarFactura(datos, entrada, orden, config) {
    const observaciones = [];
    for (const l of entrada.lineas) {
      const pedida = orden.lineas.find(p => p.codigo === l.codigo);
      L.exigir(pedida && L.entero(l.cantidad) && L.entero(l.precio), "Producto, cantidad o precio no válidos.");
      const verificado = datos.facturas.filter(f => f.id !== entrada.id && f.ordenId === orden.id && f.estado === "Verificada").flatMap(f => f.lineas).filter(f => f.codigo === l.codigo).reduce((n, l) => n + l.cantidad, 0);
      if (l.precio !== pedida.precio) observaciones.push(`Precio de ${l.codigo} distinto de la orden`);
      if (l.cantidad + verificado > recibido(datos, orden.id, l.codigo, true)) observaciones.push(`Cantidad de ${l.codigo} sin recepción conforme suficiente`);
    }
    const baseCalculada = entrada.lineas.reduce((n, l) => n + l.cantidad * l.precio, 0);
    if (baseCalculada !== entrada.baseInformada) observaciones.push("La base informada no coincide con las líneas");
    return { baseCalculada, igv: Math.round(baseCalculada * config.igvPorcentaje / 100), observaciones, estado: observaciones.length ? "Observada" : "Verificada" };
  }

  function revalidarFactura(datos, id, actor, config) {
    compras(actor); const factura = L.obtener(datos.facturas, id, actor), orden = L.obtener(datos.ordenes, factura.ordenId, actor);
    L.exigir(factura.estado === "Observada", "Solo se revalida una factura observada.");
    const anteriores = L.copiar(factura.observaciones);
    Object.assign(factura, cotejarFactura(datos, factura, orden, config));
    factura.historial.push(L.evento(actor, `Nuevo cotejo: ${factura.estado}. Observaciones anteriores: ${anteriores.join("; ")}`));
    orden.historial.push(L.evento(actor, `${factura.numero}: nuevo cotejo ${factura.estado}`)); return factura;
  }

  function anularOrden(datos, id, motivo, actor) {
    L.permitir(actor, ["Jefatura"]); const o = L.obtener(datos.ordenes, id, actor); L.motivo(motivo);
    L.exigir(o.estado !== "Anulada" && !datos.recepciones.some(r => r.ordenId === id) && !datos.facturas.some(f => f.ordenId === id), "Una orden con recepciones o facturas no se anula directamente.");
    o.estado = "Anulada"; o.historial.push(L.evento(actor, `Anulación: ${motivo}`));
  }

  function evaluarProveedor(datos, entrada, actor) {
    compras(actor); proveedor(datos, entrada.proveedorId); L.motivo(entrada.comentario);
    const ordenes = datos.ordenes.filter(o => o.proveedorId === entrada.proveedorId && o.sede === actor.sede);
    const recepciones = datos.recepciones.filter(r => ordenes.some(o => o.id === r.ordenId));
    L.exigir(recepciones.length, "Todavía no hay recepciones para evaluar a este proveedor en la sede.");
    const aTiempo = recepciones.filter(r => r.fecha <= ordenes.find(o => o.id === r.ordenId).entregaPrevista).length;
    const inspeccionadas = recepciones.filter(r => r.lineas.every(l => pendienteInspeccion(l) === 0));
    return L.crear(datos.evaluaciones, "EVAL", { ...entrada, recepciones: recepciones.length, aTiempo, inspeccionadas: inspeccionadas.length, conformes: inspeccionadas.filter(r => r.estado === "Conforme").length, unidadesRecibidas: recepciones.flatMap(r => r.lineas).reduce((n, l) => n + l.cantidad, 0), unidadesConformes: recepciones.flatMap(r => r.lineas).reduce((n, l) => n + l.conforme, 0), estado: "Registrada" }, actor, "Evaluación con evidencia de recepciones");
  }

  return { guardarProveedor, resolverProveedor, crearRequisicion, resolverRequisicion, crearPeticion, registrarOferta, adjudicar, guardarAcuerdo, resolverAcuerdo, crearOrden, resolverOrden, emitirOrden, confirmarOrden, recibido, recibir, pendienteInspeccion, actualizarRecepcion, inspeccionar, inspeccionarParcial, devolverProveedor, verificarFactura, revalidarFactura, anularOrden, evaluarProveedor };
})();
