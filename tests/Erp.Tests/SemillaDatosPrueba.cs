using Erp.Api.Datos;
using Erp.Comercial.Ventas.Datos;
using Erp.Compartido.Datos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Erp.Pruebas;

public class SemillaDatosPrueba
{
    [Fact]
    public void Semilla_ContieneOchoMuebles()
    {
        using var contexto = CrearContexto();
        var datos = ModeloDeDiseno(contexto).FindEntityType(typeof(Mueble))!.GetSeedData();

        Assert.Equal(8, datos.Count());
    }

    [Fact]
    public void Semilla_ContieneLosCatorceRoles()
    {
        using var contexto = CrearContexto();
        var datos = ModeloDeDiseno(contexto).FindEntityType(typeof(Usuario))!.GetSeedData();

        Assert.Equal(14, datos.Count());
        Assert.Equal(14, datos.Select(usuario => usuario[nameof(Usuario.Rol)]).Distinct().Count());
    }

    [Fact]
    public void Semilla_ContieneListaRetailVigente()
    {
        using var contexto = CrearContexto();
        var lista = Assert.Single(ModeloDeDiseno(contexto).FindEntityType(typeof(ListaPrecio))!.GetSeedData());

        Assert.Equal("Retail", lista[nameof(ListaPrecio.Nombre)]);
        Assert.Equal(CanalVenta.Retail, lista[nameof(ListaPrecio.Canal)]);
        Assert.Equal(EstadoListaPrecio.Vigente, lista[nameof(ListaPrecio.Estado)]);
    }

    private static ErpDbContext CrearContexto()
    {
        var opciones = new DbContextOptionsBuilder<ErpDbContext>()
            .UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=NoSeConecta;Trusted_Connection=True")
            .Options;

        return new ErpDbContext(opciones);
    }

    private static IModel ModeloDeDiseno(ErpDbContext contexto)
    {
        return contexto.GetService<IDesignTimeModel>().Model;
    }
}
