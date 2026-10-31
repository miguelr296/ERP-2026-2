# 1. Enfoque

[← Índice](../../README.md)

## 1.1 Objetivo

Hacer **el mejor intento funcional** de un ERP para FAMIHOGAR, aprendiendo sobre la marcha (D01). No se busca un ERP robusto ni vendible: se busca entender los grandes procesos de una empresa y convertirlos en un sistema que funcione. Cada jueves se presenta el avance en pantalla y por la API. El **sprint 1 cubre todo el TO-BE Comercial** en 3 semanas (demos 05/11, 12/11 y 19/11); la fecha de Logística y de las áreas siguientes está por confirmar. Lo más valioso del sistema es la **trazabilidad** de cada documento (D25).

## 1.2 Cómo trabajamos

| Mecanismo | Cómo se aplica |
|---|---|
| Memoria en archivos | `BITACORA.md`, `docs/contexto.md`, `decisiones.md`: cualquiera (persona o IA) retoma en 5 min |
| Alcance por área | Cada área tiene su fuente de verdad y su alcance (Núcleo / Si alcanza / Simulado) con regla de recorte |
| Tarjetas pequeñas con definición de terminado | 1–1,5 h, una por sesión, criterio de aceptación en una frase; el tablero de GitHub manda |
| Trazabilidad | tarjeta → rama → PR → prueba → regla → origen en la fuente → decisión → capítulo → tag |
| Decisiones con historia | Una decisión que cambia se modifica con fecha, sin perder el texto original (D24) |
| El asistente propone, el humano aprueba | Formato 📌; la IA solo escribe código repetitivo y siempre pregunta antes |

## 1.3 Por qué así (es un ERP que crece por áreas)

| Necesidad | Pieza |
|---|---|
| Las áreas comparten datos y se integran después | Módulo `Compartido` y [contratos de integración](../contratos/_plantilla.md) desde el primer módulo |
| Fronteras entre áreas dentro de un solo sistema | Esquema SQL por módulo y regla "solo por interfaz pública" ([arquitectura](../arquitectura.md)) |
| El conocimiento son reglas de empresa | Catálogo de reglas con fuente `NORMA` / `TO-BE` / `SUPUESTO` |
| Las áreas se agregan una tras otra | Comando `/planning`: lee la fuente del área y propone alcance, tarjetas y contrato, partiendo de su versión mínima |
| Demo cada jueves, sesiones de 2–3 h por persona | Ceremonias mínimas y regla de recorte con un punto de control por fase |
| Datos persistentes | Base SQL Server con migraciones |
| Se presenta en pantalla y API | Front sencillo (HTML + CSS + JS) servido por la misma Api |

## 1.4 Criterio de éxito de cada demo

El jueves, lo planificado para esa fase corre de punta a punta en un guion de demo, **en pantalla y por la API**, con sus reglas probadas y documentadas, la cadena de cada documento reconstruible desde su ficha, y el tag `semana-NN` creado.
