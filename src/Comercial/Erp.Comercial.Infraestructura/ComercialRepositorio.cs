using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;
using Microsoft.EntityFrameworkCore;

namespace Erp.Comercial.Infraestructura;

/// <summary>
/// Implementación del puerto de persistencia con EF Core. Traduce lo que pide la
/// aplicación a consultas y altas sobre <see cref="ComercialContext"/>.
/// </summary>
public class ComercialRepositorio : IComercialRepositorio
{
    private readonly ComercialContext _contexto;

    public ComercialRepositorio(ComercialContext contexto)
    {
        _contexto = contexto;
    }

    public Task<bool> ExisteClienteConDocumentoAsync(
        string documento,
        CancellationToken cancelacion = default)
    {
        return _contexto.Clientes
            .AnyAsync(cliente => cliente.Documento == documento, cancelacion);
    }

    public Task<bool> ExisteClienteActivoAsync(
        Guid clienteId,
        CancellationToken cancelacion = default)
    {
        return _contexto.Clientes
            .AnyAsync(cliente => cliente.Id == clienteId && cliente.Activo, cancelacion);
    }

    public Task<Cliente?> BuscarClienteAsync(
        Guid clienteId,
        CancellationToken cancelacion = default)
    {
        return _contexto.Clientes
            .AsNoTracking()
            .FirstOrDefaultAsync(cliente => cliente.Id == clienteId, cancelacion);
    }

    public Task<Cliente?> BuscarClientePorDocumentoAsync(
        string documento,
        CancellationToken cancelacion = default)
    {
        return _contexto.Clientes
            .AsNoTracking()
            .FirstOrDefaultAsync(cliente => cliente.Documento == documento, cancelacion);
    }

    public void AgregarCliente(Cliente cliente)
    {
        _contexto.Clientes.Add(cliente);
    }

    public void AgregarOportunidad(Oportunidad oportunidad)
    {
        _contexto.Oportunidades.Add(oportunidad);
    }

    public void AgregarHistorial(HistorialEvento evento)
    {
        _contexto.Historial.Add(evento);
    }

    public async Task<IReadOnlyList<HistorialEvento>> ConsultarHistorialAsync(
        string documentoTipo,
        Guid documentoId,
        CancellationToken cancelacion = default)
    {
        return await _contexto.Historial
            .AsNoTracking()
            .Where(evento => evento.DocumentoTipo == documentoTipo
                && evento.DocumentoId == documentoId)
            .OrderBy(evento => evento.OcurridoEn)
            .ToListAsync(cancelacion);
    }
}
