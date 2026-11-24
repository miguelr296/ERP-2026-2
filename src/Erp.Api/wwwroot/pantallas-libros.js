"use strict";

window.PantallasLibros = c => {
  const L = window.Libros;
  const e = c.esc;
  const actor = () => c.sesion;
  const puede = roles => window.Permisos.tieneRol(actor(), roles);
  const enlace = (ruta, titulo, primario = false) => `<a class="${primario ? "boton primario" : "enlace-boton"}" href="#${e(ruta)}">${e(titulo)}</a>`;
  const boton = (titulo, comando, id = "", primario = false) => `<button type="button" class="boton ${primario ? "primario" : ""}" data-libro="${e(comando)}" data-id="${e(id)}">${e(titulo)}</button>`;
  const campo = (titulo, control, oculto = false) => `<div${oculto ? " hidden" : ""}><label for="lib-${e(control.nombre)}">${e(titulo)}</label>${control.html}</div>`;
  const input = (nombre, tipo = "text", valor = "", atributos = "required maxlength=\"300\"") => ({
    nombre, html: `<input id="lib-${e(nombre)}" name="${e(nombre)}" type="${e(tipo)}" value="${e(valor)}" ${atributos}>`
  });
  const opciones = (nombre, pares, seleccionado = pares.length === 1 ? pares[0][0] : "") => ({
    nombre, html: `<select id="lib-${e(nombre)}" name="${e(nombre)}" required><option value="">Selecciona…</option>${pares.map(([valor, texto]) =>
      `<option value="${e(valor)}" ${valor === seleccionado ? "selected" : ""}>${e(texto)}</option>`).join("")}</select>`
  });
  const fecha = (nombre = "fecha", valor = L.hoy()) => input(nombre, "date", valor, "required");
  const monto = (nombre = "importe", valor = "") => input(nombre, "number", valor, 'required min="0" step="0.01" inputmode="decimal"');
  const soles = (valor) => {
    const coincidencia = /^(\d+)(?:\.(\d{1,2}))?$/.exec(valor);
    L.exigir(coincidencia, "Ingresa un importe en soles con hasta dos decimales.");
    const importe = Number(coincidencia[1]) * 100 + Number((coincidencia[2] || "").padEnd(2, "0"));
    L.exigir(L.entero(importe), "El importe es demasiado grande.");
    return importe;
  };
  const detalle = pares => `<dl class="detalle-documento">${pares.map(([label, valor]) => `<div><dt>${e(label)}</dt><dd>${valor}</dd></div>`).join("")}</dl>`;
  const panel = contenido => `<article class="tarjeta ficha-libros">${contenido}</article>`;
  const botones = html => `<div class="acciones-documento">${html}</div>`;
  const cabecera = c.cabeceraVista;
  const tabla = (titulo, columnas, filas, buscar = false) => c.tabla(titulo, columnas, filas.map(celdas => `<tr>${celdas.map(v => `<td>${v}</td>`).join("")}</tr>`), buscar);
  const asiento = (d, clave) => {
    const a = d.asientos.find(x => x.origen.clave === clave && x.sede === actor().sede);
    return a ? enlace("contabilidad/asientos/" + a.id, a.numero) : "—";
  };
  const plegar = (titulo, contenido) => `<details class="recorrido-detalles libros-bloque"><summary>${e(titulo)}</summary>${contenido}</details>`;
  const siguiente = (titulo, detalle, control = "") => c.recorrido.siguiente({ titulo, detalle, boton: control });
  const ejecutar = comando => L.ejecutar(actor(), comando);
  const formulario = (titulo, campos, guardar, etiqueta, ayuda = "") => c.formulario(titulo,
    (ayuda ? `<p class="libros-form-ayuda texto-suave">${e(ayuda)}</p>` : "") + `<div class="campos">${campos.join("")}</div>`, guardar, etiqueta);

  const ui = { c, L, e, actor, puede, enlace, boton, campo, input, opciones, fecha, monto, soles, detalle, panel, botones, cabecera, tabla, asiento, plegar, siguiente, ejecutar, formulario };
  const modulos = {
    facturacion: window.PantallasFacturacion(ui),
    finanzas: window.PantallasFinanzas(ui),
    contabilidad: window.PantallasContabilidad(ui)
  };

  function dibujar(modulo, partes) {
    const actual = modulos[modulo.id];
    const navegacion = c.$("#navegacion");
    const contenido = c.$("#contenido");
    document.title = modulo.nombre + " · FAMIHOGAR";
    c.$("#accesos-rapidos").hidden = true;
    navegacion.setAttribute("aria-label", "Secciones de " + modulo.nombre);
    if (!puede(actual.roles)) {
      navegacion.innerHTML = "";
      contenido.innerHTML = cabecera(modulo.nombre, "Disponible para " + actual.roles.join(" y ") + ".") + enlace("aplicaciones", "Volver a aplicaciones");
      return;
    }
    const vista = Object.hasOwn(actual.secciones, partes[1]) ? partes[1] : Object.keys(actual.secciones)[0];
    navegacion.innerHTML = Object.entries(actual.secciones).map(([clave, titulo]) => `<a class="boton" href="#${modulo.id}/${clave}" ${clave === vista ? 'aria-current="page"' : ""}>${titulo}</a>`).join("");
    try {
      contenido.innerHTML = actual.vista(vista, partes[2], L.leer());
    } catch (error) {
      contenido.innerHTML = cabecera(modulo.nombre) + `<p class="tarjeta vacio error">${e(error.message)}</p>`;
    }
  }

  document.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-libro]");
    if (!boton || !actor()) return;
    const actual = modulos[location.hash.slice(1).split("/")[0]];
    if (!actual || !puede(actual.roles)) return;
    try { actual.accion(boton.dataset.libro, boton.dataset.id, L.leer()); }
    catch (error) { c.aviso(error.message); }
  });

  document.addEventListener("change", evento => {
    const control = evento.target;
    if (control.id === "lib-periodo-vista" && control.value === "otro") {
      const otro = c.$("#lib-periodo-manual");
      otro.closest("div").hidden = false;
      otro.focus();
    } else if (["lib-periodo-vista", "lib-periodo-manual"].includes(control.id) && L.mesValido(control.value)) {
      c.navegar("contabilidad/cierre/" + control.value);
    }
  });

  return { dibujar };
};
