"use strict";

const formulario = document.querySelector("#formulario-calculo");
const estado = document.querySelector("#estado-calculo");
const resultado = document.querySelector("#resultado");
const boton = document.querySelector("#calcular");
const guardar = document.querySelector("#guardar");
let calculando = false;
let contextoCalculo = null;
const referenciasEnMemoria = new Map();

function bloquear(bloqueado) {
  calculando = bloqueado;
  for (const elemento of formulario.elements) elemento.disabled = bloqueado;
  guardar.disabled = bloqueado;
}

function cabecerasDemo() {
  let sesion = null;
  try { sesion = JSON.parse(sessionStorage.getItem("famihogar.sesion")); } catch { /* Sin sesión guardada. */ }
  if (!sesion) throw new Error("Ingresa primero con un rol de demostración desde Aplicaciones.");
  return {
    "Content-Type": "application/json",
    "X-Usuario": sesion.nombre,
    "X-Rol": sesion.rol === "Tesorería" ? "Tesoreria" : sesion.rol
  };
}

function mostrar(vista) {
  const dinero = valor => new Intl.NumberFormat("es-PE", {
    style: "currency", currency: vista.moneda
  }).format(valor);
  document.querySelector("#origen").textContent =
    `Cliente: ${vista.clienteNombre} · Canal: ${vista.canal} · Lista: ${vista.listaPrecio}`;
  document.querySelector("#condiciones").textContent =
    `Calculado: ${vista.fechaCalculo} · Vigencia propuesta hasta: ${vista.vigenteHasta} · Plazo de entrega de demo: ${vista.plazoEntregaDias} días · Precios ${vista.preciosIncluyenIgv ? "con" : "sin"} IGV`;
  const filas = vista.calculo.lineas.map(linea => {
    const fila = document.createElement("tr");
    for (const valor of [linea.codigo, linea.nombre, linea.cantidad, dinero(linea.precioUnitario), dinero(linea.importe)]) {
      const celda = document.createElement("td");
      celda.textContent = valor;
      fila.append(celda);
    }
    return fila;
  });
  document.querySelector("#lineas").replaceChildren(...filas);
  document.querySelector("#totales").textContent =
    `Subtotal: ${dinero(vista.calculo.subtotal)} · IGV (${vista.tasaIgv * 100}%): ${dinero(vista.calculo.igv)} · Total: ${dinero(vista.calculo.total)}`;
  document.querySelector("#ver-oportunidad").href = `/api/oportunidades/${encodeURIComponent(vista.oportunidadId)}`;
  resultado.hidden = false;
  document.querySelector("#titulo-resultado").focus();
}

formulario.addEventListener("input", () => {
  contextoCalculo = null;
  resultado.hidden = true;
  guardar.hidden = true;
  estado.textContent = "";
  history.replaceState(null, "", location.pathname);
});
formulario.addEventListener("submit", async evento => {
  evento.preventDefault();
  if (calculando || !formulario.reportValidity()) return;
  bloquear(true);
  contextoCalculo = null;
  guardar.hidden = true;
  document.querySelector("#ficha-guardada").hidden = true;
  document.querySelector("#titulo-resultado").textContent = "Resultado del cálculo";
  resultado.hidden = true;
  estado.textContent = "Consultando oportunidad y lista vigente…";
  try {
    const id = document.querySelector("#oportunidad").value.trim();
    const respuesta = await fetch(`/api/oportunidades/${encodeURIComponent(id)}/calculo-cotizacion`, {
      method: "POST",
      headers: cabecerasDemo(),
      body: JSON.stringify({ tipoCliente: document.querySelector("#tipo-cliente").value })
    });
    if (!respuesta.ok) {
      if (respuesta.status === 404) throw new Error("No se encontró la oportunidad indicada.");
      const error = await respuesta.json().catch(() => null);
      throw new Error(error?.detail || "No se pudo calcular. Revisa los datos e inténtalo nuevamente.");
    }
    const vista = await respuesta.json();
    mostrar(vista);
    contextoCalculo = { id: vista.oportunidadId, tipo: vista.tipoCliente };
    guardar.hidden = false;
    estado.textContent = "Cálculo completado. Este borrador no se ha guardado.";
  } catch (error) {
    estado.textContent = error.message || "No se pudo conectar con la API.";
  } finally {
    bloquear(false);
  }
});

