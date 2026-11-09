namespace Erp.Comercial.Aplicacion.Productos;

/// <summary>Consulta los productos de demo con la lista correspondiente al canal y tipo de cliente.</summary>
public interface ICatalogoCasoUso
{
    IReadOnlyList<ProductoPrecioVista> Consultar(string? canal, string? tipoCliente);
}
