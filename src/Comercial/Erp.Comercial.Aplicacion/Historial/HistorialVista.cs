using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Historial;

/// <summary>Un evento del historial tal como se muestra en la ficha de un documento.</summary>
public sealed record HistorialVista(
    string Accion,
    string? EstadoAnterior,
    string? EstadoNuevo,
    string Usuario,
    string Rol,
    string? Motivo,
    DateTimeOffset OcurridoEn)
{
    public static HistorialVista Desde(HistorialEvento evento)
    {
        return new HistorialVista(
            evento.Accion,
            evento.EstadoAnterior,
            evento.EstadoNuevo,
            evento.Usuario,
            evento.Rol,
            evento.Motivo,
            evento.OcurridoEn);
    }
}
