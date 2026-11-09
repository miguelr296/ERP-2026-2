namespace Erp.Comercial.Dominio;

/// <summary>
/// Nombres con los que el historial identifica a qué documento pertenece cada evento.
/// Se guardan en texto para que el historial no dependa de tablas de otros módulos.
/// </summary>
public static class TiposDocumento
{
    public const string Cotizacion = "Cotizacion";
    public const string Cliente = "Cliente";
    public const string Oportunidad = "Oportunidad";
    public const string Reserva = "Reserva";
}
