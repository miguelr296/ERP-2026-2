const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const raiz = path.resolve(__dirname, "../../src/Erp.Api/wwwroot");
const fecha = "2026-11-24";
const admin = { nombre: "Demo", rol: "Super Admin", sede: "centro" };
const facturador = { nombre: "Elena", rol: "Facturación", sede: "centro" };
const tesorero = { nombre: "Rosa", rol: "Tesorería", sede: "centro" };
const jefe = { nombre: "Patricia", rol: "Jefatura", sede: "centro" };
const contador = { nombre: "Jorge", rol: "Contabilidad", sede: "centro" };

class FechaFija extends Date {
  constructor(...args) { super(...(args.length ? args : [fecha + "T18:00:00Z"])); }
}

function entorno() {
  const memoria = new Map();
  const localStorage = { getItem: k => memoria.get(k) ?? null, setItem: (k, v) => memoria.set(k, v) };
  const w = {};
  const ctx = vm.createContext({ window: w, Date: FechaFija, localStorage, crypto: webcrypto });
  for (const archivo of ["permisos.js", "datos-comercial.js", "libros.js", "finanzas-reglas.js", "contabilidad-reglas.js", "reportes.js"]) {
    vm.runInContext(fs.readFileSync(path.join(raiz, archivo), "utf8"), ctx, { filename: archivo });
  }
  const pedido = { id: "pedido-1", numero: "PV-00001", estado: "Aprobado", sede: "centro", cliente: w.FAMIHOGAR.clientes[0],
    total: 11800, subtotal: 10000, igv: 1800, condicion: "Crédito 30 días", lineas: [{ codigo: "SOF-001", cantidad: 1 }] };
  const entregas = [{ numero: "DES-00001", fecha, lineas: [{ codigo: "SOF-001", cantidad: 1 }] }];
  w.ContratosComerciales = { listarPedidos: sede => !sede || sede === pedido.sede ? [pedido] : [], listarClientes: () => w.FAMIHOGAR.clientes };
  w.ContratosLogisticos = {
    consultarSeguimiento: () => ({ entregas }), costoEntregado: () => 5500,
    listarFacturasVerificadas: sede => !sede || sede === "centro" ? [{
      id: "factura-1", numero: "VF-00001", documento: "F001-01", proveedorId: "proveedor", proveedor: "Proveedor SAC",
      fecha: "2026-10-27", base: 10000, igv: 1800, condicion: "Contado", ordenId: "orden", ordenNumero: "OC-00001", recepciones: ["REC-00001"]
    }] : [],
    listarProveedoresAprobados: () => [{ id: "proveedor", nombre: "Proveedor SAC" }],
    consultarInventarioInicial: () => ({ fecha: "2026-11-11", valor: 50000 })
  };
  const { Libros: L, Finanzas: F, Contabilidad: C } = w;
  const ejecutar = (actor, f, ...args) => L.ejecutar(actor, (d, a) => f(d, a, ...args));
  const fallaSinEscritura = (mensaje, actor, f, ...args) => {
    const anterior = memoria.get(L.CLAVE);
    assert.throws(() => ejecutar(actor, f, ...args), mensaje);
    assert.equal(memoria.get(L.CLAVE), anterior);
  };
  return { L, F, C, R: w.ReportesERP, pedido, entregas, ejecutar, fallaSinEscritura };
}

test("la cuenta por cobrar exige entrega completa y calcula exposición con el saldo al día", () => {
  const t = entorno(), { F, L } = t;
  const datos = { pedidoId: t.pedido.id, tipoComprobante: "boleta", fecha };
  t.fallaSinEscritura(/rol/, tesorero, F.registrarVenta, datos);
  t.entregas[0].lineas[0].cantidad = 0;
  t.fallaSinEscritura(/todas sus unidades/, facturador, F.registrarVenta, datos);
  t.entregas[0].lineas[0].cantidad = 1;
  const credito = { limite: 50000, exposicion: 0, vencido: 0 };
  assert.equal(F.consultarCredito(t.pedido.cliente.id, null, credito).exposicion, 11800);
  assert.equal(F.consultarCredito(t.pedido.cliente.id, t.pedido.id, credito).exposicion, 0);
  t.fallaSinEscritura(/debe tener RUC/, facturador, F.registrarVenta, { ...datos, tipoComprobante: "factura" });
  const venta = t.ejecutar(facturador, F.registrarVenta, datos);
  assert.equal(venta.referencia, "BOL-INT-000001");
  assert.equal(venta.identificacion, "DNI 70000001");
  assert.equal(F.consultarComprobantes(t.pedido.id)[0].numero, venta.referencia);
  assert.equal(venta.vence, "2026-12-24");
  assert.equal(F.consultarCredito(t.pedido.cliente.id, null, credito).exposicion, 11800);
  t.fallaSinEscritura(/sin comprobante/, facturador, F.registrarVenta, datos);
  t.fallaSinEscritura(/supera el saldo/, tesorero, F.cobrar, venta.id, { cuenta: "banco", importe: 11801, fecha, referencia: "DEP" });
  t.ejecutar(tesorero, F.cobrar, venta.id, { cuenta: "banco", importe: 5000, fecha, referencia: "DEP" });
  assert.equal(F.consultarCredito(t.pedido.cliente.id, null, credito).exposicion, 6800);
  assert.equal(L.leer().asientos.length, 2);
});

