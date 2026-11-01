namespace Erp.Comercial.Ventas.Datos;

public enum TipoFabricacion
{
    Mts,
    Mto
}

public enum EstadoListaPrecio
{
    Vigente,
    Vencida
}

public enum EstadoCotizacion
{
    Borrador,
    Aprobada,
    Enviada,
    Aceptada,
    Rechazada,
    Vencida
}

public enum EstadoAnticipo
{
    Registrado,
    Conciliado,
    Confirmado
}

public enum EstadoOrdenVenta
{
    Confirmada,
    Liberada,
    EnProceso,
    EnPreparacion,
    ListaParaDespacho,
    Entregada,
    Facturada
}
