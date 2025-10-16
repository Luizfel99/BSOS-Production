# Script de verificacao de saude do servidor B.S.O.S.
# Versao: 2.0 - Simplificado
# Data: 2025-10-10

Write-Host "Verificando status do servidor B.S.O.S..." -ForegroundColor Cyan

# Verificar se Node.js esta rodando
$nodeProc = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProc) {
    Write-Host "Node.js rodando - PID: $($nodeProc.Id)" -ForegroundColor Green
} else {
    Write-Host "Node.js NAO esta rodando" -ForegroundColor Red
    exit
}

# Verificar porta 3000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "Porta 3000 em uso" -ForegroundColor Green
} else {
    Write-Host "Porta 3000 livre" -ForegroundColor Yellow
}

# Testar conectividade
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10 -UseBasicParsing
    Write-Host "Servidor respondendo OK (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "Acesse: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Mobile: http://192.168.1.59:3000" -ForegroundColor Cyan
} catch {
    Write-Host "Servidor NAO responde" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}