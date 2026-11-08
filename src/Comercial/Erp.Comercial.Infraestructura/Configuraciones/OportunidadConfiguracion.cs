using Erp.Comercial.Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Erp.Comercial.Infraestructura.Configuraciones;

/// <summary>
/// Mapa de la oportunidad. La relación con el cliente es obligatoria y no permite borrar
/// un cliente que tenga oportunidades.
/// </summary>
public class OportunidadConfiguracion : IEntityTypeConfiguration<Oportunidad>
{
    public void Configure(EntityTypeBuilder<Oportunidad> entidad)
    {
        entidad.ToTable("Oportunidad");
        entidad.HasKey(oportunidad => oportunidad.Id);
        entidad.Property(oportunidad => oportunidad.Descripcion).HasMaxLength(300).IsRequired();
        entidad.Property(oportunidad => oportunidad.Canal).HasMaxLength(50).IsRequired();
        entidad.Property(oportunidad => oportunidad.Sede).HasMaxLength(100).IsRequired();
        entidad.Property(oportunidad => oportunidad.Responsable).HasMaxLength(100).IsRequired();
        entidad.Property(oportunidad => oportunidad.Estado).HasMaxLength(30).IsRequired();
        entidad.Property(oportunidad => oportunidad.CreadoPor).HasMaxLength(100).IsRequired();

        entidad.HasOne(oportunidad => oportunidad.Cliente)
            .WithMany(cliente => cliente.Oportunidades)
            .HasForeignKey(oportunidad => oportunidad.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
