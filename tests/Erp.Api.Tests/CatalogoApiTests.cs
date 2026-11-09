using System.Net;
using System.Net.Http.Json;
using Erp.Comercial.Aplicacion.Productos;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Erp.Api.Tests;

public sealed class CatalogoApiTests
{
    [Theory]
    [InlineData("Tienda", 1299.90, "LP-TIENDA-RETAIL-2026-11")]
    [InlineData("Web", 1249.90, "LP-WEB-RETAIL-2026-11")]
    public async Task Consulta_productos_y_precio_de_lista_segun_canal_y_tipo(
        string canal,
        decimal precioEsperadoSofa,
        string listaEsperada)
    {
        using var fabrica = new WebApplicationFactory<Program>();
        using var api = fabrica.CreateClient();

        var respuesta = await api.GetAsync($"/api/catalogo?canal={canal}&tipoCliente=Retail");
        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);

        var productos = Assert.IsType<ProductoPrecioVista[]>(
            await respuesta.Content.ReadFromJsonAsync<ProductoPrecioVista[]>());
        Assert.Equal(2, productos.Length);

        var sofa = Assert.Single(productos, producto => producto.Codigo == "MUE-001");
        Assert.Equal(precioEsperadoSofa, sofa.PrecioUnitario);
        Assert.Equal("PEN", sofa.Moneda);
        Assert.Equal(listaEsperada, sofa.ListaPrecio);
    }

    [Fact]
    public async Task Canal_o_tipo_sin_datos_devuelve_lista_vacia()
    {
        using var fabrica = new WebApplicationFactory<Program>();
        using var api = fabrica.CreateClient();

        var productos = await api.GetFromJsonAsync<ProductoPrecioVista[]>(
            "/api/catalogo?canal=Tienda&tipoCliente=Empresarial");

        Assert.Empty(Assert.IsType<ProductoPrecioVista[]>(productos));
    }
}
