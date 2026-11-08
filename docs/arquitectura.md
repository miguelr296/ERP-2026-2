# Arquitectura objetivo

[Índice](../README.md)

Diseño que se construye por módulos, uno por sprint. Al 2026-11-07 existe la estructura completa de Comercial; los demás módulos se crean cuando su tarjeta los necesita.

Monolito modular en C# / ASP.NET Core / EF Core / SQL Server; front HTML, CSS y JavaScript servido por la API.
Áreas: Comercial (CRM, Ventas, Postventa), Logística (Inventarios, Despacho), Finanzas (Tesorería, Créditos y Cobranzas, Facturación), Planta (Ingeniería, Producción).
Compartido contiene capacidades transversales, construidas cuando las necesita un área.

## Capas por módulo

Cada módulo se organiza en tres proyectos con una sola dirección de dependencias:

```
Api (HTTP, composición)  →  Aplicacion  →  Dominio
                                 ↑
                          Infraestructura
```

- `Dominio` no depende de nadie: entidades, reglas que no necesitan persistencia, estados y tipos del negocio.
- `Aplicacion` depende de `Dominio`: casos de uso, puertos de persistencia y los modelos que la API expone.
- `Infraestructura` depende de `Aplicacion`: EF Core, contexto, configuraciones de entidad y migraciones.
- `Api` compone las capas, adapta HTTP y traduce errores; no contiene reglas de negocio ni consultas.
- Entre módulos solo se usan los contratos públicos de `Aplicacion`. No se consultan tablas ni se usan clases internas ajenas.

Ejemplo vigente: `src/Comercial/Erp.Comercial.Dominio`, `Erp.Comercial.Aplicacion` y `Erp.Comercial.Infraestructura`.

## Persistencia

Una base con esquema por módulo; propietario explícito de cada dato maestro.
Miguel define el contexto y las migraciones en la tarjeta de base.
La cadena de conexión vive en configuración local ignorada; el repositorio guarda solo un ejemplo sin secretos.

## Documentos y reglas

Historial y cadena son parte de la misma operación de negocio que registra el documento. Evitar guardar un documento sin su trazabilidad.
Historial inmutable; documentos anulables con motivo, sin borrado físico. Dinero con decimal.
Parámetros en configuración; secretos en configuración local ignorada, nunca en el repositorio.
Fijar SDK en global.json al crear la solución. Incorporar CI con comandos probados.
Los adaptadores de dependencias simuladas se sustituyen por implementaciones reales sin cambiar el contrato consumidor.
