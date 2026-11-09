namespace Erp.Comercial.Dominio;

/// <summary>
/// Evento del historial. Es inmutable: no tiene métodos para cambiar sus datos y la
/// capa de persistencia rechaza cualquier intento de modificarlo o borrarlo (COM-T03).
/// </summary>
public class HistorialEvento
{
    public Guid Id { get; private set; }

    /// <summary>Tipo de documento al que pertenece el evento; ver <see cref="TiposDocumento"/>.</summary>
    public string DocumentoTipo { get; private set; } = string.Empty;

    public Guid DocumentoId { get; private set; }

    public string Accion { get; private set; } = string.Empty;

    public string? EstadoAnterior { get; private set; }

    public string? EstadoNuevo { get; private set; }

    public string Usuario { get; private set; } = string.Empty;

    public string Rol { get; private set; } = string.Empty;

    public string? Motivo { get; private set; }

    public DateTimeOffset OcurridoEn { get; private set; }

    /// <summary>Constructor que usa la capa de persistencia al leer la base de datos.</summary>
    private HistorialEvento()
    {
    }

    public static HistorialEvento RegistrarAlta(
        string documentoTipo,
        Guid documentoId,
        string accion,
        string estadoNuevo,
        UsuarioSimulado usuario,
        string? motivo = null)
    {
        return new HistorialEvento
        {
            Id = Guid.NewGuid(),
            DocumentoTipo = documentoTipo,
            DocumentoId = documentoId,
            Accion = accion,
            EstadoAnterior = null,
            EstadoNuevo = estadoNuevo,
            Usuario = usuario.Nombre,
            Rol = usuario.Rol,
            Motivo = motivo,
            OcurridoEn = DateTimeOffset.UtcNow
        };
    }
}
