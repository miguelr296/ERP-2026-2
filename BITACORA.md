# Bitácora

[Índice](README.md)

Completar únicamente con trabajo realizado y comprobado a partir del inicio.

## Sesiones

### 2026-11-05 · Miguel, Luis y Pablo · 0,5 h cada uno · COM-001
- Hice y evidencia: acordamos los estados de OV y los parámetros ficticios de la demo, registrados como DEC-001 en docs/decisiones.md. Se resolvió la discrepancia de la p. 34 ("Confirmada") frente a la tabla p. 5 y el diagrama p. 35.
- Falló / bloqueo: ninguno. Por acuerdo del equipo no se documentan horarios escalonados; la coordinación diaria se hace directamente.
- Siguiente paso: COM-002, solución mínima con SDK 10.0.401.

### 2026-11-05 · Miguel · 0,5 h · COM-002
- Hice y evidencia: solución `Erp.slnx` con SDK 10.0.401 fijado en `global.json`, proyecto `src/Erp.Api` que sirve `wwwroot` sin modificarlo y proyecto `tests/Erp.Api.Tests` con 2 pruebas de integración. `dotnet build` con 0 errores y `dotnet test` con 2 superadas. Limpié `bin/` y `obj/` con restos de un build net10.0 anterior sin `.csproj`.
- Falló / bloqueo: ninguno. La solución queda en formato `Erp.slnx`; si un Visual Studio anterior no la abre, se regenera en formato clásico.
- Siguiente paso: commit, PR y revisión por Luis o Pablo. El CI llega con COM-020.

### 2026-11-07 · Miguel · 1 h · Cierre COM-001 y COM-002
- Hice y evidencia: explicación de la API y su prueba de arranque; documentación de estado actualizada. Validación final: `dotnet build` con 0 advertencias y 0 errores; `dotnet test` con 2 superadas.
- Falló / bloqueo: ninguno técnico. Falta commit, PR y revisión por otra persona.
- Siguiente paso: preparar el commit y el PR en la rama de trabajo; solicitar revisión a Luis o Pablo.

### 2026-11-07 · Miguel · 0,25 h · Arranque de sesión y estado real de COM-001 y COM-002
- Hice y evidencia: lectura de AGENTS, README, contexto, bitácora, sprints, kanban, sprint-01, alcance de Comercial, decisiones, glosario y preparación. `main` está en `ddcb0f4`: el PR #104, desde `miguel/com-002-solucion-minima`, está mergeado; `git log` muestra los commits `658a477` y `4cfe197`. Estado del tablero reportado por el equipo: COM-001 y COM-002 en Done, COM-003 y COM-004 en Ready, COM-005 en Backlog. Se corrigió la documentación que aún decía "pendiente de PR y revisión".
- Falló / bloqueo: el tablero no se consultó de forma remota; su estado es el reportado por el equipo y este asistente no lo verificó. COM-005 sigue en Backlog y debe pasar a Ready antes de trabajarla. Comprobado con Git de solo lectura: `git ls-files src/Erp.Api/appsettings.Development.json` no devuelve nada y `git status --porcelain` solo muestra los documentos modificados en esta sesión, sin `bin/`, `obj/` ni archivos locales; el `.gitignore` sí protege la configuración local.
- Siguiente paso: mover COM-005 a Ready, crear la rama de trabajo y preparar modelo, DbContext y migración inicial con el corte de 2 h acordado.

