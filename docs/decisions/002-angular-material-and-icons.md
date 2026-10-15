# Decisión 002: Angular Material/CDK e iconografía

- Estado: vigente
- Fecha: 2026-10-06

## Decisión

El proyecto usa Angular Material/CDK cuando aporta valor y `app-icon` con SVG inline para la iconografía. No usa PrimeNG, PrimeIcons, PrimeUI ni `@primeuix`.

## Motivo

Se busca mantener una base Angular alineada con el prototipo actual y evitar dependencias de iconos o componentes que ya fueron retiradas.

## Consecuencia

Los nuevos componentes deben seguir el patrón visual existente y reutilizar `app-icon` antes de introducir otra librería.
