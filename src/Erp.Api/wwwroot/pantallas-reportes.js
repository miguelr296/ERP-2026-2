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
  let tablas = [];
  const puede = seccion => window.Permisos.tieneRol(c.sesion, secciones[seccion].roles);
  const formato = (valor, tipo) => tipo === "moneda" ? c.moneda(valor) : tipo === "fecha" ? c.fechaCorta(valor) : valor;

  function filtros(seccion) {
    const campo = (id, etiqueta, tipo, valor) => `<div><label for="reporte-${id}">${etiqueta}</label>
      <input id="reporte-${id}" name="${id}" type="${tipo}" value="${e(valor)}" required></div>`;
    const campos = seccion === "contabilidad" ? campo("mes", "Período contable", "month", filtro.mes)
      : campo("desde", "Desde", "date", filtro.desde) + campo("hasta", "Hasta", "date", filtro.hasta);
    return `<form id="filtros-reportes" class="tarjeta filtros-reportes" aria-label="Período del reporte">
      ${campos}<button type="submit" class="boton primario">Aplicar filtro</button>
      <p class="error" role="alert"></p></form>`;
  }

  function mostrarTabla(tabla, i, exportar = true) {
    const filas = tabla.filas.map(fila => `<tr>${fila.map((dato, indice) => {
      if (dato?.ruta && exportar) return `<td><a class="enlace-boton" href="#${e(dato.ruta)}">${e(dato.texto)}</a></td>`;
      const tipo = tabla.columnas[indice].formato;
      return `<td${tipo === "moneda" ? ' class="numero"' : ""}>${e(formato(dato?.texto ?? dato, tipo))}</td>`;
    }).join("")}</tr>`);
    const boton = exportar && filas.length ? `<button class="boton" type="button" data-reporte-csv="${i}"
      aria-label="Exportar ${e(tabla.titulo)} a CSV">Exportar CSV</button>` : "";
    return c.tabla(tabla.titulo, tabla.columnas.map(col => e(col.titulo)), filas, false, boton);
  }

  function dibujar(partes) {
    const nav = c.$("#navegacion"), contenido = c.$("#contenido");
    c.$("#accesos-rapidos").hidden = true;
    nav.setAttribute("aria-label", "Secciones de Reportes");
    document.title = "Reportes · FAMIHOGAR";
    tablas = [];
    const admitidas = Object.keys(secciones).filter(puede);
    const seccion = Object.hasOwn(secciones, partes[1]) ? partes[1] : admitidas[0];
    nav.innerHTML = admitidas.map(id => `<a class="boton" href="#reportes/${id}"
      ${seccion === id ? 'aria-current="page"' : ""}>${secciones[id].titulo}</a>`).join("");
    if (!seccion || !puede(seccion)) {
      contenido.innerHTML = c.cabeceraVista("Reportes", "Esta consulta no está disponible para tu perfil.");
      return;
    }
    const hoy = c.fechaHoy();
    filtro ??= { desde: hoy.slice(0, 7) + "-01", hasta: hoy, mes: hoy.slice(0, 7) };
    const { titulo, nota } = secciones[seccion];
    const sede = c.sedeNombre(c.sesion.sede);
    try {
      const reporte = R[seccion](filtro, c.sesion, c.datos);
      tablas = reporte.tablas;
      const indicadores = `<div class="indicadores">${reporte.indicadores.map(([etiqueta, valor, tipo]) =>
        `<div class="tarjeta indicador"><small>${e(etiqueta)}</small><strong class="importe-indicador">${e(formato(valor, tipo))}</strong></div>`
      ).join("")}</div>`;
      const accion = '<button class="boton" type="button" id="imprimir-reporte">Imprimir reporte</button>';
      contenido.innerHTML = c.zonaTrabajo("Filtros y resumen", c.cabeceraVista(titulo, nota, accion, "REPORTES / " + sede)
        + filtros(seccion) + indicadores)
        + c.zonaTrabajo("Detalle del reporte", tablas.map((t, i) => mostrarTabla(t, i)).join(""));
      const impresion = document.createElement("div");
      impresion.className = "vista-imprimir reporte-impresion";
      const periodo = seccion === "contabilidad" ? filtro.mes : c.fechaCorta(filtro.desde) + " al " + c.fechaCorta(filtro.hasta);
      impresion.innerHTML = `<h1>FAMIHOGAR · ${e(titulo)}</h1><p>${e(sede)} · ${e(periodo)}</p><p>${e(nota)}</p>
        ${indicadores}${tablas.map((t, i) => mostrarTabla(t, i, false)).join("")}`;
      document.body.append(impresion);
      document.body.classList.add("imprimir-documento");
      c.$("#imprimir-reporte").addEventListener("click", () => window.print());
      c.$("#filtros-reportes").addEventListener("submit", evento => {
        evento.preventDefault();
        const form = evento.currentTarget, valores = new FormData(form);
        const desde = valores.get("desde"), hasta = valores.get("hasta"), mes = valores.get("mes");
        const valido = seccion === "contabilidad" ? L.mesValido(mes) : L.fechaValida(desde) && L.fechaValida(hasta) && desde <= hasta;
        if (!valido) {
          form.querySelector(".error").textContent = "Elige un período válido. La fecha inicial debe ser igual o anterior a la final.";
          return;
        }
        filtro = seccion === "contabilidad" ? { ...filtro, mes } : { ...filtro, desde, hasta };
        c.navegar(location.hash.slice(1));
      });
    } catch (error) {
      contenido.innerHTML = c.cabeceraVista(titulo, "Revisa los datos locales de esta área.")
        + `<p class="tarjeta vacio error">${e(error.message)}</p>`;
    }
  }

  document.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-reporte-csv]");
    if (!boton || !location.hash.startsWith("#reportes/")) return;
    const tabla = tablas[Number(boton.dataset.reporteCsv)];
    if (!tabla?.filas.length) return;
    const url = URL.createObjectURL(new Blob([R.csv(tabla)], { type: "text/csv;charset=utf-8" }));
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "famihogar-" + c.sesion.sede + "-" + tabla.titulo.toLowerCase().replaceAll(" ", "-") + ".csv";
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  return { dibujar };
};
