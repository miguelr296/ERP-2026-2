"use strict";

window.PantallasLogistica = c => {
  const A = window.LogisticaAplicacion, L = window.LogisticaReglas, C = window.ComprasReglas, D = window.DistribucionReglas;
  const e = c.esc, actor = () => c.sesion, datos = () => A.leer(), productos = () => A.productos();
  const jefatura = () => actor()?.rol === "Jefatura";
  const compra = () => ["Compras", "Jefatura"].includes(actor()?.rol);
  const almacen = () => ["Almacén", "Jefatura"].includes(actor()?.rol);
  const transporte = () => ["Transporte", "Jefatura"].includes(actor()?.rol);
  let modulo = "logistica", vistaActual = "resumen";
  const permitir = roles => roles.includes(actor()?.rol);
  const b = (titulo, comando, id = "", clase = "boton") => `<button type="button" class="${clase}" data-log-accion="${comando}" data-id="${e(id)}">${e(titulo)}</button>`;
  const enlace = (titulo, destino) => `<button type="button" class="enlace-boton" data-log-vista="${e(destino)}">${e(titulo)}</button>`;
  const ir = destino => c.navegar(`${modulo}/${destino}`);
  const hoy = () => c.fechaHoy();
  const propios = (lista, destino = false) => lista.filter(d => (!d.sede || d.sede === actor().sede || (destino && d.sedeDestino === actor().sede)) && (actor().rol !== "Asesor" || d.registradoPor === actor().nombre));
  const nombreProducto = codigo => productos().find(p => p.codigo === codigo)?.nombre || codigo;
  const nombreAlmacen = id => datos().almacenes.find(a => a.id === id)?.nombre || id;
  const nombreProveedor = id => datos().proveedores.find(p => p.id === id)?.nombre || id;
  const opcion = (valor, titulo, seleccionado) => `<option value="${e(valor)}" ${valor === seleccionado ? "selected" : ""}>${e(titulo)}</option>`;
  const select = (id, opciones, seleccionado, extra = "") => `<select id="log-${id}" name="${id}" ${extra}>${opciones.map(o => opcion(o[0], o[1], seleccionado)).join("")}</select>`;
  const campo = (titulo, id, contenido) => `<div><label for="log-${id}">${titulo}</label>${contenido}</div>`;
  const input = (id, valor = "", extra = "required") => `<input id="log-${id}" name="${id}" value="${e(valor)}" ${extra}>`;
  const selectSimple = (id, valores, seleccionado) => select(id, valores.map(v => [v, v]), seleccionado);
  const razon = campo("Motivo / evidencia", "motivo", '<textarea id="log-motivo" name="motivo" minlength="3" maxlength="500" required></textarea>');
  const cantidad = id => input(id, 0, 'type="number" min="0" step="1" required');
  const fecha = (id, valor = hoy()) => input(id, valor, 'type="date" required');
  const monedas = valor => c.moneda(valor || 0);
  const ejecutar = comando => A.ejecutar(actor(), comando);

  const secciones = {
    resumen: ["Inicio", "Inicio", ["Asesor", "Compras", "Almacén", "Transporte", "Jefatura"]],
    planificacion: ["Planificación", "Planificación", ["Compras", "Jefatura"]],
    requisiciones: ["Necesidades", "Compras", ["Asesor", "Compras", "Almacén", "Jefatura"]],
    proveedores: ["Proveedores", "Compras", ["Compras", "Jefatura"]],
    peticionesOferta: ["Peticiones de oferta", "Compras", ["Compras", "Jefatura"]],
    ofertas: ["Comparación de ofertas", "Compras", ["Compras", "Jefatura"]],
    acuerdos: ["Acuerdos marco", "Compras", ["Compras", "Jefatura"]],
    ordenes: ["Órdenes de compra", "Compras", ["Compras", "Jefatura"]],
    facturas: ["Verificación de facturas", "Compras", ["Compras", "Jefatura"]],
    evaluaciones: ["Evaluación de proveedores", "Control", ["Compras", "Jefatura"]],
    recepciones: ["Recepción y calidad", "Recepción", ["Almacén", "Jefatura"]],
    inventario: ["Existencias y movimientos", "Almacenes", ["Almacén", "Compras", "Jefatura"]],
    reservas: ["Reservas", "Distribución", ["Almacén", "Jefatura"]],
    picking: ["Picking y embalaje", "Distribución", ["Almacén", "Jefatura"]],
    despachos: ["Despachos y entregas", "Distribución", ["Almacén", "Transporte", "Jefatura"]],
    retornos: ["Retornos y devoluciones", "Recepción", ["Almacén", "Jefatura"]],
    traslados: ["Traslados entre sedes", "Almacenes", ["Almacén", "Compras", "Jefatura"]],
    conteos: ["Inventario físico", "Almacenes", ["Almacén", "Jefatura"]],
    acciones: ["Acciones de mejora", "Control", ["Compras", "Almacén", "Jefatura"]],
    control: ["Indicadores logísticos", "Control", ["Compras", "Almacén", "Transporte", "Jefatura"]]
  };

  function admite(id) {
    if (!actor()) return false;
    return id === "compras" ? compra() : id === "despachos" ? permitir(["Almacén", "Transporte", "Jefatura"]) : permitir(["Asesor", "Compras", "Almacén", "Transporte", "Jefatura"]);
  }

  function cabecera(titulo, texto = "", botones = "") {
    return `<div class="encabezado-vista"><div><p class="ceja">LOGÍSTICA / ${e(c.sedeNombre(actor().sede))}</p><h1>${e(titulo)}</h1><p>${e(texto)}</p></div><div class="acciones-documento">${botones}</div></div>`;
  }

  function dibujar(idModulo, partes) {
    modulo = idModulo;
    c.$("#accesos-rapidos").hidden = true;
    document.title = `${idModulo === "compras" ? "Compras" : idModulo === "despachos" ? "Despachos" : "Logística"} · FAMIHOGAR`;
    if (!admite(idModulo)) {
      c.$("#navegacion").innerHTML = "";
      c.$("#contenido").innerHTML = cabecera("Logística", "Esta área no tiene operaciones para tu rol.") + '<a class="boton" href="#aplicaciones">Volver a aplicaciones</a>';
      return;
    }
    vistaActual = secciones[partes[1]] ? partes[1] : idModulo === "compras" ? "ordenes" : idModulo === "despachos" ? "despachos" : "resumen";
    const permitidas = Object.entries(secciones).filter(([, s]) => permitir(s[2]));
    const grupo = secciones[vistaActual]?.[1] || "Inicio";
    c.$("#navegacion").setAttribute("aria-label", "Procesos logísticos");
    const grupos = [...new Set(permitidas.map(([, s]) => s[1]))];
    c.$("#navegacion").innerHTML = grupos.map(g => `<button type="button" data-log-vista="${permitidas.find(([, s]) => s[1] === g)[0]}" ${g === grupo ? 'aria-current="page"' : ""}>${g}</button>`).join("");
    const sub = `<div class="log-submenu">${permitidas.filter(([, s]) => s[1] === grupo).map(([id, s]) => `<button type="button" data-log-vista="${id}" ${id === vistaActual ? 'aria-current="page"' : ""}>${s[0]}</button>`).join("")}</div>`;
    try {
      if (partes[1] === "pedido" && partes[2]) { fichaPedido(partes[2]); return; }
      L.exigir(permitir(secciones[vistaActual][2]), "No tienes acceso a ese proceso logístico.");
      if (partes[2]) ficha(vistaActual, partes[2], sub);
      else c.$("#contenido").innerHTML = sub + lista(vistaActual);
    } catch (error) { c.$("#contenido").innerHTML = cabecera("Logística") + `<p class="tarjeta vacio error">${e(error.message)}</p>`; }
    c.$("#contenido").focus();
  }

  function lista(vista) {
    if (vista === "resumen") return resumen();
    if (vista === "inventario") return inventario();
    if (vista === "planificacion") return planificacion();
    if (vista === "control") return control();
    const d = datos(), filas = propios(d[vista] || [], vista === "traslados");
    const nuevos = {
      proveedores: compra() ? b("+ Nuevo proveedor", "proveedor", "", "boton primario") : "",
      requisiciones: b("+ Nueva necesidad", "requisicion", "", "boton primario"),
      peticionesOferta: compra() ? b("+ Pedir ofertas", "peticion", "", "boton primario") : "",
      ofertas: compra() ? b("+ Registrar oferta", "oferta", "", "boton primario") : "",
      acuerdos: compra() ? b("+ Nuevo acuerdo", "acuerdo", "", "boton primario") : "",
      ordenes: compra() ? b("+ Preparar orden", "orden", "", "boton primario") : "",
      recepciones: almacen() ? b("+ Recibir mercancía", "recepcion", "", "boton primario") : "",
      facturas: compra() ? b("+ Verificar factura", "factura", "", "boton primario") : "",
      reservas: almacen() ? b("+ Reservar pedido", "reserva", "", "boton primario") : "",
      picking: almacen() ? b("+ Generar picking", "picking", "", "boton primario") : "",
      despachos: almacen() ? b("+ Preparar despacho", "despacho", "", "boton primario") : "",
      retornos: almacen() ? b("+ Recibir devolución", "devolucion", "", "boton primario") : "",
      traslados: b("+ Solicitar traslado", "traslado", "", "boton primario"),
      conteos: b("+ Registrar conteo", "conteo", "", "boton primario"),
      evaluaciones: b("+ Evaluar proveedor", "evaluacion", "", "boton primario"),
      acciones: b("+ Nueva acción", "accion", "", "boton primario")
    };
    if (vista === "ofertas") return cabecera(secciones[vista][0], "Compara precio, plazo y calidad antes de adjudicar.", nuevos[vista]) + c.tabla("Ofertas recibidas", ["Oferta", "Proveedor", "Petición", "Base sin IGV", "Plazo / calidad", "Vigencia", "Estado"], filas.map(o => `<tr><td>${enlace(o.numero, `ofertas/${o.id}`)}</td><td>${e(nombreProveedor(o.proveedorId))}</td><td>${e(d.peticionesOferta.find(p => p.id === o.peticionId)?.numero)}</td><td class="numero">${monedas(o.base)}</td><td>${o.plazoDias} días / ${o.calidad} de 5</td><td>${c.fechaCorta(o.vigenteHasta)}</td><td>${c.etiqueta(o.estado)}</td></tr>`));
    if (vista === "proveedores") return cabecera(secciones[vista][0], "Altas y modificaciones con revisión independiente.", nuevos[vista]) + c.tabla("Proveedores", ["Proveedor", "RUC", "Contacto", "Condición", "Estado"], filas.map(p => `<tr><td>${enlace(p.nombre, `proveedores/${p.id}`)}</td><td>${e(p.ruc)}</td><td>${e(p.correo)}<small>${e(p.telefono)}</small></td><td>${e(p.condicion)}</td><td>${c.etiqueta(p.estado)}${p.propuesta ? " · Cambio pendiente" : ""}</td></tr>`));
    const descripcion = { recepciones: "La mercancía recibida queda en cuarentena hasta inspeccionarse.", facturas: "Cotejo orden–recepción–factura. El pago corresponde a Finanzas.", reservas: "La reserva compromete stock; la salida se registra al despachar.", despachos: "Picking, salida, transporte y confirmación de entrega.", retornos: "La recepción física no emite notas de crédito ni registra pagos.", traslados: "Salida y recepción independientes entre almacenes.", conteos: "Ajustes con motivo, revisión y control de reservas." };
    return cabecera(secciones[vista][0], descripcion[vista] || "Documentos, responsables y seguimiento de la sede.", nuevos[vista]) + c.tabla(secciones[vista][0], ["Documento", "Referencia", "Responsable", "Estado"], filas.map(registro => `<tr><td>${enlace(registro.numero || registro.nombre, `${vista}/${registro.id}`)}</td><td>${e(registro.pedidoNumero || registro.origen || registro.documento || registro.descripcion || registro.motivo || registro.causa || "—")}</td><td>${e(registro.registradoPor)}</td><td>${c.etiqueta(registro.estado)}</td></tr>`));
  }

  function resumen() {
    const d = datos();
    const valores = [["Necesidades pendientes", propios(d.requisiciones).filter(r => r.estado === "Pendiente").length], ["Órdenes abiertas", propios(d.ordenes).filter(o => !["Anulada", "Rechazada"].includes(o.estado)).length], ["Recepciones por inspeccionar", propios(d.recepciones).filter(r => r.estado === "En inspección").length], ["Entregas en ruta", propios(d.despachos).filter(d => d.estado === "En ruta").length]];
    const grupos = Object.entries(secciones).filter(([id, s]) => id !== "resumen" && permitir(s[2]));
    return cabecera("Panel logístico", "Necesidades, abastecimiento y operaciones de almacén conectadas con la venta.") + `<div class="indicadores">${valores.map(([titulo, cantidad]) => `<div class="tarjeta indicador"><small>${titulo}</small><strong>${cantidad}</strong></div>`).join("")}</div><div class="grupos">${[...new Set(grupos.map(([, s]) => s[1]))].map(grupo => `<section class="tarjeta grupo"><h2>${grupo}</h2>${grupos.filter(([, s]) => s[1] === grupo).map(([id, s]) => `<button type="button" data-log-vista="${id}">${s[0]} <span>→</span></button>`).join("")}</section>`).join("")}</div>`;
  }

  function inventario() {
    const d = datos(), saldos = L.existencias(d, productos(), actor().sede);
    const tabla = c.tabla("Existencias por almacén", ["Almacén", "Producto", "Físico", "Reservado", "Disponible", "Cuarentena", "Dañado"], saldos.map(s => `<tr><td>${e(nombreAlmacen(s.almacen))}</td><td>${e(nombreProducto(s.codigo))}</td><td>${s.fisico}</td><td>${s.reservado}</td><td>${s.disponible}</td><td>${s.cuarentena}</td><td>${s.danado}</td></tr>`));
    const movimientos = propios(d.movimientos).slice().reverse();
    return cabecera("Almacenes e inventarios", "Existencia disponible separada de reservas y calidad.", jefatura() ? b("Resolver cuarentena", "cuarentena") : "") + tabla + '<div class="separador-vista"></div>' + c.tabla("Kardex de movimientos", ["Movimiento", "Fecha", "Producto", "Ubicación / lote", "Estado", "Cantidad", "Referencia"], movimientos.map(m => `<tr><td>${e(m.numero)}<small>${e(m.tipo)}</small></td><td>${c.fechaCorta(m.fecha)}</td><td>${e(nombreProducto(m.codigo))}</td><td>${e(m.ubicacion)} / ${e(m.lote)}</td><td>${e(m.calidad)}</td><td>${m.cantidad > 0 ? "+" : ""}${m.cantidad}</td><td>${e(m.referencia)}</td></tr>`), false);
  }

  function planificacion() {
    const d = datos(), periodo = hoy().slice(0, 7);
    const plan = L.planificar(d, productos(), A.pedidos(actor().sede), A.config, actor().sede, periodo);
    return cabecera("Planificación y reposición", "Demanda comercial, previsión, inventario y compras en camino.", b("Registrar previsión", "prevision") + (jefatura() ? b("Parámetros de reposición", "parametros") : "")) + c.tabla(`Necesidades de ${periodo}`, ["Producto", "Disponible", "Demanda pendiente", "En camino", "Proyectado", "Mín. / objetivo", "Sugerido"], plan.map(p => `<tr><td>${e(nombreProducto(p.codigo))}</td><td>${p.disponible}</td><td>${p.demanda}</td><td>${p.enCamino}</td><td>${p.proyectado}</td><td>${p.minimo} / ${p.objetivo}</td><td>${p.sugerido ? b(`Solicitar ${p.sugerido}`, "sugerencia", `${p.almacen}|${p.codigo}|${p.sugerido}`) : "—"}</td></tr>`));
  }

  function control() {
    const d = datos(), recepciones = propios(d.recepciones), entregas = propios(d.despachos).filter(x => ["Entregado", "Entrega parcial", "No entregado"].includes(x.estado));
    const inspeccionadas = recepciones.filter(r => r.estado !== "En inspección");
    const conformidad = inspeccionadas.length ? Math.round(inspeccionadas.filter(r => r.estado === "Conforme").length * 100 / inspeccionadas.length) + " %" : "Sin inspecciones";
    const otif = entregas.length ? Math.round(entregas.filter(e => e.estado === "Entregado" && e.entregadoEn <= e.entregaPrevista).length * 100 / entregas.length) + " %" : "Sin entregas";
    const conteos = propios(d.conteos).filter(x => x.estado === "Aprobado").flatMap(x => x.lineas);
    const exactitud = conteos.length ? Math.round(conteos.filter(l => l.diferencia === 0).length * 100 / conteos.length) + " %" : "Sin conteos";
    const quiebres = L.existencias(d, productos(), actor().sede).filter(s => s.disponible <= 0).length;
    const metricas = [["Entrega a tiempo y completa", otif], ["Conformidad de recepción", conformidad], ["Exactitud del conteo", exactitud], ["Posiciones sin disponible", quiebres], ["Facturas observadas", propios(d.facturas).filter(f => f.estado === "Observada").length], ["Acciones abiertas", propios(d.acciones).filter(a => a.estado !== "Completada").length]];
    return cabecera("Control de gestión logística", "Indicadores calculados desde recepciones, entregas y conteos registrados.") + `<div class="indicadores">${metricas.map(([titulo, valor]) => `<div class="tarjeta indicador"><small>${titulo}</small><strong class="importe-indicador">${valor}</strong></div>`).join("")}</div>` + c.tabla("Incidencias y acciones", ["Acción", "Causa", "Responsable", "Plazo", "Estado"], propios(d.acciones).map(a => `<tr><td>${enlace(a.numero, `acciones/${a.id}`)}</td><td>${e(a.causa)}</td><td>${e(a.responsable)}</td><td>${c.fechaCorta(a.plazo)}</td><td>${c.etiqueta(a.estado)}</td></tr>`));
  }

  function detalles(registro) {
    const campos = { ruc: "RUC", correo: "Correo", telefono: "Teléfono", direccion: "Dirección", condicion: "Condición de pago", requerida: "Fecha requerida", entregaPrevista: "Entrega prevista", fecha: "Fecha", entregadoEn: "Fecha de entrega", fechaRecepcion: "Recepción física", vigenteHasta: "Vigencia", motivo: "Motivo", registradoPor: "Registrado por", responsable: "Responsable", plazo: "Plazo", causa: "Causa", descripcion: "Acción", documento: "Documento de proveedor", lote: "Lote", ubicacion: "Ubicación", almacen: "Almacén", origen: "Origen", destino: "Destino", transportista: "Transportista", placa: "Vehículo", receptor: "Receptor", evidencia: "Constancia de entrega", guia: "Guía interna", baseInformada: "Base informada", baseCalculada: "Base calculada", igv: "IGV", pago: "Gestión financiera", plazoDias: "Plazo (días)", calidad: "Calidad", comentario: "Comentario", recepciones: "Recepciones evaluadas", aTiempo: "A tiempo", conformes: "Conformes" };
    const cabecera = `${registro.sede ? `<div><dt>Sede</dt><dd>${e(c.sedeNombre(registro.sede))}</dd></div>` : ""}${registro.cliente ? `<div><dt>Cliente</dt><dd>${e(registro.cliente.nombre)}</dd></div>` : ""}`;
    return `<dl class="detalle-documento">${cabecera}${Object.entries(campos).filter(([clave]) => registro[clave] != null && typeof registro[clave] !== "object").map(([clave, titulo]) => `<div><dt>${titulo}</dt><dd>${["baseInformada", "baseCalculada", "igv"].includes(clave) ? monedas(registro[clave]) : clave === "almacen" || ["origen", "destino"].includes(clave) && String(registro[clave]).startsWith("alm-") ? e(nombreAlmacen(registro[clave])) : e(registro[clave])}</dd></div>`).join("")}</dl>`;
  }

  function lineasTabla(lineas, precios = false) {
    if (lineas.some(l => l.teorico != null)) return c.tabla("Detalle del conteo", ["Producto", "Ubicación / lote", "Teórico", "Contado", "Diferencia"], lineas.map(l => `<tr><td>${e(l.nombre || nombreProducto(l.codigo))}</td><td>${e(l.ubicacion)} / ${e(l.lote)}</td><td>${l.teorico}</td><td>${l.contado}</td><td>${l.diferencia > 0 ? "+" : ""}${l.diferencia}</td></tr>`), false);
    return c.tabla("Detalle", ["Producto", "Cantidad", ...(precios ? ["Precio sin IGV", "Importe"] : []), "Ubicación / lote"], lineas.map(l => `<tr><td>${e(l.nombre || nombreProducto(l.codigo))}<small>${e(l.codigo)}</small></td><td>${l.cantidad ?? l.contado}${l.entregada != null ? `<small>Entregado: ${l.entregada}</small>` : ""}</td>${precios ? `<td class="numero">${monedas(l.precio)}</td><td class="numero">${monedas(l.precio * l.cantidad)}</td>` : ""}<td>${e(l.ubicacion || "—")} / ${e(l.lote || "—")}</td></tr>`), false);
  }

  function relacionados(vista, registro) {
    const d = datos(), refs = [];
    const agregar = (coleccion, id, titulo) => { const r = d[coleccion]?.find(r => r.id === id); if (r) refs.push(enlace(`${titulo}: ${r.numero || r.nombre}`, `${coleccion}/${id}`)); };
    if (registro.requisicionId) agregar("requisiciones", registro.requisicionId, "Necesidad");
    if (registro.peticionId) agregar("peticionesOferta", registro.peticionId, "Petición");
    if (registro.ofertaId) agregar("ofertas", registro.ofertaId, "Oferta");
    if (registro.ordenId) agregar("ordenes", registro.ordenId, "Orden");
    if (registro.reservaId) agregar("reservas", registro.reservaId, "Reserva");
    if (registro.pickingId) agregar("picking", registro.pickingId, "Picking");
    if (registro.despachoId) agregar("despachos", registro.despachoId, "Despacho");
    if (registro.pedidoId) refs.push(enlace(`Pedido comercial: ${registro.pedidoNumero || registro.pedidoId}`, `pedido/${registro.pedidoId}`));
    for (const [col, clave] of [["peticionesOferta", "requisicionId"], ["ofertas", "peticionId"], ["ordenes", "requisicionId"], ["recepciones", "ordenId"], ["facturas", "ordenId"], ["picking", "reservaId"], ["despachos", "pickingId"], ["retornos", "despachoId"]]) {
      for (const derivado of d[col].filter(r => r[clave] === registro.id)) refs.push(enlace(derivado.numero, `${col}/${derivado.id}`));
    }
    return refs.length ? `<h3>Origen y documentos relacionados</h3><div class="referencias-documento">${refs.join(" · ")}</div>` : "";
  }

  function ficha(vista, id, sub) {
    const d = datos(), registro = d[vista]?.find(r => r.id === id && (!r.sede || r.sede === actor().sede || vista === "traslados" && r.sedeDestino === actor().sede));
    L.exigir(registro && (actor().rol !== "Asesor" || registro.registradoPor === actor().nombre), "Documento no encontrado en esta sede.");
    let contenido = `<article class="ficha"><div class="cabecera-documento"><h3>${e(registro.numero || registro.nombre)}</h3>${c.etiqueta(registro.estado)}</div>${registro.proveedorId ? `<p>Proveedor: ${e(registro.proveedor?.nombre || nombreProveedor(registro.proveedorId))}</p>` : ""}${detalles(registro)}${registro.lineas ? lineasTabla(registro.lineas, ["ofertas", "ordenes", "acuerdos", "facturas"].includes(vista)) : ""}${registro.base != null ? `<p class="numero"><strong>Base sin IGV: ${monedas(registro.base)}</strong></p>` : ""}${registro.observaciones?.length ? `<h3>Diferencias del cotejo</h3><ul>${registro.observaciones.map(o => `<li>${e(o)}</li>`).join("")}</ul>` : ""}${registro.propuesta ? `<h3>Cambio propuesto</h3>${detalles(registro.propuesta)}<p>${e(registro.propuesta.nombre)}</p>` : ""}${registro.recibidas ? `<h3>Recepción del traslado</h3><p>${Object.entries(registro.recibidas).map(([codigo, cantidad]) => `${e(nombreProducto(codigo))}: ${cantidad}`).join(" · ") || "Pendiente en destino"}</p>` : ""}${relacionados(vista, registro)}${c.mostrarHistorial(registro.historial || [])}</article>`;
    c.$("#contenido").innerHTML = sub + cabecera(secciones[vista][0], registro.numero || registro.nombre, enlace("← Volver", vista)) + `<section class="tarjeta ficha-completa">${contenido}<div class="acciones-documento">${accionesFicha(vista, registro)}${b("Imprimir ficha", "imprimir")}</div></section>`;
    prepararImpresion(contenido);
  }

  function fichaPedido(id) {
    const pedido = A.pedidos(actor().sede).find(p => p.id === id);
    L.exigir(pedido, "Pedido no encontrado en esta sede.");
    c.$("#contenido").innerHTML = cabecera(pedido.numero, "Referencia comercial de solo consulta.") + `<section class="tarjeta ficha-completa"><p>Cliente: ${e(pedido.cliente.nombre)}</p><p>Dirección: ${e(pedido.cliente.direccion)}</p><p>Entrega propuesta: ${e(pedido.entrega)}</p>${lineasTabla(pedido.lineas)}${c.etiqueta(pedido.estado)}</section>`;
  }

  function prepararImpresion(contenido) {
    document.querySelector(".vista-imprimir")?.remove();
    const ficha = document.createElement("div"); ficha.className = "vista-imprimir";
    ficha.innerHTML = c.$(".marca").outerHTML + contenido;
    ficha.querySelectorAll("button").forEach(boton => boton.replaceWith(document.createTextNode(boton.textContent)));
    document.body.append(ficha); document.body.classList.add("imprimir-documento");
  }

  function accionesFicha(vista, r) {
    let html = "";
    if (vista === "proveedores" && compra() && r.estado === "Aprobado" && !r.propuesta) html += b("Proponer actualización", "proveedor", r.id);
    if (vista === "proveedores" && jefatura() && (r.estado === "Pendiente" || r.propuesta)) html += b("Aprobar", "aprobar-proveedor", r.id) + b("Rechazar", "rechazar-proveedor", r.id);
    if (vista === "requisiciones" && jefatura() && r.estado === "Pendiente") html += b("Aprobar necesidad", "aprobar-requisicion", r.id) + b("Rechazar", "rechazar-requisicion", r.id);
    if (vista === "ofertas" && jefatura() && r.estado === "Recibida") html += b("Adjudicar proveedor", "adjudicar", r.id);
    if (vista === "acuerdos" && jefatura() && r.estado === "Pendiente") html += b("Aprobar acuerdo", "aprobar-acuerdo", r.id) + b("Rechazar", "rechazar-acuerdo", r.id);
    if (vista === "ordenes") {
      if (jefatura() && r.estado === "Pendiente") html += b("Aprobar orden", "aprobar-orden", r.id) + b("Rechazar", "rechazar-orden", r.id);
      if (compra() && r.estado === "Aprobada") html += b("Marcar emitida", "emitir-orden", r.id);
      if (compra() && r.estado === "Emitida") html += b("Confirmación del proveedor", "confirmar-orden", r.id);
      if (jefatura() && !["Anulada", "Rechazada"].includes(r.estado)) html += b("Anular orden", "anular-orden", r.id);
    }
    if (vista === "recepciones" && almacen()) {
      if (r.estado === "En inspección") html += b("Registrar inspección", "inspeccion", r.id);
      if (r.estado === "No conforme") html += b("Devolver al proveedor", "devolver-proveedor", r.id);
    }
    if (vista === "reservas" && almacen() && r.estado === "Activa") html += b("Liberar reserva", "liberar-reserva", r.id);
    if (vista === "facturas" && compra() && r.estado === "Observada") html += b("Revalidar cotejo", "revalidar-factura", r.id);
    if (vista === "picking" && almacen()) {
      if (r.estado === "Pendiente") html += b("Confirmar preparación", "preparar-picking", r.id);
      if (r.estado === "Preparado") html += b("Confirmar embalaje", "embalar-picking", r.id);
      if (["Pendiente", "Preparado", "Embalado"].includes(r.estado)) html += b("Anular picking", "anular-picking", r.id);
    }
    if (vista === "despachos" && transporte()) {
      if (r.estado === "Preparado") html += b("Confirmar salida a ruta", "ruta", r.id);
      if (r.estado === "En ruta") html += b("Confirmar entrega", "entrega", r.id);
    }
    if (vista === "retornos" && almacen() && r.estado === "Pendiente" && !r.comercial) html += b("Recibir retorno físico", "recibir-retorno", r.id);
    if (vista === "traslados") {
      if (jefatura() && r.sede === actor().sede && r.estado === "Pendiente") html += b("Aprobar traslado", "aprobar-traslado", r.id) + b("Rechazar", "rechazar-traslado", r.id);
      if (almacen() && r.sede === actor().sede && r.estado === "Aprobado") html += b("Despachar traslado", "salida-traslado", r.id);
      if (almacen() && r.sedeDestino === actor().sede && ["En tránsito", "Parcialmente recibido"].includes(r.estado)) html += b("Recibir en destino", "recibir-traslado", r.id);
    }
    if (vista === "conteos" && jefatura() && r.estado === "Pendiente") html += b("Aprobar ajuste", "aprobar-conteo", r.id) + b("Rechazar", "rechazar-conteo", r.id);
    if (vista === "acciones" && r.estado !== "Completada") html += b(r.estado === "Pendiente" ? "Iniciar acción" : r.estado === "En curso" ? "Presentar evidencia" : "Verificar cierre", "avanzar-accion", r.id);
    return html;
  }

  function selectorAlmacen(id = "almacen", destino = false) { return select(id, datos().almacenes.filter(a => destino || a.sede === actor().sede).map(a => [a.id, `${a.nombre} · ${c.sedeNombre(a.sede)}`])); }
  function selectorUbicacion(id = "ubicacion", calidad = "Disponible") { return select(id, A.config.ubicaciones.filter(u => u.estados.includes(calidad)).map(u => [u.codigo, u.nombre])); }
  function selectorProveedor(id = "proveedorId") { return select(id, datos().proveedores.filter(p => p.estado === "Aprobado").map(p => [p.id, p.nombre])); }
  function selectDocumento(id, lista, filtro = () => true) { return select(id, [["", "Selecciona un documento"], ...propios(lista, id === "trasladoId").filter(filtro).map(r => [r.id, `${r.numero} · ${r.estado}`])], "", "required"); }
  function formulario(titulo, campos, comando, coleccion) {
    c.formulario(titulo, campos, valores => { const registro = ejecutar((d, servicios) => comando(d, servicios, valores)); return `${modulo}/${coleccion}${registro?.id ? "/" + registro.id : ""}`; });
  }
  function decidir(titulo, coleccion, id, comando) { formulario(titulo, razon, (d, s, f) => { comando(d, f.get("motivo"), s); return d[coleccion].find(r => r.id === id); }, coleccion); }

  function filasProducto(lineas = [], precios = false, fijo = false, cero = false) {
    return `<div id="log-lineas" data-precios="${precios}" data-fijo="${fijo}">${lineas.map(l => filaProducto(l, precios, fijo, cero)).join("") || filaProducto({}, precios, fijo, cero)}</div>${!fijo ? b("+ Agregar producto", "agregar-linea") : ""}`;
  }
  function filaProducto(linea, precios, fijo, cero = false) {
    const seleccion = fijo ? `<input type="hidden" name="codigo" value="${e(linea.codigo)}"><span>${e(linea.nombre || nombreProducto(linea.codigo))}</span>` : `<select name="codigo" required><option value="">Selecciona un producto</option>${productos().filter(p => p.estado === "Aprobado").map(p => opcion(p.codigo, p.nombre, linea.codigo)).join("")}</select>`;
    return `<div class="log-linea ${precios ? "con-precio" : ""}"><label>Producto${seleccion}</label><label>Cantidad<input name="cantidad" type="number" min="${cero ? 0 : 1}" step="1" value="${cero ? 0 : linea.cantidad || 1}" ${fijo && linea.cantidad != null ? `max="${linea.cantidad}"` : ""} required></label>${precios ? `<label>Precio sin IGV<input name="precio" type="number" min="0.01" step="0.01" value="${(linea.precio || 0) / 100}" required></label>` : ""}${!fijo ? b("×", "quitar-linea", "", "boton-icono") : ""}</div>`;
  }
  function leerLineas(f, precios = false) {
    const cantidades = f.getAll("cantidad"), importes = f.getAll("precio");
    return f.getAll("codigo").map((codigo, i) => ({ codigo, cantidad: Number(cantidades[i]), ...(precios ? { precio: Math.round(Number(importes[i]) * 100) } : {}) })).filter(l => l.cantidad !== 0);
  }
  function enlazarDetalle(selector, dibujar) {
    const elemento = c.$(`#log-${selector}`); elemento.addEventListener("change", () => dibujar(elemento.value));
    dibujar(elemento.value);
  }

  function proveedorFormulario(id) {
    const p = datos().proveedores.find(p => p.id === id) || {};
    formulario(id ? "Actualizar proveedor" : "Nuevo proveedor", `<div class="campos">${campo("RUC", "ruc", input("ruc", p.ruc, 'pattern="[0-9]{11}" maxlength="11" inputmode="numeric" required'))}${campo("Razón social", "nombre", input("nombre", p.nombre))}${campo("Correo", "correo", input("correo", p.correo, 'type="email" required'))}${campo("Teléfono", "telefono", input("telefono", p.telefono))}${campo("Dirección", "direccion", input("direccion", p.direccion))}${campo("Condición de pago", "condicion", selectSimple("condicion", ["Contado", "Crédito 30 días"], p.condicion))}</div>`, (d, s, f) => C.guardarProveedor(d, { ...Object.fromEntries(f), id: id || null }, actor()), "proveedores");
  }

  function requisicionFormulario(precarga) {
    const lineas = precarga?.lineas || [];
    formulario("Nueva necesidad", `<div class="campos">${campo("Almacén receptor", "almacen", selectorAlmacen())}${campo("Fecha requerida", "requerida", fecha("requerida", c.sumarDias(hoy(), 7)))}</div>${razon}${filasProducto(lineas)}`, (d, s, f) => C.crearRequisicion(d, { almacen: f.get("almacen"), requerida: f.get("requerida"), motivo: f.get("motivo"), origenPedido: precarga?.pedidoId || null, lineas: leerLineas(f) }, actor(), s.productos), "requisiciones");
  }

  function peticionFormulario() {
    const d = datos();
    formulario("Petición de ofertas", campo("Necesidad aprobada", "requisicionId", selectDocumento("requisicionId", d.requisiciones, r => r.estado === "Aprobada")) + `<fieldset class="log-proveedores"><legend>Proveedores invitados</legend>${d.proveedores.filter(p => p.estado === "Aprobado").map(p => `<label><input type="checkbox" name="proveedor" value="${p.id}"> ${e(p.nombre)}</label>`).join("")}</fieldset>`, (actuales, s, f) => C.crearPeticion(actuales, { requisicionId: f.get("requisicionId"), proveedores: f.getAll("proveedor") }, actor()), "peticionesOferta");
  }

  function ofertaFormulario() {
    const d = datos();
    formulario("Registrar oferta recibida", `<div class="campos">${campo("Petición", "peticionId", selectDocumento("peticionId", d.peticionesOferta, r => r.estado === "Abierta"))}${campo("Proveedor", "proveedorId", '<select id="log-proveedorId" name="proveedorId" required></select>')}${campo("Vigente hasta", "vigenteHasta", fecha("vigenteHasta", c.sumarDias(hoy(), 15)))}${campo("Plazo (días)", "plazoDias", input("plazoDias", 7, 'type="number" min="1" step="1" required'))}${campo("Calidad ofrecida (1 a 5)", "calidad", input("calidad", 3, 'type="number" min="1" max="5" step="1" required'))}${campo("Condición de pago", "condicion", selectSimple("condicion", ["Contado", "Crédito 30 días"]))}</div><div id="log-detalle"></div>`, (actuales, s, f) => C.registrarOferta(actuales, { peticionId: f.get("peticionId"), proveedorId: f.get("proveedorId"), vigenteHasta: f.get("vigenteHasta"), plazoDias: Number(f.get("plazoDias")), calidad: Number(f.get("calidad")), condicion: f.get("condicion"), lineas: leerLineas(f, true) }, actor(), hoy()), "ofertas");
    enlazarDetalle("peticionId", id => { const p = d.peticionesOferta.find(p => p.id === id); c.$("#log-proveedorId").innerHTML = (p?.proveedores || []).map(id => opcion(id, nombreProveedor(id))).join(""); c.$("#log-detalle").innerHTML = p ? filasProducto(p.lineas, true, true) : ""; });
  }

  function acuerdoFormulario() {
    formulario("Acuerdo marco", `<div class="campos">${campo("Proveedor", "proveedorId", selectorProveedor())}${campo("Desde", "desde", fecha("desde"))}${campo("Hasta", "hasta", fecha("hasta", c.sumarDias(hoy(), 90)))}${campo("Condición", "condicion", selectSimple("condicion", ["Contado", "Crédito 30 días"]))}</div><p class="texto-suave">Indica cantidades máximas cubiertas por este acuerdo.</p>${filasProducto([], true)}`, (d, s, f) => C.guardarAcuerdo(d, { proveedorId: f.get("proveedorId"), desde: f.get("desde"), hasta: f.get("hasta"), condicion: f.get("condicion"), lineas: leerLineas(f, true) }, actor(), s.productos), "acuerdos");
  }

  function ordenFormulario() {
    const d = datos();
    const fuentes = [...propios(d.ofertas).filter(o => o.estado === "Seleccionada").map(o => [`oferta|${o.id}`, `${o.numero} · ${nombreProveedor(o.proveedorId)}`]), ...propios(d.acuerdos).filter(a => a.estado === "Aprobado").map(a => [`acuerdo|${a.id}`, `${a.numero} · Acuerdo marco`])];
    formulario("Preparar orden de compra", campo("Documento de origen", "fuente", select("fuente", [["", "Selecciona un origen"], ...fuentes], "", "required")) + campo("Necesidad (para acuerdo marco)", "requisicionId", selectDocumento("requisicionId", d.requisiciones, r => r.estado === "Aprobada")) + campo("Entrega prevista", "entregaPrevista", fecha("entregaPrevista", c.sumarDias(hoy(), 7))), (actuales, s, f) => { const [tipo, id] = f.get("fuente").split("|"); return C.crearOrden(actuales, { ...(tipo === "oferta" ? { ofertaId: id } : { acuerdoId: id, requisicionId: f.get("requisicionId") }), entregaPrevista: f.get("entregaPrevista") }, actor(), hoy()); }, "ordenes");
    c.$("#log-requisicionId").required = false;
    enlazarDetalle("fuente", valor => { c.$("#log-requisicionId").required = valor.startsWith("acuerdo|"); c.$("#log-requisicionId").disabled = !valor.startsWith("acuerdo|"); });
  }

  function recepcionFormulario() {
    const d = datos();
    formulario("Recepción de mercancía", `<div class="campos">${campo("Orden de compra", "ordenId", selectDocumento("ordenId", d.ordenes, o => ["Emitida", "Confirmada", "Parcialmente recibida", "Recibida"].includes(o.estado)))}${campo("Documento de proveedor", "documento", input("documento"))}${campo("Fecha", "fecha", fecha("fecha"))}${campo("Lote / identificación", "lote", input("lote"))}</div><div id="log-detalle"></div>`, (actuales, s, f) => C.recibir(actuales, { ordenId: f.get("ordenId"), documento: f.get("documento").trim(), fecha: f.get("fecha"), lote: f.get("lote").trim(), lineas: leerLineas(f) }, actor(), s.config), "recepciones");
    enlazarDetalle("ordenId", id => { const o = d.ordenes.find(o => o.id === id); c.$("#log-detalle").innerHTML = o ? filasProducto(o.lineas.map(l => ({ ...l, cantidad: l.cantidad - C.recibido(d, o.id, l.codigo) })).filter(l => l.cantidad > 0), false, true, true) : ""; });
  }

  function inspeccionFormulario(id) {
    formulario("Inspección de recepción", campo("Resultado", "resultado", selectSimple("resultado", ["Conforme", "No conforme"])) + campo("Ubicación si es conforme", "ubicacion", selectorUbicacion()) + razon, (d, s, f) => { C.inspeccionar(d, id, f.get("resultado") === "Conforme", f.get("motivo"), f.get("ubicacion"), actor(), s.config); return d.recepciones.find(r => r.id === id); }, "recepciones");
  }

  function facturaFormulario() {
    const d = datos();
    formulario("Cotejar factura de proveedor", `<div class="campos">${campo("Orden de compra", "ordenId", selectDocumento("ordenId", d.ordenes, o => ["Emitida", "Confirmada", "Parcialmente recibida", "Recibida"].includes(o.estado)))}${campo("Serie y número", "documento", input("documento"))}${campo("Fecha", "fecha", fecha("fecha"))}${campo("Base informada (sin IGV)", "baseInformada", input("baseInformada", 0, 'type="number" min="0" step="0.01" required'))}</div><div id="log-detalle"></div>`, (actuales, s, f) => C.verificarFactura(actuales, { ordenId: f.get("ordenId"), documento: f.get("documento").trim(), fecha: f.get("fecha"), baseInformada: Math.round(Number(f.get("baseInformada")) * 100), lineas: leerLineas(f, true) }, actor(), s.config), "facturas");
    enlazarDetalle("ordenId", id => { const o = d.ordenes.find(o => o.id === id); c.$("#log-detalle").innerHTML = o ? filasProducto(o.lineas, true, true, true) : ""; });
  }

  function reservaFormulario() {
    const pedidos = A.pedidos(actor().sede).filter(p => ["Aprobado", "Parcialmente atendido"].includes(p.estado));
    formulario("Reservar pedido comercial", campo("Pedido aprobado", "pedidoId", select("pedidoId", [["", "Selecciona un pedido"], ...pedidos.map(p => [p.id, `${p.numero} · ${p.cliente.nombre}`])], "", "required")) + campo("Almacén", "almacen", selectorAlmacen()) + '<div id="log-detalle"></div>', (d, s, f) => D.reservar(d, { pedidoId: f.get("pedidoId"), almacen: f.get("almacen"), lineas: leerLineas(f) }, actor(), s.pedidos, s.config), "reservas");
    enlazarDetalle("pedidoId", id => { const p = pedidos.find(p => p.id === id), d = datos(); c.$("#log-detalle").innerHTML = p ? filasProducto(p.lineas.map(l => ({ ...l, cantidad: l.cantidad - D.despachada(d, id, l.codigo) })).filter(l => l.cantidad > 0), false, true) : ""; });
  }

  function pickingFormulario() {
    const d = datos();
    formulario("Generar lista de picking", campo("Reserva activa", "reservaId", selectDocumento("reservaId", d.reservas, r => r.estado === "Activa")) + '<div id="log-detalle"></div>', (actuales, s, f) => D.crearPicking(actuales, { reservaId: f.get("reservaId"), lineas: leerLineas(f) }, actor(), s.pedidos), "picking");
    enlazarDetalle("reservaId", id => {
      const reserva = d.reservas.find(r => r.id === id), lineas = [];
      for (const codigo of new Set(reserva?.lineas.map(l => l.codigo) || [])) {
        const reservada = reserva.lineas.filter(l => l.codigo === codigo).reduce((n, l) => n + l.cantidad - l.consumida - l.liberada, 0);
        const preparando = d.picking.filter(p => p.reservaId === id && !["Despachado", "Anulado"].includes(p.estado)).flatMap(p => p.lineas).filter(l => l.codigo === codigo).reduce((n, l) => n + l.cantidad, 0);
        if (reservada > preparando) lineas.push({ codigo, cantidad: reservada - preparando });
      }
      c.$("#log-detalle").innerHTML = filasProducto(lineas, false, true);
    });
  }

  function despachoFormulario() {
    const d = datos();
    formulario("Preparar despacho y salida", campo("Picking embalado", "pickingId", selectDocumento("pickingId", d.picking, p => p.estado === "Embalado")) + `<div class="campos">${campo("Fecha de salida", "fecha", fecha("fecha"))}${campo("Transportista / conductor", "transportista", input("transportista"))}${campo("Placa de vehículo", "placa", input("placa", "", 'maxlength="15" required'))}${campo("Destino del pedido", "destino", input("destino", "", "readonly required"))}</div>`, (actuales, s, f) => D.crearDespacho(actuales, Object.fromEntries(f), actor(), s.pedidos, s.config), "despachos");
    enlazarDetalle("pickingId", id => { const p = d.picking.find(p => p.id === id); c.$("#log-destino").value = A.pedidos(actor().sede).find(pedido => pedido.id === p?.pedidoId)?.cliente.direccion || ""; });
  }

  function entregaFormulario(id) {
    const d = datos().despachos.find(d => d.id === id), cantidades = new Map();
    d.lineas.forEach(l => cantidades.set(l.codigo, (cantidades.get(l.codigo) || 0) + l.cantidad));
    formulario("Confirmar entrega al cliente", `<div class="campos">${campo("Fecha de entrega", "fecha", fecha("fecha"))}${campo("Nombre del receptor", "receptor", input("receptor"))}${campo("Constancia / referencia", "evidencia", input("evidencia"))}</div>${filasProducto([...cantidades].map(([codigo, cantidad]) => ({ codigo, cantidad })), false, true)}${campo("Incidencia si no se entrega todo", "motivo", '<textarea id="log-motivo" name="motivo" maxlength="500"></textarea>')}`, (actuales, s, f) => D.confirmarEntrega(actuales, { despachoId: id, fecha: f.get("fecha"), receptor: f.get("receptor"), evidencia: f.get("evidencia"), motivo: f.get("motivo"), lineas: leerLineasConCeros(f) }, actor()), "despachos");
    document.querySelectorAll('#log-lineas input[name="cantidad"]').forEach(input => { input.min = 0; });
  }

  function leerLineasConCeros(f) { const cantidades = f.getAll("cantidad"); return f.getAll("codigo").map((codigo, i) => ({ codigo, cantidad: Number(cantidades[i]) })); }

  function camposRecepcionFisica() {
    return `<div class="campos">${campo("Fecha de recepción", "fecha", fecha("fecha"))}${campo("Documento de recepción", "documento", input("documento"))}${campo("Calidad de destino", "calidad", selectSimple("calidad", ["Disponible", "Cuarentena", "Dañado"], "Cuarentena"))}${campo("Ubicación", "ubicacion", selectorUbicacion("ubicacion", "Cuarentena"))}</div>${razon}`;
  }
  function enlazarCalidad() { enlazarDetalle("calidad", calidad => { c.$("#log-ubicacion").innerHTML = A.config.ubicaciones.filter(u => u.estados.includes(calidad)).map(u => opcion(u.codigo, u.nombre)).join(""); }); }

  function retornoFormulario(id) {
    formulario("Recibir retorno de transporte", camposRecepcionFisica(), (d, s, f) => { D.recibirRetorno(d, id, f.get("motivo"), f.get("ubicacion"), f.get("calidad"), actor(), s.config, f.get("fecha"), f.get("documento")); return d.retornos.find(r => r.id === id); }, "retornos"); enlazarCalidad();
  }

  function devolucionFormulario() {
    const solicitudes = A.devoluciones(actor().sede).filter(s => s.estado === "Autorizada");
    formulario("Recibir devolución autorizada", campo("Solicitud comercial", "solicitudId", select("solicitudId", [["", "Selecciona una solicitud"], ...solicitudes.map(s => [s.id, `${s.numero} · ${s.cliente.nombre}`])], "", "required")) + campo("Almacén receptor", "almacen", selectorAlmacen()) + camposRecepcionFisica() + '<div id="log-detalle"></div>', (d, s, f) => {
      const solicitud = s.devoluciones.find(s => s.id === f.get("solicitudId"));
      return D.recibirDevolucion(d, { solicitudId: f.get("solicitudId"), almacen: f.get("almacen"), fecha: f.get("fecha"), documento: f.get("documento"), calidad: f.get("calidad"), ubicacion: f.get("ubicacion"), motivo: f.get("motivo"), lineas: leerLineas(f).map(l => ({ ...l, coste: solicitud?.lineas.find(sl => sl.codigo === l.codigo)?.coste || 0 })) }, actor(), s.devoluciones, s.config);
    }, "retornos");
    enlazarCalidad(); enlazarDetalle("solicitudId", id => {
      const s = solicitudes.find(s => s.id === id), anteriores = datos().retornos.filter(r => r.solicitudId === id);
      const lineas = s?.lineas.map(l => ({ ...l, cantidad: l.cantidad - anteriores.flatMap(r => r.lineas).filter(r => r.codigo === l.codigo).reduce((n, l) => n + l.cantidad, 0) })).filter(l => l.cantidad > 0) || [];
      c.$("#log-detalle").innerHTML = filasProducto(lineas, false, true);
    });
  }

  function trasladoFormulario() {
    formulario("Solicitar traslado entre almacenes", `<div class="campos">${campo("Almacén de origen", "origen", selectorAlmacen("origen"))}${campo("Almacén de destino", "destino", selectorAlmacen("destino", true))}${campo("Fecha prevista", "fecha", fecha("fecha"))}</div>${razon}${filasProducto()}`, (d, s, f) => D.crearTraslado(d, { origen: f.get("origen"), destino: f.get("destino"), fecha: f.get("fecha"), motivo: f.get("motivo"), lineas: leerLineas(f) }, actor(), s.productos), "traslados");
  }

  function recibirTrasladoFormulario(id) {
    const t = datos().traslados.find(t => t.id === id);
    formulario("Recibir traslado en destino", camposRecepcionFisica() + filasProducto(t.lineas.map(l => ({ ...l, cantidad: l.cantidad - (t.recibidas[l.codigo] || 0) })).filter(l => l.cantidad > 0), false, true), (d, s, f) => { D.recibirTraslado(d, { trasladoId: id, fecha: f.get("fecha"), documento: f.get("documento"), calidad: f.get("calidad"), ubicacion: f.get("ubicacion"), motivo: f.get("motivo"), lineas: leerLineas(f) }, actor(), s.config); return d.traslados.find(t => t.id === id); }, "traslados"); enlazarCalidad();
  }

  function conteoFormulario() {
    formulario("Registrar conteo físico", `<div class="campos">${campo("Almacén", "almacen", selectorAlmacen())}${campo("Ubicación", "ubicacion", selectorUbicacion())}${campo("Producto", "codigo", select("codigo", productos().filter(p => p.estado === "Aprobado").map(p => [p.codigo, p.nombre])))}${campo("Lote", "lote", input("lote", "INICIAL"))}${campo("Cantidad contada", "contado", cantidad("contado"))}${campo("Fecha del conteo", "fecha", fecha("fecha"))}</div>${razon}`, (d, s, f) => L.crearConteo(d, { almacen: f.get("almacen"), fecha: f.get("fecha"), motivo: f.get("motivo"), lineas: [{ codigo: f.get("codigo"), ubicacion: f.get("ubicacion"), lote: f.get("lote"), contado: Number(f.get("contado")), coste: s.productos.find(p => p.codigo === f.get("codigo"))?.coste || 0 }] }, actor(), s.productos), "conteos");
  }

  function cuarentenaFormulario() {
    const d = datos(), posiciones = new Map();
    for (const m of propios(d.movimientos).filter(m => m.calidad === "Cuarentena")) posiciones.set(`${m.almacen}|${m.codigo}|${m.ubicacion}|${m.lote}`, m);
    const saldos = [...posiciones].filter(([, m]) => L.saldo(d, m.almacen, m.codigo, m.ubicacion, "Cuarentena", m.lote) > 0);
    formulario("Resolver cuarentena", campo("Posición", "posicion", select("posicion", saldos.map(([id, m]) => [id, `${nombreProducto(m.codigo)} · ${m.lote} · ${m.ubicacion}`]), null, "required")) + campo("Cantidad", "cantidadResolver", input("cantidadResolver", 1, 'type="number" min="1" step="1" required')) + campo("Destino", "destinoCalidad", selectSimple("destinoCalidad", ["Disponible", "Dañado"])) + campo("Ubicación destino", "destino", selectorUbicacion("destino")) + razon, (actuales, s, f) => {
      const m = posiciones.get(f.get("posicion")); L.exigir(m, "Selecciona una posición de cuarentena.");
      D.resolverCuarentena(actuales, { almacen: m.almacen, origen: m.ubicacion, codigo: m.codigo, lote: m.lote, coste: m.coste, destinoCalidad: f.get("destinoCalidad"), destino: f.get("destino"), cantidad: Number(f.get("cantidadResolver")), motivo: f.get("motivo"), fecha: hoy() }, actor(), s.config);
      return null;
    }, "inventario");
    enlazarDetalle("destinoCalidad", calidad => { c.$("#log-destino").innerHTML = A.config.ubicaciones.filter(u => u.estados.includes(calidad)).map(u => opcion(u.codigo, u.nombre)).join(""); });
  }

  function previsionFormulario() {
    formulario("Previsión de demanda retail", `<div class="campos">${campo("Producto", "codigo", select("codigo", productos().map(p => [p.codigo, p.nombre])))}${campo("Periodo", "periodo", input("periodo", hoy().slice(0, 7), 'type="month" required'))}${campo("Unidades previstas", "unidades", cantidad("unidades"))}</div>${razon}`, (d, s, f) => { L.registrarPrevision(d, { codigo: f.get("codigo"), periodo: f.get("periodo"), cantidad: Number(f.get("unidades")), motivo: f.get("motivo") }, actor(), s.productos); return null; }, "planificacion");
  }

  function parametrosFormulario() {
    formulario("Parámetros de reposición", `<div class="campos">${campo("Almacén", "almacen", selectorAlmacen())}${campo("Producto", "codigo", select("codigo", productos().map(p => [p.codigo, p.nombre])))}${campo("Mínimo", "minimo", input("minimo", A.config.reposicion.minimo, 'type="number" min="0" step="1" required'))}${campo("Objetivo", "objetivo", input("objetivo", A.config.reposicion.objetivo, 'type="number" min="1" step="1" required'))}</div>${razon}`, (d, s, f) => { L.configurarReposicion(d, { almacen: f.get("almacen"), codigo: f.get("codigo"), minimo: Number(f.get("minimo")), objetivo: Number(f.get("objetivo")), motivo: f.get("motivo") }, actor()); return null; }, "planificacion");
  }

  function accionFormulario() {
    formulario("Acción de mejora", `<div class="campos">${campo("Causa", "causa", input("causa"))}${campo("Responsable", "responsable", input("responsable"))}${campo("Plazo", "plazo", fecha("plazo", c.sumarDias(hoy(), 7)))}</div>${campo("Acción propuesta", "descripcion", '<textarea id="log-descripcion" name="descripcion" minlength="3" required></textarea>')}`, (d, s, f) => L.crearAccion(d, Object.fromEntries(f), actor()), "acciones");
  }

  function evaluacionFormulario() {
    formulario("Evaluar desempeño de proveedor", campo("Proveedor", "proveedorId", selectorProveedor()) + campo("Conclusión / mejora propuesta", "comentario", '<textarea id="log-comentario" name="comentario" minlength="3" required></textarea>'), (d, s, f) => C.evaluarProveedor(d, Object.fromEntries(f), actor()), "evaluaciones");
  }

  function accion(nombre, id) {
    const decisiones = {
      "aprobar-proveedor": ["proveedores", (d, m) => C.resolverProveedor(d, id, true, m, actor())], "rechazar-proveedor": ["proveedores", (d, m) => C.resolverProveedor(d, id, false, m, actor())],
      "aprobar-requisicion": ["requisiciones", (d, m) => C.resolverRequisicion(d, id, true, m, actor())], "rechazar-requisicion": ["requisiciones", (d, m) => C.resolverRequisicion(d, id, false, m, actor())],
      adjudicar: ["ofertas", (d, m) => C.adjudicar(d, id, m, actor(), hoy())],
      "aprobar-acuerdo": ["acuerdos", (d, m) => C.resolverAcuerdo(d, id, true, m, actor())], "rechazar-acuerdo": ["acuerdos", (d, m) => C.resolverAcuerdo(d, id, false, m, actor())],
      "aprobar-orden": ["ordenes", (d, m) => C.resolverOrden(d, id, true, m, actor())], "rechazar-orden": ["ordenes", (d, m) => C.resolverOrden(d, id, false, m, actor())],
      "confirmar-orden": ["ordenes", (d, m) => C.confirmarOrden(d, id, m, actor())], "anular-orden": ["ordenes", (d, m) => C.anularOrden(d, id, m, actor())],
      "devolver-proveedor": ["recepciones", (d, m, s) => C.devolverProveedor(d, id, m, actor(), s.config)],
      "liberar-reserva": ["reservas", (d, m) => D.liberarReserva(d, id, m, actor())],
      "preparar-picking": ["picking", (d, m, s) => D.avanzarPicking(d, id, "Preparado", m, actor(), s.pedidos)], "embalar-picking": ["picking", (d, m, s) => D.avanzarPicking(d, id, "Embalado", m, actor(), s.pedidos)], "anular-picking": ["picking", (d, m, s) => D.avanzarPicking(d, id, "Anulado", m, actor(), s.pedidos)],
      "aprobar-traslado": ["traslados", (d, m) => D.aprobarTraslado(d, id, true, m, actor())], "rechazar-traslado": ["traslados", (d, m) => D.aprobarTraslado(d, id, false, m, actor())],
      "aprobar-conteo": ["conteos", (d, m, s) => L.aprobarConteo(d, id, true, m, actor(), s.config)], "rechazar-conteo": ["conteos", (d, m, s) => L.aprobarConteo(d, id, false, m, actor(), s.config)]
    };
    if (decisiones[nombre]) { const [col, resolver] = decisiones[nombre]; decidir("Revisión logística", col, id, resolver); return; }
    const comandos = { proveedor: () => proveedorFormulario(id), requisicion: () => requisicionFormulario(), peticion: peticionFormulario, oferta: ofertaFormulario, acuerdo: acuerdoFormulario, orden: ordenFormulario, recepcion: recepcionFormulario, inspeccion: () => inspeccionFormulario(id), factura: facturaFormulario,
      imprimir: () => window.print(), "emitir-orden": () => { ejecutar(d => C.emitirOrden(d, id, actor(), hoy())); ir(`ordenes/${id}`); },
      "revalidar-factura": () => { ejecutar((d, s) => C.revalidarFactura(d, id, actor(), s.config)); ir(`facturas/${id}`); },
      "agregar-linea": () => { const lista = c.$("#log-lineas"); lista.insertAdjacentHTML("beforeend", filaProducto({}, lista.dataset.precios === "true", false)); },
    };
    if (comandos[nombre]) comandos[nombre](); else operacionesAlmacen(nombre, id);
  }

  function operacionesAlmacen(nombre, id) {
    const comandos = { reserva: reservaFormulario, picking: pickingFormulario, despacho: despachoFormulario, entrega: () => entregaFormulario(id), devolucion: devolucionFormulario, "recibir-retorno": () => retornoFormulario(id), traslado: trasladoFormulario, "recibir-traslado": () => recibirTrasladoFormulario(id), conteo: conteoFormulario, cuarentena: cuarentenaFormulario, prevision: previsionFormulario, parametros: parametrosFormulario, accion: accionFormulario, evaluacion: evaluacionFormulario,
      sugerencia: () => { const [almacen, codigo, unidades] = id.split("|"); requisicionFormulario({ lineas: [{ codigo, cantidad: Number(unidades) }] }); c.$("#log-almacen").value = almacen; },
      ruta: () => { ejecutar(d => D.iniciarRuta(d, id, actor())); ir(`despachos/${id}`); },
      "salida-traslado": () => { ejecutar((d, s) => D.despacharTraslado(d, id, actor(), s.config)); ir(`traslados/${id}`); },
      "avanzar-accion": () => decidir("Actualizar acción de mejora", "acciones", id, (d, motivo) => { const a = d.acciones.find(a => a.id === id); L.avanzarAccion(d, id, a.estado === "Pendiente" ? "En curso" : a.estado === "En curso" ? "Por verificar" : "Completada", motivo, actor()); })
    };
    L.exigir(comandos[nombre], "Operación logística no reconocida."); comandos[nombre]();
  }

  document.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-log-accion], [data-log-vista]"); if (!boton || !actor()) return;
    if (boton.dataset.logVista) { ir(boton.dataset.logVista); return; }
    if (boton.dataset.logAccion === "quitar-linea") {
      if (document.querySelectorAll("#log-lineas .log-linea").length > 1) boton.closest(".log-linea").remove(); else c.aviso("Mantén al menos una línea."); return;
    }
    try { accion(boton.dataset.logAccion, boton.dataset.id); }
    catch (error) { c.aviso(error.message); }
  });

  return { dibujar, admite, solicitarDesdeComercial(pedido) { modulo = "logistica"; requisicionFormulario({ pedidoId: pedido.id, lineas: pedido.lineas.map(l => ({ codigo: l.codigo, cantidad: l.cantidad })) }); } };
};
