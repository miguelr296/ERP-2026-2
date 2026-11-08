using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Clientes;

/// <summary>
/// Alta y consulta de clientes. Aquí viven las reglas que necesitan repositorio o usuario;
/// las validaciones del propio dato están en la entidad.
/// </summary>
public class ClientesCasoUso : IClientesCasoUso
{
    private readonly IComercialRepositorio _repositorio;
    private readonly IUnidadDeTrabajo _unidadDeTrabajo;

    public ClientesCasoUso(IComercialRepositorio repositorio, IUnidadDeTrabajo unidadDeTrabajo)
    {
        _repositorio = repositorio;
        _unidadDeTrabajo = unidadDeTrabajo;
    }

    public async Task<ClienteVista> RegistrarAsync(
        NuevoCliente datos,
        UsuarioSimulado usuario,
        CancellationToken cancelacion = default)
    {
        if (!usuario.PuedeRegistrarDocumentos)
        {
            throw new ReglaDeNegocioException(
                $"El rol {usuario.Rol} no puede registrar clientes. Corresponde a Asesor o Jefatura.");
        }

        var cliente = Cliente.Registrar(
            datos.Nombre,
            datos.Documento,
            datos.Correo,
            datos.Telefono,
            usuario);

        var yaExiste = await _repositorio.ExisteClienteConDocumentoAsync(
            cliente.Documento,
            cancelacion);

        if (yaExiste)
        {
            throw new ReglaDeNegocioException(
                $"Ya existe un cliente con el documento {cliente.Documento}.");
        }

        _repositorio.AgregarCliente(cliente);

        _repositorio.AgregarHistorial(HistorialEvento.RegistrarAlta(
            TiposDocumento.Cliente,
            cliente.Id,
            "Alta de cliente",
            "Activo",
            usuario));

        // Cliente e historial se confirman en el mismo guardado: o quedan los dos, o ninguno.
        await _unidadDeTrabajo.GuardarAsync(cancelacion);

        return ClienteVista.Desde(cliente);
    }

    public async Task<ClienteVista?> BuscarAsync(
        Guid id,
        CancellationToken cancelacion = default)
    {
        var cliente = await _repositorio.BuscarClienteAsync(id, cancelacion);
        return cliente is null ? null : ClienteVista.Desde(cliente);
    }

    public async Task<IReadOnlyList<ClienteVista>> BuscarPorDocumentoAsync(
        string? documento,
        CancellationToken cancelacion = default)
    {
        if (string.IsNullOrWhiteSpace(documento))
        {
            throw new ReglaDeNegocioException("Indique el documento del cliente que desea buscar.");
        }

        var documentoBuscado = documento.Trim();
        // Es el límite del campo ya definido en COM-005, no un formato legal de DNI/RUC.
        if (documentoBuscado.Length > 20)
        {
            throw new ReglaDeNegocioException("El documento del cliente admite hasta 20 caracteres.");
        }

        var cliente = await _repositorio.BuscarClientePorDocumentoAsync(documentoBuscado, cancelacion);
        return cliente is null ? [] : [ClienteVista.Desde(cliente)];
    }
}
