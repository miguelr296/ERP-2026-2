# ERP FAMIHOGAR

Interfaz para una mueblería retail con varias sedes, desarrollada con HTML, CSS y JavaScript. Fuentes funcionales: [Sesión 06 — Gestión Comercial](docs/fuentes/sesion-06-sistema-gestion-comercial.pdf) y [Sesión 10 — Gestión Logística](docs/fuentes/sesion-10-gestion-logistica.pdf). Bartolito ERP aporta la referencia visual y de navegación.

## Abrir las pantallas

Desde la raíz del repositorio:

```powershell
python -m http.server 5300 --bind 127.0.0.1 --directory src/Erp.Api/wwwroot
```

Abrir `http://localhost:5300/`, elegir usuario, rol y sede. Asesor y Jefatura acceden a Comercial. Compras, Almacén, Transporte y Jefatura operan sus procesos de Logística; Asesor puede solicitar abastecimiento. Las otras áreas muestran su estado de desarrollo. Los registros se guardan en el navegador; no se comparten entre equipos.

## Recorrido disponible

Aplicaciones → Comercial → Clientes y productos revisados → Oportunidades → Cotizaciones → Controles/aprobación de pedidos → Seguimiento y postventa. Incluye precios por canal, promociones, descuentos, indicadores y fichas imprimibles. Comercial consume [contratos públicos](docs/contratos/integracion-comercial.md).

Aplicaciones → Logística/Compras/Despachos → Necesidades → Ofertas y OC → Recepción/calidad → Inventario → Reserva/picking/embalaje → Salida/entrega. Incluye inspección parcial, reparación/reinspección/bajas, administración de almacenes/ubicaciones, reubicaciones, retornos, traslados, conteos por calidad, cotejo de factura, evaluación e indicadores. [Guion por rol y límites](docs/pantallas/logistica.md) · [Reglas](docs/reglas-logisticas.md) · [Contratos](docs/contratos/integracion-logistica.md).

Comercial (#116) se integró mediante el [PR #117](https://github.com/miguelr296/ERP-2026-2/pull/117) y la primera entrega de Logística (#118) mediante el [PR #119](https://github.com/miguelr296/ERP-2026-2/pull/119). El [pulido de Logística](docs/borradores/logistica-pulido.md), [tarjeta #120](https://github.com/miguelr296/ERP-2026-2/issues/120), tiene implementación y pruebas automatizadas completas; Luis verificó administración de almacenes/ubicaciones y Miguel ayudará con los otros cuatro cambios. Revisión e integración pendientes. Cobros/pagos, comprobantes y asientos siguen a cargo de sus áreas.

## Cómo leer este repositorio

1. Lee `docs/contexto.md` para conocer el propósito y punto de partida.
2. Lee `docs/decisiones.md` para conocer los acuerdos vigentes.
3. Lee `BITACORA.md` para consultar el trabajo comprobado.
4. Consulta la [fuente y su uso](docs/fuentes/README.md) antes de definir reglas o recorridos.
5. Revisa los guiones de [Comercial](docs/pantallas/comercial.md) y [Logística](docs/pantallas/logistica.md).
6. La entrada es `src/Erp.Api/wwwroot/index.html`; parámetros y datos iniciales están en `datos-comercial.js` y `datos-logistica.js`.
7. Consulta las [reglas y pruebas](docs/reglas-comerciales.md), el [glosario](docs/glosario.md) y la [preparación del PR](docs/borradores/interfaz-comercial-pr.md).

## Validación

Reglas con Node.js, sin dependencias adicionales:

```powershell
node --test --test-isolation=none tests/interfaz/comercial.test.cjs
node --test --test-isolation=none tests/interfaz/logistica.test.cjs
```

Resultado local: **46 Comercial + 77 Logística = 123 superadas, 0 fallidas, 0 omitidas**. El aislamiento de procesos del runner falló con EPERM en el entorno restringido; los comandos anteriores ejecutan los casos en el mismo proceso.

Para la prueba de pantalla, dejar el servidor estático activo e iniciar un Chrome headless de prueba con perfil temporal:

```powershell
$perfilPruebas = Join-Path $env:TEMP ('famihogar-pruebas-' + [guid]::NewGuid().ToString('N'))
Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList @('--headless=new', '--disable-extensions', '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=9245', "--user-data-dir=$perfilPruebas", '--no-first-run', 'about:blank') -WindowStyle Hidden
node tests/interfaz/navegador.cjs 9245
node tests/interfaz/logistica-navegador.cjs 9245
```

Si Chrome está en otra carpeta, ajustar su ruta. Cada script exige headless, crea su propio contexto y lo elimina al terminar. Resultado local: **56 comprobaciones Comercial y 71 Logística, 0 excepciones JavaScript**; cotización, despacho y reparación de prueba, cada uno en A4 de una página. Capturas/PDF/resultados en `%TEMP%/famihogar-comercial-validacion` y `%TEMP%/famihogar-logistica-validacion`, fuera del repositorio. Se ejecutaron en el puerto de depuración 9247; los comandos aceptan el puerto como argumento. Cerrar únicamente ese navegador de prueba al terminar. No se afirma CI: el reinicio de Miguel retiró el workflow anterior.

## Flujo

- Inicio de sesión: `docs/comandos/iniciar.md` (`.opencode/command/iniciar.md`).
- Cierre: `docs/comandos/cierre.md` (`.opencode/command/cierre.md`).
