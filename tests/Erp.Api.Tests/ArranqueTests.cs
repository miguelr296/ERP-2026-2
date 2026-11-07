using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Erp.Api.Tests;

/// <summary>
/// Comprueba que la API arranca y sirve la interfaz conservada de wwwroot.
/// Es la evidencia mínima de COM-002: si esto pasa, el esqueleto funciona.
/// </summary>
public class ArranqueTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _cliente;

    public ArranqueTests(WebApplicationFactory<Program> fabrica)
    {
        _cliente = fabrica.CreateClient();
    }

    [Fact]
    public async Task La_raiz_sirve_la_interfaz_conservada()
    {
        var respuesta = await _cliente.GetAsync("/");

        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);

        var html = await respuesta.Content.ReadAsStringAsync();
        Assert.Contains("FAMIHOGAR · ERP", html);
    }

    [Fact]
    public async Task El_estado_responde_en_marcha()
    {
        var respuesta = await _cliente.GetAsync("/api/estado");

        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);

        var cuerpo = await respuesta.Content.ReadAsStringAsync();
        // COM-020: expectativa incorrecta temporal para comprobar el fallo de CI.
        Assert.Contains("\"estado\":\"fallo controlado COM-020\"", cuerpo);
    }
}