### 2026-11-07 · Miguel · 1 h · COM-005 (en curso)
- Hice y evidencia: creé el módulo Comercial en tres proyectos por capa —`Dominio`, `Aplicacion` e `Infraestructura`— con `ComercialContext` y esquema `Comercial`; entidades `Cliente`, `Oportunidad` e `HistorialEvento`; alta que guarda documento e historial en un solo guardado; rechazo de modificación o borrado del historial; rutas `/api/clientes`, `/api/oportunidades` y `/api/historial/{tipo}/{id}`; migración `Inicial` aplicada en el SQL Server local (base `ErpFamihogar`). `dotnet build`: 0 advertencias, 0 errores. `dotnet test`: 8 superadas, 0 con error. `dotnet ef migrations has-pending-model-changes`: sin cambios pendientes. Prueba manual contra la API: alta de cliente (201), alta de oportunidad (201), historial (200) y rol Tesorería rechazado (400); tras reiniciar el servicio, los datos siguen respondiendo (200).
- Hice y evidencia (cierre): el equipo confirmó DEC-003 y aprobó el modelo de relaciones registrado como DEC-004. Miguel explicó que el Dominio no debe depender de EF Core para mantener las reglas independientes de persistencia, que el caso de uso guarda documento e historial mediante una unidad de trabajo, y que la persistencia se comprobó consultando el mismo ID después de reiniciar el servicio. Validación final: `dotnet build` con 0 advertencias y 0 errores; `dotnet test` con 8 superadas.
- Falló / bloqueo: el paquete transitivo `System.Security.Cryptography.Pkcs` 9.0.11 traía dos avisos de vulnerabilidad (NU1902 y NU1903); se fijó la versión 10.0.14 en los tres proyectos y desaparecieron. No hay bloqueo técnico conocido; falta preparar el commit, abrir el PR y obtener revisión de Luis o Pablo. La tarjeta queda lista para PR, no Done.
- Siguiente paso: Miguel ejecuta el flujo Git indicado en la guía y solicita revisión cruzada.

### 2026-11-07 · Luis · 1 h real declarada · COM-003
- Hice y evidencia: SDK 10.0.301 y 10.0.401 instalados; selección efectiva 10.0.401. Build correcto con 0 advertencias y 0 errores, seguido de `dotnet test --no-build`: 2 superadas, 0 fallidas y 0 omitidas. API comprobada con HTTP 200 en `/` y respuesta «en marcha» en `/api/estado`. Luis confirmó las pruebas manuales de los tres roles, búsqueda de `logistica`, tarjetas, Salir, recarga de sesión y consulta de estado. Inventario de textos y referencias registrado en `docs/guias/acceso-aplicaciones.md`, sin modificar wwwroot.
- Explicación del autor: `/api/estado` demuestra respuesta en esa ruta, no base de datos ni flujo comercial completo. Los roles son simulados, sin autenticación ni permisos reales; las tarjetas avisan porque sus pantallas siguen pendientes.
- Falló / bloqueo: build falló sin diagnóstico útil y test no produjo resultado dentro del entorno restringido del asistente; ambos se validaron fuera con autorización. Las ramas main local, del fork y del principal coincidían en `ddcb0f4` al consultarlas; no se acredita la sincronización de todas las ramas antiguas. Luis declara aproximadamente 2 h disponibles restantes, no horas trabajadas.
- Validación final del cierre: documentación revisada y `git diff --check` sin incidencias; únicamente cinco documentos modificados, sin cambios en wwwroot. Se repitieron en orden `dotnet build` (0 advertencias y 0 errores) y `dotnet test --no-build` (2 superadas, 0 fallidas y 0 omitidas).
- Siguiente paso: preparación local lista para PR; preparar una rama del repositorio principal según el flujo del equipo cuando Luis autorice la operación. Sin commits ni subidas autorizados por ahora; revisión por otra persona e integración pendientes. No se declara Done ni se modifica el tablero.

