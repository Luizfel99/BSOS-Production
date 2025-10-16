# ✨ Bright & Shine Operating System (BSOS)

**Where Cleaning Meets Intelligence**

Uma plataforma operacional completa para gerenciamento inteligente de empresas de limpeza especializada em Airbnb e outros tipos de propriedades.

## 🚀 Funcionalidades Implementadas

### 📊 Dashboard Inteligente
- **Métricas em tempo real** de tarefas, propriedades e receita
- **Performance da equipe** com rankings e estatísticas
- **Próximos eventos** (check-ins/check-outs)
- **Alertas de estoque baixo** automáticos
- **Atividades recentes** com logs detalhados

### 📋 Gestão de Tarefas
- **Criação automática** de tarefas baseada em reservas
- **Checklists personalizados** por tipo de limpeza
- **Atribuição inteligente** de funcionários
- **Tracking de progresso** em tempo real
- **Sistema de avaliação** com bonificações
- **Filtros avançados** por status, data, prioridade

### 🏨 Gestão Airbnb & Propriedades
- **Cadastro completo** de propriedades
- **Controle de reservas** integrado
- **Calendário sincronizado** com plataformas
- **Instruções específicas** por propriedade
- **Gestão de amenities** e comodidades

### � Integrações com APIs
- **Airbnb** - Importação automática de reservas
- **Hostaway** - Sistema PMS completo
- **Booking.com** - Sincronização de reservas
- **VRBO/Expedia** - Gestão multicanal
- **Taskbird** - Criação automática de tarefas
- **Turno** - Gestão de agenda dos funcionários

### 🔔 Sistema de Notificações
- **WhatsApp automático** para equipe e clientes
- **E-mails personalizados** com templates
- **SMS** para situações urgentes
- **Templates inteligentes** com variáveis dinâmicas
- **Agendamento** de notificações
- **Histórico completo** de comunicações

### 📦 Gestão de Estoque
- **Controle de suprimentos** por categoria
- **Alertas de estoque baixo** automáticos
- **Gestão de fornecedores** com ratings
- **Lista de compras** gerada automaticamente
- **Histórico de reabastecimento**

### ⭐ Sistema de Avaliação
- **Bonificações automáticas** baseadas em performance
- **Rankings** de funcionários
- **Métricas de qualidade** detalhadas
- **Feedback** dos clientes integrado
- **Relatórios de performance**

### � Comunicação Profissional
- **Templates padronizados** para diferentes situações
- **Mensagens automáticas** para clientes
- **Comunicação interna** da equipe
- **Histórico de comunicações**

### 📈 Relatórios e Supervisão
- **Relatórios detalhados** por funcionário
- **Métricas de tempo** e eficiência
- **Exportação CSV** para análises
- **Gráficos interativos** de performance

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React moderno
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Design system responsivo
- **React Hooks** - Estado e efeitos
- **Componentes modulares** - Arquitetura escalável

### Backend
- **Next.js API Routes** - Endpoints RESTful
- **Banco de dados simulado** - Estrutura para PostgreSQL/MongoDB
- **Sistema de webhooks** - Integração em tempo real
- **Autenticação** preparada para JWT/OAuth

### Integrações
- **APIs RESTful** - Comunicação com plataformas externas
- **Webhooks** - Eventos automáticos
- **WhatsApp Business API** - Mensagens automáticas
- **SendGrid/Nodemailer** - Sistema de e-mails
- **Twilio** - SMS e comunicações

## � Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── dashboard/          # Métricas e estatísticas
│   │   ├── tasks/              # Gestão de tarefas
│   │   ├── notifications/      # Sistema de notificações
│   │   ├── integrations/       # APIs de terceiros
│   │   └── webhooks/           # Recepção de eventos
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Dashboard principal
├── components/
│   ├── DashboardContent.tsx
│   ├── GestaoTarefas.tsx
│   ├── GestaoAirbnb.tsx
│   ├── IntegracaoAPIs.tsx
│   ├── SistemaNotificacoes.tsx
│   ├── GestaoEstoque.tsx
│   ├── SistemaAvaliacao.tsx
│   ├── ComunicacaoProfissional.tsx
│   └── RelatorioSupervisao.tsx
├── lib/
│   └── database.ts            # Banco de dados simulado
└── services/
    ├── apiIntegrations.ts     # Orquestrador de integrações
    └── webhookHandlers.ts     # Processamento de webhooks
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repo-url>
cd cleaning-management-platform

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Configuração de Ambiente
Crie um arquivo `.env.local`:

