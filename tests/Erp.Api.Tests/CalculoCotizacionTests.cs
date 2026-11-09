using Erp.Comercial.Dominio;

namespace Erp.Api.Tests;

public class CalculoCotizacionTests
{
    [Fact]
    public void Suma_lineas_y_calcula_impuesto_con_decimal()
    {
        var resultado = CalculoCotizacion.Calcular([
            new("A", "Sofá", 2, 1299.90m), new("B", "Comedor", 1, 899.90m)
        ], 0.18m, false, MidpointRounding.AwayFromZero);
        Assert.Equal(2599.80m, resultado.Lineas[0].Importe);
        Assert.Equal(3499.70m, resultado.Subtotal);
        Assert.Equal(629.95m, resultado.Igv);
        Assert.Equal(4129.65m, resultado.Total);
    }

    [Fact]
    public void Puede_desglosar_precios_con_impuesto_si_el_servidor_lo_configura()
    {
        var resultado = CalculoCotizacion.Calcular([new("A", "Demo", 1, 118m)],
            0.18m, true, MidpointRounding.AwayFromZero);
        Assert.Equal(100m, resultado.Subtotal);
        Assert.Equal(18m, resultado.Igv);
        Assert.Equal(118m, resultado.Total);
    }

    [Fact]
    public void Redondea_por_linea_antes_de_calcular_el_impuesto()
    {
        var resultado = CalculoCotizacion.Calcular([
            new("A", "Demo A", 1, 1.005m), new("B", "Demo B", 1, 1.005m)
        ], 0.18m, false, MidpointRounding.AwayFromZero);
        Assert.Equal(2.02m, resultado.Subtotal);
        Assert.Equal(0.36m, resultado.Igv);
        Assert.Equal(2.38m, resultado.Total);
    }

    [Theory]
    [InlineData(0, "10")]
    [InlineData(-1, "10")]
    [InlineData(1, "-1")]
    public void Rechaza_cantidades_o_precios_invalidos(int cantidad, string precio)
    {
        var valor = decimal.Parse(precio, System.Globalization.CultureInfo.InvariantCulture);
        Assert.Throws<ReglaDeNegocioException>(() => CalculoCotizacion.Calcular(
            [new("A", "Demo", cantidad, valor)], 0.18m, false, MidpointRounding.AwayFromZero));
    }
}
