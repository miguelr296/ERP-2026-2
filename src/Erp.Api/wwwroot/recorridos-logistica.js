"use strict";

window.RecorridosLogistica = ({ c, C, e, accion, enlace, compra, almacen, transporte, jefatura }) => {
  const ordenVigente = o => !["Anulada", "Rechazada"].includes(o.estado);
  const emitida = o => ["Emitida", "Confirmada", "Parcialmente recibida", "Recibida"].includes(o.estado);
  const pendiente = () => ({ titulo: "Revisión pendiente", detalle: "Una persona de Jefatura debe revisar este documento antes de que el proceso pueda continuar." });
  const rol = (titulo, responsable, tarea) => ({ titulo, detalle: responsable + " " + tarea });
  const control = (titulo, detalle, comando, id) => ({ titulo, detalle, comando, boton: accion(titulo, comando, id, "boton primario") });
  const abrir = (titulo, detalle, vista, documento) => ({ titulo, detalle, boton: enlace(titulo, vista + (documento ? "/" + documento.id : "")) });
  const finanzas = (titulo, detalle, ruta) => ({
    titulo, detalle,
    boton: window.Permisos.tieneRol(c.sesion, ["Jefatura", "Tesorería"]) ? `<a href="#finanzas/${ruta}" class="boton primario">${e(titulo)}</a>` : ""
  });
  const ordenDe = (d, solicitudId) => d.ordenes.find(o => o.requisicionId === solicitudId && ordenVigente(o));
  const cantidadPorRecibir = (d, o) => o.lineas.some(l => C.recibido(d, o.id, l.codigo) < l.cantidad);
  const porFacturar = (d, o, conformes = false) => {
    const verificadas = d.facturas.filter(f => f.ordenId === o.id && f.estado === "Verificada").flatMap(f => f.lineas);
    return o.lineas.map(l => {
      const facturadas = verificadas.filter(v => v.codigo === l.codigo).reduce((n, v) => n + v.cantidad, 0);
      const cantidad = (conformes ? C.recibido(d, o.id, l.codigo, true) : l.cantidad) - facturadas;
      return { ...l, cantidad };
    }).filter(l => l.cantidad > 0);
  };
  const proveedoresPendientes = (d, peticion) => peticion.proveedores.filter(id => d.proveedores.some(p => p.id === id && p.estado === "Aprobado") &&
    !d.ofertas.some(o => o.peticionId === peticion.id && o.proveedorId === id));
  const reservadoSinPreparar = (d, reserva) => {
    const cantidades = new Map();
    for (const l of reserva.lineas) cantidades.set(l.codigo, (cantidades.get(l.codigo) || 0) + l.cantidad - l.consumida - l.liberada);
    for (const p of d.picking.filter(p => p.reservaId === reserva.id && !["Despachado", "Anulado"].includes(p.estado))) {
      for (const l of p.lineas) cantidades.set(l.codigo, (cantidades.get(l.codigo) || 0) - l.cantidad);
    }
    return [...cantidades].filter(([, cantidad]) => cantidad > 0).map(([codigo, cantidad]) => ({ codigo, cantidad }));
  };

  function solicitud(d, r) {
    if (r.estado === "Pendiente") return jefatura() ? control("Aprobar solicitud de pedido", "Revisa los productos, cantidades y fecha requerida.", "aprobar-requisicion", r.id) : pendiente();
    if (r.estado !== "Aprobada") return null;
    if (!compra()) return rol("Gestionar el abastecimiento", "Compras", "continúa con las ofertas o el acuerdo marco.");
    const orden = ordenDe(d, r.id);
    if (orden) return abrir("Ver orden de compra", "Esta solicitud ya tiene una orden asociada.", "ordenes", orden);
    const peticion = d.peticionesOferta.find(p => p.requisicionId === r.id && p.estado !== "Anulada");
    if (peticion) return abrir("Ver petición de ofertas", "Continúa con la petición ya creada para esta solicitud.", "peticionesOferta", peticion);
    return control("Pedir ofertas", "Elige a los proveedores que enviarán sus precios y condiciones.", "peticion", r.id);
  }

  function peticion(d, r) {
    if (r.estado === "Adjudicada" && r.ofertaId) {
      const oferta = d.ofertas.find(o => o.id === r.ofertaId);
      return abrir("Ver oferta adjudicada", "La oferta seleccionada es el origen de la orden de compra.", "ofertas", oferta);
    }
    if (r.estado !== "Abierta") return null;
    const ofertas = d.ofertas.filter(o => o.peticionId === r.id && o.estado === "Recibida");
    if (compra() && proveedoresPendientes(d, r).length) {
      return control("Registrar oferta", "Elige un proveedor pendiente de esta petición e ingresa su precio.", "oferta", r.id);
    }
    if (ofertas.length) return { titulo: "Comparar y adjudicar", detalle: "Abre una oferta de esta petición para comparar precio, plazo y calidad antes de adjudicar.", boton: ofertas.map(o => enlace(o.numero, "ofertas/" + o.id)).join("") };
    return rol("Esperar una oferta", "Compras", "registra las condiciones cuando reciba la respuesta del proveedor.");
  }

  function oferta(d, r) {
    if (r.estado === "Recibida" && r.vigenteHasta >= c.fechaHoy()) {
      return jefatura() ? control("Adjudicar proveedor", "Contrasta precio, plazo y calidad con las otras ofertas de la petición.", "adjudicar", r.id) : pendiente();
    }
    if (r.estado !== "Seleccionada") return null;
    const pedido = d.peticionesOferta.find(p => p.id === r.peticionId);
    const orden = ordenDe(d, pedido?.requisicionId);
    if (orden) return abrir("Ver orden de compra", "La orden ya fue preparada para esta necesidad.", "ordenes", orden);
    if (r.vigenteHasta < c.fechaHoy()) return rol("Revisar la vigencia", "Compras", "debe confirmar una alternativa porque la oferta seleccionada venció.");
    return compra() ? control("Preparar orden de compra", "La oferta ya está seleccionada. Confirma la fecha prevista de entrega.", "orden", "oferta|" + r.id) : rol("Preparar la orden", "Compras", "crea la orden desde esta oferta adjudicada.");
  }

  function orden(d, r) {
    if (r.estado === "Pendiente") return jefatura() ? control("Aprobar orden", "Confirma proveedor, cantidades e importes de la compra.", "aprobar-orden", r.id) : pendiente();
    if (r.estado === "Aprobada") return compra() ? control("Marcar emitida", "Registra la emisión de la orden al proveedor.", "emitir-orden", r.id) : rol("Emitir la orden", "Compras", "marca la emisión al proveedor.");
    if (r.estado === "Emitida") return compra() ? control("Confirmación del proveedor", "Registra la referencia con la que el proveedor confirmó.", "confirmar-orden", r.id) : recibir(d, r);
    if (emitida(r)) return recibir(d, r);
    return null;
  }

  function recibir(d, orden) {
    const porInspeccionar = d.recepciones.find(r => r.ordenId === orden.id && r.lineas.some(l => C.pendienteInspeccion(l) > 0));
    if (porInspeccionar && almacen()) return abrir("Abrir recepción por inspeccionar", "Ya ingresaron unidades que esperan revisión física.", "recepciones", porInspeccionar);
    if (cantidadPorRecibir(d, orden)) {
      return almacen() ? control("Crear orden de ingreso", "Registra lo que llegó y luego inspecciona el lote.", "recepcion", orden.id) : rol("Recibir la mercadería", "Almacén", "registra las cantidades que llegaron e inspecciona el lote.");
    }
    if (porInspeccionar) return rol("Inspeccionar lo recibido", "Almacén", "registra las unidades conformes antes del cotejo.");
    return cotejar(d, orden);
  }

  function cotejar(d, o) {
    const observada = d.facturas.find(f => f.ordenId === o.id && f.estado === "Observada");
    if (observada && compra()) return abrir("Abrir factura observada", "Revisa las diferencias del cotejo y revalida si ya se resolvieron.", "facturas", observada);
    if (porFacturar(d, o, true).length) {
      return compra() ? control("Verificar factura", "Coteja la factura del proveedor con la orden y la recepción conforme.", "factura", o.id) : rol("Entregar la factura para cotejo", "Compras", "verifica el documento contra la recepción conforme.");
    }
    const verificada = d.facturas.find(f => f.ordenId === o.id && f.estado === "Verificada");
    if (verificada && compra()) return abrir("Ver factura verificada", "Consulta el cotejo antes de continuar en Finanzas.", "facturas", verificada);
    return { titulo: "Revisar la recepción conforme", detalle: "Puedes cotejar la factura cuando queden unidades conformes por facturar." };
  }

  function recepcion(d, r) {
    if (r.lineas.some(l => C.pendienteInspeccion(l) > 0)) {
      return almacen() ? control("Registrar inspección", "Indica las unidades conformes, observadas y pendientes.", "inspeccion", r.id) : rol("Inspeccionar el ingreso", "Almacén", "registra el resultado de la revisión física.");
    }
    if (r.lineas.some(l => l.noConforme > 0)) return { titulo: "Resolver las unidades observadas", detalle: "En Otras acciones puedes devolverlas al proveedor o solicitar un tratamiento." };
    const o = d.ordenes.find(o => o.id === r.ordenId);
    return o ? cotejar(d, o) : null;
  }

  function factura(d, r) {
    if (r.estado === "Verificada") return finanzas("Ir a Por pagar", "Finanzas incorpora la factura verificada para programar y confirmar el pago.", "pagar");
    if (r.estado === "Observada" && compra()) return control("Revalidar cotejo", "Consulta las diferencias en esta ficha. Revalida cuando se hayan corregido o ya exista recepción conforme.", "revalidar-factura", r.id);
    return null;
  }

  function reserva(d, r) {
    const lista = d.picking.filter(p => p.reservaId === r.id && p.estado !== "Anulado");
    if (almacen() && r.estado === "Activa" && reservadoSinPreparar(d, r).length) return control("Generar picking", "La reserva ya tiene unidades listas para asignar a la preparación.", "picking", r.id);
    if (lista.length && almacen()) return abrir("Abrir picking", "Continúa con la preparación ya creada para esta reserva.", "picking", lista.at(-1));
    return null;
  }

  function picking(d, r) {
    if (!almacen()) return null;
    if (r.estado === "Pendiente") return control("Confirmar preparación", "Recoge y revisa las unidades indicadas en el picking.", "preparar-picking", r.id);
    if (r.estado === "Preparado") return control("Confirmar embalaje", "Comprueba que las unidades estén protegidas para el transporte.", "embalar-picking", r.id);
    const despacho = d.despachos.find(x => x.pickingId === r.id);
    if (despacho) return abrir("Ver orden de salida", "La orden de salida ya se creó desde este picking.", "despachos", despacho);
    if (r.estado === "Embalado") return control("Crear orden de salida", "El picking ya está embalado. Completa los datos del vehículo y del conductor.", "despacho", r.id);
    return null;
  }

  function despacho(d, r) {
    if (r.estado === "Preparado") return transporte() ? control("Confirmar salida a ruta", "Úsalo cuando el vehículo salga hacia el cliente.", "ruta", r.id) : rol("Iniciar la ruta", "Transporte", "confirma la salida a ruta.");
    if (r.estado === "En ruta") return transporte() ? control("Confirmar entrega", "Ingresa las unidades que recibió el cliente y la constancia.", "entrega", r.id) : rol("Registrar la entrega", "Transporte", "confirma el resultado de la entrega.");
    const retorno = d.retornos.find(x => x.despachoId === r.id && x.estado === "Pendiente");
    if (retorno && almacen()) return abrir("Abrir retorno pendiente", "Las unidades pendientes se registran cuando regresen físicamente.", "retornos", retorno);
    if (r.estado === "Entregado") return {
      titulo: "Consultar Facturación", detalle: "Cuando todas las unidades del pedido están entregadas, Facturación puede emitir el comprobante interno.",
      boton: window.Permisos.tieneRol(c.sesion, ["Facturación", "Jefatura"])
        ? '<a href="#facturacion/comprobantes" class="boton primario">Abrir Facturación</a>' : ""
    };
    return null;
  }

  const pasos = { requisiciones: solicitud, peticionesOferta: peticion, ofertas: oferta, ordenes: orden, recepciones: recepcion,
    facturas: factura, reservas: reserva, picking, despachos: despacho };
  return { siguiente: (vista, d, r) => pasos[vista]?.(d, r) || undefined, cantidadPorRecibir, porFacturar, proveedoresPendientes, reservadoSinPreparar };
};
