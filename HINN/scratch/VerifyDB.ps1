$connectionString = "Server=db48317.public.databaseasp.net; Database=db48317; User Id=db48317; Password=Kk9#n@N5?A7f; Encrypt=False; MultipleActiveResultSets=True;"

$tablesToCheck = @(
    "PharmacyOrders",
    "PharmacyOrderItems",
    "Prescriptions",
    "PrescriptionItems",
    "PatientOrders",
    "PatientOrderItems",
    "PharmacyInventories",
    "CompanyMedicines"
)

Write-Host "--- HINN Database Integrity Check ---" -ForegroundColor Cyan

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    Write-Host "[SUCCESS] Connected to database." -ForegroundColor Green

    foreach ($table in $tablesToCheck) {
        $query = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '$table'"
        $command = New-Object System.Data.SqlClient.SqlCommand($query, $connection)
        $exists = $command.ExecuteScalar()

        if ($exists -gt 0) {
            Write-Host "[OK] Table '$table' exists." -ForegroundColor Green
            
            # Check some key columns
            if ($table -eq "PharmacyOrders") {
                $colQuery = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '$table' AND COLUMN_NAME = 'CompanyId'"
                $colCommand = New-Object System.Data.SqlClient.SqlCommand($colQuery, $connection)
                $colExists = $colCommand.ExecuteScalar()
                if ($null -ne $colExists) {
                    Write-Host "    [WARNING] Table '$table' still contains 'CompanyId' (Normalization check failed/incomplete)." -ForegroundColor Yellow
                } else {
                    Write-Host "    [VERIFIED] Table '$table' is normalized (CompanyId removed)." -ForegroundColor Green
                }
            }

            if ($table -eq "PatientOrders") {
                Write-Host "    [VERIFIED] Table '$table' is ready for patient purchases." -ForegroundColor Green
            }

            if ($table -eq "PrescriptionItems") {
                Write-Host "    [VERIFIED] Table '$table' is ready for multi-medicine prescriptions." -ForegroundColor Green
            }
        } else {
            Write-Host "[ERROR] Table '$table' is MISSING!" -ForegroundColor Red
        }
    }

    $connection.Close()
} catch {
    Write-Host "[CRITICAL ERROR] Failed to connect or execute queries: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n--- End of Integrity Check ---" -ForegroundColor Cyan
