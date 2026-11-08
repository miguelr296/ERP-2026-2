namespace Erp.Comercial.Aplicacion.Clientes;

/// <summary>Datos mínimos para dar de alta un cliente (p. 15).</summary>
public sealed record NuevoCliente(
    string Nombre,
    string Documento,
    string? Correo,
    string? Telefono);
