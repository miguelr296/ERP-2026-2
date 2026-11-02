using Erp.Compartido.Contratos;
using Erp.Compartido.Datos;
using Erp.Compartido.Servicios;

namespace Erp.Pruebas.Compartido;

// S1-08: el historial guarda quién, con qué rol, cuándo y por qué (TRZ-01),
// y no se puede editar ni borrar (TRZ-03). TRZ-04 (el documento no se borra) va con cada documento.
public class RegistroDeHistorialPruebas
{
    [Fact]
    public async Task Historial_CambioDeEstado_RegistraUsuarioYFecha()
    {
        var repositorio = new RepositorioEnMemoria();
        var registro = new RegistroDeHistorial(repositorio);

        var cambio = new CambioDeEstado(
            "Cotizacion", 1, "Borrador", "Enviada", 3, "Vendedor", "Se envió al cliente");

        await registro.RegistrarCambioDeEstado(cambio);

        var entrada = Assert.Single(repositorio.Entradas);
        Assert.Equal("Cotizacion", entrada.TipoDocumento);
        Assert.Equal(1, entrada.DocumentoId);
        Assert.Equal("Borrador", entrada.EstadoAnterior);
        Assert.Equal("Enviada", entrada.EstadoNuevo);
        Assert.Equal(3, entrada.UsuarioId);
        Assert.Equal("Vendedor", entrada.Rol);
        Assert.Equal("Se envió al cliente", entrada.Motivo);
        Assert.NotEqual(default, entrada.FechaHora);
    }

    [Fact]
    public async Task Historial_IntentoDeEditar_EsRechazado()
    {
        var registro = new RegistroDeHistorial(new RepositorioEnMemoria());

        await Assert.ThrowsAsync<InvalidOperationException>(() => registro.Modificar(1));
    }

    [Fact]
    public async Task Historial_IntentoDeEliminarEntrada_EsRechazado()
    {
        var registro = new RegistroDeHistorial(new RepositorioEnMemoria());

        await Assert.ThrowsAsync<InvalidOperationException>(() => registro.Eliminar(1));
    }

    /// <summary>
    /// Doble de prueba: guarda las entradas en memoria, sin SQL Server,
    /// para que las reglas se puedan probar solas y rápido.
    /// </summary>
    private class RepositorioEnMemoria : IHistorialEstadoRepositorio
    {
        public List<HistorialEstado> Entradas { get; } = [];

        public Task Agregar(HistorialEstado entrada)
        {
            Entradas.Add(entrada);
            return Task.CompletedTask;
        }

        public Task<IReadOnlyList<HistorialEstado>> Listar(string tipoDocumento, int documentoId)
        {
            IReadOnlyList<HistorialEstado> entradas = Entradas
                .Where(entrada => entrada.TipoDocumento == tipoDocumento && entrada.DocumentoId == documentoId)
                .OrderBy(entrada => entrada.FechaHora)
                .ToList();

            return Task.FromResult(entradas);
        }
    }
}
