# 🗄️ BACKUP CREATION SCRIPT - SURGICAL MODE
# Create comprehensive workspace backup

$backupDate = "2025-10-16"
$backupName = "BSOS_Phase4_Dev_$backupDate"
$backupPath = "backup\$backupName.zip"

Write-Host "🔒 SURGICAL MODE BACKUP - Creating comprehensive backup..." -ForegroundColor Yellow

# Critical directories to include
$includeDirs = @(
    "src\app",
    "src\components", 
    "src\context",
    "src\lib",
    "src\services",
    "prisma",
    "scripts",
    "public"
)

# Critical files to include
$includeFiles = @(
    ".env",
    "package.json",
    "next.config.js", 
    "tailwind.config.ts",
    "tsconfig.json",
    "README.md"
)

try {
    # Create backup using PowerShell Compress-Archive
    $items = @()
    
    # Add directories
    foreach ($dir in $includeDirs) {
        if (Test-Path $dir) {
            $items += $dir
            Write-Host "✅ Including directory: $dir" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Directory not found: $dir" -ForegroundColor Yellow
        }
    }
    
    # Add files
    foreach ($file in $includeFiles) {
        if (Test-Path $file) {
            $items += $file
            Write-Host "✅ Including file: $file" -ForegroundColor Green
        } else {
            Write-Host "⚠️ File not found: $file" -ForegroundColor Yellow
        }
    }
    
    # Create the backup
    Compress-Archive -Path $items -DestinationPath $backupPath -Force
    
    $backupSize = (Get-Item $backupPath).Length / 1MB
    Write-Host "🎯 Backup created successfully!" -ForegroundColor Green
    Write-Host "📁 Location: $backupPath" -ForegroundColor Cyan
    Write-Host "📏 Size: $([math]::Round($backupSize, 2)) MB" -ForegroundColor Cyan
    
    # Create manifest
    $manifest = @{
        "backup_date" = $backupDate
        "backup_name" = $backupName
        "items_count" = $items.Count
        "size_mb" = [math]::Round($backupSize, 2)
        "directories" = $includeDirs
        "files" = $includeFiles
        "purpose" = "Pre-Properties Module Implementation Safety Backup"
        "branch" = "phase4-properties-dev-2025-10-16"
        "database" = "bsos-dev-branch (development)"
    }
    
    $manifest | ConvertTo-Json -Depth 3 | Out-File "backup\BACKUP_MANIFEST_$backupDate.json"
    
    Write-Host "📋 Backup manifest created" -ForegroundColor Green
    Write-Host "🔒 WORKSPACE BACKUP COMPLETE - READY FOR SURGICAL MODE" -ForegroundColor Magenta
    
} catch {
    Write-Host "❌ Backup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}