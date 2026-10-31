# Anexo B — Registro de decisiones

[← Índice](../README.md)

Formato: fecha · decisión · alternativas consideradas · por qué. Ámbito: *Global* o del área.

**Estados:** *Aprobada* · *Propuesta* (pendiente de confirmar por el equipo) · *Modificada (fecha)* (sigue vigente, con cambios).

## Cómo se cambia una decisión (D24)

Si algo nuevo contradice o cambia una decisión ya registrada, **no se crea una decisión nueva**: se modifica la existente.

1. Se conserva el texto original tal cual (no se borra ni se reescribe).
2. Se agrega debajo un bloque **Modificación AAAA-MM-DD** con qué cambia y por qué.
3. Se actualiza la línea **Vigente**, que dice en una frase lo que rige hoy.
4. El estado pasa a *Modificada (AAAA-MM-DD)*. Si se modifica varias veces, se agregan bloques en orden de fecha.
5. Si solo se vuelve a confirmar sin cambios, se agrega una línea **Confirmada AAAA-MM-DD**.

Solo se crea una decisión `Dnn` nueva cuando el tema no estaba decidido antes. Siguiente número libre: **D26**.

---

## D01 — Objetivo: el mejor intento funcional
**Fecha:** 2026-10-28 · **Estado:** Aprobada · **Ámbito:** Global
**Decisión:** Objetivo: el mejor intento funcional, no un ERP robusto
**Alternativas:** Apuntar a un ERP completo y pulido.
**Por qué:** El curso evalúa que se entiendan y definan los grandes procesos y se conviertan en un sistema que funcione. Somos estudiantes y vamos aprendiendo sobre la marcha.

## D02 — Fuente de verdad del alcance
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-29) · **Ámbito:** Global
**Decisión original:** El Documento TO-BE FAMIHOGAR es la fuente de verdad del alcance; cada regla cita su microproceso
**Alternativas:** Definir el alcance por intuición o por otros ERP.
**Por qué:** Evita inventar procesos y permite trazar cada regla hasta su origen. No hay experto de negocio al que entrevistar.
**Modificación 2026-10-29:** Cada área tiene su propio alcance y su propia fuente. El Documento TO-BE FAMIHOGAR es la fuente de verdad **solo del área Comercial**. La fuente de Logística aún no se conoce (se espera indicación del profesor); las áreas siguientes las solicitará el profesor. Motivo: el TO-BE describe el área Comercial; el resto de áreas no sale de ese documento.
**Vigente:** Cada área tiene su fuente de verdad en `docs/fuentes/` y su alcance en `docs/alcance/`; el TO-BE manda solo en Comercial.

## D03 — Monolito modular
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-31) · **Ámbito:** Global
**Decisión original:** Monolito modular: una solución .NET, una base SQL Server, un módulo por área
**Alternativas:** Microservicios; un sistema por área.
**Por qué:** En un ERP los módulos se hablan todo el tiempo; separar servicios traería problemas de red y datos duplicados sin beneficio a esta escala. El monolito modular permite agregar áreas sin romper las anteriores.
**Confirmada 2026-10-29** sin cambios.
**Modificación 2026-10-30:** Se fijan cinco módulos de área más `Compartido`: **Comercial**, **Planta** (Ingeniería y Producción), **Logistica** (inventario, transferencias, despacho), **Finanzas** (comprobantes, conciliación, cuentas por cobrar) y **Postventa**, tomados de la tabla de módulos del TO-BE (sección 2). Todas las áreas las construye el mismo equipo.
**Modificación 2026-10-31:** Cada módulo se divide en **submódulos** (grupos de procesos con sus documentos y un rol responsable; las características como precios o descuentos viven dentro de un submódulo). Quedan **cuatro módulos de área** más `Compartido`: **Comercial** (CRM, Ventas, Postventa), **Finanzas** (Tesorería, Créditos y Cobranzas, Facturación), **Logística** (Inventarios, Despacho) y **Planta** (Ingeniería, Producción); `Compartido` tiene Trazabilidad, Seguridad y Notificaciones. **Postventa deja de ser módulo y pasa a submódulo de Comercial**, porque el TO-BE trata PO.06 como núcleo comercial. La **evaluación de crédito** pasa de Comercial a **Finanzas › Créditos y Cobranzas**, como en la tabla de módulos del TO-BE (sección 2). Detalle en `docs/arquitectura.md` 3.2.
**Vigente:** Monolito modular: Comercial (CRM, Ventas, Postventa), Finanzas (Tesorería, Créditos y Cobranzas, Facturación), Logística (Inventarios, Despacho), Planta (Ingeniería, Producción) y Compartido.

