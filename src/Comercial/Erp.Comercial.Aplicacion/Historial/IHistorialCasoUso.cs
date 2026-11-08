namespace Erp.Comercial.Aplicacion.Historial;

/// <summary>
/// Consulta del historial. No existe caso de uso para modificarlo: el historial es
/// inmutable (COM-T03).
/// </summary>
public interface IHistorialCasoUso
{
    Task<IReadOnlyList<HistorialVista>> ConsultarAsync(
        string documentoTipo,
        Guid documentoId,
        CancellationToken cancelacion = default);
}
