namespace Erp.Comercial.Dominio;

public sealed record PrecioDeLinea(string Codigo, string Nombre, int Cantidad, decimal PrecioUnitario);
public sealed record LineaCalculada(string Codigo, string Nombre, int Cantidad, decimal PrecioUnitario, decimal Importe);

/// <summary>Cálculo sin persistencia: recibe precios obtenidos por la aplicación del catálogo.</summary>
public sealed record CalculoCotizacion(IReadOnlyList<LineaCalculada> Lineas, decimal Subtotal, decimal Igv, decimal Total)
{
    public static CalculoCotizacion Calcular(
        IReadOnlyList<PrecioDeLinea> precios,
        decimal tasaIgv,
        bool preciosIncluyenIgv,
        MidpointRounding redondeo)
    {
        if (precios.Count == 0 || tasaIgv < 0 || tasaIgv > 1)
            throw new ReglaDeNegocioException("El cálculo requiere productos y una tasa de IGV entre 0 y 1.");

        if (precios.Any(linea => linea.Cantidad <= 0 || linea.PrecioUnitario < 0))
            throw new ReglaDeNegocioException("Las cantidades deben ser positivas y los precios no negativos.");

        var lineas = precios.Select(linea => new LineaCalculada(
            linea.Codigo, linea.Nombre, linea.Cantidad, linea.PrecioUnitario,
            decimal.Round(linea.Cantidad * linea.PrecioUnitario, 2, redondeo))).ToArray();
        var suma = lineas.Sum(linea => linea.Importe);
        var subtotal = preciosIncluyenIgv ? decimal.Round(suma / (1 + tasaIgv), 2, redondeo) : suma;
        var igv = preciosIncluyenIgv ? suma - subtotal : decimal.Round(subtotal * tasaIgv, 2, redondeo);
        return new CalculoCotizacion(lineas, subtotal, igv, subtotal + igv);
    }
}
