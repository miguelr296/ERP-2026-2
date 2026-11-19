
"use strict";

window.TesoreriaAplicacion = (() => {
  const CLAVE = "famihogar.tesoreria.v1";
  const R = window.TesoreriaReglas;

  function leer() {
    const guardado = localStorage.getItem(CLAVE);
    return R.inicializar(guardado === null ? null : JSON.parse(guardado));
  }

  function guardar(comando) {
    const ejecutar = () => {
      const datos = leer();
      const resultado = comando(datos);
      try { localStorage.setItem(CLAVE, JSON.stringify(datos)); }
      catch { throw new Error("No se pudo guardar en este navegador."); }
      return resultado;
    };
    return navigator.locks ? navigator.locks.request(CLAVE, ejecutar) : ejecutar();
  }

  return { CLAVE, leer, guardar };
})();
