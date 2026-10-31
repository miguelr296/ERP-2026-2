# Anexo A — Catálogo de reglas de negocio

[← Índice](../README.md)

Cada regla debe tener: módulo, condición y conclusión, fuente, tipo de fuente, origen (microproceso del TO-BE en Comercial; el código equivalente de la fuente de cada área) y prueba xUnit.

**Tipo de fuente:**
- `NORMA`: ley o formato oficial (SUNAT, RENIEC).
- `TO-BE`: lo dice el [Documento TO-BE](fuentes/to-be-comercial.md) (fuente del área Comercial).
- Cuando Logística tenga fuente, se agrega aquí su tipo.
- `SUPUESTO`: decisión del equipo, sin respaldo en norma ni en el TO-BE. Se presenta como tal.

**Estado:** ⬜ pendiente · 🟨 en curso · ✅ con prueba pasando. Los nombres de prueba son la convención `Clase_Condicion_Resultado` y se ajustan al implementar.

## Comercial — Cliente y oportunidad (fase A: S1-10, S1-12)

| ID | Regla | Tipo | Microproceso / origen | Prueba | Estado |
|---|---|---|---|---|---|
| CLI-01 | Se busca al cliente por DNI o RUC; si no existe, se crea | TO-BE | PO.02.P01.SP01.A01 | `ClienteService_DocumentoInexistente_CreaCliente` | ⬜ |
| CLI-02 | El DNI tiene 8 dígitos y el RUC 11, solo numéricos | NORMA | Formato oficial de documento (RENIEC / SUNAT) | `Cliente_DniNoTieneOchoDigitos_EsRechazado` | ⬜ |
| CLI-03 | No se repite el documento: un cliente, una ficha | TO-BE | Sección 2 (CRM: "ficha única de cliente") | `ClienteService_DocumentoRepetido_EsRechazado` | ⬜ |
| OPO-01 | La oportunidad nace en estado "Nueva" con los productos de interés | TO-BE | PO.02.P01.SP01.A01 | `OportunidadService_Crear_EstadoNueva` | ⬜ |
| OPO-02 | Al registrar la oportunidad se asignan canal, sede y vendedor (en el prototipo: canal Retail, sede y vendedor del usuario simulado) | TO-BE | PO.02.P01.SP01.A01 | `OportunidadService_Crear_AsignaCanalSedeVendedor` | ⬜ |
| OPO-03 | La oportunidad pasa a "Ganada" al crearse la OV | SUPUESTO | Sección 4: la tabla de estados no dice qué evento la gana | `OportunidadService_OvCreada_EstadoGanada` | ⬜ |

## Comercial — Precios y cotización (fase A: S1-11, S1-13, S1-14)

| ID | Regla | Tipo | Microproceso / origen | Prueba | Estado |
|---|---|---|---|---|---|
| PRE-01 | El precio sale de la lista vigente según canal y tipo de cliente | TO-BE | PO.02.P02.SP01.A01 | `PrecioService_ListaVigenteRetail_DevuelvePrecio` | ⬜ |
| PRE-02 | El precio de una línea no se edita a mano | TO-BE | PO.02.P02.SP01.A01 | `Cotizacion_EditarPrecioManual_EsRechazado` | ⬜ |
| PRE-03 | Solo las listas "Vigentes" se aplican; las "Vencidas" no | TO-BE | Sección 4 (Lista de precios) | `PrecioService_ListaVencida_NoSeAplica` | ⬜ |
| COT-01 | La cotización se crea desde la oportunidad con correlativo único (formato `COT-AAAA-NNNNN`) | TO-BE | PO.02.P02.SP02.A01 (el formato es SUPUESTO) | `CotizacionService_Crear_AsignaCorrelativoUnico` | ⬜ |
| COT-02 | La cotización tiene vigencia de 15 días, configurable | SUPUESTO | PO.02.P02.SP02.A01 pide vigencia pero no fija el plazo | `Cotizacion_Crear_VigenciaQuinceDias` | ⬜ |
| COT-03 | IGV = 18 % del subtotal; total = subtotal + IGV | NORMA | Ley del IGV (16 % + 2 % IPM) | `Cotizacion_CalcularTotal_AplicaIgv18` | ⬜ |
| COT-04 | Estados: Borrador → Aprobada → Enviada → Aceptada / Rechazada / Vencida. Sin descuento pendiente, pasa a Aprobada sola (D14) | TO-BE | Sección 4; el paso automático es SUPUESTO | `Cotizacion_TransicionInvalida_EsRechazada` | ⬜ |
| COT-05 | Rechazar una cotización exige un motivo | TO-BE | PO.02.P02.SP02.A02 | `Cotizacion_RechazarSinMotivo_EsRechazado` | ⬜ |
| COT-06 | Una cotización "Enviada" con vigencia vencida pasa a "Vencida" (se evalúa al consultarla) | TO-BE | PO.02.P02.SP02.A02 (el mecanismo es SUPUESTO) | `Cotizacion_EnviadaVigenciaVencida_PasaAVencida` | ⬜ |
| COT-07 | La cotización muestra el plazo de entrega (días configurables por tipo MTS / MTO) | TO-BE | PO.02.P02.SP02.A01 paso 2 (el plazo es SUPUESTO) | `Cotizacion_Crear_CalculaPlazoEntrega` | ⬜ |

