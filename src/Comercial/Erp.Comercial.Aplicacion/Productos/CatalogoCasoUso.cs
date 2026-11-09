namespace Erp.Comercial.Aplicacion.Productos;

/// <summary>Consulta el conjunto ficticio de productos y precios configurado para la demo.</summary>
public sealed class CatalogoCasoUso : ICatalogoCasoUso
{
    private readonly IReadOnlyList<ProductoPrecioVista> _productos;

    public CatalogoCasoUso(IEnumerable<ProductoPrecioVista> productos)
    {
        _productos = productos.ToArray();
    }

    public IReadOnlyList<ProductoPrecioVista> Consultar(string? canal, string? tipoCliente)
    {
        return _productos
            .Where(producto => producto.Canal == canal && producto.TipoCliente == tipoCliente)
            .OrderBy(producto => producto.Codigo)
            .ToArray();
    }

    public ProductoPrecioVista? Buscar(string codigo, string canal)
    {
        return _productos.FirstOrDefault(producto =>
            string.Equals(producto.Codigo, codigo, StringComparison.OrdinalIgnoreCase)
            && string.Equals(producto.Canal, canal, StringComparison.OrdinalIgnoreCase));
    }
}