test("la factura interna conserva los importes y tiene numeración propia", () => {
  const t = entorno(), { F, L } = t;
  const datos = { pedidoId: t.pedido.id, tipoComprobante: "factura", fecha };
  t.pedido.cliente = { ...t.pedido.cliente, tipoDocumento: "RUC", documento: "20000000001" };
  t.fallaSinEscritura(/sin comprobante/, { ...facturador, sede: "surco" }, F.registrarVenta, datos);
  const factura = t.ejecutar(facturador, F.registrarVenta, datos);
  assert.equal(factura.referencia, "FAC-INT-000001");
  assert.deepEqual([factura.base, factura.igv, factura.total], [10000, 1800, 11800]);
  assert.equal(F.saldo(L.leer(), factura), 11800);
  assert.equal(L.leer().asientos[0].estado, "Pendiente");
});

test("programar no mueve dinero y confirmar exige aprobación, saldo y referencia única", () => {
  const t = entorno(), { F, L } = t;
  const compra = t.ejecutar(tesorero, F.registrarCompra, { facturaId: "factura-1", fecha, vence: "2026-10-27" });
  const programar = { cuenta: "banco", fecha, importe: 10000 };
  const pago = t.ejecutar(tesorero, F.programarPago, compra.id, programar);
  t.fallaSinEscritura(/supera el saldo/, tesorero, F.programarPago, compra.id, programar);
  assert.equal(F.estadoCuenta(L.leer(), compra), "Vencida");
  assert.equal(F.saldo(L.leer(), compra), 11800);
  const movimiento = { fecha, referencia: "PG-001" };
  t.fallaSinEscritura(/aprobado/, tesorero, F.confirmarPago, pago.id, movimiento);
  t.fallaSinEscritura(/Otra persona/, { ...tesorero, rol: "Jefatura" }, F.decidirPago, pago.id, "Aprobado", "Propia");
  t.ejecutar(jefe, F.decidirPago, pago.id, "Aprobado", "Datos revisados");
  t.fallaSinEscritura(/Saldo insuficiente/, tesorero, F.confirmarPago, pago.id, movimiento);
  t.ejecutar(jefe, F.fondoInicial, { cuenta: "banco", fecha, referencia: "FONDO", importe: 10000 });
  t.ejecutar(tesorero, F.confirmarPago, pago.id, movimiento);
  t.fallaSinEscritura(/aprobado/, tesorero, F.confirmarPago, pago.id, movimiento);
  assert.equal(F.saldo(L.leer(), compra), 1800);
  assert.equal(F.saldoCuenta(L.leer(), "centro", "banco"), 0);
});

test("el mismo movimiento bancario no concilia dos partidas", () => {
  const t = entorno(), { F } = t;
  const fondo = t.ejecutar(jefe, F.fondoInicial, { cuenta: "banco", fecha, referencia: "FONDO", importe: 10000 });
  const linea = { direccion: "Ingreso", fecha, importe: 10000 };
  const e1 = t.ejecutar(tesorero, F.registrarExtracto, { ...linea, referencia: "BANK-1" });
  const e2 = t.ejecutar(tesorero, F.registrarExtracto, { ...linea, referencia: "BANK-2" });
  t.ejecutar(tesorero, F.conciliar, e1.id, fondo.id);
  t.fallaSinEscritura(/ya está conciliado/, tesorero, F.conciliar, e2.id, fondo.id);
});

test("el inventario inicial se contabiliza una vez y permanece separado por sede", () => {
  const t = entorno(), { L, C } = t;
  const apertura = t.ejecutar(contador, C.incorporarInventarioInicial, fecha);
  t.fallaSinEscritura(/ya tiene un asiento/, contador, C.incorporarInventarioInicial, fecha);
  t.fallaSinEscritura(/esta sede/, { ...contador, sede: "surco" }, C.contabilizar, apertura.id);
  assert.equal(C.diario(L.leer(), "centro", "2026-11").length, 0);
  t.ejecutar(contador, C.contabilizar, apertura.id);
  assert.equal(C.balances(L.leer(), "centro", "2026-11").find(x => x.cuenta === "20").final, 50000);
  assert.equal(C.diario(L.leer(), "surco", "2026-11").length, 0);
});

