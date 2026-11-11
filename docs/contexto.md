# Contexto

FAMIHOGAR SAC es una mueblería retail con varias sedes. La prioridad son las pantallas y sus recorridos. La fuente funcional vigente es [Sesión 06 — Sistema de Gestión Comercial](fuentes/sesion-06-sistema-gestion-comercial.pdf); Bartolito ERP es la referencia de estilo y estructura. El PDF TO BE anterior ya no dirige esta etapa.

Se trabaja desde el reinicio de Miguel (`0407b98`), únicamente con HTML, CSS y JavaScript. Se conserva la identidad FAMIHOGAR, con acceso por usuario, rol y sede; después se elige módulo. Las aclaraciones sobre la finalidad del proyecto se omiten en las pantallas; las áreas pendientes muestran solo su estado de desarrollo.

Alcance frontend de Comercial implementado y validado para revisión en la nueva [tarjeta #116](https://github.com/miguelr296/ERP-2026-2/issues/116): ocho módulos, maestros revisados, oportunidades, listas/promociones, descuentos, cotizaciones, pedidos con controles y aprobación independiente, seguimiento, postventa e indicadores. Comercial consulta respuestas locales de otras áreas; no registra cobros, reservas, salidas, comprobantes ni asientos.

Luis confirmó límites 5 % / 20 %, explicó la segregación de funciones, declaró 1 hora real en total y autorizó la tarjeta nueva y el PR para Miguel. Validación vigente: 46 pruebas de reglas y 54 comprobaciones de navegador, sin fallos/excepciones; ficha A4 de una página. Revisión e integración pendientes, sin Done. No se cierran tarjetas del plan anterior con API ni se trasladan sus resultados SQL a esta entrega.

Los registros se conservan en localStorage y la sesión en sessionStorage. No hay autenticación de servidor, base compartida ni sincronización entre equipos. Sedes, clientes, catálogo y parámetros iniciales son ejemplos configurables, no información confirmada de una empresa. [Detalle y comprobaciones](pantallas/comercial.md).
