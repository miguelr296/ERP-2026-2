"use strict";

// Datos iniciales y parámetros de la interfaz. Las sedes y registros son ficticios.
// Precios en céntimos: el cálculo monetario utiliza enteros.
window.FAMIHOGAR = {
  version: 2,
  parametros: { moneda: "PEN", igvPorcentaje: 18, diasVigencia: 7, descuentoAsesorBps: 500, descuentoMaximoBps: 2000 },
  sedes: [
    { id: "centro", nombre: "Lima Centro" },
    { id: "olivos", nombre: "Los Olivos" },
    { id: "surco", nombre: "Surco" }
  ],
  productos: [
    { codigo: "SOF-001", nombre: "Sofá Nube · 3 cuerpos", familia: "Sala", unidad: "Unidad", precio: 159900 },
    { codigo: "COM-001", nombre: "Comedor Roble · 4 sillas", familia: "Comedor", unidad: "Juego", precio: 189900 },
    { codigo: "CAM-001", nombre: "Cama Serena · 2 plazas", familia: "Dormitorio", unidad: "Unidad", precio: 119900 },
    { codigo: "MES-001", nombre: "Mesa de centro Aurora", familia: "Sala", unidad: "Unidad", precio: 34900 },
    { codigo: "EST-001", nombre: "Estante Terra · 5 niveles", familia: "Organización", unidad: "Unidad", precio: 45900 },
    { codigo: "SIL-001", nombre: "Silla Alma · tapizada", familia: "Comedor", unidad: "Unidad", precio: 22900 }
  ],
  clientes: [
    { id: "cli-001", tipoDocumento: "DNI", documento: "70000001", nombre: "Elena Rojas", correo: "elena@example.com", telefono: "900000001", direccion: "Av. Los Cedros 120, Lima", segmento: "Retail" },
    { id: "cli-002", tipoDocumento: "RUC", documento: "20000000001", nombre: "Espacios del Norte SAC", correo: "compras@example.com", telefono: "900000002", direccion: "Av. Las Palmeras 480, Lima", segmento: "Empresa" }
  ],
  oportunidades: [
    { id: "opo-001", numero: "OP-00001", clienteId: "cli-001", asunto: "Renovación de sala", canal: "Tienda", sede: "centro", vendedor: "Luis", estado: "Nueva", fecha: "2026-11-10", lineas: [{ codigo: "SOF-001", cantidad: 1 }, { codigo: "MES-001", cantidad: 1 }] },
    { id: "opo-002", numero: "OP-00002", clienteId: "cli-002", asunto: "Mobiliario para comedor", canal: "Web", sede: "olivos", vendedor: "Miguel", estado: "En seguimiento", fecha: "2026-11-10", lineas: [{ codigo: "COM-001", cantidad: 2 }] }
  ]
};

// El coste se mantiene separado del precio comercial y no se muestra al Asesor.
const costesIniciales = [105000, 125000, 78000, 21000, 28500, 13500];
window.FAMIHOGAR.productos.forEach((producto, indice) => {
  producto.coste = costesIniciales[indice];
  producto.estado = "Aprobado";
});
window.FAMIHOGAR.clientes.forEach(cliente => { cliente.estado = "Aprobado"; });

window.FAMIHOGAR.listasPrecio = [
  { id: "lista-tienda", nombre: "Retail Tienda", canal: "Tienda", segmento: "Retail", factor: 1 },
  { id: "lista-web", nombre: "Retail Web", canal: "Web", segmento: "Retail", factor: .97 },
  { id: "lista-telefono", nombre: "Retail Teléfono", canal: "Teléfono", segmento: "Retail", factor: 1 },
  { id: "lista-empresa-tienda", nombre: "Empresa Tienda", canal: "Tienda", segmento: "Empresa", factor: .95 },
  { id: "lista-empresa-web", nombre: "Empresa Web", canal: "Web", segmento: "Empresa", factor: .95 },
  { id: "lista-empresa-telefono", nombre: "Empresa Teléfono", canal: "Teléfono", segmento: "Empresa", factor: .95 }
].map(lista => ({
  ...lista, moneda: "PEN", desde: "2026-01-01", hasta: "2027-12-31", estado: "Aprobado", activa: true,
  precios: Object.fromEntries(window.FAMIHOGAR.productos.map(producto => [producto.codigo, Math.round(producto.precio * lista.factor)]))
}));
window.FAMIHOGAR.promociones = [
  { id: "hogar5", nombre: "Hogar 5 %", canal: "Tienda", segmento: "Retail", desde: "2026-01-01", hasta: "2027-12-31", descuentoBps: 500, activa: true, estado: "Aprobado" }
];
