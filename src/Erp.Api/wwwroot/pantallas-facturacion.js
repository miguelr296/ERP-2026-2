"use strict";

window.PantallasFacturacion = ui => {
  const { c, L, e, actor, puede, enlace, boton, campo, opciones, fecha, detalle, formulario, ejecutar, cabecera, tabla, asiento } = ui;
  const F = window.Finanzas;
  const roles = ["Facturación", "Jefatura"];
  const secciones = { comprobantes: "Comprobantes" };
  const rutaLista = "facturacion/comprobantes";
  const tipo = d => F.tiposComprobante[d.tipoComprobante] || "Comprobante de venta";
  const nota = "Documento interno de demostración · Sin validez tributaria";
  const moneda = c.moneda;

  function lista(d) {
    const pedidos = F.pedidosPorFacturar(d, actor().sede);
    const emitidos = L.enSede(d.documentos, actor().sede).filter(doc => doc.tipo === "venta").reverse();
    return c.zonaTrabajo("Emisión de comprobantes", cabecera("Comprobantes de venta", "Emite facturas o boletas internas a partir de pedidos entregados.",
      pedidos.length ? boton("Emitir comprobante", "emitir-comprobante", "", true) : "")
      + tabla("Pedidos listos para emitir", ["Pedido", "Cliente", "Total", "Acción"], pedidos.map(p => [
        e(p.numero), e(p.cliente.nombre), moneda(p.total), boton("Emitir", "emitir-comprobante", p.id)
      ])))
      + c.zonaTrabajo("Comprobantes emitidos", tabla("Comprobantes emitidos", ["Número", "Tipo", "Fecha", "Cliente", "Total"], emitidos.map(doc => [
        enlace(F.rutaComprobante(doc), doc.referencia), e(tipo(doc)), e(c.fechaCorta(doc.fecha)), e(doc.tercero), moneda(doc.total)
      ]), true));
  }

  function ficha(d, id) {
    const doc = L.obtener(d.documentos, id, actor());
    L.exigir(doc.tipo === "venta", "Selecciona un comprobante de venta.");
    const datos = detalle([
      ["Cliente", e(doc.tercero)], ["Identificación", e(doc.identificacion || "—")], ["Sede", e(c.sedeNombre(doc.sede))],
      ["Fecha de emisión", e(c.fechaCorta(doc.fecha))], ["Pedido", e(doc.origenNumero)], ["Condición de pago", e(doc.condicion)],
      ["Vencimiento", e(c.fechaCorta(doc.vence))], ["Entregas", e(doc.entregas?.join(", ") || "—")]
    ]);
    const importes = doc.lineas ? c.detalleLineas(doc) + c.totales({ ...doc, subtotal: doc.base })
      : detalle([["Subtotal", moneda(doc.base)], ["IGV", moneda(doc.igv)], ["Total", moneda(doc.total)]]);
    const contenido = `<article id="comprobante-venta" class="tarjeta ficha-libros ficha"><div class="cabecera-documento">
      <h3>${e(doc.referencia)}</h3><span>${e(tipo(doc))}</span></div><p class="nota-operacion">${e(nota)}</p>${datos}${importes}</article>`;
    const referencias = [];
    if (puede(["Tesorería", "Jefatura"])) referencias.push(["Cuenta por cobrar", enlace(F.rutaDocumento(doc), doc.numero)]);
    if (puede(["Contabilidad", "Jefatura"])) referencias.push(["Asiento de venta", asiento(d, "documento:" + doc.id)]);
    if (puede(["Asesor", "Jefatura"])) referencias.push(["Pedido comercial", enlace("comercial/pedidos/" + doc.origenId, doc.origenNumero)]);
    return c.zonaTrabajo("Acciones del comprobante", cabecera(doc.referencia, tipo(doc) + " · " + doc.tercero,
      enlace(rutaLista, "← Comprobantes") + boton("Imprimir", "imprimir-comprobante", doc.id)))
      + c.zonaTrabajo("Detalle del comprobante", contenido
        + (referencias.length ? `<article class="tarjeta ficha-libros">${detalle(referencias)}</article>` : ""));
  }

  function emitir(d, id) {
    const pedidos = F.pedidosPorFacturar(d, actor().sede);
    L.exigir(pedidos.length, "Los pedidos aparecen aquí cuando Despachos confirma la entrega completa.");
    formulario("Emitir comprobante interno", [
      campo("Pedido entregado", opciones("pedido", pedidos.map(p => [p.id, p.numero + " · " + p.cliente.nombre]),
        pedidos.some(p => p.id === id) ? id : undefined)),
      campo("Tipo de comprobante", opciones("tipo-comprobante", Object.entries(F.tiposComprobante))),
      campo("Fecha de emisión", fecha()),
      '<p id="importe-comprobante" class="campo-completo" aria-live="polite"></p>'
    ], valores => F.rutaComprobante(ejecutar((libros, usuario) => F.registrarVenta(libros, usuario, {
      pedidoId: valores.get("pedido"), tipoComprobante: valores.get("tipo-comprobante"), fecha: valores.get("fecha")
    }))), "Emitir comprobante",
    "Revisa el pedido y elige el tipo de comprobante. El ERP asigna el número y toma los importes de la venta.");

    const pedido = c.$("#lib-pedido");
    const controlTipo = c.$("#lib-tipo-comprobante");
    const factura = controlTipo.querySelector('[value="factura"]');
    const mostrarPedido = () => {
      const seleccionado = pedidos.find(p => p.id === pedido.value);
      const tieneRuc = seleccionado?.cliente.tipoDocumento === "RUC";
      factura.disabled = !tieneRuc;
      controlTipo.value = seleccionado ? (tieneRuc ? "factura" : "boleta") : "";
      c.$("#importe-comprobante").textContent = seleccionado
        ? "Subtotal " + moneda(seleccionado.subtotal) + " · IGV " + moneda(seleccionado.igv) + " · Total " + moneda(seleccionado.total)
        : "";
    };
    pedido.addEventListener("change", mostrarPedido);
    mostrarPedido();
  }

  function accion(comando, id, d) {
    if (comando === "emitir-comprobante") emitir(d, id);
    if (comando === "imprimir-comprobante") window.print();
  }

  function vista(_seccion, id, d) {
    if (!id) return lista(d);
    const html = ficha(d, id);
    const impresion = document.createElement("div");
    impresion.className = "vista-imprimir";
    impresion.innerHTML = html;
    const comprobante = impresion.querySelector("#comprobante-venta");
    comprobante.removeAttribute("id");
    impresion.replaceChildren(c.$(".marca").cloneNode(true), comprobante);
    document.body.append(impresion);
    document.body.classList.add("imprimir-documento");
    return html;
  }

  return { roles, secciones, vista, accion };
};