## D04 — Stack: C#, .NET, EF Core y SQL Server
**Fecha:** 2026-10-28 · **Estado:** Aprobada · **Ámbito:** Global
**Decisión:** Stack: C#, ASP.NET Core Web API, Entity Framework Core y SQL Server; versión LTS vigente de .NET fijada en `global.json`
**Alternativas:** Otro lenguaje o base de datos.
**Por qué:** Es lo que el equipo ya decidió; Miguel tiene experiencia en C#. La versión exacta se registra en `docs/contexto.md` al crear el esqueleto.
**Confirmada 2026-10-29** sin cambios.

## D05 — Tres capas por módulo
**Fecha:** 2026-10-28 · **Estado:** Aprobada · **Ámbito:** Global
**Decisión:** Tres capas por módulo: Api → Servicios → Datos (repositorios con EF Core)
**Alternativas:** Clean Architecture o DDD completo; cuatro capas separando "Api" de "controlador" (descartada el 2026-10-29: en ASP.NET Core la capa Api *son* los controladores).
**Por qué:** Luis y Pablo solo conocen POO; tres capas se aprenden en una tarjeta y ya aplican SOLID (inyección de dependencias, una responsabilidad por clase). Se puede evolucionar después.
**En palabras simples:** Api (controladores) recibe el pedido y devuelve la respuesta, sin decidir nada; Servicios aplica las reglas de negocio; Datos guarda y lee de la base. Así las reglas viven en un solo lugar y se prueban sin base de datos.
**Confirmada 2026-10-29** sin cambios.

## D06 — Un esquema SQL por módulo y contratos públicos
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-31) · **Ámbito:** Global
**Decisión original:** Un esquema SQL por módulo; los módulos solo se hablan por su interfaz pública en `Contratos`
**Alternativas:** Tablas compartidas libres; `JOIN` entre módulos.
**Por qué:** Mantiene fronteras claras para que agregar Logística no rompa Comercial y deja abierta la opción de separar módulos más adelante.
**Confirmada 2026-10-29** sin cambios.
**Modificación 2026-10-30:** "Cada área se encarga de lo suyo": los procesos que el TO-BE Comercial marca como **interfaz** (PO.01, PO.03, PO.04, PO.05, PA.01) se construyen como **versión mínima** dentro del módulo de su área, detrás de su contrato: una simulación sencilla que hace lo que el TO-BE describe con datos semilla o pasos manuales. Comercial nunca contiene lógica de otra área. Cuando llegue el sprint de esa área, el equipo amplía su versión mínima sin que Comercial cambie.
**Modificación 2026-10-31:** Las reglas se aplican por **módulo**, no por submódulo: un esquema SQL por módulo (`comercial.Ticket`), y los submódulos de un mismo módulo se usan directamente entre sí (Postventa lee la OV de Ventas sin contrato). Entre módulos distintos sigue la regla de solo contratos. La evaluación de crédito vive en Finanzas pero se construye completa en el sprint 1, porque es núcleo del TO-BE (PO.02.P03.SP02); Ventas la consulta por contrato.
**Vigente:** Un esquema por módulo; submódulos del mismo módulo se usan directo; entre módulos solo contratos; las interfaces son versiones mínimas en el módulo dueño.

