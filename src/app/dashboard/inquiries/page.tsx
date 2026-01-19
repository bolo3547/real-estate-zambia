'use client';

/**
 * Zambia Property - Dashboard Inquiries Page
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, useRequireAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Button, Modal } from '@/components/ui';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'PENDING' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
  property: {
    id: string;
    title: string;
    slug: string;
    images: Array<{ url: string }>;
  };
}

// Mock data for demonstration
const mockInquiries: Inquiry[] = [
  {
    id: '1',
    name: 'John Mwanza',
    email: 'john@example.com',
    phone: '+260 97 1234567',
    message: 'I am interested in this property. Is it still available? I would like to schedule a viewing this weekend if possible.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    property: {
      id: 'p1',
      title: 'Modern 4 Bedroom House in Kabulonga',
      slug: 'modern-4-bedroom-house-kabulonga',
      images: [{ url: '/images/property-1.jpg' }],
    },
  },
  {
    id: '2',
    name: 'Sarah Banda',
    email: 'sarah@example.com',
    phone: '+260 96 7654321',
    message: 'What is the exact location of this property? Is the price negotiable?',
    status: 'RESPONDED',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    property: {
      id: 'p2',
      title: 'Commercial Plot in Roma',
      slug: 'commercial-plot-roma',
      images: [{ url: '/images/property-2.jpg' }],
    },
  },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  RESPONDED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-neutral-100 text-neutral-600',
};

export default function InquiriesPage() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'RESPONDED' | 'CLOSED'>('ALL');
  
  const isListingUser = user?.role === 'AGENT' || user?.role === 'LANDLORD' || user?.role === 'ADMIN';
  
  useEffect(() => {
    if (isAuthenticated) {
      // In production, fetch from API
      setTimeout(() => {
        setInquiries(mockInquiries);
        setIsLoading(false);
      }, 500);
    }
  }, [isAuthenticated]);
  
  const filteredInquiries = filter === 'ALL'
    ? inquiries
    : inquiries.filter((i) => i.status === filter);
  
  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    try {
      // In production, update via API
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
      success(`Inquiry marked as ${newStatus.toLowerCase()}`);
    } catch (err) {
      showError('Failed to update status');
    }
  };
  
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
          {isListingUser ? 'Inquiries' : 'My Inquiries'}
        </h1>
        <p className="text-neutral-600 mt-1">
          {isListingUser
            ? 'Manage inquiries from potential buyers and renters'
            : 'View your inquiries to property owners'}
        </p>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'RESPONDED', 'CLOSED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as typeof filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {status === 'ALL' ? 'All' : status}
            {status !== 'ALL' && (
              <span className="ml-2">
                ({inquiries.filter((i) => i.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-premium-sm">
          <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No inquiries found</h3>
          <p className="text-neutral-500">
            {filter === 'ALL'
              ? "You haven't received any inquiries yet."
              : `No ${filter.toLowerCase()} inquiries.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-2xl shadow-premium-sm overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Property Image */}
                <Link href={`/properties/${inquiry.property.slug}`}>
                  <div className="md:w-48 h-32 md:h-full flex-shrink-0">
                    <img
                      src={inquiry.property.images[0]?.url || '/images/placeholder-property.jpg'}
                      alt={inquiry.property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                
                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status]}`}>
                          {inquiry.status}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {new Date(inquiry.createdAt).toLocaleDateString()} at{' '}
                          {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <Link href={`/properties/${inquiry.property.slug}`}>
                        <h3 className="text-lg font-semibold text-neutral-900 hover:text-primary transition-colors mb-2">
                          {inquiry.property.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                        <span className="font-medium">{inquiry.name}</span>
                        <span>{inquiry.email}</span>
                        {inquiry.phone && <span>{inquiry.phone}</span>}
                      </div>
                      
                      <p className="text-neutral-600 line-clamp-2">{inquiry.message}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        View Details
                      </Button>
                      {isListingUser && inquiry.status === 'PENDING' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(inquiry.id, 'RESPONDED')}
                        >
                          Mark Responded
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Inquiry Detail Modal */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Inquiry Details"
      >
        {selectedInquiry && (
          <div className="space-y-4">
            {/* Property Info */}
            <div className="flex items-center gap-4 p-4 bg-cream rounded-xl">
              <img
                src={selectedInquiry.property.images[0]?.url || '/images/placeholder-property.jpg'}
                alt={selectedInquiry.property.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-neutral-900">{selectedInquiry.property.title}</h4>
                <Link
                  href={`/properties/${selectedInquiry.property.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  View Property →
                </Link>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-neutral-900">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Name</p>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedInquiry.status]}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-primary hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Phone</p>
                  {selectedInquiry.phone ? (
                    <a href={`tel:${selectedInquiry.phone}`} className="font-medium text-primary hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  ) : (
                    <p className="text-neutral-400">Not provided</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div>
              <h4 className="font-semibold text-neutral-900 mb-2">Message</h4>
              <p className="text-neutral-600 bg-neutral-50 p-4 rounded-xl">{selectedInquiry.message}</p>
            </div>
            
            {/* Date */}
            <p className="text-sm text-neutral-500">
              Received on {new Date(selectedInquiry.createdAt).toLocaleDateString()} at{' '}
              {new Date(selectedInquiry.createdAt).toLocaleTimeString()}
            </p>
            
            {/* Actions */}
            {isListingUser && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.property.title}`;
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </Button>
                {selectedInquiry.phone && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      window.open(`https://wa.me/${selectedInquiry.phone.replace(/\D/g, '')}?text=Hi ${selectedInquiry.name}, regarding ${selectedInquiry.property.title}...`, '_blank');
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
