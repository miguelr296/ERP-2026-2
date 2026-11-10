using System.Net;
using System.Net.Http.Json;
using Erp.Comercial.Aplicacion.Clientes;
using Erp.Comercial.Aplicacion.Cotizaciones;
using Erp.Comercial.Aplicacion.Oportunidades;
using Erp.Comercial.Aplicacion.Productos;
using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Infraestructura;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Erp.Api.Tests;

public class CalculoCotizacionApiTests
{
    // Sustituto solo para pruebas: no acredita concurrencia ni secuencias SQL.
    private sealed class NumeradorPrueba : INumeradorCotizaciones
    {
        private long _numero;
        public Task<long> SiguienteAsync(CancellationToken cancelacion = default) =>
            Task.FromResult(Interlocked.Increment(ref _numero));
    }
    private sealed class RelojDemo : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => new(2026, 11, 10, 2, 0, 0, TimeSpan.Zero);
    }

    private sealed class Fabrica : WebApplicationFactory<Program>
    {
        private readonly string _base = Guid.NewGuid().ToString();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Production");
            builder.ConfigureServices(servicios =>
            {
                servicios.RemoveAll<ComercialContext>();
                servicios.RemoveAll<DbContextOptions<ComercialContext>>();
                servicios.RemoveAll<IDbContextOptionsConfiguration<ComercialContext>>();
                servicios.AddDbContext<ComercialContext>(opciones => opciones.UseInMemoryDatabase(_base));
                servicios.RemoveAll<TimeProvider>();
                servicios.AddSingleton<TimeProvider>(new RelojDemo());
                servicios.RemoveAll<INumeradorCotizaciones>();
                servicios.AddSingleton<INumeradorCotizaciones>(new NumeradorPrueba());
            });
        }
    }

    private static async Task<Guid> CrearOportunidad(HttpClient api)
    {
        var altaCliente = await api.PostAsJsonAsync("/api/clientes", new NuevoCliente("Demo COM012", "C012-DEMO", null, null));
        altaCliente.EnsureSuccessStatusCode();
        var cliente = (await altaCliente.Content.ReadFromJsonAsync<ClienteVista>())!;
        var alta = await api.PostAsJsonAsync("/api/oportunidades", new NuevaOportunidad(
            cliente.Id, "Sala demo", "Tienda", "Lima", "asesor.demo",
            [new("MUE-001", 2), new("MUE-002", 1)]));
        alta.EnsureSuccessStatusCode();
        return (await alta.Content.ReadFromJsonAsync<OportunidadVista>())!.Id;
    }

    [Fact]
    public async Task Calcula_desde_oportunidad_con_precios_del_servidor_y_fecha_de_Peru()
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var id = await CrearOportunidad(api);
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{id}/calculo-cotizacion", new { tipoCliente = "Retail" });
        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);
        var vista = (await respuesta.Content.ReadFromJsonAsync<CalculoCotizacionVista>())!;
        Assert.Equal(id, vista.OportunidadId);
        Assert.Equal("LP-TIENDA-RETAIL-2026-11", vista.ListaPrecio);
        Assert.Equal("PEN", vista.Moneda);
        Assert.Equal(new DateOnly(2026, 11, 9), vista.FechaCalculo);
        Assert.Equal(new DateOnly(2026, 11, 16), vista.VigenteHasta);
        Assert.Equal(7, vista.PlazoEntregaDias);
        Assert.Equal(3499.70m, vista.Calculo.Subtotal);
        Assert.Equal(629.95m, vista.Calculo.Igv);
        Assert.Equal(4129.65m, vista.Calculo.Total);

        // Calcular no emite documentos ni añade eventos: solo quedan las dos altas.
        using var alcance = fabrica.Services.CreateScope();
        Assert.Equal(2, await alcance.ServiceProvider.GetRequiredService<ComercialContext>().Historial.CountAsync());
    }

    [Theory]
    [InlineData("precioUnitario")]
    [InlineData("cantidad")]
    [InlineData("lineas")]
    [InlineData("tasaIgv")]
    public async Task Rechaza_campos_que_intentan_manipular_el_calculo(string campo)
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var id = await CrearOportunidad(api);
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{id}/calculo-cotizacion",
            new Dictionary<string, object> { ["tipoCliente"] = "Retail", [campo] = 1 });
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
    }

    [Theory]
    [InlineData("")]
    [InlineData("Empresarial")]
    public async Task Rechaza_tipo_vacio_o_sin_lista(string tipo)
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var id = await CrearOportunidad(api);
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{id}/calculo-cotizacion", new { tipoCliente = tipo });
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
    }

    [Fact]
    public async Task Una_oportunidad_inexistente_devuelve_404()
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{Guid.NewGuid()}/calculo-cotizacion", new { tipoCliente = "Retail" });
        Assert.Equal(HttpStatusCode.NotFound, respuesta.StatusCode);
    }

    [Fact]
    public async Task Rechaza_lista_vencida_aunque_la_oportunidad_ya_exista()
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var id = await CrearOportunidad(api);
        // El catálogo de demo mantiene objetos configurables: simulamos una lista vencida.
        var catalogo = fabrica.Services.GetRequiredService<ICatalogoCasoUso>();
        foreach (var producto in catalogo.Consultar("Tienda", "Retail")) producto.VigenteHasta = "2026-11-08";
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{id}/calculo-cotizacion", new { tipoCliente = "Retail" });
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
    }

    [Fact]
    public async Task Rechaza_calcular_con_rol_Tesoreria()
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var id = await CrearOportunidad(api);
        api.DefaultRequestHeaders.Add("X-Rol", "Tesoreria");
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{id}/calculo-cotizacion", new { tipoCliente = "Retail" });
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
    }

    [Theory]
    [InlineData("2026-11-10", "2026-11-30", false)]
    [InlineData("fecha-invalida", "2026-11-30", false)]
    [InlineData("2026-11-09", "2026-11-09", true)]
    public async Task Evalua_fechas_de_lista_con_limites_inclusivos(string desde, string hasta, bool aceptada)
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var id = await CrearOportunidad(api);
        foreach (var producto in fabrica.Services.GetRequiredService<ICatalogoCasoUso>().Consultar("Tienda", "Retail"))
        {
            producto.VigenteDesde = desde;
            producto.VigenteHasta = hasta;
        }
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{id}/calculo-cotizacion", new { tipoCliente = "Retail" });
        Assert.Equal(aceptada ? HttpStatusCode.OK : HttpStatusCode.BadRequest, respuesta.StatusCode);
    }

    [Theory]
    [InlineData("lista")]
    [InlineData("moneda")]
    public async Task Rechaza_mezclar_listas_o_monedas(string campo)
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var id = await CrearOportunidad(api);
        var producto = fabrica.Services.GetRequiredService<ICatalogoCasoUso>().Consultar("Tienda", "Retail")[0];
        if (campo == "lista") producto.ListaPrecio = "OTRA-LISTA";
        else producto.Moneda = "USD";
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{id}/calculo-cotizacion", new { tipoCliente = "Retail" });
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
    }

    [Fact]
    public async Task Emite_consulta_y_reintenta_sin_duplicar_ni_recalcular_el_documento()
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var origen = await CrearOportunidad(api);
        var datos = new NuevaCotizacion(Guid.NewGuid(), "Retail");
        var ruta = $"/api/oportunidades/{origen}/cotizaciones";
        var alta = await api.PostAsJsonAsync(ruta, datos);
        Assert.Equal(HttpStatusCode.Created, alta.StatusCode);
        var creada = (await alta.Content.ReadFromJsonAsync<CotizacionVista>())!;
        Assert.Equal("COT-2026-00001", creada.Correlativo);
        Assert.Equal("Borrador", creada.Estado);
        Assert.Equal(origen, creada.Origen.Id);
        Assert.Equal(creada.Origen.ClienteId, creada.ClienteId);
        Assert.Equal(4129.65m, creada.Total);
        Assert.Equal(2, creada.Lineas.Count);
        Assert.Equal("Emisión de cotización", Assert.Single(creada.Historial).Accion);

        // Aunque cambie o venza la lista, consultar/reintentar conserva la copia emitida.
        foreach (var p in fabrica.Services.GetRequiredService<ICatalogoCasoUso>().Consultar("Tienda", "Retail"))
        {
            p.PrecioUnitario = 1m;
            p.VigenteHasta = "2020-01-01";
        }
        var repetida = await api.PostAsJsonAsync(ruta, datos);
        Assert.Equal(HttpStatusCode.OK, repetida.StatusCode);
        Assert.Equal(creada.Id, (await repetida.Content.ReadFromJsonAsync<CotizacionVista>())!.Id);
        var ficha = (await api.GetFromJsonAsync<CotizacionVista>($"/api/cotizaciones/{creada.Id}"))!;
        Assert.Equal(creada.Total, ficha.Total);
        Assert.Equal(1299.90m, ficha.Lineas[0].PrecioUnitario);
        using var alcance = fabrica.Services.CreateScope();
        var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
        Assert.Equal(1, await contexto.Cotizaciones.CountAsync());
        Assert.Equal(3, await contexto.Historial.CountAsync());
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Una_referencia_no_puede_reutilizarse_para_otra_operacion(bool cambiarOrigen)
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var origen = await CrearOportunidad(api);
        var solicitud = Guid.NewGuid();
        (await api.PostAsJsonAsync($"/api/oportunidades/{origen}/cotizaciones", new NuevaCotizacion(solicitud, "Retail")))
            .EnsureSuccessStatusCode();
        var respuesta = await api.PostAsJsonAsync(
            $"/api/oportunidades/{(cambiarOrigen ? Guid.NewGuid() : origen)}/cotizaciones",
            new NuevaCotizacion(solicitud, cambiarOrigen ? "Retail" : "Empresarial"));
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
    }

    [Fact]
    public async Task Emitir_vuelve_a_validar_la_lista_y_no_guarda_el_calculo_anterior()
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var origen = await CrearOportunidad(api);
        (await api.PostAsJsonAsync($"/api/oportunidades/{origen}/calculo-cotizacion", new { tipoCliente = "Retail" }))
            .EnsureSuccessStatusCode();
        foreach (var p in fabrica.Services.GetRequiredService<ICatalogoCasoUso>().Consultar("Tienda", "Retail"))
            p.VigenteHasta = "2026-11-08";
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{origen}/cotizaciones", new NuevaCotizacion(Guid.NewGuid(), "Retail"));
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        using var alcance = fabrica.Services.CreateScope();
        var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
        Assert.Equal(0, await contexto.Cotizaciones.CountAsync());
        Assert.Equal(2, await contexto.Historial.CountAsync());
    }

    [Fact]
    public async Task Cotizacion_inexistente_devuelve_404()
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        Assert.Equal(HttpStatusCode.NotFound, (await api.GetAsync($"/api/cotizaciones/{Guid.NewGuid()}")).StatusCode);
    }

    [Theory]
    [InlineData("precioUnitario")]
    [InlineData("total")]
    public async Task Emitir_rechaza_precios_o_totales_del_cliente(string campo)
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var origen = await CrearOportunidad(api);
        var datos = new Dictionary<string, object>
        {
            ["solicitudId"] = Guid.NewGuid(), ["tipoCliente"] = "Retail", [campo] = 1
        };
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{origen}/cotizaciones", datos);
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
    }

    [Fact]
    public async Task Cada_solicitud_nueva_recibe_otro_correlativo()
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var origen = await CrearOportunidad(api);
        var primera = await api.PostAsJsonAsync($"/api/oportunidades/{origen}/cotizaciones", new NuevaCotizacion(Guid.NewGuid(), "Retail"));
        var segunda = await api.PostAsJsonAsync($"/api/oportunidades/{origen}/cotizaciones", new NuevaCotizacion(Guid.NewGuid(), "Retail"));
        primera.EnsureSuccessStatusCode(); segunda.EnsureSuccessStatusCode();
        Assert.NotEqual((await primera.Content.ReadFromJsonAsync<CotizacionVista>())!.Correlativo,
            (await segunda.Content.ReadFromJsonAsync<CotizacionVista>())!.Correlativo);
    }

    [Theory]
    [InlineData("Asesor", true)]
    [InlineData("Tesoreria", false)]
    public async Task No_emite_sin_referencia_o_con_rol_incorrecto(string rol, bool referenciaVacia)
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var origen = await CrearOportunidad(api);
        api.DefaultRequestHeaders.Add("X-Rol", rol);
        var datos = new NuevaCotizacion(referenciaVacia ? Guid.Empty : Guid.NewGuid(), "Retail");
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{origen}/cotizaciones", datos);
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        using var alcance = fabrica.Services.CreateScope();
        var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
        Assert.Equal(0, await contexto.Cotizaciones.CountAsync());
        Assert.Equal(2, await contexto.Historial.CountAsync());
    }

    [Fact]
    public async Task No_emite_para_un_cliente_inactivo()
    {
        using var fabrica = new Fabrica();
        using var api = fabrica.CreateClient();
        var origen = await CrearOportunidad(api);
        using (var alcance = fabrica.Services.CreateScope())
        {
            var contexto = alcance.ServiceProvider.GetRequiredService<ComercialContext>();
            (await contexto.Clientes.SingleAsync()).Desactivar();
            await contexto.SaveChangesAsync();
        }
        var respuesta = await api.PostAsJsonAsync($"/api/oportunidades/{origen}/cotizaciones",
            new NuevaCotizacion(Guid.NewGuid(), "Retail"));
        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        using var verificacion = fabrica.Services.CreateScope();
        Assert.Equal(0, await verificacion.ServiceProvider.GetRequiredService<ComercialContext>().Cotizaciones.CountAsync());
    }
}
