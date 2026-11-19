
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const raiz = path.resolve(__dirname, "../../src/Erp.Api/wwwroot");
const tes = { nombre: "Carla", rol: "Tesorería", sede: "centro" };
const jefa = { nombre: "Ana", rol: "Jefatura", sede: "centro" };
const cont = { nombre: "Elena", rol: "Contabilidad", sede: "centro" };
const otraSede = { ...tes, sede: "surco" };
const hoy = "2026-11-19", apertura = "2026-11-01", mañana = "2026-11-20";

function entorno({ locks, almacenamiento } = {}) {
  const memoria = new Map();
  const localStorage = almacenamiento || {
    getItem: k => memoria.get(k) ?? null,
    setItem: (k, v) => memoria.set(k, v)
  };
  const ctx = vm.createContext({ window: {}, navigator: { locks }, localStorage, structuredClone, crypto: webcrypto, TextEncoder });
  for (const f of ["datos-comercial.js", "logistica-reglas.js", "tesoreria-reglas.js", "tesoreria-aplicacion.js"]) {
    vm.runInContext(fs.readFileSync(path.join(raiz, f), "utf8"), ctx, { filename: f });
  }
  const { TesoreriaReglas: R, TesoreriaAplicacion: A } = ctx.window;
  return { R, A, memoria, d: R.inicializar(null) };
}

function cuenta(t, cambios = {}) {
  return t.R.registrarCuenta(t.d, { tipo: "Banco", nombre: "Banco de la sede", banco: "Banco Uno", identificador: "B-100",
    fecha: apertura, apertura: 8000000, ...cambios }, jefa, hoy);
}

function partida(t, tipo, cambios = {}) {
  return t.R.registrarPartida(t.d, { tipo, tercero: tipo === "Cobrar" ? "Cliente A" : "Proveedor A",
    documento: "F001-20", fecha: apertura, vence: mañana, importe: 100000, ...cambios }, tes, hoy);
}

function preparar(t, p, c, importe = p.total, fecha = hoy) {
  return t.R.prepararPago(t.d, p.id, { cuentaId: c.id, fecha, importe, beneficiario: "Cuenta destino 1234" }, tes, hoy);
}

function transicion(t, p, accion, e = {}, actor = tes, fecha = hoy) {
  return t.R.cambiarPago(t.d, p.id, accion, e, actor, fecha);
}

test("cobro parcial en céntimos, con saldo, referencia única, sede y rol", () => {
  const t = entorno(), c = cuenta(t), p = partida(t, "Cobrar");
  const e = { cuentaId: c.id, fecha: hoy, referencia: "POS-01", importe: 25000 };
  assert.throws(() => t.R.cobrar(t.d, p.id, e, otraSede, hoy), /sede/);
  assert.throws(() => t.R.cobrar(t.d, p.id, e, cont, hoy), /rol/);
  assert.throws(() => t.R.cobrar(t.d, p.id, { ...e, importe: 1.5 }, tes, hoy), /importe/);
  assert.throws(() => t.R.cobrar(t.d, p.id, { ...e, fecha: mañana }, tes, hoy), /fecha/);
  t.R.cobrar(t.d, p.id, e, tes, hoy);
  assert.equal(t.R.saldoPartida(t.d, p), 75000);
  assert.equal(t.R.saldoCuenta(t.d, c, hoy), 8025000);
  assert.throws(() => t.R.cobrar(t.d, p.id, { ...e, referencia: " pos-01 " }, tes, hoy), /referencia/);
  assert.throws(() => t.R.cobrar(t.d, p.id, { ...e, referencia: "POS-02", importe: 75001 }, tes, hoy), /saldo pendiente/);
  assert.equal(t.d.movimientos.length, 1);
});

