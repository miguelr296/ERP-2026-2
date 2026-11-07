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

### 2026-11-07 · Luis · 0,25 h reales declaradas · COM-020
- Hice y evidencia: workflow `.github/workflows/ci.yml` con instalación desde global.json, restore, build y test secuenciales; comprueba pruebas realmente ejecutadas y conserva informes TRX siete días. Validación local en Release: build con 0 advertencias y 0 errores; 2 pruebas superadas, 0 fallidas y 0 omitidas. Ejecución remota correcta [42423143388](https://github.com/miguelr296/ERP-2026-2/actions/runs/42423143388) y fallo controlado [42423257981](https://github.com/miguelr296/ERP-2026-2/actions/runs/42423257981): build pasó, 1 prueba superada y 1 fallida, código de salida 1 e informe conservado. Expectativa original restaurada. Inventario de comandos y evidencia en `docs/guias/ci.md`.
- Explicación del autor: restore obtiene dependencias, build comprueba compilación y test ejecuta pruebas y verifica resultados; Actions automatiza esas comprobaciones. Un comando correcto sin pruebas ejecutadas no demuestra comportamiento comprobado.
- Falló / bloqueo: fallo esperado provocado solo en la rama COM-020. Las ejecuciones remotas seleccionaron SDK 10.0.403, permitido por latestFeature; el entorno local seleccionó 10.0.401. Se actualizaron acciones a checkout v5, setup-dotnet v5 y upload-artifact v6 por avisos de Node 20. No se crean migraciones ni se modifican pantallas.
- Validación final: [ejecución 42423576325](https://github.com/miguelr296/ERP-2026-2/actions/runs/42423576325) correcta con las acciones definitivas y la expectativa restaurada: build con 0 advertencias y 0 errores; test y contador con 2 superadas, 0 fallidas y 0 omitidas; informe conservado. Validación local final en el mismo orden también correcta. Diff sin cambios finales en pruebas ni wwwroot; comprobación de espacios y enlaces locales sin incidencias.
- Siguiente paso: preparación local lista para PR; obtener revisión de otra persona e integrar tras aceptación. No se declara Done ni se modifica el tablero. Los 15 minutos corresponden al tiempo real comunicado por Luis, no a la disponibilidad inicial de dos horas.

## Plantilla de sesión
Fecha · Persona · Horas reales · Tarjeta
- Hice y evidencia:
- Falló / bloqueo:
- Siguiente paso:

## Control semanal
| Sprint | Área | Resultado | Horas Miguel | Horas Luis | Horas Pablo | Evidencia y pendientes |
|---|---|---|---|---|---|---|
