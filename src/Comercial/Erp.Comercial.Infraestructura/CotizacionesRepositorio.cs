using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Erp.Comercial.Infraestructura;

public sealed class CotizacionesRepositorio(ComercialContext contexto, IUnidadDeTrabajo unidad) : ICotizacionesRepositorio
{
    public Task<Cotizacion?> BuscarAsync(Guid id, CancellationToken cancelacion = default) =>
        contexto.Cotizaciones.AsNoTracking().Include(c => c.Lineas)
            .FirstOrDefaultAsync(c => c.Id == id, cancelacion);

    public Task<Cotizacion?> BuscarPorSolicitudAsync(Guid solicitudId, CancellationToken cancelacion = default) =>
        contexto.Cotizaciones.AsNoTracking().Include(c => c.Lineas)
            .FirstOrDefaultAsync(c => c.SolicitudId == solicitudId, cancelacion);

    public async Task<Cotizacion> GuardarAsync(Cotizacion documento, CancellationToken cancelacion = default)
    {
        contexto.Cotizaciones.Add(documento);
        contexto.Historial.Add(HistorialEvento.RegistrarAlta(TiposDocumento.Cotizacion,
            documento.Id, "Emisión de cotización", documento.Estado,
            new UsuarioSimulado(documento.CreadoPor, documento.Rol)));
        try
        {
            // SQL Server guarda todo en la transacción de un único SaveChanges.
            await unidad.GuardarAsync(cancelacion);
            return documento;
        }
        catch (DbUpdateException error) when (error.InnerException is SqlException sql && sql.Number is 2601 or 2627)
        {
            // Otro proceso pudo confirmar primero la misma solicitud. No repetir el alta.
            contexto.ChangeTracker.Clear();
            var existente = await BuscarPorSolicitudAsync(documento.SolicitudId, cancelacion);
            if (existente is null) throw;
            return existente;
        }
    }
}

/// <summary>Secuencia global sin reinicio anual. Se admite que existan saltos.</summary>
public sealed class NumeradorCotizaciones(ComercialContext contexto) : INumeradorCotizaciones
{
    public async Task<long> SiguienteAsync(CancellationToken cancelacion = default)
    {
        var numeros = await contexto.Database.SqlQueryRaw<long>(
            "SELECT NEXT VALUE FOR [Comercial].[NumeroCotizacion] AS [Value]").ToListAsync(cancelacion);
        return numeros.Single();
    }
}
