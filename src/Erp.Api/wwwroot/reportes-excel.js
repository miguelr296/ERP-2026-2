"use strict";

window.ReportesExcel = (() => {
  const xml = valor => String(valor ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
    .replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
  const cabecera = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
  const rel = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const crearRelaciones = elementos => cabecera + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + elementos.map(([tipo, destino], i) => '<Relationship Id="rId' + (i + 1) + '" Type="' + rel + "/" + tipo + '" Target="' + destino + '"/>').join("")
    + '</Relationships>';
  const plantillaCrc = Uint32Array.from({ length: 256 }, (_, byte) => {
    let crc = byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    return crc;
  });
  const crc32 = datos => (datos.reduce((crc, byte) => (crc >>> 8) ^ plantillaCrc[(crc ^ byte) & 255], 0xffffffff) ^ 0xffffffff) >>> 0;

  function zip(archivos) {
    const encoder = new TextEncoder(), partes = [], directorio = [];
    let posicion = 0, pesoDirectorio = 0;
    for (const [ruta, contenido] of archivos) {
      const nombre = encoder.encode(ruta), datos = encoder.encode(contenido), crc = crc32(datos);
      const local = new DataView(new ArrayBuffer(30)), centro = new DataView(new ArrayBuffer(46));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(12, 33, true); // 1 de enero de 1980, fecha mínima del formato ZIP.
      local.setUint32(14, crc, true);
      local.setUint32(18, datos.length, true);
      local.setUint32(22, datos.length, true);
      local.setUint16(26, nombre.length, true);
      centro.setUint32(0, 0x02014b50, true);
      centro.setUint16(4, 20, true);
      new Uint8Array(centro.buffer).set(new Uint8Array(local.buffer, 4, 24), 6);
      centro.setUint32(42, posicion, true);
      partes.push(local.buffer, nombre, datos);
      directorio.push(centro.buffer, nombre);
      posicion += 30 + nombre.length + datos.length;
      pesoDirectorio += 46 + nombre.length;
    }
    const fin = new DataView(new ArrayBuffer(22));
    fin.setUint32(0, 0x06054b50, true);
    fin.setUint16(8, archivos.length, true);
    fin.setUint16(10, archivos.length, true);
    fin.setUint32(12, pesoDirectorio, true);
    fin.setUint32(16, posicion, true);
    return new Blob([...partes, ...directorio, fin.buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  function hoja(filas) {
    return cabecera + '<worksheet xmlns="' + ns + '"><sheetData>' + filas.map((fila, i) => '<row r="' + (i + 1) + '">' + fila.map(valor =>
      Number.isFinite(valor) ? '<c t="n"><v>' + valor + '</v></c>' : '<c t="inlineStr"><is><t xml:space="preserve">' + xml(valor) + '</t></is></c>'
    ).join("") + '</row>').join("") + '</sheetData></worksheet>';
  }

  function xlsx(tabla, metadatos) {
    const filas = [tabla.columnas.map(c => c.titulo), ...tabla.filas.map(fila => fila.map((valor, i) =>
      tabla.columnas[i].formato === "moneda" ? valor / 100 : valor?.texto ?? valor))];
    const tipos = cabecera + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
      + '<Default Extension="xml" ContentType="application/xml"/>'
      + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
      + [1, 2].map(n => '<Override PartName="/xl/worksheets/sheet' + n + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join("")
      + '</Types>';
    return zip([
      ["[Content_Types].xml", tipos], ["_rels/.rels", crearRelaciones([["officeDocument", "xl/workbook.xml"]])],
      ["xl/workbook.xml", cabecera + '<workbook xmlns="' + ns + '" xmlns:r="' + rel + '"><sheets>'
        + '<sheet name="Datos" sheetId="1" r:id="rId1"/><sheet name="Contexto" sheetId="2" r:id="rId2"/></sheets></workbook>'],
      ["xl/_rels/workbook.xml.rels", crearRelaciones([["worksheet", "worksheets/sheet1.xml"], ["worksheet", "worksheets/sheet2.xml"]])],
      ["xl/worksheets/sheet1.xml", hoja(filas)], ["xl/worksheets/sheet2.xml", hoja([["Reporte", tabla.titulo], ...metadatos])]
    ]);
  }

  return { xlsx };
})();
