
"use strict";

window.TesoreriaReglas = (() => {
  const L = window.LogisticaReglas;
  const roles = ["Tesorería", "Jefatura", "Contabilidad"];
  const colecciones = ["cuentas", "partidas", "pagos", "movimientos", "extractos", "saldosBanco"];
  const tiposCuenta = ["Banco", "Caja"];
  const tiposPartida = ["Cobrar", "Pagar"];
  const ajustes = { "Comisión bancaria": "Salida", "Interés bancario": "Entrada" };
  const pendientes = ["Preparado", "Aprobado", "Enviado"];
  const firmar = (direccion, importe) => direccion === "Entrada" ? importe : -importe;
  const porSede = (lista, sede) => lista.filter(r => r.sede === sede);
  const clave = valor => valor.trim().normalize("NFKC").toLocaleUpperCase("es");

  function permitir(actor, autorizados = roles) {
    L.exigir(autorizados.includes(actor?.rol) && actor.nombre?.trim() &&
      window.FAMIHOGAR.sedes.some(s => s.id === actor.sede), "Tu rol o sede no permite esta operación de Tesorería.");
  }

  function inicializar(guardados) {
    if (guardados === null) return { version: 1, ...Object.fromEntries(colecciones.map(k => [k, []])) };
    L.exigir(guardados?.version === 1 && colecciones.every(k => Array.isArray(guardados[k])),
      "Los datos locales de Tesorería no son compatibles.");
    return guardados;
  }

  function texto(valor, campo, limite = 80) {
    valor = typeof valor === "string" ? valor.trim() : "";
    L.exigir(valor.length > 0 && valor.length <= limite, `Indica ${campo} (máximo ${limite} caracteres).`);
    return valor;
  }

  function importe(valor, minimo = 1) {
    L.exigir(Number.isSafeInteger(valor) && valor >= minimo && valor <= 10000000000,
      "Ingresa un importe válido en soles, con hasta dos decimales.");
    return valor;
  }

  function fechaReal(valor, hoy, desde) {
    L.exigir(L.fechaValida(valor) && valor <= hoy && (!desde || valor >= desde),
      desde ? `La fecha debe estar entre ${desde} y ${hoy}.` : "Indica una fecha válida hasta hoy.");
  }

  function registrarCuenta(d, e, actor, hoy) {
    permitir(actor, ["Jefatura"]);
    L.exigir(tiposCuenta.includes(e.tipo), "Selecciona Banco o Caja.");
    const nombre = texto(e.nombre, "el nombre de la cuenta");
    const identificador = texto(e.identificador, e.tipo === "Banco" ? "el identificador bancario" : "el código de caja");
    const banco = e.tipo === "Banco" ? texto(e.banco, "el banco") : "";
    L.exigir(!porSede(d.cuentas, actor.sede).some(c => c.tipo === e.tipo &&
      clave(c.identificador) === clave(identificador) && clave(c.banco) === clave(banco)), "La cuenta ya está registrada en esta sede.");
    fechaReal(e.fecha, hoy);
    return L.crear(d.cuentas, "TES-CTA", { nombre, tipo: e.tipo, banco, identificador, fecha: e.fecha,
      apertura: importe(e.apertura, 0) }, actor, "Cuenta registrada");
  }

  function registrarPartida(d, e, actor, hoy) {
    permitir(actor, ["Tesorería"]);
    L.exigir(tiposPartida.includes(e.tipo), "Selecciona una cuenta por cobrar o pagar.");
    const tercero = texto(e.tercero, "el cliente o proveedor", 150);
    const documento = texto(e.documento, "la referencia del documento");
    L.exigir(!porSede(d.partidas, actor.sede).some(p => p.tipo === e.tipo && clave(p.tercero) === clave(tercero) &&
      clave(p.documento) === clave(documento)), "El documento ya está registrado para ese tercero.");
    fechaReal(e.fecha, hoy);
    L.exigir(L.fechaValida(e.vence) && e.vence >= e.fecha, "El vencimiento debe ser igual o posterior a la fecha del documento.");
    return L.crear(d.partidas, e.tipo === "Cobrar" ? "TES-CXC" : "TES-CXP", {
      tipo: e.tipo, tercero, documento, fecha: e.fecha, vence: e.vence, total: importe(e.importe)
    }, actor, "Documento registrado");
  }

  function importarFactura(d, id, vence, actor, hoy, facturas) {
    permitir(actor, ["Tesorería"]);
    const factura = facturas.find(f => f.id === id && f.sede === actor.sede && f.estado === "Verificada" && f.moneda === "PEN");
    L.exigir(factura, "Selecciona una factura de Logística verificada en esta sede.");
    L.exigir(!d.partidas.some(p => p.facturaLogisticaId === id), "La factura de Logística ya fue incorporada.");
    const p = registrarPartida(d, { tipo: "Pagar", tercero: factura.proveedor, documento: factura.documento,
      fecha: factura.fecha, vence, importe: factura.base + factura.igv }, actor, hoy);
    p.facturaLogisticaId = factura.id;
    p.referenciaLogistica = factura.numero;
    p.historial.push(L.evento(actor, `Importada de Logística: ${factura.numero}`));
    return p;
  }

  function saldoPartida(d, p) {
    return d.movimientos.filter(m => m.partidaId === p.id).reduce((saldo, m) => saldo - m.importe, p.total);
  }

  function pagoPendiente(d, partidaId) {
    return d.pagos.filter(p => p.partidaId === partidaId && pendientes.includes(p.estado));
  }

  function saldoCuenta(d, c, hasta) {
    if (c.fecha > hasta) return 0;
    return d.movimientos.filter(m => m.cuentaId === c.id && m.fecha <= hasta)
      .reduce((saldo, m) => saldo + firmar(m.direccion, m.importe), c.apertura);
  }

  // El mínimo desde la fecha evita que una salida retroactiva deje días posteriores sin fondos.
  function disponible(d, c, fecha, pagoId) {
    const posteriores = new Map();
    for (const m of d.movimientos) {
      if (m.cuentaId !== c.id || m.fecha <= fecha) continue;
      posteriores.set(m.fecha, (posteriores.get(m.fecha) || 0) + firmar(m.direccion, m.importe));
    }
    let saldo = saldoCuenta(d, c, fecha), minimo = saldo;
    for (const dia of [...posteriores.keys()].sort()) {
      saldo += posteriores.get(dia);
      minimo = Math.min(minimo, saldo);
    }
    const reservado = d.pagos.filter(p => p.cuentaId === c.id && p.id !== pagoId && p.estado === "Enviado")
      .reduce((total, p) => total + p.importe, 0);
    return minimo - reservado;
  }

  function exigirCorteAbierto(d, cuentaId, fecha) {
    L.exigir(!d.saldosBanco.some(s => s.cuentaId === cuentaId && s.cierre && s.fecha >= fecha),
      "La fecha pertenece a una conciliación bancaria ya cerrada.");
  }

  function registrarMovimiento(d, e, c, actor, pagoId) {
    exigirCorteAbierto(d, c.id, e.fecha);
    const referencia = texto(e.referencia, "la referencia bancaria o de caja");
    L.exigir(!d.movimientos.some(m => m.cuentaId === c.id && m.direccion === e.direccion &&
      clave(m.referencia) === clave(referencia)), "Ya existe un movimiento con esa referencia en la cuenta.");
    if (e.direccion === "Salida") L.exigir(e.importe <= disponible(d, c, e.fecha, pagoId), "La cuenta no tiene fondos disponibles para esta salida.");
    return L.crear(d.movimientos, "TES-MOV", { ...e, referencia, cuentaId: c.id }, actor, "Movimiento confirmado");
  }

  function cobrar(d, id, e, actor, hoy) {
    permitir(actor, ["Tesorería"]);
    const p = L.obtener(d.partidas, id, actor), c = L.obtener(d.cuentas, e.cuentaId, actor);
    L.exigir(p.tipo === "Cobrar", "Selecciona una cuenta por cobrar.");
    const monto = importe(e.importe);
    L.exigir(monto <= saldoPartida(d, p), "El importe supera el saldo pendiente.");
    fechaReal(e.fecha, hoy, p.fecha > c.fecha ? p.fecha : c.fecha);
    return registrarMovimiento(d, { partidaId: p.id, direccion: "Entrada", concepto: "Cobro", importe: monto,
      fecha: e.fecha, referencia: e.referencia }, c, actor);
  }

  function prepararPago(d, id, e, actor, hoy) {
    permitir(actor, ["Tesorería"]);
    const p = L.obtener(d.partidas, id, actor), c = L.obtener(d.cuentas, e.cuentaId, actor);
    L.exigir(p.tipo === "Pagar" && c.tipo === "Banco", "Selecciona una cuenta por pagar y una cuenta bancaria.");
    const monto = importe(e.importe);
    const reservado = pagoPendiente(d, p.id).reduce((total, pago) => total + pago.importe, 0);
    L.exigir(monto <= saldoPartida(d, p) - reservado, "El importe supera el saldo sin programar.");
    L.exigir(L.fechaValida(e.fecha) && e.fecha >= hoy && e.fecha >= c.fecha, "Indica una fecha programada a partir de hoy.");
    return L.crear(d.pagos, "TES-PAG", {
      partidaId: p.id, cuentaId: c.id, importe: monto, fecha: e.fecha, estado: "Preparado",
      beneficiario: texto(e.beneficiario, "la identificación de la cuenta destino", 100)
    }, actor, "Pago preparado");
  }

  function cambiarPago(d, id, accion, e, actor, hoy) {
    const revisar = ["aprobar", "rechazar"].includes(accion);
    permitir(actor, revisar ? ["Jefatura"] : ["Tesorería"]);
    const pago = L.obtener(d.pagos, id, actor);
    const siguiente = {
      aprobar: [["Preparado"], "Aprobado"], rechazar: [["Preparado"], "Rechazado"],
      cancelar: [["Preparado", "Aprobado"], "Cancelado"], fallar: [["Enviado"], "Fallido"],
      enviar: [["Aprobado"], "Enviado"], confirmar: [["Enviado"], "Confirmado"]
    };
    L.exigir(Object.hasOwn(siguiente, accion) && siguiente[accion][0].includes(pago.estado), "El pago cambió de estado. Revisa el registro.");
    let detalle;
    if (revisar) {
      L.independiente(actor, pago.registradoPor);
      detalle = L.motivo(texto(e.motivo, "el motivo de revisión", 300));
    } else if (accion === "cancelar" || accion === "fallar") {
      detalle = L.motivo(texto(e.motivo, "el motivo y su evidencia", 300));
    } else {
      const c = L.obtener(d.cuentas, pago.cuentaId, actor);
      const p = L.obtener(d.partidas, pago.partidaId, actor);
      if (accion === "enviar") {
        L.exigir(hoy >= pago.fecha, "El pago aún no llega a su fecha programada.");
        exigirCorteAbierto(d, c.id, hoy);
        L.exigir(pago.importe <= disponible(d, c, hoy), "La cuenta no tiene fondos disponibles para enviar el pago.");
        detalle = texto(e.referencia, "la referencia de envío");
        L.exigir(!d.pagos.some(otro => otro.cuentaId === c.id && otro.referenciaEnvio && clave(otro.referenciaEnvio) === clave(detalle)),
          "La referencia de envío ya está registrada en esa cuenta.");
        pago.referenciaEnvio = detalle;
        pago.enviadoEl = hoy;
      } else {
        fechaReal(e.fecha, hoy, pago.enviadoEl);
        L.exigir(pago.importe <= saldoPartida(d, p), "El importe supera el saldo pendiente.");
        const m = registrarMovimiento(d, { partidaId: p.id, pagoId: id, direccion: "Salida", concepto: "Pago",
          importe: pago.importe, fecha: e.fecha, referencia: e.referencia }, c, actor, id);
        pago.movimientoId = m.id;
        detalle = m.referencia;
      }
    }
    pago.estado = siguiente[accion][1];
    pago.historial.push(L.evento(actor, `${pago.estado}: ${detalle}`));
    return pago;
  }

  function ajustar(d, e, actor, hoy) {
    permitir(actor, ["Tesorería"]);
    const c = L.obtener(d.cuentas, e.cuentaId, actor);
    L.exigir(c.tipo === "Banco" && Object.hasOwn(ajustes, e.concepto), "Selecciona un ajuste y una cuenta bancaria.");
    fechaReal(e.fecha, hoy, c.fecha);
    return registrarMovimiento(d, { concepto: e.concepto, direccion: ajustes[e.concepto], importe: importe(e.importe),
      fecha: e.fecha, referencia: e.referencia }, c, actor);
  }

  const maxBytesExtracto = 256 * 1024;
  const claveExtracto = x => JSON.stringify([x.fecha, x.direccion, x.importe, clave(x.referencia)]);
  const clavesDeCuenta = (d, id) => new Set(d.extractos.filter(x => x.cuentaId === id).map(claveExtracto));

  function cuentaDeExtracto(d, id, actor) {
    permitir(actor, ["Tesorería"]);
    const cuenta = L.obtener(d.cuentas, id, actor);
    L.exigir(cuenta.tipo === "Banco", "Selecciona una cuenta bancaria.");
    return cuenta;
  }

  function datosDeExtracto(e, cuenta, hoy) {
    L.exigir(["Entrada", "Salida"].includes(e.direccion), "Usa Entrada o Salida como tipo de movimiento.");
    fechaReal(e.fecha, hoy, cuenta.fecha);
    return { cuentaId: cuenta.id, fecha: e.fecha, referencia: texto(e.referencia, "la referencia del extracto"),
      direccion: e.direccion, importe: importe(e.importe) };
  }

  function registrarExtracto(d, e, actor, hoy) {
    const cuenta = cuentaDeExtracto(d, e.cuentaId, actor);
    const linea = datosDeExtracto(e, cuenta, hoy);
    exigirCorteAbierto(d, cuenta.id, linea.fecha);
    L.exigir(!clavesDeCuenta(d, cuenta.id).has(claveExtracto(linea)), "La línea de extracto ya está registrada.");
    return L.crear(d.extractos, "TES-EXT", linea, actor, "Línea de extracto registrada");
  }

  function leerExtractoCsv(contenido) {
    L.exigir(typeof contenido === "string" && contenido.length <= maxBytesExtracto &&
      new TextEncoder().encode(contenido).length <= maxBytesExtracto,
      "Selecciona un CSV de hasta 256 KB.");
    const lineas = contenido.replace(/^\uFEFF/, "").split(/\r\n|\n|\r/)
      .map((texto, i) => ({ texto: texto.trim(), numero: i + 1 })).filter(l => l.texto);
    const encabezado = lineas.shift()?.texto.toLowerCase();
    const columnas = ["fecha", "referencia", "tipo", "importe"];
    const separador = [",", ";"].find(s => encabezado?.split(s).map(c => c.trim().replace(/^"([a-z]+)"$/, "$1"))
      .join(",") === columnas.join(","));
    L.exigir(separador, "El encabezado debe ser fecha,referencia,tipo,importe.");
    L.exigir(lineas.length > 0 && lineas.length <= 1000, "El CSV debe tener entre 1 y 1000 movimientos.");
    const campo = `(?:"((?:[^"]|"")*)"|([^"${separador}]*))`;
    const patron = new RegExp(`^${columnas.map(() => `\\s*${campo}\\s*`).join(separador)}$`);
    return lineas.map(({ texto, numero }) => {
      const campos = texto.length <= 512 && patron.exec(texto);
      L.exigir(campos, `Fila ${numero}: se necesitan cuatro columnas en una sola línea.`);
      const [fecha, referencia, tipo, monto] = columnas.map((_, i) =>
        (campos[2 * i + 1]?.replace(/""/g, '"') ?? campos[2 * i + 2]).trim());
      L.exigir(/^\d{1,9}(?:[.,]\d{1,2})?$/.test(monto),
        `Fila ${numero}: escribe el importe con hasta dos decimales y sin separadores de miles.`);
      const direccion = { ENTRADA: "Entrada", SALIDA: "Salida" }[clave(tipo)];
      return { numero, fecha, referencia, direccion, importe: Math.round(Number(monto.replace(",", ".")) * 100) };
    });
  }

  function importarExtracto(d, cuentaId, contenido, nombreArchivo, actor, hoy) {
    const cuenta = cuentaDeExtracto(d, cuentaId, actor);
    const archivo = texto(nombreArchivo, "el nombre del archivo", 255);
    const conocidas = clavesDeCuenta(d, cuenta.id);
    const nuevas = [];
    let duplicadas = 0;
    for (const fila of leerExtractoCsv(contenido)) {
      try {
        const linea = datosDeExtracto(fila, cuenta, hoy);
        const identificador = claveExtracto(linea);
        if (conocidas.has(identificador)) {
          duplicadas++;
          continue;
        }
        exigirCorteAbierto(d, cuenta.id, linea.fecha);
        nuevas.push(linea);
        conocidas.add(identificador);
      } catch (error) {
        throw new Error(`Fila ${fila.numero}: ${error.message}`);
      }
    }
    for (const linea of nuevas) {
      L.crear(d.extractos, "TES-EXT", linea, actor, `Línea importada desde ${archivo}`);
    }
    return { incorporadas: nuevas.length, duplicadas };
  }

  function candidatos(d, x) {
    const usados = new Set(d.extractos.map(linea => linea.movimientoId).filter(Boolean));
    return d.movimientos.filter(m => !usados.has(m.id) && m.cuentaId === x.cuentaId && m.sede === x.sede &&
      m.direccion === x.direccion && m.importe === x.importe);
  }

  function sugerencias(d, x) {
    return candidatos(d, x).filter(m => m.fecha === x.fecha && clave(m.referencia) === clave(x.referencia));
  }

  function conciliar(d, id, e, actor) {
    permitir(actor, ["Tesorería"]);
    const x = L.obtener(d.extractos, id, actor);
    exigirCorteAbierto(d, x.cuentaId, x.fecha);
    L.exigir(!x.movimientoId, "La línea de extracto ya está conciliada.");
    const exactos = sugerencias(d, x);
    const manual = Boolean(e.movimientoId);
    const m = manual ? candidatos(d, x).find(m => m.id === e.movimientoId) : exactos.length === 1 ? exactos[0] : null;
    L.exigir(m, "Selecciona un movimiento disponible con la misma cuenta, tipo e importe.");
    const detalle = manual ? L.motivo(texto(e.motivo, "el motivo de conciliación asistida", 300)) : "Coincidencia por importe, fecha y referencia";
    x.movimientoId = m.id;
    x.historial.push(L.evento(actor, `Conciliado: ${detalle}`));
    return x;
  }

  function observar(d, id, motivo, actor) {
    permitir(actor, ["Tesorería"]);
    const x = L.obtener(d.extractos, id, actor);
    exigirCorteAbierto(d, x.cuentaId, x.fecha);
    L.exigir(!x.movimientoId, "La línea de extracto ya está conciliada.");
    x.observacion = L.motivo(texto(motivo, "la observación", 300));
    x.historial.push(L.evento(actor, `Observación: ${x.observacion}`));
    return x;
  }

  function registrarSaldoBanco(d, e, actor, hoy) {
    permitir(actor, ["Tesorería"]);
    const c = L.obtener(d.cuentas, e.cuentaId, actor);
    L.exigir(c.tipo === "Banco", "Selecciona una cuenta bancaria.");
    fechaReal(e.fecha, hoy, c.fecha);
    exigirCorteAbierto(d, c.id, e.fecha);
    L.exigir(!d.saldosBanco.some(s => s.cuentaId === c.id && s.fecha === e.fecha), "Ya existe un saldo de extracto en esta fecha.");
    return L.crear(d.saldosBanco, "TES-SAL", { cuentaId: c.id, fecha: e.fecha,
      referencia: texto(e.referencia, "la referencia del extracto"), importe: importe(e.importe, -10000000000) },
    actor, "Saldo de extracto registrado");
  }

  function corteBanco(d, saldo) {
    if (saldo.cierre) return saldo.cierre;
    const c = d.cuentas.find(cuenta => cuenta.id === saldo.cuentaId);
    const extractos = d.extractos.filter(x => x.cuentaId === c.id && x.fecha <= saldo.fecha);
    const movimientos = d.movimientos.filter(m => m.cuentaId === c.id && m.fecha <= saldo.fecha);
    const idsLibro = new Set(movimientos.map(m => m.id));
    const vinculados = new Set(extractos.map(x => x.movimientoId));
    const pendientes = movimientos.filter(m => !vinculados.has(m.id));
    const excepciones = extractos.filter(x => !idsLibro.has(x.movimientoId)).length;
    const transito = pendientes.reduce((total, m) => total + firmar(m.direccion, m.importe), 0);
    const ajustado = saldo.importe + transito, libro = saldoCuenta(d, c, saldo.fecha);
    return { transito, ajustado, libro, diferencia: ajustado - libro, excepciones };
  }

  function cerrarConciliacion(d, id, motivo, actor) {
    permitir(actor, ["Contabilidad", "Jefatura"]);
    const saldo = L.obtener(d.saldosBanco, id, actor);
    exigirCorteAbierto(d, saldo.cuentaId, saldo.fecha);
    L.independiente(actor, saldo.registradoPor);
    const corte = corteBanco(d, saldo);
    L.exigir(corte.diferencia === 0 && corte.excepciones === 0, "Resuelve las diferencias y líneas de extracto pendientes antes de cerrar.");
    const detalle = L.motivo(texto(motivo, "el motivo de cierre", 300));
    saldo.cierre = corte;
    saldo.historial.push(L.evento(actor, `Conciliación cerrada: ${detalle}`));
    return saldo;
  }

  function flujo(d, sede, hoy, hasta) {
    const cuentas = porSede(d.cuentas, sede);
    const saldo = cuentas.reduce((total, c) => total + saldoCuenta(d, c, hoy), 0);
    const porFecha = new Map();
    const agregar = (fecha, tipo, importe) => {
      fecha = fecha < hoy ? hoy : fecha;
      if (!importe || fecha > hasta) return;
      const fila = porFecha.get(fecha) || { fecha, cobrar: 0, pagar: 0 };
      fila[tipo] += importe;
      porFecha.set(fecha, fila);
    };
    for (const p of porSede(d.partidas, sede)) {
      let restante = saldoPartida(d, p);
      if (p.tipo === "Pagar") {
        for (const pago of pagoPendiente(d, p.id)) {
          restante -= pago.importe;
          agregar(pago.fecha, "pagar", pago.importe);
        }
      }
      agregar(p.vence, p.tipo === "Pagar" ? "pagar" : "cobrar", restante);
    }
    let proyectado = saldo;
    const jornadas = [...porFecha.values()].sort((a, b) => a.fecha.localeCompare(b.fecha))
      .map(fila => ({ ...fila, saldo: proyectado += fila.cobrar - fila.pagar }));
    return { saldo, proyectado, jornadas };
  }

  return { roles, tiposCuenta, ajustes, permitir, inicializar, porSede, registrarCuenta, registrarPartida, importarFactura, saldoPartida,
    pagoPendiente, saldoCuenta, disponible, cobrar, prepararPago, cambiarPago, ajustar, registrarExtracto, importarExtracto, maxBytesExtracto, candidatos,
    sugerencias, conciliar, observar, registrarSaldoBanco, corteBanco, cerrarConciliacion, flujo };
})();
