# Validación y CI

[Índice](../../README.md)

## Workflow de COM-020

Configuración en `.github/workflows/ci.yml`, propuesta para revisión e integración. Se ejecuta ante subidas de ramas y PR dirigidos a `main`, con permisos de lectura del código, runner `ubuntu-24.04` y límite de 15 minutos. Una subida a una rama con PR abierto puede generar dos ejecuciones: una por cada evento.

Instala el SDK desde `global.json` y muestra la versión efectiva. El archivo contiene `10.0.401` con `rollForward: latestFeature`: permite seleccionar SDK posteriores compatibles; no garantiza exactamente 10.0.401. La validación local seleccionó 10.0.401 y las primeras ejecuciones remotas seleccionaron 10.0.403.

Los pasos se ejecutan en orden; un fallo impide continuar con los siguientes pasos normales:

```powershell
dotnet restore Erp.slnx
dotnet build Erp.slnx --configuration Release --no-restore
dotnet test Erp.slnx --configuration Release --no-build --no-restore --logger trx --results-directory TestResults
```

Después de test, incluso si falla, se leen los informes TRX y se muestran los totales reales: ejecutadas, superadas, fallidas y omitidas. La comprobación falla si no hay informes, si no se ejecutó ninguna prueba o si existen pruebas fallidas; no usa una cantidad fija de pruebas como garantía. El fallo de `dotnet test` tampoco se oculta. Los informes se conservan como archivo descargable `resultados-pruebas` durante siete días, incluso tras una prueba fallida.

Tras incorporar COM-005, hay dos pruebas de arranque con `WebApplicationFactory` y seis pruebas de Comercial con EF Core InMemory. Las ocho se ejecutan sin SQL Server. Las pruebas en memoria verifican reglas y comportamiento del modelo, pero no acreditan persistencia en SQL Server; esa comprobación requiere una base preparada. Un build correcto no acredita datos persistentes ni flujo comercial completo.

## Evidencia comprobada · 2026-11-07

| Ejecución | Resultado comprobado |
|---|---|
| [Inicial correcta, commit 6df47ca](https://github.com/miguelr296/ERP-2026-2/actions/runs/42423143388) | Build: 0 advertencias y 0 errores. Test y contador: 2 ejecutadas, 2 superadas, 0 fallidas, 0 omitidas. Informe conservado. |
| [Fallo controlado, commit b0b5643](https://github.com/miguelr296/ERP-2026-2/actions/runs/42423257981) | Se cambió temporalmente la expectativa de estado por `fallo controlado COM-020`. Build pasó; test terminó con código 1: 1 superada, 1 fallida, 0 omitidas. El contador también falló y el informe se conservó. |
| [Configuración final, commit af5a55e](https://github.com/miguelr296/ERP-2026-2/actions/runs/42423576325) | Expectativa original restaurada y acciones con Node 24. Restore, build, test, contador y conservación del informe correctos; build con 0 advertencias y 0 errores, 2 pruebas superadas, 0 fallidas y 0 omitidas. |

La expectativa original se restauró después de comprobar el fallo; no hay diferencias finales en las pruebas respecto a main. La configuración final usa checkout v5, setup-dotnet v5 y upload-artifact v6, con Node 24, y su validación remota pasó. No se cambiaron protecciones de `main`.

## Fuentes técnicas

Actualización 2026-11-08: incorporado `main` con COM-005 (PR #107, `500174e`). Build Release local: 0 advertencias y 0 errores; test posterior: 8 superadas, 0 fallidas y 0 omitidas. Las ejecuciones anteriores conservan sus resultados históricos de dos pruebas; no se reinterpretan como validación de COM-005.

- [Sintaxis oficial de workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax): eventos, pasos, condiciones y permisos.
- [setup-dotnet v5](https://github.com/actions/setup-dotnet/tree/v5): instalación desde `global.json`.
- [checkout v5](https://github.com/actions/checkout/tree/v5) y [upload-artifact v6](https://github.com/actions/upload-artifact/tree/v6): obtención del código y conservación de resultados.
