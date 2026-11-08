namespace Erp.Comercial.Dominio;

/// <summary>
/// Error de una regla del negocio, no de la infraestructura. La API lo traduce a un 400
/// con el mensaje para la pantalla.
/// </summary>
public class ReglaDeNegocioException : Exception
{
    public ReglaDeNegocioException(string mensaje) : base(mensaje)
    {
    }
}
