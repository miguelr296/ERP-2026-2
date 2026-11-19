"use strict";

window.ActivosAplicacion = (() => {
  const CLAVE = "famihogar.activos.v1", R = window.ActivosReglas, L = window.LogisticaReglas;
  const proveedores = () => window.ContratosLogisticos.listarProveedoresAprobados();

  function leer() {
    const guardado = localStorage.getItem(CLAVE);
    return R.inicializar(guardado === null ? null : JSON.parse(guardado));
  }

  function ejecutar(actor, comando) {
    R.permitir(actor, R.roles);
    const datos = leer();
    const resultado = comando(datos);
    const referencias = new Set();
    for (const a of datos.asientos) {
      const clave = `${a.referenciaId}|${a.tipo}`;
      const ladoValido = l => [l.debe, l.haber].every(n => Number.isSafeInteger(n) && n >= 0) && !!l.debe !== !!l.haber;
      L.exigir(!referencias.has(clave) && a.lineas.length >= 2 && a.lineas.every(ladoValido) && a.lineas.reduce((n, l) => n + l.debe - l.haber, 0) === 0, "La operación generaría un asiento duplicado o descuadrado.");
      referencias.add(clave);
    }
    datos.revision++;
    try { localStorage.setItem(CLAVE, JSON.stringify(datos)); }
    catch { throw new Error("No se pudo guardar Activos Fijos. No se registró la operación."); }
    return L.copiar(resultado);
  }

  return { CLAVE, leer, ejecutar, proveedores };
})();

window.ContratosActivos = {
  listarAsientos(sede) {
    return window.ActivosAplicacion.leer().asientos.filter(a => a.sede === sede);
  },
  listarObligaciones(sede) {
    return window.ActivosReglas.obligaciones(window.ActivosAplicacion.leer(), sede);
  }
};
