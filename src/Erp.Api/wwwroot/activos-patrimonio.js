"use strict";

window.ActivosPatrimonio = (() => {
  const L = window.LogisticaReglas, R = window.ActivosReglas;
  const { config, permitir, abierto, periodo, desplazarPeriodo, ultimoDia, cuenta, registrar, registrarAsiento } = R;
  const operativos = ["Traslado", "Mantenimiento"];
  const tipos = [...operativos, "Mejora", "Deterioro", "Venta", "Retiro"];
  const mantenimientoAbierto = (d, activoId) => d.movimientos.some(m => m.activoId === activoId && m.tipo === "Mantenimiento" && ["Programada", "En ejecución"].includes(m.estado));
  const vistaLibro = (a, nombre) => {
    const libro = a.libros[nombre];
    return { costo: a.costo, acumulada: libro.acumulada, deterioro: libro.deterioro, neto: a.costo - libro.acumulada - libro.deterioro };
  };
  const siguiente = (a, libro) => libro.depreciaciones.length ? desplazarPeriodo(libro.depreciaciones.at(-1).periodo, 1) : a.inicio;
  const requiereDepreciar = (a, nombre, p) => {
    const libro = a.libros[nombre];
    return vistaLibro(a, nombre).neto > libro.residual && siguiente(a, libro) <= p;
  };
  function alDia(a, p, nombres = Object.keys(a.libros)) {
    L.exigir(nombres.every(n => !requiereDepreciar(a, n, p)), "Registra la depreciación pendiente hasta el mes anterior para continuar.");
  }

  function depreciar(d, e, actor, hoy) {
    permitir(actor, ["Contabilidad"]);
    const a = L.obtener(d.activos, e.activoId, actor), libro = Object.hasOwn(a.libros, e.libro) && a.libros[e.libro];
    L.exigir(a.estado === "En servicio" && libro, "Selecciona un activo en servicio con ese libro.");
    L.exigir(R.periodoValido(e.periodo) && e.periodo < periodo(hoy), "Selecciona un mes completo anterior al actual.");
    L.exigir(siguiente(a, libro) === e.periodo && requiereDepreciar(a, e.libro, e.periodo), "Selecciona el siguiente mes pendiente de depreciación para el libro.");
    L.exigir(e.periodo >= periodo(a.fechaValor), "El periodo es anterior al último movimiento de valor o traslado.");
    abierto(d, actor.sede, e.periodo);
    const { plan, metodo } = libro;
    const porUnidades = metodo === "Unidades de producción";
    const unidades = porUnidades ? e.unidades : 1;
    L.exigir(Number.isSafeInteger(unidades) && unidades >= 0 && unidades <= 1000000000, "Indica las unidades producidas en el mes, incluso si fueron cero.");
    const consumido = Math.min(plan.consumido + unidades, plan.medida);
    const disponible = vistaLibro(a, e.libro).neto - libro.residual;
    const fecha = ultimoDia(e.periodo);
    let cargo;
    if (metodo === "Saldos decrecientes") {
      cargo = consumido === plan.medida ? disponible : Math.min(disponible, R.proporcion(vistaLibro(a, e.libro).neto, libro.tasa, 120000));
    } else {
      cargo = R.proporcion(plan.base, consumido, plan.medida) - R.proporcion(plan.base, plan.consumido, plan.medida);
    }
    L.exigir(cargo >= 0 && cargo <= disponible, "El cargo superaría el importe depreciable.");
    const correlativo = L.numerar(d.activos.flatMap(a => Object.values(a.libros).flatMap(l => l.depreciaciones)), "DEP");
    const registro = L.crear(libro.depreciaciones, "DEP", { activoId: a.id, periodo: e.periodo, fecha, importe: cargo, unidades: porUnidades ? unidades : null, libro: e.libro }, actor, "Depreciación del periodo ejecutada");
    registro.numero = correlativo;
    plan.consumido = consumido;
    libro.acumulada += cargo;
    if (e.libro === "Contable" && cargo) {
      registrarAsiento(d, registro, "Depreciación", fecha, a.id, [cuenta(a.cuentas.gastoDepreciacion, cargo, 0), cuenta(a.cuentas.depreciacion, 0, cargo)], actor);
    }
    registrar(a, actor, `Depreciación ${e.libro} · ${e.periodo} · ${registro.numero}`);
    return registro;
  }

  function ejecutarPeriodo(d, e, actor, hoy) {
    permitir(actor, ["Contabilidad"]);
    L.exigir(config.libros.includes(e.libro) && R.periodoValido(e.periodo) && e.periodo < periodo(hoy), "Selecciona un libro y un mes completo anterior al actual.");
    abierto(d, actor.sede, e.periodo);
    const pendientes = d.activos.filter(a => a.sede === actor.sede && a.estado === "En servicio" && Object.hasOwn(a.libros, e.libro) && requiereDepreciar(a, e.libro, e.periodo));
    const automaticos = pendientes.filter(a => a.libros[e.libro].metodo !== "Unidades de producción");
    L.exigir(automaticos.every(a => siguiente(a, a.libros[e.libro]) === e.periodo), "Existen meses anteriores pendientes. Ejecuta primero los periodos más antiguos.");
    return { ejecutados: automaticos.map(a => depreciar(d, { ...e, activoId: a.id }, actor, hoy)), porUso: pendientes.length - automaticos.length };
  }

  function prepararMovimiento(a, e, hoy, proveedores) {
    if (e.tipo === "Traslado") {
      const ubicacion = R.texto(e.ubicacion, "la ubicación de destino");
      const custodio = R.texto(e.custodio, "el custodio de destino");
      const centroCosto = R.texto(e.centroCosto, "el centro de costo de destino", 60);
      L.exigir(R.sedeValida(e.sedeDestino), "Selecciona la sede de destino.");
      L.exigir(e.sedeDestino !== a.sede || ubicacion !== a.ubicacion || custodio !== a.custodio || centroCosto !== a.centroCosto, "Indica un cambio de asignación.");
      return { sedeDestino: e.sedeDestino, ubicacion, custodio, centroCosto };
    }
    if (e.tipo === "Mantenimiento") {
      L.exigir(["Preventivo", "Correctivo"].includes(e.tipoMantenimiento) && L.fechaValida(e.programada) && e.programada >= hoy, "Selecciona el tipo y una fecha de mantenimiento vigente.");
      return { tipoMantenimiento: e.tipoMantenimiento, programada: e.programada };
    }
    if (e.tipo === "Mejora") {
      L.exigir(R.importe(e.importe), "Indica el importe capitalizable y sustenta los beneficios futuros en el motivo.");
      const medidas = {};
      for (const [nombre, libro] of Object.entries(a.libros)) {
        const medida = e.medidas?.[nombre];
        const limite = libro.metodo === "Unidades de producción" ? 1000000000 : 600;
        L.exigir(!medida || L.entero(medida) && medida <= limite, `La vida útil remanente del libro ${nombre} no es válida.`);
        if (medida) medidas[nombre] = medida;
      }
      return { importe: e.importe, proveedor: R.proveedorDe(e.proveedorId, proveedores), documento: R.clave(R.texto(e.documento, "el documento de la mejora", 80)), medidas };
    }
    if (e.tipo === "Deterioro") {
      L.exigir(R.importe(e.recuperable, true), "Indica el valor recuperable en moneda del activo.");
      return { recuperable: e.recuperable };
    }
    if (e.tipo === "Venta") {
      L.exigir(R.importe(e.importe), "Indica el valor de venta sin IGV.");
      return { importe: e.importe, igv: R.impuesto(e.importe, e.gravado === true), documento: R.clave(R.texto(e.documento, "el documento de venta", 80)) };
    }
    return {};
  }

  function solicitarMovimiento(d, e, actor, hoy, proveedores = []) {
    L.exigir(tipos.includes(e.tipo), "Selecciona un movimiento patrimonial válido.");
    permitir(actor, operativos.includes(e.tipo) ? ["Almacén", "Jefatura"] : ["Contabilidad"]);
    const a = L.obtener(d.activos, e.activoId, actor);
    L.exigir(a.estado === "En servicio", "El activo ya fue dado de baja.");
    L.exigir(!d.movimientos.some(m => m.activoId === a.id && m.tipo === e.tipo && m.estado === "Pendiente"), "Ya hay una solicitud pendiente de este tipo para el activo.");
    const detalle = prepararMovimiento(a, e, hoy, proveedores);
    return L.crear(d.movimientos, "MP", {
      activoId: a.id, tipo: e.tipo, motivo: L.motivo(e.motivo), estado: "Pendiente", solicitadoEn: hoy, ...detalle
    }, actor, `${e.tipo} solicitado`);
  }

  function cambiarBase(a, nombre, medida) {
    const libro = a.libros[nombre], base = Math.max(0, vistaLibro(a, nombre).neto - libro.residual);
    const restante = medida || libro.plan.medida - libro.plan.consumido;
    L.exigir(base === 0 || restante > 0, `Indica una nueva vida útil remanente para ${nombre} antes de aprobar la mejora.`);
    libro.plan = { base, medida: restante, consumido: 0 };
  }

  function aplicarMovimiento(d, a, m, fecha, actor) {
    const cuentas = a.cuentas, plan = config.cuentas, contable = vistaLibro(a, "Contable"), p = periodo(fecha);
    if (m.tipo === "Traslado") {
      abierto(d, m.sedeDestino, p);
      L.exigir(!mantenimientoAbierto(d, a.id), "Completa o cancela el mantenimiento programado antes del traslado.");
      L.exigir(m.sedeDestino !== a.sede || m.ubicacion !== a.ubicacion || m.custodio !== a.custodio || m.centroCosto !== a.centroCosto, "El activo ya tiene esa asignación.");
      m.origen = { sede: a.sede, ubicacion: a.ubicacion, custodio: a.custodio, centroCosto: a.centroCosto };
      Object.assign(a, { sede: m.sedeDestino, ubicacion: m.ubicacion, custodio: m.custodio, centroCosto: m.centroCosto });
    } else if (m.tipo === "Mejora") {
      L.exigir(R.importe(a.costo + m.importe), "El costo acumulado supera el máximo permitido.");
      R.validarDocumentoProveedor(d, m.proveedor, m.documento, m.id);
      a.costo += m.importe;
      for (const n of Object.keys(a.libros)) cambiarBase(a, n, m.medidas[n]);
      registrarAsiento(d, m, m.tipo, fecha, a.id, [cuenta(cuentas.activo, m.importe, 0), cuenta(plan.pagar, 0, m.importe)], actor);
    } else if (m.tipo === "Deterioro") {
      m.importe = contable.neto - m.recuperable;
      L.exigir(m.importe > 0, "El valor recuperable debe ser inferior al valor contable en libros.");
      a.libros.Contable.deterioro += m.importe;
      cambiarBase(a, "Contable");
      registrarAsiento(d, m, m.tipo, fecha, a.id, [cuenta(cuentas.gastoDeterioro, m.importe, 0), cuenta(cuentas.deterioro, 0, m.importe)], actor);
    } else {
      L.exigir(!mantenimientoAbierto(d, a.id), "Completa o cancela el mantenimiento programado antes de la baja.");
      a.estado = "De baja";
      a.fechaBaja = fecha;
      m.valorEnLibros = contable.neto;
      m.resultado = (m.importe || 0) - contable.neto;
      const lineas = [
        cuenta(cuentas.depreciacion, contable.acumulada, 0), cuenta(cuentas.deterioro, contable.deterioro, 0),
        cuenta(plan.costoBaja, contable.neto, 0), cuenta(cuentas.activo, 0, contable.costo)
      ];
      if (m.tipo === "Venta") lineas.push(cuenta(plan.cobrar, m.importe + m.igv, 0), cuenta(plan.ingresoBaja, 0, m.importe), cuenta(plan.igv, 0, m.igv));
      registrarAsiento(d, m, m.tipo, fecha, a.id, lineas, actor);
    }
    a.fechaValor = fecha;
    registrar(a, actor, `${m.tipo} · ${m.numero} · ${m.motivo}`);
  }

  function resolverMovimiento(d, e, actor, hoy) {
    permitir(actor, ["Jefatura"]);
    const m = L.obtener(d.movimientos, e.id, actor);
    L.exigir(m.estado === "Pendiente", "El movimiento ya fue revisado.");
    L.independiente(actor, m.registradoPor);
    const motivo = L.motivo(e.motivo);
    if (!e.aceptar) {
      m.estado = "Rechazada";
    } else {
      const a = L.obtener(d.activos, m.activoId, actor);
      L.exigir(a.estado === "En servicio", "El activo ya fue dado de baja.");
      if (m.tipo === "Mantenimiento") {
        m.estado = "Programada";
        registrar(a, actor, `Mantenimiento programado · ${m.numero}`);
      } else {
        const p = periodo(e.fecha || ""), libros = Object.keys(a.libros);
        L.exigir(R.fechaValida(e.fecha, hoy, a.fechaValor) && e.fecha >= m.solicitadoEn, "La fecha del movimiento debe respetar la solicitud y el último cambio del activo.");
        L.exigir(libros.every(n => (a.libros[n].depreciaciones.at(-1)?.periodo || "") < p), "Ya existe una depreciación del mes del movimiento o posterior.");
        abierto(d, actor.sede, p);
        alDia(a, desplazarPeriodo(p, -1), libros);
        aplicarMovimiento(d, a, m, e.fecha, actor);
        m.fecha = e.fecha;
        m.estado = "Aplicada";
      }
    }
    registrar(m, actor, `${m.estado}: ${motivo}`);
    return m;
  }

  function iniciarMantenimiento(d, id, actor, hoy) {
    permitir(actor, ["Almacén"]);
    const m = L.obtener(d.movimientos, id, actor), a = L.obtener(d.activos, m.activoId, actor);
    L.exigir(m.tipo === "Mantenimiento" && m.estado === "Programada" && a.estado === "En servicio", "Selecciona una orden técnica programada para un activo en servicio.");
    L.exigir(!d.movimientos.some(r => r.activoId === a.id && r.estado === "En ejecución"), "El activo ya tiene un mantenimiento en ejecución.");
    m.iniciada = hoy;
    m.estado = "En ejecución";
    registrar(m, actor, "Orden técnica iniciada");
    registrar(a, actor, `Mantenimiento iniciado · ${m.numero}`);
    return m;
  }

  function cerrarMantenimiento(d, e, actor, hoy, proveedores = []) {
    permitir(actor, e.cancelar ? ["Jefatura"] : ["Almacén"]);
    const m = L.obtener(d.movimientos, e.id, actor);
    L.exigir(m.tipo === "Mantenimiento" && ["Programada", "En ejecución"].includes(m.estado), "Selecciona una orden técnica abierta.");
    if (e.cancelar) {
      m.estado = "Cancelada";
    } else {
      const a = L.obtener(d.activos, m.activoId, actor);
      L.exigir(R.fechaValida(e.fecha, hoy, m.iniciada || m.solicitadoEn) && a.estado === "En servicio" && R.importe(e.importe, true), "Indica una fecha de ejecución y un gasto de mantenimiento válidos.");
      m.importe = e.importe;
      m.fecha = e.fecha;
      m.documento = e.importe ? R.clave(R.texto(e.documento, "el documento del gasto", 80)) : "";
      if (m.importe) {
        m.proveedor = R.proveedorDe(e.proveedorId, proveedores);
        R.validarDocumentoProveedor(d, m.proveedor, m.documento, m.id);
        registrarAsiento(d, m, "Mantenimiento", e.fecha, a.id, [cuenta(config.cuentas.mantenimiento, m.importe, 0), cuenta(config.cuentas.pagar, 0, m.importe)], actor);
      }
      m.estado = "Completada";
      registrar(a, actor, `Mantenimiento completado · ${m.numero}`);
    }
    registrar(m, actor, `${m.estado}: ${L.motivo(e.motivo)}`);
    return m;
  }

  function contar(d, e, actor, hoy) {
    permitir(actor, ["Almacén"]);
    const a = L.obtener(d.activos, e.activoId, actor);
    L.exigir(a.estado === "En servicio" && R.fechaValida(e.fecha, hoy, a.fechaValor), "Selecciona un activo en servicio y una fecha vigente para su asignación.");
    L.exigir(!d.conteos.some(c => c.activoId === a.id && c.fecha === e.fecha), "Ese activo ya fue contado en la fecha seleccionada.");
    const esperado = { etiqueta: a.etiqueta, serie: a.serie, ubicacion: a.ubicacion, custodio: a.custodio };
    const observado = e.encontrado ? {
      etiqueta: R.clave(R.texto(e.etiqueta, "la etiqueta leída", 80)), serie: R.texto(e.serie, "la serie observada", 80), ubicacion: R.texto(e.ubicacion, "la ubicación observada"),
      custodio: R.texto(e.custodio, "el custodio observado")
    } : null;
    const coincide = observado && Object.keys(esperado).every(k => R.clave(esperado[k]) === R.clave(observado[k]));
    return L.crear(d.conteos, "IP", {
      activoId: a.id, fecha: e.fecha, esperado, observado, evidencia: L.motivo(e.evidencia),
      resultado: !observado ? "No encontrado" : coincide ? "Conforme" : "Con diferencias", estado: "Pendiente de revisión"
    }, actor, "Verificación física registrada");
  }

  function revisarConteo(d, id, motivo, actor) {
    permitir(actor, ["Jefatura"]);
    const c = L.obtener(d.conteos, id, actor);
    L.independiente(actor, c.registradoPor);
    L.exigir(c.estado === "Pendiente de revisión", "El conteo ya fue revisado.");
    registrar(c, actor, `Revisado: ${L.motivo(motivo)}`);
    c.estado = "Revisado";
    return c;
  }

  function cerrarPeriodo(d, p, actor, hoy) {
    permitir(actor, ["Contabilidad"]);
    L.exigir(R.periodoValido(p) && p < periodo(hoy), "Solo se cierran meses completos anteriores al actual.");
    abierto(d, actor.sede, p);
    d.activos.filter(a => a.sede === actor.sede && a.estado === "En servicio").forEach(a => alDia(a, p));
    return L.crear(d.cierres, "CP", { periodo: p }, actor, "Periodo cerrado para los libros patrimoniales");
  }

  function resumen(d, sede) {
    const activos = d.activos.filter(a => a.sede === sede), enServicio = activos.filter(a => a.estado === "En servicio");
    return { activos: enServicio.length, bajas: activos.length - enServicio.length, ...Object.fromEntries(["costo", "acumulada", "deterioro", "neto"].map(k => [k, enServicio.reduce((n, a) => n + vistaLibro(a, "Contable")[k], 0)])) };
  }

  function verificarAuxiliar(d, sede) {
    return d.activos.filter(a => a.sede === sede).map(a => {
      const partidas = d.asientos.filter(s => s.activoId === a.id).flatMap(s => s.lineas);
      const saldo = c => partidas.filter(l => l.cuenta === c).reduce((n, l) => n + l.debe - l.haber, 0);
      const auxiliar = a.estado === "En servicio" ? vistaLibro(a, "Contable") : { costo: 0, acumulada: 0, deterioro: 0, neto: 0 };
      const diario = { costo: saldo(a.cuentas.activo), acumulada: -saldo(a.cuentas.depreciacion), deterioro: -saldo(a.cuentas.deterioro) };
      const saldoDiario = diario.costo - diario.acumulada - diario.deterioro;
      const componentesCoinciden = ["costo", "acumulada", "deterioro"].every(k => auxiliar[k] === diario[k]);
      return { activoId: a.id, numero: a.numero, saldoAuxiliar: auxiliar.neto, saldoDiario, diferencia: auxiliar.neto - saldoDiario, componentesCoinciden };
    });
  }

  function conciliar(d, e, actor, hoy) {
    permitir(actor, ["Contabilidad"]);
    L.exigir(R.importe(e.saldoMayor, true), "Indica un saldo de mayor válido.");
    const lineas = verificarAuxiliar(d, actor.sede);
    const saldoAuxiliar = lineas.reduce((n, l) => n + l.saldoAuxiliar, 0);
    return L.crear(d.conciliaciones, "CON", {
      fecha: hoy, documento: R.texto(e.documento, "la referencia del mayor", 80), saldoMayor: e.saldoMayor, saldoAuxiliar,
      diferencia: saldoAuxiliar - e.saldoMayor, lineas, estado: lineas.every(l => l.componentesCoinciden) && saldoAuxiliar === e.saldoMayor ? "Conciliada" : "Con diferencias"
    }, actor, "Comparación del auxiliar, diario patrimonial y saldo informado del mayor");
  }

  return { tipos, vistaLibro, siguiente, depreciar, ejecutarPeriodo, solicitarMovimiento, resolverMovimiento, iniciarMantenimiento, cerrarMantenimiento, contar, revisarConteo, cerrarPeriodo, resumen, verificarAuxiliar, conciliar };
})();
