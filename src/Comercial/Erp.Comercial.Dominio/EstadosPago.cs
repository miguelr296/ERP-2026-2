namespace Erp.Comercial.Dominio;

/// <summary>
/// Estados con los que el proveedor simulado de Tesorería responde una confirmación.
/// Se conserva el rechazo: un pago rechazado no valida nada (COM-R06).
/// </summary>
public static class EstadosPago
{
    public const string Confirmado = "Confirmado";
    public const string Rechazado = "Rechazado";
}
