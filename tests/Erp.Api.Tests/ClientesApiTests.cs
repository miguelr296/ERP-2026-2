using System.Net;
using System.Net.Http.Json;
using Erp.Comercial.Aplicacion.Clientes;
using Erp.Comercial.Aplicacion.Historial;
using Erp.Comercial.Infraestructura;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Erp.Api.Tests;

/// <summary>
/// Recorre HTTP, Aplicación e Infraestructura con datos aislados por prueba.
/// InMemory no demuestra persistencia ni restricciones de SQL Server.
/// </summary>
public class ClientesApiTests
{
    private sealed class FabricaClientes : WebApplicationFactory<Program>
    {
        private readonly string _base = Guid.NewGuid().ToString();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(servicios =>
            {
                servicios.RemoveAll<ComercialContext>();
                servicios.RemoveAll<DbContextOptions<ComercialContext>>();
                servicios.RemoveAll<IDbContextOptionsConfiguration<ComercialContext>>();
                servicios.AddDbContext<ComercialContext>(opciones => opciones.UseInMemoryDatabase(_base));
            });
        }
    }

    private static NuevoCliente Datos(string documento = "DEMO-C006-A") =>
        new("Cliente Demo COM006 A", documento, "cliente@com006.test", "999000006");

    [Fact]
    public async Task Buscar_crear_y_reutilizar_cliente_conserva_identificador_e_historial()
    {
        using var fabrica = new FabricaClientes();
        using var api = fabrica.CreateClient();
        var inicial = await api.GetFromJsonAsync<ClienteVista[]>("/api/clientes?documento=DEMO-C006-A");
        Assert.Empty(Assert.IsType<ClienteVista[]>(inicial));

        var alta = await api.PostAsJsonAsync("/api/clientes", Datos());
        Assert.Equal(HttpStatusCode.Created, alta.StatusCode);
        var creado = Assert.IsType<ClienteVista>(await alta.Content.ReadFromJsonAsync<ClienteVista>());
        Assert.Equal($"/api/clientes/{creado.Id}", alta.Headers.Location?.OriginalString);

        // Otra petición HTTP usa otro alcance de dependencias y el mismo almacén de prueba.
        var encontrados = await api.GetFromJsonAsync<ClienteVista[]>("/api/clientes?documento=%20DEMO-C006-A%20");
        var encontrado = Assert.Single(Assert.IsType<ClienteVista[]>(encontrados));
        Assert.Equal(creado, encontrado);
        var porId = await api.GetFromJsonAsync<ClienteVista>($"/api/clientes/{encontrado.Id}");
        Assert.Equal(creado, porId);

        await api.GetAsync("/api/clientes?documento=DEMO-C006-A");
        var eventos = await api.GetFromJsonAsync<HistorialVista[]>($"/api/historial/Cliente/{creado.Id}");
        Assert.Equal("Alta de cliente", Assert.Single(Assert.IsType<HistorialVista[]>(eventos)).Accion);
        using var alcance = fabrica.Services.CreateScope();
        var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
        Assert.Equal(1, await contexto.Clientes.CountAsync());
    }

    [Fact]
    public async Task Buscar_por_documento_es_exacto_y_no_devuelve_otro_cliente()
    {
        using var fabrica = new FabricaClientes();
        using var api = fabrica.CreateClient();
        (await api.PostAsJsonAsync("/api/clientes", Datos("DEMO-C006-A"))).EnsureSuccessStatusCode();
        (await api.PostAsJsonAsync("/api/clientes", Datos("DEMO-C006-AB"))).EnsureSuccessStatusCode();

        var encontrados = await api.GetFromJsonAsync<ClienteVista[]>("/api/clientes?documento=DEMO-C006-A");
        Assert.Equal("DEMO-C006-A", Assert.Single(Assert.IsType<ClienteVista[]>(encontrados)).Documento);
        var vacio = await api.GetFromJsonAsync<ClienteVista[]>("/api/clientes?documento=NO-EXISTE");
        Assert.Empty(Assert.IsType<ClienteVista[]>(vacio));
    }

    [Theory]
    [InlineData("/api/clientes")]
    [InlineData("/api/clientes?documento=")]
    [InlineData("/api/clientes?documento=%20%20")]
    [InlineData("/api/clientes?documento=123456789012345678901")]
    public async Task Una_busqueda_invalida_devuelve_error_comprensible(string ruta)
    {
        using var fabrica = new FabricaClientes();
        using var api = fabrica.CreateClient();
        var respuesta = await api.GetAsync(ruta);
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content.ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Equal("Regla de negocio", problema?.Title);
        Assert.Contains("documento", problema?.Detail);
    }

    [Fact]
    public async Task Un_id_inexistente_devuelve_no_encontrado()
    {
        using var fabrica = new FabricaClientes();
        using var api = fabrica.CreateClient();
        var respuesta = await api.GetAsync($"/api/clientes/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, respuesta.StatusCode);
    }

    [Fact]
    public async Task Un_alta_repetida_se_rechaza_sin_duplicar_cliente_ni_historial()
    {
        using var fabrica = new FabricaClientes();
        using var api = fabrica.CreateClient();
        var alta = await api.PostAsJsonAsync("/api/clientes", Datos());
        alta.EnsureSuccessStatusCode();
        var cliente = Assert.IsType<ClienteVista>(await alta.Content.ReadFromJsonAsync<ClienteVista>());
        var duplicada = await api.PostAsJsonAsync("/api/clientes", Datos());
        Assert.Equal(HttpStatusCode.BadRequest, duplicada.StatusCode);
        var problema = await duplicada.Content.ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Contains("Ya existe", problema?.Detail);

        var encontrados = await api.GetFromJsonAsync<ClienteVista[]>("/api/clientes?documento=DEMO-C006-A");
        Assert.Equal(cliente.Id, Assert.Single(Assert.IsType<ClienteVista[]>(encontrados)).Id);
        var eventos = await api.GetFromJsonAsync<HistorialVista[]>($"/api/historial/Cliente/{cliente.Id}");
        Assert.Single(Assert.IsType<HistorialVista[]>(eventos));
        using var alcance = fabrica.Services.CreateScope();
        Assert.Equal(1, await alcance.ServiceProvider.GetRequiredService<ComercialContext>().Clientes.CountAsync());
    }

    [Theory]
    [InlineData("", "DEMO-C006-A")]
    [InlineData("Cliente Demo", "")]
    public async Task Un_alta_sin_datos_obligatorios_no_guarda_datos(string nombre, string documento)
    {
        using var fabrica = new FabricaClientes();
        using var api = fabrica.CreateClient();
        var respuesta = await api.PostAsJsonAsync("/api/clientes", new NuevoCliente(nombre, documento, null, null));
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        using var alcance = fabrica.Services.CreateScope();
        var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
        Assert.Equal(0, await contexto.Clientes.CountAsync());
        Assert.Equal(0, await contexto.Historial.CountAsync());
    }

    [Fact]
    public async Task Tesoreria_no_puede_crear_clientes_por_HTTP()
    {
        using var fabrica = new FabricaClientes();
        using var api = fabrica.CreateClient();
        api.DefaultRequestHeaders.Add("X-Rol", "Tesoreria");
        var respuesta = await api.PostAsJsonAsync("/api/clientes", Datos());
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content.ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Contains("rol", problema?.Detail);
        using var alcance = fabrica.Services.CreateScope();
        Assert.Equal(0, await alcance.ServiceProvider.GetRequiredService<ComercialContext>().Clientes.CountAsync());
    }
}
