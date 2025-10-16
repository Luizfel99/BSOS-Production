# ==================================
# BSOS Development Server Launcher
# ==================================

Write-Host "
 ██████╗ ███████╗ ██████╗ ███████╗
 ██╔══██╗██╔════╝██╔═══██╗██╔════╝
 ██████╔╝███████╗██║   ██║███████╗
 ██╔══██╗╚════██║██║   ██║╚════██║
 ██████╔╝███████║╚██████╔╝███████║
 ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝
                                   
 Bright & Shine Operating System
 Development Server Launcher
" -ForegroundColor Cyan

Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "📍 Project: Cleaning Management Platform" -ForegroundColor Yellow
Write-Host "🌐 Access URLs:" -ForegroundColor Yellow
Write-Host "   • Local:   http://localhost:3000" -ForegroundColor White
Write-Host "   • Network: http://192.168.1.59:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   • Keep this window open to maintain the server" -ForegroundColor White
Write-Host "   • Press Ctrl+C to stop the server" -ForegroundColor White
Write-Host "   • You can now close VS Code safely" -ForegroundColor Green
Write-Host ""
Write-Host "⚡ Hot-reload enabled - changes will update automatically!" -ForegroundColor Magenta
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Change to project directory
Set-Location "C:\Users\luizf\OneDrive\Desktop\Cleaning Menagement Plataforma"

# Start development server
npm run dev