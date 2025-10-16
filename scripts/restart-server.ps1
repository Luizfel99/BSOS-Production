# Script para reiniciar servidor definitivamente
# Uso: .\scripts\restart-server.ps1

Write-Host "🔄 Reiniciando servidor BSOS..." -ForegroundColor Cyan

# 1. Matar todos os processos Node.js
Write-Host "🔪 Matando processos Node.js..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null
Start-Sleep -Seconds 2

# 2. Liberar porta 3000 se estiver ocupada
Write-Host "🔓 Liberando porta 3000..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $processId = $port3000.OwningProcess
    taskkill /f /pid $processId 2>$null
}

# 3. Limpeza completa de cache
Write-Host "🧹 Limpando cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue

# 4. Verificar se npm está disponível
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ NPM não encontrado!" -ForegroundColor Red
    exit 1
}

# 5. Reinstalar dependências se necessário
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Blue
    npm install
}

# 6. Iniciar servidor
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
Write-Host "📱 Acesse: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🌐 Rede: http://192.168.1.59:3000" -ForegroundColor Cyan
Write-Host "" 
Write-Host "⚡ Para parar o servidor: Ctrl+C" -ForegroundColor Yellow
Write-Host "🔄 Para reiniciar: .\scripts\restart-server.ps1" -ForegroundColor Yellow
Write-Host ""

npm run dev