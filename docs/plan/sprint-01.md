# Sprint 1 — TO-BE Comercial completo · borrador de tarjetas

[← Índice](../../README.md) · [Sprints](sprints.md) · [Kanban](kanban.md) · [Alcance Comercial](../alcance/comercial.md)

**Fechas:** jueves 29/10 – miércoles 18/11 (3 semanas) · **Demos:** jueves 05/11, 12/11 y 19/11 · **Objetivo:** cubrir **todo** el Documento TO-BE del área Comercial (35 microprocesos, 25 registros, 14 roles, pantallas e indicadores) en pantalla y API, con **trazabilidad completa** de cada documento (D25).

> **Este archivo es un borrador.** Sirve para revisar las tarjetas y para cargarlas con `scripts/crear-tarjetas.sh`, que crea cada Issue, lo agrega al tablero, llena sus campos, le asigna su hito y crea sus relaciones "Blocked by". Una vez cargadas, **el tablero de GitHub es la fuente de verdad** (D22).

## Fases

| Fase | Priority | Hito | Fechas | Qué se presenta |
|---|---|---|---|---|
| A | P0 | Demo 05/11 | 29/10 – 04/11 | Venta retail MTS de punta a punta, con historial, cadena documental y fichas |
| B | P1 | Demo 12/11 | 05/11 – 11/11 | Resto de PO.02 (leads, descuentos, crédito, recordatorios, PDF, stock y reservas) y caso MTO con Planta |
| C | P2 | Demo 19/11 | 12/11 – 18/11 | Logística y Finanzas (versiones mínimas; la confirmación del anticipo pasa a Tesorería), Postventa completa, pantalla de trazabilidad, tablero por rol, indicadores y prueba final MTS + MTO |

**Cómo se reparte el trabajo:**
- Cada uno hace su pieza completa (regla, pruebas, endpoint, pantalla y ficha).
- El ERP tiene 4 módulos con submódulos (D03): Comercial (CRM, Ventas, Postventa), Finanzas, Logística y Planta, más Compartido.
- Los procesos que el TO-BE marca como **interfaz** (Planta, Logística, Finanzas) se construyen como **versión mínima**: una simulación sencilla detrás del contrato del módulo dueño (D06). El sprint de esa área la amplía.
- Las sesiones son de 2–3 h y encadenan tarjetas de una en una (D08). El asistente genera código sencillo y siempre pregunta antes (D09).

## Campos del tablero

| Columna | Campo | Valores |
|---|---|---|
| Prioridad | `Prioridad` | **Núcleo** (en Comercial todo es núcleo: D21) |
| Priority | `Priority` | Fase: **P0** = A (demo 05/11) · **P1** = B (demo 12/11) · **P2** = C (demo 19/11) |
| Size | `Size` | Horas de una persona: **S** 0,5 · **M** 1 · **L** 1,5 · **XL** se divide |
| Estimate | `Estimate` | Horas totales de la tarjeta (suma de sus dueños) |
| Inicio / Fin | `Start date` / `Target date` | Día planificado, calculado respetando dependencias y la capacidad diaria |
| Depende de | Relación **Blocked by** | Relación nativa de GitHub |
| Hito | *Milestone* | Demo a la que pertenece la tarjeta |
| (derivado) | `Status` | P0 → **Ready** · P1 y P2 → **Backlog** (pasan a Ready al empezar su fase) |
| (derivado) | `Sprint` | **Sprint 1** (iteración de 3 semanas) |

## Tarjetas

El script lee solo las filas de esta tabla.

