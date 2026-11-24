"use strict";

window.Libros = (() => {
  const CLAVE = "famihogar.libros.v1";
  const cuentas = {
    "101": "Caja", "104": "Bancos", "12": "Clientes", "20": "Mercaderías",
    "33": "Propiedad, planta y equipo", "39": "Depreciación acumulada",
    "4011": "IGV", "42": "Proveedores", "46": "Obligaciones por activos",
    "50": "Capital", "59": "Resultados acumulados",
    "68": "Gasto por depreciación", "69": "Costo de ventas", "70": "Ventas"
  };
  const exigir = (condicion, mensaje) => { if (!condicion) throw new Error(mensaje); };
  const permitir = (actor, roles) => exigir(window.Permisos.tieneRol(actor, roles), "Tu rol no permite esta operación.");
  const revisar = (actor, autor) => exigir(window.Permisos.esSuperAdmin(actor) || actor.nombre.toLocaleLowerCase("es") !== autor.toLocaleLowerCase("es"), "Otra persona debe revisar la operación.");
  const entero = (valor, minimo = 0) => Number.isSafeInteger(valor) && valor >= minimo;
  const texto = (valor, campo, minimo = 1) => {
    const limpio = typeof valor === "string" ? valor.trim() : "";
    exigir(limpio.length >= minimo && limpio.length <= 300, campo + " no válido.");
    return limpio;
  };
  const fechaValida = valor => typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor) && !isNaN(Date.parse(valor)) && new Date(valor).toISOString().slice(0, 10) === valor;
  const mesValido = valor => typeof valor === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(valor);
  const sumarDias = (fecha, dias) => {
    const dia = new Date(fecha + "T12:00:00Z");
    dia.setUTCDate(dia.getUTCDate() + dias);
    return dia.toISOString().slice(0, 10);
  };
  const finMes = mes => {
    const dia = new Date(mes + "-01T12:00:00Z");
    dia.setUTCMonth(dia.getUTCMonth() + 1);
    dia.setUTCDate(0);
    return dia.toISOString().slice(0, 10);
  };
  const hoy = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

  function fechaOperacion(d, actor, fecha, desde = "") {
    exigir(fechaValida(fecha) && fecha >= desde && fecha <= hoy(), "Selecciona una fecha válida entre el origen y hoy.");
    exigir(!d.cierres.some(p => p.sede === actor.sede && p.mes === fecha.slice(0, 7)), "El período contable está cerrado.");
  }

  const enSede = (lista, sede) => lista.filter(r => r.sede === sede);
  function obtener(lista, id, actor) {
    const registro = lista.find(r => r.id === id && r.sede === actor.sede);
    exigir(registro, "El registro no existe en esta sede.");
    return registro;
  }

  function evento(registro, actor, accion) {
    registro.historial.push({ fecha: new Date().toISOString(), usuario: actor.nombre, rol: actor.rol, accion });
  }

  function crear(lista, prefijo, datos, actor, accion) {
    const numero = prefijo + "-" + String(lista.length + 1).padStart(5, "0");
    const registro = { ...datos, id: crypto.randomUUID(), numero, sede: actor.sede, registradoPor: actor.nombre, historial: [] };
    evento(registro, actor, accion);
    lista.push(registro);
    return registro;
  }

  function leer() {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return { version: 1, documentos: [], creditos: [], pagos: [], movimientos: [], turnos: [], extractos: [], asientos: [], activos: [], cierres: [] };
    const d = JSON.parse(raw);
    exigir(d?.version === 1 && ["documentos", "creditos", "pagos", "movimientos", "turnos", "extractos", "asientos", "activos", "cierres"].every(k => Array.isArray(d[k])), "No se pudo leer la información de Finanzas y Contabilidad.");
    return d;
  }

  function ejecutar(actor, comando) {
    exigir(actor?.nombre && window.FAMIHOGAR.sedes.some(s => s.id === actor.sede), "Selecciona usuario y sede.");
    const d = leer();
    const resultado = comando(d, actor);
    try { localStorage.setItem(CLAVE, JSON.stringify(d)); }
    catch { throw new Error("No se pudo guardar el registro en el navegador."); }
    return resultado;
  }

  function proponer(d, actor, origen, fecha, concepto, lineas) {
    fechaOperacion(d, actor, fecha);
    exigir(!d.asientos.some(a => a.sede === actor.sede && a.origen.clave === origen.clave), "La operación ya tiene un asiento.");
    exigir(lineas.every(l => Object.hasOwn(cuentas, l.cuenta) && entero(l.debe) && entero(l.haber) && (!l.debe || !l.haber)), "Existe una línea contable inválida.");
    const movimientos = lineas.filter(l => l.debe > 0 || l.haber > 0);
    const { debe, haber } = totales(movimientos);
    exigir(movimientos.length >= 2 && entero(debe, 1) && debe === haber, "El asiento debe cuadrar.");
    return crear(d.asientos, "ASI", { origen, fecha, concepto, lineas: movimientos, estado: "Pendiente" }, actor, "Asiento generado desde la operación");
  }

  const linea = (cuenta, debe = 0, haber = 0) => ({ cuenta, debe, haber });
  const totales = lineas => lineas.reduce((t, l) => ({ debe: t.debe + l.debe, haber: t.haber + l.haber }), { debe: 0, haber: 0 });

  return { CLAVE, cuentas, exigir, permitir, revisar, entero, texto, fechaValida, mesValido, sumarDias, finMes, hoy, fechaOperacion, enSede, obtener, evento, crear, leer, ejecutar, proponer, linea, totales };
})();
