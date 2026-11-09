using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;

namespace Erp.Comercial.Infraestructura.Simulaciones;

/// <summary>
/// Adaptador simulado de Tesorería. No consulta un banco real: confirma solo si el
/// anticipo trae comprobante y un monto válido. El rechazo devuelve identificador,
/// fecha, estado y motivo para que quede visible y auditable (COM-R06).
/// </summary>
public sealed class PagoDeTesoreriaSimulado : IPagoDeTesoreria
{
    public Task<RespuestaPago> ConfirmarAsync(
        SolicitudPago solicitud,
        CancellationToken cancelacion = default)
    {
        var fecha = DateTimeOffset.UtcNow;
        var identificador = $"PAG-{fecha:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 10_000)}";

        if (solicitud.Monto <= 0)
        {
            return Task.FromResult(new RespuestaPago(
                false,
                identificador,
                EstadosPago.Rechazado,
                fecha,
                "El monto del anticipo debe ser mayor que cero.",
                null));
        }

        if (string.IsNullOrWhiteSpace(solicitud.Comprobante))
        {
            return Task.FromResult(new RespuestaPago(
                false,
                identificador,
                EstadosPago.Rechazado,
                fecha,
                "Tesorería simulada exige el comprobante del anticipo.",
                null));
        }

        return Task.FromResult(new RespuestaPago(
            true,
            identificador,
            EstadosPago.Confirmado,
            fecha,
            null,
            $"TES-{identificador}"));
    }
}
