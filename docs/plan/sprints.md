# 5. Sprints

[← Índice](../../README.md)

**Qué hay en cada archivo de la carpeta `plan/`:**

| Archivo | Para qué sirve | Se actualiza |
|---|---|---|
| `sprints.md` (este) | **Cómo funcionan los sprints**: calendario, capacidad, ceremonias, definición de terminado y riesgos. No lista tarjetas | Cuando cambia el método o el calendario |
| `sprint-NN.md` | **Borrador de las tarjetas de un sprint** con sus campos, dependencias, hitos y plan por día: se revisa en el planning y el script lo carga al tablero | Solo hasta cargarlas; después manda el tablero (D22) |
| `kanban.md` | **Cómo se usa el tablero**: columnas, campos, cómo se escribe una tarjeta, configuración de GitHub Projects | Cuando cambia el método |

## 5.1 Estructura

- **Un área por sprint**, de jueves a miércoles. Cada jueves hay demo en clase (la review).
- **El sprint 1 (Comercial) dura 3 semanas** porque cubre todo el TO-BE Comercial (D07, D19); tiene tres fases, una por demo.
- **Capacidad:** 2–3 h diarias por persona (D08). Las ceremonias son mínimas y se hacen el jueves después de clase.
- **Aprendizaje justo a tiempo:** se aprende lo que la tarjeta del día necesita.

| Sprint | Fechas | Demos | Área | Objetivo | Tarjetas |
|---|---|---|---|---|---|
| 1 | 29/10 – 18/11 | 05/11 (fase A) · 12/11 (fase B) · 19/11 (fase C) | Comercial | TO-BE Comercial completo, MTS y MTO, con trazabilidad | [sprint-01](sprint-01.md) |
| 2+ | por confirmar | — | Logística y las que solicite el profesor | Se define en su `/planning`, partiendo de las versiones mínimas del sprint 1 | — |

## 5.2 Sprint 1 — Comercial

**Objetivo:** el TO-BE Comercial completo (35 microprocesos, 25 registros, 14 roles, pantallas e indicadores) funcionando en pantalla y por la API, con historial, cadena documental y ficha de cada documento. Alcance en [alcance/comercial.md](../alcance/comercial.md); tarjetas y plan por día en [sprint-01.md](sprint-01.md).

| Persona | Fase A | Fase B | Fase C | Total |
|---|---|---|---|---|
| Miguel | 12 h | 14,5 h | 12 h | 38,5 h + ≈ 3 h de revisión de PR = **≈ 41,5 h** |
| Luis | 11 h | 7 h | 12,5 h | **30,5 h** |
| Pablo | 11,5 h | 7,5 h | 8 h | **27 h** |
| **Equipo** | | | | **≈ 99 h** en 70 tarjetas |

El reparto sigue la experiencia (D20): Miguel lleva más, Luis es el segundo y Pablo el tercero.

## 5.3 Ceremonias

| Ceremonia | Cuándo | Duración | Qué se hace |
|---|---|---|---|
| **Demo (review)** | Jueves, en clase | la presentación | Mostrar lo que funciona en pantalla y API, con la trazabilidad de los documentos |
| **Retro** | Jueves, después de la demo | 15 min | Horas reales vs. estimadas, qué mejorar, poda de contexto (`/retro`) |
| **Planning** | Jueves, al terminar un área | 20 min | Fuente del área nueva, alcance, contrato, tarjetas, decisiones afectadas (`/planning`) |
| **Control semanal** | Miércoles | 5 min | Sí / Parcial / No, horas, qué pasa a la fase siguiente |
| **Daily** | Asíncrona | 2 min | Tres líneas en la bitácora |

## 5.4 Definición de terminado (DoD)

Una tarjeta solo pasa a **Done** si:

- [ ] Está en `main` mediante un PR desde una rama del repo, revisado por otro integrante.
- [ ] `dotnet build` y `dotnet test` pasan.
- [ ] Si es una regla: está en el [catálogo](../reglas.md) con módulo, fuente, microproceso y prueba.
- [ ] **Trazabilidad:** si crea o cambia un documento, deja historial (usuario, fecha y hora, motivo) y cadena documental, y su ficha lo muestra (D25).
- [ ] Si toca la base: incluye migración (creada por Miguel).
- [ ] Si es una pantalla: se probó a mano en Chrome o Edge contra la API.
- [ ] El autor **explicó con sus palabras** lo que hizo en `/cierre`.
- [ ] Los términos nuevos están en el [glosario](../glosario.md).
- [ ] Si cambió algo ya decidido, la decisión se modificó en [decisiones](../decisiones.md) (D24).
- [ ] La bitácora está actualizada.

Las tarjetas de aprendizaje no requieren PR: se cierran cuando se cumple su criterio. Las de configuración que no tocan el repositorio se cierran directamente y se anotan en la bitácora.

## 5.5 Riesgos

- **Volumen.** Son 70 tarjetas en 3 semanas, con dos integrantes aprendiendo C#. Mitigación: código sencillo, explicación obligatoria en `/cierre` y un punto de control por fase.
- **Miguel es el cuello de botella**: lleva la mayor carga (esqueleto, trazabilidad, Planta, Logística, Finanzas) y revisa PR. La revisión se mantiene en ≈ 3 h porque los PR son de una tarjeta y traen su explicación; Luis y Pablo se revisan entre sí los PR sin reglas, `Compartido` ni migraciones.
- **La trazabilidad es la base de todo.** Si el historial (S1-08) o la cadena (S1-09) se atrasan, todas las fichas se atrasan. Miguel los hace primero, el fin de semana 31/10 – 01/11.
- **Cuatro módulos con submódulos desde el inicio.** Un error en el esqueleto (S1-04) o en los contratos afecta a todos.
- **Días de 3 h.** Algunos días del plan llegan a 3 h por cómo se encadenan las dependencias. Si alguien no puede, la tarjeta se corre dentro de la fase.
- **Fecha de Logística sin confirmar.** Si el profesor la pide antes del 19/11, hay que replanificar las fases B y C.
