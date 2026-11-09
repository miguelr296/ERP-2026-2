using System.Globalization;
using Erp.Comercial.Aplicacion.Oportunidades;
using Erp.Comercial.Aplicacion.Productos;
using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Cotizaciones;

public sealed class CalculoCotizacionCasoUso(
    IOportunidadesCasoUso oportunidades, ICatalogoCasoUso catalogo,
    ParametrosCotizacion parametros, TimeProvider reloj)
{
    public async Task<CalculoCotizacionVista?> CalcularAsync(
        Guid oportunidadId, CalcularCotizacion solicitud, UsuarioSimulado usuario,
        CancellationToken cancelacion = default)
    {
        if (!usuario.PuedeRegistrarDocumentos)
            throw new ReglaDeNegocioException("El cálculo corresponde a Asesor o Jefatura.");
        if (string.IsNullOrWhiteSpace(solicitud.TipoCliente))
            throw new ReglaDeNegocioException("Indique el tipo de cliente para consultar la lista.");

        var oportunidad = await oportunidades.BuscarAsync(oportunidadId, cancelacion);
        if (oportunidad is null) return null;
        parametros.Validar();
        var fecha = DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(
            reloj.GetUtcNow(), TimeZoneInfo.FindSystemTimeZoneById("America/Lima")).DateTime);
        var tipo = solicitud.TipoCliente.Trim();
        var lista = catalogo.Consultar(oportunidad.Canal, tipo);
        var precios = new List<PrecioDeLinea>();
        var seleccionados = new List<ProductoPrecioVista>();
        foreach (var producto in oportunidad.Productos)
        {
            var candidatos = lista.Where(precio =>
                string.Equals(precio.Codigo, producto.Codigo, StringComparison.OrdinalIgnoreCase)
                && EstaVigente(precio, fecha)).ToArray();
            if (candidatos.Length != 1)
                throw new ReglaDeNegocioException($"El producto {producto.Codigo} debe tener una única lista vigente para el canal y tipo de cliente.");
            var elegido = candidatos[0];
            seleccionados.Add(elegido);
            precios.Add(new PrecioDeLinea(elegido.Codigo, elegido.Nombre, producto.Cantidad, elegido.PrecioUnitario));
        }

        if (seleccionados.Count == 0 || seleccionados.Select(p => p.ListaPrecio).Distinct().Count() != 1
            || seleccionados.Select(p => p.Moneda).Distinct().Count() != 1
            || seleccionados.Any(p => string.IsNullOrWhiteSpace(p.ListaPrecio) || string.IsNullOrWhiteSpace(p.Moneda)))
            throw new ReglaDeNegocioException("Los productos deben pertenecer a una misma lista y moneda.");

        var calculo = CalculoCotizacion.Calcular(precios, parametros.TasaIgv,
            parametros.PreciosIncluyenIgv, parametros.Redondeo);
        return new CalculoCotizacionVista(oportunidad.Id, oportunidad.ClienteId, oportunidad.ClienteNombre,
            oportunidad.Canal, tipo, seleccionados[0].ListaPrecio, seleccionados[0].Moneda,
            fecha, fecha.AddDays(parametros.DiasVigencia), parametros.PlazoEntregaDias,
            parametros.TasaIgv, parametros.PreciosIncluyenIgv, calculo);
    }

    private static bool EstaVigente(ProductoPrecioVista precio, DateOnly fecha) =>
        DateOnly.TryParseExact(precio.VigenteDesde, "yyyy-MM-dd", CultureInfo.InvariantCulture,
            DateTimeStyles.None, out var desde)
        && DateOnly.TryParseExact(precio.VigenteHasta, "yyyy-MM-dd", CultureInfo.InvariantCulture,
            DateTimeStyles.None, out var hasta)
        && desde <= fecha && fecha <= hasta;
}