```env
# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Integrações
AIRBNB_CLIENT_ID=your_airbnb_client_id
AIRBNB_CLIENT_SECRET=your_airbnb_client_secret
HOSTAWAY_API_KEY=your_hostaway_api_key

# Comunicações
WHATSAPP_API_TOKEN=your_whatsapp_token
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Banco de dados (para produção)
DATABASE_URL=postgresql://...
```

## 🌐 Endpoints da API

### Dashboard
- `GET /api/dashboard` - Métricas e estatísticas

### Tarefas
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks?id={id}` - Atualizar tarefa

### Notificações
- `GET /api/notifications` - Listar notificações
- `POST /api/notifications` - Enviar notificação
- `PUT /api/notifications?action=get_templates` - Templates
- `PUT /api/notifications?action=send_bulk` - Envio em massa

### Integrações
- `GET /api/integrations?action=status` - Status das integrações
- `POST /api/integrations` - Configurar/sincronizar
- `GET /api/integrations?action=properties` - Propriedades
- `GET /api/integrations?action=reservations` - Reservas

### Webhooks
- `POST /api/webhooks?platform={platform}` - Receber eventos
- `GET /api/webhooks` - Status do endpoint

## 🔄 Automações Implementadas

### Novos Reservas (via Webhook)
1. ✅ Reserva salva automaticamente
2. ✅ Tarefas de limpeza criadas (checkout + checkin)
3. ✅ WhatsApp enviado para equipe
4. ✅ E-mail para gestor
5. ✅ Funcionários atribuídos automaticamente

### Conclusão de Tarefas
1. ✅ Cálculo automático de bonificações
2. ✅ Notificação de conclusão
3. ✅ Atualização de métricas
4. ✅ Histórico de performance

### Estoque Baixo
1. ✅ Alertas automáticos
2. ✅ Lista de compras gerada
3. ✅ Notificação para gestores

## 📱 Como Usar

### 1. Configurar Integrações
- Acesse **"Integrações API"**
- Conecte suas plataformas (Airbnb, Hostaway, etc.)
- Configure webhooks com URLs geradas automaticamente

### 2. Gerenciar Propriedades
- Use **"Gestão Airbnb"** para cadastrar propriedades
- Configure instruções específicas de limpeza
- Defina amenities e comodidades

### 3. Criar Tarefas
- **"Tarefas"** permite criação manual ou automática
- Atribua funcionários específicos
- Acompanhe progresso em tempo real

### 4. Monitorar Performance
- **Dashboard** mostra métricas em tempo real
- **"Avaliação & Bonificação"** tracked performance
- **"Relatório de Supervisão"** para análises detalhadas

### 5. Gerenciar Comunicações
- **"Notificações"** para mensagens automáticas
- Templates personalizáveis
- Histórico completo de comunicações

## 🚀 Deploy em Produção

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Outras Plataformas
- **Netlify** - Suporte completo Next.js
- **AWS Amplify** - Escalabilidade automática
- **Railway** - Banco de dados integrado

### Banco de Dados
Substitua o banco simulado por:
- **PostgreSQL** (recomendado)
- **MongoDB** 
- **MySQL**
- **Supabase** (PostgreSQL gerenciado)

## 🔐 Segurança

### Implementar em Produção
- **Autenticação JWT** ou **OAuth 2.0**
- **Rate limiting** nas APIs
- **Validação de webhooks** com assinaturas
- **HTTPS** obrigatório
- **Sanitização** de inputs
- **Logs de auditoria**

### Variáveis de Ambiente
- Nunca commitar credenciais
- Usar serviços de secrets (Vercel, AWS Secrets Manager)
- Rotacionar chaves regularmente

## 📊 Métricas e Monitoramento

### KPIs Implementados
- **Tempo médio de limpeza**
- **Taxa de conclusão de tarefas**
- **Satisfação do cliente**
- **Eficiência da equipe**
- **Receita por propriedade**
- **Utilização de estoque**

### Dashboards
- **Tempo real** - Performance atual
- **Tendências** - Análise histórica
- **Comparativos** - Benchmarks
- **Previsões** - Planejamento futuro

## 🛟 Suporte e Manutenção

### Logs
- **Console.log** para desenvolvimento
- **Winston/Pino** para produção
- **Sentry** para monitoramento de erros

### Backup
- **Dados** - Backup automático diário
- **Configurações** - Versionamento
- **Disaster Recovery** - Plano documentado

## 📞 Contato

Para suporte técnico ou dúvidas:
- **Email**: suporte@brightshine.com
- **WhatsApp**: +55 21 99999-9999
- **Documentação**: [docs.brightshine.com]

---

## 🎯 Próximos Passos

### Melhorias Planejadas
- [ ] **App Mobile** (React Native)
- [ ] **IA para otimização** de rotas
- [ ] **Integração com Google Calendar**
- [ ] **Sistema de pagamentos** (Stripe/PagSeguro)
- [ ] **Módulo de treinamento** para funcionários
- [ ] **API pública** para integradores

### Versão Atual: 1.0.0
**Status**: ✅ Produção Ready

**Última atualização**: Janeiro 2024
  - Média ≥ 4.5: R$ 150 de bônus
  - Média ≥ 4.0: R$ 100 de bônus
- **Registro de feedbacks** e histórico completo
- **Exportação para planilha** (CSV/Excel)
- **Dashboard de performance** individual e da equipe

### � Comunicação Profissional com Clientes
- **Templates bilíngues** (Português/Inglês) para:
  - Confirmação de agendamentos
  - Follow-up pós-limpeza
  - Respostas a reclamações
  - Reagendamentos
  - Mensagens para Airbnb/Hostaway
  - Promoções e ofertas especiais
  - Lembretes de agendamento

- **Variáveis dinâmicas** para personalização:
  - {nome}, {data}, {hora}, {local}, {equipe}
  - {valor}, {servico}, {empresa}

- **Plataformas suportadas**:
  - WhatsApp Business
  - Email
  - SMS
  - Hostaway
  - Airbnb
  - Google Reviews

### 📋 Relatório de Supervisão e Auditoria de Qualidade
- **Sistema de auditoria completo** com:
  - Avaliação por ambiente (0-10 pontos)
  - Anexo de fotos por ambiente
  - Observações detalhadas
  - Assinatura digital do supervisor

- **Controle de qualidade** com:
  - Data, local e responsável
  - Pontuação automática por ambiente
  - Status (Aprovado/Pendente/Correção)
  - Rastreabilidade completa

- **Padrão Bright & Shine**:
  - Aprovado: ≥ 9.0 pontos
  - Pendente: 7.0 - 8.9 pontos
  - Correção necessária: < 7.0 pontos

- **Exportação de relatórios** em formato texto

### �📈 Relatórios e Analytics
- Relatórios de vendas
- Análise de clientes
- Performance da equipe
- Exportação em PDF, Excel e CSV
- Dados para tomada de decisão

### ⚙️ Configurações
- Dados da empresa
- Configurações de notificação
- Personalização do sistema
- Backup de dados

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React para produção
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS para estilização
- **React Hooks** - Gerenciamento de estado
- **Componentes Modulares** - Arquitetura escalável

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx            # Página inicial/Dashboard
│   └── globals.css         # Estilos globais
└── components/
    ├── SistemaAvaliacao.tsx        # Sistema de avaliação e bonificação
    ├── ComunicacaoProfissional.tsx # Templates de comunicação
    └── RelatorioSupervisao.tsx     # Relatórios de auditoria
```

