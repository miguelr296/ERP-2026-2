using Erp.Api.Datos;
using Erp.Compartido.Contratos;
using Erp.Compartido.Datos;
using Erp.Compartido.Servicios;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// D05: los controladores viven en la carpeta Api/ de cada subsistema y MVC los descubre solo.
builder.Services.AddControllers();
builder.Services.AddDbContext<ErpDbContext>(opciones =>
    opciones.UseSqlServer(
        builder.Configuration.GetConnectionString("FamihogarErp")
        ?? throw new InvalidOperationException("Falta configurar la conexión FamihogarErp.")));

// Trazabilidad (D25): el historial se pide por su contrato; la base de datos la resuelve la Api.
builder.Services.AddScoped<IHistorialEstadoRepositorio, RepositorioHistorial>();
builder.Services.AddScoped<IHistorialDeEstados, RegistroDeHistorial>();

var app = builder.Build();

// D13: el front (wwwroot) se sirve desde la Api; index.html queda en "/".
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// Comprobación rápida de que la Api responde (se usa en la demo y en las pruebas).
app.MapGet("/api/salud", () => Results.Ok(new { estado = "ok" }));

app.Run();
