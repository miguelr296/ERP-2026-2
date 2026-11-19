
"use strict";

window.PantallasTesoreria = c => {
  const R = window.TesoreriaReglas, A = window.TesoreriaAplicacion, L = window.LogisticaReglas;
  const { esc, moneda, fechaCorta, tabla } = c;
  const actor = () => c.sesion;
  const operador = () => actor()?.rol === "Tesorería";
  const jefe = () => actor()?.rol === "Jefatura";
  const revisaConciliacion = () => jefe() || actor()?.rol === "Contabilidad";
  const propias = lista => R.porSede(lista, actor().sede);
  const ruta = vista => `finanzas/${vista}`;
  const enlace = (texto, vista, clase = "enlace-boton") =>
    `<a class="${clase}" href="#${ruta(esc(vista))}">${esc(texto)}</a>`;
  const boton = (texto, accion, id = "", primaria = false) =>
    `<button type="button" class="boton${primaria ? " primario" : ""}" data-tes-accion="${accion}" data-id="${esc(id)}">${esc(texto)}</button>`;
  const fila = (...celdas) => `<tr>${celdas.map(t => `<td>${t}</td>`).join("")}</tr>`;
  const importe = (f, k = "importe") => {
    const valor = f.get(k);
    return /^-?\d+(?:\.\d{1,2})?$/.test(valor) ? Math.round(Number(valor) * 100) : NaN;
  };

  const secciones = {
    resumen: "Inicio", cuentas: "Caja y bancos", cobrar: "Por cobrar", pagar: "Por pagar",
    pagos: "Pagos programados", conciliacion: "Conciliación"
  };
  const accionesPago = {
    aprobar: "Aprobar pago", rechazar: "Rechazar pago", cancelar: "Cancelar pago",
    enviar: "Registrar envío", confirmar: "Confirmar pago", fallar: "Registrar rechazo bancario"
  };

  function cabecera(titulo, descripcion, controles = "") {
    return `<div class="encabezado-vista"><div><p class="ceja">TESORERÍA / ${esc(c.sedeNombre(actor().sede))}</p>
      <h1>${esc(titulo)}</h1><p>${esc(descripcion)}</p></div>
      ${controles ? `<div class="acciones-documento">${controles}</div>` : ""}</div>`;
  }

  const historial = (registro, pares, acciones = "") => `<section class="tarjeta ficha-completa">
    <dl class="detalle-documento">${pares.map(([nombre, valor]) => `<div><dt>${nombre}</dt><dd>${valor}</dd></div>`).join("")}</dl>
    ${acciones ? `<div class="acciones-documento">${acciones}</div>` : ""}${c.mostrarHistorial(registro.historial)}</section>`;
  const metricas = pares => `<div class="indicadores">${pares.map(([nombre, valor]) =>
    `<div class="tarjeta indicador"><small>${nombre}</small><strong>${valor}</strong></div>`).join("")}</div>`;
  const etiqueta = (estado, color = "") => `<span class="etiqueta ${color}">${esc(estado)}</span>`;

  function resumen(d, horizonte) {
    const dias = ["7", "30", "60", "90"].includes(horizonte) ? Number(horizonte) : 30;
    const hoy = c.fechaHoy(), hasta = c.sumarDias(hoy, dias);
    const flujo = R.flujo(d, actor().sede, hoy, hasta);
    const abiertas = propias(d.partidas).filter(p => p.vence < hoy);
    const vencido = tipo => abiertas.filter(p => p.tipo === tipo).reduce((suma, p) => suma + R.saldoPartida(d, p), 0);
    const saldos = metricas([["Saldo de caja y bancos", moneda(flujo.saldo)], ["Saldo proyectado", moneda(flujo.proyectado)],
      ["Por cobrar vencido", moneda(vencido("Cobrar"))], ["Por pagar vencido", moneda(vencido("Pagar"))]]);
    const horizontes = [7, 30, 60, 90].map(n => enlace(`${n} días`, `resumen/${n}`, n === dias ? "boton primario" : "boton")).join("");
    return cabecera("Tesorería", `Posición en PEN al ${fechaCorta(hoy)}. Proyección hasta el ${fechaCorta(hasta)}.`, c.accesoPatrimonial("finanzas")) +
      saldos + `<div class="acciones-documento" aria-label="Horizonte de proyección">${horizontes}</div>` +
      tabla("Flujo de caja proyectado", ["Fecha", "Cobros", "Pagos", "Saldo proyectado"], flujo.jornadas.map(j =>
        fila(fechaCorta(j.fecha), moneda(j.cobrar), moneda(j.pagar), moneda(j.saldo))), false);
  }

  function cuentas(d, id) {
    const hoy = c.fechaHoy();
    if (!id) {
      const controles = (jefe() ? boton("+ Nueva cuenta", "cuenta", "", true) : "") +
        (operador() && propias(d.cuentas).some(c => c.tipo === "Banco") ? boton("Registrar comisión o interés", "ajuste") : "");
      return cabecera("Caja y bancos", "Consulta el saldo registrado y los fondos disponibles por cuenta.", controles) +
        tabla("Cuentas en PEN", ["Cuenta", "Tipo", "Banco", "Saldo", "Disponible"], propias(d.cuentas).map(c =>
          fila(enlace(c.nombre, `cuentas/${c.id}`), esc(c.tipo), esc(c.banco || "—"), moneda(R.saldoCuenta(d, c, hoy)),
            moneda(R.disponible(d, c, hoy)))));
    }
    const cuenta = L.obtener(d.cuentas, id, actor());
    const extractosConciliados = new Set(d.extractos.map(x => x.movimientoId));
    const movimientos = propias(d.movimientos).filter(m => m.cuentaId === id).sort((a, b) => b.fecha.localeCompare(a.fecha));
    return cabecera(cuenta.nombre, "Libro de movimientos de la cuenta.", enlace("← Caja y bancos", "cuentas", "boton")) +
      historial(cuenta, [["Tipo", esc(cuenta.tipo)], ["Banco", esc(cuenta.banco || "—")], ["Identificador", esc(cuenta.identificador)],
        ["Apertura", `${fechaCorta(cuenta.fecha)} · ${moneda(cuenta.apertura)}`], ["Saldo", moneda(R.saldoCuenta(d, cuenta, hoy))],
        ["Disponible", moneda(R.disponible(d, cuenta, hoy))]]) +
      tabla("Libro de movimientos", ["Fecha", "Concepto", "Referencia", "Entrada", "Salida", "Conciliación"], movimientos.map(m =>
        fila(fechaCorta(m.fecha), esc(m.concepto), esc(m.referencia), m.direccion === "Entrada" ? moneda(m.importe) : "—",
          m.direccion === "Salida" ? moneda(m.importe) : "—", cuenta.tipo === "Caja" ? "—" :
            extractosConciliados.has(m.id) ? etiqueta("Conciliado", "verde") : etiqueta("En tránsito", "naranja"))));
  }

  const reservado = (d, p) => R.pagoPendiente(d, p.id).reduce((total, pago) => total + pago.importe, 0);
  const estadoPartida = (saldo, p) => !saldo ? etiqueta(p.tipo === "Pagar" ? "Pagada" : "Cobrada", "verde") :
    p.vence < c.fechaHoy() ? etiqueta("Vencida", "roja") : etiqueta("Pendiente", "naranja");

  function partidas(d, vista, id) {
    const cobro = vista === "cobrar", tipo = cobro ? "Cobrar" : "Pagar";
    const titulo = cobro ? "Cuentas por cobrar" : "Cuentas por pagar";
    if (!id) {
      const controles = operador() ? boton("+ Registrar documento", "partida", tipo, true) +
        (cobro ? "" : boton("Incorporar factura de Logística", "importar")) : "";
      return cabecera(titulo, "Revisa documentos, vencimientos y saldos pendientes.", controles) +
        tabla(titulo, ["Documento", cobro ? "Cliente" : "Proveedor", "Vencimiento", "Total", "Saldo pendiente", "Estado"],
          propias(d.partidas).filter(p => p.tipo === tipo).sort((a, b) => a.vence.localeCompare(b.vence)).map(p => {
            const saldo = R.saldoPartida(d, p);
            return fila(enlace(p.documento, `${vista}/${p.id}`), esc(p.tercero), fechaCorta(p.vence), moneda(p.total), moneda(saldo), estadoPartida(saldo, p));
          }));
    }
    const p = L.obtener(d.partidas, id, actor());
    L.exigir(p.tipo === tipo, "El documento pertenece a otra vista.");
    const saldo = R.saldoPartida(d, p), programado = reservado(d, p);
    const tieneCuenta = propias(d.cuentas).some(c => cobro || c.tipo === "Banco");
    const disponible = saldo - programado;
    const controles = operador() && disponible && tieneCuenta ? boton(cobro ? "Registrar cobro" : "Programar pago", cobro ? "cobro" : "preparar", id, true) :
      operador() && disponible ? enlace("Ver cuentas de la sede", "cuentas", "boton") : "";
    const movimientos = propias(d.movimientos).filter(m => m.partidaId === id);
    const pagos = cobro ? "" : tabla("Pagos programados", ["Pago", "Fecha programada", "Importe", "Estado"],
      propias(d.pagos).filter(pago => pago.partidaId === id).map(pago =>
        fila(enlace(pago.numero, `pagos/${pago.id}`), fechaCorta(pago.fecha), moneda(pago.importe), estadoPago(pago))), false);
    return cabecera(p.documento, titulo, enlace("← Volver al listado", vista, "boton")) +
      historial(p, [[cobro ? "Cliente" : "Proveedor", esc(p.tercero)], ["Registro", esc(p.numero)], ["Fecha del documento", fechaCorta(p.fecha)],
        ["Vencimiento", fechaCorta(p.vence)], ["Importe", moneda(p.total)], ["Saldo pendiente", moneda(saldo)],
        ...(!cobro ? [["Programado", moneda(programado)], ["Saldo sin programar", moneda(disponible)]] : []),
        ["Estado", estadoPartida(saldo, p)], ...(p.referenciaLogistica ? [["Cotejo de Logística", esc(p.referenciaLogistica)]] : [])], controles) +
      tabla(cobro ? "Cobros aplicados" : "Pagos aplicados", ["Fecha", "Referencia", "Importe"],
        movimientos.map(m => fila(fechaCorta(m.fecha), esc(m.referencia), moneda(m.importe))), false) + pagos;
  }

  const estadoPago = p => etiqueta(p.estado, p.estado === "Confirmado" ? "verde" :
    ["Rechazado", "Cancelado", "Fallido"].includes(p.estado) ? "roja" : "naranja");

  function pagos(d, id) {
    if (!id) {
      return cabecera("Pagos programados", "Revisa el beneficiario, la autorización, el envío y la confirmación.") +
        tabla("Programación de pagos", ["Pago", "Proveedor", "Fecha programada", "Importe", "Estado"],
          propias(d.pagos).sort((a, b) => a.fecha.localeCompare(b.fecha)).map(p =>
            fila(enlace(p.numero, `pagos/${p.id}`), esc(d.partidas.find(x => x.id === p.partidaId)?.tercero),
              fechaCorta(p.fecha), moneda(p.importe), estadoPago(p))));
    }
    const p = L.obtener(d.pagos, id, actor()), partida = L.obtener(d.partidas, p.partidaId, actor());
    const cuenta = L.obtener(d.cuentas, p.cuentaId, actor());
    const permitidas = jefe() && p.estado === "Preparado" ? ["aprobar", "rechazar"] :
      operador() && p.estado === "Preparado" ? ["cancelar"] :
      operador() && p.estado === "Aprobado" ? ["enviar", "cancelar"] :
      operador() && p.estado === "Enviado" ? ["confirmar", "fallar"] : [];
    const controles = permitidas.map((accion, i) => boton(accionesPago[accion], accion, id, !i)).join("");
    const movimiento = d.movimientos.find(m => m.id === p.movimientoId);
    return cabecera(p.numero, "Seguimiento del pago programado.", enlace("← Pagos programados", "pagos", "boton")) +
      historial(p, [["Proveedor", esc(partida.tercero)], ["Documento", enlace(partida.documento, `pagar/${partida.id}`)],
        ["Cuenta de origen", enlace(cuenta.nombre, `cuentas/${cuenta.id}`)], ["Cuenta de destino", esc(p.beneficiario)],
        ["Fecha programada", fechaCorta(p.fecha)], ["Importe", moneda(p.importe)], ["Estado", estadoPago(p)],
        ["Referencia de envío", esc(p.referenciaEnvio || "—")],
        ["Confirmación bancaria", movimiento ? `${fechaCorta(movimiento.fecha)} · ${esc(movimiento.referencia)}` : "—"]], controles);
  }

  function conciliacion(d, id) {
    if (!id) {
      const bancos = propias(d.cuentas).filter(c => c.tipo === "Banco");
      const controles = operador() && bancos.length ? boton("Importar extracto CSV", "importar-extracto", "", true) +
        boton("+ Línea de extracto", "extracto") + boton("Registrar saldo de extracto", "saldo-banco") : "";
      const nombreCuenta = id => esc(bancos.find(c => c.id === id)?.nombre);
      const extracto = tabla("Líneas del extracto", ["Cuenta", "Fecha", "Referencia", "Tipo", "Importe", "Estado"],
        propias(d.extractos).sort((a, b) => b.fecha.localeCompare(a.fecha)).map(x =>
          fila(nombreCuenta(x.cuentaId), fechaCorta(x.fecha), enlace(x.referencia, `conciliacion/${x.id}`), esc(x.direccion),
            moneda(x.importe), x.movimientoId ? etiqueta("Conciliado", "verde") : x.observacion ? etiqueta("Observado", "roja") :
              R.sugerencias(d, x).length === 1 ? etiqueta("Coincidencia sugerida") : etiqueta("Pendiente", "naranja"))));
      const cortes = tabla("Saldos por corte", ["Cuenta", "Extracto", "Fecha", "Saldo bancario", "En tránsito",
        "Saldo ajustado", "Saldo libro", "Diferencia", "Excepciones", "Estado"], propias(d.saldosBanco).sort((a, b) => b.fecha.localeCompare(a.fecha)).map(s => {
          const corte = R.corteBanco(d, s);
          return fila(nombreCuenta(s.cuentaId), enlace(s.referencia, `conciliacion/corte/${s.id}`), fechaCorta(s.fecha), moneda(s.importe),
            moneda(corte.transito), moneda(corte.ajustado), moneda(corte.libro), moneda(corte.diferencia), esc(corte.excepciones),
            s.cierre ? etiqueta("Cerrado", "verde") : etiqueta("Pendiente de revisión", "naranja"));
        }), false);
      return cabecera("Conciliación bancaria", "Compara el extracto con el libro de bancos y documenta las diferencias.", controles) + extracto + cortes;
    }
    const x = L.obtener(d.extractos, id, actor());
    const cuenta = L.obtener(d.cuentas, x.cuentaId, actor());
    const m = d.movimientos.find(m => m.id === x.movimientoId);
    const controles = operador() && !m ?
      (R.sugerencias(d, x).length === 1 ? boton("Confirmar coincidencia", "exacta", id, true) : "") +
      (R.candidatos(d, x).length ? boton("Conciliar manualmente", "manual", id) : "") +
      boton("Registrar observación", "observar", id) : "";
    return cabecera(x.referencia, "Línea de extracto bancario.", enlace("← Conciliación", "conciliacion", "boton")) +
      historial(x, [["Cuenta", enlace(cuenta.nombre, `cuentas/${cuenta.id}`)], ["Fecha", fechaCorta(x.fecha)], ["Tipo", esc(x.direccion)],
        ["Importe", moneda(x.importe)], ["Movimiento asociado", m ? `${esc(m.referencia)} · ${fechaCorta(m.fecha)}` : "Pendiente"],
        ["Observación", esc(x.observacion || "—")]], controles);
  }

  function fichaCorte(d, id) {
    const s = L.obtener(d.saldosBanco, id, actor());
    const cuenta = L.obtener(d.cuentas, s.cuentaId, actor());
    const corte = R.corteBanco(d, s);
    const posterior = d.saldosBanco.some(x => x.cuentaId === s.cuentaId && x.cierre && x.fecha > s.fecha);
    const estado = s.cierre ? etiqueta("Cerrado", "verde") : posterior ? etiqueta("Cubierto por un cierre posterior") :
      etiqueta("Pendiente de revisión", "naranja");
    const controles = revisaConciliacion() && !s.cierre && !posterior && !corte.diferencia && !corte.excepciones ?
      boton("Cerrar conciliación", "cerrar-corte", s.id, true) : "";
    return cabecera(s.referencia, "Conciliación bancaria al corte del extracto.", enlace("← Conciliación", "conciliacion", "boton")) +
      historial(s, [["Cuenta", enlace(cuenta.nombre, `cuentas/${cuenta.id}`)], ["Fecha de corte", fechaCorta(s.fecha)],
        ["Saldo bancario", moneda(s.importe)], ["Movimientos en tránsito", moneda(corte.transito)], ["Saldo ajustado", moneda(corte.ajustado)],
        ["Saldo libro", moneda(corte.libro)], ["Diferencia", moneda(corte.diferencia)], ["Excepciones sin conciliar", esc(corte.excepciones)],
        ["Estado", estado]], controles);
  }

  function dibujar(partes) {
    const vista = Object.hasOwn(secciones, partes[1]) ? partes[1] : "resumen";
    const nav = c.$("#navegacion"), contenido = c.$("#contenido");
    c.$("#accesos-rapidos").hidden = true;
    nav.setAttribute("aria-label", "Secciones de Tesorería");
    document.title = "Tesorería · FAMIHOGAR";
    nav.innerHTML = R.roles.includes(actor().rol) ? Object.entries(secciones).map(([id, texto]) =>
      `<button type="button" data-tes-vista="${id}"${id === vista ? ' aria-current="page"' : ""}>${texto}</button>`).join("") : "";
    try {
      R.permitir(actor());
      const d = A.leer(), id = partes[2];
      const vistas = {
        resumen: () => resumen(d, id), cuentas: () => cuentas(d, id), cobrar: () => partidas(d, "cobrar", id),
        pagar: () => partidas(d, "pagar", id), pagos: () => pagos(d, id),
        conciliacion: () => id === "corte" ? fichaCorte(d, partes[3]) : conciliacion(d, id)
      };
      contenido.innerHTML = vistas[vista]();
    } catch (error) {
      contenido.innerHTML = cabecera("Finanzas", R.roles.includes(actor().rol) ?
        error.message : "Disponible para Tesorería, Jefatura y Contabilidad.") +
        '<a class="boton" href="#aplicaciones">Volver a aplicaciones</a>';
    }
    contenido.focus();
  }

  const campos = contenido => `<div class="campos">${contenido}</div>`;
  const campo = (titulo, name, control) => `<div><label for="tes-${name}">${titulo}</label>${control}</div>`;
  const input = (titulo, name, props = "required maxlength=80", valor = "") =>
    campo(titulo, name, `<input id="tes-${name}" name="${name}" value="${esc(valor)}" ${props}>`);
  const seleccionar = (titulo, name, opciones) => campo(titulo, name, `<select id="tes-${name}" name="${name}" required>
    <option value="">Selecciona</option>${opciones.map(([valor, texto]) => `<option value="${esc(valor)}">${esc(texto)}</option>`).join("")}</select>`);
  const opciones = (titulo, name, opciones) => seleccionar(titulo, name, opciones.map(t => [t, t]));
  const fecha = (titulo, name = "fecha", valor = c.fechaHoy(), limite = "max") =>
    input(titulo, name, `type="date" required ${limite}="${c.fechaHoy()}"`, valor);
  const monto = (titulo, name = "importe", valor = "", min = "0.01") =>
    input(titulo, name, `type="number" required min="${min}" max="100000000" step="0.01"`, valor);
  const motivo = titulo => campo(titulo, "motivo", '<textarea id="tes-motivo" name="motivo" minlength="3" maxlength="300" required></textarea>');
  const cuentaCampo = (d, bancaria) => seleccionar(bancaria ? "Cuenta bancaria" : "Cuenta de caja o banco", "cuentaId",
    propias(d.cuentas).filter(c => !bancaria || c.tipo === "Banco").map(c => [c.id, `${c.nombre} · ${c.identificador}`]));
  const referencia = (titulo = "Referencia bancaria") => input(titulo, "referencia");

  function form(titulo, html, comando, destino, guardar) {
    c.formulario(titulo, html, async f => {
      const actual = { ...actor() }, hoy = c.fechaHoy();
      const r = await A.guardar(d => comando(d, f, actual, hoy));
      return ruta(typeof destino === "function" ? destino(r) : destino);
    }, guardar);
  }

  function nuevaCuenta() {
    form("Nueva cuenta", campos(opciones("Tipo", "tipo", R.tiposCuenta) + input("Nombre de la cuenta", "nombre") +
      input("Banco", "banco", "maxlength=80 disabled") + input("Identificador bancario o código de caja", "identificador") +
      fecha("Fecha de apertura") + monto("Saldo inicial (S/)", "apertura", "0", "0")),
    (d, f, actor, hoy) => R.registrarCuenta(d, { ...Object.fromEntries(f), apertura: importe(f, "apertura") }, actor, hoy),
    r => `cuentas/${r.id}`);
    c.$("#tes-banco").closest("div").hidden = true;
    c.$("#tes-tipo").addEventListener("change", evento => {
      const banco = c.$("#tes-banco"), bancaria = evento.target.value === "Banco";
      banco.disabled = !bancaria;
      banco.required = bancaria;
      banco.closest("div").hidden = !bancaria;
    });
  }

  function formularioPartida(tipo) {
    const cobrar = tipo === "Cobrar", vista = cobrar ? "cobrar" : "pagar";
    form(cobrar ? "Registrar cuenta por cobrar" : "Registrar cuenta por pagar",
      campos(input(cobrar ? "Cliente" : "Proveedor", "tercero", "required maxlength=150") + input("Referencia del documento", "documento") +
        fecha("Fecha del documento") + input("Vencimiento", "vence", 'type="date" required', c.fechaHoy()) + monto("Total (S/)")),
      (d, f, actor, hoy) => R.registrarPartida(d, { ...Object.fromEntries(f), tipo, importe: importe(f) }, actor, hoy),
      r => `${vista}/${r.id}`);
  }

  function formularioImportar(d) {
    const consultar = sede => window.ContratosLogisticos.listarFacturasVerificadas(sede);
    const importadas = new Set(propias(d.partidas).map(p => p.facturaLogisticaId));
    const facturas = consultar(actor().sede).filter(f => f.proveedor && !importadas.has(f.id));
    L.exigir(facturas.length, "No hay facturas verificadas de Logística pendientes de incorporar en esta sede.");
    form("Incorporar factura de Logística", campos(seleccionar("Factura verificada", "facturaId", facturas.map(f =>
      [f.id, `${f.documento} · ${f.proveedor} · ${moneda(f.base + f.igv)}`])) +
      input("Vencimiento confirmado con el proveedor", "vence", 'type="date" required', c.fechaHoy())),
    (d, f, actor, hoy) => R.importarFactura(d, f.get("facturaId"), f.get("vence"), actor, hoy, consultar(actor.sede)),
    r => `pagar/${r.id}`);
  }

  function formularioOperacion(d, id, cobro) {
    const p = L.obtener(d.partidas, id, actor());
    const saldo = R.saldoPartida(d, p) - reservado(d, p);
    const informacion = `<p class="nota-operacion">${esc(p.tercero)} · ${esc(p.documento)} · Disponible para ${cobro ? "cobro" : "programar"}: ${moneda(saldo)}.</p>`;
    const camposOperacion = cuentaCampo(d, !cobro) + monto("Importe (S/)", "importe", (saldo / 100).toFixed(2)) +
      (cobro ? fecha("Fecha del cobro") + referencia("Referencia bancaria o de caja") :
        fecha("Fecha programada", "fecha", c.fechaHoy(), "min") + input("Identificador de la cuenta destino", "beneficiario", "required maxlength=100"));
    form(cobro ? "Registrar cobro" : "Programar pago", informacion + campos(camposOperacion),
      (d, f, actor, hoy) => (cobro ? R.cobrar : R.prepararPago)(d, id, { ...Object.fromEntries(f), importe: importe(f) }, actor, hoy),
      r => cobro ? `cobrar/${id}` : `pagos/${r.id}`);
  }

  function formularioPago(d, accion, id) {
    const pago = L.obtener(d.pagos, id, actor()), partida = L.obtener(d.partidas, pago.partidaId, actor());
    const informacion = `<p class="nota-operacion">${esc(partida.tercero)} · ${esc(pago.beneficiario)} · ${moneda(pago.importe)}.</p>`;
    let detalle = motivo(accion === "aprobar" ? "Verificación del beneficiario y motivo de aprobación" : "Motivo");
    if (accion === "enviar") detalle = referencia("Referencia de envío o constancia");
    if (accion === "confirmar") detalle = fecha("Fecha de confirmación") + referencia("Referencia del movimiento bancario");
    form(accionesPago[accion], informacion + campos(detalle),
      (d, f, actor, hoy) => R.cambiarPago(d, id, accion, Object.fromEntries(f), actor, hoy), `pagos/${id}`, accionesPago[accion]);
  }

  function formularioConciliar(d, id, accion) {
    const x = L.obtener(d.extractos, id, actor());
    const exactos = R.sugerencias(d, x), candidatos = R.candidatos(d, x);
    if (accion === "observar") {
      form("Registrar observación", motivo("Diferencia observada"),
        (d, f, actor) => R.observar(d, id, f.get("motivo"), actor), `conciliacion/${id}`);
      return;
    }
    const datos = accion === "exacta" ? `<p>Referencia ${esc(x.referencia)} · ${fechaCorta(x.fecha)} · ${moneda(x.importe)}.</p>` :
      seleccionar("Movimiento del libro", "movimientoId", candidatos.map(m =>
        [m.id, `${fechaCorta(m.fecha)} · ${m.referencia} · ${m.concepto}`])) + motivo("Motivo de la conciliación");
    if (accion === "exacta") L.exigir(exactos.length === 1, "Ya no hay una coincidencia exacta.");
    form("Conciliar movimiento", datos, (d, f, actor) => R.conciliar(d, id, Object.fromEntries(f), actor),
      `conciliacion/${id}`, "Conciliar");
  }

  function formularioExtractoCsv(d) {
    const archivo = campo("Archivo CSV", "archivo", '<input id="tes-archivo" name="archivo" type="file" accept=".csv,text/csv" required aria-describedby="tes-formato-csv">');
    const ayuda = '<p id="tes-formato-csv" class="nota-operacion">CSV UTF-8 con encabezados <code>fecha,referencia,tipo,importe</code>. Usa fechas AAAA-MM-DD y tipos Entrada o Salida. Hasta 1000 movimientos y 256 KB.</p>';
    c.formulario("Importar extracto CSV", campos(cuentaCampo(d, true) + archivo) + ayuda, async f => {
      const actual = { ...actor() }, hoy = c.fechaHoy();
      const archivo = f.get("archivo");
      L.exigir(archivo?.size && archivo.size <= R.maxBytesExtracto, "Selecciona un CSV de hasta 256 KB.");
      const bytes = await archivo.arrayBuffer();
      let contenido;
      try { contenido = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
      catch { throw new Error("Guarda el archivo como CSV UTF-8 y vuelve a seleccionarlo."); }
      const r = await A.guardar(d => R.importarExtracto(d, f.get("cuentaId"), contenido, archivo.name, actual, hoy));
      return { ruta: ruta("conciliacion"), mensaje: `Líneas incorporadas: ${r.incorporadas}. Duplicadas omitidas: ${r.duplicadas}.` };
    }, "Importar líneas");
  }

  function accion(tipo, id) {
    const d = A.leer();
    if (tipo === "cuenta") { nuevaCuenta(); return; }
    if (tipo === "partida") { formularioPartida(id); return; }
    if (tipo === "importar") { formularioImportar(d); return; }
    if (tipo === "cobro" || tipo === "preparar") { formularioOperacion(d, id, tipo === "cobro"); return; }
    if (Object.hasOwn(accionesPago, tipo)) { formularioPago(d, tipo, id); return; }
    if (["exacta", "manual", "observar"].includes(tipo)) { formularioConciliar(d, id, tipo); return; }
    if (tipo === "ajuste") {
      form("Registrar comisión o interés", campos(cuentaCampo(d, true) + opciones("Concepto", "concepto", Object.keys(R.ajustes)) +
        fecha("Fecha del movimiento") + referencia() + monto("Importe (S/)")),
        (d, f, actor, hoy) => R.ajustar(d, { ...Object.fromEntries(f), importe: importe(f) }, actor, hoy), r => `cuentas/${r.cuentaId}`);
    }
    if (tipo === "importar-extracto") { formularioExtractoCsv(d); return; }
    if (tipo === "extracto") {
      form("Registrar línea de extracto", campos(cuentaCampo(d, true) + fecha("Fecha del movimiento") + referencia("Referencia del extracto") +
        opciones("Tipo", "direccion", ["Entrada", "Salida"]) + monto("Importe (S/)")),
        (d, f, actor, hoy) => R.registrarExtracto(d, { ...Object.fromEntries(f), importe: importe(f) }, actor, hoy),
        r => `conciliacion/${r.id}`);
    }
    if (tipo === "saldo-banco") {
      form("Registrar saldo de extracto", campos(cuentaCampo(d, true) + fecha("Fecha de corte") + referencia("Referencia del extracto") +
        monto("Saldo según extracto (S/)", "importe", "", "-100000000")),
        (d, f, actor, hoy) => R.registrarSaldoBanco(d, { ...Object.fromEntries(f), importe: importe(f) }, actor, hoy), "conciliacion");
    }
    if (tipo === "cerrar-corte") {
      form("Cerrar conciliación", motivo("Resultado de la revisión"),
        (d, f, actor) => R.cerrarConciliacion(d, id, f.get("motivo"), actor), `conciliacion/corte/${id}`, "Cerrar conciliación");
    }
  }

  document.addEventListener("click", e => {
    const control = e.target.closest("[data-tes-accion], [data-tes-vista]");
    if (!control || !actor()) return;
    if (control.dataset.tesVista) { c.navegar(ruta(control.dataset.tesVista)); return; }
    try {
      R.permitir(actor());
      accion(control.dataset.tesAccion, control.dataset.id);
    } catch (error) { c.aviso(error.message); }
  });

  return { dibujar };
};
