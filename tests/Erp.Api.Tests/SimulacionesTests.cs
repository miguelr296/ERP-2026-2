using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;
using Erp.Comercial.Infraestructura.Simulaciones;

namespace Erp.Api.Tests;

/// <summary>
/// Evidencia de COM-008 sobre los contratos simulados: aceptan, rechazan y devuelven
/// siempre identificador, fecha y estado. Se prueban los adaptadores directamente,
/// sin red ni base de datos.
/// </summary>
public class SimulacionesTests
{
    private static readonly OpcionesDeReservaSimulada OpcionesReserva = new()
    {
        StockDisponible = 10,
        HorasDeVigencia = 48
    };

    [Fact]
    public async Task La_reserva_simulada_acepta_y_devuelve_identificador_y_vigencia()
    {
        var adaptador = new ReservaDeStockSimulada(OpcionesReserva);

        var respuesta = await adaptador.SolicitarAsync(
            new SolicitudReserva(Guid.NewGuid(), "MUE-001", 3));

        Assert.True(respuesta.Aceptada);
        Assert.StartsWith("RES-", respuesta.Identificador);
        Assert.Equal(EstadosReserva.Comprometida, respuesta.Estado);
        Assert.Equal(TimeSpan.FromHours(48), respuesta.VigenteHasta - respuesta.Fecha);
        Assert.Null(respuesta.Motivo);
    }

    [Fact]
    public async Task La_reserva_simulada_rechaza_por_encima_del_stock()
    {
        var adaptador = new ReservaDeStockSimulada(OpcionesReserva);

        var respuesta = await adaptador.SolicitarAsync(
            new SolicitudReserva(Guid.NewGuid(), "MUE-001", 11));

        Assert.False(respuesta.Aceptada);
        Assert.StartsWith("RES-", respuesta.Identificador);
        Assert.Equal(EstadosReserva.Rechazada, respuesta.Estado);
        Assert.Null(respuesta.VigenteHasta);
        Assert.Contains("10", respuesta.Motivo);
    }

    [Fact]
    public async Task El_pago_simulado_acepta_con_comprobante_y_referencia()
    {
        var adaptador = new PagoDeTesoreriaSimulado();

        var respuesta = await adaptador.ConfirmarAsync(
            new SolicitudPago(Guid.NewGuid(), 389.97m, "PEN", "COMP-0001"));

        Assert.True(respuesta.Aceptada);
        Assert.Equal(EstadosPago.Confirmado, respuesta.Estado);
        Assert.StartsWith("PAG-", respuesta.Identificador);
        Assert.StartsWith("TES-", respuesta.Referencia);
        Assert.Null(respuesta.Motivo);
    }

    [Fact]
    public async Task El_pago_simulado_rechaza_sin_comprobante()
    {
        var adaptador = new PagoDeTesoreriaSimulado();

        var respuesta = await adaptador.ConfirmarAsync(
            new SolicitudPago(Guid.NewGuid(), 389.97m, "PEN", "   "));

        Assert.False(respuesta.Aceptada);
        Assert.Equal(EstadosPago.Rechazado, respuesta.Estado);
        Assert.Contains("comprobante", respuesta.Motivo);
        Assert.Null(respuesta.Referencia);
    }

    [Fact]
    public async Task El_pago_simulado_rechaza_un_monto_invalido()
    {
        var adaptador = new PagoDeTesoreriaSimulado();

        var respuesta = await adaptador.ConfirmarAsync(
            new SolicitudPago(Guid.NewGuid(), 0m, "PEN", "COMP-0001"));

        Assert.False(respuesta.Aceptada);
        Assert.Equal(EstadosPago.Rechazado, respuesta.Estado);
        Assert.Contains("monto", respuesta.Motivo);
    }
}
