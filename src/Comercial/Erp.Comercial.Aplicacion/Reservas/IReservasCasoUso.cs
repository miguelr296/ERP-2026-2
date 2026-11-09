using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Reservas;

/// <summary>Casos de uso de la reserva simulada de stock (COM-008).</summary>
public interface IReservasCasoUso
{
    Task<ReservaVista> RegistrarAsync(
        Guid oportunidadId,
        NuevaReserva datos,
        UsuarioSimulado usuario,
        CancellationToken cancelacion = default);

    Task<ReservaVista?> BuscarAsync(Guid id, CancellationToken cancelacion = default);
}
