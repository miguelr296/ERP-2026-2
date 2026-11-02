using Erp.Comercial.Crm.Datos;
using Erp.Comercial.Ventas.Datos;
using Erp.Compartido.Datos;
using Microsoft.EntityFrameworkCore;

namespace Erp.Api.Datos;

public class ErpDbContext(DbContextOptions<ErpDbContext> opciones) : DbContext(opciones)
{
    public DbSet<Sede> Sedes => Set<Sede>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<HistorialEstado> HistorialEstados => Set<HistorialEstado>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Oportunidad> Oportunidades => Set<Oportunidad>();
    public DbSet<OportunidadProducto> ProductosOportunidad => Set<OportunidadProducto>();
    public DbSet<Mueble> Muebles => Set<Mueble>();
    public DbSet<ListaPrecio> ListasPrecio => Set<ListaPrecio>();
    public DbSet<PrecioLista> PreciosLista => Set<PrecioLista>();
    public DbSet<Cotizacion> Cotizaciones => Set<Cotizacion>();
    public DbSet<CotizacionLinea> LineasCotizacion => Set<CotizacionLinea>();
    public DbSet<Anticipo> Anticipos => Set<Anticipo>();
    public DbSet<OrdenVenta> OrdenesVenta => Set<OrdenVenta>();

    protected override void OnModelCreating(ModelBuilder modelo)
    {
        ConfigurarCompartido(modelo);
        ConfigurarCrm(modelo);
        ConfigurarVentas(modelo);
        DatosSemilla.Configurar(modelo);
    }

