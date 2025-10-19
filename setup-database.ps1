# BSOS Database Configuration Script
# Run this after setting up your PostgreSQL database

Write-Host "  BSOS DATABASE CONFIGURATION" -ForegroundColor Green
Write-Host ""

Write-Host " DATABASE PROVIDERS:" -ForegroundColor Yellow
Write-Host "1. Neon (Recommended - Free tier, great performance)"
Write-Host "2. Supabase (Full backend solution)"
Write-Host "3. Railway (Simple deployment)"
Write-Host "4. Local PostgreSQL"
Write-Host ""

Write-Host " CONNECTION STRING FORMATS:" -ForegroundColor Cyan
Write-Host ""

Write-Host " NEON:" -ForegroundColor Green
Write-Host "postgresql://username:password@ep-random-name-123456.us-east-1.neon.tech/neondb?sslmode=require"
Write-Host ""

Write-Host " SUPABASE:" -ForegroundColor Green  
Write-Host "postgresql://postgres.projectref:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
Write-Host ""

Write-Host " RAILWAY:" -ForegroundColor Green
Write-Host "postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway"
Write-Host ""

Write-Host " LOCAL:" -ForegroundColor Green
Write-Host "postgresql://postgres:password@localhost:5432/bsos_db"
Write-Host ""

Write-Host " QUICK SETUP COMMANDS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "# 1. Copy environment template"
Write-Host "cp .env.example .env.local"
Write-Host ""
Write-Host "# 2. Generate auth secret"
Write-Host "openssl rand -base64 32"
Write-Host ""  
Write-Host "# 3. Initialize database"
Write-Host "npx prisma generate"
Write-Host "npx prisma db push"
Write-Host ""
Write-Host "# 4. Start development server"
Write-Host "npm run dev"
Write-Host ""

Write-Host " VERCEL DEPLOYMENT:" -ForegroundColor Magenta
Write-Host "1. Go to https://vercel.com/new"
Write-Host "2. Import: Luizfel99/BSOS-Production"  
Write-Host "3. Add environment variables from .env.example"
Write-Host "4. Deploy!"
Write-Host ""

Write-Host " Your BSOS app will be ready for production!" -ForegroundColor Green
