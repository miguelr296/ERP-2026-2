"use strict";

window.AlmacenesReglas = (() => {
  const L = window.LogisticaReglas, C = window.ComprasReglas;
  const estados = ["Disponible", "Cuarentena", "Dañado", "En reparación"];
  const operario = actor => L.permitir(actor, ["Almacén", "Jefatura"]);
  const ocupacion = (d, almacen, ubicacion) => d.movimientos.filter(m => m.almacen === almacen && (!ubicacion || m.ubicacion === ubicacion)).reduce((n, m) => n + m.cantidad, 0);
  function abiertos(d, almacen) {
    return d.requisiciones.some(r => r.almacen === almacen && (r.estado === "Pendiente" || r.estado === "Aprobada" && !d.ordenes.some(o => o.requisicionId === r.id && o.estado === "Recibida"))) ||
      d.ordenes.some(o => o.almacen === almacen && !["Recibida", "Anulada", "Rechazada"].includes(o.estado)) ||
      d.reservas.some(r => r.almacen === almacen && r.estado === "Activa") ||
      d.despachos.some(r => r.almacen === almacen && ["Preparado", "En ruta"].includes(r.estado)) ||
      d.retornos.some(r => r.almacen === almacen && r.estado === "Pendiente") ||
      d.tratamientos.some(t => t.almacen === almacen && ["Pendiente", "En reparación", "Por reinspeccionar"].includes(t.estado)) ||
      d.traslados.some(t => [t.origen, t.destino].includes(almacen) && !["Recibido", "Rechazado"].includes(t.estado));
  }

  function guardarAlmacen(datos, entrada, actor, config) {
    L.permitir(actor, ["Jefatura"]); L.motivo(entrada.motivo);
    L.exigir(entrada.nombre?.trim() && entrada.direccion?.trim(), "Completa nombre y dirección.");
    const anterior = entrada.id ? L.obtener(datos.almacenes, entrada.id, actor) : null;
    if (anterior && entrada.activo === false) L.exigir(!ocupacion(datos, anterior.id) && !abiertos(datos, anterior.id), "No se desactiva un almacén con existencias u operaciones pendientes.");
    const campos = { nombre: entrada.nombre.trim(), direccion: entrada.direccion.trim(), activo: entrada.activo !== false, estado: entrada.activo === false ? "Inactivo" : "Activo" };
    if (anterior) { Object.assign(anterior, campos); anterior.historial.push(L.evento(actor, `Almacén actualizado: ${entrada.motivo}`)); return anterior; }
    const nuevo = L.crear(datos.almacenes, "ALM", campos, actor, `Almacén creado: ${entrada.motivo}`);
    datos.ubicaciones.push(...config.ubicaciones.map(u => ({ ...L.copiar(u), id: crypto.randomUUID(), almacen: nuevo.id, sede: actor.sede, activo: true, estado: "Activo", historial: [L.evento(actor, "Ubicación inicial del almacén")] })));
    return nuevo;
  }

  function guardarUbicacion(datos, entrada, actor) {
    L.permitir(actor, ["Jefatura"]); L.almacenDe(datos, entrada.almacen, actor); L.motivo(entrada.motivo);
    L.exigir(/^[A-Z0-9-]{2,25}$/.test(entrada.codigo) && entrada.nombre?.trim() && L.entero(entrada.capacidad), "Código, nombre o capacidad de ubicación no válidos.");
    L.exigir(entrada.estados.length && new Set(entrada.estados).size === entrada.estados.length && entrada.estados.every(e => estados.includes(e)), "Selecciona estados de calidad válidos sin repetir.");
    const anterior = entrada.id ? L.obtener(datos.ubicaciones, entrada.id, actor) : null;
    L.exigir(!anterior || anterior.almacen === entrada.almacen && anterior.codigo === entrada.codigo, "No cambies el código ni el almacén de una ubicación existente.");
    L.exigir(!datos.ubicaciones.some(u => u.almacen === entrada.almacen && u.codigo === entrada.codigo && u.id !== entrada.id), "El código ya existe en este almacén.");
    const cantidad = ocupacion(datos, entrada.almacen, entrada.codigo);
    L.exigir(entrada.capacidad >= cantidad, "La capacidad no puede ser menor que la ocupación actual.");
    for (const calidad of estados.filter(e => !entrada.estados.includes(e))) L.exigir(!datos.movimientos.filter(m => m.almacen === entrada.almacen && m.ubicacion === entrada.codigo && m.calidad === calidad).reduce((n, m) => n + m.cantidad, 0), "La ubicación todavía contiene existencias del estado que intentas retirar.");
    if (entrada.activo === false) L.exigir(!cantidad && !abiertos(datos, entrada.almacen), "No se desactiva una ubicación con existencias u operaciones pendientes.");
    const campos = { almacen: entrada.almacen, codigo: entrada.codigo, nombre: entrada.nombre.trim(), capacidad: entrada.capacidad, estados: L.copiar(entrada.estados), activo: entrada.activo !== false, estado: entrada.activo === false ? "Inactivo" : "Activo" };
    if (anterior) { Object.assign(anterior, campos); anterior.historial.push(L.evento(actor, `Ubicación actualizada: ${entrada.motivo}`)); return anterior; }
    return L.crear(datos.ubicaciones, "UBI", campos, actor, `Ubicación creada: ${entrada.motivo}`);
  }

  function validarPosicion(datos, entrada, actor) {
    L.almacenDe(datos, entrada.almacen, actor);
    L.exigir(L.entero(entrada.cantidad) && L.fechaValida(entrada.fecha), "Cantidad o fecha no válida.");
    L.exigir(L.ubicacionDe(datos, entrada.almacen, entrada.ubicacion).estados.includes(entrada.calidad), "La posición no admite ese estado.");
    const movimientos = datos.movimientos.filter(m => L.mismaPosicion(m, entrada));
    L.exigir(movimientos.length && entrada.fecha >= movimientos.reduce((f, m) => m.fecha > f ? m.fecha : f, ""), "La fecha es anterior a los movimientos de esta posición.");
    const cantidad = entrada.calidad === "Disponible" ? L.disponible(datos, entrada.almacen, entrada.codigo, entrada.ubicacion, entrada.lote, null, entrada.id) : L.saldo(datos, entrada.almacen, entrada.codigo, entrada.ubicacion, entrada.calidad, entrada.lote) - L.retenido(datos, entrada.almacen, entrada.codigo, entrada.ubicacion, entrada.lote, entrada.calidad, entrada.id);
    L.exigir(cantidad >= entrada.cantidad, "Saldo libre insuficiente; comprueba las cantidades reservadas.");
    return movimientos.at(-1).coste;
  }

  function reubicar(datos, entrada, actor, config) {
    operario(actor); const coste = validarPosicion(datos, entrada, actor); L.motivo(entrada.motivo);
    L.exigir(entrada.ubicacion !== entrada.destino && entrada.calidad !== "En reparación" && !L.posicionProtegida(datos, entrada), "Resuelve el documento de calidad antes de mover esta posición o elige otro destino.");
    L.exigir(L.ubicacionDe(datos, entrada.almacen, entrada.destino).estados.includes(entrada.calidad), "El destino no admite ese estado de calidad.");
    const r = L.crear(datos.reubicaciones, "REU", { ...entrada, coste, estado: "Registrada" }, actor, `Reubicación interna: ${entrada.motivo}`);
    L.registrarMovimiento(datos, { ...entrada, coste, tipo: "Salida por reubicación", cantidad: -entrada.cantidad, referencia: r.numero }, actor, config);
    L.registrarMovimiento(datos, { ...entrada, coste, tipo: "Entrada por reubicación", ubicacion: entrada.destino, referencia: r.numero }, actor, config); return r;
  }

  function solicitarTratamiento(datos, entrada, actor) {
    operario(actor); const coste = validarPosicion(datos, entrada, actor); L.motivo(entrada.motivo);
    L.exigir(["Deterioro", "Reparación", "Baja"].includes(entrada.tipo), "Selecciona un tratamiento válido.");
    L.exigir(entrada.tipo === "Deterioro" ? entrada.calidad === "Disponible" : ["Cuarentena", "Dañado"].includes(entrada.calidad), "El estado de origen no corresponde al tratamiento.");
    L.exigir(!datos.tratamientos.some(t => t.estado === "Pendiente" && L.mismaPosicion(t, entrada)), "Ya hay un tratamiento pendiente para esta posición.");
    if (entrada.recepcionId) {
      const r = L.obtener(datos.recepciones, entrada.recepcionId, actor), l = r.lineas.find(l => l.codigo === entrada.codigo);
      L.exigir(r.almacen === entrada.almacen && r.lote === entrada.lote && entrada.ubicacion === "CUARENTENA" && entrada.calidad === "Cuarentena" && l && l.noConforme >= entrada.cantidad, "El tratamiento supera las unidades observadas de la recepción.");
    } else L.exigir(!L.posicionProtegida(datos, entrada), "Selecciona la recepción de origen para tratar sus unidades no conformes.");
    return L.crear(datos.tratamientos, "CAL", { ...entrada, coste, estado: "Pendiente" }, actor, `Tratamiento solicitado: ${entrada.motivo}`);
  }

  function resolverTratamiento(datos, id, aceptar, motivo, actor, config) {
    L.permitir(actor, ["Jefatura"]); const t = L.obtener(datos.tratamientos, id, actor); L.independiente(actor, t.registradoPor); L.motivo(motivo);
    L.exigir(t.estado === "Pendiente", "El tratamiento ya fue resuelto.");
    if (!aceptar) { t.estado = "Rechazado"; t.historial.push(L.evento(actor, `Rechazado: ${motivo}`)); return t; }
    validarPosicion(datos, t, actor);
    L.registrarMovimiento(datos, { ...t, tratamientoId: t.id, referencia: t.numero, tipo: t.tipo === "Baja" ? "Baja autorizada" : "Salida por tratamiento", cantidad: -t.cantidad }, actor, config);
    if (t.tipo !== "Baja") L.registrarMovimiento(datos, { ...t, tratamientoId: t.id, referencia: t.numero, tipo: t.tipo === "Deterioro" ? "Deterioro documentado" : "Ingreso a reparación", ubicacion: t.tipo === "Deterioro" ? "CUARENTENA" : "TALLER", calidad: t.tipo === "Deterioro" ? "Dañado" : "En reparación" }, actor, config);
    if (t.recepcionId) {
      const r = L.obtener(datos.recepciones, t.recepcionId, actor), l = r.lineas.find(l => l.codigo === t.codigo);
      L.exigir(l.noConforme >= t.cantidad, "La recepción ya no tiene esas unidades observadas.");
      l.noConforme -= t.cantidad; l[t.tipo === "Baja" ? "baja" : "enReparacion"] += t.cantidad;
      C.actualizarRecepcion(r); r.historial.push(L.evento(actor, `${t.numero}: ${t.tipo} autorizada`));
    }
    t.estado = t.tipo === "Reparación" ? "En reparación" : t.tipo === "Baja" ? "Baja registrada" : "Deterioro registrado";
    t.aprobadoPor = actor.nombre; t.historial.push(L.evento(actor, `${t.estado}: ${motivo}`)); return t;
  }

  function terminarReparacion(datos, id, evidencia, actor) {
    operario(actor); const t = L.obtener(datos.tratamientos, id, actor); L.motivo(evidencia);
    L.exigir(t.estado === "En reparación", "La reparación no está en curso.");
    t.estado = "Por reinspeccionar"; t.evidencia = evidencia; t.reparadoPor = actor.nombre;
    t.historial.push(L.evento(actor, `Reparación presentada para reinspección: ${evidencia}`)); return t;
  }

  function reinspeccionar(datos, entrada, actor, config) {
    L.permitir(actor, ["Jefatura"]); const t = L.obtener(datos.tratamientos, entrada.id, actor); L.independiente(actor, t.reparadoPor); L.motivo(entrada.motivo);
    L.exigir(t.estado === "Por reinspeccionar" && L.fechaValida(entrada.fecha) && entrada.fecha >= t.fecha && typeof entrada.conforme === "boolean", "Estado o fecha de reinspección no válidos.");
    const calidad = entrada.conforme ? "Disponible" : t.recepcionId ? "Cuarentena" : "Dañado";
    const destino = entrada.conforme ? entrada.ubicacion : "CUARENTENA";
    L.registrarMovimiento(datos, { almacen: t.almacen, codigo: t.codigo, lote: t.lote, coste: t.coste, referencia: t.numero, fecha: entrada.fecha, tipo: "Salida de reparación", ubicacion: "TALLER", calidad: "En reparación", cantidad: -t.cantidad }, actor, config);
    L.registrarMovimiento(datos, { almacen: t.almacen, codigo: t.codigo, lote: t.lote, coste: t.coste, referencia: t.numero, fecha: entrada.fecha, tipo: "Reinspección", ubicacion: destino, calidad, cantidad: t.cantidad }, actor, config);
    if (t.recepcionId) {
      const r = L.obtener(datos.recepciones, t.recepcionId, actor), l = r.lineas.find(l => l.codigo === t.codigo);
      l.enReparacion -= t.cantidad; l[entrada.conforme ? "conforme" : "noConforme"] += t.cantidad; C.actualizarRecepcion(r);
      r.historial.push(L.evento(actor, `${t.numero}: reinspección ${entrada.conforme ? "conforme" : "no conforme"}`));
    }
    t.estado = entrada.conforme ? "Recuperado" : "No recuperado"; t.reinspeccionadoPor = actor.nombre;
    t.destino = destino; t.calidadFinal = calidad; t.fechaReinspeccion = entrada.fecha;
    t.historial.push(L.evento(actor, `${t.estado}: ${entrada.motivo}`)); return t;
  }

  return { guardarAlmacen, guardarUbicacion, reubicar, solicitarTratamiento, resolverTratamiento, terminarReparacion, reinspeccionar, ocupacion };
})();
