# 2. Alcance

[← Índice](../../README.md)

Este documento explica **cómo** se define el alcance. El alcance concreto de cada área está en su propio documento (D21):

| Área | Semana | Fuente de verdad | Alcance |
|---|---|---|---|
| Comercial | Sprint 1: 29/10 – 18/11 (demos 05/11, 12/11 y 19/11) | [TO-BE Comercial](../fuentes/to-be-comercial.md) | [alcance/comercial.md](../alcance/comercial.md) |
| Logística | Fecha por confirmar | Por conocer; ya existe su versión mínima desde el sprint 1 | [alcance/logistica.md](../alcance/logistica.md) |
| Siguientes | 3+ | Las solicita el profesor | se crean en el `/planning` |

## 2.1 Capacidad por semana

| Dato | Valor |
|---|---|
| Personas | 3: Miguel, Luis y Pablo |
| Horas por persona por día | 2–3 h, 7 días (fines de semana incluidos) (D08) |
| Horas por persona por semana | 14–21 h |
| Total del equipo por semana | **42–63 h** (el sprint 1 se planificó con ≈ 2 h diarias por persona) |
| Aprendizaje y configuración | ≈ 40 % de la semana 1; baja en las siguientes |

Es una estimación sin medir. Cada retro la recalibra con las horas reales de la bitácora.

## 2.2 Categorías del alcance de un área

| Categoría | Qué significa | ¿Tiene tarjeta? |
|---|---|---|
| **Núcleo** | Lo que se presenta, **en pantalla y por la API** (D13), con su trazabilidad (D25). Es lo único que se compromete | Sí |
| **Si alcanza** | Procesos del área que no entran al núcleo, en orden de prioridad (no aplica en Comercial: todo es núcleo, D21) | Sí, en Backlog |
| **Versión mínima** | Procesos de otra área que el área actual necesita: simulación sencilla en el módulo dueño, detrás de su contrato (D06) | Sí |
| **Simulado** | Infraestructura real que en todo el curso se simula (D12): login, SUNAT, nube, app móvil, correo y WhatsApp, datos reales | No |

Lo que al cerrar el sprint del área no se hizo queda como **pendiente del área**, anotado en su documento de alcance, sin fecha: solo se retoma si el profesor lo pide o sobra una semana.

## 2.3 Regla de recorte

Se recorta siempre desde lo último del flujo, **nunca la base**. Cada área define su base y sus puntos de control en su documento de alcance (en un sprint de varias semanas, un punto de control por fase).

Mínimo defendible de cualquier demo: la base del área funcionando **en pantalla y por la API**, con sus reglas probadas y su trazabilidad.

## 2.4 Cómo se define el alcance de un área nueva

`/planning` (jueves, después de la presentación):

1. Pregunta qué área toca, cuál es su fuente (documento del profesor) y su fecha de presentación.
2. Guarda la fuente (o su resumen) en `docs/fuentes/` y crea `docs/alcance/<area>.md`.
3. Propone Núcleo / Si alcanza / Simulado con códigos de proceso de la fuente, la base y la regla de recorte, partiendo de la versión mínima que ya exista del área.
4. Calcula la capacidad con las horas reales de la semana anterior.
5. Deja el borrador de contrato en `docs/contratos/` y las tarjetas en `docs/plan/sprint-NN.md`.

El equipo aprueba antes de cargar las tarjetas al tablero.
