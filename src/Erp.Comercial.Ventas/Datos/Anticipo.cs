using Erp.Compartido.Datos;

namespace Erp.Comercial.Ventas.Datos;

public class Anticipo
{
    public int Id { get; set; }
    public string NumeroOperacion { get; set; } = string.Empty;
    public int CotizacionId { get; set; }
    public decimal Monto { get; set; }
    public EstadoAnticipo Estado { get; set; }
    public DateTime FechaRegistro { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public int? UsuarioConfirmadorId { get; set; }
}
