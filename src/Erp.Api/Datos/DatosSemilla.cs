using Erp.Comercial.Ventas.Datos;
using Erp.Compartido.Datos;
using Microsoft.EntityFrameworkCore;

namespace Erp.Api.Datos;

public static class DatosSemilla
{
    public static void Configurar(ModelBuilder modelo)
    {
        modelo.Entity<Sede>().HasData(
            new Sede { Id = 1, Codigo = "LIM-CENTRO", Nombre = "Lima Centro", Activa = true },
            new Sede { Id = 2, Codigo = "LIM-NORTE", Nombre = "Lima Norte", Activa = true },
            new Sede { Id = 3, Codigo = "AREQUIPA", Nombre = "Arequipa", Activa = true });

        modelo.Entity<Usuario>().HasData(
            new Usuario { Id = 1, Nombre = "Usuario Gerencia Comercial", Rol = Rol.GerenciaComercial, SedeId = 1, Activo = true },
            new Usuario { Id = 2, Nombre = "Usuario Jefatura de Ventas", Rol = Rol.JefaturaVentas, SedeId = 1, Activo = true },
            new Usuario { Id = 3, Nombre = "Usuario Asesor de Ventas / Ejecutivo B2B", Rol = Rol.AsesorVentasEjecutivoB2B, SedeId = 1, Activo = true },
            new Usuario { Id = 4, Nombre = "Usuario Administrador de Sucursal", Rol = Rol.AdministradorSucursal, SedeId = 2, Activo = true },
            new Usuario { Id = 5, Nombre = "Usuario Jefatura de Servicio al Cliente", Rol = Rol.JefaturaServicioCliente, SedeId = 1, Activo = true },
            new Usuario { Id = 6, Nombre = "Usuario Técnico carpintero", Rol = Rol.TecnicoCarpintero, SedeId = 1, Activo = true },
            new Usuario { Id = 7, Nombre = "Usuario Oficina Técnica de Ingeniería", Rol = Rol.OficinaTecnicaIngenieria, SedeId = 1, Activo = true },
            new Usuario { Id = 8, Nombre = "Usuario Contabilidad, Facturación y Costos", Rol = Rol.ContabilidadFacturacionCostos, SedeId = 1, Activo = true },
            new Usuario { Id = 9, Nombre = "Usuario Tesorería", Rol = Rol.Tesoreria, SedeId = 1, Activo = true },
            new Usuario { Id = 10, Nombre = "Usuario Créditos y Cobranzas", Rol = Rol.CreditosYCobranzas, SedeId = 1, Activo = true },
            new Usuario { Id = 11, Nombre = "Usuario Jefatura de Producción", Rol = Rol.JefaturaProduccion, SedeId = 1, Activo = true },
            new Usuario { Id = 12, Nombre = "Usuario Almacén (CEDI / PT / sucursal)", Rol = Rol.Almacen, SedeId = 2, Activo = true },
            new Usuario { Id = 13, Nombre = "Usuario Compras y Logística", Rol = Rol.ComprasYLogistica, SedeId = 1, Activo = true },
            new Usuario { Id = 14, Nombre = "Usuario Chofer / armador", Rol = Rol.ChoferArmador, SedeId = 2, Activo = true });

        modelo.Entity<Mueble>().HasData(
            new Mueble { Id = 1, Codigo = "MUE-001", Nombre = "Sofá familiar", TipoFabricacion = TipoFabricacion.Mts, Activo = true },
            new Mueble { Id = 2, Codigo = "MUE-002", Nombre = "Mesa de comedor", TipoFabricacion = TipoFabricacion.Mts, Activo = true },
            new Mueble { Id = 3, Codigo = "MUE-003", Nombre = "Silla de comedor", TipoFabricacion = TipoFabricacion.Mts, Activo = true },
            new Mueble { Id = 4, Codigo = "MUE-004", Nombre = "Cama de dos plazas", TipoFabricacion = TipoFabricacion.Mts, Activo = true },
            new Mueble { Id = 5, Codigo = "MUE-005", Nombre = "Ropero de tres puertas", TipoFabricacion = TipoFabricacion.Mts, Activo = true },
            new Mueble { Id = 6, Codigo = "MUE-006", Nombre = "Cómoda de dormitorio", TipoFabricacion = TipoFabricacion.Mts, Activo = true },
            new Mueble { Id = 7, Codigo = "MUE-007", Nombre = "Escritorio a medida", TipoFabricacion = TipoFabricacion.Mto, Activo = true },
            new Mueble { Id = 8, Codigo = "MUE-008", Nombre = "Centro de entretenimiento a medida", TipoFabricacion = TipoFabricacion.Mto, Activo = true });

        modelo.Entity<ListaPrecio>().HasData(
            new ListaPrecio
            {
                Id = 1,
                Nombre = "Retail",
                Canal = CanalVenta.Retail,
                Estado = EstadoListaPrecio.Vigente,
                FechaInicio = new DateTime(2026, 10, 31),
                FechaFin = null
            });

        modelo.Entity<PrecioLista>().HasData(
            new PrecioLista { Id = 1, ListaPrecioId = 1, MuebleId = 1, Precio = 1899.00m },
            new PrecioLista { Id = 2, ListaPrecioId = 1, MuebleId = 2, Precio = 1299.00m },
            new PrecioLista { Id = 3, ListaPrecioId = 1, MuebleId = 3, Precio = 249.00m },
            new PrecioLista { Id = 4, ListaPrecioId = 1, MuebleId = 4, Precio = 1499.00m },
            new PrecioLista { Id = 5, ListaPrecioId = 1, MuebleId = 5, Precio = 1799.00m },
            new PrecioLista { Id = 6, ListaPrecioId = 1, MuebleId = 6, Precio = 699.00m });
    }
}