## D07 — Sprints y calendario
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-30) · **Ámbito:** Global
**Decisión original:** Sprints semanales de jueves a miércoles; la review es la presentación del jueves. Primera presentación supuesta el 05/11/2026
**Alternativas:** Sprints de 2 semanas.
**Por qué:** El curso exige un avance cada jueves. **Por confirmar:** si la primera presentación es el 29/10 o el 05/11; la regla de recorte cubre ambos casos.
**Modificación 2026-10-29:** Se confirma la primera presentación el **jueves 05/11/2026** y el ritmo de **un área por semana**: cada jueves se presenta un área nueva.
**Modificación 2026-10-30:** El **sprint 1 cubre todo el TO-BE Comercial y dura 3 semanas** (29/10 – 18/11), con demos el jueves 05/11, 12/11 y 19/11 (fases A, B y C). La fecha del área Logística queda **pendiente hasta que el equipo la confirme**; las áreas siguientes, igual. Motivo: el equipo decidió cubrir el documento completo y no cabe en una semana (≈ 105 h de trabajo).
**Vigente:** Sprint 1 = TO-BE Comercial completo en 3 semanas con demo semanal; la fecha de Logística se confirmará.

## D08 — Tarjetas de 1–1,5 h y WIP de 1
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-30) · **Ámbito:** Global
**Decisión original:** Tarjetas de 1–1,5 h, una por sesión, WIP de 1 por persona, definición de terminado única
**Alternativas:** Tarjetas de hasta 3 h.
**Por qué:** Cada persona dispone de 1–1,5 h al día; una tarjeta cabe en una sesión y el avance es visible.
**Modificación 2026-10-30:** Las sesiones pasan a ser de **2 a 3 h** por día. Las tarjetas siguen siendo de 1–1,5 h y en una sesión se encadenan, siempre de una en una (WIP 1).
**Vigente:** Tarjetas de 1–1,5 h, sesiones de 2–3 h que encadenan tarjetas, WIP de 1 por persona.

## D09 — Uso de la IA para escribir código
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-31) · **Ámbito:** Global
**Decisión original:** La IA solo genera código repetitivo (entidades, DTOs, CRUD, configuración de EF Core, semillas, HTML/CSS de tablas y formularios) y siempre pide permiso antes de escribir o ejecutar. Las reglas de negocio y las pruebas las escribe el equipo
**Alternativas:** Que la IA escriba todo; que no escriba nada.
**Por qué:** Acelera lo mecánico sin quitarle al equipo lo que debe aprender y defender.
**Confirmada 2026-10-29** sin cambios (se cambia "HTML/Bootstrap" por "HTML/CSS" por D13).
**Modificación 2026-10-29 (modo tutor):** Luis y Pablo llegan solo con POO y existe el riesgo de "vibecodear" (pedirle todo a la IA sin entenderlo). Por eso el asistente identifica a la persona al iniciar (`/iniciar`) y, con Luis y Pablo, trabaja en **modo tutor**: (1) antes de escribir, pregunta cómo lo construirían; (2) escribe solo lo repetitivo y las **bases**: clases, propiedades, DTOs, firmas de métodos, configuración y HTML de formularios; (3) el cuerpo de las reglas, las pruebas y la lógica de las pantallas (`fetch`, mostrar resultados) los escribe la persona, a partir de marcas `// TODO (Nombre): …` que describen en palabras qué hacer; (4) si la persona se traba, da pistas graduales (pregunta → concepto → ejemplo de un caso distinto), nunca la solución exacta; (5) al terminar, le pide que explique lo que escribió. Con Miguel se aplica D09 sin modo tutor.
**Modificación 2026-10-30:** **La IA puede generar código**, incluidas reglas de negocio y pruebas, siempre **sencillo y fácil de entender** (nombres claros, métodos cortos, comentarios donde haga falta, sin patrones avanzados). **Siempre pregunta antes** de escribir o ejecutar. **Regla general: el asistente no crea ni modifica ningún archivo sin preguntar antes.** El **modo tutor queda suspendido**; su descripción se conserva arriba por si el equipo decide volver a él. **Se mantiene** que en `/cierre` cada integrante explique con sus palabras lo que hizo: explicar es fundamental en este proyecto.
**Modificación 2026-10-31 (explicar los términos):** el asistente **explica cada término técnico nuevo antes de usarlo**: qué es, para qué sirve y por qué se introduce, en lenguaje sencillo y con lo esencial. Aplica en toda la conversación, no solo en `/cierre`.
**Vigente:** La IA genera código sencillo, pregunta antes y nunca crea ni modifica archivos sin permiso; cada uno explica su trabajo en /cierre; explica cada término técnico nuevo antes de usarlo; modo tutor suspendido.

