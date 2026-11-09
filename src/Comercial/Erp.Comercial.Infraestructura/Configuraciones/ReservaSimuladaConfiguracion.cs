using Erp.Comercial.Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Erp.Comercial.Infraestructura.Configuraciones;

/// <summary>
/// Mapa de la reserva simulada. Pertenece a una oportunidad y conserva el identificador
/// del proveedor; borrar la oportunidad no borra su evidencia de reserva.
/// </summary>
public class ReservaSimuladaConfiguracion : IEntityTypeConfiguration<ReservaSimulada>
{
    public void Configure(EntityTypeBuilder<ReservaSimulada> entidad)
    {
        entidad.ToTable("Reserva");
        entidad.HasKey(reserva => reserva.Id);
        entidad.Property(reserva => reserva.Producto).HasMaxLength(200).IsRequired();
        entidad.Property(reserva => reserva.Identificador).HasMaxLength(50).IsRequired();
        entidad.Property(reserva => reserva.Estado).HasMaxLength(30).IsRequired();
        entidad.Property(reserva => reserva.SolicitadaPor).HasMaxLength(100).IsRequired();
        entidad.Property(reserva => reserva.Cantidad).IsRequired();

        entidad.HasOne(reserva => reserva.Oportunidad)
            .WithMany(oportunidad => oportunidad.Reservas)
            .HasForeignKey(reserva => reserva.OportunidadId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
