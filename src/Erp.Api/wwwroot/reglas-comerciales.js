"use strict";

window.ReglasComerciales = (() => {
  const exigir = (condicion, mensaje) => { if (!condicion) throw new Error(mensaje); };
  const copiar = valor => structuredClone(valor);
  const identidad = nombre => String(nombre).trim().toLocaleLowerCase("es");
  const comercial = actor => exigir(["Asesor", "Jefatura"].includes(actor.rol), "La operación corresponde a Comercial.");
  const jefatura = actor => exigir(actor.rol === "Jefatura", "La operación requiere Jefatura.");
  const otroResponsable = (actor, autor) => exigir(identidad(actor.nombre) !== identidad(autor), "Otra persona debe revisar la solicitud; no puedes aprobar ni rechazar la tuya.");
  const evento = (actor, accion) => ({ fecha: new Date().toISOString(), usuario: actor.nombre, rol: actor.rol, accion });
  const motivoValido = motivo => { exigir(typeof motivo === "string" && motivo.trim().length >= 3, "Escribe un motivo de al menos tres caracteres."); return motivo.trim(); };
  const numero = (lista, prefijo) => `${prefijo}-${String(Math.max(0, ...lista.map(d => Number(d.numero?.split("-").at(-1))).filter(Number.isFinite)) + 1).padStart(5, "0")}`;
  const aprobado = dato => dato?.estado === "Aprobado";
  const referenciaValida = valor => typeof valor === "string" ? valor.trim().length > 0 : !!valor && typeof (valor.numero || valor.referencia) === "string" && (valor.numero || valor.referencia).trim().length > 0;
  const vigente = (dato, fecha) => dato.activa && aprobado(dato) && dato.desde <= fecha && fecha <= dato.hasta;
  const buscar = (lista, id, actor) => { const dato = lista.find(d => d.id === id && (!d.sede || d.sede === actor.sede)); exigir(dato, "No se encontró el registro en esta sede."); return dato; };

  function prepararDatos(configuracion, guardados) {
    const datos = guardados ? copiar(guardados) : { version: 2, clientes: copiar(configuracion.clientes), oportunidades: copiar(configuracion.oportunidades), cotizaciones: [], pedidos: [] };
    exigir([1, 2].includes(datos.version), "Versión de datos no compatible. Se conservaron los datos originales.");
    for (const clave of ["clientes", "oportunidades", "cotizaciones", "pedidos"]) exigir(Array.isArray(datos[clave]), "Formato de datos no compatible.");
    datos.productos ??= copiar(configuracion.productos);
    datos.listasPrecio ??= copiar(configuracion.listasPrecio);
    datos.promociones ??= copiar(configuracion.promociones);
    datos.solicitudesMaestro ??= [];
    datos.solicitudes ??= [];
    datos.productos.forEach(p => { p.id ??= p.codigo; p.estado ??= "Aprobado"; });
    datos.clientes.forEach(c => { c.estado ??= "Aprobado"; c.historial ??= []; });
    datos.cotizaciones.forEach(c => {
      c.bruto ??= c.subtotal; c.descuento ??= 0; c.descuentoBps ??= 0;
      c.listaNombre ??= "Lista histórica"; c.moneda ??= "PEN"; c.autorizacion ??= "No requiere";
    });
    datos.pedidos.forEach(p => { p.entregas ??= []; p.facturas ??= []; });
    datos.version = 2;
    return datos;
  }

  function listaVigente(datos, oportunidad, fecha) {
    const cliente = datos.clientes.find(c => c.id === oportunidad.clienteId);
    exigir(aprobado(cliente), "El cliente debe estar aprobado antes de cotizar.");
    const listas = datos.listasPrecio.filter(l => vigente(l, fecha) && l.canal === oportunidad.canal && l.segmento === cliente.segmento);
    exigir(listas.length === 1, listas.length ? "Hay más de una lista vigente para el canal y segmento." : "No hay lista vigente para el canal y segmento del cliente.");
    return listas[0];
  }

  function calcular(datos, oportunidad, parametros, config) {
    exigir(oportunidad.estado !== "Perdida", "La oportunidad está cerrada como perdida.");
    const lista = listaVigente(datos, oportunidad, parametros.fecha);
    let descuentoBps = Number(parametros.descuentoBps || 0), origenDescuento = "Manual";
    if (parametros.promocionId) {
      exigir(descuentoBps === 0, "No se acumula promoción y descuento manual.");
      const promo = datos.promociones.find(p => p.id === parametros.promocionId);
      exigir(promo && vigente(promo, parametros.fecha) && promo.canal === oportunidad.canal && promo.segmento === datos.clientes.find(c => c.id === oportunidad.clienteId).segmento, "La promoción no es aplicable o está vencida.");
      descuentoBps = promo.descuentoBps; origenDescuento = promo.nombre;
    }
    exigir(Number.isInteger(descuentoBps) && descuentoBps >= 0 && descuentoBps <= config.descuentoMaximoBps, "El descuento supera el máximo permitido de 20 %.");
    const lineas = oportunidad.lineas.map(l => {
      const producto = datos.productos.find(p => p.codigo === l.codigo && aprobado(p));
      const precio = lista.precios[l.codigo];
      exigir(producto && Number.isSafeInteger(precio) && precio > 0, `El producto ${l.codigo} no tiene un precio aprobado en la lista.`);
      exigir(Number.isInteger(l.cantidad) && l.cantidad > 0 && l.cantidad <= 999, "Cantidad no válida.");
      const importeBruto = precio * l.cantidad;
      const descuento = Math.round(importeBruto * descuentoBps / 10000);
      return { codigo: producto.codigo, nombre: producto.nombre, unidad: producto.unidad, coste: producto.coste, precio, cantidad: l.cantidad, importeBruto, descuento, importe: importeBruto - descuento };
    });
    exigir(lineas.length > 0 && new Set(lineas.map(l => l.codigo)).size === lineas.length, "La oportunidad debe tener productos distintos.");
    const bruto = lineas.reduce((s, l) => s + l.importeBruto, 0);
    const descuento = lineas.reduce((s, l) => s + l.descuento, 0), subtotal = bruto - descuento;
    const igv = Math.round(subtotal * config.igvPorcentaje / 100);
    return { lineas, bruto, descuento, subtotal, igv, total: subtotal + igv, descuentoBps, origenDescuento, igvPorcentaje: config.igvPorcentaje, moneda: lista.moneda, listaId: lista.id, listaNombre: lista.nombre, listaVigenteHasta: lista.hasta };
  }

  function crearCotizacion(datos, entrada, actor, config) {
    comercial(actor);
    const oportunidad = buscar(datos.oportunidades, entrada.oportunidadId, actor);
    const calculo = calcular(datos, oportunidad, entrada, config);
    exigir(entrada.fecha <= entrada.vigenteHasta && entrada.vigenteHasta <= calculo.listaVigenteHasta, "La vigencia debe estar dentro de la lista de precios.");
    exigir(entrada.entrega >= entrada.fecha, "La entrega propuesta no puede estar en el pasado.");
    exigir(["Contado", "Crédito 30 días"].includes(entrada.condicion), "Condición de pago no válida.");
    const motivo = calculo.descuentoBps ? motivoValido(entrada.promocionId ? calculo.origenDescuento : entrada.motivo) : "Sin descuento";
    const pendiente = calculo.descuentoBps > config.descuentoAsesorBps;
    const cotizacion = {
      id: crypto.randomUUID(), numero: numero(datos.cotizaciones, `COT-${entrada.fecha.slice(0, 4)}`),
      ...calculo, oportunidadId: oportunidad.id, oportunidadNumero: oportunidad.numero,
      cliente: copiar(datos.clientes.find(c => c.id === oportunidad.clienteId)),
      sede: actor.sede, vendedor: oportunidad.vendedor, canal: oportunidad.canal, registradoPor: actor.nombre,
      fecha: entrada.fecha, vigenteHasta: entrada.vigenteHasta, entrega: entrada.entrega, condicion: entrada.condicion,
      motivoDescuento: motivo, autorizacion: pendiente ? "Pendiente" : "No requiere",
      estado: pendiente ? "Pendiente de aprobación" : "Borrador", historial: [evento(actor, "Creación de cotización")]
    };
    datos.cotizaciones.push(cotizacion); oportunidad.estado = "Cotizada";
    return cotizacion;
  }

  function resolverDescuento(datos, id, aceptar, motivo, actor, fecha) {
    jefatura(actor);
    const c = buscar(datos.cotizaciones, id, actor);
    otroResponsable(actor, c.registradoPor);
    exigir(c.autorizacion === "Pendiente", "La solicitud ya fue resuelta.");
    exigir(c.vigenteHasta >= fecha && c.listaVigenteHasta >= fecha, "La propuesta o su lista venció; prepara otra cotización.");
    const razon = motivoValido(motivo);
    c.autorizacion = aceptar ? "Aprobada" : "Rechazada";
    c.estado = aceptar ? "Borrador" : "Rechazada";
    c.aprobador = actor.nombre;
    c.historial.push(evento(actor, `${aceptar ? "Aprobación" : "Rechazo"} de descuento: ${razon}`));
  }

  function cambiarCotizacion(datos, id, estado, motivo, actor, fecha) {
    comercial(actor);
    const c = buscar(datos.cotizaciones, id, actor);
    const anteriores = { Enviada: ["Borrador"], Aceptada: ["Enviada"], Rechazada: ["Enviada"], Anulada: ["Borrador", "Enviada"], Vencida: ["Borrador", "Enviada", "Pendiente de aprobación"] };
    exigir(anteriores[estado]?.includes(c.estado), "La transición no está disponible.");
    exigir(estado === "Vencida" || (c.autorizacion !== "Pendiente" && c.autorizacion !== "Rechazada"), "El descuento no está autorizado.");
    if (estado === "Vencida") exigir(c.vigenteHasta < fecha, "La cotización todavía está vigente.");
    if (["Enviada", "Aceptada"].includes(estado)) {
      exigir(c.vigenteHasta >= fecha && (!c.listaVigenteHasta || c.listaVigenteHasta >= fecha), "La cotización o su lista venció.");
      exigir(aprobado(datos.clientes.find(cliente => cliente.id === c.cliente.id)), "El cliente no está aprobado.");
    }
    if (["Rechazada", "Anulada"].includes(estado)) motivo = motivoValido(motivo);
    exigir(estado !== "Anulada" || !datos.pedidos.some(p => p.cotizacionId === id), "La cotización ya tiene un pedido derivado.");
    c.estado = estado; c.historial.push(evento(actor, `${estado === "Enviada" ? "Marcada como enviada" : estado}${motivo ? ": " + motivo : ""}`));
  }

  function crearPedido(datos, id, actor, fecha) {
    comercial(actor);
    const c = buscar(datos.cotizaciones, id, actor);
    exigir(c.estado === "Aceptada", "El pedido requiere una cotización aceptada.");
    const anterior = datos.pedidos.find(p => p.cotizacionId === id);
    if (anterior) return anterior;
    exigir(c.vigenteHasta >= fecha, "La cotización venció.");
    const p = { ...copiar(c), id: crypto.randomUUID(), numero: numero(datos.pedidos, `PV-${fecha.slice(0, 4)}`), cotizacionId: id, cotizacionNumero: c.numero, estado: "Borrador", fecha, registradoPor: actor.nombre, entregas: [], facturas: [], historial: [evento(actor, `Pedido creado desde ${c.numero}`)] };
    datos.pedidos.push(p); c.historial.push(evento(actor, `Pedido derivado ${p.numero}`));
    return p;
  }

  function controles(datos, pedido, puertos) {
    const cliente = datos.clientes.find(c => c.id === pedido.cliente.id);
    const identificacion = aprobado(cliente) && /^(?:[0-9]{8}|[0-9]{11})$/.test(cliente.documento);
    const stock = puertos.consultarDisponibilidad(pedido);
    const disponibilidad = pedido.lineas.map(l => {
      const disponible = stock.lineas.find(r => r.codigo === l.codigo)?.disponible;
      return { codigo: l.codigo, solicitada: l.cantidad, disponible, aprobado: Number.isInteger(disponible) && disponible >= l.cantidad };
    });
    const credito = pedido.condicion === "Contado" ? { origen: "No aplica: contado", aprobado: true } : puertos.consultarCredito(pedido.cliente.id);
    if (pedido.condicion !== "Contado") credito.aprobado = !!credito.datos && Number.isSafeInteger(credito.datos.limite) && credito.datos.limite >= 0 && Number.isSafeInteger(credito.datos.exposicion) && credito.datos.exposicion >= 0 && credito.datos.vencido === 0 && credito.datos.limite - credito.datos.exposicion >= pedido.total;
    const motivos = [];
    if (!identificacion) motivos.push("Cliente no aprobado o identificación incompleta");
    if (disponibilidad.some(l => l.disponible == null)) motivos.push("Sin respuesta de disponibilidad de Inventarios");
    else if (disponibilidad.some(l => !l.aprobado)) motivos.push("Disponibilidad insuficiente en Inventarios");
    if (!credito.aprobado) motivos.push(credito.datos ? "Finanzas: crédito insuficiente o deuda vencida" : "Sin respuesta de crédito de Finanzas");
    return { fecha: new Date().toISOString(), identificacion, stockOrigen: stock.origen, disponibilidad, credito, motivos, aprobado: motivos.length === 0 };
  }

  function validarPedido(datos, id, actor, puertos) {
    comercial(actor);
    const p = buscar(datos.pedidos, id, actor);
    exigir(["Borrador", "Bloqueado", "Pendiente de aprobación"].includes(p.estado), "El pedido ya está aprobado, atendido o anulado.");
    p.controles = controles(datos, p, puertos);
    p.estado = p.controles.aprobado ? "Pendiente de aprobación" : "Bloqueado";
    p.historial.push(evento(actor, `Validación comercial: ${p.controles.motivos.join("; ") || "controles favorables"}`));
    return p;
  }

  function aprobarPedido(datos, id, actor, puertos) {
    jefatura(actor);
    const p = buscar(datos.pedidos, id, actor);
    otroResponsable(actor, p.registradoPor);
    validarPedido(datos, id, actor, puertos);
    if (!p.controles.aprobado) return p;
    p.estado = "Aprobado"; p.aprobadoPor = actor.nombre;
    p.historial.push(evento(actor, "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"));
    return p;
  }

  function bloquearPedido(datos, id, motivo, actor, puertos) {
    jefatura(actor);
    const p = buscar(datos.pedidos, id, actor);
    exigir(["Borrador", "Pendiente de aprobación", "Aprobado"].includes(p.estado) && !p.entregas.length && !p.facturas.length, "No se puede bloquear un pedido atendido, facturado o anulado.");
    exigir(!puertos?.consultarSeguimiento(p.id).salidas?.length, "Logística ya registró una salida; consulta el seguimiento antes de bloquear.");
    const razon = motivoValido(motivo);
    p.estado = "Bloqueado"; p.historial.push(evento(actor, `Bloqueo manual: ${razon}`));
  }

  function cantidadesAtendidas(pedido) {
    return Object.fromEntries(pedido.lineas.map(l => [l.codigo, (pedido.entregas || []).reduce((s, e) => s + e.lineas.filter(el => el.codigo === l.codigo).reduce((n, el) => n + el.cantidad, 0), 0)]));
  }

  function sincronizarPedido(datos, id, actor, puertos) {
    comercial(actor);
    const p = buscar(datos.pedidos, id, actor);
    exigir(["Aprobado", "Parcialmente atendido", "Atendido", "Facturado"].includes(p.estado), "Solo se consulta seguimiento de pedidos aprobados.");
    const respuesta = puertos.consultarSeguimiento(p.id);
    const entregas = copiar(p.entregas || []), facturas = copiar(p.facturas || []);
    for (const e of respuesta.entregas) {
      const anterior = entregas.find(registro => registro.id === e.id);
      if (anterior) {
        exigir(anterior.numero === e.numero && JSON.stringify(anterior.lineas) === JSON.stringify(e.lineas), "Una entrega ya registrada cambió; requiere revisión del área responsable.");
        continue;
      }
      exigir(e.id && e.numero && Array.isArray(e.lineas) && e.lineas.length > 0, "Respuesta de entrega incompleta.");
      exigir(new Set(e.lineas.map(l => l.codigo)).size === e.lineas.length, "La entrega repite productos.");
      const cantidades = cantidadesAtendidas({ ...p, entregas });
      exigir(e.lineas.every(l => p.lineas.some(pl => pl.codigo === l.codigo && Number.isInteger(l.cantidad) && l.cantidad > 0 && cantidades[l.codigo] + l.cantidad <= pl.cantidad)), "La entrega supera las cantidades pedidas o contiene productos ajenos.");
      entregas.push(copiar(e));
    }
    for (const f of respuesta.facturas) {
      const anterior = facturas.find(registro => registro.id === f.id);
      if (anterior) {
        exigir(anterior.numero === f.numero && anterior.total === f.total, "Una factura ya registrada cambió; requiere revisión del área responsable.");
        continue;
      }
      exigir(f.id && f.numero && Number.isSafeInteger(f.total) && f.total > 0, "Respuesta de facturación incompleta.");
      exigir(facturas.reduce((s, anterior) => s + anterior.total, 0) + f.total <= p.total, "La facturación informada supera el pedido.");
      facturas.push(copiar(f));
    }
    const cambio = entregas.length !== p.entregas.length || facturas.length !== p.facturas.length;
    p.entregas = entregas; p.facturas = facturas; p.consultadoEn = respuesta.consultadoEn;
    const cantidades = cantidadesAtendidas(p);
    const completo = p.lineas.every(l => cantidades[l.codigo] === l.cantidad);
    p.estado = completo && facturas.reduce((s, f) => s + f.total, 0) === p.total ? "Facturado" : completo ? "Atendido" : entregas.length ? "Parcialmente atendido" : "Aprobado";
    if (cambio) p.historial.push(evento(actor, "Seguimiento actualizado desde Despachos y Facturación"));
    return p;
  }

  function crearSolicitud(datos, entrada, actor) {
    comercial(actor);
    const p = buscar(datos.pedidos, entrada.pedidoId, actor);
    exigir(!datos.solicitudes.some(s => s.pedidoId === p.id && s.tipo === entrada.tipo && s.estado === "Pendiente"), "Ya hay una solicitud pendiente de este tipo.");
    exigir(p.estado !== "Anulado", "El pedido está anulado.");
    exigir(["Anulación", "Devolución"].includes(entrada.tipo), "Tipo de solicitud no válido.");
    let lineas = [];
    if (entrada.tipo === "Anulación") exigir(!p.entregas.length && !p.facturas.length, "Un pedido atendido o facturado requiere devolución, no anulación directa.");
    else {
      const atendidas = cantidadesAtendidas(p);
      lineas = (entrada.lineas || []).filter(l => l.cantidad > 0);
      exigir(lineas.length && new Set(lineas.map(l => l.codigo)).size === lineas.length, "Selecciona cantidades a devolver sin repetir productos.");
      for (const l of lineas) {
        const solicitadas = datos.solicitudes.filter(s => s.pedidoId === p.id && s.tipo === "Devolución" && ["Pendiente", "Autorizada", "Completada"].includes(s.estado)).flatMap(s => s.lineas).filter(sl => sl.codigo === l.codigo).reduce((n, sl) => n + sl.cantidad, 0);
        exigir(Number.isInteger(l.cantidad) && l.cantidad > 0 && atendidas[l.codigo] - solicitadas >= l.cantidad, "La devolución supera la cantidad entregada disponible.");
      }
    }
    const solicitud = { id: crypto.randomUUID(), numero: numero(datos.solicitudes, "SOL"), pedidoId: p.id, pedidoNumero: p.numero, tipo: entrada.tipo, motivo: motivoValido(entrada.motivo), sede: p.sede, cliente: copiar(p.cliente), registradoPor: actor.nombre, estado: "Pendiente", lineas: copiar(lineas), historial: [evento(actor, `Solicitud de ${entrada.tipo.toLocaleLowerCase("es")}`)] };
    datos.solicitudes.push(solicitud); p.historial.push(evento(actor, `Solicitud derivada ${solicitud.numero}`));
    return solicitud;
  }

  function resolverSolicitud(datos, id, aceptar, motivo, actor, puertos) {
    jefatura(actor);
    const s = buscar(datos.solicitudes, id, actor);
    otroResponsable(actor, s.registradoPor); exigir(s.estado === "Pendiente", "La solicitud ya está resuelta.");
    const razon = motivoValido(motivo), p = buscar(datos.pedidos, s.pedidoId, actor);
    if (aceptar && s.tipo === "Anulación") {
      const externos = puertos.consultarSeguimiento(p.id);
      exigir(!p.entregas.length && !p.facturas.length && !externos.entregas.length && !externos.facturas.length && !externos.salidas?.length, "Hay entregas, salidas o facturas; se requiere devolución y documentos de ajuste.");
      exigir(p.estado !== "Anulado", "El pedido ya está anulado.");
      p.estado = "Anulado"; p.historial.push(evento(actor, `Anulación autorizada por ${s.numero}: ${razon}`));
    }
    s.estado = aceptar ? "Autorizada" : "Rechazada";
    s.resueltoPor = actor.nombre; s.historial.push(evento(actor, `${s.estado}: ${razon}`));
  }

  function seguirDevolucion(datos, id, actor, puertos) {
    comercial(actor);
    const s = buscar(datos.solicitudes, id, actor);
    exigir(s.tipo === "Devolución" && s.estado === "Autorizada", "Solo se consulta una devolución autorizada.");
    const respuesta = puertos.consultarDevolucion(id);
    s.seguimiento = respuesta;
    if ([respuesta.recepcion, respuesta.notaCredito, respuesta.ajusteFinanciero].every(referenciaValida)) {
      s.estado = "Completada"; s.historial.push(evento(actor, "Recepción, nota de crédito y ajuste financiero informados por sus módulos"));
    }
  }

  function validarMaestro(datos, tipo, valor, id) {
    if (tipo === "cliente") {
      exigir(valor.nombre?.trim() && valor.direccion?.trim(), "Completa nombre y dirección.");
      exigir(["Retail", "Empresa"].includes(valor.segmento), "Segmento no válido.");
      exigir(valor.tipoDocumento === "DNI" ? /^[0-9]{8}$/.test(valor.documento) : valor.tipoDocumento === "RUC" && /^[0-9]{11}$/.test(valor.documento), "Formato de documento no válido.");
      exigir(!datos.clientes.some(c => c.id !== id && c.tipoDocumento === valor.tipoDocumento && c.documento === valor.documento), "Ya existe un cliente con ese documento.");
    } else if (tipo === "producto") {
      const anterior = datos.productos.find(p => p.id === id);
      exigir(!anterior || anterior.codigo === valor.codigo, "El código de un producto existente no puede cambiar.");
      exigir(/^[A-Z0-9-]{3,20}$/.test(valor.codigo) && valor.nombre?.trim() && valor.unidad?.trim() && valor.familia?.trim(), "Completa código, producto, familia y unidad.");
      exigir(Number.isSafeInteger(valor.coste) && valor.coste >= 0, "Coste no válido.");
      exigir(!datos.productos.some(p => p.id !== id && p.codigo === valor.codigo), "El código de producto ya existe.");
    } else if (tipo === "lista") {
      exigir(valor.nombre?.trim() && ["Tienda", "Web", "Teléfono"].includes(valor.canal) && ["Retail", "Empresa"].includes(valor.segmento), "Completa nombre, canal y segmento.");
      exigir(/^\d{4}-\d{2}-\d{2}$/.test(valor.desde) && valor.desde <= valor.hasta && valor.moneda === "PEN", "Fechas o moneda de lista no válidas.");
      exigir(Object.values(valor.precios).length && Object.values(valor.precios).every(p => Number.isSafeInteger(p) && p > 0), "Los precios deben ser mayores que cero.");
      exigir(!valor.activa || !datos.listasPrecio.some(l => l.id !== id && aprobado(l) && l.activa && l.canal === valor.canal && l.segmento === valor.segmento && l.desde <= valor.hasta && valor.desde <= l.hasta), "La lista se solapa con otra vigente del mismo canal y segmento.");
    } else if (tipo === "promocion") {
      exigir(valor.nombre?.trim() && ["Tienda", "Web", "Teléfono"].includes(valor.canal) && ["Retail", "Empresa"].includes(valor.segmento), "Completa nombre, canal y segmento.");
      exigir(valor.desde <= valor.hasta && Number.isInteger(valor.descuentoBps) && valor.descuentoBps > 0 && valor.descuentoBps <= 500, "La promoción debe tener vigencia y descuento de hasta 5 %.");
    } else exigir(false, "Tipo de maestro no válido.");
  }

  function solicitarMaestro(datos, tipo, valor, id, actor) {
    comercial(actor); if (tipo !== "cliente") jefatura(actor);
    validarMaestro(datos, tipo, valor, id);
    exigir(!datos.solicitudesMaestro.some(s => s.tipo === tipo && s.objetivoId === id && id && s.estado === "Pendiente"), "Ya hay un cambio pendiente para este registro.");
    const objetivoId = id || crypto.randomUUID();
    const solicitud = { id: crypto.randomUUID(), tipo, objetivoId, datos: copiar(valor), registradoPor: actor.nombre, sede: actor.sede, estado: "Pendiente", historial: [evento(actor, `Solicitud de ${id ? "actualización" : "alta"} de ${tipo}`)] };
    datos.solicitudesMaestro.push(solicitud);
    if (tipo === "cliente" && !id) datos.clientes.push({ ...copiar(valor), id: objetivoId, estado: "Pendiente", historial: copiar(solicitud.historial) });
    return solicitud;
  }

  function resolverMaestro(datos, id, aceptar, motivo, actor) {
    jefatura(actor);
    const s = datos.solicitudesMaestro.find(solicitud => solicitud.id === id);
    exigir(s && s.estado === "Pendiente", "La solicitud ya fue resuelta o no existe.");
    otroResponsable(actor, s.registradoPor); const razon = motivoValido(motivo);
    const colecciones = { cliente: "clientes", producto: "productos", lista: "listasPrecio", promocion: "promociones" };
    const coleccion = datos[colecciones[s.tipo]], indice = coleccion.findIndex(d => d.id === s.objetivoId);
    if (aceptar) {
      validarMaestro(datos, s.tipo, s.datos, s.objetivoId);
      const actualizado = { ...copiar(s.datos), id: s.objetivoId, estado: "Aprobado", historial: [...(indice >= 0 ? coleccion[indice].historial || [] : []), evento(actor, `Maestro aprobado: ${razon}`)] };
      if (indice >= 0) coleccion[indice] = actualizado; else coleccion.push(actualizado);
    } else if (s.tipo === "cliente" && indice >= 0 && coleccion[indice].estado === "Pendiente") coleccion[indice].estado = "Rechazado";
    s.estado = aceptar ? "Aprobada" : "Rechazada"; s.historial.push(evento(actor, `${s.estado}: ${razon}`));
  }

  return { prepararDatos, listaVigente, calcular, crearCotizacion, resolverDescuento, cambiarCotizacion, crearPedido, validarPedido, aprobarPedido, bloquearPedido, cantidadesAtendidas, sincronizarPedido, crearSolicitud, resolverSolicitud, seguirDevolucion, solicitarMaestro, resolverMaestro, evento, motivoValido, numero, aprobado, referenciaValida };
})();
