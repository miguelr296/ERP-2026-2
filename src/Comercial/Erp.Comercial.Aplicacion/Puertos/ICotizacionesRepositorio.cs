using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Puertos;

public interface ICotizacionesRepositorio
{
    Task<Cotizacion?> BuscarAsync(Guid id, CancellationToken cancelacion = default);
    Task<Cotizacion?> BuscarPorSolicitudAsync(Guid solicitudId, CancellationToken cancelacion = default);
    /// <summary>Guarda documento, líneas e historial juntos; resuelve una solicitud concurrente repetida.</summary>
    Task<Cotizacion> GuardarAsync(Cotizacion documento, CancellationToken cancelacion = default);
}

public interface INumeradorCotizaciones
{
    Task<long> SiguienteAsync(CancellationToken cancelacion = default);
}
