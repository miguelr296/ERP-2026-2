namespace Erp.Comercial.Aplicacion.Puertos;

/// <summary>
/// Contrato que Comercial usa para pedir una reserva de stock. En este sprint lo
/// implementa un adaptador simulado de Logística; el proveedor real lo sustituirá sin
/// cambiar este contrato (alcance de Comercial: dependencias externas simuladas).
/// </summary>
public interface IReservaDeStock
{
    Task<RespuestaReserva> SolicitarAsync(
        SolicitudReserva solicitud,
        CancellationToken cancelacion = default);
}

/// <summary>Datos mínimos que Comercial envía al proveedor de stock.</summary>
public sealed record SolicitudReserva(Guid OportunidadId, string Producto, int Cantidad);

/// <summary>
/// Respuesta del proveedor simulado. Aun cuando rechaza, devuelve identificador, fecha
/// y estado para que el rechazo pueda explicarse y auditarse en pantalla.
/// </summary>
public sealed record RespuestaReserva(
    bool Aceptada,
    string Identificador,
    string Estado,
    DateTimeOffset Fecha,
    DateTimeOffset? VigenteHasta,
    string? Motivo);
