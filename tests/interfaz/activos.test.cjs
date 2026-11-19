const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const raiz = path.resolve(__dirname, "../../src/Erp.Api/wwwroot");
const asesor = { nombre: "Luis", rol: "Asesor", sede: "centro" };
const almac = { nombre: "Marta", rol: "Almacén", sede: "centro" };
const compras = { nombre: "Pablo", rol: "Compras", sede: "centro" };
const jefa = { nombre: "Ana", rol: "Jefatura", sede: "centro" };
const cont = { nombre: "Sara", rol: "Contabilidad", sede: "centro" };
const tes = { nombre: "Miguel", rol: "Tesorería", sede: "centro" };
const inicial = "2026-09-01", hoy = "2026-11-19";
const base = 12000000, igv = 2160000;
const lineal = { metodo: "Línea recta", residual: 0, meses: 120 };

function entorno() {
  const memoria = new Map();
  const localStorage = { getItem: k => memoria.get(k) ?? null, setItem: (k, v) => memoria.set(k, v) };
  const ctx = vm.createContext({ window: {}, structuredClone, crypto: webcrypto, localStorage });
  for (const f of ["datos-comercial.js", "datos-logistica.js", "logistica-reglas.js", "logistica-aplicacion.js", "datos-activos.js", "activos-reglas.js", "activos-patrimonio.js", "activos-aplicacion.js"]) {
    vm.runInContext(fs.readFileSync(path.join(raiz, f), "utf8"), ctx, { filename: f });
  }
  const w = ctx.window, A = w.ActivosAplicacion;
  return { w, A, R: w.ActivosReglas, P: w.ActivosPatrimonio, memoria, localStorage, leer: A.leer, ejecutar: A.ejecutar };
}

const plain = r => JSON.parse(JSON.stringify(r));
function falla(t, fn, error) {
  const antes = t.memoria.get(t.A.CLAVE);
  assert.throws(fn, error);
  assert.equal(t.memoria.get(t.A.CLAVE), antes);
}
function solicitud(t, fecha = inicial) {
  return t.ejecutar(asesor, d => t.R.solicitar(d, {
    descripcion: "Tractor agrícola", clase: "Maquinaria y equipos", presupuesto: base,
    centroCosto: "Campo 30301015", requerida: fecha, motivo: "Equipo de operación"
  }, asesor, fecha));
}
function orden(t, s, cambios = {}, fecha = inicial) {
  return t.ejecutar(compras, d => t.R.emitirOrden(d, { solicitudId: s.id, proveedorId: "prov-madera", precio: base, directos: 0, entrega: fecha, ...cambios }, compras, fecha, t.A.proveedores()));
}
function recibir(t, o, cambios = {}, fecha = inicial) {
  return t.ejecutar(almac, d => t.R.recibir(d, { ordenId: o.id, documento: "GUIA-001", fecha, serie: "TRACTOR-01", conforme: true, evidencia: "Serie y funcionamiento verificados", ...cambios }, almac, fecha));
}
function factura(t, r, cambios = {}, fecha = inicial) {
  return t.ejecutar(compras, d => t.R.verificarFactura(d, { recepcionId: r.id, documento: "F001-010", fecha, base, igv, gravado: true, recuperable: true, ...cambios }, compras, fecha));
}
function compra(t, cambios = {}) {
  const s = solicitud(t);
  t.ejecutar(jefa, d => t.R.resolverSolicitud(d, s.id, true, "Inversión verificada", jefa));
  const o = orden(t, s);
  const r = recibir(t, o);
  return factura(t, r, cambios);
}
function capitalizar(t, f, cambios = {}) {
  return t.ejecutar(cont, d => t.R.capitalizar(d, { facturaId: f.id, fecha: inicial, ubicacion: "Patio", custodio: "Jefatura agrícola",
    etiqueta: "TAG-TRACTOR", evidencia: "Puesta en servicio verificada", contable: lineal, ...cambios }, cont, hoy));
}
function alta(t, cambios = {}) { return capitalizar(t, compra(t), cambios); }
function depreciar(t, a, cambios = {}, actor = cont, fecha = hoy) {
  return t.ejecutar(actor, d => t.P.depreciar(d, { activoId: a.id, libro: "Contable", periodo: "2026-10", ...cambios }, actor, fecha));
}
function movimiento(t, a, tipo, actor, cambios = {}) {
  return t.ejecutar(actor, d => t.P.solicitarMovimiento(d, { activoId: a.id, tipo, motivo: "Motivo documentado", ...cambios }, actor, hoy, t.A.proveedores()));
}
function decidir(t, m, cambios = {}, actor = jefa) {
  return t.ejecutar(actor, d => t.P.resolverMovimiento(d, { id: m.id, aceptar: true, fecha: hoy, motivo: "Sustento revisado", ...cambios }, actor, hoy));
}
const partidas = a => plain(a.lineas).map(l => [l.cuenta, l.debe, l.haber]);

