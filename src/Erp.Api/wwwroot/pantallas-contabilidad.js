"use strict";

window.PantallasContabilidad = ui => {
  const { c, L, e, actor, puede, enlace, boton, campo, input, opciones, fecha, monto, soles, detalle, panel, plegar, siguiente, cabecera, tabla, ejecutar, formulario } = ui;
  const C = window.Contabilidad;
  const roles = ["Contabilidad", "Jefatura"];
  const secciones = { asientos: "Asientos", activos: "Activos fijos", cierre: "Cierre y libros" };
  const deSede = lista => L.enSede(lista, actor().sede);
  const mesActual = () => L.hoy().slice(0, 7);
  const ultimoMes = () => L.sumarDias(mesActual() + "-01", -1).slice(0, 7);
  const dinero = c.moneda;
  const fechaCorta = f => e(c.fechaCorta(f));
  const rutaAsiento = id => "contabilidad/asientos/" + id;
  const rutaActivo = id => "contabilidad/activos/" + id;
  const rutaCierre = mes => "contabilidad/cierre/" + mes;
  const puedeFinanzas = () => puede(["Tesorería", "Jefatura"]);
  const nombreMes = mes => new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(mes + "-01T12:00:00Z"));
  const etapasAsiento = actual => c.recorrido.etapas("Recorrido contable", [
    { id: "revisar", etiqueta: "Revisar asiento", ruta: "contabilidad/asientos" },
    { id: "contabilizar", etiqueta: "Contabilizar" },
    { id: "libros", etiqueta: "Consultar libros y cierre", ruta: "contabilidad/cierre" }
  ], actual);
  const etapasActivo = actual => c.recorrido.etapas("Recorrido del activo", [
    { id: "compra", etiqueta: "Registrar compra", ruta: puedeFinanzas() ? "finanzas/pagar" : "", responsable: puedeFinanzas() ? "" : "Finanzas" },
    { id: "alta", etiqueta: "Dar de alta", ruta: "contabilidad/activos" }, { id: "uso", etiqueta: "Poner en uso" }, { id: "depreciar", etiqueta: "Generar depreciación" },
    { id: "asiento", etiqueta: "Contabilizar", ruta: "contabilidad/asientos" }
  ], actual);

  function asientos(d) {
    const asientos = deSede(d.asientos).reverse();
    const pendientes = asientos.filter(a => a.estado === "Pendiente");
    const registro = pendientes[0];
    const paso = registro ? siguiente("Revisar asientos pendientes", "Abre un asiento y compara su origen, fecha, Debe y Haber. Pendientes en esta sede: " + pendientes.length + ".",
      enlace(rutaAsiento(registro.id), "Abrir asiento pendiente", true))
      : siguiente("Consultar los libros", "Los asientos contabilizados se pueden ver por período en Cierre y libros.", enlace("contabilidad/cierre", "Ir a Cierre y libros", true));
    const apertura = !asientos.some(a => a.origen.clave === "inventario-inicial") ? boton("Incorporar inventario inicial", "apertura") : "";
    const filas = [...pendientes, ...asientos.filter(a => a.estado !== "Pendiente")].map(a => [
      enlace(rutaAsiento(a.id), a.numero), fechaCorta(a.fecha), e(a.concepto), e(a.origen.numero),
      dinero(L.totales(a.lineas).debe), c.etiqueta(a.estado)
    ]);
    return c.zonaTrabajo("Revisión de asientos", etapasAsiento("revisar") + cabecera("Asientos", "Los asientos pendientes aparecen primero.", apertura) + paso)
      + c.zonaTrabajo("Asientos registrados", tabla("Registro de asientos", ["Asiento", "Fecha", "Operación", "Referencia", "Importe del Debe", "Estado"], filas, true));
  }

  function fichaAsiento(d, id) {
    const a = L.obtener(d.asientos, id, actor());
    const total = L.totales(a.lineas);
    const filas = a.lineas.map(l => [e(l.cuenta + " · " + L.cuentas[l.cuenta]), l.debe ? dinero(l.debe) : "—", l.haber ? dinero(l.haber) : "—"]);
    filas.push(["<strong>Total</strong>", "<strong>" + dinero(total.debe) + "</strong>", "<strong>" + dinero(total.haber) + "</strong>"]);
    const mes = a.fecha.slice(0, 7);
    const otro = deSede(d.asientos).find(x => x.id !== id && x.estado === "Pendiente" && x.fecha.slice(0, 7) === mes);
    const cuadre = total.debe > 0 && total.debe === total.haber;
    const pendiente = a.estado === "Pendiente";
    const paso = pendiente ? siguiente(cuadre ? "Contabilizar" : "Revisar el cuadre",
      cuadre ? "Comprueba el comprobante de origen y las cuentas. Debe y Haber suman " + dinero(total.debe) + " cada uno."
        : "Los importes deben ser iguales antes de contabilizar.",
      cuadre ? boton("Contabilizar", "contabilizar", id, true) : "")
      : otro ? siguiente("Revisar el siguiente asiento", "Este asiento ya está en libros. Quedan operaciones pendientes del mismo período.",
        enlace(rutaAsiento(otro.id), "Abrir siguiente pendiente", true))
      : siguiente("Ver libros del período", "El asiento está contabilizado y se puede consultar en el diario y el mayor.",
        enlace(rutaCierre(mes), "Ver libros del período", true));
    return c.zonaTrabajo("Revisión del asiento", etapasAsiento(pendiente ? "contabilizar" : "libros") + cabecera(a.numero, a.concepto, enlace("contabilidad/asientos", "← Asientos"))
      + paso + panel(detalle([
        ["Estado", c.etiqueta(a.estado)], ["Fecha", fechaCorta(a.fecha)], ["Origen", enlace(a.origen.ruta, a.origen.numero)]
      ]) + plegar("Historial del asiento", c.mostrarHistorial(a.historial))))
      + c.zonaTrabajo("Detalle contable", tabla("Detalle contable", ["Cuenta", "Debe", "Haber"], filas));
  }

  function activos(d) {
    const lista = deSede(d.activos).reverse();
    const sinAlta = C.comprasSinAlta(d, actor().sede);
    const sinUso = lista.find(a => !a.enUso);
    const meses = C.periodosPorDepreciar(d, actor().sede);
    let etapa = "compra";
    let paso = siguiente("Registrar la compra del activo", "El alta parte de un comprobante de compra registrado en Finanzas.",
      puedeFinanzas() ? enlace("finanzas/pagar", "Ir a Por pagar", true) : "");
    if (sinAlta.length) {
      etapa = "alta";
      paso = siguiente("Dar de alta un activo", "Selecciona una compra disponible y completa los datos del bien.",
        boton("Dar de alta un activo", "alta", "", true));
    } else if (sinUso) {
      etapa = "uso";
      paso = siguiente("Poner en uso el activo", "Abre " + sinUso.codigo + " para registrar cuándo empezó a utilizarse.",
        enlace(rutaActivo(sinUso.id), "Abrir " + sinUso.codigo, true));
    } else if (meses.length) {
      etapa = "depreciar";
      paso = siguiente("Generar depreciación mensual", "Elige un mes terminado con depreciación pendiente. Después revisa el asiento generado.",
        boton("Generar depreciación mensual", "depreciar", "", true));
    } else if (lista.length) {
      etapa = "asiento";
      paso = siguiente("Revisar asientos de activos", "Los activos en uso están al día en los períodos disponibles para depreciar.", enlace("contabilidad/asientos", "Ir a Asientos", true));
    }
    const acciones = boton("Dar de alta un activo", "alta") + boton("Generar depreciación mensual", "depreciar");
    const filas = lista.map(a => [
      enlace(rutaActivo(a.id), a.codigo), e(a.descripcion), e(a.responsable), e(a.ubicacion), dinero(a.costo), a.enUso ? "En uso" : "Pendiente de puesta en uso"
    ]);
    return c.zonaTrabajo("Acciones de activos fijos", etapasActivo(etapa) + cabecera("Activos fijos", "De la compra al alta, puesta en uso y depreciación.", acciones) + paso)
      + c.zonaTrabajo("Bienes registrados", tabla("Bienes registrados", ["Código", "Bien", "Responsable", "Ubicación", "Costo", "Estado"], filas, true));
  }

  function fichaActivo(d, id) {
    const a = L.obtener(d.activos, id, actor());
    const doc = L.obtener(d.documentos, a.documentoId, actor());
    const pendiente = a.depreciaciones.map(r => d.asientos.find(s => s.id === r.asientoId && s.estado === "Pendiente")).find(Boolean);
    const meses = C.periodosPorDepreciar(d, actor().sede, [a]);
    const etapa = !a.enUso ? "uso" : pendiente ? "asiento" : "depreciar";
    const paso = !a.enUso ? siguiente("Poner en uso", "Registra la fecha en que el bien empezó a utilizarse. El cálculo considera meses completos.", boton("Poner en uso", "activar", id, true))
      : pendiente ? siguiente("Revisar el asiento de depreciación", "Abre el asiento generado para revisar los importes antes de contabilizarlo.",
        enlace(rutaAsiento(pendiente.id), "Abrir asiento", true))
      : meses.length ? siguiente("Generar depreciación mensual", "Elige un mes con depreciación pendiente. La operación incluye los activos elegibles de la sede.",
        boton("Generar depreciación mensual", "depreciar", meses.at(-1), true))
      : siguiente("Consultar depreciaciones", "Los meses terminados que corresponden a este activo están al día.");
    const contabilizada = a.depreciaciones.filter(r => d.asientos.some(s => s.id === r.asientoId && s.estado === "Contabilizado"))
      .reduce((total, r) => total + r.importe, 0);
    const filas = a.depreciaciones.map(r => {
      const asiento = d.asientos.find(s => s.id === r.asientoId);
      return [e(r.mes), dinero(r.importe), c.etiqueta(asiento.estado), enlace(rutaAsiento(asiento.id), asiento.numero)];
    });
    return c.zonaTrabajo("Acciones y datos del activo", etapasActivo(etapa) + cabecera(a.codigo, a.descripcion, enlace("contabilidad/activos", "← Activos fijos"))
      + paso + panel(detalle([
        ["Compra", enlace(window.Finanzas.rutaDocumento(doc), doc.referencia)], ["En uso desde", a.enUso ? fechaCorta(a.enUso) : "Pendiente"],
        ["Ubicación", e(a.ubicacion)], ["Responsable", e(a.responsable)], ["Costo", dinero(a.costo)], ["Valor residual", dinero(a.residual)],
        ["Vida útil", e(a.vida) + " meses"], ["Método", "Línea recta por mes completo"], ["Depreciación contabilizada", dinero(contabilizada)],
        ["Costo menos depreciación contabilizada", dinero(a.costo - contabilizada)]
      ]) + plegar("Historial del activo", c.mostrarHistorial(a.historial))))
      + c.zonaTrabajo("Depreciaciones del activo", tabla("Depreciaciones por período", ["Período", "Importe", "Estado", "Asiento"], filas));
  }

  function accionCierre(tarea, mes, periodoTerminado) {
    if (tarea.tipo === "asiento") return enlace(rutaAsiento(tarea.id), "Abrir asiento pendiente", true);
    if (tarea.tipo === "depreciacion" && periodoTerminado) {
      return boton("Generar depreciación mensual", "depreciar", mes, true);
    }
    if (puedeFinanzas() && ["turno", "extracto"].includes(tarea.tipo)) {
      return enlace("finanzas/caja" + (tarea.id ? "/" + tarea.id : ""), "Ir a Caja y bancos", true);
    }
    return "";
  }

  function cierre(d, id) {
    const mes = L.mesValido(id) ? id : mesActual();
    const cerrado = d.cierres.find(p => p.sede === actor().sede && p.mes === mes);
    const diario = C.diario(d, actor().sede, mes);
    const balance = C.balances(d, actor().sede, mes);
    const pendientes = C.tareasCierre(d, actor().sede, mes);
    const fin = L.finMes(mes);
    const mostrarPaso = cerrado ? siguiente("Período cerrado", "Puedes consultar los libros de " + nombreMes(mes) + ".")
      : pendientes.length ? siguiente("Resolver pendientes del período", pendientes[0].mensaje, accionCierre(pendientes[0], mes, fin <= L.hoy()))
      : fin < L.hoy() ? siguiente("Cerrar período", "El mes terminó y los controles de cierre están completos.")
      : siguiente("Consultar los libros", "Puedes revisar los movimientos de este mes. El cierre se habilita al terminar el período.");
    const meses = [...new Set([mes, mesActual(), ultimoMes(), ...deSede(d.cierres).map(p => p.mes),
      ...deSede(d.asientos).map(a => a.fecha.slice(0, 7)), ...deSede(d.turnos).map(t => t.fecha.slice(0, 7)),
      ...deSede(d.extractos).map(x => x.fecha.slice(0, 7)), ...C.periodosPorDepreciar(d, actor().sede)])].sort().reverse();
    const camposPeriodo = campo("Período", opciones("periodo-vista", [...meses.map(m => [m, nombreMes(m)]), ["otro", "Otro período…"]], mes))
      + campo("Otro período", input("periodo-manual", "month", mes, ""), true);
    const saldo = n => n > 0 ? dinero(n) + " deudor" : n < 0 ? dinero(-n) + " acreedor" : dinero(0);
    const filasBalance = balance.filter(a => a.inicial || a.debe || a.haber).map(a => [
      e(a.cuenta + " · " + a.nombre), saldo(a.inicial), dinero(a.debe), dinero(a.haber), saldo(a.final)
    ]);
    const saldos = L.totales(balance);
    filasBalance.push(["<strong>Total del período</strong>", "—", dinero(saldos.debe), dinero(saldos.haber), "—"]);
    const filasDiario = diario.flatMap(a => a.lineas.map(l => [
      fechaCorta(a.fecha), enlace(rutaAsiento(a.id), a.numero), e(a.concepto), e(l.cuenta + " · " + L.cuentas[l.cuenta]),
      l.debe ? dinero(l.debe) : "—", l.haber ? dinero(l.haber) : "—"
    ]));
    const libroMayor = balance.filter(a => a.inicial || a.debe || a.haber).map(a => {
      let acumulado = a.inicial;
      const filas = diario.flatMap(registro => registro.lineas.filter(l => l.cuenta === a.cuenta).map(l => {
        acumulado += l.debe - l.haber;
        return [fechaCorta(registro.fecha), enlace(rutaAsiento(registro.id), registro.numero), dinero(l.debe), dinero(l.haber), saldo(acumulado)];
      }));
      return `<details><summary>${e(a.cuenta + " · " + a.nombre)} · ${saldo(a.final)}</summary>${tabla("Movimientos de la cuenta", ["Fecha", "Asiento", "Debe", "Haber", "Saldo"], filas)}</details>`;
    }).join("") || "<p>Sin movimientos contabilizados para el período.</p>";
    return c.zonaTrabajo("Revisión y cierre del período", etapasAsiento("libros") + cabecera("Cierre y libros", "Elige un período para consultar sus movimientos y revisar el cierre.",
      cerrado ? "" : boton("Cerrar período", "cerrar-periodo", mes))
      + mostrarPaso + panel(`<div class="campos">${camposPeriodo}</div>`
        + detalle([["Estado del período", c.etiqueta(cerrado ? "Cerrado" : "Abierto")], ["Asientos contabilizados", e(diario.length)]])
        + (pendientes.length ? "<ul>" + pendientes.map(p => "<li>" + e(p.mensaje) + "</li>").join("") + "</ul>" : "<p>Sin pendientes de cierre registrados.</p>")
        + (cerrado ? c.mostrarHistorial(cerrado.historial) : "")))
      + c.zonaTrabajo("Balance y libros del período", tabla("Balance de comprobación", ["Cuenta", "Saldo inicial", "Debe del período", "Haber del período", "Saldo final"], filasBalance)
      + plegar("Libro diario", tabla("Operaciones del período", ["Fecha", "Asiento", "Concepto", "Cuenta", "Debe", "Haber"], filasDiario))
      + plegar("Libro mayor", panel(libroMayor)));
  }

  function alta(d) {
    const compras = C.comprasSinAlta(d, actor().sede);
    L.exigir(compras.length, "Registra primero la compra del activo en Finanzas → Por pagar.");
    formulario("Dar de alta un activo fijo", [
      campo("Compra del activo", opciones("documento", compras.map(doc => [doc.id, doc.referencia + " · " + doc.descripcion]))),
      campo("Código interno", input("codigo")), campo("Ubicación", input("ubicacion")), campo("Responsable", input("responsable")),
      campo("Vida útil en meses", input("vida", "number", "", 'required min="1" max="600" step="1"')),
      campo("Valor residual en soles", monto("residual", "0.00"))
    ], v => {
      const a = ejecutar((d, actor) => C.alta(d, actor, { ...Object.fromEntries(v), documentoId: v.get("documento"),
        vida: Number(v.get("vida")), residual: soles(v.get("residual")) }));
      return rutaActivo(a.id);
    });
  }

  function vista(seccion, id, d) {
    if (seccion === "cierre") return cierre(d, id);
    if (seccion === "asientos") return id ? fichaAsiento(d, id) : asientos(d);
    return id ? fichaActivo(d, id) : activos(d);
  }

  function accion(comando, id, d) {
    if (comando === "contabilizar") {
      ejecutar((d, a) => C.contabilizar(d, a, id));
      c.finalizarOperacion(rutaAsiento(id), "Asiento contabilizado.");
    }
    if (comando === "apertura") {
      const apertura = window.ContratosLogisticos.consultarInventarioInicial(actor().sede);
      L.exigir(apertura.fecha, "La sede no tiene inventario inicial.");
      formulario("Incorporar inventario inicial", [campo("Fecha de apertura", fecha("fecha", apertura.fecha))], v => {
        const asiento = ejecutar((d, a) => C.incorporarInventarioInicial(d, a, v.get("fecha")));
        return rutaAsiento(asiento.id);
      });
    }
    if (comando === "alta") alta(d);
    if (comando === "activar") {
      const activo = L.obtener(d.activos, id, actor());
      formulario("Poner activo en uso", [campo("Fecha de puesta en uso", input("fecha", "date", L.hoy(),
        `required min="${e(activo.fechaCompra)}" max="${e(L.hoy())}"`))], v => {
        ejecutar((d, a) => C.ponerEnUso(d, a, id, v.get("fecha")));
        return rutaActivo(id);
      }, "Poner en uso", "Indica la fecha en que el bien empezó a utilizarse. Debe ser igual o posterior a su compra.");
    }
    if (comando === "depreciar") {
      const meses = C.periodosPorDepreciar(d, actor().sede);
      L.exigir(meses.length, "No hay períodos abiertos con depreciación pendiente.");
      const elegido = meses.includes(id) ? id : meses.at(-1);
      formulario("Generar depreciación mensual", [campo("Período terminado", opciones("mes", meses.map(m => [m, nombreMes(m)]), elegido))], v => {
        const asientos = ejecutar((d, a) => C.depreciar(d, a, v.get("mes")));
        return asientos.length === 1 ? rutaAsiento(asientos[0].id) : "contabilidad/asientos";
      }, "Generar asientos", "Se muestran los meses terminados con depreciación por generar. Revisa el asiento antes de contabilizar.");
    }
    if (comando === "cerrar-periodo") {
      const pendientes = C.tareasCierre(d, actor().sede, id);
      const orientacion = L.finMes(id) >= L.hoy() ? "El cierre se puede confirmar cuando termine el período."
        : pendientes.map(tarea => tarea.mensaje).join(" ");
      formulario("Cerrar período " + id, [campo("Observación de cierre", input("motivo"))], v => {
        ejecutar((d, a) => C.cerrarPeriodo(d, a, id, v.get("motivo")));
        return "contabilidad/cierre/" + id;
      }, "Confirmar cierre", orientacion);
    }
  }

  return { roles, secciones, vista, accion };
};
