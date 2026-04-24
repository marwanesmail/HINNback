using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace MyHealthcareApi
{
    public static class Setup
    {
        // 1. The Schema Array (Dictionary of TableName -> List of Columns)
        public static readonly Dictionary<string, List<string>> RequiredSchema = new()
        {
            { "Doctors", new List<string> { "Id", "AppUserId", "Rating", "RatingCount", "IsApproved", "LicenseImageUrl", "Specialty", "ViewCount", "Bio", "ExperienceYears", "ProfileImagePath", "ClinicName", "ClinicAddress", "ClinicPhone", "Latitude", "Longitude", "ConsultationFee", "ConsultationType", "SessionDurationMinutes" } },
            { "Patients", new List<string> { "Id", "AppUserId", "PhoneNumber", "Gender", "DateOfBirth", "HeightCm", "WeightKg", "BloodType", "Allergies", "ChronicDiseases", "CurrentMedications", "Surgeries", "MedicalNotes", "EmergencyContactName", "EmergencyContactPhone", "LastMedicalUpdate", "MedicalRecordNumber" } },
            { "Pharmacies", new List<string> { "Id", "PharmacyName", "Address", "Latitude", "Longitude", "LicenseImagePath", "TaxDocumentPath", "PhoneNumber", "Phone2", "WorkingHours", "DeliveryArea", "CommercialRecordPath", "IsApproved", "AppUserId", "ViewCount", "Rating", "RatingCount" } },
            { "Companies", new List<string> { "Id", "CompanyName", "AppUserId", "ViewCount", "IsApproved", "LicenseDocumentPath", "LicenseNumber", "Rating", "RatingCount" } },
            { "Prescriptions", new List<string> { "Id", "PatientId", "DoctorId", "Title", "Notes", "PrescriptionImagePath", "Latitude", "Longitude", "SearchRadiusKm", "PatientName", "PhoneNumber", "DeliveryAddress", "AlternativePreference", "Status", "CreatedAt", "VisitDate", "Diagnosis", "SpecialInstructions", "PrescriptionType", "ValidityDays" } },
            { "PharmacyResponses", new List<string> { "Id", "PharmacyId", "PatientId", "PrescriptionId", "MedicineName", "IsAvailable", "Price", "Note", "IsSeenByPatient", "RespondedAt", "IsDispensed", "DispensedAt", "Quantity", "UsageInstructions", "ExpiryDate", "BatchNumber", "PatientStatus" } },
            { "Messages", new List<string> { "Id", "SenderId", "ReceiverId", "Content", "SentAt" } },
            { "Ratings", new List<string> { "Id", "UserId", "EntityType", "EntityId", "Stars", "Comment", "CreatedAt", "UpdatedAt" } },
            { "AuditLogs", new List<string> { "Id", "UserId", "UserName", "ActionType", "EntityType", "EntityId", "Description", "OldData", "NewData", "IpAddress", "UserAgent", "Success", "ErrorMessage", "ExecutionTimeMs", "CreatedAt" } },
            { "Appointments", new List<string> { "Id", "PatientId", "DoctorId", "AppointmentDate", "Status", "CreatedAt", "CancellationReason", "CancelledAt", "CompletedAt", "Diagnosis", "DoctorNotes", "PatientNotes", "Prescription", "Specialty", "AppointmentTime", "AppointmentType" } },
            { "DoctorAvailabilities", new List<string> { "Id", "DoctorId", "Date", "StartTime", "EndTime", "IsAvailable", "BookedByPatientId", "AppointmentType", "BookedAt", "ConsultationFee", "CreatedAt", "DurationMinutes", "Location", "Notes" } },
            { "PharmacyInventories", new List<string> { "Id", "PharmacyId", "MedicineName", "Quantity", "MinimumQuantity", "ExpiryDate", "Price", "BatchNumber", "Manufacturer", "StorageLocation", "Notes", "CreatedAt", "LastUpdated" } },
            { "DrugExchanges", new List<string> { "Id", "FromPharmacyId", "ToPharmacyId", "MedicineName", "Quantity", "Status", "RespondedAt", "Notes", "BatchNumber", "CreatedAt", "ExchangeType", "ExpiryDate", "Reason", "ResponseNote", "SuggestedPrice" } },
            { "PharmacyOrders", new List<string> { "Id", "PharmacyId", "CompanyId", "MedicineName", "Quantity", "Category", "ExpectedPrice", "Priority", "Status", "CompanyResponse", "FinalPrice", "RespondedAt", "ExpectedDeliveryDate", "ActualDeliveryDate", "Notes", "CreatedAt" } },
            { "CompanyMedicines", new List<string> { "Id", "CompanyId", "MedicineName", "Category", "Description", "ImagePath", "UnitPrice", "StockQuantity", "MinimumOrderQuantity", "ProductionDate", "ExpiryDate", "IsAvailable", "CreatedAt", "UpdatedAt" } }
        };

        // Tables to strictly ignore when dropping (System & Identity tables)
        private static readonly List<string> IgnoredTables = new()
        {
            "__EFMigrationsHistory", "AspNetUsers", "AspNetRoles", "AspNetUserRoles", "AspNetUserClaims", "AspNetUserLogins", "AspNetRoleClaims", "AspNetUserTokens"
        };

        // 2. The function to check and sync missed/extra columns and tables
        public static async Task SyncDatabaseSchemaAsync(string connectionString, bool executeChanges = false)
        {
            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            Console.WriteLine("--- Starting Custom Database Sync ---");

            var liveTables = await GetLiveTablesAsync(connection);

            // PHASE 1: CREATE missing tables and columns
            foreach (var requiredTable in RequiredSchema)
            {
                string tableName = requiredTable.Key;
                List<string> requiredColumns = requiredTable.Value;

                if (!liveTables.ContainsKey(tableName))
                {
                    // Create Table with a default Id column
                    Console.WriteLine($"[CREATE] Table '{tableName}' is missing. Creating...");
                    string createTableSql = $"CREATE TABLE [{tableName}] ([Id] INT IDENTITY(1,1) PRIMARY KEY);";
                    await ExecuteSqlAsync(connection, createTableSql, executeChanges);
                    liveTables[tableName] = new List<string> { "Id" }; // Add to local tracker
                }

                var liveColumns = liveTables[tableName];

                // Check for missing columns in this table
                foreach (var requiredCol in requiredColumns)
                {
                    if (requiredCol == "Id") continue; // Handled by Primary Key creation

                    if (!liveColumns.Contains(requiredCol, StringComparer.OrdinalIgnoreCase))
                    {
                        Console.WriteLine($"[ADD] Column '{requiredCol}' missing in table '{tableName}'. Adding...");
                        // Defaulting to NVARCHAR(MAX) to prevent crash, as we don't have exact types in the array.
                        string addColSql = $"ALTER TABLE [{tableName}] ADD [{requiredCol}] NVARCHAR(MAX) NULL;";
                        await ExecuteSqlAsync(connection, addColSql, executeChanges);
                    }
                }
            }

            // PHASE 2: DROP extra tables and columns (not in the array)
            foreach (var liveTable in liveTables)
            {
                string tableName = liveTable.Key;
                List<string> liveColumns = liveTable.Value;

                // Protect EF Core and Identity tables from being dropped
                if (IgnoredTables.Contains(tableName))
                {
                    continue; 
                }

                if (!RequiredSchema.ContainsKey(tableName))
                {
                    Console.WriteLine($"[DROP] Table '{tableName}' exists in DB but not in array. Dropping...");
                    string dropTableSql = $"DROP TABLE [{tableName}];";
                    await ExecuteSqlAsync(connection, dropTableSql, executeChanges);
                    continue; // Table is gone, move to next
                }

                var requiredColumns = RequiredSchema[tableName];

                foreach (var liveCol in liveColumns)
                {
                    if (!requiredColumns.Contains(liveCol, StringComparer.OrdinalIgnoreCase))
                    {
                        Console.WriteLine($"[DROP] Column '{liveCol}' exists in '{tableName}' but not in array. Dropping...");
                        string dropColSql = $"ALTER TABLE [{tableName}] DROP COLUMN [{liveCol}];";
                        await ExecuteSqlAsync(connection, dropColSql, executeChanges);
                    }
                }
            }

            Console.WriteLine("--- Database Sync Completed ---");
        }

        // Helper: Get current DB state
        private static async Task<Dictionary<string, List<string>>> GetLiveTablesAsync(SqlConnection connection)
        {
            var tables = new Dictionary<string, List<string>>(StringComparer.OrdinalIgnoreCase);

            string query = @"
                SELECT TABLE_NAME, COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = 'dbo';";

            using var command = new SqlCommand(query, connection);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                string tableName = reader.GetString(0);
                string columnName = reader.GetString(1);

                if (!tables.ContainsKey(tableName))
                {
                    tables[tableName] = new List<string>();
                }
                tables[tableName].Add(columnName);
            }

            return tables;
        }

        // Helper: Execute SQL
        private static async Task ExecuteSqlAsync(SqlConnection connection, string sql, bool executeChanges)
        {
            try
            {
                if (executeChanges)
                {
                    using var command = new SqlCommand(sql, connection);
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine($"[EXECUTED]: {sql}");
                }
                else
                {
                    Console.WriteLine($"[DRY RUN - Would Execute]: {sql}");
                    await Task.CompletedTask;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to execute: {sql}\nReason: {ex.Message}");
            }
        }
    }
}
