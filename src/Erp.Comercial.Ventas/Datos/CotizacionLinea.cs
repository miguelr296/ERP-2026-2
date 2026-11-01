namespace Erp.Comercial.Ventas.Datos;

public class CotizacionLinea
{
    public int Id { get; set; }
    public int CotizacionId { get; set; }
    public int MuebleId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }
}
