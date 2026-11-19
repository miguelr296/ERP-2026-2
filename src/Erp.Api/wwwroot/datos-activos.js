"use strict";

window.FAMIHOGAR_ACTIVOS = {
  version: 1,
  moneda: "PEN",
  igvPorcentaje: window.FAMIHOGAR.parametros.igvPorcentaje,
  clases: {
    "Maquinaria y equipos": { activo: "333", depreciacion: "395", deterioro: "363", gastoDepreciacion: "684", gastoDeterioro: "685" },
    "Unidades de transporte": { activo: "334", depreciacion: "395", deterioro: "363", gastoDepreciacion: "684", gastoDeterioro: "685" },
    "Muebles y enseres": { activo: "335", depreciacion: "395", deterioro: "363", gastoDepreciacion: "684", gastoDeterioro: "685" },
    "Equipos diversos": { activo: "336", depreciacion: "395", deterioro: "363", gastoDepreciacion: "684", gastoDeterioro: "685" }
  },
  cuentas: { enCurso: "339", igv: "4011", pagar: "465", banco: "104", mantenimiento: "634", ingresoBaja: "756", costoBaja: "655", cobrar: "165" },
  libros: ["Contable", "Tributario"],
  metodos: ["Línea recta", "Unidades de producción", "Saldos decrecientes"]
};
