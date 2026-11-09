namespace Erp.Comercial.Aplicacion.Productos;

/// <summary>Consulta los productos de demo con la lista correspondiente al canal y tipo de cliente.</summary>
public interface ICatalogoCasoUso
{
    IReadOnlyList<ProductoPrecioVista> Consultar(string? canal, string? tipoCliente);

    /// <summary>
    /// Busca un producto por código dentro de un canal. Sirve para comprobar que la
    /// oportunidad solo ofrece productos que la lista del canal contiene.
    /// </summary>
    ProductoPrecioVista? Buscar(string codigo, string canal);
}
