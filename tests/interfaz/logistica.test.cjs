const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");
const raiz = path.resolve(__dirname, "../../src/Erp.Api/wwwroot");
const compras = { nombre: "Pablo", rol: "Compras", sede: "centro" };
const almacen = { nombre: "Luis", rol: "Almacén", sede: "centro" };
const jefe = { nombre: "Miguel", rol: "Jefatura", sede: "centro" };
const transporte = { nombre: "Ana", rol: "Transporte", sede: "centro" };
const asesor = { ...almacen, rol: "Asesor" };
const hoy = "2026-11-11";
const linea = (cantidad = 3) => [{ codigo: "SOF-001", cantidad }];

function entorno() {
  const memoria = new Map();
  const localStorage = { getItem: k => memoria.get(k) || null, setItem: (k, v) => memoria.set(k, v) };
  const ctx = vm.createContext({ window: {}, structuredClone, crypto: webcrypto, Date, localStorage });
  for (const f of ["datos-comercial.js", "reglas-comerciales.js", "datos-logistica.js", "logistica-reglas.js", "compras-reglas.js", "almacenes-reglas.js", "distribucion-reglas.js"]) vm.runInContext(fs.readFileSync(path.join(raiz, f), "utf8"), ctx, { filename: f });
  const w = ctx.window, comercial = w.ReglasComerciales.prepararDatos(w.FAMIHOGAR, null);
  w.ContratosComerciales = { listarProductos: () => structuredClone(comercial.productos), listarPedidos: sede => structuredClone(comercial.pedidos.filter(p => !sede || p.sede === sede)), listarDevoluciones: sede => structuredClone(comercial.solicitudes.filter(s => !sede || s.sede === sede)) };
  for (const f of ["logistica-aplicacion.js", "integraciones-locales.js"]) vm.runInContext(fs.readFileSync(path.join(raiz, f), "utf8"), ctx, { filename: f });
  const A = w.LogisticaAplicacion;
  return { w, A, L: w.LogisticaReglas, C: w.ComprasReglas, M: w.AlmacenesReglas, D: w.DistribucionReglas, comercial, memoria, localStorage, ejecutar: (actor, fn) => A.ejecutar(actor, fn), leer: () => A.leer() };
}
function requisicion(t, cantidad = 3) {
  const r = t.ejecutar(compras, (d, s) => t.C.crearRequisicion(d, { almacen: "alm-centro", requerida: "2026-11-18", motivo: "Reposición de sala", lineas: linea(cantidad) }, compras, s.productos));
  t.ejecutar(jefe, d => t.C.resolverRequisicion(d, r.id, true, "Necesidad revisada", jefe)); return r;
}
function orden(t, cantidad = 3) {
  const req = requisicion(t, cantidad);
  const rfq = t.ejecutar(compras, d => t.C.crearPeticion(d, { requisicionId: req.id, proveedores: ["prov-madera", "prov-hogar"] }, compras));
  const oferta = t.ejecutar(compras, d => t.C.registrarOferta(d, { peticionId: rfq.id, proveedorId: "prov-madera", vigenteHasta: "2026-12-01", plazoDias: 7, calidad: 4, condicion: "Crédito 30 días", lineas: [{ ...linea(cantidad)[0], precio: 100000 }] }, compras, hoy));
  t.ejecutar(jefe, d => t.C.adjudicar(d, oferta.id, "Precio y calidad revisados", jefe, hoy));
  const oc = t.ejecutar(compras, d => t.C.crearOrden(d, { ofertaId: oferta.id, entregaPrevista: "2026-11-18" }, compras, hoy));
  t.ejecutar(jefe, d => t.C.resolverOrden(d, oc.id, true, "Compra autorizada", jefe));
  t.ejecutar(compras, d => t.C.emitirOrden(d, oc.id, compras, hoy)); return oc;
}
function recibir(t, oc, cantidad = 3, documento = "GP-001", lote = "LOTE-001") {
  return t.ejecutar(almacen, (d, s) => t.C.recibir(d, { ordenId: oc.id, documento, lote, fecha: hoy, lineas: linea(cantidad) }, almacen, s.config));
}
function inspeccionar(t, rec, conforme = true) { return t.ejecutar(almacen, (d, s) => t.C.inspeccionar(d, rec.id, conforme, "Inspección física revisada", "RACK-A", almacen, s.config)); }
function factura(t, oc, cantidad = 3, cambios = {}) {
  return t.ejecutar(compras, (d, s) => t.C.verificarFactura(d, { ordenId: oc.id, documento: "F001-001", fecha: hoy, baseInformada: cantidad * 100000, lineas: [{ ...linea(cantidad)[0], precio: 100000 }], ...cambios }, compras, s.config));
}
function pedido(t, cantidad = 3, id = "pv-1") {
  const p = { id, numero: "PV-00001", sede: "centro", estado: "Aprobado", cliente: { nombre: "Cliente de prueba", direccion: "Av. Ejemplo 100" }, entrega: "2026-11-18", lineas: linea(cantidad) };
  t.comercial.pedidos.push(p); return p;
}
function reservar(t, p, cantidad = p.lineas[0].cantidad) { return t.ejecutar(almacen, (d, s) => t.D.reservar(d, { pedidoId: p.id, almacen: "alm-centro", lineas: linea(cantidad) }, almacen, s.pedidos, s.config)); }
function picking(t, res, cantidad = 3) { return t.ejecutar(almacen, (d, s) => t.D.crearPicking(d, { reservaId: res.id, lineas: linea(cantidad) }, almacen, s.pedidos)); }
function avanzar(t, p, estado) { return t.ejecutar(almacen, (d, s) => t.D.avanzarPicking(d, p.id, estado, "Preparación revisada", almacen, s.pedidos)); }
function despachar(t, p, cantidad = 3) {
  const res = reservar(t, p, cantidad), pick = picking(t, res, cantidad); avanzar(t, pick, "Preparado"); avanzar(t, pick, "Embalado");
  return t.ejecutar(almacen, (d, s) => t.D.crearDespacho(d, { pickingId: pick.id, fecha: hoy, transportista: "Ana", placa: "ABC-123", destino: p.cliente.direccion }, almacen, s.pedidos, s.config));
}
function entregar(t, des, cantidad = 3) {
  t.ejecutar(transporte, d => t.D.iniciarRuta(d, des.id, transporte));
  return t.ejecutar(transporte, d => t.D.confirmarEntrega(d, { despachoId: des.id, fecha: hoy, receptor: "Elena", evidencia: "Constancia POD-001", motivo: cantidad < 3 ? "Cliente recibe parcialmente" : "", lineas: linea(cantidad) }, transporte));
}
function saldo(t, calidad = "Disponible", sede = "alm-centro") { return t.L.saldo(t.leer(), sede, "SOF-001", null, calidad); }
function fallaSinGuardar(t, fn, mensaje) { const antes = JSON.stringify(t.leer()); assert.throws(fn, mensaje); assert.equal(JSON.stringify(t.leer()), antes); }

