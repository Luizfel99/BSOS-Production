@echo off
echo 🔄 Reiniciando servidor BSOS...

echo 🔪 Matando processos Node.js...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo 🔓 Liberando porta 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1

echo 🧹 Limpando cache...
rmdir /s /q .next >nul 2>&1
rmdir /s /q node_modules\.cache >nul 2>&1
rmdir /s /q .turbo >nul 2>&1

echo 🚀 Iniciando servidor...
echo 📱 Acesse: http://localhost:3000
echo 🌐 Rede: http://192.168.1.59:3000
echo.
echo ⚡ Para parar o servidor: Ctrl+C
echo 🔄 Para reiniciar: scripts\restart-server.bat
echo.

npm run dev