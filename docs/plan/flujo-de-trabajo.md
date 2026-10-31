# 4. Flujo de trabajo

[← Índice](../../README.md)

## 4.0 Equipo y responsabilidades (D20)

| Persona | Experiencia | Responsabilidades fijas |
|---|---|---|
| **Miguel** | C# | **Más horas.** Responsable técnico: esqueleto, `DbContext` y migraciones (solo él), trazabilidad en `Compartido`, anticipo, crédito, OV, descuentos, versiones mínimas de Planta, Logística y Finanzas, nota de crédito, indicadores; revisión de PR que tocan reglas, `Compartido` o migraciones (≈ 3 h en el sprint 1) |
| **Luis** | POO (sin experiencia en front) | **Segundo en horas.** Cliente, oportunidad, leads, recepción de reclamos (bandeja, ticket, categoría), servicio técnico; dueño de los archivos comunes del front, de la ficha común, de las pantallas de simulación, de la pantalla de trazabilidad y del tablero por rol |
| **Pablo** | POO | **Tercero en horas.** Precios, cotización, PDF, notificaciones, evaluación de reclamos (garantía, diagnóstico, dictamen), pantallas de Postventa; capítulos semanales del sprint 1 |

Cada integrante hace su pieza completa: reglas, pruebas, endpoint, pantalla y ficha del documento. Luis y Pablo se revisan entre sí los PR que no tocan reglas, `Compartido` ni migraciones.

## 4.1 Sprints y tablero

El trabajo se organiza en [sprints](sprints.md) y se gestiona en el [tablero Kanban](kanban.md), que es la fuente de verdad de las tarjetas. El sprint 1 (TO-BE Comercial) dura 3 semanas, con una demo cada jueves. Regla: **1 tarjeta en curso por persona**.

## 4.2 Semana tipo (2–3 h diarias por persona, D08)

| Día | Qué pasa |
|---|---|
| **Jueves** (clase) | **Demo** del avance en pantalla y API. Enseguida: retro corta (15 min) con `/retro`; al terminar un área, planning (20 min) de la siguiente con `/planning` |
| **Viernes a martes** | Una sesión diaria de 2–3 h que encadena tarjetas, de una en una |
| **Punto de control** | Uno por fase, según la regla de recorte del [alcance del área](../alcance/comercial.md#regla-de-recorte) |
| **Miércoles** | Prueba de punta a punta, ensayo de la demo, capítulo semanal y tag |

Los fines de semana se trabajan (7 días), así que **no hay colchón oculto**: el colchón es la regla de recorte.

## 4.3 Rutina de cada sesión

1. **Retomar (5 min):** `/iniciar`, que pregunta quién eres, o leer el último "siguiente paso" de la [bitácora](../../BITACORA.md).
2. **Trabajar:** una tarjeta a la vez, con un resultado visible (una prueba que pasa, un endpoint que responde, una ficha que muestra su historial).
3. **Cerrar (10–15 min):** `dotnet build` y `dotnet test`, commit, PR, y `/cierre`: **explicas con tus palabras lo que hiciste** y se escribe la bitácora con tu nombre y horas.

Trabado más de 20 min: se anota y se consulta.

## 4.4 Git (D23)

- `main` **siempre funciona** (se recomienda protegerla: PR obligatorio).
- Luis y Pablo son **colaboradores del repo**; no se usan forks.
- Una rama por tarea dentro del repo: `nombre/tarea` (ej. `luis/reglas-cliente`).
- PR revisado por otro integrante. Si toca reglas de negocio, `Compartido` o migraciones, **revisa Miguel**; los demás PR pueden revisarse entre Luis y Pablo.
- **Un archivo, un dueño por semana**, por módulo y por capa. `DbContext` y migraciones: solo Miguel.
- Commits pequeños con prefijo: `feat:`, `fix:`, `test:`, `docs:`, `chore:`.
- Tag `semana-NN` al cerrar cada semana, y `final` al terminar el curso.

## 4.5 Pruebas

- xUnit sobre la capa de **Servicios**, con objetos simples o repositorios falsos (sin base de datos).
- **Cada regla del catálogo tiene al menos una prueba.** Convención de nombre: `Clase_Condicion_ResultadoEsperado`.
- **Trazabilidad:** toda tarjeta que cambia el estado de un documento prueba que quedó en el historial; toda tarjeta que crea un documento derivado prueba que guardó su origen (TRZ-01, TRZ-02).
- Pruebas de integración (con base de datos) desde la semana 3. Pantallas: prueba manual en Chrome o Edge.
- No se hace merge si las pruebas fallan. Con CI, GitHub lo verifica solo ([guía](../guias/ci.md)).

## 4.6 Documentación

- Un capítulo por semana desde la [plantilla](../capitulos/_plantilla.md), enlazado a su tag.
- Cada decisión → [decisiones](../decisiones.md). **Si contradice o cambia una decisión existente, se modifica esa decisión con fecha (D24)**, conservando el texto original.
- Cada regla → [catálogo](../reglas.md) con fuente y prueba. Cada término → [glosario](../glosario.md) en la misma sesión.
- Cada área o módulo nuevo → su [alcance](alcance.md) y su [contrato de integración](../contratos/_plantilla.md) antes de integrarse.

## 4.7 Uso del asistente (D09)

- **Regla general: el asistente no crea ni modifica ningún archivo sin preguntar antes.** Siempre muestra qué hará y espera un "sí".
- **La IA puede generar código**, incluidas reglas y pruebas, pero **sencillo y fácil de entender**: nombres claros, métodos cortos, comentarios donde ayuden, sin patrones avanzados.
- **Explicar es fundamental:** después de generar, el asistente explica en pocas líneas; en `/cierre`, cada integrante explica con sus palabras lo que hizo y el asistente corrige lo que no sea exacto.
- El **modo tutor** (pistas en vez de soluciones) está suspendido; su descripción sigue en D09 por si el equipo lo reactiva.
- Herramientas: Miguel usa OpenCode; Luis y Pablo, el asistente que prefieran (Codex u otro). `AGENTS.md` sirve para todos.
- Rituales: `/iniciar`, `/cierre`, `/retro`, `/planning` ([comandos](../comandos/iniciar.md)).

## 4.8 Reglas para no descarrilarse

- Una tarjeta a la vez. Lo demás se anota en la bitácora.
- **Trabajo sin tarjeta no se hace**: si alguien quiere adelantar algo, primero crea la tarjeta y dice qué se mueve para hacerle espacio.
- **Sin trazabilidad no está terminado**: un documento sin historial, cadena o ficha no cumple la definición de terminado.
- Primero correcto, luego (si hay tiempo) bonito.
- No se agrega alcance a mitad de sprint sin sacar otra cosa.

## 4.9 Control semanal (5 min, miércoles)

- ¿Entregable de la fase cumplido? Sí / Parcial / No.
- Horas reales vs. estimadas, por persona (tabla de la [bitácora](../../BITACORA.md)).
- Si "Parcial" o "No": qué pasa a la fase siguiente o queda como pendiente del área (en `docs/alcance/<area>.md`).
