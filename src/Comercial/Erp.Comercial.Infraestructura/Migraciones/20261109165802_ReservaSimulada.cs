using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Erp.Comercial.Infraestructura.Migraciones
{
    /// <inheritdoc />
    public partial class ReservaSimulada : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Reserva",
                schema: "Comercial",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OportunidadId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Producto = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    Identificador = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    SolicitadaEn = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    VigenteHasta = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    SolicitadaPor = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reserva", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reserva_Oportunidad_OportunidadId",
                        column: x => x.OportunidadId,
                        principalSchema: "Comercial",
                        principalTable: "Oportunidad",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reserva_OportunidadId",
                schema: "Comercial",
                table: "Reserva",
                column: "OportunidadId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reserva",
                schema: "Comercial");
        }
    }
}
