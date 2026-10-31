# Anexo C — Glosario

[← Índice](../README.md)

Todo término nuevo se agrega en la misma sesión en que aparece.

## Negocio

| Término | Significado |
|---|---|
| ERP | Sistema que integra las áreas de una empresa (ventas, logística, finanzas…) sobre los mismos datos |
| FAMIHOGAR | Empresa ficticia del caso: manufactura y retail de muebles en Perú |
| TO-BE | Cómo operará el área con el ERP (AS-IS = cómo opera hoy); el Documento TO-BE es la fuente de verdad del área Comercial |
| MTS | *Make to stock*: se vende de lo que ya hay en almacén |
| MTO | *Make to order*: se fabrica bajo pedido del cliente |
| B2B / Retail | Venta a empresas / venta a público en tienda |
| CRM | Gestión de clientes y oportunidades de venta |
| Oportunidad | Posible venta: un cliente con productos de interés |
| Cotización | Oferta formal con precios, IGV y vigencia |
| Anticipo | Pago adelantado que habilita convertir la cotización en orden de venta |
| Pago validado | Marca de la cotización cuando Tesorería confirmó el anticipo |
| OV | Orden de venta: compromiso de venta confirmado, nace de una cotización |
| Lista de precios | Precios vigentes por canal y tipo de cliente |
| Canal | Por dónde se vende (Retail, B2B…) |
| Sede | Tienda o almacén donde se atiende o se tiene stock |
| Tesorería | Rol que confirma los pagos contra el banco |
| Jefatura de Ventas | Rol que aprueba descuentos dentro de su límite |
| BOM | Lista de materiales de un mueble (lo usa MTO) |
| ATP | Cantidad disponible para prometer a un cliente |
| POD | Constancia de entrega al cliente |
| CxC | Cuentas por cobrar |
| DNI / RUC | Documento de identidad de personas (8 dígitos) / de empresas (11 dígitos) |
| IGV | Impuesto General a las Ventas: 18 % en Perú |
| SUNAT | Autoridad tributaria peruana |
| Microproceso | Nivel más fino del TO-BE (código como `PO.02.P02.SP02.A01`) |

## Técnico

| Término | Significado |
|---|---|
| Monolito modular | Un solo sistema desplegable, dividido en módulos con fronteras claras |
| Módulo | Parte del ERP que corresponde a un área (Comercial, Finanzas, Logística, Planta) |
| Submódulo | Grupo de procesos de un módulo con sus propios documentos y un rol responsable (p. ej. Comercial › Ventas). Comparte el esquema SQL del módulo |
| Contrato | Interfaz pública de un módulo: lo único que otros módulos pueden usar |
| Capa | Nivel dentro de un módulo: Api, Servicios o Datos |
| Servicio | Clase que contiene las reglas de negocio |
| Repositorio | Clase que lee y guarda datos en la base |
| Entidad | Clase que representa una tabla (Cliente, Cotizacion…) |
| DTO | Objeto simple para entrar o salir de la API |
| Inyección de dependencias (DI) | Las clases reciben lo que necesitan en vez de crearlo ellas mismas |
| SOLID | Cinco principios de diseño orientado a objetos |
| EF Core | Librería de .NET que mapea clases a tablas |
| Migración | Archivo versionado que cambia la estructura de la base |
| Datos semilla | Datos de ejemplo cargados al crear la base |
| Esquema SQL | Agrupación de tablas dentro de una base (`comercial.Cliente`) |
| API / endpoint | Servicio web que el front o las pruebas consumen / una URL concreta de la API |
| xUnit | Librería de pruebas unitarias de .NET |
| Prueba unitaria | Prueba que verifica una regla sin base de datos ni red |
| CI | Integración continua: GitHub corre build y pruebas solo en cada PR |
| GitHub Actions | Servicio de GitHub que ejecuta el CI |
| Swagger / Scalar | Pantalla web para probar los endpoints de la API |
| wwwroot | Carpeta de la Api con los archivos del front (HTML, CSS, JS) que el servidor entrega tal cual |
| fetch | Función de JavaScript con la que la pantalla llama a la API |
| Front / Back | Pantallas que ve el usuario / API, reglas y base de datos |
| Trazabilidad | Poder seguir un documento hacia atrás y hacia adelante: quién lo creó, qué estados tuvo, de qué documento viene y qué documentos generó (D25) |
| Historial de estados | Registro de cada cambio de estado: estado anterior y nuevo, usuario, rol, fecha y hora, motivo |
| Cadena documental | Enlace entre un documento y el que lo originó (flujo de documentos) |
| Ficha | Vista de detalle imprimible de un documento con cabecera, detalle, historial y cadena |
| Planta | Módulo de Ingeniería (requerimiento, especificación, BOM, costo) y Producción (demanda, OP, PT) |
| OP / PT | Orden de producción / producto terminado |
| ROP | Punto de reorden: stock mínimo que dispara la reposición de una tienda |
| RMA / NC | Autorización de devolución / nota de crédito |

## Gestión

| Término | Significado |
|---|---|
| Sprint | Ciclo de trabajo; aquí dura una semana (jueves a miércoles) |
| Planning / Review / Retro | Planificar el sprint / mostrar lo hecho / revisar cómo se trabajó |
| Kanban | Tablero por columnas (Backlog, Ready, In Progress, In Review, Done) |
| Issue | Tarjeta del tablero de GitHub |
| Priority (P0 / P1 / P2) | En el sprint 1: fase A / B / C (demo 05/11 / 12/11 / 19/11) |
| Size / Estimate | Tamaño por persona (S 0,5 h, M 1 h, L 1,5 h, XL hay que dividir) / horas totales de la tarjeta |
| Blocked by | Relación de GitHub: una tarjeta no puede empezar hasta cerrar otra ("depende de") |
| WIP | *Work in progress*: tarjetas en curso a la vez (máximo 1 por persona) |
| DoD | Definición de terminado: lo que debe cumplirse para cerrar una tarjeta |
| PR | *Pull request*: propuesta de cambio que otro integrante revisa antes del merge |
| Tag | Marca en Git de un momento del código (`semana-01`) |
| Regla de recorte | Qué se elimina, y cuándo, si el sprint no llega |
| Núcleo | Lo que un área presenta el jueves, en pantalla y API; lo único que se compromete |
| Si alcanza | Procesos del área que se hacen solo si sobra tiempo, en orden de prioridad |
| Simulado | Infraestructura real que en todo el curso se imita (login, SUNAT, correo…) |
| Pendiente del área | Lo que no se hizo al cerrar el sprint del área; queda anotado sin fecha |
| Versión mínima | Simulación sencilla de un proceso de otra área, dentro del módulo de esa área y detrás de su contrato (D06) |
| Interfaz (TO-BE) | Proceso de otra área que el TO-BE Comercial describe porque Comercial lo toca (PO.01, PO.03, PO.04, PO.05, PA.01) |
| Fuente de verdad | Documento que manda sobre el alcance de un área (TO-BE en Comercial) o, en el caso de las tarjetas, el tablero de GitHub |
| Fork | Copia de un repositorio en otra cuenta; aquí no se usa (se trabaja con ramas del mismo repo) |
| Hito (milestone) | Agrupación de tarjetas de GitHub por demo (Demo 05/11, 12/11, 19/11) |
| Fase | Tramo del sprint 1 que termina en una demo: A, B o C (Priority P0, P1, P2) |
| Aprendizaje justo a tiempo | Aprender solo lo que la tarea de hoy necesita |