test("inicio conserva los saldos comerciales en tres almacenes", () => { const t = entorno(); assert.equal(saldo(t), 12); assert.equal(saldo(t, "Disponible", "alm-olivos"), 4); assert.equal(t.leer().revision, 0); });
test("lectura devuelve una copia y rechaza versiones incompatibles sin reemplazarlas", () => {
  const t = entorno(); const d = t.leer(); d.version = 900; t.memoria.set(t.A.CLAVE, JSON.stringify(d)); const antes = t.memoria.get(t.A.CLAVE);
  assert.throws(() => t.leer(), /no son compatibles/); assert.equal(t.memoria.get(t.A.CLAVE), antes);
});
test("datos incompletos y JSON roto se conservan al rechazarse", () => {
  const t = entorno(); const d = t.leer(); delete d.facturas; t.memoria.set(t.A.CLAVE, JSON.stringify(d)); assert.throws(() => t.leer(), /compatibles/);
  t.memoria.set(t.A.CLAVE, "{roto"); assert.throws(() => t.leer()); assert.equal(t.memoria.get(t.A.CLAVE), "{roto");
});
test("fallo al guardar no deja la primera mitad de una operación persistida", () => { const t = entorno(); t.localStorage.setItem = () => { throw Error("quota"); }; fallaSinGuardar(t, () => requisicion(t), /No se pudo guardar/); });
for (const rol of ["Tesorería", "Facturación", "Contabilidad", "Transporte"]) test(`${rol} no crea una necesidad`, () => { const t = entorno(); fallaSinGuardar(t, () => t.ejecutar({ ...compras, rol }, (d, s) => t.C.crearRequisicion(d, { almacen: "alm-centro", requerida: hoy, motivo: "Necesidad", lineas: linea() }, { ...compras, rol }, s.productos)), /rol/); });
test("Asesor plantea necesidades sin aprobarlas", () => { const t = entorno(); const r = t.ejecutar(asesor, (d, s) => t.C.crearRequisicion(d, { almacen: "alm-centro", requerida: hoy, motivo: "Faltan muebles", lineas: linea() }, asesor, s.productos)); fallaSinGuardar(t, () => t.ejecutar(asesor, d => t.C.resolverRequisicion(d, r.id, true, "Revisado", asesor)), /rol/); });
for (const caso of ["otra sede", "producto repetido", "cantidad cero", "fecha inválida", "producto inexistente"]) test(`necesidad rechaza ${caso}`, () => {
  const t = entorno(), e = { almacen: "alm-centro", requerida: hoy, motivo: "Reposición", lineas: linea() };
  if (caso === "otra sede") e.almacen = "alm-surco";
  if (caso === "producto repetido") e.lineas.push(...linea());
  if (caso === "cantidad cero") e.lineas[0].cantidad = 0;
  if (caso === "fecha inválida") e.requerida = "2026-02-30";
  if (caso === "producto inexistente") e.lineas[0].codigo = "AJENO";
  fallaSinGuardar(t, () => t.ejecutar(compras, (d, s) => t.C.crearRequisicion(d, e, compras, s.productos)));
});
test("proveedor exige RUC único y revisión por otra persona", () => {
  const t = entorno(), entrada = { ruc: "20000000103", nombre: "Proveedor nuevo", direccion: "Calle 20" };
  const p = t.ejecutar(compras, d => t.C.guardarProveedor(d, entrada, compras));
  fallaSinGuardar(t, () => t.ejecutar(compras, d => t.C.guardarProveedor(d, entrada, compras)), /RUC/);
  fallaSinGuardar(t, () => t.ejecutar({ ...compras, rol: "Jefatura", nombre: " PABLO " }, d => t.C.resolverProveedor(d, p.id, true, "Revisado", { ...compras, rol: "Jefatura", nombre: " PABLO " })), /Otra persona/);
  t.ejecutar(jefe, d => t.C.resolverProveedor(d, p.id, true, "Maestro revisado", jefe)); assert.equal(t.leer().proveedores.at(-1).estado, "Aprobado");
});
test("cambiar un proveedor no altera la copia guardada en la OC", () => {
  const t = entorno(), oc = orden(t); const original = oc.proveedor.nombre;
  t.ejecutar(compras, d => t.C.guardarProveedor(d, { id: "prov-madera", ruc: "20000000101", nombre: "Nombre modificado", direccion: "Nueva dirección" }, compras));
  assert.equal(t.leer().proveedores[0].nombre, original);
  t.ejecutar(jefe, d => t.C.resolverProveedor(d, "prov-madera", true, "Cambio revisado", jefe)); assert.equal(t.leer().ordenes[0].proveedor.nombre, original);
});
test("RFQ requiere necesidad aprobada, proveedores únicos y una sola petición", () => {
  const t = entorno(), r = requisicion(t);
  fallaSinGuardar(t, () => t.ejecutar(compras, d => t.C.crearPeticion(d, { requisicionId: r.id, proveedores: ["prov-madera", "prov-madera"] }, compras)), /sin repetir/);
  t.ejecutar(compras, d => t.C.crearPeticion(d, { requisicionId: r.id, proveedores: ["prov-madera"] }, compras));
  fallaSinGuardar(t, () => t.ejecutar(compras, d => t.C.crearPeticion(d, { requisicionId: r.id, proveedores: ["prov-hogar"] }, compras)), /ya tiene/);
});
test("adjudicación cambia estados, copia precios y no permite oferta repetida", () => {
  const t = entorno(), oc = orden(t), d = t.leer(); assert.equal(d.peticionesOferta[0].estado, "Adjudicada"); assert.equal(d.ofertas[0].estado, "Seleccionada"); assert.equal(oc.base, 300000);
  fallaSinGuardar(t, () => t.ejecutar(compras, datos => t.C.registrarOferta(datos, { ...d.ofertas[0] }, compras, hoy)), /no está abierta|Ya se registró/);
  assert.equal(t.ejecutar(compras, datos => t.C.crearOrden(datos, { ofertaId: oc.ofertaId, entregaPrevista: hoy }, compras, hoy)).id, oc.id);
});
test("orden no se emite antes de revisión ni puede revisarla su autor", () => {
  const t = entorno(), oc = orden(t); t.ejecutar(jefe, d => { d.ordenes[0].estado = "Pendiente"; });
  fallaSinGuardar(t, () => t.ejecutar(compras, d => t.C.emitirOrden(d, oc.id, compras, hoy)), /aprobación/);
  const mismo = { ...compras, rol: "Jefatura" }; fallaSinGuardar(t, () => t.ejecutar(mismo, d => t.C.resolverOrden(d, oc.id, true, "Revisión propia", mismo)), /Otra persona/);
});
test("acuerdo marco limita la cantidad acumulada de todas sus OC", () => {
  const t = entorno(); const a = t.ejecutar(compras, (d, s) => t.C.guardarAcuerdo(d, { proveedorId: "prov-madera", desde: hoy, hasta: "2026-12-01", condicion: "Contado", lineas: [{ ...linea(5)[0], precio: 90000 }] }, compras, s.productos));
  t.ejecutar(jefe, d => t.C.resolverAcuerdo(d, a.id, true, "Acuerdo revisado", jefe));
  const r1 = requisicion(t), r2 = requisicion(t);
  const e = { acuerdoId: a.id, requisicionId: r1.id, entregaPrevista: hoy };
  const oc = t.ejecutar(compras, d => t.C.crearOrden(d, e, compras, hoy)); assert.equal(oc.base, 270000);
  assert.equal(t.ejecutar(compras, d => t.C.crearOrden(d, e, compras, hoy)).id, oc.id);
  fallaSinGuardar(t, () => t.ejecutar(compras, d => t.C.crearOrden(d, { ...e, requisicionId: r2.id }, compras, hoy)), /acumulada/);
  t.ejecutar(jefe, d => t.C.anularOrden(d, oc.id, "No se requiere", jefe)); t.ejecutar(compras, d => t.C.crearOrden(d, { ...e, requisicionId: r2.id }, compras, hoy));
});
test("recepción parcial queda en cuarentena hasta inspección", () => {
  const t = entorno(), oc = orden(t), r = recibir(t, oc, 2); assert.equal(saldo(t), 12); assert.equal(saldo(t, "Cuarentena"), 2); assert.equal(t.leer().ordenes[0].estado, "Parcialmente recibida");
  inspeccionar(t, r); assert.equal(saldo(t), 14); assert.equal(saldo(t, "Cuarentena"), 0);
  inspeccionar(t, recibir(t, oc, 1, "GP-002", "LOTE-002")); assert.equal(saldo(t), 15); assert.equal(t.leer().ordenes[0].estado, "Recibida");
});
test("no se sobre-recibe ni duplica un documento físico", () => {
  const t = entorno(), oc = orden(t); recibir(t, oc, 2);
  fallaSinGuardar(t, () => recibir(t, oc, 1), /ya está registrado/);
  fallaSinGuardar(t, () => recibir(t, oc, 2, "GP-002"), /supera/);
});
test("inspección repetida y destino incompatible no publican movimientos parciales", () => {
  const t = entorno(), r = recibir(t, orden(t));
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.C.inspeccionar(d, r.id, true, "Revisado", "CUARENTENA", almacen, s.config)), /estado de calidad/);
  inspeccionar(t, r); fallaSinGuardar(t, () => inspeccionar(t, r), /ya fue inspeccionada/);
});
test("no conforme permanece bloqueado; devolver al proveedor permite reposición", () => {
  const t = entorno(), oc = orden(t), r = recibir(t, oc); inspeccionar(t, r, false); assert.equal(saldo(t), 12);
  fallaSinGuardar(t, () => t.ejecutar(jefe, (d, s) => t.D.resolverCuarentena(d, { almacen: "alm-centro", origen: "CUARENTENA", codigo: "SOF-001", lote: "LOTE-001", cantidad: 3, destinoCalidad: "Disponible", destino: "RACK-A", motivo: "Liberación directa", fecha: hoy }, jefe, s.config)), /ficha de la recepción/);
  t.ejecutar(almacen, (d, s) => t.C.devolverProveedor(d, r.id, "Producto defectuoso", almacen, s.config)); assert.equal(saldo(t, "Cuarentena"), 0); assert.equal(t.leer().ordenes[0].estado, "Parcialmente recibida");
  inspeccionar(t, recibir(t, oc, 3, "GP-REPOSICION", "NUEVO")); assert.equal(saldo(t), 15);
});
test("factura antes de conformidad queda observada y se revalida con historial", () => {
  const t = entorno(), oc = orden(t), f = factura(t, oc); assert.equal(f.estado, "Observada"); assert.equal(t.w.ContratosLogisticos.listarFacturasVerificadas("centro").length, 0);
  inspeccionar(t, recibir(t, oc)); const actual = t.ejecutar(compras, (d, s) => t.C.revalidarFactura(d, f.id, compras, s.config));
  assert.equal(actual.estado, "Verificada"); assert.equal(actual.igv, 54000); assert.match(actual.historial.at(-1).accion, /Observaciones anteriores.*sin recepción/); assert.equal(actual.pago, "Pendiente de Finanzas");
  assert.equal(t.w.ContratosLogisticos.listarFacturasVerificadas("centro").length, 1);
});
for (const caso of ["precio", "base", "cantidad", "duplicada"]) test(`cotejo detecta ${caso}`, () => {
  const t = entorno(), oc = orden(t); inspeccionar(t, recibir(t, oc));
  const cambios = caso === "precio" ? { lineas: [{ ...linea()[0], precio: 99999 }] } : caso === "base" ? { baseInformada: 1 } : caso === "cantidad" ? { baseInformada: 400000, lineas: [{ ...linea(4)[0], precio: 100000 }] } : {};
  const f = factura(t, oc, 3, cambios);
  if (caso === "duplicada") fallaSinGuardar(t, () => factura(t, oc), /ya está registrada/); else assert.equal(f.estado, "Observada");
});
test("dos facturas no consumen dos veces la misma recepción conforme", () => { const t = entorno(), oc = orden(t); inspeccionar(t, recibir(t, oc)); factura(t, oc); assert.equal(factura(t, oc, 1, { documento: "F001-002" }).estado, "Observada"); });
test("orden con recepciones no se anula y evaluación usa evidencia registrada", () => {
  const t = entorno(), oc = orden(t); inspeccionar(t, recibir(t, oc)); fallaSinGuardar(t, () => t.ejecutar(jefe, d => t.C.anularOrden(d, oc.id, "Cancelar compra", jefe)), /recepciones o facturas/);
  const e = t.ejecutar(compras, d => t.C.evaluarProveedor(d, { proveedorId: "prov-madera", comentario: "Entrega correcta" }, compras)); assert.equal(e.conformes, 1); assert.equal(e.aTiempo, 1);
});
test("reserva reduce disponible, no stock físico; reintento devuelve la misma", () => {
  const t = entorno(), p = pedido(t), r = reservar(t, p); assert.equal(saldo(t), 12); assert.equal(t.L.disponible(t.leer(), "alm-centro", "SOF-001"), 9); assert.equal(reservar(t, p).id, r.id);
  assert.equal(t.w.ContratosLogisticos.consultarDisponibilidad(p).lineas[0].disponible, 12);
  assert.equal(t.w.ContratosLogisticos.consultarDisponibilidad({ ...p, id: "otro" }).lineas[0].disponible, 9);
});
test("otra reserva no sobrevende el stock y no admite pedido sin aprobación", () => {
  const t = entorno(); reservar(t, pedido(t, 10), 10); const p = pedido(t, 3, "pv-2"); fallaSinGuardar(t, () => reservar(t, p), /Stock disponible insuficiente/);
  p.estado = "Bloqueado"; fallaSinGuardar(t, () => reservar(t, p), /aprobado comercialmente/);
});
test("picking no duplica unidades ni permite liberar reserva en preparación", () => {
  const t = entorno(), r = reservar(t, pedido(t)), p = picking(t, r);
  fallaSinGuardar(t, () => picking(t, r), /supera/);
  fallaSinGuardar(t, () => t.ejecutar(almacen, d => t.D.liberarReserva(d, r.id, "Revisado", almacen)), /Anula los picking/);
  avanzar(t, p, "Anulado"); t.ejecutar(almacen, d => t.D.liberarReserva(d, r.id, "Pedido reprogramado", almacen)); assert.equal(t.L.disponible(t.leer(), "alm-centro", "SOF-001"), 12);
});
test("picking exige preparar antes de embalar y vuelve a comprobar pedido", () => {
  const t = entorno(), pv = pedido(t), p = picking(t, reservar(t, pv)); fallaSinGuardar(t, () => avanzar(t, p, "Embalado"), /Transición/);
  pv.estado = "Bloqueado"; fallaSinGuardar(t, () => avanzar(t, p, "Preparado"), /aprobado comercialmente/);
});
test("despacho descuenta físico una vez y no implica entrega", () => {
  const t = entorno(), p = pedido(t), des = despachar(t, p); assert.equal(saldo(t), 9); assert.equal(t.leer().reservas[0].estado, "Consumida");
  const otro = t.ejecutar(almacen, (d, s) => t.D.crearDespacho(d, { pickingId: des.pickingId }, almacen, s.pedidos, s.config)); assert.equal(otro.id, des.id); assert.equal(saldo(t), 9);
  const seguimiento = t.w.ContratosLogisticos.consultarSeguimiento(p.id); assert.equal(seguimiento.salidas.length, 1); assert.equal(seguimiento.entregas.length, 0);
});
test("Almacén no confirma ruta ni entrega; Transporte no mueve inventario", () => {
  const t = entorno(), des = despachar(t, pedido(t)); fallaSinGuardar(t, () => t.ejecutar(almacen, d => t.D.iniciarRuta(d, des.id, almacen)), /rol/);
  fallaSinGuardar(t, () => t.ejecutar(transporte, (d, s) => t.C.recibir(d, {}, transporte, s.config)), /rol/);
});
test("entrega total exige ruta y conserva receptor y constancia", () => {
  const t = entorno(), p = pedido(t), des = despachar(t, p); const d = entregar(t, des); assert.equal(d.estado, "Entregado");
  const s = t.w.ContratosLogisticos.consultarSeguimiento(p.id); assert.equal(s.entregas[0].lineas[0].cantidad, 3); assert.equal(s.entregas[0].receptor, "Elena"); assert.equal(t.leer().retornos.length, 0);
  fallaSinGuardar(t, () => entregar(t, des), /preparado para salir/);
});
test("entrega parcial no repone stock hasta retorno físico y permite reexpedir", () => {
  const t = entorno(), p = pedido(t), des = despachar(t, p); entregar(t, des, 1); assert.equal(saldo(t), 9); assert.equal(t.leer().retornos[0].estado, "Pendiente");
  const ret = t.leer().retornos[0]; t.ejecutar(almacen, (d, s) => t.D.recibirRetorno(d, ret.id, "Dos sofás regresaron", "RACK-A", "Disponible", almacen, s.config, hoy, "RT-001"));
  assert.equal(saldo(t), 11); assert.equal(t.D.despachada(t.leer(), p.id, "SOF-001"), 1); assert.equal(reservar(t, p, 2).lineas[0].cantidad, 2);
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.D.recibirRetorno(d, ret.id, "Repetido", "RACK-A", "Disponible", almacen, s.config, hoy, "RT-001")), /ya recibido/);
});
test("entrega cero crea retorno sin inventar entrega al cliente", () => { const t = entorno(), p = pedido(t), des = despachar(t, p); assert.equal(entregar(t, des, 0).estado, "No entregado"); assert.equal(t.w.ContratosLogisticos.consultarSeguimiento(p.id).entregas.length, 0); assert.equal(t.leer().retornos[0].lineas[0].cantidad, 3); });
test("entrega superior y fecha anterior son rechazadas sin cambios", () => {
  const t = entorno(), des = despachar(t, pedido(t)); t.ejecutar(transporte, d => t.D.iniciarRuta(d, des.id, transporte));
  for (const cambios of [{ lineas: linea(4) }, { fecha: "2026-11-10" }]) fallaSinGuardar(t, () => t.ejecutar(transporte, d => t.D.confirmarEntrega(d, { despachoId: des.id, fecha: hoy, receptor: "Elena", evidencia: "POD", lineas: linea(), ...cambios }, transporte)));
});
function traslado(t) {
  const tra = t.ejecutar(almacen, (d, s) => t.D.crearTraslado(d, { origen: "alm-centro", destino: "alm-olivos", fecha: hoy, motivo: "Reposición de sede", lineas: linea() }, almacen, s.productos));
  t.ejecutar(jefe, d => t.D.aprobarTraslado(d, tra.id, true, "Traslado revisado", jefe)); return tra;
}
test("traslado descuenta origen, queda en tránsito y recibe parcial en destino", () => {
  const t = entorno(), tra = traslado(t), destino = { ...almacen, sede: "olivos" };
  t.ejecutar(almacen, (d, s) => t.D.despacharTraslado(d, tra.id, almacen, s.config)); assert.equal(saldo(t), 9); assert.equal(saldo(t, "Disponible", "alm-olivos"), 4);
  const entrada = { trasladoId: tra.id, fecha: hoy, documento: "TR-001", ubicacion: "RACK-A", calidad: "Disponible", motivo: "Recibido físicamente", lineas: linea(1) };
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.D.recibirTraslado(d, entrada, almacen, s.config)), /sede de destino/);
  t.ejecutar(destino, (d, s) => t.D.recibirTraslado(d, entrada, destino, s.config)); assert.equal(t.leer().traslados[0].estado, "Parcialmente recibido");
  fallaSinGuardar(t, () => t.ejecutar(destino, (d, s) => t.D.recibirTraslado(d, entrada, destino, s.config)), /ya está registrado/);
  t.ejecutar(destino, (d, s) => t.D.recibirTraslado(d, { ...entrada, documento: "TR-002", lineas: linea(2) }, destino, s.config)); assert.equal(saldo(t, "Disponible", "alm-olivos"), 7); assert.equal(t.leer().traslados[0].estado, "Recibido");
});
test("traslado no usa cantidades reservadas", () => { const t = entorno(); reservar(t, pedido(t, 11), 11); const tra = traslado(t); fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.D.despacharTraslado(d, tra.id, almacen, s.config)), /Stock disponible insuficiente/); });
function conteo(t, contado = 11) { return t.ejecutar(almacen, (d, s) => t.L.crearConteo(d, { almacen: "alm-centro", fecha: hoy, motivo: "Inventario físico", lineas: [{ codigo: "SOF-001", ubicacion: "RACK-A", lote: "INICIAL", contado, coste: 100000 }] }, almacen, s.productos)); }
test("conteo aplica solo diferencia tras revisión y conserva historia", () => { const t = entorno(), con = conteo(t); assert.equal(saldo(t), 12); t.ejecutar(jefe, (d, s) => t.L.aprobarConteo(d, con.id, true, "Diferencia revisada", jefe, s.config)); assert.equal(saldo(t), 11); assert.equal(t.leer().movimientos.at(-1).cantidad, -1); });
test("conteo no lo aprueba su autor ni afecta reservas", () => {
  const t = entorno(), con = conteo(t, 1); const mismo = { ...almacen, rol: "Jefatura" };
  fallaSinGuardar(t, () => t.ejecutar(mismo, (d, s) => t.L.aprobarConteo(d, con.id, true, "Revisado", mismo, s.config)), /Otra persona/);
  reservar(t, pedido(t)); fallaSinGuardar(t, () => t.ejecutar(jefe, (d, s) => t.L.aprobarConteo(d, con.id, true, "Revisado", jefe, s.config)), /reservadas/);
});
test("conteo obsoleto exige repetirlo después de un movimiento", () => { const t = entorno(), con = conteo(t); despachar(t, pedido(t)); fallaSinGuardar(t, () => t.ejecutar(jefe, (d, s) => t.L.aprobarConteo(d, con.id, true, "Revisado", jefe, s.config)), /Repite el conteo/); });
test("capacidad y errores tardíos no dejan una salida o ajuste parcial", () => {
  const t = entorno(), r = recibir(t, orden(t, 101), 101);
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.C.inspeccionar(d, r.id, true, "Todo conforme", "EXHIBICION", almacen, s.config)), /capacidad/);
  assert.equal(saldo(t, "Cuarentena"), 101);
});
test("planificación no descuenta dos veces reservas ni despachos en ruta", () => {
  const t = entorno(), p = pedido(t); const plan = () => t.L.planificar(t.leer(), t.A.productos(), t.A.pedidos(), t.A.config, "centro", "2026-11").find(l => l.codigo === "SOF-001");
  assert.equal(plan().proyectado, 9); const des = despachar(t, p); assert.equal(plan().demanda, 0); assert.equal(plan().proyectado, 9);
  entregar(t, des, 1); assert.equal(plan().proyectado, 9);
});
test("previsión y compras pendientes alimentan sugerencia sin sumar demanda repetida", () => {
  const t = entorno(); pedido(t);
  t.ejecutar(compras, (d, s) => t.L.registrarPrevision(d, { codigo: "SOF-001", periodo: "2026-11", cantidad: 20, motivo: "Previsión mensual" }, compras, s.productos));
  const plan = () => t.L.planificar(t.leer(), t.A.productos(), t.A.pedidos(), t.A.config, "centro", "2026-11").find(l => l.codigo === "SOF-001"); assert.equal(plan().demanda, 20); assert.equal(plan().sugerido, 20);
  orden(t, 4); assert.equal(plan().enCamino, 4); assert.equal(plan().sugerido, 16);
});
test("reposición exige Jefatura y objetivo válido", () => { const t = entorno(), e = { almacen: "alm-centro", codigo: "SOF-001", minimo: 4, objetivo: 3, motivo: "Ajustar parámetros" }; fallaSinGuardar(t, () => t.ejecutar(jefe, d => t.L.configurarReposicion(d, e, jefe)), /objetivo/); fallaSinGuardar(t, () => t.ejecutar(compras, d => t.L.configurarReposicion(d, { ...e, objetivo: 10 }, compras)), /rol/); });
test("acciones necesitan evidencia y cierre independiente de Jefatura", () => {
  const t = entorno(), a = t.ejecutar(almacen, d => t.L.crearAccion(d, { causa: "Daño en embalaje", descripcion: "Revisar protección de patas", responsable: "Luis", plazo: "2026-11-18" }, almacen));
  t.ejecutar(almacen, d => t.L.avanzarAccion(d, a.id, "En curso", "Protector instalado", almacen)); t.ejecutar(almacen, d => t.L.avanzarAccion(d, a.id, "Por verificar", "Foto de protección", almacen));
  fallaSinGuardar(t, () => t.ejecutar({ ...almacen, rol: "Jefatura" }, d => t.L.avanzarAccion(d, a.id, "Completada", "Verificado", { ...almacen, rol: "Jefatura" })), /Otra persona/);
  t.ejecutar(jefe, d => t.L.avanzarAccion(d, a.id, "Completada", "Verificación independiente", jefe)); assert.equal(t.leer().acciones[0].historial.length, 4);
});
test("devolución comercial requiere autorización y solo publica recepción completa", () => {
  const t = entorno(); const sol = { id: "sol-1", numero: "SOL-001", tipo: "Devolución", estado: "Autorizada", sede: "centro", pedidoId: "pv-1", lineas: linea(2) }; t.comercial.solicitudes.push(sol);
  const e = { solicitudId: sol.id, almacen: "alm-centro", documento: "DC-001", fecha: hoy, ubicacion: "CUARENTENA", calidad: "Cuarentena", motivo: "Mueble recibido", lineas: linea(1) };
  t.ejecutar(almacen, (d, s) => t.D.recibirDevolucion(d, e, almacen, s.devoluciones, s.config)); assert.equal(t.w.ContratosLogisticos.consultarRecepcionDevolucion(sol.id).recepcion, null);
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.D.recibirDevolucion(d, e, almacen, s.devoluciones, s.config)), /duplicado/);
  t.ejecutar(almacen, (d, s) => t.D.recibirDevolucion(d, { ...e, documento: "DC-002" }, almacen, s.devoluciones, s.config)); assert.match(t.w.ContratosLogisticos.consultarRecepcionDevolucion(sol.id).recepcion, /DEV-/); assert.equal(saldo(t, "Cuarentena"), 2); assert.equal(saldo(t), 12);
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.D.recibirDevolucion(d, { ...e, documento: "DC-003" }, almacen, s.devoluciones, s.config)), /supera/);
});
test("recepción de devolución no autorizada se rechaza", () => { const t = entorno(); fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.D.recibirDevolucion(d, { almacen: "alm-centro", solicitudId: "no-autorizada" }, almacen, s.devoluciones, s.config)), /autorizada/); });
test("contratos devuelven copias y no cambian los documentos comerciales", () => {
  const t = entorno(), p = pedido(t), antes = JSON.stringify(t.comercial); despachar(t, p); assert.equal(JSON.stringify(t.comercial), antes);
  const s = t.w.ContratosLogisticos.consultarSeguimiento(p.id); s.salidas[0].estado = "Inventado"; assert.equal(t.leer().despachos[0].estado, "Preparado");
});

