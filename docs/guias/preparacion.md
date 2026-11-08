# Preparación técnica desde cero

[Índice](../../README.md)

Esta guía define tareas de COM-002 a COM-005. Al 2026-11-07, COM-002 está verificada en la máquina de Miguel e integrada en `main` (PR #104); no acredita instalación ni funcionamiento en las máquinas de Luis y Pablo.

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

## Estado verificado en la máquina de Luis · 2026-11-08 · COM-006

- Luis inició `MSSQLSERVER`. La conexión local con autenticación de Windows se comprobó fuera del entorno restringido del asistente; dentro falló el contexto SSPI. La base de ejemplo `ErpFamihogar` no existía en esta máquina.
- Con autorización expresa de Luis se instaló `dotnet-ef` 10.0.14 en `%TEMP%/erp-com006-herramientas` y se aplicó únicamente la migración existente de Miguel `20261107220349_Inicial` a la base local nueva `ErpFamihogarPruebasLuis`. No se crearon ni modificaron migraciones. Es una autorización local para esta comprobación, sin cambiar la asignación habitual a Miguel.
- La API de pruebas se inició en el puerto 5216 con `ConnectionStrings__Comercial` en su entorno, usando la base de pruebas y autenticación de Windows. No se cambiaron archivos de conexión ni se incluyeron credenciales en el repositorio.
- Comprobación contra SQL: búsqueda sin coincidencias (200, lista vacía), alta de cliente ficticio (201), búsqueda por documento con el mismo ID, historial con un evento, duplicado (400) y documento de búsqueda vacío (400). Tras detener y reiniciar la API, consulta por ID, búsqueda e historial recuperaron el registro. Identificadores y detalle en [COM-006](../borradores/com-006-preparacion.md).
- Build Release: 0 advertencias y 0 errores; después test: 19 superadas, 0 fallidas y 0 omitidas. Las pruebas automatizadas de cliente usan InMemory; la evidencia SQL es la comprobación real separada descrita arriba.
- Esta verificación no acredita el recorrido Comercial completo ni el entorno de Pablo. La preparación local de COM-006 no equivale a integración ni Done.
