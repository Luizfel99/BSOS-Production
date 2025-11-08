#!/bin/bash
echo "🚀 Iniciando configuração do Bright & Shine Operating System (BSOS)..."

# 1️⃣ Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 2️⃣ Gerar cliente Prisma e sincronizar banco Neon
echo "🧠 Sincronizando Prisma com o banco de dados..."
npx prisma generate
npx prisma db push --force-reset

# 3️⃣ Criar .env se não existir
if [ ! -f ".env" ]; then
  echo "📝 Criando arquivo .env padrão..."
  echo "DATABASE_URL='YOUR_NEON_URL_HERE'" > .env
  echo "JWT_SECRET='bsos-secret-key'" >> .env
  echo "PORT=3020" >> .env
fi

# 4️⃣ Iniciar servidor
echo "🌐 Iniciando servidor na porta 3020..."
npm run dev -- -p 3020
