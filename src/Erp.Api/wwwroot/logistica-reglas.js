"use strict";

window.LogisticaReglas = (() => {
  const exigir = (condicion, mensaje) => { if (!condicion) throw new Error(mensaje); };
  const copiar = dato => structuredClone(dato);
  const permitir = (actor, roles) => exigir(actor && roles.includes(actor.rol), "Tu rol no puede realizar esta operación logística.");
  const motivo = valor => { exigir(typeof valor === "string" && valor.trim().length >= 3, "Indica un motivo de al menos tres caracteres."); return valor.trim(); };
  const entero = valor => Number.isSafeInteger(valor) && valor > 0;
  const dinero = valor => Number.isSafeInteger(valor) && valor >= 0;
  const fechaValida = valor => typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(valor)) && new Date(valor).toISOString().slice(0, 10) === valor;
  const independiente = (actor, autor) => exigir(actor.nombre.trim().toLocaleLowerCase("es") !== autor.trim().toLocaleLowerCase("es"), "Otra persona debe revisar la solicitud.");
  const evento = (actor, accion) => ({ fecha: new Date().toISOString(), usuario: actor.nombre, rol: actor.rol, accion });
  const numerar = (lista, prefijo) => `${prefijo}-${String(Math.max(0, ...lista.map(d => Number(d.numero?.split("-").at(-1))).filter(Number.isFinite)) + 1).padStart(5, "0")}`;
  const obtener = (lista, id, actor, otraSede = false) => { const registro = lista.find(d => d.id === id); exigir(registro && (otraSede || !registro.sede || registro.sede === actor.sede), "Registro no encontrado en esta sede."); return registro; };
  const crear = (lista, prefijo, entrada, actor, accion) => {
    const registro = { ...copiar(entrada), id: crypto.randomUUID(), numero: numerar(lista, prefijo), sede: actor.sede, registradoPor: actor.nombre, historial: [evento(actor, accion)] };
    lista.push(registro); return registro;
  };

  function inicializar(config, productos, guardados) {
    if (guardados) {
      exigir([1, config.version].includes(guardados.version) && ["almacenes", "ubicaciones", "movimientos", "proveedores", "requisiciones", "peticionesOferta", "ofertas", "acuerdos", "ordenes", "recepciones", "facturas", "reservas", "picking", "despachos", "retornos", "traslados", "conteos", "planes", "acciones", "evaluaciones", "parametros"].every(clave => Array.isArray(guardados[clave])), "Los datos logísticos no son compatibles. Se conservaron sin cambios.");
      const datos = copiar(guardados);
      if (datos.version === 1) migrar(datos, config);
      exigir(Array.isArray(datos.tratamientos) && Array.isArray(datos.reubicaciones), "Los datos logísticos no son compatibles. Se conservaron sin cambios.");
      return datos;
    }
    const datos = {
      version: config.version, revision: 0, almacenes: config.almacenes.map(a => ({ ...copiar(a), activo: true, estado: "Activo", historial: [] })), ubicaciones: config.almacenes.flatMap(a => config.ubicaciones.map(u => ({ ...copiar(u), id: `ubicacion-${a.id}-${u.codigo}`, almacen: a.id, sede: a.sede, activo: true, estado: "Activo", historial: [] }))),
      proveedores: copiar(config.proveedores), movimientos: [], requisiciones: [], peticionesOferta: [], ofertas: [], acuerdos: [], ordenes: [], recepciones: [], facturas: [], reservas: [], picking: [], despachos: [], retornos: [], traslados: [], conteos: [], planes: [], acciones: [], evaluaciones: [], parametros: [], tratamientos: [], reubicaciones: []
    };
    for (const almacen of config.almacenes) {
      for (const [codigo, cantidad] of Object.entries(config.existencias[almacen.id] || {})) {
        const producto = productos.find(p => p.codigo === codigo);
        datos.movimientos.push({ id: `inicial-${almacen.id}-${codigo}`, numero: `INI-${almacen.id}-${codigo}`, tipo: "Saldo inicial", sede: almacen.sede, almacen: almacen.id, ubicacion: "RACK-A", calidad: "Disponible", codigo, cantidad, coste: producto?.coste || 0, referencia: "Carga inicial", fecha: "2026-11-11", lote: "INICIAL", registradoPor: "Carga inicial" });
      }
    }
    return datos;
  }

  function almacenDe(datos, id, actor, otraSede = false) {
    const almacen = obtener(datos.almacenes, id, actor, otraSede);
    exigir(almacen.activo !== false, "El almacén está inactivo."); return almacen;
  }

  function migrar(datos, config) {
    const anteriores = copiar(datos.ubicaciones);
    datos.almacenes.forEach(a => { a.activo ??= true; a.estado = a.activo ? "Activo" : "Inactivo"; a.historial ??= []; });
    datos.ubicaciones = datos.almacenes.flatMap(a => [...anteriores, ...config.ubicaciones.filter(u => !anteriores.some(v => v.codigo === u.codigo))].map(u => ({ ...copiar(u), id: `ubicacion-${a.id}-${u.codigo}`, almacen: a.id, sede: a.sede, activo: true, estado: "Activo", historial: [] })));
    for (const r of datos.recepciones) for (const l of r.lineas) Object.assign(l, { conforme: r.estado === "Conforme" ? l.cantidad : 0, noConforme: r.estado === "No conforme" ? l.cantidad : 0, devuelta: r.estado === "Devuelta" ? l.cantidad : 0, enReparacion: 0, baja: 0 });
    datos.conteos.forEach(c => c.lineas.forEach(l => { l.calidad ??= "Disponible"; }));
    datos.tratamientos = []; datos.reubicaciones = []; datos.version = config.version;
  }

  function ubicacionDe(datos, almacen, codigo) {
    const u = datos.ubicaciones.find(u => u.almacen === almacen && u.codigo === codigo);
    exigir(u && u.activo !== false, "La ubicación no existe o está inactiva en este almacén."); return u;
  }

  function mismaPosicion(a, b) { return ["almacen", "codigo", "ubicacion", "calidad", "lote"].every(k => a[k] === b[k]); }
  function posicionProtegida(datos, p) {
    return datos.recepciones.some(r => r.almacen === p.almacen && r.lote === p.lote && r.lineas.some(l => l.codigo === p.codigo && ((p.ubicacion === "RECEPCION" && p.calidad === "Cuarentena" && l.cantidad > l.conforme + l.noConforme + l.devuelta + l.enReparacion + l.baja) || (p.ubicacion === "CUARENTENA" && p.calidad === "Cuarentena" && l.noConforme > 0))));
  }

  function saldo(datos, almacen, codigo, ubicacion, calidad = "Disponible", lote) {
    return datos.movimientos.filter(m => m.almacen === almacen && m.codigo === codigo && (!ubicacion || m.ubicacion === ubicacion) && m.calidad === calidad && (!lote || m.lote === lote)).reduce((n, m) => n + m.cantidad, 0);
  }

  function reservado(datos, almacen, codigo, ubicacion, lote, excluirPedido) {
    return datos.reservas.filter(r => r.estado === "Activa" && r.pedidoId !== excluirPedido).flatMap(r => r.lineas).filter(l => l.almacen === almacen && l.codigo === codigo && (!ubicacion || l.ubicacion === ubicacion) && (!lote || l.lote === lote)).reduce((n, l) => n + l.cantidad - l.consumida - l.liberada, 0);
  }

  function retenido(datos, almacen, codigo, ubicacion, lote, calidad = "Disponible", excluirTratamiento) {
    return datos.tratamientos.filter(t => t.estado === "Pendiente" && t.id !== excluirTratamiento && t.almacen === almacen && t.codigo === codigo && t.calidad === calidad && (!ubicacion || t.ubicacion === ubicacion) && (!lote || t.lote === lote)).reduce((n, t) => n + t.cantidad, 0);
  }

  function disponible(datos, almacen, codigo, ubicacion, lote, excluirPedido, excluirTratamiento) {
    return saldo(datos, almacen, codigo, ubicacion, "Disponible", lote) - reservado(datos, almacen, codigo, ubicacion, lote, excluirPedido) - retenido(datos, almacen, codigo, ubicacion, lote, "Disponible", excluirTratamiento);
  }

  function registrarMovimiento(datos, entrada, actor, config) {
    exigir(Number.isSafeInteger(entrada.cantidad) && entrada.cantidad !== 0 && dinero(entrada.coste), "Cantidad o coste de movimiento no válido.");
    exigir(fechaValida(entrada.fecha) && entrada.codigo?.trim() && entrada.lote?.trim(), "Fecha, producto o lote del movimiento no válido.");
    const almacen = datos.almacenes.find(a => a.id === entrada.almacen && a.activo !== false);
    const ubicacion = ubicacionDe(datos, entrada.almacen, entrada.ubicacion);
    exigir(almacen && ubicacion && ubicacion.estados.includes(entrada.calidad), "Almacén, ubicación o estado de calidad no válido.");
    const actual = saldo(datos, entrada.almacen, entrada.codigo, entrada.ubicacion, entrada.calidad, entrada.lote);
    exigir(actual + entrada.cantidad >= 0, "El movimiento dejaría existencias negativas.");
    if (entrada.cantidad < 0) exigir(actual + entrada.cantidad >= retenido(datos, entrada.almacen, entrada.codigo, entrada.ubicacion, entrada.lote, entrada.calidad, entrada.tratamientoId), "La posición tiene cantidades retenidas por tratamiento pendiente.");
    const ocupacion = datos.movimientos.filter(m => m.almacen === entrada.almacen && m.ubicacion === entrada.ubicacion).reduce((n, m) => n + m.cantidad, 0);
    exigir(entrada.cantidad < 0 || ocupacion + entrada.cantidad <= ubicacion.capacidad, "La ubicación no tiene capacidad suficiente.");
    const campos = Object.fromEntries(["tipo", "almacen", "ubicacion", "calidad", "codigo", "lote", "cantidad", "coste", "referencia", "fecha", "tratamientoId"].filter(k => entrada[k] != null).map(k => [k, entrada[k]]));
    const movimiento = { ...campos, id: crypto.randomUUID(), numero: numerar(datos.movimientos, "MOV"), sede: almacen.sede, registradoPor: actor.nombre, ocurridoEn: new Date().toISOString() };
    datos.movimientos.push(movimiento); return movimiento;
  }

  function lotesDisponibles(datos, almacen, codigo) {
    const claves = new Map();
    for (const m of datos.movimientos.filter(m => m.almacen === almacen && m.codigo === codigo && m.calidad === "Disponible")) claves.set(`${m.ubicacion}|${m.lote}`, { ubicacion: m.ubicacion, lote: m.lote, coste: m.coste });
    return [...claves.values()].map(l => ({ ...l, disponible: disponible(datos, almacen, codigo, l.ubicacion, l.lote) })).filter(l => l.disponible > 0);
  }

  function validarLineas(lineas, productos) {
    exigir(Array.isArray(lineas) && lineas.length > 0 && new Set(lineas.map(l => l.codigo)).size === lineas.length, "Selecciona productos sin repetirlos.");
    exigir(lineas.every(l => productos.some(p => p.codigo === l.codigo && p.estado === "Aprobado") && entero(l.cantidad)), "Producto no aprobado o cantidad no válida.");
  }

  function existencias(datos, productos, sede) {
    return datos.almacenes.filter(a => a.sede === sede && a.activo !== false).flatMap(a => productos.filter(p => p.estado === "Aprobado").map(p => ({
      almacen: a.id, codigo: p.codigo, fisico: ["Disponible", "Cuarentena", "Dañado", "En reparación"].reduce((n, estado) => n + saldo(datos, a.id, p.codigo, null, estado), 0), retenido: retenido(datos, a.id, p.codigo), reservado: reservado(datos, a.id, p.codigo), disponible: disponible(datos, a.id, p.codigo), cuarentena: saldo(datos, a.id, p.codigo, null, "Cuarentena"), danado: saldo(datos, a.id, p.codigo, null, "Dañado"), enReparacion: saldo(datos, a.id, p.codigo, null, "En reparación")
    })));
  }

  function configurarReposicion(datos, entrada, actor) {
    permitir(actor, ["Jefatura"]); almacenDe(datos, entrada.almacen, actor);
    exigir(Number.isSafeInteger(entrada.minimo) && entrada.minimo >= 0 && entero(entrada.objetivo) && entrada.objetivo >= entrada.minimo, "El objetivo debe ser mayor o igual al mínimo.");
    const razon = motivo(entrada.motivo), indice = datos.parametros.findIndex(p => p.almacen === entrada.almacen && p.codigo === entrada.codigo);
    const nuevo = { ...copiar(entrada), historial: [...(indice >= 0 ? datos.parametros[indice].historial : []), evento(actor, `Parámetros de reposición: ${razon}`)] };
    if (indice >= 0) datos.parametros[indice] = nuevo; else datos.parametros.push(nuevo);
    return nuevo;
  }

  function registrarPrevision(datos, entrada, actor, productos) {
    permitir(actor, ["Compras", "Jefatura"]);
    exigir(/^\d{4}-(0[1-9]|1[0-2])$/.test(entrada.periodo) && Number.isSafeInteger(entrada.cantidad) && entrada.cantidad >= 0 && productos.some(p => p.codigo === entrada.codigo), "Periodo, producto o cantidad no válidos.");
    const razon = motivo(entrada.motivo), anterior = datos.planes.find(p => p.sede === actor.sede && p.periodo === entrada.periodo && p.codigo === entrada.codigo);
    if (anterior) { anterior.cantidad = entrada.cantidad; anterior.historial.push(evento(actor, `Previsión actualizada: ${razon}`)); return anterior; }
    return crear(datos.planes, "PLAN", { ...entrada, estado: "Vigente" }, actor, `Previsión: ${razon}`);
  }

  function planificar(datos, productos, pedidos, config, sede, periodo) {
    const saldos = existencias(datos, productos, sede), demandas = new Map();
    for (const codigo of new Set(saldos.map(e => e.codigo))) {
      const necesidades = pedidos.filter(p => p.sede === sede && ["Aprobado", "Parcialmente atendido"].includes(p.estado)).reduce((n, p) => {
        const pedida = p.lineas.find(l => l.codigo === codigo)?.cantidad || 0;
        const salida = datos.despachos.filter(d => d.pedidoId === p.id).flatMap(d => d.lineas).filter(l => l.codigo === codigo).reduce((s, l) => s + l.cantidad - (l.retornada || 0), 0);
        const reservada = datos.reservas.filter(r => r.pedidoId === p.id && r.estado === "Activa").flatMap(r => r.lineas).filter(l => l.codigo === codigo).reduce((s, l) => s + l.cantidad - l.consumida - l.liberada, 0);
        return n + Math.max(0, pedida - salida - reservada);
      }, 0);
      const prevision = datos.planes.find(p => p.sede === sede && p.periodo === periodo && p.codigo === codigo)?.cantidad || 0;
      const salidas = datos.despachos.filter(d => d.sede === sede && d.fecha?.startsWith(periodo)).flatMap(d => d.lineas).filter(l => l.codigo === codigo).reduce((n, l) => n + l.cantidad - (l.retornada || 0), 0);
      const reservas = saldos.filter(e => e.codigo === codigo).reduce((n, e) => n + e.reservado, 0);
      demandas.set(codigo, Math.max(necesidades, prevision - salidas - reservas, 0));
    }
    return saldos.map((e, indice) => {
      const parametros = datos.parametros.find(p => p.almacen === e.almacen && p.codigo === e.codigo) || config.reposicion;
      const enCamino = datos.ordenes.filter(o => o.sede === sede && o.almacen === e.almacen && ["Emitida", "Confirmada", "Parcialmente recibida"].includes(o.estado)).reduce((n, o) => n + (o.lineas.find(l => l.codigo === e.codigo)?.cantidad || 0) - datos.recepciones.filter(r => r.ordenId === o.id).flatMap(r => r.lineas).filter(l => l.codigo === e.codigo).reduce((s, l) => s + l.cantidad - l.devuelta, 0), 0);
      const pendiente = demandas.get(e.codigo), ultimo = !saldos.slice(indice + 1).some(s => s.codigo === e.codigo);
      const demanda = ultimo ? pendiente : Math.min(pendiente, Math.max(0, e.disponible + enCamino)); demandas.set(e.codigo, pendiente - demanda);
      const proyectado = e.disponible - demanda + enCamino;
      return { ...e, minimo: parametros.minimo, objetivo: parametros.objetivo, demanda, enCamino, proyectado, sugerido: proyectado < parametros.minimo ? Math.max(0, parametros.objetivo - proyectado) : 0 };
    });
  }

  function crearConteo(datos, entrada, actor, productos) {
    permitir(actor, ["Almacén", "Jefatura"]); almacenDe(datos, entrada.almacen, actor);
    exigir(fechaValida(entrada.fecha), "Indica una fecha válida para el conteo.");
    exigir(entrada.lineas.length && new Set(entrada.lineas.map(l => `${l.codigo}|${l.ubicacion}|${l.lote}|${l.calidad || "Disponible"}`)).size === entrada.lineas.length, "Agrega posiciones sin repetirlas.");
    const lineas = entrada.lineas.map(l => {
      exigir(productos.some(p => p.codigo === l.codigo) && l.lote?.trim() && Number.isSafeInteger(l.contado) && l.contado >= 0, "Producto, lote o cantidad contada no válida.");
      const calidad = l.calidad || "Disponible", u = ubicacionDe(datos, entrada.almacen, l.ubicacion);
      exigir(u.estados.includes(calidad), "La ubicación no admite este estado de calidad.");
      const teorico = saldo(datos, entrada.almacen, l.codigo, l.ubicacion, calidad, l.lote);
      return { ...copiar(l), calidad, teorico, diferencia: l.contado - teorico, movimientosAlContar: datos.movimientos.filter(m => mismaPosicion(m, { ...l, almacen: entrada.almacen, calidad })).length };
    });
    return crear(datos.conteos, "CON", { ...entrada, lineas, estado: "Pendiente", motivo: motivo(entrada.motivo) }, actor, "Conteo físico registrado");
  }

  function aprobarConteo(datos, id, aceptar, razon, actor, config) {
    permitir(actor, ["Jefatura"]); const conteo = obtener(datos.conteos, id, actor);
    independiente(actor, conteo.registradoPor); exigir(conteo.estado === "Pendiente", "El conteo ya fue resuelto."); motivo(razon);
    if (aceptar) {
      for (const l of conteo.lineas) {
        const posicion = { ...l, almacen: conteo.almacen };
        exigir(saldo(datos, conteo.almacen, l.codigo, l.ubicacion, l.calidad, l.lote) === l.teorico && (l.movimientosAlContar == null || datos.movimientos.filter(m => mismaPosicion(m, posicion)).length === l.movimientosAlContar), "Hubo movimientos después de contar. Repite el conteo.");
        if (l.calidad === "Disponible") exigir(l.contado >= reservado(datos, conteo.almacen, l.codigo, l.ubicacion, l.lote), "El ajuste afectaría cantidades reservadas.");
        if (l.diferencia) {
          exigir(l.calidad !== "En reparación" && !posicionProtegida(datos, posicion), "Resuelve el documento de calidad antes de ajustar esta posición.");
          exigir(!datos.tratamientos.some(t => ["Pendiente", "En reparación", "Por reinspeccionar"].includes(t.estado) && mismaPosicion(t, posicion)), "La posición tiene un tratamiento pendiente.");
          registrarMovimiento(datos, { tipo: "Ajuste de inventario", almacen: conteo.almacen, ubicacion: l.ubicacion, codigo: l.codigo, lote: l.lote, cantidad: l.diferencia, calidad: l.calidad, coste: l.coste || 0, referencia: conteo.numero, fecha: conteo.fecha }, actor, config);
        }
      }
    }
    conteo.estado = aceptar ? "Aprobado" : "Rechazado"; conteo.historial.push(evento(actor, `${conteo.estado}: ${razon}`));
  }

  function crearAccion(datos, entrada, actor) {
    permitir(actor, ["Jefatura", "Compras", "Almacén"]);
    exigir(fechaValida(entrada.plazo) && entrada.responsable?.trim(), "Indica plazo y responsable.");
    return crear(datos.acciones, "AC", { ...entrada, causa: motivo(entrada.causa), descripcion: motivo(entrada.descripcion), estado: "Pendiente" }, actor, "Acción de mejora propuesta");
  }

  function avanzarAccion(datos, id, estado, evidencia, actor) {
    permitir(actor, ["Jefatura", "Compras", "Almacén"]); const accion = obtener(datos.acciones, id, actor);
    motivo(evidencia);
    exigir((accion.estado === "Pendiente" && estado === "En curso") || (accion.estado === "En curso" && estado === "Por verificar") || (accion.estado === "Por verificar" && estado === "Completada"), "Transición de acción no válida.");
    if (estado === "Completada") { permitir(actor, ["Jefatura"]); independiente(actor, accion.responsable); }
    else exigir(actor.rol === "Jefatura" || actor.nombre === accion.responsable, "La actualización corresponde al responsable.");
    accion.estado = estado; accion.historial.push(evento(actor, `${estado}: ${evidencia}`));
  }

  return { exigir, copiar, permitir, motivo, entero, dinero, fechaValida, independiente, evento, numerar, obtener, crear, inicializar, almacenDe, ubicacionDe, mismaPosicion, posicionProtegida, saldo, reservado, retenido, disponible, registrarMovimiento, lotesDisponibles, validarLineas, existencias, configurarReposicion, registrarPrevision, planificar, crearConteo, aprobarConteo, crearAccion, avanzarAccion };
})();
