# Bitácora

Registrar aquí solo actividades realizadas y comprobadas durante esta nueva etapa.

## Sesiones

### 2026-11-10 · Luis · 1 h real declarada (60 minutos) · Nueva interfaz Comercial

- Trabajo realizado: con autorización, actualicé las referencias del principal y creé `luis/interfaz-comercial` desde `upstream/main` (`0407b98`). La rama anterior y el borrador local de COM-009 se conservaron. No se hicieron commits ni subidas.
- Referencias: revisé el ZIP Bartolito ERP como guía visual y de navegación y las 24 páginas del nuevo PDF, incluyendo sus diagramas. Incorporé el PDF vigente y sustituí las referencias al documento retirado en índice, contexto, decisiones e inicio.
- Pantallas: acceso con usuario/rol/sede, selector de ocho módulos, cabecera y menú de trabajo, panel Comercial, clientes, oportunidades, catálogo, cotizaciones, consulta e impresión; pedido en borrador desde cotización aceptada. Las otras áreas muestran En desarrollo. Comercial no registra pagos ni confirma stock. Se retiraron de la interfaz las aclaraciones que Luis pidió omitir.
- Evidencia: 41 comprobaciones de navegador en Chrome aislado, sin excepciones JavaScript. Incluyen siete roles, sedes, errores de alta, cantidades, copia de precios, estados, motivo de rechazo, vigencia, origen y derivados, recarga, salida y móvil. Ejemplo: subtotal 3547,00 + IGV 638,46 = 4185,46; cotización y pedido conservan el total aunque cambie el catálogo de la prueba. PDF A4 de una página sin controles. Capturas de escritorio, móvil e impresión revisadas.
- Incidencia y límites: Edge respondió «Printing is not available» en una repetición; impresión comprobada en Chrome. Los registros y correlativos son locales al navegador, sin servidor ni concurrencia garantizada. No se trasladan los resultados .NET/SQL de la etapa anterior como pruebas de esta entrega. [Alcance y guion](docs/pantallas/comercial.md).
- Tiempo y alcance: Luis declaró 1 hora de desarrollo y condicionó preparar el PR a que estuviera completo el módulo Comercial. La revisión confirma una primera entrega funcional; no está implementado todo Comercial. Las 41 comprobaciones corresponden al recorrido disponible y no acreditan las funciones pendientes.
- Pendientes comerciales: listas por canal y vigencias de catálogo, promociones, descuentos/autorizaciones, aprobación y bloqueo/anulación de pedidos, solicitudes comerciales de devolución/anulación y controles comerciales de crédito coordinados con Finanzas. Stock, despacho, cobros, comprobantes y asientos corresponden a sus áreas; no se incorporan a Comercial para completar su alcance.
- Siguiente paso: completar y validar las funciones comerciales pendientes, con sus dependencias explícitas. Por la condición indicada por Luis no se prepara ni publica el PR todavía. Revisión manual de Luis pendiente; no se actualizó GitHub ni se marcaron tarjetas terminadas.

### 2026-11-11 · Luis · Continuación y cierre de interfaz Comercial · #116

