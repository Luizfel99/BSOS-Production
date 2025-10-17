# BSOS Phase 9 Backup Script (Simple Version)
$backupDate = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupName = "BSOS_Phase9_Dev_$backupDate"

Write-Host "🚀 Creating Phase 9 Development Backup..." -ForegroundColor Green

# Ensure backup directory exists
if (!(Test-Path "backup")) {
    New-Item -ItemType Directory -Path "backup"
}

# Use 7-Zip if available, otherwise use PowerShell compression
$zipPath = "backup\$backupName.zip"

# Define what to backup
$backupItems = @(
    "src\*",
    "prisma\*", 
    "scripts\*",
    "package.json",
    "next.config.js",
    "tailwind.config.ts", 
    "tsconfig.json"
)

Write-Host "📦 Creating backup archive..." -ForegroundColor Yellow

# Create archive using PowerShell
Compress-Archive -Path $backupItems -DestinationPath $zipPath -Force

# Create manifest
$manifest = @"
BSOS Phase 9 Development Backup
Created: $(Get-Date)
Branch: phase9-ui-style-dev-2025-10-16
Commit: $(git rev-parse HEAD)

Purpose: Backup before Global Visual Design System implementation
Next: UI Component Library and Design Tokens

Backup Location: $zipPath
Backup Size: $([math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB
"@

$manifest | Out-File -FilePath "backup\BACKUP_MANIFEST_Phase9.txt" -Encoding UTF8

$backupSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)

Write-Host "✅ Backup completed!" -ForegroundColor Green
Write-Host "📊 Size: $backupSize MB" -ForegroundColor Magenta
Write-Host "📍 Location: $zipPath" -ForegroundColor Blue

# Stage backup files in git
git add backup\*

Write-Host "🎯 Ready for Phase 9 UI Style System!" -ForegroundColor Yellow