using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Reservas;

/// <summary>
/// Pide la reserva al contrato de Logística y solo guarda el documento cuando el
/// proveedor la acepta. Si rechaza, no se escribe reserva ni historial: el rechazo se
/// informa y la oportunidad queda como estaba (COM-T01).
/// </summary>
public class ReservasCasoUso : IReservasCasoUso
{
    private readonly IComercialRepositorio _repositorio;
    private readonly IUnidadDeTrabajo _unidadDeTrabajo;
    private readonly IReservaDeStock _reservaDeStock;

    public ReservasCasoUso(
        IComercialRepositorio repositorio,
        IUnidadDeTrabajo unidadDeTrabajo,
        IReservaDeStock reservaDeStock)
    {
        _repositorio = repositorio;
        _unidadDeTrabajo = unidadDeTrabajo;
        _reservaDeStock = reservaDeStock;
    }

    public async Task<ReservaVista> RegistrarAsync(
        Guid oportunidadId,
        NuevaReserva datos,
        UsuarioSimulado usuario,
        CancellationToken cancelacion = default)
    {
        if (!usuario.PuedeRegistrarDocumentos)
        {
            throw new ReglaDeNegocioException(
                $"El rol {usuario.Rol} no puede reservar stock. Corresponde a Asesor o Jefatura.");
        }

        ReservaSimulada.ValidarSolicitud(datos.Producto, datos.Cantidad);

        var oportunidadDisponible = await _repositorio.ExisteOportunidadActivaAsync(
            oportunidadId,
            cancelacion);

        if (!oportunidadDisponible)
        {
            throw new ReglaDeNegocioException(
                "La oportunidad no existe o está inactiva. Registre la oportunidad antes de reservar.");
        }

        // La dependencia externa se consulta antes de agregar nada a la unidad de trabajo.
        var respuesta = await _reservaDeStock.SolicitarAsync(
            new SolicitudReserva(oportunidadId, datos.Producto.Trim(), datos.Cantidad),
            cancelacion);

        if (!respuesta.Aceptada)
        {
            throw new ReglaDeNegocioException(
                $"Logística simulada rechazó la reserva: {respuesta.Motivo}");
        }

        if (respuesta.VigenteHasta is not { } vigenteHasta)
        {
            throw new ReglaDeNegocioException(
                "El proveedor aceptó la reserva sin indicar su vigencia; no se registra.");
        }

        var reserva = ReservaSimulada.Registrar(
            oportunidadId,
            datos.Producto,
            datos.Cantidad,
            respuesta.Identificador,
            respuesta.Fecha,
            vigenteHasta,
            usuario);

        _repositorio.AgregarReserva(reserva);

        _repositorio.AgregarHistorial(HistorialEvento.RegistrarAlta(
            TiposDocumento.Reserva,
            reserva.Id,
            "Reserva comprometida",
            reserva.Estado,
            usuario,
            $"Reserva {reserva.Identificador} · {reserva.Producto} x {reserva.Cantidad}"));

        // Reserva e historial se confirman en el mismo guardado.
        await _unidadDeTrabajo.GuardarAsync(cancelacion);

        return ReservaVista.Desde(reserva);
    }

    public async Task<ReservaVista?> BuscarAsync(
        Guid id,
        CancellationToken cancelacion = default)
    {
        var reserva = await _repositorio.BuscarReservaAsync(id, cancelacion);
        return reserva is null ? null : ReservaVista.Desde(reserva);
    }
}
