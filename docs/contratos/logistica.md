# Contrato de integración — Módulo Logística

[← Índice](../../README.md)

**Sprint en que se construye:** 1 (29/10 – 18/11) · **Dueño del módulo:** Miguel · **Estado:** Borrador (S1-04)

## 1. Qué hace el módulo
Submódulos **Inventarios** (stock por sede, reservas, reposición, transferencias y cuarentena) y **Despacho** (órdenes de despacho, programación y POD): `PO.04` y `PO.05`, en la versión mínima que pide [Comercial](../alcance/comercial.md) (D06).

## 2. Qué expone (interfaz pública en `Contratos`)
| Operación | Entrada | Salida | Quién la usa | Estado |
|---|---|---|---|---|
| `ConsultarStock` | producto, sede | cantidad disponible y comprometida | Comercial › Ventas al cotizar | Fase B (S1-38) |
| `Reservar` | producto, sede, cantidad | reserva Activa con vencimiento | Comercial › Ventas | Fase B (S1-39) |
| `ConfirmarReserva` | reserva | reserva Comprometida (firme con la OV) | Comercial › Ventas | Fase B (S1-39) |
| `LiberarOrdenDespacho` | orden de venta confirmada | orden de despacho Creada | Comercial › Ventas | Fase C (S1-48) |
| `RegistrarPod` | orden de despacho, firma y foto simuladas | POD registrado; la OV pasa a Entregada | Comercial › Ventas | Fase C (S1-48) |
| `MoverStockCuarentena` | producto, sede, cantidad | stock Bloqueado o liberado según Calidad | Comercial › Postventa | Fase C (S1-62) |
| `SugerirReposicion` | punto de reorden | solicitud Sugerida → Aprobada | Tablero por rol | Fase C (S1-47) |

## 3. Qué consume de otros módulos
| Módulo | Operación | Para qué | Mientras no exista (doble de prueba) |
|---|---|---|---|
| Comercial › Ventas | `ObtenerOrdenVentaConfirmada`, cliente y dirección | Armar la orden de despacho y el POD | — (se construye en la fase A) |
| Planta › Producción | ingreso a producto terminado | Sumar stock al cerrar una orden de producción | Versión mínima de Planta (S1-42) |
| Compartido | `RegistrarCambioDeEstado`, `RegistrarOrigen` | Historial y cadena (D25) | — (se construye en la fase A) |

## 4. Datos maestros
- **Stock por sede, reserva, guía de remisión, orden de despacho y POD:** dueño Logística.
- **Producto y lista de precios:** dueño Comercial en el sprint 1 (datos semilla).
- **Sede:** dato semilla; candidato a `Compartido`.

## 5. Cambios de estado que otros módulos esperan
- Reserva **Comprometida** → Ventas puede confirmar la OV.
- OV **Entregada** (POD) → Finanzas emite el comprobante y Postventa cuenta la garantía desde esa fecha.
- Stock **Bloqueado** → Calidad decide reproceso, saldo o baja.

## 6. Reglas de integración en el catálogo
`STK-01`, `RES-01`, `DES`, `MOR` (reserva y despacho) en [docs/reglas.md](../reglas.md).

## 7. Cambios acordados
*(ninguno todavía)*

> La fuente de verdad de Logística aún no está confirmada (D02): estas operaciones son un supuesto y se revisan cuando llegue el área.
