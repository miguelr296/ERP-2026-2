"use strict";

window.LogisticaAplicacion = (() => {
  const CLAVE = "famihogar.logistica.v1";
  const config = window.FAMIHOGAR_LOGISTICA, L = window.LogisticaReglas;
  const productos = () => window.ContratosComerciales?.listarProductos() || [];
  const pedidos = sede => window.ContratosComerciales?.listarPedidos(sede) || [];
  const devoluciones = sede => window.ContratosComerciales?.listarDevoluciones(sede) || [];

  function leer() {
    const guardado = localStorage.getItem(CLAVE);
    return L.inicializar(config, productos(), guardado ? JSON.parse(guardado) : null);
  }

  // Un comando trabaja sobre una copia nueva y publica todos sus cambios en una escritura.
  // Si falla cualquier validación o localStorage, no persiste ningún movimiento parcial.
  function ejecutar(actor, comando) {
    L.exigir(actor && ["Asesor", "Jefatura", "Compras", "Almacén", "Transporte"].includes(actor.rol), "Tu rol no registra operaciones logísticas.");
    const datos = leer();
    const resultado = comando(datos, { config, productos: productos(), pedidos: pedidos(actor.sede), devoluciones: devoluciones(actor.sede) });
    comprobarSaldos(datos);
    datos.revision++;
    try { localStorage.setItem(CLAVE, JSON.stringify(datos)); }
    catch { throw new Error("No se pudo guardar Logística en este navegador. No se registró la operación."); }
    return L.copiar(resultado);
  }

  function comprobarSaldos(datos) {
    const posiciones = new Map();
    for (const m of datos.movimientos) {
      const clave = [m.almacen, m.codigo, m.ubicacion, m.calidad, m.lote].join("|");
      posiciones.set(clave, { almacen: m.almacen, codigo: m.codigo, ubicacion: m.ubicacion, calidad: m.calidad, lote: m.lote });
    }
    for (const p of posiciones.values()) {
      L.exigir(L.saldo(datos, p.almacen, p.codigo, p.ubicacion, p.calidad, p.lote) >= 0, "La operación dejaría una posición negativa.");
      if (p.calidad === "Disponible") L.exigir(L.disponible(datos, p.almacen, p.codigo, p.ubicacion, p.lote) >= 0, "La operación afectaría existencias ya reservadas.");
    }
  }

  return { CLAVE, config, productos, pedidos, devoluciones, leer, ejecutar, comprobarSaldos };
})();

// Comercial usa estas consultas públicas; no lee el almacenamiento de Logística.
window.ContratosLogisticos = {
  consultarDisponibilidad(pedido) {
    const A = window.LogisticaAplicacion, datos = A.leer(), L = window.LogisticaReglas;
    const almacenes = datos.almacenes.filter(a => a.sede === pedido.sede);
    return { origen: "Logística · existencias y reservas", consultadoEn: new Date().toISOString(), lineas: pedido.lineas.map(l => ({ codigo: l.codigo, disponible: almacenes.reduce((n, a) => n + L.disponible(datos, a.id, l.codigo, null, null, pedido.id), 0) })) };
  },
  consultarSeguimiento(pedidoId) {
    const datos = window.LogisticaAplicacion.leer();
    const relacionados = datos.despachos.filter(d => d.pedidoId === pedidoId);
    return {
      origen: "Logística · entregas confirmadas", consultadoEn: new Date().toISOString(),
      salidas: relacionados.map(d => ({ id: d.id, numero: d.numero, estado: d.estado })),
      entregas: relacionados.filter(d => ["Entregado", "Entrega parcial"].includes(d.estado)).map(d => ({ id: d.id, numero: d.numero, fecha: d.entregadoEn, receptor: d.receptor, evidencia: d.evidencia, lineas: [...new Set(d.lineas.map(l => l.codigo))].map(codigo => ({ codigo, cantidad: d.lineas.filter(l => l.codigo === codigo).reduce((n, l) => n + l.entregada, 0) })).filter(l => l.cantidad > 0) }))
    };
  },
  consultarRecepcionDevolucion(solicitudId) {
    const A = window.LogisticaAplicacion, datos = A.leer();
    const recepciones = datos.retornos.filter(r => r.solicitudId === solicitudId && r.comercial);
    const solicitud = window.ContratosComerciales?.listarDevoluciones().find(s => s.id === solicitudId);
    const completa = solicitud && solicitud.lineas.every(l => recepciones.flatMap(r => r.lineas).filter(r => r.codigo === l.codigo).reduce((n, r) => n + r.cantidad, 0) === l.cantidad);
    return { recepcion: completa ? recepciones.map(r => r.numero).join(" / ") : null, recepcionesParciales: recepciones.map(r => r.numero) };
  },
  listarFacturasVerificadas(sede) {
    const datos = window.LogisticaAplicacion.leer();
    return datos.facturas.filter(f => f.estado === "Verificada" && (!sede || f.sede === sede)).map(f => ({ id: f.id, numero: f.numero, documento: f.documento, proveedorId: f.proveedorId, ordenId: f.ordenId, base: f.baseCalculada, igv: f.igv, moneda: "PEN", estado: f.estado }));
  }
};
