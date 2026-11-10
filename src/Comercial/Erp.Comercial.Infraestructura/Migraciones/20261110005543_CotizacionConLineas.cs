using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Erp.Comercial.Infraestructura.Migraciones
{
    /// <inheritdoc />
    public partial class CotizacionConLineas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "NumeroCotizacion",
                schema: "Comercial");

            migrationBuilder.CreateTable(
                name: "Cotizacion",
                schema: "Comercial",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SolicitudId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Correlativo = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    OportunidadId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TipoCliente = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ListaPrecio = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Moneda = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    EmitidaEn = table.Column<DateOnly>(type: "date", nullable: false),
                    VigenteHasta = table.Column<DateOnly>(type: "date", nullable: false),
                    PlazoEntregaDias = table.Column<int>(type: "int", nullable: false),
                    TasaIgv = table.Column<decimal>(type: "decimal(9,6)", precision: 9, scale: 6, nullable: false),
                    PreciosIncluyenIgv = table.Column<bool>(type: "bit", nullable: false),
                    Redondeo = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Igv = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CreadoPor = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Rol = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cotizacion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cotizacion_Oportunidad_OportunidadId",
                        column: x => x.OportunidadId,
                        principalSchema: "Comercial",
                        principalTable: "Oportunidad",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CotizacionLinea",
                schema: "Comercial",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CotizacionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    Importe = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CotizacionLinea", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CotizacionLinea_Cotizacion_CotizacionId",
                        column: x => x.CotizacionId,
                        principalSchema: "Comercial",
                        principalTable: "Cotizacion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cotizacion_Correlativo",
                schema: "Comercial",
                table: "Cotizacion",
                column: "Correlativo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cotizacion_OportunidadId",
                schema: "Comercial",
                table: "Cotizacion",
                column: "OportunidadId");

            migrationBuilder.CreateIndex(
                name: "IX_Cotizacion_SolicitudId",
                schema: "Comercial",
                table: "Cotizacion",
                column: "SolicitudId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CotizacionLinea_CotizacionId_Codigo",
                schema: "Comercial",
                table: "CotizacionLinea",
                columns: new[] { "CotizacionId", "Codigo" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CotizacionLinea",
                schema: "Comercial");

            migrationBuilder.DropTable(
                name: "Cotizacion",
                schema: "Comercial");

            migrationBuilder.DropSequence(
                name: "NumeroCotizacion",
                schema: "Comercial");
        }
    }
}
