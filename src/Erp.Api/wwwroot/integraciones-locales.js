"use strict";

// Contratos de consulta. Ninguna función registra pagos, reservas, salidas ni asientos.
// Las respuestas de ejemplo están separadas para sustituirlas por los módulos propietarios.
window.FAMIHOGAR_RESPUESTAS = {
  inventarios: {
    centro: { "SOF-001": 12, "COM-001": 8, "CAM-001": 6, "MES-001": 20, "EST-001": 10, "SIL-001": 30 },
    olivos: { "SOF-001": 4, "COM-001": 3, "CAM-001": 3, "MES-001": 8, "EST-001": 5, "SIL-001": 12 },
    surco: { "SOF-001": 5, "COM-001": 4, "CAM-001": 4, "MES-001": 10, "EST-001": 6, "SIL-001": 16 }
  },
  credito: {
    "cli-001": { limite: 600000, exposicion: 0, vencido: 0 },
    "cli-002": { limite: 1500000, exposicion: 300000, vencido: 0 }
  },
  entregas: {}, facturas: {}, devoluciones: {}
};

window.IntegracionesComerciales = {
  consultarDisponibilidad(pedido) {
    if (window.ContratosLogisticos) return window.ContratosLogisticos.consultarDisponibilidad(pedido);
    const stock = window.FAMIHOGAR_RESPUESTAS.inventarios[pedido.sede];
    return {
      origen: "Inventarios · respuesta local", consultadoEn: new Date().toISOString(),
      lineas: pedido.lineas.map(linea => ({ codigo: linea.codigo, disponible: stock?.[linea.codigo] ?? null }))
    };
  },
  consultarCredito(clienteId) {
    const respuesta = window.FAMIHOGAR_RESPUESTAS.credito[clienteId];
    return { origen: "Finanzas · respuesta local", consultadoEn: new Date().toISOString(), datos: respuesta ? structuredClone(respuesta) : null };
  },
  consultarSeguimiento(pedidoId) {
    if (window.ContratosLogisticos) return { ...window.ContratosLogisticos.consultarSeguimiento(pedidoId), facturas: structuredClone(window.FAMIHOGAR_RESPUESTAS.facturas[pedidoId] || []) };
    return {
      origen: "Despachos / Facturación · respuesta local", consultadoEn: new Date().toISOString(),
      entregas: structuredClone(window.FAMIHOGAR_RESPUESTAS.entregas[pedidoId] || []),
      facturas: structuredClone(window.FAMIHOGAR_RESPUESTAS.facturas[pedidoId] || [])
    };
  },
  consultarDevolucion(solicitudId) {
    if (window.ContratosLogisticos) return { origen: "Logística / Facturación / Finanzas", ...structuredClone(window.FAMIHOGAR_RESPUESTAS.devoluciones[solicitudId] || {}), ...window.ContratosLogisticos.consultarRecepcionDevolucion(solicitudId) };
    return { origen: "Inventarios / Facturación / Finanzas · respuesta local", ...structuredClone(window.FAMIHOGAR_RESPUESTAS.devoluciones[solicitudId] || {}) };
  }
};
