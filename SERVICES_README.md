# 📁 Estrutura Organizada de Serviços e Utilitários

Esta documentação explica como usar a nova estrutura organizada de serviços e utilitários implementada no projeto.

## 🏗️ Estrutura de Diretórios

```
src/
┣ app/              # Rotas e páginas Next.js
┣ components/       # Componentes React reutilizáveis
┣ lib/              # Configurações e handlers principais
┣ hooks/            # Hooks customizados
┣ services/         # 🆕 Serviços organizados por domínio
┗ utils/            # 🆕 Utilitários e funções auxiliares
```

## 🔧 Serviços (`/src/services/`)

Os serviços estão organizados por domínio de negócio:

### 📋 Serviços Disponíveis

- **`cleanings.ts`** - Gerenciamento de limpezas
- **`properties.ts`** - Gerenciamento de propriedades
- **`tasks.ts`** - Gerenciamento de tarefas
- **`employees.ts`** - Gerenciamento de funcionários
- **`payments.ts`** - Serviços financeiros
- **`communication.ts`** - Comunicação e notificações
- **`checklists.ts`** - Checklists e templates
- **`reports.ts`** - Relatórios e analytics

### 💡 Como Usar

#### Importação Individual
```typescript
import { createCleaning, getCleanings } from '@/services/cleanings';
import { getProperties, updatePropertyStatus } from '@/services/properties';
import { employeeCheckin, employeeCheckout } from '@/services/employees';
```

#### Importação Organizada
```typescript
import { CleaningService, PropertyService, EmployeeService } from '@/services';

// Uso
await CleaningService.create(cleaningData);
await PropertyService.updateStatus(propertyId, 'cleaning');
await EmployeeService.checkin(employeeId, locationData);
```

### 🧹 Exemplo Prático - Serviço de Limpeza

```typescript
import { createCleaning, startCleaning, completeCleaning } from '@/services/cleanings';

// Criar nova limpeza
const newCleaning = await createCleaning({
  propertyId: '123',
  employeeId: '456',
  type: 'regular',
  priority: 'medium',
  scheduledDate: new Date().toISOString(),
  estimatedDuration: 120
});

// Iniciar limpeza
await startCleaning(cleaningId, employeeId);

// Finalizar limpeza
await completeCleaning(cleaningId, {
  notes: 'Limpeza concluída',
  rating: 5,
  photos: ['url1', 'url2']
});
```

## 🛠️ Utilitários (`/src/utils/`)

### 📋 Utilitários Disponíveis

- **`api.ts`** - Helpers para requisições API
- **`date.ts`** - Formatação e manipulação de datas
- **`format.ts`** - Formatação de valores, textos e validações

### 💡 Como Usar

#### Importação Individual
```typescript
import { formatCurrency, formatPhone, isValidCPF } from '@/utils/format';
import { formatDate, formatRelativeTime, addDays } from '@/utils/date';
import { apiGet, apiPost, apiCache } from '@/utils/api';
```

#### Importação Organizada
```typescript
import { FormatUtils, DateUtils, ApiUtils } from '@/utils';

// Uso
const price = FormatUtils.currency(1500); // "R$ 1.500,00"
const date = DateUtils.format(new Date(), 'long'); // "segunda-feira, 10 de outubro de 2025"
const data = await ApiUtils.get('/api/cleanings');
```

### 💰 Exemplo Prático - Formatação

```typescript
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils';

// Formatação de valores
const price = formatCurrency(1500); // "R$ 1.500,00"
const phone = formatPhone('11999887766'); // "(11) 99988-7766"
const cpf = formatCPF('12345678901'); // "123.456.789-01"

// Formatação de datas
const shortDate = formatDate(new Date(), 'short'); // "10/10/2025"
const longDate = formatDate(new Date(), 'long'); // "segunda-feira, 10 de outubro de 2025"
const relative = formatRelativeTime(new Date()); // "agora"

// Validações
const isValid = isValidCPF('123.456.789-01'); // boolean
const isEmailValid = isValidEmail('user@example.com'); // boolean
```

## 🔄 Migração dos Handlers Existentes

### Antes (handlers.ts)
```typescript
import { propertyHandlers } from '@/lib/handlers';

await propertyHandlers.viewDetails(propertyId);
```

### Depois (serviços organizados)
```typescript
import { getPropertyDetails } from '@/services/properties';

await getPropertyDetails(propertyId);
```

## 🎯 Hooks Customizados

Crie hooks que usam os serviços para facilitar o uso nos componentes:

```typescript
// hooks/useCleanings.ts
import { useState, useEffect } from 'react';
import { getCleanings } from '@/services/cleanings';

export function useCleanings(propertyId?: string) {
  const [cleanings, setCleanings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await getCleanings(propertyId ? { propertyId } : undefined);
      
      if (response.success) {
        setCleanings(response.data || []);
      }
    } catch (err) {
      setError('Erro ao carregar limpezas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [propertyId]);

  return { cleanings, loading, error, refetch };
}
```

## 📦 Componentes Otimizados

Use os serviços nos componentes para um código mais limpo:

```typescript
import React from 'react';
import { createCleaning } from '@/services/cleanings';
import { formatCurrency, formatDate } from '@/utils';
import { toast } from 'react-hot-toast';

export function CleaningCard({ cleaning }) {
  const handleStart = async () => {
    try {
      await startCleaning(cleaning.id, cleaning.employeeId);
      toast.success('Limpeza iniciada!');
    } catch (error) {
      toast.error('Erro ao iniciar limpeza');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold">{cleaning.type}</h3>
      <p>{formatDate(cleaning.scheduledDate, 'datetime')}</p>
      <p className="text-green-600">{formatCurrency(cleaning.cost)}</p>
      
      <button 
        onClick={handleStart}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Iniciar Limpeza
      </button>
    </div>
  );
}
```

## ✅ Benefícios

1. **📁 Organização Clara**: Código separado por responsabilidade
2. **🔄 Reutilização**: Serviços podem ser usados em qualquer componente
3. **🧪 Testabilidade**: Easier to unit test individual services
4. **🚀 Performance**: Importações otimizadas e tree-shaking
5. **📚 Manutenibilidade**: Código mais fácil de encontrar e modificar
6. **🔧 Flexibilidade**: Fácil adição de novos serviços e utilitários

## 🎯 Próximos Passos

1. Migrar componentes existentes para usar os novos serviços
2. Criar mais hooks customizados
3. Adicionar testes unitários para os serviços
4. Implementar cache inteligente para dados frequentes
5. Adicionar middleware para autenticação automática

---

**📝 Nota**: Esta estrutura mantém compatibilidade com o sistema anterior. Você pode migrar gradualmente sem quebrar funcionalidades existentes.