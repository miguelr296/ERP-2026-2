"use strict";

// Parámetros y registros iniciales de Logística; no son datos de una empresa real.
window.FAMIHOGAR_LOGISTICA = {
  version: 1,
  moneda: "PEN",
  igvPorcentaje: 18,
  almacenes: [
    { id: "alm-centro", sede: "centro", nombre: "Almacén Lima Centro", direccion: "Av. Central 100" },
    { id: "alm-olivos", sede: "olivos", nombre: "Almacén Los Olivos", direccion: "Av. Las Palmeras 200" },
    { id: "alm-surco", sede: "surco", nombre: "Almacén Surco", direccion: "Av. Los Jardines 300" }
  ],
  ubicaciones: [
    { codigo: "RECEPCION", nombre: "Zona de recepción", capacidad: 9999, estados: ["Cuarentena"] },
    { codigo: "CUARENTENA", nombre: "Inspección y no conformes", capacidad: 9999, estados: ["Cuarentena", "Dañado"] },
    { codigo: "RACK-A", nombre: "Muebles almacenados", capacidad: 500, estados: ["Disponible"] },
    { codigo: "EXHIBICION", nombre: "Sala de exhibición", capacidad: 100, estados: ["Disponible"] }
  ],
  existencias: {
    "alm-centro": { "SOF-001": 12, "COM-001": 8, "CAM-001": 6, "MES-001": 20, "EST-001": 10, "SIL-001": 30 },
    "alm-olivos": { "SOF-001": 4, "COM-001": 3, "CAM-001": 3, "MES-001": 8, "EST-001": 5, "SIL-001": 12 },
    "alm-surco": { "SOF-001": 5, "COM-001": 4, "CAM-001": 4, "MES-001": 10, "EST-001": 6, "SIL-001": 16 }
  },
  proveedores: [
    { id: "prov-madera", ruc: "20000000101", nombre: "Muebles del Bosque SAC", correo: "ventas@bosque.example.com", telefono: "900000101", direccion: "Av. Industrial 100", condicion: "Crédito 30 días", estado: "Aprobado", registradoPor: "Carga inicial", historial: [] },
    { id: "prov-hogar", ruc: "20000000102", nombre: "Diseño y Hogar SAC", correo: "ventas@hogar.example.com", telefono: "900000102", direccion: "Av. Talleres 200", condicion: "Contado", estado: "Aprobado", registradoPor: "Carga inicial", historial: [] }
  ],
  reposicion: { minimo: 2, objetivo: 12 }
};
