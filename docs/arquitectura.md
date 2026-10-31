# 3. Arquitectura

[← Índice](../README.md)

Decisiones D03 a D06, D12, D13 y D25 (ver [decisiones](decisiones.md)). Esta página es el mapa; los porqués están en las decisiones.

## 3.1 Vista general

Un solo sistema (monolito modular): **una solución .NET, una base SQL Server**. Cada área del ERP es un **módulo** con su propio esquema SQL y una interfaz pública (`Contratos`) para que otros módulos hablen con él. Cada módulo se divide en **submódulos**: grupos de procesos con sus propios documentos y un rol responsable. Las características (lista de precios, descuentos, plazo de entrega…) viven dentro de un submódulo. Las pantallas viven en la misma Api.

```
ERP-2026-2/
└── src/
    ├── Erp.Api/              # host único: arranca el sistema, registra módulos, sirve la API
    │   └── wwwroot/          # front: HTML + CSS + JS, con la ficha común de documentos
    ├── Erp.Compartido/       # Trazabilidad · Seguridad (roles) · Notificaciones
    ├── Erp.Comercial/        # área Comercial (PO.02, PO.06)
    │   ├── Contratos/        #   interfaz pública del módulo
    │   ├── Crm/              #   clientes, leads, oportunidades
    │   ├── Ventas/           #   cotización (precios, descuentos, plazo, PDF), anticipo, OV y su distribución
    │   └── Postventa/        #   tickets, garantía, diagnóstico, dictamen, servicio, nota de crédito
    ├── Erp.Finanzas/         # Tesorería · CreditosCobranzas · Facturacion (PO.02.P03.SP02, PA.01)
    ├── Erp.Logistica/        # Inventarios · Despacho (PO.04, PO.05) — versión mínima en el sprint 1
    └── Erp.Planta/           # Ingenieria · Produccion (PO.01, PO.03) — versión mínima en el sprint 1
       (cada submódulo: Api/ · Servicios/ · Datos/; cada módulo: un Contratos/)
tests/
    └── Erp.Tests/            # xUnit, una carpeta por módulo y submódulo
```

*Los nombres exactos de proyectos se confirman al crear el esqueleto (S1-04) y se anotan en `docs/contexto.md`.*

## 3.2 Módulos y submódulos (D03)

| Módulo (área) | Submódulos | Documentos y características | TO-BE | Sprint 1 |
|---|---|---|---|---|
| **Comercial** | **CRM** | Clientes, leads, oportunidades | PO.02.P01.SP01 | Completo |
| | **Ventas** | Cotización (lista de precios, descuentos, plazo de entrega, PDF), registro del anticipo, orden de venta y su distribución; consulta de stock y requerimiento MTO hacia otras áreas | PO.02.P01.SP02, P02, P03.SP01, P04 | Completo |
| | **Postventa** | Tickets, garantía, diagnóstico, dictamen, orden de servicio, nota de crédito | PO.06 | Completo |
| **Finanzas** | **Tesorería** | Confirmación y conciliación de anticipos | PA.01.P01.SP02 | Versión mínima (fase C) |
| | **Créditos y Cobranzas** | Evaluación de crédito B2B; cartera y bloqueo por mora | PO.02.P03.SP02, PA.01.P03 | Crédito completo (es núcleo del TO-BE); cartera en versión mínima |
| | **Facturación** | Boletas, facturas y notas de crédito (SUNAT simulada) | PA.01.P01.SP01 | Versión mínima |
| **Logística** | **Inventarios** | Stock por sede, reservas, reposición, transferencias, cuarentena | PO.04 | Versión mínima (reservas completas) |
| | **Despacho** | Órdenes de despacho, programación, POD | PO.05 | Versión mínima |
| **Planta** | **Ingeniería** | Requerimiento técnico, especificación, BOM, costo estándar | PO.01 | Versión mínima |
| | **Producción** | Demanda, órdenes de producción, ingreso a producto terminado | PO.03 | Versión mínima |
| **Compartido** | Trazabilidad · Seguridad · Notificaciones | Historial, cadena documental, roles, avisos | Transversal | Completo |

Los nombres de los submódulos de Finanzas coinciden con los roles del TO-BE (Tesorería, Créditos y Cobranzas, Facturación).

## 3.3 Las tres capas (D05)

| Capa | Analogía | Qué hace | Qué **no** hace |
|---|---|---|---|
| **Api** (controladores) | El mesero | Recibe la petición de la pantalla, llama al servicio y devuelve la respuesta | No decide nada del negocio |
| **Servicios** | El cocinero | Aplica las reglas de negocio ("el DNI tiene 8 dígitos", "sin pago validado no hay OV") | No sabe de HTTP ni de SQL |
| **Datos** (repositorios) | La despensa | Guarda y lee de SQL Server con EF Core | No tiene reglas |

