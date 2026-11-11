# ERP FAMIHOGAR

Interfaz para una mueblería retail con varias sedes, desarrollada con HTML, CSS y JavaScript. La fuente funcional es [Sesión 06 — Sistema de Gestión Comercial](docs/fuentes/sesion-06-sistema-gestion-comercial.pdf); Bartolito ERP aporta la referencia visual y de navegación.

## Abrir las pantallas

Desde la raíz del repositorio:

```powershell
python -m http.server 5300 --bind 127.0.0.1 --directory src/Erp.Api/wwwroot
```

Abrir `http://localhost:5300/`, elegir usuario, rol y sede. Asesor y Jefatura acceden a Comercial. Las demás áreas muestran su estado de desarrollo. Los registros comerciales se guardan en el navegador; no se comparten entre equipos.

## Recorrido disponible

Aplicaciones → Comercial → Clientes y productos revisados → Oportunidades → Cotizaciones → Controles/aprobación de pedidos → Seguimiento y postventa. Incluye precios por canal, promociones, descuentos, indicadores y fichas imprimibles. Cobros, reservas, salidas, comprobantes y asientos quedan en sus módulos; Comercial consume sus [contratos de consulta locales](docs/contratos/integracion-comercial.md).

La [tarjeta #116](https://github.com/miguelr296/ERP-2026-2/issues/116) corresponde al nuevo enfoque. Revisión e integración pendientes; no se cierran automáticamente tarjetas anteriores con criterios de API.

## Cómo leer este repositorio

1. Lee `docs/contexto.md` para conocer el propósito y punto de partida.
2. Lee `docs/decisiones.md` para conocer los acuerdos vigentes.
3. Lee `BITACORA.md` para consultar el trabajo comprobado.
4. Consulta la [fuente y su uso](docs/fuentes/README.md) antes de definir reglas o recorridos.
5. Revisa el [alcance, separación de módulos y guía de comprobación](docs/pantallas/comercial.md).
6. La entrada es `src/Erp.Api/wwwroot/index.html`; parámetros y datos iniciales están en `datos-comercial.js`.
7. Consulta las [reglas y pruebas](docs/reglas-comerciales.md), el [glosario](docs/glosario.md) y la [preparación del PR](docs/borradores/interfaz-comercial-pr.md).

## Validación

Reglas con Node.js, sin dependencias adicionales:

```powershell
node --test --test-isolation=none tests/interfaz/comercial.test.cjs
```

Resultado local: **46 superadas, 0 fallidas, 0 omitidas**. El aislamiento de procesos del runner falló con EPERM en el entorno restringido; el comando anterior ejecuta los casos en el mismo proceso.

Para la prueba de pantalla, dejar el servidor estático activo e iniciar un Chrome headless de prueba con perfil temporal:

```powershell
$perfilPruebas = Join-Path $env:TEMP ('famihogar-pruebas-' + [guid]::NewGuid().ToString('N'))
Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList @('--headless=new', '--disable-extensions', '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=9245', "--user-data-dir=$perfilPruebas", '--no-first-run', 'about:blank') -WindowStyle Hidden
node tests/interfaz/navegador.cjs 9245
```

Si Chrome está en otra carpeta, ajustar su ruta. El script exige headless, crea su propio contexto y lo elimina al terminar. Resultado local: **54 comprobaciones, 0 excepciones JavaScript**, ficha A4 de una página. Capturas y PDF se guardan en `%TEMP%/famihogar-comercial-validacion`, fuera del repositorio. No se afirma CI: el reinicio de Miguel retiró el workflow anterior.

## Flujo

- Inicio de sesión: `docs/comandos/iniciar.md` (`.opencode/command/iniciar.md`).
- Cierre: `docs/comandos/cierre.md` (`.opencode/command/cierre.md`).