## Comercial — Anticipo (fase A: S1-15)

| ID | Regla | Tipo | Microproceso / origen | Prueba | Estado |
|---|---|---|---|---|---|
| PAG-01 | El anticipo se registra con su comprobante (número de operación) | TO-BE | PO.02.P03.SP01.A01 | `PagoService_RegistrarSinComprobante_EsRechazado` | ⬜ |
| PAG-02 | Tesorería confirma el anticipo: Registrado → Confirmado (D17: desde Ventas en la fase A, desde Finanzas › Tesorería en la fase C) | TO-BE | PO.02.P03.SP01.A01 | `PagoService_ConfirmarComoAsesor_EsRechazado` | ⬜ |
| PAG-03 | Al confirmar el anticipo, la cotización queda marcada "Pago validado" | TO-BE | PO.02.P03.SP01.A01 | `PagoService_Confirmar_MarcaPagoValidado` | ⬜ |
| PAG-04 | El anticipo mínimo es 50 % del total de la cotización, configurable | SUPUESTO | D18 | `PagoService_AnticipoMenorAlMinimo_EsRechazado` | ⬜ |
| PAG-05 | El anticipo solo se registra sobre una cotización "Aceptada" | SUPUESTO | PO.02.P03 (orden implícito del proceso) | `PagoService_CotizacionNoAceptada_EsRechazado` | ⬜ |

## Comercial — Orden de venta (fase A: S1-16)

| ID | Regla | Tipo | Microproceso / origen | Prueba | Estado |
|---|---|---|---|---|---|
| OV-01 | Ninguna cotización pasa a OV sin "Pago validado" | TO-BE | PO.02.P03 (introducción) y PO.02.P04.SP01.A01 | `OrdenVentaService_SinPagoValidado_EsRechazada` | ⬜ |
| OV-02 | Solo se convierte una cotización "Aceptada" y vigente | TO-BE | PO.02.P03 (introducción) | `OrdenVentaService_CotizacionNoAceptada_EsRechazada` | ⬜ |
| OV-03 | La OV copia cliente, líneas y precios de la cotización, sin volver a digitar | TO-BE | PO.02.P04.SP01.A01 | `OrdenVentaService_Convertir_CopiaClienteLineasYPrecios` | ⬜ |
| OV-04 | La OV nace "Confirmada" (D15) | TO-BE | PO.02.P04.SP01.A01 | `OrdenVentaService_Convertir_EstadoConfirmada` | ⬜ |
| OV-05 | Una cotización genera una sola OV | SUPUESTO | Evita doble conversión | `OrdenVentaService_ConvertirDosVeces_EsRechazada` | ⬜ |

OPO-03 (oportunidad "Ganada" al crear la OV) se implementa en S1-16.

## Fases B y C (Comercial y versiones mínimas de otras áreas)

Se implementan en las fases B y C del sprint 1 (ver [alcance Comercial](alcance/comercial.md)). Los nombres de prueba se ajustan al implementar; cada tarjeta agrega aquí las reglas nuevas que descubra.

