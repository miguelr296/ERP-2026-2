namespace Erp.Comercial.Ventas.Datos;

public class OrdenVenta
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public int CotizacionId { get; set; }
    public EstadoOrdenVenta Estado { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Igv { get; set; }
    public decimal Total { get; set; }
}
