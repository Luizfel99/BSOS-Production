# BSOS Phase 9 Backup Creation Script
# Date: October 16, 2025
# Purpose: Create comprehensive backup before UI Style System implementation

$backupDate = Get-Date -Format "yyyy-MM-dd"
$backupTime = Get-Date -Format "HHmmss"
$backupName = "BSOS_Phase9_Dev_$backupDate"

Write-Host "🚀 Creating Phase 9 Development Backup..." -ForegroundColor Green

# Create backup directory if it doesn't exist
if (!(Test-Path "backup")) {
    New-Item -ItemType Directory -Path "backup"
}

# Create ZIP backup
$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = Get-Location
$zipPath = "backup\$backupName.zip"

Write-Host "📦 Creating ZIP archive: $zipPath" -ForegroundColor Yellow

# Directories to include in backup
$includeDirs = @(
    "src\app",
    "src\components", 
    "src\contexts",
    "src\styles",
    "src\config",
    "src\utils",
    "src\services",
    "prisma",
    "scripts"
)

# Create temporary directory for backup content
$tempDir = "temp_backup_$backupTime"
New-Item -ItemType Directory -Path $tempDir -Force

# Copy specified directories
foreach ($dir in $includeDirs) {
    if (Test-Path $dir) {
        $destPath = Join-Path $tempDir $dir
        Write-Host "📁 Copying $dir..." -ForegroundColor Cyan
        $parentDir = Split-Path $destPath -Parent
        if (!(Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Recurse -Force
        }
        Copy-Item -Path $dir -Destination $destPath -Recurse -Force
    }
}

# Copy important root files
$importantFiles = @(
    "package.json",
    "next.config.js", 
    "tailwind.config.ts",
    "tsconfig.json",
    ".env",
    "README.md"
)

foreach ($file in $importantFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination $tempDir -Force
    }
}

# Create ZIP archive
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipPath, $compressionLevel, $false)

# Clean up temporary directory
Remove-Item -Path $tempDir -Recurse -Force

# Create backup manifest
$manifest = @"
BSOS Phase 9 Development Backup
Created: $(Get-Date)
Branch: phase9-ui-style-dev-2025-10-16
Commit: $(git rev-parse HEAD)

Backup Contents:
===============
$($includeDirs -join "`n")

Important Files:
===============
$($importantFiles -join "`n")

Backup Size: $([math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB

Purpose: Complete backup before implementing Global Visual Design System
Next Phase: UI Component Library and Design Tokens Implementation
"@

$manifest | Out-File -FilePath "backup\BACKUP_MANIFEST_Phase9.txt" -Encoding UTF8

$backupSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)

Write-Host "✅ Backup completed successfully!" -ForegroundColor Green
Write-Host "📊 Backup size: $backupSize MB" -ForegroundColor Magenta
Write-Host "📍 Location: $zipPath" -ForegroundColor Blue

# Add backup files to git
git add backup\*

Write-Host "🎯 Phase 9 backup ready for UI Style System implementation!" -ForegroundColor Yellow