## D10 — Pruebas xUnit por regla de negocio
**Fecha:** 2026-10-28 · **Estado:** Aprobada · **Ámbito:** Global
**Decisión:** Pruebas con xUnit sobre la capa de Servicios, al menos una por regla del catálogo; integración desde la semana 3; sin pruebas de interfaz
**Alternativas:** Sin pruebas; pruebas de interfaz.
**Por qué:** Es la prueba más barata de aprender (≈ 1 h) y la que más protege: las reglas de negocio son lo que se evalúa.
**Confirmada 2026-10-29** sin cambios.

## D11 — CI con GitHub Actions
**Fecha:** 2026-10-28 · **Estado:** Aprobada · **Ámbito:** Global
**Decisión:** CI con GitHub Actions: tarjeta "Si alcanza" en la semana 1 y obligatoria desde la semana 2
**Alternativas:** Sin CI; CI desde el inicio.
**Por qué:** Convierte "`main` siempre funciona" en una regla automática. La semana 1 ya está ajustada de horas.
**Confirmada 2026-10-29** sin cambios.

## D12 — Simulaciones: rol, SUNAT y datos ficticios
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-30) · **Ámbito:** Global
**Decisión original:** Simulaciones: login con selector de rol, SUNAT y facturación simuladas, datos ficticios, sin nube
**Alternativas:** Login real; SUNAT real.
**Por qué:** No hay datos sensibles y el objetivo es el proceso, no la infraestructura.
**Modificación 2026-10-29:** Desaparece la categoría "fuera de alcance". Lo que antes figuraba así se reparte en dos: los **procesos del área** que no entran al núcleo pasan a **Si alcanza**; la **infraestructura real** (login real, SUNAT real, nube, app móvil, correo y WhatsApp reales, datos reales) queda en la categoría **Simulado** durante todo el curso.
**Modificación 2026-10-30:** Simulaciones que agrega el TO-BE completo: la **app móvil** del chofer y del técnico es una **vista web adaptada a celular**; el **extracto bancario** es un archivo de ejemplo; las áreas de interfaz funcionan como versión mínima (D06).
**Vigente:** Infraestructura real simulada (login, SUNAT, correo, WhatsApp, app móvil, banco, nube, datos reales).

