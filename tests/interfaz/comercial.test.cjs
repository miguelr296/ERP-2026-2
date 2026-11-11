const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const asesor = { nombre: "Luis", rol: "Asesor", sede: "centro" };
const jefatura = { nombre: "Miguel", rol: "Jefatura", sede: "centro" };
const fecha = "2026-11-10";
const raiz = path.resolve(__dirname, "../../src/Erp.Api/wwwroot");

function entorno() {
  const contexto = vm.createContext({ window: {}, structuredClone, crypto: webcrypto, Date });
  for (const archivo of ["datos-comercial.js", "integraciones-locales.js", "reglas-comerciales.js"]) {
    vm.runInContext(fs.readFileSync(path.join(raiz, archivo), "utf8"), contexto, { filename: archivo });
  }
  const config = contexto.window.FAMIHOGAR;
  const r = contexto.window.ReglasComerciales;
  const datos = r.prepararDatos(config, null);
  datos.oportunidades[0].lineas[0].cantidad = 2;
  return { r, datos, config, puertos: contexto.window.IntegracionesComerciales, respuestas: contexto.window.FAMIHOGAR_RESPUESTAS };
}

function entrada(cambios = {}) {
  return { oportunidadId: "opo-001", fecha, vigenteHasta: "2026-11-17", entrega: "2026-11-17", condicion: "Contado", descuentoBps: 0, motivo: "Acuerdo comercial", ...cambios };
}
function cotizacion(t, cambios = {}, usuario = asesor) {
  return t.r.crearCotizacion(t.datos, entrada(cambios), usuario, t.config.parametros);
}
function pedido(t, cambios = {}) {
  const c = cotizacion(t, cambios);
  t.r.cambiarCotizacion(t.datos, c.id, "Enviada", "", asesor, fecha);
  t.r.cambiarCotizacion(t.datos, c.id, "Aceptada", "", asesor, fecha);
  return t.r.crearPedido(t.datos, c.id, asesor, fecha);
}
function aprobar(t, p) { t.r.validarPedido(t.datos, p.id, asesor, t.puertos); t.r.aprobarPedido(t.datos, p.id, jefatura, t.puertos); }
function entregar(t, p, cantidadSofa = 2) {
  t.respuestas.entregas[p.id] = [{ id: "entrega-1", numero: "GRE-0001", lineas: [{ codigo: "SOF-001", cantidad: cantidadSofa }, ...(cantidadSofa === 2 ? [{ codigo: "MES-001", cantidad: 1 }] : [])] }];
  t.r.sincronizarPedido(t.datos, p.id, asesor, t.puertos);
}

