"use strict";

(() => {
  const configuracion = window.FAMIHOGAR;
  const reglas = window.ReglasComerciales;
  const CLAVE_SESION = "famihogar.sesion";
  const CLAVE_DATOS = "famihogar.comercial.v1";
  const $ = selector => document.querySelector(selector);
  const esc = valor => String(valor ?? "").replace(/[&<>"']/g, caracter => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[caracter]);
  const normalizar = texto => String(texto).trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const moneda = valor => new Intl.NumberFormat("es-PE", { style: "currency", currency: configuracion.parametros.moneda }).format(valor / 100);
  const sedeNombre = id => configuracion.sedes.find(sede => sede.id === id)?.nombre || id;
  const fechaHoy = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const fechaTexto = valor => new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", dateStyle: "short", timeStyle: "short" }).format(new Date(valor));
  const fechaCorta = valor => valor ? valor.split("-").reverse().join("/") : "—";
  const icono = nombre => `<svg aria-hidden="true"><use href="#i-${nombre}"/></svg>`;
  const accion = (texto, nombre, id = "", clase = "boton") => `<button type="button" class="${clase}" data-accion="${nombre}" data-id="${esc(id)}">${esc(texto)}</button>`;
  const enlace = (texto, vista) => `<button type="button" class="enlace-boton" data-vista="${esc(vista)}">${esc(texto)}</button>`;
  const opciones = valores => valores.map(valor => `<option value="${esc(valor)}">${esc(valor)}</option>`).join("");
  const modal = $("#modal");
  let sesion = null;
  let datos = null;
  let temporizador;

  const modulos = [
    { id: "comercial", nombre: "Comercial", icono: "ventas", color: "#d68743", descripcion: "Clientes y ventas" },
    { id: "inventarios", nombre: "Inventarios", icono: "caja", color: "#50889a" },
    { id: "despachos", nombre: "Despachos", icono: "camion", color: "#589c89" },
    { id: "finanzas", nombre: "Finanzas", icono: "finanzas", color: "#aa70a1" },
    { id: "facturacion", nombre: "Facturación", icono: "documento", color: "#d59946" },
    { id: "contabilidad", nombre: "Contabilidad", icono: "libro", color: "#687fa7" },
    { id: "compras", nombre: "Compras", icono: "compra", color: "#559694" },
    { id: "reportes", nombre: "Reportes", icono: "ventas", color: "#b57479" }
  ];
  const secciones = { resumen: "Inicio", clientes: "Clientes", oportunidades: "Oportunidades", cotizaciones: "Cotizaciones", pedidos: "Pedidos", catalogo: "Catálogo", precios: "Precios", aprobaciones: "Aprobaciones", solicitudes: "Postventa", indicadores: "Indicadores" };
  const roles = [...$("#rol").options].map(opcion => opcion.value).filter(Boolean);
  const puedeComercial = () => sesion && ["Asesor", "Jefatura"].includes(sesion.rol);
  const deSede = coleccion => coleccion.filter(registro => registro.sede === sesion.sede);
  const clienteDe = id => datos.clientes.find(cliente => cliente.id === id);

  function sumarDias(fecha, cantidad) {
    const dia = new Date(`${fecha}T12:00:00Z`);
    dia.setUTCDate(dia.getUTCDate() + cantidad);
    return dia.toISOString().slice(0, 10);
  }

  function leerDatos() {
    const guardados = localStorage.getItem(CLAVE_DATOS);
    return reglas.prepararDatos(configuracion, guardados ? JSON.parse(guardados) : null);
  }

  function cargarDatos() {
    try { datos = leerDatos(); }
    catch { datos = null; }
  }

  // Cada alta lee el último estado antes de guardar. No sustituye una transacción de servidor.
  function guardarCambios(cambiar) {
    if (!puedeComercial()) throw new Error("Tu rol no puede registrar operaciones comerciales.");
    const actuales = leerDatos();
    const resultado = cambiar(actuales);
    try { localStorage.setItem(CLAVE_DATOS, JSON.stringify(actuales)); }
    catch { throw new Error("No se pudo guardar en este navegador. No se registró el cambio."); }
    datos = actuales;
    return resultado;
  }

  function aviso(texto) {
    const estado = $("#estado");
    estado.textContent = texto;
    estado.hidden = false;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { estado.hidden = true; }, 6500);
  }

  function guardarSesion() {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  }

  function mostrarSistema() {
    $("#acceso").hidden = true;
    $("#sistema").hidden = false;
    $("#identidad").textContent = sesion.nombre;
    $("#rol-actual").textContent = sesion.rol;
    $("#avatar").textContent = sesion.nombre.split(/\s+/).slice(0, 2).map(parte => parte[0]).join("").toUpperCase();
    $("#sede-actual").value = sesion.sede;
    $("#sede-panel").textContent = sedeNombre(sesion.sede);
    $("#responsabilidad-panel").textContent = `${sesion.nombre} · ${sesion.rol}`;
    $("#pie-sede").textContent = sedeNombre(sesion.sede);
    cargarDatos();
    dibujarRuta();
  }

  function dibujarModulos() {
    const lista = modulos.filter(modulo => normalizar(modulo.nombre).includes(normalizar($("#buscar-aplicacion").value)));
    $("#modulos").innerHTML = lista.map(modulo => `<button class="modulo" type="button" data-modulo="${modulo.id}" style="--color-modulo:${modulo.color}"><span class="icono-modulo">${icono(modulo.icono)}</span><strong>${modulo.nombre}</strong><small>${modulo.descripcion || "En desarrollo"}</small></button>`).join("");
    $("#sin-modulos").hidden = lista.length !== 0;
  }

  function navegar(vista) {
    if (location.hash === `#${vista}`) dibujarRuta();
    else location.hash = vista;
  }

  function dibujarRuta() {
    if (!sesion) return;
    if (modal.open) modal.close();
    document.querySelector(".vista-imprimir")?.remove();
    document.body.classList.remove("imprimir-documento");
    let partes;
    try { partes = location.hash.slice(1).split("/").map(decodeURIComponent); }
    catch { partes = ["aplicaciones"]; }
    const modulo = modulos.find(item => item.id === partes[0]);
    $("#aplicaciones").hidden = Boolean(modulo);
    $("#area").hidden = !modulo;
    if (!modulo) {
      dibujarModulos();
      document.title = "Aplicaciones · FAMIHOGAR";
      $("#titulo-aplicaciones").focus();
      return;
    }
    $("#nombre-modulo").textContent = modulo.nombre;
    const habilitado = modulo.id === "comercial" && puedeComercial() && datos;
    $("#accesos-rapidos").hidden = !habilitado;
    $("#navegacion").innerHTML = habilitado ? Object.entries(secciones).map(([id, texto]) => `<button type="button" data-vista="${id}" ${id === (partes[1] || "resumen") ? 'aria-current="page"' : ""}>${id === "resumen" ? icono("casa") : ""}${texto}</button>`).join("") : `<button type="button" aria-current="page">${modulo.nombre}</button>`;
    document.title = `${modulo.nombre} · FAMIHOGAR`;
    if (modulo.id !== "comercial") {
      $("#contenido").innerHTML = `<div class="tarjeta pendiente">${icono(modulo.icono)}<h1>${modulo.nombre}</h1><p>En desarrollo</p></div>`;
    } else if (!puedeComercial()) {
      $("#contenido").innerHTML = `<div class="tarjeta pendiente">${icono("personas")}<h1>Comercial</h1><p>Disponible para Asesor y Jefatura.</p><a class="boton" href="#aplicaciones">Volver a aplicaciones</a></div>`;
    } else if (!datos) {
      $("#contenido").innerHTML = '<div class="tarjeta vacio">No se pudieron leer los datos locales. Se conservaron sin cambios. Revisa el almacenamiento del navegador.</div>';
    } else if (partes[2]) {
      mostrarDocumento(partes[1], partes[2]);
    } else {
      dibujarSeccion(secciones[partes[1]] ? partes[1] : "resumen");
    }
    $("#contenido").focus();
  }

  function cabecera(titulo, descripcion, boton = "") {
    return `<div class="encabezado-vista"><div><p class="ceja">COMERCIAL / ${esc(sedeNombre(sesion.sede))}</p><h1>${esc(titulo)}</h1><p>${esc(descripcion)}</p></div>${boton}</div>`;
  }

  function etiqueta(estado) {
    const color = ["Aceptada", "Aprobado", "Aprobada", "Autorizada", "Completada", "Atendido", "Facturado"].includes(estado) ? "verde" : ["Rechazada", "Rechazado", "Anulado", "Anulada", "Bloqueado"].includes(estado) ? "roja" : ["Enviada", "En seguimiento", "Pendiente", "Pendiente de aprobación", "Parcialmente atendido", "Vencida"].includes(estado) ? "naranja" : "";
    return `<span class="etiqueta ${color}">${esc(estado)}</span>`;
  }

  function tabla(titulo, columnas, filas, buscar = true) {
    return `<section class="tarjeta"><div class="barra-tabla"><h2>${esc(titulo)}</h2>${buscar ? '<label class="solo-lectores" for="filtro-tabla">Buscar en la tabla</label><input id="filtro-tabla" type="search" placeholder="Buscar en esta vista…">' : ""}</div><div class="tabla-desplazable"><table><thead><tr>${columnas.map(columna => `<th scope="col">${columna}</th>`).join("")}</tr></thead><tbody>${filas.join("") || `<tr><td colspan="${columnas.length}" class="vacio">No hay registros en esta vista.</td></tr>`}</tbody></table></div><p id="tabla-sin-resultados" class="vacio" hidden>No se encontraron coincidencias.</p></section>`;
  }

  function filasOportunidades(lista) {
    return lista.map(op => `<tr><td>${enlace(op.numero, `oportunidades/${op.id}`)}<small>${esc(op.asunto)}</small></td><td>${esc(clienteDe(op.clienteId)?.nombre)}</td><td>${esc(op.canal)}</td><td>${etiqueta(op.estado)}</td><td>${esc(op.vendedor)}</td></tr>`);
  }

  function dibujarSeccion(vista) {
    const adicional = ampliacion.vista(vista);
    if (adicional !== null) { $("#contenido").innerHTML = adicional; return; }
    const oportunidades = deSede(datos.oportunidades);
    const cotizaciones = deSede(datos.cotizaciones);
    const pedidos = deSede(datos.pedidos);
    let html;
    if (vista === "resumen") {
      const metricas = [["Oportunidades", oportunidades.length], ["Cotizaciones", cotizaciones.length], ["Aceptadas", cotizaciones.filter(c => c.estado === "Aceptada").length], ["Pedidos", pedidos.length]];
      const grupos = [["Relaciones comerciales", [["Clientes", "clientes"], ["Oportunidades", "oportunidades"]]], ["Gestión de ventas", [["Cotizaciones", "cotizaciones"], ["Pedidos de venta", "pedidos"]]], ["Consultas", [["Productos y precios", "catalogo"]]]];
      html = cabecera("Panel comercial", "Clientes, oportunidades y documentos de venta de tu sede.", accion("+ Nueva oportunidad", "nueva-oportunidad", "", "boton primario"));
      html += `<div class="indicadores">${metricas.map(([nombre, cantidad]) => `<div class="tarjeta indicador"><small>${nombre}</small><strong>${cantidad}</strong><small>${esc(sedeNombre(sesion.sede))}</small></div>`).join("")}</div>`;
      html += `<div class="grupos">${grupos.map(([titulo, enlaces]) => `<section class="tarjeta grupo"><h2>${titulo}</h2>${enlaces.map(([texto, destino]) => `<button type="button" data-vista="${destino}">${texto}<span aria-hidden="true">→</span></button>`).join("")}</section>`).join("")}</div>`;
      html += tabla("Oportunidades recientes", ["Oportunidad", "Cliente", "Canal", "Estado", "Vendedor"], filasOportunidades([...oportunidades].reverse().slice(0, 5)), false);
    } else if (vista === "clientes") {
      html = cabecera("Clientes", "Directorio compartido entre sedes.", accion("+ Nuevo cliente", "nuevo-cliente", "", "boton primario"));
      html += tabla("Directorio de clientes", ["Cliente", "Documento", "Contacto", "Segmento"], datos.clientes.map(c => `<tr><td>${accion(c.nombre, "ver-cliente", c.id, "enlace-boton")}</td><td>${esc(c.tipoDocumento)} ${esc(c.documento)}</td><td>${esc(c.correo || "—")}<small>${esc(c.telefono)}</small></td><td>${etiqueta(c.segmento)}</td></tr>`));
    } else if (vista === "oportunidades") {
      html = cabecera("Oportunidades", "Capta la necesidad del cliente y prepara su propuesta.", accion("+ Nueva oportunidad", "nueva-oportunidad", "", "boton primario"));
      html += tabla("Seguimiento comercial", ["Oportunidad", "Cliente", "Canal", "Estado", "Vendedor"], filasOportunidades(oportunidades));
    } else if (vista === "cotizaciones" || vista === "pedidos") {
      const esCotizacion = vista === "cotizaciones";
      const lista = esCotizacion ? cotizaciones : pedidos;
      html = cabecera(esCotizacion ? "Cotizaciones" : "Pedidos de venta", esCotizacion ? "Propuestas con productos, condiciones y precios conservados." : "Control, aprobación y seguimiento de pedidos por sede.", esCotizacion ? accion("+ Nueva cotización", "nueva-cotizacion", "", "boton primario") : "");
      html += tabla(esCotizacion ? "Documentos comerciales" : "Pedidos registrados", ["Documento", "Cliente", "Fecha", "Estado", "Total"], lista.map(d => `<tr><td>${enlace(d.numero, `${vista}/${d.id}`)}</td><td>${esc(d.cliente.nombre)}</td><td>${fechaCorta(d.fecha)}</td><td>${etiqueta(d.estado)}</td><td class="numero">${moneda(d.total)}</td></tr>`));
    } else {
      html = cabecera("Catálogo de productos", "Lista general · PEN · Precios sin IGV.");
      html += tabla("Productos y precios", ["Código", "Producto", "Familia", "Unidad", "Precio unitario"], datos.productos.map(p => `<tr><td>${p.codigo}</td><td>${esc(p.nombre)}</td><td>${esc(p.familia)}</td><td>${esc(p.unidad)}</td><td class="numero">${moneda(p.precio)}</td></tr>`));
    }
    $("#contenido").innerHTML = html;
  }

  function abrirModal(titulo, contenido) {
    $("#titulo-modal").textContent = titulo;
    $("#cuerpo-modal").innerHTML = contenido;
    if (!modal.open) modal.showModal();
  }

  function formulario(titulo, campos, guardar, textoBoton = "Guardar") {
    abrirModal(titulo, `<form id="formulario-registro">${campos}<p id="error-formulario" class="error" role="alert"></p><div class="acciones-formulario">${accion("Cancelar", "cerrar-modal")}<button class="boton primario" type="submit">${textoBoton}</button></div></form>`);
    $("#formulario-registro").addEventListener("submit", evento => {
      evento.preventDefault();
      const form = evento.currentTarget;
      if (!form.reportValidity()) return;
      try {
        const destino = guardar(new FormData(form));
        modal.close();
        navegar(destino);
        aviso("Registro guardado.");
      } catch (error) { $("#error-formulario").textContent = error.message; }
    });
  }

  function nuevoCliente() { ampliacion.cliente(); }

  function filaProducto() {
    const fila = document.createElement("div");
    fila.className = "linea-producto";
    fila.innerHTML = `<div><label>Producto<select name="producto" required><option value="">Selecciona un producto</option>${datos.productos.map(p => `<option value="${p.codigo}">${esc(p.nombre)}</option>`).join("")}</select></label></div><div><label>Cantidad<input name="cantidad" type="number" min="1" max="999" step="1" value="1" required></label></div><button class="boton-icono" type="button" data-accion="quitar-producto" aria-label="Quitar producto">×</button>`;
    $("#productos-oportunidad").append(fila);
  }

  function nuevaOportunidad() {
    formulario("Nueva oportunidad", `<div class="campos"><div class="campo-completo"><label for="cliente-oportunidad">Cliente</label><select id="cliente-oportunidad" name="clienteId" required><option value="">Selecciona un cliente</option>${datos.clientes.filter(c => reglas.aprobado(c)).map(c => `<option value="${esc(c.id)}">${esc(c.nombre)} · ${esc(c.documento)}</option>`).join("")}</select></div><div class="campo-completo"><label for="asunto">Necesidad del cliente</label><input id="asunto" name="asunto" maxlength="150" placeholder="Por ejemplo, renovar el comedor" required></div><div><label for="canal">Canal</label><select id="canal" name="canal">${opciones(["Tienda", "Web", "Teléfono"])}</select></div></div><h3 style="margin-top:24px">Productos de interés</h3><div id="productos-oportunidad"></div>${accion("+ Agregar producto", "agregar-producto")}`, valores => {
      const asunto = valores.get("asunto").trim();
      const codigos = valores.getAll("producto");
      const cantidades = valores.getAll("cantidad").map(Number);
      if (!asunto) throw new Error("Describe la necesidad del cliente.");
      if (!codigos.length || cantidades.some(cantidad => !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 999)) throw new Error("Agrega productos con cantidades enteras entre 1 y 999.");
      if (new Set(codigos).size !== codigos.length) throw new Error("Hay un producto repetido. Agrupa su cantidad en una sola línea.");
      guardarCambios(actuales => {
        if (!actuales.clientes.some(c => c.id === valores.get("clienteId") && reglas.aprobado(c))) throw new Error("Selecciona un cliente existente.");
        if (codigos.some(codigo => !datos.productos.some(p => p.codigo === codigo))) throw new Error("Selecciona productos del catálogo.");
        actuales.oportunidades.push({
          id: crypto.randomUUID(), numero: numerar(actuales.oportunidades, "OP"), clienteId: valores.get("clienteId"),
          asunto, canal: valores.get("canal"), sede: sesion.sede, vendedor: sesion.nombre, fecha: fechaHoy(),
          estado: "Nueva", lineas: codigos.map((codigo, i) => ({ codigo, cantidad: cantidades[i] })), historial: [evento("Captación de oportunidad")]
        });
      });
      return "comercial/oportunidades";
    });
    filaProducto();
  }

  function numerar(coleccion, prefijo) {
    const existentes = coleccion.map(d => Number(d.numero.split("-").at(-1))).filter(Number.isFinite);
    return `${prefijo}-${String(Math.max(0, ...existentes) + 1).padStart(5, "0")}`;
  }

  function calcular(op) {
    return reglas.calcular(datos, op, { fecha: fechaHoy() }, configuracion.parametros);
  }

  function detalleLineas(d) {
    const conDescuento = d.descuento > 0;
    return `<div class="tabla-desplazable"><table><thead><tr><th>Código</th><th>Producto</th><th>Cantidad</th><th>Precio unitario</th>${conDescuento ? "<th>Descuento</th>" : ""}<th>Importe</th></tr></thead><tbody>${d.lineas.map(l => `<tr><td>${esc(l.codigo)}</td><td>${esc(l.nombre)}</td><td>${l.cantidad}</td><td class="numero">${moneda(l.precio)}</td>${conDescuento ? `<td class="numero">${moneda(l.descuento)}</td>` : ""}<td class="numero">${moneda(l.importe)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  function totales(d) {
    return `<dl class="totales">${d.descuento > 0 ? `<dt>Importe bruto</dt><dd>${moneda(d.bruto)}</dd><dt>Descuento (${d.descuentoBps / 100} %)</dt><dd>− ${moneda(d.descuento)}</dd>` : ""}<dt>Subtotal</dt><dd>${moneda(d.subtotal)}</dd><dt>IGV (${d.igvPorcentaje} %)</dt><dd>${moneda(d.igv)}</dd><dt class="total">Total</dt><dd class="total">${moneda(d.total)}</dd></dl>`;
  }

  function nuevaCotizacion(id = "") { ampliacion.nuevaCotizacion(id); }

  function evento(accionRealizada) {
    return { fecha: new Date().toISOString(), accion: accionRealizada, usuario: sesion.nombre, rol: sesion.rol };
  }

  function mostrarHistorial(lista) {
    return `<h3>Historial</h3><ul class="historial">${lista.map(e => `<li><time datetime="${esc(e.fecha)}">${fechaTexto(e.fecha)}</time> ${esc(e.accion)} · ${esc(e.usuario)} (${esc(e.rol)})</li>`).join("")}</ul>`;
  }

  function documentoBaseHtml(d, tipo) {
    const esCotizacion = tipo === "cotizaciones";
    const pedido = esCotizacion ? datos.pedidos.find(p => p.cotizacionId === d.id) : null;
    const origen = esCotizacion ? enlace(d.oportunidadNumero, `oportunidades/${d.oportunidadId}`) : enlace(d.cotizacionNumero, `cotizaciones/${d.cotizacionId}`);
    const derivados = pedido ? enlace(pedido.numero, `pedidos/${pedido.id}`) : esCotizacion ? "Sin pedido generado" : [...(d.entregas || []), ...(d.facturas || [])].map(documento => esc(documento.numero)).join(" · ") || "Sin documentos informados";
    return `<article class="ficha"><div class="cabecera-documento"><div><p class="ceja">${esCotizacion ? "COTIZACIÓN" : "PEDIDO DE VENTA"}</p><h3>${esc(d.numero)}</h3></div>${etiqueta(d.estado)}</div><dl class="detalle-documento"><div><dt>Cliente</dt><dd>${esc(d.cliente.nombre)}</dd></div><div><dt>Documento</dt><dd>${esc(d.cliente.tipoDocumento)} ${esc(d.cliente.documento)}</dd></div><div><dt>Dirección de entrega</dt><dd>${esc(d.cliente.direccion)}</dd></div><div><dt>Sede / canal</dt><dd>${esc(sedeNombre(d.sede))} / ${esc(d.canal)}</dd></div><div><dt>Fecha / vigencia</dt><dd>${fechaCorta(d.fecha)} / ${fechaCorta(d.vigenteHasta)}</dd></div><div><dt>Entrega propuesta / condición de pago</dt><dd>${fechaCorta(d.entrega)} / ${esc(d.condicion)}</dd></div><div><dt>Vendedor / registrado por</dt><dd>${esc(d.vendedor)} / ${esc(d.registradoPor)}</dd></div><div><dt>Origen</dt><dd>${origen}</dd></div><div><dt>Documentos derivados</dt><dd>${derivados}</dd></div><div><dt>Precios</dt><dd>${esc(d.moneda || "PEN")} · Sin IGV · ${esc(d.listaNombre || "Lista histórica")}</dd></div></dl>${detalleLineas(d)}<div class="cierre-documento">${totales(d)}${mostrarHistorial(d.historial)}</div>${!esCotizacion ? '<p class="nota-operacion">Reserva y despacho corresponden a Inventarios y Despachos. La condición de pago no registra un cobro.</p>' : ""}</article>`;
  }

  function documentoHtml(d, tipo) {
    return documentoBaseHtml(d, tipo) + ampliacion.detalle(d, tipo);
  }

  function mostrarDocumento(tipo, id) {
    if (ampliacion.ficha(tipo, id)) return;
    if (tipo === "oportunidades") { mostrarOportunidad(id); return; }
    if (!["cotizaciones", "pedidos"].includes(tipo)) { navegar("comercial/resumen"); return; }
    const d = datos[tipo].find(documento => documento.id === id && documento.sede === sesion.sede);
    if (!d) { $("#contenido").innerHTML = '<p class="tarjeta vacio">No se encontró el documento en esta sede.</p>'; return; }
    let botones = accion("Imprimir ficha", "imprimir", id);
    if (tipo === "cotizaciones") {
      if (d.estado === "Borrador") botones += accion("Marcar enviada", "enviar-cotizacion", id, "boton primario");
      if (d.estado === "Enviada") botones += accion("Registrar aceptación", "aceptar-cotizacion", id, "boton primario") + accion("Registrar rechazo", "rechazar-cotizacion", id);
      if (d.estado === "Aceptada") botones += accion(datos.pedidos.some(p => p.cotizacionId === id) ? "Ver pedido" : "Crear pedido", "crear-pedido", id, "boton primario");
    }
    botones += ampliacion.botones(d, tipo);
    $("#contenido").innerHTML = cabecera(d.numero, tipo === "cotizaciones" ? "Ficha de cotización" : "Ficha de pedido", enlace("← Volver al listado", tipo)) + `<section class="tarjeta" style="padding:24px">${documentoHtml(d, tipo)}<div class="acciones-documento">${botones}</div></section>`;
    prepararImpresion(d, tipo);
  }

  function mostrarOportunidad(id) { ampliacion.oportunidad(id); }

  function prepararImpresion(d, tipo) {
    const impresion = document.createElement("div");
    impresion.className = "vista-imprimir";
    impresion.innerHTML = `<div class="marca"><span class="marca-icono">F</span><span>FAMIHOGAR<small>ERP</small></span></div>${documentoHtml(d, tipo)}`;
    // Conservar las referencias documentales como texto, sin controles de navegación.
    impresion.querySelectorAll("button").forEach(boton => boton.replaceWith(document.createTextNode(boton.textContent)));
    document.body.append(impresion);
    document.body.classList.add("imprimir-documento");
  }

  function cambiarEstado(id, estado) {
    const cambiar = motivo => guardarCambios(actuales => reglas.cambiarCotizacion(actuales, id, estado, motivo, sesion, fechaHoy()));
    if (["Rechazada", "Anulada"].includes(estado)) {
      formulario("Registrar " + estado.toLocaleLowerCase("es"), '<label for="motivo">Motivo</label><textarea id="motivo" name="motivo" minlength="3" maxlength="300" required></textarea>', valores => {
        cambiar(valores.get("motivo")); return `comercial/cotizaciones/${id}`;
      });
    } else { cambiar(""); dibujarRuta(); aviso("Estado actualizado."); }
  }

  function crearPedido(id) {
    const pedido = guardarCambios(actuales => reglas.crearPedido(actuales, id, sesion, fechaHoy()));
    navegar(`comercial/pedidos/${pedido.id}`);
    aviso("Pedido registrado. Valida los controles antes de solicitar aprobación.");
  }

  function verCliente(id) { ampliacion.verCliente(id); }

  const ampliacion = window.PantallasComerciales({
    get datos() { return datos; }, get sesion() { return sesion; }, configuracion, reglas,
    $, esc, moneda, sedeNombre, fechaHoy, fechaCorta, fechaTexto, accion, enlace, opciones,
    cabecera, tabla, etiqueta, formulario, abrirModal, guardarCambios, navegar, aviso,
    detalleLineas, totales, mostrarHistorial, prepararImpresion, sumarDias
  });

  document.addEventListener("click", eventoClick => {
    const boton = eventoClick.target.closest("[data-accion], [data-vista], [data-modulo]");
    if (!boton || !sesion) return;
    if (boton.dataset.modulo) { navegar(`${boton.dataset.modulo}/resumen`); return; }
    if (boton.dataset.vista) { navegar(`comercial/${boton.dataset.vista}`); return; }
    const tipo = boton.dataset.accion, id = boton.dataset.id;
    if (tipo === "cerrar-modal") { modal.close(); return; }
    if (!puedeComercial() || !datos) { aviso("Esta operación corresponde a Comercial."); return; }
    try {
      if (ampliacion.accion(tipo, id)) return;
      if (tipo === "nuevo-cliente") nuevoCliente();
      if (tipo === "nueva-oportunidad") nuevaOportunidad();
      if (tipo === "nueva-cotizacion") nuevaCotizacion(id);
      if (tipo === "ver-cliente") verCliente(id);
      if (tipo === "agregar-producto") filaProducto();
      if (tipo === "quitar-producto") {
        if (document.querySelectorAll(".linea-producto").length > 1) boton.closest(".linea-producto").remove();
        else aviso("Mantén al menos un producto.");
      }
      if (tipo === "enviar-cotizacion") cambiarEstado(id, "Enviada");
      if (tipo === "aceptar-cotizacion") cambiarEstado(id, "Aceptada");
      if (tipo === "rechazar-cotizacion") cambiarEstado(id, "Rechazada");
      if (tipo === "crear-pedido") crearPedido(id);
      if (tipo === "imprimir") window.print();
    } catch (error) { aviso(error.message); }
  });

  document.addEventListener("input", eventoInput => {
    if (eventoInput.target.id !== "filtro-tabla") return;
    let visibles = 0;
    $("#contenido").querySelectorAll("tbody tr").forEach(fila => {
      fila.hidden = !normalizar(fila.textContent).includes(normalizar(eventoInput.target.value));
      if (!fila.hidden) visibles++;
    });
    $("#tabla-sin-resultados").hidden = visibles !== 0;
  });

  const opcionesSedes = configuracion.sedes.map(sede => `<option value="${sede.id}">${esc(sede.nombre)}</option>`).join("");
  $("#sede-acceso").innerHTML = opcionesSedes;
  $("#sede-actual").innerHTML = opcionesSedes;
  $("#cerrar-modal").addEventListener("click", () => modal.close());
  $("#buscar-aplicacion").addEventListener("input", dibujarModulos);
  $("#ir-aplicaciones").addEventListener("click", () => navegar("aplicaciones"));
  $("#formulario-acceso").addEventListener("submit", eventoSubmit => {
    eventoSubmit.preventDefault();
    const nombre = $("#nombre").value.trim();
    if (!nombre || !roles.includes($("#rol").value)) { $("#error-acceso").textContent = "Escribe tu usuario y selecciona un rol."; return; }
    sesion = { nombre, rol: $("#rol").value, sede: $("#sede-acceso").value };
    try { guardarSesion(); }
    catch { sesion = null; $("#error-acceso").textContent = "Permite el almacenamiento de sesión en tu navegador para ingresar."; return; }
    $("#error-acceso").textContent = "";
    history.replaceState(null, "", "#aplicaciones");
    mostrarSistema();
  });
  $("#sede-actual").addEventListener("change", eventoChange => {
    const sedeAnterior = sesion.sede;
    sesion.sede = eventoChange.target.value;
    try { guardarSesion(); }
    catch { sesion.sede = sedeAnterior; eventoChange.target.value = sedeAnterior; aviso("No se pudo conservar el cambio de sede."); return; }
    mostrarSistema();
  });
  $("#salir").addEventListener("click", () => {
    try { sessionStorage.removeItem(CLAVE_SESION); }
    catch { aviso("No se pudo cerrar la sesión. Revisa el almacenamiento del navegador."); return; }
    sesion = null;
    $("#sistema").hidden = true;
    $("#acceso").hidden = false;
    $("#formulario-acceso").reset();
    $("#buscar-aplicacion").value = "";
    $("#estado").hidden = true;
    document.querySelector(".vista-imprimir")?.remove();
    document.body.classList.remove("imprimir-documento");
    history.replaceState(null, "", location.pathname);
    document.title = "FAMIHOGAR · ERP";
    $("#nombre").focus();
  });
  window.addEventListener("hashchange", dibujarRuta);
  window.addEventListener("storage", eventoStorage => {
    if (eventoStorage.key === CLAVE_DATOS && sesion) { cargarDatos(); dibujarRuta(); aviso("Datos actualizados desde otra pestaña."); }
  });
  try {
    const anterior = JSON.parse(sessionStorage.getItem(CLAVE_SESION));
    if (anterior?.nombre && roles.includes(anterior.rol)) {
      sesion = { ...anterior, sede: configuracion.sedes.some(s => s.id === anterior.sede) ? anterior.sede : configuracion.sedes[0].id };
      mostrarSistema();
    }
  } catch { /* El formulario permite iniciar una sesión nueva. */ }
})();