## D13 — Front
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-30) · **Ámbito:** Global
**Decisión original:** Front pendiente. Semana 1: demo por la API (Swagger/Scalar); pantalla mínima HTML + Bootstrap + `fetch` como Nivel 2. La elección entre eso y Angular se toma en el planning de la semana 2
**Alternativas:** Angular desde el inicio; decidir hoy.
**Por qué:** Angular exige TypeScript, componentes, servicios y RxJS: varias semanas que no hay. Como la API es la misma, migrar después no obliga a rehacer el back. Alternativa a evaluar: Razor Pages dentro del mismo proyecto (todo en C#).
**Modificación 2026-10-29:** Front en **HTML + CSS propio + JavaScript**, sin Bootstrap ni frameworks, servido desde `src/Erp.Api/wwwroot` y conectado a la API con `fetch`. La demo de cada jueves exige **pantalla y API** como mínimo aceptable, así que la pantalla del camino feliz pasa al **Núcleo**. La pantalla de acceso simulado y selector de aplicaciones que preparó Luis es la base del front. Dueño de los archivos de `wwwroot` en la semana 1: Luis (el resto de `Erp.Api` es de Miguel).
**Modificación 2026-10-29 (dueños de pantallas):** Cada integrante hace la pantalla de su propia pieza (Luis: cliente y oportunidad; Pablo: cotización; Miguel: anticipo y OV). Cada pantalla tiene sus propios archivos en `wwwroot/comercial/`; los archivos comunes (`index.html`, `aplicaciones.js`, `estilos.css`) son de Luis y los cambios de otros se revisan con él.
**Modificación 2026-10-30:** Cada documento tiene su **ficha** (D25): cabecera, detalle, historial y cadena documental, imprimible. Las pantallas se organizan por módulo y las hace el dueño de cada pieza. El selector de rol ofrece los 14 roles del TO-BE.
**Vigente:** HTML + CSS propio + JS en `wwwroot`; pantalla y API en cada demo; cada uno hace la pantalla y la ficha de su pieza.

## D14 — La cotización incluye el estado Aprobada
**Fecha:** 2026-10-28 · **Estado:** Aprobada · **Ámbito:** Comercial
**Decisión:** La cotización incluye el estado **Aprobada**: Borrador → Aprobada → Enviada → Aceptada / Rechazada / Vencida. En la semana 1, pasa a Aprobada sola si no tiene descuento pendiente
**Alternativas:** Omitir "Aprobada".
**Por qué:** El TO-BE (sección 4) lo lista. Sin descuentos en el núcleo, no hay nadie que apruebe, así que la transición es automática (SUPUESTO).

## D15 — Estados de la orden de venta
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-30) · **Ámbito:** Comercial
**Decisión original:** La OV nace en estado **Confirmada**
**Alternativas:** Usar "Registrada".
**Por qué:** Discrepancia del TO-BE: el microproceso `PO.02.P04.SP01.A01` dice "Confirmada" y la tabla de estados (sección 4) dice "Registrada → Liberada…". Se sigue el microproceso porque es lo que el prototipo ejecuta; se anota para el profesor.
**Modificación 2026-10-30:** Con el TO-BE completo, la OV recorre todos sus estados: **Confirmada → Liberada → En proceso → En preparación / Lista para despacho → Entregada → Facturada**. "Confirmada" equivale a "Registrada" de la tabla de estados del TO-BE. Aprobado por el equipo.
**Vigente:** OV: Confirmada → Liberada → En proceso → En preparación / Lista para despacho → Entregada → Facturada.

## D16 — Idioma y convenciones de nombres
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-29) · **Ámbito:** Global
**Decisión original:** Idioma: español en documentación, commits, tablas, clases y métodos del dominio (`Cliente`, `Cotizacion`, `OrdenVenta`), sin tildes en identificadores; sufijos técnicos de .NET en inglés (`Service`, `Repository`, `Controller`). *Por confirmar con el equipo.*
**Alternativas:** Todo en inglés; todo en español.
**Por qué:** Coincide con "la documentación sigue igual"; los sufijos en inglés son la convención de .NET y evitan nombres raros.
**Modificación 2026-10-29:** El equipo la confirma tal cual; pasa de *Propuesta* a vigente.
**Vigente:** Dominio en español sin tildes + sufijos técnicos en inglés (`ClienteService`, `ClienteController`).

