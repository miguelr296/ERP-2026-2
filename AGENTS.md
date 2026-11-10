# Guía del equipo y del asistente

ERP académico para FAMIHOGAR SAC. Miguel tiene mayor experiencia general, Luis es el segundo y Pablo el menos experimentado. Miguel coordina lo técnico y acompaña al equipo. Código y documentación del dominio en español.

## Estado
El proyecto empezó desde cero. Solo se conserva la interfaz HTML, CSS y JavaScript de wwwroot como material de partida, sin atribuirle tarjetas terminadas.
Al 2026-11-07 existen solución .NET mínima, API y pruebas de arranque (COM-002); no hay base de datos, migraciones ni CI. Esto está verificado en la máquina de Miguel, no en las de Luis y Pablo.
Comercial ocupa el sprint 1, del 5 al 11 de noviembre de 2026. El calendario único está en [sprints](docs/plan/sprints.md).

## Flujo permanente
- Un área por sprint de siete días, de jueves a miércoles. La preparación técnica entra en la capacidad del sprint; no se presupone hecha.
- Cada área entrega el recorrido prioritario elegido desde su fuente en pantalla y API; no se promete implementar todo su manual en una semana. Sus dependencias externas se simulan por contratos hasta el sprint del área dueña.
- Trabajo con tarjeta, una en curso por persona; máximo dos PR en revisión. Revisar antes de abrir más trabajo.
- Borrador de tarjetas → aprobación → tablero de GitHub. Después de la carga, el tablero es la fuente del estado real.
- Rama nombre/tarea dentro del repositorio, sin forks; PR revisado por otra persona; nunca autoaprobar.
- Miguel coordina DbContext y migraciones. Solo él las crea. Revisa cambios de reglas y Compartido de otros integrantes; sus propios PR los revisa Luis o Pablo, con explicación.
- Orden de cierre: implementar y validar → explicar → actualizar documentación aprobada → validar versión final → commit y PR → revisión → merge → Done.
- /cierre termina la preparación local del PR. Una revisión con cambios abre otro ciclo de cierre.
- No declarar una tarjeta terminada, prueba aprobada o servicio disponible sin evidencia.

## Diseño permanente
- C# / ASP.NET Core / EF Core / SQL Server; HTML + CSS + JavaScript en wwwroot.
- Monolito modular: Comercial, Logística, Finanzas, Planta y Compartido.
- Api → Aplicación → Dominio; Infraestructura implementa la persistencia. Reglas en Dominio y Aplicación. Entre módulos, solo los contratos públicos de Aplicación, sin leer tablas ajenas.
- Historial inmutable y cadena documental en cada documento; ficha imprimible con estado, origen, derivados y responsables.
- Claves primarias, alternas y foráneas simples; preferir identificadores subrogados. No usar claves compuestas; los índices compuestos sí se permiten cuando hacen falta (DEC-005).
- Datos ficticios; rol simulado; banco, SUNAT, correo y WhatsApp simulados.
- Parámetros del negocio configurables; dinero con decimal. Borrado lógico de documentos.
- Código sencillo, nombres claros, métodos cortos y explicación comprensible para quien aprende.

## Uso del asistente
Las solicitudes explícitas del usuario autorizan los cambios dentro de su alcance. Para cambios adicionales, proponer antes de escribir. No modificar archivos cuando la tarea sea solo análisis.
No ejecutar Git, migraciones ni escribir en GitHub sin autorización explícita para esa operación. Guiar al equipo cuando no exista.
Leer los comandos en docs/comandos; no deducir avances de planes, ejemplos o archivos conservados.
No crear un worktree salvo petición explícita: cada tarea de nube ya está aislada.

## Documentación
Mantener README como índice, contexto breve y bitácora con hechos comprobados.
Una regla nueva cita fuente y prueba; un término nuevo va al glosario.
Las futuras decisiones cambian por tema, con fecha y motivo; no reconstruir una historia previa al inicio.
