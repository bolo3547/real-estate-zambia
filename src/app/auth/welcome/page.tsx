'use client';

/**
 * Welcome Page for New OAuth Users
 * Allows users to complete their profile after signing in with Google
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Input, Select } from '@/components/ui';

const roleOptions = [
  { value: 'BUYER', label: 'I want to browse/buy properties' },
  { value: 'AGENT', label: 'I am a Real Estate Agent' },
  { value: 'LANDLORD', label: 'I am a Property Owner/Landlord' },
];

export default function WelcomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [formData, setFormData] = useState({
    phone: '',
    role: 'BUYER',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <span className="text-white font-bold text-lg">ZP</span>
          </div>
          <span className="font-bold text-xl text-neutral-900">Zambia Property</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
              Welcome, {session?.user?.firstName || 'there'}!
            </h1>
            <p className="text-neutral-600">
              Your account has been created. Let's complete your profile to get the best experience.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="tel"
              label="Phone Number (Optional)"
              placeholder="+260 97X XXX XXX"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              hint="For property inquiries and notifications"
            />

            <Select
              label="What brings you here?"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              options={roleOptions}
            />

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Complete Profile
              </Button>
              
              <button
                type="button"
                onClick={handleSkip}
                className="w-full text-center text-neutral-500 hover:text-neutral-700 text-sm py-2"
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
