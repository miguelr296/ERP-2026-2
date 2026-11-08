using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Clientes;

/// <summary>Caso de uso del cliente dentro del módulo Comercial.</summary>
public interface IClientesCasoUso
{
    Task<ClienteVista> RegistrarAsync(
        NuevoCliente datos,
        UsuarioSimulado usuario,
        CancellationToken cancelacion = default);

    Task<ClienteVista?> BuscarAsync(Guid id, CancellationToken cancelacion = default);
}
