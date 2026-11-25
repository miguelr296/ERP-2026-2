"use strict";

// Escenario ficticio compartido con instalaciones nuevas del ERP.
window.FAMIHOGAR_DATOS_DEMO = {
  "famihogar.logistica.v1": {
    "version": 2,
    "revision": 0,
    "almacenes": [
      {
        "id": "alm-centro",
        "sede": "centro",
        "nombre": "Almacén Lima Centro",
        "direccion": "Zona de demostración · Almacén Lima Centro",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "id": "alm-olivos",
        "sede": "olivos",
        "nombre": "Almacén Los Olivos",
        "direccion": "Zona de demostración · Almacén Los Olivos",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "id": "alm-surco",
        "sede": "surco",
        "nombre": "Almacén Surco",
        "direccion": "Zona de demostración · Almacén Surco",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "nombre": "Depósito de exhibición Demo",
        "direccion": "Zona de demostración 1",
        "activo": true,
        "estado": "Activo",
        "id": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "numero": "ALM-00001",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.613Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Almacén creado: Operación de demostración validada"
          }
        ]
      },
      {
        "nombre": "Depósito de respaldo Demo",
        "direccion": "Zona de demostración 2",
        "activo": true,
        "estado": "Activo",
        "id": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "numero": "ALM-00002",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.613Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Almacén creado: Operación de demostración validada"
          }
        ]
      }
    ],
    "ubicaciones": [
      {
        "codigo": "RECEPCION",
        "nombre": "Zona de recepción",
        "capacidad": 9999,
        "estados": [
          "Cuarentena"
        ],
        "id": "ubicacion-alm-centro-RECEPCION",
        "almacen": "alm-centro",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "CUARENTENA",
        "nombre": "Inspección y no conformes",
        "capacidad": 9999,
        "estados": [
          "Cuarentena",
          "Dañado"
        ],
        "id": "ubicacion-alm-centro-CUARENTENA",
        "almacen": "alm-centro",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "RACK-A",
        "nombre": "Muebles almacenados",
        "capacidad": 500,
        "estados": [
          "Disponible"
        ],
        "id": "ubicacion-alm-centro-RACK-A",
        "almacen": "alm-centro",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "EXHIBICION",
        "nombre": "Sala de exhibición",
        "capacidad": 100,
        "estados": [
          "Disponible"
        ],
        "id": "ubicacion-alm-centro-EXHIBICION",
        "almacen": "alm-centro",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "TALLER",
        "nombre": "Zona de reparación",
        "capacidad": 100,
        "estados": [
          "En reparación"
        ],
        "id": "ubicacion-alm-centro-TALLER",
        "almacen": "alm-centro",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "RECEPCION",
        "nombre": "Zona de recepción",
        "capacidad": 9999,
        "estados": [
          "Cuarentena"
        ],
        "id": "ubicacion-alm-olivos-RECEPCION",
        "almacen": "alm-olivos",
        "sede": "olivos",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "CUARENTENA",
        "nombre": "Inspección y no conformes",
        "capacidad": 9999,
        "estados": [
          "Cuarentena",
          "Dañado"
        ],
        "id": "ubicacion-alm-olivos-CUARENTENA",
        "almacen": "alm-olivos",
        "sede": "olivos",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "RACK-A",
        "nombre": "Muebles almacenados",
        "capacidad": 500,
        "estados": [
          "Disponible"
        ],
        "id": "ubicacion-alm-olivos-RACK-A",
        "almacen": "alm-olivos",
        "sede": "olivos",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "EXHIBICION",
        "nombre": "Sala de exhibición",
        "capacidad": 100,
        "estados": [
          "Disponible"
        ],
        "id": "ubicacion-alm-olivos-EXHIBICION",
        "almacen": "alm-olivos",
        "sede": "olivos",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "TALLER",
        "nombre": "Zona de reparación",
        "capacidad": 100,
        "estados": [
          "En reparación"
        ],
        "id": "ubicacion-alm-olivos-TALLER",
        "almacen": "alm-olivos",
        "sede": "olivos",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "RECEPCION",
        "nombre": "Zona de recepción",
        "capacidad": 9999,
        "estados": [
          "Cuarentena"
        ],
        "id": "ubicacion-alm-surco-RECEPCION",
        "almacen": "alm-surco",
        "sede": "surco",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "CUARENTENA",
        "nombre": "Inspección y no conformes",
        "capacidad": 9999,
        "estados": [
          "Cuarentena",
          "Dañado"
        ],
        "id": "ubicacion-alm-surco-CUARENTENA",
        "almacen": "alm-surco",
        "sede": "surco",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "RACK-A",
        "nombre": "Muebles almacenados",
        "capacidad": 500,
        "estados": [
          "Disponible"
        ],
        "id": "ubicacion-alm-surco-RACK-A",
        "almacen": "alm-surco",
        "sede": "surco",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "EXHIBICION",
        "nombre": "Sala de exhibición",
        "capacidad": 100,
        "estados": [
          "Disponible"
        ],
        "id": "ubicacion-alm-surco-EXHIBICION",
        "almacen": "alm-surco",
        "sede": "surco",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "TALLER",
        "nombre": "Zona de reparación",
        "capacidad": 100,
        "estados": [
          "En reparación"
        ],
        "id": "ubicacion-alm-surco-TALLER",
        "almacen": "alm-surco",
        "sede": "surco",
        "activo": true,
        "estado": "Activo",
        "historial": []
      },
      {
        "codigo": "RECEPCION",
        "nombre": "Zona de recepción",
        "capacidad": 9999,
        "estados": [
          "Cuarentena"
        ],
        "id": "c7420c51-0d85-4ee4-a228-59f5ed44ccd6",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.613Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      },
      {
        "codigo": "CUARENTENA",
        "nombre": "Inspección y no conformes",
        "capacidad": 9999,
        "estados": [
          "Cuarentena",
          "Dañado"
        ],
        "id": "38a96dfc-981e-45a4-8f08-a47dbf12f0fe",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.613Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      },
      {
        "codigo": "RACK-A",
        "nombre": "Muebles almacenados",
        "capacidad": 500,
        "estados": [
          "Disponible"
        ],
        "id": "8188653b-c7f9-46bc-86b8-e698203e364d",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.613Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      },
      {
        "codigo": "EXHIBICION",
        "nombre": "Sala de exhibición",
        "capacidad": 100,
        "estados": [
          "Disponible"
        ],
        "id": "dda8ffd7-8563-45b5-9299-725800f90422",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.613Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      },
      {
        "codigo": "TALLER",
        "nombre": "Zona de reparación",
        "capacidad": 100,
        "estados": [
          "En reparación"
        ],
        "id": "50be79e4-fc86-4961-bf12-cad3ed3709ea",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.613Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      },
      {
        "codigo": "RECEPCION",
        "nombre": "Zona de recepción",
        "capacidad": 9999,
        "estados": [
          "Cuarentena"
        ],
        "id": "8303a42f-5d9b-426c-93d0-da7d5baf87e7",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.614Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      },
      {
        "codigo": "CUARENTENA",
        "nombre": "Inspección y no conformes",
        "capacidad": 9999,
        "estados": [
          "Cuarentena",
          "Dañado"
        ],
        "id": "7f4106af-5b17-43d4-af41-3f3b86a8fd63",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.614Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      },
      {
        "codigo": "RACK-A",
        "nombre": "Muebles almacenados",
        "capacidad": 500,
        "estados": [
          "Disponible"
        ],
        "id": "e8856550-c695-43ef-9623-dceae47c0ef5",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.614Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      },
      {
        "codigo": "EXHIBICION",
        "nombre": "Sala de exhibición",
        "capacidad": 100,
        "estados": [
          "Disponible"
        ],
        "id": "e9deb19b-e519-493a-a45a-95597062d46b",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.614Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      },
      {
        "codigo": "TALLER",
        "nombre": "Zona de reparación",
        "capacidad": 100,
        "estados": [
          "En reparación"
        ],
        "id": "3ed38472-443b-453d-bb4c-e6e1a4320135",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "sede": "centro",
        "activo": true,
        "estado": "Activo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.614Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Ubicación inicial del almacén"
          }
        ]
      }
    ],
    "proveedores": [
      {
        "nombre": "Carpintería Sauce SAC",
        "ruc": "20991000001",
        "direccion": "Parque Industrial Demo 110",
        "correo": "proveedor1@example.com",
        "telefono": "900991001",
        "condicion": "Crédito 30 días",
        "estado": "Aprobado",
        "id": "9018c795-85e0-441f-afa3-c479fd151669",
        "numero": "PROV-00001",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.645Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Alta de proveedor propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación de proveedor: Operación de demostración validada"
          }
        ]
      },
      {
        "nombre": "Tapizados Brezo SAC",
        "ruc": "20991000002",
        "direccion": "Parque Industrial Demo 120",
        "correo": "proveedor2@example.com",
        "telefono": "900991002",
        "condicion": "Crédito 30 días",
        "estado": "Aprobado",
        "id": "4f202324-0981-4ef3-aec5-653adb65c69d",
        "numero": "PROV-00002",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Alta de proveedor propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación de proveedor: Operación de demostración validada"
          }
        ]
      },
      {
        "nombre": "Maderas Jacarandá SAC",
        "ruc": "20991000003",
        "direccion": "Parque Industrial Demo 130",
        "correo": "proveedor3@example.com",
        "telefono": "900991003",
        "condicion": "Crédito 30 días",
        "estado": "Aprobado",
        "id": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
        "numero": "PROV-00003",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Alta de proveedor propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación de proveedor: Operación de demostración validada"
          }
        ]
      },
      {
        "nombre": "Herrajes Acanto SAC",
        "ruc": "20991000004",
        "direccion": "Parque Industrial Demo 140",
        "correo": "proveedor4@example.com",
        "telefono": "900991004",
        "condicion": "Crédito 30 días",
        "estado": "Aprobado",
        "id": "cc92b8d8-762b-42fe-9302-11f4c2260832",
        "numero": "PROV-00004",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Alta de proveedor propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación de proveedor: Operación de demostración validada"
          }
        ]
      },
      {
        "nombre": "Diseño Fresno SAC",
        "ruc": "20991000005",
        "direccion": "Parque Industrial Demo 150",
        "correo": "proveedor5@example.com",
        "telefono": "900991005",
        "condicion": "Crédito 30 días",
        "estado": "Aprobado",
        "id": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
        "numero": "PROV-00005",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Alta de proveedor propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación de proveedor: Operación de demostración validada"
          }
        ]
      },
      {
        "nombre": "Equipamiento Greda SAC",
        "ruc": "20991000006",
        "direccion": "Parque Industrial Demo 160",
        "correo": "proveedor6@example.com",
        "telefono": "900991006",
        "condicion": "Crédito 30 días",
        "estado": "Aprobado",
        "id": "c6d14bcd-bd72-4013-b4c9-40fa591224b3",
        "numero": "PROV-00006",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Alta de proveedor propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación de proveedor: Operación de demostración validada"
          }
        ]
      }
    ],
    "movimientos": [
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": 28,
        "coste": 105500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "059fb551-48bc-4fbd-9290-d55b2f0b5957",
        "numero": "MOV-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.615Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": 31,
        "coste": 126000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "11c9b16d-c962-4456-9bdc-c5a6aa66e9fc",
        "numero": "MOV-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.615Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": 34,
        "coste": 79500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "e182d422-5399-4796-adb6-16a1a6097ab7",
        "numero": "MOV-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.616Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "INICIAL",
        "cantidad": 37,
        "coste": 23000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "88fc755a-bb33-4e4d-bac9-a475efcdbce8",
        "numero": "MOV-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.616Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "INICIAL",
        "cantidad": 40,
        "coste": 31000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "a300da21-bd51-4894-8a50-b2c78b39432f",
        "numero": "MOV-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.616Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SIL-001",
        "lote": "INICIAL",
        "cantidad": 43,
        "coste": 16500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "2bca0f0b-a66b-46ba-a71a-6c2e90eae388",
        "numero": "MOV-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.616Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-olivos",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": 8,
        "coste": 105500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "4e58ac58-c90a-4325-b0de-95e2c3da8357",
        "numero": "MOV-00007",
        "sede": "olivos",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.616Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-olivos",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": 9,
        "coste": 126000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "5abfc1bf-98ad-4dff-ae7b-4e231cb1dfe0",
        "numero": "MOV-00008",
        "sede": "olivos",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.617Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-olivos",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": 10,
        "coste": 79500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "5306da7c-5565-4a3c-86e9-be5d8c004784",
        "numero": "MOV-00009",
        "sede": "olivos",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.617Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-olivos",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "INICIAL",
        "cantidad": 11,
        "coste": 23000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "714cbaaa-187e-4e7c-8e0b-8a1eb82e7079",
        "numero": "MOV-00010",
        "sede": "olivos",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.617Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-olivos",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "INICIAL",
        "cantidad": 12,
        "coste": 31000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "a6854dbf-852c-4891-b32f-b2c6d4d12122",
        "numero": "MOV-00011",
        "sede": "olivos",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.617Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-olivos",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SIL-001",
        "lote": "INICIAL",
        "cantidad": 13,
        "coste": 16500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "b33c1fde-2cc6-49fa-a813-aab69ae23a81",
        "numero": "MOV-00012",
        "sede": "olivos",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.617Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-surco",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": 8,
        "coste": 105500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "ce6b2380-0d7d-4840-a7b3-a0d2a477e1b3",
        "numero": "MOV-00013",
        "sede": "surco",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.617Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-surco",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": 9,
        "coste": 126000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "427be68b-8749-4993-bde4-1283e7a3fa81",
        "numero": "MOV-00014",
        "sede": "surco",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.617Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-surco",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": 10,
        "coste": 79500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "7ed76a76-0874-4ce5-b432-f634a656521c",
        "numero": "MOV-00015",
        "sede": "surco",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.618Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-surco",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "INICIAL",
        "cantidad": 11,
        "coste": 23000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "0fb9f195-f95f-449e-a8c6-bd5827de2c92",
        "numero": "MOV-00016",
        "sede": "surco",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.618Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-surco",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "INICIAL",
        "cantidad": 12,
        "coste": 31000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "26907583-7c30-40ae-b658-72226fb1e4d5",
        "numero": "MOV-00017",
        "sede": "surco",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.618Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "alm-surco",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SIL-001",
        "lote": "INICIAL",
        "cantidad": 13,
        "coste": 16500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "f16dde3c-0e43-4897-ade7-91f16b19af76",
        "numero": "MOV-00018",
        "sede": "surco",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.618Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": 8,
        "coste": 105500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "4fcd1da3-5eaa-4d29-aa27-72d95cab55c8",
        "numero": "MOV-00019",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.618Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": 9,
        "coste": 126000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "a764c8dd-8585-44ec-937e-2baefd0cd255",
        "numero": "MOV-00020",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.619Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": 10,
        "coste": 79500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "c59dbb18-654c-4556-897d-e2af4eb15abe",
        "numero": "MOV-00021",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.621Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "INICIAL",
        "cantidad": 11,
        "coste": 23000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "ae07a028-276f-4a36-9c18-5ec07f96f4b9",
        "numero": "MOV-00022",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.621Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "INICIAL",
        "cantidad": 12,
        "coste": 31000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "89a4c21c-bb28-4712-8377-fd590194bdf0",
        "numero": "MOV-00023",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.621Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SIL-001",
        "lote": "INICIAL",
        "cantidad": 13,
        "coste": 16500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "419cbc7d-9b46-41b7-8bce-926eecc12085",
        "numero": "MOV-00024",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.621Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": 8,
        "coste": 105500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "58988924-18ff-4cf2-91c1-ecf9e5863f98",
        "numero": "MOV-00025",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.622Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": 9,
        "coste": 126000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "a3b7dd9d-9572-4703-96cd-0ef9ec506beb",
        "numero": "MOV-00026",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.623Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": 10,
        "coste": 79500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "512b631f-8e28-4567-a325-ab6ba64753a0",
        "numero": "MOV-00027",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.623Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "INICIAL",
        "cantidad": 11,
        "coste": 23000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "58965c2e-7196-4501-82c3-a5d2ccf6e88e",
        "numero": "MOV-00028",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.624Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "INICIAL",
        "cantidad": 12,
        "coste": 31000,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "337590e8-fac5-4606-839e-20329394526c",
        "numero": "MOV-00029",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.625Z"
      },
      {
        "tipo": "Saldo inicial",
        "almacen": "0d09e599-0821-4bda-b1cf-8de018fddc44",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SIL-001",
        "lote": "INICIAL",
        "cantidad": 13,
        "coste": 16500,
        "referencia": "Apertura simulada",
        "fecha": "2026-10-31",
        "id": "6f06dbf3-463d-4c06-848c-fcd3d8015987",
        "numero": "MOV-00030",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.625Z"
      },
      {
        "tipo": "Recepción en cuarentena",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "SOF-001",
        "lote": "REPO-1",
        "cantidad": 5,
        "coste": 106500,
        "referencia": "REC-00001",
        "fecha": "2026-11-25",
        "id": "280f650c-fa39-48e9-a1f3-f6b6d0155342",
        "numero": "MOV-00031",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.649Z"
      },
      {
        "tipo": "Inspección",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "SOF-001",
        "lote": "REPO-1",
        "cantidad": -5,
        "coste": 106500,
        "referencia": "REC-00001",
        "fecha": "2026-11-25",
        "id": "475ac122-33bd-497d-912f-1e6311bbdff4",
        "numero": "MOV-00032",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.649Z"
      },
      {
        "tipo": "Liberación a inventario",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "REPO-1",
        "cantidad": 5,
        "coste": 106500,
        "referencia": "REC-00001",
        "fecha": "2026-11-25",
        "id": "36392600-b198-4fcc-a569-475dde18cd1f",
        "numero": "MOV-00033",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.649Z"
      },
      {
        "tipo": "Salida por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 105500,
        "referencia": "REU-00001",
        "fecha": "2026-11-25",
        "id": "ac9c707d-01bd-42b7-b921-dfdc9b204c1c",
        "numero": "MOV-00034",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.658Z"
      },
      {
        "tipo": "Entrada por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "EXHIBICION",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 105500,
        "referencia": "REU-00001",
        "fecha": "2026-11-25",
        "id": "602b64a2-ebeb-4874-a9fc-2835af4d1324",
        "numero": "MOV-00035",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.658Z"
      },
      {
        "tipo": "Salida por tratamiento",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 105500,
        "referencia": "CAL-00001",
        "fecha": "2026-11-25",
        "tratamientoId": "dbd22002-94bf-4924-b910-6e8fd209b9c8",
        "id": "11fb4877-081d-461d-bc1f-70279e678b43",
        "numero": "MOV-00036",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.660Z"
      },
      {
        "tipo": "Deterioro documentado",
        "almacen": "alm-centro",
        "ubicacion": "CUARENTENA",
        "calidad": "Dañado",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 105500,
        "referencia": "CAL-00001",
        "fecha": "2026-11-25",
        "tratamientoId": "dbd22002-94bf-4924-b910-6e8fd209b9c8",
        "id": "3e066bcd-a385-41aa-9599-cb152c40f198",
        "numero": "MOV-00037",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.660Z"
      },
      {
        "tipo": "Ajuste de inventario",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 105500,
        "referencia": "CON-00001",
        "fecha": "2026-11-25",
        "id": "686cb05d-ca80-4f45-8ff9-4886c368d949",
        "numero": "MOV-00038",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.661Z"
      },
      {
        "tipo": "Salida por traslado",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 105500,
        "referencia": "TRA-00001",
        "fecha": "2026-11-25",
        "id": "2c01cebb-a4d8-4139-a830-333bbbbb8c32",
        "numero": "MOV-00039",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.663Z"
      },
      {
        "tipo": "Recepción en cuarentena",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "COM-001",
        "lote": "REPO-2",
        "cantidad": 6,
        "coste": 127000,
        "referencia": "REC-00002",
        "fecha": "2026-11-25",
        "id": "3c6a7088-c408-4785-93e0-329889415ea3",
        "numero": "MOV-00040",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.664Z"
      },
      {
        "tipo": "Inspección",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "COM-001",
        "lote": "REPO-2",
        "cantidad": -6,
        "coste": 127000,
        "referencia": "REC-00002",
        "fecha": "2026-11-25",
        "id": "d3a24bf9-524e-4b52-bd8d-ff6622fe428c",
        "numero": "MOV-00041",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.664Z"
      },
      {
        "tipo": "Liberación a inventario",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "REPO-2",
        "cantidad": 6,
        "coste": 127000,
        "referencia": "REC-00002",
        "fecha": "2026-11-25",
        "id": "85a409b2-6e19-409e-8807-c0a37ffda8e6",
        "numero": "MOV-00042",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.664Z"
      },
      {
        "tipo": "Salida por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 126000,
        "referencia": "REU-00002",
        "fecha": "2026-11-25",
        "id": "b0aedeb9-cd4e-44a3-a5cc-243dc5d9f18e",
        "numero": "MOV-00043",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.670Z"
      },
      {
        "tipo": "Entrada por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "EXHIBICION",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 126000,
        "referencia": "REU-00002",
        "fecha": "2026-11-25",
        "id": "5065b648-b29c-4ac8-a260-eb1d5ee44dbb",
        "numero": "MOV-00044",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.670Z"
      },
      {
        "tipo": "Salida por tratamiento",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 126000,
        "referencia": "CAL-00002",
        "fecha": "2026-11-25",
        "tratamientoId": "92ae6c76-ec8a-4549-9ef3-3378acd8268c",
        "id": "92e8a7e4-557b-405a-9d5e-81ca28ed0451",
        "numero": "MOV-00045",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.671Z"
      },
      {
        "tipo": "Deterioro documentado",
        "almacen": "alm-centro",
        "ubicacion": "CUARENTENA",
        "calidad": "Dañado",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 126000,
        "referencia": "CAL-00002",
        "fecha": "2026-11-25",
        "tratamientoId": "92ae6c76-ec8a-4549-9ef3-3378acd8268c",
        "id": "68045277-747d-4d4e-afaf-11690719ff7e",
        "numero": "MOV-00046",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.671Z"
      },
      {
        "tipo": "Salida por traslado",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 126000,
        "referencia": "TRA-00002",
        "fecha": "2026-11-25",
        "id": "c44f6733-e0a7-4d49-9344-a0afa3d83d5c",
        "numero": "MOV-00047",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.671Z"
      },
      {
        "tipo": "Recepción en cuarentena",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "CAM-001",
        "lote": "REPO-3",
        "cantidad": 7,
        "coste": 80500,
        "referencia": "REC-00003",
        "fecha": "2026-11-25",
        "id": "fc84405b-bce5-46db-b0c6-492c145eb274",
        "numero": "MOV-00048",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.672Z"
      },
      {
        "tipo": "Inspección",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "CAM-001",
        "lote": "REPO-3",
        "cantidad": -7,
        "coste": 80500,
        "referencia": "REC-00003",
        "fecha": "2026-11-25",
        "id": "98972ef7-60b0-4384-84cc-81b39d109477",
        "numero": "MOV-00049",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.672Z"
      },
      {
        "tipo": "Liberación a inventario",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "REPO-3",
        "cantidad": 7,
        "coste": 80500,
        "referencia": "REC-00003",
        "fecha": "2026-11-25",
        "id": "0f7b193d-99ce-4fe0-a18d-f105adf6c574",
        "numero": "MOV-00050",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.672Z"
      },
      {
        "tipo": "Salida por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 79500,
        "referencia": "REU-00003",
        "fecha": "2026-11-25",
        "id": "684d2a4a-835b-4d7c-8e08-11e9f7f551bd",
        "numero": "MOV-00051",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.677Z"
      },
      {
        "tipo": "Entrada por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "EXHIBICION",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 79500,
        "referencia": "REU-00003",
        "fecha": "2026-11-25",
        "id": "cf2292df-3784-4408-ba58-40b8decba884",
        "numero": "MOV-00052",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.677Z"
      },
      {
        "tipo": "Recepción en cuarentena",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "MES-001",
        "lote": "REPO-4",
        "cantidad": 8,
        "coste": 24000,
        "referencia": "REC-00004",
        "fecha": "2026-11-25",
        "id": "0d092ff9-adeb-47a4-9b88-912487c2a1c7",
        "numero": "MOV-00053",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.678Z"
      },
      {
        "tipo": "Inspección",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "MES-001",
        "lote": "REPO-4",
        "cantidad": -8,
        "coste": 24000,
        "referencia": "REC-00004",
        "fecha": "2026-11-25",
        "id": "4fa2bf91-9f3e-488d-b465-9a46388705b3",
        "numero": "MOV-00054",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.679Z"
      },
      {
        "tipo": "Liberación a inventario",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "REPO-4",
        "cantidad": 8,
        "coste": 24000,
        "referencia": "REC-00004",
        "fecha": "2026-11-25",
        "id": "a1a9f25a-5eb5-4a57-bee6-c07d089c3533",
        "numero": "MOV-00055",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.679Z"
      },
      {
        "tipo": "Salida por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 23000,
        "referencia": "REU-00004",
        "fecha": "2026-11-25",
        "id": "90296602-edc2-4f31-9dc6-83ded3f70056",
        "numero": "MOV-00056",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.683Z"
      },
      {
        "tipo": "Entrada por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "EXHIBICION",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 23000,
        "referencia": "REU-00004",
        "fecha": "2026-11-25",
        "id": "d3047d50-c101-4375-93d8-0ebb0cae5e09",
        "numero": "MOV-00057",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.683Z"
      },
      {
        "tipo": "Recepción en cuarentena",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "EST-001",
        "lote": "REPO-5",
        "cantidad": 9,
        "coste": 32000,
        "referencia": "REC-00005",
        "fecha": "2026-11-25",
        "id": "8af6e7f9-cf77-4b6f-a14e-50e2caca0a17",
        "numero": "MOV-00058",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.684Z"
      },
      {
        "tipo": "Inspección",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "EST-001",
        "lote": "REPO-5",
        "cantidad": -9,
        "coste": 32000,
        "referencia": "REC-00005",
        "fecha": "2026-11-25",
        "id": "c07ed18c-1051-4395-979f-2b866bce4b0f",
        "numero": "MOV-00059",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.685Z"
      },
      {
        "tipo": "Liberación a inventario",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "REPO-5",
        "cantidad": 9,
        "coste": 32000,
        "referencia": "REC-00005",
        "fecha": "2026-11-25",
        "id": "4917772e-2ca1-4cb1-87bb-5a24cca27c62",
        "numero": "MOV-00060",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.685Z"
      },
      {
        "tipo": "Salida por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 31000,
        "referencia": "REU-00005",
        "fecha": "2026-11-25",
        "id": "401f8f53-34b8-476c-9131-14f451f58d62",
        "numero": "MOV-00061",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.687Z"
      },
      {
        "tipo": "Entrada por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "EXHIBICION",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 31000,
        "referencia": "REU-00005",
        "fecha": "2026-11-25",
        "id": "bf320aa0-e84f-4f3a-b780-69ef31745889",
        "numero": "MOV-00062",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.688Z"
      },
      {
        "tipo": "Recepción en cuarentena",
        "almacen": "alm-centro",
        "ubicacion": "RECEPCION",
        "calidad": "Cuarentena",
        "codigo": "SIL-001",
        "lote": "REPO-6",
        "cantidad": 10,
        "coste": 17500,
        "referencia": "REC-00006",
        "fecha": "2026-11-25",
        "id": "5079768e-35c8-4dad-b919-7bca8fc2d0d7",
        "numero": "MOV-00063",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.688Z"
      },
      {
        "tipo": "Salida por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SIL-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 16500,
        "referencia": "REU-00006",
        "fecha": "2026-11-25",
        "id": "e0ae0ddd-83e6-4f35-88b7-6d2cca3deb1d",
        "numero": "MOV-00064",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.689Z"
      },
      {
        "tipo": "Entrada por reubicación",
        "almacen": "alm-centro",
        "ubicacion": "EXHIBICION",
        "calidad": "Disponible",
        "codigo": "SIL-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 16500,
        "referencia": "REU-00006",
        "fecha": "2026-11-25",
        "id": "771b7a47-1f53-44cf-8fac-898069bb77d9",
        "numero": "MOV-00065",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.689Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": -2,
        "coste": 105500,
        "referencia": "DES-00001",
        "fecha": "2026-11-25",
        "id": "c2cdd676-a486-439a-be32-54c53fec9482",
        "numero": "MOV-00066",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.696Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 126000,
        "referencia": "DES-00002",
        "fecha": "2026-11-25",
        "id": "ee44d7cb-9090-4702-8746-f932ace100d8",
        "numero": "MOV-00067",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.713Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 79500,
        "referencia": "DES-00003",
        "fecha": "2026-11-25",
        "id": "77ddcad0-4404-4a15-ba4f-09b5cafccaf9",
        "numero": "MOV-00068",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.726Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "INICIAL",
        "cantidad": -2,
        "coste": 23000,
        "referencia": "DES-00004",
        "fecha": "2026-11-25",
        "id": "a5b2a9d0-f288-49e5-8bd5-7e42c6bacc61",
        "numero": "MOV-00069",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.751Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 31000,
        "referencia": "DES-00005",
        "fecha": "2026-11-25",
        "id": "40f46b75-b49a-4a71-af05-ce9af5f4385f",
        "numero": "MOV-00070",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.797Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SIL-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 16500,
        "referencia": "DES-00006",
        "fecha": "2026-11-25",
        "id": "77fa53f8-2c2c-4912-b6a0-353b17e2c90d",
        "numero": "MOV-00071",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.816Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": -2,
        "coste": 105500,
        "referencia": "DES-00007",
        "fecha": "2026-11-25",
        "id": "db6aefe7-b786-4240-ab77-d64d404803eb",
        "numero": "MOV-00072",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.825Z"
      },
      {
        "tipo": "Retorno no entregado",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "SOF-001",
        "lote": "INICIAL",
        "cantidad": 2,
        "coste": 105500,
        "referencia": "RET-00001",
        "fecha": "2026-11-25",
        "id": "9235fa47-e2c7-4baa-b02d-6db3ba1acf7d",
        "numero": "MOV-00073",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.826Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 126000,
        "referencia": "DES-00008",
        "fecha": "2026-11-25",
        "id": "6a960a94-fa09-4a9e-a156-cc3d45b830b1",
        "numero": "MOV-00074",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.832Z"
      },
      {
        "tipo": "Retorno no entregado",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "COM-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 126000,
        "referencia": "RET-00002",
        "fecha": "2026-11-25",
        "id": "9272acd2-3deb-48ad-b6a9-5ba9096446ff",
        "numero": "MOV-00075",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.832Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 79500,
        "referencia": "DES-00009",
        "fecha": "2026-11-25",
        "id": "a43177fb-c25e-4b9c-9b0c-de22b55edc9d",
        "numero": "MOV-00076",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.839Z"
      },
      {
        "tipo": "Retorno no entregado",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "CAM-001",
        "lote": "INICIAL",
        "cantidad": 1,
        "coste": 79500,
        "referencia": "RET-00003",
        "fecha": "2026-11-25",
        "id": "fc7204b1-15ed-43c0-b05e-c62b12ef14ec",
        "numero": "MOV-00077",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.839Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "MES-001",
        "lote": "INICIAL",
        "cantidad": -2,
        "coste": 23000,
        "referencia": "DES-00010",
        "fecha": "2026-11-25",
        "id": "3dbb003d-e976-4f50-9097-30a563ea97c5",
        "numero": "MOV-00078",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.847Z"
      },
      {
        "tipo": "Salida por venta",
        "almacen": "alm-centro",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "codigo": "EST-001",
        "lote": "INICIAL",
        "cantidad": -1,
        "coste": 31000,
        "referencia": "DES-00011",
        "fecha": "2026-11-25",
        "id": "070cb7d5-5360-4627-a124-d8122420e199",
        "numero": "MOV-00079",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "ocurridoEn": "2026-11-25T18:18:09.856Z"
      }
    ],
    "requisiciones": [
      {
        "almacen": "alm-centro",
        "requerida": "2027-01-24",
        "motivo": "Reposición de Sofá Brisa de lino",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 5,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad"
          }
        ],
        "estado": "Aprobada",
        "id": "390d088d-85f0-4b6d-a628-76f3ed235a71",
        "numero": "REQ-00001",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.646Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Necesidad de abastecimiento registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.647Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.647Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición derivada RFQ-00001"
          },
          {
            "fecha": "2026-11-25T18:18:09.648Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden derivada OC-00001"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "requerida": "2027-01-24",
        "motivo": "Reposición de Comedor Lenga para cuatro",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 6,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego"
          }
        ],
        "estado": "Aprobada",
        "id": "2d56d444-3b24-41c1-a4ae-88447b63b3f6",
        "numero": "REQ-00002",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Necesidad de abastecimiento registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición derivada RFQ-00002"
          },
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden derivada OC-00002"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "requerida": "2027-01-24",
        "motivo": "Reposición de Cama Alba de dos plazas",
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 7,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad"
          }
        ],
        "estado": "Aprobada",
        "id": "25ba6025-1873-4faf-aff1-188bc57d5ff2",
        "numero": "REQ-00003",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Necesidad de abastecimiento registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición derivada RFQ-00003"
          },
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden derivada OC-00003"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "requerida": "2027-01-24",
        "motivo": "Reposición de Mesa Junco para sala",
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 8,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad"
          }
        ],
        "estado": "Aprobada",
        "id": "45a4861f-0545-4497-9b32-ac432e622489",
        "numero": "REQ-00004",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Necesidad de abastecimiento registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición derivada RFQ-00004"
          },
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden derivada OC-00004"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "requerida": "2027-01-24",
        "motivo": "Reposición de Estantería Nido modular",
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 9,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad"
          }
        ],
        "estado": "Aprobada",
        "id": "9a530d13-793f-410d-b4ec-c7fe6e1235af",
        "numero": "REQ-00005",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Necesidad de abastecimiento registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición derivada RFQ-00005"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden derivada OC-00005"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "requerida": "2027-01-24",
        "motivo": "Reposición de Silla Cala tapizada",
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 10,
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad"
          }
        ],
        "estado": "Aprobada",
        "id": "3f89e282-ba0e-471e-8c36-945a893d21b8",
        "numero": "REQ-00006",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Necesidad de abastecimiento registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición derivada RFQ-00006"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden derivada OC-00006"
          }
        ]
      }
    ],
    "peticionesOferta": [
      {
        "requisicionId": "390d088d-85f0-4b6d-a628-76f3ed235a71",
        "proveedores": [
          "9018c795-85e0-441f-afa3-c479fd151669"
        ],
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 5,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad"
          }
        ],
        "requerida": "2027-01-24",
        "almacen": "alm-centro",
        "estado": "Adjudicada",
        "id": "ea3d9b3d-ee6e-4145-b5a0-750168307806",
        "numero": "RFQ-00001",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.647Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición de ofertas preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.647Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Proveedor seleccionado: Operación de demostración validada"
          }
        ],
        "ofertaId": "427ba84e-df9a-414c-ad27-ce166efa1ace"
      },
      {
        "requisicionId": "2d56d444-3b24-41c1-a4ae-88447b63b3f6",
        "proveedores": [
          "4f202324-0981-4ef3-aec5-653adb65c69d"
        ],
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 6,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego"
          }
        ],
        "requerida": "2027-01-24",
        "almacen": "alm-centro",
        "estado": "Adjudicada",
        "id": "34c865de-2283-48a4-b1fc-7bef0866ab57",
        "numero": "RFQ-00002",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición de ofertas preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Proveedor seleccionado: Operación de demostración validada"
          }
        ],
        "ofertaId": "240013ec-7034-4bc1-bd19-a11475b37822"
      },
      {
        "requisicionId": "25ba6025-1873-4faf-aff1-188bc57d5ff2",
        "proveedores": [
          "6acd5ae4-7b42-4694-a7d6-697ff088c1a2"
        ],
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 7,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad"
          }
        ],
        "requerida": "2027-01-24",
        "almacen": "alm-centro",
        "estado": "Adjudicada",
        "id": "f11f31e4-e322-4ef7-904a-7e844f6e832d",
        "numero": "RFQ-00003",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición de ofertas preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Proveedor seleccionado: Operación de demostración validada"
          }
        ],
        "ofertaId": "6fa2cf44-2994-4d45-91cc-6bb7f1abe914"
      },
      {
        "requisicionId": "45a4861f-0545-4497-9b32-ac432e622489",
        "proveedores": [
          "cc92b8d8-762b-42fe-9302-11f4c2260832"
        ],
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 8,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad"
          }
        ],
        "requerida": "2027-01-24",
        "almacen": "alm-centro",
        "estado": "Adjudicada",
        "id": "5a90e15b-fae3-4765-b3d6-144f0340c447",
        "numero": "RFQ-00004",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición de ofertas preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Proveedor seleccionado: Operación de demostración validada"
          }
        ],
        "ofertaId": "ae510b03-bc7d-47e8-ba95-f41e7f428499"
      },
      {
        "requisicionId": "9a530d13-793f-410d-b4ec-c7fe6e1235af",
        "proveedores": [
          "5466048f-62db-4aae-be4e-bfdd17e0a3d9"
        ],
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 9,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad"
          }
        ],
        "requerida": "2027-01-24",
        "almacen": "alm-centro",
        "estado": "Adjudicada",
        "id": "0f89fd75-c309-4a98-a63f-1d770c512647",
        "numero": "RFQ-00005",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición de ofertas preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Proveedor seleccionado: Operación de demostración validada"
          }
        ],
        "ofertaId": "51fc28bf-a2d7-46a6-9cf4-b584dfa41497"
      },
      {
        "requisicionId": "3f89e282-ba0e-471e-8c36-945a893d21b8",
        "proveedores": [
          "c6d14bcd-bd72-4013-b4c9-40fa591224b3"
        ],
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 10,
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad"
          }
        ],
        "requerida": "2027-01-24",
        "almacen": "alm-centro",
        "estado": "Adjudicada",
        "id": "14332416-d1bd-491a-ba69-28100feffe4b",
        "numero": "RFQ-00006",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Petición de ofertas preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Proveedor seleccionado: Operación de demostración validada"
          }
        ],
        "ofertaId": "c339f368-04ea-4a97-8f46-2d3c2c4d41b8"
      }
    ],
    "ofertas": [
      {
        "peticionId": "ea3d9b3d-ee6e-4145-b5a0-750168307806",
        "proveedorId": "9018c795-85e0-441f-afa3-c479fd151669",
        "vigenteHasta": "2027-01-24",
        "plazoDias": 2,
        "calidad": 5,
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 5,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "precio": 106500
          }
        ],
        "base": 532500,
        "estado": "Seleccionada",
        "id": "427ba84e-df9a-414c-ad27-ce166efa1ace",
        "numero": "OFE-00001",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.647Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Oferta de proveedor registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.647Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Oferta adjudicada: Operación de demostración validada"
          }
        ]
      },
      {
        "peticionId": "34c865de-2283-48a4-b1fc-7bef0866ab57",
        "proveedorId": "4f202324-0981-4ef3-aec5-653adb65c69d",
        "vigenteHasta": "2027-01-24",
        "plazoDias": 3,
        "calidad": 4,
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 6,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "precio": 127000
          }
        ],
        "base": 762000,
        "estado": "Seleccionada",
        "id": "240013ec-7034-4bc1-bd19-a11475b37822",
        "numero": "OFE-00002",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Oferta de proveedor registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Oferta adjudicada: Operación de demostración validada"
          }
        ]
      },
      {
        "peticionId": "f11f31e4-e322-4ef7-904a-7e844f6e832d",
        "proveedorId": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
        "vigenteHasta": "2027-01-24",
        "plazoDias": 4,
        "calidad": 5,
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 7,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "precio": 80500
          }
        ],
        "base": 563500,
        "estado": "Seleccionada",
        "id": "6fa2cf44-2994-4d45-91cc-6bb7f1abe914",
        "numero": "OFE-00003",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Oferta de proveedor registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Oferta adjudicada: Operación de demostración validada"
          }
        ]
      },
      {
        "peticionId": "5a90e15b-fae3-4765-b3d6-144f0340c447",
        "proveedorId": "cc92b8d8-762b-42fe-9302-11f4c2260832",
        "vigenteHasta": "2027-01-24",
        "plazoDias": 5,
        "calidad": 4,
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 8,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "precio": 24000
          }
        ],
        "base": 192000,
        "estado": "Seleccionada",
        "id": "ae510b03-bc7d-47e8-ba95-f41e7f428499",
        "numero": "OFE-00004",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Oferta de proveedor registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Oferta adjudicada: Operación de demostración validada"
          }
        ]
      },
      {
        "peticionId": "0f89fd75-c309-4a98-a63f-1d770c512647",
        "proveedorId": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
        "vigenteHasta": "2027-01-24",
        "plazoDias": 6,
        "calidad": 5,
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 9,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "precio": 32000
          }
        ],
        "base": 288000,
        "estado": "Seleccionada",
        "id": "51fc28bf-a2d7-46a6-9cf4-b584dfa41497",
        "numero": "OFE-00005",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Oferta de proveedor registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Oferta adjudicada: Operación de demostración validada"
          }
        ]
      },
      {
        "peticionId": "14332416-d1bd-491a-ba69-28100feffe4b",
        "proveedorId": "c6d14bcd-bd72-4013-b4c9-40fa591224b3",
        "vigenteHasta": "2027-01-24",
        "plazoDias": 7,
        "calidad": 4,
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 10,
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad",
            "precio": 17500
          }
        ],
        "base": 175000,
        "estado": "Seleccionada",
        "id": "c339f368-04ea-4a97-8f46-2d3c2c4d41b8",
        "numero": "OFE-00006",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Oferta de proveedor registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Oferta adjudicada: Operación de demostración validada"
          }
        ]
      }
    ],
    "acuerdos": [
      {
        "proveedorId": "9018c795-85e0-441f-afa3-c479fd151669",
        "desde": "2026-11-25",
        "hasta": "2027-01-24",
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 40,
            "precio": 106500,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad"
          }
        ],
        "estado": "Aprobado",
        "id": "badc20f2-6d47-4acf-a6eb-14a273b3b489",
        "numero": "ACU-00001",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.647Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Acuerdo marco propuesto"
          },
          {
            "fecha": "2026-11-25T18:18:09.648Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "proveedorId": "4f202324-0981-4ef3-aec5-653adb65c69d",
        "desde": "2026-11-25",
        "hasta": "2027-01-24",
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 48,
            "precio": 127000,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego"
          }
        ],
        "estado": "Aprobado",
        "id": "49060a73-bec5-4680-9d5e-f8498b4ca588",
        "numero": "ACU-00002",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Acuerdo marco propuesto"
          },
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "proveedorId": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
        "desde": "2026-11-25",
        "hasta": "2027-01-24",
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 56,
            "precio": 80500,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad"
          }
        ],
        "estado": "Aprobado",
        "id": "bf4549ba-a56f-47d0-991f-26ae87daa6eb",
        "numero": "ACU-00003",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Acuerdo marco propuesto"
          },
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "proveedorId": "cc92b8d8-762b-42fe-9302-11f4c2260832",
        "desde": "2026-11-25",
        "hasta": "2027-01-24",
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 64,
            "precio": 24000,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad"
          }
        ],
        "estado": "Aprobado",
        "id": "a6e30071-5d2d-4ea0-825c-26b698d9dcde",
        "numero": "ACU-00004",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Acuerdo marco propuesto"
          },
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "proveedorId": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
        "desde": "2026-11-25",
        "hasta": "2027-01-24",
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 72,
            "precio": 32000,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad"
          }
        ],
        "estado": "Aprobado",
        "id": "26eb08b8-2563-49e0-b108-c495898c555b",
        "numero": "ACU-00005",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Acuerdo marco propuesto"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "proveedorId": "c6d14bcd-bd72-4013-b4c9-40fa591224b3",
        "desde": "2026-11-25",
        "hasta": "2027-01-24",
        "condicion": "Crédito 30 días",
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 80,
            "precio": 17500,
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad"
          }
        ],
        "estado": "Pendiente",
        "id": "88e5891d-1d83-4cd6-a152-f9130b8d23d1",
        "numero": "ACU-00006",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Acuerdo marco propuesto"
          }
        ]
      }
    ],
    "ordenes": [
      {
        "requisicionId": "390d088d-85f0-4b6d-a628-76f3ed235a71",
        "ofertaId": "427ba84e-df9a-414c-ad27-ce166efa1ace",
        "acuerdoId": null,
        "proveedorId": "9018c795-85e0-441f-afa3-c479fd151669",
        "proveedor": {
          "nombre": "Carpintería Sauce SAC",
          "ruc": "20991000001",
          "direccion": "Parque Industrial Demo 110",
          "correo": "proveedor1@example.com",
          "telefono": "900991001",
          "condicion": "Crédito 30 días",
          "estado": "Aprobado",
          "id": "9018c795-85e0-441f-afa3-c479fd151669",
          "numero": "PROV-00001",
          "sede": "centro",
          "registradoPor": "Lucía · Demo",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.645Z",
              "usuario": "Lucía · Demo",
              "rol": "Compras",
              "accion": "Alta de proveedor propuesta"
            },
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Aprobación de proveedor: Operación de demostración validada"
            }
          ]
        },
        "origen": "OFE-00001",
        "almacen": "alm-centro",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 5,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "precio": 106500
          }
        ],
        "condicion": "Crédito 30 días",
        "base": 532500,
        "moneda": "PEN",
        "entregaPrevista": "2027-01-24",
        "fecha": "2026-11-25",
        "estado": "Recibida",
        "id": "a83582e5-1500-413a-bef8-b507c49ea3f8",
        "numero": "OC-00001",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.648Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden de compra preparada desde documento aprobado"
          },
          {
            "fecha": "2026-11-25T18:18:09.648Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.648Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden marcada como emitida; comunicación externa no automatizada"
          },
          {
            "fecha": "2026-11-25T18:18:09.648Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Confirmación del proveedor: Confirmación DEMO-1"
          },
          {
            "fecha": "2026-11-25T18:18:09.649Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Recepción derivada REC-00001"
          },
          {
            "fecha": "2026-11-25T18:18:09.650Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "VF-00001: Verificada"
          }
        ],
        "emitidaEn": "2026-11-25",
        "confirmacionProveedor": "Confirmación DEMO-1"
      },
      {
        "requisicionId": "2d56d444-3b24-41c1-a4ae-88447b63b3f6",
        "ofertaId": "240013ec-7034-4bc1-bd19-a11475b37822",
        "acuerdoId": null,
        "proveedorId": "4f202324-0981-4ef3-aec5-653adb65c69d",
        "proveedor": {
          "nombre": "Tapizados Brezo SAC",
          "ruc": "20991000002",
          "direccion": "Parque Industrial Demo 120",
          "correo": "proveedor2@example.com",
          "telefono": "900991002",
          "condicion": "Crédito 30 días",
          "estado": "Aprobado",
          "id": "4f202324-0981-4ef3-aec5-653adb65c69d",
          "numero": "PROV-00002",
          "sede": "centro",
          "registradoPor": "Lucía · Demo",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Lucía · Demo",
              "rol": "Compras",
              "accion": "Alta de proveedor propuesta"
            },
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Aprobación de proveedor: Operación de demostración validada"
            }
          ]
        },
        "origen": "OFE-00002",
        "almacen": "alm-centro",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 6,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "precio": 127000
          }
        ],
        "condicion": "Crédito 30 días",
        "base": 762000,
        "moneda": "PEN",
        "entregaPrevista": "2027-01-24",
        "fecha": "2026-11-25",
        "estado": "Recibida",
        "id": "50ebad78-79c8-4cff-81d5-da6f3d1f513a",
        "numero": "OC-00002",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden de compra preparada desde documento aprobado"
          },
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden marcada como emitida; comunicación externa no automatizada"
          },
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Confirmación del proveedor: Confirmación DEMO-2"
          },
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Recepción derivada REC-00002"
          },
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "VF-00002: Verificada"
          }
        ],
        "emitidaEn": "2026-11-25",
        "confirmacionProveedor": "Confirmación DEMO-2"
      },
      {
        "requisicionId": "25ba6025-1873-4faf-aff1-188bc57d5ff2",
        "ofertaId": "6fa2cf44-2994-4d45-91cc-6bb7f1abe914",
        "acuerdoId": null,
        "proveedorId": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
        "proveedor": {
          "nombre": "Maderas Jacarandá SAC",
          "ruc": "20991000003",
          "direccion": "Parque Industrial Demo 130",
          "correo": "proveedor3@example.com",
          "telefono": "900991003",
          "condicion": "Crédito 30 días",
          "estado": "Aprobado",
          "id": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
          "numero": "PROV-00003",
          "sede": "centro",
          "registradoPor": "Lucía · Demo",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Lucía · Demo",
              "rol": "Compras",
              "accion": "Alta de proveedor propuesta"
            },
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Aprobación de proveedor: Operación de demostración validada"
            }
          ]
        },
        "origen": "OFE-00003",
        "almacen": "alm-centro",
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 7,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "precio": 80500
          }
        ],
        "condicion": "Crédito 30 días",
        "base": 563500,
        "moneda": "PEN",
        "entregaPrevista": "2027-01-24",
        "fecha": "2026-11-25",
        "estado": "Recibida",
        "id": "0aa50f4d-e665-466e-952c-4aedfc1a56f7",
        "numero": "OC-00003",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden de compra preparada desde documento aprobado"
          },
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden marcada como emitida; comunicación externa no automatizada"
          },
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Confirmación del proveedor: Confirmación DEMO-3"
          },
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Recepción derivada REC-00003"
          },
          {
            "fecha": "2026-11-25T18:18:09.673Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "VF-00003: Verificada"
          }
        ],
        "emitidaEn": "2026-11-25",
        "confirmacionProveedor": "Confirmación DEMO-3"
      },
      {
        "requisicionId": "45a4861f-0545-4497-9b32-ac432e622489",
        "ofertaId": "ae510b03-bc7d-47e8-ba95-f41e7f428499",
        "acuerdoId": null,
        "proveedorId": "cc92b8d8-762b-42fe-9302-11f4c2260832",
        "proveedor": {
          "nombre": "Herrajes Acanto SAC",
          "ruc": "20991000004",
          "direccion": "Parque Industrial Demo 140",
          "correo": "proveedor4@example.com",
          "telefono": "900991004",
          "condicion": "Crédito 30 días",
          "estado": "Aprobado",
          "id": "cc92b8d8-762b-42fe-9302-11f4c2260832",
          "numero": "PROV-00004",
          "sede": "centro",
          "registradoPor": "Lucía · Demo",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Lucía · Demo",
              "rol": "Compras",
              "accion": "Alta de proveedor propuesta"
            },
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Aprobación de proveedor: Operación de demostración validada"
            }
          ]
        },
        "origen": "OFE-00004",
        "almacen": "alm-centro",
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 8,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "precio": 24000
          }
        ],
        "condicion": "Crédito 30 días",
        "base": 192000,
        "moneda": "PEN",
        "entregaPrevista": "2027-01-24",
        "fecha": "2026-11-25",
        "estado": "Recibida",
        "id": "8c04437a-74c2-459d-9115-463803812c2a",
        "numero": "OC-00004",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden de compra preparada desde documento aprobado"
          },
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden marcada como emitida; comunicación externa no automatizada"
          },
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Confirmación del proveedor: Confirmación DEMO-4"
          },
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Recepción derivada REC-00004"
          },
          {
            "fecha": "2026-11-25T18:18:09.679Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "VF-00004: Verificada"
          }
        ],
        "emitidaEn": "2026-11-25",
        "confirmacionProveedor": "Confirmación DEMO-4"
      },
      {
        "requisicionId": "9a530d13-793f-410d-b4ec-c7fe6e1235af",
        "ofertaId": "51fc28bf-a2d7-46a6-9cf4-b584dfa41497",
        "acuerdoId": null,
        "proveedorId": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
        "proveedor": {
          "nombre": "Diseño Fresno SAC",
          "ruc": "20991000005",
          "direccion": "Parque Industrial Demo 150",
          "correo": "proveedor5@example.com",
          "telefono": "900991005",
          "condicion": "Crédito 30 días",
          "estado": "Aprobado",
          "id": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
          "numero": "PROV-00005",
          "sede": "centro",
          "registradoPor": "Lucía · Demo",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Lucía · Demo",
              "rol": "Compras",
              "accion": "Alta de proveedor propuesta"
            },
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Aprobación de proveedor: Operación de demostración validada"
            }
          ]
        },
        "origen": "OFE-00005",
        "almacen": "alm-centro",
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 9,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "precio": 32000
          }
        ],
        "condicion": "Crédito 30 días",
        "base": 288000,
        "moneda": "PEN",
        "entregaPrevista": "2027-01-24",
        "fecha": "2026-11-25",
        "estado": "Recibida",
        "id": "0f79f1e1-d03b-46e2-9599-9300ab1d3631",
        "numero": "OC-00005",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden de compra preparada desde documento aprobado"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden marcada como emitida; comunicación externa no automatizada"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Confirmación del proveedor: Confirmación DEMO-5"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Recepción derivada REC-00005"
          },
          {
            "fecha": "2026-11-25T18:18:09.685Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "VF-00005: Verificada"
          }
        ],
        "emitidaEn": "2026-11-25",
        "confirmacionProveedor": "Confirmación DEMO-5"
      },
      {
        "requisicionId": "3f89e282-ba0e-471e-8c36-945a893d21b8",
        "ofertaId": "c339f368-04ea-4a97-8f46-2d3c2c4d41b8",
        "acuerdoId": null,
        "proveedorId": "c6d14bcd-bd72-4013-b4c9-40fa591224b3",
        "proveedor": {
          "nombre": "Equipamiento Greda SAC",
          "ruc": "20991000006",
          "direccion": "Parque Industrial Demo 160",
          "correo": "proveedor6@example.com",
          "telefono": "900991006",
          "condicion": "Crédito 30 días",
          "estado": "Aprobado",
          "id": "c6d14bcd-bd72-4013-b4c9-40fa591224b3",
          "numero": "PROV-00006",
          "sede": "centro",
          "registradoPor": "Lucía · Demo",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Lucía · Demo",
              "rol": "Compras",
              "accion": "Alta de proveedor propuesta"
            },
            {
              "fecha": "2026-11-25T18:18:09.646Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Aprobación de proveedor: Operación de demostración validada"
            }
          ]
        },
        "origen": "OFE-00006",
        "almacen": "alm-centro",
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 10,
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad",
            "precio": 17500
          }
        ],
        "condicion": "Crédito 30 días",
        "base": 175000,
        "moneda": "PEN",
        "entregaPrevista": "2027-01-24",
        "fecha": "2026-11-25",
        "estado": "Recibida",
        "id": "f559aae9-44b1-434f-835f-e04fc5db366b",
        "numero": "OC-00006",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden de compra preparada desde documento aprobado"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Orden marcada como emitida; comunicación externa no automatizada"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Confirmación del proveedor: Confirmación DEMO-6"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Recepción derivada REC-00006"
          },
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "VF-00006: Observada"
          }
        ],
        "emitidaEn": "2026-11-25",
        "confirmacionProveedor": "Confirmación DEMO-6"
      }
    ],
    "recepciones": [
      {
        "ordenId": "a83582e5-1500-413a-bef8-b507c49ea3f8",
        "documento": "GR-DEMO-1",
        "lote": "REPO-1",
        "fecha": "2026-11-25",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 5,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "coste": 106500,
            "conforme": 5,
            "noConforme": 0,
            "devuelta": 0,
            "enReparacion": 0,
            "baja": 0
          }
        ],
        "proveedorId": "9018c795-85e0-441f-afa3-c479fd151669",
        "almacen": "alm-centro",
        "estado": "Conforme",
        "id": "fc1f1c0d-ca38-4566-ae61-ce596dcc9ccf",
        "numero": "REC-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.648Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Mercancía recibida en cuarentena"
          },
          {
            "fecha": "2026-11-25T18:18:09.650Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conforme: Operación de demostración validada"
          }
        ],
        "inspecciones": [
          {
            "fecha": "2026-11-25",
            "ubicacion": "RACK-A",
            "lineas": [
              {
                "codigo": "SOF-001",
                "conformes": 5,
                "observadas": 0
              }
            ],
            "responsable": "Mario · Demo",
            "motivo": "Operación de demostración validada"
          }
        ]
      },
      {
        "ordenId": "50ebad78-79c8-4cff-81d5-da6f3d1f513a",
        "documento": "GR-DEMO-2",
        "lote": "REPO-2",
        "fecha": "2026-11-25",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 6,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "coste": 127000,
            "conforme": 6,
            "noConforme": 0,
            "devuelta": 0,
            "enReparacion": 0,
            "baja": 0
          }
        ],
        "proveedorId": "4f202324-0981-4ef3-aec5-653adb65c69d",
        "almacen": "alm-centro",
        "estado": "Conforme",
        "id": "3db9589a-8d5e-459f-822d-c3c5c402fdb0",
        "numero": "REC-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Mercancía recibida en cuarentena"
          },
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conforme: Operación de demostración validada"
          }
        ],
        "inspecciones": [
          {
            "fecha": "2026-11-25",
            "ubicacion": "RACK-A",
            "lineas": [
              {
                "codigo": "COM-001",
                "conformes": 6,
                "observadas": 0
              }
            ],
            "responsable": "Mario · Demo",
            "motivo": "Operación de demostración validada"
          }
        ]
      },
      {
        "ordenId": "0aa50f4d-e665-466e-952c-4aedfc1a56f7",
        "documento": "GR-DEMO-3",
        "lote": "REPO-3",
        "fecha": "2026-11-25",
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 7,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "coste": 80500,
            "conforme": 7,
            "noConforme": 0,
            "devuelta": 0,
            "enReparacion": 0,
            "baja": 0
          }
        ],
        "proveedorId": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
        "almacen": "alm-centro",
        "estado": "Conforme",
        "id": "25243575-9cc9-4414-8375-f2b8ab306599",
        "numero": "REC-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.672Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Mercancía recibida en cuarentena"
          },
          {
            "fecha": "2026-11-25T18:18:09.673Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conforme: Operación de demostración validada"
          }
        ],
        "inspecciones": [
          {
            "fecha": "2026-11-25",
            "ubicacion": "RACK-A",
            "lineas": [
              {
                "codigo": "CAM-001",
                "conformes": 7,
                "observadas": 0
              }
            ],
            "responsable": "Mario · Demo",
            "motivo": "Operación de demostración validada"
          }
        ]
      },
      {
        "ordenId": "8c04437a-74c2-459d-9115-463803812c2a",
        "documento": "GR-DEMO-4",
        "lote": "REPO-4",
        "fecha": "2026-11-25",
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 8,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "coste": 24000,
            "conforme": 8,
            "noConforme": 0,
            "devuelta": 0,
            "enReparacion": 0,
            "baja": 0
          }
        ],
        "proveedorId": "cc92b8d8-762b-42fe-9302-11f4c2260832",
        "almacen": "alm-centro",
        "estado": "Conforme",
        "id": "fbd701ef-8cd2-4bad-b6a9-a842ff95a9b9",
        "numero": "REC-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.678Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Mercancía recibida en cuarentena"
          },
          {
            "fecha": "2026-11-25T18:18:09.679Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conforme: Operación de demostración validada"
          }
        ],
        "inspecciones": [
          {
            "fecha": "2026-11-25",
            "ubicacion": "RACK-A",
            "lineas": [
              {
                "codigo": "MES-001",
                "conformes": 8,
                "observadas": 0
              }
            ],
            "responsable": "Mario · Demo",
            "motivo": "Operación de demostración validada"
          }
        ]
      },
      {
        "ordenId": "0f79f1e1-d03b-46e2-9599-9300ab1d3631",
        "documento": "GR-DEMO-5",
        "lote": "REPO-5",
        "fecha": "2026-11-25",
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 9,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "coste": 32000,
            "conforme": 9,
            "noConforme": 0,
            "devuelta": 0,
            "enReparacion": 0,
            "baja": 0
          }
        ],
        "proveedorId": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
        "almacen": "alm-centro",
        "estado": "Conforme",
        "id": "3e6bf92c-14a9-4da3-9f60-876d0b143a51",
        "numero": "REC-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Mercancía recibida en cuarentena"
          },
          {
            "fecha": "2026-11-25T18:18:09.685Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conforme: Operación de demostración validada"
          }
        ],
        "inspecciones": [
          {
            "fecha": "2026-11-25",
            "ubicacion": "RACK-A",
            "lineas": [
              {
                "codigo": "EST-001",
                "conformes": 9,
                "observadas": 0
              }
            ],
            "responsable": "Mario · Demo",
            "motivo": "Operación de demostración validada"
          }
        ]
      },
      {
        "ordenId": "f559aae9-44b1-434f-835f-e04fc5db366b",
        "documento": "GR-DEMO-6",
        "lote": "REPO-6",
        "fecha": "2026-11-25",
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 10,
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad",
            "coste": 17500,
            "conforme": 0,
            "noConforme": 0,
            "devuelta": 0,
            "enReparacion": 0,
            "baja": 0
          }
        ],
        "proveedorId": "c6d14bcd-bd72-4013-b4c9-40fa591224b3",
        "almacen": "alm-centro",
        "estado": "En inspección",
        "id": "296382a3-de99-4559-8aeb-c1ff3ece378f",
        "numero": "REC-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Mercancía recibida en cuarentena"
          }
        ]
      }
    ],
    "facturas": [
      {
        "ordenId": "a83582e5-1500-413a-bef8-b507c49ea3f8",
        "documento": "F901-000001",
        "fecha": "2026-11-25",
        "baseInformada": 532500,
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 5,
            "precio": 106500
          }
        ],
        "proveedorId": "9018c795-85e0-441f-afa3-c479fd151669",
        "baseCalculada": 532500,
        "igv": 95850,
        "observaciones": [],
        "estado": "Verificada",
        "pago": "Pendiente de Finanzas",
        "id": "83b33fe4-bf88-4a9c-8070-b8acc7484ce2",
        "numero": "VF-00001",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.650Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Cotejo de orden, recepción y factura"
          }
        ]
      },
      {
        "ordenId": "50ebad78-79c8-4cff-81d5-da6f3d1f513a",
        "documento": "F901-000002",
        "fecha": "2026-11-25",
        "baseInformada": 762000,
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 6,
            "precio": 127000
          }
        ],
        "proveedorId": "4f202324-0981-4ef3-aec5-653adb65c69d",
        "baseCalculada": 762000,
        "igv": 137160,
        "observaciones": [],
        "estado": "Verificada",
        "pago": "Pendiente de Finanzas",
        "id": "981a8fd3-b6da-4919-849e-c5ef3d0e787d",
        "numero": "VF-00002",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.664Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Cotejo de orden, recepción y factura"
          }
        ]
      },
      {
        "ordenId": "0aa50f4d-e665-466e-952c-4aedfc1a56f7",
        "documento": "F901-000003",
        "fecha": "2026-11-25",
        "baseInformada": 563500,
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 7,
            "precio": 80500
          }
        ],
        "proveedorId": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
        "baseCalculada": 563500,
        "igv": 101430,
        "observaciones": [],
        "estado": "Verificada",
        "pago": "Pendiente de Finanzas",
        "id": "31d969e2-e36d-4888-85a1-5ead84cade78",
        "numero": "VF-00003",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.673Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Cotejo de orden, recepción y factura"
          }
        ]
      },
      {
        "ordenId": "8c04437a-74c2-459d-9115-463803812c2a",
        "documento": "F901-000004",
        "fecha": "2026-11-25",
        "baseInformada": 192000,
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 8,
            "precio": 24000
          }
        ],
        "proveedorId": "cc92b8d8-762b-42fe-9302-11f4c2260832",
        "baseCalculada": 192000,
        "igv": 34560,
        "observaciones": [],
        "estado": "Verificada",
        "pago": "Pendiente de Finanzas",
        "id": "45447798-81f2-4217-83ce-2d290577ceb8",
        "numero": "VF-00004",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.679Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Cotejo de orden, recepción y factura"
          }
        ]
      },
      {
        "ordenId": "0f79f1e1-d03b-46e2-9599-9300ab1d3631",
        "documento": "F901-000005",
        "fecha": "2026-11-25",
        "baseInformada": 288000,
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 9,
            "precio": 32000
          }
        ],
        "proveedorId": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
        "baseCalculada": 288000,
        "igv": 51840,
        "observaciones": [],
        "estado": "Verificada",
        "pago": "Pendiente de Finanzas",
        "id": "9b2fa6ba-e120-40a7-8e51-b7c393da8fb6",
        "numero": "VF-00005",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.685Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Cotejo de orden, recepción y factura"
          }
        ]
      },
      {
        "ordenId": "f559aae9-44b1-434f-835f-e04fc5db366b",
        "documento": "F901-000006",
        "fecha": "2026-11-25",
        "baseInformada": 175000,
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 10,
            "precio": 17500
          }
        ],
        "proveedorId": "c6d14bcd-bd72-4013-b4c9-40fa591224b3",
        "baseCalculada": 175000,
        "igv": 31500,
        "observaciones": [
          "Cantidad de SIL-001 sin recepción conforme suficiente"
        ],
        "estado": "Observada",
        "pago": "Pendiente de Finanzas",
        "id": "59fdf3e8-5e54-4880-bc61-fa68f0ec3586",
        "numero": "VF-00006",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Cotejo de orden, recepción y factura"
          }
        ]
      }
    ],
    "reservas": [
      {
        "pedidoId": "793528e1-77d2-4574-869b-9159973e4187",
        "pedidoNumero": "PV-2026-00001",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SOF-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 105500,
            "cantidad": 2,
            "consumida": 2,
            "liberada": 0,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Isabel Paredes",
          "tipoDocumento": "DNI",
          "documento": "79900001",
          "direccion": "Calle Demostración 110, Lima",
          "direccionFiscal": "Calle Demostración 110, Lima",
          "direccionCobranza": "Calle Demostración 110, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente1@example.com",
          "telefono": "900990001",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.641Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "5305b7d5-35b1-43d9-a482-b300c2bb3293",
        "numero": "RES-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.695Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.696Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00001"
          }
        ]
      },
      {
        "pedidoId": "8cda50df-2cf4-4f4c-8d34-d525dc8ecf04",
        "pedidoNumero": "PV-2026-00002",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "COM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 126000,
            "cantidad": 1,
            "consumida": 1,
            "liberada": 0,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Estudio Cerezo SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000002",
          "direccion": "Calle Demostración 121, Lima",
          "direccionFiscal": "Calle Demostración 121, Lima",
          "direccionCobranza": "Calle Demostración 121, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente2@example.com",
          "telefono": "900990002",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "b7dbd832-7870-4a80-b762-12d683086b7e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "93222eca-fc75-48de-abbd-064d72b4a97a",
        "numero": "RES-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.712Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.713Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00002"
          }
        ]
      },
      {
        "pedidoId": "2018988b-6324-4108-9083-a76e17e41dcf",
        "pedidoNumero": "PV-2026-00003",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "CAM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 79500,
            "cantidad": 1,
            "consumida": 1,
            "liberada": 0,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Mateo Aguirre",
          "tipoDocumento": "DNI",
          "documento": "79900003",
          "direccion": "Calle Demostración 132, Lima",
          "direccionFiscal": "Calle Demostración 132, Lima",
          "direccionCobranza": "Calle Demostración 132, Lima",
          "zona": "Lima",
          "correo": "cliente3@example.com",
          "telefono": "900990003",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "519d4919-df96-452b-97b8-becd5f34d2ff",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "dfb6c0de-4dd4-4afb-a4cb-c63ecd23b20a",
        "numero": "RES-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00003"
          }
        ]
      },
      {
        "pedidoId": "97fd3abc-e963-4c97-a8da-2501dc02a5c0",
        "pedidoNumero": "PV-2026-00004",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "MES-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 23000,
            "cantidad": 2,
            "consumida": 2,
            "liberada": 0,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Taller Horizonte SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000004",
          "direccion": "Calle Demostración 143, Lima",
          "direccionFiscal": "Calle Demostración 143, Lima",
          "direccionCobranza": "Calle Demostración 143, Lima",
          "zona": "Lima",
          "correo": "cliente4@example.com",
          "telefono": "900990004",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "7c81a1f4-49cd-4675-881c-b62e53faa813",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "43ec7524-077a-4319-9300-e08210c94cf3",
        "numero": "RES-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.751Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.751Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00004"
          }
        ]
      },
      {
        "pedidoId": "4ed8e144-2ed5-4f16-bd46-fcb991490168",
        "pedidoNumero": "PV-2026-00005",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "EST-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 31000,
            "cantidad": 1,
            "consumida": 1,
            "liberada": 0,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Luciana Valdés",
          "tipoDocumento": "DNI",
          "documento": "79900005",
          "direccion": "Calle Demostración 154, Lima",
          "direccionFiscal": "Calle Demostración 154, Lima",
          "direccionCobranza": "Calle Demostración 154, Lima",
          "zona": "Lima",
          "correo": "cliente5@example.com",
          "telefono": "900990005",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "0fea5fff-01b6-4923-b1c1-2ede35801016",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "740d59f3-5f2b-4cfd-ba65-d815fdf3d158",
        "numero": "RES-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.797Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.797Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00005"
          }
        ]
      },
      {
        "pedidoId": "bfe1493d-d1fb-4a4b-8453-4a3805d9d45f",
        "pedidoNumero": "PV-2026-00006",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SIL-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 16500,
            "cantidad": 1,
            "consumida": 1,
            "liberada": 0,
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Casa Avellana SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000006",
          "direccion": "Calle Demostración 165, Lima",
          "direccionFiscal": "Calle Demostración 165, Lima",
          "direccionCobranza": "Calle Demostración 165, Lima",
          "zona": "Lima",
          "correo": "cliente6@example.com",
          "telefono": "900990006",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "8efc391c-7d16-4685-ae07-5774e6c01929",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "045fdad6-f7ff-4ac0-8de1-f6f0b34e6a75",
        "numero": "RES-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.816Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.816Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00006"
          }
        ]
      },
      {
        "pedidoId": "d6d7cc2b-b996-45d1-b23f-cff7fb0f6725",
        "pedidoNumero": "PV-2026-00007",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SOF-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 105500,
            "cantidad": 2,
            "consumida": 2,
            "liberada": 0,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Renzo Vidal",
          "tipoDocumento": "DNI",
          "documento": "79900007",
          "direccion": "Calle Demostración 176, Lima",
          "direccionFiscal": "Calle Demostración 176, Lima",
          "direccionCobranza": "Calle Demostración 176, Lima",
          "zona": "Lima",
          "correo": "cliente7@example.com",
          "telefono": "900990007",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "01e136ea-510a-4f76-a05a-94a959eecbd4",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "890191de-db22-40d6-8481-a18cabc8c38d",
        "numero": "RES-00007",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.823Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.825Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00007"
          }
        ]
      },
      {
        "pedidoId": "d081d24c-82ee-4ec4-a57b-ca0aff98335c",
        "pedidoNumero": "PV-2026-00008",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "COM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 126000,
            "cantidad": 1,
            "consumida": 1,
            "liberada": 0,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Oficinas Arrayán SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000008",
          "direccion": "Calle Demostración 187, Lima",
          "direccionFiscal": "Calle Demostración 187, Lima",
          "direccionCobranza": "Calle Demostración 187, Lima",
          "zona": "Lima",
          "correo": "cliente8@example.com",
          "telefono": "900990008",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "83cbd785-3102-479c-8996-5ea022530135",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "91912576-6e6f-45ff-ae79-5e1bfb37c415",
        "numero": "RES-00008",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00008"
          }
        ]
      },
      {
        "pedidoId": "016e47e8-7338-40ff-ad2a-efa69fa94345",
        "pedidoNumero": "PV-2026-00009",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "CAM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 79500,
            "cantidad": 1,
            "consumida": 1,
            "liberada": 0,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Daniela Salas",
          "tipoDocumento": "DNI",
          "documento": "79900009",
          "direccion": "Calle Demostración 198, Lima",
          "direccionFiscal": "Calle Demostración 198, Lima",
          "direccionCobranza": "Calle Demostración 198, Lima",
          "zona": "Lima",
          "correo": "cliente9@example.com",
          "telefono": "900990009",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "50206f32-964f-48e4-929a-d2b7136d9f06",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "df516995-c970-4ae2-87a8-76816d464b5b",
        "numero": "RES-00009",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00009"
          }
        ]
      },
      {
        "pedidoId": "035c35bf-1ce4-4798-8c6a-2dcf90b8bab4",
        "pedidoNumero": "PV-2026-00010",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "MES-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 23000,
            "cantidad": 2,
            "consumida": 2,
            "liberada": 0,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Galería Sauco SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000010",
          "direccion": "Calle Demostración 209, Lima",
          "direccionFiscal": "Calle Demostración 209, Lima",
          "direccionCobranza": "Calle Demostración 209, Lima",
          "zona": "Lima",
          "correo": "cliente10@example.com",
          "telefono": "900990010",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "4376104a-d3bd-4e79-a016-d1e4ab35ff7d",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "e2701d94-73ef-4498-aa83-21cd64301345",
        "numero": "RES-00010",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00010"
          }
        ]
      },
      {
        "pedidoId": "56d70760-013d-4802-8d7e-cad1e865792b",
        "pedidoNumero": "PV-2026-00011",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "EST-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 31000,
            "cantidad": 1,
            "consumida": 1,
            "liberada": 0,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad"
          }
        ],
        "estado": "Consumida",
        "cliente": {
          "nombre": "Bruno Navarro",
          "tipoDocumento": "DNI",
          "documento": "79900011",
          "direccion": "Calle Demostración 220, Lima",
          "direccionFiscal": "Calle Demostración 220, Lima",
          "direccionCobranza": "Calle Demostración 220, Lima",
          "zona": "Lima",
          "correo": "cliente11@example.com",
          "telefono": "900990011",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "4d1d3f81-2c41-4bbb-b6fe-97d7510b05b3",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "id": "46cbca0a-eca8-4eda-a90a-76e8ef67e962",
        "numero": "RES-00011",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.855Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reserva por ubicación y lote"
          },
          {
            "fecha": "2026-11-25T18:18:09.856Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida DES-00011"
          }
        ]
      }
    ],
    "picking": [
      {
        "reservaId": "5305b7d5-35b1-43d9-a482-b300c2bb3293",
        "pedidoId": "793528e1-77d2-4574-869b-9159973e4187",
        "pedidoNumero": "PV-2026-00001",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SOF-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 105500,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "95003544-286f-40d2-996d-5852748d3849",
        "numero": "PICK-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.695Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.695Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.695Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.696Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00001"
          }
        ]
      },
      {
        "reservaId": "93222eca-fc75-48de-abbd-064d72b4a97a",
        "pedidoId": "8cda50df-2cf4-4f4c-8d34-d525dc8ecf04",
        "pedidoNumero": "PV-2026-00002",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "COM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 126000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "c68977b1-65e7-457c-922d-16af0ea7f0c9",
        "numero": "PICK-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.712Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.712Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.712Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.713Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00002"
          }
        ]
      },
      {
        "reservaId": "dfb6c0de-4dd4-4afb-a4cb-c63ecd23b20a",
        "pedidoId": "2018988b-6324-4108-9083-a76e17e41dcf",
        "pedidoNumero": "PV-2026-00003",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "CAM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 79500,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "f0fa4141-3a53-49b3-9709-53f4a5626e46",
        "numero": "PICK-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00003"
          }
        ]
      },
      {
        "reservaId": "43ec7524-077a-4319-9300-e08210c94cf3",
        "pedidoId": "97fd3abc-e963-4c97-a8da-2501dc02a5c0",
        "pedidoNumero": "PV-2026-00004",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "MES-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 23000,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "afd785ee-def8-4662-9d83-319422f44491",
        "numero": "PICK-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.751Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.751Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.751Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.751Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00004"
          }
        ]
      },
      {
        "reservaId": "740d59f3-5f2b-4cfd-ba65-d815fdf3d158",
        "pedidoId": "4ed8e144-2ed5-4f16-bd46-fcb991490168",
        "pedidoNumero": "PV-2026-00005",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "EST-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 31000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "03ad2c1e-d758-421f-bf4e-58ba469f1d78",
        "numero": "PICK-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.797Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.797Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.797Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.797Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00005"
          }
        ]
      },
      {
        "reservaId": "045fdad6-f7ff-4ac0-8de1-f6f0b34e6a75",
        "pedidoId": "bfe1493d-d1fb-4a4b-8453-4a3805d9d45f",
        "pedidoNumero": "PV-2026-00006",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SIL-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 16500,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "34f98576-5607-43e4-a6cc-86ae852cb21d",
        "numero": "PICK-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.816Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.816Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.816Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.816Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00006"
          }
        ]
      },
      {
        "reservaId": "890191de-db22-40d6-8481-a18cabc8c38d",
        "pedidoId": "d6d7cc2b-b996-45d1-b23f-cff7fb0f6725",
        "pedidoNumero": "PV-2026-00007",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SOF-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 105500,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "62750376-0350-423b-9937-d7dbc0ff31ae",
        "numero": "PICK-00007",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.824Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.824Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.824Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.825Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00007"
          }
        ]
      },
      {
        "reservaId": "91912576-6e6f-45ff-ae79-5e1bfb37c415",
        "pedidoId": "d081d24c-82ee-4ec4-a57b-ca0aff98335c",
        "pedidoNumero": "PV-2026-00008",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "COM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 126000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "f34f0015-f02b-4c35-8d3e-33261a15917e",
        "numero": "PICK-00008",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00008"
          }
        ]
      },
      {
        "reservaId": "df516995-c970-4ae2-87a8-76816d464b5b",
        "pedidoId": "016e47e8-7338-40ff-ad2a-efa69fa94345",
        "pedidoNumero": "PV-2026-00009",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "CAM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 79500,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "5d48cb0b-5384-43ec-9565-ad08cd24dc00",
        "numero": "PICK-00009",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00009"
          }
        ]
      },
      {
        "reservaId": "e2701d94-73ef-4498-aa83-21cd64301345",
        "pedidoId": "035c35bf-1ce4-4798-8c6a-2dcf90b8bab4",
        "pedidoNumero": "PV-2026-00010",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "MES-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 23000,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "87b37569-8353-4753-a470-dad97b9d191e",
        "numero": "PICK-00010",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00010"
          }
        ]
      },
      {
        "reservaId": "46cbca0a-eca8-4eda-a90a-76e8ef67e962",
        "pedidoId": "56d70760-013d-4802-8d7e-cad1e865792b",
        "pedidoNumero": "PV-2026-00011",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "EST-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 31000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "reservaIndice": 0
          }
        ],
        "estado": "Despachado",
        "id": "836b1ea6-c28d-484e-8f99-03295cf38532",
        "numero": "PICK-00011",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.855Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Lista de picking generada"
          },
          {
            "fecha": "2026-11-25T18:18:09.855Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Preparado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.855Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Embalado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.856Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Despacho DES-00011"
          }
        ]
      }
    ],
    "despachos": [
      {
        "pickingId": "95003544-286f-40d2-996d-5852748d3849",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-101",
        "destino": "Calle Demostración 110, Lima",
        "pedidoId": "793528e1-77d2-4574-869b-9159973e4187",
        "pedidoNumero": "PV-2026-00001",
        "cliente": {
          "nombre": "Isabel Paredes",
          "tipoDocumento": "DNI",
          "documento": "79900001",
          "direccion": "Calle Demostración 110, Lima",
          "direccionFiscal": "Calle Demostración 110, Lima",
          "direccionCobranza": "Calle Demostración 110, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente1@example.com",
          "telefono": "900990001",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.641Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SOF-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 105500,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 2,
            "retornada": 0
          }
        ],
        "estado": "Entregado",
        "guia": "GS-00001",
        "id": "2a5bb812-1e1d-4dd2-aae5-124601adf3a0",
        "numero": "DES-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.696Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.696Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.696Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Entregado: POD-DEMO-1"
          }
        ],
        "receptor": "Isabel Paredes",
        "evidencia": "POD-DEMO-1",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "c68977b1-65e7-457c-922d-16af0ea7f0c9",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-102",
        "destino": "Calle Demostración 121, Lima",
        "pedidoId": "8cda50df-2cf4-4f4c-8d34-d525dc8ecf04",
        "pedidoNumero": "PV-2026-00002",
        "cliente": {
          "nombre": "Estudio Cerezo SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000002",
          "direccion": "Calle Demostración 121, Lima",
          "direccionFiscal": "Calle Demostración 121, Lima",
          "direccionCobranza": "Calle Demostración 121, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente2@example.com",
          "telefono": "900990002",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "b7dbd832-7870-4a80-b762-12d683086b7e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "COM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 126000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "reservaIndice": 0,
            "entregada": 1,
            "retornada": 0
          }
        ],
        "estado": "Entregado",
        "guia": "GS-00002",
        "id": "6d87e6f7-5e27-4730-b984-2c26520ad8d6",
        "numero": "DES-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.713Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.713Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.713Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Entregado: POD-DEMO-2"
          }
        ],
        "receptor": "Estudio Cerezo SAC",
        "evidencia": "POD-DEMO-2",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "f0fa4141-3a53-49b3-9709-53f4a5626e46",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-103",
        "destino": "Calle Demostración 132, Lima",
        "pedidoId": "2018988b-6324-4108-9083-a76e17e41dcf",
        "pedidoNumero": "PV-2026-00003",
        "cliente": {
          "nombre": "Mateo Aguirre",
          "tipoDocumento": "DNI",
          "documento": "79900003",
          "direccion": "Calle Demostración 132, Lima",
          "direccionFiscal": "Calle Demostración 132, Lima",
          "direccionCobranza": "Calle Demostración 132, Lima",
          "zona": "Lima",
          "correo": "cliente3@example.com",
          "telefono": "900990003",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "519d4919-df96-452b-97b8-becd5f34d2ff",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "CAM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 79500,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 1,
            "retornada": 0
          }
        ],
        "estado": "Entregado",
        "guia": "GS-00003",
        "id": "43962143-7c59-4c60-a23c-f7d8b4a0b9b8",
        "numero": "DES-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Entregado: POD-DEMO-3"
          }
        ],
        "receptor": "Mateo Aguirre",
        "evidencia": "POD-DEMO-3",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "afd785ee-def8-4662-9d83-319422f44491",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-104",
        "destino": "Calle Demostración 143, Lima",
        "pedidoId": "97fd3abc-e963-4c97-a8da-2501dc02a5c0",
        "pedidoNumero": "PV-2026-00004",
        "cliente": {
          "nombre": "Taller Horizonte SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000004",
          "direccion": "Calle Demostración 143, Lima",
          "direccionFiscal": "Calle Demostración 143, Lima",
          "direccionCobranza": "Calle Demostración 143, Lima",
          "zona": "Lima",
          "correo": "cliente4@example.com",
          "telefono": "900990004",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "7c81a1f4-49cd-4675-881c-b62e53faa813",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "MES-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 23000,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 2,
            "retornada": 0
          }
        ],
        "estado": "Entregado",
        "guia": "GS-00004",
        "id": "884e79c7-332a-413a-8876-349910f2711b",
        "numero": "DES-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.751Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.751Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.751Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Entregado: POD-DEMO-4"
          }
        ],
        "receptor": "Taller Horizonte SAC",
        "evidencia": "POD-DEMO-4",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "03ad2c1e-d758-421f-bf4e-58ba469f1d78",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-105",
        "destino": "Calle Demostración 154, Lima",
        "pedidoId": "4ed8e144-2ed5-4f16-bd46-fcb991490168",
        "pedidoNumero": "PV-2026-00005",
        "cliente": {
          "nombre": "Luciana Valdés",
          "tipoDocumento": "DNI",
          "documento": "79900005",
          "direccion": "Calle Demostración 154, Lima",
          "direccionFiscal": "Calle Demostración 154, Lima",
          "direccionCobranza": "Calle Demostración 154, Lima",
          "zona": "Lima",
          "correo": "cliente5@example.com",
          "telefono": "900990005",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "0fea5fff-01b6-4923-b1c1-2ede35801016",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "EST-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 31000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 1,
            "retornada": 0
          }
        ],
        "estado": "Entregado",
        "guia": "GS-00005",
        "id": "ec181393-b7da-4fe9-af3b-00043267c890",
        "numero": "DES-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.797Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.797Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.797Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Entregado: POD-DEMO-5"
          }
        ],
        "receptor": "Luciana Valdés",
        "evidencia": "POD-DEMO-5",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "34f98576-5607-43e4-a6cc-86ae852cb21d",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-106",
        "destino": "Calle Demostración 165, Lima",
        "pedidoId": "bfe1493d-d1fb-4a4b-8453-4a3805d9d45f",
        "pedidoNumero": "PV-2026-00006",
        "cliente": {
          "nombre": "Casa Avellana SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000006",
          "direccion": "Calle Demostración 165, Lima",
          "direccionFiscal": "Calle Demostración 165, Lima",
          "direccionCobranza": "Calle Demostración 165, Lima",
          "zona": "Lima",
          "correo": "cliente6@example.com",
          "telefono": "900990006",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "8efc391c-7d16-4685-ae07-5774e6c01929",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SIL-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 16500,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 1,
            "retornada": 0
          }
        ],
        "estado": "Entregado",
        "guia": "GS-00006",
        "id": "422bb84a-e0d0-408b-87a7-6d3a17474b42",
        "numero": "DES-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.816Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.816Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.816Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Entregado: POD-DEMO-6"
          }
        ],
        "receptor": "Casa Avellana SAC",
        "evidencia": "POD-DEMO-6",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "62750376-0350-423b-9937-d7dbc0ff31ae",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-107",
        "destino": "Calle Demostración 176, Lima",
        "pedidoId": "d6d7cc2b-b996-45d1-b23f-cff7fb0f6725",
        "pedidoNumero": "PV-2026-00007",
        "cliente": {
          "nombre": "Renzo Vidal",
          "tipoDocumento": "DNI",
          "documento": "79900007",
          "direccion": "Calle Demostración 176, Lima",
          "direccionFiscal": "Calle Demostración 176, Lima",
          "direccionCobranza": "Calle Demostración 176, Lima",
          "zona": "Lima",
          "correo": "cliente7@example.com",
          "telefono": "900990007",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "01e136ea-510a-4f76-a05a-94a959eecbd4",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SOF-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 105500,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 2
          }
        ],
        "estado": "No entregado",
        "guia": "GS-00007",
        "id": "9656e3d8-5081-4c5a-9f21-2a1533ed95af",
        "numero": "DES-00007",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.825Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.825Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.825Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "No entregado: POD-DEMO-7; Entrega reprogramada por ausencia del receptor"
          }
        ],
        "receptor": "Renzo Vidal",
        "evidencia": "POD-DEMO-7",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "f34f0015-f02b-4c35-8d3e-33261a15917e",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-108",
        "destino": "Calle Demostración 187, Lima",
        "pedidoId": "d081d24c-82ee-4ec4-a57b-ca0aff98335c",
        "pedidoNumero": "PV-2026-00008",
        "cliente": {
          "nombre": "Oficinas Arrayán SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000008",
          "direccion": "Calle Demostración 187, Lima",
          "direccionFiscal": "Calle Demostración 187, Lima",
          "direccionCobranza": "Calle Demostración 187, Lima",
          "zona": "Lima",
          "correo": "cliente8@example.com",
          "telefono": "900990008",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "83cbd785-3102-479c-8996-5ea022530135",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "COM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 126000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 1
          }
        ],
        "estado": "No entregado",
        "guia": "GS-00008",
        "id": "5ea65f6a-a2a0-400a-ba94-e8bbe0dc6c68",
        "numero": "DES-00008",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "No entregado: POD-DEMO-8; Entrega reprogramada por ausencia del receptor"
          }
        ],
        "receptor": "Oficinas Arrayán SAC",
        "evidencia": "POD-DEMO-8",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "5d48cb0b-5384-43ec-9565-ad08cd24dc00",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-109",
        "destino": "Calle Demostración 198, Lima",
        "pedidoId": "016e47e8-7338-40ff-ad2a-efa69fa94345",
        "pedidoNumero": "PV-2026-00009",
        "cliente": {
          "nombre": "Daniela Salas",
          "tipoDocumento": "DNI",
          "documento": "79900009",
          "direccion": "Calle Demostración 198, Lima",
          "direccionFiscal": "Calle Demostración 198, Lima",
          "direccionCobranza": "Calle Demostración 198, Lima",
          "zona": "Lima",
          "correo": "cliente9@example.com",
          "telefono": "900990009",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "50206f32-964f-48e4-929a-d2b7136d9f06",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "CAM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 79500,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 1
          }
        ],
        "estado": "No entregado",
        "guia": "GS-00009",
        "id": "7bd9cf16-bec9-4340-af54-94c73c9531bc",
        "numero": "DES-00009",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "No entregado: POD-DEMO-9; Entrega reprogramada por ausencia del receptor"
          }
        ],
        "receptor": "Daniela Salas",
        "evidencia": "POD-DEMO-9",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "87b37569-8353-4753-a470-dad97b9d191e",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-110",
        "destino": "Calle Demostración 209, Lima",
        "pedidoId": "035c35bf-1ce4-4798-8c6a-2dcf90b8bab4",
        "pedidoNumero": "PV-2026-00010",
        "cliente": {
          "nombre": "Galería Sauco SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000010",
          "direccion": "Calle Demostración 209, Lima",
          "direccionFiscal": "Calle Demostración 209, Lima",
          "direccionCobranza": "Calle Demostración 209, Lima",
          "zona": "Lima",
          "correo": "cliente10@example.com",
          "telefono": "900990010",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "4376104a-d3bd-4e79-a016-d1e4ab35ff7d",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "MES-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 23000,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 0
          }
        ],
        "estado": "No entregado",
        "guia": "GS-00010",
        "id": "c3f94cc5-9472-409c-8e2d-bb4eff0be686",
        "numero": "DES-00010",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "No entregado: POD-DEMO-10; Entrega reprogramada por ausencia del receptor"
          }
        ],
        "receptor": "Galería Sauco SAC",
        "evidencia": "POD-DEMO-10",
        "entregadoEn": "2026-11-25"
      },
      {
        "pickingId": "836b1ea6-c28d-484e-8f99-03295cf38532",
        "fecha": "2026-11-25",
        "transportista": "Valeria · Demo",
        "placa": "DMO-111",
        "destino": "Calle Demostración 220, Lima",
        "pedidoId": "56d70760-013d-4802-8d7e-cad1e865792b",
        "pedidoNumero": "PV-2026-00011",
        "cliente": {
          "nombre": "Bruno Navarro",
          "tipoDocumento": "DNI",
          "documento": "79900011",
          "direccion": "Calle Demostración 220, Lima",
          "direccionFiscal": "Calle Demostración 220, Lima",
          "direccionCobranza": "Calle Demostración 220, Lima",
          "zona": "Lima",
          "correo": "cliente11@example.com",
          "telefono": "900990011",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "4d1d3f81-2c41-4bbb-b6fe-97d7510b05b3",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "entregaPrevista": "2026-11-25",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "EST-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 31000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 0
          }
        ],
        "estado": "No entregado",
        "guia": "GS-00011",
        "id": "6278d04c-c224-45b9-a18b-402602890ff0",
        "numero": "DES-00011",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.856Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida de almacén registrada y guía interna preparada"
          },
          {
            "fecha": "2026-11-25T18:18:09.856Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Salida a ruta confirmada por Transporte"
          },
          {
            "fecha": "2026-11-25T18:18:09.856Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "No entregado: POD-DEMO-11; Entrega reprogramada por ausencia del receptor"
          }
        ],
        "receptor": "Bruno Navarro",
        "evidencia": "POD-DEMO-11",
        "entregadoEn": "2026-11-25"
      }
    ],
    "retornos": [
      {
        "despachoId": "9656e3d8-5081-4c5a-9f21-2a1533ed95af",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SOF-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 105500,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 0
          }
        ],
        "estado": "Recibido",
        "motivo": "Entrega reprogramada por ausencia del receptor",
        "id": "c5f15a9c-e2a5-4a8d-9166-c2522501a28b",
        "numero": "RET-00001",
        "sede": "centro",
        "registradoPor": "Valeria · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.825Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Retorno de unidades no entregadas pendiente de recepción"
          },
          {
            "fecha": "2026-11-25T18:18:09.826Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Retorno físico verificado: Operación de demostración validada"
          }
        ],
        "documento": "RET-DEMO-7",
        "fechaRecepcion": "2026-11-25"
      },
      {
        "despachoId": "5ea65f6a-a2a0-400a-ba94-e8bbe0dc6c68",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "COM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 126000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 0
          }
        ],
        "estado": "Recibido",
        "motivo": "Entrega reprogramada por ausencia del receptor",
        "id": "7901585d-ceca-4bf8-aeb2-676afaadae88",
        "numero": "RET-00002",
        "sede": "centro",
        "registradoPor": "Valeria · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Retorno de unidades no entregadas pendiente de recepción"
          },
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Retorno físico verificado: Operación de demostración validada"
          }
        ],
        "documento": "RET-DEMO-8",
        "fechaRecepcion": "2026-11-25"
      },
      {
        "despachoId": "7bd9cf16-bec9-4340-af54-94c73c9531bc",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "CAM-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 79500,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 0
          }
        ],
        "estado": "Recibido",
        "motivo": "Entrega reprogramada por ausencia del receptor",
        "id": "982ca08d-2d04-4294-ba21-72f45d4ce862",
        "numero": "RET-00003",
        "sede": "centro",
        "registradoPor": "Valeria · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Retorno de unidades no entregadas pendiente de recepción"
          },
          {
            "fecha": "2026-11-25T18:18:09.839Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Retorno físico verificado: Operación de demostración validada"
          }
        ],
        "documento": "RET-DEMO-9",
        "fechaRecepcion": "2026-11-25"
      },
      {
        "despachoId": "c3f94cc5-9472-409c-8e2d-bb4eff0be686",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "MES-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 23000,
            "cantidad": 2,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 0
          }
        ],
        "estado": "Pendiente",
        "motivo": "Entrega reprogramada por ausencia del receptor",
        "id": "e030bb4f-f7b6-4153-807a-792b24d899c6",
        "numero": "RET-00004",
        "sede": "centro",
        "registradoPor": "Valeria · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Retorno de unidades no entregadas pendiente de recepción"
          }
        ]
      },
      {
        "despachoId": "6278d04c-c224-45b9-a18b-402602890ff0",
        "almacen": "alm-centro",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "EST-001",
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 31000,
            "cantidad": 1,
            "consumida": 0,
            "liberada": 0,
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "reservaIndice": 0,
            "entregada": 0,
            "retornada": 0
          }
        ],
        "estado": "Pendiente",
        "motivo": "Entrega reprogramada por ausencia del receptor",
        "id": "39090c84-d96a-4822-9688-ae25ac8365f7",
        "numero": "RET-00005",
        "sede": "centro",
        "registradoPor": "Valeria · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.856Z",
            "usuario": "Valeria · Demo",
            "rol": "Transporte",
            "accion": "Retorno de unidades no entregadas pendiente de recepción"
          }
        ]
      }
    ],
    "traslados": [
      {
        "origen": "alm-centro",
        "destino": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 1
          }
        ],
        "sedeDestino": "centro",
        "estado": "En tránsito",
        "recibidas": {},
        "id": "1422d66b-466b-424a-8574-77defa25a7fb",
        "numero": "TRA-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.662Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Traslado entre almacenes solicitado"
          },
          {
            "fecha": "2026-11-25T18:18:09.662Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.663Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida del almacén de origen; mercancía en tránsito"
          }
        ],
        "asignaciones": [
          {
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 105500,
            "disponible": 25,
            "codigo": "SOF-001",
            "cantidad": 1
          }
        ]
      },
      {
        "origen": "alm-centro",
        "destino": "alm-olivos",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 1
          }
        ],
        "sedeDestino": "olivos",
        "estado": "En tránsito",
        "recibidas": {},
        "id": "12229288-ad72-4aab-9ae7-96a616f93dd9",
        "numero": "TRA-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Traslado entre almacenes solicitado"
          },
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Salida del almacén de origen; mercancía en tránsito"
          }
        ],
        "asignaciones": [
          {
            "ubicacion": "RACK-A",
            "lote": "INICIAL",
            "coste": 126000,
            "disponible": 29,
            "codigo": "COM-001",
            "cantidad": 1
          }
        ]
      },
      {
        "origen": "alm-centro",
        "destino": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 1
          }
        ],
        "sedeDestino": "centro",
        "estado": "Aprobado",
        "recibidas": {},
        "id": "9a0ac3f9-4d73-4e5c-a6b1-b7e772cd7738",
        "numero": "TRA-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Traslado entre almacenes solicitado"
          },
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "origen": "alm-centro",
        "destino": "alm-olivos",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 1
          }
        ],
        "sedeDestino": "olivos",
        "estado": "Rechazado",
        "recibidas": {},
        "id": "dd88ef13-a052-4394-8ff9-cc9274ec49d0",
        "numero": "TRA-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Traslado entre almacenes solicitado"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Rechazado: Operación de demostración validada"
          }
        ]
      },
      {
        "origen": "alm-centro",
        "destino": "5b1478bc-6b07-4db1-8fe9-b246152cc1f9",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 1
          }
        ],
        "sedeDestino": "centro",
        "estado": "Pendiente",
        "recibidas": {},
        "id": "5c74c535-8fef-46e2-8d27-f635404405c0",
        "numero": "TRA-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Traslado entre almacenes solicitado"
          }
        ]
      },
      {
        "origen": "alm-centro",
        "destino": "alm-olivos",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 1
          }
        ],
        "sedeDestino": "olivos",
        "estado": "Pendiente",
        "recibidas": {},
        "id": "bd8267d8-b6d1-42d9-8917-49856db1a49d",
        "numero": "TRA-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.689Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Traslado entre almacenes solicitado"
          }
        ]
      }
    ],
    "conteos": [
      {
        "almacen": "alm-centro",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SOF-001",
            "ubicacion": "RACK-A",
            "calidad": "Disponible",
            "lote": "INICIAL",
            "cantidad": 1,
            "fecha": "2026-11-25",
            "motivo": "Operación de demostración validada",
            "contado": 25,
            "coste": 105500,
            "teorico": 26,
            "diferencia": -1,
            "movimientosAlContar": 3
          }
        ],
        "estado": "Aprobado",
        "id": "6850110e-4ec3-4ad8-92fd-3abd085a550f",
        "numero": "CON-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.660Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conteo físico registrado"
          },
          {
            "fecha": "2026-11-25T18:18:09.661Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "COM-001",
            "ubicacion": "RACK-A",
            "calidad": "Disponible",
            "lote": "INICIAL",
            "cantidad": 1,
            "fecha": "2026-11-25",
            "motivo": "Operación de demostración validada",
            "contado": 29,
            "coste": 126000,
            "teorico": 29,
            "diferencia": 0,
            "movimientosAlContar": 3
          }
        ],
        "estado": "Aprobado",
        "id": "3c2ff570-f81c-4aca-860f-be346cff87ed",
        "numero": "CON-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conteo físico registrado"
          },
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "CAM-001",
            "ubicacion": "RACK-A",
            "calidad": "Disponible",
            "lote": "INICIAL",
            "cantidad": 1,
            "fecha": "2026-11-25",
            "motivo": "Operación de demostración validada",
            "contado": 33,
            "coste": 79500,
            "teorico": 33,
            "diferencia": 0,
            "movimientosAlContar": 2
          }
        ],
        "estado": "Aprobado",
        "id": "e7d73349-45be-4026-b288-3f7e68776672",
        "numero": "CON-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conteo físico registrado"
          },
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "MES-001",
            "ubicacion": "RACK-A",
            "calidad": "Disponible",
            "lote": "INICIAL",
            "cantidad": 1,
            "fecha": "2026-11-25",
            "motivo": "Operación de demostración validada",
            "contado": 36,
            "coste": 23000,
            "teorico": 36,
            "diferencia": 0,
            "movimientosAlContar": 2
          }
        ],
        "estado": "Pendiente",
        "id": "e4db6633-8cb3-48a9-bf49-a787c3623ebf",
        "numero": "CON-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conteo físico registrado"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "EST-001",
            "ubicacion": "RACK-A",
            "calidad": "Disponible",
            "lote": "INICIAL",
            "cantidad": 1,
            "fecha": "2026-11-25",
            "motivo": "Operación de demostración validada",
            "contado": 39,
            "coste": 31000,
            "teorico": 39,
            "diferencia": 0,
            "movimientosAlContar": 2
          }
        ],
        "estado": "Pendiente",
        "id": "2af358c9-bf3b-472c-90e5-e748e9f8cc49",
        "numero": "CON-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conteo físico registrado"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "lineas": [
          {
            "almacen": "alm-centro",
            "codigo": "SIL-001",
            "ubicacion": "RACK-A",
            "calidad": "Disponible",
            "lote": "INICIAL",
            "cantidad": 1,
            "fecha": "2026-11-25",
            "motivo": "Operación de demostración validada",
            "contado": 42,
            "coste": 16500,
            "teorico": 42,
            "diferencia": 0,
            "movimientosAlContar": 2
          }
        ],
        "estado": "Pendiente",
        "id": "1efc7757-a5ea-4a52-9436-706e6d31e502",
        "numero": "CON-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.689Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Conteo físico registrado"
          }
        ]
      }
    ],
    "planes": [
      {
        "codigo": "SOF-001",
        "periodo": "2026-11",
        "cantidad": 20,
        "motivo": "Operación de demostración validada",
        "estado": "Vigente",
        "id": "cff93bfc-11eb-408d-8b12-ddffc7392dad",
        "numero": "PLAN-00001",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.657Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Previsión: Operación de demostración validada"
          }
        ]
      },
      {
        "codigo": "COM-001",
        "periodo": "2026-11",
        "cantidad": 23,
        "motivo": "Operación de demostración validada",
        "estado": "Vigente",
        "id": "b48d7616-eda5-4245-8715-fe5eae3d32e0",
        "numero": "PLAN-00002",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.670Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Previsión: Operación de demostración validada"
          }
        ]
      },
      {
        "codigo": "CAM-001",
        "periodo": "2026-11",
        "cantidad": 26,
        "motivo": "Operación de demostración validada",
        "estado": "Vigente",
        "id": "52215fe3-9507-4c56-b71d-1a2150fbf8aa",
        "numero": "PLAN-00003",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.676Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Previsión: Operación de demostración validada"
          }
        ]
      },
      {
        "codigo": "MES-001",
        "periodo": "2026-11",
        "cantidad": 29,
        "motivo": "Operación de demostración validada",
        "estado": "Vigente",
        "id": "41771c50-31ad-44bd-8bdf-fb2552a5ff3e",
        "numero": "PLAN-00004",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.683Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Previsión: Operación de demostración validada"
          }
        ]
      },
      {
        "codigo": "EST-001",
        "periodo": "2026-11",
        "cantidad": 32,
        "motivo": "Operación de demostración validada",
        "estado": "Vigente",
        "id": "987239f3-160d-45dc-adb8-c3be200808b9",
        "numero": "PLAN-00005",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.687Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Previsión: Operación de demostración validada"
          }
        ]
      },
      {
        "codigo": "SIL-001",
        "periodo": "2026-11",
        "cantidad": 35,
        "motivo": "Operación de demostración validada",
        "estado": "Vigente",
        "id": "15da3aae-6f3e-4eab-b837-6c2821b9da65",
        "numero": "PLAN-00006",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.689Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Previsión: Operación de demostración validada"
          }
        ]
      }
    ],
    "acciones": [
      {
        "causa": "Mejora de control 1",
        "descripcion": "Verificar embalaje y rotulado de Sofá Brisa de lino",
        "responsable": "Mario · Demo",
        "plazo": "2027-01-24",
        "estado": "Completada",
        "id": "057a40fd-666e-4e7a-afaa-9ef33335881e",
        "numero": "AC-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.661Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Acción de mejora propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.661Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "En curso: Material de control entregado"
          },
          {
            "fecha": "2026-11-25T18:18:09.661Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Por verificar: Lista de control completada"
          },
          {
            "fecha": "2026-11-25T18:18:09.661Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Completada: Evidencia revisada"
          }
        ]
      },
      {
        "causa": "Mejora de control 2",
        "descripcion": "Verificar embalaje y rotulado de Comedor Lenga para cuatro",
        "responsable": "Mario · Demo",
        "plazo": "2027-01-24",
        "estado": "Por verificar",
        "id": "91b5829a-1959-4c85-90eb-278b9d6301cc",
        "numero": "AC-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Acción de mejora propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "En curso: Material de control entregado"
          },
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Por verificar: Lista de control completada"
          }
        ]
      },
      {
        "causa": "Mejora de control 3",
        "descripcion": "Verificar embalaje y rotulado de Cama Alba de dos plazas",
        "responsable": "Mario · Demo",
        "plazo": "2027-01-24",
        "estado": "En curso",
        "id": "b9b2b9a7-50b1-4dc0-960c-bc515eeca899",
        "numero": "AC-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Acción de mejora propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "En curso: Material de control entregado"
          }
        ]
      },
      {
        "causa": "Mejora de control 4",
        "descripcion": "Verificar embalaje y rotulado de Mesa Junco para sala",
        "responsable": "Mario · Demo",
        "plazo": "2027-01-24",
        "estado": "En curso",
        "id": "ff422ab3-2276-4c69-943f-7d909f44d671",
        "numero": "AC-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Acción de mejora propuesta"
          },
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "En curso: Material de control entregado"
          }
        ]
      },
      {
        "causa": "Mejora de control 5",
        "descripcion": "Verificar embalaje y rotulado de Estantería Nido modular",
        "responsable": "Mario · Demo",
        "plazo": "2027-01-24",
        "estado": "Pendiente",
        "id": "59a1e9e8-b33a-45e2-b8b1-87fd88220207",
        "numero": "AC-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Acción de mejora propuesta"
          }
        ]
      },
      {
        "causa": "Mejora de control 6",
        "descripcion": "Verificar embalaje y rotulado de Silla Cala tapizada",
        "responsable": "Mario · Demo",
        "plazo": "2027-01-24",
        "estado": "Pendiente",
        "id": "03d2c8b8-18a9-4b0e-a934-e12c4f8ccba6",
        "numero": "AC-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.689Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Acción de mejora propuesta"
          }
        ]
      }
    ],
    "evaluaciones": [
      {
        "proveedorId": "9018c795-85e0-441f-afa3-c479fd151669",
        "comentario": "Entrega completa y embalaje conforme. Seguimiento de reposición 1",
        "recepciones": 1,
        "aTiempo": 1,
        "inspeccionadas": 1,
        "conformes": 1,
        "unidadesRecibidas": 5,
        "unidadesConformes": 5,
        "estado": "Registrada",
        "id": "1ee58309-068f-48d5-9075-f7f497996b93",
        "numero": "EVAL-00001",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.650Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Evaluación con evidencia de recepciones"
          }
        ]
      },
      {
        "proveedorId": "4f202324-0981-4ef3-aec5-653adb65c69d",
        "comentario": "Entrega completa y embalaje conforme. Seguimiento de reposición 2",
        "recepciones": 1,
        "aTiempo": 1,
        "inspeccionadas": 1,
        "conformes": 1,
        "unidadesRecibidas": 6,
        "unidadesConformes": 6,
        "estado": "Registrada",
        "id": "c65f8567-ab7c-423f-8e90-5d2b796c0d6d",
        "numero": "EVAL-00002",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.665Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Evaluación con evidencia de recepciones"
          }
        ]
      },
      {
        "proveedorId": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
        "comentario": "Entrega completa y embalaje conforme. Seguimiento de reposición 3",
        "recepciones": 1,
        "aTiempo": 1,
        "inspeccionadas": 1,
        "conformes": 1,
        "unidadesRecibidas": 7,
        "unidadesConformes": 7,
        "estado": "Registrada",
        "id": "dd4dc1bc-5503-43af-9694-ff19d2cacdd3",
        "numero": "EVAL-00003",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.673Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Evaluación con evidencia de recepciones"
          }
        ]
      },
      {
        "proveedorId": "cc92b8d8-762b-42fe-9302-11f4c2260832",
        "comentario": "Entrega completa y embalaje conforme. Seguimiento de reposición 4",
        "recepciones": 1,
        "aTiempo": 1,
        "inspeccionadas": 1,
        "conformes": 1,
        "unidadesRecibidas": 8,
        "unidadesConformes": 8,
        "estado": "Registrada",
        "id": "209c392e-0f71-44a9-b38c-dfa13a00d2c4",
        "numero": "EVAL-00004",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.679Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Evaluación con evidencia de recepciones"
          }
        ]
      },
      {
        "proveedorId": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
        "comentario": "Entrega completa y embalaje conforme. Seguimiento de reposición 5",
        "recepciones": 1,
        "aTiempo": 1,
        "inspeccionadas": 1,
        "conformes": 1,
        "unidadesRecibidas": 9,
        "unidadesConformes": 9,
        "estado": "Registrada",
        "id": "5d6ffc3b-59e4-4e11-9bb4-598ddd160870",
        "numero": "EVAL-00005",
        "sede": "centro",
        "registradoPor": "Lucía · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.685Z",
            "usuario": "Lucía · Demo",
            "rol": "Compras",
            "accion": "Evaluación con evidencia de recepciones"
          }
        ]
      }
    ],
    "parametros": [
      {
        "almacen": "alm-centro",
        "codigo": "SOF-001",
        "minimo": 4,
        "objetivo": 20,
        "motivo": "Operación de demostración validada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.656Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Parámetros de reposición: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "COM-001",
        "minimo": 5,
        "objetivo": 21,
        "motivo": "Operación de demostración validada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.670Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Parámetros de reposición: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "CAM-001",
        "minimo": 6,
        "objetivo": 22,
        "motivo": "Operación de demostración validada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.676Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Parámetros de reposición: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "MES-001",
        "minimo": 7,
        "objetivo": 23,
        "motivo": "Operación de demostración validada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.683Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Parámetros de reposición: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "EST-001",
        "minimo": 8,
        "objetivo": 24,
        "motivo": "Operación de demostración validada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.687Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Parámetros de reposición: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "SIL-001",
        "minimo": 9,
        "objetivo": 25,
        "motivo": "Operación de demostración validada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.689Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Parámetros de reposición: Operación de demostración validada"
          }
        ]
      }
    ],
    "tratamientos": [
      {
        "almacen": "alm-centro",
        "codigo": "SOF-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "tipo": "Deterioro",
        "coste": 105500,
        "estado": "Deterioro registrado",
        "id": "dbd22002-94bf-4924-b910-6e8fd209b9c8",
        "numero": "CAL-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.658Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Tratamiento solicitado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.660Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Deterioro registrado: Operación de demostración validada"
          }
        ],
        "aprobadoPor": "Andrés · Demo"
      },
      {
        "almacen": "alm-centro",
        "codigo": "COM-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "tipo": "Deterioro",
        "coste": 126000,
        "estado": "Deterioro registrado",
        "id": "92ae6c76-ec8a-4549-9ef3-3378acd8268c",
        "numero": "CAL-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.670Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Tratamiento solicitado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.671Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Deterioro registrado: Operación de demostración validada"
          }
        ],
        "aprobadoPor": "Andrés · Demo"
      },
      {
        "almacen": "alm-centro",
        "codigo": "CAM-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "tipo": "Deterioro",
        "coste": 79500,
        "estado": "Rechazado",
        "id": "8fb5c7f2-948e-432b-b7a3-b7d7a393f458",
        "numero": "CAL-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Tratamiento solicitado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.677Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Rechazado: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "MES-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "tipo": "Deterioro",
        "coste": 23000,
        "estado": "Pendiente",
        "id": "d1c19ab8-6e6c-41b8-a7ca-bb1ecbb00001",
        "numero": "CAL-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.684Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Tratamiento solicitado: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "EST-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "tipo": "Deterioro",
        "coste": 31000,
        "estado": "Pendiente",
        "id": "0076b73c-50d0-43a9-b49e-6d033b2b063b",
        "numero": "CAL-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.688Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Tratamiento solicitado: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "SIL-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "tipo": "Deterioro",
        "coste": 16500,
        "estado": "Pendiente",
        "id": "25e74382-59fe-4137-862b-3f60712100ab",
        "numero": "CAL-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.689Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Tratamiento solicitado: Operación de demostración validada"
          }
        ]
      }
    ],
    "reubicaciones": [
      {
        "almacen": "alm-centro",
        "codigo": "SOF-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "destino": "EXHIBICION",
        "coste": 105500,
        "estado": "Registrada",
        "id": "1493a1bc-62ca-49a6-a988-d1ee152833b7",
        "numero": "REU-00001",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.658Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reubicación interna: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "COM-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "destino": "EXHIBICION",
        "coste": 126000,
        "estado": "Registrada",
        "id": "155bee47-a93f-4d14-9573-45895aeedd84",
        "numero": "REU-00002",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.670Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reubicación interna: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "CAM-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "destino": "EXHIBICION",
        "coste": 79500,
        "estado": "Registrada",
        "id": "298d0bd9-c317-4d31-8650-b0b14e1d9752",
        "numero": "REU-00003",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.676Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reubicación interna: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "MES-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "destino": "EXHIBICION",
        "coste": 23000,
        "estado": "Registrada",
        "id": "384a5bbf-b7fc-47a5-9c6f-ded8adf16c0c",
        "numero": "REU-00004",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.683Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reubicación interna: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "EST-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "destino": "EXHIBICION",
        "coste": 31000,
        "estado": "Registrada",
        "id": "ea91d114-14bb-427c-bcdf-62dd1d6648c2",
        "numero": "REU-00005",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.687Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reubicación interna: Operación de demostración validada"
          }
        ]
      },
      {
        "almacen": "alm-centro",
        "codigo": "SIL-001",
        "ubicacion": "RACK-A",
        "calidad": "Disponible",
        "lote": "INICIAL",
        "cantidad": 1,
        "fecha": "2026-11-25",
        "motivo": "Operación de demostración validada",
        "destino": "EXHIBICION",
        "coste": 16500,
        "estado": "Registrada",
        "id": "35285573-48fd-4a2d-92b0-c582b427d7bd",
        "numero": "REU-00006",
        "sede": "centro",
        "registradoPor": "Mario · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.689Z",
            "usuario": "Mario · Demo",
            "rol": "Almacén",
            "accion": "Reubicación interna: Operación de demostración validada"
          }
        ]
      }
    ]
  },
  "famihogar.libros.v1": {
    "version": 1,
    "documentos": [
      {
        "tipo": "compra",
        "referencia": "F901-000001",
        "fecha": "2026-11-25",
        "vence": "2026-12-25",
        "fechaOrigen": "2026-11-25",
        "fechaFactura": "2026-11-25",
        "base": 532500,
        "igv": 95850,
        "condicion": "Crédito 30 días",
        "tercero": "Carpintería Sauce SAC",
        "terceroId": "9018c795-85e0-441f-afa3-c479fd151669",
        "origenId": "83b33fe4-bf88-4a9c-8070-b8acc7484ce2",
        "origenNumero": "VF-00001",
        "ordenId": "a83582e5-1500-413a-bef8-b507c49ea3f8",
        "ordenNumero": "OC-00001",
        "recepciones": [
          "REC-00001"
        ],
        "total": 628350,
        "id": "40d23c80-7c10-45a7-8cf7-82b66d3d993f",
        "numero": "CXP-00001",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.653Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          },
          {
            "fecha": "2026-11-25T18:18:09.656Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago aplicado: TES-00002"
          }
        ]
      },
      {
        "tipo": "compra",
        "referencia": "F901-000002",
        "fecha": "2026-11-25",
        "vence": "2026-12-25",
        "fechaOrigen": "2026-11-25",
        "fechaFactura": "2026-11-25",
        "base": 762000,
        "igv": 137160,
        "condicion": "Crédito 30 días",
        "tercero": "Tapizados Brezo SAC",
        "terceroId": "4f202324-0981-4ef3-aec5-653adb65c69d",
        "origenId": "981a8fd3-b6da-4919-849e-c5ef3d0e787d",
        "origenNumero": "VF-00002",
        "ordenId": "50ebad78-79c8-4cff-81d5-da6f3d1f513a",
        "ordenNumero": "OC-00002",
        "recepciones": [
          "REC-00002"
        ],
        "total": 899160,
        "id": "be9c99e9-c428-4d4b-b87d-eeb6d8bba482",
        "numero": "CXP-00002",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.667Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          },
          {
            "fecha": "2026-11-25T18:18:09.669Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago aplicado: TES-00003"
          }
        ]
      },
      {
        "tipo": "compra",
        "referencia": "F901-000003",
        "fecha": "2026-11-25",
        "vence": "2026-12-25",
        "fechaOrigen": "2026-11-25",
        "fechaFactura": "2026-11-25",
        "base": 563500,
        "igv": 101430,
        "condicion": "Crédito 30 días",
        "tercero": "Maderas Jacarandá SAC",
        "terceroId": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
        "origenId": "31d969e2-e36d-4888-85a1-5ead84cade78",
        "origenNumero": "VF-00003",
        "ordenId": "0aa50f4d-e665-466e-952c-4aedfc1a56f7",
        "ordenNumero": "OC-00003",
        "recepciones": [
          "REC-00003"
        ],
        "total": 664930,
        "id": "47c8f3f5-7704-4195-9e30-ea8b71495f28",
        "numero": "CXP-00003",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.675Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          }
        ]
      },
      {
        "tipo": "compra",
        "referencia": "F901-000004",
        "fecha": "2026-11-25",
        "vence": "2026-12-25",
        "fechaOrigen": "2026-11-25",
        "fechaFactura": "2026-11-25",
        "base": 192000,
        "igv": 34560,
        "condicion": "Crédito 30 días",
        "tercero": "Herrajes Acanto SAC",
        "terceroId": "cc92b8d8-762b-42fe-9302-11f4c2260832",
        "origenId": "45447798-81f2-4217-83ce-2d290577ceb8",
        "origenNumero": "VF-00004",
        "ordenId": "8c04437a-74c2-459d-9115-463803812c2a",
        "ordenNumero": "OC-00004",
        "recepciones": [
          "REC-00004"
        ],
        "total": 226560,
        "id": "5943fd50-634a-422b-b8df-a1ff402b007c",
        "numero": "CXP-00004",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.682Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          }
        ]
      },
      {
        "tipo": "compra",
        "referencia": "F901-000005",
        "fecha": "2026-11-25",
        "vence": "2026-12-25",
        "fechaOrigen": "2026-11-25",
        "fechaFactura": "2026-11-25",
        "base": 288000,
        "igv": 51840,
        "condicion": "Crédito 30 días",
        "tercero": "Diseño Fresno SAC",
        "terceroId": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
        "origenId": "9b2fa6ba-e120-40a7-8e51-b7c393da8fb6",
        "origenNumero": "VF-00005",
        "ordenId": "0f79f1e1-d03b-46e2-9599-9300ab1d3631",
        "ordenNumero": "OC-00005",
        "recepciones": [
          "REC-00005"
        ],
        "total": 339840,
        "id": "9bc7e237-2ee6-45e5-ace3-1f9963042d57",
        "numero": "CXP-00005",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.687Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          }
        ]
      },
      {
        "tipo": "venta",
        "tipoComprobante": "boleta",
        "referencia": "BOL-INT-000001",
        "fecha": "2026-11-25",
        "vence": "2026-11-25",
        "base": 321600,
        "igv": 57888,
        "fechaOrigen": "2026-11-25",
        "condicion": "Contado",
        "tercero": "Isabel Paredes",
        "terceroId": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
        "identificacion": "DNI 79900001",
        "origenId": "793528e1-77d2-4574-869b-9159973e4187",
        "origenNumero": "PV-2026-00001",
        "entregas": [
          "DES-00001"
        ],
        "lineas": [
          {
            "codigo": "SOF-001",
            "nombre": "Sofá Brisa de lino",
            "cantidad": 2,
            "precio": 160800,
            "descuento": 0,
            "importe": 321600
          }
        ],
        "bruto": 321600,
        "descuento": 0,
        "descuentoBps": 0,
        "igvPorcentaje": 18,
        "total": 379488,
        "id": "dfbcbf54-1335-4445-8c8f-43bc77cd5573",
        "numero": "CXC-00006",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.705Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Cuenta registrada con su documento de origen"
          },
          {
            "fecha": "2026-11-25T18:18:09.707Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro aplicado: TES-00004"
          }
        ]
      },
      {
        "tipo": "venta",
        "tipoComprobante": "factura",
        "referencia": "FAC-INT-000001",
        "fecha": "2026-11-25",
        "vence": "2026-12-25",
        "base": 180294,
        "igv": 32453,
        "fechaOrigen": "2026-11-25",
        "condicion": "Crédito 30 días",
        "tercero": "Estudio Cerezo SAC",
        "terceroId": "b7dbd832-7870-4a80-b762-12d683086b7e",
        "identificacion": "RUC 20990000002",
        "origenId": "8cda50df-2cf4-4f4c-8d34-d525dc8ecf04",
        "origenNumero": "PV-2026-00002",
        "entregas": [
          "DES-00002"
        ],
        "lineas": [
          {
            "codigo": "COM-001",
            "nombre": "Comedor Lenga para cuatro",
            "cantidad": 1,
            "precio": 182115,
            "descuento": 1821,
            "importe": 180294
          }
        ],
        "bruto": 182115,
        "descuento": 1821,
        "descuentoBps": 100,
        "igvPorcentaje": 18,
        "total": 212747,
        "id": "dc6b8520-3fa5-40b9-af44-6e4c27522090",
        "numero": "CXC-00007",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.721Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Cuenta registrada con su documento de origen"
          },
          {
            "fecha": "2026-11-25T18:18:09.721Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro aplicado: TES-00005"
          }
        ]
      },
      {
        "tipo": "venta",
        "tipoComprobante": "boleta",
        "referencia": "BOL-INT-000002",
        "fecha": "2026-11-25",
        "vence": "2026-11-25",
        "base": 120148,
        "igv": 21627,
        "fechaOrigen": "2026-11-25",
        "condicion": "Contado",
        "tercero": "Mateo Aguirre",
        "terceroId": "519d4919-df96-452b-97b8-becd5f34d2ff",
        "identificacion": "DNI 79900003",
        "origenId": "2018988b-6324-4108-9083-a76e17e41dcf",
        "origenNumero": "PV-2026-00003",
        "entregas": [
          "DES-00003"
        ],
        "lineas": [
          {
            "codigo": "CAM-001",
            "nombre": "Cama Alba de dos plazas",
            "cantidad": 1,
            "precio": 122600,
            "descuento": 2452,
            "importe": 120148
          }
        ],
        "bruto": 122600,
        "descuento": 2452,
        "descuentoBps": 200,
        "igvPorcentaje": 18,
        "total": 141775,
        "id": "9176d10d-0752-4798-819b-fe62f26453d1",
        "numero": "CXC-00008",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.735Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Cuenta registrada con su documento de origen"
          },
          {
            "fecha": "2026-11-25T18:18:09.738Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro aplicado: TES-00006"
          }
        ]
      },
      {
        "tipo": "venta",
        "tipoComprobante": "factura",
        "referencia": "FAC-INT-000002",
        "fecha": "2026-11-25",
        "vence": "2026-12-25",
        "base": 70955,
        "igv": 12772,
        "fechaOrigen": "2026-11-25",
        "condicion": "Crédito 30 días",
        "tercero": "Taller Horizonte SAC",
        "terceroId": "7c81a1f4-49cd-4675-881c-b62e53faa813",
        "identificacion": "RUC 20990000004",
        "origenId": "97fd3abc-e963-4c97-a8da-2501dc02a5c0",
        "origenNumero": "PV-2026-00004",
        "entregas": [
          "DES-00004"
        ],
        "lineas": [
          {
            "codigo": "MES-001",
            "nombre": "Mesa Junco para sala",
            "cantidad": 2,
            "precio": 36575,
            "descuento": 2195,
            "importe": 70955
          }
        ],
        "bruto": 73150,
        "descuento": 2195,
        "descuentoBps": 300,
        "igvPorcentaje": 18,
        "total": 83727,
        "id": "6c7c03bb-93e6-44e0-948c-d1572e955948",
        "numero": "CXC-00009",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.785Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Cuenta registrada con su documento de origen"
          },
          {
            "fecha": "2026-11-25T18:18:09.788Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro aplicado: TES-00007"
          }
        ]
      },
      {
        "tipo": "venta",
        "tipoComprobante": "boleta",
        "referencia": "BOL-INT-000003",
        "fecha": "2026-11-25",
        "vence": "2026-11-25",
        "base": 48888,
        "igv": 8800,
        "fechaOrigen": "2026-11-25",
        "condicion": "Contado",
        "tercero": "Luciana Valdés",
        "terceroId": "0fea5fff-01b6-4923-b1c1-2ede35801016",
        "identificacion": "DNI 79900005",
        "origenId": "4ed8e144-2ed5-4f16-bd46-fcb991490168",
        "origenNumero": "PV-2026-00005",
        "entregas": [
          "DES-00005"
        ],
        "lineas": [
          {
            "codigo": "EST-001",
            "nombre": "Estantería Nido modular",
            "cantidad": 1,
            "precio": 48888,
            "descuento": 0,
            "importe": 48888
          }
        ],
        "bruto": 48888,
        "descuento": 0,
        "descuentoBps": 0,
        "igvPorcentaje": 18,
        "total": 57688,
        "id": "410d26dd-ed02-4678-ad20-1ded0613e386",
        "numero": "CXC-00010",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.808Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Cuenta registrada con su documento de origen"
          },
          {
            "fecha": "2026-11-25T18:18:09.808Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro aplicado: TES-00008"
          }
        ]
      },
      {
        "tipo": "compra",
        "clase": "activo",
        "referencia": "FA90-101",
        "fecha": "2026-10-31",
        "vence": "2026-11-30",
        "base": 125000,
        "igv": 22500,
        "tercero": "Carpintería Sauce SAC",
        "terceroId": "9018c795-85e0-441f-afa3-c479fd151669",
        "origenId": "activo:9018c795-85e0-441f-afa3-c479fd151669:FA90-101",
        "origenNumero": "ACT-REC-101",
        "descripcion": "Computadora para caja",
        "total": 147500,
        "id": "037a0c74-b50a-4f6a-a872-9d4e21b208be",
        "numero": "CXP-00011",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.870Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          }
        ]
      },
      {
        "tipo": "compra",
        "clase": "activo",
        "referencia": "FA90-102",
        "fecha": "2026-10-31",
        "vence": "2026-11-30",
        "base": 147500,
        "igv": 26550,
        "tercero": "Tapizados Brezo SAC",
        "terceroId": "4f202324-0981-4ef3-aec5-653adb65c69d",
        "origenId": "activo:4f202324-0981-4ef3-aec5-653adb65c69d:FA90-102",
        "origenNumero": "ACT-REC-102",
        "descripcion": "Impresora de etiquetas",
        "total": 174050,
        "id": "ccd738fd-7aec-4b16-8547-a1a34f71ea96",
        "numero": "CXP-00012",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.879Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          }
        ]
      },
      {
        "tipo": "compra",
        "clase": "activo",
        "referencia": "FA90-103",
        "fecha": "2026-10-31",
        "vence": "2026-11-30",
        "base": 170000,
        "igv": 30600,
        "tercero": "Maderas Jacarandá SAC",
        "terceroId": "6acd5ae4-7b42-4694-a7d6-697ff088c1a2",
        "origenId": "activo:6acd5ae4-7b42-4694-a7d6-697ff088c1a2:FA90-103",
        "origenNumero": "ACT-REC-103",
        "descripcion": "Lector de códigos",
        "total": 200600,
        "id": "cd00857f-ad2b-4b0a-be35-95e0c0d1b468",
        "numero": "CXP-00013",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.885Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          }
        ]
      },
      {
        "tipo": "compra",
        "clase": "activo",
        "referencia": "FA90-104",
        "fecha": "2026-10-31",
        "vence": "2026-11-30",
        "base": 192500,
        "igv": 34650,
        "tercero": "Herrajes Acanto SAC",
        "terceroId": "cc92b8d8-762b-42fe-9302-11f4c2260832",
        "origenId": "activo:cc92b8d8-762b-42fe-9302-11f4c2260832:FA90-104",
        "origenNumero": "ACT-REC-104",
        "descripcion": "Carro de transporte",
        "total": 227150,
        "id": "ac6f4f99-d51d-4910-9735-5ba9da5f39eb",
        "numero": "CXP-00014",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.892Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          }
        ]
      },
      {
        "tipo": "compra",
        "clase": "activo",
        "referencia": "FA90-105",
        "fecha": "2026-10-31",
        "vence": "2026-11-30",
        "base": 215000,
        "igv": 38700,
        "tercero": "Diseño Fresno SAC",
        "terceroId": "5466048f-62db-4aae-be4e-bfdd17e0a3d9",
        "origenId": "activo:5466048f-62db-4aae-be4e-bfdd17e0a3d9:FA90-105",
        "origenNumero": "ACT-REC-105",
        "descripcion": "Equipo fotográfico",
        "total": 253700,
        "id": "c297a9fd-bbd6-471a-b870-31830b2ae684",
        "numero": "CXP-00015",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.900Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuenta registrada con su documento de origen"
          }
        ]
      }
    ],
    "creditos": [
      {
        "clienteId": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
        "limite": 1000000,
        "id": "28157ed0-b969-4b33-9408-5becddbbdab8",
        "numero": "CRE-00001",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.641Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "b7dbd832-7870-4a80-b762-12d683086b7e",
        "limite": 1050000,
        "id": "e25cf62a-71d3-47c8-9a2d-9c696aed3c5f",
        "numero": "CRE-00002",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.642Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "519d4919-df96-452b-97b8-becd5f34d2ff",
        "limite": 1100000,
        "id": "cf7ac543-24e5-44cf-9545-469b54f28ff7",
        "numero": "CRE-00003",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "7c81a1f4-49cd-4675-881c-b62e53faa813",
        "limite": 1150000,
        "id": "8d3394b9-4814-4f5d-aa84-327116a9d277",
        "numero": "CRE-00004",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "0fea5fff-01b6-4923-b1c1-2ede35801016",
        "limite": 1200000,
        "id": "b107806e-7718-4c23-ad63-7bf861c03aa4",
        "numero": "CRE-00005",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "8efc391c-7d16-4685-ae07-5774e6c01929",
        "limite": 1250000,
        "id": "33859c7d-3042-4348-9e91-82ea922df654",
        "numero": "CRE-00006",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "01e136ea-510a-4f76-a05a-94a959eecbd4",
        "limite": 1300000,
        "id": "f031910a-3ac9-45e7-926f-0121e842ff45",
        "numero": "CRE-00007",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "83cbd785-3102-479c-8996-5ea022530135",
        "limite": 1350000,
        "id": "e817e362-36b7-4e5d-809e-ba618910cf8c",
        "numero": "CRE-00008",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "50206f32-964f-48e4-929a-d2b7136d9f06",
        "limite": 1400000,
        "id": "21fa0602-5773-4533-843c-2ead0ce53058",
        "numero": "CRE-00009",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "4376104a-d3bd-4e79-a016-d1e4ab35ff7d",
        "limite": 1450000,
        "id": "e828482c-7b79-4f2a-b316-6488072fb9fa",
        "numero": "CRE-00010",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "4d1d3f81-2c41-4bbb-b6fe-97d7510b05b3",
        "limite": 1500000,
        "id": "f542d541-b5dc-424a-a60e-5ad1ce271810",
        "numero": "CRE-00011",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "262a006d-c478-4b67-8b19-55df5a2af8b9",
        "limite": 1550000,
        "id": "81c7229d-747e-4e6c-ad38-8001fa66be73",
        "numero": "CRE-00012",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.645Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "3c4ffa3d-1bbb-4e2f-abe1-46cc3f70a27e",
        "limite": 1600000,
        "id": "f830ee58-ba71-441f-8a28-4fdfcd17ab60",
        "numero": "CRE-00013",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.645Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      },
      {
        "clienteId": "6b2bd27d-61c0-492d-888e-2047ef89184f",
        "limite": 1650000,
        "id": "1cea58dc-c0ce-4e08-839c-366189208253",
        "numero": "CRE-00014",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.645Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Operación de demostración validada"
          }
        ]
      }
    ],
    "pagos": [
      {
        "documentoId": "40d23c80-7c10-45a7-8cf7-82b66d3d993f",
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 628350,
        "estado": "Confirmado",
        "id": "22d19d25-40b0-49b2-88a7-8f9700d65224",
        "numero": "PAG-00001",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.654Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago programado"
          },
          {
            "fecha": "2026-11-25T18:18:09.654Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.656Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago confirmado: TES-00002"
          }
        ]
      },
      {
        "documentoId": "be9c99e9-c428-4d4b-b87d-eeb6d8bba482",
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 449580,
        "estado": "Confirmado",
        "id": "7c53f599-7965-48f1-96bd-d26df5065c9b",
        "numero": "PAG-00002",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.668Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago programado"
          },
          {
            "fecha": "2026-11-25T18:18:09.668Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          },
          {
            "fecha": "2026-11-25T18:18:09.669Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago confirmado: TES-00003"
          }
        ]
      },
      {
        "documentoId": "47c8f3f5-7704-4195-9e30-ea8b71495f28",
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 664930,
        "estado": "Aprobado",
        "id": "69359cd1-4f83-4a27-aa08-62f5921cd712",
        "numero": "PAG-00003",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.676Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago programado"
          },
          {
            "fecha": "2026-11-25T18:18:09.676Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "documentoId": "5943fd50-634a-422b-b8df-a1ff402b007c",
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 113280,
        "estado": "Rechazado",
        "id": "bb3959e4-d19c-45a3-94e3-5be2ea031111",
        "numero": "PAG-00004",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.683Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago programado"
          },
          {
            "fecha": "2026-11-25T18:18:09.683Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Rechazado: Operación de demostración validada"
          }
        ]
      },
      {
        "documentoId": "9bc7e237-2ee6-45e5-ace3-1f9963042d57",
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 339840,
        "estado": "Programado",
        "id": "b3523570-2b96-4eca-935f-a75a27915f3f",
        "numero": "PAG-00005",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.687Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago programado"
          }
        ]
      }
    ],
    "movimientos": [
      {
        "cuenta": "banco",
        "fecha": "2026-10-31",
        "importe": 8000000,
        "referencia": "BANCO-DEMO-APERTURA",
        "direccion": "Ingreso",
        "tipo": "Fondo inicial",
        "turnoId": null,
        "id": "7e1b2a7a-dfc3-430a-a211-a561b10a4427",
        "numero": "TES-00001",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.640Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Fondo inicial de Banco principal"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "referencia": "PAGO-DEMO-1",
        "cuenta": "banco",
        "importe": 628350,
        "documentoId": "40d23c80-7c10-45a7-8cf7-82b66d3d993f",
        "pagoId": "22d19d25-40b0-49b2-88a7-8f9700d65224",
        "direccion": "Egreso",
        "tipo": "Pago",
        "turnoId": null,
        "id": "4d8c987f-6cde-4a54-8549-642e24985a0e",
        "numero": "TES-00002",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.655Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago de F901-000001"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "referencia": "PAGO-DEMO-2",
        "cuenta": "banco",
        "importe": 449580,
        "documentoId": "be9c99e9-c428-4d4b-b87d-eeb6d8bba482",
        "pagoId": "7c53f599-7965-48f1-96bd-d26df5065c9b",
        "direccion": "Egreso",
        "tipo": "Pago",
        "turnoId": null,
        "id": "a17a0dec-9f7a-4e5c-ab29-ebcb1738f238",
        "numero": "TES-00003",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.669Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Pago de F901-000002"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 379488,
        "referencia": "COBRO-DEMO-1",
        "documentoId": "dfbcbf54-1335-4445-8c8f-43bc77cd5573",
        "direccion": "Ingreso",
        "tipo": "Cobro",
        "turnoId": null,
        "id": "c67d0d7e-1b62-45d6-b380-d82479de999b",
        "numero": "TES-00004",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.706Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro de BOL-INT-000001"
          },
          {
            "fecha": "2026-11-25T18:18:09.707Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Conciliado con EXT-00001"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 106374,
        "referencia": "COBRO-DEMO-2",
        "documentoId": "dc6b8520-3fa5-40b9-af44-6e4c27522090",
        "direccion": "Ingreso",
        "tipo": "Cobro",
        "turnoId": null,
        "id": "59ed5a91-18a7-4232-b332-6bf2df62ce44",
        "numero": "TES-00005",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.721Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro de FAC-INT-000001"
          },
          {
            "fecha": "2026-11-25T18:18:09.722Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Conciliado con EXT-00002"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 141775,
        "referencia": "COBRO-DEMO-3",
        "documentoId": "9176d10d-0752-4798-819b-fe62f26453d1",
        "direccion": "Ingreso",
        "tipo": "Cobro",
        "turnoId": null,
        "id": "ea57713b-cb91-4308-a0ac-25517c841175",
        "numero": "TES-00006",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.737Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro de BOL-INT-000002"
          },
          {
            "fecha": "2026-11-25T18:18:09.740Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Conciliado con EXT-00003"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 41864,
        "referencia": "COBRO-DEMO-4",
        "documentoId": "6c7c03bb-93e6-44e0-948c-d1572e955948",
        "direccion": "Ingreso",
        "tipo": "Cobro",
        "turnoId": null,
        "id": "84ad15d9-7855-4c97-949d-bfaba9ebfe7b",
        "numero": "TES-00007",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.787Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro de FAC-INT-000002"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "cuenta": "banco",
        "importe": 57688,
        "referencia": "COBRO-DEMO-5",
        "documentoId": "410d26dd-ed02-4678-ad20-1ded0613e386",
        "direccion": "Ingreso",
        "tipo": "Cobro",
        "turnoId": null,
        "id": "a5645ad5-e92e-46e6-8f7a-b31ac90badde",
        "numero": "TES-00008",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.808Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cobro de BOL-INT-000003"
          }
        ]
      }
    ],
    "turnos": [
      {
        "fecha": "2026-11-25",
        "inicial": 0,
        "estado": "Cerrado",
        "id": "71621fe9-8760-4808-b0e4-5841d521d3f2",
        "numero": "CAJ-00001",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.902Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Turno de caja abierto"
          },
          {
            "fecha": "2026-11-25T18:18:09.903Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuadre de caja registrado"
          }
        ],
        "esperado": 0,
        "contado": 0,
        "diferencia": 0,
        "motivo": ""
      },
      {
        "fecha": "2026-11-25",
        "inicial": 0,
        "estado": "Cerrado",
        "id": "91f864e5-e7e3-4a94-84bb-770a4c88afd1",
        "numero": "CAJ-00002",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.903Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Turno de caja abierto"
          },
          {
            "fecha": "2026-11-25T18:18:09.903Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuadre de caja registrado"
          }
        ],
        "esperado": 0,
        "contado": 0,
        "diferencia": 0,
        "motivo": ""
      },
      {
        "fecha": "2026-11-25",
        "inicial": 0,
        "estado": "Cerrado",
        "id": "35131474-ad22-4a37-a63d-d7616891004f",
        "numero": "CAJ-00003",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.904Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Turno de caja abierto"
          },
          {
            "fecha": "2026-11-25T18:18:09.904Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuadre de caja registrado"
          }
        ],
        "esperado": 0,
        "contado": 0,
        "diferencia": 0,
        "motivo": ""
      },
      {
        "fecha": "2026-11-25",
        "inicial": 0,
        "estado": "Cerrado",
        "id": "6f8929d4-c64d-4632-a1ec-e9162837cebd",
        "numero": "CAJ-00004",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.904Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Turno de caja abierto"
          },
          {
            "fecha": "2026-11-25T18:18:09.904Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Cuadre de caja registrado"
          }
        ],
        "esperado": 0,
        "contado": 0,
        "diferencia": 0,
        "motivo": ""
      },
      {
        "fecha": "2026-11-25",
        "inicial": 0,
        "estado": "Abierto",
        "id": "86f46a8c-8e6b-4d27-8274-33ceb9d99090",
        "numero": "CAJ-00005",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.905Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Turno de caja abierto"
          }
        ]
      }
    ],
    "extractos": [
      {
        "fecha": "2026-11-25",
        "direccion": "Ingreso",
        "importe": 379488,
        "referencia": "COBRO-DEMO-1",
        "movimientoId": "c67d0d7e-1b62-45d6-b380-d82479de999b",
        "id": "dc428917-fca3-48ed-a50b-241b44879bdf",
        "numero": "EXT-00001",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.707Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Partida de extracto registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.707Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Conciliada con TES-00004"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "direccion": "Ingreso",
        "importe": 106374,
        "referencia": "COBRO-DEMO-2",
        "movimientoId": "59ed5a91-18a7-4232-b332-6bf2df62ce44",
        "id": "b550490a-7c7a-4848-aa80-8d26569e0362",
        "numero": "EXT-00002",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.722Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Partida de extracto registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.722Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Conciliada con TES-00005"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "direccion": "Ingreso",
        "importe": 141775,
        "referencia": "COBRO-DEMO-3",
        "movimientoId": "ea57713b-cb91-4308-a0ac-25517c841175",
        "id": "9f513806-ba3a-4ea6-80a3-6d658bfc58e5",
        "numero": "EXT-00003",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.739Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Partida de extracto registrada"
          },
          {
            "fecha": "2026-11-25T18:18:09.740Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Conciliada con TES-00006"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "direccion": "Ingreso",
        "importe": 41864,
        "referencia": "COBRO-DEMO-4",
        "movimientoId": null,
        "id": "94c6154c-e0e0-4fba-81b9-d0ad603532fb",
        "numero": "EXT-00004",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.788Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Partida de extracto registrada"
          }
        ]
      },
      {
        "fecha": "2026-11-25",
        "direccion": "Ingreso",
        "importe": 57688,
        "referencia": "COBRO-DEMO-5",
        "movimientoId": null,
        "id": "9e2eac9e-eee1-45fc-a842-0f62ac830499",
        "numero": "EXT-00005",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.809Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Partida de extracto registrada"
          }
        ]
      }
    ],
    "asientos": [
      {
        "origen": {
          "clave": "inventario-inicial",
          "numero": "Saldo inicial de Logística",
          "ruta": "logistica/inventario"
        },
        "fecha": "2026-10-31",
        "concepto": "Apertura de inventario",
        "lineas": [
          {
            "cuenta": "20",
            "debe": 19588500,
            "haber": 0
          },
          {
            "cuenta": "59",
            "debe": 0,
            "haber": 19588500
          }
        ],
        "estado": "Contabilizado",
        "id": "6c409b27-3ec7-42a1-a450-52e323638a2a",
        "numero": "ASI-00001",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.632Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.905Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "inventario-inicial",
          "numero": "Saldo inicial de Logística",
          "ruta": "logistica/inventario"
        },
        "fecha": "2026-10-31",
        "concepto": "Apertura de inventario",
        "lineas": [
          {
            "cuenta": "20",
            "debe": 3612500,
            "haber": 0
          },
          {
            "cuenta": "59",
            "debe": 0,
            "haber": 3612500
          }
        ],
        "estado": "Contabilizado",
        "id": "9e5f0282-86c5-4bc7-b0db-dd1f25d6ad4d",
        "numero": "ASI-00002",
        "sede": "olivos",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.638Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.906Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "inventario-inicial",
          "numero": "Saldo inicial de Logística",
          "ruta": "logistica/inventario"
        },
        "fecha": "2026-10-31",
        "concepto": "Apertura de inventario",
        "lineas": [
          {
            "cuenta": "20",
            "debe": 3612500,
            "haber": 0
          },
          {
            "cuenta": "59",
            "debe": 0,
            "haber": 3612500
          }
        ],
        "estado": "Contabilizado",
        "id": "c8c34409-e89f-4068-aab5-a9e791816be8",
        "numero": "ASI-00003",
        "sede": "surco",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.639Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.906Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "movimiento:7e1b2a7a-dfc3-430a-a211-a561b10a4427",
          "ruta": "finanzas/caja",
          "numero": "TES-00001"
        },
        "fecha": "2026-10-31",
        "concepto": "Fondo inicial de Banco principal",
        "lineas": [
          {
            "cuenta": "104",
            "debe": 8000000,
            "haber": 0
          },
          {
            "cuenta": "50",
            "debe": 0,
            "haber": 8000000
          }
        ],
        "estado": "Contabilizado",
        "id": "f2cf4ad1-1096-48c0-8734-bcc3ffa387a6",
        "numero": "ASI-00004",
        "sede": "centro",
        "registradoPor": "Andrés · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.641Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.907Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:40d23c80-7c10-45a7-8cf7-82b66d3d993f",
          "ruta": "finanzas/pagar/40d23c80-7c10-45a7-8cf7-82b66d3d993f",
          "numero": "F901-000001"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "20",
            "debe": 532500,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 95850,
            "haber": 0
          },
          {
            "cuenta": "42",
            "debe": 0,
            "haber": 628350
          }
        ],
        "estado": "Contabilizado",
        "id": "83cfbf85-dc93-453c-8e9f-35c2f3c6f266",
        "numero": "ASI-00005",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.654Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.907Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "movimiento:4d8c987f-6cde-4a54-8549-642e24985a0e",
          "ruta": "finanzas/pagar/40d23c80-7c10-45a7-8cf7-82b66d3d993f",
          "numero": "TES-00002"
        },
        "fecha": "2026-11-25",
        "concepto": "Pago de F901-000001",
        "lineas": [
          {
            "cuenta": "42",
            "debe": 628350,
            "haber": 0
          },
          {
            "cuenta": "104",
            "debe": 0,
            "haber": 628350
          }
        ],
        "estado": "Contabilizado",
        "id": "426a21d8-6a32-4a01-9ab6-ae4457c72d92",
        "numero": "ASI-00006",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.656Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.907Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:be9c99e9-c428-4d4b-b87d-eeb6d8bba482",
          "ruta": "finanzas/pagar/be9c99e9-c428-4d4b-b87d-eeb6d8bba482",
          "numero": "F901-000002"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "20",
            "debe": 762000,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 137160,
            "haber": 0
          },
          {
            "cuenta": "42",
            "debe": 0,
            "haber": 899160
          }
        ],
        "estado": "Contabilizado",
        "id": "87361faf-5f22-43d9-b8e9-20018547ed3b",
        "numero": "ASI-00007",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.668Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.908Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "movimiento:a17a0dec-9f7a-4e5c-ab29-ebcb1738f238",
          "ruta": "finanzas/pagar/be9c99e9-c428-4d4b-b87d-eeb6d8bba482",
          "numero": "TES-00003"
        },
        "fecha": "2026-11-25",
        "concepto": "Pago de F901-000002",
        "lineas": [
          {
            "cuenta": "42",
            "debe": 449580,
            "haber": 0
          },
          {
            "cuenta": "104",
            "debe": 0,
            "haber": 449580
          }
        ],
        "estado": "Contabilizado",
        "id": "4959ba89-b831-420e-9992-18733b74c5ff",
        "numero": "ASI-00008",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.669Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.908Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:47c8f3f5-7704-4195-9e30-ea8b71495f28",
          "ruta": "finanzas/pagar/47c8f3f5-7704-4195-9e30-ea8b71495f28",
          "numero": "F901-000003"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "20",
            "debe": 563500,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 101430,
            "haber": 0
          },
          {
            "cuenta": "42",
            "debe": 0,
            "haber": 664930
          }
        ],
        "estado": "Contabilizado",
        "id": "dc88d49a-0c7a-4ba8-8901-f8176a7ec1ed",
        "numero": "ASI-00009",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.676Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.908Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:5943fd50-634a-422b-b8df-a1ff402b007c",
          "ruta": "finanzas/pagar/5943fd50-634a-422b-b8df-a1ff402b007c",
          "numero": "F901-000004"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "20",
            "debe": 192000,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 34560,
            "haber": 0
          },
          {
            "cuenta": "42",
            "debe": 0,
            "haber": 226560
          }
        ],
        "estado": "Contabilizado",
        "id": "d73302cc-c184-484e-97ec-49c86c7d4a6e",
        "numero": "ASI-00010",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.683Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.909Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:9bc7e237-2ee6-45e5-ace3-1f9963042d57",
          "ruta": "finanzas/pagar/9bc7e237-2ee6-45e5-ace3-1f9963042d57",
          "numero": "F901-000005"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "20",
            "debe": 288000,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 51840,
            "haber": 0
          },
          {
            "cuenta": "42",
            "debe": 0,
            "haber": 339840
          }
        ],
        "estado": "Contabilizado",
        "id": "2e9bb8c1-8525-46b4-b5c8-a044a1392119",
        "numero": "ASI-00011",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.687Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.909Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:dfbcbf54-1335-4445-8c8f-43bc77cd5573",
          "ruta": "finanzas/cobrar/dfbcbf54-1335-4445-8c8f-43bc77cd5573",
          "numero": "BOL-INT-000001"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de venta",
        "lineas": [
          {
            "cuenta": "12",
            "debe": 379488,
            "haber": 0
          },
          {
            "cuenta": "70",
            "debe": 0,
            "haber": 321600
          },
          {
            "cuenta": "4011",
            "debe": 0,
            "haber": 57888
          },
          {
            "cuenta": "69",
            "debe": 211204,
            "haber": 0
          },
          {
            "cuenta": "20",
            "debe": 0,
            "haber": 211204
          }
        ],
        "estado": "Contabilizado",
        "id": "48562e7d-dd8d-4885-8b96-8e82ddd2b35b",
        "numero": "ASI-00012",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.705Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.909Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "movimiento:c67d0d7e-1b62-45d6-b380-d82479de999b",
          "ruta": "finanzas/cobrar/dfbcbf54-1335-4445-8c8f-43bc77cd5573",
          "numero": "TES-00004"
        },
        "fecha": "2026-11-25",
        "concepto": "Cobro de BOL-INT-000001",
        "lineas": [
          {
            "cuenta": "104",
            "debe": 379488,
            "haber": 0
          },
          {
            "cuenta": "12",
            "debe": 0,
            "haber": 379488
          }
        ],
        "estado": "Contabilizado",
        "id": "47b05dec-59d6-40e8-a130-8b47d9768b94",
        "numero": "ASI-00013",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.707Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.910Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:dc6b8520-3fa5-40b9-af44-6e4c27522090",
          "ruta": "finanzas/cobrar/dc6b8520-3fa5-40b9-af44-6e4c27522090",
          "numero": "FAC-INT-000001"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de venta",
        "lineas": [
          {
            "cuenta": "12",
            "debe": 212747,
            "haber": 0
          },
          {
            "cuenta": "70",
            "debe": 0,
            "haber": 180294
          },
          {
            "cuenta": "4011",
            "debe": 0,
            "haber": 32453
          },
          {
            "cuenta": "69",
            "debe": 126109,
            "haber": 0
          },
          {
            "cuenta": "20",
            "debe": 0,
            "haber": 126109
          }
        ],
        "estado": "Contabilizado",
        "id": "5b13368c-9634-4791-be39-353479e5d0d1",
        "numero": "ASI-00014",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.721Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.910Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "movimiento:59ed5a91-18a7-4232-b332-6bf2df62ce44",
          "ruta": "finanzas/cobrar/dc6b8520-3fa5-40b9-af44-6e4c27522090",
          "numero": "TES-00005"
        },
        "fecha": "2026-11-25",
        "concepto": "Cobro de FAC-INT-000001",
        "lineas": [
          {
            "cuenta": "104",
            "debe": 106374,
            "haber": 0
          },
          {
            "cuenta": "12",
            "debe": 0,
            "haber": 106374
          }
        ],
        "estado": "Contabilizado",
        "id": "fa07f7f8-89b3-496d-88e2-fbc9276ef126",
        "numero": "ASI-00015",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.721Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.910Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:9176d10d-0752-4798-819b-fe62f26453d1",
          "ruta": "finanzas/cobrar/9176d10d-0752-4798-819b-fe62f26453d1",
          "numero": "BOL-INT-000002"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de venta",
        "lineas": [
          {
            "cuenta": "12",
            "debe": 141775,
            "haber": 0
          },
          {
            "cuenta": "70",
            "debe": 0,
            "haber": 120148
          },
          {
            "cuenta": "4011",
            "debe": 0,
            "haber": 21627
          },
          {
            "cuenta": "69",
            "debe": 79615,
            "haber": 0
          },
          {
            "cuenta": "20",
            "debe": 0,
            "haber": 79615
          }
        ],
        "estado": "Contabilizado",
        "id": "33aca74c-5b6f-4f84-bf1f-45798d5c29d5",
        "numero": "ASI-00016",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.736Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.910Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "movimiento:ea57713b-cb91-4308-a0ac-25517c841175",
          "ruta": "finanzas/cobrar/9176d10d-0752-4798-819b-fe62f26453d1",
          "numero": "TES-00006"
        },
        "fecha": "2026-11-25",
        "concepto": "Cobro de BOL-INT-000002",
        "lineas": [
          {
            "cuenta": "104",
            "debe": 141775,
            "haber": 0
          },
          {
            "cuenta": "12",
            "debe": 0,
            "haber": 141775
          }
        ],
        "estado": "Contabilizado",
        "id": "42a0d536-1bd5-4b7b-b333-ab8d793875cc",
        "numero": "ASI-00017",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.738Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.911Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:6c7c03bb-93e6-44e0-948c-d1572e955948",
          "ruta": "finanzas/cobrar/6c7c03bb-93e6-44e0-948c-d1572e955948",
          "numero": "FAC-INT-000002"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de venta",
        "lineas": [
          {
            "cuenta": "12",
            "debe": 83727,
            "haber": 0
          },
          {
            "cuenta": "70",
            "debe": 0,
            "haber": 70955
          },
          {
            "cuenta": "4011",
            "debe": 0,
            "haber": 12772
          },
          {
            "cuenta": "69",
            "debe": 46238,
            "haber": 0
          },
          {
            "cuenta": "20",
            "debe": 0,
            "haber": 46238
          }
        ],
        "estado": "Contabilizado",
        "id": "9b2c9a0d-f06d-44d1-8aad-d0bceb935732",
        "numero": "ASI-00018",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.786Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.911Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "movimiento:84ad15d9-7855-4c97-949d-bfaba9ebfe7b",
          "ruta": "finanzas/cobrar/6c7c03bb-93e6-44e0-948c-d1572e955948",
          "numero": "TES-00007"
        },
        "fecha": "2026-11-25",
        "concepto": "Cobro de FAC-INT-000002",
        "lineas": [
          {
            "cuenta": "104",
            "debe": 41864,
            "haber": 0
          },
          {
            "cuenta": "12",
            "debe": 0,
            "haber": 41864
          }
        ],
        "estado": "Contabilizado",
        "id": "d521eb93-be66-48f9-a63d-64a1cde4709a",
        "numero": "ASI-00019",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.788Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.912Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:410d26dd-ed02-4678-ad20-1ded0613e386",
          "ruta": "finanzas/cobrar/410d26dd-ed02-4678-ad20-1ded0613e386",
          "numero": "BOL-INT-000003"
        },
        "fecha": "2026-11-25",
        "concepto": "Registro de venta",
        "lineas": [
          {
            "cuenta": "12",
            "debe": 57688,
            "haber": 0
          },
          {
            "cuenta": "70",
            "debe": 0,
            "haber": 48888
          },
          {
            "cuenta": "4011",
            "debe": 0,
            "haber": 8800
          },
          {
            "cuenta": "69",
            "debe": 31123,
            "haber": 0
          },
          {
            "cuenta": "20",
            "debe": 0,
            "haber": 31123
          }
        ],
        "estado": "Contabilizado",
        "id": "6ecb2827-d914-478c-839e-cac961608fc7",
        "numero": "ASI-00020",
        "sede": "centro",
        "registradoPor": "Diego · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.808Z",
            "usuario": "Diego · Demo",
            "rol": "Facturación",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.912Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "movimiento:a5645ad5-e92e-46e6-8f7a-b31ac90badde",
          "ruta": "finanzas/cobrar/410d26dd-ed02-4678-ad20-1ded0613e386",
          "numero": "TES-00008"
        },
        "fecha": "2026-11-25",
        "concepto": "Cobro de BOL-INT-000003",
        "lineas": [
          {
            "cuenta": "104",
            "debe": 57688,
            "haber": 0
          },
          {
            "cuenta": "12",
            "debe": 0,
            "haber": 57688
          }
        ],
        "estado": "Contabilizado",
        "id": "54f4d7a4-14bc-40bd-96d9-4145fa8ce776",
        "numero": "ASI-00021",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.808Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.912Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:037a0c74-b50a-4f6a-a872-9d4e21b208be",
          "ruta": "finanzas/pagar/037a0c74-b50a-4f6a-a872-9d4e21b208be",
          "numero": "FA90-101"
        },
        "fecha": "2026-10-31",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "33",
            "debe": 125000,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 22500,
            "haber": 0
          },
          {
            "cuenta": "46",
            "debe": 0,
            "haber": 147500
          }
        ],
        "estado": "Contabilizado",
        "id": "f0992f02-3b7d-4f5c-a5dc-39e57d0c6080",
        "numero": "ASI-00022",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.871Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.912Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:ccd738fd-7aec-4b16-8547-a1a34f71ea96",
          "ruta": "finanzas/pagar/ccd738fd-7aec-4b16-8547-a1a34f71ea96",
          "numero": "FA90-102"
        },
        "fecha": "2026-10-31",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "33",
            "debe": 147500,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 26550,
            "haber": 0
          },
          {
            "cuenta": "46",
            "debe": 0,
            "haber": 174050
          }
        ],
        "estado": "Contabilizado",
        "id": "a3fab65b-f0bd-455a-acd4-f105133c8bd5",
        "numero": "ASI-00023",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.879Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.912Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:cd00857f-ad2b-4b0a-be35-95e0c0d1b468",
          "ruta": "finanzas/pagar/cd00857f-ad2b-4b0a-be35-95e0c0d1b468",
          "numero": "FA90-103"
        },
        "fecha": "2026-10-31",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "33",
            "debe": 170000,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 30600,
            "haber": 0
          },
          {
            "cuenta": "46",
            "debe": 0,
            "haber": 200600
          }
        ],
        "estado": "Contabilizado",
        "id": "4bf8087b-0dfd-4414-971a-2eefdba239ba",
        "numero": "ASI-00024",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.886Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.913Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:ac6f4f99-d51d-4910-9735-5ba9da5f39eb",
          "ruta": "finanzas/pagar/ac6f4f99-d51d-4910-9735-5ba9da5f39eb",
          "numero": "FA90-104"
        },
        "fecha": "2026-10-31",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "33",
            "debe": 192500,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 34650,
            "haber": 0
          },
          {
            "cuenta": "46",
            "debe": 0,
            "haber": 227150
          }
        ],
        "estado": "Contabilizado",
        "id": "b5692b6c-a83d-4559-ac3a-9528c63eeed6",
        "numero": "ASI-00025",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.892Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.913Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      },
      {
        "origen": {
          "clave": "documento:c297a9fd-bbd6-471a-b870-31830b2ae684",
          "ruta": "finanzas/pagar/c297a9fd-bbd6-471a-b870-31830b2ae684",
          "numero": "FA90-105"
        },
        "fecha": "2026-10-31",
        "concepto": "Registro de compra",
        "lineas": [
          {
            "cuenta": "33",
            "debe": 215000,
            "haber": 0
          },
          {
            "cuenta": "4011",
            "debe": 38700,
            "haber": 0
          },
          {
            "cuenta": "46",
            "debe": 0,
            "haber": 253700
          }
        ],
        "estado": "Contabilizado",
        "id": "b82abfc2-8fac-4ae1-b0a4-ae0e3efb07d8",
        "numero": "ASI-00026",
        "sede": "centro",
        "registradoPor": "Paula · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.901Z",
            "usuario": "Paula · Demo",
            "rol": "Tesorería",
            "accion": "Asiento generado desde la operación"
          },
          {
            "fecha": "2026-11-25T18:18:09.913Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Asiento contabilizado"
          }
        ]
      }
    ],
    "activos": [
      {
        "documentoId": "037a0c74-b50a-4f6a-a872-9d4e21b208be",
        "codigo": "DEMO-AF-101",
        "descripcion": "Computadora para caja",
        "costo": 125000,
        "vida": 36,
        "residual": 0,
        "ubicacion": "Tienda",
        "responsable": "Mario · Demo",
        "fechaCompra": "2026-10-31",
        "enUso": "2026-11-01",
        "depreciaciones": [],
        "id": "9b6fdb30-fcce-4e18-bb28-5af635d140e3",
        "numero": "AF-00001",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.871Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Alta desde la compra FA90-101"
          },
          {
            "fecha": "2026-11-25T18:18:09.872Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Puesta en uso el 2026-11-01"
          }
        ]
      },
      {
        "documentoId": "ccd738fd-7aec-4b16-8547-a1a34f71ea96",
        "codigo": "DEMO-AF-102",
        "descripcion": "Impresora de etiquetas",
        "costo": 147500,
        "vida": 42,
        "residual": 1500,
        "ubicacion": "Recepción",
        "responsable": "Mario · Demo",
        "fechaCompra": "2026-10-31",
        "enUso": "2026-11-01",
        "depreciaciones": [],
        "id": "05c2bcf5-2a79-4969-bd46-b9c7b7e5fab7",
        "numero": "AF-00002",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.880Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Alta desde la compra FA90-102"
          },
          {
            "fecha": "2026-11-25T18:18:09.880Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Puesta en uso el 2026-11-01"
          }
        ]
      },
      {
        "documentoId": "cd00857f-ad2b-4b0a-be35-95e0c0d1b468",
        "codigo": "DEMO-AF-103",
        "descripcion": "Lector de códigos",
        "costo": 170000,
        "vida": 48,
        "residual": 3000,
        "ubicacion": "Compras",
        "responsable": "Mario · Demo",
        "fechaCompra": "2026-10-31",
        "enUso": "2026-11-01",
        "depreciaciones": [],
        "id": "2574bc66-ebfd-4b8d-ad1a-fb9d782e15af",
        "numero": "AF-00003",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.886Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Alta desde la compra FA90-103"
          },
          {
            "fecha": "2026-11-25T18:18:09.886Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Puesta en uso el 2026-11-01"
          }
        ]
      },
      {
        "documentoId": "ac6f4f99-d51d-4910-9735-5ba9da5f39eb",
        "codigo": "DEMO-AF-104",
        "descripcion": "Carro de transporte",
        "costo": 192500,
        "vida": 54,
        "residual": 4500,
        "ubicacion": "Almacén",
        "responsable": "Mario · Demo",
        "fechaCompra": "2026-10-31",
        "enUso": "2026-11-01",
        "depreciaciones": [],
        "id": "95a5f27f-077f-45f9-bfb7-2a633f8e3e45",
        "numero": "AF-00004",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.892Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Alta desde la compra FA90-104"
          },
          {
            "fecha": "2026-11-25T18:18:09.893Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Puesta en uso el 2026-11-01"
          }
        ]
      },
      {
        "documentoId": "c297a9fd-bbd6-471a-b870-31830b2ae684",
        "codigo": "DEMO-AF-105",
        "descripcion": "Equipo fotográfico",
        "costo": 215000,
        "vida": 60,
        "residual": 6000,
        "ubicacion": "Exhibición",
        "responsable": "Mario · Demo",
        "fechaCompra": "2026-10-31",
        "enUso": null,
        "depreciaciones": [],
        "id": "9b88283b-d610-4d1a-ab40-44c8c9eae63b",
        "numero": "AF-00005",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.901Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Alta desde la compra FA90-105"
          }
        ]
      }
    ],
    "cierres": [
      {
        "mes": "2026-10",
        "motivo": "Período de demostración revisado",
        "id": "cbfb2cd4-3e83-4243-a9b5-007abf6bf699",
        "numero": "CIE-00001",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.914Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Período cerrado"
          }
        ]
      },
      {
        "mes": "2026-09",
        "motivo": "Período de demostración revisado",
        "id": "d5e0021e-7f37-43ad-be40-7af9884c2379",
        "numero": "CIE-00002",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.916Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Período cerrado"
          }
        ]
      },
      {
        "mes": "2026-08",
        "motivo": "Período de demostración revisado",
        "id": "586d7a2c-e7f3-47e7-adf9-a8261ec19668",
        "numero": "CIE-00003",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.917Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Período cerrado"
          }
        ]
      },
      {
        "mes": "2026-07",
        "motivo": "Período de demostración revisado",
        "id": "52386eca-369b-425c-8ebe-44230d7cc1e1",
        "numero": "CIE-00004",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.918Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Período cerrado"
          }
        ]
      },
      {
        "mes": "2026-06",
        "motivo": "Período de demostración revisado",
        "id": "fd70b465-f100-4f85-89c1-dd53dc0f7ca0",
        "numero": "CIE-00005",
        "sede": "centro",
        "registradoPor": "Nora · Demo",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.919Z",
            "usuario": "Nora · Demo",
            "rol": "Contabilidad",
            "accion": "Período cerrado"
          }
        ]
      }
    ]
  },
  "famihogar.comercial.v1": {
    "version": 2,
    "clientes": [
      {
        "nombre": "Isabel Paredes",
        "tipoDocumento": "DNI",
        "documento": "79900001",
        "direccion": "Calle Demostración 110, Lima",
        "direccionFiscal": "Calle Demostración 110, Lima",
        "direccionCobranza": "Calle Demostración 110, Lima",
        "zona": "Lima Metropolitana",
        "correo": "cliente1@example.com",
        "telefono": "900990001",
        "segmento": "Retail",
        "condicionPreferida": "Contado",
        "id": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.641Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          },
          {
            "fecha": "2026-11-25T18:18:09.642Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Maestro aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "nombre": "Estudio Cerezo SAC",
        "tipoDocumento": "RUC",
        "documento": "20990000002",
        "direccion": "Calle Demostración 121, Lima",
        "direccionFiscal": "Calle Demostración 121, Lima",
        "direccionCobranza": "Calle Demostración 121, Lima",
        "zona": "Lima Metropolitana",
        "correo": "cliente2@example.com",
        "telefono": "900990002",
        "segmento": "Empresa",
        "condicionPreferida": "Crédito 30 días",
        "id": "b7dbd832-7870-4a80-b762-12d683086b7e",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.642Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          },
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Maestro aprobado: Operación de demostración validada"
          }
        ]
      },
      {
        "nombre": "Mateo Aguirre",
        "tipoDocumento": "DNI",
        "documento": "79900003",
        "direccion": "Calle Demostración 132, Lima",
        "direccionFiscal": "Calle Demostración 132, Lima",
        "direccionCobranza": "Calle Demostración 132, Lima",
        "zona": "Lima",
        "correo": "cliente3@example.com",
        "telefono": "900990003",
        "segmento": "Retail",
        "condicionPreferida": "Contado",
        "id": "519d4919-df96-452b-97b8-becd5f34d2ff",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Taller Horizonte SAC",
        "tipoDocumento": "RUC",
        "documento": "20990000004",
        "direccion": "Calle Demostración 143, Lima",
        "direccionFiscal": "Calle Demostración 143, Lima",
        "direccionCobranza": "Calle Demostración 143, Lima",
        "zona": "Lima",
        "correo": "cliente4@example.com",
        "telefono": "900990004",
        "segmento": "Empresa",
        "condicionPreferida": "Crédito 30 días",
        "id": "7c81a1f4-49cd-4675-881c-b62e53faa813",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Luciana Valdés",
        "tipoDocumento": "DNI",
        "documento": "79900005",
        "direccion": "Calle Demostración 154, Lima",
        "direccionFiscal": "Calle Demostración 154, Lima",
        "direccionCobranza": "Calle Demostración 154, Lima",
        "zona": "Lima",
        "correo": "cliente5@example.com",
        "telefono": "900990005",
        "segmento": "Retail",
        "condicionPreferida": "Contado",
        "id": "0fea5fff-01b6-4923-b1c1-2ede35801016",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Casa Avellana SAC",
        "tipoDocumento": "RUC",
        "documento": "20990000006",
        "direccion": "Calle Demostración 165, Lima",
        "direccionFiscal": "Calle Demostración 165, Lima",
        "direccionCobranza": "Calle Demostración 165, Lima",
        "zona": "Lima",
        "correo": "cliente6@example.com",
        "telefono": "900990006",
        "segmento": "Empresa",
        "condicionPreferida": "Crédito 30 días",
        "id": "8efc391c-7d16-4685-ae07-5774e6c01929",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Renzo Vidal",
        "tipoDocumento": "DNI",
        "documento": "79900007",
        "direccion": "Calle Demostración 176, Lima",
        "direccionFiscal": "Calle Demostración 176, Lima",
        "direccionCobranza": "Calle Demostración 176, Lima",
        "zona": "Lima",
        "correo": "cliente7@example.com",
        "telefono": "900990007",
        "segmento": "Retail",
        "condicionPreferida": "Contado",
        "id": "01e136ea-510a-4f76-a05a-94a959eecbd4",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Oficinas Arrayán SAC",
        "tipoDocumento": "RUC",
        "documento": "20990000008",
        "direccion": "Calle Demostración 187, Lima",
        "direccionFiscal": "Calle Demostración 187, Lima",
        "direccionCobranza": "Calle Demostración 187, Lima",
        "zona": "Lima",
        "correo": "cliente8@example.com",
        "telefono": "900990008",
        "segmento": "Empresa",
        "condicionPreferida": "Crédito 30 días",
        "id": "83cbd785-3102-479c-8996-5ea022530135",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Daniela Salas",
        "tipoDocumento": "DNI",
        "documento": "79900009",
        "direccion": "Calle Demostración 198, Lima",
        "direccionFiscal": "Calle Demostración 198, Lima",
        "direccionCobranza": "Calle Demostración 198, Lima",
        "zona": "Lima",
        "correo": "cliente9@example.com",
        "telefono": "900990009",
        "segmento": "Retail",
        "condicionPreferida": "Contado",
        "id": "50206f32-964f-48e4-929a-d2b7136d9f06",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Galería Sauco SAC",
        "tipoDocumento": "RUC",
        "documento": "20990000010",
        "direccion": "Calle Demostración 209, Lima",
        "direccionFiscal": "Calle Demostración 209, Lima",
        "direccionCobranza": "Calle Demostración 209, Lima",
        "zona": "Lima",
        "correo": "cliente10@example.com",
        "telefono": "900990010",
        "segmento": "Empresa",
        "condicionPreferida": "Crédito 30 días",
        "id": "4376104a-d3bd-4e79-a016-d1e4ab35ff7d",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Bruno Navarro",
        "tipoDocumento": "DNI",
        "documento": "79900011",
        "direccion": "Calle Demostración 220, Lima",
        "direccionFiscal": "Calle Demostración 220, Lima",
        "direccionCobranza": "Calle Demostración 220, Lima",
        "zona": "Lima",
        "correo": "cliente11@example.com",
        "telefono": "900990011",
        "segmento": "Retail",
        "condicionPreferida": "Contado",
        "id": "4d1d3f81-2c41-4bbb-b6fe-97d7510b05b3",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Biblioteca Magnolia SAC",
        "tipoDocumento": "RUC",
        "documento": "20990000012",
        "direccion": "Calle Demostración 231, Lima",
        "direccionFiscal": "Calle Demostración 231, Lima",
        "direccionCobranza": "Calle Demostración 231, Lima",
        "zona": "Lima",
        "correo": "cliente12@example.com",
        "telefono": "900990012",
        "segmento": "Empresa",
        "condicionPreferida": "Crédito 30 días",
        "id": "262a006d-c478-4b67-8b19-55df5a2af8b9",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Sofía Montes",
        "tipoDocumento": "DNI",
        "documento": "79900013",
        "direccion": "Calle Demostración 242, Lima",
        "direccionFiscal": "Calle Demostración 242, Lima",
        "direccionCobranza": "Calle Demostración 242, Lima",
        "zona": "Lima",
        "correo": "cliente13@example.com",
        "telefono": "900990013",
        "segmento": "Retail",
        "condicionPreferida": "Contado",
        "id": "3c4ffa3d-1bbb-4e2f-abe1-46cc3f70a27e",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.645Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      },
      {
        "nombre": "Proyecto Olmo SAC",
        "tipoDocumento": "RUC",
        "documento": "20990000014",
        "direccion": "Calle Demostración 253, Lima",
        "direccionFiscal": "Calle Demostración 253, Lima",
        "direccionCobranza": "Calle Demostración 253, Lima",
        "zona": "Lima",
        "correo": "cliente14@example.com",
        "telefono": "900990014",
        "segmento": "Empresa",
        "condicionPreferida": "Crédito 30 días",
        "id": "6b2bd27d-61c0-492d-888e-2047ef89184f",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.645Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Cliente registrado"
          }
        ]
      }
    ],
    "oportunidades": [
      {
        "id": "f702075c-4c1c-4c76-bfad-f40d275346b1",
        "numero": "OP-00001",
        "clienteId": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
        "asunto": "Equipar sala familiar",
        "canal": "Tienda",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 2
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.690Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "d13d5dc2-6ce0-4155-aa92-336a9d688219",
        "numero": "OP-00002",
        "clienteId": "b7dbd832-7870-4a80-b762-12d683086b7e",
        "asunto": "Renovar oficina de atención",
        "canal": "Web",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.710Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "2b9b2423-83a9-422a-8ac4-efe6f9ef622f",
        "numero": "OP-00003",
        "clienteId": "519d4919-df96-452b-97b8-becd5f34d2ff",
        "asunto": "Amoblar dormitorio",
        "canal": "Teléfono",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "dd471d39-8237-4ff1-8c51-3ce27017d62f",
        "numero": "OP-00004",
        "clienteId": "7c81a1f4-49cd-4675-881c-b62e53faa813",
        "asunto": "Proyecto de tienda",
        "canal": "Tienda",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 2
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.746Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "f973a9c3-b3fd-427a-aad3-0f4c9d36a455",
        "numero": "OP-00005",
        "clienteId": "0fea5fff-01b6-4923-b1c1-2ede35801016",
        "asunto": "Organizar biblioteca",
        "canal": "Web",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.792Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "e54fa8d9-b2e5-4b74-96a4-e70f272098c5",
        "numero": "OP-00006",
        "clienteId": "8efc391c-7d16-4685-ae07-5774e6c01929",
        "asunto": "Equipar sala de reuniones",
        "canal": "Teléfono",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.812Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "a3a95ca2-d30c-40d7-b0e6-2babe5727d5f",
        "numero": "OP-00007",
        "clienteId": "01e136ea-510a-4f76-a05a-94a959eecbd4",
        "asunto": "Cambiar comedor principal",
        "canal": "Tienda",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 2
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.820Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "73098ad0-3fb8-4fcb-9292-4ba299b80b7e",
        "numero": "OP-00008",
        "clienteId": "83cbd785-3102-479c-8996-5ea022530135",
        "asunto": "Mobiliario para recepción",
        "canal": "Web",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.829Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "52e24450-164d-4e27-90eb-06d92d750015",
        "numero": "OP-00009",
        "clienteId": "50206f32-964f-48e4-929a-d2b7136d9f06",
        "asunto": "Renovar zona de lectura",
        "canal": "Teléfono",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.836Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "fdc040b9-f597-4117-90a9-7530d5e75ded",
        "numero": "OP-00010",
        "clienteId": "4376104a-d3bd-4e79-a016-d1e4ab35ff7d",
        "asunto": "Amoblar estudio creativo",
        "canal": "Tienda",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 2
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.843Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "8bcde970-e638-4825-9c92-521a2f91dcc7",
        "numero": "OP-00011",
        "clienteId": "4d1d3f81-2c41-4bbb-b6fe-97d7510b05b3",
        "asunto": "Entrega de sala en departamento",
        "canal": "Web",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.852Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "d1f3df5e-ac3d-4e74-bb01-c9ce542d7a9d",
        "numero": "OP-00012",
        "clienteId": "262a006d-c478-4b67-8b19-55df5a2af8b9",
        "asunto": "Proyecto de sala de espera",
        "canal": "Teléfono",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "SIL-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.860Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "3cd2ca2f-8426-4a55-b0c3-7d25a80ed893",
        "numero": "OP-00013",
        "clienteId": "3c4ffa3d-1bbb-4e2f-abe1-46cc3f70a27e",
        "asunto": "Propuesta para comedor familiar",
        "canal": "Tienda",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Cotizada",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 2
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.864Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      },
      {
        "id": "41a2910f-4389-47a8-bd91-93d650b565a7",
        "numero": "OP-00014",
        "clienteId": "6b2bd27d-61c0-492d-888e-2047ef89184f",
        "asunto": "Cotizar mobiliario de oficina",
        "canal": "Web",
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "fecha": "2026-11-25",
        "estado": "Nueva",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.864Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Captación de oportunidad simulada"
          }
        ]
      }
    ],
    "cotizaciones": [
      {
        "id": "fd3f6145-b5f1-43b3-989c-962d00efd316",
        "numero": "COT-2026-00001",
        "lineas": [
          {
            "codigo": "SOF-001",
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "coste": 105500,
            "precio": 160800,
            "cantidad": 2,
            "importeBruto": 321600,
            "descuento": 0,
            "importe": 321600
          }
        ],
        "bruto": 321600,
        "descuento": 0,
        "subtotal": 321600,
        "igv": 57888,
        "total": 379488,
        "descuentoBps": 0,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-tienda",
        "listaNombre": "Retail Tienda · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "f702075c-4c1c-4c76-bfad-f40d275346b1",
        "oportunidadNumero": "OP-00001",
        "cliente": {
          "nombre": "Isabel Paredes",
          "tipoDocumento": "DNI",
          "documento": "79900001",
          "direccion": "Calle Demostración 110, Lima",
          "direccionFiscal": "Calle Demostración 110, Lima",
          "direccionCobranza": "Calle Demostración 110, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente1@example.com",
          "telefono": "900990001",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.641Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Tienda",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Sin descuento",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.691Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.691Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.691Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.691Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00001"
          }
        ]
      },
      {
        "id": "b1a7b779-5429-42a2-908e-96af46899f90",
        "numero": "COT-2026-00002",
        "lineas": [
          {
            "codigo": "COM-001",
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "coste": 126000,
            "precio": 182115,
            "cantidad": 1,
            "importeBruto": 182115,
            "descuento": 1821,
            "importe": 180294
          }
        ],
        "bruto": 182115,
        "descuento": 1821,
        "subtotal": 180294,
        "igv": 32453,
        "total": 212747,
        "descuentoBps": 100,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-web",
        "listaNombre": "Empresa Web · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "d13d5dc2-6ce0-4155-aa92-336a9d688219",
        "oportunidadNumero": "OP-00002",
        "cliente": {
          "nombre": "Estudio Cerezo SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000002",
          "direccion": "Calle Demostración 121, Lima",
          "direccionFiscal": "Calle Demostración 121, Lima",
          "direccionCobranza": "Calle Demostración 121, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente2@example.com",
          "telefono": "900990002",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "b7dbd832-7870-4a80-b762-12d683086b7e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Web",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.710Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.710Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.710Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.710Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00002"
          }
        ]
      },
      {
        "id": "97480729-d40b-4ef5-ac8d-7fcf0961ddb7",
        "numero": "COT-2026-00003",
        "lineas": [
          {
            "codigo": "CAM-001",
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "coste": 79500,
            "precio": 122600,
            "cantidad": 1,
            "importeBruto": 122600,
            "descuento": 2452,
            "importe": 120148
          }
        ],
        "bruto": 122600,
        "descuento": 2452,
        "subtotal": 120148,
        "igv": 21627,
        "total": 141775,
        "descuentoBps": 200,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-telefono",
        "listaNombre": "Retail Teléfono · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "2b9b2423-83a9-422a-8ac4-efe6f9ef622f",
        "oportunidadNumero": "OP-00003",
        "cliente": {
          "nombre": "Mateo Aguirre",
          "tipoDocumento": "DNI",
          "documento": "79900003",
          "direccion": "Calle Demostración 132, Lima",
          "direccionFiscal": "Calle Demostración 132, Lima",
          "direccionCobranza": "Calle Demostración 132, Lima",
          "zona": "Lima",
          "correo": "cliente3@example.com",
          "telefono": "900990003",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "519d4919-df96-452b-97b8-becd5f34d2ff",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Teléfono",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00003"
          }
        ]
      },
      {
        "id": "aecbe2af-c9c9-4965-be89-f02189f167f9",
        "numero": "COT-2026-00004",
        "lineas": [
          {
            "codigo": "MES-001",
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "coste": 23000,
            "precio": 36575,
            "cantidad": 2,
            "importeBruto": 73150,
            "descuento": 2195,
            "importe": 70955
          }
        ],
        "bruto": 73150,
        "descuento": 2195,
        "subtotal": 70955,
        "igv": 12772,
        "total": 83727,
        "descuentoBps": 300,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-tienda",
        "listaNombre": "Empresa Tienda · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "dd471d39-8237-4ff1-8c51-3ce27017d62f",
        "oportunidadNumero": "OP-00004",
        "cliente": {
          "nombre": "Taller Horizonte SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000004",
          "direccion": "Calle Demostración 143, Lima",
          "direccionFiscal": "Calle Demostración 143, Lima",
          "direccionCobranza": "Calle Demostración 143, Lima",
          "zona": "Lima",
          "correo": "cliente4@example.com",
          "telefono": "900990004",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "7c81a1f4-49cd-4675-881c-b62e53faa813",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Tienda",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.746Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.746Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.746Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.747Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00004"
          }
        ]
      },
      {
        "id": "5cf49615-e2d9-496e-94df-d97e05d516ba",
        "numero": "COT-2026-00005",
        "lineas": [
          {
            "codigo": "EST-001",
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "coste": 31000,
            "precio": 48888,
            "cantidad": 1,
            "importeBruto": 48888,
            "descuento": 0,
            "importe": 48888
          }
        ],
        "bruto": 48888,
        "descuento": 0,
        "subtotal": 48888,
        "igv": 8800,
        "total": 57688,
        "descuentoBps": 0,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-web",
        "listaNombre": "Retail Web · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "f973a9c3-b3fd-427a-aad3-0f4c9d36a455",
        "oportunidadNumero": "OP-00005",
        "cliente": {
          "nombre": "Luciana Valdés",
          "tipoDocumento": "DNI",
          "documento": "79900005",
          "direccion": "Calle Demostración 154, Lima",
          "direccionFiscal": "Calle Demostración 154, Lima",
          "direccionCobranza": "Calle Demostración 154, Lima",
          "zona": "Lima",
          "correo": "cliente5@example.com",
          "telefono": "900990005",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "0fea5fff-01b6-4923-b1c1-2ede35801016",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Web",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Sin descuento",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.793Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.793Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.793Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.793Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00005"
          }
        ]
      },
      {
        "id": "7c65072a-85ef-4e07-8bc2-ce364ebf4212",
        "numero": "COT-2026-00006",
        "lineas": [
          {
            "codigo": "SIL-001",
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad",
            "coste": 16500,
            "precio": 26885,
            "cantidad": 1,
            "importeBruto": 26885,
            "descuento": 269,
            "importe": 26616
          }
        ],
        "bruto": 26885,
        "descuento": 269,
        "subtotal": 26616,
        "igv": 4791,
        "total": 31407,
        "descuentoBps": 100,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-telefono",
        "listaNombre": "Empresa Teléfono · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "e54fa8d9-b2e5-4b74-96a4-e70f272098c5",
        "oportunidadNumero": "OP-00006",
        "cliente": {
          "nombre": "Casa Avellana SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000006",
          "direccion": "Calle Demostración 165, Lima",
          "direccionFiscal": "Calle Demostración 165, Lima",
          "direccionCobranza": "Calle Demostración 165, Lima",
          "zona": "Lima",
          "correo": "cliente6@example.com",
          "telefono": "900990006",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "8efc391c-7d16-4685-ae07-5774e6c01929",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Teléfono",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.812Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.812Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.812Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.812Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00006"
          }
        ]
      },
      {
        "id": "e961d96f-e334-4735-afab-955a58ca5303",
        "numero": "COT-2026-00007",
        "lineas": [
          {
            "codigo": "SOF-001",
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "coste": 105500,
            "precio": 160800,
            "cantidad": 2,
            "importeBruto": 321600,
            "descuento": 6432,
            "importe": 315168
          }
        ],
        "bruto": 321600,
        "descuento": 6432,
        "subtotal": 315168,
        "igv": 56730,
        "total": 371898,
        "descuentoBps": 200,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-tienda",
        "listaNombre": "Retail Tienda · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "a3a95ca2-d30c-40d7-b0e6-2babe5727d5f",
        "oportunidadNumero": "OP-00007",
        "cliente": {
          "nombre": "Renzo Vidal",
          "tipoDocumento": "DNI",
          "documento": "79900007",
          "direccion": "Calle Demostración 176, Lima",
          "direccionFiscal": "Calle Demostración 176, Lima",
          "direccionCobranza": "Calle Demostración 176, Lima",
          "zona": "Lima",
          "correo": "cliente7@example.com",
          "telefono": "900990007",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "01e136ea-510a-4f76-a05a-94a959eecbd4",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Tienda",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.820Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.820Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.820Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.820Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00007"
          }
        ]
      },
      {
        "id": "b256eeb9-d2de-4346-b03b-f1041ce87460",
        "numero": "COT-2026-00008",
        "lineas": [
          {
            "codigo": "COM-001",
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "coste": 126000,
            "precio": 182115,
            "cantidad": 1,
            "importeBruto": 182115,
            "descuento": 5463,
            "importe": 176652
          }
        ],
        "bruto": 182115,
        "descuento": 5463,
        "subtotal": 176652,
        "igv": 31797,
        "total": 208449,
        "descuentoBps": 300,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-web",
        "listaNombre": "Empresa Web · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "73098ad0-3fb8-4fcb-9292-4ba299b80b7e",
        "oportunidadNumero": "OP-00008",
        "cliente": {
          "nombre": "Oficinas Arrayán SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000008",
          "direccion": "Calle Demostración 187, Lima",
          "direccionFiscal": "Calle Demostración 187, Lima",
          "direccionCobranza": "Calle Demostración 187, Lima",
          "zona": "Lima",
          "correo": "cliente8@example.com",
          "telefono": "900990008",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "83cbd785-3102-479c-8996-5ea022530135",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Web",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.829Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.829Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.829Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.829Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00008"
          }
        ]
      },
      {
        "id": "37bd76a8-67d8-496e-96fd-c1fe04c5dad2",
        "numero": "COT-2026-00009",
        "lineas": [
          {
            "codigo": "CAM-001",
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "coste": 79500,
            "precio": 122600,
            "cantidad": 1,
            "importeBruto": 122600,
            "descuento": 0,
            "importe": 122600
          }
        ],
        "bruto": 122600,
        "descuento": 0,
        "subtotal": 122600,
        "igv": 22068,
        "total": 144668,
        "descuentoBps": 0,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-telefono",
        "listaNombre": "Retail Teléfono · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "52e24450-164d-4e27-90eb-06d92d750015",
        "oportunidadNumero": "OP-00009",
        "cliente": {
          "nombre": "Daniela Salas",
          "tipoDocumento": "DNI",
          "documento": "79900009",
          "direccion": "Calle Demostración 198, Lima",
          "direccionFiscal": "Calle Demostración 198, Lima",
          "direccionCobranza": "Calle Demostración 198, Lima",
          "zona": "Lima",
          "correo": "cliente9@example.com",
          "telefono": "900990009",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "50206f32-964f-48e4-929a-d2b7136d9f06",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Teléfono",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Sin descuento",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.836Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.836Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.836Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.836Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00009"
          }
        ]
      },
      {
        "id": "e9925547-326e-4a5d-a50c-a3e8cb9201fa",
        "numero": "COT-2026-00010",
        "lineas": [
          {
            "codigo": "MES-001",
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "coste": 23000,
            "precio": 36575,
            "cantidad": 2,
            "importeBruto": 73150,
            "descuento": 732,
            "importe": 72418
          }
        ],
        "bruto": 73150,
        "descuento": 732,
        "subtotal": 72418,
        "igv": 13035,
        "total": 85453,
        "descuentoBps": 100,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-tienda",
        "listaNombre": "Empresa Tienda · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "fdc040b9-f597-4117-90a9-7530d5e75ded",
        "oportunidadNumero": "OP-00010",
        "cliente": {
          "nombre": "Galería Sauco SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000010",
          "direccion": "Calle Demostración 209, Lima",
          "direccionFiscal": "Calle Demostración 209, Lima",
          "direccionCobranza": "Calle Demostración 209, Lima",
          "zona": "Lima",
          "correo": "cliente10@example.com",
          "telefono": "900990010",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "4376104a-d3bd-4e79-a016-d1e4ab35ff7d",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Tienda",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.843Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.843Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.843Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.843Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00010"
          }
        ]
      },
      {
        "id": "a3ba7702-02d5-41fc-92ba-5c0adbd0f5c4",
        "numero": "COT-2026-00011",
        "lineas": [
          {
            "codigo": "EST-001",
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "coste": 31000,
            "precio": 48888,
            "cantidad": 1,
            "importeBruto": 48888,
            "descuento": 978,
            "importe": 47910
          }
        ],
        "bruto": 48888,
        "descuento": 978,
        "subtotal": 47910,
        "igv": 8624,
        "total": 56534,
        "descuentoBps": 200,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-web",
        "listaNombre": "Retail Web · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "8bcde970-e638-4825-9c92-521a2f91dcc7",
        "oportunidadNumero": "OP-00011",
        "cliente": {
          "nombre": "Bruno Navarro",
          "tipoDocumento": "DNI",
          "documento": "79900011",
          "direccion": "Calle Demostración 220, Lima",
          "direccionFiscal": "Calle Demostración 220, Lima",
          "direccionCobranza": "Calle Demostración 220, Lima",
          "zona": "Lima",
          "correo": "cliente11@example.com",
          "telefono": "900990011",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "4d1d3f81-2c41-4bbb-b6fe-97d7510b05b3",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Web",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.852Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.852Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.852Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.852Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00011"
          }
        ]
      },
      {
        "id": "9c15066a-812b-44ad-8d55-e3ce6ae47c18",
        "numero": "COT-2026-00012",
        "lineas": [
          {
            "codigo": "SIL-001",
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad",
            "coste": 16500,
            "precio": 26885,
            "cantidad": 1,
            "importeBruto": 26885,
            "descuento": 807,
            "importe": 26078
          }
        ],
        "bruto": 26885,
        "descuento": 807,
        "subtotal": 26078,
        "igv": 4694,
        "total": 30772,
        "descuentoBps": 300,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-telefono",
        "listaNombre": "Empresa Teléfono · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "d1f3df5e-ac3d-4e74-bb01-c9ce542d7a9d",
        "oportunidadNumero": "OP-00012",
        "cliente": {
          "nombre": "Biblioteca Magnolia SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000012",
          "direccion": "Calle Demostración 231, Lima",
          "direccionFiscal": "Calle Demostración 231, Lima",
          "direccionCobranza": "Calle Demostración 231, Lima",
          "zona": "Lima",
          "correo": "cliente12@example.com",
          "telefono": "900990012",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "262a006d-c478-4b67-8b19-55df5a2af8b9",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Teléfono",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aceptada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.860Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          },
          {
            "fecha": "2026-11-25T18:18:09.860Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Marcada como enviada"
          },
          {
            "fecha": "2026-11-25T18:18:09.860Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Aceptada"
          },
          {
            "fecha": "2026-11-25T18:18:09.860Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido derivado PV-2026-00012"
          }
        ]
      },
      {
        "id": "79c069f7-331a-45c3-b717-b4792760ae9e",
        "numero": "COT-2026-00013",
        "lineas": [
          {
            "codigo": "SOF-001",
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "coste": 105500,
            "precio": 160800,
            "cantidad": 2,
            "importeBruto": 321600,
            "descuento": 32160,
            "importe": 289440
          }
        ],
        "bruto": 321600,
        "descuento": 32160,
        "subtotal": 289440,
        "igv": 52099,
        "total": 341539,
        "descuentoBps": 1000,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-tienda",
        "listaNombre": "Retail Tienda · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "3cd2ca2f-8426-4a55-b0c3-7d25a80ed893",
        "oportunidadNumero": "OP-00013",
        "cliente": {
          "nombre": "Sofía Montes",
          "tipoDocumento": "DNI",
          "documento": "79900013",
          "direccion": "Calle Demostración 242, Lima",
          "direccionFiscal": "Calle Demostración 242, Lima",
          "direccionCobranza": "Calle Demostración 242, Lima",
          "zona": "Lima",
          "correo": "cliente13@example.com",
          "telefono": "900990013",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "3c4ffa3d-1bbb-4e2f-abe1-46cc3f70a27e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.645Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Tienda",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "Pendiente",
        "estado": "Pendiente de aprobación",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.864Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Creación de cotización"
          }
        ]
      }
    ],
    "pedidos": [
      {
        "id": "793528e1-77d2-4574-869b-9159973e4187",
        "numero": "PV-2026-00001",
        "lineas": [
          {
            "codigo": "SOF-001",
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "coste": 105500,
            "precio": 160800,
            "cantidad": 2,
            "importeBruto": 321600,
            "descuento": 0,
            "importe": 321600
          }
        ],
        "bruto": 321600,
        "descuento": 0,
        "subtotal": 321600,
        "igv": 57888,
        "total": 379488,
        "descuentoBps": 0,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-tienda",
        "listaNombre": "Retail Tienda · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "f702075c-4c1c-4c76-bfad-f40d275346b1",
        "oportunidadNumero": "OP-00001",
        "cliente": {
          "nombre": "Isabel Paredes",
          "tipoDocumento": "DNI",
          "documento": "79900001",
          "direccion": "Calle Demostración 110, Lima",
          "direccionFiscal": "Calle Demostración 110, Lima",
          "direccionCobranza": "Calle Demostración 110, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente1@example.com",
          "telefono": "900990001",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.641Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Tienda",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Sin descuento",
        "autorizacion": "No requiere",
        "estado": "Facturado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.691Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00001"
          },
          {
            "fecha": "2026-11-25T18:18:09.694Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.694Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          },
          {
            "fecha": "2026-11-25T18:18:09.699Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.709Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.710Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud derivada SOL-00001"
          }
        ],
        "cotizacionId": "fd3f6145-b5f1-43b3-989c-962d00efd316",
        "cotizacionNumero": "COT-2026-00001",
        "entregas": [
          {
            "id": "2a5bb812-1e1d-4dd2-aae5-124601adf3a0",
            "numero": "DES-00001",
            "fecha": "2026-11-25",
            "receptor": "Isabel Paredes",
            "evidencia": "POD-DEMO-1",
            "lineas": [
              {
                "codigo": "SOF-001",
                "cantidad": 2
              }
            ]
          }
        ],
        "facturas": [
          {
            "id": "dfbcbf54-1335-4445-8c8f-43bc77cd5573",
            "numero": "BOL-INT-000001",
            "total": 379488
          }
        ],
        "controles": {
          "fecha": "2026-11-25T18:18:09.694Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "SOF-001",
              "solicitada": 2,
              "disponible": 46,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "No aplica: contado",
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.709Z"
      },
      {
        "id": "8cda50df-2cf4-4f4c-8d34-d525dc8ecf04",
        "numero": "PV-2026-00002",
        "lineas": [
          {
            "codigo": "COM-001",
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "coste": 126000,
            "precio": 182115,
            "cantidad": 1,
            "importeBruto": 182115,
            "descuento": 1821,
            "importe": 180294
          }
        ],
        "bruto": 182115,
        "descuento": 1821,
        "subtotal": 180294,
        "igv": 32453,
        "total": 212747,
        "descuentoBps": 100,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-web",
        "listaNombre": "Empresa Web · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "d13d5dc2-6ce0-4155-aa92-336a9d688219",
        "oportunidadNumero": "OP-00002",
        "cliente": {
          "nombre": "Estudio Cerezo SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000002",
          "direccion": "Calle Demostración 121, Lima",
          "direccionFiscal": "Calle Demostración 121, Lima",
          "direccionCobranza": "Calle Demostración 121, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente2@example.com",
          "telefono": "900990002",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "b7dbd832-7870-4a80-b762-12d683086b7e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Web",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Facturado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.710Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00002"
          },
          {
            "fecha": "2026-11-25T18:18:09.712Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.712Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          },
          {
            "fecha": "2026-11-25T18:18:09.715Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud derivada SOL-00002"
          }
        ],
        "cotizacionId": "b1a7b779-5429-42a2-908e-96af46899f90",
        "cotizacionNumero": "COT-2026-00002",
        "entregas": [
          {
            "id": "6d87e6f7-5e27-4730-b984-2c26520ad8d6",
            "numero": "DES-00002",
            "fecha": "2026-11-25",
            "receptor": "Estudio Cerezo SAC",
            "evidencia": "POD-DEMO-2",
            "lineas": [
              {
                "codigo": "COM-001",
                "cantidad": 1
              }
            ]
          }
        ],
        "facturas": [
          {
            "id": "dc6b8520-3fa5-40b9-af44-6e4c27522090",
            "numero": "FAC-INT-000001",
            "total": 212747
          }
        ],
        "controles": {
          "fecha": "2026-11-25T18:18:09.712Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "COM-001",
              "solicitada": 1,
              "disponible": 53,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "Finanzas",
            "consultadoEn": "2026-11-25T18:18:09.712Z",
            "datos": {
              "limite": 1050000,
              "exposicion": 0,
              "vencido": 0
            },
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.724Z"
      },
      {
        "id": "2018988b-6324-4108-9083-a76e17e41dcf",
        "numero": "PV-2026-00003",
        "lineas": [
          {
            "codigo": "CAM-001",
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "coste": 79500,
            "precio": 122600,
            "cantidad": 1,
            "importeBruto": 122600,
            "descuento": 2452,
            "importe": 120148
          }
        ],
        "bruto": 122600,
        "descuento": 2452,
        "subtotal": 120148,
        "igv": 21627,
        "total": 141775,
        "descuentoBps": 200,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-telefono",
        "listaNombre": "Retail Teléfono · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "2b9b2423-83a9-422a-8ac4-efe6f9ef622f",
        "oportunidadNumero": "OP-00003",
        "cliente": {
          "nombre": "Mateo Aguirre",
          "tipoDocumento": "DNI",
          "documento": "79900003",
          "direccion": "Calle Demostración 132, Lima",
          "direccionFiscal": "Calle Demostración 132, Lima",
          "direccionCobranza": "Calle Demostración 132, Lima",
          "zona": "Lima",
          "correo": "cliente3@example.com",
          "telefono": "900990003",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "519d4919-df96-452b-97b8-becd5f34d2ff",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Teléfono",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Facturado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00003"
          },
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.726Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          },
          {
            "fecha": "2026-11-25T18:18:09.729Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.745Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.746Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud derivada SOL-00003"
          }
        ],
        "cotizacionId": "97480729-d40b-4ef5-ac8d-7fcf0961ddb7",
        "cotizacionNumero": "COT-2026-00003",
        "entregas": [
          {
            "id": "43962143-7c59-4c60-a23c-f7d8b4a0b9b8",
            "numero": "DES-00003",
            "fecha": "2026-11-25",
            "receptor": "Mateo Aguirre",
            "evidencia": "POD-DEMO-3",
            "lineas": [
              {
                "codigo": "CAM-001",
                "cantidad": 1
              }
            ]
          }
        ],
        "facturas": [
          {
            "id": "9176d10d-0752-4798-819b-fe62f26453d1",
            "numero": "BOL-INT-000002",
            "total": 141775
          }
        ],
        "controles": {
          "fecha": "2026-11-25T18:18:09.725Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "CAM-001",
              "solicitada": 1,
              "disponible": 61,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "No aplica: contado",
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.745Z"
      },
      {
        "id": "97fd3abc-e963-4c97-a8da-2501dc02a5c0",
        "numero": "PV-2026-00004",
        "lineas": [
          {
            "codigo": "MES-001",
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "coste": 23000,
            "precio": 36575,
            "cantidad": 2,
            "importeBruto": 73150,
            "descuento": 2195,
            "importe": 70955
          }
        ],
        "bruto": 73150,
        "descuento": 2195,
        "subtotal": 70955,
        "igv": 12772,
        "total": 83727,
        "descuentoBps": 300,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-tienda",
        "listaNombre": "Empresa Tienda · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "dd471d39-8237-4ff1-8c51-3ce27017d62f",
        "oportunidadNumero": "OP-00004",
        "cliente": {
          "nombre": "Taller Horizonte SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000004",
          "direccion": "Calle Demostración 143, Lima",
          "direccionFiscal": "Calle Demostración 143, Lima",
          "direccionCobranza": "Calle Demostración 143, Lima",
          "zona": "Lima",
          "correo": "cliente4@example.com",
          "telefono": "900990004",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "7c81a1f4-49cd-4675-881c-b62e53faa813",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Tienda",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Facturado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.747Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00004"
          },
          {
            "fecha": "2026-11-25T18:18:09.750Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.750Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          },
          {
            "fecha": "2026-11-25T18:18:09.763Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.792Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.792Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud derivada SOL-00004"
          }
        ],
        "cotizacionId": "aecbe2af-c9c9-4965-be89-f02189f167f9",
        "cotizacionNumero": "COT-2026-00004",
        "entregas": [
          {
            "id": "884e79c7-332a-413a-8876-349910f2711b",
            "numero": "DES-00004",
            "fecha": "2026-11-25",
            "receptor": "Taller Horizonte SAC",
            "evidencia": "POD-DEMO-4",
            "lineas": [
              {
                "codigo": "MES-001",
                "cantidad": 2
              }
            ]
          }
        ],
        "facturas": [
          {
            "id": "6c7c03bb-93e6-44e0-948c-d1572e955948",
            "numero": "FAC-INT-000002",
            "total": 83727
          }
        ],
        "controles": {
          "fecha": "2026-11-25T18:18:09.750Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "MES-001",
              "solicitada": 2,
              "disponible": 66,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "Finanzas",
            "consultadoEn": "2026-11-25T18:18:09.750Z",
            "datos": {
              "limite": 1150000,
              "exposicion": 0,
              "vencido": 0
            },
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.792Z"
      },
      {
        "id": "4ed8e144-2ed5-4f16-bd46-fcb991490168",
        "numero": "PV-2026-00005",
        "lineas": [
          {
            "codigo": "EST-001",
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "coste": 31000,
            "precio": 48888,
            "cantidad": 1,
            "importeBruto": 48888,
            "descuento": 0,
            "importe": 48888
          }
        ],
        "bruto": 48888,
        "descuento": 0,
        "subtotal": 48888,
        "igv": 8800,
        "total": 57688,
        "descuentoBps": 0,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-web",
        "listaNombre": "Retail Web · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "f973a9c3-b3fd-427a-aad3-0f4c9d36a455",
        "oportunidadNumero": "OP-00005",
        "cliente": {
          "nombre": "Luciana Valdés",
          "tipoDocumento": "DNI",
          "documento": "79900005",
          "direccion": "Calle Demostración 154, Lima",
          "direccionFiscal": "Calle Demostración 154, Lima",
          "direccionCobranza": "Calle Demostración 154, Lima",
          "zona": "Lima",
          "correo": "cliente5@example.com",
          "telefono": "900990005",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "0fea5fff-01b6-4923-b1c1-2ede35801016",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Web",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Sin descuento",
        "autorizacion": "No requiere",
        "estado": "Facturado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.793Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00005"
          },
          {
            "fecha": "2026-11-25T18:18:09.796Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.796Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          },
          {
            "fecha": "2026-11-25T18:18:09.802Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.812Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          },
          {
            "fecha": "2026-11-25T18:18:09.812Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud derivada SOL-00005"
          }
        ],
        "cotizacionId": "5cf49615-e2d9-496e-94df-d97e05d516ba",
        "cotizacionNumero": "COT-2026-00005",
        "entregas": [
          {
            "id": "ec181393-b7da-4fe9-af3b-00043267c890",
            "numero": "DES-00005",
            "fecha": "2026-11-25",
            "receptor": "Luciana Valdés",
            "evidencia": "POD-DEMO-5",
            "lineas": [
              {
                "codigo": "EST-001",
                "cantidad": 1
              }
            ]
          }
        ],
        "facturas": [
          {
            "id": "410d26dd-ed02-4678-ad20-1ded0613e386",
            "numero": "BOL-INT-000003",
            "total": 57688
          }
        ],
        "controles": {
          "fecha": "2026-11-25T18:18:09.796Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "EST-001",
              "solicitada": 1,
              "disponible": 72,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "No aplica: contado",
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.811Z"
      },
      {
        "id": "bfe1493d-d1fb-4a4b-8453-4a3805d9d45f",
        "numero": "PV-2026-00006",
        "lineas": [
          {
            "codigo": "SIL-001",
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad",
            "coste": 16500,
            "precio": 26885,
            "cantidad": 1,
            "importeBruto": 26885,
            "descuento": 269,
            "importe": 26616
          }
        ],
        "bruto": 26885,
        "descuento": 269,
        "subtotal": 26616,
        "igv": 4791,
        "total": 31407,
        "descuentoBps": 100,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-telefono",
        "listaNombre": "Empresa Teléfono · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "e54fa8d9-b2e5-4b74-96a4-e70f272098c5",
        "oportunidadNumero": "OP-00006",
        "cliente": {
          "nombre": "Casa Avellana SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000006",
          "direccion": "Calle Demostración 165, Lima",
          "direccionFiscal": "Calle Demostración 165, Lima",
          "direccionCobranza": "Calle Demostración 165, Lima",
          "zona": "Lima",
          "correo": "cliente6@example.com",
          "telefono": "900990006",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "8efc391c-7d16-4685-ae07-5774e6c01929",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Teléfono",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Atendido",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.812Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00006"
          },
          {
            "fecha": "2026-11-25T18:18:09.815Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.815Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          },
          {
            "fecha": "2026-11-25T18:18:09.819Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Seguimiento actualizado desde Despachos y Facturación"
          }
        ],
        "cotizacionId": "7c65072a-85ef-4e07-8bc2-ce364ebf4212",
        "cotizacionNumero": "COT-2026-00006",
        "entregas": [
          {
            "id": "422bb84a-e0d0-408b-87a7-6d3a17474b42",
            "numero": "DES-00006",
            "fecha": "2026-11-25",
            "receptor": "Casa Avellana SAC",
            "evidencia": "POD-DEMO-6",
            "lineas": [
              {
                "codigo": "SIL-001",
                "cantidad": 1
              }
            ]
          }
        ],
        "facturas": [],
        "controles": {
          "fecha": "2026-11-25T18:18:09.815Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "SIL-001",
              "solicitada": 1,
              "disponible": 68,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "Finanzas",
            "consultadoEn": "2026-11-25T18:18:09.815Z",
            "datos": {
              "limite": 1250000,
              "exposicion": 0,
              "vencido": 0
            },
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.819Z"
      },
      {
        "id": "d6d7cc2b-b996-45d1-b23f-cff7fb0f6725",
        "numero": "PV-2026-00007",
        "lineas": [
          {
            "codigo": "SOF-001",
            "nombre": "Sofá Brisa de lino",
            "unidad": "Unidad",
            "coste": 105500,
            "precio": 160800,
            "cantidad": 2,
            "importeBruto": 321600,
            "descuento": 6432,
            "importe": 315168
          }
        ],
        "bruto": 321600,
        "descuento": 6432,
        "subtotal": 315168,
        "igv": 56730,
        "total": 371898,
        "descuentoBps": 200,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-tienda",
        "listaNombre": "Retail Tienda · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "a3a95ca2-d30c-40d7-b0e6-2babe5727d5f",
        "oportunidadNumero": "OP-00007",
        "cliente": {
          "nombre": "Renzo Vidal",
          "tipoDocumento": "DNI",
          "documento": "79900007",
          "direccion": "Calle Demostración 176, Lima",
          "direccionFiscal": "Calle Demostración 176, Lima",
          "direccionCobranza": "Calle Demostración 176, Lima",
          "zona": "Lima",
          "correo": "cliente7@example.com",
          "telefono": "900990007",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "01e136ea-510a-4f76-a05a-94a959eecbd4",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Tienda",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.820Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00007"
          },
          {
            "fecha": "2026-11-25T18:18:09.823Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.823Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          }
        ],
        "cotizacionId": "e961d96f-e334-4735-afab-955a58ca5303",
        "cotizacionNumero": "COT-2026-00007",
        "entregas": [],
        "facturas": [],
        "controles": {
          "fecha": "2026-11-25T18:18:09.823Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "SOF-001",
              "solicitada": 2,
              "disponible": 44,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "No aplica: contado",
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.828Z"
      },
      {
        "id": "d081d24c-82ee-4ec4-a57b-ca0aff98335c",
        "numero": "PV-2026-00008",
        "lineas": [
          {
            "codigo": "COM-001",
            "nombre": "Comedor Lenga para cuatro",
            "unidad": "Juego",
            "coste": 126000,
            "precio": 182115,
            "cantidad": 1,
            "importeBruto": 182115,
            "descuento": 5463,
            "importe": 176652
          }
        ],
        "bruto": 182115,
        "descuento": 5463,
        "subtotal": 176652,
        "igv": 31797,
        "total": 208449,
        "descuentoBps": 300,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-web",
        "listaNombre": "Empresa Web · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "73098ad0-3fb8-4fcb-9292-4ba299b80b7e",
        "oportunidadNumero": "OP-00008",
        "cliente": {
          "nombre": "Oficinas Arrayán SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000008",
          "direccion": "Calle Demostración 187, Lima",
          "direccionFiscal": "Calle Demostración 187, Lima",
          "direccionCobranza": "Calle Demostración 187, Lima",
          "zona": "Lima",
          "correo": "cliente8@example.com",
          "telefono": "900990008",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "83cbd785-3102-479c-8996-5ea022530135",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Web",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.829Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00008"
          },
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.832Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          }
        ],
        "cotizacionId": "b256eeb9-d2de-4346-b03b-f1041ce87460",
        "cotizacionNumero": "COT-2026-00008",
        "entregas": [],
        "facturas": [],
        "controles": {
          "fecha": "2026-11-25T18:18:09.832Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "COM-001",
              "solicitada": 1,
              "disponible": 52,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "Finanzas",
            "consultadoEn": "2026-11-25T18:18:09.831Z",
            "datos": {
              "limite": 1350000,
              "exposicion": 0,
              "vencido": 0
            },
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.836Z"
      },
      {
        "id": "016e47e8-7338-40ff-ad2a-efa69fa94345",
        "numero": "PV-2026-00009",
        "lineas": [
          {
            "codigo": "CAM-001",
            "nombre": "Cama Alba de dos plazas",
            "unidad": "Unidad",
            "coste": 79500,
            "precio": 122600,
            "cantidad": 1,
            "importeBruto": 122600,
            "descuento": 0,
            "importe": 122600
          }
        ],
        "bruto": 122600,
        "descuento": 0,
        "subtotal": 122600,
        "igv": 22068,
        "total": 144668,
        "descuentoBps": 0,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-telefono",
        "listaNombre": "Retail Teléfono · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "52e24450-164d-4e27-90eb-06d92d750015",
        "oportunidadNumero": "OP-00009",
        "cliente": {
          "nombre": "Daniela Salas",
          "tipoDocumento": "DNI",
          "documento": "79900009",
          "direccion": "Calle Demostración 198, Lima",
          "direccionFiscal": "Calle Demostración 198, Lima",
          "direccionCobranza": "Calle Demostración 198, Lima",
          "zona": "Lima",
          "correo": "cliente9@example.com",
          "telefono": "900990009",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "50206f32-964f-48e4-929a-d2b7136d9f06",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Teléfono",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Sin descuento",
        "autorizacion": "No requiere",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.836Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00009"
          },
          {
            "fecha": "2026-11-25T18:18:09.838Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.838Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          }
        ],
        "cotizacionId": "37bd76a8-67d8-496e-96fd-c1fe04c5dad2",
        "cotizacionNumero": "COT-2026-00009",
        "entregas": [],
        "facturas": [],
        "controles": {
          "fecha": "2026-11-25T18:18:09.838Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "CAM-001",
              "solicitada": 1,
              "disponible": 60,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "No aplica: contado",
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.842Z"
      },
      {
        "id": "035c35bf-1ce4-4798-8c6a-2dcf90b8bab4",
        "numero": "PV-2026-00010",
        "lineas": [
          {
            "codigo": "MES-001",
            "nombre": "Mesa Junco para sala",
            "unidad": "Unidad",
            "coste": 23000,
            "precio": 36575,
            "cantidad": 2,
            "importeBruto": 73150,
            "descuento": 732,
            "importe": 72418
          }
        ],
        "bruto": 73150,
        "descuento": 732,
        "subtotal": 72418,
        "igv": 13035,
        "total": 85453,
        "descuentoBps": 100,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-tienda",
        "listaNombre": "Empresa Tienda · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "fdc040b9-f597-4117-90a9-7530d5e75ded",
        "oportunidadNumero": "OP-00010",
        "cliente": {
          "nombre": "Galería Sauco SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000010",
          "direccion": "Calle Demostración 209, Lima",
          "direccionFiscal": "Calle Demostración 209, Lima",
          "direccionCobranza": "Calle Demostración 209, Lima",
          "zona": "Lima",
          "correo": "cliente10@example.com",
          "telefono": "900990010",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "4376104a-d3bd-4e79-a016-d1e4ab35ff7d",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Tienda",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.843Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00010"
          },
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.847Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          }
        ],
        "cotizacionId": "e9925547-326e-4a5d-a50c-a3e8cb9201fa",
        "cotizacionNumero": "COT-2026-00010",
        "entregas": [],
        "facturas": [],
        "controles": {
          "fecha": "2026-11-25T18:18:09.847Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "MES-001",
              "solicitada": 2,
              "disponible": 64,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "Finanzas",
            "consultadoEn": "2026-11-25T18:18:09.847Z",
            "datos": {
              "limite": 1450000,
              "exposicion": 0,
              "vencido": 0
            },
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.852Z"
      },
      {
        "id": "56d70760-013d-4802-8d7e-cad1e865792b",
        "numero": "PV-2026-00011",
        "lineas": [
          {
            "codigo": "EST-001",
            "nombre": "Estantería Nido modular",
            "unidad": "Unidad",
            "coste": 31000,
            "precio": 48888,
            "cantidad": 1,
            "importeBruto": 48888,
            "descuento": 978,
            "importe": 47910
          }
        ],
        "bruto": 48888,
        "descuento": 978,
        "subtotal": 47910,
        "igv": 8624,
        "total": 56534,
        "descuentoBps": 200,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-web",
        "listaNombre": "Retail Web · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "8bcde970-e638-4825-9c92-521a2f91dcc7",
        "oportunidadNumero": "OP-00011",
        "cliente": {
          "nombre": "Bruno Navarro",
          "tipoDocumento": "DNI",
          "documento": "79900011",
          "direccion": "Calle Demostración 220, Lima",
          "direccionFiscal": "Calle Demostración 220, Lima",
          "direccionCobranza": "Calle Demostración 220, Lima",
          "zona": "Lima",
          "correo": "cliente11@example.com",
          "telefono": "900990011",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "4d1d3f81-2c41-4bbb-b6fe-97d7510b05b3",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Web",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Contado",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.852Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00011"
          },
          {
            "fecha": "2026-11-25T18:18:09.855Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.855Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          }
        ],
        "cotizacionId": "a3ba7702-02d5-41fc-92ba-5c0adbd0f5c4",
        "cotizacionNumero": "COT-2026-00011",
        "entregas": [],
        "facturas": [],
        "controles": {
          "fecha": "2026-11-25T18:18:09.855Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "EST-001",
              "solicitada": 1,
              "disponible": 71,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "No aplica: contado",
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo",
        "consultadoEn": "2026-11-25T18:18:09.860Z"
      },
      {
        "id": "860a2a56-6f86-4201-8bf0-9be56be17645",
        "numero": "PV-2026-00012",
        "lineas": [
          {
            "codigo": "SIL-001",
            "nombre": "Silla Cala tapizada",
            "unidad": "Unidad",
            "coste": 16500,
            "precio": 26885,
            "cantidad": 1,
            "importeBruto": 26885,
            "descuento": 807,
            "importe": 26078
          }
        ],
        "bruto": 26885,
        "descuento": 807,
        "subtotal": 26078,
        "igv": 4694,
        "total": 30772,
        "descuentoBps": 300,
        "origenDescuento": "Manual",
        "igvPorcentaje": 18,
        "moneda": "PEN",
        "listaId": "lista-empresa-telefono",
        "listaNombre": "Empresa Teléfono · Demo",
        "listaVigenteHasta": "2027-12-30",
        "oportunidadId": "d1f3df5e-ac3d-4e74-bb01-c9ce542d7a9d",
        "oportunidadNumero": "OP-00012",
        "cliente": {
          "nombre": "Biblioteca Magnolia SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000012",
          "direccion": "Calle Demostración 231, Lima",
          "direccionFiscal": "Calle Demostración 231, Lima",
          "direccionCobranza": "Calle Demostración 231, Lima",
          "zona": "Lima",
          "correo": "cliente12@example.com",
          "telefono": "900990012",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "262a006d-c478-4b67-8b19-55df5a2af8b9",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.644Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "sede": "centro",
        "vendedor": "Camila · Demo",
        "canal": "Teléfono",
        "registradoPor": "Camila · Demo",
        "fecha": "2026-11-25",
        "vigenteHasta": "2026-12-02",
        "entrega": "2026-11-25",
        "condicion": "Crédito 30 días",
        "motivoDescuento": "Condición de venta simulada",
        "autorizacion": "No requiere",
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.860Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Pedido creado desde COT-2026-00012"
          },
          {
            "fecha": "2026-11-25T18:18:09.864Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Validación comercial: controles favorables"
          },
          {
            "fecha": "2026-11-25T18:18:09.864Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobación comercial; reserva y despacho corresponden a Inventarios y Despachos"
          }
        ],
        "cotizacionId": "9c15066a-812b-44ad-8d55-e3ce6ae47c18",
        "cotizacionNumero": "COT-2026-00012",
        "entregas": [],
        "facturas": [],
        "controles": {
          "fecha": "2026-11-25T18:18:09.864Z",
          "identificacion": true,
          "stockOrigen": "Logística · existencias y reservas",
          "disponibilidad": [
            {
              "codigo": "SIL-001",
              "solicitada": 1,
              "disponible": 67,
              "aprobado": true
            }
          ],
          "credito": {
            "origen": "Finanzas",
            "consultadoEn": "2026-11-25T18:18:09.864Z",
            "datos": {
              "limite": 1550000,
              "exposicion": 0,
              "vencido": 0
            },
            "aprobado": true
          },
          "motivos": [],
          "aprobado": true
        },
        "aprobadoPor": "Andrés · Demo"
      }
    ],
    "productos": [
      {
        "codigo": "SOF-001",
        "nombre": "Sofá Brisa de lino",
        "familia": "Sala",
        "unidad": "Unidad",
        "precio": 160800,
        "coste": 105500,
        "estado": "Aprobado",
        "id": "SOF-001"
      },
      {
        "codigo": "COM-001",
        "nombre": "Comedor Lenga para cuatro",
        "familia": "Comedor",
        "unidad": "Juego",
        "precio": 191700,
        "coste": 126000,
        "estado": "Aprobado",
        "id": "COM-001"
      },
      {
        "codigo": "CAM-001",
        "nombre": "Cama Alba de dos plazas",
        "familia": "Dormitorio",
        "unidad": "Unidad",
        "precio": 122600,
        "coste": 79500,
        "estado": "Aprobado",
        "id": "CAM-001"
      },
      {
        "codigo": "MES-001",
        "nombre": "Mesa Junco para sala",
        "familia": "Sala",
        "unidad": "Unidad",
        "precio": 38500,
        "coste": 23000,
        "estado": "Aprobado",
        "id": "MES-001"
      },
      {
        "codigo": "EST-001",
        "nombre": "Estantería Nido modular",
        "familia": "Organización",
        "unidad": "Unidad",
        "precio": 50400,
        "coste": 31000,
        "estado": "Aprobado",
        "id": "EST-001"
      },
      {
        "codigo": "SIL-001",
        "nombre": "Silla Cala tapizada",
        "familia": "Comedor",
        "unidad": "Unidad",
        "precio": 28300,
        "coste": 16500,
        "estado": "Aprobado",
        "id": "SIL-001"
      }
    ],
    "listasPrecio": [
      {
        "id": "lista-tienda",
        "nombre": "Retail Tienda · Demo",
        "canal": "Tienda",
        "segmento": "Retail",
        "factor": 1,
        "moneda": "PEN",
        "desde": "2026-10-31",
        "hasta": "2027-12-30",
        "estado": "Aprobado",
        "activa": true,
        "precios": {
          "SOF-001": 160800,
          "COM-001": 191700,
          "CAM-001": 122600,
          "MES-001": 38500,
          "EST-001": 50400,
          "SIL-001": 28300
        }
      },
      {
        "id": "lista-web",
        "nombre": "Retail Web · Demo",
        "canal": "Web",
        "segmento": "Retail",
        "factor": 0.97,
        "moneda": "PEN",
        "desde": "2026-10-31",
        "hasta": "2027-12-30",
        "estado": "Aprobado",
        "activa": true,
        "precios": {
          "SOF-001": 155976,
          "COM-001": 185949,
          "CAM-001": 118922,
          "MES-001": 37345,
          "EST-001": 48888,
          "SIL-001": 27451
        }
      },
      {
        "id": "lista-telefono",
        "nombre": "Retail Teléfono · Demo",
        "canal": "Teléfono",
        "segmento": "Retail",
        "factor": 1,
        "moneda": "PEN",
        "desde": "2026-10-31",
        "hasta": "2027-12-30",
        "estado": "Aprobado",
        "activa": true,
        "precios": {
          "SOF-001": 160800,
          "COM-001": 191700,
          "CAM-001": 122600,
          "MES-001": 38500,
          "EST-001": 50400,
          "SIL-001": 28300
        }
      },
      {
        "id": "lista-empresa-tienda",
        "nombre": "Empresa Tienda · Demo",
        "canal": "Tienda",
        "segmento": "Empresa",
        "factor": 0.95,
        "moneda": "PEN",
        "desde": "2026-10-31",
        "hasta": "2027-12-30",
        "estado": "Aprobado",
        "activa": true,
        "precios": {
          "SOF-001": 152760,
          "COM-001": 182115,
          "CAM-001": 116470,
          "MES-001": 36575,
          "EST-001": 47880,
          "SIL-001": 26885
        }
      },
      {
        "id": "lista-empresa-web",
        "nombre": "Empresa Web · Demo",
        "canal": "Web",
        "segmento": "Empresa",
        "factor": 0.95,
        "moneda": "PEN",
        "desde": "2026-10-31",
        "hasta": "2027-12-30",
        "estado": "Aprobado",
        "activa": true,
        "precios": {
          "SOF-001": 152760,
          "COM-001": 182115,
          "CAM-001": 116470,
          "MES-001": 36575,
          "EST-001": 47880,
          "SIL-001": 26885
        }
      },
      {
        "id": "lista-empresa-telefono",
        "nombre": "Empresa Teléfono · Demo",
        "canal": "Teléfono",
        "segmento": "Empresa",
        "factor": 0.95,
        "moneda": "PEN",
        "desde": "2026-10-31",
        "hasta": "2027-12-30",
        "estado": "Aprobado",
        "activa": true,
        "precios": {
          "SOF-001": 152760,
          "COM-001": 182115,
          "CAM-001": 116470,
          "MES-001": 36575,
          "EST-001": 47880,
          "SIL-001": 26885
        }
      }
    ],
    "promociones": [
      {
        "id": "promo-demo-1",
        "nombre": "Sala de temporada",
        "canal": "Tienda",
        "segmento": "Retail",
        "desde": "2026-11-01",
        "hasta": "2027-01-24",
        "descuentoBps": 500,
        "activa": true,
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.610Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Promoción de demostración publicada"
          }
        ]
      },
      {
        "id": "promo-demo-2",
        "nombre": "Compra en línea",
        "canal": "Web",
        "segmento": "Retail",
        "desde": "2026-11-01",
        "hasta": "2027-01-24",
        "descuentoBps": 300,
        "activa": true,
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.610Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Promoción de demostración publicada"
          }
        ]
      },
      {
        "id": "promo-demo-3",
        "nombre": "Asesoría remota",
        "canal": "Teléfono",
        "segmento": "Retail",
        "desde": "2026-11-01",
        "hasta": "2027-01-24",
        "descuentoBps": 200,
        "activa": true,
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.610Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Promoción de demostración publicada"
          }
        ]
      },
      {
        "id": "promo-demo-4",
        "nombre": "Mobiliario para oficinas",
        "canal": "Tienda",
        "segmento": "Empresa",
        "desde": "2026-11-01",
        "hasta": "2027-01-24",
        "descuentoBps": 400,
        "activa": true,
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.610Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Promoción de demostración publicada"
          }
        ]
      },
      {
        "id": "promo-demo-5",
        "nombre": "Renueva tu negocio",
        "canal": "Web",
        "segmento": "Empresa",
        "desde": "2026-11-01",
        "hasta": "2027-01-24",
        "descuentoBps": 250,
        "activa": true,
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.610Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Promoción de demostración publicada"
          }
        ]
      },
      {
        "id": "promo-demo-6",
        "nombre": "Proyectos a medida",
        "canal": "Teléfono",
        "segmento": "Empresa",
        "desde": "2026-11-01",
        "hasta": "2027-01-24",
        "descuentoBps": 150,
        "activa": true,
        "estado": "Aprobado",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.610Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Promoción de demostración publicada"
          }
        ]
      }
    ],
    "solicitudesMaestro": [
      {
        "id": "6981ad8f-3dfd-4348-83e8-f821b4856d5e",
        "tipo": "cliente",
        "objetivoId": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
        "datos": {
          "nombre": "Isabel Paredes",
          "tipoDocumento": "DNI",
          "documento": "79900001",
          "direccion": "Calle Demostración 110, Lima",
          "direccionFiscal": "Calle Demostración 110, Lima",
          "direccionCobranza": "Calle Demostración 110, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente1@example.com",
          "telefono": "900990001",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.641Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "sede": "centro",
        "estado": "Aprobada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.642Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de actualización de cliente"
          },
          {
            "fecha": "2026-11-25T18:18:09.642Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          }
        ]
      },
      {
        "id": "8569780a-0d6b-4472-a28c-e21abc2153dd",
        "tipo": "cliente",
        "objetivoId": "b7dbd832-7870-4a80-b762-12d683086b7e",
        "datos": {
          "nombre": "Estudio Cerezo SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000002",
          "direccion": "Calle Demostración 121, Lima",
          "direccionFiscal": "Calle Demostración 121, Lima",
          "direccionCobranza": "Calle Demostración 121, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente2@example.com",
          "telefono": "900990002",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "b7dbd832-7870-4a80-b762-12d683086b7e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "sede": "centro",
        "estado": "Aprobada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de actualización de cliente"
          },
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Aprobada: Operación de demostración validada"
          }
        ]
      },
      {
        "id": "f5975613-ceb6-4811-a166-ddf2045ee611",
        "tipo": "cliente",
        "objetivoId": "519d4919-df96-452b-97b8-becd5f34d2ff",
        "datos": {
          "nombre": "Mateo Aguirre",
          "tipoDocumento": "DNI",
          "documento": "79900003",
          "direccion": "Calle Demostración 132, Lima",
          "direccionFiscal": "Calle Demostración 132, Lima",
          "direccionCobranza": "Calle Demostración 132, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente3@example.com",
          "telefono": "900990003",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "519d4919-df96-452b-97b8-becd5f34d2ff",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "sede": "centro",
        "estado": "Rechazada",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de actualización de cliente"
          },
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Rechazada: Operación de demostración validada"
          }
        ]
      },
      {
        "id": "5f0ad4f6-0016-433c-813d-e6cda658b757",
        "tipo": "cliente",
        "objetivoId": "7c81a1f4-49cd-4675-881c-b62e53faa813",
        "datos": {
          "nombre": "Taller Horizonte SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000004",
          "direccion": "Calle Demostración 143, Lima",
          "direccionFiscal": "Calle Demostración 143, Lima",
          "direccionCobranza": "Calle Demostración 143, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente4@example.com",
          "telefono": "900990004",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "7c81a1f4-49cd-4675-881c-b62e53faa813",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "sede": "centro",
        "estado": "Pendiente",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.643Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de actualización de cliente"
          }
        ]
      },
      {
        "id": "6a2797b8-80b0-4d41-920c-daff510b093e",
        "tipo": "cliente",
        "objetivoId": "0fea5fff-01b6-4923-b1c1-2ede35801016",
        "datos": {
          "nombre": "Luciana Valdés",
          "tipoDocumento": "DNI",
          "documento": "79900005",
          "direccion": "Calle Demostración 154, Lima",
          "direccionFiscal": "Calle Demostración 154, Lima",
          "direccionCobranza": "Calle Demostración 154, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente5@example.com",
          "telefono": "900990005",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "0fea5fff-01b6-4923-b1c1-2ede35801016",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "sede": "centro",
        "estado": "Pendiente",
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.644Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de actualización de cliente"
          }
        ]
      }
    ],
    "solicitudes": [
      {
        "id": "283698b7-64ef-493d-929f-108708f9b3c0",
        "numero": "SOL-00001",
        "pedidoId": "793528e1-77d2-4574-869b-9159973e4187",
        "pedidoNumero": "PV-2026-00001",
        "tipo": "Devolución",
        "motivo": "Cliente solicita revisar el acabado",
        "sede": "centro",
        "cliente": {
          "nombre": "Isabel Paredes",
          "tipoDocumento": "DNI",
          "documento": "79900001",
          "direccion": "Calle Demostración 110, Lima",
          "direccionFiscal": "Calle Demostración 110, Lima",
          "direccionCobranza": "Calle Demostración 110, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente1@example.com",
          "telefono": "900990001",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "f2c194ba-54f4-4bcf-b1df-162274a2c10e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.641Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "estado": "Autorizada",
        "lineas": [
          {
            "codigo": "SOF-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.710Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de devolución"
          },
          {
            "fecha": "2026-11-25T18:18:09.710Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Autorizada: Operación de demostración validada"
          }
        ],
        "resueltoPor": "Andrés · Demo"
      },
      {
        "id": "857ffad5-13a4-4311-b55c-303ad650aaef",
        "numero": "SOL-00002",
        "pedidoId": "8cda50df-2cf4-4f4c-8d34-d525dc8ecf04",
        "pedidoNumero": "PV-2026-00002",
        "tipo": "Devolución",
        "motivo": "Cliente solicita revisar el acabado",
        "sede": "centro",
        "cliente": {
          "nombre": "Estudio Cerezo SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000002",
          "direccion": "Calle Demostración 121, Lima",
          "direccionFiscal": "Calle Demostración 121, Lima",
          "direccionCobranza": "Calle Demostración 121, Lima",
          "zona": "Lima Metropolitana",
          "correo": "cliente2@example.com",
          "telefono": "900990002",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "b7dbd832-7870-4a80-b762-12d683086b7e",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.642Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            },
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Andrés · Demo",
              "rol": "Jefatura",
              "accion": "Maestro aprobado: Operación de demostración validada"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "estado": "Autorizada",
        "lineas": [
          {
            "codigo": "COM-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de devolución"
          },
          {
            "fecha": "2026-11-25T18:18:09.724Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Autorizada: Operación de demostración validada"
          }
        ],
        "resueltoPor": "Andrés · Demo"
      },
      {
        "id": "8eb9e3af-b658-49e7-979d-814254efe5f1",
        "numero": "SOL-00003",
        "pedidoId": "2018988b-6324-4108-9083-a76e17e41dcf",
        "pedidoNumero": "PV-2026-00003",
        "tipo": "Devolución",
        "motivo": "Cliente solicita revisar el acabado",
        "sede": "centro",
        "cliente": {
          "nombre": "Mateo Aguirre",
          "tipoDocumento": "DNI",
          "documento": "79900003",
          "direccion": "Calle Demostración 132, Lima",
          "direccionFiscal": "Calle Demostración 132, Lima",
          "direccionCobranza": "Calle Demostración 132, Lima",
          "zona": "Lima",
          "correo": "cliente3@example.com",
          "telefono": "900990003",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "519d4919-df96-452b-97b8-becd5f34d2ff",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "estado": "Rechazada",
        "lineas": [
          {
            "codigo": "CAM-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.746Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de devolución"
          },
          {
            "fecha": "2026-11-25T18:18:09.746Z",
            "usuario": "Andrés · Demo",
            "rol": "Jefatura",
            "accion": "Rechazada: Operación de demostración validada"
          }
        ],
        "resueltoPor": "Andrés · Demo"
      },
      {
        "id": "06062497-029c-414a-aa15-c78532684d2c",
        "numero": "SOL-00004",
        "pedidoId": "97fd3abc-e963-4c97-a8da-2501dc02a5c0",
        "pedidoNumero": "PV-2026-00004",
        "tipo": "Devolución",
        "motivo": "Cliente solicita revisar el acabado",
        "sede": "centro",
        "cliente": {
          "nombre": "Taller Horizonte SAC",
          "tipoDocumento": "RUC",
          "documento": "20990000004",
          "direccion": "Calle Demostración 143, Lima",
          "direccionFiscal": "Calle Demostración 143, Lima",
          "direccionCobranza": "Calle Demostración 143, Lima",
          "zona": "Lima",
          "correo": "cliente4@example.com",
          "telefono": "900990004",
          "segmento": "Empresa",
          "condicionPreferida": "Crédito 30 días",
          "id": "7c81a1f4-49cd-4675-881c-b62e53faa813",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "estado": "Pendiente",
        "lineas": [
          {
            "codigo": "MES-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.792Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de devolución"
          }
        ]
      },
      {
        "id": "f3681aaa-9dee-4fb3-a3d0-67bba468c7e6",
        "numero": "SOL-00005",
        "pedidoId": "4ed8e144-2ed5-4f16-bd46-fcb991490168",
        "pedidoNumero": "PV-2026-00005",
        "tipo": "Devolución",
        "motivo": "Cliente solicita revisar el acabado",
        "sede": "centro",
        "cliente": {
          "nombre": "Luciana Valdés",
          "tipoDocumento": "DNI",
          "documento": "79900005",
          "direccion": "Calle Demostración 154, Lima",
          "direccionFiscal": "Calle Demostración 154, Lima",
          "direccionCobranza": "Calle Demostración 154, Lima",
          "zona": "Lima",
          "correo": "cliente5@example.com",
          "telefono": "900990005",
          "segmento": "Retail",
          "condicionPreferida": "Contado",
          "id": "0fea5fff-01b6-4923-b1c1-2ede35801016",
          "estado": "Aprobado",
          "historial": [
            {
              "fecha": "2026-11-25T18:18:09.643Z",
              "usuario": "Camila · Demo",
              "rol": "Asesor",
              "accion": "Cliente registrado"
            }
          ]
        },
        "registradoPor": "Camila · Demo",
        "estado": "Pendiente",
        "lineas": [
          {
            "codigo": "EST-001",
            "cantidad": 1
          }
        ],
        "historial": [
          {
            "fecha": "2026-11-25T18:18:09.812Z",
            "usuario": "Camila · Demo",
            "rol": "Asesor",
            "accion": "Solicitud de devolución"
          }
        ]
      }
    ]
  }
};
