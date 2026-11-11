# Reglas de Logística y evidencia

[Índice](../README.md) · [Fuente](fuentes/sesion-10-gestion-logistica.pdf) · [Pantallas](pantallas/logistica.md)

Las páginas son las físicas del PDF. Los controles concretos de roles, revisión independiente, documentos únicos y operaciones indivisibles son decisiones de implementación para el recorrido elegido; no se atribuyen al PDF cifras o algoritmos que no fija.

Pruebas: [reglas](../tests/interfaz/logistica.test.cjs) y [navegador](../tests/interfaz/logistica-navegador.cjs). Configuración inicial en `datos-logistica.js`; parámetros revisables por Jefatura desde Planificación.

| Regla | Fuente / decisión | Evidencia ejecutada |
|---|---|---|
| LOG-01 · Necesidad con productos aprobados, cantidad positiva, sede y revisión independiente | pp. 7–8, 28, 39; separación solicitada por Luis | Asesor solicita; otra sede, repetición, cero, fecha inválida, rol ajeno y revisión propia se rechazan |
| LOG-02 · Proveedor con RUC único; alta/cambio revisado antes de publicar | pp. 16–18, 29, 39; control de maestros | Alta/revisión, RUC duplicado, propuesta sin sustituir versión aprobada; OC conserva proveedor copiado |
| LOG-03 · RFQ desde necesidad aprobada; ofertas de proveedores invitados, comparación y adjudicación con motivo | pp. 8, 18, 29–31 | Dos ofertas en pantalla; duplicados y estados inválidos se bloquean; adjudicación y copia de precios |
| LOG-04 · OC desde oferta adjudicada o acuerdo vigente; aprobación antes de emisión | pp. 8, 17, 30–32 | OC idempotente por necesidad, revisión propia rechazada, precio copiado, tope acumulado de acuerdo, emisión/confirmación |
| LOG-05 · Recepción parcial con documento/lote, sin exceder OC, inicialmente en cuarentena | pp. 9, 19, 21, 33 | Disponible sin aumento hasta inspeccionar; exceso/documento repetido rechazados; saldo físico y parcial comprobados |
| LOG-06 · Inspección por producto libera conformes y retiene observadas; resto pendiente | pp. 9, 17, 21, 33 | Parcial 8 conformes/1 observado/1 pendiente, nueva inspección; exceso/cero/error sin publicar, devolución solo de observadas y reposición sin duplicar conformes |
| LOG-07 · Cotejar precio OC, recepción conforme no consumida por otras facturas y base informada | pp. 26–27, 34–35 | Sin recepción/precio/base/cantidad discrepantes quedan Observada; duplicado rechazado; revalidación con historial; sin pago |
| LOG-08 · Reserva solo pedido aprobado y saldo disponible; picking no duplica reserva | pp. 10, 19–20 | Reserva reduce libre, excluye reserva propia al revalidar pedido; sin stock/doble picking bloqueados; liberación tras anular preparación |
| LOG-09 · Embalar antes de salida; salida consume reserva/físico una vez; Transporte confirma entrega | pp. 10, 20 | Transiciones, consulta fresca de pedido, despacho idempotente, roles separados, receptor/constancia y no entrega anticipada |
| LOG-10 · Lo no entregado no vuelve a stock hasta retorno físico | pp. 10, 20–21 | Entrega parcial/0, retorno pendiente, recepción única y posibilidad de reexpedir unidades retornadas |
| LOG-11 · Devolución de cliente solo tras autorización comercial; recepción no equivale a nota/pago | pp. 10, 21 y límite entre áreas | Cantidad autorizada acumulada, documento repetido/exceso rechazados; referencia solo completa; cuarentena y seguimiento Comercial |
| LOG-12 · Traslado con salida, tránsito y recepción independiente en destino | pp. 19–21, 36–37 | No invade reservas; parcial/duplicado/sede incorrecta; origen baja antes de destino y lotes se conservan |
| LOG-13 · Conteo por calidad no cambia stock hasta revisión; protege reservas y documentos de calidad | pp. 19–21; control de inventario | Conteos Disponible/Cuarentena/Dañado y registro En reparación; revisión propia, saldo y movimientos posteriores, diferencias protegidas, capacidad/error tardío con persistencia intacta |
| LOG-14 · Reposición usa disponible, demanda pendiente y compras en camino sin duplicar compromisos | pp. 5, 7, 16, 28; fórmula simple de esta entrega | Previsión 20 vs pedido 3 no suma 23; reserva/salida no se descuenta dos veces; compras reducen sugerencia; parámetros por rol |
| LOG-15 · Indicadores desde registros; acciones con responsable, evidencia y revisión de cierre | pp. 11–12, 18, 21 | Sin datos no inventa tasas; evaluación con 3 recepciones; acción con historia, cierre independiente y móvil |
| LOG-16 · Documentos relacionados e impresión sin controles | pp. 8–10 y cadena documental del equipo | Origen/derivados, sede/cliente, constancia, recarga; PDF de despacho A4 de una página |
| LOG-17 · Fallo no publica movimientos parciales ni borra almacenamiento inválido | Decisión de persistencia local | Cuota de almacenamiento, esquema/JSON incompletos, capacidad y error después de primera mutación; copia/una escritura |
| LOG-18 · Deterioro retiene unidades hasta revisión; no se venden ni mueven las retenidas | pp. 9, 19–21; control de disponibilidad del recorrido | Incidencia pendiente reduce disponibilidad del contrato; reserva de sanas y aprobación de daño conviven, sin sobreventa |
| LOG-19 · Reparación con aprobación, evidencia y reinspección por otra persona; baja revisada sin borrar historia | p. 9; adaptación de reacondicionamiento/descarte a muebles | Recuperación/fallo, autoaprobación/reinspección rechazada, cantidad en taller, baja única, capacidad insuficiente con origen intacto, cotejo tras recuperar compra |
| LOG-20 · Reubicación conserva cantidad, almacén, lote y calidad | pp. 19–21, 24–25 | Origen/destino, reservas, capacidad, sede y calidad incompatibles; ficha/referencia y posición creada en pantalla |
| LOG-21 · Maestros por sede; cambios no invalidan existencias/operaciones | pp. 15, 19–21, 24–25; controles de administración de esta entrega | Alta/edición/reactivación, código único por almacén, permisos, capacidad/estado, desactivación ocupada o con necesidad pendiente rechazada |
| LOG-22 · Esquema 2 conserva registros previos; demanda no se duplica entre almacenes | Decisión de persistencia/planificación de la ampliación | Conversión de esquema 1 con IDs, movimientos y factura conservados, sin escritura al leer; demanda 20 distribuida una vez en dos almacenes |

Valores iniciales mínimo 2/objetivo 12, capacidades y calidad ofrecida 1–5 son parámetros/escala de trabajo para revisar; el PDF no fija esos números. IGV 18 % sigue la configuración comercial inicial. No se afirma concurrencia entre equipos, integración bancaria/tributaria ni implementación completa del manual.
