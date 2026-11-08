using Erp.Comercial.Aplicacion.Puertos;

namespace Erp.Comercial.Infraestructura;

/// <summary>
/// Confirma en un solo SaveChanges todo lo que la operación agregó. Con eso, el documento
/// y su historial se guardan juntos o no se guarda ninguno (COM-T01).
/// </summary>
public class UnidadDeTrabajo : IUnidadDeTrabajo
{
    private readonly ComercialContext _contexto;

    public UnidadDeTrabajo(ComercialContext contexto)
    {
        _contexto = contexto;
    }

    public Task<int> GuardarAsync(CancellationToken cancelacion = default)
    {
        return _contexto.SaveChangesAsync(cancelacion);
    }
}
