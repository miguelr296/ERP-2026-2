using System.Net;
using System.Net.Http.Json;
using Erp.Comercial.Aplicacion.Clientes;
using Erp.Comercial.Aplicacion.Historial;
using Erp.Comercial.Aplicacion.Oportunidades;
using Erp.Comercial.Dominio;
using Erp.Comercial.Infraestructura;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Erp.Api.Tests;

/// <summary>
/// Evidencia de COM-009 por HTTP: la oportunidad relaciona cliente, productos, sede y
/// responsable, y su ficha inicial se consulta en una sola respuesta (COM-R01).
/// InMemory no demuestra la clave foránea ni el comportamiento de SQL Server.
/// </summary>
public class OportunidadesApiTests
{
    private sealed class FabricaOportunidades : WebApplicationFactory<Program>
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

    private static async Task<ClienteVista> CrearClienteAsync(HttpClient api)
    {
        var alta = await api.PostAsJsonAsync(
            "/api/clientes",
            new NuevoCliente("Comercial Andina SAC", "20512345678", null, null));
        alta.EnsureSuccessStatusCode();
        return (await alta.Content.ReadFromJsonAsync<ClienteVista>())!;
    }

    private static NuevaOportunidad Datos(
        Guid clienteId,
        string canal = "Tienda",
        params NuevoProductoDeOportunidad[] productos)
    {
        return new NuevaOportunidad(
            clienteId,
            "Amoblado de sala y comedor",
            canal,
            "Lima Centro",
            "asesor.demo",
            productos);
    }

    [Fact]
    public async Task La_ficha_inicial_relaciona_cliente_productos_sede_y_responsable()
    {
        using var fabrica = new FabricaOportunidades();
        using var api = fabrica.CreateClient();
        var cliente = await CrearClienteAsync(api);

        var alta = await api.PostAsJsonAsync(
            "/api/oportunidades",
            Datos(cliente.Id, "Tienda",
                new NuevoProductoDeOportunidad("MUE-002", 1),
                new NuevoProductoDeOportunidad("MUE-001", 2)));

        Assert.Equal(HttpStatusCode.Created, alta.StatusCode);
        var creada = Assert.IsType<OportunidadVista>(
            await alta.Content.ReadFromJsonAsync<OportunidadVista>());
        Assert.Equal($"/api/oportunidades/{creada.Id}", alta.Headers.Location?.OriginalString);

        // La ficha se consulta por HTTP como la abriría la pantalla.
        var ficha = await api.GetFromJsonAsync<OportunidadVista>($"/api/oportunidades/{creada.Id}");
        Assert.NotNull(ficha);
        Assert.Equal(cliente.Id, ficha.ClienteId);
        Assert.Equal("Comercial Andina SAC", ficha.ClienteNombre);
        Assert.Equal("20512345678", ficha.ClienteDocumento);
        Assert.Equal("Lima Centro", ficha.Sede);
        Assert.Equal("asesor.demo", ficha.Responsable);
        Assert.Equal(EstadosOportunidad.Nueva, ficha.Estado);

        // El nombre lo aporta el catálogo y la cantidad la petición.
        Assert.Collection(
            ficha.Productos,
            sofa =>
            {
                Assert.Equal("MUE-001", sofa.Codigo);
                Assert.Equal("Sofá Nube 2 cuerpos", sofa.Nombre);
                Assert.Equal(2, sofa.Cantidad);
            },
            comedor =>
            {
                Assert.Equal("MUE-002", comedor.Codigo);
                Assert.Equal("Comedor Luma 4 sillas", comedor.Nombre);
                Assert.Equal(1, comedor.Cantidad);
            });

        var eventos = await api.GetFromJsonAsync<HistorialVista[]>(
            $"/api/historial/{TiposDocumento.Oportunidad}/{creada.Id}");
        var evento = Assert.Single(Assert.IsType<HistorialVista[]>(eventos));
        Assert.Equal("Alta de oportunidad", evento.Accion);
        Assert.Equal(EstadosOportunidad.Nueva, evento.EstadoNuevo);
    }

