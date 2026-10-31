# Alcance — Área Comercial

[← Índice](../../README.md) · [Cómo se define el alcance](../plan/alcance.md)

**Sprint:** 1, de 3 semanas (jueves 29/10 – miércoles 18/11) · **Demos:** 05/11, 12/11 y 19/11 · **Fuente de verdad:** [TO-BE Comercial](../fuentes/to-be-comercial.md) (D02) · **Tarjetas:** [sprint-01](../plan/sprint-01.md) · **Contrato:** [comercial](../contratos/comercial.md)

## Núcleo: todo el TO-BE Comercial (D19, D21)

El sprint cubre los 35 microprocesos, los 25 registros con sus estados, los 14 roles, las pantallas de la sección 7, los 9 indicadores y la prueba final con un caso MTS y uno MTO. En esta área no hay "Si alcanza": todo es núcleo, repartido en tres fases.

| Fase | Demo | Qué entra | Procesos del TO-BE |
|---|---|---|---|
| **A** | 05/11 | Venta retail MTS de punta a punta: cliente, oportunidad, lista de precios, cotización con plazo de entrega y envío simulado, anticipo y OV. Historial, cadena documental, fichas y los 14 roles | PO.02.P01.SP01.A01 · PO.02.P02.SP01.A01 · PO.02.P02.SP02.A01–A02 · PO.02.P03.SP01.A01 · PO.02.P04.SP01.A01 |
| **B** | 12/11 | Estados completos de la oportunidad, leads B2B, listas de precios, descuentos con aprobación, PDF oficial, notificaciones y recordatorios, crédito y mora, stock y reservas, distribución de la OV y caso MTO con Planta (Ingeniería y Producción en versión mínima) | PO.02.P01.SP01.A02 · PO.02.P01.SP02.A01–A02 · PO.02.P02.SP01.A02 · PO.02.P03.SP02.A01 · PO.02.P04.SP01.A02 · PO.01 · PO.03 |
| **C** | 19/11 | Logística (reposición, transferencias, despacho y POD) y Finanzas (comprobantes, conciliación, cartera) en versión mínima; **Postventa completa**; pantalla de trazabilidad; tablero por rol; indicadores; prueba final MTS + MTO | PO.04 · PO.05 · PA.01 · PO.06 (11 microprocesos) |

**Núcleo y versión mínima (D06).** PO.02 y PO.06 son el núcleo del TO-BE y se construyen completos: en el módulo Comercial (submódulos **CRM**, **Ventas** y **Postventa**) y la evaluación de crédito en **Finanzas › Créditos y Cobranzas** (D03). Los procesos marcados como **interfaz** se construyen como **versión mínima** en el módulo de su área, detrás de su contrato:
- PO.01 Ingeniería y PO.03 Producción, en Planta;
- PO.04 Inventarios y PO.05 Despacho, en Logística;
- PA.01 Finanzas, en Finanzas (Tesorería, Cobranzas y Facturación). En la fase C la confirmación del anticipo pasa de Ventas a Tesorería (D17).

Cada versión mínima es una simulación sencilla que hace lo que describe el TO-BE. Cuando llegue el sprint de esa área, el equipo la amplía.

**Trazabilidad en todo (D25).** Cada documento, del núcleo o de una versión mínima, guarda su historial y su cadena documental, y tiene su ficha.

## Simulado (todo el curso, D12)

- **Login real:** se usa un selector con los 14 roles.
- **SUNAT y facturación electrónica:** respuesta simulada.
- **Banco:** extracto de ejemplo.
- **Correo y WhatsApp:** bandeja de avisos y registro de envíos.
- **App móvil del chofer y del técnico:** vista web adaptada a celular.
- **Nube y datos reales:** no se usan; los datos son ficticios.

## Regla de recorte

Se recorta dentro de cada fase, siempre desde lo último del flujo, nunca la base. La base de todo el sprint es **Cliente → Precios → Cotización → historial y ficha**.

| Punto de control | Situación | Acción |
|---|---|---|
| **Fase A, domingo 01/11** | El esqueleto, el historial (S1-08) o Cliente no están en `main` | Luis y Pablo trabajan en pareja con Miguel hasta cerrarlos |
| **Fase A, martes 03/11** | Anticipo u OV no están en `main` | La demo del 05/11 llega hasta "cotización aceptada" con su ficha; anticipo y OV pasan al inicio de la fase B |
| **Fase B, lunes 09/11** | El caso MTO no está completo | Se presenta MTS con reservas y lo que exista de MTO; lo pendiente pasa al inicio de la fase C |
| **Fase C, lunes 16/11** | Postventa o las versiones mínimas no están completas | Se prioriza la cadena OV → despacho → POD → comprobante → ticket con su trazabilidad; indicadores y tablero por rol se presentan parciales |

Lo que no llegue al 18/11 queda como **pendiente del área**, en esta misma página.

## Pendientes del área

*(se completa el miércoles de cada fase con lo que no se haya hecho)*
