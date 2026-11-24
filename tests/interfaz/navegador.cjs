// Requiere servidor en localhost:5300 y Chrome headless con depuración local.
// Crea un contexto aislado y lo elimina al terminar; no toca el perfil del usuario.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const puerto = Number(process.argv[2] || 9245);
const origen = "http://localhost:5300/";
const carpeta = path.join(os.tmpdir(), "famihogar-comercial-validacion");
fs.mkdirSync(carpeta, { recursive: true });

async function conectar(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let n = 0;
  const pendientes = new Map(), errores = [];
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.method === "Runtime.exceptionThrown") errores.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.id) {
      const p = pendientes.get(m.id); pendientes.delete(m.id);
      m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result);
    }
  };
  const enviar = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++n; pendientes.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
  });
  return { enviar, errores, cerrar: () => ws.close() };
}

async function ejecutar() {
  const version = await (await fetch(`http://127.0.0.1:${puerto}/json/version`)).json();
  if (!version["User-Agent"].includes("HeadlessChrome")) throw Error("Usa únicamente un navegador headless de prueba.");
  const browser = await conectar(version.webSocketDebuggerUrl);
  const { browserContextId } = await browser.enviar("Target.createBrowserContext");
  let pagina;
  const comprobaciones = [];
  try {
    const { targetId } = await browser.enviar("Target.createTarget", { url: "about:blank", browserContextId });
    const targets = await (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json();
    pagina = await conectar(targets.find(t => t.id === targetId).webSocketDebuggerUrl);
    const enviar = pagina.enviar;
    const evaluar = async expression => {
      const r = await enviar("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    };
    const esperar = async expression => {
      for (let i = 0; i < 100; i++) { if (await evaluar(expression)) return; await new Promise(r => setTimeout(r, 100)); }
      throw Error("Espera agotada: " + expression);
    };
    const comprobar = async (expression, nombre) => { if (!await evaluar(expression)) throw Error(nombre); comprobaciones.push(nombre); };
    const clic = selector => evaluar(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const rellenar = async valores => { for (const [selector, valor] of Object.entries(valores)) await evaluar(`document.querySelector(${JSON.stringify(selector)}).value=${JSON.stringify(valor)}`); };
    const cambiar = selector => evaluar(`document.querySelector(${JSON.stringify(selector)}).dispatchEvent(new Event('change',{bubbles:true}))`);
    const abrirGuardado = () => evaluar("document.querySelector('.resultado-operacion a')?.click()");
    const guardar = async (abrir = true) => {
      await evaluar("document.querySelector('#formulario-registro').requestSubmit()");
      if (abrir && await evaluar("!document.querySelector('#modal').open")) await abrirGuardado();
    };
    const almacen = expresion => evaluar(`(()=>{const d=JSON.parse(localStorage.getItem('famihogar.comercial.v1'));return ${expresion}})()`);
    const ir = async destino => { await evaluar(`location.hash=${JSON.stringify("comercial/" + destino)}`); await esperar(`location.hash===${JSON.stringify("#comercial/" + destino)}`); await evaluar("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))"); };
    const foto = async nombre => {
      await evaluar("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))");
      const captura = await enviar("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
      fs.writeFileSync(path.join(carpeta, nombre + ".png"), Buffer.from(captura.data, "base64"));
    };
    const login = async (nombre, rol) => {
      if (await evaluar("!document.querySelector('#sistema').hidden")) await clic("#salir");
      await rellenar({ "#nombre": nombre, "#rol": rol, "#sede-acceso": "centro" });
      await evaluar("document.querySelector('#formulario-acceso').requestSubmit()");
      await esperar("!document.querySelector('#sistema').hidden");
    };
    const decidir = async (selector, motivo) => { await clic(selector); await rellenar({ "#motivo": motivo }); await guardar(); };
    const abrirCotizacion = async (oportunidadId, descuento = "0", condicion = "Contado") => {
      await ir("cotizaciones"); await clic("[data-accion=nueva-cotizacion]");
      await rellenar({ "#oportunidad-cotizacion": oportunidadId }); await cambiar("#oportunidad-cotizacion");
      await rellenar({ "#descuento": descuento, "#condicion": condicion, "#motivo-descuento": "Acuerdo comercial revisable" });
      await evaluar("document.querySelector('#descuento').dispatchEvent(new Event('input',{bubbles:true}))");
    };
    const guardarCotizacion = async () => {
      await guardar(); await esperar("!document.querySelector('#modal').open && !!document.querySelector('#contenido .ficha')");
      return almacen("d.cotizaciones.at(-1)");
    };
    const aceptarYCrearPedido = async () => {
      await clic("[data-accion=enviar-cotizacion]"); await clic("[data-accion=aceptar-cotizacion]");
      await clic("[data-accion=crear-pedido]");
      await comprobar("location.hash.includes('/cotizaciones/') && !!document.querySelector('.resultado-operacion a[href*=\"/pedidos/\"]')", "Crear pedido conserva la cotización y ofrece abrir el pedido");
      await abrirGuardado(); await esperar("document.querySelector('#contenido h1')?.textContent.startsWith('PV-')");
      return almacen("d.pedidos.at(-1)");
    };

    await enviar("Runtime.enable"); await enviar("Page.enable");
    await enviar("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await enviar("Page.navigate", { url: origen });
    await esperar("!!window.ReglasComerciales && document.querySelector('#sede-acceso').options.length===3");
    await clic("#acceso [data-guia=acceso]");
    await comprobar("document.querySelector('#ayuda').open && document.querySelector('#siguiente-ayuda').textContent.includes('Ingresar')", "Ayuda de acceso con el siguiente paso");
    await clic("#ayuda button[type=submit]");
    await esperar("!document.querySelector('#ayuda').open");
    await foto("01-acceso"); await login("Luis", "Asesor");
    await comprobar("document.querySelectorAll('[data-modulo]').length===8", "Selector de ocho módulos");
    const abrirAyuda = clave => clic("#modulos [data-guia=" + clave + "]");
    for (const modulo of ["comercial", "logistica", "compras", "despachos", "finanzas", "facturacion", "contabilidad", "reportes"]) {
      await abrirAyuda(modulo);
      await comprobar("document.querySelector('#ayuda').open && document.querySelectorAll('#pasos-ayuda li').length===2 && !!document.querySelector('#siguiente-ayuda').textContent && location.hash==='#aplicaciones'", "Guía disponible desde Aplicaciones: " + modulo);
      await clic("#ayuda button[type=submit]");
      await esperar("!document.querySelector('#ayuda').open");
    }
    await abrirAyuda("facturacion");
    await comprobar("document.querySelector('#pasos-ayuda').textContent.includes('pedido entregado') && document.querySelector('#siguiente-ayuda').textContent.includes('Finanzas')", "La guía de Facturación explica emisión y cobro");
    await enviar("Page.bringToFront");
    await enviar("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await enviar("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await esperar("!document.querySelector('#ayuda').open && document.activeElement?.dataset.guia==='facturacion'");
    await rellenar({ "#buscar-aplicacion": "facturacion" }); await evaluar("document.querySelector('#buscar-aplicacion').dispatchEvent(new Event('input',{bubbles:true}))");
    await comprobar("document.querySelectorAll('[data-modulo]').length===1", "Búsqueda sin tildes");
    await rellenar({ "#buscar-aplicacion": "" }); await evaluar("document.querySelector('#buscar-aplicacion').dispatchEvent(new Event('input',{bubbles:true}))");
    await foto("02-aplicaciones"); await clic("[data-modulo=comercial]"); await esperar("document.querySelector('#contenido h1')?.textContent==='Panel comercial'");
    await clic("#navegacion [data-guia='comercial/clientes']");
    await comprobar("document.querySelector('#ayuda').open && document.querySelector('#titulo-ayuda').textContent.includes('Clientes') && !document.querySelector('#modal').open && !localStorage.getItem('famihogar.comercial.v1')", "Ayuda de sección independiente de navegación y registro");
    await clic("#ayuda button[type=submit]");
    await clic("[data-accion=nuevo-cliente]");
    await rellenar({ "#documento": "70000003", "#nombreCliente": "Cliente de revisión", "#direccion": "Av. Ejemplo 100" });
    await clic("[data-accion=copiar-direcciones]");
    await comprobar("document.querySelector('#direccionFiscal').value==='Av. Ejemplo 100' && document.querySelector('#direccionCobranza').value==='Av. Ejemplo 100'", "Cliente puede copiar la dirección sin escribirla tres veces");
    await guardar(); await esperar("!document.querySelector('#modal').open");
    const clienteId = await almacen("d.clientes.at(-1).id"), maestroId = await almacen("d.solicitudesMaestro.at(-1).id");
    await comprobar("document.querySelector('#contenido').textContent.includes('Pendiente')", "Alta de cliente pendiente de revisión");
    await clic("[data-accion=nueva-oportunidad]");
    await comprobar(`!Array.from(document.querySelector('#cliente-oportunidad').options).some(o=>o.value===${JSON.stringify(clienteId)})`, "Cliente pendiente no se usa en oportunidad"); await clic("#cerrar-modal");
    await login("Luis", "Jefatura"); await ir("aprobaciones");
    await decidir(`[data-accion=aprobar-maestro][data-id='${maestroId}']`, "Revisión propia");
    await comprobar("document.querySelector('#error-formulario').textContent.includes('Otra persona')", "No autoaprobar maestro"); await clic("#cerrar-modal");
    await login("Miguel", "Jefatura"); await ir("aprobaciones");
    await clic(`[data-accion=ver-maestro][data-id='${maestroId}']`); await comprobar("document.querySelector('#cuerpo-modal').textContent.includes('Cliente de revisión')", "Propuesta visible antes de aprobar"); await clic("#cerrar-modal");
    await decidir(`[data-accion=aprobar-maestro][data-id='${maestroId}']`, "Identificación y direcciones revisadas");
    await comprobar(`JSON.parse(localStorage.getItem('famihogar.comercial.v1')).clientes.find(c=>c.id===${JSON.stringify(clienteId)}).estado==='Aprobado'`, "Otra Jefatura aprueba maestro");
    await login("Luis", "Asesor"); await ir("oportunidades"); await clic("[data-accion=nueva-oportunidad]");
    await rellenar({ "#cliente-oportunidad": clienteId, "#asunto": "Renovación de sala", "select[name=producto]": "SOF-001", "input[name=cantidad]": "0" });
    await comprobar("!document.querySelector('#formulario-registro').checkValidity()", "Cantidad cero rechazada");
    await rellenar({ "input[name=cantidad]": "2" }); await clic("[data-accion=agregar-producto]"); await evaluar("document.querySelectorAll('select[name=producto]')[1].value='SOF-001'"); await guardar();
    await comprobar("document.querySelector('#error-formulario').textContent.includes('repetido')", "Producto repetido rechazado");
    await evaluar("document.querySelectorAll('select[name=producto]')[1].value='MES-001'"); await guardar(false); await esperar("!document.querySelector('#modal').open");
    await comprobar("location.hash==='#comercial/oportunidades' && document.querySelector('.resultado-operacion a').textContent.includes('Ver registro guardado')", "Al guardar una oportunidad, la lista se conserva hasta que se abre el registro");
    await abrirGuardado();
    const oportunidadId = await almacen("d.oportunidades.at(-1).id");
    await esperar("location.hash.endsWith(" + JSON.stringify(oportunidadId) + ")");
    await comprobar("!!document.querySelector('.recorrido-siguiente [data-accion=nueva-cotizacion]') && document.querySelector('.recorrido [aria-current=step]').textContent.includes('Oportunidad')", "La ficha de la oportunidad sugiere preparar la cotización");
    await abrirCotizacion(oportunidadId, "10");
    await comprobar("document.querySelector('#vista-calculo').textContent.includes('3,766.91')", "Cálculo de excepción de 10 %");
    const cotizacion = await guardarCotizacion();
    await comprobar("!document.querySelector('[data-accion=enviar-cotizacion]') && !document.querySelector('[data-accion=crear-pedido]')", "Excepción impide continuar antes de aprobación");
    await login("Luis", "Jefatura"); await ir(`cotizaciones/${cotizacion.id}`); await decidir("[data-accion=aprobar-descuento]", "Revisión propia");
    await comprobar("document.querySelector('#error-formulario').textContent.includes('Otra persona')", "No autoaprobar excepción"); await clic("#cerrar-modal");
    await login("Miguel", "Jefatura"); await ir(`cotizaciones/${cotizacion.id}`); await decidir("[data-accion=aprobar-descuento]", "Condición comercial autorizada");
    await comprobar("!!document.querySelector('[data-accion=enviar-cotizacion]')", "Excepción autorizada permite enviar");
    await login("Luis", "Asesor"); await ir(`cotizaciones/${cotizacion.id}`);
    const p = await aceptarYCrearPedido();
    await comprobar(`JSON.parse(localStorage.getItem('famihogar.comercial.v1')).pedidos.at(-1).total===${cotizacion.total}`, "Pedido conserva descuento y totales");
    await clic("[data-accion=validar-pedido]");
    await comprobar("document.querySelector('#contenido').textContent.includes('Pendiente de aprobación')", "Controles favorables esperan revisión");
    await login("Luis", "Jefatura"); await ir(`pedidos/${p.id}`); await clic("[data-accion=aprobar-pedido]");
    await comprobar("document.querySelector('#estado').textContent.includes('Otra persona')", "No autoaprobar pedido");
    await login("Miguel", "Jefatura"); await ir(`pedidos/${p.id}`); await clic("[data-accion=aprobar-pedido]");
    await comprobar("!!document.querySelector('[data-accion=seguimiento-pedido]')", "Aprobación comercial habilita seguimiento"); await foto("03-pedido-aprobado");
    await evaluar(`{const original=window.IntegracionesComerciales.consultarSeguimiento;window.IntegracionesComerciales.consultarSeguimiento=id=>id===${JSON.stringify(p.id)}?{...original(id),entregas:[{id:'entrega-1',numero:'GRE-0001',lineas:[{codigo:'SOF-001',cantidad:1}]}]}:original(id);}`);
    await clic("[data-accion=seguimiento-pedido]");
    await comprobar("document.querySelector('#contenido').textContent.includes('Parcialmente atendido')", "Atención parcial informada por Despachos");
    await login("Luis", "Asesor"); await ir(`pedidos/${p.id}`); await clic("[data-accion=solicitar-devolucion]");
    await rellenar({ "#motivo": "Cliente solicita cambio de producto", "#devolver-SOF-001": "1" }); await guardar(); await esperar("location.hash.includes('/solicitudes/') && !document.querySelector('#modal').open");
    const solicitud = await almacen("d.solicitudes.at(-1)");
    await comprobar("document.querySelector('#contenido').textContent.includes('Pendiente')", "Solicitud comercial con motivo y origen");
    await login("Miguel", "Jefatura"); await ir(`solicitudes/${solicitud.id}`); await decidir("[data-accion=autorizar-solicitud]", "Procede evaluar retorno físico");
    await comprobar("document.querySelector('#contenido').textContent.includes('Autorizada')", "Devolución autorizada por otra persona");
    await clic("[data-accion=seguimiento-devolucion]");
    await comprobar("document.querySelector('#contenido').textContent.includes('Autorizada')", "No se inventan recepción, nota ni ajuste financiero");
    await foto("04-devolucion");
    await login("Luis", "Asesor"); await abrirCotizacion("opo-001", "0", "Crédito 30 días"); await guardarCotizacion();
    const credito = await aceptarYCrearPedido(); await evaluar("window.FAMIHOGAR_RESPUESTAS.credito['cli-001'].vencido=1"); await clic("[data-accion=validar-pedido]");
    await comprobar("document.querySelector('#contenido').textContent.includes('Bloqueado') && document.querySelector('#contenido').textContent.includes('deuda vencida')", "Respuesta financiera desfavorable bloquea pedido");
    await evaluar("window.FAMIHOGAR_RESPUESTAS.credito['cli-001'].vencido=0");
    await clic("[data-accion=solicitar-anulacion]"); await rellenar({ "#motivo": "Cliente desiste del pedido a crédito" }); await guardar(); await esperar("location.hash.includes('/solicitudes/') && !document.querySelector('#modal').open");
    const anulacion = await almacen("d.solicitudes.at(-1)");
    await login("Miguel", "Jefatura"); await ir(`solicitudes/${anulacion.id}`); await decidir("[data-accion=autorizar-solicitud]", "Cliente confirmó cancelación");
    await comprobar(`JSON.parse(localStorage.getItem('famihogar.comercial.v1')).pedidos.find(p=>p.id===${JSON.stringify(credito.id)}).estado==='Anulado'`, "Anulación conserva pedido e historial");

    await ir("precios"); await clic("[data-accion=editar-lista][data-id=lista-tienda]"); await rellenar({ "#precio-SOF-001": "1600" }); await guardar(); await esperar("!document.querySelector('#modal').open");
    const cambioLista = await almacen("d.solicitudesMaestro.at(-1).id");
    await comprobar("JSON.parse(localStorage.getItem('famihogar.comercial.v1')).listasPrecio[0].precios['SOF-001']===159900", "Propuesta no sustituye lista antes de revisión");
    await login("Pablo", "Jefatura"); await ir("aprobaciones"); await decidir(`[data-accion=aprobar-maestro][data-id='${cambioLista}']`, "Lista revisada");
    await comprobar("JSON.parse(localStorage.getItem('famihogar.comercial.v1')).listasPrecio[0].precios['SOF-001']===160000", "Cambio de precio publicado tras aprobación");
    await ir(`cotizaciones/${cotizacion.id}`); await comprobar("document.querySelector('#contenido .totales').textContent.includes('3,766.91')", "Cotización conserva precios anteriores");
    await enviar("Page.reload"); await esperar("!!document.querySelector('#contenido .ficha')"); await comprobar("document.querySelector('#contenido').textContent.includes('3,766.91')", "Recarga conserva documento");
    await enviar("Emulation.setEmulatedMedia", { media: "print" });
    await comprobar("getComputedStyle(document.querySelector('#sistema')).display==='none' && !document.querySelector('.vista-imprimir button')", "Impresión sin controles");
    const pdf = await enviar("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
    const buffer = Buffer.from(pdf.data, "base64"); fs.writeFileSync(path.join(carpeta, "cotizacion.pdf"), buffer);
    const paginasPdf = (buffer.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (paginasPdf !== 1) throw Error(`La ficha de prueba genera ${paginasPdf} páginas.`);
    comprobaciones.push("Ficha A4 de una página"); await enviar("Emulation.setEmulatedMedia", { media: "" });

    await ir("catalogo"); await clic("[data-accion=nuevo-producto]");
    await rellenar({ "#codigo": "PRU-001", "#nombreMaestro": "Mueble de verificación", "#familia": "Sala", "#unidad": "Unidad", "#coste": "123.45" }); await guardar(); await esperar("!document.querySelector('#modal').open");
    const productoPendiente = await almacen("d.solicitudesMaestro.at(-1).id");
    await comprobar("!JSON.parse(localStorage.getItem('famihogar.comercial.v1')).productos.some(p=>p.codigo==='PRU-001')", "Producto no publicado antes de revisión");
    await login("Miguel", "Jefatura"); await ir("aprobaciones"); await decidir(`[data-accion=aprobar-maestro][data-id='${productoPendiente}']`, "Producto y coste revisados");
    await ir("catalogo"); await comprobar("document.querySelector('#contenido').textContent.includes('Mueble de verificación')", "Producto aprobado disponible en catálogo");
    await ir("precios"); await clic("[data-accion=nueva-promocion]");
    await rellenar({ "#nombreMaestro": "Hogar Web 3 %", "#canalMaestro": "Web", "#descuentoPromo": "3" }); await guardar(); await esperar("!document.querySelector('#modal').open");
    const promocionPendiente = await almacen("d.solicitudesMaestro.at(-1).id");
    await login("Pablo", "Jefatura"); await ir("aprobaciones"); await decidir(`[data-accion=aprobar-maestro][data-id='${promocionPendiente}']`, "Promoción revisada");
    await comprobar("JSON.parse(localStorage.getItem('famihogar.comercial.v1')).promociones.some(p=>p.nombre==='Hogar Web 3 %')", "Promoción publicada tras revisión");
    await login("Luis", "Asesor"); await ir("catalogo"); await comprobar("!Array.from(document.querySelectorAll('#contenido th')).some(th=>th.textContent==='Coste')", "Costes fuera de la vista del Asesor");
    await ir("oportunidades"); await clic("[data-accion=nueva-oportunidad]");
    await rellenar({ "#cliente-oportunidad": "cli-001", "#asunto": "Sala por canal Web", "#canal": "Web", "select[name=producto]": "SOF-001" }); await guardar(); await esperar("!document.querySelector('#modal').open");
    const opWeb = await almacen("d.oportunidades.at(-1).id"), promoId = await almacen("d.promociones.find(p=>p.nombre==='Hogar Web 3 %').id");
    await abrirCotizacion(opWeb); await rellenar({ "#promocion": promoId }); await cambiar("#promocion");
    await comprobar("document.querySelector('#descuento').disabled && document.querySelector('#vista-calculo').textContent.includes('1,775.31')", "Promoción por canal no acumulada y cálculo correcto"); await guardarCotizacion();
    await evaluar("{const d=JSON.parse(localStorage.getItem('famihogar.comercial.v1'));d.listasPrecio.find(l=>l.id==='lista-web').hasta='2020-01-01';localStorage.setItem('famihogar.comercial.v1',JSON.stringify(d));window.dispatchEvent(new StorageEvent('storage',{key:'famihogar.comercial.v1'}));}");
    await abrirCotizacion(opWeb); await comprobar("document.querySelector('#vista-calculo').textContent.includes('No hay lista vigente') && document.querySelector('#formulario-registro button[type=submit]').disabled", "Lista vencida bloquea el formulario de cotización"); await clic("#cerrar-modal");
    await evaluar("{const d=JSON.parse(localStorage.getItem('famihogar.comercial.v1'));d.listasPrecio.find(l=>l.id==='lista-web').hasta='2027-12-31';localStorage.setItem('famihogar.comercial.v1',JSON.stringify(d));window.dispatchEvent(new StorageEvent('storage',{key:'famihogar.comercial.v1'}));}");
    await login("Pablo", "Jefatura"); await ir("indicadores"); await comprobar("!!document.querySelector('progress') && !!document.querySelector('#indicador-canal')", "Indicadores y filtros interactivos"); await foto("05-indicadores");
    await rellenar({ "#indicador-desde": "2099-01-01" }); await cambiar("#indicador-desde");
    await comprobar("!document.querySelector('#contenido tbody').textContent.includes('PV-') && document.querySelector('.importe-indicador').textContent.includes('0.00')", "Filtro de fecha excluye documentos e importes");
    await rellenar({ "#indicador-desde": "" }); await cambiar("#indicador-desde");
    await rellenar({ "#indicador-canal": "Web" }); await cambiar("#indicador-canal"); await comprobar("!document.querySelector('#contenido tbody').textContent.includes('PV-')", "Filtro de canal modifica el seguimiento");
    await rellenar({ "#sede-actual": "olivos" }); await cambiar("#sede-actual"); await ir(`pedidos/${p.id}`); await comprobar("document.querySelector('#contenido').textContent.includes('No se encontró')", "Separación de documentos por sede");
    for (const rol of ["Tesorería", "Almacén", "Transporte", "Facturación", "Contabilidad", "Compras"]) {
      await login("Usuario " + rol, rol); await clic("[data-modulo=comercial]"); await esperar("document.querySelector('#contenido').textContent.includes('Disponible para Asesor')");
      await comprobar("document.querySelector('#accesos-rapidos').hidden && !document.querySelector('#contenido .ficha')", "Separación de rol " + rol);
      await clic("#ir-aplicaciones"); await esperar("!document.querySelector('#aplicaciones').hidden"); await clic("[data-modulo=finanzas]"); await esperar("document.querySelector('#contenido h1')?.textContent===" + JSON.stringify(rol === "Tesorería" ? "Por cobrar" : "Finanzas"));
      if (rol === "Tesorería") {
        await esperar("document.querySelector('#contenido h1')?.textContent==='Por cobrar'");
        await comprobar("document.querySelector('#contenido').textContent.includes('comprobantes emitidos en Facturación') && !document.querySelector('[data-libro=emitir-comprobante]')", "Tesorería consulta cuentas por cobrar");
      } else {
        await comprobar("!document.querySelector('#contenido [data-libro]') && document.querySelector('#contenido').textContent.includes('Disponible para Tesorería')", "Separación de Finanzas: " + rol);
      }
    }
    await login("Persona de demostración", "Super Admin"); await ir("catalogo");
    await comprobar("document.querySelector('#rol-actual').textContent==='Super Admin' && !!document.querySelector('[data-accion=nuevo-producto]')", "Super Admin tiene acceso a controles de Jefatura en Comercial");
    await clic("[data-accion=nuevo-cliente]");
    await rellenar({ "#documento": "70000005", "#nombreCliente": "Cliente de demostración", "#direccion": "Av. Ejemplo 100", "#direccionFiscal": "Av. Ejemplo 100", "#direccionCobranza": "Av. Ejemplo 100" });
    await guardar();
    const solicitudDemo = await almacen("d.solicitudesMaestro.at(-1).id");
    await ir("aprobaciones");
    await decidir("[data-accion=aprobar-maestro][data-id='" + solicitudDemo + "']", "Aprobación de demostración");
    const maestroDemo = await almacen("d.solicitudesMaestro.at(-1)");
    await comprobar(String(maestroDemo.estado === "Aprobada" && maestroDemo.historial.at(-1).rol === "Super Admin"), "Super Admin aprueba su propia alta y conserva el rol en el historial");

    await login("Miguel", "Jefatura"); await enviar("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await comprobar("document.documentElement.scrollWidth<=innerWidth", "Selector móvil sin desbordamiento"); await foto("06-movil-aplicaciones");
    await ir("indicadores"); await comprobar("document.documentElement.scrollWidth<=innerWidth", "Indicadores móviles sin desbordamiento"); await foto("07-movil-indicadores");
    await ir("precios"); await comprobar("document.documentElement.scrollWidth<=innerWidth", "Precios móviles sin desbordamiento");
    await comprobar("!/prototipo|acad[eé]mico/i.test(document.body.innerText)", "Textos de pantalla acordados");
    await clic("#salir"); await comprobar("!sessionStorage.getItem('famihogar.sesion') && document.querySelector('#sistema').hidden", "Salida de sesión");
    if (pagina.errores.length) throw Error(pagina.errores.join("\n"));
    const resultado = { comprobaciones: comprobaciones.length, superadas: comprobaciones, excepcionesJavaScript: pagina.errores.length, paginasPdf, carpeta };
    fs.writeFileSync(path.join(carpeta, "resultado.json"), JSON.stringify(resultado, null, 2));
    console.log(JSON.stringify(resultado));
  } finally {
    pagina?.cerrar();
    await browser.enviar("Target.disposeBrowserContext", { browserContextId });
    browser.cerrar();
  }
}
ejecutar().catch(error => { console.error(error); process.exit(1); });
