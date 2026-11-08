using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Oportunidades;

/// <summary>Caso de uso de la oportunidad dentro del módulo Comercial.</summary>
public interface IOportunidadesCasoUso
{
    Task<OportunidadVista> RegistrarAsync(
        NuevaOportunidad datos,
        UsuarioSimulado usuario,
        CancellationToken cancelacion = default);
}
