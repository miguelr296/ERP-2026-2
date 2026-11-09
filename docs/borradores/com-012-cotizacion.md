# COM-012 — Cálculo, emisión y ficha de cotización

2026-11-09 · Luis · Disponibilidad declarada: 1 hora; tiempo real todavía no declarado.
Estado: versión de trabajo autorizada para compartir con Miguel en la rama luis/com-012-cotizacion; pendiente su migración y validación SQL/navegador de emisión. No está lista para cierre ni se declara Done.

[Tarjeta #90](https://github.com/miguelr296/ERP-2026-2/issues/90) · [Reglas COM-R02/R04](../reglas.md) · [DEC-001](../decisiones.md) · [Fuente analizada](../fuentes/analisis-comercial.md)

## Punto de partida y alcance

COM-009 y COM-010 se consultaron en GitHub y están cerradas como completadas. La rama `luis/com-012-cotizacion` se creó con autorización desde `upstream/main` actualizado (`072c3a6`). El borrador local anterior de COM-009 se conserva, sin incorporarlo a esta tarea. No se modificó el tablero.

El catálogo de COM-007 expone canal, tipo de cliente, lista, precio, moneda y fechas; su consulta no filtra vigencia. La oportunidad de COM-009 conserva códigos, nombres y cantidades, sin precios. Este bloque obtiene oportunidad y precios en el servidor para calcular una previsualización.

## Supuestos y fuentes

DEC-001 ya fija IGV de demo 18%, vigencia de cotización 7 días, dinero decimal y dos decimales. Luis confirmó expresamente en esta sesión los supuestos adicionales siguientes para revisión de Miguel:

- Los precios de lista de demo no incluyen IGV.
- Cada importe de línea y el IGV se redondean a dos decimales, con mitades alejándose de cero.
- Plazo de entrega de demo: 7 días, configurable.

Se guardan en `CotizacionDemo` de appsettings.json, no son parámetros enviados por la pantalla ni normas atribuidas al PDF. La calculadora admite precios con impuesto si el servidor lo configura; la configuración vigente es sin impuesto. El tipo de cliente se selecciona para consultar la lista; no se presenta como atributo persistido del cliente.

La selección por canal/tipo y la vigencia se basan en COM-R02, fuente p. 22. Los límites inclusivos de fechas, la exclusión de campos JSON de precio/cantidad y el rechazo de resultados ambiguos son decisiones técnicas de este bloque, pendientes de revisión. La fecha del cálculo usa America/Lima; la vigencia propuesta suma los días configurados a esa fecha. No se cambia DEC-001 silenciosamente ni se considera aprobado el nuevo cálculo por todo el equipo.

## Implementado

- `POST /api/oportunidades/{id}/calculo-cotizacion` acepta solo `{ "tipoCliente": "Retail" }` y las cabeceras de rol simulado existentes.
- Devuelve 200 con origen, cliente, lista, moneda, líneas, fecha, vigencia propuesta, plazo y totales. Devuelve 404 si no existe la oportunidad.
- La cantidad y códigos proceden de la oportunidad; nombres y precios se obtienen del catálogo del servidor. Se rechazan campos JSON adicionales, incluidos precio, líneas, cantidad e impuesto, con 400.
- La lista debe estar vigente en la fecha de cálculo y cada producto debe tener una única coincidencia. Se rechazan tipo sin lista, fechas inválidas, listas vencidas o futuras y mezcla de listas o monedas. Asesor y Jefatura pueden calcular; Tesoreria no.
- El dominio realiza el cálculo decimal; Aplicación compone oportunidad, catálogo, parámetros y reloj; Api adapta HTTP. No se agregan tablas ni se modifica Infraestructura.
- Pantalla `comercial/calculo-cotizacion.html`, enlazada desde el catálogo. Requiere sesión simulada y un ID de oportunidad existente. Muestra líneas y precios sin campos editables e identifica el resultado como borrador sin guardar.

## Evidencia comprobada

Comandos ejecutados en orden:

```powershell
dotnet build Erp.slnx --configuration Release --no-restore
dotnet test Erp.slnx --configuration Release --no-build --no-restore
```

Build: 0 advertencias y 0 errores. Test: 68 superadas, 0 fallidas, 0 omitidas (47 anteriores y 21 casos nuevos). Sintaxis JavaScript comprobada con `node --check src/Erp.Api/wwwroot/comercial/calculo-cotizacion.js`. Diff sin errores de espacios.

Las pruebas nuevas cubren decimales y redondeo, desglose configurable de IGV incluido, cantidades/precios inválidos, origen y totales por HTTP, fecha de Perú, protección frente a precio/cantidad/impuesto enviados, tipo vacío o sin lista, oportunidad inexistente, rol no permitido, vigencia vencida/futura/inválida y límites inclusivos, mezcla de lista/moneda y ausencia de nuevos eventos al calcular.

Ejemplo de cálculo probado: 2 × 1299,90 + 1 × 899,90 = subtotal 3499,70; IGV 629,95; total 4129,65 PEN. El catálogo se configura en servidor y las pruebas usan un reloj fijo para no depender de la fecha del equipo.

Las pruebas HTTP automatizadas usan InMemory, sin SQL Server. En la validación inicial no se había comprobado SQL ni interacción en navegador; las comprobaciones posteriores se registran abajo por separado. La sintaxis correcta de JavaScript por sí sola no acredita la pantalla funcionando. El cálculo no persiste una cotización.

## Pendientes identificados al terminar el primer bloque

1. Acordar con Miguel el modelo persistente de cotización y su relación con oportunidad y líneas; Miguel crea la migración. Conservar origen, precios y cantidades como copia del momento de emisión, parámetros de cálculo, estado, responsables e historial.
2. Implementar emisión y consulta de documento, con correlativo único y seguro ante concurrencia, en el formato COT-2026-00001 de DEC-001. Guardar cotización, líneas e historial de forma consistente. La previsualización actual no asigna un número ni reserva precios.
3. Al emitir, volver a obtener los datos autorizados y validar lista vigente; no aceptar como verdad un total recibido desde la pantalla ni guardar una previsualización antigua sin validarla.
4. Completar pantalla mínima para emitir y recuperar la ficha guardada, con origen e historial; comprobar errores y persistencia en SQL tras reiniciar. Coordinar con COM-013 de Pablo sin duplicar su selector.
5. Recoger explicación de Luis y horas reales, aprobar la documentación del cierre y validar versión final antes de commit y PR. El futuro PR corresponde a `Closes #90`, sin afirmar que COM-R02/R04 están completamente verificadas antes de la evidencia.

El cálculo actual no sustituye esos criterios. Una pantalla que calcula no demuestra que exista una cotización emitida, numerada o persistida.

La implementación posterior descrita al final cubre el modelo, API y pantalla de emisión; los puntos anteriores conservan el alcance de la primera etapa y no deben interpretarse como ausencia actual de ese código.

## Actualización del entorno local · 2026-11-09

A solicitud de Luis se consultó `upstream/main`: la rama ya partía de `072c3a6` y no había novedades de código pendientes. Se conservaron los cambios locales de COM-012 y el borrador anterior de COM-009.

La base `ErpFamihogarPruebasLuis` tenía solo `20261107220349_Inicial`. Se aplicaron las migraciones existentes de Miguel `20261109165802_ReservaSimulada` y `20261109181126_OportunidadConProductos`, revisadas previamente: agregan tablas, sin borrar datos existentes. No se crearon migraciones nuevas.

Se preparó appsettings.Development.json, ignorado por Git, para que el perfil http use esa base de pruebas con autenticación de Windows. La configuración compartida no se cambió para esta conexión. Build Release con 0 advertencias y 0 errores; después test con 68 superadas, 0 fallidas y 0 omitidas. Esto comprueba actualización de entorno y regresión, no todavía el cálculo sobre una oportunidad SQL. No se crearon oportunidades en este paso.

## Verificación con oportunidad SQL y navegador · 2026-11-09

Con autorización de Luis se reutilizó el cliente ficticio de COM-006 y se creó por API la oportunidad `8facd3db-acb4-4df5-be8f-ab04a2e30f12`: canal Tienda, sede Lima Centro, responsable luis.demo, dos unidades MUE-001 y una MUE-002. Alta: 201. SQL confirmó una oportunidad, dos productos relacionados y un evento de alta; los cálculos posteriores no añadieron eventos.

El puerto 5210 estaba ocupado por otra instancia. La nueva instancia no pudo iniciarse allí y una petición dirigida a la instancia previa devolvió 500; no se atribuye ese resultado al cálculo de esta instancia. No se detuvo el proceso ajeno. La prueba correcta se ejecutó en el puerto libre 5216, con conexión explícita a ErpFamihogarPruebasLuis.

Resultado real de la API: subtotal 3499,70, IGV 629,95 y total 4129,65 PEN; vigencia propuesta hasta 2026-11-16 y plazo de demo 7 días.

Se comprobó la pantalla con Edge headless, perfil temporal aislado y sesión de Asesor: entrada del ID, envío del formulario, dos filas y totales esperados, aviso explícito de borrador sin guardar. Se probaron Empresarial sin lista y un ID inexistente: mensajes comprensibles y resultado anterior oculto. Sin excepciones JavaScript detectadas en esos recorridos. El navegador aislado se cerró al terminar; la API de pruebas quedó disponible en http://localhost:5216.

Esto acredita previsualización desde una oportunidad persistida y funcionamiento de esos recorridos de pantalla; sigue pendiente emitir una cotización con correlativo, guardado, historial y consulta posterior.

## Propuesta aprobada e implementación posterior · 2026-11-09

Luis comunicó que Miguel aprobó la propuesta de modelo, estado Borrador, secuencia SQL con posibles saltos, guardado junto con historial, copia de precios y referencia única para reintentos. La aprobación fue comunicada en esta conversación; no se atribuye a una revisión de código o PR todavía inexistente.

- Dominio: Cotizacion y LineaDeCotizacion conservan oportunidad, cliente, tipo, lista, moneda, fecha, vencimiento, plazo, parámetros de impuesto/redondeo, estado, actor, totales y líneas de la emisión. Borrado lógico con Activo; no hay ruta de borrado.
- Infraestructura: DbSets y configuraciones preparados, sin modificar las migraciones existentes ni crear nuevas. Índices únicos de SolicitudId, Correlativo y código por cotización; relación con oportunidad y líneas sin borrado en cascada. Importe/totales decimal(18,2), precio unitario decimal(18,4) y tasa decimal(9,6).
- Numerador SQL: secuencia Comercial.NumeroCotizacion de tipo bigint, inicio 1 e incremento 1; global, sin reinicio anual automático. El prefijo usa el año de emisión, por ejemplo COT-2026-00001. Se admiten saltos si una operación consume número y luego falla. Miguel debe revisar esta configuración al crear la migración.
- Persistencia: CotizacionesRepositorio agrega documento, líneas y evento «Emisión de cotización» y confirma con la unidad de trabajo en un único SaveChanges. En SQL Server corresponde a una transacción. Si otra operación gana la inserción de la misma SolicitudId, se recupera el documento existente después del error de unicidad; no se ignoran otros errores.
- Aplicación: vuelve a validar catálogo al emitir, exige oportunidad y cliente activos y rol Asesor/Jefatura. No acepta precios ni totales del cliente. Un reintento de la misma solicitud y operación devuelve el documento original, incluso si después cambió la lista; reutilizar la referencia para otra oportunidad o tipo se rechaza.

### API y pantalla

POST /api/oportunidades/{id}/cotizaciones acepta solo SolicitudId (Guid no vacío) y TipoCliente. Alta nueva: 201 y ubicación; repetición ya guardada: 200 con la misma ficha. GET /api/cotizaciones/{id} devuelve documento, copia de líneas, oportunidad de origen e historial; ID inexistente: 404.

La pantalla conserva la previsualización y agrega Guardar cotización. Mantiene una referencia de solicitud en sessionStorage y memoria para reintentar sin duplicar, bloquea controles durante la petición y recupera la ficha mediante GET. La ficha muestra estado, correlativo, fechas, vendedor y actor, líneas, totales e historial, con enlaces a origen/cliente y opción de imprimir. Su enlace con ?cotizacion={id} permite volver a consultar. Preparar otra cotización inicia deliberadamente otra solicitud.

La relación de cliente, sede y vendedor se consulta desde la oportunidad de origen. Los precios, cantidades y parámetros guardados no se sustituyen por el catálogo al consultar una cotización ya emitida. No hay transiciones de envío o aceptación en esta tarjeta.

### Validación comprobada de esta etapa

Build Release con 0 advertencias y 0 errores; test posterior: 79 superadas, 0 fallidas y 0 omitidas. Son las 68 anteriores más 11 casos nuevos de emisión/consulta. JavaScript comprobado con node --check; diff sin errores de espacios.

Los casos nuevos verifican emisión y ficha, historial, copia de precios tras cambiar/vencer catálogo, repetición sin otra cotización ni evento, conflicto de referencia con otra operación, validación renovada de lista, campos de precio/total manipulados, ID inexistente, referencias nuevas, referencia vacía, rol indebido y cliente inactivo.

Estas pruebas usan EF Core InMemory y un numerador de prueba basado en Interlocked. No demuestran índices únicos, secuencia o carreras concurrentes de SQL Server ni la transacción real. El primer build de esta etapa falló por DLL bloqueadas por la API de pruebas 5216; se confirmó y detuvo solo ese proceso y luego build/test pasaron. SQL Server se mantuvo en marcha.

No se ejecutó todavía guardado real de cotización ni su pantalla nueva contra SQL; la validación Edge anterior corresponde a la previsualización. La API de pruebas 5216 quedó detenida para compilar.

## Entrega preparada para Miguel: migración y prueba SQL

Luis autorizó crear un commit de trabajo y subir luis/com-012-cotizacion al repositorio principal para compartir el modelo con Miguel. Esta entrega no es el PR final de COM-012 y no incluye el borrador local de COM-009 ni la conexión de desarrollo ignorada por Git. Las menciones anteriores de trabajo sin commit corresponden a las etapas previas a esta autorización.

Sobre esta versión en luis/com-012-cotizacion, Miguel debe revisar las configuraciones y crear la migración; no debe generarla desde un main que aún no contiene el modelo de cotización. El siguiente comando es guía para Miguel, no fue ejecutado por el asistente:

```powershell
dotnet ef migrations add CotizacionConLineas --project src/Comercial/Erp.Comercial.Infraestructura --startup-project src/Erp.Api --configuration Release
```

La migración debe incluir Cotizacion, CotizacionLinea, la secuencia NumeroCotizacion, índices únicos y relaciones; no recrear ni borrar tablas existentes. Su aplicación requiere autorización explícita y apuntar a ErpFamihogarPruebasLuis al probar en el equipo de Luis.

Después de aplicar la migración creada por Miguel, comprobar:

1. Emitir desde 8facd3db-acb4-4df5-be8f-ab04a2e30f12 y recuperar ficha e historial.
2. Repetir la misma SolicitudId secuencial y simultáneamente: misma cotización, correlativo y un evento. Enviar solicitudes diferentes simultáneas: correlativos distintos.
3. Provocar un error de guardado controlado en una base de pruebas y confirmar que no quedan documento, líneas o historial parciales. Un salto de secuencia es admisible.
4. Consultar después de reiniciar API; confirmar mismo documento, precios y totales, aunque cambie el catálogo.
5. Probar guardar/reintentar/abrir enlace e imprimir desde navegador, además del precio manipulado y la lista vencida.
6. Recoger explicación y tiempo real de Luis; documentar evidencia final y seguir /cierre antes del commit de cierre y PR con Closes #90.

COM-R02 y COM-R04 no se marcan completamente verificadas ni COM-012 terminada antes de estas comprobaciones. Solo se autoriza compartir la rama de trabajo; no se crea un PR final, no se fusiona y no se escribe en el tablero.
