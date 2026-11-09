namespace Erp.Comercial.Dominio;

/// <summary>
/// Oportunidad comercial de un cliente. Siempre pertenece a un cliente existente (COM-R01)
/// y nace en estado <see cref="EstadosOportunidad.Nueva"/>.
/// </summary>
public class Oportunidad
{
    public Guid Id { get; private set; }

    public Guid ClienteId { get; private set; }

    public Cliente? Cliente { get; private set; }

    public string Descripcion { get; private set; } = string.Empty;

    public string Canal { get; private set; } = string.Empty;

    public string Sede { get; private set; } = string.Empty;

    public string Responsable { get; private set; } = string.Empty;

    public string Estado { get; private set; } = string.Empty;

    public bool Activo { get; private set; }

    public DateTimeOffset CreadoEn { get; private set; }

    public string CreadoPor { get; private set; } = string.Empty;

    /// <summary>Productos que el asesor ofreció en esta oportunidad.</summary>
    public List<ProductoDeOportunidad> Productos { get; private set; } = new();

    /// <summary>Reservas de stock comprometidas para esta oportunidad.</summary>
    public List<ReservaSimulada> Reservas { get; private set; } = new();

    /// <summary>Constructor que usa la capa de persistencia al leer la base de datos.</summary>
    private Oportunidad()
    {
    }

    public static Oportunidad Registrar(
        Guid clienteId,
        string descripcion,
        string canal,
        string sede,
        string responsable,
        IReadOnlyList<ProductoSeleccionado> productos,
        UsuarioSimulado usuario)
    {
        if (clienteId == Guid.Empty)
        {
            throw new ReglaDeNegocioException("La oportunidad necesita un cliente.");
        }

        if (string.IsNullOrWhiteSpace(descripcion)
            || string.IsNullOrWhiteSpace(canal)
            || string.IsNullOrWhiteSpace(sede)
            || string.IsNullOrWhiteSpace(responsable))
        {
            throw new ReglaDeNegocioException(
                "La descripción, el canal, la sede y el responsable son obligatorios.");
        }

        if (productos is null || productos.Count == 0)
        {
            throw new ReglaDeNegocioException("La oportunidad necesita al menos un producto.");
        }

        var id = Guid.NewGuid();

        // Primero se valida cada producto; si alguno es inválido, no queda una oportunidad a medias.
        var productosRegistrados = productos
            .Select(producto => ProductoDeOportunidad.Registrar(
                id,
                producto.Codigo,
                producto.Nombre,
                producto.Cantidad))
            .ToList();

        var codigosDistintos = productosRegistrados
            .Select(producto => producto.Codigo)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Count();

        if (codigosDistintos != productosRegistrados.Count)
        {
            throw new ReglaDeNegocioException(
                "La oportunidad no puede repetir el mismo producto; ajuste la cantidad.");
        }

        var oportunidad = new Oportunidad
        {
            Id = id,
            ClienteId = clienteId,
            Descripcion = descripcion.Trim(),
            Canal = canal.Trim(),
            Sede = sede.Trim(),
            Responsable = responsable.Trim(),
            Estado = EstadosOportunidad.Nueva,
            Activo = true,
            CreadoEn = DateTimeOffset.UtcNow,
            CreadoPor = usuario.Nombre
        };

        oportunidad.Productos.AddRange(productosRegistrados);

        return oportunidad;
    }

    /// <summary>Borrado lógico de la oportunidad.</summary>
    public void Desactivar()
    {
        Activo = false;
    }
}