    private static void ConfigurarCompartido(ModelBuilder modelo)
    {
        modelo.Entity<Sede>(entidad =>
        {
            entidad.ToTable("Sede", "compartido");
            entidad.HasKey(sede => sede.Id);
            entidad.Property(sede => sede.Codigo).HasMaxLength(20).IsRequired();
            entidad.Property(sede => sede.Nombre).HasMaxLength(100).IsRequired();
            entidad.HasIndex(sede => sede.Codigo);
        });

        modelo.Entity<Usuario>(entidad =>
        {
            entidad.ToTable("Usuario", "compartido");
            entidad.HasKey(usuario => usuario.Id);
            entidad.Property(usuario => usuario.Nombre).HasMaxLength(120).IsRequired();
            entidad.Property(usuario => usuario.Rol).HasConversion<string>().HasMaxLength(50);
            entidad.HasOne<Sede>().WithMany().HasForeignKey(usuario => usuario.SedeId);
        });

        modelo.Entity<HistorialEstado>(entidad =>
        {
            entidad.ToTable("HistorialEstado", "compartido");
            entidad.HasKey(entrada => entrada.Id);
            entidad.Property(entrada => entrada.TipoDocumento).HasMaxLength(30).IsRequired();
            entidad.Property(entrada => entrada.EstadoAnterior).HasMaxLength(30);
            entidad.Property(entrada => entrada.EstadoNuevo).HasMaxLength(30).IsRequired();
            entidad.Property(entrada => entrada.Rol).HasMaxLength(50).IsRequired();
            entidad.Property(entrada => entrada.Motivo).HasMaxLength(300).IsRequired();
            entidad.HasIndex(entrada => new { entrada.TipoDocumento, entrada.DocumentoId, entrada.FechaHora });
            entidad.HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(entrada => entrada.UsuarioId)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }

    private static void ConfigurarCrm(ModelBuilder modelo)
    {
        modelo.Entity<Cliente>(entidad =>
        {
            entidad.ToTable("Cliente", "comercial");
            entidad.HasKey(cliente => cliente.Id);
            entidad.Property(cliente => cliente.TipoDocumento).HasConversion<string>().HasMaxLength(10);
            entidad.Property(cliente => cliente.NumeroDocumento).HasMaxLength(11).IsRequired();
            entidad.Property(cliente => cliente.Nombre).HasMaxLength(150).IsRequired();
            entidad.Property(cliente => cliente.TipoCliente).HasConversion<string>().HasMaxLength(20);
            entidad.Property(cliente => cliente.Estado).HasConversion<string>().HasMaxLength(30);
            entidad.Property(cliente => cliente.Direccion).HasMaxLength(200).IsRequired();
            entidad.Property(cliente => cliente.Telefono).HasMaxLength(30).IsRequired();
            entidad.Property(cliente => cliente.Correo).HasMaxLength(120).IsRequired();
            entidad.HasIndex(cliente => cliente.NumeroDocumento);
        });

        modelo.Entity<Oportunidad>(entidad =>
        {
            entidad.ToTable("Oportunidad", "comercial");
            entidad.HasKey(oportunidad => oportunidad.Id);
            entidad.Property(oportunidad => oportunidad.Numero).HasMaxLength(30).IsRequired();
            entidad.Property(oportunidad => oportunidad.Canal).HasConversion<string>().HasMaxLength(10);
            entidad.Property(oportunidad => oportunidad.Estado).HasConversion<string>().HasMaxLength(20);
            entidad.Property(oportunidad => oportunidad.MotivoPerdida).HasMaxLength(300).IsRequired();
            entidad.HasIndex(oportunidad => oportunidad.Numero);
            entidad.HasOne<Cliente>().WithMany().HasForeignKey(oportunidad => oportunidad.ClienteId);
            entidad.HasOne<Sede>()
                .WithMany()
                .HasForeignKey(oportunidad => oportunidad.SedeId)
                .OnDelete(DeleteBehavior.NoAction);
            entidad.HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(oportunidad => oportunidad.VendedorId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelo.Entity<OportunidadProducto>(entidad =>
        {
            entidad.ToTable("OportunidadProducto", "comercial");
            entidad.HasKey(producto => producto.Id);
            entidad.HasOne<Oportunidad>().WithMany().HasForeignKey(producto => producto.OportunidadId);
            entidad.HasOne<Mueble>().WithMany().HasForeignKey(producto => producto.MuebleId);
        });
    }

    private static void ConfigurarVentas(ModelBuilder modelo)
    {
        modelo.Entity<Mueble>(entidad =>
        {
            entidad.ToTable("Mueble", "comercial");
            entidad.HasKey(mueble => mueble.Id);
            entidad.Property(mueble => mueble.Codigo).HasMaxLength(30).IsRequired();
            entidad.Property(mueble => mueble.Nombre).HasMaxLength(120).IsRequired();
            entidad.Property(mueble => mueble.TipoFabricacion).HasConversion<string>().HasMaxLength(10);
            entidad.HasIndex(mueble => mueble.Codigo);
        });

        modelo.Entity<ListaPrecio>(entidad =>
        {
            entidad.ToTable("ListaPrecio", "comercial");
            entidad.HasKey(lista => lista.Id);
            entidad.Property(lista => lista.Nombre).HasMaxLength(80).IsRequired();
            entidad.Property(lista => lista.Canal).HasConversion<string>().HasMaxLength(10);
            entidad.Property(lista => lista.Estado).HasConversion<string>().HasMaxLength(10);
        });

        modelo.Entity<PrecioLista>(entidad =>
        {
            entidad.ToTable("PrecioLista", "comercial");
            entidad.HasKey(precio => precio.Id);
            entidad.Property(precio => precio.Precio).HasPrecision(12, 2);
            entidad.HasIndex(precio => new { precio.ListaPrecioId, precio.MuebleId });
            entidad.HasOne<ListaPrecio>().WithMany().HasForeignKey(precio => precio.ListaPrecioId);
            entidad.HasOne<Mueble>().WithMany().HasForeignKey(precio => precio.MuebleId);
        });

        modelo.Entity<Cotizacion>(entidad =>
        {
            entidad.ToTable("Cotizacion", "comercial");
            entidad.HasKey(cotizacion => cotizacion.Id);
            entidad.Property(cotizacion => cotizacion.Numero).HasMaxLength(30).IsRequired();
            entidad.Property(cotizacion => cotizacion.Estado).HasConversion<string>().HasMaxLength(15);
            entidad.Property(cotizacion => cotizacion.MotivoRechazo).HasMaxLength(300).IsRequired();
            entidad.Property(cotizacion => cotizacion.Subtotal).HasPrecision(12, 2);
            entidad.Property(cotizacion => cotizacion.Igv).HasPrecision(12, 2);
            entidad.Property(cotizacion => cotizacion.Total).HasPrecision(12, 2);
            entidad.HasIndex(cotizacion => cotizacion.Numero);
            entidad.HasOne<Oportunidad>().WithMany().HasForeignKey(cotizacion => cotizacion.OportunidadId);
        });

        modelo.Entity<CotizacionLinea>(entidad =>
        {
            entidad.ToTable("CotizacionLinea", "comercial");
            entidad.HasKey(linea => linea.Id);
            entidad.Property(linea => linea.PrecioUnitario).HasPrecision(12, 2);
            entidad.Property(linea => linea.Subtotal).HasPrecision(12, 2);
            entidad.HasOne<Cotizacion>().WithMany().HasForeignKey(linea => linea.CotizacionId);
            entidad.HasOne<Mueble>().WithMany().HasForeignKey(linea => linea.MuebleId);
        });

        modelo.Entity<Anticipo>(entidad =>
        {
            entidad.ToTable("Anticipo", "comercial");
            entidad.HasKey(anticipo => anticipo.Id);
            entidad.Property(anticipo => anticipo.NumeroOperacion).HasMaxLength(80).IsRequired();
            entidad.Property(anticipo => anticipo.Estado).HasConversion<string>().HasMaxLength(15);
            entidad.Property(anticipo => anticipo.Monto).HasPrecision(12, 2);
            entidad.HasOne<Cotizacion>().WithMany().HasForeignKey(anticipo => anticipo.CotizacionId);
            entidad.HasOne<Usuario>().WithMany().HasForeignKey(anticipo => anticipo.UsuarioConfirmadorId);
        });

        modelo.Entity<OrdenVenta>(entidad =>
        {
            entidad.ToTable("OrdenVenta", "comercial");
            entidad.HasKey(orden => orden.Id);
            entidad.Property(orden => orden.Numero).HasMaxLength(30).IsRequired();
            entidad.Property(orden => orden.Estado).HasConversion<string>().HasMaxLength(20);
            entidad.Property(orden => orden.Subtotal).HasPrecision(12, 2);
            entidad.Property(orden => orden.Igv).HasPrecision(12, 2);
            entidad.Property(orden => orden.Total).HasPrecision(12, 2);
            entidad.HasIndex(orden => orden.Numero);
            entidad.HasIndex(orden => orden.CotizacionId);
            entidad.HasOne<Cotizacion>().WithMany().HasForeignKey(orden => orden.CotizacionId);
        });
    }
}
