'use client';

/**
 * Zambia Property - Admin Properties Page
 * 
 * Property management with moderation, featuring, and approval workflow
 */

import { useState, useEffect, useCallback } from 'react';
import { useRequireRole } from '@/contexts/AuthContext';
import DataTable, { Column } from '../components/DataTable';
import StatusBadge, { FeaturedBadge } from '../components/StatusBadge';
import ActionDropdown, { ActionIcons } from '../components/ActionDropdown';
import ConfirmModal from '../components/ConfirmModal';

interface Property {
  id: string;
  title: string;
  slug: string;
  type: string;
  listingType: string;
  status: string;
  price: number;
  currency: string;
  city: string;
  province: string;
  bedrooms: number | null;
  bathrooms: number | null;
  approvalStatus: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  viewCount: number;
  createdAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  images: Array<{ url: string; alt: string }>;
  featuredProperty: {
    tier: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  } | null;
  _count: {
    inquiries: number;
    favorites: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminPropertiesPage() {
  const { isAuthorized, isLoading: authLoading } = useRequireRole(['ADMIN']);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: string;
    property: Property | null;
    isProcessing: boolean;
    reason: string;
  }>({
    isOpen: false,
    action: '',
    property: null,
    isProcessing: false,
    reason: '',
  });
  
  const [featureModal, setFeatureModal] = useState<{
    isOpen: boolean;
    property: Property | null;
    tier: 'BASIC' | 'PREMIUM' | 'SPOTLIGHT';
    days: number;
  }>({
    isOpen: false,
    property: null,
    tier: 'BASIC',
    days: 30,
  });
  
  // Fetch properties
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
      });
      
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('type', typeFilter);
      if (featuredFilter) params.set('featured', featuredFilter);
      
      const response = await fetch(`/api/admin/properties?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data.items);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }));
      } else {
        setError(data.error?.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter, typeFilter, featuredFilter, sortBy, sortOrder]);
  
  useEffect(() => {
    if (isAuthorized) {
      fetchProperties();
    }
  }, [isAuthorized, fetchProperties]);
  
  // Handle property action
  const handleAction = (action: string, property: Property) => {
    setModalState({ isOpen: true, action, property, isProcessing: false, reason: '' });
  };
  
  const executeAction = async () => {
    const { action, property, reason } = modalState;
    if (!property) return;
    
    setModalState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      let updateData: Record<string, unknown> = {};
      
      switch (action) {
        case 'approve':
          updateData = { approvalStatus: 'APPROVED' };
          break;
        case 'reject':
          updateData = { approvalStatus: 'REJECTED', rejectionReason: reason || 'Rejected by admin' };
          break;
        case 'requestRevision':
          updateData = { approvalStatus: 'REVISION_REQUESTED', rejectionReason: reason || 'Revision requested' };
          break;
        case 'unpublish':
          updateData = { status: 'UNAVAILABLE' };
          break;
        case 'publish':
          updateData = { status: 'APPROVED' };
          break;
        case 'removeFeatured':
          updateData = { feature: { enabled: false } };
          break;
        case 'delete':
          const deleteResponse = await fetch(`/api/admin/properties/${property.id}`, {
            method: 'DELETE',
          });
          const deleteData = await deleteResponse.json();
          
          if (deleteData.success) {
            setProperties(prev => prev.filter(p => p.id !== property.id));
          } else {
            throw new Error(deleteData.error?.message);
          }
          setModalState({ isOpen: false, action: '', property: null, isProcessing: false, reason: '' });
          return;
      }
      
      const response = await fetch(`/api/admin/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProperties(prev => prev.map(p => 
          p.id === property.id ? { ...p, ...data.data } : p
        ));
      } else {
        throw new Error(data.error?.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setModalState({ isOpen: false, action: '', property: null, isProcessing: false, reason: '' });
    }
  };
  
  // Handle featuring
  const handleFeature = async () => {
    const { property, tier, days } = featureModal;
    if (!property) return;
    
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);
      
      const response = await fetch(`/api/admin/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: {
            enabled: true,
            tier,
            startDate: new Date().toISOString(),
            endDate: endDate.toISOString(),
          },
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProperties(prev => prev.map(p => 
          p.id === property.id ? { ...p, ...data.data } : p
        ));
        setFeatureModal({ isOpen: false, property: null, tier: 'BASIC', days: 30 });
      } else {
        throw new Error(data.error?.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to feature property');
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
  
  // Table columns
  const columns: Column<Property>[] = [
    {
      key: 'property',
      header: 'Property',
      render: (property) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-12 rounded-lg bg-neutral-100 flex-shrink-0 overflow-hidden">
            {property.images[0] ? (
              <img
                src={property.images[0].url}
                alt={property.images[0].alt || property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-neutral-900 truncate">{property.title}</p>
            <p className="text-xs text-neutral-500">{property.city}, {property.province}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (property) => (
        <div className="text-sm">
          <p className="text-neutral-900">{property.type.replace('_', ' ')}</p>
          <p className="text-xs text-neutral-500">{property.listingType}</p>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (property) => (
        <span className="font-medium text-neutral-900">
          {formatPrice(property.price, property.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (property) => (
        <div className="flex flex-col gap-1">
          <StatusBadge status={property.status} variant="property" />
          {property.featuredProperty?.isActive && (
            <FeaturedBadge tier={property.featuredProperty.tier as 'BASIC' | 'PREMIUM' | 'SPOTLIGHT'} size="sm" />
          )}
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (property) => (
        <div className="text-sm">
          <p className="text-neutral-900">{property.owner.firstName} {property.owner.lastName}</p>
          <p className="text-xs text-neutral-500">{property.owner.role}</p>
        </div>
      ),
    },
    {
      key: 'engagement',
      header: 'Engagement',
      render: (property) => (
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <span title="Views" className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {property.viewCount}
          </span>
          <span title="Inquiries" className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {property._count.inquiries}
          </span>
          <span title="Favorites" className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {property._count.favorites}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Listed',
      sortable: true,
      render: (property) => (
        <span className="text-neutral-600 text-sm">
          {new Date(property.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '80px',
      render: (property) => (
        <div onClick={e => e.stopPropagation()}>
          <ActionDropdown
            actions={[
              {
                label: 'View Property',
                icon: ActionIcons.view,
                onClick: () => window.open(`/properties/${property.slug}`, '_blank'),
              },
              ...(property.status === 'PENDING' || property.approvalStatus === 'SUBMITTED' ? [
                {
                  label: 'Approve',
                  icon: ActionIcons.approve,
                  onClick: () => handleAction('approve', property),
                  variant: 'success' as const,
                },
                {
                  label: 'Reject',
                  icon: ActionIcons.reject,
                  onClick: () => handleAction('reject', property),
                  variant: 'danger' as const,
                },
                {
                  label: 'Request Revision',
                  icon: ActionIcons.edit,
                  onClick: () => handleAction('requestRevision', property),
                  variant: 'warning' as const,
                },
              ] : []),
              ...(property.status === 'APPROVED' ? [
                {
                  label: 'Unpublish',
                  icon: ActionIcons.suspend,
                  onClick: () => handleAction('unpublish', property),
                  variant: 'warning' as const,
                },
              ] : []),
              ...(property.status === 'UNAVAILABLE' ? [
                {
                  label: 'Publish',
                  icon: ActionIcons.activate,
                  onClick: () => handleAction('publish', property),
                  variant: 'success' as const,
                },
              ] : []),
              {
                label: property.featuredProperty?.isActive ? 'Remove Featured' : 'Make Featured',
                icon: ActionIcons.feature,
                onClick: () => property.featuredProperty?.isActive 
                  ? handleAction('removeFeatured', property)
                  : setFeatureModal({ isOpen: true, property, tier: 'BASIC', days: 30 }),
                variant: property.featuredProperty?.isActive ? 'warning' as const : 'default' as const,
                divider: true,
              },
              {
                label: 'Delete Property',
                icon: ActionIcons.delete,
                onClick: () => handleAction('delete', property),
                variant: 'danger' as const,
                divider: true,
              },
            ]}
          />
        </div>
      ),
    },
  ];
  
  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  // Get modal content
  const getModalContent = () => {
    const { action, property } = modalState;
    if (!property) return { title: '', message: '', variant: 'info' as const, showReason: false };
    
    switch (action) {
      case 'approve':
        return {
          title: 'Approve Property',
          message: `Approve "${property.title}"? It will be publicly visible on the platform.`,
          variant: 'info' as const,
          confirmText: 'Approve',
          showReason: false,
        };
      case 'reject':
        return {
          title: 'Reject Property',
          message: `Reject "${property.title}"? Please provide a reason for the rejection.`,
          variant: 'danger' as const,
          confirmText: 'Reject',
          showReason: true,
        };
      case 'requestRevision':
        return {
          title: 'Request Revision',
          message: `Request revision for "${property.title}"? Please specify what needs to be changed.`,
          variant: 'warning' as const,
          confirmText: 'Request Revision',
          showReason: true,
        };
      case 'unpublish':
        return {
          title: 'Unpublish Property',
          message: `Unpublish "${property.title}"? It will no longer be visible to users.`,
          variant: 'warning' as const,
          confirmText: 'Unpublish',
          showReason: false,
        };
      case 'removeFeatured':
        return {
          title: 'Remove Featured Status',
          message: `Remove featured status from "${property.title}"?`,
          variant: 'warning' as const,
          confirmText: 'Remove',
          showReason: false,
        };
      case 'delete':
        return {
          title: 'Delete Property',
          message: `Delete "${property.title}"? This action cannot be undone.`,
          variant: 'danger' as const,
          confirmText: 'Delete',
          showReason: false,
        };
      default:
        return { title: '', message: '', variant: 'info' as const, confirmText: 'Confirm', showReason: false };
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthorized) return null;
  
  const modalContent = getModalContent();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Property Management</h1>
          <p className="text-neutral-600">
            Moderate, approve, and manage property listings
          </p>
        </div>
        
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">
              {selectedIds.length} selected
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-sm text-primary hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search properties..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SOLD">Sold</option>
            <option value="RENTED">Rented</option>
          </select>
          
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          >
            <option value="">All Types</option>
            <option value="HOUSE">House</option>
            <option value="APARTMENT">Apartment</option>
            <option value="LAND">Land</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>
          
          {/* Featured Filter */}
          <select
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          >
            <option value="">All Properties</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>
        </div>
      </div>
      
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      
      {/* Data Table */}
      <DataTable
        data={properties}
        columns={columns}
        keyExtractor={(property) => property.id}
        isLoading={isLoading}
        emptyMessage="No properties found"
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
          onLimitChange: (limit) => setPagination(prev => ({ ...prev, limit, page: 1 })),
        }}
        sortColumn={sortBy}
        sortDirection={sortOrder}
        onSort={handleSort}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, action: '', property: null, isProcessing: false, reason: '' })}
        onConfirm={executeAction}
        title={modalContent.title}
        message={modalContent.message}
        variant={modalContent.variant}
        confirmText={modalContent.confirmText}
        isLoading={modalState.isProcessing}
      />
      
      {/* Feature Modal */}
      {featureModal.isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setFeatureModal({ isOpen: false, property: null, tier: 'BASIC', days: 30 })} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Feature Property</h3>
              <p className="text-sm text-neutral-600 mb-4">
                "{featureModal.property?.title}"
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Featured Tier
                  </label>
                  <select
                    value={featureModal.tier}
                    onChange={(e) => setFeatureModal(prev => ({ ...prev, tier: e.target.value as typeof prev.tier }))}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="BASIC">Basic Featured</option>
                    <option value="PREMIUM">Premium Featured</option>
                    <option value="SPOTLIGHT">Spotlight</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Duration (days)
                  </label>
                  <select
                    value={featureModal.days}
                    onChange={(e) => setFeatureModal(prev => ({ ...prev, days: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setFeatureModal({ isOpen: false, property: null, tier: 'BASIC', days: 30 })}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeature}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors"
                >
                  Feature Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