- Alcance completado para revisión: listas por canal/segmento y vigencias, promociones, revisión de clientes/productos/listas, descuentos y autorizaciones, cotizaciones con vencimiento, control/aprobación/bloqueo de pedidos, atención parcial consultada, anulación/devolución con referencias y panel de indicadores. Se mantiene la separación de cobros, reservas, salidas, comprobantes y asientos.
- Acuerdo: Luis confirmó 5 % para Asesor y hasta 20 % con otra Jefatura; nadie resuelve su propia excepción. Explicó que la revisión independiente impide autorizarse a sí mismo y que aprobar Comercial no equivale a cobrar ni registrar salida física: cada área requiere su validación y registro.
- Evidencia final: `node --test --test-isolation=none tests/interfaz/comercial.test.cjs`: 46 superadas, 0 fallidas y 0 omitidas. `node tests/interfaz/navegador.cjs 9245`: 54 comprobaciones, 0 excepciones JavaScript. Incluye maestros/productos/promociones, precios, autorización independiente, consulta fresca de controles, postventa, estados y referencias, filtros de fecha/canal/sede, siete roles, móvil, recarga e impresión A4 de una página. Los contextos de prueba se eliminaron al terminar, sin modificar datos del usuario.
- Correcciones comprobadas: motivo vacío no cambia estado antes de rechazarse; un documento externo ya registrado no se sobrescribe con cantidades contradictorias; booleans sin referencias no completan una devolución. Se compactó la ficha con descuento e historial para una hoja de prueba, conservando autorización y motivo.
- Preparación: fuentes, reglas, contratos, glosario, guion, contexto y comandos actualizados. No se atribuyen comprobaciones manuales nuevas a Luis ni resultados de servidor/SQL. Su tiempo real declarado sigue siendo 1 hora en total; no se añaden horas por esta continuación.
- Publicación autorizada: Luis aprobó crear la [tarjeta #116](https://github.com/miguelr296/ERP-2026-2/issues/116), asignada a su cuenta, y el PR con Closes #116. Se comprobó permiso de escritura en el principal, ausencia de PR abiertos y main sin novedades respecto a la base `0407b98`. Las tarjetas antiguas con API no se cierran. El borrador histórico de COM-009 y la configuración local ignorada quedan fuera del commit.
- Validación final de archivos: 12 documentos revisados, referencias HTML y 44 identificadores sin incidencias, sintaxis de todos los JS/CJS correcta y git diff --check sin errores. Siguiente paso: publicar el PR para Miguel. Sin fusión ni Done. La ausencia de workflow en el main reiniciado no se presenta como CI superado.

### 2026-11-11 · Luis · Pantallas de Logística · Tiempo pendiente de declarar

- Autorización: Luis pidió continuar el enfoque frontend de Comercial con Sesión 10, mueblería retail con sedes y estructura Bartolito. Autorizó actualizar upstream y crear `luis/logistica` desde Comercial publicada, conservando el borrador COM-009. No se hicieron commits, subidas ni otro PR.
- Fuente: se leyeron textos de 39 páginas y los diagramas relevantes. Copia local del PDF con SHA-256 `c9c1c4503eebc5eaa93bf4e846688526e9e7321ac54262e843d7fa96c33139eb`; no se ejecutaron indicaciones/cuentas del material. Se eligió abastecimiento/almacén/distribución/control para retail, sin fabricación ni configuración SAP.
- Implementación: pantallas de planificación/necesidades, proveedores y revisión, peticiones/ofertas/adjudicación, acuerdos marco/OC, recepción/calidad/devolución a proveedor, cotejo de factura/revalidación, existencias/kardex, reserva/picking/embalaje, salida/ruta/entrega/retornos, traslados, conteos, indicadores/evaluación/acciones. Compras, Almacén, Transporte y Jefatura operan sus responsabilidades; Asesor plantea necesidades. Finanzas y comprobantes conservan sus responsabilidades.
- Integración: contratos públicos de Comercial y Logística con copias, sin escribir datos ajenos. Comercial consulta disponibilidad real local, entregas confirmadas y recepción de devolución; una salida impide bloqueo/anulación directa. Escrituras logísticas sobre copia con una publicación; sin garantía entre pestañas/equipos.
- Evidencia: `node --test --test-isolation=none tests/interfaz/comercial.test.cjs tests/interfaz/logistica.test.cjs`: **100 superadas (46 + 54), 0 fallidas/omitidas**. `node tests/interfaz/logistica-navegador.cjs 9246`: **49 comprobaciones**; `node tests/interfaz/navegador.cjs 9246`: **56 de regresión Comercial**, sin excepciones JavaScript. Recorridos completos entre pantallas, roles/sedes, parciales, cuarentena, cotejo observado/revalidado, retorno físico, traslado y conteo. Contextos aislados eliminados; no se tocaron registros del usuario.
- Correcciones verificadas: demanda no descontada dos veces al reservar/despachar; máximo de acuerdo acumulado entre OC; revalidación de factura observada con historial; un error de capacidad/posición no publica media inspección; documentos físicos repetidos no incrementan cantidades dos veces. Ficha de conteo muestra teórico/contado/diferencia y la impresión conserva referencias documentales.
- Presentación: capturas escritorio y móvil de 390 px revisadas; ficha despacho y cotización en PDF A4 de una página, sin controles. Artefactos en carpetas temporales indicadas en README. No acredita impresión física ni CI; no se reintrodujo backend/SQL de la etapa retirada.
- Estado del principal comprobado: al crear la rama #117 seguía abierto. Durante el trabajo Miguel lo integró (`d4f952f`); consulta GitHub y fetch autorizado confirman que su árbol coincide con `7d599e4`. Logística sigue local; no se declaró Done ni se escribieron cambios en GitHub.
- Documentación: guion por rol, matriz fuente/prueba, contratos, índice, contexto, decisiones y glosario actualizados. Revisión manual/explicación de Luis, tiempo real y tarjeta/autorización de publicación pendientes. La hora declarada para Comercial no se suma como tiempo de Logística.
- Revisión final: sintaxis de 15 JS/CJS mediante compilación sin ejecución, referencias HTML y 44 identificadores sin duplicación, enlaces de 16 documentos vigentes y hash del PDF correctos. `git diff --check` sin errores. El PDF final conserva pedido/picking, cliente, fecha de entrega, constancia e historia, sin controles; impresión revisada visualmente. El borrador histórico COM-009 no se modificó ni se incluyó en la comprobación de enlaces vigentes.

### 2026-11-11 · Luis · Preparación y publicación autorizada de Logística · #118

- Luis pidió preparar la nueva tarjeta y el PR una vez completado el alcance frontend. Se creó la [tarjeta #118](https://github.com/miguelr296/ERP-2026-2/issues/118), asignada a LuisInfinito, con criterios comprobados y revisión/integración pendientes; no se marcó Done.
- Comprobaciones previas: remotos origin=fork y upstream=principal; permiso write/push de Luis en el principal y ningún PR abierto. Fetch autorizado confirmó `upstream/main` en `d4f952f`, sin diferencias de contenido respecto a la base de la rama. Publicación prevista directamente al principal, sin fork ni fusión automática.
- Versión final: repetición de las pruebas de reglas, **100/100 superadas**, 0 fallidas/omitidas. Conserva la evidencia de navegador ya ejecutada sobre este código: 49 Logística y 56 Comercial, sin excepciones, impresión A4. Documentación vinculada a #118; el PR incluirá `Closes #118` y solicitará revisión de Miguel.
- Confirmación manual y tiempo real de Logística solicitados a Luis, todavía pendientes. No se inventan horas ni se convierte la evidencia automatizada en revisión personal. El borrador histórico COM-009, appsettings local y los informes TRX anteriores quedan fuera del commit.

### 2026-11-11 · Luis · Confirmación del cierre de Logística · 1 h real total

- Luis confirmó **1 hora (60 minutos) invertida en Logística**, independiente de Comercial; no se acumula otra hora al tiempo pendiente de la sesión anterior ni por registrar esta confirmación.
- Revisión personal declarada: pantallas de Luis/Asesor, Compras, Despachos y Jefatura. Se registra con ese alcance, sin atribuirle cada caso automatizado, la impresión física ni todo el guion manual.
- Publicación comprobada: [PR #119](https://github.com/miguelr296/ERP-2026-2/pull/119), commit inicial `db40d44`, en el principal de Miguel desde `luis/logistica`, con `Closes #118`, sin conflictos y revisión solicitada a miguelr296. La [tarjeta #118](https://github.com/miguelr296/ERP-2026-2/issues/118) sigue abierta. Esta actualización incorpora la confirmación a documentación y descripciones, conservando la evidencia automatizada previa.
- Sin cambios de código funcional; revisión de Miguel e integración pendientes, sin fusión ni Done. COM-009 y la configuración local permanecen fuera.

### Plantilla

Fecha · Persona · Trabajo realizado
- Evidencia:
- Pendientes:
