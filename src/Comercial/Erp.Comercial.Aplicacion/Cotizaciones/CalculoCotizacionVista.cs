using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Cotizaciones;

/// <summary>Previsualización: no es un documento emitido, no asigna correlativo ni guarda historial.</summary>
public sealed record CalculoCotizacionVista(
    Guid OportunidadId, Guid ClienteId, string ClienteNombre, string Canal, string TipoCliente,
    string ListaPrecio, string Moneda, DateOnly FechaCalculo, DateOnly VigenteHasta,
    int PlazoEntregaDias, decimal TasaIgv, bool PreciosIncluyenIgv, CalculoCotizacion Calculo);
