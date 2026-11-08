# Preparación técnica desde cero

[Índice](../../README.md)

Esta guía define tareas de COM-002 a COM-005. COM-002 está integrada en main (PR #104); las comprobaciones de Luis constan abajo. La máquina de Pablo no está acreditada.

1. Cada integrante verifica acceso al repositorio, editor y herramientas. Practicar rama, commit y PR con una tarea real.
2. Elegir una versión LTS compatible de .NET, fijar su SDK en global.json y documentar la instalación.
3. Miguel crea la solución mínima, API y proyecto de pruebas. Respetar los archivos conservados de wwwroot.
4. Verificar build y test en orden; comprobar que se ejecutan pruebas reales. Registrar comandos y resultados.
5. Preparar una instancia SQL Server compatible con el sistema operativo de cada integrante; LocalDB no se presupone disponible en Linux.
6. Documentar la cadena de conexión mediante un ejemplo sin secretos. Cada persona guarda sus valores en configuración ignorada.
7. Miguel crea y aplica las migraciones autorizadas. Verificar lectura y escritura de datos ficticios; un endpoint de salud por sí solo no valida la base.
8. Incluir CI con los comandos y el SDK probados.

No hay servicios ni credenciales de aplicación preconfigurados por este repositorio.

## Estado verificado en la máquina de Miguel
Registro de lo comprobado, no de lo supuesto. No acredita las máquinas de Luis ni de Pablo.

2026-11-05 · COM-002
- SDK 10.0.401 fijado en `global.json`; `dotnet --version` dentro del repositorio devuelve `10.0.401`.
- Solución `Erp.slnx` con `src/Erp.Api` y `tests/Erp.Api.Tests`.
- La API sirve `wwwroot` sin modificarlo: una prueba de integración comprueba que `/` devuelve la interfaz conservada.
- `dotnet build`: 0 advertencias, 0 errores.
- `dotnet test`: 2 superadas, 0 con error.
- No se crearon DbContext ni migraciones; corresponden a COM-005.

2026-11-07 · COM-002 integrada
- El PR #104, desde la rama `miguel/com-002-solucion-minima`, está mergeado en `main` (`ddcb0f4`).
- El tablero reporta COM-001 y COM-002 en Done. Base de datos, migraciones y CI siguen pendientes.
- Comprobación de secretos (Git de solo lectura, 2026-11-07): `git ls-files src/Erp.Api/appsettings.Development.json` no devuelve nada y `git status --porcelain` no lista `bin/`, `obj/` ni archivos locales. La configuración local no está rastreada, así que `.gitignore` la protege y la cadena de conexión puede guardarse ahí o en `appsettings.Local.json`; en el repositorio solo quedará un ejemplo sin secretos.

2026-11-07 · COM-005 (en curso)
- Tres proyectos por capa: `src/Comercial/Erp.Comercial.Dominio`, `Erp.Comercial.Aplicacion` y `Erp.Comercial.Infraestructura`; `ComercialContext` con esquema propio `Comercial`.
- Migración `Inicial` creada con `dotnet ef migrations add` y aplicada con `dotnet ef database update` contra la instancia local; base `ErpFamihogar`.
- Lectura y escritura comprobadas contra SQL Server: alta de cliente y de oportunidad, consulta de historial y rechazo por rol (400). Tras reiniciar el servicio, los datos siguen disponibles.
- `dotnet build`: 0 advertencias, 0 errores. `dotnet test`: 8 superadas.
- Las máquinas de Luis y Pablo siguen sin verificación de SQL Server.

## Estado verificado en la máquina de Luis

2026-11-07 · COM-003
- SDK instalados: 10.0.301 y 10.0.401. `dotnet --version` dentro del repositorio devolvió `10.0.401`, conforme a `global.json`.
- Se ejecutaron en orden `dotnet build` (0 advertencias y 0 errores) y `dotnet test --no-build` (2 superadas, 0 fallidas y 0 omitidas). Son las pruebas de integración de raíz y estado, no pruebas del flujo comercial.
- Build falló sin diagnóstico útil dentro del entorno restringido del asistente y test no produjo resultado allí; ambos se verificaron fuera de él con autorización. No se atribuye ese comportamiento a un defecto confirmado del proyecto.
- Arranque con `dotnet run --project src/Erp.Api --no-build --no-launch-profile --urls http://localhost:5210`. Se comprobó HTTP 200 en `/` con la interfaz y respuesta de `/api/estado` con `servicio: Erp.Api` y `estado: en marcha`.
- Luis confirmó también la consulta manual de `/api/estado` y las comprobaciones de interfaz registradas en [interfaz inicial](acceso-aplicaciones.md).
- Luis explicó que el endpoint solo demuestra respuesta en esa ruta, sin validar base de datos ni flujo comercial; los roles son simulados y las pantallas de las tarjetas están pendientes.
- Consultas Git de solo lectura: árbol limpio antes de documentar; `main` local y las ramas `main` consultadas de `LuisInfinito/ERP-2026-2` y `miguelr296/ERP-2026-2` coincidieron en `ddcb0f438ccc8f7e40f78d4e360db4459a5d396b`. Esto no acredita la sincronización de todas las ramas antiguas. No se cambiaron ramas ni se hicieron commits o subidas.

2026-11-08 · Actualización del PR COM-003
- Incorporado `upstream/main` con COM-005 (PR #107, `500174e`), conservando la documentación de Miguel y la evidencia histórica de Luis.
- `dotnet build Erp.slnx --configuration Release`: 0 advertencias y 0 errores; después `dotnet test Erp.slnx --configuration Release --no-build --no-restore`: 8 superadas, 0 fallidas y 0 omitidas.
- Dos pruebas son de arranque y seis usan EF Core InMemory. No acreditan SQL Server en la máquina de Luis; no se ejecutaron migraciones.
