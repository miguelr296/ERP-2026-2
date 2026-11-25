const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const web = path.resolve(__dirname, "../../src/Erp.Api/wwwroot");
const leer = archivo => readFileSync(path.join(web, archivo), "utf8");
const registros = leer("registros-demo.js");
const inicializar = leer("inicializar-demo.js");
const comercial = "famihogar.comercial.v1";
const logistica = "famihogar.logistica.v1";
const libros = "famihogar.libros.v1";

function navegador(guardados = [], fallarAlGuardar = null) {
  const memoria = new Map(guardados);
  const advertencias = [];
  const contexto = vm.createContext({
    window: {},
    document: { querySelector: () => null },
    console: { warn: mensaje => advertencias.push(mensaje) },
    localStorage: {
      getItem: clave => memoria.get(clave) ?? null,
      setItem: (clave, valor) => {
        if (clave === fallarAlGuardar) throw Error("No hay espacio para guardar.");
        memoria.set(clave, valor);
      },
      removeItem: clave => memoria.delete(clave)
    }
  });
  vm.runInContext(registros, contexto);
  return { memoria, advertencias, abrir: () => vm.runInContext(inicializar, contexto) };
}

test("el primer acceso carga los mismos registros enlazados en un perfil nuevo", () => {
  const primero = navegador(), segundo = navegador();
  primero.abrir();
  segundo.abrir();
  assert.deepEqual(primero.memoria, segundo.memoria);

  const ventas = JSON.parse(primero.memoria.get(comercial));
  const operaciones = JSON.parse(primero.memoria.get(logistica));
  const cuentas = JSON.parse(primero.memoria.get(libros));
  const tablas = [ventas, operaciones, cuentas].flatMap(grupo => Object.values(grupo).filter(Array.isArray));
  assert.equal(tablas.length, 41);
  assert.ok(tablas.every(tabla => tabla.length >= 5));
  assert.equal(tablas.reduce((total, tabla) => total + tabla.length, 0), 411);
  for (const documento of cuentas.documentos.filter(d => d.tipo === "venta")) {
    const pedido = ventas.pedidos.find(p => p.id === documento.origenId);
    assert.equal(pedido.facturas[0].id, documento.id);
    assert.ok(operaciones.despachos.some(d => d.pedidoId === pedido.id && d.estado === "Entregado"));
  }
});

test("un perfil con datos previos conserva su estado completo", () => {
  for (const clave of [comercial, logistica, libros]) {
    const guardados = [[clave, '{"version":2,"clientes":[{"id":"anterior"}]}']];
    const perfil = navegador(guardados);
    perfil.abrir();
    assert.deepEqual([...perfil.memoria], guardados);
  }
  const perfil = navegador();
  perfil.abrir();
  const ventas = JSON.parse(perfil.memoria.get(comercial));
  ventas.clientes[0].nombre = "Cliente modificado en este perfil";
  perfil.memoria.set(comercial, JSON.stringify(ventas));
  perfil.abrir();
  assert.equal(JSON.parse(perfil.memoria.get(comercial)).clientes[0].nombre, ventas.clientes[0].nombre);
});

test("se puede inicializar un perfil que solo guardó tablas vacías", () => {
  const perfil = navegador([[libros, JSON.stringify({ version: 1, documentos: [], creditos: [], pagos: [], movimientos: [], turnos: [], extractos: [], asientos: [], activos: [], cierres: [] })]]);
  perfil.abrir();
  assert.equal(perfil.memoria.size, 3);
  assert.equal(JSON.parse(perfil.memoria.get(libros)).documentos.length, 15);
});

test("un fallo al guardar revierte las claves creadas por la carga", () => {
  const perfil = navegador([], libros);
  perfil.abrir();
  assert.equal(perfil.memoria.size, 0);
  assert.equal(perfil.advertencias.length, 1);
});