test("compra, pago y depreciación reproducen el caso del tractor sin escribir existencias", () => {
  const t = entorno(), a = alta(t);
  assert.equal(a.costo, base);
  assert.equal(a.inicio, "2026-10");
  assert.deepEqual(partidas(t.leer().asientos[0]), [["333", base, 0], ["4011", igv, 0], ["465", 0, base + igv]]);
  const [obligacion] = t.w.ContratosActivos.listarObligaciones("centro");
  t.ejecutar(tes, d => t.R.pagar(d, { asientoId: obligacion.asientoId, fecha: inicial, documento: "OP-100" }, tes, hoy));
  assert.deepEqual(partidas(t.leer().asientos[1]), [["465", base + igv, 0], ["104", 0, base + igv]]);
  const registro = depreciar(t, a);
  assert.equal(registro.importe, 100000);
  assert.deepEqual(partidas(t.leer().asientos[2]), [["684", 100000, 0], ["395", 0, 100000]]);
  assert.equal(t.P.resumen(t.leer(), "centro").neto, 11900000);
  assert.equal(t.memoria.get(t.w.LogisticaAplicacion.CLAVE), undefined);
  assert.equal(t.w.ContratosActivos.listarAsientos("surco").length, 0);
  falla(t, () => depreciar(t, a), /siguiente mes/);
  falla(t, () => t.ejecutar(tes, d => t.R.pagar(d, { asientoId: obligacion.asientoId, fecha: inicial, documento: "OP-100" }, tes, hoy)), /obligación pendiente/);
});

test("CAPEX exige revisión independiente, sede, proveedor aprobado y presupuesto suficiente", () => {
  const t = entorno(), s = solicitud(t), mismo = { ...jefa, nombre: " LUIS " }, otra = { ...jefa, sede: "olivos" };
  falla(t, () => orden(t, s), /aprobación/);
  falla(t, () => t.ejecutar(mismo, d => t.R.resolverSolicitud(d, s.id, true, "Revisión propia", mismo)), /Otra persona/);
  falla(t, () => t.ejecutar(otra, d => t.R.resolverSolicitud(d, s.id, true, "Sede distinta", otra)), /esta sede/);
  t.ejecutar(jefa, d => t.R.resolverSolicitud(d, s.id, true, "Revisión independiente", jefa));
  falla(t, () => orden(t, s, { proveedorId: "ajeno" }), /proveedor aprobado/);
  falla(t, () => orden(t, s, { directos: 1 }), /presupuesto/);
  assert.equal(orden(t, s, { precio: base - 10000, directos: 10000, detalleDirectos: "Instalación" }).directos, 10000);
  falla(t, () => orden(t, s), /solo admite una orden/);
});

test("recepción observada bloquea factura, la conforme habilita cotejo de importes", () => {
  const t = entorno(), s = solicitud(t);
  t.ejecutar(jefa, d => t.R.resolverSolicitud(d, s.id, true, "Revisión", jefa));
  const o = orden(t, s), observada = recibir(t, o, { conforme: false });
  falla(t, () => factura(t, observada), /recepción conforme/);
  falla(t, () => recibir(t, o), /ya fue registrado/);
  const r = recibir(t, o, { documento: "GUIA-002" });
  falla(t, () => factura(t, r, { igv: 0 }), /no coincide/);
  const f = factura(t, r, { recuperable: false });
  assert.equal(capitalizar(t, f).costo, base + igv);
  assert.equal(t.leer().asientos[0].lineas.length, 2);
  falla(t, () => capitalizar(t, f), /ya está capitalizada/);
});

test("una adquisición en curso reconoce la obligación y luego capitaliza sin duplicar compra", () => {
  const t = entorno(), f = compra(t);
  falla(t, () => capitalizar(t, f, { fecha: "2026-10-01" }), /adquisición en curso/);
  const registro = t.ejecutar(cont, d => t.R.registrarFactura(d, { facturaId: f.id, fecha: inicial }, cont, hoy));
  assert.equal(registro.registroContable.fecha, inicial);
  assert.equal(t.R.obligaciones(t.leer(), "centro").length, 1);
  falla(t, () => t.ejecutar(cont, d => t.R.registrarFactura(d, { facturaId: f.id, fecha: inicial }, cont, hoy)), /ya se registró/);
  capitalizar(t, f, { fecha: "2026-10-01" });
  assert.deepEqual(t.leer().asientos.map(a => a.tipo).join("|"), "Adquisición en curso|Capitalización");
  assert.deepEqual(partidas(t.leer().asientos[1]), [["333", base, 0], ["339", 0, base]]);
  assert.equal(t.R.obligaciones(t.leer(), "centro").length, 1);
});