test("preparar y enviar reserva importes; solo la confirmación reduce la deuda y el saldo", () => {
  const t = entorno(), c = cuenta(t), p = partida(t, "Pagar");
  const pago = preparar(t, p, c, 60000);
  assert.throws(() => preparar(t, p, c, 40001), /sin programar/);
  assert.throws(() => transicion(t, pago, "confirmar", { referencia: "Banco" }), /estado/);
  assert.throws(() => transicion(t, pago, "aprobar", { motivo: "Revisado" }, { ...jefa, nombre: " carla " }), /Otra persona/);
  transicion(t, pago, "aprobar", { motivo: "Beneficiario cotejado" }, jefa);
  transicion(t, pago, "enviar", { referencia: "Lote 01" });
  assert.equal(t.R.saldoPartida(t.d, p), 100000);
  assert.equal(t.R.saldoCuenta(t.d, c, hoy), 8000000);
  assert.equal(t.R.disponible(t.d, c, hoy), 7940000);
  transicion(t, pago, "confirmar", { fecha: hoy, referencia: "REF-01" });
  assert.equal(t.R.saldoPartida(t.d, p), 40000);
  assert.equal(t.R.saldoCuenta(t.d, c, hoy), 7940000);
  assert.equal(t.R.disponible(t.d, c, hoy), 7940000);
  assert.equal(t.d.movimientos[0].pagoId, pago.id);
  assert.throws(() => transicion(t, pago, "confirmar", { fecha: hoy, referencia: "OTRA" }), /estado/);
  assert.deepEqual(Array.from(pago.historial, e => e.usuario), ["Carla", "Ana", "Carla", "Carla"]);
});

test("fecha programada, fondos de banco y rechazo liberan la programación", () => {
  const t = entorno(), c = cuenta(t, { apertura: 100000 }), p = partida(t, "Pagar");
  const pago = preparar(t, p, c, 80000, mañana), otro = preparar(t, p, c, 20000);
  const deuda = partida(t, "Pagar", { documento: "F001-21" });
  const tercerPago = preparar(t, deuda, c, 40000);
  for (const candidato of [pago, otro, tercerPago]) transicion(t, candidato, "aprobar", { motivo: "Cuenta comprobada" }, jefa);
  assert.throws(() => transicion(t, pago, "enviar", { referencia: "ENV-1" }), /fecha programada/);
  transicion(t, pago, "enviar", { referencia: "ENV-1" }, tes, mañana);
  assert.throws(() => transicion(t, tercerPago, "enviar", { referencia: "ENV-2" }, tes, mañana), /fondos/);
  transicion(t, pago, "fallar", { motivo: "Constancia de rechazo del banco" }, tes, mañana);
  transicion(t, tercerPago, "enviar", { referencia: "ENV-2" }, tes, mañana);
  transicion(t, otro, "cancelar", { motivo: "Proveedor cambió la fecha" });
  assert.equal(t.R.pagoPendiente(t.d, p.id).length, 0);
  assert.equal(t.R.saldoPartida(t.d, p), 100000);
});

test("un cargo retroactivo no puede dejar el banco sin fondos en una fecha posterior", () => {
  const t = entorno(), c = cuenta(t, { apertura: 10000 });
  t.R.ajustar(t.d, { cuentaId: c.id, concepto: "Comisión bancaria", fecha: hoy, referencia: "BC-1", importe: 7000 }, tes, hoy);
  assert.throws(() => t.R.ajustar(t.d, { cuentaId: c.id, concepto: "Comisión bancaria", fecha: apertura,
    referencia: "BC-2", importe: 3001 }, tes, hoy), /fondos/);
  assert.equal(t.R.saldoCuenta(t.d, c, hoy), 3000);
});

