using Erp.Comercial.Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Erp.Comercial.Infraestructura.Configuraciones;

/// <summary>
/// Mapa de los productos de una oportunidad. No se repite el mismo código en la misma
/// oportunidad y la relación con el catálogo queda por código, porque el catálogo de la
/// demo vive en configuración y no en una tabla.
/// </summary>
public class ProductoDeOportunidadConfiguracion : IEntityTypeConfiguration<ProductoDeOportunidad>
{
    public void Configure(EntityTypeBuilder<ProductoDeOportunidad> entidad)
    {
        entidad.ToTable("OportunidadProducto");
        entidad.HasKey(producto => producto.Id);
        entidad.Property(producto => producto.Codigo).HasMaxLength(30).IsRequired();
        entidad.Property(producto => producto.Nombre).HasMaxLength(200).IsRequired();
        entidad.Property(producto => producto.Cantidad).IsRequired();

        entidad.HasIndex(producto => new { producto.OportunidadId, producto.Codigo }).IsUnique();

        entidad.HasOne(producto => producto.Oportunidad)
            .WithMany(oportunidad => oportunidad.Productos)
            .HasForeignKey(producto => producto.OportunidadId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
