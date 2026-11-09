# COM-004 — Preparación y evidencia local

Preparación inicial: 2026-11-08 · Actualización: 2026-11-08 · Responsable: Pablo.
Estado: cierre local validado y listo para PR; entorno verificado y casos de demo aprobados. No se declara Done.

[Tarjeta COM-004](https://github.com/miguelr296/ERP-2026-2/issues/82) · [Guía de preparación](../guias/preparacion.md) · [Análisis Comercial](../fuentes/analisis-comercial.md) · [PDF Comercial](../fuentes/Documento_TO_BE_FAMIHOGAR.pdf) · [DEC-001](../decisiones.md#dec-001--estados-de-ov-y-parámetros-ficticios-de-la-demo)

## Alcance y origen

COM-004 pide verificar las herramientas del entorno de Pablo y preparar casos ficticios desde el PDF, sin reutilizar reglas antiguas. La tarjeta estima una hora; no se atribuyen horas reales sin que Pablo las registre.

El PDF se revisó directamente en p. 15, PO.02.P01.SP01.A01: buscar al cliente por DNI o RUC, crearlo si no existe y registrar una oportunidad con productos de interés; el ERP asigna canal, sede y vendedor. En p. 22, PO.02.P02.SP01.A01, exige seleccionar la lista vigente por canal y tipo de cliente, y proteger el precio contra edición manual. Los valores concretos de la demo se rigen por DEC-001 de COM-001.

COM-004 prepara datos y recorridos. No implementa catálogo, lista de precios, consulta desde pantalla ni validación de cotización; esos trabajos pertenecen a COM-007 y tarjetas posteriores.

## Entorno de Pablo

Pablo confirmó que las comprobaciones se realizaron en su equipo. Se instaló el SDK acordado por DEC-002, .NET 10.0.401, en `%LOCALAPPDATA%\Microsoft\dotnet` y se agregó esa ruta al `PATH` de usuario. `global.json` conserva la versión 10.0.401.

Comandos ejecutados en orden:

```powershell
$dotnetExe = Join-Path $env:LOCALAPPDATA 'Microsoft\dotnet\dotnet.exe'
& $dotnetExe --version
& $dotnetExe build Erp.slnx
& $dotnetExe test Erp.slnx --no-build
& $dotnetExe run --project src/Erp.Api --no-build --no-launch-profile --urls http://localhost:5210
```

La última orden dejó la API en ejecución para comprobar el endpoint. Después se consultó `GET http://localhost:5210/api/estado` y se detuvo el servicio.

| Comprobación | Resultado |
|---|---|
| `--version` | 10.0.401 |
| `build Erp.slnx` | Correcto: 0 advertencias y 0 errores |
| `test Erp.slnx --no-build` | 19 superadas, 0 fallidas y 0 omitidas |
| `GET /api/estado` | 200; `servicio: Erp.Api`, `estado: en marcha`, `version: 1.0.0.0` |

El endpoint solo acredita la respuesta de la API; no verifica SQL Server ni el recorrido Comercial. La terminal de VS Code que estaba abierta antes de instalar el SDK conserva su entorno anterior; se debe reiniciar VS Code para que las terminales nuevas recojan el `PATH` actualizado.

## Casos ficticios aprobados

| Caso | Datos ficticios | Recorrido que se preparará | Fuente y límite |
|---|---|---|---|
| C004-01 · cliente nuevo | `Cliente Demo Uno`; DNI `00000000`; `cliente-uno@example.test`; producto de catálogo pendiente de COM-007. | Buscar el documento; si no existe, registrar el cliente y abrir una oportunidad. Para el ejemplo se usan canal `Tienda`, sede `Lima Centro` y responsable `asesor.demo`, valores ya usados en una prueba del módulo. | p. 15. El documento es sintético; no se afirma que sea un DNI válido. Producto y precio quedan pendientes de COM-007. |
| C004-02 · cliente existente | `Comercial Andina SAC`; RUC de prueba `20512345678`; `compras@andina.test`; interés en 20 unidades de un producto que defina COM-007. | Encontrar y reutilizar el cliente, asociar una oportunidad y evitar duplicar el registro. | p. 15. El ejemplo de cliente reutiliza datos ficticios ya presentes en una prueba; no representa una empresa real. |
| C004-03 · lista vigente | Canal `Tienda`, tipo retail y producto/precio que entregue COM-007. | Seleccionar la lista vigente correspondiente y rechazar una modificación manual del precio. | p. 22 y DEC-001. No se inventan montos ni vigencias en COM-004. |
| C004-04 · sin lista vigente | Mismo canal y tipo, sin una lista vigente preparada. | Dejar listo el caso para comprobar que no se cotiza usando una lista vencida o inexistente. | p. 22; ejecución prevista en la validación de COM-010. Es un caso preparado, no una función ya verificada. |

Los correos usan el dominio de prueba `.test`. Los casos C004-03 y C004-04 dependen de que COM-007 defina los productos y listas; no acreditan trabajo terminado de esas tarjetas.

## Explicación y cierre

Pablo confirmó que los cuatro casos propuestos son correctos para preparar la demostración. Los productos y precios se completarán al desbloquearse COM-007; este registro no anticipa datos que esa tarjeta aún debe definir.

La compilación, las pruebas y la consulta de estado se ejecutaron en el equipo de Pablo con .NET 10.0.401. El endpoint de estado no acredita SQL Server ni el recorrido Comercial completo. El equipo debe revisar el PR; no se actualiza el tablero ni se declara Done hasta integrar y aceptar el trabajo.
