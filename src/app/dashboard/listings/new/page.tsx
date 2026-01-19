'use client';

/**
 * Zambia Property - Add New Property Page
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useRequireRole } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Button, Input, Select, Textarea } from '@/components/ui';

const propertyTypes = [
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'LAND', label: 'Land / Plot' },
  { value: 'COMMERCIAL', label: 'Commercial Property' },
  { value: 'LODGE', label: 'Lodge / Hotel' },
];

const listingTypes = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
];

const provinces = [
  { value: 'Lusaka', label: 'Lusaka' },
  { value: 'Copperbelt', label: 'Copperbelt' },
  { value: 'Southern', label: 'Southern' },
  { value: 'Eastern', label: 'Eastern' },
  { value: 'Central', label: 'Central' },
  { value: 'Northern', label: 'Northern' },
  { value: 'Luapula', label: 'Luapula' },
  { value: 'North-Western', label: 'North-Western' },
  { value: 'Western', label: 'Western' },
  { value: 'Muchinga', label: 'Muchinga' },
];

const amenitiesList = [
  'Air Conditioning',
  'Parking',
  'Swimming Pool',
  'Garden',
  'Security',
  'Gym',
  'Balcony',
  'Fireplace',
  'Laundry Room',
  'Storage',
  'Furnished',
  'Pet Friendly',
  'Wheelchair Accessible',
  'Solar Power',
  'Borehole',
  'Backup Generator',
];

export default function NewPropertyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const { isAuthorized, isLoading: authLoading } = useRequireRole(['AGENT', 'LANDLORD', 'ADMIN']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: '',
    currency: 'ZMW',
    address: '',
    city: '',
    province: 'Lusaka',
    bedrooms: '',
    bathrooms: '',
    floorArea: '',
    plotSize: '',
    yearBuilt: '',
    amenities: [] as string[],
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 20) {
      showError('Maximum 20 images allowed');
      return;
    }
    
    setImages((prev) => [...prev, ...files]);
    
    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create property
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          floorArea: formData.floorArea ? parseFloat(formData.floorArea) : null,
          plotSize: formData.plotSize ? parseFloat(formData.plotSize) : null,
          yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to create property');
      }
      
      // Upload images if any
      if (images.length > 0) {
        const imageData = await Promise.all(
          images.map((file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });
          })
        );
        
        await fetch(`/api/properties/${data.data.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: imageData }),
        });
      }
      
      success('Property created successfully! It will be visible after admin approval.');
      router.push('/dashboard/listings');
    } catch (err: any) {
      showError(err.message || 'Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthorized) {
    return null;
  }
  
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
        Add New Property
      </h1>
      <p className="text-neutral-600 mb-8">
        Fill in the details below to list your property.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <Input
              label="Property Title"
              placeholder="e.g., Modern 3 Bedroom House in Kabulonga"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
            
            <Textarea
              label="Description"
              placeholder="Describe your property in detail..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              showCount
              maxLength={2000}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Property Type"
                value={formData.propertyType}
                onChange={(e) => handleChange('propertyType', e.target.value)}
                options={propertyTypes}
                required
              />
              
              <Select
                label="Listing Type"
                value={formData.listingType}
                onChange={(e) => handleChange('listingType', e.target.value)}
                options={listingTypes}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Pricing
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Price"
              placeholder="e.g., 500000"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              required
            />
            
            <Select
              label="Currency"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              options={[
                { value: 'ZMW', label: 'ZMW (Kwacha)' },
                { value: 'USD', label: 'USD (US Dollar)' },
              ]}
              required
            />
          </div>
          
          {formData.listingType === 'RENT' && (
            <p className="mt-2 text-sm text-neutral-500">
              * Price is per month for rental properties
            </p>
          )}
        </div>
        
        {/* Location */}
        <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Location
          </h2>
          
          <div className="space-y-4">
            <Input
              label="Address"
              placeholder="e.g., Plot 123, Kabulonga Road"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="e.g., Lusaka"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
              
              <Select
                label="Province"
                value={formData.province}
                onChange={(e) => handleChange('province', e.target.value)}
                options={provinces}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Property Details
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              type="number"
              label="Bedrooms"
              placeholder="e.g., 3"
              value={formData.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
            />
            
            <Input
              type="number"
              label="Bathrooms"
              placeholder="e.g., 2"
              value={formData.bathrooms}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
            />
            
            <Input
              type="number"
              label="Floor Area (m²)"
              placeholder="e.g., 250"
              value={formData.floorArea}
              onChange={(e) => handleChange('floorArea', e.target.value)}
            />
            
            <Input
              type="number"
              label="Plot Size (m²)"
              placeholder="e.g., 500"
              value={formData.plotSize}
              onChange={(e) => handleChange('plotSize', e.target.value)}
            />
          </div>
          
          <div className="mt-4">
            <Input
              type="number"
              label="Year Built"
              placeholder="e.g., 2020"
              value={formData.yearBuilt}
              onChange={(e) => handleChange('yearBuilt', e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>
        
        {/* Amenities */}
        <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Amenities
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.amenities.includes(amenity)
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="sr-only"
                />
                <svg
                  className={`w-5 h-5 ${
                    formData.amenities.includes(amenity) ? 'text-primary' : 'text-neutral-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {formData.amenities.includes(amenity) ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span className="text-sm font-medium">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Images */}
        <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Property Images
          </h2>
          
          <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="images"
              className="cursor-pointer"
            >
              <svg className="w-12 h-12 mx-auto text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-neutral-600 mb-1">
                <span className="text-primary font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-neutral-400">
                PNG, JPG up to 10MB (max 20 images)
              </p>
            </label>
          </div>
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-gold text-primary-dark text-xs font-semibold rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
          >
            Submit for Review
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
