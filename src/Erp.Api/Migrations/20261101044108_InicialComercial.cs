using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Erp.Api.Migrations
{
    /// <inheritdoc />
    public partial class InicialComercial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "comercial");

            migrationBuilder.EnsureSchema(
                name: "compartido");

            migrationBuilder.CreateTable(
                name: "Cliente",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipoDocumento = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    NumeroDocumento = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    TipoCliente = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Direccion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Correo = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cliente", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ListaPrecio",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Canal = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListaPrecio", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Mueble",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    TipoFabricacion = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mueble", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sede",
                schema: "compartido",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Activa = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sede", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrecioLista",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ListaPrecioId = table.Column<int>(type: "int", nullable: false),
                    MuebleId = table.Column<int>(type: "int", nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrecioLista", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrecioLista_ListaPrecio_ListaPrecioId",
                        column: x => x.ListaPrecioId,
                        principalSchema: "comercial",
                        principalTable: "ListaPrecio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrecioLista_Mueble_MuebleId",
                        column: x => x.MuebleId,
                        principalSchema: "comercial",
                        principalTable: "Mueble",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Usuario",
                schema: "compartido",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Rol = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SedeId = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuario", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuario_Sede_SedeId",
                        column: x => x.SedeId,
                        principalSchema: "compartido",
                        principalTable: "Sede",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Oportunidad",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Numero = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ClienteId = table.Column<int>(type: "int", nullable: false),
                    Canal = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    SedeId = table.Column<int>(type: "int", nullable: false),
                    VendedorId = table.Column<int>(type: "int", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaCierre = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MotivoPerdida = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Oportunidad", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Oportunidad_Cliente_ClienteId",
                        column: x => x.ClienteId,
                        principalSchema: "comercial",
                        principalTable: "Cliente",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Oportunidad_Sede_SedeId",
                        column: x => x.SedeId,
                        principalSchema: "compartido",
                        principalTable: "Sede",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Oportunidad_Usuario_VendedorId",
                        column: x => x.VendedorId,
                        principalSchema: "compartido",
                        principalTable: "Usuario",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Cotizacion",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Numero = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    OportunidadId = table.Column<int>(type: "int", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaEnvio = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaRespuesta = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaVencimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PlazoEntregaDias = table.Column<int>(type: "int", nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    Igv = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    Total = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    MotivoRechazo = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    PagoValidado = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cotizacion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cotizacion_Oportunidad_OportunidadId",
                        column: x => x.OportunidadId,
                        principalSchema: "comercial",
                        principalTable: "Oportunidad",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OportunidadProducto",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OportunidadId = table.Column<int>(type: "int", nullable: false),
                    MuebleId = table.Column<int>(type: "int", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OportunidadProducto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OportunidadProducto_Mueble_MuebleId",
                        column: x => x.MuebleId,
                        principalSchema: "comercial",
                        principalTable: "Mueble",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OportunidadProducto_Oportunidad_OportunidadId",
                        column: x => x.OportunidadId,
                        principalSchema: "comercial",
                        principalTable: "Oportunidad",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Anticipo",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NumeroOperacion = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    CotizacionId = table.Column<int>(type: "int", nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaConfirmacion = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UsuarioConfirmadorId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Anticipo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Anticipo_Cotizacion_CotizacionId",
                        column: x => x.CotizacionId,
                        principalSchema: "comercial",
                        principalTable: "Cotizacion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Anticipo_Usuario_UsuarioConfirmadorId",
                        column: x => x.UsuarioConfirmadorId,
                        principalSchema: "compartido",
                        principalTable: "Usuario",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CotizacionLinea",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CotizacionId = table.Column<int>(type: "int", nullable: false),
                    MuebleId = table.Column<int>(type: "int", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CotizacionLinea", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CotizacionLinea_Cotizacion_CotizacionId",
                        column: x => x.CotizacionId,
                        principalSchema: "comercial",
                        principalTable: "Cotizacion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CotizacionLinea_Mueble_MuebleId",
                        column: x => x.MuebleId,
                        principalSchema: "comercial",
                        principalTable: "Mueble",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrdenVenta",
                schema: "comercial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Numero = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CotizacionId = table.Column<int>(type: "int", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaConfirmacion = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Subtotal = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    Igv = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    Total = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdenVenta", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrdenVenta_Cotizacion_CotizacionId",
                        column: x => x.CotizacionId,
                        principalSchema: "comercial",
                        principalTable: "Cotizacion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                schema: "comercial",
                table: "ListaPrecio",
                columns: new[] { "Id", "Canal", "Estado", "FechaFin", "FechaInicio", "Nombre" },
                values: new object[] { 1, "Retail", "Vigente", null, new DateTime(2026, 10, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "Retail" });

            migrationBuilder.InsertData(
                schema: "comercial",
                table: "Mueble",
                columns: new[] { "Id", "Activo", "Codigo", "Nombre", "TipoFabricacion" },
                values: new object[,]
                {
                    { 1, true, "MUE-001", "Sofá familiar", "Mts" },
                    { 2, true, "MUE-002", "Mesa de comedor", "Mts" },
                    { 3, true, "MUE-003", "Silla de comedor", "Mts" },
                    { 4, true, "MUE-004", "Cama de dos plazas", "Mts" },
                    { 5, true, "MUE-005", "Ropero de tres puertas", "Mts" },
                    { 6, true, "MUE-006", "Cómoda de dormitorio", "Mts" },
                    { 7, true, "MUE-007", "Escritorio a medida", "Mto" },
                    { 8, true, "MUE-008", "Centro de entretenimiento a medida", "Mto" }
                });

            migrationBuilder.InsertData(
                schema: "compartido",
                table: "Sede",
                columns: new[] { "Id", "Activa", "Codigo", "Nombre" },
                values: new object[,]
                {
                    { 1, true, "LIM-CENTRO", "Lima Centro" },
                    { 2, true, "LIM-NORTE", "Lima Norte" },
                    { 3, true, "AREQUIPA", "Arequipa" }
                });

            migrationBuilder.InsertData(
                schema: "comercial",
                table: "PrecioLista",
                columns: new[] { "Id", "ListaPrecioId", "MuebleId", "Precio" },
                values: new object[,]
                {
                    { 1, 1, 1, 1899.00m },
                    { 2, 1, 2, 1299.00m },
                    { 3, 1, 3, 249.00m },
                    { 4, 1, 4, 1499.00m },
                    { 5, 1, 5, 1799.00m },
                    { 6, 1, 6, 699.00m }
                });

            migrationBuilder.InsertData(
                schema: "compartido",
                table: "Usuario",
                columns: new[] { "Id", "Activo", "Nombre", "Rol", "SedeId" },
                values: new object[,]
                {
                    { 1, true, "Usuario Gerencia Comercial", "GerenciaComercial", 1 },
                    { 2, true, "Usuario Jefatura de Ventas", "JefaturaVentas", 1 },
                    { 3, true, "Usuario Asesor de Ventas / Ejecutivo B2B", "AsesorVentasEjecutivoB2B", 1 },
                    { 4, true, "Usuario Administrador de Sucursal", "AdministradorSucursal", 2 },
                    { 5, true, "Usuario Jefatura de Servicio al Cliente", "JefaturaServicioCliente", 1 },
                    { 6, true, "Usuario Técnico carpintero", "TecnicoCarpintero", 1 },
                    { 7, true, "Usuario Oficina Técnica de Ingeniería", "OficinaTecnicaIngenieria", 1 },
                    { 8, true, "Usuario Contabilidad, Facturación y Costos", "ContabilidadFacturacionCostos", 1 },
                    { 9, true, "Usuario Tesorería", "Tesoreria", 1 },
                    { 10, true, "Usuario Créditos y Cobranzas", "CreditosYCobranzas", 1 },
                    { 11, true, "Usuario Jefatura de Producción", "JefaturaProduccion", 1 },
                    { 12, true, "Usuario Almacén (CEDI / PT / sucursal)", "Almacen", 2 },
                    { 13, true, "Usuario Compras y Logística", "ComprasYLogistica", 1 },
                    { 14, true, "Usuario Chofer / armador", "ChoferArmador", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Anticipo_CotizacionId",
                schema: "comercial",
                table: "Anticipo",
                column: "CotizacionId");

            migrationBuilder.CreateIndex(
                name: "IX_Anticipo_UsuarioConfirmadorId",
                schema: "comercial",
                table: "Anticipo",
                column: "UsuarioConfirmadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Cliente_NumeroDocumento",
                schema: "comercial",
                table: "Cliente",
                column: "NumeroDocumento");

            migrationBuilder.CreateIndex(
                name: "IX_Cotizacion_Numero",
                schema: "comercial",
                table: "Cotizacion",
                column: "Numero");

            migrationBuilder.CreateIndex(
                name: "IX_Cotizacion_OportunidadId",
                schema: "comercial",
                table: "Cotizacion",
                column: "OportunidadId");

            migrationBuilder.CreateIndex(
                name: "IX_CotizacionLinea_CotizacionId",
                schema: "comercial",
                table: "CotizacionLinea",
                column: "CotizacionId");

            migrationBuilder.CreateIndex(
                name: "IX_CotizacionLinea_MuebleId",
                schema: "comercial",
                table: "CotizacionLinea",
                column: "MuebleId");

            migrationBuilder.CreateIndex(
                name: "IX_Mueble_Codigo",
                schema: "comercial",
                table: "Mueble",
                column: "Codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Oportunidad_ClienteId",
                schema: "comercial",
                table: "Oportunidad",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Oportunidad_Numero",
                schema: "comercial",
                table: "Oportunidad",
                column: "Numero");

            migrationBuilder.CreateIndex(
                name: "IX_Oportunidad_SedeId",
                schema: "comercial",
                table: "Oportunidad",
                column: "SedeId");

            migrationBuilder.CreateIndex(
                name: "IX_Oportunidad_VendedorId",
                schema: "comercial",
                table: "Oportunidad",
                column: "VendedorId");

            migrationBuilder.CreateIndex(
                name: "IX_OportunidadProducto_MuebleId",
                schema: "comercial",
                table: "OportunidadProducto",
                column: "MuebleId");

            migrationBuilder.CreateIndex(
                name: "IX_OportunidadProducto_OportunidadId",
                schema: "comercial",
                table: "OportunidadProducto",
                column: "OportunidadId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenVenta_CotizacionId",
                schema: "comercial",
                table: "OrdenVenta",
                column: "CotizacionId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenVenta_Numero",
                schema: "comercial",
                table: "OrdenVenta",
                column: "Numero");

            migrationBuilder.CreateIndex(
                name: "IX_PrecioLista_ListaPrecioId_MuebleId",
                schema: "comercial",
                table: "PrecioLista",
                columns: new[] { "ListaPrecioId", "MuebleId" });

            migrationBuilder.CreateIndex(
                name: "IX_PrecioLista_MuebleId",
                schema: "comercial",
                table: "PrecioLista",
                column: "MuebleId");

            migrationBuilder.CreateIndex(
                name: "IX_Sede_Codigo",
                schema: "compartido",
                table: "Sede",
                column: "Codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_SedeId",
                schema: "compartido",
                table: "Usuario",
                column: "SedeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Anticipo",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "CotizacionLinea",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "OportunidadProducto",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "OrdenVenta",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "PrecioLista",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "Cotizacion",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "ListaPrecio",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "Mueble",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "Oportunidad",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "Cliente",
                schema: "comercial");

            migrationBuilder.DropTable(
                name: "Usuario",
                schema: "compartido");

            migrationBuilder.DropTable(
                name: "Sede",
                schema: "compartido");
        }
    }
}
