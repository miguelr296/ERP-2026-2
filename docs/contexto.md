# Contexto

FAMIHOGAR SAC es una mueblería retail con varias sedes. La prioridad son las pantallas y sus recorridos. Fuentes: [Sesión 06 — Gestión Comercial](fuentes/sesion-06-sistema-gestion-comercial.pdf) y [Sesión 10 — Gestión Logística](fuentes/sesion-10-gestion-logistica.pdf). Bartolito ERP orienta estilo/estructura. El PDF TO BE anterior ya no dirige esta etapa.

Se trabaja desde el reinicio de Miguel (`0407b98`), únicamente con HTML, CSS y JavaScript. Se conserva la identidad FAMIHOGAR, con acceso por usuario, rol y sede; después se elige módulo. Las aclaraciones sobre la finalidad del proyecto se omiten en las pantallas; las áreas pendientes muestran solo su estado de desarrollo.

Comercial (#116) incluye maestros revisados, oportunidades, listas/promociones, descuentos, cotizaciones, controles/aprobación de pedidos, seguimiento, postventa e indicadores. Miguel integró el [PR #117](https://github.com/miguelr296/ERP-2026-2/pull/117), merge `d4f952f`; comprobado en GitHub y con fetch autorizado. Su árbol coincide con la base `7d599e4` de `luis/logistica`.

Logística está implementada y validada localmente para revisión: necesidades/compras, acuerdos/ofertas/OC, recepción/calidad, existencias, reservas/picking/despacho/entrega, retornos, traslados, conteo, cotejo de factura e indicadores/acciones. Se mantienen ocho aplicaciones; Logística sustituye el nombre Inventarios y se habilitan Compras/Despachos. El Asesor solicita necesidades; Compras, Almacén, Transporte y Jefatura operan sus responsabilidades. Comercial consulta existencias, entregas y recepción de devolución por contratos públicos, sin editar Logística.

Validación del asistente: 46 reglas Comercial + 54 Logística, 100 superadas; 56 comprobaciones de navegador Comercial + 49 Logística, sin excepciones. Cotización y despacho de prueba en A4 de una página. Por separado, Luis confirmó su revisión personal de las pantallas de Luis/Asesor, Compras, Despachos y Jefatura. No se afirma CI. [Guion y límites de Logística](pantallas/logistica.md).

La [tarjeta #118](https://github.com/miguelr296/ERP-2026-2/issues/118) está asignada a Luis y el [PR #119](https://github.com/miguelr296/ERP-2026-2/pull/119) publicado en el principal con `Closes #118`, revisión solicitada a Miguel. Luis declaró **1 hora real total de Logística**, independiente del tiempo de Comercial. Revisión de Miguel e integración pendientes, sin Done. No se cierran tarjetas del plan anterior con API ni se trasladan sus resultados SQL.

Cada área conserva sus registros en localStorage y la sesión en sessionStorage. No hay autenticación de servidor, base compartida ni sincronización entre equipos. Los datos y parámetros iniciales son configurables. Finanzas, Facturación y Contabilidad aún no producen operaciones; sus respuestas pendientes no se presentan como cobros/pagos, comprobantes o asientos reales.
