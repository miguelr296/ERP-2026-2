using Erp.Comercial.Dominio;
using Microsoft.EntityFrameworkCore;

namespace Erp.Comercial.Infraestructura;

/// <summary>
/// Persistencia del módulo Comercial. Cada módulo tiene su contexto y su esquema:
/// ningún otro módulo debe leer estas tablas directamente.
/// </summary>
public class ComercialContext : DbContext
{
    /// <summary>Esquema propio del módulo dentro de la misma base de datos.</summary>
    public const string Esquema = "Comercial";

    public ComercialContext(DbContextOptions<ComercialContext> opciones) : base(opciones)
    {
    }

    public DbSet<Cliente> Clientes => Set<Cliente>();

    public DbSet<Oportunidad> Oportunidades => Set<Oportunidad>();

    public DbSet<ProductoDeOportunidad> ProductosDeOportunidad => Set<ProductoDeOportunidad>();

    public DbSet<ReservaSimulada> Reservas => Set<ReservaSimulada>();

    public DbSet<HistorialEvento> Historial => Set<HistorialEvento>();

    protected override void OnModelCreating(ModelBuilder modelo)
    {
        modelo.HasDefaultSchema(Esquema);

        // Cada entidad tiene su clase de configuración en la carpeta Configuraciones.
        modelo.ApplyConfigurationsFromAssembly(typeof(ComercialContext).Assembly);
    }

    public override int SaveChanges(bool aceptarCambiosEnTexto)
    {
        ImpedirCambiosEnHistorial();
        return base.SaveChanges(aceptarCambiosEnTexto);
    }

    public override Task<int> SaveChangesAsync(
        bool aceptarCambiosEnTexto,
        CancellationToken cancelacion = default)
    {
        ImpedirCambiosEnHistorial();
        return base.SaveChangesAsync(aceptarCambiosEnTexto, cancelacion);
    }

    /// <summary>
    /// COM-T03: el historial no se modifica ni se borra. Se comprueba aquí, en la capa de
    /// persistencia, para que ninguna pantalla ni caso de uso pueda saltarse la regla.
    /// </summary>
    private void ImpedirCambiosEnHistorial()
    {
        var intentos = ChangeTracker.Entries<HistorialEvento>()
            .Any(entrada => entrada.State is EntityState.Modified or EntityState.Deleted);

        if (intentos)
        {
            throw new InvalidOperationException(
                "El historial es inmutable: no se puede modificar ni borrar (COM-T03).");
        }
    }
}
