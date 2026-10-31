# Contexto vivo del proyecto

## Estado actual
- Sprint 1 = TO-BE Comercial completo, 3 semanas (29/10 – 18/11). Demos: 05/11 (fase A), 12/11 (fase B), 19/11 (fase C).
- Solución .NET creada (S1-04): 11 proyectos de submódulo + `Erp.Api` + `Erp.Tests`, build y pruebas en verde; el front de Luis se sirve desde la Api en `/`.
- Tablero, campos, hitos y tarjetas cargados (S1-01, Done). S1-04 en revisión.
- Siguiente: revisión de S1-00 con Luis explicando su código; S1-05 (Miguel) y S1-02, S1-03, S1-06 (Luis y Pablo).
- Pendiente de confirmar: fecha y fuente de verdad del área Logística.

## Comandos
- Solución: `dotnet build` y `dotnet test` desde la raíz; `Erp.sln` se abre en Visual Studio 2026.
- Api: `dotnet run --project src/Erp.Api` → http://localhost:5271 (`/` = front de `wwwroot`; `/api/salud` = comprobación).
- Front sin servidor: abrir `src/Erp.Api/wwwroot/index.html` en Chrome o Edge.
- Tarjetas: `scripts/crear-tarjetas.sh` (ensayo) y `--ejecutar` (ver `docs/plan/kanban.md` 6.3).
- (se agrega cuando exista: cadena de conexión local)

## Convenciones de código
- Código sencillo y fácil de explicar: nombres claros, métodos cortos, sin patrones avanzados (D09).
- Español sin tildes para el dominio (`Cliente`, `Cotizacion`); sufijos .NET en inglés (D16).
- Pruebas: `Clase_Condicion_ResultadoEsperado`.
- Valores de negocio (IGV, vigencia, % de anticipo, límites, plazos) en configuración, no en el código.
- Todo cambio de estado pasa por el historial de `Compartido`; todo documento derivado registra su origen (D25).
- Front: HTML, CSS y JS legibles, sin minificar. Pantallas en `wwwroot/<modulo>/<submodulo>/`; todas usan la ficha común.
- Cada término técnico nuevo se explica antes de usarlo: qué es, para qué sirve y por qué se introduce (D09).

## Trampas y lecciones
- **No crear ni modificar archivos sin preguntar** (regla general, D09).
- Seguir el orden del tablero; trabajo sin tarjeta no se hace (29/10: la pantalla de acceso se adelantó sin tarjeta).
- Ramas dentro del repo, no forks (D23).
- Comercial no contiene lógica de otra área: las interfaces son versiones mínimas en su módulo (D06). Submódulos del mismo módulo se usan directo; entre módulos, solo contratos.
- Un documento sin historial, cadena o ficha no está terminado (D25).
- El asistente no ejecuta Git ni migraciones: guía al equipo.
- Solo Miguel crea migraciones y toca el `DbContext`.
- Dinero siempre con `decimal`, nunca `double` ni `float`.
- Si algo cambia una decisión ya tomada, se modifica esa decisión (D24), no se crea otra.

## Pendientes que no son del sprint actual
- Alcance, fuente y fecha de Logística y de las áreas siguientes; partirán de las versiones mínimas del sprint 1.
