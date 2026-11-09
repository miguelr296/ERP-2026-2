using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Reservas;

/// <summary>
/// Vista de la reserva para la API y la ficha imprimible. La marca de simulación se
/// muestra siempre: el usuario debe saber que el stock no es real.
/// </summary>
public sealed record ReservaVista(
    Guid Id,
    Guid OportunidadId,
    string Producto,
    int Cantidad,
    string Identificador,
    string Estado,
    DateTimeOffset SolicitadaEn,
    DateTimeOffset VigenteHasta,
    string SolicitadaPor)
{
    public string Simulacion => "Logística simulada";

    public static ReservaVista Desde(ReservaSimulada reserva) =>
        new(
            reserva.Id,
            reserva.OportunidadId,
            reserva.Producto,
            reserva.Cantidad,
            reserva.Identificador,
            reserva.Estado,
            reserva.SolicitadaEn,
            reserva.VigenteHasta,
            reserva.SolicitadaPor);
}
