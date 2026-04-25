using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HINN.Migrations
{
    /// <inheritdoc />
    public partial class MultiMedSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PrescriptionItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrescriptionId = table.Column<int>(type: "int", nullable: false),
                    MedicineName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Dosage = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CompanyMedicineId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrescriptionItems_CompanyMedicines_CompanyMedicineId",
                        column: x => x.CompanyMedicineId,
                        principalTable: "CompanyMedicines",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PrescriptionItems_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PharmacyResponseItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PharmacyResponseId = table.Column<int>(type: "int", nullable: false),
                    PrescriptionItemId = table.Column<int>(type: "int", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    IsAlternative = table.Column<bool>(type: "bit", nullable: false),
                    AlternativeMedicineName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PharmacyResponseItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PharmacyResponseItems_PharmacyResponses_PharmacyResponseId",
                        column: x => x.PharmacyResponseId,
                        principalTable: "PharmacyResponses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PharmacyResponseItems_PrescriptionItems_PrescriptionItemId",
                        column: x => x.PrescriptionItemId,
                        principalTable: "PrescriptionItems",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PharmacyResponseItems_PharmacyResponseId",
                table: "PharmacyResponseItems",
                column: "PharmacyResponseId");

            migrationBuilder.CreateIndex(
                name: "IX_PharmacyResponseItems_PrescriptionItemId",
                table: "PharmacyResponseItems",
                column: "PrescriptionItemId");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionItems_CompanyMedicineId",
                table: "PrescriptionItems",
                column: "CompanyMedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionItems_PrescriptionId",
                table: "PrescriptionItems",
                column: "PrescriptionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PharmacyResponseItems");

            migrationBuilder.DropTable(
                name: "PrescriptionItems");
        }
    }
}