test("proyección suma solo partidas abiertas y mueve al día programado la fracción de pago", () => {
  const t = entorno(), c = cuenta(t);
  partida(t, "Cobrar", { documento: "C-01", vence: hoy, importe: 4500000 });
  const p = partida(t, "Pagar", { vence: "2026-12-01", importe: 7000000 });
  preparar(t, p, c, 2000000, mañana);
  const flujo = t.R.flujo(t.d, "centro", hoy, "2026-12-19");
  assert.equal(flujo.saldo, 8000000);
  assert.equal(flujo.proyectado, 5500000);
  assert.deepEqual(Array.from(flujo.jornadas, r => [r.fecha, r.cobrar, r.pagar]),
    [[hoy, 4500000, 0], [mañana, 0, 2000000], ["2026-12-01", 0, 5000000]]);
  assert.equal(t.R.flujo(t.d, "centro", hoy, mañana).proyectado, 10500000);
  assert.equal(t.R.flujo(t.d, "surco", hoy, mañana).proyectado, 0);
});

test("conciliación exacta y asistida vinculan una vez y conservan historial de diferencias", () => {
  const t = entorno(), c = cuenta(t, { apertura: 8000000 }), p = partida(t, "Cobrar", { importe: 1300000 });
  const movimiento = (referencia, importe) => t.R.cobrar(t.d, p.id, { cuentaId: c.id, fecha: hoy, referencia, importe }, tes, hoy);
  const recibido = movimiento("BANCO-01", 500000);
  const transito = movimiento("BANCO-02", 800000);
  const linea = (referencia, importe) => t.R.registrarExtracto(t.d, { cuentaId: c.id, fecha: hoy,
    referencia, direccion: "Entrada", importe }, tes, hoy);
  const exacta = linea("Banco-01", 500000);
  const corte = t.R.registrarSaldoBanco(t.d, { cuentaId: c.id, fecha: hoy, referencia: "CORTE", importe: 8500000 }, tes, hoy);
  assert.deepEqual({ ...t.R.corteBanco(t.d, corte) },
    { ajustado: 9800000, diferencia: 500000, excepciones: 1, libro: 9300000, transito: 1300000 });
  assert.equal(t.R.sugerencias(t.d, exacta)[0].id, recibido.id);
  t.R.conciliar(t.d, exacta.id, {}, tes);
  assert.throws(() => t.R.conciliar(t.d, exacta.id, {}, tes), /ya está/);
  assert.deepEqual({ ...t.R.corteBanco(t.d, corte) },
    { ajustado: 9300000, diferencia: 0, excepciones: 0, libro: 9300000, transito: 800000 });
  const asistida = linea("REF-ALT-02", 800000);
  t.R.observar(t.d, asistida.id, "Referencia acortada por el banco", tes);
  assert.throws(() => t.R.conciliar(t.d, asistida.id, {}, tes), /Selecciona un movimiento/);
  assert.throws(() => t.R.conciliar(t.d, asistida.id, { movimientoId: recibido.id, motivo: "No corresponde" }, tes), /Selecciona un movimiento/);
  t.R.conciliar(t.d, asistida.id, { movimientoId: transito.id, motivo: "Referencia cotejada" }, tes);
  assert.equal(asistida.historial.length, 3);
  assert.equal(t.d.movimientos.length, 2);
});

test("CSV de extracto admite referencias entre comillas, céntimos y reintentos sin duplicar", () => {
  const t = entorno(), c = cuenta(t);
  const csv = [
    '\uFEFF"fecha";"referencia";"tipo";"importe"',
    '2026-11-19;"POS; ""Lima""";entrada;1234,56',
    '2026-11-19;" pos; ""lima"" ";ENTRADA;1234.56',
    '2026-11-19;TRF-1;Salida;25.50'
  ].join("\r\n");
  assert.deepEqual({ ...t.R.importarExtracto(t.d, c.id, csv, "extracto.csv", tes, hoy) }, { incorporadas: 2, duplicadas: 1 });
  assert.deepEqual(Array.from(t.d.extractos, x => [x.referencia, x.importe]),
    [['POS; "Lima"', 123456], ["TRF-1", 2550]]);
  assert.deepEqual({ ...t.R.importarExtracto(t.d, c.id, csv, "extracto.csv", tes, hoy) }, { incorporadas: 0, duplicadas: 3 });
  assert.equal(t.d.extractos[0].historial[0].accion, "Línea importada desde extracto.csv");
  assert.equal(t.d.movimientos.length, 0);
});

