namespace Erp.Comercial.Dominio;

/// <summary>
/// Producto ya validado contra el catálogo, listo para asociarse a una oportunidad.
/// El nombre lo aporta el catálogo, no el texto libre de la pantalla.
/// </summary>
public sealed record ProductoSeleccionado(string Codigo, string Nombre, int Cantidad);
