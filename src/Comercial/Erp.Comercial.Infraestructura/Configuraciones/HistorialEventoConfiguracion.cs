using Erp.Comercial.Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Erp.Comercial.Infraestructura.Configuraciones;

/// <summary>
/// Mapa del historial. No hay claves foráneas hacia otros documentos a propósito:
/// el historial sirve a cualquier tipo de documento del módulo sin acoplarse a sus tablas.
/// </summary>
public class HistorialEventoConfiguracion : IEntityTypeConfiguration<HistorialEvento>
{
    public void Configure(EntityTypeBuilder<HistorialEvento> entidad)
    {
        entidad.ToTable("HistorialEvento");
        entidad.HasKey(evento => evento.Id);
        entidad.Property(evento => evento.DocumentoTipo).HasMaxLength(30).IsRequired();
        entidad.Property(evento => evento.Accion).HasMaxLength(100).IsRequired();
        entidad.Property(evento => evento.EstadoAnterior).HasMaxLength(30);
        entidad.Property(evento => evento.EstadoNuevo).HasMaxLength(30);
        entidad.Property(evento => evento.Usuario).HasMaxLength(100).IsRequired();
        entidad.Property(evento => evento.Rol).HasMaxLength(30).IsRequired();
        entidad.Property(evento => evento.Motivo).HasMaxLength(300);

        entidad.HasIndex(evento => new { evento.DocumentoTipo, evento.DocumentoId });
    }
}
