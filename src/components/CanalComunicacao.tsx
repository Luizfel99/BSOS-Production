/**
 * 💬 CANAL INTERNO DE COMUNICAÇÃO - Bright & Shine
 * Sistema centralizado de comunicação sem dependência do WhatsApp
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Send, MessageSquare, Bell, Users, Pin, Search, Filter, Smile, Paperclip, Image, Video, Calendar, Star, AlertTriangle, CheckCircle2, Clock, Edit3, Trash2, Reply, Heart, ThumbsUp } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  senderRole: 'admin' | 'supervisor' | 'leader' | 'cleaner';
  
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'announcement' | 'poll' | 'reminder';
  
  channelId: string;
  channelName: string;
  
  timestamp: string;
  edited: boolean;
  editedAt?: string;
  
  // Reações e interações
  reactions: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  
  replies: number;
  parentId?: string;
  
  // Anexos
  attachments?: Array<{
    type: 'image' | 'video' | 'file';
    url: string;
    name: string;
    size: number;
  }>;
  
  // Marcações especiais
  isPinned: boolean;
  isImportant: boolean;
  isRead: boolean;
  
  // Menções
  mentions: string[];
  mentionsEveryone: boolean;
  
  // Status para anúncios
  readBy?: Array<{
    userId: string;
    userName: string;
    readAt: string;
  }>;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'announcements' | 'team' | 'training' | 'support';
  icon: string;
  
  members: Array<{
    id: string;
    name: string;
    role: string;
    photo: string;
    status: 'online' | 'offline' | 'away';
    lastSeen: string;
  }>;
  
  permissions: {
    canPost: string[];
    canPin: string[];
    canDelete: string[];
    canModerate: string[];
  };
  
  unreadCount: number;
  lastMessage?: Message;
  
  isPrivate: boolean;
  isArchived: boolean;
}

interface Notification {
  id: string;
  type: 'mention' | 'reply' | 'announcement' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function CanalComunicacao() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChannelSettings, setShowChannelSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Early return if no user is authenticated
  if (!user) {
    return null;
  }
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchChannels();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages(activeChannel.id);
    }
  }, [activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/communication/channels');
      const data = await response.json();
      setChannels(data.channels);
      
      // Seleciona o canal geral por padrão
      const generalChannel = data.channels.find((c: Channel) => c.type === 'general');
      if (generalChannel) {
        setActiveChannel(generalChannel);
      }
    } catch (error) {
      console.error('Erro ao buscar canais:', error);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const response = await fetch(`/api/communication/messages?channelId=${channelId}`);
      const data = await response.json();
      setMessages(data.messages);
      
      // Marca mensagens como lidas
      markChannelAsRead(channelId);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/communication/notifications');
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel) return;

    try {
      const messageData = {
        content: newMessage,
        channelId: activeChannel.id,
        type: 'text',
        parentId: replyingTo?.id
      };

      await fetch('/api/communication/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      setNewMessage('');
      setReplyingTo(null);
      fetchMessages(activeChannel.id);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const markChannelAsRead = async (channelId: string) => {
    try {
      await fetch(`/api/communication/channels/${channelId}/read`, {
        method: 'POST'
      });
      
      // Atualiza o contador local
      setChannels(prev => 
        prev.map(channel => 
          channel.id === channelId 
            ? { ...channel, unreadCount: 0 }
            : channel
        )
      );
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await fetch(`/api/communication/messages/${messageId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji })
      });
      
      fetchMessages(activeChannel!.id);
    } catch (error) {
      console.error('Erro ao adicionar reação:', error);
    }
  };

  const pinMessage = async (messageId: string) => {
    try {
      await fetch(`/api/communication/messages/${messageId}/pin`, {
        method: 'POST'
      });
      
      fetchMessages(activeChannel!.id);
    } catch (error) {
      console.error('Erro ao fixar mensagem:', error);
    }
  };

  const handleSearchChannel = () => {
    console.log('🔍 Iniciando busca no canal');
    alert('Abrindo busca no canal...');
  };

  const handleDeleteMessage = (messageId: string) => {
    console.log('🗑️ Excluindo mensagem ID:', messageId);
    alert(`Excluindo mensagem ID: ${messageId}`);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChannelIcon = (type: string) => {
    const icons = {
      general: '',
      announcements: '',
      team: '',
      training: '',
      support: ''
    };
    return icons[type as keyof typeof icons] || '';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'text-red-600',
      supervisor: 'text-blue-600',
      leader: 'text-purple-600',
      cleaner: 'text-green-600'
    };
    return colors[role as keyof typeof colors] || 'text-gray-600';
  };

  const getMessageTypeIcon = (type: string) => {
    const icons = {
      announcement: <Bell className="h-4 w-4 text-orange-500" />,
      reminder: <Clock className="h-4 w-4 text-blue-500" />,
      poll: <Star className="h-4 w-4 text-purple-500" />
    };
    return icons[type as keyof typeof icons];
  };

  const filteredMessages = messages.filter(message => {
    if (searchQuery && !message.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && message.type !== filterType) {
      return false;
    }
    return true;
  });

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Channel</h1>
          <p className="text-gray-600">Comunicação centralizada da equipe</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Bell className="h-4 w-4 inline mr-2" />
            Notificações
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Canais */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar canais..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Canais */}
            <div className="p-2">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeChannel?.id === channel.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{getChannelIcon(channel.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{channel.name}</span>
                      {channel.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    {channel.lastMessage && (
                      <p className="text-xs text-gray-600 truncate">
                        {channel.lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Membros Online */}
          <div className="bg-white rounded-lg shadow-sm border mt-4">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Membros Online</h3>
            </div>
            <div className="p-2">
              {activeChannel?.members
                .filter(member => member.status === 'online')
                .map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2">
                    <div className="relative">
                      <img
                        src={member.photo || '/default-avatar.png'}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className={`text-xs ${getRoleColor(member.role)}`}>
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          {activeChannel ? (
            <div className="bg-white rounded-lg shadow-sm border h-[700px] flex flex-col">
              {/* Channel Header */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <span>{getChannelIcon(activeChannel.type)}</span>
                      {activeChannel.name}
                    </h2>
                    <p className="text-gray-600 text-sm">{activeChannel.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={handleSearchChannel}
                    >
                      <Search className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowChannelSettings(!showChannelSettings)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredMessages.map(message => (
                  <div key={message.id} className="group">
                    {replyingTo?.id === message.id && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-2 mb-2 text-sm">
                        Respondendo a: {message.content.substring(0, 50)}...
                      </div>
                    )}
                    
                    <div className={`flex gap-3 ${message.isPinned ? 'bg-yellow-50 p-3 rounded-lg' : ''}`}>
                      <img
                        src={message.senderPhoto || '/default-avatar.png'}
                        alt={message.senderName}
                        className="w-10 h-10 rounded-full"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{message.senderName}</span>
                          <span className={`text-xs px-2 py-1 rounded ${getRoleColor(message.senderRole)}`}>
                            {message.senderRole}
                          </span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                          {message.isPinned && <Pin className="h-3 w-3 text-yellow-600" />}
                          {getMessageTypeIcon(message.type)}
                        </div>
                        
                        <div className="text-gray-900 mb-2">
                          {message.content}
                          {message.edited && (
                            <span className="text-xs text-gray-500 ml-2">(editado)</span>
                          )}
                        </div>

                        {/* Anexos */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="space-y-2 mb-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="border rounded p-2 bg-gray-50">
                                <div className="flex items-center gap-2">
                                  {attachment.type === 'image' && <Image className="h-4 w-4" />}
                                  {attachment.type === 'video' && <Video className="h-4 w-4" />}
                                  {attachment.type === 'file' && <Paperclip className="h-4 w-4" />}
                                  <span className="text-sm">{attachment.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reações */}
                        {message.reactions.length > 0 && (
                          <div className="flex gap-1 mb-2">
                            {message.reactions.map((reaction, index) => (
                              <button
                                key={index}
                                onClick={() => addReaction(message.id, reaction.emoji)}
                                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-sm"
                              >
                                <span>{reaction.emoji}</span>
                                <span>{reaction.count}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Ações da mensagem */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button
                            onClick={() => addReaction(message.id, '👍')}
                            className="p-1 hover:bg-gray-100 rounded text-gray-500"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setReplyingTo(message)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-500"
                          >
                            <Reply className="h-3 w-3" />
                          </button>
                          {(user?.role === 'owner' || user?.role === 'supervisor') && (
                            <button
                              onClick={() => pinMessage(message.id)}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500"
                            >
                              <Pin className="h-3 w-3" />
                            </button>
                          )}
                          {message.senderId === user?.id && (
                            <>
                              <button
                                onClick={() => setEditingMessage(message)}
                                className="p-1 hover:bg-gray-100 rounded text-gray-500"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button 
                                className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                onClick={() => handleDeleteMessage(message.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Indicador de leitura para anúncios */}
                        {message.type === 'announcement' && message.readBy && (
                          <div className="text-xs text-gray-500 mt-2">
                            Lido por {message.readBy.length} pessoa(s)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply indicator */}
              {replyingTo && (
                <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-blue-600">Respondendo a {replyingTo.senderName}:</span>
                      <p className="text-gray-600 truncate">{replyingTo.content}</p>
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded text-gray-500"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={`Mensagem para #${activeChannel.name}...`}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <button
                    onClick={() => {/* Abrir picker de emoji */}}
                    className="p-2 hover:bg-gray-100 rounded text-gray-500"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border h-[700px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecione um canal</h3>
                <p>Escolha um canal para começar a conversar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Painel de Notificações */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Notificações</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="divide-y">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.priority === 'urgent' ? 'bg-red-500' :
                      notification.priority === 'high' ? 'bg-orange-500' :
                      notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    </div>
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