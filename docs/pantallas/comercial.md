# Pantallas de Comercial

[Índice](../../README.md) · [Fuente](../fuentes/sesion-06-sistema-gestion-comercial.pdf) · [Reglas](../reglas-comerciales.md) · [Decisiones](../decisiones.md)

**Estado:** alcance frontend de la [tarjeta #116](https://github.com/miguelr296/ERP-2026-2/issues/116) implementado y validado para revisión. Incluye las funciones comerciales propias y consultas a contratos locales de las otras áreas. No declara implementados Finanzas, Inventarios, Despachos, Facturación ni Contabilidad. Revisión e integración pendientes; no se marca Done.

Luis declaró **1 hora real en total**. Confirmó los límites 5 % / 20 %, explicó la revisión independiente y autorizó la tarjeta nueva y el PR. No se suman horas no declaradas a la continuación del trabajo.

## Cobertura

| Pantalla | Operaciones | Fuente / decisión |
|---|---|---|
| Acceso y Aplicaciones | Usuario, siete roles, sede, sesión/salida, ocho módulos, búsqueda sin tildes | Bartolito e indicaciones de Luis |
| Panel Comercial | Operaciones por sede, accesos y contadores calculados | PDF pp. 3, 24 |
| Clientes | Alta/actualización propuesta, DNI/RUC único, direcciones de entrega/fiscal/cobranza, segmento y condición preferida, revisión independiente | PDF pp. 6, 23 |
| Productos | Alta/actualización con familia, unidad y coste separado del precio; publicación tras revisión | PDF pp. 6–7, 23 |
| Oportunidades | Cliente aprobado, canal, vendedor, sede, productos/cantidades, seguimiento y cierre como perdida con motivo | PDF pp. 3–6; indicación de Luis |
| Precios | Listas por canal/segmento, fechas inclusivas, rechazo de solapamiento, activación/desactivación y cambios sujetos a revisión | PDF pp. 6–7 |
| Promociones | Canal, segmento, vigencia y rebaja no acumulable, revisión antes de publicar | PDF p. 7; DEC-004 |
| Cotizaciones | Precios desde lista vigente, copia de condiciones, descuento/motivo, IGV, fechas, condición de pago, excepción, estados, vencimiento, ficha e impresión | PDF pp. 4, 7–9, 23; límites confirmados por Luis |
| Aprobaciones | Maestros, excepciones y pedidos; otra persona de Jefatura, motivo e historial | PDF pp. 9, 23; DEC-004 |
| Pedidos | Origen aceptado, copia sin redigitación, controles, aprobación/bloqueo, seguimiento de atención parcial y facturas informadas | PDF pp. 4, 8–14 |
| Postventa | Solicitudes de anulación/devolución, cantidades máximas, revisión independiente, conservación del documento y seguimiento de referencias de otras áreas | PDF pp. 15–16, 23 |
| Indicadores | Cotizado, pedidos aprobados, conversión, descuento, ticket, margen estimado para Jefatura y pendientes; filtros por fecha/canal/sede | PDF p. 24 |

## Separación entre módulos

- **Comercial:** registra clientes/oportunidades, propone condiciones, gestiona documentos, revisiones y solicitudes. La aprobación comercial no cobra ni mueve existencias.
- **Inventarios:** informa disponibilidad; consultar no reserva ni descuenta stock.
- **Despachos:** informa entregas y sus documentos. Comercial consulta cantidades solicitadas/atendidas/pendientes; no confirma salidas.
- **Finanzas:** informa límite, exposición y vencido. Comercial no cambia esos valores ni registra cobros.
- **Facturación y Contabilidad:** emiten comprobantes y asientos. Comercial consulta referencias, sin emitirlos ni contabilizar.

Los módulos propietarios, Compras y Reportes generales siguen mostrando En desarrollo. El panel de indicadores comerciales sí está disponible dentro de Comercial. [Contratos de consulta y datos de ejemplo](../contratos/integracion-comercial.md).

## Reglas de operación

1. Un cliente pendiente/rechazado no se usa para una nueva oportunidad/cotización. La actualización propuesta no reemplaza el maestro aprobado hasta su revisión.
2. Para cotizar debe existir exactamente una lista aprobada y activa del canal/segmento, vigente en la fecha y con precio para cada producto. La cotización no supera la vigencia de la lista.
3. Dinero en céntimos: descuento por línea redondeado al céntimo, base como suma de importes netos e impuesto sobre la base. Hasta 5 % manual con motivo; más de 5 % hasta 20 % queda Pendiente de aprobación; más de 20 % se rechaza. No se acumula promoción y descuento manual.
4. Una excepción requiere otra persona de Jefatura, aunque el solicitante también tenga ese rol. No se envía ni acepta antes de resolverla. Rechazo/anulación requieren motivo; el vencimiento se registra sin borrar la ficha.
5. El pedido deriva de cotización aceptada/vigente. Volver a consultarlo devuelve el existente. Borrador → validación → Pendiente de aprobación/Bloqueado; otra Jefatura consulta de nuevo y aprueba únicamente con controles favorables.
6. Crédito/stock insuficiente, ausente o vencido no se omite desde Comercial. Bloqueo manual requiere motivo. La identificación y aprobación del cliente también se revisan.
7. Las respuestas de entrega no exceden cantidades pedidas, ni las facturas informadas el total. Misma referencia se consulta sin duplicar; una respuesta que cambia una entrega/factura ya registrada requiere revisión del área propietaria.
8. Anulación exige otra revisión y no se autoriza si existen entregas/facturas, incluidas las aparecidas después de solicitarla. Devolución no excede cantidades entregadas disponibles, contando las otras solicitudes pendientes/autorizadas.
9. Una devolución autorizada espera referencias de recepción, nota de crédito y regularización financiera para figurar Completada. Un valor booleano sin documento no demuestra esos registros.

## Datos y límites

- `famihogar.comercial.v1` conserva el estado con **esquema 2**. La lectura migra el esquema 1 sin borrar clientes ni documentos. Se añaden los nuevos maestros y colecciones; los importes históricos se conservan.
- `famihogar.sesion` contiene nombre, rol y sede en sessionStorage. Salir elimina la sesión y conserva documentos. No hay autenticación de servidor ni seguridad real por rol.
- Clientes y catálogo son compartidos; operaciones e indicadores se consultan por sede. Los costes y el margen estimado se muestran solo a Jefatura.
- La información vive en este navegador. Borrar los datos del sitio elimina registros. No hay sincronización entre equipos, transacciones ni garantía de concurrencia entre pestañas.
- Correlativos locales, no tributarios. No hay eliminación de documentos/eventos en pantalla; modificar manualmente localStorage puede alterar la información.
- Respuestas de integración identificadas como locales. No hay llamadas reales a Finanzas, inventario, bancos o SUNAT. No se reutiliza la evidencia .NET/SQL de la etapa retirada.
- «Marcar enviada» registra la acción, no envía correo/WhatsApp. La entrega es propuesta. La facturación informada y el margen comercial no acreditan cobros ni asientos.

## Recorrido manual

1. Abrir `http://localhost:5300/`. Entrar como **Luis / Asesor / Lima Centro** y revisar aplicaciones, clientes, oportunidades y precios.
2. Crear un cliente con sus tres direcciones. Queda pendiente. Entrar como **Miguel / Jefatura**, ir a Aprobaciones, consultar la propuesta y aprobar con motivo. Con el nombre Luis no se permite resolver su propia solicitud.
3. Volver como Luis y crear una oportunidad con ese cliente: dos sofás SOF-001 y una mesa MES-001.
4. Crear cotización sin descuento: subtotal 3547,00, IGV 638,46, total 4185,46. Con 10 % y motivo: descuento 354,70, base 3192,30, IGV 574,61 y total 3766,91; queda pendiente de otra Jefatura. Más de 20 % se rechaza.
5. Miguel aprueba la excepción. Luis marca enviada, registra aceptación y crea pedido. Consultarlo de nuevo no crea otro. Validar controles; Miguel revisa y aprueba comercialmente. Comprobar origen, responsables e historial.
6. Las respuestas iniciales permiten consultar stock de los muebles; el cliente nuevo no tiene crédito configurado. Al elegir Crédito, la respuesta ausente lo bloquea; el Asesor no puede inventar un límite ni cobrar.
7. En Precios, Jefatura propone una lista/producto/promoción y otra persona la publica. La propuesta no altera la lista vigente y las cotizaciones anteriores conservan sus valores.
8. Solicitar anulación con motivo en un pedido sin entregas/facturas y revisar con otra persona. El documento se conserva. Las pruebas automatizadas aportan respuestas controladas de Despachos para revisar atención parcial y solicitudes de devolución; la interfaz no ofrece registrar salidas como si fuera Despachos.
9. Revisar Indicadores, filtrar fecha/canal y cambiar sede. Entrar con Tesorería u otro rol ajeno: Comercial no permite operar.
10. Imprimir cotización o solicitud: marca y ficha, sin controles de navegación. Desactivar encabezados/pies del navegador si se desea omitir URL/fecha.

## Validación ejecutada

- **46 pruebas de reglas:** precios, límites, permisos, segregación, maestros, controles, cambios de respuestas, concurrencia secuencial/idempotencia local, parciales, anulación, devolución, vencimiento y migración de datos. No acredita concurrencia entre equipos.
- **54 comprobaciones de pantalla:** Chrome con perfil de prueba y contexto aislado eliminado al terminar; recorrido completo, siete roles, maestros/precios/promoción, excepciones, crédito, solicitudes, filtros de fecha/canal/sede, recarga, salida, impresión y móvil de 390 px. **0 excepciones JavaScript**.
- Cotización con descuento, aprobación e historial: **PDF A4 de una página**. Capturas de escritorio/móvil e impresión revisadas visualmente.
- Sintaxis JS, referencias HTML, enlaces de documentación y diff se comprueban en la validación final del cierre. [Comandos reproducibles](../../README.md).

La primera entrega tuvo 41 comprobaciones de navegador. Se conservan como evidencia histórica en bitácora; el resultado vigente es la regresión anterior. No se atribuyen a Luis pruebas manuales que aún no haya confirmado. La explicación del autor y la hora declarada sí fueron proporcionadas por él.
