namespace Erp.Comercial.Dominio;

/// <summary>
/// Estados de la reserva simulada de Logística. Solo se guarda la reserva aceptada;
/// el rechazo se informa al usuario y no deja documento (COM-T01).
/// </summary>
public static class EstadosReserva
{
    public const string Comprometida = "Comprometida";
    public const string Rechazada = "Rechazada";
}
