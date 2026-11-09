using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Erp.Comercial.Infraestructura.Migraciones
{
    /// <inheritdoc />
    public partial class OportunidadConProductos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OportunidadProducto",
                schema: "Comercial",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OportunidadId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OportunidadProducto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OportunidadProducto_Oportunidad_OportunidadId",
                        column: x => x.OportunidadId,
                        principalSchema: "Comercial",
                        principalTable: "Oportunidad",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OportunidadProducto_OportunidadId_Codigo",
                schema: "Comercial",
                table: "OportunidadProducto",
                columns: new[] { "OportunidadId", "Codigo" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OportunidadProducto",
                schema: "Comercial");
        }
    }
}
