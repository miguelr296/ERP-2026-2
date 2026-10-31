var builder = WebApplication.CreateBuilder(args);

// D05: los controladores viven en la carpeta Api/ de cada subsistema y MVC los descubre solo.
builder.Services.AddControllers();

var app = builder.Build();

// D13: el front (wwwroot) se sirve desde la Api; index.html queda en "/".
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// Comprobación rápida de que la Api responde (se usa en la demo y en las pruebas).
app.MapGet("/api/salud", () => Results.Ok(new { estado = "ok" }));

app.Run();
