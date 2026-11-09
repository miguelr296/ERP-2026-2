namespace Erp.Comercial.Aplicacion.Cotizaciones;

/// <summary>Supuestos de demo configurados en servidor; no son valores enviados por la pantalla.</summary>
public sealed class ParametrosCotizacion
{
    public decimal TasaIgv { get; set; }
    public int DiasVigencia { get; set; }
    public int PlazoEntregaDias { get; set; }
    public bool PreciosIncluyenIgv { get; set; }
    public MidpointRounding Redondeo { get; set; } = MidpointRounding.AwayFromZero;

    public void Validar()
    {
        if (TasaIgv < 0 || TasaIgv > 1 || DiasVigencia <= 0 || DiasVigencia > 365
            || PlazoEntregaDias <= 0 || PlazoEntregaDias > 365
            || Redondeo is not (MidpointRounding.AwayFromZero or MidpointRounding.ToEven))
            throw new InvalidOperationException("Revise los parámetros de CotizacionDemo del servidor.");
    }
}
