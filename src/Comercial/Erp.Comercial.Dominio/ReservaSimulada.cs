namespace Erp.Comercial.Dominio;

/// <summary>
/// Reserva de stock comprometida con el proveedor simulado de Logística.
/// Pertenece a una oportunidad y guarda el identificador que devolvió el adaptador,
/// porque ese identificador es la evidencia que luego consume la orden de venta (COM-R08).
/// La simulación se reemplaza por Logística real sin cambiar este documento.
/// </summary>
public class ReservaSimulada
{
    public Guid Id { get; private set; }

    public Guid OportunidadId { get; private set; }

    public Oportunidad? Oportunidad { get; private set; }

    public string Producto { get; private set; } = string.Empty;

    public int Cantidad { get; private set; }

    /// <summary>Identificador que devolvió el proveedor simulado de reserva.</summary>
    public string Identificador { get; private set; } = string.Empty;

    public string Estado { get; private set; } = string.Empty;

    public DateTimeOffset SolicitadaEn { get; private set; }

    public DateTimeOffset VigenteHasta { get; private set; }

    public string SolicitadaPor { get; private set; } = string.Empty;

    /// <summary>Constructor que usa la capa de persistencia al leer la base de datos.</summary>
    private ReservaSimulada()
    {
    }

    public static ReservaSimulada Registrar(
        Guid oportunidadId,
        string producto,
        int cantidad,
        string identificador,
        DateTimeOffset solicitadaEn,
        DateTimeOffset vigenteHasta,
        UsuarioSimulado usuario)
    {
        if (oportunidadId == Guid.Empty)
        {
            throw new ReglaDeNegocioException("La reserva necesita una oportunidad.");
        }

        ValidarSolicitud(producto, cantidad);

        if (string.IsNullOrWhiteSpace(identificador))
        {
            throw new ReglaDeNegocioException(
                "La reserva aceptada debe conservar el identificador del proveedor.");
        }

        if (vigenteHasta <= solicitadaEn)
        {
            throw new ReglaDeNegocioException("La reserva debe tener una vigencia posterior a su solicitud.");
        }

        return new ReservaSimulada
        {
            Id = Guid.NewGuid(),
            OportunidadId = oportunidadId,
            Producto = producto.Trim(),
            Cantidad = cantidad,
            Identificador = identificador.Trim(),
            Estado = EstadosReserva.Comprometida,
            SolicitadaEn = solicitadaEn,
            VigenteHasta = vigenteHasta,
            SolicitadaPor = usuario.Nombre
        };
    }

    /// <summary>
    /// Valida la solicitud antes de llamar al proveedor: no se pide stock por un dato
    /// inválido ni se gasta la simulación en vano.
    /// </summary>
    public static void ValidarSolicitud(string producto, int cantidad)
    {
        if (string.IsNullOrWhiteSpace(producto))
        {
            throw new ReglaDeNegocioException("Indique el producto que se desea reservar.");
        }

        if (cantidad <= 0)
        {
            throw new ReglaDeNegocioException("La cantidad reservada debe ser mayor que cero.");
        }
    }

    /// <summary>Una reserva vencida no puede liberar una orden de venta (COM-R08).</summary>
    public bool EstaVigente(DateTimeOffset momento) => momento <= VigenteHasta;
}
