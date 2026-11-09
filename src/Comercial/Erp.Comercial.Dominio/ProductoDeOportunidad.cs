namespace Erp.Comercial.Dominio;

/// <summary>
/// Producto que el asesor eligió para una oportunidad (COM-R01). Conserva el código y el
/// nombre que ofrece el catálogo, y la cantidad pedida. El precio no se copia aquí: las
/// líneas de la cotización se calculan con la lista vigente (COM-R02).
/// </summary>
public class ProductoDeOportunidad
{
    public Guid Id { get; private set; }

    public Guid OportunidadId { get; private set; }

    public Oportunidad? Oportunidad { get; private set; }

    public string Codigo { get; private set; } = string.Empty;

    public string Nombre { get; private set; } = string.Empty;

    public int Cantidad { get; private set; }

    /// <summary>Constructor que usa la capa de persistencia al leer la base de datos.</summary>
    private ProductoDeOportunidad()
    {
    }

    public static ProductoDeOportunidad Registrar(
        Guid oportunidadId,
        string codigo,
        string nombre,
        int cantidad)
    {
        if (string.IsNullOrWhiteSpace(codigo))
        {
            throw new ReglaDeNegocioException(
                "Indique el código del producto que se ofrece en la oportunidad.");
        }

        if (string.IsNullOrWhiteSpace(nombre))
        {
            throw new ReglaDeNegocioException("El producto seleccionado debe tener un nombre.");
        }

        if (cantidad <= 0)
        {
            throw new ReglaDeNegocioException(
                "La cantidad del producto debe ser mayor que cero.");
        }

        return new ProductoDeOportunidad
        {
            Id = Guid.NewGuid(),
            OportunidadId = oportunidadId,
            Codigo = codigo.Trim(),
            Nombre = nombre.Trim(),
            Cantidad = cantidad
        };
    }
}