### 2026-11-08 · Luis · Actualización del PR COM-003 tras COM-005 · Horas no declaradas
- Hice y evidencia: incorporé `upstream/main` (`500174e`, PR #107) a la rama de COM-003; resolví conflictos de bitácora, contexto y preparación conservando las entradas de ambos integrantes, la arquitectura nueva y los resultados históricos de COM-003. Build Release con 0 advertencias y 0 errores, seguido de 8 pruebas superadas, 0 fallidas y 0 omitidas.
- Límites: no se verificó SQL Server en la máquina de Luis ni se ejecutaron migraciones. No se modifican las pantallas ni el código de COM-005. El borrador de COM-006 sigue sin commit y fuera del PR.
- Siguiente paso: actualizar el PR #105 y solicitar nueva revisión de Miguel. No se integra ni se declara Done.

### 2026-11-07 · Luis · 0,25 h reales declaradas · COM-020
- Hice y evidencia: workflow `.github/workflows/ci.yml` con instalación desde global.json, restore, build y test secuenciales; comprueba pruebas realmente ejecutadas y conserva informes TRX siete días. Validación local en Release: build con 0 advertencias y 0 errores; 2 pruebas superadas, 0 fallidas y 0 omitidas. Ejecución remota correcta [42423143388](https://github.com/miguelr296/ERP-2026-2/actions/runs/42423143388) y fallo controlado [42423257981](https://github.com/miguelr296/ERP-2026-2/actions/runs/42423257981): build pasó, 1 prueba superada y 1 fallida, código de salida 1 e informe conservado. Expectativa original restaurada. Inventario de comandos y evidencia en `docs/guias/ci.md`.
- Explicación del autor: restore obtiene dependencias, build comprueba compilación y test ejecuta pruebas y verifica resultados; Actions automatiza esas comprobaciones. Un comando correcto sin pruebas ejecutadas no demuestra comportamiento comprobado.
- Falló / bloqueo: fallo esperado provocado solo en la rama COM-020. Las ejecuciones remotas seleccionaron SDK 10.0.403, permitido por latestFeature; el entorno local seleccionó 10.0.401. Se actualizaron acciones a checkout v5, setup-dotnet v5 y upload-artifact v6 por avisos de Node 20. No se crean migraciones ni se modifican pantallas.
- Validación final: [ejecución 42423576325](https://github.com/miguelr296/ERP-2026-2/actions/runs/42423576325) correcta con las acciones definitivas y la expectativa restaurada: build con 0 advertencias y 0 errores; test y contador con 2 superadas, 0 fallidas y 0 omitidas; informe conservado. Validación local final en el mismo orden también correcta. Diff sin cambios finales en pruebas ni wwwroot; comprobación de espacios y enlaces locales sin incidencias.
- Siguiente paso: preparación local lista para PR; obtener revisión de otra persona e integrar tras aceptación. No se declara Done ni se modifica el tablero. Los 15 minutos corresponden al tiempo real comunicado por Luis, no a la disponibilidad inicial de dos horas.

### 2026-11-08 · Luis · Actualización del PR COM-020 tras COM-005 · Horas no declaradas
- Hice y evidencia: incorporé `upstream/main` (`500174e`, PR #107) a la rama de COM-020 y resolví los conflictos de README, contexto y bitácora conservando los registros de Miguel y Luis. Se conserva la nueva arquitectura y se distingue la evidencia histórica de dos pruebas del resultado actual: build Release con 0 advertencias y 0 errores; test posterior con 8 superadas, 0 fallidas y 0 omitidas.
- Límites: las seis pruebas nuevas usan EF Core InMemory; no se verificó SQL Server en la máquina de Luis ni se ejecutaron migraciones. El borrador local de COM-006 queda fuera del PR. No se modifica código de COM-005.
- Siguiente paso: actualizar el PR #106, comprobar CI y solicitar nueva revisión de Miguel. No se integra el PR ni se declara Done.

### 2026-11-08 · Luis · Actualización de COM-020 con main · Horas no declaradas
- Hice y evidencia: incorporado `upstream/main` (`3ef9764`, integración de COM-003) a COM-020. Conflictos de bitácora y contexto resueltos conservando ambas tareas. Build Release: 0 advertencias y 0 errores; test posterior: 8 superadas, 0 fallidas y 0 omitidas. Esta rama no incorpora las pruebas nuevas de COM-006.
- Siguiente paso: actualizar el PR #106, comprobar CI y obtener nueva revisión. No se fusiona ni se declara Done.

### 2026-11-08 · Luis · 20 minutos reales declarados · COM-006
- Hice y evidencia: búsqueda por documento exacto en `/api/clientes?documento=...`, con recorte de espacios y errores de documento ausente/vacío o mayor al límite de 20 caracteres ya definido en COM-005. Se reutiliza el alta, consulta por ID e historial existentes. Se agregaron 11 casos HTTP con datos aislados; build Release con 0 advertencias y 0 errores, seguido de 19 pruebas superadas, 0 fallidas y 0 omitidas.
- Hice y evidencia SQL: Luis inició SQL Server y autorizó instalar dotnet-ef temporal y aplicar solo la migración `Inicial` de Miguel a `ErpFamihogarPruebasLuis`. Se comprobaron búsqueda vacía, alta 201, búsqueda del mismo ID, un evento de historial, duplicado 400 y búsqueda vacía 400. Tras reiniciar la API se recuperó el mismo cliente `091cec05-c3e1-4443-ab33-4bb3f2a78743` e historial. No se crearon migraciones ni se modificaron las existentes.
- Explicación del autor: buscar por documento permite comprobar si el cliente existe y evitar duplicarlo. Recuperar el mismo ID tras reiniciar demuestra que ese registro se conservó y pudo consultarse; no verifica por sí solo toda COM-R01. Luis aprobó esta documentación y la evidencia parcial de la regla, sin marcarla Verificada.
- Falló / bloqueo: SSPI falló dentro del entorno restringido y funcionó fuera con autorización. La primera comprobación manual contó mal una lista vacía en PowerShell y se detuvo sin crear datos; tras inspeccionar la respuesta y corregir el conteo se repitió correctamente. No se atribuyen esos fallos a la API. COM-R01 mantiene pendiente el recorrido de oportunidad/productos/responsable. Los 20 minutos son tiempo trabajado, no las dos horas disponibles.
- Validación final: después de documentar se ejecutaron build Release con 0 advertencias y 0 errores y, a continuación, test con 19 superadas, 0 fallidas y 0 omitidas. Enlaces locales y marcadores comprobados, diff sin incidencias. Cierre local validado y preparación lista para PR.
- Siguiente paso: solicitar revisión de Miguel cuando corresponda y obtener autorización antes de commit/subida. No se abre un tercer PR mientras se mantenga el límite de revisión del equipo; no se modifica el tablero ni se declara Done.

### 2026-11-08 · Luis · Actualización de COM-006 con main · Horas no declaradas
- Actualización adicional tras integrar COM-020: incorporado `upstream/main` (`7961576`, PR #106). Conflictos de bitácora y contexto resueltos conservando COM-020 y COM-006. Build Release con 0 advertencias y 0 errores; después 19 pruebas superadas, 0 fallidas y 0 omitidas. No se modifica código de clientes ni migraciones.
- Hice y evidencia: incorporado `upstream/main` (`3ef9764`, integración de COM-003) a la rama de COM-006; conflictos de bitácora, contexto y preparación resueltos conservando la evidencia de ambas tareas. Build Release final: 0 advertencias y 0 errores; test posterior: 19 superadas, 0 fallidas y 0 omitidas.
- Falló / bloqueo: el primer build falló por DLL bloqueadas por la API de pruebas del puerto 5216. Se verificó y detuvo únicamente ese proceso; después build y test pasaron. SQL Server no se detuvo ni se ejecutaron migraciones.
- Siguiente paso: actualizar el PR #108 y obtener revisión de Miguel. No se fusiona ni se declara Done.

## Plantilla de sesión
Fecha · Persona · Horas reales · Tarjeta
- Hice y evidencia:
- Falló / bloqueo:
- Siguiente paso:

## Control semanal
| Sprint | Área | Resultado | Horas Miguel | Horas Luis | Horas Pablo | Evidencia y pendientes |
|---|---|---|---|---|---|---|