**Dónde vive cada regla (D03):** LEAD, DES, MTO-01 y DIS-01 en Comercial › CRM y Ventas; REC, GAR y NC en Comercial › Postventa; CRE-01 y MOR-01 en Finanzas › Créditos y Cobranzas; FAC-01 en Finanzas › Facturación; STK-01 y RES-01 en Logística › Inventarios.

| ID | Regla | Tipo | Microproceso / origen | Tarjeta | Estado |
|---|---|---|---|---|---|
| STK-01 | El stock por sede se consulta a Logística por su contrato; Comercial no lee tablas de inventario | TO-BE | PO.02.P01.SP02.A01; D06 | S1-38 | ⬜ |
| DES-01 | Una solicitud de descuento exige motivo | TO-BE | PO.02.P02.SP01.A02 | S1-27 | ⬜ |
| DES-02 | Un descuento dentro del límite del rol se aplica solo; fuera del límite queda Pendiente (límites en configuración) | TO-BE | PO.02.P02.SP01.A02 (los límites son SUPUESTO) | S1-27 | ⬜ |
| DES-03 | Jefatura aprueba dentro de su límite y Gerencia por encima; queda usuario y hora | TO-BE | PO.02.P02.SP01.A02; sección 3 | S1-28 | ⬜ |
| LEAD-01 | Un lead que no califica se cierra con motivo | TO-BE | PO.02.P01.SP01.A02 | S1-24 | ⬜ |
| LEAD-02 | Un lead que califica crea una oportunidad B2B con empresa y contacto | TO-BE | PO.02.P01.SP01.A02 | S1-24 | ⬜ |
| MOR-01 | Un cliente "Bloqueado por mora" no cotiza ni convierte a OV | TO-BE | PO.02.P03.SP02.A01; PA.01.P03.SP01.A01 | S1-36 | ⬜ |
| CRE-01 | La cotización pasa a OV con anticipo confirmado **o** crédito aprobado (línea disponible ≥ total y sin mora) | TO-BE | PO.02.P03; PO.02.P03.SP02.A01 | S1-36 | ⬜ |
| MTO-01 | La cotización MTO usa el costo base publicado por Ingeniería más el margen configurado | TO-BE | PO.02.P01.SP02.A02; PO.02.P02.SP01.A01 paso 2 | S1-35 | ⬜ |
| RES-01 | La reserva vence sola si no se confirma la OV a tiempo, y se vuelve firme al confirmarse | TO-BE | PO.02.P01.SP02.A01; PO.02.P04.SP01.A01 paso 3 | S1-39 | ⬜ |
| DIS-01 | Al confirmarse la OV: MTS libera orden de despacho, MTO crea demanda | TO-BE | PO.02.P04.SP01.A02 | S1-41 | ⬜ |
| FAC-01 | El comprobante se genera desde la OV sin redigitar: boleta con DNI, factura con RUC | TO-BE | PA.01.P01.SP01.A01 | S1-49 | ⬜ |
| REC-01 | El ticket de reclamo se vincula a la OV y al producto y recibe un número único | TO-BE | PO.06.P01.SP01.A02 | S1-53 | ⬜ |
| GAR-01 | La garantía se calcula desde la fecha del POD; vencida → servicio con costo | TO-BE | PO.06.P02.SP01.A01 | S1-56 | ⬜ |
| NC-01 | Una nota de crédito exige aprobación de Jefatura antes de emitirse | TO-BE | PO.06.P03.SP02.A01 | S1-61 | ⬜ |

## Trazabilidad — transversal (fase A: S1-08, S1-09)

| ID | Regla | Tipo | Origen | Prueba | Estado |
|---|---|---|---|---|---|
| TRZ-01 | Todo cambio de estado y toda aprobación registran estado anterior, estado nuevo, usuario, rol, fecha y hora, y motivo | TO-BE | Sección 2 (principios: "toda aprobación queda en el sistema con usuario y hora"); D25 | `Historial_CambioDeEstado_RegistraUsuarioYFecha` | ⬜ |
| TRZ-02 | Todo documento derivado guarda su documento de origen | TO-BE | Sección 2 ("un dato se digita una sola vez"); D25 | `CadenaDocumental_DocumentoDerivado_GuardaOrigen` | ⬜ |
| TRZ-03 | El historial no se borra ni se modifica | SUPUESTO | D25 | `Historial_IntentoDeEditar_EsRechazado` | ⬜ |
