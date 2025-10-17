# Phase 8 Settings Module - Backup Creation Script
# Creating comprehensive backup before SURGICAL MODE implementation

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "BSOS_Phase8_Dev_2025-10-16.zip"
$backupPath = "backup\$backupName"

Write-Host "🔄 Creating Phase 8 Settings Module backup..." -ForegroundColor Yellow

# Ensure backup directory exists
if (!(Test-Path "backup")) {
    New-Item -ItemType Directory -Path "backup" -Force
}

# Include critical directories and files
$includePatterns = @(
    "src\*",
    "prisma\*", 
    "*.env*",
    "*.json",
    "*.js",
    "*.ts",
    "*.md",
    "*.config.*",
    "vercel.json",
    "tailwind.config.ts",
    "tsconfig.json",
    "next.config.js",
    "package*.json"
)

# Exclude build artifacts and dependencies
$excludePatterns = @(
    "node_modules\*",
    ".next\*",
    "dist\*",
    "build\*",
    ".git\*",
    "*.log",
    "backup\*"
)

try {
    # Use PowerShell Compress-Archive with careful filtering
    $itemsToCompress = Get-ChildItem -Path . -Recurse | Where-Object {
        $item = $_
        $include = $false
        
        # Check if item matches any include pattern
        foreach ($pattern in $includePatterns) {
            if ($item.FullName -like "*$($pattern.Replace('\','*'))") {
                $include = $true
                break
            }
        }
        
        # Exclude if matches any exclude pattern
        if ($include) {
            foreach ($pattern in $excludePatterns) {
                if ($item.FullName -like "*$($pattern.Replace('\','*'))") {
                    $include = $false
                    break
                }
            }
        }
        
        return $include
    }
    
    # Create backup archive
    $itemsToCompress | Compress-Archive -DestinationPath $backupPath -Force
    
    $backupSize = (Get-Item $backupPath).Length / 1MB
    Write-Host "✅ Backup created successfully!" -ForegroundColor Green
    Write-Host "📁 Location: $backupPath" -ForegroundColor Cyan
    Write-Host "📦 Size: $([math]::Round($backupSize, 2)) MB" -ForegroundColor Cyan
    Write-Host "⏰ Timestamp: $timestamp" -ForegroundColor Cyan
    
    # Create backup manifest
    $manifest = @"
# BSOS Phase 8 Settings Module - Backup Manifest
# Created: $(Get-Date)
# Branch: phase8-settings-dev-2025-10-16
# Purpose: Pre-implementation backup for Settings & Integrations module

## Backup Contents:
- Source code (src/*)
- Database schema (prisma/*)
- Configuration files (*.config.*, package.json, etc.)
- Environment files (*.env*)
- Documentation (*.md)

## File Count: $($itemsToCompress.Count)
## Archive Size: $([math]::Round($backupSize, 2)) MB

## Status: READY FOR PHASE 8 IMPLEMENTATION
"@
    
    $manifest | Out-File -FilePath "backup\BACKUP_MANIFEST_Phase8.txt" -Encoding UTF8
    
} catch {
    Write-Host "❌ Backup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎯 SURGICAL MODE: Ready to proceed with Phase 8 implementation" -ForegroundColor Green