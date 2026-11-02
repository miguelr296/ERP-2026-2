using Erp.Compartido.Datos;

namespace Erp.Compartido.Contratos;

/// <summary>
/// Lo que un módulo entrega para registrar un cambio de estado (TRZ-01).
/// </summary>
public record CambioDeEstado(
    string TipoDocumento,
    int DocumentoId,
    string? EstadoAnterior,
    string EstadoNuevo,
    int UsuarioId,
    string Rol,
    string Motivo);

/// <summary>
/// Interfaz pública de Compartido para el historial. Es lo único que otros módulos pueden usar.
/// </summary>
public interface IHistorialDeEstados
{
    Task RegistrarCambioDeEstado(CambioDeEstado cambio);

    Task<IReadOnlyList<HistorialEstado>> ObtenerHistorial(string tipoDocumento, int documentoId);
}
