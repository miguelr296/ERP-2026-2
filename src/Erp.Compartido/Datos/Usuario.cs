namespace Erp.Compartido.Datos;

public class Usuario
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public Rol Rol { get; set; }
    public int SedeId { get; set; }
    public bool Activo { get; set; }
}
