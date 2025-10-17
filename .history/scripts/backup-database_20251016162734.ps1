# BSOS Database Backup Script (PowerShell)
# Script para backup do banco PostgreSQL do BSOS

param(
    [string]$OutputPath = "backup",
    [switch]$Verbose
)

Write-Host "🗄️ BSOS Database Backup Tool" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# Obter timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$date = Get-Date -Format "yyyy-MM-dd"

Write-Host "📅 Data: $date" -ForegroundColor Green
Write-Host "🕒 Timestamp: $timestamp" -ForegroundColor Green

# Verificar se pg_dump está disponível
try {
    $pgDumpVersion = & pg_dump --version 2>$null
    Write-Host "✅ pg_dump encontrado: $pgDumpVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pg_dump não encontrado no PATH" -ForegroundColor Red
    Write-Host "💡 Por favor, instale PostgreSQL Client Tools ou use o backup via Prisma" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Alternativas:" -ForegroundColor Yellow
    Write-Host "   1. Instalar PostgreSQL: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "   2. Usar backup Prisma: npm run backup" -ForegroundColor White
    Write-Host "   3. Executar: .\scripts\backup-database.js" -ForegroundColor White
    
    # Tentar executar backup via Prisma como alternativa
    Write-Host ""
    Write-Host "🔄 Tentando backup via Prisma..." -ForegroundColor Yellow
    try {
        & node "scripts\backup-database.js"
        exit 0
    } catch {
        Write-Host "❌ Backup via Prisma também falhou" -ForegroundColor Red
        exit 1
    }
}

# Verificar DATABASE_URL
$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
    Write-Host "❌ DATABASE_URL não está definida" -ForegroundColor Red
    Write-Host "💡 Defina a variável de ambiente DATABASE_URL" -ForegroundColor Yellow
    
    # Tentar ler do arquivo .env
    if (Test-Path ".env") {
        Write-Host "🔍 Tentando ler DATABASE_URL do arquivo .env..." -ForegroundColor Yellow
        $envContent = Get-Content ".env"
        $databaseUrl = ($envContent | Where-Object { $_ -match "^DATABASE_URL=" }) -replace "DATABASE_URL=", ""
        
        if ($databaseUrl) {
            Write-Host "✅ DATABASE_URL encontrada no .env" -ForegroundColor Green
        }
    }
    
    if (-not $databaseUrl) {
        exit 1
    }
}

# Criar diretório de backup se não existir
if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    Write-Host "📁 Diretório de backup criado: $OutputPath" -ForegroundColor Green
}

# Nome do arquivo de backup
$backupFile = Join-Path $OutputPath "bsos_backup_$timestamp.dump"

Write-Host ""
Write-Host "🚀 Iniciando backup do banco de dados..." -ForegroundColor Yellow
Write-Host "📁 Arquivo de destino: $backupFile" -ForegroundColor White

try {
    # Executar pg_dump
    $pgDumpArgs = @(
        "--no-owner"
        "--clean" 
        "-Fc"
        $databaseUrl
        "-f"
        $backupFile
    )
    
    if ($Verbose) {
        Write-Host "🔧 Comando: pg_dump $($pgDumpArgs -join ' ')" -ForegroundColor Gray
    }
    
    & pg_dump @pgDumpArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backup concluído com sucesso!" -ForegroundColor Green
        Write-Host "📁 Arquivo: $backupFile" -ForegroundColor White
        
        # Mostrar tamanho do arquivo
        $fileSize = (Get-Item $backupFile).Length
        $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
        Write-Host "📏 Tamanho: $fileSizeMB MB" -ForegroundColor White
        
        # Informações adicionais do backup
        Write-Host ""
        Write-Host "📊 Informações do backup:" -ForegroundColor Cyan
        Write-Host "   • Formato: PostgreSQL Custom Format (.dump)" -ForegroundColor White
        Write-Host "   • Opções: --no-owner --clean -Fc" -ForegroundColor White
        Write-Host "   • Data/Hora: $(Get-Date)" -ForegroundColor White
        
        # Sugestão de restauração
        Write-Host ""
        Write-Host "🔄 Para restaurar este backup:" -ForegroundColor Yellow
        Write-Host "   pg_restore -d `$DATABASE_URL --clean --if-exists $backupFile" -ForegroundColor White
        
    } else {
        Write-Host "❌ Erro durante o backup (Exit Code: $LASTEXITCODE)" -ForegroundColor Red
        Write-Host "💡 Verifique a conexão com o banco de dados" -ForegroundColor Yellow
        exit 1
    }
    
} catch {
    Write-Host "❌ Erro durante o backup: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Processo de backup finalizado!" -ForegroundColor Green