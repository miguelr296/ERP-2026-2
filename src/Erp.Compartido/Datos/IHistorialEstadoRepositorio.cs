namespace Erp.Compartido.Datos;

/// <summary>
/// Acceso al historial. La implementación vive en Erp.Api/Datos, porque allí está el DbContext;
/// así Compartido no depende de EF Core (patrón acordado el 31/10).
/// </summary>
public interface IHistorialEstadoRepositorio
{
    Task Agregar(HistorialEstado entrada);

    /// <summary>Devuelve la línea de tiempo de un documento, de la más antigua a la más reciente.</summary>
    Task<IReadOnlyList<HistorialEstado>> Listar(string tipoDocumento, int documentoId);
}
