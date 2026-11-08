namespace Erp.Comercial.Dominio;

/// <summary>
/// Simula al usuario que ejecuta una operación. En el sprint no hay autenticación real:
/// el rol llega desde la pantalla y la API lo valida igual que si viniera de un inicio de sesión.
/// </summary>
public sealed record UsuarioSimulado(string Nombre, string Rol)
{
    public const string RolAsesor = "Asesor";
    public const string RolJefatura = "Jefatura";
    public const string RolTesoreria = "Tesoreria";

    public bool PuedeRegistrarDocumentos =>
        Rol is RolAsesor or RolJefatura;
}
