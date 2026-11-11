"use strict";

window.PantallasComerciales = c => {
  const r = c.reglas, e = c.esc, b = c.accion;
  const datos = () => c.datos, actor = () => c.sesion;
  const esJefatura = () => actor().rol === "Jefatura";
  const deSede = lista => lista.filter(d => d.sede === actor().sede);
  const operacion = cambiar => c.guardarCambios(cambiar);
  const pesos = valor => Math.round(Number(valor) * 100);
  const campo = (titulo, id, contenido) => `<div><label for="${id}">${titulo}</label>${contenido}</div>`;
  const texto = (id, valor = "", extra = "") => `<input id="${id}" name="${id}" value="${e(valor)}" ${extra}>`;
  const selector = (id, valores, elegido) => `<select id="${id}" name="${id}">${valores.map(valor => `<option ${valor === elegido ? "selected" : ""}>${e(valor)}</option>`).join("")}</select>`;
  const razon = '<label for="motivo">Motivo</label><textarea id="motivo" name="motivo" minlength="3" maxlength="300" required></textarea>';
  const registrar = (titulo, guardar, destino) => c.formulario(titulo, razon, valores => { guardar(valores.get("motivo")); return destino; });
  const volver = vista => `comercial/${vista}`;
  const porcentaje = bps => (bps / 100).toLocaleString("es-PE") + " %";
  const productoNombre = codigo => datos().productos.find(p => p.codigo === codigo)?.nombre || codigo;
  let filtro = { desde: "", hasta: "", canal: "Todos" };

  function vista(vistaActual) {
    if (vistaActual === "clientes") return clientes();
    if (vistaActual === "catalogo") return catalogo();
    if (vistaActual === "precios") return precios();
    if (vistaActual === "aprobaciones") return aprobaciones();
    if (vistaActual === "solicitudes") return solicitudes();
    if (vistaActual === "indicadores") return indicadores();
    return null;
  }

  function clientes() {
    const filas = datos().clientes.map(cliente => `<tr><td>${b(cliente.nombre, "ver-cliente", cliente.id, "enlace-boton")}</td><td>${e(cliente.tipoDocumento)} ${e(cliente.documento)}</td><td>${e(cliente.correo || "—")}<small>${e(cliente.telefono)}</small></td><td>${e(cliente.segmento)}</td><td>${c.etiqueta(cliente.estado)}</td></tr>`);
    return c.cabecera("Clientes", "Directorio compartido entre sedes. Las altas y cambios requieren revisión.", b("+ Nuevo cliente", "nuevo-cliente", "", "boton primario")) + c.tabla("Directorio de clientes", ["Cliente", "Documento", "Contacto", "Segmento", "Estado"], filas);
  }

  function cliente(id = "") {
    const actual = datos().clientes.find(d => d.id === id) || {};
    const campos = [
      campo("Tipo de documento", "tipoDocumento", selector("tipoDocumento", ["DNI", "RUC"], actual.tipoDocumento)),
      campo("Número de documento", "documento", texto("documento", actual.documento, 'inputmode="numeric" maxlength="11" required')),
      campo("Nombre o razón social", "nombreCliente", texto("nombreCliente", actual.nombre, 'maxlength="120" required')),
      campo("Segmento", "segmento", selector("segmento", ["Retail", "Empresa"], actual.segmento)),
      campo("Correo", "correo", texto("correo", actual.correo, 'type="email" maxlength="150"')),
      campo("Teléfono", "telefono", texto("telefono", actual.telefono, 'type="tel" maxlength="20"')),
      campo("Dirección de entrega", "direccion", texto("direccion", actual.direccion, 'maxlength="200" required')),
      campo("Dirección fiscal", "direccionFiscal", texto("direccionFiscal", actual.direccionFiscal, 'maxlength="200" required')),
      campo("Dirección de cobranza", "direccionCobranza", texto("direccionCobranza", actual.direccionCobranza, 'maxlength="200" required')),
      campo("Zona", "zona", texto("zona", actual.zona, 'maxlength="60"')),
      campo("Condición de pago preferida", "condicionPreferida", selector("condicionPreferida", ["Contado", "Crédito 30 días"], actual.condicionPreferida))
    ].join("");
    c.formulario(id ? "Solicitar actualización de cliente" : "Nuevo cliente", `<div class="campos">${campos}</div>`, valores => {
      const valor = Object.fromEntries(valores);
      valor.nombre = valor.nombreCliente.trim(); delete valor.nombreCliente;
      for (const clave of Object.keys(valor)) valor[clave] = valor[clave].trim();
      operacion(actuales => r.solicitarMaestro(actuales, "cliente", valor, id, actor()));
      return volver("clientes");
    }, "Enviar a revisión");
    const formatoDocumento = () => {
      const cantidad = c.$("#tipoDocumento").value === "DNI" ? 8 : 11;
      c.$("#documento").pattern = `[0-9]{${cantidad}}`; c.$("#documento").maxLength = cantidad;
    };
    c.$("#tipoDocumento").addEventListener("change", formatoDocumento); formatoDocumento();
  }

  function verCliente(id) {
    const cliente = datos().clientes.find(d => d.id === id);
    if (!cliente) return;
    c.abrirModal(cliente.nombre, `<div class="acciones-documento">${c.etiqueta(cliente.estado)}${b("Solicitar actualización", "editar-cliente", id)}</div><dl class="detalle-documento">${[["Documento", `${cliente.tipoDocumento} ${cliente.documento}`], ["Segmento", cliente.segmento], ["Correo", cliente.correo], ["Teléfono", cliente.telefono], ["Entrega", cliente.direccion], ["Dirección fiscal", cliente.direccionFiscal || cliente.direccion], ["Cobranza", cliente.direccionCobranza || cliente.direccion], ["Zona", cliente.zona], ["Condición preferida", cliente.condicionPreferida || "Contado"]].map(([titulo, valor]) => `<div><dt>${titulo}</dt><dd>${e(valor || "—")}</dd></div>`).join("")}</dl>${c.mostrarHistorial(cliente.historial || [])}`);
  }

  function catalogo() {
    const filas = datos().productos.map(p => `<tr><td>${e(p.codigo)}</td><td>${e(p.nombre)}</td><td>${e(p.familia)}</td><td>${e(p.unidad)}</td>${esJefatura() ? `<td class="numero">${c.moneda(p.coste)}</td>` : ""}<td>${c.etiqueta(p.estado)}</td><td>${esJefatura() ? b("Editar", "editar-producto", p.id, "enlace-boton") : ""}</td></tr>`);
    return c.cabecera("Catálogo de productos", "El precio comercial se administra en las listas por canal y segmento.", esJefatura() ? b("+ Nuevo producto", "nuevo-producto", "", "boton primario") : "") + c.tabla("Maestro de productos", ["Código", "Producto", "Familia", "Unidad", ...(esJefatura() ? ["Coste"] : []), "Estado", ""], filas);
  }

  function producto(id = "") {
    const p = datos().productos.find(d => d.id === id) || {};
    const campos = campo("Código", "codigo", texto("codigo", p.codigo, `pattern="[A-Z0-9-]{3,20}" required ${id ? "readonly" : ""}`)) + campo("Producto", "nombreMaestro", texto("nombreMaestro", p.nombre, 'maxlength="120" required')) + campo("Familia", "familia", texto("familia", p.familia, 'maxlength="60" required')) + campo("Unidad", "unidad", texto("unidad", p.unidad || "Unidad", 'maxlength="30" required')) + campo("Coste (PEN)", "coste", texto("coste", (p.coste || 0) / 100, 'type="number" min="0" max="9999999" step="0.01" required'));
    c.formulario(id ? "Actualizar producto" : "Nuevo producto", `<div class="campos">${campos}</div>`, valores => {
      const valor = Object.fromEntries(valores); valor.nombre = valor.nombreMaestro.trim(); delete valor.nombreMaestro; valor.coste = pesos(valor.coste);
      operacion(actuales => r.solicitarMaestro(actuales, "producto", valor, id, actor())); return volver("aprobaciones");
    }, "Enviar a revisión");
  }

  function precios() {
    const listas = datos().listasPrecio.map(l => `<tr><td>${b(l.nombre, "ver-lista", l.id, "enlace-boton")}</td><td>${e(l.canal)}</td><td>${e(l.segmento)}</td><td>${c.fechaCorta(l.desde)} – ${c.fechaCorta(l.hasta)}</td><td>${c.etiqueta(l.activa ? "Activa" : "Inactiva")}</td><td>${esJefatura() ? b("Actualizar", "editar-lista", l.id, "enlace-boton") : ""}</td></tr>`);
    const promos = datos().promociones.map(p => `<tr><td>${e(p.nombre)}</td><td>${e(p.canal)} / ${e(p.segmento)}</td><td>${porcentaje(p.descuentoBps)}</td><td>${c.fechaCorta(p.desde)} – ${c.fechaCorta(p.hasta)}</td><td>${c.etiqueta(p.activa ? "Activa" : "Inactiva")}</td><td>${esJefatura() ? b("Actualizar", "editar-promocion", p.id, "enlace-boton") : ""}</td></tr>`);
    return c.cabecera("Precios y promociones", "Listas vigentes por canal y segmento. Cambios sujetos a aprobación.", esJefatura() ? b("+ Nueva lista", "nueva-lista", "", "boton primario") : "") + c.tabla("Listas de precios", ["Lista", "Canal", "Segmento", "Vigencia", "Estado", ""], listas) + `<div class="separador-vista">${esJefatura() ? b("+ Nueva promoción", "nueva-promocion") : ""}</div>` + c.tabla("Promociones no acumulables", ["Promoción", "Aplicación", "Descuento", "Vigencia", "Estado", ""], promos, false);
  }

  function camposVigencia(valor) {
    return campo("Nombre", "nombreMaestro", texto("nombreMaestro", valor.nombre, 'maxlength="100" required')) + campo("Canal", "canalMaestro", selector("canalMaestro", ["Tienda", "Web", "Teléfono"], valor.canal)) + campo("Segmento", "segmentoMaestro", selector("segmentoMaestro", ["Retail", "Empresa"], valor.segmento)) + campo("Desde", "desde", texto("desde", valor.desde || c.fechaHoy(), 'type="date" required')) + campo("Hasta", "hasta", texto("hasta", valor.hasta || c.sumarDias(c.fechaHoy(), 30), 'type="date" required')) + campo("Estado", "activa", selector("activa", ["Activa", "Inactiva"], valor.activa === false ? "Inactiva" : "Activa"));
  }

  function valorVigencia(form) {
    return { nombre: form.get("nombreMaestro").trim(), canal: form.get("canalMaestro"), segmento: form.get("segmentoMaestro"), desde: form.get("desde"), hasta: form.get("hasta"), activa: form.get("activa") === "Activa" };
  }

  function listaPrecio(id = "") {
    const l = datos().listasPrecio.find(d => d.id === id) || {};
    const productos = datos().productos.filter(r.aprobado);
    const importes = productos.map(p => campo(`${e(p.nombre)} · PEN`, `precio-${p.codigo}`, texto(`precio-${p.codigo}`, (l.precios?.[p.codigo] || p.precio || 0) / 100, 'type="number" min="0.01" max="9999999" step="0.01" required'))).join("");
    c.formulario(id ? "Actualizar lista de precios" : "Nueva lista de precios", `<div class="campos">${camposVigencia(l)}</div><h3 class="separador-vista">Precios sin IGV</h3><div class="campos">${importes}</div>`, valores => {
      const valor = { ...valorVigencia(valores), moneda: "PEN", precios: Object.fromEntries(productos.map(p => [p.codigo, pesos(valores.get(`precio-${p.codigo}`))])) };
      operacion(actuales => r.solicitarMaestro(actuales, "lista", valor, id, actor())); return volver("aprobaciones");
    }, "Enviar a revisión");
  }

  function promocion(id = "") {
    const p = datos().promociones.find(d => d.id === id) || {};
    c.formulario(id ? "Actualizar promoción" : "Nueva promoción", `<div class="campos">${camposVigencia(p)}${campo("Descuento (%)", "descuentoPromo", texto("descuentoPromo", (p.descuentoBps || 0) / 100, 'type="number" min="0.01" max="5" step="0.01" required'))}</div>`, valores => {
      const valor = { ...valorVigencia(valores), descuentoBps: pesos(valores.get("descuentoPromo")) };
      operacion(actuales => r.solicitarMaestro(actuales, "promocion", valor, id, actor())); return volver("aprobaciones");
    }, "Enviar a revisión");
  }

  function verLista(id) {
    const lista = datos().listasPrecio.find(l => l.id === id);
    if (!lista) return;
    c.abrirModal(lista.nombre, `<p>${e(lista.canal)} / ${e(lista.segmento)} · ${c.fechaCorta(lista.desde)} – ${c.fechaCorta(lista.hasta)}</p>${c.tabla("Precios sin IGV", ["Producto", "Precio"], Object.entries(lista.precios).map(([codigo, precio]) => `<tr><td>${e(productoNombre(codigo))}</td><td class="numero">${c.moneda(precio)}</td></tr>`), false)}`);
  }

  function nuevaCotizacion(id = "") {
    const oportunidades = deSede(datos().oportunidades).filter(o => o.estado !== "Perdida" && r.aprobado(datos().clientes.find(cliente => cliente.id === o.clienteId)));
    if (!oportunidades.length) { c.aviso("Registra una oportunidad con un cliente aprobado en esta sede."); return; }
    const hoy = c.fechaHoy();
    const seleccion = `<select id="oportunidad-cotizacion" name="oportunidadId" required><option value="">Selecciona una oportunidad</option>${oportunidades.map(o => `<option value="${e(o.id)}">${e(o.numero)} · ${e(datos().clientes.find(cliente => cliente.id === o.clienteId)?.nombre)} · ${e(o.asunto)}</option>`).join("")}</select>`;
    const campos = campo("Oportunidad de origen", "oportunidad-cotizacion", seleccion) + campo("Vigente hasta", "vigencia", texto("vigencia", c.sumarDias(hoy, c.configuracion.parametros.diasVigencia), `type="date" min="${hoy}" required`)) + campo("Entrega propuesta", "entrega", texto("entrega", c.sumarDias(hoy, 7), `type="date" min="${hoy}" required`)) + campo("Condición de pago", "condicion", selector("condicion", ["Contado", "Crédito 30 días"], "Contado")) + campo("Promoción", "promocion", '<select id="promocion" name="promocionId"><option value="">Sin promoción</option></select>') + campo("Descuento manual (%)", "descuento", texto("descuento", 0, 'type="number" min="0" max="20" step="0.01" required'));
    c.formulario("Nueva cotización", `<div class="campos">${campos}</div><label for="motivo-descuento">Motivo del descuento</label><textarea id="motivo-descuento" name="motivo" maxlength="300"></textarea><p class="texto-suave">Más de 5 % requiere aprobación de otra persona de Jefatura. Máximo 20 %.</p><div id="vista-calculo"></div>`, valores => {
      const documento = operacion(actuales => r.crearCotizacion(actuales, { oportunidadId: valores.get("oportunidadId"), fecha: c.fechaHoy(), vigenteHasta: valores.get("vigencia"), entrega: valores.get("entrega"), condicion: valores.get("condicion"), descuentoBps: pesos(valores.get("descuento") || 0), promocionId: valores.get("promocionId"), motivo: valores.get("motivo") }, actor(), c.configuracion.parametros));
      return volver(`cotizaciones/${documento.id}`);
    }, "Guardar cotización");
    c.$("#oportunidad-cotizacion").value = id;
    function recalcular(cambiarOportunidad = false) {
      const op = oportunidades.find(o => o.id === c.$("#oportunidad-cotizacion").value);
      if (cambiarOportunidad) {
        const segmento = datos().clientes.find(cliente => cliente.id === op?.clienteId)?.segmento;
        c.$("#promocion").innerHTML = '<option value="">Sin promoción</option>' + datos().promociones.filter(p => p.activa && r.aprobado(p) && p.desde <= hoy && hoy <= p.hasta && p.canal === op?.canal && p.segmento === segmento).map(p => `<option value="${e(p.id)}">${e(p.nombre)}</option>`).join("");
      }
      const promo = c.$("#promocion").value;
      c.$("#descuento").disabled = Boolean(promo);
      if (promo) c.$("#descuento").value = "0";
      c.$("#motivo-descuento").required = !promo && Number(c.$("#descuento").value) > 0;
      try {
        if (!op) throw new Error("Selecciona la oportunidad para calcular su propuesta.");
        const calculo = r.calcular(datos(), op, { fecha: hoy, descuentoBps: pesos(c.$("#descuento").value), promocionId: promo }, c.configuracion.parametros);
        c.$("#vigencia").max = calculo.listaVigenteHasta;
        if (c.$("#vigencia").value > calculo.listaVigenteHasta) c.$("#vigencia").value = calculo.listaVigenteHasta;
        c.$("#vista-calculo").innerHTML = `<p class="texto-suave">${e(calculo.listaNombre)} · Vigencia hasta ${c.fechaCorta(calculo.listaVigenteHasta)}</p>` + c.detalleLineas(calculo) + c.totales(calculo);
        c.$('#formulario-registro button[type="submit"]').disabled = false;
      } catch (error) {
        c.$("#vista-calculo").innerHTML = `<p class="error">${e(error.message)}</p>`;
        c.$('#formulario-registro button[type="submit"]').disabled = true;
      }
    }
    c.$("#oportunidad-cotizacion").addEventListener("change", () => recalcular(true));
    c.$("#promocion").addEventListener("change", () => recalcular()); c.$("#descuento").addEventListener("input", () => recalcular());
    recalcular(true);
  }

  function aprobaciones() {
    const propios = solicitud => esJefatura() || solicitud.registradoPor === actor().nombre;
    const maestros = datos().solicitudesMaestro.filter(propios).map(s => `<tr><td>${e(s.tipo)}</td><td>${b(s.datos.nombre || s.datos.codigo, "ver-maestro", s.id, "enlace-boton")}</td><td>${e(s.registradoPor)}</td><td>${c.etiqueta(s.estado)}</td><td>${esJefatura() && s.estado === "Pendiente" ? b("Aprobar", "aprobar-maestro", s.id) + b("Rechazar", "rechazar-maestro", s.id) : ""}</td></tr>`);
    const descuentos = deSede(datos().cotizaciones).filter(cot => cot.autorizacion !== "No requiere" && propios(cot)).map(cot => `<tr><td>${c.enlace(cot.numero, `cotizaciones/${cot.id}`)}</td><td>${porcentaje(cot.descuentoBps)}<small>${e(cot.motivoDescuento)}</small></td><td>${e(cot.registradoPor)}</td><td>${c.etiqueta(cot.autorizacion)}</td><td>${esJefatura() && cot.autorizacion === "Pendiente" ? b("Aprobar", "aprobar-descuento", cot.id) + b("Rechazar", "rechazar-descuento", cot.id) : ""}</td></tr>`);
    const pedidos = deSede(datos().pedidos).filter(p => p.estado === "Pendiente de aprobación").map(p => `<tr><td>${c.enlace(p.numero, `pedidos/${p.id}`)}</td><td>${e(p.cliente.nombre)}</td><td>${e(p.registradoPor)}</td><td class="numero">${c.moneda(p.total)}</td><td>${esJefatura() ? b("Revisar y aprobar", "aprobar-pedido", p.id) : "Pendiente de Jefatura"}</td></tr>`);
    return c.cabecera("Aprobaciones", "Revisa la propuesta antes de decidir. No se permite resolver una solicitud propia.") + c.tabla("Altas y cambios de maestros", ["Tipo", "Registro", "Solicitante", "Estado", "Decisión"], maestros) + '<div class="separador-vista"></div>' + c.tabla("Excepciones de descuento", ["Cotización", "Descuento", "Solicitante", "Estado", "Decisión"], descuentos, false) + '<div class="separador-vista"></div>' + c.tabla("Pedidos con controles favorables", ["Pedido", "Cliente", "Registrado por", "Total", "Decisión"], pedidos, false);
  }

  function verMaestro(id) {
    const solicitud = datos().solicitudesMaestro.find(s => s.id === id);
    if (!solicitud) return;
    const etiquetas = { nombre: "Nombre", documento: "Documento", tipoDocumento: "Tipo", direccion: "Entrega", direccionFiscal: "Dirección fiscal", direccionCobranza: "Cobranza", segmento: "Segmento", canal: "Canal", desde: "Vigencia desde", hasta: "Vigencia hasta", activa: "Activa", coste: "Coste", descuentoBps: "Descuento", codigo: "Código", familia: "Familia", unidad: "Unidad", correo: "Correo", telefono: "Teléfono", zona: "Zona", condicionPreferida: "Condición de pago", moneda: "Moneda" };
    const valores = Object.entries(solicitud.datos).filter(([clave]) => clave !== "precios").map(([clave, valor]) => `<div><dt>${e(etiquetas[clave] || clave)}</dt><dd>${clave === "coste" ? c.moneda(valor) : clave === "descuentoBps" ? porcentaje(valor) : e(String(valor))}</dd></div>`).join("");
    const precios = solicitud.datos.precios ? c.tabla("Precios propuestos", ["Producto", "Precio sin IGV"], Object.entries(solicitud.datos.precios).map(([codigo, precio]) => `<tr><td>${e(productoNombre(codigo))}</td><td>${c.moneda(precio)}</td></tr>`), false) : "";
    c.abrirModal("Propuesta de " + solicitud.tipo, `<dl class="detalle-documento">${valores}</dl>${precios}${c.mostrarHistorial(solicitud.historial)}`);
  }

  function detalle(d, tipo) {
    if (tipo === "cotizaciones") return `<section class="detalle-extra"><h3>Condiciones comerciales</h3><dl class="detalle-documento"><div><dt>Lista</dt><dd>${e(d.listaNombre)}</dd></div><div><dt>Descuento / origen</dt><dd>${porcentaje(d.descuentoBps)} · ${e(d.origenDescuento || "Sin descuento")}</dd></div><div><dt>Motivo</dt><dd>${e(d.motivoDescuento || "Sin descuento")}</dd></div><div><dt>Autorización</dt><dd>${e(d.autorizacion)}${d.aprobador ? " · " + e(d.aprobador) : ""}</dd></div></dl></section>`;
    if (tipo !== "pedidos") return "";
    const control = d.controles;
    const cantidades = r.cantidadesAtendidas(d);
    const detalleCredito = control?.credito.datos ? `<dl class="detalle-documento"><div><dt>Límite informado por Finanzas</dt><dd>${c.moneda(control.credito.datos.limite)}</dd></div><div><dt>Exposición / vencido</dt><dd>${c.moneda(control.credito.datos.exposicion)} / ${c.moneda(control.credito.datos.vencido)}</dd></div></dl>` : "";
    const detalleStock = control ? c.tabla("Disponibilidad consultada", ["Producto", "Solicitado", "Disponible informado"], control.disponibilidad.map(l => `<tr><td>${e(productoNombre(l.codigo))}</td><td>${l.solicitada}</td><td>${l.disponible == null ? "Sin respuesta" : l.disponible}</td></tr>`), false) : "";
    const controles = control ? `<p>${e(control.stockOrigen)} · ${e(control.credito.origen)}</p><ul>${control.motivos.length ? control.motivos.map(m => `<li>${e(m)}</li>`).join("") : "<li>Identificación, disponibilidad y condición de crédito favorables.</li>"}</ul><small>Consultado: ${c.fechaTexto(control.fecha)}</small>${detalleCredito}${detalleStock}` : "<p>Controles aún no consultados.</p>";
    const lineas = d.lineas.map(l => `<tr><td>${e(l.nombre)}</td><td>${l.cantidad}</td><td>${cantidades[l.codigo]}</td><td>${l.cantidad - cantidades[l.codigo]}</td></tr>`);
    const derivados = [...d.entregas.map(entrega => `${entrega.numero} · Despachos`), ...d.facturas.map(f => `${f.numero} · Facturación`)].map(ref => `<li>${e(ref)}</li>`).join("");
    const solicitudes = datos().solicitudes.filter(s => s.pedidoId === d.id).map(s => c.enlace(`${s.numero} · ${s.tipo} · ${s.estado}`, `solicitudes/${s.id}`)).join(" · ");
    return `<section class="detalle-extra"><h3>Controles de aprobación</h3>${controles}<h3>Cantidades y atención parcial</h3>${c.tabla("Seguimiento", ["Producto", "Pedido", "Atendido", "Pendiente"], lineas, false)}<h3>Documentos informados por otras áreas</h3><ul>${derivados || "<li>Sin entregas ni facturas informadas.</li>"}</ul><h3>Solicitudes comerciales</h3><p>${solicitudes || "Sin solicitudes"}</p></section>`;
  }

  function botones(d, tipo) {
    if (tipo === "cotizaciones") {
      return (["Borrador", "Enviada"].includes(d.estado) ? b("Anular cotización", "anular-cotizacion", d.id) : "") + (d.vigenteHasta < c.fechaHoy() && ["Borrador", "Enviada", "Pendiente de aprobación"].includes(d.estado) ? b("Marcar vencida", "vencer-cotizacion", d.id) : "") + (esJefatura() && d.autorizacion === "Pendiente" && d.vigenteHasta >= c.fechaHoy() ? b("Aprobar descuento", "aprobar-descuento", d.id) + b("Rechazar descuento", "rechazar-descuento", d.id) : "");
    }
    if (tipo !== "pedidos" || d.estado === "Anulado") return "";
    let html = "";
    if (d.estado === "Bloqueado" && d.controles?.disponibilidad.some(l => !l.aprobado)) html += b("Solicitar abastecimiento", "solicitar-abastecimiento", d.id);
    if (["Borrador", "Bloqueado", "Pendiente de aprobación"].includes(d.estado)) html += b("Validar controles", "validar-pedido", d.id);
    if (esJefatura() && ["Borrador", "Bloqueado", "Pendiente de aprobación"].includes(d.estado)) html += b("Revisar y aprobar", "aprobar-pedido", d.id, "boton primario");
    if (esJefatura() && ["Borrador", "Pendiente de aprobación", "Aprobado"].includes(d.estado) && !d.entregas.length && !d.facturas.length) html += b("Bloquear", "bloquear-pedido", d.id);
    if (["Aprobado", "Parcialmente atendido", "Atendido", "Facturado"].includes(d.estado)) html += b("Consultar seguimiento", "seguimiento-pedido", d.id);
    if (!d.entregas.length && !d.facturas.length) html += b("Solicitar anulación", "solicitar-anulacion", d.id);
    if (d.entregas.length) html += b("Solicitar devolución", "solicitar-devolucion", d.id);
    return html;
  }

  function solicitudes() {
    const filas = deSede(datos().solicitudes).map(s => `<tr><td>${c.enlace(s.numero, `solicitudes/${s.id}`)}</td><td>${e(s.tipo)}</td><td>${e(s.pedidoNumero)}</td><td>${e(s.cliente.nombre)}</td><td>${c.etiqueta(s.estado)}</td><td>${e(s.registradoPor)}</td></tr>`);
    return c.cabecera("Postventa", "Anulaciones y devoluciones con motivo, revisión y documentos relacionados.") + c.tabla("Solicitudes comerciales", ["Solicitud", "Tipo", "Pedido", "Cliente", "Estado", "Solicitante"], filas);
  }

  function solicitar(id, tipo) {
    const pedido = datos().pedidos.find(p => p.id === id && p.sede === actor().sede);
    if (!pedido) return;
    const atendidas = r.cantidadesAtendidas(pedido);
    const cantidades = tipo === "Devolución" ? pedido.lineas.map(l => campo(`${e(l.nombre)} (entregado: ${atendidas[l.codigo]})`, `devolver-${l.codigo}`, texto(`devolver-${l.codigo}`, 0, `type="number" min="0" max="${atendidas[l.codigo]}" step="1" required`))).join("") : "";
    c.formulario(`Solicitar ${tipo.toLocaleLowerCase("es")}`, `<p>Pedido ${e(pedido.numero)}</p>${razon}<div class="campos">${cantidades}</div>`, valores => {
      const solicitud = operacion(actuales => r.crearSolicitud(actuales, { pedidoId: id, tipo, motivo: valores.get("motivo"), lineas: pedido.lineas.map(l => ({ codigo: l.codigo, cantidad: Number(valores.get(`devolver-${l.codigo}`) || 0) })) }, actor()));
      return volver(`solicitudes/${solicitud.id}`);
    }, "Enviar a revisión");
  }

  function ficha(tipo, id) {
    if (tipo !== "solicitudes") return false;
    const s = datos().solicitudes.find(solicitud => solicitud.id === id && solicitud.sede === actor().sede);
    if (!s) { c.$("#contenido").innerHTML = '<p class="tarjeta vacio">Solicitud no encontrada en esta sede.</p>'; return true; }
    const pedido = datos().pedidos.find(p => p.id === s.pedidoId);
    const referencias = [["Recepción en Inventarios", s.seguimiento?.recepcion], ["Nota de crédito de Facturación", s.seguimiento?.notaCredito], ["Regularización en Finanzas", s.seguimiento?.ajusteFinanciero]].map(([nombre, valor]) => `<div><dt>${nombre}</dt><dd>${e(r.referenciaValida(valor) ? typeof valor === "object" ? valor.numero || valor.referencia : valor : "Pendiente")}</dd></div>`).join("");
    const lineas = s.lineas.length ? c.tabla("Productos a devolver", ["Producto", "Cantidad"], s.lineas.map(l => `<tr><td>${e(pedido.lineas.find(pl => pl.codigo === l.codigo)?.nombre || l.codigo)}</td><td>${l.cantidad}</td></tr>`), false) : "";
    const contenido = `<article class="ficha"><div class="cabecera-documento"><h3>${e(s.numero)} · ${e(s.tipo)}</h3>${c.etiqueta(s.estado)}</div><dl class="detalle-documento"><div><dt>Pedido de origen</dt><dd>${c.enlace(s.pedidoNumero, `pedidos/${s.pedidoId}`)}</dd></div><div><dt>Cliente</dt><dd>${e(s.cliente.nombre)}</dd></div><div><dt>Solicitante / sede</dt><dd>${e(s.registradoPor)} / ${e(c.sedeNombre(s.sede))}</dd></div><div><dt>Motivo</dt><dd>${e(s.motivo)}</dd></div></dl>${lineas}${s.tipo === "Devolución" ? `<h3>Seguimiento de áreas relacionadas</h3><dl class="detalle-documento">${referencias}</dl>` : ""}${c.mostrarHistorial(s.historial)}</article>`;
    const decisiones = esJefatura() && s.estado === "Pendiente" ? b("Autorizar", "autorizar-solicitud", id) + b("Rechazar", "rechazar-solicitud", id) : "";
    c.$("#contenido").innerHTML = c.cabecera("Solicitud comercial", s.numero, c.enlace("← Volver", "solicitudes")) + `<section class="tarjeta ficha-completa">${contenido}<div class="acciones-documento">${decisiones}${s.tipo === "Devolución" && s.estado === "Autorizada" ? b("Consultar avance", "seguimiento-devolucion", id) : ""}${b("Imprimir ficha", "imprimir", id)}</div></section>`;
    const impresion = document.createElement("div"); impresion.className = "vista-imprimir";
    impresion.innerHTML = c.$(".marca").outerHTML + contenido;
    impresion.querySelectorAll("button").forEach(boton => boton.replaceWith(document.createTextNode(boton.textContent)));
    document.body.append(impresion); document.body.classList.add("imprimir-documento");
    return true;
  }

  function oportunidad(id) {
    const op = datos().oportunidades.find(o => o.id === id && o.sede === actor().sede);
    if (!op) { c.$("#contenido").innerHTML = '<p class="tarjeta vacio">Oportunidad no encontrada en esta sede.</p>'; return; }
    const propuestas = datos().cotizaciones.filter(cot => cot.oportunidadId === id);
    const productos = c.tabla("Productos de interés", ["Código", "Producto", "Cantidad"], op.lineas.map(l => `<tr><td>${e(l.codigo)}</td><td>${e(productoNombre(l.codigo))}</td><td>${l.cantidad}</td></tr>`), false);
    c.$("#contenido").innerHTML = c.cabecera(op.numero, op.asunto, b("Preparar cotización", "nueva-cotizacion", id, "boton primario")) + `<section class="tarjeta ficha-completa"><dl class="detalle-documento"><div><dt>Cliente</dt><dd>${e(datos().clientes.find(cliente => cliente.id === op.clienteId)?.nombre)}</dd></div><div><dt>Canal / sede</dt><dd>${e(op.canal)} / ${e(c.sedeNombre(op.sede))}</dd></div><div><dt>Responsable</dt><dd>${e(op.vendedor)}</dd></div><div><dt>Estado</dt><dd>${c.etiqueta(op.estado)}</dd></div></dl>${productos}<h3>Cotizaciones derivadas</h3><p>${propuestas.map(cot => c.enlace(cot.numero, `cotizaciones/${cot.id}`)).join(" · ") || "Sin cotizaciones"}</p>${c.mostrarHistorial(op.historial || [])}<div class="acciones-documento">${b("Registrar seguimiento", "seguimiento-oportunidad", id)}</div></section>`;
  }

  function seguimientoOportunidad(id) {
    c.formulario("Seguimiento de oportunidad", campo("Estado", "estado-oportunidad", selector("estado-oportunidad", ["En seguimiento", "Perdida"], "En seguimiento")) + razon, valores => {
      operacion(actuales => {
        const op = actuales.oportunidades.find(o => o.id === id && o.sede === actor().sede);
        if (!op) throw new Error("Oportunidad no encontrada.");
        if (valores.get("estado-oportunidad") === "Perdida" && actuales.pedidos.some(p => p.oportunidadId === id && p.estado !== "Anulado")) throw new Error("La oportunidad tiene pedidos vigentes; no puede cerrarse como perdida.");
        op.estado = valores.get("estado-oportunidad"); op.historial ??= [];
        op.historial.push(r.evento(actor(), `${op.estado}: ${r.motivoValido(valores.get("motivo"))}`));
      });
      return volver(`oportunidades/${id}`);
    });
  }

  function indicadores() {
    const coincide = d => (!filtro.desde || filtro.desde <= d.fecha) && (!filtro.hasta || d.fecha <= filtro.hasta) && (filtro.canal === "Todos" || d.canal === filtro.canal);
    const cotizaciones = deSede(datos().cotizaciones).filter(coincide), pedidos = deSede(datos().pedidos).filter(coincide);
    const vigentes = pedidos.filter(p => ["Aprobado", "Parcialmente atendido", "Atendido", "Facturado"].includes(p.estado));
    const bruto = cotizaciones.reduce((s, cot) => s + (cot.bruto || cot.subtotal), 0), descuentos = cotizaciones.reduce((s, cot) => s + cot.descuento, 0);
    const importe = vigentes.reduce((s, p) => s + p.subtotal, 0), coste = vigentes.flatMap(p => p.lineas).reduce((s, l) => s + (l.coste || 0) * l.cantidad, 0);
    const conversion = cotizaciones.length ? Math.round(cotizaciones.filter(cot => cot.estado === "Aceptada").length * 100 / cotizaciones.length) : 0;
    const metricas = [["Cotizado (sin IGV)", c.moneda(cotizaciones.reduce((s, cot) => s + cot.subtotal, 0))], ["Pedidos aprobados (sin IGV)", c.moneda(importe)], ["Conversión de cotizaciones", conversion + " %"], ["Descuento ponderado", (bruto ? descuentos * 100 / bruto : 0).toFixed(2) + " %"], ["Ticket de pedido aprobado", c.moneda(vigentes.length ? Math.round(importe / vigentes.length) : 0)], ["Pedidos bloqueados", pedidos.filter(p => p.estado === "Bloqueado").length]];
    const costesCompletos = vigentes.flatMap(p => p.lineas).every(l => Number.isSafeInteger(l.coste));
    if (esJefatura()) metricas.push(["Margen comercial estimado", costesCompletos ? c.moneda(importe - coste) : "Sin coste informado"]);
    const filas = pedidos.map(p => { const atendidas = r.cantidadesAtendidas(p); const pendiente = p.estado === "Anulado" ? 0 : p.lineas.reduce((s, l) => s + l.cantidad - atendidas[l.codigo], 0); return `<tr><td>${c.enlace(p.numero, `pedidos/${p.id}`)}</td><td>${e(p.cliente.nombre)}</td><td>${e(p.canal)}</td><td>${c.etiqueta(p.estado)}</td><td>${pendiente}</td><td>${p.facturas.length ? p.facturas.map(f => e(f.numero)).join(", ") : "Sin factura informada"}</td></tr>`; });
    return c.cabecera("Indicadores comerciales", "Pedidos y propuestas de la sede. Los importes no representan cobros ni asientos.") + `<div class="filtros-comerciales">${campo("Desde", "indicador-desde", texto("indicador-desde", filtro.desde, 'type="date"'))}${campo("Hasta", "indicador-hasta", texto("indicador-hasta", filtro.hasta, 'type="date"'))}${campo("Canal", "indicador-canal", selector("indicador-canal", ["Todos", "Tienda", "Web", "Teléfono"], filtro.canal))}</div><div class="indicadores">${metricas.map(([nombre, valor]) => `<div class="tarjeta indicador"><small>${nombre}</small><strong class="importe-indicador">${valor}</strong></div>`).join("")}</div><section class="tarjeta conversion"><h2>Cotizaciones aceptadas</h2><progress value="${conversion}" max="100" aria-label="Conversión de cotizaciones">${conversion} %</progress><span>${conversion} %</span></section>` + c.tabla("Seguimiento de pedidos, entregas y facturación", ["Pedido", "Cliente", "Canal", "Estado", "Unidades pendientes", "Facturación"], filas);
  }

  document.addEventListener("change", evento => {
    if (!["indicador-desde", "indicador-hasta", "indicador-canal"].includes(evento.target.id)) return;
    filtro = { desde: c.$("#indicador-desde").value, hasta: c.$("#indicador-hasta").value, canal: c.$("#indicador-canal").value };
    if (filtro.desde && filtro.hasta && filtro.desde > filtro.hasta) { c.aviso("La fecha inicial debe ser anterior a la final."); return; }
    c.navegar(volver("indicadores"));
  });

  function accion(nombre, id) {
    const comandos = {
      "nuevo-producto": () => producto(), "editar-producto": () => producto(id),
      "editar-cliente": () => cliente(id), "nueva-lista": () => listaPrecio(), "editar-lista": () => listaPrecio(id),
      "ver-lista": () => verLista(id), "nueva-promocion": () => promocion(), "editar-promocion": () => promocion(id), "ver-maestro": () => verMaestro(id),
      "aprobar-maestro": () => resolverMaestro(id, true), "rechazar-maestro": () => resolverMaestro(id, false),
      "aprobar-descuento": () => resolverDescuento(id, true), "rechazar-descuento": () => resolverDescuento(id, false),
      "validar-pedido": () => validarPedido(id, false), "aprobar-pedido": () => validarPedido(id, true),
      "bloquear-pedido": () => registrar("Bloquear pedido", motivo => operacion(actuales => r.bloquearPedido(actuales, id, motivo, actor(), window.IntegracionesComerciales)), volver(`pedidos/${id}`)),
      "solicitar-abastecimiento": () => c.solicitarAbastecimiento(datos().pedidos.find(p => p.id === id && p.sede === actor().sede)),
      "seguimiento-pedido": () => { operacion(actuales => r.sincronizarPedido(actuales, id, actor(), window.IntegracionesComerciales)); c.navegar(volver(`pedidos/${id}`)); },
      "anular-cotizacion": () => registrar("Anular cotización", motivo => operacion(actuales => r.cambiarCotizacion(actuales, id, "Anulada", motivo, actor(), c.fechaHoy())), volver(`cotizaciones/${id}`)),
      "vencer-cotizacion": () => { operacion(actuales => r.cambiarCotizacion(actuales, id, "Vencida", "", actor(), c.fechaHoy())); c.navegar(volver(`cotizaciones/${id}`)); },
      "solicitar-anulacion": () => solicitar(id, "Anulación"), "solicitar-devolucion": () => solicitar(id, "Devolución"),
      "autorizar-solicitud": () => resolverSolicitud(id, true), "rechazar-solicitud": () => resolverSolicitud(id, false),
      "seguimiento-devolucion": () => { operacion(actuales => r.seguirDevolucion(actuales, id, actor(), window.IntegracionesComerciales)); c.navegar(volver(`solicitudes/${id}`)); },
      "seguimiento-oportunidad": () => seguimientoOportunidad(id)
    };
    if (!comandos[nombre]) return false;
    comandos[nombre](); return true;
  }

  function resolverMaestro(id, aceptar) {
    registrar(aceptar ? "Aprobar maestro" : "Rechazar maestro", motivo => operacion(actuales => r.resolverMaestro(actuales, id, aceptar, motivo, actor())), volver("aprobaciones"));
  }
  function resolverDescuento(id, aceptar) {
    registrar(aceptar ? "Aprobar descuento" : "Rechazar descuento", motivo => operacion(actuales => r.resolverDescuento(actuales, id, aceptar, motivo, actor(), c.fechaHoy())), volver(`cotizaciones/${id}`));
  }
  function validarPedido(id, aprobar) {
    const p = operacion(actuales => aprobar ? r.aprobarPedido(actuales, id, actor(), window.IntegracionesComerciales) : r.validarPedido(actuales, id, actor(), window.IntegracionesComerciales));
    c.navegar(volver(`pedidos/${id}`)); c.aviso(p.estado === "Bloqueado" ? p.controles.motivos.join(". ") : p.estado === "Aprobado" ? "Pedido aprobado comercialmente." : "Controles favorables; pendiente de otra persona de Jefatura.");
  }
  function resolverSolicitud(id, aceptar) {
    registrar(aceptar ? "Autorizar solicitud" : "Rechazar solicitud", motivo => operacion(actuales => r.resolverSolicitud(actuales, id, aceptar, motivo, actor(), window.IntegracionesComerciales)), volver(`solicitudes/${id}`));
  }

  return { vista, cliente, verCliente, nuevaCotizacion, oportunidad, ficha, detalle, botones, accion };
};
