namespace Erp.Comercial.Aplicacion.Oportunidades;

/// <summary>
/// Datos para registrar una oportunidad de un cliente ya existente (COM-R01).
/// El canal, la sede y el responsable son los de la p. 15, que también exige productos.
/// </summary>
public sealed record NuevaOportunidad(
    Guid ClienteId,
    string Descripcion,
    string Canal,
    string Sede,
    string Responsable,
    IReadOnlyList<NuevoProductoDeOportunidad> Productos);

/// <summary>
/// Producto que la pantalla pide para la oportunidad. Solo envía código y cantidad:
/// el nombre y el precio los aporta el catálogo del canal, no el texto de la pantalla.
/// </summary>
public sealed record NuevoProductoDeOportunidad(string Codigo, int Cantidad);
