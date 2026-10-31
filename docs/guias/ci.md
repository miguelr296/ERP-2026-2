# Guía — CI con GitHub Actions

[← Índice](../../README.md)

## Qué es

**CI** (integración continua) es un robot de GitHub que, en cada PR, corre `dotnet build` y `dotnet test` y marca el PR en **rojo** si algo falla o en **verde** si todo pasa. Convierte la regla "`main` siempre funciona" en algo automático: nadie depende de acordarse de correr las pruebas.

Es la tarjeta S1-44 de la fase B del sprint 1 y desde entonces es obligatoria (D11). Son unas 15 líneas y se aprende en una sesión.

## Paso 1 — Crear el archivo

Crear `.github/workflows/ci.yml` (solo cuando ya exista la solución .NET y `global.json`; antes fallaría):

```yaml
name: ci
on:
  pull_request:
    branches: [main]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          global-json-file: global.json
      - run: dotnet build --nologo
      - run: dotnet test --nologo --no-build
```

Si GitHub avisa que `@v4` está desactualizado, se sube al número vigente.

## Paso 2 — Comprobar que funciona

1. Abrir un PR con una prueba que falle a propósito: debe salir en rojo.
2. Corregirla: debe salir en verde.

## Paso 3 — Hacerlo obligatorio

*Settings → Branches → Add rule* sobre `main`: exigir PR y que pase el chequeo `build-test`. Así no se puede fusionar en rojo.

## Límites

Las pruebas de la semana 1 no usan base de datos, así que el CI no necesita SQL Server. Cuando lleguen las pruebas de integración (semana 3) habrá que agregarlo.
