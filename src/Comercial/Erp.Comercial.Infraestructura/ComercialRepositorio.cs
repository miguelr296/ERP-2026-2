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

    public Task<Oportunidad?> BuscarOportunidadAsync(
        Guid oportunidadId,
        CancellationToken cancelacion = default)
    {
        // La ficha inicial muestra el cliente y los productos; se cargan en la misma consulta.
        return _contexto.Oportunidades
            .AsNoTracking()
            .Include(oportunidad => oportunidad.Cliente)
            .Include(oportunidad => oportunidad.Productos)
            .FirstOrDefaultAsync(oportunidad => oportunidad.Id == oportunidadId, cancelacion);
    }

    public Task<bool> ExisteOportunidadActivaAsync(
        Guid oportunidadId,
        CancellationToken cancelacion = default)
    {
        return _contexto.Oportunidades
            .AnyAsync(oportunidad => oportunidad.Id == oportunidadId && oportunidad.Activo, cancelacion);
    }

    public void AgregarReserva(ReservaSimulada reserva)
    {
        _contexto.Reservas.Add(reserva);
    }

    public Task<ReservaSimulada?> BuscarReservaAsync(
        Guid id,
        CancellationToken cancelacion = default)
    {
        return _contexto.Reservas
            .AsNoTracking()
            .FirstOrDefaultAsync(reserva => reserva.Id == id, cancelacion);
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
