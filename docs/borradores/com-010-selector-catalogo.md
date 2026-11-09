# COM-010 — Selector del catálogo comercial

Preparación inicial: 2026-11-09 · Actualización: 2026-11-09 · Responsable: Pablo.
Estado: selector conectado y comprobado manualmente contra la API; listo para cierre y revisión por PR. No se declara Done.

[Tarjeta COM-010](https://github.com/miguelr296/ERP-2026-2/issues/89) · [COM-007 integrado, PR #110](https://github.com/miguelr296/ERP-2026-2/pull/110) · [Reglas](../reglas.md) · [Análisis Comercial](../fuentes/analisis-comercial.md)

## Alcance y origen

COM-010 agrega una pantalla acotada para consultar desde la API el catálogo definido en COM-007. Permite elegir canal y tipo de cliente y muestra producto, precio, moneda, lista y vigencia configurada.

La p. 22 del PDF Comercial, PO.02.P02.SP01.A01, pide seleccionar la lista vigente según canal y tipo de cliente y proteger el precio de cambios manuales. COM-010 no crea reglas de vigencia ni cálculo: la API de COM-007 filtra por canal/tipo, pero todavía devuelve vigencias sin evaluarlas. COM-R02 sigue pendiente.

## Consulta y escenario preparado

El selector consulta `GET /api/catalogo?canal={canal}&tipoCliente={tipoCliente}`. Tienda + Retail y Web + Retail muestran los datos configurados por COM-007. El botón **Preparar caso sin lista** selecciona Tienda + Empresarial, combinación sin productos configurados, y deja visible el resultado vacío para el recorrido de demo.

Este escenario prepara la ausencia de catálogo para una combinación; no representa ni verifica una lista vencida. La comprobación de vigencia corresponde al trabajo de COM-013/COM-R02.

## Validación local

API iniciada con SDK 10.0.401 en `http://localhost:5210` mediante:

```powershell
$dotnetExe = Join-Path $env:LOCALAPPDATA 'Microsoft\dotnet\dotnet.exe'
& $dotnetExe run --project src/Erp.Api --no-launch-profile --urls http://localhost:5210
```

Comprobación manual desde la pantalla servida por esa API:

| Caso | Resultado visible |
|---|---|
| Comercial desde Aplicaciones | Abre `/comercial/catalogo.html` |
| Tienda + Retail | 2 productos; sofá S/ 1,299.90 y comedor S/ 899.90; lista `LP-TIENDA-RETAIL-2026-11` |
| Web + Retail | 2 productos; sofá S/ 1,249.90 y comedor S/ 849.90; lista `LP-WEB-RETAIL-2026-11` |
| Preparar caso sin lista | Selecciona Tienda + Empresarial; muestra el mensaje de catálogo vacío |

Los precios, lista y vigencias se leen de la respuesta real de `GET /api/catalogo`; no se sustituyen por datos escritos en la pantalla.

## Explicación de Pablo

En la demo hay dos productos para Retail + Tienda y dos para Retail + Web. La pantalla consulta la API con el canal y el tipo de cliente elegidos, y muestra los productos y precios que devuelve. El botón **Preparar caso sin lista** cambia a Tienda + Empresarial, combinación que no tiene productos configurados, para dejar visible el escenario vacío. La validación de una lista vencida queda para una tarjeta posterior.

## Limitaciones

La pantalla requiere que `Erp.Api` esté en marcha. El caso vacío usa una combinación sin registros configurados y no comprueba una lista vencida; el endpoint aún no evalúa vigencias. No se cambió persistencia, no se creó migración ni se incluyeron credenciales. No se agregaron ni ejecutaron pruebas automatizadas.
