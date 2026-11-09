namespace Erp.Comercial.Dominio;

/// <summary>
/// Cliente del módulo Comercial. Se da de baja con <see cref="Activo"/> en falso;
/// nunca se borra físicamente. Solo se crea por <see cref="Registrar"/>, que valida
/// los datos obligatorios del negocio.
/// </summary>
public class Cliente
{
    /// <summary>
    /// Longitud máxima del documento. Es el tamaño del campo definido con el modelo de
    /// COM-005 y se valida aquí para que el alta y la búsqueda usen el mismo límite.
    /// No representa un formato legal de DNI o RUC.
    /// </summary>
    public const int LongitudMaximaDocumento = 20;

    public Guid Id { get; private set; }

    public string Nombre { get; private set; } = string.Empty;

    public string Documento { get; private set; } = string.Empty;

    public string? Correo { get; private set; }

    public string? Telefono { get; private set; }

    public bool Activo { get; private set; }

    public DateTimeOffset CreadoEn { get; private set; }

    public string CreadoPor { get; private set; } = string.Empty;

    public List<Oportunidad> Oportunidades { get; private set; } = new();

    /// <summary>Constructor que usa la capa de persistencia al leer la base de datos.</summary>
    private Cliente()
    {
    }

    public static Cliente Registrar(
        string nombre,
        string documento,
        string? correo,
        string? telefono,
        UsuarioSimulado usuario)
    {
        if (string.IsNullOrWhiteSpace(nombre))
        {
            throw new ReglaDeNegocioException("El nombre del cliente es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(documento))
        {
            throw new ReglaDeNegocioException("El documento del cliente es obligatorio.");
        }

        var documentoLimpio = documento.Trim();
        if (documentoLimpio.Length > LongitudMaximaDocumento)
        {
            throw new ReglaDeNegocioException(
                $"El documento del cliente admite hasta {LongitudMaximaDocumento} caracteres.");
        }

        return new Cliente
        {
            Id = Guid.NewGuid(),
            Nombre = nombre.Trim(),
            Documento = documentoLimpio,
            Correo = string.IsNullOrWhiteSpace(correo) ? null : correo.Trim(),
            Telefono = string.IsNullOrWhiteSpace(telefono) ? null : telefono.Trim(),
            Activo = true,
            CreadoEn = DateTimeOffset.UtcNow,
            CreadoPor = usuario.Nombre
        };
    }

    /// <summary>Borrado lógico: el cliente deja de estar disponible sin perder su historial.</summary>
    public void Desactivar()
    {
        Activo = false;
    }
}
