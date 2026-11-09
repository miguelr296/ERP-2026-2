using Erp.Api.Http;
using Erp.Comercial.Aplicacion.Cotizaciones;
using Erp.Comercial.Aplicacion.Clientes;
using Erp.Comercial.Aplicacion.Historial;
using Erp.Comercial.Aplicacion.Oportunidades;
using Erp.Comercial.Aplicacion.Productos;
using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Aplicacion.Reservas;
using Erp.Comercial.Infraestructura;
using Erp.Comercial.Infraestructura.Simulaciones;

var builder = WebApplication.CreateBuilder(args);

// La cadena real vive en la configuración local, que Git ignora. El repositorio solo
// guarda el ejemplo de appsettings.json, sin servidor, usuario ni contraseña reales.
var cadenaComercial = builder.Configuration.GetConnectionString("Comercial")
    ?? throw new InvalidOperationException(
        "Falta ConnectionStrings:Comercial. Copie el ejemplo de appsettings.json en appsettings.Development.json.");

// Infraestructura: contexto y persistencia del módulo; la API no conoce EF Core.
builder.Services.AgregarInfraestructuraDeComercial(cadenaComercial);

// Casos de uso de la capa de aplicación.
builder.Services.AddScoped<IClientesCasoUso, ClientesCasoUso>();
builder.Services.AddScoped<IOportunidadesCasoUso, OportunidadesCasoUso>();
builder.Services.AddScoped<IHistorialCasoUso, HistorialCasoUso>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton(builder.Configuration.GetSection("CotizacionDemo")
    .Get<ParametrosCotizacion>() ?? new ParametrosCotizacion());
builder.Services.AddScoped<CalculoCotizacionCasoUso>();
builder.Services.AddScoped<CotizacionesCasoUso>();
var productosDemo = builder.Configuration.GetSection("CatalogoDemo").Get<ProductoPrecioVista[]>() ?? [];
builder.Services.AddSingleton<ICatalogoCasoUso>(new CatalogoCasoUso(productosDemo));

// COM-008: dependencias externas simuladas. Comercial solo conoce sus contratos; los
// valores de demostración viven en configuración y se sustituyen en el sprint del proveedor.
var opcionesReserva = builder.Configuration
    .GetSection("SimulacionLogistica")
    .Get<OpcionesDeReservaSimulada>() ?? new OpcionesDeReservaSimulada();
builder.Services.AddSingleton<IReservaDeStock>(new ReservaDeStockSimulada(opcionesReserva));
builder.Services.AddSingleton<IPagoDeTesoreria, PagoDeTesoreriaSimulado>();
builder.Services.AddScoped<IReservasCasoUso, ReservasCasoUso>();

var app = builder.Build();

// La interfaz conservada de wwwroot se sirve como archivos estáticos.
// No se modifica su contenido: COM-003 revisa textos y roles.
app.UseDefaultFiles();
app.UseStaticFiles();

// Estado mínimo del servicio. No valida base de datos ni módulos.
app.MapGet("/api/estado", () => Results.Ok(new
{
    servicio = "Erp.Api",
    estado = "en marcha",
    version = typeof(Program).Assembly.GetName().Version?.ToString()
}));

// COM-005: alta y consulta de cliente. La oportunidad siempre se vincula a un cliente.
app.MapPost("/api/clientes", (
    NuevoCliente datos,
    HttpRequest peticion,
    IClientesCasoUso casoUso,
    CancellationToken cancelacion) =>
    PeticionesHttp.EjecutarAsync(async () =>
    {
        var cliente = await casoUso.RegistrarAsync(
            datos,
            PeticionesHttp.LeerUsuario(peticion),
            cancelacion);

        return Results.Created($"/api/clientes/{cliente.Id}", cliente);
    }));

// Buscar antes de registrar: devuelve cero o un cliente porque el documento es único.
app.MapGet("/api/clientes", (
    string? documento,
    IClientesCasoUso casoUso,
    CancellationToken cancelacion) =>
    PeticionesHttp.EjecutarAsync(async () =>
        Results.Ok(await casoUso.BuscarPorDocumentoAsync(documento, cancelacion))));

app.MapGet("/api/clientes/{id:guid}", async (
    Guid id,
    IClientesCasoUso casoUso,
    CancellationToken cancelacion) =>
{
    var cliente = await casoUso.BuscarAsync(id, cancelacion);
    return cliente is null ? Results.NotFound() : Results.Ok(cliente);
});

