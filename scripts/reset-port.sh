#!/bin/bash
echo "🧹 Encerrando processos na porta 3020..."
lsof -ti:3020 | xargs kill -9 2>/dev/null || echo "✅ Nenhum processo ativo"
sleep 1
ss -tulpn | grep :3020 || echo "✅ Porta 3020 livre"
echo "🚀 Iniciando servidor..."
npm run dev
