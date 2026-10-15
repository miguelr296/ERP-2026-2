# ERP Comercial Famihogar S.A.C.

Prototipo frontend del macroproceso **PO.02 Atención Comercial, Cotización y Evaluación de Crédito — Order-to-Cash**, desarrollado para el curso Planeamiento de Recursos Empresariales.

## Sprint 1 — Foundation

Este sprint implementa la base transversal del prototipo:

- Inicio de sesión simulado con los 18 roles de la Matriz de Trazabilidad v3.
- Permisos por rol, subsistema y operación (`C`, `R`, `A`, `P`) para construir un menú lateral dinámico y proteger acciones.
- Estructura trazable de los 49 accesos del ERP: sistema, subsistema, módulo, opción, subopción y código.
- Layout ERP responsive con sidebar, topbar, sede activa y sesión vigente.
- Guards de navegación y persistencia local de la sesión y la sede mediante `localStorage`.
- Vista de inicio con estado de avance y trazabilidad, sin afirmar cobertura funcional total.
- Navegación jerárquica explícita para las opciones aún no implementadas mediante pantallas de módulo planificado.
- Iconografía propia mediante SVG inline (`app-icon`), sin PrimeIcons ni dependencias de iconos externas.

La autenticación y el contenido son demostrativos; no existe conexión a un backend en este sprint.

## Ejecución local

```bash
npm install
npm start
```

Abrir `http://localhost:4200/`. Para compilar:

```bash
npm run build
```

## Organización principal

```text
src/app/
├── core/
│   ├── data/       # Roles, permisos y menú trazable
│   ├── guards/     # Protección de rutas
│   ├── models/     # Contratos de dominio
│   └── services/   # Sesión y sede activa
├── features/
│   ├── auth/       # Login de roles
│   └── dashboard/  # Inicio del workspace
└── shared/layout/  # Shell ERP, sidebar y topbar
```

La implementación de los RF funcionales se incorporará en los sprints temáticos indicados en `Sprints.txt`.

## Sprint 2 — Punto 1: Clientes

Implementado como primera entrega del Sprint 2:

- Búsqueda por documento, nombre, razón social o correo.
- Filtros por DNI, RUC y todos los documentos.
- Ficha única con datos de identificación y contacto.
- Alta de clientes con validación de campos obligatorios, DNI de 8 dígitos y RUC de 11 dígitos.
- Control de documentos duplicados.
- Mock frontend persistido en `localStorage` mediante `CustomerService`.
- Registros de demostración para validar la consulta desde el inicio.

Este punto no incluye todavía oportunidades, stock, solicitudes MTO, precios ni cotizaciones.

### Punto 2: Oportunidades — registro y derivación

- Registro de oportunidades Retail y B2B / licitación.
- Canal de origen, sede activa, cliente asociado y productos de interés.
- Asignación a un ejecutivo responsable.
- Código único, estado inicial y bandeja filtrable por tipo.
- Persistencia simulada en `localStorage` mediante `OpportunityService`.

Los adjuntos, próximas actividades e historial se simulan localmente; no existe todavía una integración externa de seguimiento.

### Punto 3: Disponibilidad MTS

- Catálogo comercial con SKU, categoría, unidad y precio vigente.
- Consulta de inventario por sede activa u otra sede.
- Distinción entre stock físico, reservado y disponible.
- Cálculo visible: `disponible = físico - reservado`.
- Indicadores de disponibilidad, bajo stock y sin stock.
- Datos de inventario simulados en `AvailabilityService`.

Los traslados, reservas, liberaciones y reposiciones se simulan localmente con validación de cantidades; no actualizan un inventario externo.

### Punto 4: Integración simulada ING — Costeo MTO

- Creación de solicitudes digitales de costeo para proyectos especiales.
- Asociación con cliente y oportunidad, descripción y fecha compromiso obligatoria.
- Adjuntos simulados mediante nombres de archivos PDF, imagen o CAD.
- Código único, persistencia local y estado de seguimiento.
- Bandeja con estados `Recibida`, `En diseño` y `Costeada`.
- Alertas visuales para solicitudes próximas a vencer o vencidas.
- Avance simulado del estado para representar la respuesta de Oficina Técnica.

La hoja de costo electrónica y la planificación de producción permanecen fuera de este alcance.

### Cierre técnico del Sprint 1

- Validación de DNI por longitud y RUC mediante prefijo y dígito verificador.
- Búsqueda de clientes también por teléfono.
- Guards por subsistema para rutas CRM e ING.
- Bandeja `/engineering/costing` protegida para el subsistema ING.
- Navegación explícita para las 49 subopciones, incluyendo pantallas de módulos planificados.
- Permisos operativos C/R/A/P aplicados al menú, rutas y acciones principales.
- Pruebas Vitest de roles, menú, sesión, sede y guards ejecutables con `npm test`.
- Presupuesto de estilos advertido en 7 kB y límite de error conservado en 8 kB.

## Verificación de cierre del Sprint 1

Validaciones realizadas sobre la implementación:

- Login simulado con los 18 roles definidos.
- Menú lateral filtrado por permisos del rol activo.
- Guard de autenticación para las rutas protegidas.
- Persistencia de sesión y sede mediante `localStorage`.
- Logout con eliminación de la sesión y retorno al login.
- Sustitución completa de PrimeIcons por `app-icon` con SVG inline.
- `npm run build` completado correctamente.

### Advertencias de estilos

El presupuesto de advertencia para estilos de componentes se estableció en 7 kB, manteniendo el límite de error en 8 kB. Esto evita advertencias no bloqueantes en los componentes visuales actuales sin alterar el diseño responsive; cualquier componente que supere 8 kB continúa bloqueando la compilación de producción.