const posicionInicial = (cambios = {}) => ({ almacen: "alm-centro", codigo: "SOF-001", ubicacion: "RACK-A", calidad: "Disponible", lote: "INICIAL", cantidad: 2, fecha: hoy, motivo: "Incidencia física documentada", ...cambios });
function nuevoAlmacen(t) { return t.ejecutar(jefe, (d, s) => t.M.guardarAlmacen(d, { nombre: "Depósito auxiliar", direccion: "Calle Ejemplo 300", activo: true, motivo: "Separar exhibición y depósito" }, jefe, s.config)); }
function solicitar(t, entrada = posicionInicial({ tipo: "Deterioro" })) { return t.ejecutar(almacen, d => t.M.solicitarTratamiento(d, entrada, almacen)); }
function autorizar(t, doc) { return t.ejecutar(jefe, (d, s) => t.M.resolverTratamiento(d, doc.id, true, "Evidencia y cantidad revisadas", jefe, s.config)); }
function deteriorar(t) { const doc = solicitar(t); autorizar(t, doc); return posicionInicial({ ubicacion: "CUARENTENA", calidad: "Dañado" }); }
function reparar(t, entrada) { const doc = solicitar(t, { ...entrada, tipo: "Reparación" }); autorizar(t, doc); return doc; }

