using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HINN.Migrations
{
    /// <inheritdoc />
    public partial class RevertMultiMedPrescriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PharmacyResponseItems");

            migrationBuilder.DropTable(
                name: "PrescriptionItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PrescriptionItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyMedicineId = table.Column<int>(type: "int", nullable: true),
                    PrescriptionId = table.Column<int>(type: "int", nullable: false),
                    Dosage = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Frequency = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MedicineName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
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
                    AlternativeMedicineName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IsAlternative = table.Column<bool>(type: "bit", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true)
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
    }
}
