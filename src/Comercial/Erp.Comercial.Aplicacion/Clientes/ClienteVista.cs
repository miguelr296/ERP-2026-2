using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Clientes;

/// <summary>Lo que la pantalla puede mostrar de un cliente. No expone la entidad del dominio.</summary>
public sealed record ClienteVista(
    Guid Id,
    string Nombre,
    string Documento,
    string? Correo,
    string? Telefono,
    bool Activo,
    DateTimeOffset CreadoEn)
{
    public static ClienteVista Desde(Cliente cliente)
    {
        return new ClienteVista(
            cliente.Id,
            cliente.Nombre,
            cliente.Documento,
            cliente.Correo,
            cliente.Telefono,
            cliente.Activo,
            cliente.CreadoEn);
    }
}
