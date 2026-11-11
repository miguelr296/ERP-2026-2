# Logística — preparación y desarrollo

## Autorización y punto de partida

Luis pidió trabajar Logística con el mismo enfoque frontend de Comercial: mueblería retail con sedes, fuente PDF nueva, estilo/estructura Bartolito y responsabilidades separadas. Inicialmente autorizó fetch y crear `luis/logistica` desde Comercial publicada, conservando COM-009. Después de validar el recorrido, autorizó preparar la nueva tarjeta y el PR.

El PR Comercial [#117](https://github.com/miguelr296/ERP-2026-2/pull/117) seguía abierto y sin integrar al iniciar; `main` estaba en `0407b98` y la base de esta rama es `7d599e4`. Logística depende de #117; no se reintroduce infraestructura .NET ni se modifica el PR anterior desde esta rama.

## Fuente y lectura

[Sesión 10 — Gestión Logística](../fuentes/sesion-10-gestion-logistica.pdf), aportada por Luis, 39 páginas. SHA-256: `c9c1c4503eebc5eaa93bf4e846688526e9e7321ac54262e843d7fa96c33139eb`.

Se extrajeron textos de todas las páginas y se inspeccionaron los diagramas de pp. 5–12, 13–14, 22–25, 27 y 38. La portada dice Arquitectura Tecnológica, pero el contenido trata logística; el alcance se determina por el contenido. La captura de acceso a SAP de p. 38 no se utiliza para acceder a servicios ni copiar cuentas/contraseñas.

| Recorrido propio | Fuente física |
|---|---|
| Planificación de necesidades y reposición retail, sin fabricación | pp. 5, 7, 13–16, 28 |
| Proveedores, requisición/aprobación, petición/oferta/comparación, adjudicación y OC | pp. 8, 16–18, 27–32, 39 |
| Acuerdos marco y evaluación de proveedores | pp. 17–18, 29–31 |
| Recepción, inspección, cuarentena, liberación/no conformidad, devolución a proveedor | pp. 9, 17, 19, 21, 33 |
| Almacenes/ubicaciones, movimientos, inventario físico, ajustes y transferencias | pp. 5, 15, 19–21, 24–26, 36–37 |
| Reservas, picking/packing, salida, ruta, entrega, retornos y devoluciones autorizadas | pp. 10, 20–21 |
| Cotejo orden/recepción/factura para Finanzas, sin pagar | pp. 17, 26–27, 34–35 |
| Indicadores, evaluación y acciones correctivas | pp. 11–12, 18, 21 |

## Diseño de la entrega

- HTML/CSS/JavaScript, datos de Logística en clave propia. Las escrituras usan copia nueva, validación e invariantes y una publicación; no se garantizan transacciones entre pestañas/equipos.
- Compras y Despachos conservan sus entradas; Logística agrupa los recorridos operativos y conecta Comercial por contratos públicos. No se leen/modifican tablas ajenas directamente.
- Compras: proveedores, ofertas, órdenes y cotejo. Almacén: recepción, inspección, existencias, reservas/preparación y retornos. Transporte: ruta/entrega. Jefatura: revisión y decisiones. Asesor puede plantear necesidades, sin registrar salidas ni pagos.
- Pago a proveedores y cobros permanecen en Finanzas. Facturación emite los comprobantes; Logística produce documentos internos de salida/recepción y consulta las referencias externas.
- No se traslada fabricación, subcontratación industrial ni configuración SAP a una mueblería retail.

## Estado del trabajo

Implementación frontend del recorrido elegido lista para revisión local. Incluye planificación, abastecimiento, acuerdos, proveedores/ofertas/OC, recepción/calidad, inventario y conteo, reserva/picking/despacho/entrega, retornos, traslados y cotejo/control. [Guion completo, responsabilidades y límites](../pantallas/logistica.md) · [reglas](../reglas-logisticas.md) · [contratos](../contratos/integracion-logistica.md).

- Reglas: 54 Logística + 46 Comercial, 100 superadas, 0 fallidas/omitidas.
- Pantallas: 49 Logística + 56 regresión Comercial, 0 excepciones JavaScript. Escritorio/móvil, sedes/roles, documentos/estados, parciales, persistencia e impresión. Son comprobaciones del asistente; la revisión personal de Luis se registra por separado.
- Fichas de prueba: despacho y cotización, A4 de una página cada una. Fuera del repositorio, `%TEMP%/famihogar-logistica-validacion` y `%TEMP%/famihogar-comercial-validacion`.
- Revisión final: 15 JS/CJS con sintaxis correcta, 44 identificadores HTML únicos, referencias de recursos y enlaces de 16 documentos vigentes comprobados, hash de fuente confirmado y diff sin errores. PDF final con origen/picking, cliente, fecha, constancia e historial, revisado visualmente.
- Miguel integró #117 durante el trabajo: GitHub y fetch autorizado confirman merge `d4f952f`, árbol idéntico a la base `7d599e4`. La dependencia inicial queda resuelta; no se hizo merge local ni se cambiaron sus commits.
- Nueva [tarjeta #118](https://github.com/miguelr296/ERP-2026-2/issues/118), asignada a Luis. [PR #119](https://github.com/miguelr296/ERP-2026-2/pull/119) publicado en el principal desde `luis/logistica`, commit inicial `db40d44`, con `Closes #118` y revisión solicitada a Miguel. Revisión e integración pendientes; no se marca Done ni se fusiona automáticamente. Se conserva COM-009 sin modificar y fuera del commit.
- Permisos comprobados antes de publicar: LuisInfinito tiene escritura en el principal; no había PR abiertos. Fetch confirma `upstream/main` en `d4f952f`, sin cambios de contenido respecto a nuestra base. No se utiliza el fork.
- Luis confirmó que comprobó personalmente las pantallas de Luis/Asesor, Compras, Despachos y Jefatura. No se convierte esa confirmación general en la ejecución personal de cada caso automatizado o del guion completo.

Tiempo real de Logística confirmado por Luis: **1 hora (60 minutos) en total**. Es independiente de la hora registrada para Comercial; no se añaden horas por registrar el cierre.