test("libro fiscal por unidades admite uso cero, mantiene su residual y no crea asientos", () => {
  const t = entorno(), a = alta(t, { tributario: { metodo: "Unidades de producción", residual: 33333, unidades: 5 } });
  falla(t, () => depreciar(t, a, { libro: "Tributario" }), /unidades producidas/);
  const cero = depreciar(t, a, { libro: "Tributario", unidades: 0 });
  const d = depreciar(t, a, { libro: "Tributario", unidades: 2, periodo: "2026-11" }, cont, "2026-12-01");
  const ult = depreciar(t, a, { libro: "Tributario", unidades: 8, periodo: "2026-12" }, cont, "2027-01-02");
  assert.equal(cero.importe, 0);
  assert.equal(d.importe + ult.importe, base - 33333);
  assert.equal(ult.unidades, 8);
  assert.equal(t.leer().asientos.length, 1);
});

test("saldos decrecientes redondea el cargo mensual y liquida al residual al fin de la vida", () => {
  const t = entorno(), a = alta(t, { contable: { metodo: "Saldos decrecientes", residual: 1000000, meses: 2, tasa: 2400 } });
  assert.equal(depreciar(t, a).importe, 240000);
  assert.equal(depreciar(t, a, { periodo: "2026-11" }, cont, "2026-12-01").importe, 10760000);
  assert.equal(t.P.vistaLibro(t.leer().activos[0], "Contable").neto, 1000000);
});

test("ejecución automática es repetible, omite unidades y no permite omitir periodos", () => {
  const t = entorno(), a = alta(t, { tributario: { metodo: "Unidades de producción", residual: 0, unidades: 4 } });
  const ejecutar = (libro, periodo) => t.ejecutar(cont, d => t.P.ejecutarPeriodo(d, { libro, periodo }, cont, "2026-12-01"));
  falla(t, () => ejecutar("Contable", "2026-11"), /meses anteriores/);
  assert.equal(ejecutar("Tributario", "2026-10").porUso, 1);
  assert.equal(ejecutar("Contable", "2026-10").ejecutados[0].activoId, a.id);
  assert.equal(ejecutar("Contable", "2026-10").ejecutados.length, 0);
  falla(t, () => depreciar(t, a, {}, compras), /rol o sede/);
  falla(t, () => depreciar(t, a, { periodo: "2026-11" }), /mes completo/);
});

test("cierre valida los libros de la sede y bloquea asientos retroactivos", () => {
  const t = entorno(), a = alta(t);
  falla(t, () => t.ejecutar(cont, d => t.P.cerrarPeriodo(d, "2026-10", cont, hoy)), /depreciación pendiente/);
  depreciar(t, a);
  t.ejecutar(cont, d => t.P.cerrarPeriodo(d, "2026-10", cont, hoy));
  falla(t, () => t.ejecutar(tes, d => t.R.pagar(d, { asientoId: t.leer().asientos[0].id, fecha: "2026-10-01", documento: "OP-100" }, tes, hoy)), /periodo patrimonial está cerrado/);
  falla(t, () => t.ejecutar(cont, d => t.P.cerrarPeriodo(d, "2026-10", cont, hoy)), /periodo patrimonial está cerrado/);
});

test("mejora, deterioro y venta mantienen el costo y resultado y saldan el auxiliar", () => {
  const t = entorno(), a = alta(t);
  depreciar(t, a);
  decidir(t, movimiento(t, a, "Mejora", cont, { importe: 500000, documento: "F001-200", proveedorId: "prov-madera" }));
  const deterioro = decidir(t, movimiento(t, a, "Deterioro", cont, { recuperable: 12000000 }));
  assert.equal(deterioro.importe, 400000);
  const venta = decidir(t, movimiento(t, a, "Venta", cont, { importe: 11000000, documento: "V-01", gravado: true }));
  assert.equal(venta.resultado, -1000000);
  assert.deepEqual(partidas(t.leer().asientos.at(-1)), [["395", 100000, 0], ["363", 400000, 0], ["655", 12000000, 0], ["333", 0, 12500000], ["165", 12980000, 0], ["756", 0, 11000000], ["4011", 0, 1980000]]);
  assert.equal(t.P.resumen(t.leer(), "centro").neto, 0);
  assert.equal(t.P.verificarAuxiliar(t.leer(), "centro")[0].componentesCoinciden, true);
  falla(t, () => movimiento(t, a, "Retiro", cont), /dado de baja/);
});

