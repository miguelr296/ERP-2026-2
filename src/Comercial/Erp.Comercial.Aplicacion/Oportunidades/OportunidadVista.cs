using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Oportunidades;

/// <summary>
/// Ficha inicial de la oportunidad: sus datos, el cliente que la origina y los productos
/// ofrecidos. La pantalla no necesita consultar tres rutas para reconstruir la cadena.
/// </summary>
public sealed record OportunidadVista(
    Guid Id,
    Guid ClienteId,
    string ClienteNombre,
    string ClienteDocumento,
    string Descripcion,
    string Canal,
    string Sede,
    string Responsable,
    string Estado,
    DateTimeOffset CreadoEn,
    string CreadoPor,
    IReadOnlyList<ProductoDeOportunidadVista> Productos)
{
    public static OportunidadVista Desde(Oportunidad oportunidad)
    {
        var productos = oportunidad.Productos
            .OrderBy(producto => producto.Codigo)
            .Select(ProductoDeOportunidadVista.Desde)
            .ToArray();

        return new OportunidadVista(
            oportunidad.Id,
            oportunidad.ClienteId,
            oportunidad.Cliente?.Nombre ?? string.Empty,
            oportunidad.Cliente?.Documento ?? string.Empty,
            oportunidad.Descripcion,
            oportunidad.Canal,
            oportunidad.Sede,
            oportunidad.Responsable,
            oportunidad.Estado,
            oportunidad.CreadoEn,
            oportunidad.CreadoPor,
            productos);
    }
}

/// <summary>Producto ofrecido en la oportunidad, tal como lo muestra la ficha.</summary>
public sealed record ProductoDeOportunidadVista(string Codigo, string Nombre, int Cantidad)
{
    public static ProductoDeOportunidadVista Desde(ProductoDeOportunidad producto)
    {
        return new ProductoDeOportunidadVista(
            producto.Codigo,
            producto.Nombre,
            producto.Cantidad);
    }
}
