using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HINN.Migrations
{
    /// <inheritdoc />
    public partial class LinkInventoryToCatalogueV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompanyMedicineId",
                table: "PharmacyOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyMedicineId",
                table: "PharmacyInventories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PharmacyOrders_CompanyMedicineId",
                table: "PharmacyOrders",
                column: "CompanyMedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_PharmacyInventories_CompanyMedicineId",
                table: "PharmacyInventories",
                column: "CompanyMedicineId");

            migrationBuilder.AddForeignKey(
                name: "FK_PharmacyInventories_CompanyMedicines_CompanyMedicineId",
                table: "PharmacyInventories",
                column: "CompanyMedicineId",
                principalTable: "CompanyMedicines",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PharmacyOrders_CompanyMedicines_CompanyMedicineId",
                table: "PharmacyOrders",
                column: "CompanyMedicineId",
                principalTable: "CompanyMedicines",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PharmacyInventories_CompanyMedicines_CompanyMedicineId",
                table: "PharmacyInventories");

            migrationBuilder.DropForeignKey(
                name: "FK_PharmacyOrders_CompanyMedicines_CompanyMedicineId",
                table: "PharmacyOrders");

            migrationBuilder.DropIndex(
                name: "IX_PharmacyOrders_CompanyMedicineId",
                table: "PharmacyOrders");

            migrationBuilder.DropIndex(
                name: "IX_PharmacyInventories_CompanyMedicineId",
                table: "PharmacyInventories");

            migrationBuilder.DropColumn(
                name: "CompanyMedicineId",
                table: "PharmacyOrders");

            migrationBuilder.DropColumn(
                name: "CompanyMedicineId",
                table: "PharmacyInventories");
        }
    }
}
