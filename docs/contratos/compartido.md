# Contrato de integración — Módulo Compartido

[← Índice](../../README.md)

**Sprint en que se construye:** 1 (29/10 – 18/11) · **Dueño del módulo:** Miguel · **Estado:** Borrador (S1-04)

## 1. Qué hace el módulo
Submódulos **Trazabilidad** (historial de estados y cadena documental), **Seguridad** (los 14 roles y sus permisos) y **Notificaciones** (bandeja por rol, correo y WhatsApp simulados): transversal a todo el ERP (D25, D12).

## 2. Qué expone (interfaz pública en `Contratos`)
| Operación | Entrada | Salida | Quién la usa | Estado |
|---|---|---|---|---|
| `RegistrarCambioDeEstado` | documento, estado anterior y nuevo, usuario, rol, fecha y hora, motivo | entrada de historial (solo se agrega) | Todos los módulos | Fase A (S1-08) |
| `ObtenerHistorial` | documento | línea de tiempo de estados | Fichas y pantalla de trazabilidad | Fase A (S1-08) |
| `RegistrarOrigen` | documento derivado, documento de origen | vínculo de la cadena | Todos los módulos | Fase A (S1-09) |
| `ObtenerCadena` | documento | antecesores y sucesores | Fichas y pantalla de trazabilidad | Fase A (S1-09) |
| `ValidarPermiso` | rol, acción | permitido o denegado | Todos los módulos | Fase A (S1-18) |
| `EnviarAviso` | canal, destinatario, mensaje | registro del envío simulado y aviso en la bandeja | Todos los módulos | Fase B (S1-31) |

## 3. Qué consume de otros módulos
Nada: `Compartido` no depende de ningún módulo (regla 3.4.4 de la arquitectura). Los demás lo usan directamente.

## 4. Datos maestros
- **Historial, cadena, roles, permisos y avisos:** dueño `Compartido`.
- **Usuario y rol:** datos semilla con los 14 roles del TO-BE (D12).

## 5. Cambios de estado que otros módulos esperan
- Todo cambio de estado y todo documento derivado queda registrado aquí; de eso viven las fichas, la pantalla de trazabilidad y los indicadores.

## 6. Reglas de integración en el catálogo
`TRZ-01`, `TRZ-02`, `TRZ-03` en [docs/reglas.md](../reglas.md).

## 7. Cambios acordados
*(ninguno todavía)*
