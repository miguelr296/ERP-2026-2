using Erp.Comercial.Aplicacion.Clientes;
using Erp.Comercial.Aplicacion.Historial;
using Erp.Comercial.Aplicacion.Oportunidades;
using Erp.Comercial.Dominio;
using Erp.Comercial.Infraestructura;
using Microsoft.EntityFrameworkCore;

namespace Erp.Api.Tests;

/// <summary>
/// Evidencia de COM-005: el alta guarda el documento con su historial y las reglas
/// mínimas se validan en la capa de aplicación, no en la pantalla.
/// Se usa el proveedor en memoria: valida reglas y persistencia del modelo, pero no
/// sustituye la comprobación contra SQL Server.
/// </summary>
public class ComercialPersistenciaTests
{
    private static UsuarioSimulado Asesor =>
        new("asesor.demo", UsuarioSimulado.RolAsesor);

    private static ComercialContext CrearContexto(string nombrePrueba)
    {
        var opciones = new DbContextOptionsBuilder<ComercialContext>()
            .UseInMemoryDatabase(nombrePrueba)
            .Options;

        return new ComercialContext(opciones);
    }

    /// <summary>
    /// Arma el módulo como lo hace la API: repositorio, unidad de trabajo y casos de uso
    /// sobre el mismo contexto. Así la prueba recorre las mismas capas que la aplicación.
    /// </summary>
    private static (
        IClientesCasoUso Clientes,
        IOportunidadesCasoUso Oportunidades,
        IHistorialCasoUso Historial) CrearCasosDeUso(ComercialContext contexto)
    {
        var repositorio = new ComercialRepositorio(contexto);
        var unidadDeTrabajo = new UnidadDeTrabajo(contexto);

        return (
            new ClientesCasoUso(repositorio, unidadDeTrabajo),
            new OportunidadesCasoUso(repositorio, unidadDeTrabajo),
            new HistorialCasoUso(repositorio));
    }

    [Fact]
    public async Task El_alta_de_cliente_guarda_documento_e_historial()
    {
        await using var contexto = CrearContexto(nameof(El_alta_de_cliente_guarda_documento_e_historial));
        var (clientes, _, historial) = CrearCasosDeUso(contexto);

        var cliente = await clientes.RegistrarAsync(
            new NuevoCliente("Comercial Andina SAC", "20512345678", "compras@andina.test", "999111222"),
            Asesor);

        var guardado = await contexto.Clientes.SingleAsync();
        Assert.Equal(cliente.Id, guardado.Id);
        Assert.Equal("20512345678", guardado.Documento);
        Assert.True(guardado.Activo);
        Assert.Equal("asesor.demo", guardado.CreadoPor);

        var eventos = await historial.ConsultarAsync(TiposDocumento.Cliente, cliente.Id);
        var evento = Assert.Single(eventos);
        Assert.Equal("Alta de cliente", evento.Accion);
        Assert.Equal("Activo", evento.EstadoNuevo);
        Assert.Equal("Asesor", evento.Rol);
    }

    [Fact]
    public async Task Un_documento_repetido_se_rechaza_sin_dejar_historial()
    {
        await using var contexto = CrearContexto(nameof(Un_documento_repetido_se_rechaza_sin_dejar_historial));
        var (clientes, _, _) = CrearCasosDeUso(contexto);

        var datos = new NuevoCliente("Famihogar SAC", "20100000001", null, null);
        await clientes.RegistrarAsync(datos, Asesor);

        var error = await Assert.ThrowsAsync<ReglaDeNegocioException>(
            () => clientes.RegistrarAsync(datos, Asesor));

        Assert.Contains("20100000001", error.Message);
        Assert.Equal(1, await contexto.Clientes.CountAsync());
        Assert.Equal(1, await contexto.Historial.CountAsync());
    }

    [Fact]
    public async Task Un_rol_no_autorizado_no_puede_registrar_clientes()
    {
        await using var contexto = CrearContexto(nameof(Un_rol_no_autorizado_no_puede_registrar_clientes));
        var (clientes, _, _) = CrearCasosDeUso(contexto);

        var tesoreria = new UsuarioSimulado("tesoreria.demo", UsuarioSimulado.RolTesoreria);

        await Assert.ThrowsAsync<ReglaDeNegocioException>(
            () => clientes.RegistrarAsync(new NuevoCliente("Cliente A", "20100000002", null, null), tesoreria));

        Assert.Equal(0, await contexto.Clientes.CountAsync());
    }

    [Fact]
    public async Task La_oportunidad_exige_un_cliente_existente()
    {
        await using var contexto = CrearContexto(nameof(La_oportunidad_exige_un_cliente_existente));
        var (_, oportunidades, _) = CrearCasosDeUso(contexto);

        await Assert.ThrowsAsync<ReglaDeNegocioException>(
            () => oportunidades.RegistrarAsync(
                new NuevaOportunidad(Guid.NewGuid(), "Compra de 20 unidades", "Tienda", "Lima Centro", "asesor.demo"),
                Asesor));

        Assert.Equal(0, await contexto.Oportunidades.CountAsync());
        Assert.Equal(0, await contexto.Historial.CountAsync());
    }

    [Fact]
    public async Task La_oportunidad_de_un_cliente_existente_se_guarda_con_historial()
    {
        await using var contexto = CrearContexto(nameof(La_oportunidad_de_un_cliente_existente_se_guarda_con_historial));
        var (clientes, oportunidades, historial) = CrearCasosDeUso(contexto);

        var cliente = await clientes.RegistrarAsync(
            new NuevoCliente("Comercial Andina SAC", "20512345678", null, null),
            Asesor);

        var oportunidad = await oportunidades.RegistrarAsync(
            new NuevaOportunidad(cliente.Id, "Compra de 20 unidades", "Tienda", "Lima Centro", "asesor.demo"),
            Asesor);

        Assert.Equal(EstadosOportunidad.Nueva, oportunidad.Estado);
        Assert.Equal(cliente.Id, oportunidad.ClienteId);

        var eventos = await historial.ConsultarAsync(TiposDocumento.Oportunidad, oportunidad.Id);
        var evento = Assert.Single(eventos);
        Assert.Equal("Alta de oportunidad", evento.Accion);
        Assert.Equal("Nueva", evento.EstadoNuevo);
    }

    [Fact]
    public async Task El_historial_no_se_puede_modificar_ni_borrar()
    {
        await using var contexto = CrearContexto(nameof(El_historial_no_se_puede_modificar_ni_borrar));

        var evento = HistorialEvento.RegistrarAlta(
            TiposDocumento.Cliente,
            Guid.NewGuid(),
            "Alta de cliente",
            "Activo",
            Asesor);

        contexto.Historial.Add(evento);
        await contexto.SaveChangesAsync();

        // Se simula una modificación directa en la capa de datos, saltándose el dominio.
        contexto.Entry(evento).State = EntityState.Modified;
        var errorAlModificar = await Assert.ThrowsAsync<InvalidOperationException>(
            () => contexto.SaveChangesAsync());
        Assert.Contains("inmutable", errorAlModificar.Message);

        contexto.Entry(evento).State = EntityState.Deleted;
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => contexto.SaveChangesAsync());
    }
}
