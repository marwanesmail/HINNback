using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HINN.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PatientOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PharmacyId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DeliveryMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DeliveryAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientOrders_AspNetUsers_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientOrders_Pharmacies_PharmacyId",
                        column: x => x.PharmacyId,
                        principalTable: "Pharmacies",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PatientOrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientOrderId = table.Column<int>(type: "int", nullable: false),
                    PharmacyInventoryId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    MedicineName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientOrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientOrderItems_PatientOrders_PatientOrderId",
                        column: x => x.PatientOrderId,
                        principalTable: "PatientOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientOrderItems_PharmacyInventories_PharmacyInventoryId",
                        column: x => x.PharmacyInventoryId,
                        principalTable: "PharmacyInventories",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientOrderItems_PatientOrderId",
                table: "PatientOrderItems",
                column: "PatientOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientOrderItems_PharmacyInventoryId",
                table: "PatientOrderItems",
                column: "PharmacyInventoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientOrders_PatientId",
                table: "PatientOrders",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientOrders_PharmacyId",
                table: "PatientOrders",
                column: "PharmacyId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientOrders_Status",
                table: "PatientOrders",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientOrderItems");

            migrationBuilder.DropTable(
                name: "PatientOrders");
        }
    }
}
