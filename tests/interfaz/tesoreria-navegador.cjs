
// Ejecutar con el servidor estático del README y un Chrome headless temporal.
const assert = require("node:assert/strict");

const puerto = Number(process.argv[2] || 9245);
const origen = process.env.FAMIHOGAR_URL || "http://localhost:5300/";
const consultarChrome = ruta => fetch(`http://127.0.0.1:${puerto}/json/${ruta}`).then(r => r.json());

async function conectar(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  const solicitudes = new Map(), errores = [];
  let id = 0;
  ws.addEventListener("message", evento => {
    const mensaje = JSON.parse(evento.data);
    if (mensaje.method === "Runtime.exceptionThrown") errores.push(mensaje.params.exceptionDetails.text);
    if (!solicitudes.has(mensaje.id)) return;
    const { resolve, reject } = solicitudes.get(mensaje.id);
    solicitudes.delete(mensaje.id);
    if (mensaje.error) reject(Error(mensaje.error.message));
    else resolve(mensaje.result);
  });
  const enviar = (method, params = {}) => new Promise((resolve, reject) => {
    solicitudes.set(++id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  return { enviar, errores, cerrar: () => ws.close() };
}

async function main() {
  const { webSocketDebuggerUrl, "User-Agent": agente } = await consultarChrome("version");
  assert.match(agente, /HeadlessChrome/);
  const navegador = await conectar(webSocketDebuggerUrl);
  const { browserContextId } = await navegador.enviar("Target.createBrowserContext");
  let pagina;
  try {
    const { targetId } = await navegador.enviar("Target.createTarget", { url: "about:blank", browserContextId });
    pagina = await conectar((await consultarChrome("list")).find(t => t.id === targetId).webSocketDebuggerUrl);
    const evaluar = async expression => {
      const r = await pagina.enviar("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    };
    const esperar = async expression => {
      for (let intentos = 0; intentos < 100; intentos++) {
        if (await evaluar(expression)) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw Error(`Tiempo agotado: ${expression}`);
    };
    const elemento = s => `document.querySelector(${JSON.stringify(s)})`;
    const clic = s => evaluar(`${elemento(s)}.click()`);
    const llenar = campos => evaluar(`for (const [selector, valor] of ${JSON.stringify(Object.entries(campos))}) {
      const campo = document.querySelector(selector);
      campo.value = valor;
      campo.dispatchEvent(new Event('change', { bubbles: true }));
    }`);
    const datos = expr => evaluar(`(() => { const d = window.TesoreriaAplicacion.leer(); return ${expr}; })()`);
    const titulo = texto => esperar(`document.querySelector('#contenido h1')?.textContent === ${JSON.stringify(texto)}`);
    const ir = async (vista, texto) => {
      await clic(`[data-tes-vista=${vista}]`);
      await titulo(texto);
    };
    const login = async (nombre, rol, sede = "centro") => {
      if (await evaluar("!document.querySelector('#sistema').hidden")) await clic("#salir");
      await llenar({ "#nombre": nombre, "#rol": rol, "#sede-acceso": sede });
      await evaluar("document.querySelector('#formulario-acceso').requestSubmit()");
      await esperar("!document.querySelector('#aplicaciones').hidden");
      await clic("[data-modulo=finanzas]");
      await titulo(rol === "Asesor" ? "Finanzas" : "Tesorería");
    };
    const registra = async (tipo, campos = {}, error) => {
      await clic(`[data-tes-accion=${tipo}]`);
      await llenar(Object.fromEntries(Object.entries(campos).map(([k, v]) => [`#tes-${k}`, v])));
      await evaluar("document.querySelector('#formulario-registro').requestSubmit()");
      if (error) {
        await esperar(`document.querySelector('#error-formulario')?.textContent.includes(${JSON.stringify(error)})`);
        await clic("#cerrar-modal");
      } else {
        await esperar("!document.querySelector('#modal').open");
        await evaluar("new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))");
      }
    };
    const abrir = async (vista, id, texto) => {
      await clic(`#contenido a[href="#finanzas/${vista}/${id}"]`);
      await titulo(texto);
    };
    await pagina.enviar("Runtime.enable");
    await pagina.enviar("Page.enable");
    await pagina.enviar("Page.navigate", { url: origen });
    await esperar("document.querySelector('#sede-acceso')?.options.length === 3");

    await login("Ana", "Jefatura");
    await ir("cuentas", "Caja y bancos");
    await registra("cuenta", { tipo: "Banco", nombre: "Banco Centro", banco: "Banco de prueba",
      identificador: "S-1234", apertura: "80000" });
    await titulo("Banco Centro");
    const cuentaId = await datos("d.cuentas[0].id");

    await login("Carla", "Tesorería");
    assert(await evaluar(`!!${elemento('a[href="#finanzas/activos"]')}`));
    await ir("cobrar", "Cuentas por cobrar");
    await registra("partida", { tercero: "Cliente A", documento: "FV-45", importe: "45000" });
    await titulo("FV-45");
    await registra("cobro", { cuentaId, referencia: "POS-45", importe: "30000" });
    assert.equal(await datos("d.movimientos[0].importe"), 3000000);

    await ir("pagar", "Cuentas por pagar");
    await registra("partida", { tercero: "Proveedor A", documento: "FC-70", importe: "70000" });
    await titulo("FC-70");
    await registra("preparar", { cuentaId, beneficiario: "S-9876" });
    const pago = await datos("d.pagos[0]");
    await titulo(pago.numero);
    assert.equal(pago.estado, "Preparado");
    await ir("resumen", "Tesorería");
    assert.deepEqual(await evaluar("[...document.querySelectorAll('.indicador strong')].slice(0,2).map(n=>n.textContent.replace(/[^0-9]/g,''))"),
      ["11000000", "5500000"]);

    await login("Carla", "Jefatura");
    await ir("pagos", "Pagos programados");
    await abrir("pagos", pago.id, pago.numero);
    await registra("aprobar", { motivo: "Cuenta destino verificada" }, "Otra persona");
    await login("Ana", "Jefatura");
    await ir("pagos", "Pagos programados");
    await abrir("pagos", pago.id, pago.numero);
    await registra("aprobar", { motivo: "Cuenta destino verificada" });
    assert.equal(await datos("d.pagos[0].estado"), "Aprobado");

    await login("Carla", "Tesorería");
    await ir("pagos", "Pagos programados");
    await abrir("pagos", pago.id, pago.numero);
    await registra("enviar", { referencia: "ENV-70" });
    assert.equal(await datos("d.movimientos.length"), 1);
    await registra("confirmar", { referencia: "BAN-70" });
    assert.equal(await datos("d.pagos[0].estado"), "Confirmado");

    await ir("conciliacion", "Conciliación bancaria");
    async function subirExtracto(csv, resultado, error = false) {
      await clic("[data-tes-accion=importar-extracto]");
      await llenar({ "#tes-cuentaId": cuentaId });
      await evaluar(`(() => {
        const contenido = ${JSON.stringify(csv)};
        const datos = new DataTransfer();
        datos.items.add(new File([contenido], "banco-demo.csv", { type: "text/csv" }));
        document.querySelector("#tes-archivo").files = datos.files;
        document.querySelector("#formulario-registro").requestSubmit();
      })()`);
      const selector = error ? "#error-formulario" : "#estado";
      await esperar(`${elemento(selector)}?.textContent.includes(${JSON.stringify(resultado)})`);
      if (error) await clic("#cerrar-modal");
    }
    const fechaBanco = await datos("d.movimientos.at(-1).fecha");
    const csv = `fecha,referencia,tipo,importe\n${fechaBanco},BAN-70,Salida,70000.00`;
    await subirExtracto(csv + "\n2030-02-30,INVALIDO,Entrada,20", "Fila 3", true);
    assert.equal(await datos("d.extractos.length"), 0);
    await subirExtracto(csv, "Líneas incorporadas: 1. Duplicadas omitidas: 0.");
    const lineaId = await datos("d.extractos[0].id");
    await subirExtracto(csv, "Líneas incorporadas: 0. Duplicadas omitidas: 1.");
    await abrir("conciliacion", lineaId, "BAN-70");
    await registra("exacta");
    assert.equal(await datos("d.extractos[0].movimientoId === d.pagos[0].movimientoId"), true);
    await ir("conciliacion", "Conciliación bancaria");
    await registra("saldo-banco", { cuentaId, referencia: "CORTE-1", importe: "10000" });
    assert(await evaluar("document.querySelectorAll('#contenido table')[1].textContent.includes('CORTE-1')"));

    await pagina.enviar("Page.reload");
    await titulo("Conciliación bancaria");
    assert.equal(await datos("d.extractos.length"), 1);
    await pagina.enviar("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    assert(await evaluar("document.documentElement.scrollWidth <= innerWidth"));
    await login("Elena", "Contabilidad");
    await ir("conciliacion", "Conciliación bancaria");
    await abrir("conciliacion/corte", await datos("d.saldosBanco[0].id"), "CORTE-1");
    await registra("cerrar-corte", { motivo: "Saldo y cobros en tránsito revisados" });
    assert.equal(await datos("d.saldosBanco[0].cierre.diferencia"), 0);
    assert(await evaluar("document.querySelector('#contenido').textContent.includes('Cerrado')"));
    await ir("pagar", "Cuentas por pagar");
    assert.equal(await evaluar("document.querySelector('[data-tes-accion=partida]')"), null);

    await login("Carla", "Tesorería", "surco");
    await ir("cuentas", "Caja y bancos");
    assert(!await evaluar("document.querySelector('#contenido tbody').textContent.includes('Banco Centro')"));
    await login("Luis", "Asesor");
    assert.equal(await evaluar("document.querySelector('[data-tes-vista]')"), null);
    assert.deepEqual(pagina.errores, []);
    console.log("Tesorería: circuito de navegador completo, roles, sedes, recarga y móvil sin excepciones.");
  } finally {
    try { await navegador.enviar("Target.disposeBrowserContext", { browserContextId }); }
    finally { pagina?.cerrar(); navegador.cerrar(); }
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