test("CSV identifica la fila inválida y conserva todo el lote sin publicar", () => {
  const t = entorno(), c = cuenta(t);
  const csv = 'fecha,referencia,tipo,importe\n2026-11-19,"POS, Centro",Entrada,200\n\n2026-11-20,TRF,Salida,10';
  assert.throws(() => t.R.importarExtracto(t.d, c.id, csv, "extracto.csv", tes, hoy), /Fila 4: La fecha/);
  assert.throws(() => t.R.importarExtracto(t.d, c.id, csv.replace("2026-11-20,TRF,Salida,10", "2026-11-19,TRF,Salida,1.234"), "extracto.csv", tes, hoy),
    /Fila 4: escribe el importe/);
  assert.throws(() => t.R.importarExtracto(t.d, c.id, csv.replace('"POS, Centro"', '"POS, Centro'), "extracto.csv", tes, hoy),
    /Fila 2: se necesitan cuatro columnas/);
  assert.throws(() => t.R.importarExtracto(t.d, c.id, csv, "extracto.csv", otraSede, hoy), /sede/);
  assert.throws(() => t.R.importarExtracto(t.d, c.id, csv, "extracto.csv", cont, hoy), /rol/);
  assert.equal(t.d.extractos.length, 0);
});

test("CSV admite reintentar un extracto cerrado y rechaza filas nuevas en ese corte", () => {
  const t = entorno(), c = cuenta(t), p = partida(t, "Cobrar");
  const csv = "fecha,referencia,tipo,importe\n2026-11-19,POS-11,Entrada,10.00";
  t.R.cobrar(t.d, p.id, { cuentaId: c.id, fecha: hoy, referencia: "POS-11", importe: 1000 }, tes, hoy);
  t.R.importarExtracto(t.d, c.id, csv, "extracto.csv", tes, hoy);
  t.R.conciliar(t.d, t.d.extractos[0].id, {}, tes);
  const saldo = t.R.registrarSaldoBanco(t.d, { cuentaId: c.id, fecha: hoy, referencia: "CORTE", importe: c.apertura + 1000 }, tes, hoy);
  t.R.cerrarConciliacion(t.d, saldo.id, "Saldo revisado", cont);
  assert.equal(t.R.importarExtracto(t.d, c.id, csv, "extracto.csv", tes, hoy).duplicadas, 1);
  assert.throws(() => t.R.importarExtracto(t.d, c.id, csv.replace("POS-11", "POS-12"), "extracto.csv", tes, hoy), /Fila 2: .*cerrada/);
  assert.equal(t.d.extractos.length, 1);
});

