/**
 * ✅ CHECKLIST DIGITAL COM FOTOS - Bright & Shine
 * Sistema completo de checklists customizados com validação por fotos
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, X, Upload, Eye, Clock, MapPin, User, AlertCircle, CheckCircle2, Star } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  isRequired: boolean;
  requiresPhoto: boolean;
  requiresNote: boolean;
  completed: boolean;
  photos: Array<{
    id: string;
    url: string;
    type: 'before' | 'after' | 'issue' | 'detail';
    timestamp: string;
    note?: string;
  }>;
  note?: string;
  completedAt?: string;
  completedBy?: string;
  estimatedTime: number; // minutos
  actualTime?: number;
  qualityRating?: number; // 1-5
}

interface ChecklistTemplate {
  id: string;
  name: string;
  type: 'normal' | 'deep' | 'move_out' | 'maintenance' | 'inspection';
  categories: Array<{
    id: string;
    name: string;
    order: number;
    color: string;
    items: ChecklistItem[];
  }>;
  estimatedTotal: number;
  requiresSupervisorApproval: boolean;
}

interface ActiveChecklist {
  id: string;
  appointmentId: string;
  propertyName: string;
  propertyAddress: string;
  template: ChecklistTemplate;
  assignedTo: {
    leaderId: string;
    leaderName: string;
    members: Array<{ id: string; name: string; }>;
  };
  startedAt?: string;
  completedAt?: string;
  totalTimeSpent: number;
  status: 'pending' | 'in_progress' | 'completed' | 'review' | 'approved' | 'rejected';
  supervisorNotes?: string;
  qualityScore?: number;
  clientRating?: number;
  issues: Array<{
    id: string;
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    photos: string[];
    resolvedAt?: string;
  }>;
}

export default function ChecklistDigital() {
  const [activeChecklist, setActiveChecklist] = useState<ActiveChecklist | null>(null);
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState<'before' | 'after' | 'issue'>('before');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTemplates();
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get('appointmentId');
    if (appointmentId) {
      loadChecklist(appointmentId);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/checklists/templates');
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
    }
  };

  const loadChecklist = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/checklists/${appointmentId}`);
      const data = await response.json();
      setActiveChecklist(data.checklist);
      
      if (data.checklist.status === 'in_progress') {
        setIsTimerRunning(true);
        const elapsed = Date.now() - new Date(data.checklist.startedAt).getTime();
        setTimer(Math.floor(elapsed / 1000));
      }
    } catch (error) {
      console.error('Erro ao carregar checklist:', error);
    }
  };

  const startChecklist = async () => {
    if (!activeChecklist) return;
    
    try {
      const response = await fetch(`/api/checklists/${activeChecklist.id}/start`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setIsTimerRunning(true);
        setActiveChecklist(prev => prev ? { 
          ...prev, 
          status: 'in_progress',
          startedAt: new Date().toISOString()
        } : null);
      }
    } catch (error) {
      console.error('Erro ao iniciar checklist:', error);
    }
  };

  const completeItem = async (categoryIndex: number, itemIndex: number, data: Partial<ChecklistItem>) => {
    if (!activeChecklist) return;

    try {
      const response = await fetch(`/api/checklists/${activeChecklist.id}/items/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          completed: true,
          completedAt: new Date().toISOString(),
          actualTime: timer
        })
      });

      if (response.ok) {
        const updatedChecklist = { ...activeChecklist };
        const item = updatedChecklist.template.categories[categoryIndex].items[itemIndex];
        Object.assign(item, data, { 
          completed: true,
          completedAt: new Date().toISOString(),
          actualTime: timer
        });
        
        setActiveChecklist(updatedChecklist);
      }
    } catch (error) {
      console.error('Erro ao completar item:', error);
    }
  };

  const capturePhoto = async (itemId: string, type: 'before' | 'after' | 'issue') => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      // Fallback para upload de arquivo
      fileInputRef.current?.click();
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (blob && selectedItem) {
          await uploadPhoto(selectedItem, blob, captureMode);
        }
      }, 'image/jpeg', 0.8);
    }
    
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
    setSelectedItem(null);
  };

  const handleViewPhoto = (photoId: string) => {
    console.log('👁️ Visualizando foto ID:', photoId);
    alert(`Abrindo visualização da foto ID: ${photoId}`);
  };

  const uploadPhoto = async (itemId: string, file: File | Blob, type: 'before' | 'after' | 'issue') => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('type', type);
    formData.append('itemId', itemId);
    formData.append('checklistId', activeChecklist?.id || '');

    try {
      const response = await fetch('/api/checklists/photos/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // Atualizar checklist com a nova foto
        loadChecklist(activeChecklist?.appointmentId || '');
      }
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    }
  };

  const submitForReview = async () => {
    if (!activeChecklist) return;

    try {
      const response = await fetch(`/api/checklists/${activeChecklist.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalTime: timer,
          completedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setIsTimerRunning(false);
        setActiveChecklist(prev => prev ? { 
          ...prev, 
          status: 'review',
          completedAt: new Date().toISOString(),
          totalTimeSpent: timer
        } : null);
      }
    } catch (error) {
      console.error('Erro ao enviar para revisão:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompletionPercentage = () => {
    if (!activeChecklist) return 0;
    
    const allItems = activeChecklist.template.categories.flatMap(cat => cat.items);
    const completedItems = allItems.filter(item => item.completed);
    return Math.round((completedItems.length / allItems.length) * 100);
  };

  const getCurrentCategory = () => {
    if (!activeChecklist || currentCategory >= activeChecklist.template.categories.length) {
      return null;
    }
    return activeChecklist.template.categories[currentCategory];
  };

  if (!activeChecklist) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum Checklist Ativo</h2>
          <p className="text-gray-600 mb-6">Selecione um agendamento para iniciar o checklist</p>
          <button 
            onClick={() => setShowAppointmentsModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ver Agendamentos
          </button>
        </div>
      </div>
    );
  }

  const category = getCurrentCategory();
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{activeChecklist.propertyName}</h1>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{activeChecklist.propertyAddress}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              activeChecklist.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
              activeChecklist.status === 'completed' ? 'bg-green-100 text-green-800' :
              activeChecklist.status === 'review' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <Clock className="h-4 w-4" />
              {activeChecklist.status === 'in_progress' ? formatTime(timer) : 
               activeChecklist.status === 'pending' ? 'Não iniciado' : 
               'Finalizado'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm text-gray-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Team Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Líder: {activeChecklist.assignedTo.leaderName}</span>
          </div>
          {activeChecklist.assignedTo.members.length > 0 && (
            <div>
              Equipe: {activeChecklist.assignedTo.members.map(m => m.name).join(', ')}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          {activeChecklist.status === 'pending' && (
            <button
              onClick={startChecklist}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Iniciar Checklist
            </button>
          )}
          
          {activeChecklist.status === 'in_progress' && completionPercentage === 100 && (
            <button
              onClick={submitForReview}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Enviar para Revisão
            </button>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      {activeChecklist.status !== 'pending' && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {activeChecklist.template.categories.map((cat, index) => {
              const categoryItems = cat.items;
              const completedInCategory = categoryItems.filter(item => item.completed).length;
              const isActive = index === currentCategory;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setCurrentCategory(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 
                    completedInCategory === categoryItems.length ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{cat.name}</span>
                    <span className="text-xs">
                      {completedInCategory}/{categoryItems.length}
                    </span>
                    {completedInCategory === categoryItems.length && (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Checklist Items */}
      {category && (
        <div className="space-y-4">
          {category.items.map((item, itemIndex) => (
            <div 
              key={item.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
                item.completed ? 'border-l-green-500 bg-green-50' : 
                item.isRequired ? 'border-l-red-400' : 'border-l-blue-400'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{item.task}</h3>
                    {item.isRequired && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Obrigatório
                      </span>
                    )}
                    {item.requiresPhoto && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Foto Obrigatória
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Tempo estimado: {item.estimatedTime} min
                    {item.actualTime && (
                      <span> • Tempo real: {Math.floor(item.actualTime / 60)} min</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.completed ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-6 w-6" />
                      <span className="text-sm">Concluído</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => completeItem(currentCategory, itemIndex, item)}
                      disabled={item.requiresPhoto && item.photos.length === 0}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Marcar como Concluído
                    </button>
                  )}
                </div>
              </div>

              {/* Photos Section */}
              {item.requiresPhoto && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Fotos {item.isRequired && '*'}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item.id);
                          setCaptureMode('before');
                          capturePhoto(item.id, 'before');
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        <Camera className="h-4 w-4" />
                        Antes
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item.id);
                          setCaptureMode('after');
                          capturePhoto(item.id, 'after');
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        <Camera className="h-4 w-4" />
                        Depois
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item.id);
                          setCaptureMode('issue');
                          capturePhoto(item.id, 'issue');
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        <Camera className="h-4 w-4" />
                        Problema
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {item.photos.map(photo => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={`${photo.type} photo`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button 
                            className="text-white"
                            onClick={() => handleViewPhoto(photo.id)}
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                        <div className={`absolute top-1 right-1 px-1 py-0.5 text-xs rounded ${
                          photo.type === 'before' ? 'bg-blue-600 text-white' :
                          photo.type === 'after' ? 'bg-green-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {photo.type}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {item.requiresPhoto && item.photos.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>Fotos obrigatórias não adicionadas</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Section */}
              {(item.requiresNote || item.note) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações {item.requiresNote && '*'}
                  </label>
                  <textarea
                    value={item.note || ''}
                    onChange={(e) => {
                      const updatedItem = { ...item, note: e.target.value };
                      // Atualizar item localmente
                    }}
                    placeholder="Adicione suas observações sobre esta tarefa..."
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Quality Rating */}
              {item.completed && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Qualidade:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-4 w-4 cursor-pointer ${
                          star <= (item.qualityRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        onClick={() => {
                          // Atualizar rating
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    Concluído em {item.completedAt && new Date(item.completedAt).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Camera Modal */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Capturar Foto</h3>
              <button onClick={stopCamera} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                autoPlay
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={takePhoto}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Capturar
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && selectedItem) {
            uploadPhoto(selectedItem, file, captureMode);
          }
        }}
      />

      {/* Modal Ver Agendamentos */}
      {showAppointmentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Agendamentos Disponíveis</h3>
              <button
                onClick={() => setShowAppointmentsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {/* Mock appointments for now */}
              {[
                { id: 1, client: 'Ana Silva', address: 'Rua das Flores, 123', time: '09:00', type: 'Airbnb' },
                { id: 2, client: 'João Santos', address: 'Av. Central, 456', time: '14:00', type: 'Residencial' },
                { id: 3, client: 'Maria Costa', address: 'Rua Nova, 789', time: '16:30', type: 'Comercial' }
              ].map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{appointment.client}</h4>
                      <p className="text-sm text-gray-600">{appointment.address}</p>
                      <p className="text-sm text-gray-600">{appointment.time} - {appointment.type}</p>
                    </div>
                    <button
                      onClick={() => {
                        // Start checklist logic here
                        setShowAppointmentsModal(false);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Iniciar Checklist
                    </button>
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