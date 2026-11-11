# Contexto

FAMIHOGAR SAC es una mueblería retail con varias sedes. La prioridad son las pantallas y sus recorridos. Fuentes: [Sesión 06 — Gestión Comercial](fuentes/sesion-06-sistema-gestion-comercial.pdf) y [Sesión 10 — Gestión Logística](fuentes/sesion-10-gestion-logistica.pdf). Bartolito ERP orienta estilo/estructura. El PDF TO BE anterior ya no dirige esta etapa.

Se trabaja desde el reinicio de Miguel (`0407b98`), únicamente con HTML, CSS y JavaScript. Se conserva la identidad FAMIHOGAR, con acceso por usuario, rol y sede; después se elige módulo. Las aclaraciones sobre la finalidad del proyecto se omiten en las pantallas; las áreas pendientes muestran solo su estado de desarrollo.

Comercial (#116) incluye maestros revisados, oportunidades, listas/promociones, descuentos, cotizaciones, controles/aprobación de pedidos, seguimiento, postventa e indicadores. Miguel integró el [PR #117](https://github.com/miguelr296/ERP-2026-2/pull/117), merge `d4f952f`; comprobado en GitHub y con fetch autorizado. Su árbol coincide con la base `7d599e4` de `luis/logistica`.

La primera entrega de Logística se integró mediante #119, merge `dc0fc80`, comprobado en GitHub y con fetch. Desde ese main se creó `luis/logistica-pulido`, conservando COM-009. Las cinco ampliaciones —inspección parcial, dañados/reparación/reinspección/baja, conteo por estado, reubicación y maestros— están implementadas y validadas. Luis autorizó el PR y se creó la [tarjeta #120](https://github.com/miguelr296/ERP-2026-2/issues/120), asignada a él, para revisión de Miguel. Se mantienen responsabilidades y contratos públicos entre áreas.

Validación del asistente: 46 reglas Comercial + 77 Logística, **123 superadas**; 56 comprobaciones de navegador Comercial + 71 Logística, **127**, sin excepciones. Cotización, despacho y reparación de prueba en A4 de una página cada uno; escritorio y móvil. La migración local al esquema 2 conserva datos anteriores. No se afirma CI. [Guion y límites de Logística](pantallas/logistica.md).

Luis declaró **1 hora real para el pulido**, independiente de la hora de #119, y verificó personalmente el **punto 1 de la guía nueva: administración de almacenes/ubicaciones**. Inspección parcial, dañados, conteos y reubicaciones quedan pendientes de revisión manual con ayuda de Miguel, además de revisión de código e integración. La evidencia automatizada no se atribuye al usuario y no se marca Done al publicar. [Evidencia del pulido](borradores/logistica-pulido.md).

Cada área conserva sus registros en localStorage y la sesión en sessionStorage. No hay autenticación de servidor, base compartida ni sincronización entre equipos. Los datos y parámetros iniciales son configurables. Finanzas, Facturación y Contabilidad aún no producen operaciones; sus respuestas pendientes no se presentan como cobros/pagos, comprobantes o asientos reales.
