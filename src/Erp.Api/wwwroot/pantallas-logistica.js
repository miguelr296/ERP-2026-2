"use strict";

window.PantallasLogistica = c => {
  const A = window.LogisticaAplicacion, L = window.LogisticaReglas, C = window.ComprasReglas, D = window.DistribucionReglas, M = window.AlmacenesReglas;
  const e = c.esc, actor = () => c.sesion, datos = () => A.leer(), productos = () => A.productos();
  const permitir = roles => window.Permisos.tieneRol(actor(), roles);
  const jefatura = () => permitir(["Jefatura"]);
  const compra = () => permitir(["Compras", "Jefatura"]);
  const almacen = () => permitir(["Almacén", "Jefatura"]);
  const transporte = () => permitir(["Transporte", "Jefatura"]);
  let modulo = "logistica", vistaActual = "resumen", productoKardex = "", evaluacionKardex = null;
  const b = (titulo, comando, id = "", clase = "boton") => `<button type="button" class="${clase}" data-log-accion="${comando}" data-id="${e(id)}">${e(titulo)}</button>`;
  const enlace = (titulo, destino) => `<button type="button" class="enlace-boton" data-log-vista="${e(destino)}">${e(titulo)}</button>`;
  const ir = destino => c.navegar(`${modulo}/${destino}`);
  const hoy = () => c.fechaHoy();
  const propios = (lista, destino = false) => lista.filter(d => (!d.sede || d.sede === actor().sede || (destino && d.sedeDestino === actor().sede)) && (actor().rol !== "Asesor" || d.registradoPor === actor().nombre));
  const nombreProducto = codigo => productos().find(p => p.codigo === codigo)?.nombre || codigo;
  const nombreAlmacen = id => datos().almacenes.find(a => a.id === id)?.nombre || id;
  const nombreProveedor = id => datos().proveedores.find(p => p.id === id)?.nombre || id;
  const opcion = (valor, titulo, seleccionado) => `<option value="${e(valor)}" ${valor === seleccionado ? "selected" : ""}>${e(titulo)}</option>`;
  const select = (id, opciones, seleccionado, extra = "") => `<select id="log-${id}" name="${id}" ${extra}>${opciones.map(o => opcion(o[0], o[1], seleccionado)).join("")}</select>`;
  const campo = (titulo, id, contenido) => `<div><label for="log-${id}">${titulo}</label>${contenido}</div>`;
  const input = (id, valor = "", extra = "required") => `<input id="log-${id}" name="${id}" value="${e(valor)}" ${extra}>`;
  const selectSimple = (id, valores, seleccionado) => select(id, valores.map(v => [v, v]), seleccionado);
  const campoRazon = titulo => campo(titulo, "motivo", '<textarea id="log-motivo" name="motivo" minlength="3" maxlength="500" required></textarea>');
  const razon = campoRazon("Motivo / evidencia");
  const cantidad = id => input(id, 0, 'type="number" min="0" step="1" required');
  const fecha = (id, valor = hoy()) => input(id, valor, 'type="date" required');
  const monedas = valor => c.moneda(valor || 0);
  const ejecutar = comando => A.ejecutar(actor(), comando);

  const secciones = {
    resumen: ["Inicio", "Inicio", ["Asesor", "Compras", "Almacén", "Transporte", "Jefatura"]],
    planificacion: ["Planificación", "Planificación", ["Compras", "Jefatura"]],
    requisiciones: ["Solicitudes de pedido", "Compras", ["Asesor", "Compras", "Almacén", "Jefatura"]],
    proveedores: ["Proveedores", "Compras", ["Compras", "Jefatura"]],
    peticionesOferta: ["Peticiones de oferta", "Compras", ["Compras", "Jefatura"]],
    ofertas: ["Comparación de ofertas", "Compras", ["Compras", "Jefatura"]],
    acuerdos: ["Acuerdos marco", "Compras", ["Compras", "Jefatura"]],
    ordenes: ["Órdenes de compra", "Compras", ["Compras", "Jefatura"]],
    facturas: ["Verificación de facturas", "Compras", ["Compras", "Jefatura"]],
    evaluaciones: ["Evaluación de proveedores", "Control", ["Compras", "Jefatura"]],
    recepciones: ["Órdenes de ingreso", "Recepción", ["Almacén", "Jefatura"]],
    tratamientos: ["Deterioro, reparación y bajas", "Recepción", ["Almacén", "Jefatura"]],
    inventario: ["Kardex valorizado", "Almacenes", ["Almacén", "Compras", "Jefatura"]],
    almacenes: ["Almacenes", "Almacenes", ["Almacén", "Compras", "Jefatura"]],
    ubicaciones: ["Ubicaciones", "Almacenes", ["Almacén", "Compras", "Jefatura"]],
    reubicaciones: ["Reubicaciones internas", "Almacenes", ["Almacén", "Jefatura"]],
    reservas: ["Reservas", "Distribución", ["Almacén", "Jefatura"]],
    picking: ["Picking y embalaje", "Distribución", ["Almacén", "Jefatura"]],
    despachos: ["Órdenes de salida", "Distribución", ["Almacén", "Transporte", "Jefatura"]],
    retornos: ["Retornos y devoluciones", "Recepción", ["Almacén", "Jefatura"]],
    traslados: ["Traslados entre sedes", "Almacenes", ["Almacén", "Compras", "Jefatura"]],
    conteos: ["Inventario físico", "Almacenes", ["Almacén", "Jefatura"]],
    acciones: ["Acciones de mejora", "Control", ["Compras", "Almacén", "Jefatura"]],
    control: ["Indicadores logísticos", "Control", ["Compras", "Almacén", "Transporte", "Jefatura"]]
  };

  const pasosCompra = [
    ["requisiciones", "Solicitar compra", "Compras"], ["peticionesOferta", "Pedir y comparar ofertas", "Compras"],
    ["ordenes", "Emitir orden", "Compras"], ["recepciones", "Recibir e inspeccionar", "Almacén"], ["facturas", "Verificar factura", "Compras"]
  ];
  const pasosDespacho = [["reservas", "Reservar", "Almacén"], ["picking", "Preparar y embalar", "Almacén"], ["despachos", "Despachar y entregar", "Transporte"]];
  const flujo = window.RecorridosLogistica({ c, C, e, accion: b, enlace, compra, almacen, transporte, jefatura });
  const tramoCompra = vista => vista === "ofertas" ? "peticionesOferta" : vista;

  function mostrarRuta(titulo, pasos, actual) {
    if (!pasos.some(([id]) => permitir(secciones[id][2]))) return "";
    return c.recorrido.etapas(titulo, pasos.map(([id, etiqueta, responsable]) => ({
      id, etiqueta, responsable, ruta: permitir(secciones[id][2]) ? modulo + "/" + id : ""
    })), actual);
  }

  function rutaDe(vista) {
    const etapa = tramoCompra(vista);
    if (pasosCompra.some(([id]) => id === etapa)) return mostrarRuta("Recorrido de compra", pasosCompra, etapa);
    if (pasosDespacho.some(([id]) => id === vista)) return mostrarRuta("Recorrido de entrega", pasosDespacho, vista);
    return "";
  }

  function admite(id) {
    if (!actor()) return false;
    return id === "compras" ? compra() : id === "despachos" ? permitir(["Almacén", "Transporte", "Jefatura"]) : permitir(["Asesor", "Compras", "Almacén", "Transporte", "Jefatura"]);
  }

  function cabecera(titulo, texto, botones) {
    return c.cabeceraVista(titulo, texto, botones, "LOGÍSTICA / " + c.sedeNombre(actor().sede));
  }

  function dibujar(idModulo, partes) {
    modulo = idModulo;
    c.$("#accesos-rapidos").hidden = true;
    document.title = `${idModulo === "compras" ? "Compras" : idModulo === "despachos" ? "Despachos" : "Logística"} · FAMIHOGAR`;
    if (!admite(idModulo)) {
      c.$("#navegacion").innerHTML = "";
      c.$("#contenido").innerHTML = cabecera("Logística", "Esta área no tiene operaciones para tu rol.") + '<a class="boton" href="#aplicaciones">Volver a aplicaciones</a>';
      return;
    }
    vistaActual = secciones[partes[1]] ? partes[1] : idModulo === "compras" ? "ordenes" : idModulo === "despachos" ? "despachos" : "resumen";
    const permitidas = Object.entries(secciones).filter(([, s]) => permitir(s[2]));
    const grupo = secciones[vistaActual]?.[1] || "Inicio";
    c.$("#navegacion").setAttribute("aria-label", "Procesos logísticos");
    const grupos = [...new Set(permitidas.map(([, s]) => s[1]))];
    c.$("#navegacion").innerHTML = grupos.map(g => `<button type="button" data-log-vista="${permitidas.find(([, s]) => s[1] === g)[0]}" data-log-grupo="${e(g)}" ${g === grupo ? 'aria-current="page"' : ""}>${g}</button>`).join("");
    const ruta = rutaDe(vistaActual);
    const etapas = grupo === "Distribución" ? pasosDespacho : pasosCompra;
    const otras = permitidas.filter(([id, s]) => id !== "resumen" && s[1] === grupo && (!ruta || !etapas.some(([etapa]) => etapa === id)));
    const menu = otras.length ? `<div class="log-submenu" aria-label="Otras opciones del proceso">${otras.map(([id, s]) => `<button type="button" data-log-vista="${id}" ${id === vistaActual ? 'aria-current="page"' : ""}>${s[0]}</button>`).join("")}</div>` : "";
    const sub = ruta + menu;
    try {
      if (partes[1] === "pedido" && partes[2]) { fichaPedido(partes[2]); return; }
      L.exigir(permitir(secciones[vistaActual][2]), "No tienes acceso a ese proceso logístico.");
      if (partes[2]) ficha(vistaActual, partes[2], sub);
      else c.$("#contenido").innerHTML = sub + lista(vistaActual);
    } catch (error) { c.$("#contenido").innerHTML = cabecera("Logística") + `<p class="tarjeta vacio error">${e(error.message)}</p>`; }
    c.$("#contenido").focus();
  }

  function lista(vista) {
    if (vista === "resumen") return resumen();
    if (vista === "inventario") return inventario();
    if (vista === "planificacion") return planificacion();
    if (vista === "control") return control();
    const d = datos(), filas = propios(d[vista] || [], vista === "traslados");
    const nuevos = {
      proveedores: compra() ? b("+ Nuevo proveedor", "proveedor", "", "boton primario") : "",
      requisiciones: b("+ Nueva solicitud de pedido", "requisicion", "", "boton primario"),
      peticionesOferta: compra() ? b("+ Pedir ofertas", "peticion", "", "boton primario") : "",
      ofertas: compra() ? b("+ Registrar oferta", "oferta", "", "boton primario") : "",
      acuerdos: compra() ? b("+ Nuevo acuerdo", "acuerdo", "", "boton primario") : "",
      ordenes: compra() ? b("+ Preparar orden de compra", "orden", "", "boton primario") : "",
      recepciones: almacen() ? b("+ Crear orden de ingreso", "recepcion", "", "boton primario") : "",
      tratamientos: almacen() ? b("+ Solicitar tratamiento", "tratamiento", "", "boton primario") : "",
      almacenes: jefatura() ? b("+ Nuevo almacén", "almacen", "", "boton primario") : "",
      ubicaciones: jefatura() ? b("+ Nueva ubicación", "ubicacion", "", "boton primario") : "",
      reubicaciones: almacen() ? b("+ Reubicar existencias", "reubicacion", "", "boton primario") : "",
      facturas: compra() ? b("+ Verificar factura", "factura", "", "boton primario") : "",
      reservas: almacen() ? b("+ Reservar pedido", "reserva", "", "boton primario") : "",
      picking: almacen() ? b("+ Generar picking", "picking", "", "boton primario") : "",
      despachos: almacen() ? b("+ Crear orden de salida", "despacho", "", "boton primario") : "",
      retornos: almacen() ? b("+ Recibir devolución", "devolucion", "", "boton primario") : "",
      traslados: b("+ Solicitar traslado", "traslado", "", "boton primario"),
      conteos: b("+ Registrar conteo", "conteo", "", "boton primario"),
      evaluaciones: b("+ Evaluar proveedor", "evaluacion", "", "boton primario"),
      acciones: b("+ Nueva acción", "accion", "", "boton primario")
    };
    if (["almacenes", "ubicaciones"].includes(vista)) return c.zonaTrabajo("Operaciones logísticas", cabecera(secciones[vista][0], "Maestros de la sede; los cambios conservan historial.", nuevos[vista]))
      + c.zonaTrabajo("Registros de la sección", c.tabla(secciones[vista][0], ["Nombre", "Almacén / código", "Capacidad / estados", "Estado"], filas.map(r => `<tr><td>${enlace(r.nombre, `${vista}/${r.id}`)}</td><td>${e(r.almacen ? nombreAlmacen(r.almacen) + " / " + r.codigo : r.numero || r.id)}</td><td>${r.capacidad ? `${r.capacidad} unidades · ${e(r.estados.join(", "))}` : e(r.direccion)}</td><td>${c.etiqueta(r.activo === false ? "Inactivo" : "Activo")}</td></tr>`)));
    if (vista === "ofertas") return c.zonaTrabajo("Operaciones logísticas", cabecera(secciones[vista][0], "Compara precio, plazo y calidad antes de adjudicar.", nuevos[vista]))
      + c.zonaTrabajo("Registros de la sección", c.tabla("Ofertas recibidas", ["Oferta", "Proveedor", "Petición", "Base sin IGV", "Plazo / calidad", "Vigencia", "Estado"], filas.map(o => `<tr><td>${enlace(o.numero, `ofertas/${o.id}`)}</td><td>${e(nombreProveedor(o.proveedorId))}</td><td>${e(d.peticionesOferta.find(p => p.id === o.peticionId)?.numero)}</td><td class="numero">${monedas(o.base)}</td><td>${o.plazoDias} días / ${o.calidad} de 5</td><td>${c.fechaCorta(o.vigenteHasta)}</td><td>${c.etiqueta(o.estado)}</td></tr>`)));
    if (vista === "proveedores") return c.zonaTrabajo("Operaciones logísticas", cabecera(secciones[vista][0], "Altas y modificaciones con revisión independiente.", nuevos[vista]))
      + c.zonaTrabajo("Registros de la sección", c.tabla("Proveedores", ["Proveedor", "RUC", "Contacto", "Condición", "Estado"], filas.map(p => `<tr><td>${enlace(p.nombre, `proveedores/${p.id}`)}</td><td>${e(p.ruc)}</td><td>${e(p.correo)}<small>${e(p.telefono)}</small></td><td>${e(p.condicion)}</td><td>${c.etiqueta(p.estado)}${p.propuesta ? " · Cambio pendiente" : ""}</td></tr>`)));
    const descripcion = { requisiciones: "Empieza aquí si necesitas comprar. Abre una solicitud para aprobarla o seguir con las ofertas.",
      peticionesOferta: "Abre la petición para registrar y comparar las ofertas de la misma compra.",
      ordenes: "Prepara la orden desde una oferta adjudicada o acuerdo vigente. En la ficha puedes aprobarla, emitirla y registrar la confirmación.",
      recepciones: "Selecciona una orden con unidades pendientes. Después de registrar el ingreso, inspecciona el lote.",
      facturas: "Coteja la factura con una orden y su recepción conforme. Una factura verificada pasa a Finanzas.", reservas: "La reserva compromete stock; la salida se registra al despachar.", despachos: "Picking, salida, transporte y confirmación de entrega.", retornos: "La recepción física no emite notas de crédito ni registra pagos.", traslados: "Salida y recepción independientes entre almacenes.", conteos: "Ajustes con motivo, revisión y control de reservas." };
    return c.zonaTrabajo("Operaciones logísticas", cabecera(secciones[vista][0], descripcion[vista] || "Documentos, responsables y seguimiento de la sede.", nuevos[vista]))
      + c.zonaTrabajo("Registros de la sección", c.tabla(secciones[vista][0], ["Documento", "Referencia", "Responsable", "Estado"], filas.map(registro => `<tr><td>${enlace(registro.numero || registro.nombre, `${vista}/${registro.id}`)}</td><td>${e(registro.pedidoNumero || registro.origen || registro.documento || registro.descripcion || registro.motivo || registro.causa || "—")}</td><td>${e(registro.registradoPor)}</td><td>${c.etiqueta(registro.estado)}</td></tr>`)));
  }

  function resumen() {
    const d = datos();
    const valores = [["Solicitudes de pedido pendientes", propios(d.requisiciones).filter(r => r.estado === "Pendiente").length], ["Órdenes vigentes", propios(d.ordenes).filter(o => !["Anulada", "Rechazada"].includes(o.estado)).length], ["Órdenes de ingreso por inspeccionar", propios(d.recepciones).filter(r => r.lineas.some(l => C.pendienteInspeccion(l) > 0)).length], ["Entregas en ruta", propios(d.despachos).filter(d => d.estado === "En ruta").length]];
    const grupos = Object.entries(secciones).filter(([id, s]) => id !== "resumen" && permitir(s[2]));
    return c.zonaTrabajo("Procesos logísticos", cabecera("Panel logístico", "Elige una etapa para empezar o retomar un proceso.")
      + mostrarRuta("Recorrido de compra", pasosCompra) + mostrarRuta("Recorrido de entrega", pasosDespacho))
      + c.zonaTrabajo("Actividad y operaciones logísticas", `<div class="indicadores">${valores.map(([titulo, cantidad]) => `<div class="tarjeta indicador"><small>${titulo}</small><strong>${cantidad}</strong></div>`).join("")}</div><details class="recorrido-detalles"><summary>Todas las operaciones logísticas</summary><div class="grupos">${[...new Set(grupos.map(([, s]) => s[1]))].map(grupo => `<section class="tarjeta grupo"><h2>${grupo}</h2>${grupos.filter(([, s]) => s[1] === grupo).map(([id, s]) => `<button type="button" data-log-vista="${id}">${s[0]} <span>→</span></button>`).join("")}</section>`).join("")}</div></details>`);
  }

  function inventario() {
    if (evaluacionKardex) return vistaEvaluacionKardex();
    const d = datos(), saldos = L.existencias(d, productos(), actor().sede), productosAprobados = productos().filter(p => p.estado === "Aprobado");
    const tabla = c.tabla("Existencias por almacén", ["Almacén", "Producto", "Físico", "Reservado", "Retenido por calidad", "Disponible", "Cuarentena", "Dañado", "En reparación"], saldos.map(s => `<tr><td>${e(nombreAlmacen(s.almacen))}</td><td>${e(nombreProducto(s.codigo))}</td><td>${s.fisico}</td><td>${s.reservado}</td><td>${s.retenido}</td><td>${s.disponible}</td><td>${s.cuarentena}</td><td>${s.danado}</td><td>${s.enReparacion}</td></tr>`));
    if (!productosAprobados.some(p => p.codigo === productoKardex)) productoKardex = productosAprobados[0]?.codigo || "";
    const selector = campo("Producto de la tarjeta", "kardexProducto", select("kardexProducto", productosAprobados.map(p => [p.codigo, `${p.codigo} · ${p.nombre}`]), productoKardex, 'data-kardex-producto'));
    const kardex = L.kardexValorizado(d, productos(), actor().sede).filter(m => m.codigo === productoKardex).slice().reverse();
    const botones = (jefatura() ? b("Resolver cuarentena", "cuarentena") : "") + b("Ejecutar escenario de evaluación", "evaluacion-kardex");
    return c.zonaTrabajo("Existencias y acciones de inventario", cabecera("Kardex valorizado", "Existencias por almacén y tarjeta cronológica del producto seleccionado.", botones) + tabla)
      + c.zonaTrabajo("Movimientos valorizados", `<section class="tarjeta"><div class="barra-tabla"><h2>Kardex valorizado</h2>${selector}</div><p class="texto-suave">Método aplicado: promedio ponderado móvil por producto y sede.</p><div class="tabla-desplazable"><table class="kardex-valorizado"><thead><tr><th scope="col" rowspan="2">Fecha</th><th scope="col" rowspan="2">Tipo de movimiento</th><th scope="colgroup" colspan="3">Entradas</th><th scope="colgroup" colspan="3">Salidas</th><th scope="colgroup" colspan="3">Saldos finales</th><th scope="col" rowspan="2">Almacén</th><th scope="col" rowspan="2">Ubicación / lote</th><th scope="col" rowspan="2">Estado</th><th scope="col" rowspan="2">Documento</th></tr><tr><th scope="col">Cantidad</th><th scope="col">Costo unitario</th><th scope="col">Costo total</th><th scope="col">Cantidad</th><th scope="col">Costo unitario</th><th scope="col">Costo total</th><th scope="col">Cantidad</th><th scope="col">Costo unitario</th><th scope="col">Costo total</th></tr></thead><tbody>${kardex.map(m => `<tr><td>${c.fechaCorta(m.fecha)}</td><td>${e(m.tipo)}</td>${m.cantidad > 0 ? `<td>${m.cantidad}</td><td class="numero">${monedas(m.costoUnitarioMovimiento)}</td><td class="numero">${monedas(m.importeMovimiento)}</td><td>—</td><td>—</td><td>—</td>` : `<td>—</td><td>—</td><td>—</td><td>${Math.abs(m.cantidad)}</td><td class="numero">${monedas(m.costoUnitarioMovimiento)}</td><td class="numero">${monedas(Math.abs(m.importeMovimiento))}</td>`}<td>${m.saldoFinalCantidad}</td><td class="numero">${monedas(m.costoUnitarioFinal)}</td><td class="numero">${monedas(m.saldoFinal)}</td><td>${e(nombreAlmacen(m.almacen))}</td><td>${e(m.ubicacion)} / ${e(m.lote)}</td><td>${e(m.calidad)}</td><td>${e(m.referencia || m.numero)}</td></tr>`).join("") || '<tr><td colspan="15" class="vacio">No hay movimientos para este producto en la sede.</td></tr>'}</tbody></table></div></section>`);
  }

  function vistaEvaluacionKardex() {
    const r = evaluacionKardex, resumen = r.salida;
    const filas = r.movimientos.map(m => `<tr><td>${c.fechaCorta(m.fecha)}</td><td>${e(m.tipo)}</td>${m.cantidad > 0 ? `<td>${m.cantidad}</td><td class="numero">${monedas(m.costoUnitarioMovimiento)}</td><td class="numero">${monedas(m.importeMovimiento)}</td><td>—</td><td>—</td><td>—</td>` : `<td>—</td><td>—</td><td>—</td><td>${Math.abs(m.cantidad)}</td><td class="numero">${monedas(m.costoUnitarioMovimiento)}</td><td class="numero">${monedas(Math.abs(m.importeMovimiento))}</td>`}<td>${m.saldoFinalCantidad}</td><td class="numero">${monedas(m.costoUnitarioFinal)}</td><td class="numero">${monedas(m.saldoFinal)}</td><td>${e(m.almacen)}</td><td>${e(m.ubicacion)} / ${e(m.lote)}</td><td>${e(m.calidad)}</td><td>${e(m.referencia)}</td></tr>`).join("");
    const documentos = r.documentos;
    return cabecera("Escenario de evaluación del Kardex", "Recorrido ficticio ejecutado con las reglas del ERP. No se guarda en tus operaciones.", b("Volver al Kardex de la aplicación", "cerrar-evaluacion-kardex")) +
      `<div class="aviso-evaluacion"><strong>Datos temporales de evaluación.</strong> Las aprobaciones, oferta, factura, pedido y constancia son ficticios. Esta vista no modifica inventario ni localStorage de la aplicación.</div>
      <div class="indicadores"><div class="tarjeta indicador"><small>Método</small><strong>${e(r.metodo)}</strong></div><div class="tarjeta indicador"><small>Saldo inicial</small><strong>12 · ${monedas(1260000)}</strong></div><div class="tarjeta indicador"><small>Costo unitario de salida</small><strong>${monedas(resumen.costoUnitarioMovimiento)}</strong></div><div class="tarjeta indicador"><small>Saldo final</small><strong>${resumen.saldoFinalCantidad} · ${monedas(resumen.saldoFinal)}</strong></div></div>
      <section class="tarjeta"><h2>Movimientos de ${e(r.producto)} · ${e(r.sede)}</h2><div class="tabla-desplazable"><table class="kardex-valorizado"><thead><tr><th rowspan="2">Fecha</th><th rowspan="2">Tipo de movimiento</th><th colspan="3">Entradas</th><th colspan="3">Salidas</th><th colspan="3">Saldos finales</th><th rowspan="2">Almacén</th><th rowspan="2">Ubicación / lote</th><th rowspan="2">Estado</th><th rowspan="2">Documento</th></tr><tr><th>Cantidad</th><th>Costo unitario</th><th>Costo total</th><th>Cantidad</th><th>Costo unitario</th><th>Costo total</th><th>Cantidad</th><th>Costo unitario</th><th>Costo total</th></tr></thead><tbody>${filas}</tbody></table></div></section>
      <section class="tarjeta"><h2>Trazabilidad de la evaluación</h2><ol>${r.trazabilidad.map(x => `<li>${e(x)}</li>`).join("")}</ol><p class="texto-suave">Referencia clave de la salida: ${e(resumen.numero)} → ${e(documentos.despacho.numero)}. La factura quedó verificada, sin registrar pago.</p><p class="texto-suave">Prueba este mismo escenario otra vez con el botón del Kardex; cada ejecución crea una copia temporal separada.</p></section>`;
  }
  function planificacion() {
    const d = datos(), periodo = hoy().slice(0, 7);
    const plan = L.planificar(d, productos(), A.pedidos(actor().sede), A.config, actor().sede, periodo);
    return c.zonaTrabajo("Operaciones logísticas", cabecera("Planificación y reposición", "Demanda comercial, previsión, inventario y compras en camino.", b("Registrar previsión", "prevision") + (jefatura() ? b("Parámetros de reposición", "parametros") : "")))
      + c.zonaTrabajo("Registros de la sección", c.tabla(`Necesidades de ${periodo}`, ["Producto", "Disponible", "Demanda pendiente", "En camino", "Proyectado", "Mín. / objetivo", "Sugerido"], plan.map(p => `<tr><td>${e(nombreProducto(p.codigo))}</td><td>${p.disponible}</td><td>${p.demanda}</td><td>${p.enCamino}</td><td>${p.proyectado}</td><td>${p.minimo} / ${p.objetivo}</td><td>${p.sugerido ? b(`Solicitar ${p.sugerido}`, "sugerencia", `${p.almacen}|${p.codigo}|${p.sugerido}`) : "—"}</td></tr>`)));
  }

  function control() {
    const d = datos(), recepciones = propios(d.recepciones), entregas = propios(d.despachos).filter(x => ["Entregado", "Entrega parcial", "No entregado"].includes(x.estado));
    const lineasCalidad = recepciones.flatMap(r => r.lineas), inspeccionadas = lineasCalidad.reduce((n, l) => n + l.cantidad - C.pendienteInspeccion(l), 0);
    const conformidad = inspeccionadas ? Math.round(lineasCalidad.reduce((n, l) => n + l.conforme, 0) * 100 / inspeccionadas) + " %" : "Sin inspecciones";
    const otif = entregas.length ? Math.round(entregas.filter(e => e.estado === "Entregado" && e.entregadoEn <= e.entregaPrevista).length * 100 / entregas.length) + " %" : "Sin entregas";
    const conteos = propios(d.conteos).filter(x => x.estado === "Aprobado").flatMap(x => x.lineas);
    const exactitud = conteos.length ? Math.round(conteos.filter(l => l.diferencia === 0).length * 100 / conteos.length) + " %" : "Sin conteos";
    const quiebres = L.existencias(d, productos(), actor().sede).filter(s => s.disponible <= 0).length;
    const metricas = [["Entrega a tiempo y completa", otif], ["Conformidad de recepción", conformidad], ["Exactitud del conteo", exactitud], ["Posiciones sin disponible", quiebres], ["Facturas observadas", propios(d.facturas).filter(f => f.estado === "Observada").length], ["Acciones abiertas", propios(d.acciones).filter(a => a.estado !== "Completada").length]];
    return cabecera("Control de gestión logística", "Indicadores calculados desde recepciones, entregas y conteos registrados.") + `<div class="indicadores">${metricas.map(([titulo, valor]) => `<div class="tarjeta indicador"><small>${titulo}</small><strong class="importe-indicador">${valor}</strong></div>`).join("")}</div>` + c.tabla("Incidencias y acciones", ["Acción", "Causa", "Responsable", "Plazo", "Estado"], propios(d.acciones).map(a => `<tr><td>${enlace(a.numero, `acciones/${a.id}`)}</td><td>${e(a.causa)}</td><td>${e(a.responsable)}</td><td>${c.fechaCorta(a.plazo)}</td><td>${c.etiqueta(a.estado)}</td></tr>`));
  }

  function detalles(registro) {
    const campos = { codigo: "Código", calidadFinal: "Calidad tras reinspección", fechaReinspeccion: "Fecha de reinspección", tipo: "Operación", capacidad: "Capacidad (unidades)", cantidad: "Cantidad", aprobadoPor: "Autorizado por", reparadoPor: "Reparado por", reinspeccionadoPor: "Reinspeccionado por", ruc: "RUC", correo: "Correo", telefono: "Teléfono", direccion: "Dirección", condicion: "Condición de pago", requerida: "Fecha requerida", entregaPrevista: "Entrega prevista", fecha: "Fecha", entregadoEn: "Fecha de entrega", fechaRecepcion: "Recepción física", vigenteHasta: "Vigencia", motivo: "Motivo", registradoPor: "Registrado por", responsable: "Responsable", plazo: "Plazo", causa: "Causa", descripcion: "Acción", documento: "Documento de proveedor", lote: "Lote", ubicacion: "Ubicación", almacen: "Almacén", origen: "Origen", destino: "Destino", transportista: "Transportista", placa: "Vehículo", receptor: "Receptor", evidencia: "Evidencia / constancia", guia: "Guía interna", baseInformada: "Base informada", baseCalculada: "Base calculada", igv: "IGV", pago: "Gestión financiera", plazoDias: "Plazo (días)", calidad: "Calidad", comentario: "Comentario", unidadesRecibidas: "Unidades recibidas", unidadesConformes: "Unidades conformes", recepciones: "Recepciones evaluadas", aTiempo: "A tiempo", conformes: "Conformes" };
    const cabecera = `${registro.sede ? `<div><dt>Sede</dt><dd>${e(c.sedeNombre(registro.sede))}</dd></div>` : ""}${registro.cliente ? `<div><dt>Cliente</dt><dd>${e(registro.cliente.nombre)}</dd></div>` : ""}`;
    return `<dl class="detalle-documento">${cabecera}${Object.entries(campos).filter(([clave]) => registro[clave] != null && typeof registro[clave] !== "object").map(([clave, titulo]) => `<div><dt>${["Deterioro", "Reparación", "Baja"].includes(registro.tipo) && ["ubicacion", "calidad"].includes(clave) ? titulo + " de origen" : clave === "codigo" && registro.tipo ? "Producto" : titulo}</dt><dd>${clave === "codigo" && registro.tipo ? e(registro.codigo + " · " + (registro.nombre || nombreProducto(registro.codigo))) : ["baseInformada", "baseCalculada", "igv"].includes(clave) ? monedas(registro[clave]) : clave === "almacen" || ["origen", "destino"].includes(clave) && String(registro[clave]).startsWith("alm-") ? e(nombreAlmacen(registro[clave])) : e(registro[clave])}</dd></div>`).join("")}</dl>`;
  }

  function lineasTabla(lineas, precios = false) {
    if (lineas.some(l => l.conforme != null)) return c.tabla("Resultado por producto", ["Producto", "Recibido", "Pendiente", "Conforme", "Observado", "En reparación", "Devuelto", "Baja"], lineas.map(l => `<tr><td>${e(l.nombre || nombreProducto(l.codigo))}</td><td>${l.cantidad}</td><td>${C.pendienteInspeccion(l)}</td><td>${l.conforme}</td><td>${l.noConforme}</td><td>${l.enReparacion}</td><td>${l.devuelta}</td><td>${l.baja}</td></tr>`), false);
    if (lineas.some(l => l.teorico != null)) return c.tabla("Detalle del conteo", ["Producto", "Ubicación / lote", "Calidad", "Teórico", "Contado", "Diferencia"], lineas.map(l => `<tr><td>${e(l.nombre || nombreProducto(l.codigo))}</td><td>${e(l.ubicacion)} / ${e(l.lote)}</td><td>${e(l.calidad)}</td><td>${l.teorico}</td><td>${l.contado}</td><td>${l.diferencia > 0 ? "+" : ""}${l.diferencia}</td></tr>`), false);
    return c.tabla("Detalle", ["Producto", "Cantidad", ...(precios ? ["Precio sin IGV", "Importe"] : []), "Ubicación / lote"], lineas.map(l => `<tr><td>${e(l.nombre || nombreProducto(l.codigo))}<small>${e(l.codigo)}</small></td><td>${l.cantidad ?? l.contado}${l.entregada != null ? `<small>Entregado: ${l.entregada}</small>` : ""}</td>${precios ? `<td class="numero">${monedas(l.precio)}</td><td class="numero">${monedas(l.precio * l.cantidad)}</td>` : ""}<td>${e(l.ubicacion || "—")} / ${e(l.lote || "—")}</td></tr>`), false);
  }

  function relacionados(vista, registro) {
    const d = datos(), refs = [];
    const agregar = (coleccion, id, titulo) => { const r = d[coleccion]?.find(r => r.id === id); if (r) refs.push(enlace(`${titulo}: ${r.numero || r.nombre}`, `${coleccion}/${id}`)); };
    if (registro.requisicionId) agregar("requisiciones", registro.requisicionId, "Necesidad");
    if (registro.peticionId) agregar("peticionesOferta", registro.peticionId, "Petición");
    if (registro.ofertaId) agregar("ofertas", registro.ofertaId, "Oferta");
    if (registro.ordenId) agregar("ordenes", registro.ordenId, "Orden");
    if (registro.recepcionId) agregar("recepciones", registro.recepcionId, "Recepción");
    if (registro.reservaId) agregar("reservas", registro.reservaId, "Reserva");
    if (registro.pickingId) agregar("picking", registro.pickingId, "Picking");
    if (registro.despachoId) agregar("despachos", registro.despachoId, "Despacho");
    if (registro.pedidoId) refs.push(enlace(`Pedido comercial: ${registro.pedidoNumero || registro.pedidoId}`, `pedido/${registro.pedidoId}`));
    for (const [col, clave] of [["peticionesOferta", "requisicionId"], ["ofertas", "peticionId"], ["ordenes", "requisicionId"], ["recepciones", "ordenId"], ["facturas", "ordenId"], ["picking", "reservaId"], ["despachos", "pickingId"], ["retornos", "despachoId"], ["tratamientos", "recepcionId"]]) {
      for (const derivado of d[col].filter(r => r[clave] === registro.id)) refs.push(enlace(derivado.numero, `${col}/${derivado.id}`));
    }
    return refs.length ? `<h3>Origen y documentos relacionados</h3><div class="referencias-documento">${refs.join(" · ")}</div>` : "";
  }

  function ficha(vista, id, sub) {
    const d = datos(), registro = d[vista]?.find(r => r.id === id && (!r.sede || r.sede === actor().sede || vista === "traslados" && r.sedeDestino === actor().sede));
    L.exigir(registro && (actor().rol !== "Asesor" || registro.registradoPor === actor().nombre), "Documento no encontrado en esta sede.");
    if (vista === "facturas") {
      const pago = window.Finanzas?.consultarPagoFactura(registro.id, registro.sede);
      if (pago) registro.pago = pago.estado;
    }
    const paso = flujo.siguiente(vista, d, registro);
    const contenido = `<article class="ficha"><div class="cabecera-documento"><h3>${e(registro.numero || registro.nombre)}</h3>${c.etiqueta(registro.estado)}</div>${registro.proveedorId ? `<p>Proveedor: ${e(registro.proveedor?.nombre || nombreProveedor(registro.proveedorId))}</p>` : ""}${detalles(registro)}${registro.lineas ? lineasTabla(registro.lineas, ["ofertas", "ordenes", "acuerdos", "facturas"].includes(vista)) : ""}${registro.base != null ? `<p class="numero"><strong>Base sin IGV: ${monedas(registro.base)}</strong></p>` : ""}${registro.observaciones?.length ? `<h3>Diferencias del cotejo</h3><ul>${registro.observaciones.map(o => `<li>${e(o)}</li>`).join("")}</ul>` : ""}${registro.propuesta ? `<h3>Cambio propuesto</h3>${detalles(registro.propuesta)}<p>${e(registro.propuesta.nombre)}</p>` : ""}${registro.recibidas ? `<h3>Recepción del traslado</h3><p>${Object.entries(registro.recibidas).map(([codigo, cantidad]) => `${e(nombreProducto(codigo))}: ${cantidad}`).join(" · ") || "Pendiente en destino"}</p>` : ""}${relacionados(vista, registro)}<details class="recorrido-detalles"><summary>Historial del documento</summary>${c.mostrarHistorial(registro.historial || [])}</details></article>`;
    const secundarias = accionesFicha(vista, registro, paso?.comando) + b("Imprimir ficha", "imprimir");
    const acciones = `<div class="acciones-documento">${secundarias}</div>`;
    const mostrarSecundarias = paso ? `<details class="recorrido-detalles acciones-adicionales"><summary>Otras acciones</summary>${acciones}</details>`
      : `<div class="tarjeta acciones-adicionales">${acciones}</div>`;
    c.$("#contenido").innerHTML = c.zonaTrabajo("Acciones del documento", sub
      + cabecera(secciones[vista][0], registro.numero || registro.nombre, enlace("← Volver al listado", vista))
      + c.recorrido.siguiente(paso) + mostrarSecundarias)
      + c.zonaTrabajo("Detalle del documento", (vista === "peticionesOferta" ? ofertasPeticion(d, registro) : "")
        + `<section class="tarjeta ficha-completa">${contenido}</section>`);
    prepararImpresion(contenido);
  }

  function ofertasPeticion(d, registro) {
    const ofertas = d.ofertas.filter(o => o.peticionId === registro.id);
    if (!ofertas.length) return "";
    return c.tabla("Ofertas de esta petición", ["Oferta", "Proveedor", "Base sin IGV", "Plazo", "Calidad", "Estado"], ofertas.map(o =>
      `<tr><td>${enlace(o.numero, "ofertas/" + o.id)}</td><td>${e(nombreProveedor(o.proveedorId))}</td><td>${monedas(o.base)}</td><td>${o.plazoDias} días</td><td>${o.calidad} de 5</td><td>${c.etiqueta(o.estado)}</td></tr>`), false);
  }

  function fichaPedido(id) {
    const pedido = A.pedidos(actor().sede).find(p => p.id === id);
    L.exigir(pedido, "Pedido no encontrado en esta sede.");
    c.$("#contenido").innerHTML = cabecera(pedido.numero, "Referencia comercial de solo consulta.") + `<section class="tarjeta ficha-completa"><p>Cliente: ${e(pedido.cliente.nombre)}</p><p>Dirección: ${e(pedido.cliente.direccion)}</p><p>Entrega propuesta: ${e(pedido.entrega)}</p>${lineasTabla(pedido.lineas)}${c.etiqueta(pedido.estado)}</section>`;
  }

  function prepararImpresion(contenido) {
    document.querySelector(".vista-imprimir")?.remove();
    const ficha = document.createElement("div"); ficha.className = "vista-imprimir";
    ficha.innerHTML = c.$(".marca").outerHTML + contenido;
    ficha.querySelectorAll("button").forEach(boton => boton.replaceWith(document.createTextNode(boton.textContent)));
    ficha.querySelectorAll("details").forEach(detalle => { detalle.open = true; });
    document.body.append(ficha); document.body.classList.add("imprimir-documento");
  }

  function accionesFicha(vista, r, principal) {
    const opcion = (texto, comando, id) => comando === principal ? "" : b(texto, comando, id);
    let html = "";
    if (vista === "almacenes" && jefatura()) html += opcion("Editar almacén", "almacen", r.id);
    if (vista === "ubicaciones" && jefatura()) html += opcion("Editar ubicación", "ubicacion", r.id);
    if (vista === "tratamientos") {
      if (jefatura() && r.estado === "Pendiente") html += opcion("Autorizar tratamiento", "aprobar-tratamiento", r.id) + opcion("Rechazar", "rechazar-tratamiento", r.id);
      if (almacen() && r.estado === "En reparación") html += opcion("Presentar reparación", "terminar-reparacion", r.id);
      if (jefatura() && r.estado === "Por reinspeccionar") html += opcion("Reinspeccionar", "reinspeccion", r.id);
    }
    if (vista === "proveedores" && compra() && r.estado === "Aprobado" && !r.propuesta) html += opcion("Proponer actualización", "proveedor", r.id);
    if (vista === "proveedores" && jefatura() && (r.estado === "Pendiente" || r.propuesta)) html += opcion("Aprobar", "aprobar-proveedor", r.id) + opcion("Rechazar", "rechazar-proveedor", r.id);
    if (vista === "requisiciones" && jefatura() && r.estado === "Pendiente") html += opcion("Aprobar solicitud de pedido", "aprobar-requisicion", r.id) + opcion("Rechazar", "rechazar-requisicion", r.id);
    if (vista === "ofertas" && jefatura() && r.estado === "Recibida") html += opcion("Adjudicar proveedor", "adjudicar", r.id);
    if (vista === "acuerdos" && jefatura() && r.estado === "Pendiente") html += opcion("Aprobar acuerdo", "aprobar-acuerdo", r.id) + opcion("Rechazar", "rechazar-acuerdo", r.id);
    if (vista === "ordenes") {
      if (jefatura() && r.estado === "Pendiente") html += opcion("Aprobar orden", "aprobar-orden", r.id) + opcion("Rechazar", "rechazar-orden", r.id);
      if (compra() && r.estado === "Aprobada") html += opcion("Marcar emitida", "emitir-orden", r.id);
      if (compra() && r.estado === "Emitida") html += opcion("Confirmación del proveedor", "confirmar-orden", r.id);
      if (jefatura() && !["Anulada", "Rechazada"].includes(r.estado)) html += opcion("Anular orden", "anular-orden", r.id);
    }
    if (vista === "recepciones" && almacen()) {
      if (r.lineas.some(l => C.pendienteInspeccion(l) > 0)) html += opcion("Registrar inspección", "inspeccion", r.id);
      if (r.lineas.some(l => l.noConforme > 0)) html += opcion("Devolver al proveedor", "devolver-proveedor", r.id) + opcion("Tratar no conformes", "tratamiento-recepcion", r.id);
    }
    if (vista === "reservas" && almacen() && r.estado === "Activa") html += opcion("Liberar reserva", "liberar-reserva", r.id);
    if (vista === "facturas" && compra() && r.estado === "Observada") html += opcion("Revalidar cotejo", "revalidar-factura", r.id);
    if (vista === "picking" && almacen()) {
      if (r.estado === "Pendiente") html += opcion("Confirmar preparación", "preparar-picking", r.id);
      if (r.estado === "Preparado") html += opcion("Confirmar embalaje", "embalar-picking", r.id);
      if (["Pendiente", "Preparado", "Embalado"].includes(r.estado)) html += opcion("Anular picking", "anular-picking", r.id);
    }
    if (vista === "despachos" && transporte()) {
      if (r.estado === "Preparado") html += opcion("Confirmar salida a ruta", "ruta", r.id);
      if (r.estado === "En ruta") html += opcion("Confirmar entrega", "entrega", r.id);
    }
    if (vista === "retornos" && almacen() && r.estado === "Pendiente" && !r.comercial) html += opcion("Recibir retorno físico", "recibir-retorno", r.id);
    if (vista === "traslados") {
      if (jefatura() && r.sede === actor().sede && r.estado === "Pendiente") html += opcion("Aprobar traslado", "aprobar-traslado", r.id) + opcion("Rechazar", "rechazar-traslado", r.id);
      if (almacen() && r.sede === actor().sede && r.estado === "Aprobado") html += opcion("Despachar traslado", "salida-traslado", r.id);
      if (almacen() && r.sedeDestino === actor().sede && ["En tránsito", "Parcialmente recibido"].includes(r.estado)) html += opcion("Recibir en destino", "recibir-traslado", r.id);
    }
    if (vista === "conteos" && jefatura() && r.estado === "Pendiente") html += opcion("Aprobar ajuste", "aprobar-conteo", r.id) + opcion("Rechazar", "rechazar-conteo", r.id);
    if (vista === "acciones" && r.estado !== "Completada") html += opcion(r.estado === "Pendiente" ? "Iniciar acción" : r.estado === "En curso" ? "Presentar evidencia" : "Verificar cierre", "avanzar-accion", r.id);
    return html;
  }

  function selectorAlmacen(id = "almacen", destino = false) { return select(id, datos().almacenes.filter(a => a.activo !== false && (destino || a.sede === actor().sede)).map(a => [a.id, `${a.nombre} · ${c.sedeNombre(a.sede)}`])); }
  function almacenActual() { const elegida = c.$("#log-almacen")?.value; return datos().almacenes.find(a => a.id === elegida && a.sede === actor().sede)?.id || datos().almacenes.find(a => a.sede === actor().sede && a.activo !== false)?.id; }
  function opcionesUbicacion(almacen, calidad) { return datos().ubicaciones.filter(u => u.almacen === almacen && u.activo !== false && u.estados.includes(calidad)).map(u => [u.codigo, u.nombre]); }
  function selectorUbicacion(id = "ubicacion", calidad = "Disponible", almacen = almacenActual()) { return select(id, opcionesUbicacion(almacen, calidad)); }
  function selectorProveedor(id = "proveedorId") { return select(id, datos().proveedores.filter(p => p.estado === "Aprobado").map(p => [p.id, p.nombre])); }
  function selectDocumento(id, lista, filtro = () => true, seleccionado = "", descripcion = r => r.estado) {
    const disponibles = propios(lista, id === "trasladoId").filter(filtro);
    return select(id, [["", disponibles.length ? "Selecciona un documento" : "No hay documentos disponibles"], ...disponibles.map(r => [r.id, `${r.numero} · ${descripcion(r)}`])], seleccionado, "required");
  }
  function formulario(titulo, campos, comando, coleccion) {
    c.formulario(titulo, campos, valores => { const registro = ejecutar((d, servicios) => comando(d, servicios, valores)); return `${modulo}/${coleccion}${registro?.id ? "/" + registro.id : ""}`; });
  }
  function decidir(titulo, coleccion, id, comando, campos = razon) { formulario(titulo, campos, (d, s, f) => { comando(d, f.get("motivo"), s); return d[coleccion].find(r => r.id === id); }, coleccion); }

  function filasProducto(lineas = [], precios = false, fijo = false, cero = false, cantidadFija = false) {
    return `<div id="log-lineas" data-precios="${precios}" data-fijo="${fijo}">${lineas.map(l => filaProducto(l, precios, fijo, cero, cantidadFija)).join("") || (fijo ? '<p class="texto-suave">No hay líneas disponibles para este documento.</p>' : filaProducto({}, precios, fijo, cero))}</div>${!fijo ? b("+ Agregar producto", "agregar-linea") : ""}`;
  }
  function filaProducto(linea, precios, fijo, cero = false, cantidadFija = false) {
    const seleccion = fijo ? `<input type="hidden" name="codigo" value="${e(linea.codigo)}"><span>${e(linea.nombre || nombreProducto(linea.codigo))}</span>` : `<select name="codigo" required><option value="">Selecciona un producto</option>${productos().filter(p => p.estado === "Aprobado").map(p => opcion(p.codigo, p.codigo + " · " + p.nombre, linea.codigo)).join("")}</select>`;
    return `<div class="log-linea ${precios ? "con-precio" : ""}"><label>Producto${seleccion}</label><label>Cantidad<input name="cantidad" type="number" min="${cero ? 0 : 1}" step="1" value="${linea.cantidad ?? (cero ? 0 : 1)}" ${cantidadFija ? "readonly" : ""} ${fijo && linea.cantidad != null ? `max="${linea.maxCantidad ?? linea.cantidad}"` : ""} required></label>${precios ? `<label>Precio sin IGV<input name="precio" type="number" min="0.01" step="0.01" value="${(linea.precio || 0) / 100}" required></label>` : ""}${!fijo ? b("×", "quitar-linea", "", "boton-icono") : ""}</div>`;
  }
  function leerLineas(f, precios = false) {
    const cantidades = f.getAll("cantidad"), importes = f.getAll("precio");
    return f.getAll("codigo").map((codigo, i) => ({ codigo, cantidad: Number(cantidades[i]), ...(precios ? { precio: Math.round(Number(importes[i]) * 100) } : {}) })).filter(l => l.cantidad !== 0);
  }
  function enlazarDetalle(selector, dibujar) {
    const elemento = c.$(`#log-${selector}`); elemento.addEventListener("change", () => dibujar(elemento.value));
    dibujar(elemento.value);
  }

  function proveedorFormulario(id) {
    const p = datos().proveedores.find(p => p.id === id) || {};
    formulario(id ? "Actualizar proveedor" : "Nuevo proveedor", `<div class="campos">${campo("RUC", "ruc", input("ruc", p.ruc, 'pattern="[0-9]{11}" maxlength="11" inputmode="numeric" required'))}${campo("Razón social", "nombre", input("nombre", p.nombre))}${campo("Correo", "correo", input("correo", p.correo, 'type="email" required'))}${campo("Teléfono", "telefono", input("telefono", p.telefono))}${campo("Dirección", "direccion", input("direccion", p.direccion))}${campo("Condición de pago", "condicion", selectSimple("condicion", ["Contado", "Crédito 30 días"], p.condicion))}</div>`, (d, s, f) => C.guardarProveedor(d, { ...Object.fromEntries(f), id: id || null }, actor()), "proveedores");
  }

  function requisicionFormulario(precarga) {
    const lineas = precarga?.lineas || [];
    formulario("Nueva solicitud de pedido", `<div class="campos">${campo("Almacén receptor", "almacen", selectorAlmacen())}${campo("Fecha requerida", "requerida", fecha("requerida", c.sumarDias(hoy(), 7)))}</div>${razon}${filasProducto(lineas)}`, (d, s, f) => C.crearRequisicion(d, { almacen: f.get("almacen"), requerida: f.get("requerida"), motivo: f.get("motivo"), origenPedido: precarga?.pedidoId || null, lineas: leerLineas(f) }, actor(), s.productos), "requisiciones");
  }

  function peticionFormulario(requisicionId) {
    const d = datos();
    formulario("Petición de ofertas", campo("Necesidad aprobada", "requisicionId", selectDocumento("requisicionId", d.requisiciones, r => r.estado === "Aprobada" &&
      !d.peticionesOferta.some(p => p.requisicionId === r.id && p.estado !== "Anulada") &&
      !d.ordenes.some(o => o.requisicionId === r.id && !["Anulada", "Rechazada"].includes(o.estado)), requisicionId, r => r.motivo)) + `<fieldset class="log-proveedores"><legend>Proveedores invitados</legend>${d.proveedores.filter(p => p.estado === "Aprobado").map(p => `<label><input type="checkbox" name="proveedor" value="${p.id}"> ${e(p.nombre)}</label>`).join("")}</fieldset>`, (actuales, s, f) => C.crearPeticion(actuales, { requisicionId: f.get("requisicionId"), proveedores: f.getAll("proveedor") }, actor()), "peticionesOferta");
  }

  function ofertaFormulario(peticionId) {
    const d = datos();
    formulario("Registrar oferta recibida", `<div class="campos">${campo("Petición", "peticionId", selectDocumento("peticionId", d.peticionesOferta, r => r.estado === "Abierta" && flujo.proveedoresPendientes(d, r).length, peticionId))}${campo("Proveedor", "proveedorId", '<select id="log-proveedorId" name="proveedorId" required></select>')}${campo("Vigente hasta", "vigenteHasta", fecha("vigenteHasta", c.sumarDias(hoy(), 15)))}${campo("Plazo (días)", "plazoDias", input("plazoDias", 7, 'type="number" min="1" step="1" required'))}${campo("Calidad ofrecida (1 a 5)", "calidad", select("calidad", [["1", "1 · Muy baja"], ["2", "2 · Baja"], ["3", "3 · Aceptable"], ["4", "4 · Buena"], ["5", "5 · Muy buena"]], "3", "required"))}${campo("Condición de pago", "condicion", selectSimple("condicion", ["Contado", "Crédito 30 días"]))}</div><div id="log-detalle"></div>`, (actuales, s, f) => C.registrarOferta(actuales, { peticionId: f.get("peticionId"), proveedorId: f.get("proveedorId"), vigenteHasta: f.get("vigenteHasta"), plazoDias: Number(f.get("plazoDias")), calidad: Number(f.get("calidad")), condicion: f.get("condicion"), lineas: leerLineas(f, true) }, actor(), hoy()), "ofertas");
    enlazarDetalle("peticionId", id => {
      const p = d.peticionesOferta.find(p => p.id === id);
      const pendientes = p ? flujo.proveedoresPendientes(d, p) : [];
      c.$("#log-proveedorId").innerHTML = pendientes.map(id => opcion(id, nombreProveedor(id))).join("");
      c.$("#log-detalle").innerHTML = p ? filasProducto(p.lineas, true, true, false, true) : "";
    });
  }

  function acuerdoFormulario() {
    formulario("Acuerdo marco", `<div class="campos">${campo("Proveedor", "proveedorId", selectorProveedor())}${campo("Desde", "desde", fecha("desde"))}${campo("Hasta", "hasta", fecha("hasta", c.sumarDias(hoy(), 90)))}${campo("Condición", "condicion", selectSimple("condicion", ["Contado", "Crédito 30 días"]))}</div><p class="texto-suave">Indica cantidades máximas cubiertas por este acuerdo.</p>${filasProducto([], true)}`, (d, s, f) => C.guardarAcuerdo(d, { proveedorId: f.get("proveedorId"), desde: f.get("desde"), hasta: f.get("hasta"), condicion: f.get("condicion"), lineas: leerLineas(f, true) }, actor(), s.productos), "acuerdos");
  }

  function ordenFormulario(origen) {
    const d = datos();
    const fuentes = [...propios(d.ofertas).filter(o => o.estado === "Seleccionada" && o.vigenteHasta >= hoy()).map(o => [`oferta|${o.id}`, `${o.numero} · ${nombreProveedor(o.proveedorId)}`]), ...propios(d.acuerdos).filter(a => a.estado === "Aprobado" && a.desde <= hoy() && hoy() <= a.hasta).map(a => [`acuerdo|${a.id}`, `${a.numero} · Acuerdo marco`])];
    formulario("Preparar orden de compra", campo("Documento de origen", "fuente", select("fuente", [["", fuentes.length ? "Selecciona un origen" : "Sin ofertas adjudicadas ni acuerdos vigentes"], ...fuentes], origen, "required")) + campo("Necesidad (para acuerdo marco)", "requisicionId", selectDocumento("requisicionId", d.requisiciones, r => r.estado === "Aprobada")) + campo("Entrega prevista", "entregaPrevista", fecha("entregaPrevista", c.sumarDias(hoy(), 7))), (actuales, s, f) => { const [tipo, id] = f.get("fuente").split("|"); return C.crearOrden(actuales, { ...(tipo === "oferta" ? { ofertaId: id } : { acuerdoId: id, requisicionId: f.get("requisicionId") }), entregaPrevista: f.get("entregaPrevista") }, actor(), hoy()); }, "ordenes");
    c.$("#log-requisicionId").required = false;
    enlazarDetalle("fuente", valor => {
      const requiereSolicitud = valor.startsWith("acuerdo|");
      const selector = c.$("#log-requisicionId");
      selector.required = requiereSolicitud;
      selector.disabled = !requiereSolicitud;
      selector.parentElement.hidden = !requiereSolicitud;
    });
  }

  function recepcionFormulario(ordenId) {
    const d = datos();
    formulario("Orden de ingreso", `<div class="campos">${campo("Orden de compra", "ordenId", selectDocumento("ordenId", d.ordenes, o => ["Emitida", "Confirmada", "Parcialmente recibida", "Recibida"].includes(o.estado) && flujo.cantidadPorRecibir(d, o), ordenId, o => o.proveedor?.nombre || o.estado))}${campo("Documento de proveedor", "documento", input("documento"))}${campo("Fecha", "fecha", fecha("fecha"))}${campo("Lote / identificación", "lote", input("lote"))}</div><p class="texto-suave">Se sugieren las unidades pendientes. Confirma la cantidad que llegó físicamente antes de guardar.</p><div id="log-detalle"></div>`, (actuales, s, f) => C.recibir(actuales, { ordenId: f.get("ordenId"), documento: f.get("documento").trim(), fecha: f.get("fecha"), lote: f.get("lote").trim(), lineas: leerLineas(f) }, actor(), s.config), "recepciones");
    enlazarDetalle("ordenId", id => { const o = d.ordenes.find(o => o.id === id); c.$("#log-detalle").innerHTML = o ? filasProducto(o.lineas.map(l => ({ ...l, cantidad: l.cantidad - C.recibido(d, o.id, l.codigo) })).filter(l => l.cantidad > 0), false, true, true) : ""; });
  }

  function inspeccionFormulario(id) {
    const r = datos().recepciones.find(r => r.id === id), lineas = r.lineas.filter(l => C.pendienteInspeccion(l) > 0);
    const detalle = lineas.map(l => `<div class="log-linea con-precio"><span>${e(l.nombre || nombreProducto(l.codigo))}<small>Pendiente: ${C.pendienteInspeccion(l)}</small></span><label>Conformes<input name="conformes" type="number" min="0" max="${C.pendienteInspeccion(l)}" value="${C.pendienteInspeccion(l)}" required></label><label>Observadas<input name="observadas" type="number" min="0" max="${C.pendienteInspeccion(l)}" value="0" required></label></div>`).join("");
    formulario("Inspección por producto", campo("Resultado", "resultado", selectSimple("resultado", ["Conforme", "No conforme", "Parcial"])) + campo("Fecha de inspección", "fecha", fecha("fecha")) + campo("Ubicación si es conforme", "ubicacion", selectorUbicacion("ubicacion", "Disponible", r.almacen)) + detalle + razon, (d, s, f) => C.inspeccionarParcial(d, { recepcionId: id, fecha: f.get("fecha"), motivo: f.get("motivo"), ubicacion: f.get("ubicacion"), lineas: lineas.map((l, i) => ({ codigo: l.codigo, conformes: Number(f.getAll("conformes")[i]), observadas: Number(f.getAll("observadas")[i]) })) }, actor(), s.config), "recepciones");
    c.$("#log-resultado").addEventListener("change", evento => lineas.forEach((l, i) => {
      document.querySelectorAll('[name="conformes"]')[i].value = evento.target.value === "Conforme" ? C.pendienteInspeccion(l) : 0;
      document.querySelectorAll('[name="observadas"]')[i].value = evento.target.value === "No conforme" ? C.pendienteInspeccion(l) : 0;
    }));
  }

  function facturaFormulario(ordenId) {
    const d = datos();
    formulario("Cotejar factura de proveedor", `<div class="campos">${campo("Orden de compra", "ordenId", selectDocumento("ordenId", d.ordenes, o => ["Emitida", "Confirmada", "Parcialmente recibida", "Recibida"].includes(o.estado) && flujo.porFacturar(d, o).length, ordenId, o => o.proveedor?.nombre || o.estado))}${campo("Serie y número", "documento", input("documento"))}${campo("Fecha", "fecha", fecha("fecha"))}${campo("Base informada (sin IGV)", "baseInformada", input("baseInformada", 0, 'type="number" min="0" step="0.01" required'))}</div><p class="texto-suave">Compara las cantidades, precios y base sugeridos con la factura del proveedor. Puedes corregirlos si difieren.</p><div id="log-detalle"></div>`, (actuales, s, f) => C.verificarFactura(actuales, { ordenId: f.get("ordenId"), documento: f.get("documento").trim(), fecha: f.get("fecha"), baseInformada: Math.round(Number(f.get("baseInformada")) * 100), lineas: leerLineas(f, true) }, actor(), s.config), "facturas");
    enlazarDetalle("ordenId", id => {
      const o = d.ordenes.find(o => o.id === id);
      const conformes = o ? flujo.porFacturar(d, o, true) : [];
      const disponibles = o ? flujo.porFacturar(d, o) : [];
      const lineas = conformes.length ? disponibles.map(l => ({ ...l, maxCantidad: l.cantidad,
        cantidad: conformes.find(x => x.codigo === l.codigo)?.cantidad ?? 0 })) : disponibles;
      c.$("#log-detalle").innerHTML = o ? filasProducto(lineas, true, true, true) : "";
      c.$("#log-baseInformada").value = (lineas.reduce((n, l) => n + l.cantidad * l.precio, 0) / 100).toFixed(2);
    });
  }

  function reservaFormulario(pedidoId) {
    const pedidos = A.pedidos(actor().sede).filter(p => ["Aprobado", "Parcialmente atendido"].includes(p.estado));
    formulario("Reservar pedido comercial", campo("Pedido aprobado", "pedidoId", select("pedidoId", [["", "Selecciona un pedido"], ...pedidos.map(p => [p.id, `${p.numero} · ${p.cliente.nombre}`])], pedidoId, "required")) + campo("Almacén", "almacen", selectorAlmacen()) + '<div id="log-detalle"></div>', (d, s, f) => D.reservar(d, { pedidoId: f.get("pedidoId"), almacen: f.get("almacen"), lineas: leerLineas(f) }, actor(), s.pedidos, s.config), "reservas");
    enlazarDetalle("pedidoId", id => { const p = pedidos.find(p => p.id === id), d = datos(); c.$("#log-detalle").innerHTML = p ? filasProducto(p.lineas.map(l => ({ ...l, cantidad: l.cantidad - D.despachada(d, id, l.codigo) })).filter(l => l.cantidad > 0), false, true) : ""; });
  }

  function pickingFormulario(reservaId) {
    const d = datos();
    formulario("Generar lista de picking", campo("Reserva activa", "reservaId", selectDocumento("reservaId", d.reservas, r => r.estado === "Activa" && flujo.reservadoSinPreparar(d, r).length, reservaId, r => r.pedidoNumero || r.estado)) + '<div id="log-detalle"></div>', (actuales, s, f) => D.crearPicking(actuales, { reservaId: f.get("reservaId"), lineas: leerLineas(f) }, actor(), s.pedidos), "picking");
    enlazarDetalle("reservaId", id => {
      const reserva = d.reservas.find(r => r.id === id);
      c.$("#log-detalle").innerHTML = reserva ? filasProducto(flujo.reservadoSinPreparar(d, reserva), false, true) : "";
    });
  }

  function despachoFormulario(pickingId) {
    const d = datos();
    const anteriores = propios(d.despachos);
    const sugerencias = nombre => `<datalist id="log-opciones-${nombre}">${[...new Set(anteriores.map(x => x[nombre]).filter(Boolean))].map(valor => opcion(valor, valor)).join("")}</datalist>`;
    formulario("Orden de salida", campo("Picking embalado", "pickingId", selectDocumento("pickingId", d.picking, p => p.estado === "Embalado", pickingId, p => p.pedidoNumero || p.estado)) + `<div class="campos">${campo("Fecha de salida", "fecha", fecha("fecha"))}${campo("Transportista / conductor", "transportista", input("transportista", "", 'list="log-opciones-transportista" required') + sugerencias("transportista"))}${campo("Placa de vehículo", "placa", input("placa", "", 'maxlength="15" list="log-opciones-placa" required') + sugerencias("placa"))}${campo("Destino del pedido", "destino", input("destino", "", "readonly required"))}</div>`, (actuales, s, f) => D.crearDespacho(actuales, Object.fromEntries(f), actor(), s.pedidos, s.config), "despachos");
    enlazarDetalle("pickingId", id => { const p = d.picking.find(p => p.id === id); c.$("#log-destino").value = A.pedidos(actor().sede).find(pedido => pedido.id === p?.pedidoId)?.cliente.direccion || ""; });
  }

  function entregaFormulario(id) {
    const d = datos().despachos.find(d => d.id === id), cantidades = new Map();
    d.lineas.forEach(l => cantidades.set(l.codigo, (cantidades.get(l.codigo) || 0) + l.cantidad));
    formulario("Confirmar entrega al cliente", `<div class="campos">${campo("Fecha de entrega", "fecha", fecha("fecha"))}${campo("Confirma quién recibió el pedido", "receptor", input("receptor", A.pedidos(actor().sede).find(p => p.id === d.pedidoId)?.cliente.nombre))}${campo("Constancia / referencia", "evidencia", input("evidencia"))}</div>${filasProducto([...cantidades].map(([codigo, cantidad]) => ({ codigo, cantidad })), false, true)}${campo("Incidencia si no se entrega todo", "motivo", '<textarea id="log-motivo" name="motivo" maxlength="500"></textarea>')}`, (actuales, s, f) => D.confirmarEntrega(actuales, { despachoId: id, fecha: f.get("fecha"), receptor: f.get("receptor"), evidencia: f.get("evidencia"), motivo: f.get("motivo"), lineas: leerLineasConCeros(f) }, actor()), "despachos");
    document.querySelectorAll('#log-lineas input[name="cantidad"]').forEach(input => { input.min = 0; });
  }

  function leerLineasConCeros(f) { const cantidades = f.getAll("cantidad"); return f.getAll("codigo").map((codigo, i) => ({ codigo, cantidad: Number(cantidades[i]) })); }

  function camposRecepcionFisica() {
    return `<div class="campos">${campo("Fecha de recepción", "fecha", fecha("fecha"))}${campo("Documento de recepción", "documento", input("documento"))}${campo("Calidad de destino", "calidad", selectSimple("calidad", ["Disponible", "Cuarentena", "Dañado"], "Cuarentena"))}${campo("Ubicación", "ubicacion", selectorUbicacion("ubicacion", "Cuarentena"))}</div>${razon}`;
  }
  function enlazarCalidad(almacenFijo) {
    const actualizar = () => { c.$("#log-ubicacion").innerHTML = opcionesUbicacion(almacenFijo || almacenActual(), c.$("#log-calidad")?.value || "Disponible").map(u => opcion(u[0], u[1])).join(""); };
    c.$("#log-calidad")?.addEventListener("change", actualizar); c.$("#log-almacen")?.addEventListener("change", actualizar); actualizar();
  }

  function retornoFormulario(id) {
    formulario("Recibir retorno de transporte", camposRecepcionFisica(), (d, s, f) => { D.recibirRetorno(d, id, f.get("motivo"), f.get("ubicacion"), f.get("calidad"), actor(), s.config, f.get("fecha"), f.get("documento")); return d.retornos.find(r => r.id === id); }, "retornos"); enlazarCalidad(datos().retornos.find(r => r.id === id).almacen);
  }

  function devolucionFormulario() {
    const solicitudes = A.devoluciones(actor().sede).filter(s => s.estado === "Autorizada");
    formulario("Recibir devolución autorizada", campo("Solicitud comercial", "solicitudId", select("solicitudId", [["", "Selecciona una solicitud"], ...solicitudes.map(s => [s.id, `${s.numero} · ${s.cliente.nombre}`])], "", "required")) + campo("Almacén receptor", "almacen", selectorAlmacen()) + camposRecepcionFisica() + '<div id="log-detalle"></div>', (d, s, f) => {
      const solicitud = s.devoluciones.find(s => s.id === f.get("solicitudId"));
      return D.recibirDevolucion(d, { solicitudId: f.get("solicitudId"), almacen: f.get("almacen"), fecha: f.get("fecha"), documento: f.get("documento"), calidad: f.get("calidad"), ubicacion: f.get("ubicacion"), motivo: f.get("motivo"), lineas: leerLineas(f).map(l => ({ ...l, coste: solicitud?.lineas.find(sl => sl.codigo === l.codigo)?.coste || 0 })) }, actor(), s.devoluciones, s.config);
    }, "retornos");
    enlazarCalidad(); enlazarDetalle("solicitudId", id => {
      const s = solicitudes.find(s => s.id === id), anteriores = datos().retornos.filter(r => r.solicitudId === id);
      const lineas = s?.lineas.map(l => ({ ...l, cantidad: l.cantidad - anteriores.flatMap(r => r.lineas).filter(r => r.codigo === l.codigo).reduce((n, l) => n + l.cantidad, 0) })).filter(l => l.cantidad > 0) || [];
      c.$("#log-detalle").innerHTML = filasProducto(lineas, false, true);
    });
  }

  function trasladoFormulario() {
    formulario("Solicitar traslado entre almacenes", `<div class="campos">${campo("Almacén de origen", "origen", selectorAlmacen("origen"))}${campo("Almacén de destino", "destino", selectorAlmacen("destino", true))}${campo("Fecha prevista", "fecha", fecha("fecha"))}</div>${razon}${filasProducto()}`, (d, s, f) => D.crearTraslado(d, { origen: f.get("origen"), destino: f.get("destino"), fecha: f.get("fecha"), motivo: f.get("motivo"), lineas: leerLineas(f) }, actor(), s.productos), "traslados");
  }

  function recibirTrasladoFormulario(id) {
    const t = datos().traslados.find(t => t.id === id);
    formulario("Recibir traslado en destino", camposRecepcionFisica() + filasProducto(t.lineas.map(l => ({ ...l, cantidad: l.cantidad - (t.recibidas[l.codigo] || 0) })).filter(l => l.cantidad > 0), false, true), (d, s, f) => { D.recibirTraslado(d, { trasladoId: id, fecha: f.get("fecha"), documento: f.get("documento"), calidad: f.get("calidad"), ubicacion: f.get("ubicacion"), motivo: f.get("motivo"), lineas: leerLineas(f) }, actor(), s.config); return d.traslados.find(t => t.id === id); }, "traslados"); enlazarCalidad(t.destino);
  }

  function conteoFormulario() { formulariosAlmacen.conteo(); }

  function cuarentenaFormulario() {
    const d = datos(), posiciones = new Map();
    for (const m of propios(d.movimientos).filter(m => m.calidad === "Cuarentena")) posiciones.set(`${m.almacen}|${m.codigo}|${m.ubicacion}|${m.lote}`, m);
    const saldos = [...posiciones].filter(([, m]) => L.saldo(d, m.almacen, m.codigo, m.ubicacion, "Cuarentena", m.lote) > 0);
    formulario("Resolver cuarentena", campo("Posición", "posicion", select("posicion", saldos.map(([id, m]) => [id, `${nombreProducto(m.codigo)} · ${m.lote} · ${m.ubicacion}`]), null, "required")) + campo("Cantidad", "cantidadResolver", input("cantidadResolver", 1, 'type="number" min="1" step="1" required')) + campo("Destino", "destinoCalidad", selectSimple("destinoCalidad", ["Disponible", "Dañado"])) + campo("Ubicación destino", "destino", selectorUbicacion("destino")) + razon, (actuales, s, f) => {
      const m = posiciones.get(f.get("posicion")); L.exigir(m, "Selecciona una posición de cuarentena.");
      D.resolverCuarentena(actuales, { almacen: m.almacen, origen: m.ubicacion, codigo: m.codigo, lote: m.lote, coste: m.coste, destinoCalidad: f.get("destinoCalidad"), destino: f.get("destino"), cantidad: Number(f.get("cantidadResolver")), motivo: f.get("motivo"), fecha: hoy() }, actor(), s.config);
      return null;
    }, "inventario");
    enlazarDetalle("destinoCalidad", calidad => { c.$("#log-destino").innerHTML = opcionesUbicacion(posiciones.get(c.$("#log-posicion").value)?.almacen || almacenActual(), calidad).map(u => opcion(u[0], u[1])).join(""); });
  }

  function previsionFormulario() {
    formulario("Previsión de demanda retail", `<div class="campos">${campo("Producto", "codigo", select("codigo", productos().map(p => [p.codigo, p.nombre])))}${campo("Periodo", "periodo", input("periodo", hoy().slice(0, 7), 'type="month" required'))}${campo("Unidades previstas", "unidades", cantidad("unidades"))}</div>${razon}`, (d, s, f) => { L.registrarPrevision(d, { codigo: f.get("codigo"), periodo: f.get("periodo"), cantidad: Number(f.get("unidades")), motivo: f.get("motivo") }, actor(), s.productos); return null; }, "planificacion");
  }

  function parametrosFormulario() {
    formulario("Parámetros de reposición", `<div class="campos">${campo("Almacén", "almacen", selectorAlmacen())}${campo("Producto", "codigo", select("codigo", productos().map(p => [p.codigo, p.nombre])))}${campo("Mínimo", "minimo", input("minimo", A.config.reposicion.minimo, 'type="number" min="0" step="1" required'))}${campo("Objetivo", "objetivo", input("objetivo", A.config.reposicion.objetivo, 'type="number" min="1" step="1" required'))}</div>${razon}`, (d, s, f) => { L.configurarReposicion(d, { almacen: f.get("almacen"), codigo: f.get("codigo"), minimo: Number(f.get("minimo")), objetivo: Number(f.get("objetivo")), motivo: f.get("motivo") }, actor()); return null; }, "planificacion");
  }

  function accionFormulario() {
    formulario("Acción de mejora", `<div class="campos">${campo("Causa", "causa", input("causa"))}${campo("Responsable", "responsable", input("responsable"))}${campo("Plazo", "plazo", fecha("plazo", c.sumarDias(hoy(), 7)))}</div>${campo("Acción propuesta", "descripcion", '<textarea id="log-descripcion" name="descripcion" minlength="3" required></textarea>')}`, (d, s, f) => L.crearAccion(d, Object.fromEntries(f), actor()), "acciones");
  }

  function evaluacionFormulario() {
    formulario("Evaluar desempeño de proveedor", campo("Proveedor", "proveedorId", selectorProveedor()) + campo("Conclusión / mejora propuesta", "comentario", '<textarea id="log-comentario" name="comentario" minlength="3" required></textarea>'), (d, s, f) => C.evaluarProveedor(d, Object.fromEntries(f), actor()), "evaluaciones");
  }

  function accion(nombre, id, titulo) {
    const decisiones = {
      "aprobar-tratamiento": ["tratamientos", (d, m, s) => M.resolverTratamiento(d, id, true, m, actor(), s.config)], "rechazar-tratamiento": ["tratamientos", (d, m, s) => M.resolverTratamiento(d, id, false, m, actor(), s.config)], "terminar-reparacion": ["tratamientos", (d, m) => M.terminarReparacion(d, id, m, actor())],
      "aprobar-proveedor": ["proveedores", (d, m) => C.resolverProveedor(d, id, true, m, actor())], "rechazar-proveedor": ["proveedores", (d, m) => C.resolverProveedor(d, id, false, m, actor())],
      "aprobar-requisicion": ["requisiciones", (d, m) => C.resolverRequisicion(d, id, true, m, actor())], "rechazar-requisicion": ["requisiciones", (d, m) => C.resolverRequisicion(d, id, false, m, actor())],
      adjudicar: ["ofertas", (d, m) => C.adjudicar(d, id, m, actor(), hoy())],
      "aprobar-acuerdo": ["acuerdos", (d, m) => C.resolverAcuerdo(d, id, true, m, actor())], "rechazar-acuerdo": ["acuerdos", (d, m) => C.resolverAcuerdo(d, id, false, m, actor())],
      "aprobar-orden": ["ordenes", (d, m) => C.resolverOrden(d, id, true, m, actor())], "rechazar-orden": ["ordenes", (d, m) => C.resolverOrden(d, id, false, m, actor())],
      "confirmar-orden": ["ordenes", (d, m) => C.confirmarOrden(d, id, m, actor())], "anular-orden": ["ordenes", (d, m) => C.anularOrden(d, id, m, actor())],
      "devolver-proveedor": ["recepciones", (d, m, s) => C.devolverProveedor(d, id, m, actor(), s.config)],
      "liberar-reserva": ["reservas", (d, m) => D.liberarReserva(d, id, m, actor())],
      "preparar-picking": ["picking", (d, m, s) => D.avanzarPicking(d, id, "Preparado", m, actor(), s.pedidos)], "embalar-picking": ["picking", (d, m, s) => D.avanzarPicking(d, id, "Embalado", m, actor(), s.pedidos)], "anular-picking": ["picking", (d, m, s) => D.avanzarPicking(d, id, "Anulado", m, actor(), s.pedidos)],
      "aprobar-traslado": ["traslados", (d, m) => D.aprobarTraslado(d, id, true, m, actor())], "rechazar-traslado": ["traslados", (d, m) => D.aprobarTraslado(d, id, false, m, actor())],
      "aprobar-conteo": ["conteos", (d, m, s) => L.aprobarConteo(d, id, true, m, actor(), s.config)], "rechazar-conteo": ["conteos", (d, m, s) => L.aprobarConteo(d, id, false, m, actor(), s.config)]
    };
    if (decisiones[nombre]) { const [col, resolver] = decisiones[nombre]; decidir(titulo, col, id, resolver, nombre === "confirmar-orden" ? campoRazon("Referencia de confirmación del proveedor") : razon); return; }
    const comandos = { proveedor: () => proveedorFormulario(id), requisicion: () => requisicionFormulario(), peticion: () => peticionFormulario(id), oferta: () => ofertaFormulario(id), acuerdo: acuerdoFormulario, orden: () => ordenFormulario(id), recepcion: () => recepcionFormulario(id), inspeccion: () => inspeccionFormulario(id), factura: () => facturaFormulario(id),
      "evaluacion-kardex": () => { evaluacionKardex = window.EvaluacionKardex.ejecutar(hoy()); ir("inventario"); },
      "cerrar-evaluacion-kardex": () => { evaluacionKardex = null; ir("inventario"); },
      imprimir: () => window.print(), "emitir-orden": () => { ejecutar(d => C.emitirOrden(d, id, actor(), hoy())); c.finalizarOperacion(`${modulo}/ordenes/${id}`, "Orden emitida."); },
      "revalidar-factura": () => { ejecutar((d, s) => C.revalidarFactura(d, id, actor(), s.config)); c.finalizarOperacion(`${modulo}/facturas/${id}`, "Factura revisada."); },
      "agregar-linea": () => { const lista = c.$("#log-lineas"); lista.insertAdjacentHTML("beforeend", filaProducto({}, lista.dataset.precios === "true", false)); },
    };
    if (comandos[nombre]) comandos[nombre](); else operacionesAlmacen(nombre, id);
  }

  function operacionesAlmacen(nombre, id) {
    const comandos = { almacen: () => formulariosAlmacen.almacen(id), ubicacion: () => formulariosAlmacen.ubicacion(id), reubicacion: formulariosAlmacen.reubicacion, tratamiento: () => formulariosAlmacen.tratamiento(), "tratamiento-recepcion": () => formulariosAlmacen.tratamiento(id), reinspeccion: () => formulariosAlmacen.reinspeccion(id), reserva: () => reservaFormulario(id), picking: () => pickingFormulario(id), despacho: () => despachoFormulario(id), entrega: () => entregaFormulario(id), devolucion: devolucionFormulario, "recibir-retorno": () => retornoFormulario(id), traslado: trasladoFormulario, "recibir-traslado": () => recibirTrasladoFormulario(id), conteo: conteoFormulario, cuarentena: cuarentenaFormulario, prevision: previsionFormulario, parametros: parametrosFormulario, accion: accionFormulario, evaluacion: evaluacionFormulario,
      sugerencia: () => { const [almacen, codigo, unidades] = id.split("|"); requisicionFormulario({ lineas: [{ codigo, cantidad: Number(unidades) }] }); c.$("#log-almacen").value = almacen; },
      ruta: () => { ejecutar(d => D.iniciarRuta(d, id, actor())); c.finalizarOperacion(`${modulo}/despachos/${id}`, "Ruta iniciada."); },
      "salida-traslado": () => { ejecutar((d, s) => D.despacharTraslado(d, id, actor(), s.config)); c.finalizarOperacion(`${modulo}/traslados/${id}`, "Salida del traslado registrada."); },
      "avanzar-accion": () => decidir("Actualizar acción de mejora", "acciones", id, (d, motivo) => { const a = d.acciones.find(a => a.id === id); L.avanzarAccion(d, id, a.estado === "Pendiente" ? "En curso" : a.estado === "En curso" ? "Por verificar" : "Completada", motivo, actor()); })
    };
    L.exigir(comandos[nombre], "Operación logística no reconocida."); comandos[nombre]();
  }

  const formulariosAlmacen = window.FormulariosAlmacen({ c, A, L, M, actor, datos, e, campo, input, fecha, select, selectSimple, selectorAlmacen, selectorUbicacion, formulario, razon, enlazarCalidad, opcion, nombreProducto, opcionesUbicacion });

  document.addEventListener("change", evento => {
    const selector = evento.target.closest("[data-kardex-producto]"); if (!selector) return;
    productoKardex = selector.value; c.navegar(`${modulo}/inventario`);
  });
  document.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-log-accion], [data-log-vista]"); if (!boton || !actor()) return;
    if (boton.dataset.logVista) { ir(boton.dataset.logVista); return; }
    if (boton.dataset.logAccion === "quitar-linea") {
      if (document.querySelectorAll("#log-lineas .log-linea").length > 1) boton.closest(".log-linea").remove(); else c.aviso("Mantén al menos una línea."); return;
    }
    try { accion(boton.dataset.logAccion, boton.dataset.id, boton.textContent.trim()); }
    catch (error) { c.aviso(error.message); }
  });

  function puedeContinuarPedido(id) {
    if (!almacen()) return false;
    try { return !window.ContratosLogisticos.consultarSeguimiento(id).salidas.length; }
    catch { return false; }
  }

  function continuarPedido(id) {
    L.exigir(almacen(), "Almacén debe preparar este pedido.");
    const reserva = datos().reservas.find(r => r.pedidoId === id && r.sede === actor().sede && r.estado === "Activa");
    modulo = "logistica";
    if (reserva) ir("reservas/" + reserva.id);
    else reservaFormulario(id);
  }

  return { dibujar, admite, puedeContinuarPedido, continuarPedido, solicitarDesdeComercial(pedido) { modulo = "logistica"; requisicionFormulario({ pedidoId: pedido.id, lineas: pedido.lineas.map(l => ({ codigo: l.codigo, cantidad: l.cantidad })) }); } };
};
