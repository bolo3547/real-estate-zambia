'use client';

/**
 * Zambia Property - Dashboard Profile Page
 */

import { useState } from 'react';
import { useAuth, useRequireAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Button, Input, Textarea } from '@/components/ui';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { success, error: showError } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: '',
    companyName: '',
    companyLicense: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          // Add avatar upload logic here
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      await refreshUser();
      success('Profile updated successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to update profile');
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
  
  if (!isAuthenticated || !user) return null;
  
  const isAgent = user.role === 'AGENT';
  
  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Profile Settings</h1>
        <p className="text-neutral-600 mt-1">Manage your account information</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Profile Photo</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-cream overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-semibold text-primary">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            
            <div>
              <p className="text-neutral-600 mb-1">Upload a new photo</p>
              <p className="text-sm text-neutral-400">JPG, PNG. Max 2MB</p>
            </div>
          </div>
        </div>
        
        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
              
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>
            
            <Input
              type="email"
              label="Email Address"
              value={user.email}
              disabled
              hint="Email cannot be changed"
            />
            
            <Input
              type="tel"
              label="Phone Number"
              placeholder="+260 97 1234567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            
            <Textarea
              label="Bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              showCount
              maxLength={500}
            />
          </div>
        </div>
        
        {/* Agent/Business Information */}
        {(isAgent || user.role === 'LANDLORD') && (
          <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              {isAgent ? 'Agent Information' : 'Business Information'}
            </h2>
            
            <div className="space-y-4">
              <Input
                label={isAgent ? 'Company / Agency Name' : 'Company Name (Optional)'}
                placeholder="e.g., ABC Real Estate"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
              
              {isAgent && (
                <Input
                  label="License Number"
                  placeholder="e.g., RE-12345"
                  value={formData.companyLicense}
                  onChange={(e) => handleChange('companyLicense', e.target.value)}
                />
              )}
            </div>
          </div>
        )}
        
        {/* Account Status */}
        <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Account Status</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600">Account Type</span>
              <span className="font-semibold text-neutral-900">{user.role}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600">Email Verification</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.emailVerified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {user.emailVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-neutral-600">Account Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : user.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
