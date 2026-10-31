# Fuente — Resumen verificado del TO-BE comercial

[← Índice](../../README.md)

Fuente de verdad del **área Comercial** (D02). Resumen del **Documento TO BE – Área Comercial FAMIHOGAR** (87 págs., 28/10/2026), pensado para no leer el PDF completo. Si algo no coincide, manda el PDF (`docs/fuentes/Documento_TO_BE_FAMIHOGAR.pdf`). Las páginas son las del propio documento.

Alcance del TO-BE: 7 macroprocesos, 18 procesos, 25 subprocesos, 35 microprocesos. El TO-BE recomienda construir el prototipo "empezando por PO.02" y probar luego un caso MTS y uno MTO (pág. 87).

## Registros y estados que el prototipo debe modelar (págs. 5–6)

| Registro | Estados |
|---|---|
| Cliente | Activo → Bloqueado por mora → Activo |
| Oportunidad | Nueva → Calificada → Con fecha → Ganada / Perdida |
| Lista de precios | Vigente / Vencida |
| Cotización | Borrador → Aprobada → Enviada → Aceptada / Rechazada / Vencida |
| Pago (anticipo) | Registrado → Conciliado → Confirmado |
| Orden de venta | Registrada → Liberada → En proceso → En preparación / Lista para despacho → Entregada → Facturada |
| Reserva de stock | Activa → Comprometida → Consumida / Liberada |
| Solicitud de descuento | Pendiente → Aprobada / Rechazada |

## Roles (págs. 4–5)

Asesor de ventas (crea clientes, oportunidades, cotizaciones, anticipos y OV), Jefatura de Ventas (aprueba descuentos dentro de su límite), Gerencia Comercial (descuentos sobre ese límite), Tesorería (confirma abonos), Créditos y Cobranzas (excepciones de crédito). El TO-BE recomienda un tablero inicial por rol (pág. 86).

## Microprocesos de PO.02 que entran a la semana 1

| Código | Pág. | Qué hace el sistema | Resuelve |
|---|---|---|---|
| PO.02.P01.SP01.A01 | 15 | El vendedor busca al cliente por DNI o RUC y lo crea si no existe; registra la oportunidad con productos; el ERP asigna canal, sede y vendedor | Clientes retail sin registro |
| PO.02.P02.SP01.A01 | 22 | El ERP toma la lista vigente según canal y tipo de cliente; el precio queda bloqueado para edición manual | Precios desde Excel desactualizados |
| PO.02.P02.SP02.A01 | 25 | El ERP crea la cotización desde la oportunidad, con correlativo y vigencia; calcula impuestos y plazo de entrega; genera el PDF con plantilla oficial | Cotizaciones en Word sin número |
| PO.02.P02.SP02.A02 | 26–27 | El ERP envía la cotización y la marca "Enviada"; genera recordatorios al vendedor; registra el resultado: aceptada, rechazada con motivo o vencida | Cotizaciones sin seguimiento ni motivo de pérdida |
| PO.02.P03 | 27 | **Compuerta obligatoria:** ninguna cotización aceptada pasa a OV sin anticipo confirmado o crédito aprobado | — |
| PO.02.P03.SP01.A01 | 29 | El vendedor registra el anticipo con su comprobante; Tesorería lo confirma contra el banco; el ERP marca la cotización "Pago validado" y habilita la conversión | Pedidos producidos sin pago confirmado |
| PO.02.P04.SP01.A01 | 34 | El vendedor convierte la cotización validada con un clic; el ERP copia cliente, líneas y precios; la OV queda "Confirmada" y la reserva se vuelve firme | Doble digitación |

## Microprocesos que quedan como Si alcanza

El orden de prioridad está en [alcance/comercial.md](../alcance/comercial.md).

| Código | Pág. | Resumen | Categoría |
|---|---|---|---|
| PO.02.P01.SP01.A02 | 16–17 | Solicitudes corporativas B2B como leads | Si alcanza (5) |
| PO.02.P01.SP02.A01 | 18 | Consulta de stock multisede y reserva con vencimiento | Si alcanza (3, solo lectura); la reserva depende de Logística |
| PO.02.P01.SP02.A02 | 19–20 | Costeo de proyectos MTO con Ingeniería | Si alcanza (7) |
| PO.02.P02.SP01.A02 | 23–24 | Descuentos con límite por rol y aprobación auditada | Si alcanza (4) |
| PO.02.P03.SP02.A01 | 31 | Crédito B2B automático y bloqueo por mora | Si alcanza (6) |
| PO.02.P04.SP01.A02 | 35 | MTS: libera orden de despacho; MTO: crea demanda; notifica al cliente | Si alcanza (8); necesita a Logística |

## Pantallas del prototipo para Comercial (págs. 85–86)

Clientes, Leads, Oportunidades (CRM); Listas de precios y Solicitudes de descuento; Cotizaciones (lista y detalle); Anticipos y Evaluación de crédito (Tesorería); OV (lista y detalle). Reglas a simular: asignar canal/sede/vendedor, lista vigente por canal, correlativo, vigencia, impuestos, bloqueo de conversión sin pago, copia de datos a la OV.

## Indicadores (pág. 87)

Tasa de conversión (cotizaciones aceptadas / enviadas), tiempo de respuesta de cotización, tiempo de validación de pago, descuento promedio fuera de lista. Las metas no están fijadas.

## Inconsistencias detectadas en el TO-BE

1. **Estado inicial de la OV:** la tabla de estados dice "Registrada" y el microproceso `PO.02.P04.SP01.A01` dice "Confirmada" → se usa "Confirmada" (D15).
2. **Estado "Aprobada" de la cotización:** está en la tabla de estados, pero el microproceso de generación (`PO.02.P02.SP02.A01`) no dice cuándo ocurre → en el prototipo pasa automática si no hay descuento pendiente (D14).
3. **Plazos y porcentajes:** no hay plazo de vigencia ni porcentaje de anticipo → son SUPUESTO (COT-02, PAG-04).
