# Preparación de tarjeta y PR — nueva interfaz Comercial

## Tarjeta autorizada

[Tarjeta #116](https://github.com/miguelr296/ERP-2026-2/issues/116), creada con autorización de Luis y asignada a `LuisInfinito`. Su estado es abierta; no se declara Done.

**Título:** Completar las pantallas y reglas del módulo Comercial para la mueblería.

**Responsable propuesto:** Luis. **Tiempo real declarado:** 1 hora; no se agregan horas a esta declaración por la continuación del trabajo.

**Fuente:** Sesión 06 — Sistema de Gestión Comercial, contexto retail con sedes e indicaciones de Luis. Bartolito ERP es referencia de estilo y navegación.

**Criterios verificables:**

- Acceso, roles, sedes y selector de módulos; Comercial separado de cobros, stock, comprobantes y contabilidad.
- Clientes/productos y cambios de maestros con revisión independiente; oportunidades con productos y seguimiento.
- Listas por canal/segmento y vigencias, promociones, cálculo en céntimos, copia de condiciones y descuentos 5 % / 20 % confirmados por Luis.
- Excepciones y pedidos revisados por otra persona de Jefatura, con motivo, historial y controles de crédito/disponibilidad consultados nuevamente al aprobar.
- Pedidos aprobados/bloqueados/anulados, consulta de atención parcial y documentos informados por los módulos propietarios.
- Solicitudes de devolución/anulación, cantidades controladas y seguimiento de recepción/nota/ajuste sin registrarlos en Comercial.
- Fichas imprimibles, relaciones documentales e indicadores filtrables por fecha, canal y sede.
- Pruebas de reglas y navegador reproducibles; límites de almacenamiento y contratos locales documentados.

**Evidencia local:** 46 pruebas de reglas superadas; 54 comprobaciones de navegador, sin excepciones JavaScript; PDF de cotización de una página, escritorio y móvil. Ver [alcance](../pantallas/comercial.md) y [reglas](../reglas-comerciales.md).

**Publicación:** Luis autorizó crear esta tarjeta y usar su número en el PR. Las demás tarjetas abiertas encontradas en GitHub conservan criterios de API y del plan anterior; no corresponde cerrarlas automáticamente con esta interfaz. No se usa COM-012/#90, ya fusionada/cerrada.

## PR preparado localmente

**Título:** Completar interfaz Comercial con precios, aprobaciones, pedidos y postventa.

**Destino:** `miguelr296/ERP-2026-2`, `luis/interfaz-comercial` → `main`. Revisión prevista: Miguel. Sin fusión automática ni Done.

**Problema y resultado:** el reinicio conservaba únicamente acceso y Aplicaciones. La entrega implementa el recorrido comercial frontend desde cliente/oportunidad hasta pedido, aprobación y postventa, con precios parametrizados y controles de otros módulos consultados por contratos locales. Mantiene el trabajo financiero, logístico y tributario en sus áreas.

**Tarjeta:** el cuerpo final llevará `Closes #116`.

**Explicación de Luis:** otra persona revisa la excepción para impedir que el solicitante se autorice a sí mismo. La aprobación comercial autoriza la operación; cobrar acredita ingreso de dinero y la salida de almacén registra mercadería, cada uno con sus validaciones y registros.

**Validación:** `node --test --test-isolation=none tests/interfaz/comercial.test.cjs` (46/46); `node tests/interfaz/navegador.cjs 9245` (54 comprobaciones). El navegador requiere servidor estático y Chrome headless de prueba; crea y elimina su propio contexto. Comprobados también 12 documentos, enlaces, referencias HTML, 44 identificadores sin duplicación, sintaxis JS/CJS y diff sin incidencias. Preparación local lista para publicación autorizada.

**Límites:** almacenamiento local, roles de interfaz, correlativos sin garantía de concurrencia entre equipos y respuestas de integración locales. No hay cobros, movimientos de inventario, comprobantes ni asientos emitidos por Comercial. No se declaran integraciones reales ni un ERP completo. El borrador histórico de COM-009 queda fuera de esta entrega.
