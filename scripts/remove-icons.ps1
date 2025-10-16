# Script PowerShell para remover todos os ícones infantis

$iconMappings = @{
    '🧹' = ''
    '📊' = ''
    '📅' = ''
    '✅' = ''
    '📸' = ''
    '📋' = ''
    '🏠' = ''
    '🏨' = ''
    '🔄' = ''
    '🐦' = ''
    '👥' = ''
    '💰' = ''
    '📈' = ''
    '🚨' = ''
    '💡' = ''
    '🔧' = ''
    '⭐' = ''
    '🧠' = ''
    '⚡' = ''
    '👁️' = ''
    '🔴' = ''
    '🟡' = ''
    '🟢' = ''
    '🟠' = ''
    '📷' = ''
    '📝' = ''
    '💬' = ''
    '🧾' = ''
    '📦' = ''
    '🔍' = ''
    '🧽' = ''
    '✨' = ''
    '🫧' = ''
    '🛏️' = ''
    '🔎' = ''
    '🏆' = ''
    '⏳' = ''
    '❌' = ''
    '📧' = ''
    '🅿️' = ''
    '💫' = ''
    '⚙️' = ''
    '📍' = ''
    '⏱️' = ''
    '🎯' = ''
    '📌' = ''
    '🌟' = ''
    '💎' = ''
    '🎨' = ''
    '🚀' = ''
    '🎉' = ''
    '🎊' = ''
    '🔥' = ''
    '💯' = ''
    '🎈' = ''
    '🎁' = ''
    '🎀' = ''
    '🌈' = ''
    '☀️' = ''
    '🌙' = ''
}

# Processa todos os arquivos .tsx
Get-ChildItem -Path "c:\Users\luizf\OneDrive\Desktop\Cleaning Menagement Plataforma\src\components" -Filter "*.tsx" -Recurse | ForEach-Object {
    Write-Host "Processing: $($_.FullName)"
    $content = Get-Content $_.FullName -Raw
    
    # Aplica todas as substituições
    foreach ($icon in $iconMappings.Keys) {
        $replacement = $iconMappings[$icon]
        $content = $content -replace [regex]::Escape($icon), $replacement
    }
    
    # Salva o arquivo modificado
    Set-Content -Path $_.FullName -Value $content -NoNewline
}

Write-Host "Icon cleanup completed!"