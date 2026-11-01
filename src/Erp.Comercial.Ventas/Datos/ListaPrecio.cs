using Erp.Compartido.Datos;

namespace Erp.Comercial.Ventas.Datos;

public class ListaPrecio
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public CanalVenta Canal { get; set; }
    public EstadoListaPrecio Estado { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
}
