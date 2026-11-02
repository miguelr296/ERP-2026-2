using Erp.Compartido.Datos;
using Microsoft.EntityFrameworkCore;

namespace Erp.Api.Datos;

/// <summary>
/// Guarda y consulta el historial usando la conexión a la base de datos del ERP.
/// </summary>
public class RepositorioHistorial(ErpDbContext contexto) : IHistorialEstadoRepositorio
{
    public async Task Agregar(HistorialEstado entrada)
    {
        contexto.Set<HistorialEstado>().Add(entrada);
        await contexto.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<HistorialEstado>> Listar(string tipoDocumento, int documentoId)
    {
        return await contexto.Set<HistorialEstado>()
            .AsNoTracking()
            .Where(entrada => entrada.TipoDocumento == tipoDocumento && entrada.DocumentoId == documentoId)
            .OrderBy(entrada => entrada.FechaHora)
            .ToListAsync();
    }
}