    [Fact]
    public async Task Una_oportunidad_sin_productos_responde_400_sin_guardar()
    {
        using var fabrica = new FabricaOportunidades();
        using var api = fabrica.CreateClient();
        var cliente = await CrearClienteAsync(api);

        var respuesta = await api.PostAsJsonAsync(
            "/api/oportunidades",
            Datos(cliente.Id));

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content
            .ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Equal("Regla de negocio", problema?.Title);
        Assert.Contains("producto", problema?.Detail);

        using var alcance = fabrica.Services.CreateScope();
        var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
        Assert.Equal(0, await contexto.Oportunidades.CountAsync());
        Assert.Equal(0, await contexto.ProductosDeOportunidad.CountAsync());
        Assert.Equal(1, await contexto.Historial.CountAsync());
    }

    [Theory]
    [InlineData("MUE-999", 1, "catálogo")]
    [InlineData("MUE-001", 0, "cantidad")]
    public async Task Un_producto_invalido_responde_400_sin_guardar(
        string codigo,
        int cantidad,
        string detalleEsperado)
    {
        using var fabrica = new FabricaOportunidades();
        using var api = fabrica.CreateClient();
        var cliente = await CrearClienteAsync(api);

        var respuesta = await api.PostAsJsonAsync(
            "/api/oportunidades",
            Datos(cliente.Id, "Tienda", new NuevoProductoDeOportunidad(codigo, cantidad)));

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content
            .ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Contains(detalleEsperado, problema?.Detail);

        using var alcance = fabrica.Services.CreateScope();
        var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
        Assert.Equal(0, await contexto.Oportunidades.CountAsync());
    }

    [Fact]
    public async Task Un_producto_de_otro_canal_se_rechaza()
    {
        using var fabrica = new FabricaOportunidades();
        using var api = fabrica.CreateClient();
        var cliente = await CrearClienteAsync(api);

        // El catálogo de demostración no tiene lista para el canal Empresarial.
        var respuesta = await api.PostAsJsonAsync(
            "/api/oportunidades",
            Datos(cliente.Id, "Empresarial", new NuevoProductoDeOportunidad("MUE-001", 1)));

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content
            .ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Contains("Empresarial", problema?.Detail);
    }

    [Fact]
    public async Task Un_producto_repetido_se_rechaza()
    {
        using var fabrica = new FabricaOportunidades();
        using var api = fabrica.CreateClient();
        var cliente = await CrearClienteAsync(api);

        var respuesta = await api.PostAsJsonAsync(
            "/api/oportunidades",
            Datos(cliente.Id, "Tienda",
                new NuevoProductoDeOportunidad("MUE-001", 1),
                new NuevoProductoDeOportunidad("MUE-001", 3)));

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content
            .ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Contains("repetir", problema?.Detail);
    }

    [Fact]
    public async Task Tesoreria_no_puede_registrar_oportunidades_por_HTTP()
    {
        using var fabrica = new FabricaOportunidades();
        using var api = fabrica.CreateClient();
        var cliente = await CrearClienteAsync(api);
        api.DefaultRequestHeaders.Add("X-Rol", UsuarioSimulado.RolTesoreria);

        var respuesta = await api.PostAsJsonAsync(
            "/api/oportunidades",
            Datos(cliente.Id, "Tienda", new NuevoProductoDeOportunidad("MUE-001", 1)));

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content
            .ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Contains("rol", problema?.Detail);
    }

    [Fact]
    public async Task Una_oportunidad_inexistente_devuelve_no_encontrado()
    {
        using var fabrica = new FabricaOportunidades();
        using var api = fabrica.CreateClient();

        var respuesta = await api.GetAsync($"/api/oportunidades/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, respuesta.StatusCode);
    }
}
