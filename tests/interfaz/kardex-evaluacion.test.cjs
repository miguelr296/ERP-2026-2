const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const raiz = path.resolve(__dirname, "../../src/Erp.Api/wwwroot");

function cargar() {
  const escrituras = [];
  const localStorage = { getItem: () => null, setItem: (...args) => escrituras.push(args) };
  const ctx = vm.createContext({ window: {}, structuredClone, crypto: webcrypto, Date, localStorage });
  for (const archivo of ["datos-comercial.js", "reglas-comerciales.js", "datos-logistica.js", "logistica-reglas.js", "compras-reglas.js", "almacenes-reglas.js", "distribucion-reglas.js", "logistica-evaluacion.js"]) {
    vm.runInContext(fs.readFileSync(path.join(raiz, archivo), "utf8"), ctx, { filename: archivo });
  }
  return { w: ctx.window, escrituras };
}

test("el escenario del Kardex ejecuta compra, recepción y venta con promedio ponderado sin persistir datos", () => {
  const { w, escrituras } = cargar();
  const reporte = w.EvaluacionKardex.ejecutar("2026-11-11");
  assert.equal(reporte.metodo, "Promedio Ponderado Móvil por producto y sede");
  assert.equal(reporte.movimientos.length, 5);
  assert.equal(reporte.documentos.requisicion.estado, "Aprobada");
  assert.deepEqual(Array.from(reporte.documentos.ofertas, o => o.estado), ["Seleccionada", "No seleccionada"]);
  assert.equal(reporte.documentos.recepcion.estado, "Conforme");
  assert.equal(reporte.documentos.factura.estado, "Verificada");
  assert.equal(reporte.documentos.pedido.estado, "Aprobado");
  assert.equal(reporte.documentos.despacho.estado, "Entregado");
  assert.equal(reporte.salida.costoUnitarioMovimiento, 106154);
  assert.equal(reporte.salida.saldoInicial, 1380000);
  assert.equal(reporte.salida.saldoFinalCantidad, 12);
  assert.equal(reporte.salida.saldoFinal, 1273846);
  assert.equal(escrituras.length, 0);
  assert.equal(w.FAMIHOGAR_LOGISTICA.existencias["alm-centro"]["SOF-001"], 12);
});

test("la vista de inventario permite abrir y cerrar el escenario agrupado del Kardex", () => {
  const pantalla = fs.readFileSync(path.join(raiz, "pantallas-logistica.js"), "utf8");
  assert.match(pantalla, /Ejecutar escenario de evaluación/);
  assert.match(pantalla, /EvaluacionKardex\.ejecutar\(hoy\(\)\)/);
  assert.match(pantalla, /function vistaEvaluacionKardex\(\)/);
  assert.match(pantalla, /cerrar-evaluacion-kardex/);
  assert.match(pantalla, /Saldos finales/);
});
