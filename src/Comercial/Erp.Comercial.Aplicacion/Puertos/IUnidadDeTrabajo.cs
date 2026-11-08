namespace Erp.Comercial.Aplicacion.Puertos;

/// <summary>
/// Confirma en un solo guardado todo lo que la operación de negocio agregó. Un documento
/// y su historial se confirman juntos o no se confirman (COM-T01).
/// </summary>
public interface IUnidadDeTrabajo
{
    Task<int> GuardarAsync(CancellationToken cancelacion = default);
}
