# Script para parada limpa do servidor B.S.O.S.
# Versão: 2.0
# Data: 2025-10-10

Write-Host "🛑 B.S.O.S. Clean Stop Script" -ForegroundColor Red
Write-Host "==============================" -ForegroundColor Red

# 1. Finalizar todos os processos Node.js
Write-Host "1. Finalizando processos Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "   $($nodeProcesses.Count) processo(s) Node.js finalizados" -ForegroundColor Green
} else {
    Write-Host "   Nenhum processo Node.js encontrado" -ForegroundColor Gray
}

# 2. Liberar portas específicas
Write-Host "2. Liberando portas..." -ForegroundColor Yellow
$ports = @(3000, 3001, 3002)
$portsFreed = 0

foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Write-Host "   Porta $port liberada (PID: $processId)" -ForegroundColor Green
            $portsFreed++
        }
    } catch {
        # Porta já estava livre
    }
}

if ($portsFreed -eq 0) {
    Write-Host "   Todas as portas já estavam livres" -ForegroundColor Gray
}

# 3. Limpar cache se solicitado
$cleanCache = Read-Host "3. Deseja limpar o cache? (y/N)"
if ($cleanCache -eq "y" -or $cleanCache -eq "Y") {
    Write-Host "   Limpando cache..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   Cache limpo com sucesso" -ForegroundColor Green
}

Write-Host "" -ForegroundColor White
Write-Host "✅ Servidor parado com sucesso!" -ForegroundColor Green
Write-Host "   Para reiniciar: .\scripts\start-clean.ps1" -ForegroundColor Cyan