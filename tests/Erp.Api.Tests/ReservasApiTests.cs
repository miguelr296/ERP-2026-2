using System.Net;
using System.Net.Http.Json;
using Erp.Comercial.Aplicacion.Clientes;
using Erp.Comercial.Aplicacion.Historial;
using Erp.Comercial.Aplicacion.Oportunidades;
using Erp.Comercial.Aplicacion.Reservas;
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
/// Evidencia de COM-008 por HTTP: la reserva simulada se confirma con su historial y el
/// rechazo del proveedor no deja documento ni evento (COM-T01). InMemory no demuestra
/// la restricción de clave foránea ni el comportamiento de SQL Server.
/// </summary>
public class ReservasApiTests
{
    private sealed class FabricaReservas : WebApplicationFactory<Program>
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

    private static async Task<Guid> CrearOportunidadAsync(HttpClient api, string documento = "DEMO-C008-A")
    {
        var altaCliente = await api.PostAsJsonAsync(
            "/api/clientes",
            new NuevoCliente("Cliente Demo Reserva", documento, null, null));
        altaCliente.EnsureSuccessStatusCode();
        var cliente = await altaCliente.Content.ReadFromJsonAsync<ClienteVista>();

        var altaOportunidad = await api.PostAsJsonAsync(
            "/api/oportunidades",
            new NuevaOportunidad(
                cliente!.Id,
                "Compra de 2 sofás",
                "Tienda",
                "Lima Centro",
                "asesor.demo"));
        altaOportunidad.EnsureSuccessStatusCode();
        var oportunidad = await altaOportunidad.Content.ReadFromJsonAsync<OportunidadVista>();

        return oportunidad!.Id;
    }

    [Fact]
    public async Task La_reserva_aceptada_conserva_identificador_vigencia_e_historial()
    {
        using var fabrica = new FabricaReservas();
        using var api = fabrica.CreateClient();
        var oportunidadId = await CrearOportunidadAsync(api);

        var respuesta = await api.PostAsJsonAsync(
            $"/api/oportunidades/{oportunidadId}/reservas",
            new NuevaReserva("MUE-001", 2));

        Assert.Equal(HttpStatusCode.Created, respuesta.StatusCode);
        var reserva = Assert.IsType<ReservaVista>(await respuesta.Content.ReadFromJsonAsync<ReservaVista>());
        Assert.Equal($"/api/reservas/{reserva.Id}", respuesta.Headers.Location?.OriginalString);
        Assert.Equal(oportunidadId, reserva.OportunidadId);
        Assert.Equal(EstadosReserva.Comprometida, reserva.Estado);
        Assert.StartsWith("RES-", reserva.Identificador);
        Assert.Equal("Logística simulada", reserva.Simulacion);
        Assert.InRange(
            reserva.VigenteHasta - reserva.SolicitadaEn,
            TimeSpan.FromHours(47.9),
            TimeSpan.FromHours(48.1));

        var porId = await api.GetFromJsonAsync<ReservaVista>($"/api/reservas/{reserva.Id}");
        Assert.Equal(reserva, porId);

        var eventos = await api.GetFromJsonAsync<HistorialVista[]>(
            $"/api/historial/Reserva/{reserva.Id}");
        var evento = Assert.Single(Assert.IsType<HistorialVista[]>(eventos));
        Assert.Equal("Reserva comprometida", evento.Accion);
        Assert.Contains(reserva.Identificador, evento.Motivo);

        using var alcance = fabrica.Services.CreateScope();
        var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
        Assert.Equal(1, await contexto.Reservas.CountAsync());
    }

    [Fact]
    public async Task La_reserva_rechazada_por_stock_no_deja_documento_ni_historial()
    {
        using var fabrica = new FabricaReservas();
        using var api = fabrica.CreateClient();
        var oportunidadId = await CrearOportunidadAsync(api);

        // El proveedor simulado tiene 999 unidades de demostración.
        var respuesta = await api.PostAsJsonAsync(
            $"/api/oportunidades/{oportunidadId}/reservas",
            new NuevaReserva("MUE-001", 1000));

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content
            .ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Contains("rechazó", problema?.Detail);
        Assert.Contains("999", problema?.Detail);

        using var alcance = fabrica.Services.CreateScope();
        var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
        Assert.Equal(0, await contexto.Reservas.CountAsync());
        Assert.Equal(1, await contexto.Historial.CountAsync(evento =>
            evento.DocumentoTipo == TiposDocumento.Oportunidad));
    }

    [Fact]
    public async Task La_reserva_exige_una_oportunidad_existente()
    {
        using var fabrica = new FabricaReservas();
        using var api = fabrica.CreateClient();

        var respuesta = await api.PostAsJsonAsync(
            $"/api/oportunidades/{Guid.NewGuid()}/reservas",
            new NuevaReserva("MUE-001", 2));

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content
            .ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Contains("oportunidad", problema?.Detail);

        using var alcance = fabrica.Services.CreateScope();
        Assert.Equal(0, await alcance.ServiceProvider
            .GetRequiredService<ComercialContext>().Reservas.CountAsync());
    }

    [Theory]
    [InlineData("", 1)]
    [InlineData("MUE-001", 0)]
    public async Task Una_solicitud_invalida_no_llega_al_proveedor(string producto, int cantidad)
    {
        using var fabrica = new FabricaReservas();
        using var api = fabrica.CreateClient();
        var oportunidadId = await CrearOportunidadAsync(api);

        var respuesta = await api.PostAsJsonAsync(
            $"/api/oportunidades/{oportunidadId}/reservas",
            new NuevaReserva(producto, cantidad));

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        using var alcance = fabrica.Services.CreateScope();
        Assert.Equal(0, await alcance.ServiceProvider
            .GetRequiredService<ComercialContext>().Reservas.CountAsync());
    }

    [Fact]
    public async Task Tesoreria_no_puede_reservar_por_HTTP()
    {
        using var fabrica = new FabricaReservas();
        using var api = fabrica.CreateClient();
        var oportunidadId = await CrearOportunidadAsync(api);
        api.DefaultRequestHeaders.Add("X-Rol", UsuarioSimulado.RolTesoreria);

        var respuesta = await api.PostAsJsonAsync(
            $"/api/oportunidades/{oportunidadId}/reservas",
            new NuevaReserva("MUE-001", 1));

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        var problema = await respuesta.Content
            .ReadFromJsonAsync<Microsoft.AspNetCore.Mvc.ProblemDetails>();
        Assert.Contains("rol", problema?.Detail);
        using var alcance = fabrica.Services.CreateScope();
        Assert.Equal(0, await alcance.ServiceProvider
            .GetRequiredService<ComercialContext>().Reservas.CountAsync());
    }
}
