using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;

namespace Erp.Comercial.Infraestructura.Simulaciones;

/// <summary>
/// Adaptador simulado de Logística. No hay almacén real: responde con identificador,
/// fecha, estado y vigencia, y rechaza cuando la cantidad supera el stock de demostración.
/// Sustituirlo por el proveedor real no cambia el contrato <see cref="IReservaDeStock"/>.
/// </summary>
public sealed class ReservaDeStockSimulada : IReservaDeStock
{
    private readonly OpcionesDeReservaSimulada _opciones;

    public ReservaDeStockSimulada(OpcionesDeReservaSimulada opciones)
    {
        _opciones = opciones;
    }

    public Task<RespuestaReserva> SolicitarAsync(
        SolicitudReserva solicitud,
        CancellationToken cancelacion = default)
    {
        var fecha = DateTimeOffset.UtcNow;
        var identificador = $"RES-{fecha:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 10_000)}";

        if (solicitud.Cantidad > _opciones.StockDisponible)
        {
            return Task.FromResult(new RespuestaReserva(
                false,
                identificador,
                EstadosReserva.Rechazada,
                fecha,
                null,
                $"Solo hay {_opciones.StockDisponible} unidades disponibles de {solicitud.Producto}."));
        }

        return Task.FromResult(new RespuestaReserva(
            true,
            identificador,
            EstadosReserva.Comprometida,
            fecha,
            fecha.AddHours(_opciones.HorasDeVigencia),
            null));
    }
}
