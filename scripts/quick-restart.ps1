# Script Simplificado de Restart para BSOS
# Uso: .\scripts\quick-restart.ps1

Write-Host "🔄 Reiniciando BSOS Server..." -ForegroundColor Green

# Matar processos Node.js
taskkill /f /im node.exe 2>$null

# Limpar cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Iniciar servidor
Write-Host "🚀 Servidor iniciando em http://localhost:3000" -ForegroundColor Cyan
npm run dev