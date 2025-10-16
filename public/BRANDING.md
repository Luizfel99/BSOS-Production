# BSOS - Bright & Shine Operating System

## Recursos de Branding

### Logos e Ícones
- **Ícone Principal**: ✨ (sparkle/brilho)
- **Ícone Secundário**: 🧹 (limpeza)
- **Combinação**: ✨🧹 (inteligência + limpeza)

### Cores da Marca
- **Azul Primário**: #0ea5e9 (sky-500)
- **Roxo Secundário**: #a855f7 (purple-500)
- **Gradiente**: De azul para roxo

### Tipografia
- **Font Principal**: Inter (já configurada)
- **Peso para Títulos**: Bold (700)
- **Peso para Texto**: Medium (500) e Regular (400)

### Aplicações
- Tela de Login
- Header do Sistema
- Footer
- Metadados da Página
- Package.json
- README.md

### Slogan
"Where Cleaning Meets Intelligence"
"Onde a Limpeza Encontra a Inteligência"

### Uso Recomendado
Para usar o branding de forma consistente, importe o arquivo de configuração:

```typescript
import { BRANDING, getFullTitle, getSlogan } from '@/lib/branding';

// Título completo
const title = getFullTitle(); // "BSOS - Bright & Shine Operating System"

// Slogan
const slogan = getSlogan(); // "Where Cleaning Meets Intelligence"

// Informações de módulo
const coreModule = BRANDING.modules.core;
```