test("mantenimiento con documento se lleva a gasto y el traslado conserva trazabilidad", () => {
  const t = entorno(), a = alta(t);
  depreciar(t, a);
  const m = decidir(t, movimiento(t, a, "Mantenimiento", almac, { tipoMantenimiento: "Preventivo", programada: hoy }));
  const tr = movimiento(t, a, "Traslado", almac, { sedeDestino: "olivos", ubicacion: "Patio Norte", custodio: "Juan", centroCosto: "Campo 02" });
  falla(t, () => decidir(t, tr), /mantenimiento programado/);
  assert.equal(t.ejecutar(almac, d => t.P.iniciarMantenimiento(d, m.id, almac, hoy)).estado, "En ejecución");
  falla(t, () => decidir(t, tr), /mantenimiento programado/);
  t.ejecutar(almac, d => t.P.cerrarMantenimiento(d, { id: m.id, fecha: hoy, importe: 25000, proveedorId: "prov-madera", documento: "Mt-01", motivo: "Cambio de aceite" }, almac, hoy, t.A.proveedores()));
  assert.equal(t.leer().activos[0].costo, base);
  assert.deepEqual(partidas(t.leer().asientos.at(-1)), [["634", 25000, 0], ["465", 0, 25000]]);
  decidir(t, tr);
  assert.equal(t.leer().asientos.length, 3);
  assert.equal(t.P.resumen(t.leer(), "olivos").neto, 11900000);
  assert.equal(t.P.verificarAuxiliar(t.leer(), "olivos")[0].diferencia, 0);
});

test("conteo conserva asignación y exige revisión de otra persona", () => {
  const t = entorno(), a = alta(t);
  const entrada = { activoId: a.id, fecha: hoy, encontrado: true, etiqueta: "tag-tractor", serie: "TRACTOR-01", ubicacion: "Patio", custodio: "Otra persona", evidencia: "Acta física" };
  const c = t.ejecutar(almac, d => t.P.contar(d, entrada, almac, hoy));
  assert.equal(c.resultado, "Con diferencias");
  falla(t, () => t.ejecutar(almac, d => t.P.contar(d, entrada, almac, hoy)), /ya fue contado/);
  const mismo = { ...almac, rol: "Jefatura" };
  falla(t, () => t.ejecutar(mismo, d => t.P.revisarConteo(d, c.id, "Acción revisada", mismo)), /Otra persona/);
  t.ejecutar(jefa, d => t.P.revisarConteo(d, c.id, "Solicitar revisión del custodio", jefa));
  assert.equal(t.leer().activos[0].custodio, a.custodio);
});

test("conciliación registra diferencias con el mayor y distingue cuentas que compensan", () => {
  const t = entorno(), a = alta(t);
  const conciliar = saldoMayor => t.ejecutar(cont, d => t.P.conciliar(d, { saldoMayor, documento: "GL-01" }, cont, hoy));
  assert.equal(conciliar(base).estado, "Conciliada");
  assert.equal(conciliar(base - 1).diferencia, 1);
  t.ejecutar(cont, d => t.R.registrarAsiento(d, { id: "doc", numero: "REF" }, "Ajuste de prueba", hoy, a.id, [
    t.R.cuenta(a.cuentas.activo, 1000, 0), t.R.cuenta(a.cuentas.depreciacion, 0, 1000)
  ], cont));
  const r = conciliar(base);
  assert.equal(r.lineas[0].diferencia, 0);
  assert.equal(r.estado, "Con diferencias");
});

test("fallo de guardado, datos incompatibles o un asiento descuadrado preservan el estado", () => {
  const t = entorno(), a = alta(t);
  falla(t, () => t.ejecutar(cont, d => t.R.registrarAsiento(d, { id: "doc", numero: "REF" }, "Ajuste de prueba", hoy, a.id, [
    t.R.cuenta(a.cuentas.activo, 1000, 0), t.R.cuenta(a.cuentas.depreciacion, 0, 1)
  ], cont)), /descuadrado/);
  t.localStorage.setItem = () => { throw new Error("quota"); };
  falla(t, () => depreciar(t, a), /No se pudo guardar/);
  t.memoria.set(t.A.CLAVE, "{roto");
  falla(t, t.leer, /JSON/);
});
