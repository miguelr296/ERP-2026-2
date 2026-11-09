# Sprint 1 — venta retail trazable desde cero

[Índice](../../README.md) · [Alcance](../alcance/comercial.md) · [Análisis del PDF](../fuentes/analisis-comercial.md)

**5–11 de noviembre de 2026.** Plan nuevo derivado del PDF. Al 2026-11-07, COM-001 y COM-002 están integradas en `main` (PR #104), COM-003 y COM-004 en Ready y COM-005 en curso; el resto sigue pendiente. No se presupone preparación técnica ni resultados anteriores.

## Capacidad y reparto

3 h al día por persona durante siete días: 63 h. Se comprometen 42 h de tareas, reuniones, validación y documentación; quedan 21 h de reserva. No son horas adicionales.

Miguel lleva la complejidad técnica: persistencia, auditoría, contratos, aprobaciones, pago e integración. Luis lleva CRM, cotización y fichas. Pablo recibe tareas acotadas y verificables de catálogo, interfaz y regresión, con acompañamiento.

Los bloques de 2–3 h se dividen en pasos de 30–90 minutos dentro de la misma tarjeta. Una tarjeta por persona; no abrir más trabajo para esconder bloqueos. Los pasos y pruebas forman parte de la estimación.

## Tarjetas

| ID | Título | Tipo | Dueños | Horas por persona | Prioridad | Priority | Size | Estimate | Inicio | Fin | Depende de | Hito | Criterio de aceptación |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| COM-001 | Acordar recorrido, parámetros y estados desde el PDF | configuracion | Miguel, Luis, Pablo | Miguel 0,5 / Luis 0,5 / Pablo 0,5 | Núcleo | P0 | S | 1,5 | 2026-11-05 | 2026-11-05 | — | Comercial 2026-11-05 | Fuente pp. 4, 5, 15–35, 87; acordar discrepancia de OV y valores ficticios; explicación compartida. |
| COM-002 | Crear solución mínima, API y pruebas de arranque | configuracion | Miguel | Miguel 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-05 | 2026-11-05 | — | Comercial 2026-11-05 | SDK fijado; API sirve wwwroot conservado; build y una prueba real pasan. |
| COM-003 | Preparar entorno de Luis y revisar interfaz inicial | configuracion | Luis | Luis 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-05 | 2026-11-05 | — | Comercial 2026-11-05 | Herramientas verificadas; inventario de roles/textos a adecuar; sin dar por implementadas pantallas comerciales. |
| COM-004 | Preparar entorno de Pablo y datos del caso de demo | configuracion | Pablo | Pablo 1 | Núcleo | P0 | M | 1 | 2026-11-05 | 2026-11-05 | — | Comercial 2026-11-05 | Con guía: herramientas verificadas y casos ficticios escritos desde el PDF, sin copiar reglas antiguas. |
| COM-005 | Crear persistencia, modelo e historial mínimo | configuracion | Miguel | Miguel 3 | Núcleo | P0 | XL | 3 | 2026-11-06 | 2026-11-06 | COM-001, COM-002 | Comercial 2026-11-05 | Modelo de relaciones acordado; SQL configurado sin secretos; migración y lectura/escritura; alta con historial probada. |
| COM-006 | Implementar cliente y consulta por API | codigo | Luis | Luis 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-06 | 2026-11-06 | COM-005 | Comercial 2026-11-05 | COM-R01: cliente consultable, errores y pruebas; guía de Miguel dentro de la reserva. |
| COM-007 | Preparar catálogo y lista de precios ficticios | codigo | Pablo | Pablo 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-06 | 2026-11-06 | COM-005 | Comercial 2026-11-05 | Productos y lista por canal/tipo definidos como datos de demo; consulta y prueba sencilla. |
| COM-020 | Crear CI mínimo con el SDK y pruebas elegidos | configuracion | Luis | Luis 0,5 | Núcleo | P0 | S | 0,5 | 2026-11-06 | 2026-11-06 | COM-002 | Comercial 2026-11-05 | Workflow de build/test secuenciales, validado con éxito y fallo controlado; no simular resultados. |
| COM-008 | Implementar adaptadores y consistencia de la cadena | codigo | Miguel | Miguel 2 | Núcleo | P0 | XL | 2 | 2026-11-07 | 2026-11-07 | COM-005 | Comercial 2026-11-05 | Contratos simulados de reserva/pago con rechazo; documento e historial consistentes; COM-T01/T03. |
| COM-009 | Implementar oportunidad y su pantalla básica | codigo | Luis | Luis 2 | Núcleo | P0 | XL | 2 | 2026-11-07 | 2026-11-07 | COM-006, COM-007, COM-008 | Comercial 2026-11-05 | Cliente, productos, sede y vendedor relacionados; alta y consulta con ficha inicial; COM-R01. |
| COM-010 | Validar catálogo y construir su selector | codigo | Pablo | Pablo 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-07 | 2026-11-07 | COM-007 | Comercial 2026-11-05 | Consulta desde pantalla; productos y precio de lista visibles; caso sin lista vigente preparado. |
| COM-012 | Crear cotización y cálculo desde oportunidad | codigo | Luis | Luis 2,5 | Núcleo | P0 | XL | 2,5 | 2026-11-08 | 2026-11-08 | COM-009, COM-010 | Comercial 2026-11-05 | COM-R02/R04: líneas y precios protegidos; correlativo, vigencia, impuesto y plazo; pruebas y pantalla mínima. |
| COM-011 | Implementar solicitud y aprobación de descuento | codigo | Miguel | Miguel 2 | Núcleo | P0 | XL | 2 | 2026-11-08 | 2026-11-08 | COM-012, COM-008 | Comercial 2026-11-05 | COM-R03/R09: motivo, límites configurables, rol y aprobación/rechazo con historial. |
| COM-013 | Conectar selector de precios y preparar casos de cotización | codigo | Pablo | Pablo 2 | Núcleo | P0 | XL | 2 | 2026-11-08 | 2026-11-08 | COM-010, COM-012 | Comercial 2026-11-05 | Interfaz muestra datos de API; casos de precio manipulado y lista vencida, revisados con Luis. |
| COM-015 | Implementar estados y ficha de cotización | codigo | Luis | Luis 2 | Núcleo | P0 | XL | 2 | 2026-11-09 | 2026-11-09 | COM-011, COM-012 | Comercial 2026-11-05 | COM-R05: enviar/aceptar/rechazar/vencer; no avanzar descuento pendiente; origen e historial visibles. |
| COM-014 | Implementar anticipo y compuerta de pago | codigo | Miguel | Miguel 2 | Núcleo | P0 | XL | 2 | 2026-11-09 | 2026-11-09 | COM-011, COM-015, COM-008 | Comercial 2026-11-05 | COM-R06: registro con comprobante; confirmación por contrato/rol; rechazo persiste y no valida pago. |
| COM-016 | Construir pantalla acotada de anticipo | codigo | Pablo | Pablo 2 | Núcleo | P0 | XL | 2 | 2026-11-09 | 2026-11-09 | COM-014 | Comercial 2026-11-05 | Registrar y mostrar confirmación o rechazo desde API; guion por roles y errores visibles. |
| COM-017 | Implementar conversión y entrega a contrato de despacho | codigo | Miguel | Miguel 2 | Núcleo | P0 | XL | 2 | 2026-11-10 | 2026-11-10 | COM-014, COM-015 | Comercial 2026-11-05 | COM-R07/R08 y COM-T02: copia exacta, bloqueo sin pago/reserva, OV única y solicitud simulada trazable. |
| COM-018 | Completar ficha de OV y navegación de relaciones | codigo | Luis | Luis 2 | Núcleo | P0 | XL | 2 | 2026-11-10 | 2026-11-10 | COM-017, COM-015 | Comercial 2026-11-05 | Desde OV llegar a cotización, oportunidad, cliente, anticipo y descuento; ficha imprimible e historial. |
| COM-019 | Ejecutar regresión guiada del recorrido y errores | pruebas | Pablo | Pablo 2 | Núcleo | P0 | XL | 2 | 2026-11-10 | 2026-11-10 | COM-016, COM-018 | Comercial 2026-11-05 | Ejecutar guion con datos de demo; registrar fallos reales; comprobaciones de roles y enlaces. |
| COM-021 | Validar, demostrar y explicar el recorrido completo | pruebas | Miguel, Luis, Pablo | Miguel 1 / Luis 1 / Pablo 1 | Núcleo | P0 | M | 3 | 2026-11-11 | 2026-11-11 | COM-019, COM-020 | Comercial 2026-11-05 | Dos ventas en pantalla/API, rechazos y reinicio con datos persistentes; cada integrante explica su parte. |
| COM-022 | Documentar evidencia y preparar revisión final | docs | Miguel, Luis, Pablo | Miguel 0,5 / Luis 0,5 / Pablo 0,5 | Núcleo | P0 | S | 1,5 | 2026-11-11 | 2026-11-11 | COM-021 | Comercial 2026-11-05 | Bitácora, reglas y capítulo con resultados reales; cierre antes de commit/PR; revisión por compañero. |
| COM-023 | Realizar retro y preparar planning del área siguiente | docs | Miguel, Luis, Pablo | Miguel 0,5 / Luis 0,5 / Pablo 0,5 | Núcleo | P0 | S | 1,5 | 2026-11-11 | 2026-11-11 | COM-022 | Comercial 2026-11-05 | Horas reales, resultado del núcleo y aprendizaje; no trasladar automáticamente tarjetas comerciales. |
| COM-024 | Rechazar con 400 el documento de cliente mayor a 20 caracteres | codigo | Luis | Luis 0,5 | Si alcanza | P1 | S | 0,5 | 2026-11-09 | 2026-11-09 | COM-005, COM-006 | Comercial 2026-11-05 | Defecto de COM-008: alta con 21 caracteres responde 400 sin guardar; límite único en dominio; prueba HTTP. |

## Horas por persona

| Persona | Planificadas | Reserva | Total máximo |
|---|---|---|---|
| Miguel | 15 | 6 | 21 |
| Luis | 15 | 6 | 21 |
| Pablo | 12.5 | 8.5 | 21 |

## Plan diario

| Fecha | Miguel | Luis | Pablo |
|---|---|---|---|
| 2026-11-05 | COM-001, COM-002 (2 h) | COM-001, COM-003 (2 h) | COM-001, COM-004 (1.5 h) |
| 2026-11-06 | COM-005 (3 h) | COM-006, COM-020 (2 h) | COM-007 (1.5 h) |
| 2026-11-07 | COM-008 (2 h) | COM-009 (2 h) | COM-010 (1.5 h) |
| 2026-11-08 | COM-011 (2 h) | COM-012 (2.5 h) | COM-013 (2 h) |
| 2026-11-09 | COM-014 (2 h) | COM-015 (2 h) | COM-016 (2 h) |
| 2026-11-10 | COM-017 (2 h) | COM-018 (2 h) | COM-019 (2 h) |
| 2026-11-11 | COM-021, COM-022, COM-023 (2 h) | COM-021, COM-022, COM-023 (2 h) | COM-021, COM-022, COM-023 (2 h) |

## Coordinación y dependencias

Las tres horas son disponibilidad individual, no necesariamente una franja compartida. Los días 6, 8, 9 y 10 tienen entregas encadenadas: coordinar horarios escalonados desde COM-001. Una dependencia del mismo día se revisa e integra antes de tomar la sucesora. Si no pueden escalonar, redistribuir fechas y usar reserva sin superar 3 h/persona/día.

COM-005 puede consumir las 3 h de Miguel el día 6: el apoyo posterior a Luis/Pablo debe darse dentro de otra franja de reserva; no atribuirle horas simultáneas. Las revisiones cruzadas y el acompañamiento se registran como horas reales.

La estimación es inicial, no una garantía. Si falla preparación o conexión, se concentra apoyo en la base y se vuelve a estimar. No cerrar una tarjeta con una prueba no ejecutada.

## Guion de aceptación

1. Buscar/crear cliente; registrar oportunidad con productos y responsable.
2. Generar cotización de lista vigente. Intentar alterar precio y comprobar rechazo.
3. Solicitar descuento; rechazar aprobación por rol indebido; aprobar con Jefatura y consultar auditoría.
4. Enviar y aceptar cotización. Intentar OV sin pago: bloqueada.
5. Registrar anticipo con comprobante; confirmar por Tesorería simulada; comprobar resultado y referencia.
6. Convertir a OV con reserva vigente; copiar líneas y precios; repetir conversión sin duplicados. Probar reserva vencida.
7. Desde la OV reconstruir relaciones y responsables, incluyendo descuento y anticipo como ramas de la cotización.
8. Reiniciar aplicación y comprobar datos; repetir con otra venta y con cotización rechazada o vencida.

No se crean Issues ni se modifican tableros al guardar este plan. Los identificadores COM son nuevos para evitar reutilizar IDs del plan eliminado.
