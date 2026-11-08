using Erp.Comercial.Aplicacion.Puertos;

namespace Erp.Comercial.Aplicacion.Historial;

/// <summary>
/// Lectura del historial de un documento, ordenada por momento del evento.
/// </summary>
public class HistorialCasoUso : IHistorialCasoUso
{
    private readonly IComercialRepositorio _repositorio;

    public HistorialCasoUso(IComercialRepositorio repositorio)
    {
        _repositorio = repositorio;
    }

    public async Task<IReadOnlyList<HistorialVista>> ConsultarAsync(
        string documentoTipo,
        Guid documentoId,
        CancellationToken cancelacion = default)
    {
        var eventos = await _repositorio.ConsultarHistorialAsync(
            documentoTipo,
            documentoId,
            cancelacion);

        return eventos.Select(HistorialVista.Desde).ToList();
    }
}