test("migrar versión 1 conserva clientes, IDs e importes sin borrar documentos", () => {
  const t = entorno();
  const legado = { version: 1, clientes: [{ id: "anterior", documento: "70000003" }], oportunidades: [], pedidos: [], cotizaciones: [{ id: "cot-anterior", subtotal: 100, total: 118 }] };
  const actual = t.r.prepararDatos(t.config, legado);
  assert.equal(actual.version, 2); assert.equal(actual.clientes[0].id, "anterior"); assert.equal(actual.cotizaciones[0].total, 118);
  assert.equal(legado.version, 1);
});
test("versión desconocida se rechaza sin reemplazar los datos", () => {
  const t = entorno(); assert.throws(() => t.r.prepararDatos(t.config, { version: 90 }), /no compatible/);
});
test("cotización obtiene precios y calcula céntimos e impuesto", () => {
  const t = entorno(), c = cotizacion(t);
  assert.equal(c.bruto, 354700); assert.equal(c.igv, 63846); assert.equal(c.total, 418546);
  assert.equal(c.listaNombre, "Retail Tienda"); assert.equal(c.estado, "Borrador");
});
test("el canal Web determina otra lista", () => {
  const t = entorno(); t.datos.oportunidades[0].canal = "Web";
  assert.equal(cotizacion(t).lineas[0].precio, 155103);
});
test("el segmento Empresa determina otra lista", () => {
  const t = entorno(); t.datos.clientes[0].segmento = "Empresa";
  assert.equal(cotizacion(t).lineas[0].precio, 151905);
});
for (const caso of ["vencida", "futura", "inactiva", "ambigua"]) {
  test(`lista ${caso} impide cotizar`, () => {
    const t = entorno(), lista = t.datos.listasPrecio[0];
    if (caso === "vencida") lista.hasta = "2026-11-09";
    if (caso === "futura") lista.desde = "2026-11-11";
    if (caso === "inactiva") lista.activa = false;
    if (caso === "ambigua") t.datos.listasPrecio.push(structuredClone(lista));
    assert.throws(() => cotizacion(t), /lista vigente/);
  });
}
test("la vigencia de cotización no supera la lista", () => {
  const t = entorno(); t.datos.listasPrecio[0].hasta = "2026-11-12";
  assert.throws(() => cotizacion(t), /vigencia/);
});
test("un precio ausente y cantidades inválidas impiden cotizar", () => {
  const t = entorno(); delete t.datos.listasPrecio[0].precios["SOF-001"];
  assert.throws(() => cotizacion(t), /precio aprobado/);
  t.datos.listasPrecio[0].precios["SOF-001"] = 100; t.datos.oportunidades[0].lineas[0].cantidad = 0;
  assert.throws(() => cotizacion(t), /Cantidad/);
});
test("descuento de 5 % exige motivo y no necesita excepción", () => {
  const t = entorno(); assert.throws(() => cotizacion(t, { descuentoBps: 500, motivo: "" }), /motivo/);
  const c = cotizacion(t, { descuentoBps: 500 });
  assert.equal(c.descuento, 17735); assert.equal(c.total, 397619); assert.equal(c.autorizacion, "No requiere");
  assert.equal(c.lineas.reduce((s, l) => s + l.importe, 0), c.subtotal);
});
test("descuento de 10 % espera autorización y no puede enviarse", () => {
  const t = entorno(), c = cotizacion(t, { descuentoBps: 1000 });
  assert.equal(c.estado, "Pendiente de aprobación");
  assert.throws(() => t.r.cambiarCotizacion(t.datos, c.id, "Enviada", "", asesor, fecha), /transición/);
});
test("más de 20 % se rechaza incluso para Jefatura", () => {
  const t = entorno(); assert.throws(() => cotizacion(t, { descuentoBps: 2001 }, jefatura), /máximo/);
});
test("ni el Asesor ni el autor con rol Jefatura resuelven su descuento", () => {
  const t = entorno(), c = cotizacion(t, { descuentoBps: 1000 });
  assert.throws(() => t.r.resolverDescuento(t.datos, c.id, true, "Procede", asesor, fecha), /Jefatura/);
  assert.throws(() => t.r.resolverDescuento(t.datos, c.id, true, "Procede", { ...jefatura, nombre: " LUIS " }, fecha), /Otra persona/);
});
test("otra Jefatura autoriza descuento con motivo y trazabilidad", () => {
  const t = entorno(), c = cotizacion(t, { descuentoBps: 1000 });
  t.r.resolverDescuento(t.datos, c.id, true, "Margen revisado", jefatura, fecha);
  assert.equal(c.estado, "Borrador"); assert.equal(c.aprobador, "Miguel");
  assert.match(c.historial.at(-1).accion, /Margen revisado/);
});
test("rechazo de descuento impide continuar", () => {
  const t = entorno(), c = cotizacion(t, { descuentoBps: 1000 });
  t.r.resolverDescuento(t.datos, c.id, false, "Margen insuficiente", jefatura, fecha);
  assert.equal(c.estado, "Rechazada"); assert.throws(() => t.r.crearPedido(t.datos, c.id, asesor, fecha), /aceptada/);
});
test("promoción vigente aplica sin acumular un descuento manual", () => {
  const t = entorno();
  assert.equal(cotizacion(t, { promocionId: "hogar5", motivo: "" }).total, 397619);
  assert.throws(() => cotizacion(t, { promocionId: "hogar5", descuentoBps: 1 }), /acumula/);
  t.datos.promociones[0].hasta = "2026-11-09";
  assert.throws(() => cotizacion(t, { promocionId: "hogar5" }), /vencida/);
});
test("pedido conserva copia aunque después cambie el catálogo", () => {
  const t = entorno(), c = cotizacion(t);
  t.datos.listasPrecio[0].precios["SOF-001"] = 100;
  t.r.cambiarCotizacion(t.datos, c.id, "Enviada", "", asesor, fecha); t.r.cambiarCotizacion(t.datos, c.id, "Aceptada", "", asesor, fecha);
  const p = t.r.crearPedido(t.datos, c.id, asesor, fecha);
  assert.equal(p.total, 418546); assert.equal(p.lineas[0].precio, 159900);
});
test("repetir creación de pedido devuelve el mismo sin duplicar eventos", () => {
  const t = entorno(), p = pedido(t), eventos = t.datos.cotizaciones[0].historial.length;
  assert.equal(t.r.crearPedido(t.datos, p.cotizacionId, asesor, fecha).id, p.id);
  assert.equal(t.datos.pedidos.length, 1); assert.equal(t.datos.cotizaciones[0].historial.length, eventos);
});
test("propuestas vencidas no se envían ni se convierten en otro pedido", () => {
  const t = entorno(), c = cotizacion(t);
  assert.throws(() => t.r.cambiarCotizacion(t.datos, c.id, "Enviada", "", asesor, "2026-11-18"), /venció/);
  c.estado = "Aceptada"; assert.throws(() => t.r.crearPedido(t.datos, c.id, asesor, "2026-11-18"), /venció/);
});
test("validación favorable espera aprobación de otra persona", () => {
  const t = entorno(), p = pedido(t);
  t.r.validarPedido(t.datos, p.id, asesor, t.puertos); assert.equal(p.estado, "Pendiente de aprobación");
  assert.throws(() => t.r.aprobarPedido(t.datos, p.id, { ...jefatura, nombre: "Luis" }, t.puertos), /Otra persona/);
  t.r.aprobarPedido(t.datos, p.id, jefatura, t.puertos); assert.equal(p.estado, "Aprobado");
});
test("stock insuficiente o ausente bloquea y no se puede omitir", () => {
  const t = entorno(), p = pedido(t);
  t.respuestas.inventarios.centro["SOF-001"] = 1;
  t.r.aprobarPedido(t.datos, p.id, jefatura, t.puertos); assert.equal(p.estado, "Bloqueado");
  delete t.respuestas.inventarios.centro["SOF-001"];
  t.r.validarPedido(t.datos, p.id, asesor, t.puertos); assert.match(p.controles.motivos.join(" "), /Sin respuesta/);
});
test("la aprobación consulta nuevamente los controles", () => {
  const t = entorno(), p = pedido(t); t.r.validarPedido(t.datos, p.id, asesor, t.puertos);
  t.respuestas.inventarios.centro["SOF-001"] = 0;
  t.r.aprobarPedido(t.datos, p.id, jefatura, t.puertos); assert.equal(p.estado, "Bloqueado");
});
for (const caso of ["insuficiente", "vencido", "ausente"]) {
  test(`crédito ${caso} bloquea un pedido a crédito`, () => {
    const t = entorno(), p = pedido(t, { condicion: "Crédito 30 días" });
    if (caso === "insuficiente") t.respuestas.credito["cli-001"].limite = 100;
    if (caso === "vencido") t.respuestas.credito["cli-001"].vencido = 1;
    if (caso === "ausente") delete t.respuestas.credito["cli-001"];
    t.r.validarPedido(t.datos, p.id, asesor, t.puertos); assert.equal(p.estado, "Bloqueado");
  });
}
test("crédito favorable permite aprobación sin registrar un pago", () => {
  const t = entorno(), p = pedido(t, { condicion: "Crédito 30 días" }); aprobar(t, p);
  assert.equal(p.estado, "Aprobado"); assert.equal(t.datos.pagos, undefined);
});
test("bloqueo manual deja motivo y exige volver a validar", () => {
  const t = entorno(), p = pedido(t); aprobar(t, p);
  assert.throws(() => t.r.bloquearPedido(t.datos, p.id, "", jefatura), /motivo/);
  t.r.bloquearPedido(t.datos, p.id, "Revisión requerida", jefatura); assert.equal(p.estado, "Bloqueado");
  aprobar(t, p); assert.equal(p.estado, "Aprobado"); assert.match(p.historial.map(e => e.accion).join(" "), /Revisión requerida/);
});
test("seguimiento distingue atención parcial, completa y facturación externa", () => {
  const t = entorno(), p = pedido(t); aprobar(t, p); entregar(t, p, 1);
  assert.equal(p.estado, "Parcialmente atendido"); assert.equal(t.r.cantidadesAtendidas(p)["SOF-001"], 1);
  t.respuestas.entregas[p.id].push({ id: "entrega-2", numero: "GRE-0002", lineas: [{ codigo: "SOF-001", cantidad: 1 }, { codigo: "MES-001", cantidad: 1 }] });
  t.r.sincronizarPedido(t.datos, p.id, asesor, t.puertos); assert.equal(p.estado, "Atendido");
  t.respuestas.facturas[p.id] = [{ id: "factura-1", numero: "F001-00001", total: p.total }];
  t.r.sincronizarPedido(t.datos, p.id, asesor, t.puertos); assert.equal(p.estado, "Facturado");
  const cantidadEventos = p.historial.length; t.r.sincronizarPedido(t.datos, p.id, asesor, t.puertos);
  assert.equal(p.historial.length, cantidadEventos); assert.equal(p.entregas.length, 2);
});
test("respuesta de entrega no puede exceder el pedido", () => {
  const t = entorno(), p = pedido(t); aprobar(t, p);
  assert.throws(() => entregar(t, p, 3), /supera/); assert.equal(p.entregas.length, 0);
});
test("no se consulta ni se modifica atención de pedido sin aprobar", () => {
  const t = entorno(), p = pedido(t); assert.throws(() => t.r.sincronizarPedido(t.datos, p.id, asesor, t.puertos), /aprobados/);
});
test("anulación conserva documento y requiere otra Jefatura y motivo", () => {
  const t = entorno(), p = pedido(t);
  const s = t.r.crearSolicitud(t.datos, { pedidoId: p.id, tipo: "Anulación", motivo: "Cliente desiste" }, asesor);
  assert.throws(() => t.r.resolverSolicitud(t.datos, s.id, true, "Revisado", { ...jefatura, nombre: "Luis" }, t.puertos), /Otra persona/);
  t.r.resolverSolicitud(t.datos, s.id, true, "Cliente confirmó", jefatura, t.puertos);
  assert.equal(p.estado, "Anulado"); assert.equal(t.datos.pedidos.length, 1); assert.equal(s.estado, "Autorizada");
});
test("no se autoriza anulación si llegó una entrega desde otro módulo", () => {
  const t = entorno(), p = pedido(t);
  const s = t.r.crearSolicitud(t.datos, { pedidoId: p.id, tipo: "Anulación", motivo: "Cliente desiste" }, asesor);
  t.respuestas.entregas[p.id] = [{ id: "externa", numero: "GRE-9", lineas: [] }];
  assert.throws(() => t.r.resolverSolicitud(t.datos, s.id, true, "Revisado", jefatura, t.puertos), /entregas.*facturas/);
  assert.equal(p.estado, "Borrador");
});
test("devolución no excede entregas ni cantidades ya solicitadas", () => {
  const t = entorno(), p = pedido(t); aprobar(t, p); entregar(t, p);
  const entrada = { pedidoId: p.id, tipo: "Devolución", motivo: "Producto no requerido", lineas: [{ codigo: "SOF-001", cantidad: 3 }] };
  assert.throws(() => t.r.crearSolicitud(t.datos, entrada, asesor), /supera/);
  entrada.lineas[0].cantidad = 2; const s = t.r.crearSolicitud(t.datos, entrada, asesor);
  t.r.resolverSolicitud(t.datos, s.id, true, "Procede retorno", jefatura, t.puertos);
  assert.throws(() => t.r.crearSolicitud(t.datos, entrada, asesor), /supera/);
});
test("devolución autorizada espera recepción, nota y ajuste de sus áreas", () => {
  const t = entorno(), p = pedido(t); aprobar(t, p); entregar(t, p);
  const s = t.r.crearSolicitud(t.datos, { pedidoId: p.id, tipo: "Devolución", motivo: "Cambio solicitado", lineas: [{ codigo: "SOF-001", cantidad: 1 }] }, asesor);
  t.r.resolverSolicitud(t.datos, s.id, true, "Procede retorno", jefatura, t.puertos);
  t.r.seguirDevolucion(t.datos, s.id, asesor, t.puertos); assert.equal(s.estado, "Autorizada");
  t.respuestas.devoluciones[s.id] = { recepcion: "REC-1", notaCredito: "NC-1", ajusteFinanciero: "AJ-1" };
  t.r.seguirDevolucion(t.datos, s.id, asesor, t.puertos); assert.equal(s.estado, "Completada");
  assert.equal(t.datos.pagos, undefined);
});
test("cliente nuevo requiere aprobación antes de cotizar", () => {
  const t = entorno();
  const s = t.r.solicitarMaestro(t.datos, "cliente", { nombre: "Cliente nuevo", tipoDocumento: "DNI", documento: "70000003", direccion: "Dirección", segmento: "Retail" }, "", asesor);
  t.datos.oportunidades[0].clienteId = s.objetivoId;
  assert.throws(() => cotizacion(t), /cliente debe estar aprobado/);
  assert.throws(() => t.r.resolverMaestro(t.datos, s.id, true, "Revisado", { ...jefatura, nombre: "Luis" }), /Otra persona/);
  t.r.resolverMaestro(t.datos, s.id, true, "Identificación revisada", jefatura);
  assert.equal(cotizacion(t).cliente.id, s.objetivoId);
});
test("documentos de clientes repetidos se rechazan", () => {
  const t = entorno();
  assert.throws(() => t.r.solicitarMaestro(t.datos, "cliente", structuredClone(t.datos.clientes[0]), "", asesor), /Ya existe/);
});
test("cambio de lista conserva versión anterior hasta otra aprobación", () => {
  const t = entorno(), original = t.datos.listasPrecio[0], propuesta = structuredClone(original);
  propuesta.precios["SOF-001"] = 100000;
  const s = t.r.solicitarMaestro(t.datos, "lista", propuesta, original.id, jefatura);
  assert.equal(cotizacion(t).lineas[0].precio, 159900);
  t.r.resolverMaestro(t.datos, s.id, true, "Precios revisados", { ...jefatura, nombre: "Pablo" });
  assert.equal(cotizacion(t).lineas[0].precio, 100000);
});
test("lista solapada no se publica y Asesor no administra precios", () => {
  const t = entorno(), propuesta = structuredClone(t.datos.listasPrecio[0]);
  assert.throws(() => t.r.solicitarMaestro(t.datos, "lista", propuesta, "", jefatura), /solapa/);
  assert.throws(() => t.r.solicitarMaestro(t.datos, "lista", propuesta, propuesta.id, asesor), /Jefatura/);
});
test("alta de producto exige otra aprobación y código único", () => {
  const t = entorno();
  const s = t.r.solicitarMaestro(t.datos, "producto", { codigo: "NUE-001", nombre: "Mueble", familia: "Sala", unidad: "Unidad", coste: 100 }, "", jefatura);
  assert.equal(t.datos.productos.some(p => p.codigo === "NUE-001"), false);
  t.r.resolverMaestro(t.datos, s.id, true, "Producto revisado", { ...jefatura, nombre: "Pablo" });
  assert.equal(t.datos.productos.some(p => p.codigo === "NUE-001"), true);
  assert.throws(() => t.r.solicitarMaestro(t.datos, "producto", s.datos, "", jefatura), /ya existe/);
});
test("roles ajenos a Comercial no crean ni resuelven ventas", () => {
  const t = entorno();
  for (const rol of ["Tesorería", "Almacén", "Contabilidad", "Facturación", "Compras"]) {
    assert.throws(() => cotizacion(t, {}, { ...asesor, rol }), /Comercial/);
  }
});
test("otra sede no puede operar el documento", () => {
  const t = entorno(), p = pedido(t);
  assert.throws(() => t.r.validarPedido(t.datos, p.id, { ...asesor, sede: "surco" }, t.puertos), /esta sede/);
});

