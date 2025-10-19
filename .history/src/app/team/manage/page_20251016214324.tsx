'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, X } from 'lucide-react';
import { RouteGuard } from '@/components/RouteGuard';
import { MobileNavigation } from '@/components/MobileNavigation';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

const teamMemberSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CLEANER', 'CLIENT'], {
    required_error: 'Selecione uma função'
  }),
  active: z.boolean().default(true)
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

export default function TeamManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get('id');
  const isEditing = !!memberId;

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'CLEANER',
      active: true
    }
  });

  // Load member data if editing
  useEffect(() => {
    if (isEditing && memberId) {
      loadMemberData(memberId);
    }
  }, [isEditing, memberId]);

  const loadMemberData = async (id: string) => {
    try {
      setLoading(true);
      
      // Mock data for demo
      const mockMember = {
        id: '1',
        name: 'Ana Silva',
        email: 'ana@empresa.com',
        phone: '(11) 99999-9999',
        role: 'MANAGER' as const,
        active: true
      };

      if (id === '1') {
        setValue('name', mockMember.name);
        setValue('email', mockMember.email);
        setValue('phone', mockMember.phone);
        setValue('role', mockMember.role);
        setValue('active', mockMember.active);
      }
    } catch (error) {
      console.error('Error loading member:', error);
      alert('Erro ao carregar dados do membro');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TeamMemberFormData) => {
    try {
      setSubmitLoading(true);
      
      console.log('Form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(isEditing ? 'Membro atualizado com sucesso!' : 'Membro criado com sucesso!');
      router.push('/team');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Erro ao salvar dados');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/team');
  };

  return (
    <RouteGuard>
      <MobileNavigation activeItem="team">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Editar Membro' : 'Adicionar Membro'}
                  </h1>
                  <p className="text-gray-600">
                    {isEditing ? 'Atualize as informações do membro' : 'Adicione um novo membro à equipe'}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando dados...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Digite o nome completo"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Digite o email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                        Função *
                      </label>
                      <select
                        id="role"
                        {...register('role')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="CLEANER">Faxineiro(a)</option>
                        <option value="MANAGER">Gerente</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="CLIENT">Cliente</option>
                      </select>
                      {errors.role && (
                        <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                      )}
                    </div>

                    {/* Active Status */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('active')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Membro ativo</span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={submitLoading}
                        variant="primary"
                        size="md"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        {submitLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {submitLoading 
                          ? 'Salvando...' 
                          : isEditing ? 'Atualizar' : 'Salvar'
                        }
                      </Button>
                      
                      <Button
                        type="button"
                        onClick={handleCancel}
                        variant="secondary"
                        size="md"
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Informações importantes:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• O email deve ser único para cada membro</li>
                  <li>• Membros inativos não aparecerão nas atribuições de tarefas</li>
                  <li>• A função determina as permissões no sistema</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </MobileNavigation>
    </RouteGuard>
  );
}