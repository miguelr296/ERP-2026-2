"use strict";

window.FormulariosAlmacen = f => {
  const { c, A, L, M, actor, datos, e, campo, input, fecha, select, selectSimple, selectorAlmacen, selectorUbicacion, formulario, razon, enlazarCalidad, opcion, nombreProducto } = f;
  const estados = ["Disponible", "Cuarentena", "Dañado", "En reparación"];
  const activo = valor => campo("Estado", "activo", select("activo", [["si", "Activo"], ["no", "Inactivo"]], valor === false ? "no" : "si"));

  function almacen(id) {
    const a = datos().almacenes.find(a => a.id === id) || {};
    formulario(id ? "Editar almacén" : "Nuevo almacén", campo("Nombre", "nombre", input("nombre", a.nombre)) + campo("Dirección", "direccion", input("direccion", a.direccion)) + activo(a.activo) + razon, (d, s, valores) => M.guardarAlmacen(d, { id, nombre: valores.get("nombre"), direccion: valores.get("direccion"), activo: valores.get("activo") === "si", motivo: valores.get("motivo") }, actor(), s.config), "almacenes");
  }

  function ubicacion(id) {
    const u = datos().ubicaciones.find(u => u.id === id) || {}, seleccion = u.estados || ["Disponible"];
    const calidades = `<fieldset class="log-proveedores"><legend>Estados admitidos</legend>${estados.map(estado => `<label><input type="checkbox" name="estadoCalidad" value="${e(estado)}" ${seleccion.includes(estado) ? "checked" : ""}> ${e(estado)}</label>`).join("")}</fieldset>`;
    formulario(id ? "Editar ubicación" : "Nueva ubicación", campo("Almacén", "almacen", selectorAlmacen()) + campo("Código", "codigo", input("codigo", u.codigo, `${id ? "readonly" : ""} pattern="[A-Z0-9-]{2,25}" required`)) + campo("Nombre", "nombre", input("nombre", u.nombre)) + campo("Capacidad (unidades)", "capacidad", input("capacidad", u.capacidad || 100, 'type="number" min="1" step="1" required')) + calidades + activo(u.activo) + razon, (d, s, valores) => M.guardarUbicacion(d, { id, almacen: valores.get("almacen"), codigo: valores.get("codigo"), nombre: valores.get("nombre"), capacidad: Number(valores.get("capacidad")), estados: valores.getAll("estadoCalidad"), activo: valores.get("activo") === "si", motivo: valores.get("motivo") }, actor()), "ubicaciones");
    if (id) { c.$("#log-almacen").value = u.almacen; c.$("#log-almacen").addEventListener("change", () => { c.$("#log-almacen").value = u.almacen; }); }
  }

  function posiciones() {
    const d = datos(), unicas = new Map();
    for (const m of d.movimientos.filter(m => m.sede === actor().sede && m.calidad !== "En reparación")) unicas.set([m.almacen, m.codigo, m.ubicacion, m.calidad, m.lote].join("|"), m);
    return [...unicas.values()].filter(m => L.saldo(d, m.almacen, m.codigo, m.ubicacion, m.calidad, m.lote) > 0 && d.almacenes.some(a => a.id === m.almacen && a.activo !== false));
  }
  const selectorPosicion = lista => select("posicion", lista.map((p, i) => [String(i), `${datos().almacenes.find(a => a.id === p.almacen)?.nombre} · ${nombreProducto(p.codigo)} · ${p.ubicacion} · ${p.lote} · ${p.calidad}`]), "0", "required");
  function mostrarPosicion(p) {
    if (!p) { c.$("#log-detalle-posicion").textContent = "No hay existencias para esta operación."; return; }
    const d = datos(), libres = p.calidad === "Disponible" ? L.disponible(d, p.almacen, p.codigo, p.ubicacion, p.lote) : L.saldo(d, p.almacen, p.codigo, p.ubicacion, p.calidad, p.lote) - L.retenido(d, p.almacen, p.codigo, p.ubicacion, p.lote, p.calidad);
    c.$("#log-detalle-posicion").textContent = `${p.codigo} · ${nombreProducto(p.codigo)} · ${p.ubicacion} · Lote ${p.lote} · ${p.calidad} · ${libres} unidades libres`;
    c.$("#log-cantidadOperacion").max = Math.max(0, libres);
  }
  const entradaPosicion = (lista, valores) => {
    const p = lista[Number(valores.get("posicion"))]; L.exigir(p, "No hay una posición seleccionada.");
    return { almacen: p.almacen, codigo: p.codigo, nombre: nombreProducto(p.codigo), ubicacion: p.ubicacion, calidad: p.calidad, lote: p.lote, cantidad: Number(valores.get("cantidadOperacion")), fecha: valores.get("fecha"), motivo: valores.get("motivo") };
  };
  const cantidadOperacion = () => campo("Cantidad", "cantidadOperacion", input("cantidadOperacion", 1, 'type="number" min="1" step="1" required')) + campo("Fecha", "fecha", fecha("fecha"));

  function reubicacion() {
    const lista = posiciones().filter(p => !L.posicionProtegida(datos(), p));
    formulario("Reubicar dentro del almacén", campo("Origen", "posicion", selectorPosicion(lista)) + '<p id="log-detalle-posicion" class="texto-suave"></p>' + campo("Ubicación destino", "destino", '<select id="log-destino" name="destino" required></select>') + cantidadOperacion() + razon, (d, s, valores) => M.reubicar(d, { ...entradaPosicion(lista, valores), destino: valores.get("destino") }, actor(), s.config), "reubicaciones");
    const actualizar = () => { const p = lista[Number(c.$("#log-posicion").value)]; mostrarPosicion(p); c.$("#log-destino").innerHTML = (p ? f.opcionesUbicacion(p.almacen, p.calidad).filter(u => u[0] !== p.ubicacion) : []).map(u => opcion(u[0], u[1])).join(""); };
    c.$("#log-posicion").addEventListener("change", actualizar); actualizar();
  }

  function tratamiento(recepcionId) {
    const r = datos().recepciones.find(r => r.id === recepcionId), lista = posiciones();
    formulario("Solicitar tratamiento de existencias", campo("Posición de origen", "posicion", selectorPosicion(lista)) + '<p id="log-detalle-posicion" class="texto-suave"></p>' + campo("Operación", "tipo", selectSimple("tipo", ["Deterioro", "Reparación", "Baja"], r ? "Reparación" : "Deterioro")) + campo("Recepción de origen, si corresponde", "recepcionId", '<select id="log-recepcionId" name="recepcionId"></select>') + cantidadOperacion() + razon, (d, s, valores) => M.solicitarTratamiento(d, { ...entradaPosicion(lista, valores), tipo: valores.get("tipo"), recepcionId: valores.get("recepcionId") || null }, actor()), "tratamientos");
    if (r) c.$("#log-posicion").value = String(lista.findIndex(p => p.almacen === r.almacen && p.lote === r.lote && p.ubicacion === "CUARENTENA" && p.calidad === "Cuarentena" && r.lineas.some(l => l.codigo === p.codigo && l.noConforme > 0)));
    const actualizar = () => {
      const p = lista[Number(c.$("#log-posicion").value)];
      mostrarPosicion(p);
      const recibidas = datos().recepciones.filter(r => p && r.almacen === p.almacen && r.lote === p.lote && p.calidad === "Cuarentena" && p.ubicacion === "CUARENTENA" && r.lineas.some(l => l.codigo === p.codigo && l.noConforme > 0));
      c.$("#log-recepcionId").innerHTML = opcion("", "Sin recepción de compra") + recibidas.map(r => opcion(r.id, r.numero, r.id === recepcionId ? r.id : null)).join("");
    };
    c.$("#log-posicion").addEventListener("change", actualizar); actualizar();
  }

  function reinspeccion(id) {
    const t = datos().tratamientos.find(t => t.id === id);
    formulario("Reinspeccionar reparación", campo("Resultado", "resultado", selectSimple("resultado", ["Conforme", "No conforme"])) + campo("Ubicación para recuperados", "ubicacion", selectorUbicacion("ubicacion", "Disponible", t.almacen)) + campo("Fecha", "fecha", fecha("fecha")) + razon, (d, s, valores) => M.reinspeccionar(d, { id, conforme: valores.get("resultado") === "Conforme", ubicacion: valores.get("ubicacion"), fecha: valores.get("fecha"), motivo: valores.get("motivo") }, actor(), s.config), "tratamientos");
  }

  function conteo() {
    formulario("Registrar conteo físico", `<div class="campos">${campo("Almacén", "almacen", selectorAlmacen())}${campo("Estado de calidad", "calidad", selectSimple("calidad", estados))}${campo("Ubicación", "ubicacion", selectorUbicacion())}${campo("Producto", "codigo", select("codigo", A.productos().map(p => [p.codigo, p.nombre])))}${campo("Lote", "lote", input("lote", "INICIAL"))}${campo("Cantidad contada", "contado", input("contado", 0, 'type="number" min="0" step="1" required'))}${campo("Fecha", "fecha", fecha("fecha"))}</div>${razon}`, (d, s, valores) => L.crearConteo(d, { almacen: valores.get("almacen"), fecha: valores.get("fecha"), motivo: valores.get("motivo"), lineas: [{ codigo: valores.get("codigo"), ubicacion: valores.get("ubicacion"), lote: valores.get("lote"), calidad: valores.get("calidad"), contado: Number(valores.get("contado")), coste: s.productos.find(p => p.codigo === valores.get("codigo"))?.coste || 0 }] }, actor(), s.productos), "conteos"); enlazarCalidad();
  }

  return { almacen, ubicacion, reubicacion, tratamiento, reinspeccion, conteo };
};
