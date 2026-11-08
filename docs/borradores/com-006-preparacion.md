# COM-006 — Implementación y evidencia local

Preparación inicial: 2026-11-07 · Actualización: 2026-11-08 · Responsable: Luis.
Estado: cierre local validado, preparación lista para PR; sin commit, subida ni PR de COM-006. No se declara Done.

[Tarjeta COM-006](https://github.com/miguelr296/ERP-2026-2/issues/84) · [COM-005 integrado, PR #107](https://github.com/miguelr296/ERP-2026-2/pull/107) · [Reglas](../reglas.md) · [Arquitectura](../arquitectura.md)

## Alcance y origen

COM-006 exige cliente consultable, errores y pruebas. COM-R01 procede de p. 15, PO.02.P01.SP01.A01, según el [análisis del PDF](../fuentes/analisis-comercial.md). Esta sesión usa ese análisis; no es una nueva lectura directa del PDF.

COM-005 ya entrega alta, consulta por ID, documento único e historial. Se reutilizan sin duplicar el modelo. COM-006 agrega búsqueda por documento exacto para encontrar un cliente sin conocer su ID. No implementa nuevas pantallas ni el recorrido de oportunidad, productos y responsable de COM-009. COM-R01 conserva evidencia parcial, no estado Verificada.

## Comportamiento implementado

| Operación | Resultado |
|---|---|
| `GET /api/clientes?documento=...` | 200 con cero o un cliente; comparación por documento completo |
| Espacios exteriores en documento | Se recortan antes de buscar, igual que en el alta existente |
| Documento ausente, vacío o solo espacios | 400 con detalle comprensible |
| Documento de más de 20 caracteres tras recortar | 400; límite del campo ya definido por COM-005 |
| `GET /api/clientes/{id}` | Se reutiliza: 200 para existente, 404 para ID válido inexistente |
| `POST /api/clientes` | Se reutiliza: 201 con ubicación; 400 ante duplicado, datos obligatorios ausentes o rol no permitido |

La búsqueda facilita reutilizar el cliente, pero no es una precondición HTTP obligatoria del alta; el alta existente sigue rechazando duplicados. No se añaden formatos legales de DNI/RUC, búsqueda por nombre ni una política nueva sobre mayúsculas/tildes: las comparaciones siguen el proveedor de datos.

Api adapta HTTP; ClientesCasoUso valida la búsqueda y devuelve ClienteVista; IComercialRepositorio y su implementación EF Core consultan sin seguimiento. No se modifican DbContext, esquema ni migraciones.

## Pruebas automatizadas comprobadas

Archivo: `tests/Erp.Api.Tests/ClientesApiTests.cs`. Cada prueba crea una aplicación con base EF Core InMemory aislada y recorre HTTP, Aplicación e Infraestructura. Estos resultados no se presentan como evidencia SQL.

| Caso preparado | Evidencia actual |
|---|---|
| C006-01: consulta por ID | Recuperación del cliente creado con el mismo ID y campos |
| C006-02: búsqueda | Documento completo y espacios exteriores; no devuelve otro documento con el anterior como prefijo |
| C006-03: sin coincidencias | 200 con colección vacía |
| C006-04: ID inexistente | 404 para Guid inexistente |
| C006-05: entrada inválida | Documento ausente, vacío, espacios y exceso del límite: 400 con detalle |
| C006-06: consultas sin altas | Consultas repetidas conservan un cliente y un único evento de alta |
| C006-07: buscar/crear/reutilizar | Alta existente de COM-005, ubicación y consulta; reinicio real comprobado aparte en SQL |
| C006-08: alta inválida | Nombre o documento vacíos: 400 sin cliente ni historial parcial |

Se comprueban además duplicados sin otro cliente/historial y rechazo HTTP del rol `Tesoreria` del contrato existente. El rol es simulado, no autenticación real.

Comandos ejecutados en orden:

```powershell
dotnet build Erp.slnx --configuration Release --no-restore
dotnet test Erp.slnx --configuration Release --no-build --no-restore
```

Validación final después de documentar: build con 0 advertencias y 0 errores; después, 19 pruebas superadas, 0 fallidas y 0 omitidas (8 existentes y 11 casos nuevos). Enlaces locales comprobados, sin marcadores de conflicto y diff sin errores de espacios.

## SQL Server en la máquina de Luis

Luis inició el servicio y autorizó expresamente instalar dotnet-ef 10.0.14 en `%TEMP%/erp-com006-herramientas` y aplicar únicamente `20261107220349_Inicial`, creada por Miguel, a la base nueva `ErpFamihogarPruebasLuis`. No se crearon ni modificaron migraciones. La guía asigna normalmente esta preparación a Miguel; Luis autorizó esta excepción local.

Se usó autenticación de Windows y la conexión se pasó como variable de entorno de la API en `http://localhost:5216`. No se cambiaron archivos de conexión ni se escribieron credenciales en el repositorio.

| Comprobación real | Resultado |
|---|---|
| Búsqueda inicial | 200 con `[]` |
| Alta ficticia | 201; documento `C006-1108093936`; ID `091cec05-c3e1-4443-ab33-4bb3f2a78743` |
| Búsqueda posterior | Una coincidencia con el mismo ID |
| Historial | Un evento de alta |
| Alta duplicada | 400 |
| Búsqueda con solo espacios | 400 |
| Detener y reiniciar API | Consulta por ID, búsqueda e historial recuperan el mismo registro y un único evento |

La primera comprobación manual se detuvo antes del alta por un conteo incorrecto de la lista vacía en PowerShell. Se inspeccionó la respuesta real `[]`, se corrigió el conteo y se repitió correctamente. La conexión dentro del entorno restringido falló por SSPI; fuera funcionó con autorización. No se atribuyen estos fallos a la API.

## Explicación y cierre

Luis explicó: buscar por documento permite comprobar si el cliente existe y evitar duplicarlo; recuperar el mismo ID después de reiniciar demuestra que ese registro se conservó y pudo consultarse nuevamente, pero no verifica toda COM-R01.

Luis aprobó actualizar este documento, preparación, contexto, bitácora y evidencia parcial de COM-R01. Declaró 20 minutos reales; las dos horas disponibles no se contabilizan como trabajadas.

Pendientes: revisión de Miguel sobre Aplicación y sus puertos, autorización para commit/subida y disponibilidad para otro PR según el límite de revisión. No se modifica el tablero ni se declara Done. Este documento sustituye las propuestas iniciales por el contrato implementado.
