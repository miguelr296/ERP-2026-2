namespace Erp.Comercial.Aplicacion.Productos;

/// <summary>Producto y precio ficticio que una lista de demo ofrece para un canal y cliente.</summary>
public sealed class ProductoPrecioVista
{
    public string Codigo { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;

    public string Unidad { get; set; } = string.Empty;

    public string Canal { get; set; } = string.Empty;

    public string TipoCliente { get; set; } = string.Empty;

    public string ListaPrecio { get; set; } = string.Empty;

    public decimal PrecioUnitario { get; set; }

    public string Moneda { get; set; } = string.Empty;

    public string VigenteDesde { get; set; } = string.Empty;

    public string VigenteHasta { get; set; } = string.Empty;
}
