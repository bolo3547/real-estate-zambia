'use client';

/**
 * Zambia Property - Admin Users Page
 * 
 * Comprehensive user management with filtering, actions, and audit logging
 */

import { useState, useEffect, useCallback } from 'react';
import { useRequireRole } from '@/contexts/AuthContext';
import DataTable, { Column } from '../components/DataTable';
import StatusBadge, { VerificationBadge } from '../components/StatusBadge';
import ActionDropdown, { ActionIcons } from '../components/ActionDropdown';
import ConfirmModal from '../components/ConfirmModal';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  isEmailVerified: boolean;
  createdAt: string;
  agentProfile?: {
    isVerified: boolean;
    companyName: string | null;
    licenseNumber: string | null;
  } | null;
  landlordProfile?: {
    isVerified: boolean;
    companyName: string | null;
  } | null;
  _count: {
    properties: number;
    inquiries: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const { isAuthorized, isLoading: authLoading } = useRequireRole(['ADMIN']);
  
  const [users, setUsers] = useState<User[]>([]);
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
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: string;
    user: User | null;
    isProcessing: boolean;
  }>({
    isOpen: false,
    action: '',
    user: null,
    isProcessing: false,
  });
  
  // Fetch users
  const fetchUsers = useCallback(async () => {
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
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);
      
      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.items);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }));
      } else {
        setError(data.error?.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, roleFilter, statusFilter, sortBy, sortOrder]);
  
  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
    }
  }, [isAuthorized, fetchUsers]);
  
  // Handle user action
  const handleAction = async (action: string, user: User) => {
    setModalState({ isOpen: true, action, user, isProcessing: false });
  };
  
  const executeAction = async () => {
    const { action, user } = modalState;
    if (!user) return;
    
    setModalState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      let updateData: Record<string, unknown> = {};
      
      switch (action) {
        case 'activate':
          updateData = { status: 'ACTIVE' };
          break;
        case 'suspend':
          updateData = { status: 'SUSPENDED' };
          break;
        case 'deactivate':
          updateData = { status: 'INACTIVE' };
          break;
        case 'verify':
          updateData = { isEmailVerified: true };
          break;
        case 'delete':
          const deleteResponse = await fetch(`/api/admin/users/${user.id}`, {
            method: 'DELETE',
          });
          const deleteData = await deleteResponse.json();
          
          if (deleteData.success) {
            setUsers(prev => prev.filter(u => u.id !== user.id));
          } else {
            throw new Error(deleteData.error?.message);
          }
          setModalState({ isOpen: false, action: '', user: null, isProcessing: false });
          return;
      }
      
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, ...data.data } : u
        ));
      } else {
        throw new Error(data.error?.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setModalState({ isOpen: false, action: '', user: null, isProcessing: false });
    }
  };
  
  // Table columns
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-neutral-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (user) => <StatusBadge status={user.role} variant="role" />,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (user) => <StatusBadge status={user.status} variant="user" />,
    },
    {
      key: 'verified',
      header: 'Verified',
      render: (user) => (
        <div className="flex flex-col gap-1">
          <VerificationBadge isVerified={user.isEmailVerified} size="sm" />
          {(user.agentProfile || user.landlordProfile) && (
            <span className={`text-xs ${
              user.agentProfile?.isVerified || user.landlordProfile?.isVerified
                ? 'text-green-600'
                : 'text-neutral-500'
            }`}>
              {user.agentProfile?.isVerified || user.landlordProfile?.isVerified
                ? '✓ Profile Verified'
                : 'Profile Unverified'}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'properties',
      header: 'Properties',
      render: (user) => (
        <span className="text-neutral-600">{user._count.properties}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      sortable: true,
      render: (user) => (
        <span className="text-neutral-600">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '80px',
      render: (user) => (
        <div onClick={e => e.stopPropagation()}>
          <ActionDropdown
            actions={[
              {
                label: 'View Details',
                icon: ActionIcons.view,
                onClick: () => window.open(`/admin/users/${user.id}`, '_blank'),
              },
              {
                label: user.status === 'ACTIVE' ? 'Suspend User' : 'Activate User',
                icon: user.status === 'ACTIVE' ? ActionIcons.suspend : ActionIcons.activate,
                onClick: () => handleAction(user.status === 'ACTIVE' ? 'suspend' : 'activate', user),
                variant: user.status === 'ACTIVE' ? 'warning' : 'success',
              },
              {
                label: 'Verify Email',
                icon: ActionIcons.verify,
                onClick: () => handleAction('verify', user),
                variant: 'success',
                disabled: user.isEmailVerified,
              },
              {
                label: 'Delete User',
                icon: ActionIcons.delete,
                onClick: () => handleAction('delete', user),
                variant: 'danger',
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
  
  // Get modal content based on action
  const getModalContent = () => {
    const { action, user } = modalState;
    if (!user) return { title: '', message: '', variant: 'info' as const };
    
    const name = `${user.firstName} ${user.lastName}`;
    
    switch (action) {
      case 'activate':
        return {
          title: 'Activate User',
          message: `Are you sure you want to activate ${name}? They will be able to access the platform.`,
          variant: 'info' as const,
          confirmText: 'Activate',
        };
      case 'suspend':
        return {
          title: 'Suspend User',
          message: `Are you sure you want to suspend ${name}? They will be unable to access the platform.`,
          variant: 'warning' as const,
          confirmText: 'Suspend',
        };
      case 'verify':
        return {
          title: 'Verify Email',
          message: `Mark ${name}'s email as verified? This should only be done if you've confirmed their identity.`,
          variant: 'info' as const,
          confirmText: 'Verify',
        };
      case 'delete':
        return {
          title: 'Delete User',
          message: `Are you sure you want to delete ${name}? This action cannot be undone. Their properties and data will be archived.`,
          variant: 'danger' as const,
          confirmText: 'Delete',
        };
      default:
        return { title: '', message: '', variant: 'info' as const, confirmText: 'Confirm' };
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
          <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-600">
            Manage users, roles, and account statuses
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
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="AGENT">Agent</option>
            <option value="LANDLORD">Landlord</option>
            <option value="TENANT">Tenant</option>
            <option value="BUYER">Buyer</option>
          </select>
          
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
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
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
        data={users}
        columns={columns}
        keyExtractor={(user) => user.id}
        isLoading={isLoading}
        emptyMessage="No users found"
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
        onClose={() => setModalState({ isOpen: false, action: '', user: null, isProcessing: false })}
        onConfirm={executeAction}
        title={modalContent.title}
        message={modalContent.message}
        variant={modalContent.variant}
        confirmText={modalContent.confirmText}
        isLoading={modalState.isProcessing}
      />
    </div>
  );
}
