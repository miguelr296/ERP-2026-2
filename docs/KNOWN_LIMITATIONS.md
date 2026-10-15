# Limitaciones conocidas

Última revisión: 2026-10-09

- **Abierta:** No existe backend, API real ni interceptor HTTP activo; los servicios usan datos estáticos, Signals y `localStorage`.
- **Abierta:** La autenticación, permisos y reglas de negocio son demostrativos y no constituyen seguridad de producción.
- **Abierta:** Los adjuntos MTO solo conservan nombres de archivos; no se sube ni almacena su contenido.
- **Abierta:** Las reservas, liberaciones y traslados MTS son simulados en `localStorage`; no existe integración con inventario real ni flujo de aprobación.
- **Abierta:** La hoja de costo electrónica, producción, logística, facturación y otros flujos posteriores todavía no están implementados.
- **Abierta:** Los datos guardados en `localStorage` pueden afectar las pruebas manuales; limpiar las claves del proyecto restaura los datos demo.
- **Abierta:** La cobertura automatizada actual cubre reglas principales de Sprint 1 y Sprint 2, pero todavía no cubre todos los componentes, formularios, relaciones y criterios de aceptación.
