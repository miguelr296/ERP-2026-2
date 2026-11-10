# Acuerdos de trabajo

[Índice](../README.md)

Base normativa del inicio, sin historial de implementación ni decisiones heredadas de avances.

1. Un área por sprint de siete días, de jueves a miércoles; calendario en sprints.
2. Cada semana incluye preparación, desarrollo, pruebas, revisión, documentación y demo.
3. Una tarjeta en curso por persona; trabajo trazable en el tablero y revisión por otro integrante.
4. Código sencillo en español, explicado por su autor.
5. Monolito modular y capas según arquitectura; integración por contratos.
6. Historial, cadena y ficha para los documentos; datos ficticios y dependencias externas simuladas.
7. /cierre prepara la versión final antes de commit y PR; las correcciones requieren otro cierre.
8. Núcleo verificable y opcionales explícitos; declarar incumplimientos sin ocultarlos.
9. El asistente actúa dentro del alcance autorizado y propone ampliaciones antes de escribir.

## Registro

Para registrar una decisión se usa DEC-001 y siguientes, con fecha, tarjeta, tema, motivo y estado.
Si cambia un acuerdo o una decisión existente, actualizar ese tema con el cambio fechado y su motivo; no duplicar decisiones contradictorias.

### DEC-001 · Estados de OV y parámetros ficticios de la demo
Fecha: 2026-11-05 · Tarjeta: COM-001 · Estado: Aceptada por Miguel, Luis y Pablo.

Motivo: fijar los valores que la fuente deja abiertos y resolver la discrepancia de estados antes de implementar. El análisis advierte que el PDF exige límite, vigencia y auditoría, pero no porcentajes ni plazos concretos (análisis del PDF, línea 45).

| Tema | Decisión | Origen |
|---|---|---|
| Estados de OV | `Registrada → Liberada` | Tabla p. 5 y diagrama p. 35; la p. 34 dice "Confirmada" y queda documentada como discrepancia |
| IGV | 18 %, configurable | Supuesto de demo: la fuente no fija impuestos |
| Moneda y redondeo | PEN, 2 decimales, tipo `decimal` | Regla permanente del equipo |
| Vigencia de cotización | 7 días calendario desde la emisión | Supuesto de demo; p. 25 exige vigencia |
| Descuento | Asesor 0 % sin aprobación; Jefatura hasta 10 %; sobre 10 % se rechaza | Supuesto de demo; p. 23 exige motivo, límite y aprobación auditada |
| Anticipo | 30 % del total, con comprobante obligatorio | Supuesto de demo; p. 29 exige comprobante y confirmación de Tesorería |
| Correlativo | `COT-2026-00001` y `OV-2026-00001` | p. 25 exige correlativo |
| Reserva simulada | Vigencia 48 h | Supuesto de demo; p. 18 exige vencimiento |
| Roles del guion | Asesor, Jefatura y Tesorería, sin autenticación real | Alcance de Comercial |
| Datos ficticios | Se redactan en COM-004 conforme a estos supuestos | Plan del sprint |

Los valores marcados como supuesto son configurables y no normas del negocio. Cambiarlos exige una decisión nueva, fechada y con motivo; no una edición silenciosa.

### DEC-002 · SDK y formato de la solución
Fecha: 2026-11-05 · Tarjeta: COM-002 · Estado: Aceptada por Miguel, Luis y Pablo.

Motivo: la guía de preparación exige fijar un SDK LTS y comprobar build y pruebas reales antes de construir módulos. Se elige .NET 10 porque .NET 8 sale de soporte LTS el 2026-11-10, dentro de este mismo sprint.

| Tema | Decisión | Origen |
|---|---|---|
| SDK | .NET 10, versión 10.0.401 fijada en `global.json` | Comprobado con `dotnet --list-sdks` en la máquina de Miguel |
| Formato de solución | `Erp.slnx`, el que genera el SDK 10 por defecto | `dotnet new sln` |
| Proyectos del esqueleto | Solo `src/Erp.Api` y `tests/Erp.Api.Tests` | Arquitectura: no generar módulos vacíos innecesarios |
| Módulos y capas | Se crean cuando una tarjeta los necesite, no antes | Arquitectura |

El cambio de SDK o de formato de solución exige una decisión nueva y repetir build y pruebas.

### DEC-003 · Clean Architecture por módulo
Fecha: 2026-11-07 · Tarjeta: COM-005 · Estado: Aceptada por Miguel, Luis y Pablo.

Motivo: el equipo pidió seguir Clean Architecture y mantener una sola dirección de dependencias, para que las reglas no queden mezcladas con EF Core ni con HTTP. Se aplica ahora, con el módulo todavía pequeño, porque más adelante el cambio cuesta más.

