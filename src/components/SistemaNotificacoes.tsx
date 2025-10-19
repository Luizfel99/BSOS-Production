// Sistema de Notificações Automáticas
'use client';

import { useState, useEffect } from 'react';

interface Notificacao {
  id: string;
  tipo: 'email' | 'whatsapp' | 'sms' | 'push';
  destinatario: string;
  categoria: 'checkout' | 'limpeza_agendada' | 'limpeza_concluida' | 'checkin_proximo' | 'avaliacao' | 'promocao';
  titulo: string;
  mensagem: string;
  status: 'pendente' | 'enviado' | 'falhou' | 'agendado';
  agendado_para?: string;
  enviado_em?: string;
  dados_contexto: any;
}

interface ConfigNotificacao {
  categoria: string;
  ativo: boolean;
  tempo_antecedencia: number; // em minutos
  canais: string[];
  template_cleaner: string;
  template_cliente: string;
}

export default function SistemaNotificacoes() {
  const [activeTab, setActiveTab] = useState<'fila' | 'configuracoes' | 'templates' | 'historico'>('fila');
  
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    {
      id: '1',
      tipo: 'whatsapp',
      destinatario: '+5511999998888',
      categoria: 'checkout',
      titulo: 'Checkout Realizado - Limpeza Necessária',
      mensagem: 'Olá Maria! O checkout do Apto Centro foi realizado às 11:00. Sua limpeza está agendada para 12:00. Chaves na portaria com Sr. João.',
      status: 'enviado',
      enviado_em: '2024-10-08T11:05:00',
      dados_contexto: {
        cleaner: 'Maria Silva',
        propriedade: 'Apto Centro - Vista Mar',
        guest: 'John Smith',
        checkout_time: '11:00'
      }
    },
    {
      id: '2',
      tipo: 'email',
      destinatario: 'john.smith@email.com',
      categoria: 'avaliacao',
      titulo: 'Como foi sua estadia? Avalie nosso serviço!',
      mensagem: 'Hi John! We hope you enjoyed your stay at our apartment. Your opinion is very important to us. Please rate our service: [LINK]',
      status: 'agendado',
      agendado_para: '2024-10-10T15:00:00',
      dados_contexto: {
        guest: 'John Smith',
        propriedade: 'Apto Centro - Vista Mar',
        checkout: '2024-10-10'
      }
    },
    {
      id: '3',
      tipo: 'whatsapp',
      destinatario: '+5511888887777',
      categoria: 'limpeza_concluida',
      titulo: 'Limpeza Concluída - Propriedade Pronta',
      mensagem: 'Atenção! A limpeza do Apto Centro foi concluída às 14:30. Propriedade pronta para o próximo hóspede. Check-in às 16:00.',
      status: 'pendente',
      dados_contexto: {
        propriedade: 'Apto Centro - Vista Mar',
        cleaner: 'Maria Silva',
        proximo_checkin: '16:00'
      }
    }
  ]);

  const [configuracoes, setConfiguracoes] = useState<ConfigNotificacao[]>([
    {
      categoria: 'checkout',
      ativo: true,
      tempo_antecedencia: 15,
      canais: ['whatsapp', 'sms'],
      template_cleaner: 'Checkout realizado em {propriedade} às {checkout_time}. Limpeza agendada para {limpeza_time}. Chaves: {chaves_localizacao}',
      template_cliente: 'Thank you for staying at {propriedade}! We hope you enjoyed your time. Check-out confirmed at {checkout_time}.'
    },
    {
      categoria: 'limpeza_agendada',
      ativo: true,
      tempo_antecedencia: 30,
      canais: ['whatsapp', 'push'],
      template_cleaner: 'Limpeza agendada para {propriedade} em {tempo} minutos. Tempo estimado: {duracao}min. Instruções: {instrucoes}',
      template_cliente: 'Your accommodation is being prepared for your arrival. Expected completion: {tempo_conclusao}'
    },
    {
      categoria: 'limpeza_concluida',
      ativo: true,
      tempo_antecedencia: 0,
      canais: ['whatsapp', 'email'],
      template_cleaner: 'Limpeza de {propriedade} concluída! Por favor, confirme o status e anexe fotos.',
      template_cliente: 'Your accommodation at {propriedade} is ready! Check-in available from {checkin_time}.'
    },
    {
      categoria: 'checkin_proximo',
      ativo: true,
      tempo_antecedencia: 60,
      canais: ['whatsapp', 'email'],
      template_cleaner: 'Check-in em {propriedade} em 1 hora. Certifique-se de que está tudo pronto.',
      template_cliente: 'Welcome! Your check-in at {propriedade} is in 1 hour. Address: {endereco}. Keys: {chaves_info}'
    },
    {
      categoria: 'avaliacao',
      ativo: true,
      tempo_antecedencia: 180, // 3 horas após checkout
      canais: ['email', 'whatsapp'],
      template_cleaner: 'Solicitação de avaliação enviada para {guest} sobre {propriedade}.',
      template_cliente: 'How was your stay at {propriedade}? Your feedback helps us improve. Rate us: {avaliacao_link}'
    }
  ]);

  const [novaNotificacao, setNovaNotificacao] = useState({
    destinatario: '',
    categoria: 'checkout',
    titulo: '',
    mensagem: '',
    tipo: 'whatsapp',
    agendado_para: ''
  });

  const criarNotificacao = () => {
    if (novaNotificacao.destinatario && novaNotificacao.mensagem) {
      const nova: Notificacao = {
        id: Date.now().toString(),
        ...novaNotificacao as any,
        status: novaNotificacao.agendado_para ? 'agendado' : 'pendente',
        dados_contexto: {}
      };
      setNotificacoes([nova, ...notificacoes]);
      setNovaNotificacao({
        destinatario: '',
        categoria: 'checkout',
        titulo: '',
        mensagem: '',
        tipo: 'whatsapp',
        agendado_para: ''
      });
    }
  };

  const enviarNotificacao = (id: string) => {
    setNotificacoes(notificacoes.map(n => 
      n.id === id 
        ? { ...n, status: 'enviado', enviado_em: new Date().toISOString() }
        : n
    ));
  };

  const atualizarConfiguracao = (categoria: string, campo: string, valor: any) => {
    setConfiguracoes(configuracoes.map(config => 
      config.categoria === categoria 
        ? { ...config, [campo]: valor }
        : config
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviado': return 'bg-green-100 text-green-700';
      case 'pendente': return 'bg-yellow-100 text-yellow-700';
      case 'agendado': return 'bg-blue-100 text-blue-700';
      case 'falhou': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'whatsapp': return 'WA';
      case 'email': return 'EM';
      case 'sms': return 'SMS';
      case 'push': return 'PUSH';
      default: return 'MSG';
    }
  };

  // Simulação de notificações automáticas
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular trigger de notificações baseadas em eventos
      const agora = new Date();
      
      // Verificar notificações agendadas
      setNotificacoes(prev => prev.map(n => {
        if (n.status === 'agendado' && n.agendado_para) {
          const agendado = new Date(n.agendado_para);
          if (agendado <= agora) {
            return { ...n, status: 'pendente' };
          }
        }
        return n;
      }));
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sistema de Notificações</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('fila')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'fila' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Fila
          </button>
          <button
            onClick={() => setActiveTab('configuracoes')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'configuracoes' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Configurações
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'templates' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'historico' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Histórico
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Pendentes</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {notificacoes.filter(n => n.status === 'pendente').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Agendadas</h3>
          <p className="text-2xl font-bold text-blue-600">
            {notificacoes.filter(n => n.status === 'agendado').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Enviadas Hoje</h3>
          <p className="text-2xl font-bold text-green-600">
            {notificacoes.filter(n => n.status === 'enviado' && n.enviado_em?.startsWith('2024-10-08')).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Taxa de Sucesso</h3>
          <p className="text-2xl font-bold text-green-600">
            {notificacoes.length > 0 
              ? Math.round((notificacoes.filter(n => n.status === 'enviado').length / notificacoes.length) * 100)
              : 0
            }%
          </p>
        </div>
      </div>

      {/* Fila de Notificações */}
      {activeTab === 'fila' && (
        <div className="space-y-6">
          {/* Nova Notificação */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Criar Nova Notificação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinatário</label>
                <input
                  type="text"
                  value={novaNotificacao.destinatario}
                  onChange={(e) => setNovaNotificacao({...novaNotificacao, destinatario: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Telefone ou email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={novaNotificacao.tipo}
                  onChange={(e) => setNovaNotificacao({...novaNotificacao, tipo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={novaNotificacao.categoria}
                  onChange={(e) => setNovaNotificacao({...novaNotificacao, categoria: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="checkout">Checkout</option>
                  <option value="limpeza_agendada">Limpeza Agendada</option>
                  <option value="limpeza_concluida">Limpeza Concluída</option>
                  <option value="checkin_proximo">Check-in Próximo</option>
                  <option value="avaliacao">Avaliação</option>
                  <option value="promocao">Promoção</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agendar Para (Opcional)</label>
                <input
                  type="datetime-local"
                  value={novaNotificacao.agendado_para}
                  onChange={(e) => setNovaNotificacao({...novaNotificacao, agendado_para: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={novaNotificacao.titulo}
                  onChange={(e) => setNovaNotificacao({...novaNotificacao, titulo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Título da notificação"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <textarea
                  value={novaNotificacao.mensagem}
                  onChange={(e) => setNovaNotificacao({...novaNotificacao, mensagem: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Conteúdo da mensagem"
                />
              </div>
            </div>
            
            <button
              onClick={criarNotificacao}
              className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Criar Notificação
            </button>
          </div>

          {/* Lista de Notificações */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fila de Notificações</h3>
              <div className="space-y-4">
                {notificacoes.map((notificacao) => (
                  <div key={notificacao.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{getTipoIcon(notificacao.tipo)}</span>
                          <h4 className="font-semibold text-gray-900">{notificacao.titulo}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(notificacao.status)}`}>
                            {notificacao.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notificacao.destinatario}</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{notificacao.mensagem}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Categoria: {notificacao.categoria}</span>
                          {notificacao.agendado_para && (
                            <span>Agendado: {new Date(notificacao.agendado_para).toLocaleString('pt-BR')}</span>
                          )}
                          {notificacao.enviado_em && (
                            <span>Enviado: {new Date(notificacao.enviado_em).toLocaleString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {notificacao.status === 'pendente' && (
                          <button
                            onClick={() => enviarNotificacao(notificacao.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Enviar Agora
                          </button>
                        )}
                        {notificacao.status === 'falhou' && (
                          <button
                            onClick={() => enviarNotificacao(notificacao.id)}
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                          >
                            Reenviar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configurações */}
      {activeTab === 'configuracoes' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Notificação</h3>
            <div className="space-y-6">
              {configuracoes.map((config, index) => (
                <div key={config.categoria} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {config.categoria.replace('_', ' ')}
                    </h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.ativo}
                        onChange={(e) => atualizarConfiguracao(config.categoria, 'ativo', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Ativo</span>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tempo de Antecedência (minutos)
                      </label>
                      <input
                        type="number"
                        value={config.tempo_antecedencia}
                        onChange={(e) => atualizarConfiguracao(config.categoria, 'tempo_antecedencia', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Canais</label>
                      <div className="flex space-x-4">
                        {['whatsapp', 'email', 'sms', 'push'].map(canal => (
                          <label key={canal} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={config.canais.includes(canal)}
                              onChange={(e) => {
                                const novosCanais = e.target.checked
                                  ? [...config.canais, canal]
                                  : config.canais.filter(c => c !== canal);
                                atualizarConfiguracao(config.categoria, 'canais', novosCanais);
                              }}
                              className="mr-1"
                            />
                            <span className="text-sm">{canal}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Templates */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates de Mensagens</h3>
            <div className="space-y-6">
              {configuracoes.map((config) => (
                <div key={config.categoria} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 capitalize">
                    {config.categoria.replace('_', ' ')}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template para Cleaners
                      </label>
                      <textarea
                        value={config.template_cleaner}
                        onChange={(e) => atualizarConfiguracao(config.categoria, 'template_cleaner', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template para Clientes
                      </label>
                      <textarea
                        value={config.template_cliente}
                        onChange={(e) => atualizarConfiguracao(config.categoria, 'template_cliente', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Histórico */}
      {activeTab === 'historico' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Notificações</h3>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destinatário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensagem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notificacoes.filter(n => n.status === 'enviado').map((notificacao) => (
                    <tr key={notificacao.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notificacao.enviado_em && new Date(notificacao.enviado_em).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getTipoIcon(notificacao.tipo)} {notificacao.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notificacao.destinatario}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notificacao.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(notificacao.status)}`}>
                          {notificacao.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {notificacao.mensagem}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {notificacoes.filter(n => n.status === 'enviado').map((notificacao) => (
                <div key={notificacao.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTipoIcon(notificacao.tipo)}</span>
                      <span className="text-sm font-medium text-gray-900">{notificacao.tipo}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(notificacao.status)}`}>
                      {notificacao.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Para:</span>
                      <span className="ml-2 text-gray-900">{notificacao.destinatario}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Categoria:</span>
                      <span className="ml-2 text-gray-900">{notificacao.categoria}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Data:</span>
                      <span className="ml-2 text-gray-900">
                        {notificacao.enviado_em && new Date(notificacao.enviado_em).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-700">{notificacao.mensagem}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}