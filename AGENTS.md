# AGENTS.md

## Comandos

- Instala dependencias con `npm install` (el proyecto declara `npm@11.11.0`).
- Ejecuta la app con `npm start` y abre `http://localhost:4200/`.
- Verifica producción con `npm run build`; el build usa Angular 21 y presupuestos de 500 kB iniciales, 7 kB por estilo para warning y 8 kB para error.
- Ejecuta pruebas con `npm test`; `angular.json` usa el builder `@angular/build:unit-test`, Vitest, `vitest.config.ts` y entorno `jsdom`.
- No hay scripts separados de lint, typecheck o format en `package.json`; el build aplica la compilación estricta de TypeScript y templates.

## Arquitectura que sí existe

- Es una sola aplicación Angular standalone: arranca en `src/main.ts`, configura providers en `src/app/app.config.ts` y enruta desde `src/app/app.routes.ts`.
- `src/app/core/data/` contiene los roles, permisos y las entradas trazables del menú; `src/app/shared/layout/` contiene el shell, sidebar y topbar.
- Las funcionalidades de negocio están organizadas por dominio bajo `src/app/features/`; sus servicios y modelos compartidos están en `src/app/core/`.
- El proyecto es frontend-only: no hay backend, API ni interceptor HTTP; no conviertas los mocks en integraciones reales sin una solicitud explícita.
- Clientes, oportunidades y costeo persisten datos mock en `localStorage`; disponibilidad usa catálogos estáticos. Las claves principales son `famihogar.erp.customers`, `famihogar.erp.opportunities`, `famihogar.erp.costing-requests`, además de sesión y sede.

## Rutas y navegación

- Las rutas protegidas están dentro de `AppShellComponent`: `authGuard` valida sesión y `subsystemGuard` valida permisos CRM/ING; conserva ambos guards al agregar rutas funcionales.
- Las entradas del menú que compartan componente deben conservar un contexto explícito mediante rutas, parámetros o estado; no reemplaces una navegación contextual por una URL genérica.
- Las rutas funcionales deben mantener autorización por sesión y subsistema; no confíes únicamente en ocultar enlaces del menú para aplicar permisos.

## Convenciones y límites

- Mantén componentes standalone, Signals, formularios reactivos y SCSS; respeta `strict`, `strictTemplates` y `noImplicitReturns` de `tsconfig.json`.
- Usa `app-icon` con SVG inline para iconos; no reintroduzcas PrimeNG, PrimeIcons, PrimeUI ni `@primeuix`.
- Conserva Angular Material/CDK como dependencias disponibles, pero sigue el patrón visual existente antes de introducir componentes nuevos.
- Antes de iniciar trabajo funcional, consulta `README.md`, `Sprints.txt` y la matriz de trazabilidad oficial para confirmar el alcance vigente; respeta las funcionalidades ya cerradas y no implementes trabajo fuera del sprint autorizado.
- Consulta `docs/` de forma selectiva: `PROJECT_CONTEXT.md` para alcance o arquitectura, `KNOWN_LIMITATIONS.md` para restricciones, `SPRINT2_TRACEABILITY.md` para estado de RF y solo las decisiones relacionadas dentro de `docs/decisions/`; no cargues toda la documentación por defecto.
- Mantén las simulaciones claramente identificadas: si un servicio solo persiste datos locales o nombres de archivos, no lo describas como almacenamiento, subida o integración real.

## Mantenimiento de documentación

- Después de cambios funcionales o arquitectónicos relevantes, revisa si debe actualizarse la documentación.
- Cambios en reglas permanentes, comandos o convenciones → `AGENTS.md`.
- Cambios en alcance, estado, rutas o arquitectura → `docs/PROJECT_CONTEXT.md`.
- Limitaciones resueltas o nuevas restricciones → `docs/KNOWN_LIMITATIONS.md`.
- Decisiones arquitectónicas nuevas o reemplazadas → nuevo archivo en `docs/decisions/`.
- No actualices estos archivos por cambios menores que no alteren su contenido y no reescribas decisiones históricas; registra una nueva decisión cuando una anterior cambie.
