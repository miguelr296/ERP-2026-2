# Decisiones

## DEC-001 · Alcance y fuente · Actualizada 2026-11-10

- Área: Comercial del ERP de FAMIHOGAR SAC.
- Referencia funcional: `docs/fuentes/sesion-06-sistema-gestion-comercial.pdf`. Por indicación de Luis y el cambio de enfoque comunicado por Miguel, sustituye el PDF TO BE anterior.
- Tecnologías: únicamente HTML, CSS y JavaScript.
- Criterio de código: simple, claro y limpio.

## DEC-002 · Estructura y separación de responsabilidades · 2026-11-10

- Bartolito ERP orienta el acceso centrado, el selector de aplicaciones, la cabecera, el menú superior y el espacio de trabajo. No se trasladan sus opciones de clínica/farmacia a FAMIHOGAR.
- Comercial gestiona clientes, oportunidades, cotizaciones y pedidos. Inventarios controla disponibilidad; Despachos prepara y entrega; Finanzas gestiona cobros; Facturación emite comprobantes; Contabilidad registra asientos. Compras y Reportes conservan su entrada de módulo.
- Se muestran todos los módulos al ingresar. La primera entrega habilita operaciones comerciales a Asesor y Jefatura; los otros roles no registran ventas. Es una restricción de interfaz, no autorización de servidor.
- Cotización → pedido conserva cliente, líneas, cantidades, precios y condiciones. No produce cobros, salidas de inventario ni asientos. El pedido comienza Borrador; la continuación de esta entrega incorpora controles de disponibilidad/crédito y aprobación independiente según DEC-004.
- Fundamento: PDF, páginas 3–6, 8–9, 12–16 y 23; separación explícita solicitada por Luis.

## DEC-003 · Datos y presentación de esta entrega · 2026-11-10

- Parámetros separados en `datos-comercial.js`. Precios sin IGV en céntimos, cálculo entero y redondeo del impuesto al céntimo. IGV inicial 18 % según el ejemplo de la página 14; vigencia y entrega iniciales de 7 días son supuestos de trabajo, no exigencias del PDF. Las listas por canal/segmento, promociones y descuentos se incorporan en la continuación según DEC-004.
- Lima Centro, Los Olivos y Surco son sedes de ejemplo; no se afirman ubicaciones reales. Los clientes son compartidos y las operaciones se consultan por sede.
- Datos en localStorage, sesión en sessionStorage. Correlativos locales, sin garantía de concurrencia entre pestañas ni de unicidad entre equipos. No se conserva la infraestructura retirada por Miguel.
- Estados de cotización: Borrador → Enviada → Aceptada/Rechazada; rechazo con motivo y control de vigencia. Esta secuencia concreta es una decisión de interfaz apoyada en el recorrido de la página 4. «Marcar enviada» registra la acción; no envía mensajes.
- No se muestran aclaraciones sobre la finalidad del proyecto. Se conservan únicamente los avisos de desarrollo y los mensajes necesarios para operar o corregir errores.
- Los BPMN se prepararán después de revisar los recorridos implementados.

## DEC-004 · Completar funciones comerciales y sus controles · 2026-11-11

- Luis confirmó expresamente: Asesor hasta 5 % con motivo; más de 5 % hasta 20 % requiere aprobación de otra persona de Jefatura; más de 20 % se rechaza, incluso para Jefatura. No se permite resolver la solicitud propia cambiando de rol. Base funcional: PDF pp. 7 y 23.
- Promociones iniciales hasta el límite del Asesor, sujetas a aprobación, vigencia y canal/segmento; no se acumulan con rebaja manual. El descuento se redondea por línea, se suma la base neta y se calcula el impuesto. La cotización no excede la fecha de la lista.
- Clientes/productos y cambios de listas/promociones se proponen y revisan por otra persona. La versión aprobada sigue vigente hasta publicar el cambio. El cliente nuevo no se usa antes de aprobarlo. Es la aplicación del control de maestros de la página 23; la distribución concreta de pantallas es decisión de esta entrega.
- Pedidos: controles de identificación, disponibilidad y crédito → pendiente de aprobación/bloqueado; otra Jefatura vuelve a consultar antes de aprobar. La revisión comercial no sustituye reserva, cobro ni salida física. Fuente pp. 5, 8–11 y explicación de Luis.
- Entregas, facturas y documentos de devolución se consultan por contratos con respuestas locales, sin escribir registros de otras áreas. El seguimiento conserva referencias y cantidades y detecta excesos o respuestas contradictorias. Fuente pp. 10–16.
- Anulación/devolución con motivo y revisión independiente. Se rechaza anulación si hay entregas/facturas, incluidas las conocidas después de solicitarla. La devolución espera recepción, nota y ajuste financiero, no meros indicadores sin referencia. Fuente p. 15.
- La interfaz comercial se considera cubierta dentro de estos límites; no se declara un ERP ni integraciones externas completos. Las tarjetas anteriores con API no se cierran automáticamente. Luis autorizó crear la tarjeta #116 para el nuevo enfoque y preparar su PR; Miguel revisará reglas y límites antes de integrar.
- Fuente y prueba por regla: [matriz](reglas-comerciales.md). [46 pruebas de reglas](../tests/interfaz/comercial.test.cjs) y [54 comprobaciones de pantalla](../tests/interfaz/navegador.cjs).

## DEC-006 · Recorrido frontend de Logística y contratos entre áreas · 2026-11-11

