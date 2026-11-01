using Erp.Compartido.Datos;

namespace Erp.Comercial.Crm.Datos;

public class Oportunidad
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public int ClienteId { get; set; }
    public CanalVenta Canal { get; set; }
    public int SedeId { get; set; }
    public int VendedorId { get; set; }
    public EstadoOportunidad Estado { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaCierre { get; set; }
    public string MotivoPerdida { get; set; } = string.Empty;
}
