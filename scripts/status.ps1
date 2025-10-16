# Script para verificar status do servidor B.S.O.S.
# Versão: 2.0
# Data: 2025-10-10

Write-Host "📊 B.S.O.S. Status Check" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# 1. Verificar processos Node.js
Write-Host "1. Processos Node.js:" -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    foreach ($proc in $nodeProcesses) {
        Write-Host "   ✅ PID: $($proc.Id) - Tempo: $($proc.TotalProcessorTime)" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ Nenhum processo Node.js em execução" -ForegroundColor Red
}

# 2. Verificar portas
Write-Host "2. Status das Portas:" -ForegroundColor Yellow
$ports = @(3000, 3001, 3002)
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $processId = $connection.OwningProcess
        $processName = (Get-Process -Id $processId -ErrorAction SilentlyContinue).ProcessName
        Write-Host "   ✅ Porta $port - Em uso por $processName (PID: $processId)" -ForegroundColor Green
    } else {
        Write-Host "   ⚪ Porta $port - Livre" -ForegroundColor Gray
    }
}

# 3. Verificar cache
Write-Host "3. Cache:" -ForegroundColor Yellow
if (Test-Path ".next") {
    $cacheSize = (Get-ChildItem ".next" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $cacheSizeMB = [math]::Round($cacheSize / 1MB, 2)
    Write-Host "   📁 Cache .next existe ($cacheSizeMB MB)" -ForegroundColor Green
} else {
    Write-Host "   📁 Cache .next não existe" -ForegroundColor Gray
}

# 4. Verificar conectividade
Write-Host "4. Conectividade:" -ForegroundColor Yellow
$urls = @("http://localhost:3000", "http://localhost:3001")
foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ $url - Responde OK" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $url - Resposta: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ❌ $url - Não responde" -ForegroundColor Red
    }
}

# 5. Verificar arquivos críticos
Write-Host "5. Arquivos Críticos:" -ForegroundColor Yellow
$criticalFiles = @("package.json", "next.config.js", "tsconfig.json", "src/app/layout.tsx", "src/app/page.tsx")
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file - FALTANDO!" -ForegroundColor Red
    }
}

Write-Host "" -ForegroundColor White
Write-Host "📋 Resumo:" -ForegroundColor Cyan
if ($nodeProcesses -and (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue)) {
    Write-Host "   🚀 Servidor está RODANDO em http://localhost:3000" -ForegroundColor Green
    Write-Host "   🌐 Network: http://192.168.1.59:3000" -ForegroundColor Green
} else {
    Write-Host "   ⛔ Servidor NÃO está rodando" -ForegroundColor Red
    Write-Host "   💡 Para iniciar: .\scripts\start-clean.ps1" -ForegroundColor Cyan
}