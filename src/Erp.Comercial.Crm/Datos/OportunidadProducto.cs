namespace Erp.Comercial.Crm.Datos;

public class OportunidadProducto
{
    public int Id { get; set; }
    public int OportunidadId { get; set; }
    // Identificador del mueble en Ventas; no crea una dependencia entre módulos.
    public int MuebleId { get; set; }
    public int Cantidad { get; set; }
}
