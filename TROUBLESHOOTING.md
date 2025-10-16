# 🚨 Guia de Solução de Problemas - BSOS

## Problema: "localhost refused to connect" / ERR_CONNECTION_REFUSED

### 🔧 Soluções Rápidas

#### 1. **Script Automático (RECOMENDADO)**
```powershell
# Execute um dos scripts:
.\scripts\restart-server.ps1  # PowerShell
# OU
.\scripts\restart-server.bat  # Command Prompt
```

#### 2. **Solução Manual Passo a Passo**

##### Passo 1: Matar processos Node.js travados
```powershell
taskkill /f /im node.exe
```

##### Passo 2: Liberar porta 3000
```powershell
# Verificar processos na porta 3000
netstat -aon | findstr :3000

# Matar processo específico (substitua XXXX pelo PID)
taskkill /f /pid XXXX
```

##### Passo 3: Limpar cache completo
```powershell
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache
Remove-Item -Recurse -Force .turbo
```

##### Passo 4: Reiniciar servidor
```powershell
npm run dev
```

### 🔍 Diagnóstico de Problemas

#### Verificar se o servidor está rodando:
```powershell
netstat -aon | findstr :3000
```

#### Verificar logs do Next.js:
- Procure por erros de compilação no terminal
- Verifique se há erros TypeScript
- Observe mensagens de "✓ Compiled" vs "✗ Failed"

#### Verificar permissões:
```powershell
# Execute o PowerShell como administrador se necessário
```

### 🛠️ Soluções Avançadas

#### Se o problema persistir:

1. **Reinstalar dependências:**
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

2. **Verificar firewall/antivírus:**
- Temporariamente desabilite o firewall
- Adicione exceção para Node.js
- Verifique se o antivírus não está bloqueando

3. **Tentar porta diferente:**
```powershell
# No package.json, altere o script dev para:
"dev": "next dev -p 3001"
```

4. **Verificar hosts file:**
```
# Arquivo: C:\Windows\System32\drivers\etc\hosts
# Certifique-se que não há conflitos com localhost
```

### 📊 Monitor de Conexão

O sistema agora inclui:
- ✅ **Error Boundary**: Captura erros automaticamente
- ✅ **Monitor de Conexão**: Indica status em tempo real
- ✅ **Recovery Automático**: Tenta reconectar automaticamente
- ✅ **Scripts de Restart**: Solução com um clique

### 🎯 Prevenção

Para evitar problemas futuros:

1. **Sempre use os scripts de restart**
2. **Não feche o terminal abruptamente**
3. **Use Ctrl+C para parar o servidor antes de fechar**
4. **Mantenha o Node.js atualizado**

### 🆘 Se nada funcionar

Execute a "solução nuclear":
```powershell
# Pare tudo
taskkill /f /im node.exe
taskkill /f /im npm.exe

# Limpe tudo
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force package-lock.json

# Reinstale tudo
npm install

# Reinicie
npm run dev
```

### 📞 Contato de Suporte

Se o problema persistir:
1. Capture o erro completo do terminal
2. Verifique o Task Manager para processos Node.js órfãos
3. Reinicie o computador como último recurso

---
**BSOS - Bright & Shine OS** 🌟
*Sistema inteligente de gerenciamento de limpeza*