| ID | Título | Tipo | Dueños | Horas por persona | Prioridad | Priority | Size | Estimate | Inicio | Fin | Depende de | Hito | Criterio de aceptación |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S1-00 | Preparar la pantalla de acceso simulado y el selector de aplicaciones | codigo | Luis | Luis: horas reales por anotar | Núcleo | P0 | — | — | 2026-10-29 | 2026-10-29 | — | Demo 05/11 | Trabajo adelantado y ya adaptado (D13). Se cierra cuando Luis explica a Miguel qué hace cada parte de los tres archivos y la guía docs/guias/acceso-aplicaciones.md pasa |
| S1-01 | Configurar el tablero, dar acceso a Luis y Pablo y cargar las tarjetas | configuracion | Miguel | Miguel 0,5 | Núcleo | P0 | S | 0,5 | 2026-10-30 | 2026-10-30 | — | Demo 05/11 | Tablero con los campos de kanban 6.3, iteración Sprint 1 de 3 semanas e hitos; Luis y Pablo son colaboradores; tarjetas cargadas con el script, con campos, hitos y relaciones |
| S1-02 | Instalar .NET SDK, SQL Server y editor, y clonar el repositorio | configuracion | Luis, Pablo | Luis 1,5 / Pablo 1,5 | Núcleo | P0 | L | 3 | 2026-10-30 | 2026-10-30 | — | Demo 05/11 | `dotnet --version` responde, se conectan a SQL Server y el repo está clonado |
| S1-03 | Practicar Git: rama, commit, push y PR con Closes #N | aprendizaje | Luis, Pablo | Luis 0,5 / Pablo 0,5 | Núcleo | P0 | S | 1 | 2026-10-30 | 2026-10-30 | S1-02 | Demo 05/11 | Cada uno agrega su nombre al README desde una rama `nombre/tarea` del repo (sin fork), en un PR revisado por el otro y fusionado |
| S1-04 | Crear el esqueleto con los 4 módulos y sus submódulos, Compartido y Tests, y servir las pantallas desde la Api | configuracion | Miguel | Miguel 1,5 | Núcleo | P0 | L | 1,5 | 2026-10-30 | 2026-10-30 | S1-01 | Demo 05/11 | Proyectos Comercial (CRM, Ventas, Postventa), Finanzas (Tesorería, Créditos y Cobranzas, Facturación), Logistica (Inventarios, Despacho), Planta (Ingeniería, Producción), Compartido, Api y Tests, según docs/arquitectura.md 3.2; `dotnet build` y `dotnet test` en verde; la Api muestra la pantalla de acceso en `/`; borrador de contrato de cada módulo en docs/contratos/ |
| S1-06 | Aprender C# y SQL esenciales con ejercicios del dominio | aprendizaje | Luis, Pablo | Luis 1 / Pablo 1 | Núcleo | P0 | M | 2 | 2026-10-30 | 2026-10-30 | S1-02 | Demo 05/11 | Resuelven y explican 5 ejercicios: filtrar productos, subtotal con IGV usando decimal, SELECT con JOIN |
| S1-05 | Modelar entidades y estados de Comercial, migración y datos semilla | codigo | Miguel | Miguel 1,5 | Núcleo | P0 | L | 1,5 | 2026-10-31 | 2026-10-31 | S1-04 | Demo 05/11 | Migración aplicada; 8 muebles, lista Retail vigente, sedes y usuarios de los 14 roles cargados; las entidades guardan las fechas que piden los indicadores |
| S1-07 | Aprender capas, inyección de dependencias y xUnit construyendo el endpoint de Cliente | aprendizaje | Miguel, Luis, Pablo | Miguel 1,5 / Luis 1,5 / Pablo 1,5 | Núcleo | P0 | L | 4,5 | 2026-10-31 | 2026-10-31 | S1-05, S1-06 | Demo 05/11 | POST y GET /clientes recorren Api, Servicios y Datos; una prueba xUnit pasa; Luis y Pablo explican qué hace cada capa |
| S1-08 | Registrar el historial de estados y la auditoría de cada documento | codigo | Miguel | Miguel 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-01 | 2026-11-01 | S1-04 | Demo 05/11 | En Compartido: cada cambio de estado y cada aprobación guarda documento, estado anterior, estado nuevo, usuario, rol, fecha y hora, y motivo; el historial no se borra ni se edita; TRZ-01 y TRZ-03 con prueba |
| S1-09 | Registrar la cadena documental: origen y derivados de cada documento | codigo | Miguel | Miguel 1 | Núcleo | P0 | M | 1 | 2026-11-01 | 2026-11-01 | S1-08 | Demo 05/11 | En Compartido: todo documento derivado guarda su documento de origen y se pueden consultar sus antecesores y sucesores; TRZ-02 con prueba |
| S1-10 | Implementar las reglas de Cliente (DNI 8, RUC 11, documento único) con pruebas | pruebas | Luis | Luis 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-01 | 2026-11-01 | S1-07 | Demo 05/11 | CLI-01 a CLI-03 en el catálogo con al menos 4 pruebas pasando (PO.02.P01.SP01.A01) |
| S1-11 | Implementar productos y la lista vigente por canal y tipo de cliente, con precio bloqueado | codigo | Pablo | Pablo 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-01 | 2026-11-01 | S1-07 | Demo 05/11 | GET /productos devuelve precios de la lista vigente; el precio no se edita a mano; PRE-01 a PRE-03 con prueba (PO.02.P02.SP01.A01, pasos 1 y 3) |
| S1-13 | Implementar la cotización: correlativo, vigencia, IGV y plazo de entrega | codigo | Pablo | Pablo 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-01 | 2026-11-01 | S1-11 | Demo 05/11 | COT-01 a COT-03 y COT-07 (plazo de entrega) con al menos 4 pruebas; la cotización guarda su oportunidad de origen (PO.02.P02.SP02.A01, pasos 1 y 2) |
| S1-12 | Implementar la oportunidad: nace Nueva y asigna canal, sede y vendedor | codigo | Luis | Luis 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-02 | 2026-11-02 | S1-10, S1-11 | Demo 05/11 | POST /oportunidades crea en estado Nueva con productos; OPO-01 y OPO-02 con prueba; el alta queda en el historial (PO.02.P01.SP01.A01) |
| S1-14 | Implementar los estados de la cotización, el envío simulado y el resultado | pruebas | Pablo | Pablo 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-02 | 2026-11-02 | S1-13, S1-08 | Demo 05/11 | COT-04 a COT-06 con pruebas; "Enviar" registra el envío simulado; cada cambio queda en el historial (PO.02.P02.SP02.A02, pasos 1 y 3) |
| S1-15 | Implementar el anticipo: registrar, confirmar por Tesorería y marcar Pago validado | codigo | Miguel | Miguel 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-02 | 2026-11-02 | S1-07, S1-09 | Demo 05/11 | En Comercial › Ventas: PAG-01 a PAG-05 con pruebas; en la fase A el rol Tesorería confirma desde Ventas (pasa a Finanzas en S1-50, D17); la confirmación guarda usuario y hora en el historial; el anticipo queda ligado a su cotización en la cadena (PO.02.P03.SP01.A01) |
| S1-17 | Crear la ficha estándar de documento: cabecera, detalle, historial y cadena | codigo | Luis | Luis 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-02 | 2026-11-02 | S1-04, S1-09 | Demo 05/11 | Componente reutilizable en wwwroot: cabecera (correlativo, fecha, cliente, sede, vendedor), detalle, estado actual con historial en línea de tiempo y cadena documental con enlaces; se imprime o guarda como PDF |
| S1-16 | Implementar la conversión de cotización a orden de venta con bloqueo sin pago validado | codigo | Miguel | Miguel 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-03 | 2026-11-03 | S1-15, S1-14 | Demo 05/11 | OV-01 a OV-05 y OPO-03 con pruebas; la OV nace Confirmada (D15) y queda en la cadena como derivada de su cotización (PO.02.P04.SP01.A01, pasos 1 y 2) |
| S1-18 | Crear el menú de Comercial, el selector con los 14 roles y las pantallas de clientes y oportunidades | codigo | Luis | Luis 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-03 | 2026-11-03 | S1-12, S1-17 | Demo 05/11 | El selector ofrece los 14 roles del TO-BE; listas y fichas de cliente y oportunidad conectadas a la API; los rechazos de la API se muestran en pantalla |
| S1-19 | Crear la pantalla de cotizaciones: lista y ficha | codigo | Pablo | Pablo 1,5 | Núcleo | P0 | L | 1,5 | 2026-11-03 | 2026-11-03 | S1-14, S1-17 | Demo 05/11 | Se crea, envía y acepta la cotización desde la pantalla; su ficha muestra líneas, IGV, total, plazo, historial y oportunidad de origen |
| S1-20 | Crear la pantalla de anticipos y órdenes de venta: lista y ficha | codigo | Miguel | Miguel 1 | Núcleo | P0 | M | 1 | 2026-11-03 | 2026-11-03 | S1-16, S1-17 | Demo 05/11 | Asesor registra el anticipo, Tesorería lo confirma y se convierte a OV; la ficha de la OV muestra la cadena oportunidad → cotización → anticipo → OV |
| S1-21 | Probar de punta a punta la venta retail MTS con su trazabilidad y ensayar la demo | pruebas | Miguel, Luis, Pablo | Miguel 0,5 / Luis 0,5 / Pablo 0,5 | Núcleo | P0 | S | 1,5 | 2026-11-04 | 2026-11-04 | S1-18, S1-19, S1-20 | Demo 05/11 | El guion recorre cliente → oportunidad → cotización → anticipo → OV en pantalla y API dos veces sin errores, y desde la OV se reconstruye toda su cadena con quién y cuándo; cada uno explica su pieza |
| S1-22 | Escribir el capítulo semana-01 y crear el tag | docs | Pablo | Pablo 0,5 | Núcleo | P0 | S | 0,5 | 2026-11-04 | 2026-11-04 | S1-21 | Demo 05/11 | docs/capitulos/semana-01.md completo y revisado por Miguel; tag semana-01 |
| S1-23 | Implementar los estados Calificada, Con fecha y Perdida de la oportunidad | codigo | Luis | Luis 1 | Núcleo | P1 | M | 1 | 2026-11-05 | 2026-11-05 | S1-12, S1-14 | Demo 12/11 | Transiciones válidas con prueba; al rechazarse la cotización la oportunidad pasa a Perdida con motivo; todo queda en el historial (sección 4) |
| S1-24 | Registrar y calificar leads B2B | codigo | Luis | Luis 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-05 | 2026-11-05 | S1-12 | Demo 12/11 | LEAD-01 y LEAD-02 con prueba; el lead que califica es origen de la oportunidad B2B (PO.02.P01.SP01.A02) |
| S1-26 | Crear la pantalla de listas de precios | codigo | Pablo | Pablo 1 | Núcleo | P1 | M | 1 | 2026-11-05 | 2026-11-05 | S1-11, S1-18 | Demo 12/11 | Muestra listas Vigentes y Vencidas por canal con sus precios (sección 7, Precios) |
| S1-27 | Implementar la solicitud de descuento con motivo y límite por rol | codigo | Miguel | Miguel 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-05 | 2026-11-05 | S1-14 | Demo 12/11 | DES-01 y DES-02 con prueba; límites en configuración (PO.02.P02.SP01.A02, pasos 1 y 2) |
| S1-28 | Implementar la aprobación de descuentos por Jefatura y Gerencia con auditoría | codigo | Miguel | Miguel 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-05 | 2026-11-05 | S1-27 | Demo 12/11 | DES-03 con prueba: Jefatura dentro de su límite, Gerencia por encima; usuario y hora en el historial; con descuento pendiente la cotización no pasa a Aprobada (PO.02.P02.SP01.A02, paso 3) |
| S1-30 | Aplicar la plantilla oficial de la cotización para PDF | codigo | Pablo | Pablo 1 | Núcleo | P1 | M | 1 | 2026-11-05 | 2026-11-05 | S1-19 | Demo 12/11 | La ficha de la cotización se imprime o guarda como PDF con el formato oficial de FAMIHOGAR (PO.02.P02.SP02.A01, paso 3) |
| S1-25 | Crear la pantalla de leads con su ficha | codigo | Luis | Luis 1 | Núcleo | P1 | M | 1 | 2026-11-06 | 2026-11-06 | S1-24, S1-18 | Demo 12/11 | Se registra, califica o cierra un lead desde la pantalla; la ficha muestra historial y oportunidad derivada |
| S1-29 | Crear la pantalla de solicitudes de descuento con su ficha | codigo | Pablo | Pablo 1 | Núcleo | P1 | M | 1 | 2026-11-06 | 2026-11-06 | S1-28, S1-19 | Demo 12/11 | Jefatura y Gerencia aprueban o rechazan desde su bandeja; la ficha de la cotización muestra el descuento y quién lo aprobó |
| S1-31 | Implementar las notificaciones simuladas: bandeja por rol y registro de correo y WhatsApp | codigo | Pablo | Pablo 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-06 | 2026-11-06 | S1-08, S1-18 | Demo 12/11 | Cada cambio de estado configurado genera un aviso en la bandeja del rol responsable y un registro del envío simulado (sección 2, principios) |
| S1-33 | Implementar el requerimiento MTO y su contrato con Planta | codigo | Miguel | Miguel 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-06 | 2026-11-06 | S1-12 | Demo 12/11 | Registrado → En costeo → Costeado con historial; la oportunidad MTO es su origen; si falta información vuelve al ejecutivo (PO.02.P01.SP02.A02, PO.01.P02.SP01.A02) |
| S1-34 | Crear la versión mínima de Ingeniería en Planta: especificación, BOM y costo estándar | codigo | Miguel | Miguel 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-06 | 2026-11-06 | S1-33 | Demo 12/11 | Simulación sencilla detrás del contrato: especificación versionada, costo estándar Calculado → Aprobado por Contabilidad y publicación del costo base con aviso al ejecutivo (PO.01.P02.SP01.A02, PO.01.P04.SP01.A02) |
| S1-32 | Generar los recordatorios de seguimiento de la cotización | codigo | Pablo | Pablo 1 | Núcleo | P1 | M | 1 | 2026-11-07 | 2026-11-07 | S1-14, S1-31 | Demo 12/11 | Una cotización Enviada sin respuesta genera recordatorios al vendedor según un plazo configurable (PO.02.P02.SP02.A02, paso 2) |
| S1-35 | Aplicar el margen sobre el costo base y habilitar la cotización MTO | codigo | Pablo | Pablo 1 | Núcleo | P1 | M | 1 | 2026-11-07 | 2026-11-07 | S1-34, S1-13 | Demo 12/11 | MTO-01 con prueba; la cotización MTO usa el costo publicado y guarda su requerimiento de origen (PO.02.P02.SP01.A01 paso 2, PO.02.P01.SP02.A02 paso 3) |
| S1-36 | Implementar la verificación de crédito B2B y el bloqueo por mora | codigo | Miguel | Miguel 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-07 | 2026-11-07 | S1-15 | Demo 12/11 | En Finanzas › Créditos y Cobranzas, consultado por Ventas mediante contrato: CRE-01 y MOR-01 con prueba; línea disponible y mora; aprobación automática o decisión del rol Créditos; un cliente bloqueado no cotiza ni convierte a OV (PO.02.P03.SP02.A01) |
| S1-38 | Crear la versión mínima de stock multisede en Logística | codigo | Miguel | Miguel 1 | Núcleo | P1 | M | 1 | 2026-11-07 | 2026-11-07 | S1-11 | Demo 12/11 | Simulación sencilla detrás del contrato `ConsultarStock`: stock por sede desde datos semilla; STK-01 con prueba (PO.02.P01.SP02.A01, paso 1) |
| S1-37 | Crear la pantalla de evaluación de crédito con su ficha | codigo | Luis | Luis 1 | Núcleo | P1 | M | 1 | 2026-11-08 | 2026-11-08 | S1-36, S1-20 | Demo 12/11 | Créditos decide las solicitudes pendientes; la ficha muestra línea, mora, decisión, usuario y hora |
| S1-39 | Implementar las reservas con vencimiento y la reserva firme al confirmar la OV | codigo | Miguel | Miguel 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-08 | 2026-11-08 | S1-38, S1-16 | Demo 12/11 | Activa → Comprometida → Consumida / Liberada con historial; vence sola; se vuelve firme con la OV; sin stock se ofrece transferencia o MTO (PO.02.P01.SP02.A01 pasos 2 y 3, PO.02.P04.SP01.A01 paso 3) |
| S1-41 | Distribuir la orden de venta: despacho MTS o demanda MTO, con aviso al cliente | codigo | Miguel | Miguel 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-08 | 2026-11-08 | S1-16, S1-31 | Demo 12/11 | DIS-01 con prueba: la OV pasa a Liberada; se crea la orden de despacho o la demanda MTO por contrato, como documentos derivados de la OV (PO.02.P04.SP01.A02) |
| S1-40 | Crear las pantallas de stock por sede y reservas | codigo | Luis | Luis 1 | Núcleo | P1 | M | 1 | 2026-11-09 | 2026-11-09 | S1-39, S1-18 | Demo 12/11 | Se consulta el stock por sede y se ven las reservas con su estado y vencimiento; la ficha de la OV muestra su reserva |
| S1-42 | Crear la versión mínima de Producción en Planta: demanda, orden de producción e ingreso a PT | codigo | Miguel | Miguel 1,5 | Núcleo | P1 | L | 1,5 | 2026-11-09 | 2026-11-09 | S1-41 | Demo 12/11 | Simulación sencilla detrás del contrato: demanda Consolidada → OP Planificada → Terminada; el ingreso a PT se asigna a su OV (En proceso → Lista para despacho), avisa al vendedor y libera el despacho (PO.03.P01.SP01.A01, PO.03.P06.SP01.A01) |
| S1-44 | Configurar CI con GitHub Actions | configuracion | Miguel | Miguel 1 | Núcleo | P1 | M | 1 | 2026-11-09 | 2026-11-09 | S1-04 | Demo 12/11 | Un PR con una prueba rota sale en rojo y uno sano en verde; desde ahora es obligatorio (D11, guía docs/guias/ci.md) |
| S1-43 | Crear la pantalla de simulación de Planta | codigo | Luis | Luis 1 | Núcleo | P1 | M | 1 | 2026-11-10 | 2026-11-10 | S1-34, S1-42, S1-17 | Demo 12/11 | Botones para aprobar el costo de Ingeniería, consolidar la demanda y terminar una OP; fichas del requerimiento, la BOM y la OP con su historial y cadena |
| S1-45 | Probar de punta a punta el caso MTO con su trazabilidad y ensayar la demo | pruebas | Miguel, Luis, Pablo | Miguel 0,5 / Luis 0,5 / Pablo 0,5 | Núcleo | P1 | S | 1,5 | 2026-11-11 | 2026-11-11 | S1-35, S1-40, S1-41, S1-43, S1-29, S1-37 | Demo 12/11 | El guion recorre un caso MTO (requerimiento → costo → cotización → crédito o anticipo → OV → demanda → OP → PT) y uno MTS con reserva, en pantalla y API, con su cadena completa; cada uno explica su pieza |
| S1-46 | Escribir el capítulo semana-02 y crear el tag | docs | Pablo | Pablo 0,5 | Núcleo | P1 | S | 0,5 | 2026-11-11 | 2026-11-11 | S1-45 | Demo 12/11 | docs/capitulos/semana-02.md completo y revisado por Miguel; tag semana-02 |
| S1-47 | Crear la versión mínima de reposición y transferencias en Logística | codigo | Miguel | Miguel 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-12 | 2026-11-12 | S1-38 | Demo 19/11 | Simulación sencilla detrás del contrato: solicitud por punto de reorden Sugerida → Aprobada, orden de transferencia Creada → En tránsito → Recibida con guía de remisión e incidencias (PO.04.P01.SP01.A02, PO.04.P02.SP02.A02, PO.04.P04.SP02.A02) |
| S1-48 | Crear la versión mínima de despacho y POD en Logística | codigo | Miguel | Miguel 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-12 | 2026-11-12 | S1-41 | Demo 19/11 | Simulación sencilla detrás del contrato: bandeja de órdenes liberadas con zona, vehículo y fecha; POD con firma y foto simuladas; la OV pasa a Entregada y dispara la facturación (PO.05.P01.SP01.A01, PO.05.P03.SP02.A02) |
| S1-52 | Implementar la bandeja única omnicanal de Postventa | codigo | Luis | Luis 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-12 | 2026-11-12 | S1-16 | Demo 19/11 | Entradas simuladas por teléfono, WhatsApp, correo y tienda; se identifica cliente y OV o comprobante; consulta o reclamo (PO.06.P01.SP01.A01) |
| S1-53 | Registrar el ticket de reclamo vinculado a la orden de venta | codigo | Luis | Luis 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-12 | 2026-11-12 | S1-52, S1-09 | Demo 19/11 | REC-01 con prueba: ticket con fotos simuladas, número único, Borrador → Abierto, derivado de la OV y del producto (PO.06.P01.SP01.A02) |
| S1-49 | Crear la versión mínima de comprobantes en Finanzas | codigo | Miguel | Miguel 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-13 | 2026-11-13 | S1-48 | Demo 19/11 | Simulación sencilla detrás del contrato: boleta o factura desde la OV sin redigitar, SUNAT simulada (rechazo y reenvío), la OV pasa a Facturada y nace la cuenta por cobrar; FAC-01 con prueba (PA.01.P01.SP01.A01) |
| S1-50 | Crear la versión mínima de conciliación y cartera en Finanzas | codigo | Miguel | Miguel 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-13 | 2026-11-13 | S1-15, S1-49, S1-36 | Demo 19/11 | Finanzas › Tesorería y Cobranzas en versión mínima: la confirmación de anticipos pasa de Ventas a Tesorería por contrato (D17); extracto de ejemplo, cruce de abonos y anticipo Conciliado; cuentas por cobrar Vigente / Vencida / Pagada con recordatorios y bloqueo por mora (PA.01.P01.SP02.A01, PA.01.P03.SP01.A01) |
| S1-54 | Categorizar la falla con catálogo, prioridad y plazo | codigo | Luis | Luis 1 | Núcleo | P2 | M | 1 | 2026-11-13 | 2026-11-13 | S1-53 | Demo 19/11 | El tipo de falla define prioridad y plazo; el ticket pasa a Clasificado (PO.06.P01.SP02.A01) |
| S1-51 | Crear la pantalla de simulación de Logística y Finanzas | codigo | Luis | Luis 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-14 | 2026-11-14 | S1-47, S1-48, S1-49, S1-50 | Demo 19/11 | Transferencias, bandeja de despacho, POD en vista móvil, comprobantes y cartera, cada uno con su ficha, historial y cadena |
| S1-55 | Derivar el ticket al área responsable y controlar su plazo | codigo | Pablo | Pablo 1 | Núcleo | P2 | M | 1 | 2026-11-14 | 2026-11-14 | S1-54, S1-31 | Demo 19/11 | Derivación por categoría, aviso al responsable y alerta de plazo vencido; el ticket pasa a Derivado (PO.06.P01.SP02.A02) |
| S1-56 | Validar la garantía desde la fecha de entrega | codigo | Pablo | Pablo 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-14 | 2026-11-14 | S1-55, S1-48 | Demo 19/11 | La vigencia se calcula desde el POD de la OV; En garantía → evaluación; Fuera de garantía → servicio con costo (PO.06.P02.SP01.A01) |
| S1-66 | Calcular los indicadores comerciales | codigo | Miguel | Miguel 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-14 | 2026-11-14 | S1-14, S1-15, S1-28, S1-34 | Demo 19/11 | Tasa de conversión, tiempo de respuesta de cotización, tiempo de costeo MTO, tiempo de validación de pago y descuento promedio fuera de lista, desde el historial (sección 9) |
| S1-57 | Registrar la evaluación de evidencias, la visita técnica y el diagnóstico | codigo | Pablo | Pablo 1 | Núcleo | P2 | M | 1 | 2026-11-15 | 2026-11-15 | S1-56 | Demo 19/11 | Revisión de evidencias, visita agendada si hace falta y diagnóstico; el ticket pasa a Diagnosticado (PO.06.P02.SP02.A01) |
| S1-58 | Emitir el dictamen de cobertura y la solución | codigo | Pablo | Pablo 1 | Núcleo | P2 | M | 1 | 2026-11-15 | 2026-11-15 | S1-57 | Demo 19/11 | Procedente / No procedente con solución (reparación, reproceso o nota de crédito) y aviso al cliente; el dictamen es documento derivado del ticket (PO.06.P02.SP02.A02) |
| S1-59 | Gestionar la orden de servicio técnico in situ | codigo | Luis | Luis 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-16 | 2026-11-16 | S1-58 | Demo 19/11 | Programada → Cerrada con técnico, fecha, repuestos y conformidad del cliente; cierra el ticket (PO.06.P03.SP01.A01) |
| S1-60 | Gestionar el reingreso a taller con orden de reproceso | codigo | Luis | Luis 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-16 | 2026-11-16 | S1-58, S1-42 | Demo 19/11 | Guía de retorno, orden de reproceso a Planta por contrato (Planificada → Terminada) y reentrega programada (PO.06.P03.SP01.A02) |
| S1-61 | Gestionar la nota de crédito con aprobación auditada | codigo | Miguel | Miguel 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-16 | 2026-11-16 | S1-58, S1-49 | Demo 19/11 | RMA Pendiente → Aprobada por Jefatura con usuario y hora; Finanzas › Facturación emite la nota de crédito por contrato y se aplica a la cuenta del cliente (PO.06.P03.SP02.A01) |
| S1-62 | Gestionar el reingreso al almacén de cuarentena | codigo | Miguel | Miguel 1 | Núcleo | P2 | M | 1 | 2026-11-16 | 2026-11-16 | S1-61, S1-38 | Demo 19/11 | Stock Bloqueado; Calidad decide reproceso, saldo o baja y Logística mueve el stock por contrato (PO.06.P03.SP02.A02) |
| S1-63 | Crear las pantallas de Postventa con sus fichas | codigo | Pablo | Pablo 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-16 | 2026-11-16 | S1-58 | Demo 19/11 | Bandeja única, tickets, diagnóstico, dictamen, órdenes de servicio y notas de crédito, con historial y cadena desde la OV |
| S1-64 | Crear la pantalla de trazabilidad: flujo completo de cualquier documento | codigo | Luis | Luis 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-17 | 2026-11-17 | S1-17, S1-51, S1-63 | Demo 19/11 | Se busca cualquier documento por su correlativo y se ve su flujo completo, de la oportunidad a la nota de crédito, con estados, usuarios y fechas |
| S1-65 | Crear el tablero inicial por rol con bandejas de pendientes | codigo | Luis | Luis 1,5 | Núcleo | P2 | L | 1,5 | 2026-11-17 | 2026-11-17 | S1-31, S1-51, S1-63 | Demo 19/11 | Vendedor, jefatura, tesorería, almacén y postventa ven sus pendientes al ingresar (sección 7) |
| S1-67 | Calcular los indicadores de operación | codigo | Miguel | Miguel 1 | Núcleo | P2 | M | 1 | 2026-11-17 | 2026-11-17 | S1-48, S1-50, S1-58 | Demo 19/11 | Entregas a tiempo, tiempo de atención de reclamos, reclamos por tipo de falla y cartera vencida (sección 9) |
| S1-68 | Probar de punta a punta MTS y MTO con despacho, factura y reclamo, y ensayar la demo | pruebas | Miguel, Luis, Pablo | Miguel 1 / Luis 1 / Pablo 1 | Núcleo | P2 | M | 3 | 2026-11-18 | 2026-11-18 | S1-59, S1-60, S1-62, S1-64, S1-65, S1-66, S1-67 | Demo 19/11 | Un caso MTS y uno MTO recorren todo el TO-BE hasta la factura y un reclamo; la pantalla de trazabilidad reconstruye cada flujo; cada uno explica su pieza (pág. 87) |
| S1-69 | Escribir el capítulo semana-03, crear el tag y la matriz de cobertura del TO-BE | docs | Pablo | Pablo 1 | Núcleo | P2 | M | 1 | 2026-11-18 | 2026-11-18 | S1-68 | Demo 19/11 | docs/capitulos/semana-03.md con la matriz de los 35 microprocesos y los 25 registros, revisado por Miguel; tag semana-03 |

