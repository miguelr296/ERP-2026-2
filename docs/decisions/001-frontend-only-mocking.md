# Decisión 001: prototipo frontend-only

- Estado: vigente
- Fecha: 2026-10-06

## Decisión

La aplicación permanece frontend-only y simula persistencia y reglas de negocio mediante servicios, datos estáticos, Signals y `localStorage`.

## Motivo

El objetivo del proyecto es validar flujos, pantallas, roles y trazabilidad antes de construir integraciones reales.

## Consecuencia

Las funcionalidades deben declarar claramente cuando son simuladas. La incorporación de backend, APIs o interceptores reales requiere una decisión posterior.
