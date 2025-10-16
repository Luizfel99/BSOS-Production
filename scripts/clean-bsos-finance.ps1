# Script to remove emojis from BSOSFinance.tsx
$filePath = "C:\Users\luizf\OneDrive\Desktop\Cleaning Menagement Plataforma\src\components\bsos\BSOSFinance.tsx"

# Read the content
$content = Get-Content $filePath -Encoding UTF8 -Raw

# Replacements for specific patterns
$content = $content -replace "integration\.provider === 'paypal' \? '\x{1F17F}\x{FE0F}' : '\x{1F4CA}'", "integration.provider === 'paypal' ? 'PP' : 'INV'"
$content = $content -replace "\x{1F7E2} Conectado", "Connected"
$content = $content -replace "\x{1F7E1} Pendente", "Pending"
$content = $content -replace "\x{1F534} Erro", "Error"
$content = $content -replace "\x{26AB} Desconectado", "Disconnected"
$content = $content -replace "\x{1F504} Sincronizar", "Sync"
$content = $content -replace "\x{1F4C8} Resumo de Transações", "Transaction Summary"
$content = $content -replace "\x{1F468}\x{200D}\x{1F4BC} Supervisor", "Supervisor"
$content = $content -replace "\x{1F9F9} Profissional", "Professional"
$content = $content -replace "\x{1F4CA} (\d+) serviços", "$1 services"
$content = $content -replace "\x{2B50} (.+?) avaliação média", "Rating: $1"
$content = $content -replace "\x{1F4C5} (.+?)", "Period: $1"
$content = $content -replace "\x{1F4CB} Critérios de Bonificação", "Bonus Criteria"
$content = $content -replace "\x{2705} (\d+)/10", "✓ $1/10"
$content = $content -replace "\x{2705} 95%", "✓ 95%"
$content = $content -replace "\x{2705} (.+?)/5\.0", "✓ $1/5.0"

# Write back to file
$content | Set-Content $filePath -Encoding UTF8 -NoNewline

Write-Host "BSOSFinance.tsx emoji cleanup completed!"