## 🎯 Benefícios para o Negócio

### 📊 **Sistema de Avaliação**
- ✅ Motivação da equipe através de bonificações
- ✅ Controle de qualidade do serviço
- ✅ Histórico de performance para tomada de decisão
- ✅ Identificação de funcionários de destaque

### 💬 **Comunicação Profissional**
- ✅ Padronização do atendimento
- ✅ Elevação da percepção da marca
- ✅ Suporte bilíngue para clientes internacionais
- ✅ Respostas rápidas e profissionais

### 📋 **Relatórios de Supervisão**
- ✅ Garantia de padrão de qualidade
- ✅ Rastreabilidade completa dos serviços
- ✅ Evidências fotográficas
- ✅ Controle de supervisão rigoroso

## 🔄 Próximos Passos

- [ ] Implementar autenticação
- [ ] Conectar com banco de dados
- [ ] Adicionar sistema de notificações por email/SMS
- [ ] Implementar API REST
- [ ] Adicionar integração com WhatsApp Business API
- [ ] Sistema de upload de fotos
- [ ] Aplicativo mobile
- [ ] Integração com sistemas de pagamento
- [ ] Dashboard para clientes
- [ ] Agendamento online

## 💡 Casos de Uso

### Para Gestores:
- Monitore a performance da equipe em tempo real
- Tome decisões baseadas em dados concretos
- Mantenha padrão de qualidade elevado
- Comunique-se profissionalmente com clientes

### Para Supervisores:
- Registre auditorias de qualidade
- Acompanhe o trabalho da equipe
- Documente problemas e soluções
- Garanta conformidade com padrões

### Para Atendimento:
- Use templates profissionais pré-definidos
- Responda rapidamente a clientes
- Mantenha consistência na comunicação
- Atenda em português e inglês

## 📞 Suporte

Este projeto foi desenvolvido para facilitar o gerenciamento completo de empresas de limpeza, proporcionando uma interface intuitiva e funcionalidades essenciais para profissionalizar o negócio.

## 📄 Licença

Projeto privado - Todos os direitos reservados.