function solicitudPara(contexto, nueva = false) {
  const clave = `famihogar.cotizacion.${contexto.id}.${contexto.tipo}`;
  let referencia = referenciasEnMemoria.get(clave);
  try { referencia = sessionStorage.getItem(clave) || referencia; } catch { /* Memoria de esta página. */ }
  if (nueva || !referencia) referencia = crypto.randomUUID();
  referenciasEnMemoria.set(clave, referencia);
  try { sessionStorage.setItem(clave, referencia); } catch { /* Conserva la referencia para reintentar. */ }
  return referencia;
}

async function consultarFicha(id) {
  const respuesta = await fetch(`/api/cotizaciones/${encodeURIComponent(id)}`);
  if (!respuesta.ok) throw new Error("No se pudo recuperar la ficha guardada. Conserva su enlace para volver a consultar.");
  const ficha = await respuesta.json();
  document.querySelector("#oportunidad").value = ficha.oportunidadId;
  document.querySelector("#tipo-cliente").value = ficha.tipoCliente;
  mostrar({
    ...ficha, clienteNombre: ficha.origen.clienteNombre, canal: ficha.origen.canal,
    fechaCalculo: ficha.emitidaEn,
    calculo: { lineas: ficha.lineas, subtotal: ficha.subtotal, igv: ficha.igv, total: ficha.total }
  });
  document.querySelector("#titulo-resultado").textContent = `Cotización ${ficha.correlativo}`;
  document.querySelector("#identificacion-ficha").textContent =
    `Estado: ${ficha.estado} · Documento: ${ficha.id} · Oportunidad: ${ficha.oportunidadId}`;
  document.querySelector("#responsables-ficha").textContent =
    `Sede: ${ficha.origen.sede} · Vendedor: ${ficha.origen.responsable} · Registrado por: ${ficha.creadoPor} (${ficha.rol})`;
  const eventos = ficha.historial.map(evento => {
    const item = document.createElement("li");
    item.textContent = `${evento.ocurridoEn} · ${evento.accion} · ${evento.usuario} (${evento.rol}) · ${evento.estadoNuevo}`;
    return item;
  });
  document.querySelector("#historial-ficha").replaceChildren(...eventos);
  const enlace = new URL(location.href);
  enlace.search = new URLSearchParams({ cotizacion: ficha.id }).toString();
  document.querySelector("#enlace-ficha").href = enlace.href;
  document.querySelector("#enlace-cliente").href = `/api/clientes/${encodeURIComponent(ficha.clienteId)}`;
  history.replaceState(null, "", enlace.href);
  document.querySelector("#ficha-guardada").hidden = false;
  guardar.hidden = true;
  contextoCalculo = { id: ficha.oportunidadId, tipo: ficha.tipoCliente };
  estado.textContent = "Ficha consultada del documento guardado.";
}

guardar.addEventListener("click", async () => {
  if (calculando || !contextoCalculo) return;
  bloquear(true);
  estado.textContent = "Validando lista y guardando cotización…";
  try {
    const respuesta = await fetch(`/api/oportunidades/${encodeURIComponent(contextoCalculo.id)}/cotizaciones`, {
      method: "POST", headers: cabecerasDemo(),
      body: JSON.stringify({ solicitudId: solicitudPara(contextoCalculo), tipoCliente: contextoCalculo.tipo })
    });
    if (!respuesta.ok) {
      const error = await respuesta.json().catch(() => null);
      throw new Error(error?.detail || "No se pudo guardar. Puedes reintentar con la misma referencia.");
    }
    const guardada = await respuesta.json();
    // La ficha se obtiene por GET; no se presenta el formulario como si estuviera persistido.
    await consultarFicha(guardada.id);
  } catch (error) {
    estado.textContent = error.message || "No se pudo confirmar el guardado; reintenta sin cambiar los datos.";
  } finally { bloquear(false); }
});

document.querySelector("#imprimir").addEventListener("click", () => window.print());
document.querySelector("#otra-cotizacion").addEventListener("click", () => {
  if (calculando || !contextoCalculo) return;
  solicitudPara(contextoCalculo, true);
  document.querySelector("#oportunidad").value = contextoCalculo.id;
  document.querySelector("#tipo-cliente").value = contextoCalculo.tipo;
  document.querySelector("#ficha-guardada").hidden = true;
  resultado.hidden = true;
  contextoCalculo = null;
  history.replaceState(null, "", location.pathname);
  estado.textContent = "Calcula nuevamente para preparar otra cotización.";
});

const idGuardado = new URLSearchParams(location.search).get("cotizacion");
if (idGuardado) {
  bloquear(true);
  consultarFicha(idGuardado).catch(error => { estado.textContent = error.message; }).finally(() => bloquear(false));
}
