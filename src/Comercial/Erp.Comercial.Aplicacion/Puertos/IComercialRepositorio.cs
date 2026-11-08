using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Puertos;

/// <summary>
/// Puerto de persistencia del módulo Comercial. La aplicación pide lo que necesita y la
/// infraestructura decide cómo obtenerlo; así las reglas no conocen EF Core ni SQL Server.
/// </summary>
public interface IComercialRepositorio
{
    Task<bool> ExisteClienteConDocumentoAsync(string documento, CancellationToken cancelacion = default);

    Task<bool> ExisteClienteActivoAsync(Guid clienteId, CancellationToken cancelacion = default);

    Task<Cliente?> BuscarClienteAsync(Guid clienteId, CancellationToken cancelacion = default);

    Task<Cliente?> BuscarClientePorDocumentoAsync(string documento, CancellationToken cancelacion = default);

    void AgregarCliente(Cliente cliente);

    void AgregarOportunidad(Oportunidad oportunidad);

    void AgregarHistorial(HistorialEvento evento);

    Task<IReadOnlyList<HistorialEvento>> ConsultarHistorialAsync(
        string documentoTipo,
        Guid documentoId,
        CancellationToken cancelacion = default);
}
