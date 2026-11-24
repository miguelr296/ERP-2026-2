"use strict";

window.Contabilidad = (() => {
  const L = window.Libros;
  const permitir = actor => L.permitir(actor, ["Contabilidad", "Jefatura"]);
  const asientoEnSede = (d, actor, id) => L.obtener(d.asientos, id, actor);

  function contabilizar(d, actor, id) {
    permitir(actor);
    const a = asientoEnSede(d, actor, id);
    L.exigir(a.estado === "Pendiente", "El asiento ya fue contabilizado.");
    L.fechaOperacion(d, actor, a.fecha);
    const { debe, haber } = L.totales(a.lineas);
    L.exigir(L.entero(debe, 1) && debe === haber, "El Debe y el Haber deben cuadrar.");
    a.estado = "Contabilizado";
    L.evento(a, actor, "Asiento contabilizado");
    return a;
  }

  function incorporarInventarioInicial(d, actor, fecha) {
    permitir(actor);
    const apertura = window.ContratosLogisticos.consultarInventarioInicial(actor.sede);
    L.exigir(L.entero(apertura.valor, 1), "La sede no tiene existencias iniciales valorizadas.");
    L.fechaOperacion(d, actor, fecha, apertura.fecha);
    const primerMovimiento = d.asientos.filter(a => a.sede === actor.sede && a.lineas.some(l => l.cuenta === "20")).map(a => a.fecha).sort()[0];
    L.exigir(!primerMovimiento || fecha <= primerMovimiento, "La apertura debe tener fecha igual o anterior al primer registro de mercaderías.");
    return L.proponer(d, actor, { clave: "inventario-inicial", numero: "Saldo inicial de Logística", ruta: "logistica/inventario" },
      fecha, "Apertura de inventario", [L.linea("20", apertura.valor), L.linea("59", 0, apertura.valor)]);
  }

  function comprasSinAlta(d, sede) {
    return L.enSede(d.documentos, sede).filter(x => x.clase === "activo" && !d.activos.some(a => a.documentoId === x.id));
  }

  function alta(d, actor, entrada) {
    permitir(actor);
    const doc = comprasSinAlta(d, actor.sede).find(x => x.id === entrada.documentoId);
    L.exigir(doc, "Selecciona una compra de activo que aún no tenga ficha.");
    L.exigir(L.entero(entrada.vida, 1) && entrada.vida <= 600 && L.entero(entrada.residual) && entrada.residual <= doc.base, "La vida útil debe ser de 1 a 600 meses y el residual no puede superar el costo.");
    const codigo = L.texto(entrada.codigo, "Código interno").toUpperCase();
    L.exigir(!L.enSede(d.activos, actor.sede).some(a => a.codigo === codigo), "El código de activo ya existe en esta sede.");
    return L.crear(d.activos, "AF", { documentoId: doc.id, codigo, descripcion: doc.descripcion, costo: doc.base, vida: entrada.vida, residual: entrada.residual,
      ubicacion: L.texto(entrada.ubicacion, "Ubicación"), responsable: L.texto(entrada.responsable, "Responsable"),
      fechaCompra: doc.fecha, enUso: null, depreciaciones: [] }, actor, "Alta desde la compra " + doc.referencia);
  }

  function ponerEnUso(d, actor, id, fecha) {
    permitir(actor);
    const a = L.obtener(d.activos, id, actor);
    L.exigir(!a.enUso, "El activo ya está en uso.");
    L.fechaOperacion(d, actor, fecha, a.fechaCompra);
    a.enUso = fecha;
    L.evento(a, actor, "Puesta en uso el " + fecha);
    return a;
  }

  const indiceMes = mes => Number(mes.slice(0, 4)) * 12 + Number(mes.slice(5, 7)) - 1;
  function depreciacionDelMes(a, mes) {
    if (!a.enUso || !L.mesValido(mes) || a.depreciaciones.some(r => r.mes === mes)) return 0;
    const mesParcial = a.enUso.endsWith("-01") ? 0 : 1;
    const nro = indiceMes(mes) - indiceMes(a.enUso.slice(0, 7)) - mesParcial + 1;
    if (nro < 1 || nro > a.vida) return 0;
    const base = BigInt(a.costo - a.residual), vida = BigInt(a.vida);
    const acumulado = meses => (base * BigInt(meses) * 2n + vida) / (vida * 2n);
    return Number(acumulado(nro) - acumulado(nro - 1));
  }

  function depreciar(d, actor, mes) {
    permitir(actor);
    L.exigir(L.mesValido(mes), "Selecciona el período a depreciar.");
    const fecha = L.finMes(mes);
    L.fechaOperacion(d, actor, fecha);
    const pendientes = L.enSede(d.activos, actor.sede).map(a => ({ a, importe: depreciacionDelMes(a, mes) })).filter(x => x.importe > 0);
    L.exigir(pendientes.length, "Este período no tiene depreciaciones por generar.");
    return pendientes.map(({ a, importe }) => {
      const asiento = L.proponer(d, actor, { clave: "depreciacion:" + a.id + ":" + mes, numero: a.numero, ruta: "contabilidad/activos/" + a.id },
        fecha, "Depreciación de " + a.descripcion, [L.linea("68", importe), L.linea("39", 0, importe)]);
      a.depreciaciones.push({ mes, importe, asientoId: asiento.id });
      L.evento(a, actor, "Depreciación generada: " + asiento.numero);
      return asiento;
    });
  }

  function periodosPorDepreciar(d, sede, activos = L.enSede(d.activos, sede)) {
    const opciones = new Set();
    const cerrados = new Set(L.enSede(d.cierres, sede).map(p => p.mes));
    const hoy = L.hoy();
    for (const a of activos.filter(a => a.enUso)) {
      let mes = a.enUso.slice(0, 7);
      for (let i = 0; i <= a.vida && L.finMes(mes) <= hoy; i++) {
        if (!cerrados.has(mes) && depreciacionDelMes(a, mes)) opciones.add(mes);
        mes = L.sumarDias(L.finMes(mes), 1).slice(0, 7);
      }
    }
    return [...opciones].sort();
  }

  function tareasCierre(d, sede, mes) {
    const tareas = [];
    const asiento = L.enSede(d.asientos, sede).find(a => a.fecha.slice(0, 7) === mes && a.estado === "Pendiente");
    if (asiento) tareas.push({ tipo: "asiento", id: asiento.id, mensaje: "Hay asientos pendientes de contabilizar." });
    if (L.enSede(d.activos, sede).some(a => depreciacionDelMes(a, mes))) {
      tareas.push({ tipo: "depreciacion", mensaje: "Hay activos con depreciación pendiente." });
    }
    if (L.enSede(d.turnos, sede).some(t => t.fecha.slice(0, 7) === mes && t.estado === "Abierto")) {
      tareas.push({ tipo: "turno", mensaje: "Hay un turno de caja abierto." });
    }
    const extracto = L.enSede(d.extractos, sede).find(e => e.fecha.slice(0, 7) === mes && !e.movimientoId);
    if (extracto) tareas.push({ tipo: "extracto", id: extracto.id, mensaje: "Hay partidas del extracto sin conciliar." });
    return tareas;
  }

  const pendientesCierre = (d, sede, mes) => tareasCierre(d, sede, mes).map(t => t.mensaje);

  function cerrarPeriodo(d, actor, mes, motivo) {
    permitir(actor);
    L.exigir(L.mesValido(mes) && L.finMes(mes) < L.hoy(), "Solo se pueden cerrar períodos que ya terminaron.");
    L.fechaOperacion(d, actor, L.finMes(mes));
    const pendientes = pendientesCierre(d, actor.sede, mes);
    L.exigir(!pendientes.length, pendientes.join(" "));
    return L.crear(d.cierres, "CIE", { mes, motivo: L.texto(motivo, "Observación de cierre", 3) }, actor, "Período cerrado");
  }

  function diario(d, sede, mes) {
    return L.enSede(d.asientos, sede).filter(a => a.estado === "Contabilizado" && a.fecha.slice(0, 7) === mes)
      .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.numero.localeCompare(b.numero));
  }

  function balances(d, sede, mes) {
    const anteriores = L.enSede(d.asientos, sede).filter(a => a.estado === "Contabilizado" && a.fecha.slice(0, 7) < mes).flatMap(a => a.lineas);
    const actuales = diario(d, sede, mes).flatMap(a => a.lineas);
    return Object.entries(L.cuentas).map(([cuenta, nombre]) => {
      const previa = L.totales(anteriores.filter(l => l.cuenta === cuenta));
      const { debe, haber } = L.totales(actuales.filter(l => l.cuenta === cuenta));
      const inicial = previa.debe - previa.haber;
      return { cuenta, nombre, inicial, debe, haber, final: inicial + debe - haber };
    });
  }

  return { contabilizar, incorporarInventarioInicial, comprasSinAlta, alta, ponerEnUso, depreciacionDelMes, depreciar,
    periodosPorDepreciar, tareasCierre, pendientesCierre, cerrarPeriodo, diario, balances };
})();