app.MapPost("/api/oportunidades", (
    NuevaOportunidad datos,
    HttpRequest peticion,
    IOportunidadesCasoUso casoUso,
    CancellationToken cancelacion) =>
    PeticionesHttp.EjecutarAsync(async () =>
    {
        var oportunidad = await casoUso.RegistrarAsync(
            datos,
            PeticionesHttp.LeerUsuario(peticion),
            cancelacion);

        return Results.Created($"/api/oportunidades/{oportunidad.Id}", oportunidad);
    }));

// Ficha inicial: datos, cliente, productos, sede y responsable en una sola respuesta.
app.MapGet("/api/oportunidades/{id:guid}", async (
    Guid id,
    IOportunidadesCasoUso casoUso,
    CancellationToken cancelacion) =>
{
    var oportunidad = await casoUso.BuscarAsync(id, cancelacion);
    return oportunidad is null ? Results.NotFound() : Results.Ok(oportunidad);
});

// Previsualiza con precios del servidor. No emite ni persiste una cotización.
app.MapPost("/api/oportunidades/{id:guid}/calculo-cotizacion", (
    Guid id, CalcularCotizacion datos, HttpRequest peticion,
    CalculoCotizacionCasoUso casoUso, CancellationToken cancelacion) =>
    PeticionesHttp.EjecutarAsync(async () =>
    {
        var calculo = await casoUso.CalcularAsync(id, datos, PeticionesHttp.LeerUsuario(peticion), cancelacion);
        return calculo is null ? Results.NotFound() : Results.Ok(calculo);
    }));

// Emisión persistida: referencia de solicitud para reintentar sin duplicar.
app.MapPost("/api/oportunidades/{id:guid}/cotizaciones", (
    Guid id, NuevaCotizacion datos, HttpRequest peticion,
    CotizacionesCasoUso casoUso, CancellationToken cancelacion) =>
    PeticionesHttp.EjecutarAsync(async () =>
    {
        var resultado = await casoUso.EmitirAsync(id, datos, PeticionesHttp.LeerUsuario(peticion), cancelacion);
        if (resultado is null) return Results.NotFound();
        return resultado.Creada
            ? Results.Created($"/api/cotizaciones/{resultado.Ficha.Id}", resultado.Ficha)
            : Results.Ok(resultado.Ficha);
    }));

app.MapGet("/api/cotizaciones/{id:guid}", async (
    Guid id, CotizacionesCasoUso casoUso, CancellationToken cancelacion) =>
{
    var ficha = await casoUso.BuscarAsync(id, cancelacion);
    return ficha is null ? Results.NotFound() : Results.Ok(ficha);
});

// Historial de un documento: es la base de la ficha imprimible de las tarjetas siguientes.
app.MapGet("/api/historial/{tipo}/{id:guid}", async (
    string tipo,
    Guid id,
    IHistorialCasoUso casoUso,
    CancellationToken cancelacion) =>
{
    var eventos = await casoUso.ConsultarAsync(tipo, id, cancelacion);
    return Results.Ok(eventos);
});

// COM-008: reserva simulada de stock. El rechazo devuelve 400 y no deja documento.
app.MapPost("/api/oportunidades/{id:guid}/reservas", (
    Guid id,
    NuevaReserva datos,
    HttpRequest peticion,
    IReservasCasoUso casoUso,
    CancellationToken cancelacion) =>
    PeticionesHttp.EjecutarAsync(async () =>
    {
        var reserva = await casoUso.RegistrarAsync(
            id,
            datos,
            PeticionesHttp.LeerUsuario(peticion),
            cancelacion);

        return Results.Created($"/api/reservas/{reserva.Id}", reserva);
    }));

app.MapGet("/api/reservas/{id:guid}", async (
    Guid id,
    IReservasCasoUso casoUso,
    CancellationToken cancelacion) =>
{
    var reserva = await casoUso.BuscarAsync(id, cancelacion);
    return reserva is null ? Results.NotFound() : Results.Ok(reserva);
});

// Catálogo ficticio: la pantalla podrá elegir por canal y tipo de cliente (COM-007).
app.MapGet("/api/catalogo", (
    string? canal,
    string? tipoCliente,
    ICatalogoCasoUso casoUso) =>
    Results.Ok(casoUso.Consultar(canal, tipoCliente)));

app.Run();

// Permite que las pruebas de integración inicien la API.
public partial class Program { }