test("la depreciación redondea sin sobrepasar el valor depreciable y bloquea duplicados", () => {
  const t = entorno(), { L, F, C } = t;
  const compra = t.ejecutar(admin, F.registrarCompraActivo, { proveedorId: "proveedor", referencia: "A-01", recepcion: "ACT-REC",
    descripcion: "Equipo de tienda", base: 10005, igv: 0, fecha: "2026-07-10", vence: "2026-07-10" });
  const activo = t.ejecutar(contador, C.alta, { documentoId: compra.id, codigo: "AF-01", ubicacion: "Tienda", responsable: "Rosa", vida: 3, residual: 1 });
  t.ejecutar(contador, C.ponerEnUso, activo.id, "2026-07-10");
  assert.deepEqual(Array.from(C.periodosPorDepreciar(L.leer(), "centro")), ["2026-08", "2026-09", "2026-10"]);
  t.fallaSinEscritura(/no tiene depreciaciones/, contador, C.depreciar, "2026-07");
  for (const mes of ["2026-08", "2026-09", "2026-10"]) t.ejecutar(contador, C.depreciar, mes);
  t.fallaSinEscritura(/no tiene depreciaciones/, contador, C.depreciar, "2026-10");
  assert.equal(L.leer().activos[0].depreciaciones.reduce((n, a) => n + a.importe, 0), 10004);
  assert.equal(C.periodosPorDepreciar(L.leer(), "centro").length, 0);
});

test("el cierre exige asientos contabilizados y protege el período de operaciones nuevas", () => {
  const t = entorno(), { L, F, C } = t;
  t.ejecutar(admin, F.registrarCompra, { facturaId: "factura-1", fecha: "2026-10-30", vence: "2026-10-30" });
  t.fallaSinEscritura(/asientos pendientes/, contador, C.cerrarPeriodo, "2026-10", "Cierre de prueba");
  const id = L.leer().asientos[0].id;
  t.fallaSinEscritura(/Tu rol/, tesorero, C.contabilizar, id);
  t.ejecutar(contador, C.contabilizar, id);
  t.ejecutar(contador, C.cerrarPeriodo, "2026-10", "Cierre de prueba");
  assert.equal(C.balances(L.leer(), "centro", "2026-11").find(x => x.cuenta === "42").inicial, -11800);
  t.fallaSinEscritura(/cerrado/, admin, F.fondoInicial, { fecha: "2026-10-31", referencia: "AP", cuenta: "banco", importe: 5000 });
});

test("el reporte separa los saldos al corte de los movimientos del rango y de otras sedes", () => {
  const t = entorno();
  t.L.ejecutar(tesorero, d => {
    d.documentos.push(
      { id: "venta", tipo: "venta", sede: "centro", fecha: "2026-11-01", vence: "2026-11-11", total: 10000, referencia: "BOL-1" },
      { id: "futura", tipo: "venta", sede: "centro", fecha: "2026-11-24", vence: "2026-11-24", total: 5000, referencia: "BOL-2" },
      { id: "otra", tipo: "compra", sede: "surco", fecha: "2026-11-01", vence: "2026-11-01", total: 8000, referencia: "CXP-1" }
    );
    d.movimientos.push(
      { sede: "centro", documentoId: "venta", fecha: "2026-11-10", direccion: "Ingreso", cuenta: "banco", importe: 2000 },
      { sede: "centro", documentoId: "venta", fecha: "2026-11-15", direccion: "Ingreso", cuenta: "banco", importe: 3000 },
      { sede: "centro", documentoId: "venta", fecha: "2026-11-24", direccion: "Ingreso", cuenta: "banco", importe: 5000 }
    );
  });
  const filtro = { desde: "2026-11-15", hasta: "2026-11-20" };
  const previo = JSON.stringify(t.L.leer());
  const reporte = t.R.tesoreria(filtro, tesorero);
  assert.deepEqual(Array.from(reporte.indicadores, fila => fila[1]), [5000, 0, 3000, 0]);
  assert.equal(reporte.tablas[0].filas[0].at(-1), "Vencida");
  assert.equal(reporte.tablas[1].filas.length, 1);
  assert.equal(JSON.stringify(t.L.leer()), previo);
});

test("el CSV exporta textos protegidos y conserva importes numéricos", () => {
  const { R } = entorno();
  const datos = {
    columnas: [{ titulo: "Tercero" }, { titulo: "Documento" }, { titulo: "Saldo", formato: "moneda" }],
    filas: [["  =VALOR", { texto: 'Factura "1"', ruta: "interno" }, -1200]]
  };
  assert.equal(R.csv(datos), '\uFEFF"Tercero";"Documento";"Saldo"\r\n"\'  =VALOR";"Factura ""1""";-12.00\r\n');
});
