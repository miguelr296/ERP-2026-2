using System.Reflection;

namespace Erp.Pruebas;

// Prueba de humo del esqueleto: cada subsistema compila a su propio ensamblado
// y el proyecto de pruebas puede cargarlo. Las reglas de negocio llegan desde S1-08.
public class PruebasDeHumo
{
    [Theory]
    [InlineData("Erp.Compartido")]
    [InlineData("Erp.Comercial.Crm")]
    [InlineData("Erp.Comercial.Ventas")]
    [InlineData("Erp.Comercial.Postventa")]
    [InlineData("Erp.Finanzas.Tesoreria")]
    [InlineData("Erp.Finanzas.CreditosCobranzas")]
    [InlineData("Erp.Finanzas.Facturacion")]
    [InlineData("Erp.Logistica.Inventarios")]
    [InlineData("Erp.Logistica.Despacho")]
    [InlineData("Erp.Planta.Ingenieria")]
    [InlineData("Erp.Planta.Produccion")]
    [InlineData("Erp.Api")]
    public void Subsistema_EstaReferenciado_CargaSuEnsamble(string nombre)
    {
        var ensamblado = Assembly.Load(nombre);

        Assert.Equal(nombre, ensamblado.GetName().Name);
    }
}
