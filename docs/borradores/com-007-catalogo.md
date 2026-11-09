# COM-007 — Catálogo y lista de precios ficticios

Preparación inicial: 2026-11-08 · Actualización: 2026-11-08 · Responsable: Pablo.
Estado: catálogo, consulta, explicación y pruebas locales validados; listo para PR. No se declara Done.

[Tarjeta COM-007](https://github.com/miguelr296/ERP-2026-2/issues/85) · [COM-005 integrado, PR #107](https://github.com/miguelr296/ERP-2026-2/pull/107) · [Reglas](../reglas.md) · [Glosario](../glosario.md) · [Análisis Comercial](../fuentes/analisis-comercial.md)

## Alcance y origen

COM-007 pide definir productos y listas ficticias por canal y tipo de cliente, exponer una consulta y agregar una prueba sencilla. COM-005 ya está integrada en `main` por el PR #107, que cierra la dependencia de esta tarjeta.

La p. 22 del PDF Comercial, PO.02.P02.SP01.A01, indica elegir la lista vigente según canal y tipo de cliente, y proteger el precio de edición manual. El PDF no determina nombres de productos ni montos. Los valores siguientes son datos de demostración configurados en `src/Erp.Api/appsettings.json`; no son reglas ni precios comerciales aprobados para producción.

## Datos de demostración

| Código | Producto | Unidad | Canal | Tipo de cliente | Lista | Precio unitario | Moneda | Vigencia |
|---|---|---|---|---|---|---:|---|---|
| MUE-001 | Sofá Nube 2 cuerpos | unidad | Tienda | Retail | LP-TIENDA-RETAIL-2026-11 | 1299.90 | PEN | 2026-11-01 a 2026-11-30 |
| MUE-002 | Comedor Luma 4 sillas | unidad | Tienda | Retail | LP-TIENDA-RETAIL-2026-11 | 899.90 | PEN | 2026-11-01 a 2026-11-30 |
| MUE-001 | Sofá Nube 2 cuerpos | unidad | Web | Retail | LP-WEB-RETAIL-2026-11 | 1249.90 | PEN | 2026-11-01 a 2026-11-30 |
| MUE-002 | Comedor Luma 4 sillas | unidad | Web | Retail | LP-WEB-RETAIL-2026-11 | 849.90 | PEN | 2026-11-01 a 2026-11-30 |

Los importes usan `decimal` y quedan en configuración. No se creó una tabla ni migración: los datos son de lectura para la demo.

## Consulta y pruebas

`GET /api/catalogo?canal=Tienda&tipoCliente=Retail` devuelve los dos productos con la lista de Tienda. Cambiar el canal a `Web` devuelve los mismos productos con la lista Web. Una combinación sin datos devuelve una lista vacía.

| Caso comprobado | Resultado |
|---|---|
| Tienda + Retail | 2 productos; sofá a 1299.90 PEN, lista `LP-TIENDA-RETAIL-2026-11` |
| Web + Retail | 2 productos; sofá a 1249.90 PEN, lista `LP-WEB-RETAIL-2026-11` |
| Tienda + Empresarial | Lista vacía |

Comandos ejecutados en orden con SDK 10.0.401:

```powershell
$dotnetExe = Join-Path $env:LOCALAPPDATA 'Microsoft\dotnet\dotnet.exe'
& $dotnetExe build Erp.slnx
& $dotnetExe test Erp.slnx --no-build
```

Build: 0 advertencias y 0 errores. Pruebas: 22 superadas, 0 fallidas y 0 omitidas. Las pruebas de catálogo consultan la configuración de demo; no acreditan persistencia en SQL Server.

## Explicación y cierre

Agregué un catálogo de demostración con algunos muebles y precios distintos para Tienda y Web. La API permite consultar el catálogo indicando el canal y el tipo de cliente; así devuelve la lista de precios que corresponde a esa combinación. Las pruebas comprueban que cada canal muestre su precio y que una combinación sin datos devuelva una lista vacía.

Los productos y precios están en la configuración de la aplicación para la demo. Todavía no se guardan en una base de datos.

La tarjeta queda preparada para PR, pendiente de revisión por otra persona antes de integrar. No se actualiza el tablero ni se declara Done con este borrador.

## Limitaciones

La API consulta por coincidencia exacta de canal y tipo, y devuelve los campos de vigencia; no filtra por fecha, no valida una lista vencida ni rechaza precios manipulados. COM-R02 sigue pendiente; el selector y el caso sin lista vigente se comprobarán en sus tarjetas. No se modificó pantalla, contexto de EF Core ni migraciones. No se incluyeron credenciales.
