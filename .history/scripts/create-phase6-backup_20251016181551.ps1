# PHASE 6 - Finance Module Backup Script
# Create comprehensive ZIP backup before Finance Module implementation

$BackupDate = Get-Date -Format "yyyy-MM-dd"
$BackupFileName = "BSOS_Phase6_Finance_$BackupDate.zip"
$BackupPath = "backup\$BackupFileName"

Write-Host "🏥 PHASE 6 - FINANCE MODULE BACKUP" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Create backup directory if not exists
if (!(Test-Path "backup")) {
    New-Item -ItemType Directory -Path "backup" | Out-Null
    Write-Host "📁 Created backup directory" -ForegroundColor Green
}

# Define files and folders to backup
$ItemsToBackup = @(
    "src\app",
    "src\components", 
    "src\lib",
    "src\services",
    "prisma",
    "public",
    ".env",
    ".env.local",
    ".env.production",
    "package.json",
    "package-lock.json",
    "next.config.js",
    "tailwind.config.ts",
    "tsconfig.json",
    "middleware.ts",
    "instrumentation.ts"
)

Write-Host "📦 Creating ZIP backup: $BackupFileName" -ForegroundColor Yellow

try {
    # Remove existing backup if it exists
    if (Test-Path $BackupPath) {
        Remove-Item $BackupPath -Force
        Write-Host "🗑️ Removed existing backup" -ForegroundColor Gray
    }

    # Create temporary directory for backup
    $TempDir = "temp_backup_$(Get-Date -Format 'HHmmss')"
    New-Item -ItemType Directory -Path $TempDir | Out-Null

    # Copy items to temporary directory
    foreach ($Item in $ItemsToBackup) {
        if (Test-Path $Item) {
            $DestPath = Join-Path $TempDir (Split-Path $Item -Leaf)
            if (Test-Path $Item -PathType Container) {
                Copy-Item $Item -Destination $DestPath -Recurse -Force
            } else {
                Copy-Item $Item -Destination $DestPath -Force
            }
            Write-Host "✅ Backed up: $Item" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Not found: $Item" -ForegroundColor Yellow
        }
    }

    # Create ZIP archive
    Compress-Archive -Path "$TempDir\*" -DestinationPath $BackupPath -Force
    
    # Clean up temporary directory
    Remove-Item $TempDir -Recurse -Force

    # Get backup info
    $BackupInfo = Get-Item $BackupPath
    $BackupSizeKB = [math]::Round($BackupInfo.Length / 1KB, 2)

    Write-Host ""
    Write-Host "✅ BACKUP COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "📁 File: $BackupFileName" -ForegroundColor Cyan
    Write-Host "📊 Size: $BackupSizeKB KB" -ForegroundColor Cyan
    Write-Host "📅 Date: $BackupDate" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔒 SAFETY CHECKPOINT CREATED - READY FOR FINANCE MODULE DEVELOPMENT" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "❌ BACKUP FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}