## D17 — Estados del anticipo
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-31) · **Ámbito:** Comercial
**Decisión original:** El anticipo pasa de Registrado a Confirmado en la semana 1; "Conciliado" (cruce con el extracto bancario) queda para Finanzas
**Alternativas:** Modelar los tres estados del TO-BE ahora.
**Por qué:** `Conciliado` depende del módulo Finanzas, que aún no existe. Tesorería simulada confirma dentro de Comercial.
**Modificación 2026-10-30:** Con la versión mínima de Finanzas (S1-50) vuelve el estado **Conciliado**: Registrado → Conciliado → Confirmado cuando el abono cruza con el extracto. Tesorería puede confirmar a mano los abonos que no cruzan, como dice el TO-BE (sección 3).
**Modificación 2026-10-31:** Por la división en submódulos, el anticipo se reparte: el vendedor lo **registra en Comercial › Ventas** y la **confirmación es de Finanzas › Tesorería**. Para no cargar la fase A, durante la **fase A** el rol Tesorería confirma desde Ventas (S1-15); en la **fase C** la confirmación pasa a Finanzas › Tesorería por contrato, junto con la conciliación (S1-50).
**Vigente:** Anticipo registrado en Ventas; confirmado por Tesorería (desde Ventas en la fase A, desde Finanzas desde la fase C); Registrado → Conciliado → Confirmado, o Registrado → Confirmado a mano.

## D18 — Anticipo mínimo de 50 % (supuesto)
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-29) · **Ámbito:** Comercial
**Decisión original:** Anticipo mínimo de 50 % del total de la cotización, configurable. *Propuesta.*
**Alternativas:** Otro porcentaje; cualquier monto mayor a cero.
**Por qué:** El TO-BE exige anticipo antes de crear la OV pero no fija cuánto. Es un SUPUESTO del equipo y se presenta como tal. Ejemplo: cotización de S/ 2 000 → anticipo mínimo S/ 1 000.
**Modificación 2026-10-29:** El equipo la confirma tal cual; pasa de *Propuesta* a vigente.
**Vigente:** Anticipo mínimo 50 % del total, en configuración (no en el código).

## D19 — Alcance del sprint 1
**Fecha:** 2026-10-28 · **Estado:** Modificada (2026-10-30) · **Ámbito:** Comercial
**Decisión original:** La semana 1 cubre solo venta retail MTS; MTO, B2B, crédito, distribución de OV, postventa y facturación quedan fuera
**Alternativas:** Incluir B2B o MTO desde el inicio.
**Por qué:** No caben en 21–31,5 h con la curva de aprendizaje. El TO-BE recomienda empezar por PO.02 y probar luego un caso MTS y uno MTO.
**Modificación 2026-10-29:** El núcleo sigue siendo la venta retail MTS, ahora **en pantalla y API** (D13). MTO, B2B, crédito, distribución de OV, postventa y facturación simulada ya no "quedan fuera": pasan a **Si alcanza** del área Comercial (D12), en el orden de `docs/alcance/comercial.md`.
**Modificación 2026-10-30:** El sprint 1 cubre **todo el TO-BE Comercial**, con un caso MTS y uno MTO de punta a punta (pág. 87). B2B, crédito, MTO, distribución, postventa y facturación entran en las fases B y C.
**Vigente:** Sprint 1 = TO-BE Comercial completo, MTS y MTO.

## D20 — Equipo y responsabilidades
**Fecha:** 2026-10-29 · **Estado:** Modificada (2026-10-30) · **Ámbito:** Global
**Decisión original:** Los integrantes se nombran por su nombre: **Miguel** (antes A), **Luis** (antes B) y **Pablo** (antes C). Miguel es el responsable técnico: crea el esqueleto, es el único que toca el `DbContext` y crea migraciones, y revisa los PR que tocan reglas, `Compartido` o migraciones. Luis y Pablo llegan con POO: aprenden C#, capas, DI y xUnit con tarjetas de aprendizaje que construyen código real.
**Alternativas:** Seguir con letras A, B y C; responsable técnico rotativo.
**Por qué:** Con nombres el plan se lee sin traducir letras. Miguel es el único con experiencia en C#.
**Modificación 2026-10-30:** El reparto de tarjetas sigue la experiencia: **Miguel lleva más horas, Luis es el segundo y Pablo el tercero**. En el sprint 1: Miguel ≈ 38,5 h de tarjetas, Luis 30,5 h, Pablo 27 h. La revisión de PR se reduce a **≈ 3 h** en todo el sprint: los PR son de una tarjeta y traen su explicación (D09), así que cada revisión toma pocos minutos.
**Vigente:** Miguel (más horas, responsable técnico) > Luis > Pablo; revisión de PR ≈ 3 h por sprint.

