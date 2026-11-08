using Erp.Comercial.Dominio;

namespace Erp.Api.Http;

/// <summary>
/// Pequeñas ayudas para las rutas HTTP. Mantienen a Program.cs corto y dejan en un solo
/// lugar la simulación de rol y la traducción de errores del negocio.
/// </summary>
public static class PeticionesHttp
{
    /// <summary>
    /// En este sprint no hay inicio de sesión real: el rol se simula con las cabeceras
    /// X-Usuario y X-Rol. La API las valida igual que validaría un usuario autenticado.
    /// </summary>
    public static UsuarioSimulado LeerUsuario(HttpRequest peticion)
    {
        var nombre = peticion.Headers["X-Usuario"].FirstOrDefault();
        var rol = peticion.Headers["X-Rol"].FirstOrDefault();

        return new UsuarioSimulado(
            string.IsNullOrWhiteSpace(nombre) ? "asesor.demo" : nombre,
            string.IsNullOrWhiteSpace(rol) ? UsuarioSimulado.RolAsesor : rol);
    }

    /// <summary>
    /// Un error de regla de negocio responde 400 con su mensaje; cualquier otra excepción
    /// sigue su curso para no ocultar fallos técnicos.
    /// </summary>
    public static async Task<IResult> EjecutarAsync(Func<Task<IResult>> accion)
    {
        try
        {
            return await accion();
        }
        catch (ReglaDeNegocioException error)
        {
            return Results.Problem(
                title: "Regla de negocio",
                detail: error.Message,
                statusCode: StatusCodes.Status400BadRequest);
        }
    }
}
