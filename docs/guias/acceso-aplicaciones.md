# Guía — Pantalla de acceso y aplicaciones (S1-00)

[← Índice](../../README.md)

## Qué es

Es la entrada del front (D13): acceso simulado con nombre y rol (D12) y un selector de aplicaciones con una tarjeta por área. Luis la preparó el 29/10 como trabajo adelantado; ese mismo día se adaptó al plan reestructurado y se registró como tarjeta **S1-00**. Tomó como referencia visual BartolitoERP, proporcionado por el profesor.

No incluye pantallas internas, autenticación real, permisos ni operaciones de negocio.

## Archivos (dueño en la semana 1: Luis)

En `src/Erp.Api/wwwroot`, sin dependencias externas:

| Archivo | Qué hace |
|---|---|
| `index.html` | Estructura de las dos vistas: acceso y aplicaciones |
| `estilos.css` | Estilos propios (sin Bootstrap), escritos de forma legible |
| `aplicaciones.js` | Catálogo de áreas, acceso simulado, filtro y salida |

## Cómo funciona

- **Acceso:** pide nombre y uno de los roles Asesor, Jefatura o Tesorería (en S1-18 se amplía a los 14 roles del TO-BE). No pide contraseña; el rol no otorga permisos reales.
- **Sesión:** se guarda en `sessionStorage` de la pestaña, para que las pantallas de cada área sepan el rol (por ejemplo, Tesorería confirma anticipos). Recargar conserva la sesión; **Salir** o cerrar la pestaña la borra.
- **Catálogo:** Comercial (sprint 1) y Logística (fecha por confirmar). Cada área tiene un campo `ruta`: mientras sea `null`, la tarjeta solo avisa que la pantalla está pendiente; cuando exista la pantalla del área (Comercial: el menú `comercial/index.html` de S1-18), se pone su archivo y la tarjeta la abre. Agregar áreas exige acuerdo del equipo.

## Cómo probar (Chrome o Edge, Windows)

1. Abre `src/Erp.Api/wwwroot/index.html` (por ahora no hace falta servidor ni la Api).
2. Intenta ingresar sin datos: el navegador pide completarlos.
3. Escribe tu nombre, selecciona Asesor y pulsa **Ingresar al ERP**: aparecen Aplicaciones, tu nombre y tu rol.
4. Busca `comercial` y luego `logistica` (sin tilde): aparece solo la tarjeta correspondiente.
5. Busca `no-existe`: aparece el aviso de que no hay resultados. Borra el filtro: vuelven ambas tarjetas.
6. Pulsa cada tarjeta: avisa que la pantalla está pendiente.
7. Recarga: sigues en Aplicaciones con la misma sesión.
8. Pulsa **Salir**: vuelves al acceso con el formulario limpio; al recargar, sigues en el acceso. Repite con Tesorería.
9. Prueba con Tab, Enter y las flechas del selector, y en una ventana estrecha o la vista móvil.

Comprobado el 29/10 en Chromium: los pasos 2 a 8 pasaron sin errores en la consola. Falta la prueba manual de Luis en Chrome o Edge y la revisión de Miguel.

## Integración con la Api (S1-04, Miguel)

Cuando exista `Erp.Api`, estos archivos se sirven desde su carpeta `wwwroot` habilitando archivos estáticos e `index.html` como documento por defecto. Así la pantalla de acceso aparece en `/` y las pantallas llaman a la API con `fetch` sin configurar CORS.

## Pendiente

- Luis anota sus horas reales de S1-00 en la bitácora.
- Luis explica a Miguel qué hace cada parte de los tres archivos (criterio de S1-00); con eso Miguel la revisa y la tarjeta se cierra en el tablero.
