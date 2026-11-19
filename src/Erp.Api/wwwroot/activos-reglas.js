"use strict";

window.ActivosReglas = (() => {
  const L = window.LogisticaReglas, config = window.FAMIHOGAR_ACTIVOS;
  const colecciones = ["solicitudes", "ordenes", "recepciones", "facturas", "activos", "movimientos", "asientos", "pagos", "conteos", "cierres", "conciliaciones"];
  const roles = ["Asesor", "Jefatura", "Compras", "Almacén", "Contabilidad", "Tesorería"];
  const sedeValida = id => window.FAMIHOGAR.sedes.some(s => s.id === id);
  const permitir = (actor, autorizados) => L.exigir(autorizados.includes(actor?.rol) && sedeValida(actor.sede) && actor.nombre?.trim(), "Tu rol o sede no permite esta operación de activos fijos.");
  const texto = (valor, nombre, max = 150) => {
    L.exigir(typeof valor === "string" && valor.trim().length > 0 && valor.trim().length <= max, `Indica ${nombre} (máximo ${max} caracteres).`);
    return valor.trim();
  };
  const clave = valor => String(valor).trim().toLocaleUpperCase("es");
  const importe = (valor, desdeCero = false) => Number.isSafeInteger(valor) && valor >= (desdeCero ? 0 : 1) && valor <= 10000000000;
  const proporcion = (valor, parte, total) => Number((BigInt(valor) * BigInt(parte) * 2n + BigInt(total)) / (BigInt(total) * 2n));
  const impuesto = (base, gravado) => gravado ? proporcion(base, config.igvPorcentaje, 100) : 0;
  const periodo = fecha => fecha.slice(0, 7);
  const periodoValido = valor => typeof valor === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(valor) && Number(valor.slice(0, 4)) >= 1900;
  function desplazarPeriodo(valor, meses) {
    const fecha = new Date(`${valor}-01T00:00:00Z`);
    fecha.setUTCMonth(fecha.getUTCMonth() + meses);
    return periodo(fecha.toISOString());
  }
  const ultimoDia = valor => new Date(Date.parse(`${desplazarPeriodo(valor, 1)}-01T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
  const fechaValida = (fecha, hoy, desde = "1900-01-01") => L.fechaValida(fecha) && fecha >= desde && fecha <= hoy;
  const abierto = (d, sede, p) => L.exigir(!d.cierres.some(c => c.sede === sede && c.periodo >= p), "El periodo patrimonial está cerrado en esta sede.");
  const cuenta = (codigo, debe, haber) => ({ cuenta: codigo, debe, haber });
  const registrar = (r, actor, accion) => { r.historial.push(L.evento(actor, accion)); };

  function inicializar(guardados) {
    if (guardados === null) return { version: config.version, revision: 0, ...Object.fromEntries(colecciones.map(c => [c, []])) };
    L.exigir(guardados?.version === config.version && Number.isSafeInteger(guardados.revision) && colecciones.every(c => Array.isArray(guardados[c])), "Los datos de activos fijos no son compatibles. Se conservaron sin cambios.");
    return L.copiar(guardados);
  }

  function registrarAsiento(d, referencia, tipo, fecha, activoId, lineas, actor) {
    abierto(d, actor.sede, periodo(fecha));
    L.exigir(!d.asientos.some(a => a.referenciaId === referencia.id && a.tipo === tipo), "Ya existe un asiento para este documento.");
    return L.crear(d.asientos, "PAT", {
      referenciaId: referencia.id, referencia: referencia.numero, tipo, fecha, periodo: periodo(fecha), activoId,
      moneda: config.moneda, proveedor: referencia.proveedor || null, lineas: lineas.filter(l => l.debe || l.haber)
    }, actor, "Asiento generado desde el documento patrimonial");
  }

  function solicitar(d, e, actor, hoy) {
    permitir(actor, ["Asesor", "Almacén", "Jefatura", "Compras"]);
    L.exigir(Object.hasOwn(config.clases, e.clase), "Selecciona una clase de activo.");
    L.exigir(importe(e.presupuesto) && L.fechaValida(e.requerida) && e.requerida >= hoy, "Indica un presupuesto positivo y una fecha requerida vigente.");
    return L.crear(d.solicitudes, "CAP", {
      descripcion: texto(e.descripcion, "la descripción"), clase: e.clase, centroCosto: texto(e.centroCosto, "el centro de costo", 60),
      requerida: e.requerida, presupuesto: e.presupuesto, fecha: hoy, motivo: L.motivo(e.motivo), estado: "Pendiente"
    }, actor, "Inversión solicitada");
  }

  function resolverSolicitud(d, id, aceptar, motivo, actor) {
    permitir(actor, ["Jefatura"]);
    const s = L.obtener(d.solicitudes, id, actor);
    L.independiente(actor, s.registradoPor);
    L.exigir(s.estado === "Pendiente", "La solicitud ya fue revisada.");
    const detalle = L.motivo(motivo);
    s.estado = aceptar ? "Aprobada" : "Rechazada";
    registrar(s, actor, `${s.estado}: ${detalle}`);
    return s;
  }

  function proveedorDe(id, proveedores) {
    const proveedor = proveedores.find(p => p.id === id && p.estado === "Aprobado");
    L.exigir(proveedor, "Selecciona un proveedor aprobado por Compras.");
    return { id: proveedor.id, nombre: proveedor.nombre, ruc: proveedor.ruc };
  }

  function emitirOrden(d, e, actor, hoy, proveedores) {
    permitir(actor, ["Compras"]);
    const s = L.obtener(d.solicitudes, e.solicitudId, actor);
    L.exigir(s.estado === "Aprobada" && !d.ordenes.some(o => o.solicitudId === s.id), "La inversión necesita aprobación y solo admite una orden.");
    L.exigir(hoy >= s.fecha && L.fechaValida(e.entrega) && e.entrega >= hoy, "Indica una fecha de entrega vigente.");
    const proveedor = proveedorDe(e.proveedorId, proveedores);
    L.exigir(importe(e.precio) && importe(e.directos, true) && e.precio + e.directos <= s.presupuesto, "La base de la orden supera el presupuesto aprobado o contiene importes inválidos.");
    const o = L.crear(d.ordenes, "OCA", {
      solicitudId: s.id, proveedor,
      precio: e.precio, directos: e.directos, detalleDirectos: e.directos ? L.motivo(e.detalleDirectos) : "",
      fecha: hoy, entrega: e.entrega, estado: "Emitida"
    }, actor, "Orden de adquisición patrimonial emitida");
    registrar(s, actor, `Orden ${o.numero}`);
    return o;
  }

  function recibir(d, e, actor, hoy) {
    permitir(actor, ["Almacén"]);
    const o = L.obtener(d.ordenes, e.ordenId, actor);
    L.exigir(o.estado === "Emitida" && fechaValida(e.fecha, hoy, o.fecha), "La orden necesita estar emitida y la fecha de recepción debe ser válida.");
    const documento = clave(texto(e.documento, "el documento de recepción", 60));
    L.exigir(!d.recepciones.some(r => r.ordenId === o.id && r.documento === documento), "El documento de recepción ya fue registrado.");
    const conforme = e.conforme === true;
    const r = L.crear(d.recepciones, "RCA", {
      ordenId: o.id, documento, fecha: e.fecha, serie: texto(e.serie, "el número de serie", 80),
      evidencia: L.motivo(e.evidencia), estado: conforme ? "Conforme" : "Observada"
    }, actor, conforme ? "Bien recibido con conformidad" : "Recepción observada");
    if (conforme) o.estado = "Recibida";
    registrar(o, actor, `${r.numero}: ${r.estado}`);
    return r;
  }

  function verificarFactura(d, e, actor, hoy) {
    permitir(actor, ["Compras"]);
    const r = L.obtener(d.recepciones, e.recepcionId, actor), o = L.obtener(d.ordenes, r.ordenId, actor);
    L.exigir(r.estado === "Conforme" && o.estado === "Recibida" && !d.facturas.some(f => f.ordenId === o.id), "Se requiere una recepción conforme sin factura verificada.");
    const documento = clave(texto(e.documento, "la factura del proveedor", 60));
    validarDocumentoProveedor(d, o.proveedor, documento);
    const base = o.precio + o.directos, igv = impuesto(base, e.gravado === true);
    L.exigir(e.base === base && e.igv === igv, "La base o el IGV de la factura no coincide con la orden y el tratamiento indicado.");
    L.exigir(fechaValida(e.fecha, hoy, o.fecha), "La fecha de factura no es válida.");
    const f = L.crear(d.facturas, "VFA", {
      ordenId: o.id, recepcionId: r.id, proveedor: o.proveedor, documento, fecha: e.fecha, verificadaEn: hoy,
      base, igv, total: base + igv, recuperable: igv > 0 && e.recuperable === true, estado: "Verificada"
    }, actor, "Factura cotejada con orden y recepción conforme");
    registrar(o, actor, `Factura ${f.numero} verificada`);
    return f;
  }

  function validarDocumentoProveedor(d, proveedor, documento, excluirId) {
    const usados = [...d.facturas, ...d.movimientos.filter(m => ["Aplicada", "Completada"].includes(m.estado))];
    L.exigir(!usados.some(r => r.id !== excluirId && r.proveedor?.ruc === proveedor.ruc && r.documento === documento), "El documento del proveedor ya fue registrado.");
  }

  function prepararLibro(e, costo) {
    L.exigir(config.metodos.includes(e?.metodo) && importe(e.residual, true) && e.residual <= costo, "Indica un método válido y un residual entre cero y el costo para cada libro.");
    const unidades = e.metodo === "Unidades de producción";
    const medida = unidades ? e.unidades : e.meses;
    L.exigir(L.entero(medida) && medida <= (unidades ? 1000000000 : 600), unidades ? "Indica las unidades estimadas del libro." : "Indica una vida útil de 1 a 600 meses por libro.");
    const tasa = e.metodo === "Saldos decrecientes" ? e.tasa : 0;
    L.exigir(e.metodo !== "Saldos decrecientes" || L.entero(tasa) && tasa <= 10000, "La tasa anual de saldos decrecientes debe estar entre 0,01 % y 100 %.");
    return { metodo: e.metodo, residual: e.residual, tasa, acumulada: 0, deterioro: 0, depreciaciones: [], plan: { base: costo - e.residual, medida, consumido: 0 } };
  }

  const costoAdquisicion = f => f.base + (f.recuperable ? 0 : f.igv);
  function partidasCompra(f, cuentaDestino) {
    return [
      cuenta(cuentaDestino, costoAdquisicion(f), 0),
      cuenta(config.cuentas.igv, f.recuperable ? f.igv : 0, 0),
      cuenta(config.cuentas.pagar, 0, f.total)
    ];
  }

  function registrarFactura(d, e, actor, hoy) {
    permitir(actor, ["Contabilidad"]);
    const f = L.obtener(d.facturas, e.facturaId, actor);
    L.exigir(!f.registroContable && !d.activos.some(a => a.facturaId === f.id), "La factura ya se registró en el diario patrimonial.");
    L.exigir(fechaValida(e.fecha, hoy, f.fecha), "Indica una fecha contable válida a partir de la emisión de la factura.");
    const asiento = registrarAsiento(d, f, "Adquisición en curso", e.fecha, null, partidasCompra(f, config.cuentas.enCurso), actor);
    f.registroContable = { fecha: e.fecha, asientoId: asiento.id };
    registrar(f, actor, `Adquisición en curso registrada · ${asiento.numero}`);
    return f;
  }

  function capitalizar(d, e, actor, hoy) {
    permitir(actor, ["Contabilidad"]);
    const f = L.obtener(d.facturas, e.facturaId, actor), o = L.obtener(d.ordenes, f.ordenId, actor);
    const r = L.obtener(d.recepciones, f.recepcionId, actor), s = L.obtener(d.solicitudes, o.solicitudId, actor);
    L.exigir(!d.activos.some(a => a.facturaId === f.id), "La factura ya está capitalizada.");
    L.exigir(fechaValida(e.fecha, hoy, r.fecha > f.fecha ? r.fecha : f.fecha), "La puesta en servicio debe ser posterior o igual a la recepción y factura, y no futura.");
    L.exigir(f.registroContable ? e.fecha >= f.registroContable.fecha : periodo(e.fecha) === periodo(f.fecha),
      "Registra primero la adquisición en curso si la factura pertenece a un periodo anterior.");
    const costo = costoAdquisicion(f);
    const libros = { Contable: prepararLibro(e.contable, costo) };
    if (e.tributario) libros.Tributario = prepararLibro(e.tributario, costo);
    const etiqueta = clave(texto(e.etiqueta, "el identificador patrimonial (etiqueta)", 80));
    L.exigir(!d.activos.some(a => a.etiqueta === etiqueta), "La etiqueta patrimonial ya está asignada.");
    const foto = String(e.foto || "").trim();
    L.exigir(!foto || (foto.length <= 500 && /^https?:\/\/[^\s]+$/i.test(foto)), "Indica una URL HTTP o HTTPS para la foto.");
    const a = L.crear(d.activos, "AF", {
      facturaId: f.id, descripcion: s.descripcion, clase: s.clase, ubicacion: texto(e.ubicacion, "la ubicación"),
      custodio: texto(e.custodio, "el custodio"), centroCosto: s.centroCosto, etiqueta, serie: r.serie, foto,
      critico: e.critico === true, fecha: e.fecha, inicio: desplazarPeriodo(periodo(e.fecha), 1), fechaValor: e.fecha, moneda: config.moneda,
      cuentas: L.copiar(config.clases[s.clase]), costoInicial: costo, costo, libros, estado: "En servicio"
    }, actor, `Activo puesto en servicio: ${L.motivo(e.evidencia)}`);
    if (f.registroContable) {
      registrarAsiento(d, f, "Capitalización", e.fecha, a.id, [cuenta(a.cuentas.activo, costo, 0), cuenta(config.cuentas.enCurso, 0, costo)], actor);
    } else {
      registrarAsiento(d, f, "Adquisición y capitalización", e.fecha, a.id, partidasCompra(f, a.cuentas.activo), actor);
    }
    registrar(f, actor, `Capitalizada en ${a.numero}`);
    return a;
  }

  function obligaciones(d, sede) {
    return d.asientos.filter(a => a.sede === sede && a.tipo !== "Pago" && a.lineas.some(l => l.cuenta === config.cuentas.pagar && l.haber > 0)).map(a => ({
      asientoId: a.id, referencia: a.referencia, tipo: a.tipo, fecha: a.fecha, moneda: a.moneda, proveedor: a.proveedor,
      total: a.lineas.find(l => l.cuenta === config.cuentas.pagar).haber, pago: d.pagos.find(p => p.asientoId === a.id) || null
    }));
  }

  function pagar(d, e, actor, hoy) {
    permitir(actor, ["Tesorería"]);
    const obligacion = obligaciones(d, actor.sede).find(o => o.asientoId === e.asientoId);
    L.exigir(obligacion && !obligacion.pago && fechaValida(e.fecha, hoy, obligacion.fecha), "Selecciona una obligación pendiente y una fecha de pago válida.");
    const documento = clave(texto(e.documento, "la referencia del pago", 80));
    L.exigir(!d.pagos.some(p => p.documento === documento), "La referencia de pago ya fue registrada.");
    const asiento = L.obtener(d.asientos, e.asientoId, actor);
    const p = L.crear(d.pagos, "PAG", { asientoId: asiento.id, documento, fecha: e.fecha, total: obligacion.total, proveedor: obligacion.proveedor }, actor, "Pago patrimonial registrado");
    registrarAsiento(d, p, "Pago", e.fecha, asiento.activoId, [cuenta(config.cuentas.pagar, p.total, 0), cuenta(config.cuentas.banco, 0, p.total)], actor);
    return p;
  }

  return { config, roles, sedeValida, permitir, inicializar, texto, clave, importe, proporcion, impuesto, periodo, periodoValido, desplazarPeriodo, ultimoDia, fechaValida, abierto, cuenta, registrar, registrarAsiento, solicitar, resolverSolicitud, emitirOrden, proveedorDe, validarDocumentoProveedor, recibir, verificarFactura, registrarFactura, capitalizar, obligaciones, pagar };
})();
