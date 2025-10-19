'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
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

export default function PropertiesPage() {
  const router = useRouter();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, typeFilter, statusFilter]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const response = await getProperties();
      setProperties(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.platformId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    // Status filter
    if (statusFilter) {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(property => property.active === isActive);
    }

    setFilteredProperties(filtered);
  };

  const handleCreateProperty = () => {
    router.push('/properties/manage');
  };

  const handleEditProperty = (propertyId: string) => {
    router.push(`/properties/manage?id=${propertyId}`);
  };

  const handleViewProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const handleCreateTask = (propertyId: string) => {
    router.push(`/tasks/new?propertyId=${propertyId}`);
  };

  const handleDeleteProperty = async (propertyId: string, propertyName: string) => {
    if (!confirm(`Are you sure you want to delete "${propertyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProperty(propertyId);
      await loadProperties(); // Reload the list
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete property');
    }
  };

  const handleToggleStatus = async (propertyId: string) => {
    try {
      await togglePropertyStatus(propertyId);
      await loadProperties(); // Reload the list
    } catch (error: any) {
      toast.error(error.message || 'Failed to update property status');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedComponent allowedRoles={['OWNER', 'MANAGER', 'SUPERVISOR']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Building className="h-8 w-8 mr-3 text-blue-600" />
                  Properties
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your properties and cleaning assignments
                </p>
              </div>
              <ProtectedComponent allowedRoles={['OWNER', 'MANAGER']}>
                <button
                  onClick={handleCreateProperty}
                  className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Property
                </button>
              </ProtectedComponent>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="HOUSE">House</option>
                      <option value="STUDIO">Studio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {properties.length === 0 ? 'No properties found' : 'No properties match your search'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {properties.length === 0 
                    ? 'Get started by adding your first property.'
                    : 'Try adjusting your search terms or filters.'
                  }
                </p>
                {properties.length === 0 && (
                  <ProtectedComponent allowedRoles={['OWNER', 'MANAGER']}>
                    <button
                      onClick={handleCreateProperty}
                      className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Property
                    </button>
                  </ProtectedComponent>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {property.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.address}
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPropertyStatusBadgeColor(property.active)}`}>
                          {getPropertyStatusLabel(property.active)}
                        </span>
                      </div>

                      {/* Property Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Home className="h-4 w-4 mr-2" />
                          {getPropertyTypeLabel(property.type)}
                        </div>
                        {property.platform && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Tag className="h-4 w-4 mr-2" />
                            {property.platform}
                            {property.platformId && ` - ${property.platformId}`}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleCreateTask(property.id)}
                          className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Create Task
                        </button>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleViewProperty(property.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <ProtectedComponent allowedRoles={['OWNER', 'MANAGER']}>
                            <button
                              onClick={() => handleEditProperty(property.id)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit Property"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property.id, property.name)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete Property"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </ProtectedComponent>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Summary */}
          {filteredProperties.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {filteredProperties.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredProperties.length === 1 ? 'Property' : 'Properties'} Found
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {filteredProperties.filter(p => p.active).length}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-400">
                    {filteredProperties.filter(p => !p.active).length}
                  </div>
                  <div className="text-sm text-gray-600">Inactive</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedComponent>
  );
}