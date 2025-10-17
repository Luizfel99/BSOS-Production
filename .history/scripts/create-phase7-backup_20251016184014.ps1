# BSOS Phase 7 Notifications Development Backup Script
# Creates comprehensive backup before Notifications Module implementation

$BackupDate = Get-Date -Format "yyyy-MM-dd"
$BackupName = "BSOS_Phase7_Dev_$BackupDate"
$BackupPath = "backup\$BackupName.zip"

Write-Host "🩺 SURGICAL MODE: Phase 7 Notifications Backup" -ForegroundColor Green
Write-Host "Creating backup: $BackupPath" -ForegroundColor Yellow

# Create backup directory if it doesn't exist
if (!(Test-Path "backup")) {
    New-Item -ItemType Directory -Path "backup"
}

# Include essential files and directories for Notifications development
$FilesToBackup = @(
    "src\app\*",
    "src\services\*", 
    "src\components\*",
    "src\middleware.ts",
    "prisma\*",
    "package.json",
    "package-lock.json",
    "next.config.js",
    "tailwind.config.ts",
    "tsconfig.json",
    ".env",
    ".env.local",
    "vercel.json",
    "README*.md",
    "*_COMPLETE.md",
    "*_SUMMARY.md"
)

# Create the backup with compression
Write-Host "Including files:" -ForegroundColor Cyan
foreach ($file in $FilesToBackup) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
}

# Use 7-Zip if available, otherwise use PowerShell compression
if (Get-Command "7z" -ErrorAction SilentlyContinue) {
    Write-Host "Using 7-Zip for backup..." -ForegroundColor Yellow
    & 7z a -tzip $BackupPath @FilesToBackup -r
} else {
    Write-Host "Using PowerShell compression..." -ForegroundColor Yellow
    $TempFolder = "temp_backup_$(Get-Date -Format 'HHmmss')"
    New-Item -ItemType Directory -Path $TempFolder
    
    foreach ($pattern in $FilesToBackup) {
        $items = Get-ChildItem -Path $pattern -Recurse -ErrorAction SilentlyContinue
        foreach ($item in $items) {
            $relativePath = $item.FullName.Substring((Get-Location).Path.Length + 1)
            $targetPath = Join-Path $TempFolder $relativePath
            $targetDir = Split-Path $targetPath -Parent
            
            if (!(Test-Path $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force
            }
            
            Copy-Item $item.FullName $targetPath
        }
    }
    
    Compress-Archive -Path "$TempFolder\*" -DestinationPath $BackupPath -Force
    Remove-Item $TempFolder -Recurse -Force
}

Write-Host "✅ Backup created successfully: $BackupPath" -ForegroundColor Green

# Display backup info
if (Test-Path $BackupPath) {
    $BackupSize = (Get-Item $BackupPath).Length / 1MB
    Write-Host "Backup size: $([math]::Round($BackupSize, 2)) MB" -ForegroundColor Cyan
    
    # Add to backup manifest
    $ManifestPath = "backup\BACKUP_MANIFEST.txt"
    $ManifestEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $BackupName.zip - Phase 7 Notifications Dev Backup - $([math]::Round($BackupSize, 2)) MB"
    Add-Content -Path $ManifestPath -Value $ManifestEntry
    
    Write-Host "✅ Phase 7 backup ready for Notifications Module development!" -ForegroundColor Green
} else {
    Write-Host "❌ Backup creation failed!" -ForegroundColor Red
    exit 1
}