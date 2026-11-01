namespace Erp.Comercial.Ventas.Datos;

public class Cotizacion
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    // Referencia de origen en CRM; se resuelve por el contrato de ese módulo.
    public int OportunidadId { get; set; }
    public EstadoCotizacion Estado { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaEnvio { get; set; }
    public DateTime? FechaRespuesta { get; set; }
    public DateTime FechaVencimiento { get; set; }
    public int PlazoEntregaDias { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Igv { get; set; }
    public decimal Total { get; set; }
    public string MotivoRechazo { get; set; } = string.Empty;
    public bool PagoValidado { get; set; }
}
