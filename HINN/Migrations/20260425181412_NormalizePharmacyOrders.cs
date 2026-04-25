using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HINN.Migrations
{
    /// <inheritdoc />
    public partial class NormalizePharmacyOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PharmacyOrders_Companies_CompanyId",
                table: "PharmacyOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_PharmacyOrders_CompanyMedicines_CompanyMedicineId",
                table: "PharmacyOrders");

            migrationBuilder.DropIndex(
                name: "IX_PharmacyOrders_CompanyId",
                table: "PharmacyOrders");

            migrationBuilder.DropIndex(
                name: "IX_PharmacyOrders_CompanyMedicineId",
                table: "PharmacyOrders");

            migrationBuilder.DropIndex(
                name: "IX_PharmacyOrders_MedicineName",
                table: "PharmacyOrders");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "PharmacyOrders");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "PharmacyOrders");

            migrationBuilder.DropColumn(
                name: "CompanyMedicineId",
                table: "PharmacyOrders");

            migrationBuilder.DropColumn(
                name: "ExpectedPrice",
                table: "PharmacyOrders");

            migrationBuilder.DropColumn(
                name: "FinalPrice",
                table: "PharmacyOrders");

            migrationBuilder.DropColumn(
                name: "MedicineName",
                table: "PharmacyOrders");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "PharmacyOrders");

            migrationBuilder.CreateTable(
                name: "PharmacyOrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PharmacyOrderId = table.Column<int>(type: "int", nullable: false),
                    CompanyMedicineId = table.Column<int>(type: "int", nullable: false),
                    MedicineName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Note = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PharmacyOrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PharmacyOrderItems_CompanyMedicines_CompanyMedicineId",
                        column: x => x.CompanyMedicineId,
                        principalTable: "CompanyMedicines",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PharmacyOrderItems_PharmacyOrders_PharmacyOrderId",
                        column: x => x.PharmacyOrderId,
                        principalTable: "PharmacyOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PharmacyOrderItems_CompanyMedicineId",
                table: "PharmacyOrderItems",
                column: "CompanyMedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_PharmacyOrderItems_PharmacyOrderId",
                table: "PharmacyOrderItems",
                column: "PharmacyOrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PharmacyOrderItems");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "PharmacyOrders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "PharmacyOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyMedicineId",
                table: "PharmacyOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ExpectedPrice",
                table: "PharmacyOrders",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FinalPrice",
                table: "PharmacyOrders",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MedicineName",
                table: "PharmacyOrders",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "PharmacyOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PharmacyOrders_CompanyId",
                table: "PharmacyOrders",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_PharmacyOrders_CompanyMedicineId",
                table: "PharmacyOrders",
                column: "CompanyMedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_PharmacyOrders_MedicineName",
                table: "PharmacyOrders",
                column: "MedicineName");

            migrationBuilder.AddForeignKey(
                name: "FK_PharmacyOrders_Companies_CompanyId",
                table: "PharmacyOrders",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PharmacyOrders_CompanyMedicines_CompanyMedicineId",
                table: "PharmacyOrders",
                column: "CompanyMedicineId",
                principalTable: "CompanyMedicines",
                principalColumn: "Id");
        }
    }
}
