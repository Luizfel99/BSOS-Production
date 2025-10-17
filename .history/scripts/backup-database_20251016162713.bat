@echo off
REM BSOS Database Backup Script
REM Este script cria backup do banco PostgreSQL usando o comando fornecido

echo 🗄️ BSOS Database Backup Tool
echo ===========================

REM Obter data atual no formato YYYY-MM-DD
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "datestamp=%YYYY%-%MM%-%DD%"
set "timestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"

echo 📅 Data: %datestamp%
echo 🕒 Timestamp: %timestamp%

REM Verificar se pg_dump está disponível
where pg_dump >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ pg_dump não encontrado no PATH
    echo 💡 Por favor, instale PostgreSQL Client Tools ou use o backup via Prisma
    echo.
    echo 🔧 Alternativas:
    echo    1. Instalar PostgreSQL: https://www.postgresql.org/download/windows/
    echo    2. Usar backup Prisma: npm run backup
    echo.
    pause
    exit /b 1
)

REM Verificar se DATABASE_URL está definida
if "%DATABASE_URL%"=="" (
    echo ❌ DATABASE_URL não está definida
    echo 💡 Defina a variável de ambiente DATABASE_URL
    pause
    exit /b 1
)

REM Criar diretório de backup se não existir
if not exist "backup" mkdir backup

REM Criar backup usando pg_dump
echo 🚀 Iniciando backup do banco de dados...
set "backup_file=backup\bsos_backup_%timestamp%.dump"

pg_dump --no-owner --clean -Fc "%DATABASE_URL%" -f "%backup_file%"

if %errorlevel% equ 0 (
    echo ✅ Backup concluído com sucesso!
    echo 📁 Arquivo: %backup_file%
    
    REM Mostrar tamanho do arquivo
    for %%A in ("%backup_file%") do set "file_size=%%~zA"
    set /a file_size_mb=file_size/1024/1024
    echo 📏 Tamanho: %file_size_mb% MB
) else (
    echo ❌ Erro durante o backup
    echo 💡 Verifique a conexão com o banco de dados
)

echo.
pause