test("vencimiento explícito conserva estado e historial sin permitir anticiparlo", () => {
  const t = entorno(), c = cotizacion(t);
  assert.throws(() => t.r.cambiarCotizacion(t.datos, c.id, "Vencida", "", asesor, fecha), /todavía está vigente/);
  assert.equal(c.estado, "Borrador");
  t.r.cambiarCotizacion(t.datos, c.id, "Vencida", "", asesor, "2026-11-18");
  assert.equal(c.estado, "Vencida"); assert.match(c.historial.at(-1).accion, /Vencida/);
});
test("una entrega registrada no se sobrescribe con otra cantidad bajo el mismo ID", () => {
  const t = entorno(), p = pedido(t); aprobar(t, p); entregar(t, p, 1);
  t.respuestas.entregas[p.id][0].lineas[0].cantidad = 2;
  assert.throws(() => t.r.sincronizarPedido(t.datos, p.id, asesor, t.puertos), /ya registrada cambió/);
  assert.equal(p.entregas[0].lineas[0].cantidad, 1);
});
test("indicadores booleanos sin documentos no completan una devolución", () => {
  const t = entorno(), p = pedido(t); aprobar(t, p); entregar(t, p);
  const s = t.r.crearSolicitud(t.datos, { pedidoId: p.id, tipo: "Devolución", motivo: "Cambio solicitado", lineas: [{ codigo: "SOF-001", cantidad: 1 }] }, asesor);
  t.r.resolverSolicitud(t.datos, s.id, true, "Procede retorno", jefatura, t.puertos);
  t.respuestas.devoluciones[s.id] = { recepcion: true, notaCredito: true, ajusteFinanciero: true };
  t.r.seguirDevolucion(t.datos, s.id, asesor, t.puertos); assert.equal(s.estado, "Autorizada");
});
