'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Building, 
  MapPin, 
  Home,
  User,
  Tag,
  AlertCircle 
} from 'lucide-react';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import { 
  createProperty, 
  updateProperty, 
  getProperty,
  type CreatePropertyData,
  type UpdatePropertyData,
  type Property 
} from '@/services/properties';

// Form validation schema
const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO'], {
    required_error: 'Property type is required',
  }),
  platform: z.string().optional(),
  platformId: z.string().optional(),
  ownerId: z.string().optional(),
  active: z.boolean().default(true),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function PropertyManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');
  const isEditing = Boolean(propertyId);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      address: '',
      type: 'APARTMENT',
      platform: '',
      platformId: '',
      ownerId: '',
      active: true,
    },
  });

  // Load property data for editing
  useEffect(() => {
    if (isEditing && propertyId) {
      loadProperty(propertyId);
    }
  }, [propertyId, isEditing]);

  const loadProperty = async (id: string) => {
    try {
      setIsLoadingProperty(true);
      const response = await getProperty(id);
      const property = response.data;
      
      // Reset form with property data
      reset({
        name: property.name,
        address: property.address,
        type: property.type,
        platform: property.platform || '',
        platformId: property.platformId || '',
        ownerId: property.ownerId || '',
        active: property.active,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load property');
      router.push('/properties');
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      setIsLoading(true);

      if (isEditing && propertyId) {
        // Update existing property
        const updateData: UpdatePropertyData = {
          name: data.name,
          address: data.address,
          type: data.type,
          platform: data.platform || undefined,
          platformId: data.platformId || undefined,
          ownerId: data.ownerId || undefined,
          active: data.active,
        };
        await updateProperty(propertyId, updateData);
      } else {
        // Create new property
        const createData: CreatePropertyData = {
          name: data.name,
          address: data.address,
          type: data.type,
          platform: data.platform || undefined,
          platformId: data.platformId || undefined,
          ownerId: data.ownerId || undefined,
          active: data.active,
        };
        await createProperty(createData);
      }

      router.push('/properties');
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} property`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedComponent allowedRoles={['OWNER', 'MANAGER']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
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
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing 
                ? 'Update property information and settings'
                : 'Create a new property for cleaning management'
              }
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Property Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="h-4 w-4 mr-2" />
                  Property Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter property name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter full address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Property Type */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Home className="h-4 w-4 mr-2" />
                  Property Type
                </label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="STUDIO">Studio</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Platform Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 mr-2" />
                    Platform
                  </label>
                  <input
                    type="text"
                    {...register('platform')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Airbnb, Booking.com"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 mr-2" />
                    Platform ID
                  </label>
                  <input
                    type="text"
                    {...register('platformId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Platform listing ID"
                  />
                </div>
              </div>

              {/* Owner ID */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 mr-2" />
                  Owner ID (Optional)
                </label>
                <input
                  type="text"
                  {...register('ownerId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Leave empty to assign to current user"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('active')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Property is active
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting || isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isEditing ? 'Update Property' : 'Create Property'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </ProtectedComponent>
  );
}