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

### Plantilla

Fecha · Persona · Trabajo realizado
- Evidencia:
- Pendientes:
