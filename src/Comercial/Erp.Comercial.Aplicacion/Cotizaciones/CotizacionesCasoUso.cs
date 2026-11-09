using System.Text.Json.Serialization;
using Erp.Comercial.Aplicacion.Historial;
using Erp.Comercial.Aplicacion.Oportunidades;
using Erp.Comercial.Aplicacion.Puertos;
using Erp.Comercial.Dominio;

namespace Erp.Comercial.Aplicacion.Cotizaciones;

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record NuevaCotizacion(Guid SolicitudId, string TipoCliente);

public sealed record CotizacionVista(
    Guid Id, Guid SolicitudId, string Correlativo, Guid OportunidadId, Guid ClienteId,
    string TipoCliente, string ListaPrecio, string Moneda, string Estado,
    DateOnly EmitidaEn, DateOnly VigenteHasta, int PlazoEntregaDias,
    decimal TasaIgv, bool PreciosIncluyenIgv, string Redondeo,
    decimal Subtotal, decimal Igv, decimal Total, string CreadoPor, string Rol,
    IReadOnlyList<LineaCalculada> Lineas, OportunidadVista Origen,
    IReadOnlyList<HistorialVista> Historial);

public sealed record ResultadoEmision(CotizacionVista Ficha, bool Creada);

public sealed class CotizacionesCasoUso(
    ICotizacionesRepositorio cotizaciones, INumeradorCotizaciones numerador,
    IComercialRepositorio comercial, IOportunidadesCasoUso oportunidades,
    CalculoCotizacionCasoUso calculos, ParametrosCotizacion parametros,
    IHistorialCasoUso historial)
{
    public async Task<ResultadoEmision?> EmitirAsync(Guid oportunidadId, NuevaCotizacion datos,
        UsuarioSimulado usuario, CancellationToken cancelacion = default)
    {
        if (!usuario.PuedeRegistrarDocumentos)
            throw new ReglaDeNegocioException("La emisión corresponde a Asesor o Jefatura.");
        if (datos.SolicitudId == Guid.Empty || string.IsNullOrWhiteSpace(datos.TipoCliente))
            throw new ReglaDeNegocioException("Indique una referencia de solicitud y el tipo de cliente.");
        var tipo = datos.TipoCliente.Trim();
        var existente = await cotizaciones.BuscarPorSolicitudAsync(datos.SolicitudId, cancelacion);
        if (existente is not null)
        {
            ValidarReintento(existente, oportunidadId, tipo);
            return new ResultadoEmision(await CrearVistaAsync(existente, cancelacion), false);
        }

        var calculo = await calculos.CalcularAsync(oportunidadId, new CalcularCotizacion(tipo), usuario, cancelacion);
        if (calculo is null) return null;
        if (!await comercial.ExisteOportunidadActivaAsync(oportunidadId, cancelacion)
            || !await comercial.ExisteClienteActivoAsync(calculo.ClienteId, cancelacion))
            throw new ReglaDeNegocioException("La oportunidad y el cliente deben estar activos para emitir.");

        var numero = await numerador.SiguienteAsync(cancelacion);
        var documento = Cotizacion.Emitir(datos.SolicitudId, numero, oportunidadId, calculo.ClienteId,
            tipo, calculo.ListaPrecio, calculo.Moneda, calculo.FechaCalculo, calculo.VigenteHasta,
            calculo.PlazoEntregaDias, calculo.TasaIgv, calculo.PreciosIncluyenIgv,
            parametros.Redondeo, calculo.Calculo, usuario);
        var guardada = await cotizaciones.GuardarAsync(documento, cancelacion);
        ValidarReintento(guardada, oportunidadId, tipo);
        return new ResultadoEmision(await CrearVistaAsync(guardada, cancelacion), guardada.Id == documento.Id);
    }

    public async Task<CotizacionVista?> BuscarAsync(Guid id, CancellationToken cancelacion = default)
    {
        var documento = await cotizaciones.BuscarAsync(id, cancelacion);
        return documento is null ? null : await CrearVistaAsync(documento, cancelacion);
    }

    private static void ValidarReintento(Cotizacion documento, Guid oportunidadId, string tipo)
    {
        if (documento.OportunidadId != oportunidadId || documento.TipoCliente != tipo)
            throw new ReglaDeNegocioException("La referencia de solicitud ya corresponde a otra operación.");
    }

    private async Task<CotizacionVista> CrearVistaAsync(Cotizacion documento, CancellationToken cancelacion)
    {
        var origen = await oportunidades.BuscarAsync(documento.OportunidadId, cancelacion)
            ?? throw new InvalidOperationException("La cotización no tiene oportunidad consultable.");
        var eventos = await historial.ConsultarAsync(TiposDocumento.Cotizacion, documento.Id, cancelacion);
        return new CotizacionVista(documento.Id, documento.SolicitudId, documento.Correlativo,
            documento.OportunidadId, documento.ClienteId, documento.TipoCliente, documento.ListaPrecio,
            documento.Moneda, documento.Estado, documento.EmitidaEn, documento.VigenteHasta,
            documento.PlazoEntregaDias, documento.TasaIgv, documento.PreciosIncluyenIgv, documento.Redondeo,
            documento.Subtotal, documento.Igv, documento.Total, documento.CreadoPor, documento.Rol,
            documento.Lineas.OrderBy(l => l.Codigo).Select(l => new LineaCalculada(
                l.Codigo, l.Nombre, l.Cantidad, l.PrecioUnitario, l.Importe)).ToArray(), origen, eventos);
    }
}
