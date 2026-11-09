using System.Text.Json.Serialization;

namespace Erp.Comercial.Aplicacion.Cotizaciones;

// Rechaza precio, líneas o cantidades introducidas por el cliente, en lugar de ignorarlas.
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record CalcularCotizacion(string TipoCliente);