## Carga por persona

El reparto sigue la experiencia (D20): **Miguel** lleva más horas, **Luis** es el segundo y **Pablo** el tercero. Luis y Pablo tardarán más que lo estimado mientras aprenden C#; por eso tienen menos horas planificadas.

| Persona | Fase A | Fase B | Fase C | Tarjetas | Revisión de PR | Total |
|---|---|---|---|---|---|---|
| Miguel | 12 h | 14,5 h | 12 h | 38,5 h | ≈ 3 h | **≈ 41,5 h** |
| Luis | 11 h | 7 h | 12,5 h | 30,5 h | — | **30,5 h** (+ S1-00 ya hecha) |
| Pablo | 11,5 h | 7,5 h | 8 h | 27 h | — | **27 h** |

**Revisión de PR (≈ 3 h en total):** los PR son pequeños (una tarjeta) y traen el apartado "Explicado con mis palabras", así que una revisión toma pocos minutos. Miguel revisa los que tocan reglas, `Compartido` o migraciones; Luis y Pablo se revisan entre sí el resto.

**Dueños por dominio:** Miguel — arquitectura y trazabilidad; en Ventas: anticipo, descuentos y OV; Finanzas (crédito, tesorería, facturación, cobranzas); Logística; Planta; nota de crédito e indicadores · Luis — CRM (cliente, oportunidad, leads); en Postventa: recepción de reclamos (bandeja, ticket, categoría) y servicio técnico; ficha común, pantallas de simulación, trazabilidad y tablero por rol · Pablo — en Ventas: precios, cotización y PDF; notificaciones; en Postventa: evaluación de reclamos (garantía, diagnóstico, dictamen) y sus pantallas; capítulos.

