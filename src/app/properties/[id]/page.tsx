'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft,
  Building, 
  MapPin,
  Home,
  Tag,
  User,
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import { 
  getProperty, 
  deleteProperty,
  getPropertyTypeLabel,
  getPropertyStatusLabel,
  getPropertyStatusBadgeColor,
  type Property 
} from '@/services/properties';

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      setIsLoading(true);
      const response = await getProperty(propertyId);
      setProperty(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load property');
      router.push('/properties');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/properties/manage?id=${propertyId}`);
  };

  const handleDelete = async () => {
    if (!property) return;

    if (!confirm(`Are you sure you want to delete "${property.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProperty(propertyId);
      toast.success('Property deleted successfully');
      router.push('/properties');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete property');
    }
  };

  const handleCreateTask = () => {
    router.push(`/tasks/new?propertyId=${propertyId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or was deleted.</p>
          <button
            onClick={() => router.push('/properties')}
            className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedComponent allowedRoles={['OWNER', 'MANAGER', 'SUPERVISOR']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                  <Building className="h-8 w-8 mr-3 text-blue-600" />
                  {property.name}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  {property.address}
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPropertyStatusBadgeColor(property.active)}`}>
                  {property.active ? <CheckCircle className="h-4 w-4 mr-1" /> : <AlertCircle className="h-4 w-4 mr-1" />}
                  {getPropertyStatusLabel(property.active)}
                </span>
              </div>

              <ProtectedComponent allowedRoles={['OWNER', 'MANAGER']}>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Property
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </ProtectedComponent>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <div className="flex items-center text-gray-900">
                      <Home className="h-4 w-4 mr-2 text-gray-400" />
                      {getPropertyTypeLabel(property.type)}
                    </div>
                  </div>

                  {property.platform && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                      <div className="flex items-center text-gray-900">
                        <Tag className="h-4 w-4 mr-2 text-gray-400" />
                        {property.platform}
                      </div>
                    </div>
                  )}

                  {property.platformId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform ID</label>
                      <div className="flex items-center text-gray-900">
                        <Tag className="h-4 w-4 mr-2 text-gray-400" />
                        {property.platformId}
                      </div>
                    </div>
                  )}

                  {property.ownerId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Owner ID</label>
                      <div className="flex items-center text-gray-900">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {property.ownerId}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                    <div className="text-gray-900">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                    <div className="text-gray-900">
                      {new Date(property.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                  <div className="flex items-start text-gray-900">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{property.address}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={handleCreateTask}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Create Cleaning Task
                  </button>

                  <button
                    onClick={() => router.push('/tasks')}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View All Tasks
                  </button>

                  <ProtectedComponent allowedRoles={['OWNER', 'MANAGER']}>
                    <button
                      onClick={() => router.push('/properties')}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Manage Properties
                    </button>
                  </ProtectedComponent>
                </div>
              </div>

              {/* Property Stats */}
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Stats</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Property ID</span>
                    <span className="text-sm font-medium text-gray-900 font-mono">{property.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPropertyStatusBadgeColor(property.active)}`}>
                      {getPropertyStatusLabel(property.active)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium text-gray-900">{getPropertyTypeLabel(property.type)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedComponent>
  );
}