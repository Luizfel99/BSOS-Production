# BSOS Design System Documentation

## 🎨 **Phase 9 - Global Visual Design System**

O sistema de design BSOS foi implementado com sucesso, fornecendo uma base sólida e consistente para todos os componentes da plataforma.

## 📁 **Estrutura do Sistema**

### **Design Tokens** (`/src/config/theme.ts`)
```typescript
// Paleta de cores completa com escalas de 50-900
const colors = {
  primary: { /* Azul corporativo */ },
  secondary: { /* Ciano complementar */ },
  neutral: { /* Tons de cinza */ },
  semantic: { /* Sucesso, aviso, erro */ }
}

// Tipografia padronizada
const typography = {
  fontSize: { xs: '0.75rem', ..., '4xl': '2.25rem' },
  fontWeight: { light: 300, ..., extrabold: 800 },
  lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 }
}
```

### **Componentes UI** (`/src/components/ui/`)

#### **Button** - Componente de botão versátil
```typescript
<Button variant="primary" size="md" leftIcon={<Icon />}>
  Texto do Botão
</Button>

// Variantes: primary, secondary, outline, ghost, destructive
// Tamanhos: sm, md, lg
// Estados: loading, disabled, fullWidth
```

#### **Input** - Campo de entrada com validação
```typescript
<Input
  label="Nome"
  placeholder="Digite seu nome"
  helperText="Texto auxiliar"
  errorMessage="Campo obrigatório"
  leftIcon={<SearchIcon />}
  state="error"
/>
```

#### **Card** - Container flexível para conteúdo
```typescript
<Card variant="elevated" padding="lg">
  <CardHeader>
    <Heading level={2}>Título</Heading>
  </CardHeader>
  <CardBody>
    <Text>Conteúdo do card</Text>
  </CardBody>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

#### **Alert** - Notificações e mensagens importantes
```typescript
<Alert variant="success" title="Sucesso!" dismissible>
  Operação realizada com sucesso!
</Alert>

// Variantes: info, success, warning, error
```

#### **Badge** - Indicadores de status
```typescript
<Badge variant="primary" size="md">
  Status Ativo
</Badge>

// Variantes: default, primary, secondary, success, warning, error, outline
```

#### **Modal** - Diálogos e modais acessíveis
```typescript
<Modal isOpen={true} onClose={handleClose} title="Título">
  <ModalBody>
    <Text>Conteúdo do modal</Text>
  </ModalBody>
  <ModalFooter>
    <Button variant="outline">Cancelar</Button>
    <Button variant="primary">Confirmar</Button>
  </ModalFooter>
</Modal>
```

#### **Typography** - Sistema tipográfico completo
```typescript
<Typography variant="h1" color="primary" align="center">
  Título Principal
</Typography>

<Heading level={2}>Subtítulo</Heading>
<Text size="base">Texto do corpo</Text>
<Caption>Texto pequeno</Caption>
```

## 🎯 **Características Principais**

### **1. Acessibilidade**
- Todos os componentes seguem padrões ARIA
- Navegação por teclado implementada
- Focus management em modais
- Indicadores visuais para estado de foco
- Suporte a leitores de tela

### **2. Responsividade**
- Design mobile-first
- Breakpoints padronizados (mobile, tablet, desktop, large)
- Hook `useResponsive()` para detecção de breakpoints
- Touch targets otimizados (mínimo 44px)

### **3. Temas e Customização**
- CSS Custom Properties para fácil customização
- Suporte a modo escuro (prefers-color-scheme)
- Escalas de cores consistentes
- Transições e animações padronizadas

### **4. Performance**
- Tree-shaking otimizado
- Componentes forwardRef
- CSS-in-JS mínimo (Tailwind + CSS Variables)
- Lazy loading em modais

## 🛠 **Utilitários**

### **Hooks**
```typescript
// Acesso ao tema
const theme = useTheme();

// Detecção responsiva
const { isMobile, isTablet, currentBreakpoint } = useResponsive();
```

### **Funções Utilitárias**
```typescript
// Combinação de classes
import { cn } from '@/components/ui/utils/cn';
const className = cn('base-class', condition && 'conditional-class');
```

## 🎨 **Paleta de Cores**

### **Cores Primárias**
- **Primary Blue**: #3b82f6 (com escala 50-900)
- **Secondary Cyan**: #0ea5e9 (com escala 50-900)
- **Neutral Gray**: #64748b (com escala 50-900)

### **Cores Semânticas**
- **Success Green**: #22c55e
- **Warning Yellow**: #f59e0b
- **Error Red**: #ef4444

## 📱 **Teste e Validação**

### **Página de Teste**
Acesse `/test-design-system` para visualizar todos os componentes em ação:
- Showcases interativos
- Testes de variantes e estados
- Validação de responsividade
- Demonstração de acessibilidade

### **Status de Implementação**
- ✅ Design tokens configurados
- ✅ Componentes core implementados
- ✅ Sistema tipográfico completo
- ✅ Utilidades e hooks
- ✅ Testes e validação
- ✅ Documentação completa

## 🚀 **Próximos Passos**

1. **Migração Gradual**: Substituir componentes existentes pelos novos
2. **Testes de Integração**: Validar em todos os módulos BSOS
3. **Performance Audit**: Otimizar bundle size
4. **A11y Testing**: Testes com ferramentas de acessibilidade
5. **Documentação Interativa**: Storybook ou similar

## 📋 **Checklist de Qualidade**

- ✅ Todas as props documentadas com TypeScript
- ✅ Testes de acessibilidade implementados
- ✅ Suporte a temas claro/escuro
- ✅ Componentes responsivos
- ✅ Performance otimizada
- ✅ Padrões de código consistentes
- ✅ Backward compatibility mantida

---

**BSOS Design System v2.0** - Implementado em Phase 9
*Sistema Operacional Inteligente para Gestão de Limpeza*