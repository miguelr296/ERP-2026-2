// Usa un contexto desechable de Chrome headless; nunca abre el perfil personal.
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");
const puerto = Number(process.argv[2] || 9246);
const carpeta = path.join(os.tmpdir(), "famihogar-logistica-validacion");
fs.mkdirSync(carpeta, { recursive: true });
async function conectar(url) {
  const ws = new WebSocket(url); await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
  let secuencia = 0; const pendientes = new Map(), errores = [];
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.method === "Runtime.exceptionThrown") errores.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.id) { const p = pendientes.get(m.id); pendientes.delete(m.id); m.error ? p.no(Error(m.error.message)) : p.ok(m.result); }
  };
  return { errores, cerrar: () => ws.close(), enviar: (method, params = {}) => new Promise((ok, no) => { const id = ++secuencia; pendientes.set(id, { ok, no }); ws.send(JSON.stringify({ id, method, params })); }) };
}
async function ejecutar() {
  const version = await (await fetch(`http://127.0.0.1:${puerto}/json/version`)).json();
  if (!version["User-Agent"].includes("HeadlessChrome")) throw Error("Se exige Chrome headless de prueba.");
  const browser = await conectar(version.webSocketDebuggerUrl), { browserContextId } = await browser.enviar("Target.createBrowserContext");
  let pagina; const comprobaciones = [];
  try {
    const { targetId } = await browser.enviar("Target.createTarget", { url: "about:blank", browserContextId });
    const lista = await (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json(); pagina = await conectar(lista.find(t => t.id === targetId).webSocketDebuggerUrl);
    const enviar = pagina.enviar;
    const evaluar = async expression => { const r = await enviar("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
    const esperar = async expr => { for (let i = 0; i < 100; i++) { if (await evaluar(expr)) return; await new Promise(r => setTimeout(r, 100)); } throw Error("Espera agotada: " + expr + "\n" + await evaluar("document.body.innerText")); };
    const comprobar = async (expr, nombre) => { if (!await evaluar(expr)) throw Error(nombre); comprobaciones.push(nombre); };
    const clic = sel => evaluar(`document.querySelector(${JSON.stringify(sel)}).click()`);
    const rellenar = async valores => { for (const [sel, valor] of Object.entries(valores)) await evaluar(`document.querySelector(${JSON.stringify(sel)}).value=${JSON.stringify(valor)}`); };
    const cambiar = sel => evaluar(`document.querySelector(${JSON.stringify(sel)}).dispatchEvent(new Event('change',{bubbles:true}))`);
    const guardar = async () => { await evaluar("document.querySelector('#formulario-registro').requestSubmit()"); await esperar("!document.querySelector('#modal').open"); await evaluar("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))"); };
    const leer = (exp, comercial = false) => evaluar(`(()=>{const d=JSON.parse(localStorage.getItem('famihogar.${comercial ? "comercial" : "logistica"}.v1'));return ${exp}})()`);
    const ir = async ruta => { await evaluar(`location.hash=${JSON.stringify(ruta)}`); await esperar(`location.hash===${JSON.stringify("#" + ruta)}`); await evaluar("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))"); };
    const login = async (nombre, rol, sede = "centro") => {
      if (await evaluar("!document.querySelector('#sistema').hidden")) await clic("#salir");
      await rellenar({ "#nombre": nombre, "#rol": rol, "#sede-acceso": sede }); await evaluar("document.querySelector('#formulario-acceso').requestSubmit()"); await esperar("!document.querySelector('#sistema').hidden");
    };
    const accion = a => clic(`[data-log-accion='${a}']`);
    const decidir = async (a, motivo = "Revisión independiente conforme") => { await accion(a); await rellenar({ "#log-motivo": motivo }); await guardar(); };
    const foto = async nombre => { const r = await enviar("Page.captureScreenshot", { format: "png", captureBeyondViewport: true }); fs.writeFileSync(path.join(carpeta, nombre + ".png"), Buffer.from(r.data, "base64")); };
    await enviar("Runtime.enable"); await enviar("Page.enable"); await enviar("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await enviar("Page.navigate", { url: "http://localhost:5300/" }); await esperar("!!window.PantallasLogistica && document.querySelector('#rol').options.length===9");
    await login("Pablo", "Compras"); await clic("[data-modulo=logistica]"); await esperar("document.querySelector('#contenido h1')?.textContent==='Panel logístico'");
    await comprobar("document.querySelectorAll('[data-log-vista]').length>10", "Navegación logística agrupada por procesos"); await foto("01-panel-logistico");
    await ir("logistica/control"); await comprobar("document.querySelector('#contenido').textContent.includes('Sin entregas') && document.querySelector('#contenido').textContent.includes('Sin inspecciones')", "Indicadores sin porcentajes inventados cuando no hay operaciones");
    await ir("compras/proveedores"); await accion("proveedor");
    await rellenar({ "#log-ruc": "20000000103", "#log-nombre": "Proveedor de pantallas SAC", "#log-correo": "ventas@prueba.example.com", "#log-telefono": "900000103", "#log-direccion": "Av. Ejemplo 20" }); await guardar();
    const proveedor = await leer("d.proveedores.at(-1).id");
    await comprobar("document.querySelector('.ficha').textContent.includes('Pendiente')", "Alta de proveedor pendiente");
    await login("Pablo", "Jefatura"); await ir(`logistica/proveedores/${proveedor}`); await accion("aprobar-proveedor"); await rellenar({ "#log-motivo": "Revisión propia" }); await evaluar("document.querySelector('#formulario-registro').requestSubmit()");
    await comprobar("document.querySelector('#error-formulario').textContent.includes('Otra persona')", "Proveedor no se autoaprueba"); await clic("#cerrar-modal");
    await login("Miguel", "Jefatura"); await ir(`logistica/proveedores/${proveedor}`); await decidir("aprobar-proveedor"); await comprobar("document.querySelector('.ficha').textContent.includes('Aprobado')", "Otra Jefatura aprueba proveedor");
    await login("Luis", "Asesor"); await ir("logistica/requisiciones"); await accion("requisicion"); await rellenar({ "#log-motivo": "Reposición para venta", "select[name=codigo]": "SOF-001", "input[name=cantidad]": "3" }); await guardar();
    const req = await leer("d.requisiciones.at(-1).id");
    await comprobar("!document.querySelector('[data-log-accion=aprobar-requisicion]')", "Asesor solicita sin aprobar necesidades");
    await ir("logistica/inventario"); await comprobar("document.querySelector('#contenido').textContent.includes('No tienes acceso')", "Asesor no registra inventario");
    await login("Miguel", "Jefatura"); await ir(`logistica/requisiciones/${req}`); await decidir("aprobar-requisicion");
    await login("Pablo", "Compras"); await ir("compras/peticionesOferta"); await accion("peticion"); await rellenar({ "#log-requisicionId": req }); await clic("input[name=proveedor][value=prov-madera]"); await clic("input[name=proveedor][value=prov-hogar]"); await guardar();
    const rfq = await leer("d.peticionesOferta.at(-1).id");
    await ir("compras/ofertas"); await accion("oferta"); await rellenar({ "#log-peticionId": rfq }); await cambiar("#log-peticionId"); await rellenar({ "#log-proveedorId": "prov-madera", "input[name=precio]": "1000" }); await guardar();
    const of1 = await leer("d.ofertas.at(-1).id");
    await ir("compras/ofertas"); await accion("oferta"); await rellenar({ "#log-peticionId": rfq }); await cambiar("#log-peticionId"); await rellenar({ "#log-proveedorId": "prov-hogar", "#log-plazoDias": "10", "input[name=precio]": "1100" }); await guardar();
    await ir("compras/ofertas"); await comprobar("document.querySelectorAll('#contenido tbody tr').length===2 && document.querySelector('#contenido').textContent.includes('3,000.00')", "Comparación de dos ofertas con plazo, calidad y precio"); await foto("02-comparacion-ofertas");
    await login("Miguel", "Jefatura"); await ir(`logistica/ofertas/${of1}`); await decidir("adjudicar", "Mejor precio y plazo para sala");
    await login("Pablo", "Compras"); await ir("compras/ordenes"); await accion("orden"); await rellenar({ "#log-fuente": "oferta|" + of1 }); await cambiar("#log-fuente"); await guardar();
    const oc = await leer("d.ordenes.at(-1).id"); await comprobar("!document.querySelector('[data-log-accion=emitir-orden]')", "OC pendiente no se emite antes de aprobación");
    await login("Miguel", "Jefatura"); await ir(`logistica/ordenes/${oc}`); await decidir("aprobar-orden");
    await login("Pablo", "Compras"); await ir(`compras/ordenes/${oc}`); await accion("emitir-orden"); await decidir("confirmar-orden", "Proveedor confirmó referencia CP-001");
    await comprobar("document.querySelector('.ficha').textContent.includes('Confirmada')", "Emisión y confirmación de proveedor registradas");
    // Factura antes de recibir: se conserva observada, después se revalida.
    await ir("compras/facturas"); await accion("factura"); await rellenar({ "#log-ordenId": oc }); await cambiar("#log-ordenId"); await rellenar({ "#log-documento": "F001-001", "#log-baseInformada": "3000", "input[name=cantidad]": "3" }); await guardar();
    const vf = await leer("d.facturas.at(-1).id"); await comprobar("document.querySelector('.ficha').textContent.includes('Observada')", "Factura sin recepción conforme queda observada");
    await login("Luis", "Almacén"); await ir("logistica/recepciones"); await accion("recepcion"); await rellenar({ "#log-ordenId": oc }); await cambiar("#log-ordenId"); await rellenar({ "#log-documento": "GP-001", "#log-lote": "SALA-001", "input[name=cantidad]": "2" }); await guardar();
    const rec1 = await leer("d.recepciones.at(-1).id");
    await comprobar("LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-centro','SOF-001')===12 && LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-centro','SOF-001',null,'Cuarentena')===2", "Recepción parcial no aumenta disponible antes de inspección");
    await accion("inspeccion"); await rellenar({ "#log-motivo": "Dos sofás conformes" }); await guardar();
    await comprobar("LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-centro','SOF-001')===14", "Inspección conforme libera stock");
    await ir("logistica/recepciones"); await accion("recepcion"); await rellenar({ "#log-ordenId": oc }); await cambiar("#log-ordenId"); await rellenar({ "#log-documento": "GP-002", "#log-lote": "SALA-002", "input[name=cantidad]": "1" }); await guardar();
    await accion("inspeccion"); await rellenar({ "#log-resultado": "No conforme", "#log-motivo": "Daño detectado en tapizado" }); await guardar();
    await decidir("devolver-proveedor", "Retiro del sofá dañado por proveedor");
    await comprobar("LogisticaAplicacion.leer().ordenes[0].estado==='Parcialmente recibida'", "Devolución al proveedor reabre cantidad pendiente");
    await ir("logistica/recepciones"); await accion("recepcion"); await rellenar({ "#log-ordenId": oc }); await cambiar("#log-ordenId"); await rellenar({ "#log-documento": "GP-003", "#log-lote": "SALA-003", "input[name=cantidad]": "1" }); await guardar(); await accion("inspeccion"); await rellenar({ "#log-motivo": "Reposición conforme" }); await guardar();
    await login("Pablo", "Compras"); await ir(`compras/facturas/${vf}`); await accion("revalidar-factura");
    await comprobar("document.querySelector('.ficha').textContent.includes('Verificada') && document.querySelector('.ficha').textContent.includes('Pendiente de Finanzas') && !document.querySelector('[data-log-accion=pagar]')", "Cotejo revalidado sin registrar pago");
    await ir("compras/evaluaciones"); await accion("evaluacion"); await rellenar({ "#log-proveedorId": "prov-madera", "#log-comentario": "Dos conformes y una devolución documentada" }); await guardar(); await comprobar("LogisticaAplicacion.leer().evaluaciones[0].recepciones===3", "Evaluación usa recepciones reales");
    // Venta creada por la pantalla Comercial, sin precargar pedidos aprobados.
    await login("Luis", "Asesor"); await ir("comercial/cotizaciones"); await clic("[data-accion=nueva-cotizacion]"); await rellenar({ "#oportunidad-cotizacion": "opo-001" }); await cambiar("#oportunidad-cotizacion"); await guardar();
    await clic("[data-accion=enviar-cotizacion]"); await clic("[data-accion=aceptar-cotizacion]"); await clic("[data-accion=crear-pedido]"); await esperar("document.querySelector('#contenido h1')?.textContent.startsWith('PV-')");
    const pv = await leer("d.pedidos.at(-1).id", true); await clic("[data-accion=validar-pedido]");
    await login("Miguel", "Jefatura"); await ir(`comercial/pedidos/${pv}`); await clic("[data-accion=aprobar-pedido]");
    await comprobar("JSON.parse(localStorage.getItem('famihogar.comercial.v1')).pedidos[0].controles.stockOrigen.includes('Logística')", "Comercial valida contra existencias de Logística");
    await login("Luis", "Almacén"); await ir("logistica/reservas"); await accion("reserva"); await rellenar({ "#log-pedidoId": pv }); await cambiar("#log-pedidoId"); await guardar();
    const res = await leer("d.reservas.at(-1).id"); await comprobar("LogisticaReglas.reservado(LogisticaAplicacion.leer(),'alm-centro','SOF-001')===1", "Reserva compromete unidades del pedido aprobado");
    await ir("logistica/picking"); await accion("picking"); await rellenar({ "#log-reservaId": res }); await cambiar("#log-reservaId"); await guardar(); const pick = await leer("d.picking.at(-1).id");
    await decidir("preparar-picking", "Cantidades y lotes preparados"); await decidir("embalar-picking", "Protección y etiquetas verificadas");
    await ir("despachos/despachos"); await accion("despacho"); await rellenar({ "#log-pickingId": pick }); await cambiar("#log-pickingId"); await rellenar({ "#log-transportista": "Ana", "#log-placa": "ABC-123" }); await guardar(); const des = await leer("d.despachos.at(-1).id");
    await comprobar("LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-centro','SOF-001')===14 && ContratosLogisticos.consultarSeguimiento(" + JSON.stringify(pv) + ").entregas.length===0", "Salida descuenta stock sin afirmar entrega");
    await foto("03-salida-almacen");
    await login("Miguel", "Jefatura"); await ir(`comercial/pedidos/${pv}`); await clic("[data-accion=bloquear-pedido]"); await rellenar({ "#motivo": "Intento posterior a salida" }); await evaluar("document.querySelector('#formulario-registro').requestSubmit()");
    await comprobar("document.querySelector('#error-formulario').textContent.includes('salida')", "Salida física bloquea cancelación directa aunque no se haya sincronizado entrega"); await clic("#cerrar-modal");
    await login("Ana", "Transporte"); await ir(`despachos/despachos/${des}`); await accion("ruta"); await accion("entrega"); await rellenar({ "#log-receptor": "Elena Rojas", "#log-evidencia": "POD-001 firmado" }); await guardar();
    await comprobar("document.querySelector('.ficha').textContent.includes('Entregado') && !document.querySelector('[data-log-accion=despacho]')", "Transporte confirma entrega con constancia"); await foto("04-entrega-confirmada");
    await login("Luis", "Asesor"); await ir(`comercial/pedidos/${pv}`); await clic("[data-accion=seguimiento-pedido]"); await comprobar("document.querySelector('.ficha').textContent.includes('Atendido') && document.querySelector('#contenido').textContent.includes('DES-')", "Comercial recupera entrega real del contrato de Logística");
    await clic("[data-accion=solicitar-devolucion]"); await rellenar({ "#motivo": "Cliente solicita revisión del sofá", "#devolver-SOF-001": "1" }); await guardar(); const sol = await leer("d.solicitudes.at(-1).id", true);
    await login("Miguel", "Jefatura"); await ir(`comercial/solicitudes/${sol}`); await clic("[data-accion=autorizar-solicitud]"); await rellenar({ "#motivo": "Retorno autorizado para inspección" }); await guardar();
    await login("Luis", "Almacén"); await ir("logistica/retornos"); await accion("devolucion"); await rellenar({ "#log-solicitudId": sol }); await cambiar("#log-solicitudId"); await rellenar({ "#log-documento": "DC-001", "#log-motivo": "Sofá recibido físicamente" }); await guardar();
    await comprobar("LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-centro','SOF-001',null,'Cuarentena')===1", "Devolución autorizada ingresa a cuarentena");
    await login("Miguel", "Jefatura"); await ir(`comercial/solicitudes/${sol}`); await clic("[data-accion=seguimiento-devolucion]");
    await comprobar("document.querySelector('#contenido').textContent.includes('DEV-') && JSON.parse(localStorage.getItem('famihogar.comercial.v1')).solicitudes[0].estado==='Autorizada'", "Comercial consulta recepción sin inventar nota de crédito ni cierre financiero");
    await ir("logistica/inventario"); await accion("cuarentena"); await rellenar({ "#log-motivo": "Inspección del retorno sin daño" }); await guardar();
    await comprobar("LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-centro','SOF-001',null,'Cuarentena')===0", "Jefatura resuelve cuarentena del retorno con motivo");
    await ir("logistica/planificacion"); await accion("parametros"); await rellenar({ "#log-codigo": "SOF-001", "#log-minimo": "3", "#log-objetivo": "15", "#log-motivo": "Reposición según sede" }); await guardar();
    await accion("prevision"); await rellenar({ "#log-codigo": "SOF-001", "#log-unidades": "30", "#log-motivo": "Previsión mensual de sala" }); await guardar();
    await comprobar("LogisticaAplicacion.leer().planes[0].cantidad===30 && !!document.querySelector('[data-log-accion=sugerencia]')", "Previsión y parámetros generan sugerencia de compra");
    // Una entrega fallida mantiene la salida hasta recibir el retorno físico.
    await login("Luis", "Asesor"); await ir("comercial/cotizaciones"); await clic("[data-accion=nueva-cotizacion]"); await rellenar({ "#oportunidad-cotizacion": "opo-001" }); await cambiar("#oportunidad-cotizacion"); await guardar();
    await clic("[data-accion=enviar-cotizacion]"); await clic("[data-accion=aceptar-cotizacion]"); await clic("[data-accion=crear-pedido]"); await esperar("document.querySelector('#contenido h1')?.textContent.startsWith('PV-')"); const pv2 = await leer("d.pedidos.at(-1).id", true); await clic("[data-accion=validar-pedido]");
    await login("Miguel", "Jefatura"); await ir(`comercial/pedidos/${pv2}`); await clic("[data-accion=aprobar-pedido]");
    await login("Luis", "Almacén"); await ir("logistica/reservas"); await accion("reserva"); await rellenar({ "#log-pedidoId": pv2 }); await cambiar("#log-pedidoId"); await guardar(); const res2 = await leer("d.reservas.at(-1).id");
    await ir("logistica/picking"); await accion("picking"); await rellenar({ "#log-reservaId": res2 }); await cambiar("#log-reservaId"); await guardar(); const pick2 = await leer("d.picking.at(-1).id"); await decidir("preparar-picking"); await decidir("embalar-picking");
    await ir("despachos/despachos"); await accion("despacho"); await rellenar({ "#log-pickingId": pick2 }); await cambiar("#log-pickingId"); await rellenar({ "#log-transportista": "Ana", "#log-placa": "ABC-123" }); await guardar(); const des2 = await leer("d.despachos.at(-1).id"); const fisicoSalida = await evaluar("LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-centro','SOF-001')");
    await login("Ana", "Transporte"); await ir(`despachos/despachos/${des2}`); await accion("ruta"); await accion("entrega"); await rellenar({ "#log-receptor": "Elena Rojas", "#log-evidencia": "POD-002 entrega parcial", "#log-motivo": "Cliente pospone recepción del sofá", "input[name=cantidad]": "0" }); await guardar();
    const ret = await leer("d.retornos.at(-1).id"); await comprobar(`LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-centro','SOF-001')===${fisicoSalida} && LogisticaAplicacion.leer().retornos.at(-1).estado==='Pendiente'`, "Entrega parcial genera retorno sin reposición automática");
    await login("Luis", "Almacén"); await ir(`logistica/retornos/${ret}`); await accion("recibir-retorno"); await rellenar({ "#log-documento": "RT-001", "#log-calidad": "Disponible", "#log-motivo": "Sofá regresó sin daño" }); await cambiar("#log-calidad"); await guardar();
    await comprobar(`LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-centro','SOF-001')===${fisicoSalida + 1}`, "Retorno físico repone una vez las unidades no entregadas");
    // Acuerdo marco y OC vinculada a una nueva necesidad.
    await login("Pablo", "Compras"); await ir("compras/acuerdos"); await accion("acuerdo"); await rellenar({ "select[name=codigo]": "SOF-001", "input[name=cantidad]": "5", "input[name=precio]": "950" }); await guardar(); const acu = await leer("d.acuerdos.at(-1).id");
    await ir("compras/requisiciones"); await accion("requisicion"); await rellenar({ "#log-motivo": "Reponer bajo acuerdo marco", "select[name=codigo]": "SOF-001", "input[name=cantidad]": "2" }); await guardar(); const req2 = await leer("d.requisiciones.at(-1).id");
    await login("Miguel", "Jefatura"); await ir(`logistica/acuerdos/${acu}`); await decidir("aprobar-acuerdo"); await ir(`logistica/requisiciones/${req2}`); await decidir("aprobar-requisicion");
    await login("Pablo", "Compras"); await ir("compras/ordenes"); await accion("orden"); await rellenar({ "#log-fuente": "acuerdo|" + acu }); await cambiar("#log-fuente"); await rellenar({ "#log-requisicionId": req2 }); await guardar();
    await comprobar("LogisticaAplicacion.leer().ordenes.at(-1).base===190000 && LogisticaAplicacion.leer().ordenes.at(-1).acuerdoId!=null", "OC desde acuerdo conserva precio y origen aprobados");
    // Traslado con recepción independiente en Los Olivos.
    await login("Luis", "Almacén"); await ir("logistica/traslados"); await accion("traslado"); await rellenar({ "#log-destino": "alm-olivos", "#log-motivo": "Reposición de tienda Los Olivos", "select[name=codigo]": "SOF-001", "input[name=cantidad]": "2" }); await guardar(); const tra = await leer("d.traslados.at(-1).id");
    await login("Miguel", "Jefatura"); await ir(`logistica/traslados/${tra}`); await decidir("aprobar-traslado");
    await login("Luis", "Almacén"); await ir(`logistica/traslados/${tra}`); await accion("salida-traslado"); await comprobar("LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-olivos','SOF-001')===4", "Tránsito no aumenta automáticamente almacén destino");
    await login("Pablo", "Almacén", "olivos"); await ir(`logistica/traslados/${tra}`); await accion("recibir-traslado"); await rellenar({ "#log-documento": "TR-001", "#log-calidad": "Disponible", "#log-motivo": "Cantidad recibida en tienda" }); await cambiar("#log-calidad"); await guardar();
    await comprobar("LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-olivos','SOF-001')===6 && document.querySelector('.ficha').textContent.includes('Recibido')", "Destino recibe traslado en su propia sede");
    await ir(`logistica/recepciones/${rec1}`); await comprobar("document.querySelector('#contenido').textContent.includes('no encontrado')", "Una sede no consulta recepción ajena");
    await ir("logistica/conteos"); await accion("conteo"); await rellenar({ "#log-codigo": "SOF-001", "#log-contado": "5", "#log-motivo": "Conteo de stock inicial" }); await guardar(); const con = await leer("d.conteos.at(-1).id");
    await login("Miguel", "Jefatura", "olivos"); await ir(`logistica/conteos/${con}`); await decidir("aprobar-conteo", "Diferencia física comprobada");
    await comprobar("LogisticaReglas.saldo(LogisticaAplicacion.leer(),'alm-olivos','SOF-001')===5", "Conteo ajusta la posición y lote contados");
    await ir("logistica/acciones"); await accion("accion"); await rellenar({ "#log-causa": "Daño de embalaje", "#log-responsable": "Pablo", "#log-descripcion": "Añadir protección a las patas" }); await guardar(); const ac = await leer("d.acciones.at(-1).id");
    await login("Pablo", "Almacén", "olivos"); await ir(`logistica/acciones/${ac}`); await decidir("avanzar-accion", "Protector instalado"); await decidir("avanzar-accion", "Referencia de foto EVI-001");
    await login("Miguel", "Jefatura", "olivos"); await ir(`logistica/acciones/${ac}`); await decidir("avanzar-accion", "Protección revisada por Jefatura"); await comprobar("document.querySelector('.ficha').textContent.includes('Completada')", "Acción correctiva cierra con evidencia independiente");
    await ir("logistica/control"); await foto("05-indicadores");
    await login("Miguel", "Jefatura"); await ir(`logistica/despachos/${des}`); await enviar("Page.reload"); await esperar("!!document.querySelector('#contenido .ficha')");
    await comprobar("document.querySelector('.ficha').textContent.includes('POD-001 firmado')", "Recarga conserva entrega y constancia");
    await enviar("Emulation.setEmulatedMedia", { media: "print" });
    await comprobar("getComputedStyle(document.querySelector('#sistema')).display==='none' && !document.querySelector('.vista-imprimir button') && document.querySelector('.vista-imprimir').textContent.includes('POD-001 firmado')", "Impresión conserva ficha sin botones ni menú");
    const pdf = await enviar("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false }); const buffer = Buffer.from(pdf.data, "base64"); fs.writeFileSync(path.join(carpeta, "despacho.pdf"), buffer);
    const paginasPdf = (buffer.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length; if (!paginasPdf) throw Error("PDF vacío"); await enviar("Emulation.setEmulatedMedia", { media: "" });
    await enviar("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    for (const ruta of ["logistica/resumen", "logistica/inventario", "logistica/planificacion", "logistica/control", "logistica/ordenes"]) { await ir(ruta); await comprobar("document.documentElement.scrollWidth<=innerWidth", "Móvil sin desbordamiento: " + ruta); }
    await ir("logistica/resumen"); await foto("06-movil-logistica");
    await ir("logistica/requisiciones"); await accion("requisicion"); await comprobar("document.querySelector('#modal').scrollWidth<=innerWidth", "Formulario móvil sin desbordamiento"); await foto("07-movil-formulario"); await clic("#cerrar-modal");
    for (const rol of ["Tesorería", "Facturación", "Contabilidad"]) { await login("Usuario " + rol, rol); await ir("logistica/inventario"); await comprobar("document.querySelector('#contenido').textContent.includes('no tiene operaciones para tu rol') && !document.querySelector('#contenido [data-log-accion]')", "Separación de Logística: " + rol); }
    await login("Luis", "Almacén"); await ir("compras/ordenes"); await comprobar("document.querySelector('#contenido').textContent.includes('no tiene operaciones para tu rol')", "Almacén no emite OC");
    await login("Ana", "Transporte"); await ir("logistica/inventario"); await comprobar("document.querySelector('#contenido').textContent.includes('No tienes acceso')", "Transporte no modifica inventario");
    await comprobar("!/prototipo|acad[eé]mico/i.test(document.body.innerText)", "Textos de pantalla acordados"); await clic("#salir"); await comprobar("!sessionStorage.getItem('famihogar.sesion')", "Salir elimina sesión");
    if (pagina.errores.length) throw Error(pagina.errores.join("\n"));
    const resultado = { comprobaciones: comprobaciones.length, superadas: comprobaciones, excepcionesJavaScript: pagina.errores.length, paginasPdf, carpeta };
    fs.writeFileSync(path.join(carpeta, "resultado.json"), JSON.stringify(resultado, null, 2)); console.log(JSON.stringify(resultado));
  } finally { pagina?.cerrar(); await browser.enviar("Target.disposeBrowserContext", { browserContextId }); browser.cerrar(); }
}
ejecutar().catch(e => { console.error(e); process.exit(1); });
