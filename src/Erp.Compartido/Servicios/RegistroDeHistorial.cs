using Erp.Compartido.Contratos;
using Erp.Compartido.Datos;

namespace Erp.Compartido.Servicios;

/// <summary>
/// Reglas del historial (TRZ-01 y TRZ-03): cada cambio guarda quién, con qué rol,
/// cuándo y por qué; y el historial solo se agrega.
/// </summary>
public class RegistroDeHistorial(IHistorialEstadoRepositorio repositorio) : IHistorialDeEstados
{
    public async Task RegistrarCambioDeEstado(CambioDeEstado cambio)
    {
        if (string.IsNullOrWhiteSpace(cambio.TipoDocumento))
        {
            throw new ArgumentException("El historial necesita el tipo de documento.", nameof(cambio));
        }

        if (string.IsNullOrWhiteSpace(cambio.EstadoNuevo))
        {
            throw new ArgumentException("El historial necesita el estado nuevo.", nameof(cambio));
        }

        if (cambio.UsuarioId <= 0)
        {
            throw new ArgumentException("El historial necesita el usuario que hace el cambio.", nameof(cambio));
        }

        if (string.IsNullOrWhiteSpace(cambio.Rol))
        {
            throw new ArgumentException("El historial necesita el rol del usuario.", nameof(cambio));
        }

        if (string.IsNullOrWhiteSpace(cambio.Motivo))
        {
            throw new ArgumentException("El historial necesita el motivo del cambio.", nameof(cambio));
        }

        var entrada = new HistorialEstado
        {
            TipoDocumento = cambio.TipoDocumento,
            DocumentoId = cambio.DocumentoId,
            EstadoAnterior = cambio.EstadoAnterior,
            EstadoNuevo = cambio.EstadoNuevo,
            UsuarioId = cambio.UsuarioId,
            Rol = cambio.Rol,
            FechaHora = DateTime.Now,
            Motivo = cambio.Motivo
        };

        await repositorio.Agregar(entrada);
    }

    public Task<IReadOnlyList<HistorialEstado>> ObtenerHistorial(string tipoDocumento, int documentoId)
    {
        return repositorio.Listar(tipoDocumento, documentoId);
    }

    /// <summary>
    /// TRZ-03: una entrada del historial no se puede modificar. La protección del documento
    /// contra el borrado físico (TRZ-04) se implementa en el módulo dueño de cada documento.
    /// </summary>
    public Task Modificar(int entradaId)
    {
        throw new InvalidOperationException("El historial no se edita (TRZ-03).");
    }

    /// <summary>
    /// TRZ-03: una entrada del historial no se borra. TRZ-04 (el documento se anula con motivo,
    /// no se borra) se implementa en el módulo dueño de cada documento.
    /// </summary>
    public Task Eliminar(int entradaId)
    {
        throw new InvalidOperationException(
            "El historial no se borra; el documento se anula con estado y motivo y conserva su historial (TRZ-03).");
    }
}
