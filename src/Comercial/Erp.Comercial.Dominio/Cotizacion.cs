using System.Globalization;

namespace Erp.Comercial.Dominio;

/// <summary>Documento guardado. Sus líneas y parámetros conservan el cálculo de la emisión.</summary>
public class Cotizacion
{
    public Guid Id { get; private set; }
    public Guid SolicitudId { get; private set; }
    public string Correlativo { get; private set; } = string.Empty;
    public Guid OportunidadId { get; private set; }
    public Oportunidad? Oportunidad { get; private set; }
    public string TipoCliente { get; private set; } = string.Empty;
    public string ListaPrecio { get; private set; } = string.Empty;
    public string Moneda { get; private set; } = string.Empty;
    public DateOnly EmitidaEn { get; private set; }
    public DateOnly VigenteHasta { get; private set; }
    public int PlazoEntregaDias { get; private set; }
    public decimal TasaIgv { get; private set; }
    public bool PreciosIncluyenIgv { get; private set; }
    public string Redondeo { get; private set; } = string.Empty;
    public string Estado { get; private set; } = "Borrador";
    public bool Activo { get; private set; } = true;
    public decimal Subtotal { get; private set; }
    public decimal Igv { get; private set; }
    public decimal Total { get; private set; }
    public string CreadoPor { get; private set; } = string.Empty;
    public string Rol { get; private set; } = string.Empty;
    public List<LineaDeCotizacion> Lineas { get; private set; } = new();

    private Cotizacion() { }

    public static Cotizacion Emitir(
        Guid solicitudId, long numero, Guid oportunidadId,
        string tipoCliente, string listaPrecio, string moneda,
        DateOnly fecha, DateOnly hasta, int plazo, decimal tasaIgv,
        bool preciosIncluyenIgv, MidpointRounding redondeo,
        CalculoCotizacion calculo, UsuarioSimulado usuario)
    {
        if (solicitudId == Guid.Empty || oportunidadId == Guid.Empty || numero <= 0)
            throw new ReglaDeNegocioException("La cotización requiere solicitud, origen y número válidos.");
        if (!usuario.PuedeRegistrarDocumentos || string.IsNullOrWhiteSpace(usuario.Nombre) || usuario.Nombre.Length > 100)
            throw new ReglaDeNegocioException("Indique un Asesor o Jefatura válido para emitir.");
        if (calculo.Lineas.Count == 0 || hasta < fecha || plazo <= 0)
            throw new ReglaDeNegocioException("Revise las líneas, vigencia y plazo de la cotización.");

        var documento = new Cotizacion
        {
            Id = Guid.NewGuid(), SolicitudId = solicitudId,
            Correlativo = $"COT-{fecha.Year}-{numero.ToString("D5", CultureInfo.InvariantCulture)}",
            OportunidadId = oportunidadId, TipoCliente = tipoCliente,
            ListaPrecio = listaPrecio, Moneda = moneda, EmitidaEn = fecha, VigenteHasta = hasta,
            PlazoEntregaDias = plazo, TasaIgv = tasaIgv, PreciosIncluyenIgv = preciosIncluyenIgv,
            Redondeo = redondeo.ToString(), Subtotal = calculo.Subtotal, Igv = calculo.Igv,
            Total = calculo.Total, CreadoPor = usuario.Nombre, Rol = usuario.Rol
        };
        documento.Lineas = calculo.Lineas.Select(linea => LineaDeCotizacion.Copiar(documento.Id, linea)).ToList();
        return documento;
    }
}

public class LineaDeCotizacion
{
    public Guid Id { get; private set; }
    public Guid CotizacionId { get; private set; }
    public string Codigo { get; private set; } = string.Empty;
    public string Nombre { get; private set; } = string.Empty;
    public int Cantidad { get; private set; }
    public decimal PrecioUnitario { get; private set; }
    public decimal Importe { get; private set; }
    private LineaDeCotizacion() { }

    internal static LineaDeCotizacion Copiar(Guid cotizacionId, LineaCalculada linea) => new()
    {
        Id = Guid.NewGuid(), CotizacionId = cotizacionId, Codigo = linea.Codigo,
        Nombre = linea.Nombre, Cantidad = linea.Cantidad,
        PrecioUnitario = linea.PrecioUnitario, Importe = linea.Importe
    };
}