- Motivo: Luis aportó Sesión 10 y pidió mantener el enfoque/estructura de Comercial. Fuente vigente de Logística: pp. 5–12, 15–21 y 24–37; reglas y evidencias en [matriz](reglas-logisticas.md). Se adapta a retail con sedes; fabricación, subcontratación industrial y acceso SAP quedan fuera.
- Se mantiene el selector de ocho aplicaciones: Inventarios se presenta como Logística, con alias de ruta anterior. Compras/Despachos comparten el servicio logístico y filtran operaciones por rol. Se añade Transporte; no se mezclan venta, pago, comprobante y movimiento físico.
- Recorrido: necesidad revisada, ofertas o acuerdo marco, OC aprobada, recepción/cuarentena/calidad, reserva/picking/embalaje, salida/ruta/entrega. Incluye retornos, transferencias entre sedes, conteo de Disponible, cotejo de factura, evaluación e indicadores/acciones.
- Revisiones por otra persona de Jefatura para necesidades, proveedores, acuerdos, adjudicación, OC, transferencias y ajustes. El cierre de acciones exige otra Jefatura respecto al responsable. Es una distribución de funciones de esta entrega, apoyada en pp. 8–12 y 39; no se atribuye al PDF un umbral que no establece.
- Inicialmente un almacén por sede, RACK-A/exhibición/recepción/cuarentena, capacidades en unidades, mínimo 2/objetivo 12 y calidad de oferta 1–5. Son valores configurables de partida para revisión, no datos reales ni cifras exigidas por el PDF. La planificación toma máximo entre necesidad comercial no cubierta y previsión pendiente; resta compromisos/salidas una sola vez y considera compras emitidas en camino.
- La recepción entra en cuarentena, se inspecciona completa y se libera o devuelve al proveedor. Entrega parcial/fallida crea retorno pendiente: no repone existencias sin recepción física. Un traslado descuenta origen antes de incrementar destino. El conteo no invade reservas ni se aplica si el saldo cambió.
- Dinero en céntimos y copia de precios/proveedor/productos al derivar documentos; no se calcula valorización contable. Cotejo de proveedor conserva diferencias e historial, con revalidación después de recibir; pago en Finanzas. La guía de salida es interna y no acredita emisión tributaria.
- Cada área conserva almacenamiento propio y publica consultas con copias. Comercial usa existencias, salidas/entregas y recepción de devolución de Logística; sus respuestas financieras/tributarias siguen pendientes del área dueña. Una salida física impide bloqueo/anulación comercial directa aunque aún no se haya sincronizado entrega.
- Escritura local: leer/copia/comando/invariantes/una publicación; errores no persisten movimientos parciales. No promete concurrencia entre pestañas/equipos. Documentos/eventos se conservan, sin borrado desde pantallas.
- Rama autorizada desde Comercial publicada `7d599e4`. Durante el trabajo Miguel integró #117 (`d4f952f`), cuyo árbol coincide con esa base. Tras las validaciones Luis autorizó la tarjeta #118 y el PR #119. Confirmó 1 hora real total de Logística y revisión de pantallas de Luis/Asesor, Compras, Despachos y Jefatura; revisión de Miguel e integración pendientes, sin Done.

## DEC-007 · Completar calidad e inventarios de Logística · 2026-11-11

- Motivo: Luis pidió continuar el pulido y completar los cinco pendientes identificados después de #119. El PR anterior ya está integrado (`dc0fc80`); el trabajo nuevo parte de main en `luis/logistica-pulido`. No se publica automáticamente otra entrega ni se traslada la hora/revisión declarada antes.
- Amplía DEC-006: inspección por producto con cantidades conformes/observadas y resto pendiente; devolución solo de observadas. El cotejo acepta únicamente conformes, incluidas las recuperadas mediante reparación/reinspección con referencia.
- Deterioro, reparación y baja se solicitan con motivo/cantidad/lote/posición y requieren revisión de otra Jefatura. La solicitud retiene sus unidades, conservando disponible el resto. Reparación usa TALLER/En reparación; Almacén presenta evidencia y otra Jefatura respecto al reparador reinspecciona. No superar la revisión mantiene el bloqueo; la baja agrega salida autorizada e historial, sin borrado ni asiento financiero. Fuente: Sesión 10 p. 9 y controles concretos de esta entrega.
- Conteo por estado de calidad; un ajuste no invade reservas/retenciones ni reescribe cantidades ligadas a una recepción/reparación pendiente. Los movimientos posteriores invalidan el conteo aunque terminen en el mismo saldo. Reubicación interna conserva lote/estado y añade salida/entrada; los documentos de calidad se resuelven antes de mover sus unidades. Fuente pp. 19–21.
- Almacenes/ubicaciones se administran por sede desde Jefatura, con historial y activación/desactivación. No se cambia la identidad de una ubicación usada ni se retiran estados/capacidad/actividad que hagan incompatibles sus existencias; no se desactiva con operaciones pendientes. Cada almacén recibe zonas propias; la planificación reparte una vez la demanda de la sede entre almacenes activos. Fuente pp. 15 y 24–25.
- Esquema logístico 2 dentro de la misma clave: conversión sobre copia desde 1, sin publicar al leer, conservando documentos/movimientos/importes y IDs. Los IDs iniciales de ubicaciones son estables entre lecturas; almacenes/ubicaciones nuevos reciben identidad propia. No se garantiza concurrencia entre pestañas/equipos.
- [Reglas/fuente/prueba](reglas-logisticas.md), [guion](pantallas/logistica.md) y [evidencia del pulido](borradores/logistica-pulido.md). Finanzas, comprobantes, fabricación y servicios externos conservan sus límites anteriores.
- Cierre posterior: Luis declaró 1 hora real adicional para el pulido, verificó el punto 1 de la guía nueva (administración de almacenes/ubicaciones) y solicitó el PR. La tarjeta nueva es #120. Inspección parcial, dañados, conteos y reubicaciones quedan pendientes de revisión manual con ayuda de Miguel, además de revisión de código e integración; no se interpreta la publicación como Done.

