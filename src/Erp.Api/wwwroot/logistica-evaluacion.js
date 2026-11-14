"use strict";

// Escenario reproducible en memoria: no usa ni escribe localStorage del ERP.
window.EvaluacionKardex = (() => {
  function ejecutar(fecha = new Date().toISOString().slice(0, 10)) {
    const w = window, L = w.LogisticaReglas, C = w.ComprasReglas, D = w.DistribucionReglas, R = w.ReglasComerciales;
    const asesoria = { nombre: "Asesor de prueba", rol: "Asesor", sede: "centro" };
    const compras = { nombre: "Compras de prueba", rol: "Compras", sede: "centro" };
    const jefatura = { nombre: "Jefatura de prueba", rol: "Jefatura", sede: "centro" };
    const almacen = { nombre: "Almacén de prueba", rol: "Almacén", sede: "centro" };
    const transporte = { nombre: "Transporte de prueba", rol: "Transporte", sede: "centro" };
    const linea = cantidad => [{ codigo: "SOF-001", cantidad }];
    const sumarDias = (base, dias) => { const d = new Date(`${base}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + dias); return d.toISOString().slice(0, 10); };
    const entrega = sumarDias(fecha, 7), venceOferta = sumarDias(fecha, 30);
    const comercial = R.prepararDatos(w.FAMIHOGAR, null), productos = comercial.productos;
    const datos = L.inicializar(w.FAMIHOGAR_LOGISTICA, productos, null);
    const configurar = w.FAMIHOGAR_LOGISTICA;

    const req = C.crearRequisicion(datos, { almacen: "alm-centro", requerida: entrega, motivo: "Caso aislado para revisar el costo promedio con compra y salida", lineas: linea(1) }, asesoria, productos);
    C.resolverRequisicion(datos, req.id, true, "Necesidad de evaluación revisada", jefatura);
    const rfq = C.crearPeticion(datos, { requisicionId: req.id, proveedores: ["prov-madera", "prov-hogar"] }, compras);
    const oferta1 = C.registrarOferta(datos, { peticionId: rfq.id, proveedorId: "prov-madera", vigenteHasta: venceOferta, plazoDias: 7, calidad: 4, condicion: "Crédito 30 días", lineas: [{ ...linea(1)[0], precio: 120000 }] }, compras, fecha);
    const oferta2 = C.registrarOferta(datos, { peticionId: rfq.id, proveedorId: "prov-hogar", vigenteHasta: venceOferta, plazoDias: 9, calidad: 4, condicion: "Contado", lineas: [{ ...linea(1)[0], precio: 125000 }] }, compras, fecha);
    C.adjudicar(datos, oferta1.id, "Menor precio entre ofertas registradas", jefatura, fecha);
    const oc = C.crearOrden(datos, { ofertaId: oferta1.id, entregaPrevista: entrega }, compras, fecha);
    C.resolverOrden(datos, oc.id, true, "Orden revisada independientemente para la evaluación", jefatura);
    C.emitirOrden(datos, oc.id, compras, fecha);
    C.confirmarOrden(datos, oc.id, "Confirmación ficticia CP-EVAL-001", compras);
    const recepcion = C.recibir(datos, { ordenId: oc.id, documento: "GP-EVAL-001", lote: "LOTE-EVAL-001", fecha, lineas: linea(1) }, almacen, configurar);
    C.inspeccionar(datos, recepcion.id, true, "Inspección de evaluación conforme", "RACK-A", almacen, configurar);
    const factura = C.verificarFactura(datos, { ordenId: oc.id, documento: "F-EVAL-001", fecha, baseInformada: 120000, lineas: [{ ...linea(1)[0], precio: 120000 }] }, compras, configurar);
    L.exigir(factura.estado === "Verificada", `La factura de evaluación quedó ${factura.estado}.`);

    const oportunidad = comercial.oportunidades.find(o => o.id === "opo-001");
    oportunidad.lineas = linea(1);
    const cotizacion = R.crearCotizacion(comercial, { oportunidadId: oportunidad.id, fecha, vigenteHasta: entrega, entrega, condicion: "Contado", descuentoBps: 0 }, asesoria, w.FAMIHOGAR.parametros);
    R.cambiarCotizacion(comercial, cotizacion.id, "Enviada", "", asesoria, fecha);
    R.cambiarCotizacion(comercial, cotizacion.id, "Aceptada", "", asesoria, fecha);
    const pedido = R.crearPedido(comercial, cotizacion.id, asesoria, fecha);
    const puertos = {
      consultarDisponibilidad(p) { return { origen: "Escenario aislado", lineas: p.lineas.map(l => ({ codigo: l.codigo, disponible: L.disponible(datos, "alm-centro", l.codigo) })) }; },
      consultarCredito() { return { origen: "No aplica: contado", datos: null }; }
    };
    R.validarPedido(comercial, pedido.id, asesoria, puertos);
    R.aprobarPedido(comercial, pedido.id, jefatura, puertos);
    L.exigir(pedido.estado === "Aprobado", "El pedido de evaluación no pasó los controles comerciales.");
    const pedidosCentro = comercial.pedidos.filter(p => p.sede === "centro");
    const reserva = D.reservar(datos, { pedidoId: pedido.id, almacen: "alm-centro", lineas: linea(1) }, almacen, pedidosCentro, configurar);
    const picking = D.crearPicking(datos, { reservaId: reserva.id, lineas: linea(1) }, almacen, pedidosCentro);
    D.avanzarPicking(datos, picking.id, "Preparado", "Control de evaluación", almacen, pedidosCentro);
    D.avanzarPicking(datos, picking.id, "Embalado", "Control de evaluación", almacen, pedidosCentro);
    const despacho = D.crearDespacho(datos, { pickingId: picking.id, fecha, transportista: "Transporte de prueba", placa: "EVAL-001", destino: pedido.cliente.direccion }, almacen, pedidosCentro, configurar);
    D.iniciarRuta(datos, despacho.id, transporte);
    D.confirmarEntrega(datos, { despachoId: despacho.id, fecha, receptor: pedido.cliente.nombre, evidencia: "CONST-EVAL-001", motivo: "", lineas: linea(1) }, transporte);

    const movimientos = L.kardexValorizado(datos, productos, "centro").filter(m => m.codigo === "SOF-001");
    const salida = movimientos.find(m => m.tipo === "Salida por venta" && m.referencia === despacho.numero);
    L.exigir(!!salida, "No se encontró la salida de venta en el Kardex.");
    L.exigir(salida.costoUnitarioMovimiento === Math.round(salida.saldoInicial / salida.saldoInicialCantidad), "El costo de salida difiere del promedio móvil previo.");
    L.exigir(salida.saldoInicialCantidad === 13 && salida.saldoInicial === 1380000 && salida.costoUnitarioMovimiento === 106154 && salida.saldoFinalCantidad === 12 && salida.saldoFinal === 1273846, "El escenario no produjo el resultado esperado.");
    return {
      naturaleza: "Escenario de evaluación generado en memoria; no persistido en el navegador.", fecha,
      metodo: "Promedio Ponderado Móvil por producto y sede", producto: "SOF-001", nombreProducto: productos.find(p => p.codigo === "SOF-001")?.nombre || "Sofá Nube", sede: "Lima Centro", almacen: "Almacén Lima Centro",
      salida: { numero: salida.numero, referencia: salida.referencia, cantidad: salida.cantidad, costoUnitarioMovimiento: salida.costoUnitarioMovimiento, importeMovimiento: salida.importeMovimiento, saldoInicialCantidad: salida.saldoInicialCantidad, saldoInicial: salida.saldoInicial, saldoFinalCantidad: salida.saldoFinalCantidad, saldoFinal: salida.saldoFinal, costoUnitarioFinal: salida.costoUnitarioFinal },
      documentos: {
        requisicion: { numero: req.numero, estado: req.estado }, solicitudOferta: rfq.numero,
        ofertas: [oferta1, oferta2].map(o => ({ numero: o.numero, proveedor: o.proveedorId === "prov-madera" ? "Muebles del Bosque SAC" : "Diseño y Hogar SAC", base: o.base, estado: o.estado })),
        ordenCompra: { numero: oc.numero, base: oc.base, estado: oc.estado, historial: oc.historial },
        recepcion: { numero: recepcion.numero, documento: "GP-EVAL-001", lote: "LOTE-EVAL-001", estado: recepcion.estado },
        factura: { numero: factura.numero, documento: "F-EVAL-001", estado: factura.estado, base: factura.baseCalculada },
        cotizacion: { numero: cotizacion.numero, estado: cotizacion.estado },
        pedido: { numero: pedido.numero, estado: pedido.estado, aprobadoPor: pedido.aprobadoPor, historial: pedido.historial },
        reserva: reserva.numero, picking: picking.numero,
        despacho: { numero: despacho.numero, guia: despacho.guia, estado: despacho.estado, evidenciaEntrega: "CONST-EVAL-001" }
      },
      trazabilidad: [
        "Saldo inicial ficticio: 12 unidades a S/ 1,050.00 = S/ 12,600.00.",
        `${req.numero}: solicitud de una unidad; revisión independiente por Jefatura de prueba.`,
        `${rfq.numero}: dos ofertas comparadas; ${oferta1.numero} por S/ 1,200.00 seleccionada frente a ${oferta2.numero} por S/ 1,250.00.`,
        `${oc.numero}: aprobada independientemente, emitida y con confirmación de proveedor ficticia.`,
        `${recepcion.numero}: ingreso en cuarentena, lote LOTE-EVAL-001, inspección conforme y liberación. ${factura.numero} verificada por cotejo; sin pago.`,
        `${cotizacion.numero} → ${pedido.numero}: oportunidad retail convertida a pedido y aprobada tras validar disponibilidad.`,
        `${reserva.numero} → ${picking.numero} → ${despacho.numero}: reserva, preparación, embalaje, salida y constancia ficticia de entrega.`
      ],
      movimientos: movimientos.map(m => ({ numero: m.numero, fecha: m.fecha, tipo: m.tipo, referencia: m.referencia, almacen: m.almacen, ubicacion: m.ubicacion, calidad: m.calidad, lote: m.lote, cantidad: m.cantidad, costoUnitarioMovimiento: m.costoUnitarioMovimiento, importeMovimiento: m.importeMovimiento, saldoInicialCantidad: m.saldoInicialCantidad, saldoInicial: m.saldoInicial, saldoFinalCantidad: m.saldoFinalCantidad, saldoFinal: m.saldoFinal, costoUnitarioFinal: m.costoUnitarioFinal }))
    };
  }
  return { ejecutar };
})();
