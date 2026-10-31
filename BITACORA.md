# Bitácora de sesiones

[← Índice](README.md)

Una entrada por sesión, la más reciente arriba. Tres líneas bastan; el nombre y las horas son obligatorios (los usa la retro).

## Plantilla

```
### AAAA-MM-DD · Nombre · horas h · tarjeta
- Hice:
- Falló / dudas:
- Siguiente paso exacto:
```

## Control semanal

| Sem. | Área / fase | Entregable (Sí/Parcial/No) | Horas Miguel | Horas Luis | Horas Pablo | Qué pasa a la fase siguiente |
|---|---|---|---|---|---|---|
| 1 | Comercial · fase A (demo 05/11) | | | | | |
| 2 | Comercial · fase B (demo 12/11) | | | | | |
| 3 | Comercial · fase C (demo 19/11) | | | | | |
| 4 | Logística (fecha por confirmar) | | | | | |

## Sesiones

### 2026-10-31 · Miguel · — h · módulos y submódulos
- Hice: dividimos cada módulo en submódulos (D03): Comercial (CRM, Ventas, Postventa), Finanzas (Tesorería, Créditos y Cobranzas, Facturación), Logística (Inventarios, Despacho), Planta (Ingeniería, Producción) y Compartido (Trazabilidad, Seguridad, Notificaciones). Postventa pasa a ser submódulo de Comercial y la evaluación de crédito pasa a Finanzas (D06). El anticipo se registra en Ventas; en la fase A lo confirma Tesorería desde Ventas y en la fase C la confirmación pasa a Finanzas › Tesorería (D17). Tarjetas, dueños, horas y fechas no cambian; se actualizaron los criterios de S1-04, S1-15, S1-36, S1-50 y S1-61.
- Falló / dudas: hay que editar a mano esos 5 Issues en GitHub, porque ya estaban cargados con el texto anterior.
- Siguiente paso exacto: editar los 5 Issues; S1-04 (Miguel) con la nueva estructura de `docs/arquitectura.md` 3.2.

### 2026-10-30 · Miguel · — h · sprint 1 = TO-BE Comercial completo
- Hice: decidimos cubrir todo el TO-BE Comercial en el sprint 1, en 3 semanas con demos el 05/11, 12/11 y 19/11 (D07, D19, D21). Rehicimos las tarjetas: 70 (S1-00 a S1-69) con fechas calculadas por dependencias, hitos por demo y relaciones "bloqueada por"; cubren los 35 microprocesos. Cinco módulos (Comercial, Planta, Logistica, Finanzas, Postventa); las interfaces se construyen como versión mínima en su módulo (D03, D06). La trazabilidad pasa a ser la prioridad: historial, cadena documental y ficha por documento (D25, reglas TRZ). La IA ya puede generar código sencillo, siempre pregunta antes y no crea ni modifica archivos sin permiso; modo tutor suspendido; explicar en /cierre sigue siendo obligatorio (D09). Estados completos de la OV aprobados (D15).
- Falló / dudas: falta confirmar la fecha y la fuente del área Logística.
- Después: el reparto pasa a seguir la experiencia (D20): Miguel toma crédito, stock, reservas, reposición, cuarentena y descuentos; Luis toma la recepción de reclamos (bandeja, ticket, categoría). Quedan Miguel ≈ 38,5 h (+ ≈ 3 h de revisión de PR, antes ≈ 8 h), Luis 30,5 h, Pablo 27 h; fechas recalculadas.
- Siguiente paso exacto: S1-01 (Miguel, vie 30/10): crear los campos del tablero según `docs/plan/kanban.md` 6.3 (Sprint de 3 semanas) y cargar las tarjetas con `scripts/crear-tarjetas.sh`; luego S1-04. Luis y Pablo: S1-02, S1-03 y S1-06.

### 2026-10-29 · Miguel · — h · reestructuración del flujo
- Hice: audité el repo y reestructuré el flujo con el equipo: nombres en vez de letras (Miguel, Luis, Pablo); alcance por área (`docs/alcance/`) con Núcleo / Si alcanza / Simulado; TO-BE como fuente solo de Comercial; back y front confirmados (front HTML + CSS + JS, demo en pantalla y API); tablero de GitHub como fuente de verdad de las tarjetas (`sprint-01.md` reemplaza al CSV y a la tabla del kanban); ramas en el repo sin forks; regla para modificar decisiones con fecha (D24). Decisiones modificadas: D02, D07, D12, D13, D16, D18, D19; nuevas: D20–D24. Se quitaron las referencias al repositorio de referencia usado para crear el repo. Se adaptó la pantalla de Luis (código legible, textos según el plan) y se registró como S1-00.
- Falló / dudas: falta conocer la fuente de verdad de Logística. El trabajo de Luis llegó a `main` sin PR; queda la revisión de S1-00.
- Después: rehicimos las tarjetas del sprint 1 por integrante (cada uno su pieza con su pantalla; Miguel anticipo y OV; Pablo cotización y capítulo; Luis cliente y oportunidad; Luis y Pablo 2 h el miércoles) y agregamos el modo tutor contra el vibecoding (D09 modificada; D13 modificada por dueños de pantallas). `/iniciar` pregunta primero el nombre. Luego: las tareas Si alcanza también tienen tarjeta (S1-19 a S1-31, con origen en el TO-BE y reglas STK/DES/LEAD/MOR/CRE/MTO/DIS/FAC/REC en el catálogo); el script ahora agrega cada Issue al tablero, llena Priority, Size, Estimate, fechas, Sprint y Prioridad, y crea las relaciones Blocked by (D22 modificada).
- Siguiente paso exacto: S1-01 (Miguel, vie 30/10): invitar a Luis y Pablo como colaboradores, configurar el tablero y crear los campos del tablero según `docs/plan/kanban.md` 6.3 y cargar las tarjetas con `scripts/crear-tarjetas.sh`; luego S1-04 y revisar S1-00 con Luis explicando su código.

### 2026-10-29 · Luis · horas por anotar · S1-00 (adelantada)
- Hice: preparé el acceso simulado con nombre y rol, selector de Comercial y Logística, filtro y salida; documenté ejecución y revisión manual. Trabajo adelantado, fuera del orden del kanban y sin tarjeta; se registró después como S1-00.
- Falló / dudas: validación en navegador no hecha en ese momento; falta la revisión de Luis y de Miguel. La API y las pantallas internas siguen pendientes.
- Siguiente paso exacto: Luis anota sus horas reales en esta entrada y hace S1-02; Miguel revisa S1-00.

### 2026-10-28 · Miguel · — h · definición del flujo de trabajo
- Hice: analizamos el TO-BE de FAMIHOGAR y definimos el flujo (sprints semanales, monolito modular, contratos entre módulos, reglas con fuente TO-BE); dejamos listos el plan, las decisiones D01–D19, el catálogo de 25 reglas y las 18 tarjetas del sprint 1.
- Falló / dudas: falta confirmar la fecha de la primera presentación (29/10 o 05/11), el idioma de los identificadores (D16), el front (D13) y el anticipo de 50 % (D18). *(Resuelto el 29/10.)*
- Siguiente paso exacto: S1-01: crear el repositorio en GitHub con esta estructura, el tablero y cargar las tarjetas con el script.
