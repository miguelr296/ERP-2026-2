"use strict";

window.DistribucionReglas = (() => {
  const L = window.LogisticaReglas;
  const almacen = actor => L.permitir(actor, ["Almacén", "Jefatura"]);
  const pedidoAprobado = (pedidos, id, actor) => {
    const pedido = pedidos.find(p => p.id === id && p.sede === actor.sede && ["Aprobado", "Parcialmente atendido", "Atendido", "Facturado"].includes(p.estado));
    L.exigir(pedido, "El pedido debe estar aprobado comercialmente y pertenecer a la sede."); return pedido;
  };

  function despachada(datos, pedidoId, codigo) {
    return datos.despachos.filter(d => d.pedidoId === pedidoId).flatMap(d => d.lineas).filter(l => l.codigo === codigo).reduce((n, l) => n + l.cantidad - (l.retornada || 0), 0);
  }

  function reservar(datos, entrada, actor, pedidos, config) {
    almacen(actor); L.almacenDe(datos, entrada.almacen, actor); const pedido = pedidoAprobado(pedidos, entrada.pedidoId, actor);
    const anterior = datos.reservas.find(r => r.pedidoId === pedido.id && r.estado === "Activa"); if (anterior) return anterior;
    L.exigir(entrada.lineas.length && new Set(entrada.lineas.map(l => l.codigo)).size === entrada.lineas.length, "Selecciona productos sin repetir.");
    const asignaciones = [];
    for (const linea of entrada.lineas) {
      const pedida = pedido.lineas.find(l => l.codigo === linea.codigo);
      L.exigir(pedida && L.entero(linea.cantidad) && despachada(datos, pedido.id, linea.codigo) + linea.cantidad <= pedida.cantidad, "La reserva supera las cantidades pendientes del pedido.");
      let restante = linea.cantidad;
      for (const lote of L.lotesDisponibles(datos, entrada.almacen, linea.codigo)) {
        const cantidad = Math.min(restante, lote.disponible);
        if (cantidad) asignaciones.push({ almacen: entrada.almacen, codigo: linea.codigo, ubicacion: lote.ubicacion, lote: lote.lote, coste: lote.coste, cantidad, consumida: 0, liberada: 0 });
        restante -= cantidad; if (!restante) break;
      }
      L.exigir(restante === 0, `Stock disponible insuficiente para ${linea.codigo}.`);
    }
    asignaciones.forEach(l => { const origen = pedido.lineas.find(p => p.codigo === l.codigo); l.nombre = origen.nombre; l.unidad = origen.unidad; });
    return L.crear(datos.reservas, "RES", { pedidoId: pedido.id, pedidoNumero: pedido.numero, almacen: entrada.almacen, lineas: asignaciones, estado: "Activa", cliente: L.copiar(pedido.cliente), entregaPrevista: pedido.entrega }, actor, "Reserva por ubicación y lote");
  }

  function liberarReserva(datos, id, motivo, actor) {
    almacen(actor); const reserva = L.obtener(datos.reservas, id, actor); L.motivo(motivo);
    L.exigir(reserva.estado === "Activa", "La reserva ya fue cerrada.");
    L.exigir(!datos.picking.some(p => p.reservaId === id && !["Despachado", "Anulado"].includes(p.estado)), "Anula los picking pendientes antes de liberar la reserva.");
    reserva.lineas.forEach(l => { l.liberada = l.cantidad - l.consumida; });
    reserva.estado = "Liberada"; reserva.historial.push(L.evento(actor, `Liberación: ${motivo}`));
  }

  function crearPicking(datos, entrada, actor, pedidos) {
    almacen(actor); const reserva = L.obtener(datos.reservas, entrada.reservaId, actor); pedidoAprobado(pedidos, reserva.pedidoId, actor);
    L.exigir(reserva.estado === "Activa" && entrada.lineas.length && new Set(entrada.lineas.map(l => l.codigo)).size === entrada.lineas.length, "Reserva inactiva o líneas repetidas.");
    const asignaciones = [];
    for (const linea of entrada.lineas) {
      L.exigir(L.entero(linea.cantidad), "Cantidad de picking no válida.");
      let pendiente = linea.cantidad;
      for (let indice = 0; indice < reserva.lineas.length; indice++) {
        const l = reserva.lineas[indice]; if (l.codigo !== linea.codigo) continue;
        const enPreparacion = datos.picking.filter(p => p.reservaId === reserva.id && !["Despachado", "Anulado"].includes(p.estado)).flatMap(p => p.lineas).filter(pl => pl.reservaIndice === indice).reduce((n, pl) => n + pl.cantidad, 0);
        const disponible = l.cantidad - l.consumida - l.liberada - enPreparacion;
        const cantidad = Math.min(pendiente, disponible);
        if (cantidad > 0) asignaciones.push({ ...L.copiar(l), reservaIndice: indice, cantidad });
        pendiente -= Math.max(0, cantidad); if (!pendiente) break;
      }
      L.exigir(pendiente === 0, "El picking supera las unidades reservadas sin preparar.");
    }
    return L.crear(datos.picking, "PICK", { reservaId: reserva.id, pedidoId: reserva.pedidoId, pedidoNumero: reserva.pedidoNumero, almacen: reserva.almacen, lineas: asignaciones, estado: "Pendiente" }, actor, "Lista de picking generada");
  }

  function avanzarPicking(datos, id, accion, motivo, actor, pedidos) {
    almacen(actor); const picking = L.obtener(datos.picking, id, actor); L.motivo(motivo);
    if (accion !== "Anulado") pedidoAprobado(pedidos, picking.pedidoId, actor);
    const anterior = { Preparado: "Pendiente", Embalado: "Preparado" };
    L.exigir(accion === "Anulado" ? ["Pendiente", "Preparado", "Embalado"].includes(picking.estado) : picking.estado === anterior[accion], "Transición de picking no válida.");
    picking.estado = accion; picking.historial.push(L.evento(actor, `${accion}: ${motivo}`));
  }

  function crearDespacho(datos, entrada, actor, pedidos, config) {
    almacen(actor); const picking = L.obtener(datos.picking, entrada.pickingId, actor), reserva = L.obtener(datos.reservas, picking.reservaId, actor);
    const pedido = pedidoAprobado(pedidos, picking.pedidoId, actor);
    const anterior = datos.despachos.find(d => d.pickingId === picking.id); if (anterior) return anterior;
    L.exigir(picking.estado === "Embalado" && reserva.estado === "Activa", "El picking debe estar embalado y reservado.");
    L.exigir(L.fechaValida(entrada.fecha) && entrada.transportista?.trim() && entrada.placa?.trim() && entrada.destino?.trim(), "Completa fecha, transportista, vehículo y destino.");
    const despacho = L.crear(datos.despachos, "DES", { ...entrada, pedidoId: pedido.id, pedidoNumero: pedido.numero, cliente: L.copiar(pedido.cliente), entregaPrevista: pedido.entrega, almacen: picking.almacen, lineas: picking.lineas.map(l => ({ ...L.copiar(l), entregada: 0, retornada: 0 })), estado: "Preparado", guia: L.numerar(datos.despachos, "GS") }, actor, "Salida de almacén registrada y guía interna preparada");
    for (const l of picking.lineas) {
      const reservada = reserva.lineas[l.reservaIndice];
      L.exigir(reservada.cantidad - reservada.consumida - reservada.liberada >= l.cantidad, "La reserva ya fue consumida.");
      L.registrarMovimiento(datos, { tipo: "Salida por venta", almacen: picking.almacen, ubicacion: l.ubicacion, calidad: "Disponible", codigo: l.codigo, lote: l.lote, cantidad: -l.cantidad, coste: l.coste, referencia: despacho.numero, fecha: entrada.fecha }, actor, config);
      reservada.consumida += l.cantidad;
    }
    picking.estado = "Despachado"; picking.historial.push(L.evento(actor, `Despacho ${despacho.numero}`));
    if (reserva.lineas.every(l => l.consumida + l.liberada === l.cantidad)) reserva.estado = "Consumida";
    reserva.historial.push(L.evento(actor, `Salida ${despacho.numero}`)); return despacho;
  }

  function iniciarRuta(datos, id, actor) {
    L.permitir(actor, ["Transporte", "Jefatura"]); const despacho = L.obtener(datos.despachos, id, actor);
    L.exigir(despacho.estado === "Preparado", "El despacho no está preparado para salir a ruta.");
    despacho.estado = "En ruta"; despacho.historial.push(L.evento(actor, "Salida a ruta confirmada por Transporte"));
  }

  function confirmarEntrega(datos, entrada, actor) {
    L.permitir(actor, ["Transporte", "Jefatura"]); const d = L.obtener(datos.despachos, entrada.despachoId, actor);
    L.exigir(d.estado === "En ruta", "La entrega ya se confirmó o no está en ruta.");
    L.exigir(L.fechaValida(entrada.fecha) && entrada.fecha >= d.fecha && entrada.receptor?.trim() && entrada.evidencia?.trim(), "Completa fecha, receptor y referencia de conformidad.");
    const cantidades = new Map(entrada.lineas.map(l => [l.codigo, l.cantidad]));
    L.exigir(cantidades.size === entrada.lineas.length && [...cantidades].every(([codigo, cantidad]) => d.lineas.some(l => l.codigo === codigo) && Number.isSafeInteger(cantidad) && cantidad >= 0), "Líneas o cantidades de entrega no válidas.");
    let total = 0;
    for (const codigo of new Set(d.lineas.map(l => l.codigo))) {
      let pendiente = cantidades.get(codigo) || 0;
      L.exigir(pendiente <= d.lineas.filter(l => l.codigo === codigo).reduce((n, l) => n + l.cantidad, 0), "La entrega supera lo despachado.");
      for (const l of d.lineas.filter(l => l.codigo === codigo)) { l.entregada = Math.min(l.cantidad, pendiente); pendiente -= l.entregada; total += l.entregada; }
    }
    const completa = d.lineas.every(l => l.entregada === l.cantidad);
    if (!completa) L.motivo(entrada.motivo);
    d.estado = completa ? "Entregado" : total ? "Entrega parcial" : "No entregado";
    d.receptor = entrada.receptor; d.evidencia = entrada.evidencia; d.entregadoEn = entrada.fecha;
    d.historial.push(L.evento(actor, `${d.estado}: ${entrada.evidencia}${entrada.motivo ? "; " + entrada.motivo : ""}`));
    if (!completa) L.crear(datos.retornos, "RET", { despachoId: d.id, almacen: d.almacen, lineas: d.lineas.filter(l => l.cantidad > l.entregada).map(l => ({ ...L.copiar(l), cantidad: l.cantidad - l.entregada })), estado: "Pendiente", motivo: entrada.motivo }, actor, "Retorno de unidades no entregadas pendiente de recepción");
    return d;
  }

  function recibirRetorno(datos, id, motivo, ubicacion, calidad, actor, config, fecha, documento) {
    almacen(actor); const retorno = L.obtener(datos.retornos, id, actor); L.motivo(motivo);
    L.exigir(retorno.estado === "Pendiente" && ["Disponible", "Cuarentena", "Dañado"].includes(calidad), "Retorno ya recibido o calidad no válida.");
    const despacho = L.obtener(datos.despachos, retorno.despachoId, actor);
    L.exigir(L.fechaValida(fecha) && fecha >= despacho.entregadoEn && documento?.trim(), "Indica fecha y documento del retorno físico.");
    for (const l of retorno.lineas) L.registrarMovimiento(datos, { tipo: "Retorno no entregado", almacen: retorno.almacen, ubicacion, calidad, codigo: l.codigo, lote: l.lote, cantidad: l.cantidad, coste: l.coste, referencia: retorno.numero, fecha }, actor, config);
    for (const l of despacho.lineas) l.retornada = l.cantidad - l.entregada;
    retorno.estado = "Recibido"; retorno.documento = documento; retorno.fechaRecepcion = fecha; retorno.historial.push(L.evento(actor, `Retorno físico verificado: ${motivo}`));
  }

  function crearTraslado(datos, entrada, actor, productos) {
    L.permitir(actor, ["Almacén", "Compras", "Jefatura"]);
    const origen = L.almacenDe(datos, entrada.origen, actor), destino = L.almacenDe(datos, entrada.destino, actor, true);
    L.exigir(origen.id !== destino.id && L.fechaValida(entrada.fecha), "Selecciona almacenes distintos y una fecha válida."); L.validarLineas(entrada.lineas, productos);
    return L.crear(datos.traslados, "TRA", { ...entrada, sedeDestino: destino.sede, motivo: L.motivo(entrada.motivo), estado: "Pendiente", recibidas: {} }, actor, "Traslado entre almacenes solicitado");
  }

  function aprobarTraslado(datos, id, aceptar, motivo, actor) {
    L.permitir(actor, ["Jefatura"]); const traslado = L.obtener(datos.traslados, id, actor);
    L.independiente(actor, traslado.registradoPor); L.exigir(traslado.estado === "Pendiente", "Traslado ya resuelto."); L.motivo(motivo);
    traslado.estado = aceptar ? "Aprobado" : "Rechazado"; traslado.historial.push(L.evento(actor, `${traslado.estado}: ${motivo}`));
  }

  function despacharTraslado(datos, id, actor, config) {
    almacen(actor); const t = L.obtener(datos.traslados, id, actor);
    L.exigir(t.estado === "Aprobado", "El traslado debe estar aprobado.");
    const asignaciones = [];
    for (const l of t.lineas) {
      let restante = l.cantidad;
      for (const lote of L.lotesDisponibles(datos, t.origen, l.codigo)) {
        const cantidad = Math.min(restante, lote.disponible);
        if (cantidad) asignaciones.push({ ...lote, codigo: l.codigo, cantidad });
        restante -= cantidad; if (!restante) break;
      }
      L.exigir(!restante, "Stock disponible insuficiente para el traslado.");
    }
    for (const l of asignaciones) L.registrarMovimiento(datos, { tipo: "Salida por traslado", almacen: t.origen, ubicacion: l.ubicacion, calidad: "Disponible", codigo: l.codigo, lote: l.lote, cantidad: -l.cantidad, coste: l.coste, referencia: t.numero, fecha: t.fecha }, actor, config);
    t.asignaciones = asignaciones; t.estado = "En tránsito"; t.historial.push(L.evento(actor, "Salida del almacén de origen; mercancía en tránsito"));
  }

  function recibirTraslado(datos, entrada, actor, config) {
    almacen(actor); const t = L.obtener(datos.traslados, entrada.trasladoId, actor, true);
    L.exigir(t.sedeDestino === actor.sede && ["En tránsito", "Parcialmente recibido"].includes(t.estado), "El traslado no está pendiente en esta sede de destino.");
    L.exigir(L.fechaValida(entrada.fecha) && entrada.fecha >= t.fecha && entrada.documento?.trim(), "Indica fecha y documento de recepción válidos.");
    t.recepciones ??= [];
    L.exigir(!t.recepciones.some(r => r.documento === entrada.documento), "Ese documento de recepción del traslado ya está registrado.");
    L.exigir(entrada.lineas.length && new Set(entrada.lineas.map(l => l.codigo)).size === entrada.lineas.length, "Selecciona productos sin repetir.");
    for (const l of entrada.lineas) {
      const pedida = t.lineas.find(pl => pl.codigo === l.codigo);
      const recibida = t.recibidas[l.codigo] || 0;
      L.exigir(pedida && L.entero(l.cantidad) && recibida + l.cantidad <= pedida.cantidad, "La recepción supera la cantidad trasladada.");
      let restante = l.cantidad, omitidas = recibida;
      for (const asignacion of t.asignaciones.filter(a => a.codigo === l.codigo)) {
        const disponibles = asignacion.cantidad - Math.min(omitidas, asignacion.cantidad); omitidas = Math.max(0, omitidas - asignacion.cantidad);
        const cantidad = Math.min(restante, disponibles);
        if (cantidad) L.registrarMovimiento(datos, { tipo: "Entrada por traslado", almacen: t.destino, ubicacion: entrada.ubicacion, calidad: entrada.calidad, codigo: l.codigo, lote: asignacion.lote, cantidad, coste: asignacion.coste, referencia: t.numero, fecha: entrada.fecha }, actor, config);
        restante -= cantidad; if (!restante) break;
      }
      t.recibidas[l.codigo] = recibida + l.cantidad;
    }
    t.estado = t.lineas.every(l => t.recibidas[l.codigo] === l.cantidad) ? "Recibido" : "Parcialmente recibido";
    t.recepciones.push({ documento: entrada.documento, fecha: entrada.fecha, lineas: L.copiar(entrada.lineas), recibidoPor: actor.nombre });
    t.historial.push(L.evento(actor, `Recepción en destino: ${L.motivo(entrada.motivo)}`));
  }

  function recibirDevolucion(datos, entrada, actor, solicitudes, config) {
    almacen(actor); L.almacenDe(datos, entrada.almacen, actor);
    const solicitud = solicitudes.find(s => s.id === entrada.solicitudId && s.sede === actor.sede && s.tipo === "Devolución" && s.estado === "Autorizada");
    L.exigir(solicitud, "Selecciona una devolución autorizada por Comercial en esta sede.");
    const anterior = datos.retornos.filter(r => r.solicitudId === solicitud.id);
    L.exigir(entrada.documento?.trim() && !anterior.some(r => r.documento === entrada.documento) && L.fechaValida(entrada.fecha), "Documento duplicado o fecha no válida.");
    L.exigir(entrada.lineas.length && new Set(entrada.lineas.map(l => l.codigo)).size === entrada.lineas.length, "Selecciona productos sin repetir.");
    for (const l of entrada.lineas) {
      const pedida = solicitud.lineas.find(pl => pl.codigo === l.codigo);
      const recibida = anterior.flatMap(r => r.lineas).filter(r => r.codigo === l.codigo).reduce((n, l) => n + l.cantidad, 0);
      L.exigir(pedida && L.entero(l.cantidad) && recibida + l.cantidad <= pedida.cantidad, "La devolución física supera lo autorizado por Comercial.");
    }
    const retorno = L.crear(datos.retornos, "DEV", { ...entrada, motivo: L.motivo(entrada.motivo), pedidoId: solicitud.pedidoId, estado: "Recibido", comercial: true }, actor, "Devolución autorizada recibida físicamente");
    for (const l of retorno.lineas) L.registrarMovimiento(datos, { tipo: "Devolución de cliente", almacen: entrada.almacen, ubicacion: entrada.ubicacion, calidad: entrada.calidad, codigo: l.codigo, lote: entrada.lote || retorno.numero, cantidad: l.cantidad, coste: l.coste || 0, referencia: retorno.numero, fecha: entrada.fecha }, actor, config);
    return retorno;
  }

  function resolverCuarentena(datos, entrada, actor, config) {
    L.permitir(actor, ["Jefatura"]); L.almacenDe(datos, entrada.almacen, actor); L.motivo(entrada.motivo);
    L.exigir(L.entero(entrada.cantidad) && ["Disponible", "Dañado"].includes(entrada.destinoCalidad), "Cantidad o destino no válido.");
    L.exigir(!datos.recepciones.some(r => r.almacen === entrada.almacen && r.lote === entrada.lote && ["En inspección", "No conforme"].includes(r.estado)), "Resuelve la calidad desde la ficha de la recepción de compra.");
    const salida = L.registrarMovimiento(datos, { tipo: "Resolución de cuarentena", almacen: entrada.almacen, ubicacion: entrada.origen, calidad: "Cuarentena", codigo: entrada.codigo, lote: entrada.lote, cantidad: -entrada.cantidad, coste: entrada.coste || 0, referencia: entrada.motivo, fecha: entrada.fecha }, actor, config);
    L.registrarMovimiento(datos, { ...L.copiar(salida), ubicacion: entrada.destino, calidad: entrada.destinoCalidad, cantidad: entrada.cantidad }, actor, config);
    return salida;
  }

  return { despachada, reservar, liberarReserva, crearPicking, avanzarPicking, crearDespacho, iniciarRuta, confirmarEntrega, recibirRetorno, crearTraslado, aprobarTraslado, despacharTraslado, recibirTraslado, recibirDevolucion, resolverCuarentena };
})();
