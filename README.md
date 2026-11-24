# ERP FAMIHOGAR

Prototipo de gestión para una mueblería retail con tres sedes. Conecta ventas y compras con inventario, entregas, comprobantes, tesorería y contabilidad. Funciona en el navegador con HTML, CSS y JavaScript.

## Ejecutar desde VS Code

1. Abre la carpeta del repositorio en VS Code y elige **Terminal → Nueva terminal**.
2. Desde la raíz, ejecuta este comando de Python.

   ```powershell
   python -m http.server 5300 --bind 127.0.0.1 --directory src/Erp.Api/wwwroot
   ```

3. Mantén la terminal abierta. Entra al [ERP en localhost](http://localhost:5300/) y selecciona nombre, perfil y sede.
4. Elige **Super Admin** para presentar varios módulos en la misma sesión o usa perfiles distintos para revisar los permisos. Si ves una versión anterior de la interfaz, recarga con **Ctrl + F5**.

Usa el mismo perfil de navegador y la misma dirección para acceder a tus registros. Cada integrante tiene sus propios datos locales.

## Funcionalidades

| Área | Operaciones |
|---|---|
| Comercial | Clientes y productos, oportunidades, listas de precios y promociones, cotizaciones, aprobación de pedidos, seguimiento, postventa e indicadores |
| Logística y Compras | Planificación, proveedores, solicitudes, ofertas, órdenes, recepción y calidad, Kardex valorizado, conteos, reubicaciones, traslados y cotejo |
| Despachos | Reserva, picking, embalaje, orden de salida, ruta, confirmación y retornos, con el inventario compartido de Logística |
| Facturación | Factura o boleta interna desde un pedido entregado, ficha imprimible, cuenta por cobrar y asiento pendiente |
| Finanzas | Cuentas por cobrar y pagar, crédito, programación y confirmación de pagos, caja, bancos y conciliación |
| Contabilidad | Asientos, apertura de inventario, activos, depreciación, balance de comprobación, diario, mayor y cierre |
| Reportes | Entrada en Aplicaciones, pendiente de implementación |

Las pantallas agrupan tareas y registros en zonas diferenciadas. Los botones **?** explican la interfaz y **Paso sugerido** orienta el recorrido. Al guardar se mantiene la vista actual y se ofrece **Ver registro guardado** cuando corresponde.

## Documentación para el equipo

| Documento | Para qué sirve |
|---|---|
| [Prueba integrada](docs/prueba-integrada.md) | Guion para demostrar venta, compra, tesorería y contabilidad |
| [Arquitectura](docs/arquitectura.md) | Componentes, archivos, datos, perfiles e integración |
| [Comercial](docs/pantallas/comercial.md) · [Logística](docs/pantallas/logistica.md) | Pantallas, reglas y recorridos por área |
| [Facturación, Finanzas y Contabilidad](docs/pantallas/facturacion-finanzas-contabilidad.md) | Operaciones, requisitos, asientos y cierre |
| [Contratos de Comercial](docs/contratos/integracion-comercial.md) · [Contratos de Logística](docs/contratos/integracion-logistica.md) | Consultas y referencias intercambiadas |
| [Reglas comerciales](docs/reglas-comerciales.md) · [Reglas logísticas](docs/reglas-logisticas.md) | Validaciones y casos de prueba |
| [Contexto](docs/contexto.md) · [Decisiones](docs/decisiones.md) · [Bitácora](BITACORA.md) · [Glosario](docs/glosario.md) · [Fuentes](docs/fuentes/README.md) | Antecedentes, términos y referencias de trabajo |

El prototipo sirve como insumo para construir los diagramas TO-BE. Los perfiles y comprobantes son de demostración. Consulta el [alcance pendiente](docs/arquitectura.md#alcance-pendiente).

## Validación


Con Node.js 24, ejecuta las pruebas de reglas desde la raíz:

```powershell
node --test --test-isolation=none tests/interfaz/comercial.test.cjs tests/interfaz/logistica.test.cjs tests/interfaz/kardex-evaluacion.test.cjs tests/interfaz/libros.test.cjs
```

Para las pruebas de pantalla, mantén activo el servidor estático e inicia Chrome headless con un perfil temporal.

```powershell
$perfilPruebas = Join-Path $env:TEMP ('famihogar-pruebas-' + [guid]::NewGuid().ToString('N'))
Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList @('--headless=new', '--disable-extensions', '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=9245', "--user-data-dir=$perfilPruebas", '--no-first-run', 'about:blank') -WindowStyle Hidden
node tests/interfaz/navegador.cjs 9245
node tests/interfaz/logistica-navegador.cjs 9245
```

Si Chrome está en otra carpeta, ajusta su ruta. Cada script usa Chrome headless y elimina su contexto al finalizar. Las capturas, PDF y resultados se guardan en carpetas temporales fuera del repositorio. Al terminar, cierra solo el Chrome de prueba.

Verificación local del 24 de noviembre de 2026 con datos aislados. Pasaron 132 pruebas de reglas y 205 comprobaciones de navegador (74 de Comercial y 131 del recorrido integrado), con cero excepciones JavaScript.

El [escenario de evaluación del Kardex valorizado](docs/borradores/evaluacion-kardex-valorizado.md) también está disponible desde la aplicación y trabaja con datos en memoria.
