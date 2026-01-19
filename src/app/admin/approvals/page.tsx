'use client';

/**
 * Zambia Property - Admin Approvals Page
 * 
 * Pending approvals queue for users and properties
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRequireRole } from '@/contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';

interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  agentProfile?: {
    companyName: string | null;
    licenseNumber: string | null;
    specializations: string[];
  } | null;
  landlordProfile?: {
    companyName: string | null;
    businessType: string | null;
  } | null;
}

interface PendingProperty {
  id: string;
  title: string;
  slug: string;
  type: string;
  listingType: string;
  price: number;
  currency: string;
  city: string;
  province: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: string;
  approvalStatus: string;
  createdAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  images: Array<{ url: string; alt: string }>;
}

type Tab = 'all' | 'users' | 'properties';

export default function AdminApprovalsPage() {
  const { isAuthorized, isLoading: authLoading } = useRequireRole(['ADMIN']);
  
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [counts, setCounts] = useState({ users: 0, properties: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'user' | 'property';
    action: 'approve' | 'reject';
    item: PendingUser | PendingProperty | null;
    reason: string;
    isProcessing: boolean;
  }>({
    isOpen: false,
    type: 'user',
    action: 'approve',
    item: null,
    reason: '',
    isProcessing: false,
  });
  
  // Fetch approvals
  const fetchApprovals = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/approvals?type=all');
      const data = await response.json();
      
      if (data.success) {
        setPendingUsers(data.data.pendingUsers || []);
        setPendingProperties(data.data.pendingProperties || []);
        setCounts(data.data.counts);
      } else {
        setError(data.error?.message || 'Failed to fetch approvals');
      }
    } catch (err) {
      setError('Failed to fetch approvals');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (isAuthorized) {
      fetchApprovals();
    }
  }, [isAuthorized, fetchApprovals]);
  
  // Handle user approval/rejection
  const handleUserAction = (action: 'approve' | 'reject', user: PendingUser) => {
    setModalState({
      isOpen: true,
      type: 'user',
      action,
      item: user,
      reason: '',
      isProcessing: false,
    });
  };
  
  // Handle property approval/rejection
  const handlePropertyAction = (action: 'approve' | 'reject', property: PendingProperty) => {
    setModalState({
      isOpen: true,
      type: 'property',
      action,
      item: property,
      reason: '',
      isProcessing: false,
    });
  };
  
  // Execute action
  const executeAction = async () => {
    const { type, action, item, reason } = modalState;
    if (!item) return;
    
    setModalState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      let endpoint: string;
      let updateData: Record<string, unknown>;
      
      if (type === 'user') {
        endpoint = `/api/admin/users/${item.id}`;
        updateData = {
          status: action === 'approve' ? 'ACTIVE' : 'SUSPENDED',
          reason: action === 'reject' ? reason : undefined,
        };
      } else {
        endpoint = `/api/admin/properties/${item.id}`;
        updateData = {
          approvalStatus: action === 'approve' ? 'APPROVED' : 'REJECTED',
          rejectionReason: action === 'reject' ? reason : undefined,
        };
      }
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from list
        if (type === 'user') {
          setPendingUsers(prev => prev.filter(u => u.id !== item.id));
          setCounts(prev => ({
            ...prev,
            users: prev.users - 1,
            total: prev.total - 1,
          }));
        } else {
          setPendingProperties(prev => prev.filter(p => p.id !== item.id));
          setCounts(prev => ({
            ...prev,
            properties: prev.properties - 1,
            total: prev.total - 1,
          }));
        }
      } else {
        throw new Error(data.error?.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setModalState(prev => ({
        ...prev,
        isOpen: false,
        isProcessing: false,
      }));
    }
  };
  
  // Format price
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: currency || 'ZMW',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  if (authLoading) {
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
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Pending Approvals</h1>
        <p className="text-neutral-600">
          Review and approve new users and property listings
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-neutral-100">
          <p className="text-sm text-neutral-500">Total Pending</p>
          <p className="text-2xl font-bold text-neutral-900">{counts.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-100">
          <p className="text-sm text-neutral-500">Users</p>
          <p className="text-2xl font-bold text-blue-600">{counts.users}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-100">
          <p className="text-sm text-neutral-500">Properties</p>
          <p className="text-2xl font-bold text-green-600">{counts.properties}</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex gap-6">
          {(['all', 'users', 'properties'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'users' ? 'Users' : 'Properties'}
              {tab !== 'all' && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab ? 'bg-primary/10' : 'bg-neutral-100'
                }`}>
                  {tab === 'users' ? counts.users : counts.properties}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      
      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Users */}
          {(activeTab === 'all' || activeTab === 'users') && pendingUsers.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Pending Users</h2>
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl border border-neutral-100 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-semibold text-primary">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-neutral-500">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={user.role} variant="role" size="sm" />
                            {user.agentProfile?.companyName && (
                              <span className="text-xs text-neutral-500">
                                {user.agentProfile.companyName}
                              </span>
                            )}
                            {user.landlordProfile?.companyName && (
                              <span className="text-xs text-neutral-500">
                                {user.landlordProfile.companyName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">
                          Requested {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleUserAction('approve', user)}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUserAction('reject', user)}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Pending Properties */}
          {(activeTab === 'all' || activeTab === 'properties') && pendingProperties.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Pending Properties</h2>
              <div className="space-y-4">
                {pendingProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-xl border border-neutral-100 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Property Image */}
                      <div className="w-full md:w-32 h-24 rounded-lg bg-neutral-100 flex-shrink-0 overflow-hidden">
                        {property.images[0] ? (
                          <img
                            src={property.images[0].url}
                            alt={property.images[0].alt || property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Property Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/properties/${property.slug}`}
                              target="_blank"
                              className="font-medium text-neutral-900 hover:text-primary"
                            >
                              {property.title}
                            </Link>
                            <p className="text-sm text-neutral-500">
                              {property.city}, {property.province}
                            </p>
                          </div>
                          <p className="font-semibold text-primary">
                            {formatPrice(property.price, property.currency)}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-neutral-600">
                          <span>{property.type.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>{property.listingType}</span>
                          {property.bedrooms && (
                            <>
                              <span>•</span>
                              <span>{property.bedrooms} bed</span>
                            </>
                          )}
                          {property.bathrooms && (
                            <>
                              <span>•</span>
                              <span>{property.bathrooms} bath</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs text-neutral-500">
                            By {property.owner.firstName} {property.owner.lastName} ({property.owner.role})
                            <span className="mx-2">•</span>
                            Submitted {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePropertyAction('approve', property)}
                              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handlePropertyAction('reject', property)}
                              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {!isLoading && counts.total === 0 && (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-neutral-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-neutral-900">All caught up!</h3>
              <p className="text-neutral-500 mt-1">No pending approvals at the moment.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeAction}
        title={`${modalState.action === 'approve' ? 'Approve' : 'Reject'} ${modalState.type === 'user' ? 'User' : 'Property'}`}
        message={
          modalState.action === 'approve'
            ? `Are you sure you want to approve this ${modalState.type}?`
            : `Are you sure you want to reject this ${modalState.type}? ${modalState.type === 'property' ? 'You can provide a reason for rejection.' : ''}`
        }
        variant={modalState.action === 'approve' ? 'info' : 'danger'}
        confirmText={modalState.action === 'approve' ? 'Approve' : 'Reject'}
        isLoading={modalState.isProcessing}
      />
    </div>
  );
}
