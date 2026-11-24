"use strict";

window.AyudaERP = (() => {
  const guias = window.GuiasERP;
  const dialogo = document.querySelector("#ayuda");
  const titulo = dialogo.querySelector("#titulo-ayuda");
  const pasos = dialogo.querySelector("#pasos-ayuda");
  const siguiente = dialogo.querySelector("#siguiente-ayuda");
  const cerrar = () => { if (dialogo.open) dialogo.close(); };
  const atajos = {
    "nuevo-cliente": "comercial/clientes",
    "nueva-oportunidad": "comercial/oportunidades",
    "nueva-cotizacion": "comercial/cotizaciones"
  };
  let origen = null;

  function adjuntar(elemento, clave, clase = "", nombre = elemento?.textContent.trim()) {
    if (!elemento || !Object.hasOwn(guias, clave) || elemento.parentElement?.classList.contains("opcion-con-ayuda")) return;
    const grupo = document.createElement("div");
    grupo.className = "opcion-con-ayuda " + clase;
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-ayuda";
    boton.dataset.guia = clave;
    const tema = nombre.replace(/^\+\s*/, "");
    boton.dataset.tema = tema;
    boton.setAttribute("aria-label", "Ayuda sobre " + tema);
    boton.setAttribute("aria-haspopup", "dialog");
    boton.setAttribute("aria-controls", dialogo.id);
    boton.title = "Guía paso a paso";
    boton.textContent = "?";
    elemento.before(grupo);
    grupo.append(elemento, boton);
  }

  function aplicaciones() {
    adjuntar(document.querySelector("#titulo-aplicaciones"), "aplicaciones", "titulo-con-ayuda");
    for (const tarjeta of document.querySelectorAll("#modulos [data-modulo]")) {
      adjuntar(tarjeta, tarjeta.dataset.modulo, "modulo-con-ayuda", tarjeta.querySelector("strong").textContent);
    }
  }

  function claveVista(modulo, seccion) {
    const logistica = ["logistica", "compras", "despachos"].includes(modulo);
    const ruta = (logistica ? "logistica" : modulo) + "/" + seccion;
    return Object.hasOwn(guias, ruta) ? ruta : modulo;
  }

  function guiaAccion(boton, clave) {
    const accion = boton.dataset.libro || boton.dataset.logAccion || boton.dataset.accion;
    const guia = "accion/" + accion;
    if (Object.hasOwn(guias, guia)) return guia;
    if (Object.hasOwn(atajos, accion)) return atajos[accion];
    return boton.classList.contains("primario") ? clave : null;
  }

  function vista(modulo, seccion) {
    const subopcion = document.querySelector(".log-submenu [aria-current=page]");
    const enlaceActivo = document.querySelector("#navegacion a[aria-current=page]");
    const seleccion = subopcion?.dataset.logVista || enlaceActivo?.getAttribute("href").split("/")[1];
    const clave = claveVista(modulo, seleccion || seccion);
    for (const opcion of document.querySelectorAll("#navegacion [data-vista], #navegacion [data-log-vista], #navegacion a, .log-submenu [data-log-vista]")) {
      const { vista, logVista, logGrupo } = opcion.dataset;
      const destino = vista || logVista || opcion.getAttribute("href")?.split("/")[1];
      const grupo = "logistica/grupo/" + logGrupo;
      const guia = opcion.dataset.ayudaSeccion || (Object.hasOwn(guias, grupo) ? grupo : claveVista(modulo, destino));
      adjuntar(opcion, guia, "menu-con-ayuda");
    }
    adjuntar(document.querySelector("#contenido h1"), clave, "titulo-con-ayuda");
    for (const boton of document.querySelectorAll("#contenido :is(.encabezado-vista, .acciones-documento, .recorrido-accion) button, #contenido [data-libro=conciliar], #accesos-rapidos [data-accion]")) {
      const guia = guiaAccion(boton, clave);
      if (guia) adjuntar(boton, guia);
    }
  }

  document.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-guia]");
    if (!boton || dialogo.open) return;
    const instrucciones = guias[boton.dataset.guia];
    if (!instrucciones) return;
    origen = boton;
    titulo.textContent = "Ayuda · " + boton.dataset.tema;
    pasos.replaceChildren(...instrucciones.slice(0, -1).map(texto => {
      const paso = document.createElement("li");
      paso.textContent = texto;
      return paso;
    }));
    siguiente.textContent = instrucciones.at(-1);
    dialogo.showModal();
    titulo.focus();
  });

  dialogo.addEventListener("close", () => {
    if (dialogo.open) return;
    if (origen?.isConnected && !origen.closest("[hidden]")) origen.focus();
    origen = null;
  });

  adjuntar(document.querySelector("#titulo-acceso"), "acceso", "titulo-con-ayuda");
  return { aplicaciones, vista, cerrar };
})();
