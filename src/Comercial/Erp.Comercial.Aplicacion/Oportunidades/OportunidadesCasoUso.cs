using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Oportunidades;

/// <summary>
/// Registro de oportunidades. La regla que importa es de negocio: una oportunidad no
/// existe sin un cliente activo que la origine (COM-R01).
/// </summary>
public class OportunidadesCasoUso : IOportunidadesCasoUso
{
    private readonly IComercialRepositorio _repositorio;
    private readonly IUnidadDeTrabajo _unidadDeTrabajo;

    public OportunidadesCasoUso(
        IComercialRepositorio repositorio,
        IUnidadDeTrabajo unidadDeTrabajo)
    {
        _repositorio = repositorio;
        _unidadDeTrabajo = unidadDeTrabajo;
    }

    public async Task<OportunidadVista> RegistrarAsync(
        NuevaOportunidad datos,
        UsuarioSimulado usuario,
        CancellationToken cancelacion = default)
    {
        if (!usuario.PuedeRegistrarDocumentos)
        {
            throw new ReglaDeNegocioException(
                $"El rol {usuario.Rol} no puede registrar oportunidades. Corresponde a Asesor o Jefatura.");
        }

        var oportunidad = Oportunidad.Registrar(
            datos.ClienteId,
            datos.Descripcion,
            datos.Canal,
            datos.Sede,
            datos.Responsable,
            usuario);

        var clienteDisponible = await _repositorio.ExisteClienteActivoAsync(
            oportunidad.ClienteId,
            cancelacion);

        if (!clienteDisponible)
        {
            throw new ReglaDeNegocioException(
                "El cliente no existe o está inactivo. Registre el cliente antes de la oportunidad.");
        }

        _repositorio.AgregarOportunidad(oportunidad);

        _repositorio.AgregarHistorial(HistorialEvento.RegistrarAlta(
            TiposDocumento.Oportunidad,
            oportunidad.Id,
            "Alta de oportunidad",
            oportunidad.Estado,
            usuario));

        await _unidadDeTrabajo.GuardarAsync(cancelacion);

        return OportunidadVista.Desde(oportunidad);
    }
}
