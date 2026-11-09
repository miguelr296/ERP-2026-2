namespace Erp.Comercial.Aplicacion.Puertos;

/// <summary>
/// Contrato que Comercial usa para confirmar un anticipo con Tesorería. En este sprint
/// lo implementa un adaptador simulado de Finanzas; la confirmación real llegará en el
/// sprint de ese proveedor conservando este contrato (COM-R06).
/// </summary>
public interface IPagoDeTesoreria
{
    Task<RespuestaPago> ConfirmarAsync(
        SolicitudPago solicitud,
        CancellationToken cancelacion = default);
}

/// <summary>
/// Datos del anticipo que Comercial envía a Tesorería. El comprobante es obligatorio
/// según el supuesto de demo acordado en DEC-001.
/// </summary>
public sealed record SolicitudPago(
    Guid DocumentoId,
    decimal Monto,
    string Moneda,
    string? Comprobante);

/// <summary>
/// Respuesta de Tesorería. El rechazo también devuelve identificador, fecha y estado:
/// así el usuario ve el resultado real y no se valida un pago sin evidencia.
/// </summary>
public sealed record RespuestaPago(
    bool Aceptada,
    string Identificador,
    string Estado,
    DateTimeOffset Fecha,
    string? Motivo,
    string? Referencia);
