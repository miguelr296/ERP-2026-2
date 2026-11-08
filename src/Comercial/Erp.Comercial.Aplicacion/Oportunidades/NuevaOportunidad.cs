namespace Erp.Comercial.Aplicacion.Oportunidades;

/// <summary>
/// Datos para registrar una oportunidad de un cliente ya existente (COM-R01).
/// El canal, la sede y el responsable son los de la p. 15.
/// </summary>
public sealed record NuevaOportunidad(
    Guid ClienteId,
    string Descripcion,
    string Canal,
    string Sede,
    string Responsable);
