'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Building2, 
  Plus, 
  Search, 
  Calendar,
  Edit2, 
  Trash2, 
  MapPin,
  Home,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { ProtectedComponent } from '@/components/ProtectedComponent';

// Property interface
interface Property {
  id: string;
  name: string;
  address: string;
  type: 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'COMMERCIAL';
  size?: string;
  clientName?: string;
  contactEmail?: string;
  cleaningFrequency?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PropertiesPage() {
  const router = useRouter();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/properties');
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data.data || []);
      } else {
        toast.error('Erro ao carregar propriedades');
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Erro ao carregar propriedades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta propriedade?')) return;
    
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Propriedade excluída com sucesso');
        loadProperties();
      } else {
        toast.error('Erro ao excluir propriedade');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Erro ao excluir propriedade');
    }
  };

  const handleAddProperty = () => {
    router.push('/properties/new');
  };

  const handleCreateTask = (propertyId?: string) => {
    if (propertyId) {
      router.push(`/tasks/new?propertyId=${propertyId}`);
    } else {
      router.push('/tasks/new');
    }
  };

  const handleEditProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}/edit`);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'APARTMENT': 'Apartamento',
      'HOUSE': 'Casa',
      'STUDIO': 'Studio',
      'COMMERCIAL': 'Comercial'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HOUSE': return <Home className="h-4 w-4" />;
      case 'APARTMENT': return <Building2 className="h-4 w-4" />;
      case 'STUDIO': return <Home className="h-4 w-4" />;
      case 'COMMERCIAL': return <Building2 className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (property.clientName && property.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ProtectedComponent requiredRoles={['ADMIN', 'MANAGER']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 mr-3 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Propriedades</h1>
                    <p className="text-gray-600">Gerencie todas as propriedades cadastradas</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleCreateTask()}
                    variant="secondary"
                    leftIcon={<Sparkles className="h-4 w-4" />}
                  >
                    Create Cleaning Task
                  </Button>
                  
                  <Button
                    onClick={handleAddProperty}
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add Property
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar propriedades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border p-8 text-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando propriedades...</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && properties.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border p-12 text-center"
            >
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma propriedade cadastrada
              </h3>
              <p className="text-gray-600 mb-6">
                No properties found. Comece adicionando sua primeira propriedade.
              </p>
              <button
                onClick={handleAddProperty}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-3 flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus className="h-5 w-5" />
                Adicionar Primeira Propriedade
              </button>
            </motion.div>
          )}

          {/* Properties Grid */}
          {!isLoading && filteredProperties.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        {getTypeIcon(property.type)}
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {property.name}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {property.address}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {property.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        {getTypeLabel(property.type)}
                      </div>
                      
                      {property.clientName && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Cliente:</span>
                          <span className="ml-2">{property.clientName}</span>
                        </div>
                      )}
                      
                      {property.cleaningFrequency && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {property.cleaningFrequency}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCreateTask(property.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md px-3 py-2 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Sparkles className="h-3 w-3" />
                        Criar Tarefa
                      </button>
                      
                      <button
                        onClick={() => handleEditProperty(property.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white rounded-md px-3 py-2 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-2 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Search Results */}
          {!isLoading && properties.length > 0 && filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border p-8 text-center"
            >
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma propriedade encontrada
              </h3>
              <p className="text-gray-600">
                Tente ajustar os termos de busca ou adicione uma nova propriedade.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedComponent>
  );
}