## D21 — Alcance por área y niveles
**Fecha:** 2026-10-29 · **Estado:** Modificada (2026-10-30) · **Ámbito:** Global
**Decisión original:** Cada área tiene su propio documento de alcance en `docs/alcance/<area>.md`, con dos niveles: **Núcleo** (lo que se presenta el jueves, en pantalla y API) y **Si alcanza** (en orden de prioridad). Lo que no se hizo al terminar la semana queda como **pendiente del área**, sin fecha. Aparte, la categoría **Simulado** (D12). Áreas conocidas: Comercial y Logística; las siguientes las solicita el profesor.
**Alternativas:** Un solo alcance para todo el proyecto; tres niveles (con un "Nivel 3" para semanas siguientes).
**Por qué:** Con un área por semana es poco probable volver a un área anterior; dos niveles son más simples de planificar y explicar.
**Modificación 2026-10-30:** En el área **Comercial no hay "Si alcanza"**: todo el TO-BE es núcleo, repartido en las fases A, B y C (una por demo). La regla de recorte se aplica dentro de cada fase. La categoría Simulado se mantiene. Las áreas siguientes vuelven a usar Núcleo / Si alcanza.
**Vigente:** Alcance por área en docs/alcance/; Comercial todo núcleo por fases; demás áreas Núcleo / Si alcanza; Simulado en todas.

## D22 — El tablero de GitHub es la fuente de verdad de las tarjetas
**Fecha:** 2026-10-29 · **Estado:** Modificada (2026-10-30) · **Ámbito:** Global
**Decisión original:** Las tarjetas se redactan en el planning en `docs/plan/sprint-NN.md` (borrador legible), se cargan al tablero con `scripts/crear-tarjetas.sh` y desde ese momento **el tablero de GitHub manda**: estado, dueño y cambios se hacen allí. El archivo `sprint-NN.md` no se mantiene al día después de la carga. Se elimina `sprint-01.csv`.
**Alternativas:** Tabla en `kanban.md` + CSV + tablero (tres copias); CSV como fuente.
**Por qué:** Tres copias de las mismas tarjetas se desalinean. Un solo borrador legible que además lee el script evita duplicar.
**Modificación 2026-10-29 (campos y relaciones):** Todas las tarjetas, incluidas las *Si alcanza*, se cargan como Issues. El tablero usa los campos `Status`, `Priority` (P0 base, P1 recortable, P2 Si alcanza), `Size`, `Estimate` (horas totales), `Start date`, `Target date`, `Sprint` y `Prioridad`, y la columna "Depende de" se convierte en relaciones nativas **Blocked by**. El script llena todo eso y no duplica si se vuelve a ejecutar.
**Modificación 2026-10-30:** La iteración **Sprint 1 dura 3 semanas** y cada tarjeta tiene un **hito** (milestone) por demo: Demo 05/11, Demo 12/11, Demo 19/11. `Priority` pasa a indicar la fase: **P0** = A, **P1** = B, **P2** = C. Las tarjetas de la fase actual entran en Ready; las demás esperan en Backlog.
**Vigente:** Borrador en sprint-NN.md → script → tablero con campos, hitos y relaciones; desde ahí manda el tablero.

