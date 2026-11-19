// Usa un contexto desechable de Chrome headless; nunca abre el perfil personal.
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");
const puerto = Number(process.argv[2] || 9248);
const carpeta = path.join(os.tmpdir(), "famihogar-activos-validacion");
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
    const guardar = async () => { await evaluar("document.querySelector('#formulario-registro').requestSubmit()"); if (await evaluar("document.querySelector('#modal').open")) throw Error(await evaluar("document.querySelector('#error-formulario').textContent || [...document.querySelectorAll('#formulario-registro :invalid')].map(e=>e.id).join(', ')")); await evaluar("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))"); };
    const ir = async ruta => { await evaluar(`location.hash=${JSON.stringify(ruta)}`); await esperar(`location.hash===${JSON.stringify("#" + ruta)}`); await evaluar("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))"); };
    const login = async (nombre, rol, sede = "centro") => {
      if (await evaluar("!document.querySelector('#sistema').hidden")) await clic("#salir");
      await rellenar({ "#nombre": nombre, "#rol": rol, "#sede-acceso": sede }); await evaluar("document.querySelector('#formulario-acceso').requestSubmit()"); await esperar("!document.querySelector('#sistema').hidden");
    };
    const foto = async nombre => { const r = await enviar("Page.captureScreenshot", { format: "png", captureBeyondViewport: true }); fs.writeFileSync(path.join(carpeta, nombre + ".png"), Buffer.from(r.data, "base64")); };
    const accion = nombre => clic(`[data-af-accion="${nombre}"]`);
    const completar = async campos => {
      await rellenar(Object.fromEntries(Object.entries(campos).map(([k, v]) => ["#af-" + k, v])));
      await guardar();
    };
    const id = coleccion => evaluar(`window.ActivosAplicacion.leer()[${JSON.stringify(coleccion)}].at(-1).id`);
    const contenido = texto => `document.querySelector("#contenido").textContent.includes(${JSON.stringify(texto)})`;
    await enviar("Runtime.enable");
    await enviar("Page.enable");
    await enviar("Page.addScriptToEvaluateOnNewDocument", { source: `
      window.fechaPrueba = "2026-09-01T12:00:00Z";
      const FechaReal = Date;
      window.Date = class extends FechaReal {
        constructor(...args) { super(...(args.length ? args : [window.fechaPrueba])); }
        static now() { return FechaReal.parse(window.fechaPrueba); }
      };
    ` });
    await enviar("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await enviar("Page.navigate", { url: "http://localhost:5300/" });
    await esperar("!!window.PantallasActivos && document.querySelector('#sede-acceso').options.length===3");

    await login("Luis", "Asesor");
    await clic("[data-modulo=activos]");
    await esperar(contenido("Panel patrimonial"));
    await clic("#navegacion [data-af-vista=solicitudes]");
    await esperar(contenido("Solicitudes de inversión"));
    await accion("solicitar");
    await completar({ descripcion: "Tractor agrícola", clase: "Maquinaria y equipos", centroCosto: "Campo 30301015", presupuesto: "120000", motivo: "Equipo para uso interno" });
    const solicitud = await id("solicitudes"), ficha = `activos/solicitudes/${solicitud}`;
    await comprobar(contenido("CAP-00001"), "Asesor registra solicitud patrimonial");
    await login("Luis", "Jefatura");
    await ir(ficha);
    await accion("aprobar");
    await rellenar({ "#af-motivo": "Revisión propia" });
    await evaluar("document.querySelector('#formulario-registro').requestSubmit()");
    await comprobar("document.querySelector('#error-formulario').textContent.includes('Otra persona')", "Rechazo de autoaprobación por pantalla");
    await clic("#cerrar-modal");
    await login("Ana", "Jefatura");
    await ir(ficha);
    await accion("aprobar");
    await completar({ motivo: "Inversión revisada" });

    await login("Pablo", "Compras");
    await clic("[data-modulo=compras]");
    await esperar("!!document.querySelector('a[href=\"#compras/activos\"]')");
    await clic('a[href="#compras/activos"]');
    await esperar(contenido("Solicitudes de inversión"));
    await clic(`a[href="#${ficha}"]`);
    await esperar(contenido("CAP-00001"));
    await accion("orden");
    await completar({ proveedorId: "prov-madera", precio: "120000" });
    await comprobar(contenido("OCA-00001"), "Compras emite orden con proveedor del maestro compartido");

    await login("Marta", "Almacén");
    await ir("logistica/resumen");
    await clic('a[href="#logistica/activos"]');
    await esperar(contenido("Solicitudes de inversión"));
    await ir(ficha);
    await accion("recepcion");
    await completar({ documento: "GP-001", serie: "TRACTOR-01", conforme: "si", motivo: "Recepción verificada" });
    await comprobar(contenido("RCA-00001"), "Almacén registra recepción conforme");

    await login("Pablo", "Compras");
    await ir(ficha);
    await accion("factura");
    await completar({ documento: "F001-010" });
    await comprobar(contenido("141,600"), "Cotejo muestra S/ 141,600 con IGV");
    await comprobar("!localStorage.getItem(window.LogisticaAplicacion.CLAVE)", "La compra patrimonial no incrementó inventario comercial");

    await login("Sara", "Contabilidad");
    await ir(ficha);
    await accion("capitalizar");
    await comprobar("document.querySelector('#af-contable-unidades').disabled && document.querySelector('#af-tributario-meses').disabled", "Campos por método y libro");
    await completar({ ubicacion: "Patio", custodio: "Jefatura agrícola", etiqueta: "TAG-001", critico: "si", motivo: "Instalación y pruebas completadas" });
    const activo = await id("activos");
    await comprobar(contenido("AF-00001") + " && " + contenido("120,000"), "Alta patrimonial por S/ 120,000");
    await foto("01-ficha-patrimonial");
    await enviar("Emulation.setEmulatedMedia", { media: "print" });
    await comprobar("getComputedStyle(document.querySelector('#sistema')).display==='none' && document.querySelector('.vista-imprimir').textContent.includes('TRACTOR-01') && !document.querySelector('.vista-imprimir button')", "Ficha de impresión sin controles de la aplicación");
    const pdf = await enviar("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
    const buffer = Buffer.from(pdf.data, "base64");
    fs.writeFileSync(path.join(carpeta, "ficha-activo.pdf"), buffer);
    const paginasPdf = (buffer.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    await comprobar(String(paginasPdf === 1), "Ficha patrimonial A4 de una página");
    await enviar("Emulation.setEmulatedMedia", { media: "" });

    await evaluar('window.fechaPrueba = "2026-11-19T12:00:00Z"');
    await ir("activos/depreciacion");
    await accion("periodo");
    await completar({ periodo: "2026-10" });
    await comprobar(contenido("1,000"), "Depreciación mensual de S/ 1,000");
    await ir("contabilidad/resumen");
    await clic('a[href="#contabilidad/activos"]');
    await esperar(contenido("Documentos contables"));
    await comprobar(contenido("Adquisición y capitalización") + " && " + contenido("Depreciación"), "Diario patrimonial accesible desde Contabilidad");

    await login("Miguel", "Tesorería");
    await ir("finanzas/resumen");
    await clic('a[href="#finanzas/activos"]');
    await esperar(contenido("Obligaciones de la sede"));
    await accion("pagar");
    await completar({ documento: "BANCO-01" });
    await comprobar(contenido("Pagada") + " && " + contenido("BANCO-01"), "Pago registrado desde el circuito de Tesorería");
    await ir(`activos/activos/${activo}`);
    await comprobar(contenido("Esta sección no tiene operaciones para tu rol"), "Acceso directo a ficha protegido por rol");

    await login("Marta", "Almacén");
    await ir(`activos/activos/${activo}`);
    await accion("contar");
    await rellenar({ "#af-encontrado": "no" });
    await evaluar("document.querySelector('#af-encontrado').dispatchEvent(new Event('change',{bubbles:true}))");
    await comprobar("document.querySelector('#af-etiqueta').disabled", "Formulario permite registrar un bien no encontrado");
    await completar({ motivo: "No encontrado en la ubicación durante el conteo" });
    await comprobar(contenido("No encontrado"), "Conteo conserva diferencia física");
    await ir(`activos/activos/${activo}`);
    await accion("movimiento-Mantenimiento");
    await completar({ motivo: "Mantenimiento programado del motor" });
    const ordenTecnica = `activos/movimientos/${await id("movimientos")}`;
    await login("Ana", "Jefatura");
    await ir(ordenTecnica);
    await accion("aprobar-movimiento");
    await completar({ motivo: "Horario y responsable confirmados" });
    await login("Marta", "Almacén");
    await ir(ordenTecnica);
    await accion("iniciar-mantenimiento");
    await comprobar(contenido("En ejecución"), "La orden técnica registra su inicio");
    await ir("activos/resumen");
    await comprobar("Array.from(document.querySelectorAll('.indicador')).some(e=>e.textContent.includes('Activos críticos disponibles') && e.querySelector('strong').textContent==='0 / 1')", "El activo crítico en mantenimiento queda fuera del indicador de disponibilidad");
    await ir(ordenTecnica);
    await accion("completar-mantenimiento");
    await completar({ motivo: "Mantenimiento interno completado" });
    await comprobar(contenido("Completada"), "Almacén registra el fin del mantenimiento");
    await login("Ana", "Jefatura", "olivos");
    await ir(`activos/activos/${activo}`);
    await comprobar(contenido("Registro no encontrado en esta sede"), "Sede distinta no accede a la ficha");
    await login("Ana", "Jefatura");
    await enviar("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    for (const ruta of ["resumen", "activos", `activos/${activo}`, "depreciacion", "conciliaciones"]) {
      await ir("activos/" + ruta);
      await comprobar("document.documentElement.scrollWidth <= innerWidth", "Móvil sin desbordamiento: " + ruta);
    }
    await foto("02-movil-conciliacion");
    await enviar("Page.reload");
    await esperar(contenido("Auxiliar y diario patrimonial"));
    await comprobar(contenido("119,000"), "Recarga conserva el valor en libros conciliable");
    if (pagina.errores.length) throw Error(pagina.errores.join("\n"));
    const resultado = { comprobaciones: comprobaciones.length, superadas: comprobaciones, excepcionesJavaScript: pagina.errores.length, paginasPdf, carpeta };
    fs.writeFileSync(path.join(carpeta, "resultado.json"), JSON.stringify(resultado, null, 2));
    console.log(JSON.stringify(resultado));
  } finally { pagina?.cerrar(); await browser.enviar("Target.disposeBrowserContext", { browserContextId }); browser.cerrar(); }
}
ejecutar().catch(e => { console.error(e); process.exit(1); });
