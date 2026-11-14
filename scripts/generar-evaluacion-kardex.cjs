// Genera informe local invocando la misma rutina que usa el botón de la aplicación.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const raiz = path.resolve(__dirname, "../src/Erp.Api/wwwroot");
const salida = path.resolve(__dirname, "../TestResults");
const ctx = vm.createContext({ window: {}, structuredClone, crypto: webcrypto, Date });
for (const archivo of ["datos-comercial.js", "reglas-comerciales.js", "datos-logistica.js", "logistica-reglas.js", "compras-reglas.js", "almacenes-reglas.js", "distribucion-reglas.js", "logistica-evaluacion.js"]) {
  vm.runInContext(fs.readFileSync(path.join(raiz, archivo), "utf8"), ctx, { filename: archivo });
}
const reporte = ctx.window.EvaluacionKardex.ejecutar("2026-11-11");
const soles = centimos => `S/ ${(centimos / 100).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;
const filas = reporte.movimientos.map(m => `<tr><td>${m.fecha}</td><td>${reporte.producto}</td><td>${m.tipo}</td><td>${m.referencia}</td><td>${m.numero} · ${m.lote}</td><td>${m.cantidad > 0 ? m.cantidad : "—"}</td><td>${m.cantidad > 0 ? soles(m.costoUnitarioMovimiento) : "—"}</td><td>${m.cantidad > 0 ? soles(m.importeMovimiento) : "—"}</td><td>${m.cantidad < 0 ? -m.cantidad : "—"}</td><td>${m.cantidad < 0 ? soles(m.costoUnitarioMovimiento) : "—"}</td><td>${m.cantidad < 0 ? soles(-m.importeMovimiento) : "—"}</td><td>${m.saldoFinalCantidad}</td><td>${soles(m.costoUnitarioFinal)}</td><td>${soles(m.saldoFinal)}</td></tr>`).join("");
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Evaluación aislada · Kardex valorizado</title>
<style>body{font:16px system-ui,sans-serif;max-width:1600px;margin:2rem auto;padding:0 1rem;color:#173d35}h1,h2{color:#145b49}.aviso{background:#fff4d6;border-left:5px solid #bd8e24;padding:1rem}.resumen{display:flex;gap:1rem;flex-wrap:wrap}.resumen div{border:1px solid #ccd8d1;border-radius:8px;padding:1rem;min-width:170px}table{border-collapse:collapse;width:100%;margin:1rem 0;font-size:.86rem}th,td{border:1px solid #ccd8d1;padding:.5rem;text-align:left;white-space:nowrap}th{background:#eaf1ec}thead tr:first-child th{background:#dcebe2}.trace{line-height:1.7}.note{color:#485d56}</style>
<h1>Kardex valorizado · escenario de evaluación</h1><p class="aviso"><b>Datos aislados de evaluación.</b> Generados en memoria con actores simulados. No son operaciones reales ni se guardan en el navegador. “Jefatura de prueba” no representa una aprobación de Miguel.</p>
<div class="resumen"><div><b>Método</b><br>${reporte.metodo}</div><div><b>Producto / sede</b><br>${reporte.producto} · ${reporte.sede}</div><div><b>Salida</b><br>1 unidad · ${soles(reporte.salida.costoUnitarioMovimiento)}</div><div><b>Saldo final</b><br>${reporte.salida.saldoFinalCantidad} · ${soles(reporte.salida.saldoFinal)}</div></div>
<h2>Recorrido con trazabilidad</h2><ol class="trace">${reporte.trazabilidad.map(x => `<li>${x}</li>`).join("")}</ol>
<h2>Movimientos del producto</h2><p class="note">Montos redondeados a céntimos; el movimiento de venta usa el promedio ponderado móvil previo.</p>
<table><thead><tr><th rowspan="2">Fecha</th><th rowspan="2">Producto</th><th rowspan="2">Tipo de movimiento</th><th rowspan="2">Referencia</th><th rowspan="2">Movimiento / lote</th><th colspan="3">Entradas</th><th colspan="3">Salidas</th><th colspan="3">Saldos finales</th></tr><tr><th>Cantidad</th><th>Costo unitario</th><th>Costo total</th><th>Cantidad</th><th>Costo unitario</th><th>Costo total</th><th>Cantidad</th><th>Costo unitario</th><th>Costo total</th></tr></thead><tbody>${filas}</tbody></table>
<h2>Identificadores y aprobaciones simuladas</h2><pre>${JSON.stringify(reporte.documentos, null, 2)}</pre><p class="note">La revisión contable de ajustes, devoluciones, traslados, reparaciones y bajas sigue pendiente.</p></html>`;
fs.mkdirSync(salida, { recursive: true });
fs.writeFileSync(path.join(salida, "kardex-evaluacion.json"), JSON.stringify(reporte, null, 2));
fs.writeFileSync(path.join(salida, "kardex-evaluacion.html"), html);
console.log(JSON.stringify({ resultado: "Escenario generado", archivos: [path.join(salida, "kardex-evaluacion.html"), path.join(salida, "kardex-evaluacion.json")], salida: reporte.salida, documentos: reporte.documentos, movimientos: reporte.movimientos.length }, null, 2));
