# Contexto vivo del proyecto

## Estado actual
- Sprint 1 = TO-BE Comercial completo, 3 semanas (29/10 – 18/11). Demos: 05/11 (fase A), 12/11 (fase B), 19/11 (fase C).
- Existe en `src/`: solo el front inicial de Luis en `src/Erp.Api/wwwroot` (S1-00). Sin solución .NET todavía.
- Repositorio en GitHub creado. Tablero, campos, hitos y tarjetas: pendientes (S1-01, Miguel).
- Siguiente: S1-01 y S1-04 (Miguel, vie 30/10), S1-02 (Luis y Pablo, vie 30/10); revisión de S1-00 con Luis explicando su código.
- Pendiente de confirmar: fecha y fuente de verdad del área Logística.

## Comandos
- Front: abrir `src/Erp.Api/wwwroot/index.html` en Chrome o Edge (sin servidor, hasta que exista la Api).
- Tarjetas: `scripts/crear-tarjetas.sh` (ensayo) y `--ejecutar` (ver `docs/plan/kanban.md` 6.3).
- (se agregan cuando existan: `dotnet build`, `dotnet test`, cadena de conexión local, cómo levantar la Api)

## Convenciones de código
- Código sencillo y fácil de explicar: nombres claros, métodos cortos, sin patrones avanzados (D09).
- Español sin tildes para el dominio (`Cliente`, `Cotizacion`); sufijos .NET en inglés (D16).
- Pruebas: `Clase_Condicion_ResultadoEsperado`.
- Valores de negocio (IGV, vigencia, % de anticipo, límites, plazos) en configuración, no en el código.
- Todo cambio de estado pasa por el historial de `Compartido`; todo documento derivado registra su origen (D25).
- Front: HTML, CSS y JS legibles, sin minificar. Pantallas en `wwwroot/<modulo>/<submodulo>/`; todas usan la ficha común.

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
