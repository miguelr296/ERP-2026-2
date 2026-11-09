namespace Erp.Comercial.Infraestructura.Simulaciones;

/// <summary>
/// Parámetros del proveedor simulado de stock. Se leen de configuración y son valores de
/// demostración: 48 h de vigencia es el supuesto acordado en DEC-001, no una regla del PDF.
/// </summary>
public sealed class OpcionesDeReservaSimulada
{
    public int StockDisponible { get; init; } = 999;

    public int HorasDeVigencia { get; init; } = 48;
}
