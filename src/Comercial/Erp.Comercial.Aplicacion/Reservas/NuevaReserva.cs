namespace Erp.Comercial.Aplicacion.Reservas;

/// <summary>Datos que llegan desde la pantalla para pedir una reserva de stock.</summary>
public sealed record NuevaReserva(string Producto, int Cantidad);
