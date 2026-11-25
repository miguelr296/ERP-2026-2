"use strict";

window.ReportesERP = (() => {
  const total = (lista, campo) => lista.reduce((n, item) => n + item[campo], 0);
  const documento = (texto, ruta) => ({ texto, ruta });
  const tabla = (titulo, columnas, filas) => ({ titulo, columnas, filas });
  const columna = (titulo, formato = "texto") => ({ titulo, formato });
  const moneda = titulo => columna(titulo, "moneda");
  const fecha = titulo => columna(titulo, "fecha");
  const enSede = (lista, sede) => lista.filter(item => item.sede === sede);
  const porFecha = (lista, campo, filtro) => lista.filter(item => item[campo] >= filtro.desde && item[campo] <= filtro.hasta);
  const fechaDescendente = (lista, campo) => lista.slice().sort((a, b) => b[campo].localeCompare(a[campo]));

  function ventas(filtro, actor, comercial) {
    const puede = roles => window.Permisos.tieneRol(actor, roles);
    const indicadores = [], tablas = [];
    if (puede(["Asesor", "Jefatura"])) {
      window.Libros.exigir(comercial, "No se pudieron leer los registros de Comercial.");
      const pedidos = porFecha(enSede(comercial.pedidos, actor.sede), "fecha", filtro);
      const cotizaciones = porFecha(enSede(comercial.cotizaciones, actor.sede), "fecha", filtro);
      indicadores.push(["Pedidos registrados", pedidos.length], ["Cotizaciones registradas", cotizaciones.length]);
      tablas.push(tabla("Pedidos de venta", [columna("Pedido"), fecha("Fecha"), columna("Cliente"), columna("Estado"), moneda("Total")],
        fechaDescendente(pedidos, "fecha").map(p => [documento(p.numero, "comercial/pedidos/" + p.id), p.fecha, p.cliente.nombre, p.estado, p.total])));
      tablas.push(tabla("Cotizaciones", [columna("Cotización"), fecha("Fecha"), columna("Cliente"), columna("Estado"), moneda("Total")],
        fechaDescendente(cotizaciones, "fecha").map(c => [documento(c.numero, "comercial/cotizaciones/" + c.id), c.fecha, c.cliente.nombre, c.estado, c.total])));
    }
    if (puede(["Facturación", "Jefatura"])) {
      const ventas = porFecha(enSede(window.Libros.leer().documentos, actor.sede), "fecha", filtro).filter(d => d.tipo === "venta");
      indicadores.push(["Comprobantes emitidos", ventas.length], ["Total emitido con IGV", total(ventas, "total"), "moneda"]);
      tablas.push(tabla("Comprobantes de venta", [columna("Número"), fecha("Emisión"), columna("Cliente"), columna("Pedido"), moneda("Base"), moneda("IGV"), moneda("Total")],
        fechaDescendente(ventas, "fecha").map(d => [documento(d.referencia, window.Finanzas.rutaComprobante(d)), d.fecha, d.tercero, d.origenNumero, d.base, d.igv, d.total])));
    }
    return { indicadores, tablas };
  }

  function inventario(filtro, actor) {
    const A = window.LogisticaAplicacion, datos = A.leer();
    const productos = A.productos(), almacenes = new Map(datos.almacenes.map(a => [a.id, a.nombre]));
    const nombres = new Map(productos.map(p => [p.codigo, p.nombre]));
    const stock = window.LogisticaReglas.existencias(datos, productos, actor.sede);
    const indicadores = [["Unidades disponibles hoy", total(stock, "disponible")], ["Unidades reservadas hoy", total(stock, "reservado")]];
    const tablas = [tabla("Existencias actuales por almacén", [columna("Almacén"), columna("Código"), columna("Producto"), columna("Físico"),
      columna("Reservado"), columna("Retenido"), columna("Disponible"), columna("Cuarentena"), columna("Dañado"), columna("En reparación")],
    stock.map(s => [almacenes.get(s.almacen), s.codigo, nombres.get(s.codigo), s.fisico, s.reservado, s.retenido, s.disponible, s.cuarentena, s.danado, s.enReparacion]))];
    if (window.Permisos.tieneRol(actor, ["Compras", "Jefatura"])) {
      const ordenes = porFecha(enSede(datos.ordenes, actor.sede), "fecha", filtro);
      const facturas = porFecha(window.ContratosLogisticos.listarFacturasVerificadas(actor.sede), "fecha", filtro);
      indicadores.push(["Órdenes de compra del período", ordenes.length], ["Facturas de proveedor verificadas", facturas.length]);
      tablas.push(tabla("Órdenes de compra", [columna("Orden"), fecha("Fecha"), columna("Proveedor"), columna("Estado"), moneda("Base sin IGV")],
        fechaDescendente(ordenes, "fecha").map(o => [documento(o.numero, "compras/ordenes/" + o.id), o.fecha, o.proveedor.nombre, o.estado, o.base])));
      tablas.push(tabla("Facturas verificadas", [columna("Cotejo"), columna("Factura"), fecha("Fecha"), columna("Proveedor"), moneda("Total con IGV")],
        fechaDescendente(facturas, "fecha").map(f => [documento(f.numero, "compras/facturas/" + f.id), f.documento, f.fecha, f.proveedor, f.base + f.igv])));
    }
    return { indicadores, tablas };
  }

  function entregas(filtro, actor) {
    const salidas = porFecha(enSede(window.LogisticaAplicacion.leer().despachos, actor.sede), "fecha", filtro);
    const indicadores = ["Entregado", "Entrega parcial", "No entregado", "En ruta"]
      .map(estado => [estado, salidas.filter(s => s.estado === estado).length]);
    const tablas = [tabla("Órdenes de salida del período", [columna("Orden"), fecha("Fecha de salida"), fecha("Fecha de entrega"),
      columna("Destino"), columna("Estado"), columna("Unidades entregadas")], fechaDescendente(salidas, "fecha").map(s => [
      documento(s.numero, "despachos/despachos/" + s.id), s.fecha, s.entregadoEn || "", s.destino, s.estado, total(s.lineas, "entregada")
    ]))];
    return { indicadores, tablas };
  }

  function tesoreria(filtro, actor) {
    const d = window.Libros.leer(), F = window.Finanzas;
    const movimientos = enSede(d.movimientos, actor.sede);
    const corte = { movimientos: movimientos.filter(m => m.fecha <= filtro.hasta) };
    const pendientes = enSede(d.documentos, actor.sede).filter(doc => doc.fecha <= filtro.hasta)
      .map(doc => ({ doc, saldo: F.saldo(corte, doc) })).filter(item => item.saldo > 0);
    const delPeriodo = porFecha(movimientos, "fecha", filtro);
    const indicadores = [
      ["Saldo por cobrar al corte", total(pendientes.filter(x => x.doc.tipo === "venta"), "saldo"), "moneda"],
      ["Saldo por pagar al corte", total(pendientes.filter(x => x.doc.tipo === "compra"), "saldo"), "moneda"],
      ["Ingresos del período", total(delPeriodo.filter(m => m.direccion === "Ingreso"), "importe"), "moneda"],
      ["Egresos del período", total(delPeriodo.filter(m => m.direccion === "Egreso"), "importe"), "moneda"]
    ];
    const tablas = [tabla("Cuentas pendientes al corte", [columna("Comprobante"), columna("Tipo"), columna("Tercero"), fecha("Vence"),
      moneda("Total"), moneda("Saldo"), columna("Estado al corte")], pendientes.sort((a, b) => a.doc.vence.localeCompare(b.doc.vence)).map(({ doc, saldo }) => [
      documento(doc.referencia, F.rutaDocumento(doc)), doc.tipo === "venta" ? "Por cobrar" : "Por pagar", doc.tercero, doc.vence,
      doc.total, saldo, doc.vence < filtro.hasta ? "Vencida" : saldo < doc.total ? "Parcial" : "Pendiente"
    ])), tabla("Movimientos del período", [columna("Movimiento"), fecha("Fecha"), columna("Cuenta"), columna("Tipo"), columna("Referencia"), moneda("Importe")],
      fechaDescendente(delPeriodo, "fecha").map(m => [m.numero, m.fecha, F.cuentas[m.cuenta].nombre, m.tipo, m.referencia, m.importe])),
    tabla("Saldos por cuenta al corte", [columna("Cuenta"), moneda("Saldo")],
      Object.entries(F.cuentas).map(([id, cuenta]) => [cuenta.nombre, F.saldoCuenta(corte, actor.sede, id, filtro.hasta)]))];
    return { indicadores, tablas };
  }

  function contabilidad(filtro, actor) {
    const d = window.Libros.leer(), C = window.Contabilidad;
    const balance = C.balances(d, actor.sede, filtro.mes).filter(r => r.inicial || r.debe || r.haber || r.final);
    const asientos = enSede(d.asientos, actor.sede).filter(a => a.fecha.slice(0, 7) === filtro.mes);
    const cierre = d.cierres.some(p => p.sede === actor.sede && p.mes === filtro.mes);
    const indicadores = [["Estado del período", cierre ? "Cerrado" : "Abierto"],
      ["Asientos contabilizados", asientos.filter(a => a.estado === "Contabilizado").length],
      ["Asientos pendientes", asientos.filter(a => a.estado === "Pendiente").length]];
    const filas = balance.map(r => [r.cuenta, r.nombre, r.inicial, r.debe, r.haber, r.final]);
    if (filas.length) filas.push(["", "Total", ...["inicial", "debe", "haber", "final"].map(campo => total(balance, campo))]);
    const tablas = [tabla("Balance de comprobación", [columna("Cuenta"), columna("Nombre"), moneda("Saldo inicial"),
      moneda("Debe"), moneda("Haber"), moneda("Saldo final")], filas),
    tabla("Asientos del período", [columna("Asiento"), fecha("Fecha"), columna("Concepto"), columna("Estado"), moneda("Debe"), moneda("Haber")],
      fechaDescendente(asientos, "fecha").map(a => {
        const { debe, haber } = window.Libros.totales(a.lineas);
        return [documento(a.numero, "contabilidad/asientos/" + a.id), a.fecha, a.concepto, a.estado, debe, haber];
      }))];
    return { indicadores, tablas };
  }

  function csv({ columnas, filas }) {
    const textoSeguro = valor => {
      const texto = String(valor ?? "");
      const seguro = /^[\s\uFEFF]*[=+\-@]|^[\t\r\n]/.test(texto) ? "'" + texto : texto;
      return '"' + seguro.replaceAll('"', '""') + '"';
    };
    const lineas = filas.map(fila => fila.map((valor, indice) => {
      if (columnas[indice].formato === "moneda") return (valor / 100).toFixed(2);
      if (typeof valor === "number") return String(valor);
      return textoSeguro(valor?.texto ?? valor);
    }).join(";"));
    return "\uFEFF" + [columnas.map(c => textoSeguro(c.titulo)).join(";"), ...lineas].join("\r\n") + "\r\n";
  }

  return { ventas, inventario, entregas, tesoreria, contabilidad, csv };
})();
