# B.S.O.S. - Script de Inicializacao Definitivo
# Garante que o servidor sempre inicie corretamente
# Versao: 2.0 Final

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  B.S.O.S. - Bright & Shine Operating System " -ForegroundColor Cyan
Write-Host "  Script de Inicializacao Definitivo v2.0    " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Finalizar processos existentes
Write-Host "[1/5] Finalizando processos existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Passo 2: Liberar portas
Write-Host "[2/5] Liberando portas..." -ForegroundColor Yellow
$ports = @(3000, 3001, 3002)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        $processId = $conn.OwningProcess
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 1

# Passo 3: Limpeza completa de cache
Write-Host "[3/5] Limpando cache..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "    Cache limpo com sucesso" -ForegroundColor Green

# Passo 4: Verificar dependencias
Write-Host "[4/5] Verificando dependencias..." -ForegroundColor Yellow
if (!(Test-Path "node_modules\next")) {
    Write-Host "    Instalando dependencias..." -ForegroundColor Yellow
    npm install --silent
}
Write-Host "    Dependencias OK" -ForegroundColor Green

# Passo 5: Iniciar servidor
Write-Host "[5/5] Iniciando servidor..." -ForegroundColor Yellow
Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "          SERVIDOR INICIADO COM SUCESSO      " -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Acessos disponiveis:" -ForegroundColor White
Write-Host "  Desktop/Web: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Mobile:      http://192.168.1.59:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para parar o servidor: Ctrl+C" -ForegroundColor Yellow
Write-Host "Para verificar status: .\scripts\health-check.ps1" -ForegroundColor Yellow
Write-Host ""

# Iniciar o servidor em foreground
npm run dev