| Tema | Decisión | Origen |
|---|---|---|
| Capas | `Dominio`, `Aplicacion` e `Infraestructura` por módulo; `Api` compone y adapta HTTP | Clean Architecture |
| Dirección de dependencias | `Aplicacion` → `Dominio`; `Infraestructura` → `Aplicacion`; `Api` → `Aplicacion` + `Infraestructura`; el dominio no depende de nadie | Clean Architecture |
| Proyectos | Uno por capa y módulo: `src/Comercial/Erp.Comercial.Dominio`, `Erp.Comercial.Aplicacion`, `Erp.Comercial.Infraestructura` | Estructura de la solución |
| Persistencia | Puertos `IComercialRepositorio` e `IUnidadDeTrabajo` en `Aplicacion`; EF Core los implementa en `Infraestructura` | Puertos y adaptadores |
| Reglas | Validaciones del dato en el dominio; reglas que necesitan repositorio o usuario en los casos de uso | Prueba de COM-005 |
| Migraciones | Se conserva el identificador `20261107220349_Inicial` ya aplicado; cambiar de proyecto no exige recrear la base | `dotnet ef migrations list` |
| Alternativa descartada | Un solo proyecto con carpetas por capa: habría dejado las fronteras solo por convención | Revisión de COM-005 |

`docs/arquitectura.md` describe la estructura vigente; `AGENTS.md` se actualizó con la misma fecha. Cambiar de capas o de dirección de dependencias exige una decisión nueva.

### DEC-004 · Modelo mínimo de relaciones Comerciales
Fecha: 2026-11-07 · Tarjeta: COM-005 · Estado: Aceptada por Miguel, Luis y Pablo.

Motivo: fijar las relaciones mínimas de cliente, oportunidad e historial antes de continuar el recorrido Comercial y verificar persistencia sin duplicar el modelo en cada pantalla.

| Relación | Decisión | Evidencia |
|---|---|---|
| Cliente–Oportunidad | Un cliente puede tener muchas oportunidades; cada oportunidad pertenece a un cliente existente. La base mantiene `ClienteId` como clave foránea. | COM-R01; `La_oportunidad_de_un_cliente_existente_se_guarda_con_historial` |
| Documento–Historial | Un evento identifica su documento mediante `DocumentoTipo` + `DocumentoId`. Es una relación lógica sin clave foránea polimórfica. | COM-T01/COM-T03; prueba de historial y consulta real tras reiniciar la API |
| Historial | Se conserva cada evento; no se permite modificarlo ni borrarlo. | COM-T03; `El_historial_no_se_puede_modificar_ni_borrar` |

El diagrama vigente y las entidades se implementan en `src/Comercial/Erp.Comercial.Dominio` y `src/Comercial/Erp.Comercial.Infraestructura`. Cambiar estas relaciones exige una decisión nueva y una migración cuando afecte al esquema.

### DEC-005 · Claves simples e integridad de cotización
Fecha: 2026-11-09 · Tarjeta: COM-012 y criterio transversal · Estado: Aceptada por Miguel.

Motivo: evitar la complejidad de propagar claves compuestas en el ERP y conservar integridad referencial mediante identificadores estables y relaciones simples. La decisión se tomó al revisar el modelo de COM-012.

| Tema | Decisión | Origen y prueba |
|---|---|---|
| Identidad | Claves primarias, alternas y foráneas de una columna; preferir identificadores subrogados. No usar claves compuestas. | Acuerdo explícito de Miguel durante la revisión del modelo de COM-012, 2026-11-09; prueba `El_modelo_usa_claves_simples_y_no_duplica_cliente_en_cotizacion` ejecutada dentro de una suite de 80 pruebas superadas |
| Índices | Se permiten índices compuestos, incluidos los únicos, si el modelo necesita búsqueda o unicidad por varias columnas. No se consideran claves compuestas en este acuerdo. | Índices existentes de productos de oportunidad e historial; prueba del modelo citada arriba |
| Cotización–cliente | `Cotizacion` conserva solo `OportunidadId`; el cliente se obtiene a través de `Oportunidad.ClienteId`, que referencia `Cliente.Id`. No duplicar `ClienteId` en cotización. | COM-012; prueba de modelo y `Emite_consulta_y_reintenta_sin_duplicar_ni_recalcular_el_documento`, ambas superadas en la suite de 80 pruebas |

La relación documental se mantiene con FK simple a la oportunidad y la relación existente de esta con el cliente. Los cambios de entidad se incorporan a la base mediante una migración creada por Miguel.