## D23 — Git: ramas en el repositorio, sin forks
**Fecha:** 2026-10-29 · **Estado:** Aprobada · **Ámbito:** Global
**Decisión:** Luis y Pablo son colaboradores del repositorio de Miguel y trabajan con ramas `nombre/tarea` dentro de él (ej. `luis/reglas-cliente`), con PR a `main`. No se usan forks.
**Alternativas:** Forks + PR al repositorio de Miguel.
**Por qué:** Con ramas en el mismo repo los PR enlazan tarjetas (`Closes #N`), el tablero se actualiza solo y la revisión es más simple.

## D24 — Las decisiones se modifican, no se duplican
**Fecha:** 2026-10-29 · **Estado:** Aprobada · **Ámbito:** Global
**Decisión:** Cuando algo contradice o cambia una decisión registrada, se modifica esa decisión conservando el texto original y agregando un bloque fechado (ver el inicio de este anexo). Las personas y el asistente revisan contradicciones con decisiones previas en `/planning` y `/cierre`.
**Alternativas:** Crear siempre una decisión nueva que reemplaza a la anterior.
**Por qué:** El registro se lee por tema: cada decisión muestra su historia completa y lo que rige hoy, sin buscar en varias entradas.

## D25 — La trazabilidad es la prioridad del ERP
**Fecha:** 2026-10-30 · **Estado:** Aprobada · **Ámbito:** Global
**Decisión:** Todo documento del ERP (oportunidad, cotización, anticipo, OV, orden de despacho, guía, POD, comprobante, cuenta por cobrar, ticket, nota de crédito, etc.) es trazable:
1. **Historial:** cada cambio de estado y cada aprobación guarda estado anterior, estado nuevo, usuario, rol, fecha y hora, y motivo; el historial no se borra ni se edita.
2. **Cadena documental:** cada documento guarda su documento de origen; desde cualquiera se ven sus antecesores y sucesores (el "flujo de documentos").
3. **Ficha:** cada documento tiene una vista de detalle presentable e imprimible con cabecera, detalle, historial en línea de tiempo y cadena con enlaces.

Vive en `Compartido` (S1-08, S1-09) y en un componente de ficha común (S1-17); la pantalla de trazabilidad (S1-64) reconstruye el flujo completo de cualquier documento.
**Alternativas:** Registrar solo el estado actual; auditoría solo en aprobaciones.
**Por qué:** El profesor indicó que la trazabilidad es lo más valioso del sistema. El TO-BE lo exige en sus principios ("toda aprobación queda en el sistema con usuario y hora", "un dato se digita una sola vez") y los indicadores se calculan desde ese historial.

## D26 — Estructura de la solución: un proyecto por submódulo
**Fecha:** 2026-10-31 · **Estado:** Aprobada · **Ámbito:** Global
**Decisión:** La solución `Erp.sln` tiene un proyecto `.csproj` por submódulo, con las capas `Api`, `Servicios` y `Datos` como carpetas dentro de cada uno (11 proyectos: Compartido, 3 de Comercial, 3 de Finanzas, 2 de Logística y 2 de Planta), más `Erp.Api` como único host y `Erp.Tests`. `Erp.Api` referencia a todos los submódulos; entre módulos no hay referencias, salvo que todos pueden referenciar `Compartido` (regla 3.4.4). Los ensamblados de `Contratos` se crean en la fase B, con la primera llamada real entre módulos (S1-33 Planta, S1-36 Crédito, S1-38 Stock).
**Alternativas:** Un proyecto único para todo el ERP; tres proyectos por submódulo, uno por capa (más de 30 proyectos); crear los ensamblados de `Contratos` desde el inicio.
**Por qué:** El compilador impone la frontera entre módulos que pide D06: si un módulo usa clases de otro sin la referencia declarada, no compila; con un proyecto único la regla sería solo escrita y se rompería sin aviso. Tres proyectos por submódulo multiplican el mantenimiento sin enseñar nada nuevo en tres semanas. Los contratos en la fase B evitan cuatro proyectos vacíos durante días.
**Vigente:** Un proyecto por submódulo con tres carpetas de capa; `Erp.Api` es el único host; `Contratos` como ensamblados desde la fase B.
