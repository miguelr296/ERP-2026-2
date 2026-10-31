# Contrato de integración — Módulo Finanzas

[← Índice](../../README.md)

**Sprint en que se construye:** 1 (29/10 – 18/11) · **Dueño del módulo:** Miguel · **Estado:** Borrador (S1-04)

## 1. Qué hace el módulo
Submódulos **Tesorería** (confirmación y conciliación de anticipos), **Créditos y Cobranzas** (crédito B2B, cartera y bloqueo por mora) y **Facturación** (boletas, facturas y notas de crédito): `PA.01` y `PO.02.P03.SP02`, con la versión mínima que pide [Comercial](../alcance/comercial.md) (D06).

## 2. Qué expone (interfaz pública en `Contratos`)
| Operación | Entrada | Salida | Quién la usa | Estado |
|---|---|---|---|---|
| `ConsultarCredito` | cliente, monto | línea disponible, mora y decisión (automática o del rol Créditos) | Comercial › Ventas | Fase B (S1-36) |
| `ConfirmarAnticipo` | anticipo registrado | anticipo con pago validado | Comercial › Ventas | Fase A desde Ventas; desde la fase C aquí (S1-50, D17) |
| `ConciliarAnticipo` | anticipo, extracto bancario | anticipo Conciliado | Comercial › Ventas | Fase C (S1-50) |
| `EmitirComprobante` | orden de venta | boleta o factura con respuesta SUNAT simulada | Comercial › Ventas | Fase C (S1-49) |
| `EmitirNotaCredito` | RMA aprobada | nota de crédito aplicada a la cuenta del cliente | Comercial › Postventa | Fase C (S1-61) |
| `ConsultarCartera` | cliente, fecha | cuentas por cobrar Vigente / Vencida / Pagada | Comercial, tablero por rol | Fase C (S1-50) |

## 3. Qué consume de otros módulos
En el sprint 1 cada operación la atiende la **versión mínima** del módulo dueño (D06).

| Módulo | Operación | Para qué | Mientras no exista (doble de prueba) |
|---|---|---|---|
| Comercial › Ventas | `ObtenerOrdenVentaConfirmada` | Emitir el comprobante sin redigitar y generar la cuenta por cobrar | — (se construye en la fase A) |
| Comercial › Ventas | anticipo registrado | Confirmarlo (fase A) y conciliarlo (fase C) | — (fase A) |
| Comercial › Postventa | dictamen con RMA aprobada | Emitir la nota de crédito | — (fase C) |
| Logística › Despacho | POD de la entrega | Fecha de entrega para el comprobante y la garantía | Versión mínima de Logística (S1-48) |
| Compartido | `RegistrarCambioDeEstado`, `RegistrarOrigen` | Historial y cadena de cada documento (D25) | — (se construye en la fase A) |

## 4. Datos maestros
- **Anticipo, comprobante, nota de crédito, línea de crédito y cuenta por cobrar:** dueño Finanzas.
- **Cliente:** dueño Comercial; Finanzas guarda solo su identificador.
- **Extracto bancario:** dato semilla simulado (D12).

## 5. Cambios de estado que otros módulos esperan
- Anticipo **Pago validado** → Ventas puede convertir la cotización en OV.
- Cliente **bloqueado por mora** → Ventas no cotiza ni convierte a OV (`MOR-01`).
- Comprobante **Aceptado por SUNAT** → la OV pasa a Facturada y nace la cuenta por cobrar.

## 6. Reglas de integración en el catálogo
`CRE-01`, `MOR-01`, `FAC-01` en [docs/reglas.md](../reglas.md).

## 7. Cambios acordados
*(ninguno todavía)*
