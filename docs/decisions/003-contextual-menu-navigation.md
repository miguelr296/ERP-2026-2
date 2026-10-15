# Decisión 003: navegación contextual

- Estado: vigente
- Fecha: 2026-10-06

## Decisión

Cuando varias opciones del menú reutilizan un componente, la navegación conserva la intención de la opción mediante rutas, query params o estado inicial.

## Motivo

Una sola pantalla por dominio evita duplicación, pero una URL genérica puede hacer que opciones distintas parezcan duplicadas o abran la vista equivocada.

## Consecuencia

Los cambios en menú, rutas y componentes deben conservar la correspondencia entre cada subopción trazable y su contexto inicial.
