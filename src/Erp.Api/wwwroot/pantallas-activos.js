"use strict";

window.PantallasActivos = c => {
  const A = window.ActivosAplicacion, R = window.ActivosReglas, P = window.ActivosPatrimonio, L = window.LogisticaReglas;
  const { config } = R, e = c.esc;
  const actor = () => c.sesion;
  const rol = (...roles) => roles.includes(actor()?.rol);
  const hoy = () => c.fechaHoy();
  const mesAnterior = () => R.desplazarPeriodo(R.periodo(hoy()), -1);
  const secciones = {
    resumen: ["Inicio", R.roles],
    solicitudes: ["Adquisiciones", ["Asesor", "Jefatura", "Compras", "Almacén", "Contabilidad"]],
    activos: ["Activos", ["Jefatura", "Almacén", "Contabilidad"]],
    depreciacion: ["Depreciación", ["Contabilidad", "Jefatura"]],
    movimientos: ["Movimientos", ["Almacén", "Jefatura", "Contabilidad"]],
    conteos: ["Inventario físico", ["Almacén", "Jefatura", "Contabilidad"]],
    asientos: ["Diario patrimonial", ["Contabilidad", "Jefatura"]],
    conciliaciones: ["Conciliación y cierres", ["Contabilidad", "Jefatura"]],
    pagos: ["Pagos", ["Tesorería", "Jefatura"]]
  };
  const accesos = {
    compras: ["solicitudes", "Compras de activos fijos", ["Compras", "Jefatura"]],
    logistica: ["solicitudes", "Recepción de activos fijos", ["Almacén", "Jefatura"]],
    contabilidad: ["asientos", "Diario patrimonial", ["Contabilidad"]],
    finanzas: ["pagos", "Pagos patrimoniales", ["Tesorería"]]
  };
  const propias = lista => lista.filter(r => r.sede === actor().sede);
  const enlace = (nombre, ruta, clase = "enlace-boton") => `<a class="${clase}" href="#activos/${e(ruta)}">${e(nombre)}</a>`;
  const acceso = modulo => accesos[modulo] && rol(...accesos[modulo][2]) ? `<a class="boton" href="#${modulo}/activos">${accesos[modulo][1]}</a>` : "";
  const boton = (nombre, accion, id = "", extra = "") => `<button type="button" class="boton ${extra}" data-af-accion="${accion}" data-id="${e(id)}">${e(nombre)}</button>`;
  const cabecera = (titulo, descripcion = "", botones = "") => `<div class="encabezado-vista"><div><p class="ceja">ACTIVOS FIJOS / ${e(c.sedeNombre(actor().sede))}</p><h1>${e(titulo)}</h1>${descripcion ? `<p>${e(descripcion)}</p>` : ""}</div>${botones ? `<div class="acciones-documento">${botones}</div>` : ""}</div>`;
  const estado = valor => `<span class="etiqueta ${["Aprobada", "Conforme", "Verificada", "En servicio", "Conciliada", "Aplicada", "Completada", "Pagada", "Revisado"].includes(valor) ? "verde" : ["Observada", "Rechazada", "Con diferencias", "De baja", "No encontrado"].includes(valor) ? "roja" : "naranja"}">${e(valor)}</span>`;
  const dinero = centimos => c.moneda(centimos);
  const celda = contenido => `<td>${contenido}</td>`;
  const fila = (...elementos) => `<tr>${elementos.map(celda).join("")}</tr>`;
  const detalle = pares => `<dl class="detalle-documento">${pares.map(([clave, valor]) => `<div><dt>${clave}</dt><dd>${valor}</dd></div>`).join("")}</dl>`;
  const ficha = (titulo, html) => `<section class="tarjeta ficha-completa ficha af-ficha"><h2>${e(titulo)}</h2>${html}</section>`;
  const metricas = pares => `<div class="indicadores">${pares.map(([titulo, valor]) => `<div class="tarjeta indicador"><small>${titulo}</small><strong>${valor}</strong></div>`).join("")}</div>`;
  const campo = (nombre, id, html) => `<div><label for="af-${id}">${nombre}</label>${html}</div>`;
  const input = (nombre, id, props = "required", valor = "") => campo(nombre, id, `<input id="af-${id}" name="${id}" value="${e(valor)}" ${props}>`);
  const moneda = (nombre, id, valor = "") => input(nombre, id, 'type="number" min="0" max="100000000" step="0.01" required', valor);
  const numero = (nombre, id, props = "", valor = "") => input(nombre, id, `type="number" min="0" step="1" ${props}`, valor);
  const fecha = (nombre, id = "fecha", valor = hoy()) => input(nombre, id, 'type="date" required', valor);
  const seleccionar = (nombre, id, opciones, elegido = "", extra = "required") => campo(nombre, id, `<select id="af-${id}" name="${id}" ${extra}>${opciones.map(([valor, titulo]) => `<option value="${e(valor)}"${valor === elegido ? " selected" : ""}>${e(titulo)}</option>`).join("")}</select>`);
  const opciones = (nombre, id, valores, elegido) => seleccionar(nombre, id, valores.map(v => [v, v]), elegido);
  const motivo = (titulo = "Motivo / evidencia") => campo(titulo, "motivo", '<textarea id="af-motivo" name="motivo" minlength="3" maxlength="500" required></textarea>');
  const grupo = html => `<div class="campos">${html}</div>`;
  const valor = (f, k) => f.get(k) || "";
  const entero = (f, k) => valor(f, k) === "" ? NaN : Number(f.get(k));
  const importe = (f, k) => valor(f, k) === "" ? NaN : Math.round(Number(f.get(k)) * 100);
  const form = (titulo, html, comando, destino) => c.formulario(titulo, html, f => {
    const registro = A.ejecutar(actor(), d => comando(d, f));
    return "activos/" + destino(registro);
  });

  function dibujar(modulo, partes) {
    const vista = modulo === "activos" ? Object.hasOwn(secciones, partes[1]) ? partes[1] : "resumen" : accesos[modulo][0];
    const nav = c.$("#navegacion"), contenido = c.$("#contenido");
    c.$("#accesos-rapidos").hidden = true;
    document.title = "Activos Fijos · FAMIHOGAR";
    nav.setAttribute("aria-label", "Secciones de Activos Fijos");
    nav.innerHTML = Object.entries(secciones).filter(([, [, roles]]) => rol(...roles)).map(([id, [nombre]]) => `<button type="button" data-af-vista="${id}" ${id === vista ? 'aria-current="page"' : ""}>${nombre}</button>`).join("");
    try {
      L.exigir(rol(...secciones[vista][1]), "Esta sección no tiene operaciones para tu rol.");
      const d = A.leer(), id = partes[2];
      const pantallas = {
        resumen: () => resumen(d),
        solicitudes: () => id ? fichaSolicitud(d, id) : solicitudes(d),
        activos: () => id ? fichaActivo(d, id) : activos(d),
        depreciacion: () => depreciacion(d),
        movimientos: () => movimientos(d, id),
        conteos: () => conteos(d, id),
        asientos: () => asientos(d, id),
        conciliaciones: () => conciliaciones(d, id),
        pagos: () => pagos(d)
      };
      contenido.innerHTML = pantallas[vista]();
      if (vista === "activos" && id) prepararImpresion();
    } catch (error) {
      contenido.innerHTML = cabecera("Activos Fijos") + `<p class="tarjeta vacio error">${e(error.message)}</p><a class="boton" href="#aplicaciones">Volver a aplicaciones</a>`;
    }
    contenido.focus();
  }

  function resumen(d) {
    const indicadores = [];
    const fechaActual = hoy();
    if (rol("Jefatura", "Almacén", "Contabilidad")) {
      const r = P.resumen(d, actor().sede);
      const diferencias = propias(d.conteos).filter(x => x.resultado !== "Conforme" && x.estado !== "Revisado").length;
      const ordenes = propias(d.movimientos).filter(m => m.tipo === "Mantenimiento" && m.programada <= fechaActual && ["Programada", "En ejecución", "Completada"].includes(m.estado));
      const aTiempo = ordenes.filter(m => m.estado === "Completada" && m.fecha <= m.programada).length;
      indicadores.push(["Activos en servicio", r.activos], ["Valor neto contable", dinero(r.neto)], ["Depreciación acumulada", dinero(r.acumulada)], ["Bajas", r.bajas],
        ["Diferencias físicas por revisar", diferencias], ["Mantenimientos a tiempo", ordenes.length ? `${aTiempo} / ${ordenes.length}` : "Sin vencimientos"]);
      const enServicio = propias(d.activos).filter(a => a.estado === "En servicio");
      const criticos = enServicio.filter(a => a.critico);
      const enTaller = new Set(propias(d.movimientos).filter(m => m.estado === "En ejecución").map(m => m.activoId));
      const sumarMeses = (total, a) => total + (Number(fechaActual.slice(0, 4)) - Number(a.fecha.slice(0, 4))) * 12 +
        Number(fechaActual.slice(5, 7)) - Number(a.fecha.slice(5, 7)) - (fechaActual.slice(8) < a.fecha.slice(8) ? 1 : 0);
      const formato = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 });
      indicadores.push(["Depreciación sobre costo", r.costo ? `${formato.format(r.acumulada * 100 / r.costo)} %` : "—"],
        ["Activos críticos disponibles", criticos.length ? `${criticos.filter(a => !enTaller.has(a.id)).length} / ${criticos.length}` : "—"],
        ["Antigüedad promedio", enServicio.length ? `${formato.format(enServicio.reduce(sumarMeses, 0) / enServicio.length)} meses` : "—"]);
    }
    if (rol("Tesorería")) indicadores.push(["Pagos pendientes", R.obligaciones(d, actor().sede).filter(x => !x.pago).length]);
    return cabecera("Panel patrimonial") + (indicadores.length ? metricas(indicadores) : "") +
      `<div class="grupos">${Object.entries(secciones).filter(([id, [, roles]]) => id !== "resumen" && rol(...roles)).map(([id, [nombre]]) => `<section class="tarjeta grupo"><button type="button" data-af-vista="${id}">${nombre}<span aria-hidden="true">→</span></button></section>`).join("")}</div>`;
  }

  function adquisicion(d, s) {
    const o = d.ordenes.find(o => o.solicitudId === s.id);
    const recepciones = d.recepciones.filter(r => r.ordenId === o?.id);
    const r = recepciones.find(r => r.estado === "Conforme");
    const f = d.facturas.find(f => f.ordenId === o?.id);
    const a = d.activos.find(a => a.facturaId === f?.id);
    return { o, recepciones, r, f, a };
  }

  function solicitudes(d) {
    const lista = propias(d.solicitudes).filter(s => !rol("Asesor") || s.registradoPor === actor().nombre);
    const nuevo = rol("Asesor", "Jefatura", "Compras", "Almacén") ? boton("+ Solicitar inversión", "solicitar", "", "primario") : "";
    return cabecera("Adquisiciones", "Inversiones, órdenes, recepciones y facturas de bienes para uso interno.", nuevo) +
      c.tabla("Solicitudes de inversión", ["Solicitud", "Bien", "Presupuesto", "Etapa"], [...lista].reverse().map(s => {
        const { o, recepciones, r, f, a } = adquisicion(d, s);
        const etapa = a ? "Capitalizada" : f ? "Factura verificada" : r ? "Recepción conforme" : recepciones.length ? "Recepción observada" : o ? "OC emitida" : s.estado;
        return fila(enlace(s.numero, `solicitudes/${s.id}`), e(s.descripcion), dinero(s.presupuesto), estado(etapa));
      }));
  }

  function fichaSolicitud(d, id) {
    const s = L.obtener(d.solicitudes, id, actor()), { o, recepciones, r, f, a } = adquisicion(d, s);
    L.exigir(!rol("Asesor") || s.registradoPor === actor().nombre, "Solo puedes consultar tus propias solicitudes.");
    let botones = "";
    if (s.estado === "Pendiente" && rol("Jefatura")) botones = boton("Aprobar inversión", "aprobar", id, "primario") + boton("Rechazar", "rechazar", id);
    if (s.estado === "Aprobada" && !o && rol("Compras")) botones = boton("Emitir orden de compra", "orden", id, "primario");
    if (o && !r && rol("Almacén")) botones = boton("Registrar recepción", "recepcion", o.id, "primario");
    if (r && !f && rol("Compras")) botones = boton("Cotejar factura", "factura", r.id, "primario");
    if (f && !a && rol("Contabilidad")) {
      botones = boton("Capitalizar y poner en servicio", "capitalizar", f.id, "primario");
      if (!f.registroContable) botones += boton("Registrar adquisición en curso", "adquisicion-en-curso", f.id);
    }
    const orden = o ? detalle([["Orden", e(o.numero)], ["Proveedor", e(o.proveedor.nombre)], ["Entrega prevista", c.fechaCorta(o.entrega)],
      ["Bien", dinero(o.precio)], ["Costos directos", dinero(o.directos)], ["Detalle de costos directos", e(o.detalleDirectos || "—")]]) + c.mostrarHistorial(o.historial) : "";
    const recepcion = recepciones.map(rec => `<h3>${e(rec.numero)} · ${e(rec.documento)}</h3>` +
      detalle([["Fecha", c.fechaCorta(rec.fecha)], ["Serie", e(rec.serie)], ["Resultado", estado(rec.estado)], ["Evidencia", e(rec.evidencia)]]) + c.mostrarHistorial(rec.historial)).join("");
    const factura = f ? detalle([["Cotejo", e(f.numero)], ["Factura del proveedor", e(f.documento)], ["Fecha", c.fechaCorta(f.fecha)], ["Base", dinero(f.base)],
      ["IGV", dinero(f.igv)], ["IGV recuperable", f.recuperable ? "Sí" : "No"], ["Total", dinero(f.total)],
      ...(f.registroContable ? [["Registro en curso", c.fechaCorta(f.registroContable.fecha)]] : [])]) + c.mostrarHistorial(f.historial) : "";
    const refActivo = a && `<p>Activo ${a.sede === actor().sede && rol("Jefatura", "Almacén", "Contabilidad") ? enlace(a.numero, `activos/${a.id}`) : e(a.numero)}</p>`;
    return cabecera(s.numero, s.descripcion, enlace("← Adquisiciones", "solicitudes", "boton") + botones) + ficha("Solicitud de inversión",
      detalle([["Clase", e(s.clase)], ["Estado", estado(s.estado)], ["Centro de costo", e(s.centroCosto)], ["Fecha requerida", c.fechaCorta(s.requerida)], ["Presupuesto", dinero(s.presupuesto)], ["Motivo", e(s.motivo)]]) + c.mostrarHistorial(s.historial)) +
      (o ? ficha("Orden de compra", orden) : "") + (recepcion ? ficha("Recepciones", recepcion) : "") + (f ? ficha("Factura verificada", factura + (refActivo || "")) : "");
  }

  function activos(d) {
    const lista = propias(d.activos), r = P.resumen(d, actor().sede);
    return cabecera("Maestro de activos") + metricas([["Costo en servicio", dinero(r.costo)], ["Depreciación acumulada", dinero(r.acumulada)], ["Deterioro acumulado", dinero(r.deterioro)], ["Valor neto", dinero(r.neto)]]) +
      c.tabla("Activos por sede", ["Código", "Bien / serie", "Ubicación / custodio", "Estado", "Valor neto actual"], lista.map(a =>
        fila(enlace(a.numero, `activos/${a.id}`), `${e(a.descripcion)}<small>${e(a.serie)} · ${e(a.etiqueta)}</small>`, `${e(a.ubicacion)}<small>${e(a.custodio)}</small>`, estado(a.estado), dinero(a.estado === "En servicio" ? P.vistaLibro(a, "Contable").neto : 0))));
  }

  function fichaActivo(d, id) {
    const a = L.obtener(d.activos, id, actor());
    const f = d.facturas.find(f => f.id === a.facturaId), o = d.ordenes.find(o => o.id === f.ordenId), s = d.solicitudes.find(s => s.id === o.solicitudId);
    const disponibles = rol("Almacén", "Jefatura") ? ["Traslado", "Mantenimiento"] : ["Mejora", "Deterioro", "Venta", "Retiro"];
    const acciones = a.estado === "En servicio" ? disponibles.map(tipo => boton(tipo, `movimiento-${tipo}`, a.id)).join("") + (rol("Almacén") ? boton("Registrar conteo", "contar", a.id) : "") : "";
    const libros = c.tabla(a.estado === "En servicio" ? "Libros de depreciación" : "Saldos previos a la baja", ["Libro", "Método", "Plan remanente", "Residual", "Depreciación", "Deterioro", "Valor neto"], Object.entries(a.libros).map(([n, b]) => {
      const saldo = P.vistaLibro(a, n);
      const medida = b.metodo === "Unidades de producción" ? " unidades" : " meses";
      const tasa = b.tasa ? ` · ${b.tasa / 100} % anual` : "";
      return fila(e(n), e(b.metodo), `${b.plan.medida - b.plan.consumido}${medida}${tasa}`, dinero(b.residual), dinero(saldo.acumulada), dinero(saldo.deterioro), dinero(saldo.neto));
    }), false);
    const periodos = Object.values(a.libros).flatMap(l => l.depreciaciones).sort((x, y) => y.periodo.localeCompare(x.periodo));
    const referencias = [s.numero, o.numero, d.recepciones.find(r => r.id === f.recepcionId).numero, f.documento].join(" → ");
    const foto = a.foto ? `<a href="${e(a.foto)}" target="_blank" rel="noopener noreferrer">Ver foto del bien</a>` : "—";
    return cabecera(a.numero, a.descripcion, enlace("← Activos", "activos", "boton") + boton("Imprimir ficha", "imprimir")) +
      `<div id="af-ficha-imprimir">` + ficha("Datos patrimoniales", detalle([["Clase", e(a.clase)], ["Estado", estado(a.estado)], ["Etiqueta patrimonial", e(a.etiqueta)],
        ["Serie", e(a.serie)], ["Criticidad operativa", a.critico ? "Crítico" : "Estándar"], ["Sede", e(c.sedeNombre(a.sede))], ["Ubicación", e(a.ubicacion)], ["Custodio", e(a.custodio)], ["Centro de costo", e(a.centroCosto)], ["Foto", foto],
        ["Puesta en servicio", c.fechaCorta(a.fecha)], ["Primer mes depreciable", e(a.inicio)], ["Costo inicial", dinero(a.costoInicial)],
        ["Costo capitalizado", dinero(a.costo)], ["Moneda", e(a.moneda)], ["Origen de compra", s.sede === actor().sede ? enlace(referencias, `solicitudes/${s.id}`) : e(referencias)],
        ...(a.fechaBaja ? [["Fecha de baja", c.fechaCorta(a.fechaBaja)]] : [])]) + c.mostrarHistorial(a.historial)) + libros + "</div>" +
      (acciones ? `<div class="acciones-documento">${acciones}</div>` : "") +
      c.tabla("Historial de depreciación", ["Periodo", "Libro", "Unidades", "Cargo"], periodos.map(p => fila(e(p.periodo), e(p.libro), p.unidades ?? "—", dinero(p.importe))), false);
  }

  function prepararImpresion() {
    const impresion = c.$("#af-ficha-imprimir").cloneNode(true);
    impresion.removeAttribute("id");
    impresion.className = "vista-imprimir";
    impresion.querySelector("h2").textContent = `${c.$("#contenido h1").textContent} · ${c.$("#contenido .encabezado-vista h1 + p").textContent}`;
    impresion.querySelectorAll("a").forEach(a => a.replaceWith(document.createTextNode(a.textContent)));
    document.body.append(impresion);
    document.body.classList.add("imprimir-documento");
  }

  function depreciacion(d) {
    const libros = propias(d.activos).filter(a => a.estado === "En servicio").flatMap(a => Object.entries(a.libros).map(([n, b]) => ({ a, n, b })));
    return cabecera("Depreciación por libro", "Ejecuta meses completos en orden. Registra las unidades producidas desde la fila del libro.", rol("Contabilidad") ? boton("Ejecutar periodo automático", "periodo", "", "primario") : "") +
      c.tabla("Planes y cargos mensuales", ["Activo", "Libro", "Método", "Próximo periodo", "Acumulada", "Acción"], libros.map(({ a, n, b }) => {
        const p = P.siguiente(a, b), saldo = P.vistaLibro(a, n).neto > b.residual;
        const accion = saldo && p <= mesAnterior() && rol("Contabilidad") ? boton("Registrar cargo", `depreciar-${n}`, a.id) : "—";
        return fila(enlace(a.numero, `activos/${a.id}`), e(n), e(b.metodo), saldo ? e(p) : "Sin saldo depreciable", dinero(b.acumulada), accion);
      }));
  }

  function movimientos(d, id) {
    const lista = d.movimientos.filter(m => m.sede === actor().sede || m.estado === "Aplicada" && m.sedeDestino === actor().sede);
    if (!id) return cabecera("Movimientos y mantenimiento", "Las solicitudes se originan en la ficha del activo.") +
      c.tabla("Movimientos patrimoniales", ["Documento", "Activo", "Tipo", "Fecha", "Estado"], [...lista].reverse().map(m =>
        fila(enlace(m.numero, `movimientos/${m.id}`), e(d.activos.find(a => a.id === m.activoId)?.numero), e(m.tipo), c.fechaCorta(m.fecha || m.programada || m.solicitadoEn), estado(m.estado))));
    const m = lista.find(x => x.id === id);
    L.exigir(m, "Movimiento no encontrado en esta sede.");
    const a = d.activos.find(a => a.id === m.activoId);
    let acciones = "";
    if (m.estado === "Pendiente" && rol("Jefatura")) acciones = boton("Aprobar", "aprobar-movimiento", id, "primario") + boton("Rechazar", "rechazar-movimiento", id);
    if (m.estado === "Programada" && rol("Almacén")) acciones = boton("Iniciar mantenimiento", "iniciar-mantenimiento", id, "primario");
    if (["Programada", "En ejecución"].includes(m.estado)) {
      if (rol("Almacén")) acciones += boton("Completar mantenimiento", "completar-mantenimiento", id);
      if (rol("Jefatura")) acciones = boton("Cancelar mantenimiento", "cancelar-mantenimiento", id);
    }
    const campos = [["Activo", a.sede === actor().sede ? enlace(a.numero, `activos/${a.id}`) : e(a.numero)], ["Estado", estado(m.estado)], ["Motivo", e(m.motivo)], ["Fecha solicitada", c.fechaCorta(m.solicitadoEn)]];
    if (m.sedeDestino) campos.push(["Destino", e(c.sedeNombre(m.sedeDestino))], ["Custodio", e(m.custodio)], ["Ubicación", e(m.ubicacion)], ["Centro de costo", e(m.centroCosto)]);
    if (m.origen) campos.push(["Origen", e(c.sedeNombre(m.origen.sede))], ["Custodio anterior", e(m.origen.custodio)], ["Ubicación anterior", e(m.origen.ubicacion)]);
    if (m.programada) campos.push(["Tipo de mantenimiento", e(m.tipoMantenimiento)], ["Fecha programada", c.fechaCorta(m.programada)]);
    if (m.iniciada) campos.push(["Fecha de inicio", c.fechaCorta(m.iniciada)]);
    if (m.fecha) campos.push(["Fecha efectiva", c.fechaCorta(m.fecha)]);
    if (m.proveedor) campos.push(["Proveedor", e(m.proveedor.nombre)]);
    if (m.documento) campos.push(["Documento de sustento", e(m.documento)]);
    if (m.importe != null) campos.push(["Importe", dinero(m.importe)]);
    if (m.recuperable != null) campos.push(["Valor recuperable", dinero(m.recuperable)]);
    if (m.resultado != null) campos.push(["Valor en libros previo", dinero(m.valorEnLibros)], ["Resultado de baja", dinero(m.resultado)]);
    const asiento = propias(d.asientos).find(x => x.referenciaId === m.id);
    if (asiento && rol("Jefatura", "Contabilidad")) campos.push(["Asiento", enlace(asiento.numero, `asientos/${asiento.id}`)]);
    return cabecera(m.numero, m.tipo, enlace("← Movimientos", "movimientos", "boton") + acciones) + ficha("Detalle del movimiento", detalle(campos) + c.mostrarHistorial(m.historial));
  }

  function conteos(d, id) {
    if (!id) return cabecera("Inventario físico", "Compara etiqueta, serie, ubicación y custodio. El conteo se registra desde la ficha del bien.") +
      c.tabla("Verificaciones físicas", ["Conteo", "Etiqueta esperada", "Fecha", "Resultado", "Revisión"], [...propias(d.conteos)].reverse().map(r =>
        fila(enlace(r.numero, `conteos/${r.id}`), e(r.esperado.etiqueta), c.fechaCorta(r.fecha), estado(r.resultado), estado(r.estado))));
    const r = L.obtener(d.conteos, id, actor());
    const campos = [["Etiqueta", "etiqueta"], ["Serie", "serie"], ["Ubicación", "ubicacion"], ["Custodio", "custodio"]];
    const datos = campos.map(([n, k]) => fila(n, e(r.esperado[k]), e(r.observado?.[k] ?? "—")));
    return cabecera(r.numero, "Verificación física", enlace("← Inventario físico", "conteos", "boton") +
      (rol("Jefatura") && r.estado === "Pendiente de revisión" ? boton("Revisar conteo", "revisar-conteo", id, "primario") : "")) +
      ficha("Resultado", detalle([["Fecha", c.fechaCorta(r.fecha)], ["Resultado", estado(r.resultado)], ["Revisión", estado(r.estado)], ["Evidencia", e(r.evidencia)]]) + c.mostrarHistorial(r.historial)) +
      c.tabla("Datos contrastados", ["Dato", "Esperado", "Observado"], datos, false);
  }

  function asientos(d, id) {
    if (!id) return cabecera("Diario patrimonial", "Asientos del libro contable, generados por sede y periodo.") +
      c.tabla("Documentos contables", ["Asiento", "Evento", "Origen", "Periodo", "Total debe y haber"], [...propias(d.asientos)].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.numero.localeCompare(a.numero)).map(a =>
        fila(enlace(a.numero, `asientos/${a.id}`), e(a.tipo), e(a.referencia), e(a.periodo), dinero(a.lineas.reduce((n, l) => n + l.debe, 0)))));
    const a = L.obtener(d.asientos, id, actor()), activo = d.activos.find(x => x.id === a.activoId);
    return cabecera(a.numero, a.tipo, enlace("← Diario patrimonial", "asientos", "boton")) + ficha("Datos del asiento", detalle([
      ["Fecha", c.fechaCorta(a.fecha)], ["Periodo", e(a.periodo)], ["Documento origen", e(a.referencia)], ["Activo", activo?.sede === actor().sede ? enlace(activo.numero, `activos/${activo.id}`) : e(activo?.numero)], ["Moneda", e(a.moneda)]
    ])) + c.tabla("Partidas", ["Cuenta PCGE", "Debe", "Haber"], [...a.lineas.map(l => fila(e(l.cuenta), dinero(l.debe), dinero(l.haber))), fila("<strong>Total</strong>", dinero(a.lineas.reduce((n, l) => n + l.debe, 0)), dinero(a.lineas.reduce((n, l) => n + l.haber, 0)))], false);
  }

  function conciliaciones(d, id) {
    const r = id ? L.obtener(d.conciliaciones, id, actor()) : null;
    const diferencia = r ? detalle([["Referencia del mayor", e(r.documento)], ["Fecha", c.fechaCorta(r.fecha)], ["Auxiliar", dinero(r.saldoAuxiliar)], ["Mayor informado", dinero(r.saldoMayor)], ["Diferencia", dinero(r.diferencia)], ["Resultado", estado(r.estado)]]) : "";
    const encabezado = r ? cabecera(r.numero, "Conciliación registrada", enlace("← Conciliación y cierres", "conciliaciones", "boton")) :
      cabecera("Conciliación y cierres", "Contrasta el auxiliar y el diario de los activos de la sede con un saldo de mayor informado.", rol("Contabilidad") ? boton("Registrar conciliación", "conciliar", "", "primario") + boton("Cerrar periodo", "cerrar-periodo") : "");
    const lineas = (r?.lineas || P.verificarAuxiliar(d, actor().sede)).map(l => fila(e(l.numero), dinero(l.saldoAuxiliar), dinero(l.saldoDiario), dinero(l.diferencia), estado(l.componentesCoinciden ? "Conforme" : "Con diferencias")));
    return encabezado + (r ? ficha("Resultado de la comparación", diferencia) : "") + `<div class="af-tablas">` + c.tabla("Auxiliar y diario patrimonial", ["Activo", "Auxiliar neto", "Diario neto", "Diferencia", "Saldos por cuenta"], lineas, false) +
      (r ? "" : c.tabla("Conciliaciones registradas", ["Documento", "Mayor", "Fecha", "Resultado"], propias(d.conciliaciones).map(x => fila(enlace(x.numero, `conciliaciones/${x.id}`), e(x.documento), c.fechaCorta(x.fecha), estado(x.estado))), false) +
      c.tabla("Periodos cerrados", ["Documento", "Cierre hasta el periodo"], propias(d.cierres).map(x => fila(e(x.numero), e(x.periodo))), false)) + "</div>";
  }

  function pagos(d) {
    const lista = R.obligaciones(d, actor().sede);
    return cabecera("Pagos patrimoniales", "Obligaciones de compra, mejoras y gastos de mantenimiento.") +
      c.tabla("Obligaciones de la sede", ["Origen", "Proveedor", "Fecha", "Tipo", "Importe", "Pago"], lista.map(x => fila(e(x.referencia), e(x.proveedor?.nombre), c.fechaCorta(x.fecha), e(x.tipo), dinero(x.total),
        x.pago ? `${estado("Pagada")}<small>${e(x.pago.documento)} · ${c.fechaCorta(x.pago.fecha)}</small>` : rol("Tesorería") ? boton("Registrar pago", "pagar", x.asientoId) : estado("Pendiente"))));
  }

  function formularioSolicitud() {
    form("Solicitar inversión", grupo(input("Descripción del bien", "descripcion", "maxlength=150 required") +
      opciones("Clase de activo", "clase", Object.keys(config.clases)) + input("Centro de costo", "centroCosto", "maxlength=60 required") +
      moneda("Presupuesto sin IGV (S/)", "presupuesto") + fecha("Fecha requerida", "requerida")) + motivo("Necesidad y justificación"),
    (d, f) => R.solicitar(d, { ...Object.fromEntries(f), presupuesto: importe(f, "presupuesto") }, actor(), hoy()), r => `solicitudes/${r.id}`);
  }

  function proveedorCampo(requerido = true) {
    return seleccionar("Proveedor aprobado", "proveedorId", [["", "Selecciona un proveedor"], ...A.proveedores().map(p => [p.id, `${p.nombre} · ${p.ruc}`])], "", requerido ? "required" : "");
  }

  function formularioOrden(s) {
    form("Emitir orden de compra", grupo(proveedorCampo() + fecha("Entrega prevista", "entrega") +
      moneda("Precio del bien sin IGV (S/)", "precio") + moneda("Costos directos sin IGV (S/)", "directos", 0) +
      input("Detalle de costos directos", "detalleDirectos", "maxlength=150")),
    (d, f) => R.emitirOrden(d, { ...Object.fromEntries(f), solicitudId: s.id, precio: importe(f, "precio"), directos: importe(f, "directos") }, actor(), hoy(), A.proveedores()), () => `solicitudes/${s.id}`);
  }

  function formularioRecepcion(o) {
    form("Registrar recepción de activo", grupo(input("Guía o documento de recepción", "documento", "maxlength=60 required") +
      fecha("Fecha de recepción") + input("Número de serie", "serie", "maxlength=80 required") +
      seleccionar("Resultado de inspección", "conforme", [["", "Selecciona el resultado"], ["si", "Conforme"], ["no", "Observada"]])) + motivo("Resultado y evidencia de inspección"),
    (d, f) => R.recibir(d, { ...Object.fromEntries(f), ordenId: o.id, evidencia: f.get("motivo"), conforme: f.get("conforme") === "si" }, actor(), hoy()), () => `solicitudes/${o.solicitudId}`);
  }

  function formularioFactura(r, o) {
    form("Cotejar factura", grupo(input("Número de factura", "documento", "maxlength=60 required") + fecha("Fecha de emisión") +
      moneda("Base informada (S/)", "base", (o.precio + o.directos) / 100) + moneda("IGV informado (S/)", "igv", R.impuesto(o.precio + o.directos, true) / 100) +
      seleccionar("Tratamiento del IGV", "igvTipo", [["recuperable", "Gravada · IGV recuperable"], ["costo", "Gravada · IGV no recuperable"], ["no", "Sin IGV"]])),
    (d, f) => R.verificarFactura(d, { ...Object.fromEntries(f), recepcionId: r.id, base: importe(f, "base"), igv: importe(f, "igv"),
      gravado: f.get("igvTipo") !== "no", recuperable: f.get("igvTipo") === "recuperable" }, actor(), hoy()), () => `solicitudes/${o.solicitudId}`);
  }

  function formularioCapitalizar(factura) {
    const plan = (titulo, prefijo, opcional) => {
      const metodos = config.metodos.map(m => [m, m]);
      if (opcional) metodos.unshift(["", "No habilitar"]);
      return `<fieldset class="af-libro" data-af-libro="${prefijo}"><legend>${titulo}</legend>${grupo(
        seleccionar("Método", `${prefijo}-metodo`, metodos, opcional ? "" : config.metodos[0], opcional ? "" : "required") +
        `<div data-af-plan="residual">${moneda("Valor residual (S/)", `${prefijo}-residual`, 0)}</div>` +
        `<div data-af-plan="meses">${numero("Vida útil (meses)", `${prefijo}-meses`, "max=600 required", 120)}</div>` +
        `<div data-af-plan="unidades">${numero("Total de unidades estimadas", `${prefijo}-unidades`, "max=1000000000 required")}</div>` +
        `<div data-af-plan="tasa">${input("Tasa anual (%)", `${prefijo}-tasa`, 'type="number" min="0.01" max="100" step="0.01" required')}</div>`
      )}</fieldset>`;
    };
    const leerLibro = (f, p) => ({
      metodo: f.get(`${p}-metodo`), residual: importe(f, `${p}-residual`), tasa: importe(f, `${p}-tasa`),
      meses: entero(f, `${p}-meses`), unidades: entero(f, `${p}-unidades`)
    });
    form("Capitalizar y poner en servicio", grupo(fecha("Puesta en servicio") + input("Ubicación", "ubicacion", "maxlength=150 required") +
      input("Custodio", "custodio", "maxlength=150 required") + input("Identificador QR / RFID", "etiqueta", "maxlength=80 required") +
      seleccionar("Criticidad operativa", "critico", [["no", "Estándar"], ["si", "Crítico"]]) + input("URL de la foto", "foto", 'type="url" maxlength="500"')) + motivo("Evidencia de puesta en servicio") +
      plan("Libro contable", "contable", false) + plan("Libro tributario", "tributario", true),
    (d, f) => R.capitalizar(d, { ...Object.fromEntries(f), facturaId: factura.id, evidencia: f.get("motivo"), critico: f.get("critico") === "si", contable: leerLibro(f, "contable"),
      tributario: f.get("tributario-metodo") ? leerLibro(f, "tributario") : null }, actor(), hoy()), r => `activos/${r.id}`);
    for (const fieldset of c.$("#formulario-registro").querySelectorAll("[data-af-libro]")) {
      const menu = fieldset.querySelector("select");
      const actualizar = () => {
        const metodo = menu.value, unidades = metodo === "Unidades de producción";
        const visibles = { residual: !!metodo, meses: !!metodo && !unidades, unidades, tasa: metodo === "Saldos decrecientes" };
        for (const campo of fieldset.querySelectorAll("[data-af-plan]")) {
          campo.hidden = !visibles[campo.dataset.afPlan];
          campo.querySelector("input").disabled = campo.hidden;
        }
      };
      menu.addEventListener("change", actualizar);
      actualizar();
    }
  }

  function formularioDepreciar(a, libro) {
    const b = a.libros[libro], p = P.siguiente(a, b);
    form(`Depreciar ${a.numero} · ${libro}`, grupo(input("Periodo", "periodo", 'type="month" readonly required', p) +
      (b.metodo === "Unidades de producción" ? numero("Unidades producidas en el mes", "unidades", "required max=1000000000") : "")),
    (d, f) => P.depreciar(d, { activoId: a.id, libro, periodo: f.get("periodo"), unidades: entero(f, "unidades") }, actor(), hoy()), () => "depreciacion");
  }

  function formularioMovimiento(a, tipo) {
    let html = "";
    if (tipo === "Traslado") html = seleccionar("Sede de destino", "sedeDestino", c.configuracion.sedes.map(s => [s.id, s.nombre]), a.sede) +
      input("Ubicación de destino", "ubicacion", "maxlength=150 required", a.ubicacion) +
      input("Custodio de destino", "custodio", "maxlength=150 required", a.custodio) +
      input("Centro de costo de destino", "centroCosto", "maxlength=60 required", a.centroCosto);
    if (tipo === "Mantenimiento") html = opciones("Tipo de mantenimiento", "tipoMantenimiento", ["Preventivo", "Correctivo"]) + fecha("Fecha programada", "programada");
    if (tipo === "Mejora") html = proveedorCampo() + moneda("Importe capitalizable (S/)", "importe") + input("Documento de sustento", "documento", "maxlength=80 required") +
      Object.entries(a.libros).map(([n, b]) => numero(`${n} · ${b.metodo === "Unidades de producción" ? "unidades restantes" : "meses restantes"} (opcional)`, n)).join("");
    if (tipo === "Deterioro") html = moneda("Valor recuperable (S/)", "recuperable");
    if (tipo === "Venta") html = moneda("Precio de venta sin IGV (S/)", "importe") + input("Documento de venta", "documento", "maxlength=80 required") +
      seleccionar("Tratamiento del IGV", "gravado", [["si", "Gravada"], ["no", "Sin IGV"]]);
    form(`${tipo} · ${a.numero}`, grupo(html) + motivo(tipo === "Mejora" ? "Sustento de los beneficios económicos futuros" : undefined),
    (d, f) => P.solicitarMovimiento(d, { ...Object.fromEntries(f), activoId: a.id, tipo, importe: importe(f, "importe"),
      recuperable: importe(f, "recuperable"), gravado: f.get("gravado") === "si",
      medidas: Object.fromEntries(Object.keys(a.libros).filter(n => valor(f, n) !== "").map(n => [n, entero(f, n)]))
    }, actor(), hoy(), tipo === "Mejora" ? A.proveedores() : []), m => `movimientos/${m.id}`);
  }

  function formularioResolucion(m, aceptar) {
    const fechaEfectiva = aceptar && m.tipo !== "Mantenimiento" ? fecha("Fecha efectiva") : "";
    form(aceptar ? "Aprobar movimiento" : "Rechazar movimiento", grupo(fechaEfectiva) + motivo("Motivo de revisión"),
      (d, f) => P.resolverMovimiento(d, { id: m.id, aceptar, fecha: f.get("fecha"), motivo: f.get("motivo") }, actor(), hoy()), r => `movimientos/${r.id}`);
  }

  function formularioMantenimiento(m, cancelar) {
    const campos = cancelar ? "" : grupo(fecha("Fecha de ejecución") + moneda("Gasto incurrido (S/)", "importe", 0) + proveedorCampo(false) + input("Documento del gasto", "documento", "maxlength=80"));
    form(cancelar ? "Cancelar mantenimiento" : "Completar mantenimiento", campos + motivo(cancelar ? "Motivo de cancelación" : "Trabajo realizado y evidencia"),
      (d, f) => P.cerrarMantenimiento(d, { ...Object.fromEntries(f), id: m.id, cancelar, importe: importe(f, "importe") }, actor(), hoy(), cancelar || !importe(f, "importe") ? [] : A.proveedores()), r => `movimientos/${r.id}`);
  }

  function formularioConteo(a) {
    form(`Contar ${a.numero}`, grupo(fecha("Fecha del conteo") + seleccionar("¿Se encontró el bien?", "encontrado", [["si", "Sí"], ["no", "No"]])) +
      `<div id="af-datos-observados">${grupo(input("Etiqueta leída", "etiqueta", "maxlength=80 required") + input("Serie observada", "serie", "maxlength=80 required") +
        input("Ubicación observada", "ubicacion", "maxlength=150 required") + input("Custodio observado", "custodio", "maxlength=150 required"))}</div>` + motivo("Evidencia del conteo"),
    (d, f) => P.contar(d, { ...Object.fromEntries(f), activoId: a.id, evidencia: f.get("motivo"), encontrado: f.get("encontrado") === "si" }, actor(), hoy()), r => `conteos/${r.id}`);
    c.$("#af-encontrado").addEventListener("change", evento => {
      const campos = c.$("#af-datos-observados");
      campos.hidden = evento.currentTarget.value === "no";
      campos.querySelectorAll("input").forEach(i => { i.disabled = campos.hidden; });
    });
  }

  function accion(nombre, id) {
    if (nombre === "imprimir") { window.print(); return; }
    const d = A.leer();
    if (nombre.startsWith("movimiento-")) { formularioMovimiento(L.obtener(d.activos, id, actor()), nombre.slice(11)); return; }
    if (nombre.startsWith("depreciar-")) { formularioDepreciar(L.obtener(d.activos, id, actor()), nombre.slice(10)); return; }
    switch (nombre) {
      case "solicitar": formularioSolicitud(); break;
      case "aprobar":
      case "rechazar":
        form(nombre === "aprobar" ? "Aprobar inversión" : "Rechazar inversión", motivo("Motivo de revisión"),
          (d, f) => R.resolverSolicitud(d, id, nombre === "aprobar", f.get("motivo"), actor()), r => `solicitudes/${r.id}`);
        break;
      case "orden": formularioOrden(L.obtener(d.solicitudes, id, actor())); break;
      case "recepcion": formularioRecepcion(L.obtener(d.ordenes, id, actor())); break;
      case "factura": {
        const r = L.obtener(d.recepciones, id, actor());
        formularioFactura(r, L.obtener(d.ordenes, r.ordenId, actor()));
        break;
      }
      case "adquisicion-en-curso": {
        const factura = L.obtener(d.facturas, id, actor()), orden = L.obtener(d.ordenes, factura.ordenId, actor());
        form("Registrar adquisición en curso", fecha("Fecha contable", "fecha", factura.fecha),
          (d, f) => R.registrarFactura(d, { facturaId: id, fecha: f.get("fecha") }, actor(), hoy()), () => `solicitudes/${orden.solicitudId}`);
        break;
      }
      case "capitalizar": formularioCapitalizar(L.obtener(d.facturas, id, actor())); break;
      case "periodo":
        form("Ejecutar periodo automático", grupo(opciones("Libro", "libro", config.libros) + input("Periodo", "periodo", 'type="month" required', mesAnterior())) +
          "<p>Los libros por unidades de producción requieren registro individual.</p>",
        (d, f) => P.ejecutarPeriodo(d, Object.fromEntries(f), actor(), hoy()), () => "depreciacion");
        break;
      case "aprobar-movimiento":
      case "rechazar-movimiento": formularioResolucion(L.obtener(d.movimientos, id, actor()), nombre === "aprobar-movimiento"); break;
      case "iniciar-mantenimiento":
        A.ejecutar(actor(), d => P.iniciarMantenimiento(d, id, actor(), hoy()));
        c.navegar(`activos/movimientos/${id}`);
        c.aviso("Mantenimiento iniciado.");
        break;
      case "completar-mantenimiento":
      case "cancelar-mantenimiento": formularioMantenimiento(L.obtener(d.movimientos, id, actor()), nombre === "cancelar-mantenimiento"); break;
      case "contar": formularioConteo(L.obtener(d.activos, id, actor())); break;
      case "revisar-conteo":
        form("Revisar conteo", motivo("Revisión y acción acordada"), (d, f) => P.revisarConteo(d, id, f.get("motivo"), actor()), r => `conteos/${r.id}`);
        break;
      case "conciliar":
        form("Registrar conciliación", grupo(input("Referencia del mayor", "documento", "maxlength=80 required") + moneda("Saldo neto informado (S/)", "saldoMayor")),
          (d, f) => P.conciliar(d, { documento: f.get("documento"), saldoMayor: importe(f, "saldoMayor") }, actor(), hoy()), r => `conciliaciones/${r.id}`);
        break;
      case "cerrar-periodo":
        form("Cerrar periodo patrimonial", input("Cerrar hasta", "periodo", 'type="month" required', mesAnterior()) +
          "<p>El cierre bloquea registros contables y depreciaciones hasta el periodo indicado.</p>",
        (d, f) => P.cerrarPeriodo(d, f.get("periodo"), actor(), hoy()), () => "conciliaciones");
        break;
      case "pagar":
        form("Registrar pago patrimonial", grupo(input("Referencia de pago", "documento", "maxlength=80 required") + fecha("Fecha del pago")),
          (d, f) => R.pagar(d, { ...Object.fromEntries(f), asientoId: id }, actor(), hoy()), () => "pagos");
        break;
    }
  }

  document.addEventListener("click", evento => {
    const control = evento.target.closest("[data-af-accion], [data-af-vista]");
    if (!control || !actor()) return;
    if (control.dataset.afVista) { c.navegar(`activos/${control.dataset.afVista}`); return; }
    try { accion(control.dataset.afAccion, control.dataset.id); }
    catch (error) { c.aviso(error.message); }
  });

  return { dibujar, acceso, ruta: (modulo, seccion) => Object.hasOwn(accesos, modulo) && seccion === "activos" };
};
