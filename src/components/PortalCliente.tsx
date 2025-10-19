import React, { useState, useEffect } from 'react';
import { Calendar, MessageCircle, Star, Package, FileText, CreditCard, User, Camera, Clock, CheckCircle, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';

interface Cleaning {
  id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  property: string;
  address: string;
  team: string[];
  type: 'standard' | 'deep' | 'maintenance' | 'checkout';
  estimatedDuration: number;
  actualDuration?: number;
  photos: {
    before: string[];
    after: string[];
    issues?: string[];
  };
  notes?: string;
  rating?: number;
  feedback?: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'linens' | 'amenities' | 'supplies' | 'maintenance';
  currentStock: number;
  requiredStock: number;
  lastRestocked: string;
  autoReorder: boolean;
  unitCost: number;
}

interface ChatMessage {
  id: string;
  sender: 'client' | 'bright-shine' | 'team';
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  attachments?: string[];
}

interface Invoice {
  id: string;
  cleaningId: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  paymentMethod?: string;
  transactionId?: string;
}

export default function PortalCliente() {
  const [activeTab, setActiveTab] = useState<'cleanings' | 'chat' | 'inventory' | 'history' | 'payments'>('cleanings');
  const [cleanings, setCleanings] = useState<Cleaning[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCleaning, setSelectedCleaning] = useState<Cleaning | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const mockCleanings: Cleaning[] = [
      {
        id: 'clean-001',
        date: '2025-10-10',
        time: '09:00',
        status: 'scheduled',
        property: 'Casa da Praia - Ipanema',
        address: 'Rua Visconde de Pirajá, 500',
        team: ['Ana Silva', 'Carlos Santos'],
        type: 'standard',
        estimatedDuration: 180,
        photos: { before: [], after: [] },
        amount: 350,
        paymentStatus: 'pending'
      },
      {
        id: 'clean-002',
        date: '2025-10-08',
        time: '14:00',
        status: 'completed',
        property: 'Apartamento Copacabana',
        address: 'Av. Atlântica, 1200',
        team: ['Maria Costa'],
        type: 'deep',
        estimatedDuration: 240,
        actualDuration: 220,
        photos: {
          before: ['/photos/before1.jpg', '/photos/before2.jpg'],
          after: ['/photos/after1.jpg', '/photos/after2.jpg']
        },
        notes: 'Limpeza profunda realizada. Todos os cômodos higienizados.',
        rating: 5,
        feedback: 'Excelente trabalho! Apartamento ficou impecável.',
        amount: 450,
        paymentStatus: 'paid'
      }
    ];

    const mockInventory: InventoryItem[] = [
      {
        id: 'inv-001',
        name: 'Lençol Casal Branco',
        category: 'linens',
        currentStock: 8,
        requiredStock: 12,
        lastRestocked: '2025-10-01',
        autoReorder: true,
        unitCost: 45
      },
      {
        id: 'inv-002',
        name: 'Toalha de Banho',
        category: 'linens',
        currentStock: 15,
        requiredStock: 20,
        lastRestocked: '2025-09-28',
        autoReorder: true,
        unitCost: 25
      },
      {
        id: 'inv-003',
        name: 'Shampoo Premium 30ml',
        category: 'amenities',
        currentStock: 25,
        requiredStock: 50,
        lastRestocked: '2025-10-05',
        autoReorder: true,
        unitCost: 8
      }
    ];

    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-001',
        sender: 'bright-shine',
        senderName: 'Suporte Bright & Shine',
        message: 'Olá! Sua limpeza para amanhã está confirmada para às 09:00. A equipe chegará pontualmente.',
        timestamp: '2025-10-09T10:30:00Z',
        type: 'text'
      },
      {
        id: 'msg-002',
        sender: 'client',
        senderName: 'Você',
        message: 'Perfeito! Haverá algum produto especial para limpeza do mármore?',
        timestamp: '2025-10-09T11:00:00Z',
        type: 'text'
      }
    ];

    const mockInvoices: Invoice[] = [
      {
        id: 'inv-001',
        cleaningId: 'clean-002',
        date: '2025-10-08',
        dueDate: '2025-10-15',
        amount: 450,
        status: 'paid',
        items: [
          { description: 'Limpeza Profunda - Apartamento 2 quartos', quantity: 1, rate: 450, amount: 450 }
        ],
        paymentMethod: 'Cartão de Crédito',
        transactionId: 'TXN123456789'
      }
    ];

    setCleanings(mockCleanings);
    setInventory(mockInventory);
    setChatMessages(mockMessages);
    setInvoices(mockInvoices);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleScheduleNewCleaning = () => {
    console.log('📅 Agendando nova limpeza');
    alert('Abrindo formulário para agendar nova limpeza...');
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      senderName: 'Você',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      const response: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bright-shine',
        senderName: 'Suporte Bright & Shine',
        message: 'Obrigado pela sua mensagem! Nossa equipe irá responder em breve.',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setChatMessages(prev => [...prev, response]);
    }, 2000);
  };

  const submitRating = async (cleaningId: string) => {
    if (rating === 0) return;

    // Update cleaning with rating and feedback
    setCleanings(prev => 
      prev.map(cleaning => 
        cleaning.id === cleaningId 
          ? { ...cleaning, rating, feedback }
          : cleaning
      )
    );

    setSelectedCleaning(null);
    setRating(0);
    setFeedback('');
  };

  const renderCleanings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Próximas Limpezas</h2>
        <button 
          onClick={handleScheduleNewCleaning}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Agendar Nova Limpeza
        </button>
      </div>

      <div className="grid gap-6">
        {cleanings.map((cleaning) => (
          <div key={cleaning.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{cleaning.property}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{cleaning.address}</span>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${getStatusColor(cleaning.status)}`}>
                  {getStatusIcon(cleaning.status)}
                  {cleaning.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Data e Horário</label>
                  <p className="text-gray-900">{new Date(cleaning.date).toLocaleDateString('pt-BR')} às {cleaning.time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Equipe</label>
                  <p className="text-gray-900">{cleaning.team.join(', ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Valor</label>
                  <p className="text-gray-900 font-semibold">R$ {cleaning.amount.toFixed(2)}</p>
                </div>
              </div>

              {cleaning.status === 'completed' && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Fotos da Limpeza</h4>
                    {!cleaning.rating && (
                      <button
                        onClick={() => setSelectedCleaning(cleaning)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Avaliar Limpeza
                      </button>
                    )}
                  </div>
                  
                  {cleaning.photos.before.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="col-span-2">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Antes</h5>
                        <div className="flex gap-2">
                          {cleaning.photos.before.map((photo, index) => (
                            <div key={index} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Camera className="h-6 w-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Depois</h5>
                        <div className="flex gap-2">
                          {cleaning.photos.after.map((photo, index) => (
                            <div key={index} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Camera className="h-6 w-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {cleaning.rating && (
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">Sua Avaliação:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= cleaning.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {cleaning.feedback && (
                        <p className="text-sm text-gray-600">{cleaning.feedback}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Chat com Bright & Shine</h2>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'client'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'client' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventário de Itens</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Solicitar Reposição
        </button>
      </div>

      <div className="grid gap-4">
        {inventory.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mt-1">
                  {item.category}
                </span>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {item.currentStock}/{item.requiredStock}
                </div>
                <div className={`text-sm ${
                  item.currentStock < item.requiredStock ? 'text-red-600' : 'text-green-600'
                }`}>
                  {item.currentStock < item.requiredStock ? 'Reposição Necessária' : 'Estoque OK'}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.currentStock < item.requiredStock * 0.5 ? 'bg-red-500' :
                    item.currentStock < item.requiredStock * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(item.currentStock / item.requiredStock) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <label className="text-gray-600">Última Reposição</label>
                <p className="font-medium">{new Date(item.lastRestocked).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <label className="text-gray-600">Custo Unitário</label>
                <p className="font-medium">R$ {item.unitCost.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-gray-600">Reposição Automática</label>
                <p className="font-medium">{item.autoReorder ? 'Ativada' : 'Desativada'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pagamentos e Faturas</h2>
      
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Fatura #{invoice.id}</h3>
                <p className="text-gray-600">Data: {new Date(invoice.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">R$ {invoice.amount.toFixed(2)}</div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status === 'paid' ? 'Pago' : 
                   invoice.status === 'overdue' ? 'Vencido' : 'Pendente'}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.description}</span>
                  <span className="font-medium">R$ {item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {invoice.status === 'paid' && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">
                    Pago via {invoice.paymentMethod} - ID: {invoice.transactionId}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Download PDF
              </button>
              {invoice.status !== 'paid' && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Pagar Agora
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando portal do cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B&S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Portal do Cliente</h1>
                <p className="text-sm text-gray-600">Bright & Shine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Mail className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">João Silva</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'cleanings', label: 'Limpezas', icon: Calendar },
              { id: 'chat', label: 'Chat', icon: MessageCircle },
              { id: 'inventory', label: 'Inventário', icon: Package },
              { id: 'history', label: 'Histórico', icon: FileText },
              { id: 'payments', label: 'Pagamentos', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'cleanings' && renderCleanings()}
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'history' && renderCleanings()}
        {activeTab === 'payments' && renderPayments()}
      </div>

      {/* Rating Modal */}
      {selectedCleaning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Avalie a Limpeza</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Como foi a qualidade da limpeza?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentários (opcional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Deixe seus comentários sobre a limpeza..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedCleaning(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => submitRating(selectedCleaning.id)}
                disabled={rating === 0}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Enviar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}