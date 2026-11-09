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

        return new Oportunidad
        {
            Id = Guid.NewGuid(),
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
    }

    /// <summary>Borrado lógico de la oportunidad.</summary>
    public void Desactivar()
    {
        Activo = false;
    }
}
