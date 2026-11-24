"use strict";

window.PantallasFinanzas = ui => {
  const { c, L, e, actor, puede, enlace, boton, campo, input, opciones, fecha, monto, soles, detalle, panel, botones, cabecera, tabla, asiento, plegar, siguiente, ejecutar, formulario } = ui;
  const F = window.Finanzas;
  const roles = ["Tesorería", "Jefatura"];
  const secciones = { cobrar: "Por cobrar", pagar: "Por pagar", caja: "Caja y bancos" };
  const jefe = () => puede(["Jefatura"]);
  const moneda = c.moneda;
  const mostrarFecha = f => e(c.fechaCorta(f));
  const deSede = lista => L.enSede(lista, actor().sede);
  const camposBanco = (dia = L.hoy(), tituloReferencia = "Referencia") => [campo("Fecha del movimiento", fecha("fecha", dia)), campo(tituloReferencia, input("referencia"))];
  const datosBanco = v => ({ fecha: v.get("fecha"), referencia: v.get("referencia") });
  const campoCuenta = (seleccionada = "") => campo("Cuenta", opciones("cuenta", Object.entries(F.cuentas).map(([id, a]) => [id, a.nombre]), seleccionada));
  const rutaCaja = "finanzas/caja";
  const rolesContabilidad = ["Jefatura", "Contabilidad"];
  const pagosDe = (d, doc) => d.pagos.filter(p => p.documentoId === doc.id);
  const puedeAprobar = p => jefe() && (window.Permisos.esSuperAdmin(actor()) ||
    actor().nombre.toLocaleLowerCase("es") !== p.registradoPor.toLocaleLowerCase("es"));
  const puedeFacturar = () => puede(["Facturación", "Jefatura"]);

  function etapasCuenta(cobrar, actual) {
    const etapas = cobrar
      ? [["documento", "Emitir comprobante"], ["cobrar", "Registrar cobro"], ["conciliar", "Conciliar en banco"]]
      : [["documento", "Incorporar factura"], ["programar", "Programar pago"], ["aprobar", "Aprobar pago"], ["confirmar", "Confirmar pago"], ["conciliar", "Conciliar en banco"]];
    return c.recorrido.etapas(cobrar ? "Recorrido de cobranza" : "Recorrido de pago", etapas.map(([id, etiqueta]) => ({
      id, etiqueta, ruta: id === "conciliar" ? rutaCaja : id === "documento" ? (cobrar ? (puedeFacturar() ? "facturacion/comprobantes" : "") : "finanzas/pagar") : "",
      responsable: id === "aprobar" && !jefe() ? "Jefatura" : ""
    })), actual);
  }

  function movimientoPendiente(d, doc) {
    return F.movimientosDocumento(d, doc).find(m => m.cuenta === "banco" && !d.extractos.some(x => x.movimientoId === m.id));
  }

  function pasoBanco(d, m) {
    const partidas = deSede(d.extractos).filter(x => !x.movimientoId && F.coincidencias(d, x).some(candidato => candidato.id === m.id));
    if (partidas.length) return {
      etapa: "conciliar",
      html: siguiente("Revisar partida del extracto", "Hay una partida con el mismo tipo e importe. Antes de confirmar, verifica la referencia y la fecha.",
        enlace(rutaCaja + (partidas.length === 1 ? "/" + partidas[0].id : ""), "Ir a conciliación", true))
    };
    return {
      etapa: "conciliar",
      html: siguiente("Añadir partida de extracto", "Usa el extracto bancario para confirmar los datos. El importe y tipo se sugieren a partir del movimiento.",
        boton("Añadir partida de extracto", "extracto", m.id, true))
    };
  }

  function pasoCuenta(d, doc, saldo) {
    const accion = (etapa, titulo, texto, comando = etapa, id = doc.id) => ({
      etapa, html: siguiente(titulo, texto, boton(titulo, comando, id, true))
    });
    if (doc.tipo === "compra") {
      const pagos = pagosDe(d, doc);
      const aprobado = pagos.find(p => p.estado === "Aprobado" && p.fecha <= L.hoy());
      if (aprobado) return accion("confirmar", "Confirmar pago", "Registra la referencia cuando se haya efectuado el pago de " + moneda(aprobado.importe) + ".", "confirmar", aprobado.id);
      const programado = pagos.find(p => p.estado === "Programado" && puedeAprobar(p)) || pagos.find(p => p.estado === "Programado");
      if (programado) return puedeAprobar(programado)
        ? accion("aprobar", "Aprobar", "Revisa el importe, la fecha prevista y la cuenta antes de autorizar el pago " + programado.numero + ".", "aprobar", programado.id)
        : { etapa: "aprobar", html: siguiente("Esperar la aprobación", "Jefatura debe revisar la programación antes de confirmar el pago.") };
    }
    const movimiento = movimientoPendiente(d, doc);
    if (movimiento) return pasoBanco(d, movimiento);
    if (doc.tipo === "venta" && saldo > 0) return accion("cobrar", "Registrar cobro", "Aplica lo recibido a esta cuenta. Si es un cobro parcial, el saldo restante seguirá pendiente.", "cobro");
    const futuro = pagosDe(d, doc).filter(p => p.estado === "Aprobado").sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
    if (futuro) return { etapa: "confirmar", html: siguiente("Esperar la fecha prevista", "Puedes confirmar este pago desde el " + c.fechaCorta(futuro.fecha) + ".") };
    if (doc.tipo === "compra" && F.disponibleParaProgramar(d, doc) > 0) return accion("programar", "Programar pago", "Indica cuánto pagar, desde qué cuenta y en qué fecha.");

    const movimientos = F.movimientosDocumento(d, doc);
    const ultimo = movimientos.at(-1);
    const etapa = ultimo?.cuenta === "banco" ? "conciliar" : doc.tipo === "venta" ? "cobrar" : "confirmar";
    const asientoPendiente = movimientos.map(m => d.asientos.find(a => a.origen.clave === "movimiento:" + m.id && a.estado === "Pendiente"))
      .find(Boolean) || d.asientos.find(a => a.origen.clave === "documento:" + doc.id && a.estado === "Pendiente");
    if (doc.clase === "activo" && !d.activos.some(a => a.documentoId === doc.id)) {
      return { etapa, html: siguiente("Dar de alta el activo", "La compra está registrada. Contabilidad puede crear la ficha del bien y ponerlo en uso.",
        puede(rolesContabilidad) ? enlace("contabilidad/activos", "Ir a Activos fijos", true) : "") };
    }
    if (asientoPendiente) return { etapa, html: siguiente("Revisar el asiento", "Contabilidad revisa el asiento pendiente y lo incorpora a los libros.",
      puede(rolesContabilidad) ? enlace("contabilidad/asientos/" + asientoPendiente.id, "Abrir asiento", true) : "") };
    return { etapa, html: siguiente("Cuenta liquidada", "Puedes revisar su documento de origen y los movimientos aplicados en esta ficha.") };
  }

  function cuentas(d, cobrar) {
    const tipo = cobrar ? "venta" : "compra";
    const docs = deSede(d.documentos).filter(doc => doc.tipo === tipo).reverse();
    const acciones = cobrar
      ? (jefe() ? boton("Configurar crédito", "credito") : "")
      : boton("Incorporar factura verificada", "compra", "", true) + boton("Registrar compra de activo", "compra-activo");
    const filas = docs.map(doc => [
      enlace(F.rutaDocumento(doc), doc.referencia), e(doc.tercero), mostrarFecha(doc.vence), moneda(doc.total),
      moneda(F.saldo(d, doc)), c.etiqueta(F.estadoCuenta(d, doc))
    ]);
    return c.zonaTrabajo("Acciones de cuentas", etapasCuenta(cobrar, "documento") + cabecera(cobrar ? "Por cobrar" : "Por pagar",
      cobrar ? "Abre una cuenta para aplicar cobros a los comprobantes emitidos en Facturación." : "Incorpora una factura verificada o abre una cuenta para continuar su pago.", acciones))
      + c.zonaTrabajo("Cuentas registradas", tabla(cobrar ? "Cuentas de clientes" : "Cuentas de proveedores",
        ["Comprobante", cobrar ? "Cliente" : "Proveedor", "Vence", "Total", "Saldo", "Estado"], filas, true)
        + (cobrar && jefe() ? plegar("Consultar crédito de clientes", creditos()) : ""));
  }

  function creditos() {
    const clientes = window.ContratosComerciales.listarClientes();
    const filas = clientes.flatMap(cliente => {
      const inicial = window.FAMIHOGAR_RESPUESTAS.credito[cliente.id];
      const credito = F.consultarCredito(cliente.id, null, inicial);
      return credito ? [[e(cliente.nombre), moneda(credito.limite), moneda(credito.exposicion), moneda(credito.vencido)]] : [];
    });
    return tabla("Crédito de clientes", ["Cliente", "Límite", "Exposición", "Vencido"], filas);
  }

  function fichaCuenta(d, id, vista) {
    const doc = L.obtener(d.documentos, id, actor());
    L.exigir(F.rutaDocumento(doc) === "finanzas/" + vista + "/" + id, "El documento no corresponde a este listado.");
    const cobrar = doc.tipo === "venta";
    const saldo = F.saldo(d, doc);
    const paso = pasoCuenta(d, doc, saldo);
    const opcion = cobrar ? "cobro" : "programar";
    const disponible = cobrar ? saldo : F.disponibleParaProgramar(d, doc);
    const alternativa = disponible > 0 ? boton(cobrar ? "Registrar cobro" : "Programar pago", opcion, id) : "";
    const alta = doc.clase === "activo" && !d.activos.some(a => a.documentoId === doc.id) && puede(rolesContabilidad)
      ? enlace("contabilidad/activos", "Ir a Activos fijos") : "";
    const origen = cobrar ? enlace("comercial/pedidos/" + doc.origenId, doc.origenNumero)
      : doc.clase === "activo" ? e(doc.origenNumero) : enlace("logistica/facturas/" + doc.origenId, doc.origenNumero);
    const pares = [
      [cobrar ? "Cliente" : "Proveedor", e(doc.tercero)], ["Estado", c.etiqueta(F.estadoCuenta(d, doc))],
      ["Saldo pendiente", moneda(saldo)], ["Total", moneda(doc.total)], ["Vencimiento", mostrarFecha(doc.vence)],
      ["Asiento de origen", asiento(d, "documento:" + doc.id)]
    ];
    const datosOrigen = [
      ["Fecha del documento", mostrarFecha(doc.fecha)], ["Base", moneda(doc.base)], ["IGV", moneda(doc.igv)],
      [cobrar ? "Pedido" : doc.clase === "activo" ? "Constancia de recepción" : "Cotejo de Logística", origen]
    ];
    if (cobrar && puedeFacturar()) datosOrigen.push(["Comprobante", enlace(F.rutaComprobante(doc), doc.referencia)]);
    if (doc.fechaFactura) datosOrigen.push(["Fecha de factura del proveedor", mostrarFecha(doc.fechaFactura)]);
    if (doc.ordenId) datosOrigen.push(["Orden de compra", enlace("logistica/ordenes/" + doc.ordenId, doc.ordenNumero)], ["Recepciones conformes", e(doc.recepciones.join(", "))]);
    if (doc.entregas) datosOrigen.push(["Entregas", e(doc.entregas.join(", "))]);
    return c.zonaTrabajo("Acciones y datos de la cuenta", etapasCuenta(cobrar, paso.etapa)
      + cabecera(doc.referencia, doc.numero + " · " + (cobrar ? F.tiposComprobante[doc.tipoComprobante] || "Comprobante de venta" : doc.descripcion || "Factura de proveedor"), enlace("finanzas/" + vista, "← " + secciones[vista]))
      + paso.html + panel(detalle(pares) + (alternativa || alta ? botones(alternativa + alta) : "")
        + plegar("Datos y documentos de origen", detalle(datosOrigen))  + plegar("Historial del documento", c.mostrarHistorial(doc.historial))))
      + c.zonaTrabajo("Movimientos de la cuenta", (!cobrar ? pagos(d, doc) : "") + tabla(cobrar ? "Cobros aplicados" : "Pagos confirmados",
        ["Movimiento", "Fecha", "Cuenta", "Referencia", "Importe", "Asiento"], F.movimientosDocumento(d, doc).map(m => [
          e(m.numero), mostrarFecha(m.fecha), e(F.cuentas[m.cuenta].nombre), e(m.referencia), moneda(m.importe), asiento(d, "movimiento:" + m.id)
        ])));
  }

  function pagos(d, doc) {
    return tabla("Programación de pagos", ["Pago", "Fecha prevista", "Cuenta", "Importe", "Estado", "Acción"],
      pagosDe(d, doc).map(p => {
        const opcion = (titulo, comando) => boton(titulo, comando, p.id);
        let acciones = "";
        if (p.estado === "Programado" && puedeAprobar(p)) acciones = opcion("Aprobar", "aprobar") + opcion("Rechazar", "rechazar");
        if (p.estado === "Aprobado") acciones = opcion("Confirmar pago", "confirmar") + (puedeAprobar(p) ? opcion("Cancelar", "cancelar") : "");
        return [e(p.numero), mostrarFecha(p.fecha), e(F.cuentas[p.cuenta].nombre), moneda(p.importe), c.etiqueta(p.estado), acciones];
      }));
  }

  function caja(d, id) {
    const partidas = deSede(d.extractos);
    const pendientes = partidas.filter(x => !x.movimientoId);
    const coincidencias = new Map(pendientes.map(x => [x.id, F.coincidencias(d, x).length]));
    const focal = pendientes.find(x => x.id === id) || pendientes.find(x => coincidencias.get(x.id));
    const siguientePartida = !focal
      ? siguiente("Añadir partida de extracto", "Registra el importe, tipo y referencia del extracto. Después podrás compararla con los movimientos del ERP.", boton("Añadir partida de extracto", "extracto", "", true))
      : coincidencias.get(focal.id) ? siguiente("Conciliar " + focal.referencia, "Elige el movimiento bancario correspondiente y verifica su fecha y referencia.", boton("Conciliar", "conciliar", focal.id, true))
        : siguiente("Revisar " + focal.referencia, "Todavía no hay movimientos bancarios sin conciliar con el mismo tipo e importe. Revisa el extracto y los movimientos registrados.");
    const turno = F.turnoAbierto(d, actor().sede);
    const acciones = (turno ? boton("Cuadrar y cerrar caja", "cerrar-caja") : boton("Abrir turno de caja", "abrir-caja"))
      + (jefe() ? boton("Registrar fondo inicial", "fondo") : "") + boton("Añadir partida de extracto", "extracto");
    const saldos = Object.entries(F.cuentas).map(([id, a]) => [a.nombre, moneda(F.saldoCuenta(d, actor().sede, id))]);
    saldos.push(["Turno de caja", turno ? e(turno.numero + " · Abierto") : "Sin turno abierto"]);
    const movimientos = deSede(d.movimientos).reverse().map(m => {
      const doc = d.documentos.find(doc => doc.id === m.documentoId);
      return [doc ? enlace(F.rutaDocumento(doc), m.numero) : e(m.numero), mostrarFecha(m.fecha), e(F.cuentas[m.cuenta].nombre), e(m.tipo + " · " + m.referencia),
        m.direccion === "Ingreso" ? moneda(m.importe) : "—", m.direccion === "Egreso" ? moneda(m.importe) : "—", asiento(d, "movimiento:" + m.id)];
    });
    const extractos = partidas.slice().reverse().map(x => {
      const m = d.movimientos.find(m => m.id === x.movimientoId);
      return [mostrarFecha(x.fecha), e(x.referencia), e(x.direccion), moneda(x.importe),
        m ? e("Conciliada con " + m.numero) : boton("Conciliar", "conciliar", x.id)
          + (coincidencias.get(x.id) ? "" : "<small>Sin coincidencia de tipo e importe</small>")];
    });
    const turnos = deSede(d.turnos).filter(t => t.estado === "Cerrado").reverse().map(t => [
      e(t.numero), mostrarFecha(t.fecha), moneda(t.inicial), moneda(t.esperado), moneda(t.contado), moneda(t.diferencia), e(t.motivo || "—")
    ]);
    return c.zonaTrabajo("Operaciones y saldos", cabecera("Caja y bancos", "Consulta los saldos, cuadra el efectivo y concilia movimientos con el extracto.", acciones)
      + siguientePartida + panel(detalle(saldos)))
      + c.zonaTrabajo("Extractos y movimientos de tesorería", tabla("Extracto bancario", ["Fecha", "Referencia", "Tipo", "Importe", "Conciliación"], extractos)
      + plegar("Movimientos de tesorería", tabla("Movimientos registrados", ["Movimiento", "Fecha", "Cuenta", "Concepto y referencia", "Entrada", "Salida", "Asiento"], movimientos, true))
      + plegar("Cuadres de caja", tabla("Turnos cerrados", ["Turno", "Fecha", "Inicial", "Esperado", "Contado", "Diferencia", "Explicación"], turnos)));
  }

  function elegir(lista, mensaje) {
    L.exigir(lista.length, mensaje);
    return lista;
  }

  function compra(d) {
    const candidatos = elegir(F.comprasDisponibles(d, actor().sede), "Las facturas verificadas por Logística aparecen aquí cuando todavía no tienen una cuenta por pagar.");
    formulario("Incorporar factura verificada", [
      campo("Factura de proveedor", opciones("factura", candidatos.map(f => [f.id, f.documento + " · " + f.proveedor + " · " + moneda(f.base + f.igv)]))),
      campo("Fecha de registro", fecha()), campo("Vencimiento", fecha("vence", ""))
    ], v => F.rutaDocumento(ejecutar((d, a) => F.registrarCompra(d, a, { facturaId: v.get("factura"), fecha: v.get("fecha"), vence: v.get("vence") }))));
    const factura = c.$("#lib-factura");
    const llenarVencimiento = () => {
      const f = candidatos.find(x => x.id === factura.value);
      const dias = Number(f?.condicion?.match(/\d+/)?.[0] || 0);
      c.$("#lib-vence").value = f?.fecha ? L.sumarDias(f.fecha, dias) : "";
    };
    factura.addEventListener("change", llenarVencimiento);
    llenarVencimiento();
  }

  function compraActivo() {
    const proveedores = elegir(window.ContratosLogisticos.listarProveedoresAprobados(), "Se necesita un proveedor aprobado en Logística.");
    formulario("Registrar compra de activo fijo", [
      campo("Proveedor", opciones("proveedor", proveedores.map(p => [p.id, p.nombre]))),
      campo("Factura del proveedor", input("referencia")), campo("Constancia de recepción", input("recepcion")), campo("Descripción del bien", input("descripcion")),
      campo("Fecha de compra", fecha()), campo("Vencimiento", fecha("vence")), campo("Base en soles", monto("base")), campo("IGV en soles", monto("igv", "0.00"))
    ], v => F.rutaDocumento(ejecutar((d, a) => F.registrarCompraActivo(d, a, { ...Object.fromEntries(v), proveedorId: v.get("proveedor"),
      base: soles(v.get("base")), igv: soles(v.get("igv")) }))));
  }

  function credito() {
    const clientes = elegir(window.ContratosComerciales.listarClientes(), "Se necesita un cliente aprobado en Comercial.");
    formulario("Configurar límite de crédito", [
      campo("Cliente", opciones("cliente", clientes.map(x => [x.id, x.nombre]))), campo("Nuevo límite en soles", monto()),
      campo("Motivo", input("motivo"))
    ], v => {
      ejecutar((d, a) => F.fijarCredito(d, a, { clienteId: v.get("cliente"), limite: soles(v.get("importe")), motivo: v.get("motivo") }));
      return "finanzas/cobrar";
    });
  }

  function operacionCuenta(comando, id, d) {
    const doc = L.obtener(d.documentos, id, actor());
    const cobrar = comando === "cobro";
    const importe = cobrar ? F.saldo(d, doc) : F.disponibleParaProgramar(d, doc);
    const campos = cobrar ? camposBanco() : [campo("Fecha prevista", fecha())];
    const cuentaSugerida = F.movimientosDocumento(d, doc).at(-1)?.cuenta || (!F.turnoAbierto(d, actor().sede) ? "banco" : "");
    formulario((cobrar ? "Registrar cobro" : "Programar pago") + " · " + doc.referencia, [
      campo("Importe en soles", monto("importe", (importe / 100).toFixed(2))), campoCuenta(cuentaSugerida), ...campos
    ], v => {
      const entrada = { ...datosBanco(v), importe: soles(v.get("importe")), cuenta: v.get("cuenta") };
      ejecutar((d, a) => cobrar ? F.cobrar(d, a, id, entrada) : F.programarPago(d, a, id, entrada));
      return F.rutaDocumento(doc);
    }, cobrar ? "Registrar cobro" : "Programar pago", cobrar
      ? "Confirma el importe realmente recibido. Para efectivo, usa un turno de caja abierto en la fecha del cobro."
      : "La programación reserva parte de la deuda. Después se aprueba y se confirma el pago desde esta ficha.");
  }

  function operarPago(comando, id, d) {
    const p = L.obtener(d.pagos, id, actor());
    const doc = L.obtener(d.documentos, p.documentoId, actor());
    const destino = F.rutaDocumento(doc);
    if (comando === "confirmar") {
      formulario("Confirmar pago · " + p.numero, camposBanco(), v => {
        ejecutar((d, a) => F.confirmarPago(d, a, id, datosBanco(v)));
        return destino;
      }, "Confirmar pago", "Importe " + moneda(p.importe) + " · " + F.cuentas[p.cuenta].nombre + ". Registra la referencia del pago efectuado.");
      return;
    }
    const decisiones = { aprobar: ["Aprobar", "Aprobado"], rechazar: ["Rechazar", "Rechazado"], cancelar: ["Cancelar", "Cancelado"] };
    const [verbo, estado] = decisiones[comando];
    formulario(verbo + " pago · " + p.numero, [campo("Motivo", input("motivo"))], v => {
      ejecutar((d, a) => F.decidirPago(d, a, id, estado, v.get("motivo")));
      return destino;
    });
  }

  function operacionesCaja(comando, id, d) {
    if (comando === "abrir-caja") {
      ejecutar(F.abrirTurno);
      c.finalizarOperacion(rutaCaja, "Turno de caja abierto.");
    }
    if (comando === "cerrar-caja") {
      const turno = F.turnoAbierto(d, actor().sede);
      L.exigir(turno, "No hay un turno abierto.");
      const esperado = F.saldoCuenta(d, actor().sede, "caja", turno.fecha);
      formulario("Cuadrar caja · Esperado " + moneda(esperado), [
        campo("Efectivo contado en soles", monto()), campo("Motivo en caso de diferencia", input("motivo", "text", "", 'maxlength="300"'))
      ], v => {
        ejecutar((d, a) => F.cerrarTurno(d, a, soles(v.get("importe")), v.get("motivo")));
        return rutaCaja;
      });
    }
    if (comando === "fondo") {
      formulario("Registrar fondo inicial", [campoCuenta(), ...camposBanco(), campo("Importe en soles", monto())], v => {
        ejecutar((d, a) => F.fondoInicial(d, a, { ...datosBanco(v), cuenta: v.get("cuenta"), importe: soles(v.get("importe")) }));
        return rutaCaja;
      });
    }
    if (comando === "extracto") {
      const origen = id ? L.obtener(d.movimientos, id, actor()) : null;
      formulario("Añadir partida de extracto bancario", [...camposBanco(origen?.fecha || L.hoy(), "Referencia del extracto"),
        campo("Tipo", opciones("direccion", [["Ingreso", "Ingreso"], ["Egreso", "Egreso"]], origen?.direccion)),
        campo("Importe en soles", monto("importe", origen ? (origen.importe / 100).toFixed(2) : ""))
      ], v => {
        const partida = ejecutar((d, a) => F.registrarExtracto(d, a, { ...datosBanco(v), direccion: v.get("direccion"), importe: soles(v.get("importe")) }));
        return rutaCaja + "/" + partida.id;
      }, "Guardar partida", origen ? "Movimiento " + origen.referencia + ". Contrasta la fecha, el tipo y el importe con el extracto y escribe su referencia." : "Copia los datos tal como figuran en el extracto bancario.");
    }
    if (comando === "conciliar") {
      const x = L.obtener(d.extractos, id, actor());
      const candidatos = elegir(F.coincidencias(d, x), "No hay movimientos bancarios sin conciliar por ese importe y tipo.");
      formulario("Conciliar · " + x.referencia, [campo("Movimiento bancario del ERP", opciones("movimiento", candidatos.map(m => [
        m.id, m.numero + " · " + c.fechaCorta(m.fecha) + " · " + m.referencia + " · " + moneda(m.importe)
      ])))], v => {
        ejecutar((d, a) => F.conciliar(d, a, id, v.get("movimiento")));
        return rutaCaja;
      });
    }
  }

  function vista(seccion, id, d) {
    if (seccion === "caja") return caja(d, id);
    if (id) return fichaCuenta(d, id, seccion);
    return cuentas(d, seccion === "cobrar");
  }

  function accion(comando, id, d) {
    const acciones = {
      compra: () => compra(d), "compra-activo": compraActivo, credito,
      cobro: () => operacionCuenta(comando, id, d), programar: () => operacionCuenta(comando, id, d),
      aprobar: () => operarPago(comando, id, d), rechazar: () => operarPago(comando, id, d),
      cancelar: () => operarPago(comando, id, d), confirmar: () => operarPago(comando, id, d)
    };
    if (Object.hasOwn(acciones, comando)) acciones[comando]();
    else operacionesCaja(comando, id, d);
  }

  return { roles, secciones, vista, accion };
};
