"use strict";

window.PantallasReportes = c => {
  const R = window.ReportesERP, L = window.Libros, e = c.esc;
  const secciones = {
    ventas: { titulo: "Ventas", roles: ["Asesor", "Facturación", "Jefatura"], nota: "Los pedidos y comprobantes se muestran por su fecha de registro." },
    inventario: { titulo: "Inventario y compras", roles: ["Almacén", "Compras", "Jefatura"], nota: "Las existencias reflejan el estado actual. Las fechas se aplican a las órdenes y facturas de compra." },
    entregas: { titulo: "Entregas", roles: ["Almacén", "Transporte", "Jefatura"], nota: "El rango selecciona las órdenes por fecha de salida. El estado mostrado es el actual." },
    tesoreria: { titulo: "Tesorería", roles: ["Tesorería", "Jefatura"], nota: "El saldo al corte incluye los documentos y movimientos hasta la fecha final. Los ingresos y egresos se muestran dentro del rango." },
    contabilidad: { titulo: "Contabilidad", roles: ["Contabilidad", "Jefatura"], nota: "El balance incluye asientos contabilizados. La tabla de asientos también muestra los pendientes." }
  };
  let filtro = null;
  let exportacion = null;
  const rutaDashboard = "resumen";
  const puede = seccion => window.Permisos.tieneRol(c.sesion, secciones[seccion].roles);
  const formato = (valor, tipo) => tipo === "moneda" ? c.moneda(valor) : tipo === "fecha" ? c.fechaCorta(valor) : valor;

  function filtros(seccion, admiteContabilidad) {
    const campo = (id, etiqueta, tipo, valor) => `<div><label for="reporte-${id}">${etiqueta}</label>
      <input id="reporte-${id}" name="${id}" type="${tipo}" value="${e(valor)}" required></div>`;
    const rango = seccion === "contabilidad" ? ""
      : campo("desde", "Desde", "date", filtro.desde) + campo("hasta", "Hasta", "date", filtro.hasta);
    const mes = seccion === "contabilidad" || (seccion === rutaDashboard && admiteContabilidad)
      ? campo("mes", "Período contable", "month", filtro.mes) : "";
    return `<form id="filtros-reportes" class="tarjeta filtros-reportes" aria-label="Período del reporte">
      ${rango}${mes}<button type="submit" class="boton primario">Aplicar filtro</button>
      <p class="error" role="alert"></p></form>`;
  }

  function mostrarTabla(tabla, i, exportar = true) {
    const filas = tabla.filas.map(fila => `<tr>${fila.map((dato, indice) => {
      if (dato?.ruta && exportar) return `<td><a class="enlace-boton" href="#${e(dato.ruta)}">${e(dato.texto)}</a></td>`;
      const tipo = tabla.columnas[indice].formato;
      return `<td${tipo === "moneda" ? ' class="numero"' : ""}>${e(formato(dato?.texto ?? dato, tipo))}</td>`;
    }).join("")}</tr>`);
    const controles = exportar && filas.length ? botonesExportacion(tabla, i) : "";
    return c.tabla(tabla.titulo, tabla.columnas.map(col => e(col.titulo)), filas, false, controles);
  }

  function botonesExportacion(tabla, i) {
    return `<div class="exportaciones-reporte">
      <button class="boton" type="button" data-reporte-excel="${i}" aria-label="Exportar ${e(tabla.titulo)} a Excel">Exportar Excel</button>
      <button class="boton" type="button" data-reporte-csv="${i}" aria-label="Exportar ${e(tabla.titulo)} a CSV">Exportar CSV</button></div>`;
  }

  function mostrarIndicadores(indicadores) {
    return `<div class="indicadores">${indicadores.map(([etiqueta, valor, tipo]) =>
      `<div class="tarjeta indicador"><small>${e(etiqueta)}</small><strong class="importe-indicador">${e(formato(valor, tipo))}</strong></div>`
    ).join("")}</div>`;
  }

  function mostrarGrafico({ titulo, barras, formato: tipo }) {
    const maximo = barras.reduce((max, [, valor]) => Math.max(max, valor), 0);
    return `<section class="grafico-reporte"><h3>${e(titulo)}</h3>${maximo > 0
      ? `<ul>${barras.map(([etiqueta, valor]) => `<li><span>${e(etiqueta)}</span><strong>${e(formato(valor, tipo))}</strong>
        <span class="grafico-pista" aria-hidden="true"><span style="width:${valor * 100 / maximo}%"></span></span></li>`).join("")}</ul>`
      : '<p class="texto-suave">Sin datos para graficar.</p>'}</section>`;
  }

  function construirDashboard(admitidas) {
    const filas = [], alertas = [];
    const paneles = admitidas.map(id => {
      const { titulo, nota } = secciones[id];
      let informe;
      try { informe = R[id](filtro, c.sesion, c.datos); }
      catch { return { titulo, html: '<p class="error">No se pudieron consultar los registros de esta área.</p>' }; }
      const agregar = (grupo, [etiqueta, valor, tipo]) => {
        filas.push([titulo, grupo, etiqueta, tipo === "moneda" ? valor / 100 : valor, tipo === "moneda" ? "PEN" : ""]);
      };
      informe.indicadores.forEach(item => agregar("Indicador", item));
      for (const { titulo: grafico, formato: tipo, barras } of informe.graficos) {
        barras.forEach(([etiqueta, valor]) => agregar(grafico, [etiqueta, valor, tipo]));
      }
      for (const alerta of informe.alertas.filter(([, cantidad]) => cantidad > 0)) {
        agregar("Alerta", alerta);
        alertas.push([titulo, ...alerta]);
      }
      const html = `<p class="texto-suave">${e(nota)}</p>${mostrarIndicadores(informe.indicadores)}
        <div class="graficos-reporte">${informe.graficos.map(mostrarGrafico).join("")}</div>`;
      return { id, titulo, html };
    });
    const resumen = `<section class="tarjeta alertas-dashboard"><h2>Alertas operativas</h2>${alertas.length
      ? `<ul>${alertas.map(([area, titulo, cantidad]) => `<li><span>${e(area)} · ${e(titulo)}</span><strong>${cantidad}</strong></li>`).join("")}</ul>`
      : '<p class="texto-suave">Sin alertas en los datos consultados.</p>'}</section>`;
    const detalle = enlaces => `<div class="paneles-dashboard">${paneles.map(({ id, titulo, html }) =>
      `<section class="tarjeta panel-dashboard"><div class="cabecera-panel-dashboard"><h2>${e(titulo)}</h2>
        ${id && enlaces ? `<a class="enlace-boton" href="#reportes/${id}">Ver detalle</a>` : ""}</div>${html}</section>`).join("")}</div>`;
    const tabla = { titulo: "Dashboard", columnas: ["Área", "Grupo", "Concepto", "Valor", "Unidad"].map(titulo => ({ titulo })), filas };
    return { tablas: [tabla], encabezado: resumen, detalle };
  }

  function dibujar(partes) {
    const nav = c.$("#navegacion"), contenido = c.$("#contenido");
    c.$("#accesos-rapidos").hidden = true;
    nav.setAttribute("aria-label", "Secciones de Reportes");
    document.title = "Reportes · FAMIHOGAR";
    exportacion = null;
    const admitidas = Object.keys(secciones).filter(puede);
    const seccion = Object.hasOwn(secciones, partes[1]) ? partes[1] : rutaDashboard;
    const dashboard = seccion === rutaDashboard;
    nav.innerHTML = (admitidas.length ? [rutaDashboard, ...admitidas] : []).map(id => `<a class="boton" href="#reportes/${id}"
      ${seccion === id ? 'aria-current="page"' : ""}>${id === rutaDashboard ? "Dashboard" : secciones[id].titulo}</a>`).join("");
    if (!admitidas.length || (!dashboard && !puede(seccion))) {
      contenido.innerHTML = c.cabeceraVista("Reportes", "Esta consulta no está disponible para tu perfil.");
      return;
    }
    const hoy = c.fechaHoy();
    filtro ??= { desde: hoy.slice(0, 7) + "-01", hasta: hoy, mes: hoy.slice(0, 7) };
    const { titulo, nota } = dashboard ? {
      titulo: "Dashboard", nota: "Indicadores y alertas de la sede a partir de los registros disponibles para tu perfil."
    } : secciones[seccion];
    const sede = c.sedeNombre(c.sesion.sede);
    try {
      const informe = dashboard ? construirDashboard(admitidas) : R[seccion](filtro, c.sesion, c.datos);
      const { tablas } = informe;
      const encabezado = dashboard ? informe.encabezado : mostrarIndicadores(informe.indicadores);
      const detalle = dashboard ? informe.detalle : enlaces => tablas.map((tabla, i) => mostrarTabla(tabla, i, enlaces)).join("");
      const rango = c.fechaCorta(filtro.desde) + " al " + c.fechaCorta(filtro.hasta);
      const periodo = seccion === "contabilidad" ? filtro.mes
        : dashboard && admitidas.includes("contabilidad") ? rango + " · Mes contable " + filtro.mes : rango;
      const metadatos = [["Sede", sede], ["Período aplicado", periodo], ["Perfil", c.sesion.rol]];
      exportacion = { tablas, metadatos, sede: c.sesion.sede, sesion: c.sesion, ruta: location.hash };
      const accion = '<button class="boton" type="button" id="imprimir-reporte" title="Imprimir o guardar como PDF">Exportar PDF</button>'
        + (dashboard && tablas[0].filas.length ? botonesExportacion(tablas[0], 0) : "");
      contenido.innerHTML = c.zonaTrabajo("Filtros y resumen", c.cabeceraVista(titulo, nota, accion, "REPORTES / " + sede)
        + filtros(seccion, admitidas.includes("contabilidad")) + encabezado)
        + c.zonaTrabajo("Detalle del reporte", detalle(true));
      const impresion = document.createElement("div");
      impresion.className = "vista-imprimir reporte-impresion";
      impresion.innerHTML = `<h1>FAMIHOGAR · ${e(titulo)}</h1><p>${e(sede)} · ${e(periodo)}</p><p>${e(nota)}</p>
        ${encabezado}${detalle(false)}`;
      document.body.append(impresion);
      document.body.classList.add("imprimir-documento");
      c.$("#imprimir-reporte").addEventListener("click", () => window.print());
      c.$("#filtros-reportes").addEventListener("submit", evento => {
        evento.preventDefault();
        const form = evento.currentTarget, valores = new FormData(form);
        const desde = valores.get("desde"), hasta = valores.get("hasta"), mes = valores.get("mes");
        const rangoValido = desde === null || (L.fechaValida(desde) && L.fechaValida(hasta) && desde <= hasta);
        const valido = rangoValido && (mes === null || L.mesValido(mes));
        if (!valido) {
          form.querySelector(".error").textContent = "Elige un período válido. La fecha inicial debe ser igual o anterior a la final.";
          return;
        }
        filtro = { desde: desde ?? filtro.desde, hasta: hasta ?? filtro.hasta, mes: mes ?? filtro.mes };
        c.navegar(location.hash.slice(1));
      });
    } catch (error) {
      contenido.innerHTML = c.cabeceraVista(titulo, "Revisa los datos locales de esta área.")
        + `<p class="tarjeta vacio error">${e(error.message)}</p>`;
    }
  }

  document.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-reporte-csv], [data-reporte-excel]");
    if (!boton || !exportacion || exportacion.ruta !== location.hash || exportacion.sesion !== c.sesion || exportacion.sede !== c.sesion.sede) return;
    const excel = boton.hasAttribute("data-reporte-excel");
    const tabla = exportacion.tablas[Number(excel ? boton.dataset.reporteExcel : boton.dataset.reporteCsv)];
    if (!tabla?.filas.length) return;
    const archivo = excel ? window.ReportesExcel.xlsx(tabla, exportacion.metadatos)
      : new Blob([R.csv(tabla)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "famihogar-" + exportacion.sede + "-" + tabla.titulo.toLowerCase().replaceAll(" ", "-") + (excel ? ".xlsx" : ".csv");
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  return { dibujar };
};
