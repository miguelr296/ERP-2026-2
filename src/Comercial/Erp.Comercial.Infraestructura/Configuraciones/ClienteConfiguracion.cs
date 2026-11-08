using Erp.Comercial.Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Erp.Comercial.Infraestructura.Configuraciones;

/// <summary>
/// Mapa de la entidad Cliente a la tabla del esquema Comercial. Separar la configuración
/// del contexto permite cambiarla sin tocar las demás entidades.
/// </summary>
public class ClienteConfiguracion : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> entidad)
    {
        entidad.ToTable("Cliente");
        entidad.HasKey(cliente => cliente.Id);
        entidad.Property(cliente => cliente.Nombre).HasMaxLength(200).IsRequired();
        entidad.Property(cliente => cliente.Documento).HasMaxLength(20).IsRequired();
        entidad.Property(cliente => cliente.Correo).HasMaxLength(200);
        entidad.Property(cliente => cliente.Telefono).HasMaxLength(30);
        entidad.Property(cliente => cliente.CreadoPor).HasMaxLength(100).IsRequired();
        entidad.HasIndex(cliente => cliente.Documento).IsUnique();
    }
}
