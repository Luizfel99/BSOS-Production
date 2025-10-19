/**
 * 📚 TREINAMENTO INTEGRADO - Bright & Shine
 * Sistema completo de treinamento com vídeos, manuais e testes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Video, FileText, Award, Clock, Users, Play, Download, Upload, CheckCircle2, AlertTriangle, Star, BarChart3, Target, Calendar, Search, Filter, Plus, Edit3, Trash2, Eye, Lock, Unlock } from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'fundamentals' | 'techniques' | 'safety' | 'products' | 'customer_service' | 'equipment';
  
  // Conteúdo
  content: {
    videos: Array<{
      id: string;
      title: string;
      url: string;
      duration: number; // em segundos
      thumbnail: string;
      description: string;
    }>;
    
    documents: Array<{
      id: string;
      title: string;
      type: 'pdf' | 'doc' | 'image';
      url: string;
      size: number;
      description: string;
    }>;
    
    quizzes: Array<{
      id: string;
      title: string;
      questions: number;
      timeLimit: number; // em minutos
      passingScore: number; // percentual
    }>;
  };
  
  // Configurações
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // em minutos
  prerequisites: string[];
  isRequired: boolean;
  isActive: boolean;
  
  // Estatísticas
  enrolledCount: number;
  completedCount: number;
  averageScore: number;
  averageRating: number;
  
  // Datas
  createdAt: string;
  updatedAt: string;
  
  // Certificação
  certificationRequired: boolean;
  certificationValidDays: number;
}

interface UserProgress {
  userId: string;
  userName: string;
  userPhoto: string;
  userRole: string;
  
  moduleId: string;
  
  // Progresso
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  progressPercentage: number;
  
  // Videos assistidos
  videosWatched: Array<{
    videoId: string;
    watchedDuration: number;
    completed: boolean;
    lastWatched: string;
  }>;
  
  // Documentos visualizados
  documentsViewed: Array<{
    documentId: string;
    viewedAt: string;
    timeSpent: number;
  }>;
  
  // Testes realizados
  quizResults: Array<{
    quizId: string;
    attempts: Array<{
      attemptDate: string;
      score: number;
      timeSpent: number;
      passed: boolean;
      answers: Array<{
        questionId: string;
        answer: string;
        correct: boolean;
      }>;
    }>;
    bestScore: number;
    lastAttempt: string;
  }>;
  
  // Datas importantes
  startedAt?: string;
  completedAt?: string;
  lastActivity: string;
  
  // Certificação
  certificationEarned: boolean;
  certificationDate?: string;
  certificationExpiryDate?: string;
  
  // Feedback
  rating?: number;
  feedback?: string;
}

interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  
  questions: Array<{
    id: string;
    type: 'multiple_choice' | 'true_false' | 'text' | 'image_selection';
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation: string;
    points: number;
    image?: string;
  }>;
  
  settings: {
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    randomizeQuestions: boolean;
    showResultsImmediately: boolean;
  };
  
  isActive: boolean;
}

export default function TreinamentoIntegrado() {
  const { user } = useAuth();
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [userProgresses, setUserProgresses] = useState<UserProgress[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  
  const [activeTab, setActiveTab] = useState<'modules' | 'progress' | 'quizzes' | 'analytics' | 'library'>('modules');
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  // Early return if no user is authenticated
  if (!user) {
    return null;
  }
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      setLoading(true);
      const [modulesRes, progressRes, quizzesRes] = await Promise.all([
        fetch('/api/training/modules'),
        fetch('/api/training/progress'),
        fetch('/api/training/quizzes')
      ]);
      
      const [modulesData, progressData, quizzesData] = await Promise.all([
        modulesRes.json(),
        progressRes.json(),
        quizzesRes.json()
      ]);
      
      setTrainingModules(modulesData.modules);
      setUserProgresses(progressData.progresses);
      setQuizzes(quizzesData.quizzes);
    } catch (error) {
      console.error('Erro ao buscar dados de treinamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrollInModule = async (moduleId: string) => {
    try {
      await fetch(`/api/training/modules/${moduleId}/enroll`, {
        method: 'POST'
      });
      fetchTrainingData();
    } catch (error) {
      console.error('Erro ao se inscrever no módulo:', error);
    }
  };

  const markVideoAsWatched = async (moduleId: string, videoId: string) => {
    try {
      await fetch(`/api/training/progress/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, videoId })
      });
      fetchTrainingData();
    } catch (error) {
      console.error('Erro ao marcar vídeo como assistido:', error);
    }
  };

  const submitQuiz = async (quizId: string, answers: any[]) => {
    try {
      await fetch(`/api/training/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      fetchTrainingData();
    } catch (error) {
      console.error('Erro ao enviar teste:', error);
    }
  };

  const handleDownloadCertificate = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/training/certificates/${moduleId}`, {
        method: 'GET'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificado-${moduleId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Erro ao baixar certificado');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao baixar certificado. Tente novamente.');
    }
  };

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadDocument = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao baixar documento. Tente novamente.');
    }
  };

  const handleStartQuiz = (quizId: string) => {
    console.log('🎯 Iniciando quiz ID:', quizId);
    setShowQuizModal(true);
    // Additional quiz initialization logic here
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      fundamentals: 'F',
      techniques: 'T',
      safety: 'S',
      products: 'P',
      customer_service: 'CS',
      equipment: 'E'
    };
    return icons[category as keyof typeof icons] || 'G';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredModules = trainingModules.filter(module => {
    if (selectedCategory !== 'all' && module.category !== selectedCategory) return false;
    if (searchQuery && !module.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !module.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getUserProgress = (moduleId: string) => {
    return userProgresses.find(p => p.moduleId === moduleId && p.userId === user?.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Treinamento Integrado</h1>
          <p className="text-gray-600">Centro de treinamento Bright & Shine</p>
        </div>
        
        <div className="flex gap-3">
          {(user?.role === 'owner' || user?.role === 'supervisor') && (
            <>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Novo Módulo
              </button>
              <button
                onClick={() => setShowQuizModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Novo Teste
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[
          { id: 'modules', label: 'Módulos', icon: BookOpen },
          { id: 'progress', label: 'Meu Progresso', icon: BarChart3 },
          { id: 'quizzes', label: 'Testes', icon: Target },
          { id: 'analytics', label: 'Analytics', icon: Award },
          { id: 'library', label: 'Biblioteca', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{trainingModules.length}</div>
          <div className="text-blue-100">Módulos Disponíveis</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">
            {userProgresses.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-green-100">Módulos Concluídos</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">
            {userProgresses.filter(p => p.certificationEarned).length}
          </div>
          <div className="text-purple-100">Certificações</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">
            {userProgresses.filter(p => p.status === 'in_progress').length}
          </div>
          <div className="text-orange-100">Em Progresso</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar módulos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">Todas as Categorias</option>
            <option value="fundamentals">Fundamentos</option>
            <option value="techniques">Técnicas</option>
            <option value="safety">Segurança</option>
            <option value="products">Produtos</option>
            <option value="customer_service">Atendimento</option>
            <option value="equipment">Equipamentos</option>
          </select>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => {
            const userProgress = getUserProgress(module.id);
            const totalContent = module.content.videos.length + module.content.documents.length + module.content.quizzes.length;
            
            return (
              <div key={module.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Header do módulo */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(module.category)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                    </div>
                    {module.isRequired && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Obrigatório
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>
                  
                  {/* Estatísticas do módulo */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{module.content.videos.length}</div>
                      <div className="text-xs text-gray-500">Vídeos</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{module.content.documents.length}</div>
                      <div className="text-xs text-gray-500">Docs</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{module.content.quizzes.length}</div>
                      <div className="text-xs text-gray-500">Testes</div>
                    </div>
                  </div>
                  
                  {/* Progresso do usuário */}
                  {userProgress ? (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{userProgress.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            userProgress.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${userProgress.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className={`text-xs mt-1 ${getStatusColor(userProgress.status)} px-2 py-1 rounded-full inline-block`}>
                        {userProgress.status}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        Não iniciado
                      </span>
                    </div>
                  )}
                  
                  {/* Informações adicionais */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {module.estimatedDuration}min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {module.enrolledCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      {module.averageRating.toFixed(1)}
                    </span>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex gap-2">
                    {userProgress ? (
                      <button
                        onClick={() => setSelectedModule(module)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Continuar
                      </button>
                    ) : (
                      <button
                        onClick={() => enrollInModule(module.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Começar
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Progresso Geral</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {userProgresses.length > 0 
                  ? Math.round(userProgresses.reduce((acc, p) => acc + p.progressPercentage, 0) / userProgresses.length)
                  : 0
                }%
              </div>
              <p className="text-sm text-gray-600">Média de todos os módulos</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Certificações</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {userProgresses.filter(p => p.certificationEarned).length}
              </div>
              <p className="text-sm text-gray-600">Certificados obtidos</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Tempo de Estudo</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
              <p className="text-sm text-gray-600">Este mês</p>
            </div>
          </div>

          {/* Lista de progresso */}
          <div className="space-y-4">
            {userProgresses.map(progress => {
              const module = trainingModules.find(m => m.id === progress.moduleId);
              if (!module) return null;
              
              return (
                <div key={progress.moduleId} className="bg-white border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getCategoryIcon(module.category)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        <p className="text-gray-600">{module.category}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${getStatusColor(progress.status)}`}>
                        {progress.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                        {progress.status === 'in_progress' && <Clock className="h-4 w-4" />}
                        {progress.status === 'expired' && <AlertTriangle className="h-4 w-4" />}
                        {progress.status}
                      </div>
                      {progress.certificationEarned && (
                        <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          Certificado
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progresso detalhado */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Vídeos Assistidos</div>
                      <div className="font-medium">
                        {progress.videosWatched.filter(v => v.completed).length} / {module.content.videos.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Documentos Lidos</div>
                      <div className="font-medium">
                        {progress.documentsViewed.length} / {module.content.documents.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Testes Aprovados</div>
                      <div className="font-medium">
                        {progress.quizResults.filter(q => q.bestScore >= 70).length} / {module.content.quizzes.length}
                      </div>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso Geral</span>
                      <span>{progress.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          progress.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Continuar Estudos
                    </button>
                    {progress.certificationEarned && (
                      <button 
                        onClick={() => handleDownloadCertificate(progress.moduleId)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 inline mr-2" />
                        Baixar Certificado
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de detalhes do módulo */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedModule.title}</h2>
                  <p className="opacity-90">{selectedModule.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {selectedModule.category}
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {selectedModule.difficulty}
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {selectedModule.estimatedDuration} min
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              {/* Vídeos */}
              {selectedModule.content.videos.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Vídeos ({selectedModule.content.videos.length})
                  </h3>
                  <div className="grid gap-3">
                    {selectedModule.content.videos.map(video => (
                      <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={video.thumbnail || '/placeholder-video.jpg'}
                              alt={video.title}
                              className="w-24 h-16 object-cover rounded"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{video.title}</h4>
                            <p className="text-sm text-gray-600">{video.description}</p>
                            <span className="text-xs text-gray-500">
                              Duração: {formatDuration(video.duration)}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedVideo(video);
                              setShowVideoPlayer(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Assistir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentos */}
              {selectedModule.content.documents.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentos ({selectedModule.content.documents.length})
                  </h3>
                  <div className="grid gap-3">
                    {selectedModule.content.documents.map(document => (
                      <div key={document.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{document.title}</h4>
                            <p className="text-sm text-gray-600">{document.description}</p>
                            <span className="text-xs text-gray-500">
                              {document.type.toUpperCase()} • {(document.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewDocument(document.url)}
                              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4 inline mr-2" />
                              Visualizar
                            </button>
                            <button 
                              onClick={() => handleDownloadDocument(document.url, document.title)}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                              <Download className="h-4 w-4 inline mr-2" />
                              Baixar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testes */}
              {selectedModule.content.quizzes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Testes ({selectedModule.content.quizzes.length})
                  </h3>
                  <div className="grid gap-3">
                    {selectedModule.content.quizzes.map(quiz => (
                      <div key={quiz.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{quiz.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span>{quiz.questions} questões</span>
                              <span>{quiz.timeLimit} minutos</span>
                              <span>Nota mínima: {quiz.passingScore}%</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleStartQuiz(quiz.id)}
                            className="bg-purple-600 text-white px-6 py-4 sm:px-4 sm:py-2 rounded hover:bg-purple-700 touch-target"
                          >
                            Fazer Teste
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {filteredModules.length === 0 && activeTab === 'modules' && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum módulo encontrado</h3>
          <p className="text-gray-600">Ajuste os filtros ou aguarde novos conteúdos</p>
        </div>
      )}
    </div>
  );
}