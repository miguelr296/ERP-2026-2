using Erp.Comercial.Aplicacion.Productos;
using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Oportunidades;

/// <summary>
/// Registro y consulta de oportunidades. La regla que importa es de negocio: una
/// oportunidad no existe sin un cliente activo que la origine (COM-R01), y sus productos
/// deben pertenecer al catálogo del canal elegido. El precio de esos productos no se
/// guarda aquí; la cotización lo toma de la lista vigente (COM-R02).
/// </summary>
public class OportunidadesCasoUso : IOportunidadesCasoUso
{
    private readonly IComercialRepositorio _repositorio;
    private readonly IUnidadDeTrabajo _unidadDeTrabajo;
    private readonly ICatalogoCasoUso _catalogo;

    public OportunidadesCasoUso(
        IComercialRepositorio repositorio,
        IUnidadDeTrabajo unidadDeTrabajo,
        ICatalogoCasoUso catalogo)
    {
        _repositorio = repositorio;
        _unidadDeTrabajo = unidadDeTrabajo;
        _catalogo = catalogo;
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

        var productos = ResolverProductosDelCatalogo(datos.Canal, datos.Productos);

        var oportunidad = Oportunidad.Registrar(
            datos.ClienteId,
            datos.Descripcion,
            datos.Canal,
            datos.Sede,
            datos.Responsable,
            productos,
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

        // La ficha necesita el cliente y los productos ya asociados, no solo el identificador.
        return (await _repositorio.BuscarOportunidadAsync(oportunidad.Id, cancelacion))
            is { } guardada
            ? OportunidadVista.Desde(guardada)
            : OportunidadVista.Desde(oportunidad);
    }

    public async Task<OportunidadVista?> BuscarAsync(
        Guid id,
        CancellationToken cancelacion = default)
    {
        var oportunidad = await _repositorio.BuscarOportunidadAsync(id, cancelacion);
        return oportunidad is null ? null : OportunidadVista.Desde(oportunidad);
    }

    /// <summary>
    /// Cambia los códigos enviados por la pantalla por los productos reales del catálogo.
    /// Si un código no existe en el canal, se rechaza antes de crear la oportunidad.
    /// </summary>
    private IReadOnlyList<ProductoSeleccionado> ResolverProductosDelCatalogo(
        string canal,
        IReadOnlyList<NuevoProductoDeOportunidad>? productos)
    {
        if (productos is null || productos.Count == 0)
        {
            throw new ReglaDeNegocioException("La oportunidad necesita al menos un producto.");
        }

        var canalLimpio = canal?.Trim() ?? string.Empty;
        var seleccionados = new List<ProductoSeleccionado>();

        foreach (var producto in productos)
        {
            var codigo = producto.Codigo?.Trim() ?? string.Empty;
            if (codigo.Length == 0)
            {
                throw new ReglaDeNegocioException(
                    "Indique el código del producto que se ofrece en la oportunidad.");
            }

            var delCatalogo = _catalogo.Buscar(codigo, canalLimpio);
            if (delCatalogo is null)
            {
                throw new ReglaDeNegocioException(
                    $"El producto {codigo} no existe en el catálogo del canal {canalLimpio}.");
            }

            seleccionados.Add(new ProductoSeleccionado(
                delCatalogo.Codigo,
                delCatalogo.Nombre,
                producto.Cantidad));
        }

        return seleccionados;
    }
}
