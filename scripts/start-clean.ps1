# Script para inicialização limpa do servidor B.S.O.S.
# Versão: 2.0
# Data: 2025-10-10

Write-Host "🚀 B.S.O.S. Clean Start Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# 1. Finalizar processos existentes
Write-Host "1. Finalizando processos Node.js existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Limpar portas
Write-Host "2. Liberando portas 3000 e 3001..." -ForegroundColor Yellow
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $pid = $process.OwningProcess
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "   Porta $port liberada (PID: $pid)" -ForegroundColor Green
    }
}
Start-Sleep -Seconds 1

# 3. Limpar cache
Write-Host "3. Limpando cache..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   Cache limpo com sucesso" -ForegroundColor Green

# 4. Verificar dependências
Write-Host "4. Verificando dependências..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "   Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# 5. Iniciar servidor
Write-Host "5. Iniciando servidor de desenvolvimento..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
Write-Host "🌟 Servidor será iniciado em:" -ForegroundColor Green
Write-Host "   Local:   http://localhost:3000" -ForegroundColor White
Write-Host "   Network: http://192.168.1.59:3000" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "📱 Para mobile, use o endereço Network no seu celular" -ForegroundColor Cyan
Write-Host "⚡ Para parar o servidor, pressione Ctrl+C" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White

# Iniciar em modo foreground para permitir controle
npm run dev