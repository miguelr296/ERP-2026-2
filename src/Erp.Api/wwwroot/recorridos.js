"use strict";

window.RecorridosERP = escapar => {
  function etapas(titulo, opciones, actual = "") {
    return `<nav class="recorrido" aria-label="${escapar(titulo)} sugerido"><h2>${escapar(titulo)} sugerido</h2><ol>${opciones.map(({ id, etiqueta, ruta, responsable }, indice) => {
      const activa = actual === id ? 'aria-current="step"' : "";
      const contenido = `<span class="recorrido-numero" aria-hidden="true">${indice + 1}</span>${escapar(etiqueta)}`;
      const etapa = ruta ? `<a class="recorrido-etapa" href="#${escapar(ruta)}" ${activa}>${contenido}</a>`
        : `<span class="recorrido-etapa recorrido-etapa-informativa" ${activa}>${contenido}${responsable ? `<small>${escapar(responsable)}</small>` : ""}</span>`;
      return `<li>${etapa}</li>`;
    }).join("")}</ol></nav>`;
  }

  function siguiente({ titulo, detalle, boton = "" } = {}) {
    if (!titulo) return "";
    return `<section class="recorrido-siguiente" aria-label="Paso sugerido"><div><small>Paso sugerido</small><h2>${escapar(titulo)}</h2><p>${escapar(detalle)}</p></div>${boton ? '<div class="recorrido-accion">' + boton + '</div>' : ""}</section>`;
  }

  return { etapas, siguiente };
};
