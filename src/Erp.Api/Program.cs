using Erp.Api.Http;
using Erp.Comercial.Aplicacion.Clientes;
using Erp.Comercial.Aplicacion.Historial;
using Erp.Comercial.Aplicacion.Oportunidades;
using Erp.Comercial.Infraestructura;

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

app.Run();

// Permite que las pruebas de integración inicien la API.
public partial class Program { }
