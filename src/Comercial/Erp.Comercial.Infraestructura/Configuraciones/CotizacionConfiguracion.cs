using Erp.Comercial.Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Erp.Comercial.Infraestructura.Configuraciones;

public sealed class CotizacionConfiguracion : IEntityTypeConfiguration<Cotizacion>
{
    public void Configure(EntityTypeBuilder<Cotizacion> entidad)
    {
        entidad.ToTable("Cotizacion");
        entidad.HasKey(c => c.Id);
        entidad.HasIndex(c => c.SolicitudId).IsUnique();
        entidad.HasIndex(c => c.Correlativo).IsUnique();
        entidad.Property(c => c.Correlativo).HasMaxLength(40).IsRequired();
        entidad.Property(c => c.TipoCliente).HasMaxLength(50).IsRequired();
        entidad.Property(c => c.ListaPrecio).HasMaxLength(100).IsRequired();
        entidad.Property(c => c.Moneda).HasMaxLength(3).IsRequired();
        entidad.Property(c => c.Estado).HasMaxLength(30).IsRequired();
        entidad.Property(c => c.CreadoPor).HasMaxLength(100).IsRequired();
        entidad.Property(c => c.Rol).HasMaxLength(30).IsRequired();
        entidad.Property(c => c.Redondeo).HasMaxLength(30).IsRequired();
        entidad.Property(c => c.TasaIgv).HasPrecision(9, 6);
        entidad.Property(c => c.Subtotal).HasPrecision(18, 2);
        entidad.Property(c => c.Igv).HasPrecision(18, 2);
        entidad.Property(c => c.Total).HasPrecision(18, 2);
        entidad.HasOne(c => c.Oportunidad).WithMany().HasForeignKey(c => c.OportunidadId)
            .OnDelete(DeleteBehavior.Restrict);
        entidad.HasMany(c => c.Lineas).WithOne().HasForeignKey(l => l.CotizacionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public sealed class LineaDeCotizacionConfiguracion : IEntityTypeConfiguration<LineaDeCotizacion>
{
    public void Configure(EntityTypeBuilder<LineaDeCotizacion> entidad)
    {
        entidad.ToTable("CotizacionLinea");
        entidad.HasKey(l => l.Id);
        entidad.HasIndex(l => new { l.CotizacionId, l.Codigo }).IsUnique();
        entidad.Property(l => l.Codigo).HasMaxLength(30).IsRequired();
        entidad.Property(l => l.Nombre).HasMaxLength(200).IsRequired();
        entidad.Property(l => l.PrecioUnitario).HasPrecision(18, 4);
        entidad.Property(l => l.Importe).HasPrecision(18, 2);
    }
}
