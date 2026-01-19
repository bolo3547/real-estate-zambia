'use client';

/**
 * Zambia Property - My Listings Page
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, useRequireRole } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui';

interface Property {
  id: string;
  title: string;
  slug: string;
  propertyType: string;
  listingType: string;
  price: number;
  currency: string;
  city: string;
  province: string;
  status: string;
  viewCount: number;
  favoriteCount: number;
  images: Array<{ url: string }>;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-neutral-100 text-neutral-600',
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  RENTED: 'bg-blue-100 text-blue-700',
  SOLD: 'bg-purple-100 text-purple-700',
};

export default function MyListingsPage() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const { isAuthorized, isLoading: authLoading } = useRequireRole(['AGENT', 'LANDLORD', 'ADMIN']);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  
  useEffect(() => {
    if (isAuthorized) {
      fetchProperties();
    }
  }, [isAuthorized]);
  
  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties?mine=true');
      const data = await response.json();
      
      if (response.ok) {
        setProperties(data.data || []);
      }
    } catch (err) {
      showError('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredProperties = filter === 'ALL'
    ? properties
    : properties.filter((p) => p.status === filter);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        success('Property deleted successfully');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      showError('Failed to delete property');
    }
  };
  
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthorized) return null;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">My Listings</h1>
          <p className="text-neutral-600 mt-1">Manage your property listings</p>
        </div>
        <Link href="/dashboard/listings/new">
          <Button variant="primary" className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Property
          </Button>
        </Link>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'DRAFT', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as typeof filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {status === 'ALL' ? 'All Listings' : status}
            {status !== 'ALL' && (
              <span className="ml-2">
                ({properties.filter((p) => p.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Listings */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-premium-sm">
          <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No listings found</h3>
          <p className="text-neutral-500 mb-6">
            {filter === 'ALL'
              ? "You haven't created any property listings yet."
              : `No ${filter.toLowerCase()} listings.`}
          </p>
          <Link href="/dashboard/listings/new">
            <Button variant="primary">Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl shadow-premium-sm overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                  <img
                    src={property.images[0]?.url || '/images/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status] || statusColors.DRAFT}`}>
                          {property.status}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {property.propertyType} • {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {property.title}
                      </h3>
                      
                      <p className="text-neutral-500 text-sm mb-2">
                        {property.city}, {property.province}
                      </p>
                      
                      <p className="text-xl font-bold text-primary">
                        {property.currency} {property.price.toLocaleString()}
                        {property.listingType === 'RENT' && <span className="text-sm font-normal text-neutral-500">/month</span>}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/properties/${property.slug}`}>
                        <button className="p-2 text-neutral-500 hover:text-primary hover:bg-cream rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </Link>
                      <Link href={`/dashboard/listings/${property.id}/edit`}>
                        <button className="p-2 text-neutral-500 hover:text-primary hover:bg-cream rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {property.viewCount} views
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {property.favoriteCount} saves
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
