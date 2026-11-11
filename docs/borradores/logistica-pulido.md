# Pulido de Logística · 2026-11-11

Luis pidió completar los cinco pendientes identificados después del PR #119: inspección parcial, tratamiento de dañados, conteos por calidad, reubicaciones y administración de almacenes/ubicaciones. Se mantienen HTML/CSS/JavaScript, estilo existente, separación de áreas e impresión útil.

## Punto de partida y resultado

Se comprobó por GitHub que #119 estaba integrado. Fetch confirmó `upstream/main` en `dc0fc80`; desde ahí se creó `luis/logistica-pulido`, conservando COM-009 sin cambios. Tras implementar y validar, Luis solicitó el cierre y la publicación del PR. Se creó la [tarjeta #120](https://github.com/miguelr296/ERP-2026-2/issues/120), asignada a Luis; la publicación apunta directamente al principal con `Closes #120`, para revisión de Miguel, sin fusión automática ni Done.

| Pendiente | Resultado comprobado |
|---|---|
| Inspección parcial | Cantidades conformes/observadas por producto; resto pendiente. Devolución y cotejo toman las cantidades correctas |
| Dañados | Deterioro con retención inicial, reparación con aprobación/evidencia/reinspección independiente y baja autorizada mediante movimiento, sin borrar historia |
| Conteo por calidad | Disponible, Cuarentena, Dañado y En reparación; diferencias protegidas cuando siguen vinculadas a calidad. Detección de movimientos posteriores aunque no cambie saldo |
| Reubicación | Salida/entrada del mismo almacén y lote, respetando capacidad, calidad, reservas y retenciones |
| Administración | Crear/editar/reactivar/desactivar almacenes y ubicaciones por sede; impedir desactivación con existencias/operaciones y capacidad incompatible |

Datos: mismo almacenamiento `famihogar.logistica.v1`, ahora esquema 2. La lectura convierte esquema 1 sobre copia sin escribir/borrar; la siguiente operación válida persiste el nuevo esquema. Se conservan movimientos, IDs/documentos e importes. Las ubicaciones pasan a pertenecer a su almacén y los documentos antiguos reciben contadores equivalentes a su estado previo. No se ofrece transacción entre pestañas/equipos.

Las incidencias pendientes retienen solo sus unidades; las unidades sanas siguen disponibles. Al crear otro almacén la demanda de la sede se reparte una sola vez. La reparación recuperada desde una recepción aumenta sus unidades conformes y permite revalidar el cotejo, sin inventar otra recepción ni pago.

## Evidencia

- `node --test --test-isolation=none tests/interfaz/comercial.test.cjs tests/interfaz/logistica.test.cjs`: **123 superadas (46 + 77), 0 fallidas/omitidas**.
- `node tests/interfaz/logistica-navegador.cjs 9247`: **71 comprobaciones**, 0 excepciones JavaScript.
- `node tests/interfaz/navegador.cjs 9247`: **56 comprobaciones**, 0 excepciones JavaScript.
- Chrome headless con perfil temporal y contextos aislados eliminados al terminar. Capturas de recepción parcial y reparación recuperada revisadas; escritorio/móvil. PDF de reparación, despacho y cotización de prueba, A4 de una página cada uno, sin controles.
- Artefactos en `%TEMP%/famihogar-logistica-validacion` (incluye `reparacion.pdf`) y `%TEMP%/famihogar-comercial-validacion`; comandos reproducibles en README.
- Revisión final: 17 JS/CJS compilados para comprobar sintaxis, 44 identificadores HTML únicos, recursos HTML y enlaces de 17 documentos vigentes correctos; diff sin errores. PDF de reparación revisado por texto e imagen: producto, recepción de origen, resultado, evidencia y responsables presentes, sin controles. Se cerró el Chrome temporal; el servidor de pantallas siguió respondiendo HTTP 200 en localhost:5300.

## Revisión de Luis

Abrir `http://localhost:5300/`. En Logística, Almacén registra inspecciones y tratamientos/reubicaciones; Jefatura administra almacenes/ubicaciones y revisa tratamientos y conteos. [Guion actualizado](../pantallas/logistica.md).

Luis declaró **1 hora real (60 minutos) para este pulido** y confirmó haber verificado personalmente el **punto 1 de «Nuevas comprobaciones del pulido»: administración de almacenes y ubicaciones**. Inspección parcial, dañados/reparación/baja, conteos por calidad y reubicaciones quedan pendientes de revisión manual con ayuda de Miguel; no se presenta esa ayuda anunciada como realizada. Esta hora es independiente de la hora de #119 y no se suma otra por registrar el cierre. Las cifras automatizadas anteriores son pruebas del asistente.

La revisión de código de Miguel e integración siguen pendientes. No se declara implementada toda la operativa de un ERP ni las áreas externas.