test("migrar esquema 1 conserva IDs, movimientos y facturas sin publicar al leer", () => {
  const t = entorno(), oc = orden(t), rec = recibir(t, oc); inspeccionar(t, rec); factura(t, oc);
  const viejo = t.leer(); viejo.version = 1; delete viejo.tratamientos; delete viejo.reubicaciones;
  viejo.ubicaciones = viejo.ubicaciones.filter(u => u.almacen === "alm-centro").map(({ codigo, nombre, capacidad, estados }) => ({ codigo, nombre, capacidad, estados }));
  viejo.recepciones.forEach(r => r.lineas.forEach(l => { for (const k of ["conforme", "noConforme", "devuelta", "enReparacion", "baja"]) delete l[k]; }));
  const previo = JSON.stringify(viejo); t.memoria.set(t.A.CLAVE, previo); const nuevo = t.leer();
  assert.equal(nuevo.version, 2); assert.equal(nuevo.recepciones[0].id, rec.id); assert.equal(nuevo.recepciones[0].lineas[0].conforme, 3); assert.equal(nuevo.facturas[0].estado, "Verificada"); assert.equal(t.memoria.get(t.A.CLAVE), previo);
  assert.deepEqual(nuevo.movimientos, viejo.movimientos); assert.equal(JSON.stringify(t.leer()), JSON.stringify(nuevo));
  t.ejecutar(jefe, d => t.L.configurarReposicion(d, { almacen: "alm-centro", codigo: "SOF-001", minimo: 2, objetivo: 12, motivo: "Conservar parámetros" }, jefe)); assert.equal(JSON.parse(t.memoria.get(t.A.CLAVE)).version, 2);
});
test("una inspección acepta, observa y deja pendientes dentro de la misma recepción", () => {
  const t = entorno(), oc = orden(t, 10), r = recibir(t, oc, 10);
  t.ejecutar(almacen, (d, s) => t.C.inspeccionarParcial(d, { recepcionId: r.id, fecha: hoy, ubicacion: "RACK-A", motivo: "Ocho conformes y uno observado", lineas: [{ codigo: "SOF-001", conformes: 8, observadas: 1 }] }, almacen, s.config));
  let actual = t.leer().recepciones[0]; assert.equal(actual.estado, "Parcialmente inspeccionada"); assert.equal(t.C.pendienteInspeccion(actual.lineas[0]), 1); assert.equal(saldo(t), 20); assert.equal(saldo(t, "Cuarentena"), 2);
  inspeccionar(t, r, false); actual = t.leer().recepciones[0]; assert.equal(actual.estado, "Con observaciones"); assert.equal(actual.lineas[0].noConforme, 2); assert.equal(t.C.recibido(t.leer(), oc.id, "SOF-001", true), 8);
  assert.equal(factura(t, oc, 8).estado, "Verificada"); assert.equal(factura(t, oc, 2, { documento: "F001-OBS" }).estado, "Observada");
});
test("inspección parcial excesiva, repetida, cero y error de destino no publican nada", () => {
  const t = entorno(), r = recibir(t, orden(t));
  for (const [conformes, observadas, ubicacion] of [[3, 1, "RACK-A"], [0, 0, "RACK-A"], [-1, 1, "RACK-A"], [2, 1, "CUARENTENA"]]) fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.C.inspeccionarParcial(d, { recepcionId: r.id, fecha: hoy, ubicacion, motivo: "Inspección física", lineas: [{ codigo: "SOF-001", conformes, observadas }] }, almacen, s.config)));
  inspeccionar(t, r); fallaSinGuardar(t, () => inspeccionar(t, r), /ya fue inspeccionada/);
});
test("devolver solo unidades observadas conserva conformes y libera únicamente la cantidad devuelta de la OC", () => {
  const t = entorno(), oc = orden(t, 10), r = recibir(t, oc, 10);
  t.ejecutar(almacen, (d, s) => t.C.inspeccionarParcial(d, { recepcionId: r.id, fecha: hoy, ubicacion: "RACK-A", motivo: "Tapizado de dos unidades dañado", lineas: [{ codigo: "SOF-001", conformes: 8, observadas: 2 }] }, almacen, s.config));
  t.ejecutar(almacen, (d, s) => t.C.devolverProveedor(d, r.id, "Proveedor retira dos observados", almacen, s.config));
  assert.equal(saldo(t), 20); assert.equal(saldo(t, "Cuarentena"), 0); assert.equal(t.C.recibido(t.leer(), oc.id, "SOF-001"), 8); assert.equal(t.leer().recepciones[0].lineas[0].devuelta, 2);
  recibir(t, oc, 2, "GP-REPO", "NUEVO"); fallaSinGuardar(t, () => recibir(t, oc, 1, "GP-EXCESO"), /supera/);
});
test("reubicar conserva físico y lote y no mueve unidades reservadas", () => {
  const t = entorno(); reservar(t, pedido(t, 11), 11);
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.M.reubicar(d, { ...posicionInicial(), destino: "EXHIBICION" }, almacen, s.config)), /reservadas/);
  const doc = t.ejecutar(almacen, (d, s) => t.M.reubicar(d, { ...posicionInicial({ cantidad: 1 }), destino: "EXHIBICION" }, almacen, s.config)); assert.equal(saldo(t), 12); assert.equal(t.L.saldo(t.leer(), "alm-centro", "SOF-001", "EXHIBICION", "Disponible", "INICIAL"), 1); assert.equal(doc.estado, "Registrada");
});
test("reubicación no supera capacidad ni cruza estados o sedes", () => {
  const t = entorno(); for (const cambios of [{ destino: "CUARENTENA" }, { destino: "RACK-A" }, { almacen: "alm-olivos", destino: "EXHIBICION" }]) fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.M.reubicar(d, { ...posicionInicial(), ...cambios }, almacen, s.config)));
  t.ejecutar(jefe, d => { d.ubicaciones.find(u => u.almacen === "alm-centro" && u.codigo === "EXHIBICION").capacidad = 1; });
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.M.reubicar(d, { ...posicionInicial(), destino: "EXHIBICION" }, almacen, s.config)), /capacidad/);
});
test("deterioro exige otra persona y no disminuye físico", () => {
  const t = entorno(), doc = solicitar(t), mismo = { ...almacen, rol: "Jefatura" }; assert.equal(saldo(t), 12);
  fallaSinGuardar(t, () => t.ejecutar(mismo, (d, s) => t.M.resolverTratamiento(d, doc.id, true, "Revisión propia", mismo, s.config)), /Otra persona/);
  autorizar(t, doc); assert.equal(saldo(t), 10); assert.equal(saldo(t, "Dañado"), 2); assert.equal(t.L.existencias(t.leer(), t.A.productos(), "centro")[0].fisico, 12);
});
test("tratamiento pendiente retiene sus unidades y bloquea duplicación", () => {
  const t = entorno(); solicitar(t); assert.equal(t.L.disponible(t.leer(), "alm-centro", "SOF-001"), 10); fallaSinGuardar(t, () => solicitar(t), /Ya hay/);
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.M.reubicar(d, { ...posicionInicial({ cantidad: 11 }), destino: "EXHIBICION" }, almacen, s.config)), /reservadas/);
});
test("rechazar tratamiento conserva stock y libera la posición para operar", () => {
  const t = entorno(), doc = solicitar(t); t.ejecutar(jefe, (d, s) => t.M.resolverTratamiento(d, doc.id, false, "Evidencia insuficiente", jefe, s.config)); assert.equal(saldo(t), 12);
  t.ejecutar(almacen, (d, s) => t.M.reubicar(d, { ...posicionInicial(), destino: "EXHIBICION" }, almacen, s.config)); assert.equal(saldo(t), 12);
});
test("reparación queda fuera de disponible hasta evidencia y reinspección independiente", () => {
  const t = entorno(), pos = deteriorar(t), rep = reparar(t, pos); assert.equal(saldo(t, "Dañado"), 0); assert.equal(saldo(t, "En reparación"), 2); assert.equal(saldo(t), 10);
  t.ejecutar(almacen, d => t.M.terminarReparacion(d, rep.id, "Tapizado reparado, foto EVI-001", almacen));
  const e = { id: rep.id, conforme: true, ubicacion: "RACK-A", fecha: hoy, motivo: "Revisión visual y estabilidad" }, mismo = { ...almacen, rol: "Jefatura" };
  fallaSinGuardar(t, () => t.ejecutar(mismo, (d, s) => t.M.reinspeccionar(d, e, mismo, s.config)), /Otra persona/);
  t.ejecutar(jefe, (d, s) => t.M.reinspeccionar(d, e, jefe, s.config)); assert.equal(saldo(t), 12); assert.equal(saldo(t, "En reparación"), 0); assert.equal(t.leer().tratamientos.at(-1).estado, "Recuperado");
  fallaSinGuardar(t, () => t.ejecutar(jefe, (d, s) => t.M.reinspeccionar(d, e, jefe, s.config)), /Estado/);
});
test("reinspección fallida conserva dañados y baja requiere revisión y resta físico una vez", () => {
  const t = entorno(), pos = deteriorar(t), rep = reparar(t, pos); t.ejecutar(almacen, d => t.M.terminarReparacion(d, rep.id, "Reparación sin resultado", almacen));
  t.ejecutar(jefe, (d, s) => t.M.reinspeccionar(d, { id: rep.id, conforme: false, fecha: hoy, motivo: "No supera revisión" }, jefe, s.config)); assert.equal(saldo(t, "Dañado"), 2);
  const baja = solicitar(t, { ...pos, tipo: "Baja" }); autorizar(t, baja); assert.equal(t.L.existencias(t.leer(), t.A.productos(), "centro")[0].fisico, 10); assert.equal(saldo(t, "Dañado"), 0);
  fallaSinGuardar(t, () => autorizar(t, baja), /ya fue resuelto/); assert.match(t.leer().movimientos.at(-1).tipo, /Baja autorizada/);
});
test("reparar observados de compra actualiza conformidad e invoice sin duplicar recepción", () => {
  const t = entorno(), oc = orden(t), r = recibir(t, oc); inspeccionar(t, r, false);
  const pos = posicionInicial({ ubicacion: "CUARENTENA", calidad: "Cuarentena", lote: "LOTE-001", cantidad: 3, recepcionId: r.id });
  const rep = reparar(t, pos); assert.equal(t.leer().recepciones[0].lineas[0].enReparacion, 3); assert.equal(factura(t, oc).estado, "Observada");
  t.ejecutar(almacen, d => t.M.terminarReparacion(d, rep.id, "Corrección de acabado", almacen)); t.ejecutar(jefe, (d, s) => t.M.reinspeccionar(d, { id: rep.id, conforme: true, fecha: hoy, ubicacion: "RACK-A", motivo: "Acabado conforme" }, jefe, s.config));
  assert.equal(t.leer().recepciones[0].estado, "Conforme"); assert.equal(t.C.recibido(t.leer(), oc.id, "SOF-001"), 3); assert.equal(t.C.recibido(t.leer(), oc.id, "SOF-001", true), 3); assert.equal(saldo(t), 15);
  t.ejecutar(compras, (d, s) => t.C.revalidarFactura(d, d.facturas[0].id, compras, s.config)); assert.equal(t.leer().facturas[0].estado, "Verificada");
});
test("no se reubica ni altera por conteo una cuarentena de compra pendiente de resolver", () => {
  const t = entorno(), r = recibir(t, orden(t)); const pos = posicionInicial({ ubicacion: "RECEPCION", calidad: "Cuarentena", lote: "LOTE-001" });
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.M.reubicar(d, { ...pos, destino: "CUARENTENA" }, almacen, s.config)), /documento de calidad/);
  const con = t.ejecutar(almacen, (d, s) => t.L.crearConteo(d, { almacen: "alm-centro", fecha: hoy, motivo: "Conteo de recepción", lineas: [{ ...pos, contado: 2 }] }, almacen, s.productos));
  fallaSinGuardar(t, () => t.ejecutar(jefe, (d, s) => t.L.aprobarConteo(d, con.id, true, "Ajustar diferencia", jefe, s.config)), /documento de calidad/); assert.equal(t.leer().recepciones[0].id, r.id);
});
for (const calidad of ["Cuarentena", "Dañado"]) test(`conteo permite ${calidad} sin mezclarlo con disponible`, () => {
  const t = entorno(); const pos = deteriorar(t);
  if (calidad === "Cuarentena") t.ejecutar(jefe, (d, s) => { t.L.registrarMovimiento(d, { ...pos, coste: 105000, cantidad: -2 }, jefe, s.config); t.L.registrarMovimiento(d, { ...pos, calidad, coste: 105000 }, jefe, s.config); });
  const con = t.ejecutar(almacen, (d, s) => t.L.crearConteo(d, { almacen: "alm-centro", fecha: hoy, motivo: "Conteo de calidad", lineas: [{ ...pos, calidad, contado: 1 }] }, almacen, s.productos));
  t.ejecutar(jefe, (d, s) => t.L.aprobarConteo(d, con.id, true, "Diferencia revisada", jefe, s.config)); assert.equal(saldo(t, calidad), 1); assert.equal(saldo(t), 10);
});
test("un conteo se invalida aunque dos movimientos posteriores dejen el mismo saldo", () => {
  const t = entorno(), con = conteo(t);
  t.ejecutar(almacen, (d, s) => t.M.reubicar(d, { ...posicionInicial(), destino: "EXHIBICION" }, almacen, s.config));
  t.ejecutar(almacen, (d, s) => t.M.reubicar(d, { ...posicionInicial({ ubicacion: "EXHIBICION" }), destino: "RACK-A" }, almacen, s.config));
  assert.equal(saldo(t), 12); fallaSinGuardar(t, () => t.ejecutar(jefe, (d, s) => t.L.aprobarConteo(d, con.id, true, "Revisado", jefe, s.config)), /Repite el conteo/);
});
test("Jefatura crea almacén/ubicaciones y otro rol no cambia maestros", () => {
  const t = entorno(), a = nuevoAlmacen(t); assert.equal(t.leer().ubicaciones.filter(u => u.almacen === a.id).length, 5);
  const e = { almacen: a.id, codigo: "RACK-B", nombre: "Muebles auxiliares", capacidad: 10, estados: ["Disponible"], motivo: "Nueva posición" };
  fallaSinGuardar(t, () => t.ejecutar(almacen, d => t.M.guardarUbicacion(d, e, almacen)), /rol/);
  const u = t.ejecutar(jefe, d => t.M.guardarUbicacion(d, e, jefe)); assert.equal(u.sede, "centro");
  fallaSinGuardar(t, () => t.ejecutar(jefe, d => t.M.guardarUbicacion(d, e, jefe)), /ya existe/);
  fallaSinGuardar(t, () => t.ejecutar({ ...jefe, sede: "olivos" }, d => t.M.guardarUbicacion(d, { ...e, id: u.id }, { ...jefe, sede: "olivos" })), /sede/);
});
test("no se reduce capacidad ni se retira calidad o desactiva una ubicación ocupada", () => {
  const t = entorno(), u = t.leer().ubicaciones.find(u => u.almacen === "alm-centro" && u.codigo === "RACK-A");
  for (const cambios of [{ capacidad: 1 }, { estados: ["Cuarentena"] }, { activo: false }, { codigo: "OTRO" }]) fallaSinGuardar(t, () => t.ejecutar(jefe, d => t.M.guardarUbicacion(d, { ...u, motivo: "Editar posición", ...cambios }, jefe)));
});
test("almacén vacío se desactiva sin borrar historial y vuelve a activarse", () => {
  const t = entorno(), a = nuevoAlmacen(t);
  t.ejecutar(jefe, (d, s) => t.M.guardarAlmacen(d, { ...a, activo: false, motivo: "Cierre temporal" }, jefe, s.config));
  fallaSinGuardar(t, () => t.ejecutar(almacen, (d, s) => t.C.crearRequisicion(d, { almacen: a.id, requerida: hoy, motivo: "Reposición", lineas: linea() }, almacen, s.productos)), /inactivo/);
  t.ejecutar(jefe, (d, s) => t.M.guardarAlmacen(d, { ...a, activo: true, motivo: "Reapertura" }, jefe, s.config)); assert.equal(t.leer().almacenes.at(-1).historial.length, 3);
});
test("dos almacenes de una sede no duplican demanda ni previsión", () => {
  const t = entorno(); nuevoAlmacen(t); pedido(t, 20);
  const plan = t.L.planificar(t.leer(), t.A.productos(), t.A.pedidos(), t.A.config, "centro", "2026-11").filter(p => p.codigo === "SOF-001");
  assert.equal(plan.length, 2); assert.equal(plan.reduce((n, p) => n + p.demanda, 0), 20); assert.equal(plan.reduce((n, p) => n + p.proyectado, 0), -8);
});
test("incidencia pendiente excluye unidades de la venta y convive con reservas de las unidades sanas", () => {
  const t = entorno(), doc = solicitar(t);
  assert.equal(t.w.ContratosLogisticos.consultarDisponibilidad({ sede: "centro", id: "nuevo", lineas: linea() }).lineas[0].disponible, 10);
  fallaSinGuardar(t, () => reservar(t, pedido(t, 11), 11), /Stock disponible insuficiente/);
  const p = pedido(t, 10, "pv-sano"); reservar(t, p, 10); autorizar(t, doc);
  assert.equal(saldo(t), 10); assert.equal(saldo(t, "Dañado"), 2); assert.equal(t.L.disponible(t.leer(), "alm-centro", "SOF-001"), 0);
});
test("no se desactiva un almacén vacío que tiene una necesidad pendiente", () => {
  const t = entorno(), a = nuevoAlmacen(t);
  t.ejecutar(almacen, (d, s) => t.C.crearRequisicion(d, { almacen: a.id, requerida: hoy, motivo: "Abastecimiento del nuevo almacén", lineas: linea() }, almacen, s.productos));
  fallaSinGuardar(t, () => t.ejecutar(jefe, (d, s) => t.M.guardarAlmacen(d, { ...a, activo: false, motivo: "Cerrar almacén" }, jefe, s.config)), /operaciones pendientes/);
});
test("reparación sin capacidad conserva documento, cuarentena y cantidades de origen intactos", () => {
  const t = entorno(), r = recibir(t, orden(t)); inspeccionar(t, r, false);
  const rep = solicitar(t, posicionInicial({ tipo: "Reparación", ubicacion: "CUARENTENA", calidad: "Cuarentena", lote: r.lote, cantidad: 3, recepcionId: r.id }));
  t.ejecutar(jefe, d => { d.ubicaciones.find(u => u.almacen === "alm-centro" && u.codigo === "TALLER").capacidad = 1; });
  fallaSinGuardar(t, () => autorizar(t, rep), /capacidad/); assert.equal(t.leer().recepciones[0].lineas[0].noConforme, 3); assert.equal(saldo(t, "Cuarentena"), 3);
});