Cada submódulo tiene sus tres capas. Además, cada módulo tiene **Contratos**: la interfaz pública, lo único que otros módulos pueden usar.

## 3.4 Reglas de dependencia

1. Dentro de un módulo: **Api → Servicios → Datos**. Nunca al revés.
2. **Entre submódulos del mismo módulo** se pueden usar directamente (Postventa lee la OV de Ventas sin contrato).
3. **Entre módulos distintos**, solo por `Contratos`. **Prohibido** referenciar sus Servicios o Datos, y **prohibido** leer sus tablas.
4. `Compartido` no depende de ningún módulo; todos pueden usarlo.
5. Las pantallas solo hablan con la API (`fetch`); nunca contienen reglas de negocio.

## 3.5 Cada área se encarga de lo suyo: núcleo y versión mínima (D06)

El TO-BE Comercial describe procesos propios (núcleo) y procesos donde Comercial toca a otra área (interfaz):

| Tipo | Procesos | Cómo se construye en el sprint 1 |
|---|---|---|
| **Núcleo** | PO.02 (submódulos CRM y Ventas, más la evaluación de crédito en Finanzas › Créditos y Cobranzas) y PO.06 (submódulo Postventa) | Completo: reglas, pruebas, pantallas y fichas |
| **Interfaz** | PO.01, PO.03 (Planta) · PO.04, PO.05 (Logística) · PA.01 (Finanzas) | **Versión mínima** en el módulo de esa área, detrás de su contrato: una simulación sencilla que hace lo que el TO-BE describe con datos semilla o pasos manuales (por ejemplo, un botón "simular POD" que deja la OV en Entregada) |

Comercial nunca contiene lógica de otra área. Cuando llegue el sprint de esa área, el equipo amplía la versión mínima detrás del mismo contrato y Comercial no cambia.

## 3.6 Trazabilidad (D25)

Es la prioridad del ERP y vive en `Compartido`, para que todos los módulos la usen igual:

| Pieza | Qué guarda o muestra | Tarjeta |
|---|---|---|
| **Historial de estados** | Documento, estado anterior, estado nuevo, usuario, rol, fecha y hora, motivo. Solo se agrega; nunca se borra ni se edita | S1-08 |
| **Cadena documental** | Para cada documento, su documento de origen; permite consultar antecesores y sucesores (oportunidad → cotización → anticipo → OV → despacho → guía → POD → comprobante → cuenta por cobrar → ticket → nota de crédito) | S1-09 |
| **Ficha de documento** | Componente del front: cabecera, detalle, estado actual con historial en línea de tiempo y cadena con enlaces; imprimible | S1-17 |
| **Pantalla de trazabilidad** | Busca cualquier documento y muestra su flujo completo | S1-64 |

Cada módulo, al cambiar el estado de un documento o crear uno derivado, llama a `Compartido` (historial y cadena). Los indicadores (sección 9 del TO-BE) se calculan desde ese historial.

## 3.7 Base de datos

- Una base, un **esquema por módulo** (no por submódulo): `comercial.Cotizacion`, `comercial.Ticket`, `finanzas.LineaCredito`, `logistica.Reserva`, `compartido.HistorialEstado`.
- Un módulo no hace `JOIN` con tablas de otro. Si necesita un dato ajeno, lo pide por su contrato y guarda solo el identificador.
- Migraciones con EF Core, **creadas solo por Miguel**; se versionan en el repo.
- Datos semilla ficticios: muebles, listas de precios, sedes, usuarios de los 14 roles, stock y extracto bancario de ejemplo.

## 3.8 Cómo se integra un área nueva

1. Antes de programar, se escribe su [alcance](plan/alcance.md) y su [contrato](contratos/_plantilla.md).
2. Si el área ya tiene versión mínima (por el sprint 1), se parte de ella y se amplía detrás del mismo contrato.
3. Si necesita algo de otro módulo que aún no existe, se usa una versión mínima o un **doble de prueba** detrás de su interfaz.
4. La integración real se prueba de punta a punta en el sprint en que ambos existen.

## 3.9 Front (D13)

- **HTML + CSS propio + JavaScript**, sin frameworks, en `src/Erp.Api/wwwroot`, servido por la misma Api (sin CORS).
- Entrada: acceso simulado con los 14 roles y selector de aplicaciones (una tarjeta por módulo). Cada submódulo agrega sus pantallas en `wwwroot/<modulo>/<submodulo>/`; cada documento usa la **ficha común**.
- La demo de cada jueves exige **pantalla y API**.
- Código legible y sencillo, sin minificar, para que los PR se puedan revisar y explicar.

## 3.10 Simulaciones (D12)

Login: selector de rol. SUNAT y facturación: respuesta simulada. Banco: extracto de ejemplo. Correo y WhatsApp: bandeja de avisos y registro de envíos. App móvil: vista web adaptada a celular. Nube y datos reales: no se usan.
