namespace Erp.Compartido.Datos;

/// <summary>
/// Una línea del historial de un documento (TRZ-01). Solo se agrega: nunca se edita ni se borra (TRZ-03).
/// </summary>
public class HistorialEstado
{
    public int Id { get; set; }

    /// <summary>Submódulo y tipo del documento: "Cotizacion", "OrdenVenta", "Anticipo"...</summary>
    public string TipoDocumento { get; set; } = "";

    public int DocumentoId { get; set; }

    /// <summary>Vacío en el alta del documento, porque todavía no había estado.</summary>
    public string? EstadoAnterior { get; set; }

    public string EstadoNuevo { get; set; } = "";

    public int UsuarioId { get; set; }

    public string Rol { get; set; } = "";

    public DateTime FechaHora { get; set; }

    public string Motivo { get; set; } = "";
}