## Plan por día

Calculado a partir de las dependencias. En cada fase se usó el menor tope diario posible (fase A: 3 h, fase B: 3 h, fase C: 3 h). Si un día se trabaja menos, la tarjeta se corre al siguiente dentro de la fase; si la fase no alcanza, se aplica la regla de recorte de [alcance/comercial.md](../alcance/comercial.md#regla-de-recorte).

| Día | Miguel | Luis | Pablo |
|---|---|---|---|
| Vie 30/10 | S1-01, S1-04 (2 h) | S1-02, S1-03, S1-06 (3 h) | S1-02, S1-03, S1-06 (3 h) |
| Sáb 31/10 | S1-05, S1-07 (3 h) | S1-07 (1,5 h) | S1-07 (1,5 h) |
| Dom 01/11 | S1-08, S1-09 (2,5 h) | S1-10 (1,5 h) | S1-11, S1-13 (3 h) |
| Lun 02/11 | S1-15 (1,5 h) | S1-12, S1-17 (3 h) | S1-14 (1,5 h) |
| Mar 03/11 | S1-16, S1-20 (2,5 h) | S1-18 (1,5 h) | S1-19 (1,5 h) |
| Mié 04/11 · fin de fase | S1-21 (0,5 h) | S1-21 (0,5 h) | S1-21, S1-22 (1 h) |
| Jue 05/11 | S1-27, S1-28 (3 h) | S1-23, S1-24 (2,5 h) | S1-26, S1-30 (2 h) |
| Vie 06/11 | S1-33, S1-34 (3 h) | S1-25 (1 h) | S1-29, S1-31 (2,5 h) |
| Sáb 07/11 | S1-36, S1-38 (2,5 h) | — | S1-32, S1-35 (2 h) |
| Dom 08/11 | S1-39, S1-41 (3 h) | S1-37 (1 h) | — |
| Lun 09/11 | S1-42, S1-44 (2,5 h) | S1-40 (1 h) | — |
| Mar 10/11 | — | S1-43 (1 h) | — |
| Mié 11/11 · fin de fase | S1-45 (0,5 h) | S1-45 (0,5 h) | S1-45, S1-46 (1 h) |
| Jue 12/11 | S1-47, S1-48 (3 h) | S1-52, S1-53 (3 h) | — |
| Vie 13/11 | S1-49, S1-50 (3 h) | S1-54 (1 h) | — |
| Sáb 14/11 | S1-66 (1,5 h) | S1-51 (1,5 h) | S1-55, S1-56 (2,5 h) |
| Dom 15/11 | — | — | S1-57, S1-58 (2 h) |
| Lun 16/11 | S1-61, S1-62 (2,5 h) | S1-59, S1-60 (3 h) | S1-63 (1,5 h) |
| Mar 17/11 | S1-67 (1 h) | S1-64, S1-65 (3 h) | — |
| Mié 18/11 · fin de fase | S1-68 (1 h) | S1-68 (1 h) | S1-68, S1-69 (2 h) |
