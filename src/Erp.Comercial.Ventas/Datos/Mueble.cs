namespace Erp.Comercial.Ventas.Datos;

public class Mueble
{
    public int Id { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public TipoFabricacion TipoFabricacion { get; set; }
    public bool Activo { get; set; }
}
