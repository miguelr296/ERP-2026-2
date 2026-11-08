using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Oportunidades;

/// <summary>Lo que la pantalla puede mostrar de una oportunidad.</summary>
public sealed record OportunidadVista(
    Guid Id,
    Guid ClienteId,
    string Descripcion,
    string Canal,
    string Sede,
    string Responsable,
    string Estado,
    DateTimeOffset CreadoEn)
{
    public static OportunidadVista Desde(Oportunidad oportunidad)
    {
        return new OportunidadVista(
            oportunidad.Id,
            oportunidad.ClienteId,
            oportunidad.Descripcion,
            oportunidad.Canal,
            oportunidad.Sede,
            oportunidad.Responsable,
            oportunidad.Estado,
            oportunidad.CreadoEn);
    }
}
