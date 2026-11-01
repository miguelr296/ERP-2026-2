# Contexto vivo del proyecto

## Estado actual
- Sprint 1 = TO-BE Comercial completo, 3 semanas (29/10 – 18/11). Demos: 05/11 (fase A), 12/11 (fase B), 19/11 (fase C).
- Solución .NET y pantalla de acceso en `main` (S1-04, S1-00). S1-05 (entidades, `ErpDbContext`, migración y semilla de Comercial) en revisión con PR.
- Comercial fase A en curso: faltan S1-08 y S1-09 (historial y cadena, Miguel), S1-10 (Cliente, Luis), S1-11 y S1-13 (precios y cotización, Pablo).
- Punto de control de la fase A: domingo 01/11 (esqueleto, S1-08 y Cliente en `main`).
- Pendiente de confirmar: fecha y fuente de verdad del área Logística.

## Comandos
- Solución: `dotnet build` y `dotnet test` desde la raíz; `Erp.sln` se abre en Visual Studio 2026.
- Api: `dotnet run --project src/Erp.Api` → http://localhost:5271 (`/` = front de `wwwroot`; `/api/salud` = comprobación).
- Front sin servidor: abrir `src/Erp.Api/wwwroot/index.html` en Chrome o Edge.
- Tarjetas: `scripts/crear-tarjetas.sh` (ensayo) y `--ejecutar` (ver `docs/plan/kanban.md` 6.3).
- Pruebas: xUnit v3 (`xunit.v3` 4.0.0) con Microsoft.Testing.Platform; requiere `global.json` con `"test": { "runner": "Microsoft.Testing.Platform" }` y `<OutputType>Exe</OutputType>` en `tests/Erp.Tests`. `dotnet test` corre las 15 pruebas.
- Conexión local: `FamihogarErp` en `src/Erp.Api/appsettings.Development.json` (ignorado por Git); cada integrante usa su instancia.

## Convenciones de código
- Código sencillo y fácil de explicar: nombres claros, métodos cortos, sin patrones avanzados (D09).
- Español sin tildes para el dominio (`Cliente`, `Cotizacion`); sufijos .NET en inglés (D16).
- Pruebas: `Clase_Condicion_ResultadoEsperado`.
- Valores de negocio (IGV, vigencia, % de anticipo, límites, plazos) en configuración, no en el código.
- Todo cambio de estado pasa por el historial de `Compartido`; todo documento derivado registra su origen (D25).
- Front: HTML, CSS y JS legibles, sin minificar. Pantallas en `wwwroot/<modulo>/<submodulo>/`; todas usan la ficha común.
- Cada término técnico nuevo y cada evento técnico (error, migración, dependencia) se explica antes de usarlo o resolverlo, con un ejemplo concreto del proyecto (D09).

## Trampas y lecciones
- **No crear ni modificar archivos sin preguntar** (regla general, D09).
- Seguir el orden del tablero; trabajo sin tarjeta no se hace (29/10: la pantalla de acceso se adelantó sin tarjeta).
- Ramas dentro del repo, no forks (D23).
- Comercial no contiene lógica de otra área: las interfaces son versiones mínimas en su módulo (D06). Submódulos del mismo módulo se usan directo; entre módulos, solo contratos.
- Un documento sin historial, cadena o ficha no está terminado (D25). Ningún documento se borra físicamente: se anula con estado y motivo.
- El asistente no ejecuta Git ni migraciones: guía al equipo.
- Solo Miguel crea migraciones y toca el `DbContext`.
- Dinero siempre con `decimal`, nunca `double` ni `float`.
- Si algo cambia una decisión ya tomada, se modifica esa decisión (D24), no se crea otra.
- EF Core crea las claves foráneas en cascada por defecto; con varias rutas hacia la misma tabla, SQL Server rechaza la migración ("multiple cascade paths"). Usar `DeleteBehavior.NoAction` y borrado lógico.
- xUnit se instala solo en `tests/Erp.Tests`; agregarlo a los proyectos de `src/` hace que el build pida `OutputType Exe` en todos y falle.

## Pendientes que no son del sprint actual
- Alcance, fuente y fecha de Logística y de las áreas siguientes; partirán de las versiones mínimas del sprint 1.
