using Erp.Comercial.Aplicacion.Puertos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Erp.Comercial.Infraestructura;

/// <summary>
/// Registro de la infraestructura del módulo en el contenedor de dependencias.
/// La API solo llama a este método y no conoce EF Core ni el contexto.
/// </summary>
public static class RegistroDeComercial
{
    public static IServiceCollection AgregarInfraestructuraDeComercial(
        this IServiceCollection servicios,
        string cadenaDeConexion)
    {
        servicios.AddDbContext<ComercialContext>(opciones => opciones.UseSqlServer(cadenaDeConexion));
        servicios.AddScoped<IComercialRepositorio, ComercialRepositorio>();
        servicios.AddScoped<IUnidadDeTrabajo, UnidadDeTrabajo>();

        return servicios;
    }
}
