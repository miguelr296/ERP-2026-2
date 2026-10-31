# ERP FAMIHOGAR — prototipo por áreas

Proyecto del curso de ERP. Equipo: **Miguel**, **Luis** y **Pablo**. Stack: C# (.NET) + SQL Server; front en HTML + CSS + JavaScript.

ERP web para **FAMIHOGAR SAC** (manufactura y retail de muebles, Perú), construido como **monolito modular** con cuatro módulos divididos en submódulos: Comercial (CRM, Ventas, Postventa), Finanzas, Logística y Planta. Se construye por áreas y se presenta cada jueves en pantalla y por la API. El **sprint 1 cubre todo el [TO-BE Comercial](docs/fuentes/to-be-comercial.md)** en 3 semanas. La prioridad del sistema es la **trazabilidad**: cada documento guarda su historial, su cadena documental y tiene una ficha imprimible.

## Cómo leer este repositorio

La documentación se lee como un informe, en orden:

### Parte I — Plan
1. [Enfoque](docs/plan/enfoque.md)
2. [Alcance: cómo se define](docs/plan/alcance.md)
   - [Alcance del área Comercial](docs/alcance/comercial.md)
   - [Alcance del área Logística](docs/alcance/logistica.md) *(por definir)*
3. [Arquitectura](docs/arquitectura.md)
4. [Flujo de trabajo](docs/plan/flujo-de-trabajo.md)
5. [Sprints](docs/plan/sprints.md) · [Sprint 1: tarjetas y plan por día](docs/plan/sprint-01.md)
6. [Tablero Kanban](docs/plan/kanban.md)

### Parte II — Desarrollo (un capítulo por semana)
- *(se agrega un capítulo cada semana a partir de la [plantilla](docs/capitulos/_plantilla.md))*

### Anexos
- [Catálogo de reglas de negocio](docs/reglas.md)
- [Registro de decisiones](docs/decisiones.md)
- [Glosario](docs/glosario.md)
- [Contratos de integración entre módulos](docs/contratos/_plantilla.md) · [Comercial](docs/contratos/comercial.md) · [Finanzas](docs/contratos/finanzas.md) · [Logística](docs/contratos/logistica.md) · [Planta](docs/contratos/planta.md) · [Compartido](docs/contratos/compartido.md)
- [Fuente: resumen del TO-BE comercial](docs/fuentes/to-be-comercial.md)
- [Guía: pantalla de acceso y aplicaciones](docs/guias/acceso-aplicaciones.md)
- [Guía: CI con GitHub Actions](docs/guias/ci.md)
- [Bitácora de sesiones](BITACORA.md)
- [Contexto vivo del proyecto](docs/contexto.md) *(interno)*
- [Comandos del asistente](docs/comandos/iniciar.md) (`/iniciar`, `/cierre`, `/retro`, `/planning`)

## Cronología del código

Cada semana cerrada se marca con un tag (`semana-01`, `semana-02`, …). Cada capítulo enlaza al tag de su semana.

## Estructura

```
ERP-2026-2/
├── README.md · AGENTS.md · BITACORA.md
├── .opencode/command/      # comandos de OpenCode (apuntan a docs/comandos/)
├── .github/                # plantillas de PR y de tarjeta
├── docs/
│   ├── plan/               # enfoque, alcance (método), flujo, sprints, kanban, sprint-NN
│   ├── alcance/            # un alcance por área (comercial, logistica, …)
│   ├── capitulos/          # un capítulo por semana
│   ├── contratos/          # qué expone y consume cada módulo
│   ├── fuentes/            # fuente de verdad de cada área (TO-BE comercial: resumen + PDF)
│   ├── guias/              # guías cortas (pantalla de acceso, CI)
│   ├── comandos/           # /iniciar /cierre /retro /planning (para cualquier asistente)
│   ├── arquitectura.md · reglas.md · decisiones.md · glosario.md · contexto.md
├── scripts/                # carga de tarjetas al tablero desde docs/plan/sprint-NN.md
├── src/                    # solución .NET (módulos); front en src/Erp.Api/wwwroot
└── tests/                  # pruebas xUnit
```

## Usar los comandos con otro asistente

Los comandos viven en `docs/comandos/` como Markdown, así que sirven con cualquier asistente. En OpenCode se invocan como `/iniciar`; en Codex o cualquier otro, se escribe: *"Sigue `docs/comandos/iniciar.md`"*. Ambos leen `AGENTS.md` solos.

## Ejecución

La interfaz se abre desde la Api: `dotnet run --project src/Erp.Api` y entra a `http://localhost:5271/`; también se puede abrir `src/Erp.Api/wwwroot/index.html` directamente en Chrome o Edge, sin servidor. La comprobación rápida es `GET /api/salud`. Build y pruebas, desde la raíz: `dotnet build` y `dotnet test`. Consulta la [guía de la pantalla de acceso](docs/guias/acceso-aplicaciones.md).

## Integrantes

*(cada integrante agrega aquí su nombre en la tarjeta S1-03, practicando rama, commit y PR)*