test("cierre independiente protege el corte y admite movimientos posteriores", () => {
  const t = entorno(), c = cuenta(t), p = partida(t, "Cobrar");
  const saldo = t.R.registrarSaldoBanco(t.d, { cuentaId: c.id, fecha: hoy, referencia: "CORTE", importe: c.apertura }, tes, hoy);
  assert.throws(() => t.R.cerrarConciliacion(t.d, saldo.id, "Revisado", tes), /rol/);
  assert.throws(() => t.R.cerrarConciliacion(t.d, saldo.id, "Revisado", { ...cont, nombre: tes.nombre }), /Otra persona/);
  const e = { cuentaId: c.id, fecha: hoy, referencia: "POS-10", importe: 1000 };
  const movimiento = t.R.cobrar(t.d, p.id, e, tes, hoy);
  assert.equal(t.R.corteBanco(t.d, saldo).transito, 1000);
  const linea = t.R.registrarExtracto(t.d, { ...e, referencia: "BANCO-SIN-PARTIDA", direccion: "Entrada" }, tes, hoy);
  assert.throws(() => t.R.cerrarConciliacion(t.d, saldo.id, "Revisado", cont), /Resuelve las diferencias/);
  t.R.conciliar(t.d, linea.id, { movimientoId: movimiento.id, motivo: "Referencia acreditada" }, tes);
  const conciliable = t.R.registrarSaldoBanco(t.d, { cuentaId: c.id, fecha: mañana, referencia: "CORTE-2", importe: c.apertura + 1000 }, tes, mañana);
  t.R.cerrarConciliacion(t.d, conciliable.id, "Saldo verificado", cont);
  assert.equal(conciliable.cierre.diferencia, 0);
  assert.throws(() => t.R.cerrarConciliacion(t.d, saldo.id, "Intento posterior", cont), /ya cerrada/);
  assert.throws(() => t.R.cobrar(t.d, p.id, { ...e, referencia: "POS-11" }, tes, mañana), /ya cerrada/);
  assert.throws(() => t.R.registrarExtracto(t.d, { ...e, referencia: "EXT-NUEVA", direccion: "Entrada" }, tes, mañana), /ya cerrada/);
  t.R.cobrar(t.d, p.id, { ...e, fecha: "2026-11-21", referencia: "POS-12" }, tes, "2026-11-21");
  assert.equal(t.R.corteBanco(t.d, conciliable).libro, c.apertura + 1000);
});

test("importación conserva proveedor, documento e IGV de factura logística verificada de la sede", () => {
  const t = entorno();
  const f = { id: "factura-1", numero: "VF-001", documento: "F001-300", fecha: apertura, proveedor: "Proveedor A",
    estado: "Verificada", moneda: "PEN", base: 500000, igv: 90000, sede: "centro" };
  assert.throws(() => t.R.importarFactura(t.d, f.id, mañana, otraSede, hoy, [f]), /en esta sede/);
  assert.throws(() => t.R.importarFactura(t.d, f.id, mañana, tes, hoy, [{ ...f, estado: "Observada" }]), /verificada/);
  const p = t.R.importarFactura(t.d, f.id, mañana, tes, hoy, [f]);
  assert.equal(p.total, 590000);
  assert.equal(p.referenciaLogistica, f.numero);
  assert.equal(p.tercero, f.proveedor);
  assert.throws(() => t.R.importarFactura(t.d, f.id, mañana, tes, hoy, [f]), /incorporada/);
  assert.throws(() => partida(t, "Pagar", { documento: " f001-300 " }), /ya está registrado/);
  assert.equal(t.d.partidas.length, 1);
});

test("guardar relee bajo bloqueo y un comando fallido no persiste datos parciales", async () => {
  let cola = Promise.resolve();
  const locks = { request: (nombre, tarea) => {
    assert.equal(nombre, "famihogar.tesoreria.v1");
    const siguiente = cola.then(tarea);
    cola = siguiente.catch(() => {});
    return siguiente;
  } };
  const { A, R, memoria } = entorno({ locks });
  const e = { tipo: "Cobrar", tercero: "Cliente A", documento: "F001-100", fecha: apertura, vence: hoy, importe: 1000 };
  const resultado = await Promise.allSettled([A.guardar(d => R.registrarPartida(d, e, tes, hoy)),
    A.guardar(d => R.registrarPartida(d, e, tes, hoy))]);
  assert.deepEqual(resultado.map(r => r.status), ["fulfilled", "rejected"]);
  assert.equal(A.leer().partidas.length, 1);
  const inicial = memoria.get(A.CLAVE);
  await assert.rejects(A.guardar(d => {
    R.registrarPartida(d, { ...e, documento: "F001-101" }, tes, hoy);
    throw Error("Fallo intermedio");
  }), /Fallo intermedio/);
  assert.equal(memoria.get(A.CLAVE), inicial);
});
