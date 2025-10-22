'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Building,
  ClipboardList
} from 'lucide-react';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import {
  TeamMember,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getRoleDisplayName,
  getRoleColor,
  getStatusColor,
  getStatusDisplayName
} from '@/services/team';

// Modal Components
function CreateTeamMemberModal({
  isOpen,
  onClose,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Cleaner' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', phone: '', role: 'Cleaner' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Adicionar Funcionário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Função</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cleaner">Faxineiro(a)</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Manager">Gerente</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function EditTeamMemberModal({
  isOpen,
  onClose,
  member,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSubmit: (id: string, data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Cleaner' as const,
    status: 'Active' as const
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email || '',
        phone: member.phone || '',
        role: member.role,
        status: member.status
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      onSubmit(member.id, formData);
      onClose();
    }
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Editar Funcionário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Função</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cleaner">Faxineiro(a)</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Manager">Gerente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Ativo</option>
              <option value="Inactive">Inativo</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async (data: any) => {
    try {
      await createTeamMember(data);
      await loadTeamMembers();
    } catch (error) {
      console.error('Error creating team member:', error);
    }
  };

  const handleEditMember = async (id: string, data: any) => {
    try {
      await updateTeamMember(id, data);
      await loadTeamMembers();
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este funcionário?')) {
      try {
        await deleteTeamMember(id);
        await loadTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const handleToggleStatus = async (member: TeamMember) => {
    try {
      const newStatus = member.status === 'Active' ? 'Inactive' : 'Active';
      await updateTeamMember(member.id, { status: newStatus });
      await loadTeamMembers();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <ProtectedComponent requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR', 'CLEANER']}>
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
                  <Users className="h-8 w-8 mr-3 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Equipe</h1>
                    <p className="text-gray-600">Gerencie todos os membros da equipe</p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="primary"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Adicionar Funcionário
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar funcionários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas as Funções</option>
                  <option value="Cleaner">Faxineiro(a)</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Manager">Gerente</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os Status</option>
                  <option value="Active">Ativo</option>
                  <option value="Inactive">Inativo</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border p-8 text-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando equipe...</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && teamMembers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border p-12 text-center"
            >
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum funcionário encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Comece adicionando o primeiro membro da equipe.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
                size="lg"
                leftIcon={<Plus className="h-5 w-5" />}
              >
                Adicionar Primeiro Funcionário
              </Button>
            </motion.div>
          )}

          {/* Team Members Grid */}
          {!loading && filteredMembers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {member.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {getStatusDisplayName(member.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                          {getRoleDisplayName(member.role)}
                        </span>
                      </div>

                      {member.phone && (
                        <div className="text-sm text-gray-600">
                          📞 {member.phone}
                        </div>
                      )}

                      {member.assignedTasks && member.assignedTasks.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <ClipboardList className="h-4 w-4 inline mr-1" />
                          {member.assignedTasks.length} tarefa(s)
                        </div>
                      )}

                      {member.assignedProperties && member.assignedProperties.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <Building className="h-4 w-4 inline mr-1" />
                          {member.assignedProperties.length} propriedade(s)
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Edit className="h-3 w-3" />}
                          onClick={() => {
                            setEditingMember(member);
                            setShowEditModal(true);
                          }}
                        >
                          Editar
                        </Button>

                        <Button
                          variant={member.status === 'Active' ? 'danger' : 'success'}
                          size="sm"
                          leftIcon={member.status === 'Active' ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                          onClick={() => handleToggleStatus(member)}
                        >
                          {member.status === 'Active' ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>

                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash2 className="h-3 w-3" />}
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Search Results */}
          {!loading && teamMembers.length > 0 && filteredMembers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border p-8 text-center"
            >
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum funcionário encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca.
              </p>
            </motion.div>
          )}
        </div>

        {/* Modals */}
        <CreateTeamMemberModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMember}
        />

        <EditTeamMemberModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          member={editingMember}
          onSubmit={handleEditMember}
        />
      </div>
    </ProtectedComponent>
  );
}