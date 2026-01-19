'use client';

/**
 * Zambia Property - Admin Audit Logs Page
 * 
 * View all admin actions with filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { useRequireRole } from '@/contexts/AuthContext';
import Pagination from '../components/Pagination';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Filters {
  action: string;
  entityType: string;
  adminId: string;
  search: string;
}

export default function AdminAuditLogsPage() {
  const { isAuthorized, isLoading: authLoading } = useRequireRole(['ADMIN']);
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({
    action: '',
    entityType: '',
    adminId: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  
  // Expanded log
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  
  // Fetch audit logs
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (filters.action) params.append('action', filters.action);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.adminId) params.append('adminId', filters.adminId);
      if (filters.search) params.append('search', filters.search);
      
      const response = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      } else {
        setError(data.error?.message || 'Failed to fetch audit logs');
      }
    } catch (err) {
      setError('Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);
  
  useEffect(() => {
    if (isAuthorized) {
      fetchLogs();
    }
  }, [isAuthorized, fetchLogs]);
  
  // Handle filter change
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Get action badge color
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      USER_CREATE: 'bg-green-100 text-green-700',
      USER_UPDATE: 'bg-blue-100 text-blue-700',
      USER_DELETE: 'bg-red-100 text-red-700',
      USER_SUSPEND: 'bg-orange-100 text-orange-700',
      USER_ACTIVATE: 'bg-green-100 text-green-700',
      USER_VERIFY: 'bg-purple-100 text-purple-700',
      PROPERTY_APPROVE: 'bg-green-100 text-green-700',
      PROPERTY_REJECT: 'bg-red-100 text-red-700',
      PROPERTY_FEATURE: 'bg-amber-100 text-amber-700',
      PROPERTY_UNFEATURE: 'bg-neutral-100 text-neutral-700',
      PROPERTY_DELETE: 'bg-red-100 text-red-700',
      PROPERTY_UPDATE: 'bg-blue-100 text-blue-700',
      SETTINGS_UPDATE: 'bg-purple-100 text-purple-700',
      LOGIN: 'bg-blue-100 text-blue-700',
      LOGOUT: 'bg-neutral-100 text-neutral-700',
    };
    return colors[action] || 'bg-neutral-100 text-neutral-700';
  };
  
  // Format action for display
  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ');
  };
  
  // Toggle log expansion
  const toggleExpand = (logId: string) => {
    setExpandedLogId(prev => prev === logId ? null : logId);
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthorized) return null;
  
  // Unique actions and entity types for filters
  const uniqueActions = [...new Set(logs.map(l => l.action))];
  const uniqueEntityTypes = [...new Set(logs.map(l => l.entityType))];
  
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Audit Logs</h1>
        <p className="text-neutral-600">Track all administrative actions on the platform</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search logs..."
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Actions</option>
              <option value="USER_CREATE">User Create</option>
              <option value="USER_UPDATE">User Update</option>
              <option value="USER_DELETE">User Delete</option>
              <option value="USER_SUSPEND">User Suspend</option>
              <option value="USER_ACTIVATE">User Activate</option>
              <option value="USER_VERIFY">User Verify</option>
              <option value="PROPERTY_APPROVE">Property Approve</option>
              <option value="PROPERTY_REJECT">Property Reject</option>
              <option value="PROPERTY_FEATURE">Property Feature</option>
              <option value="PROPERTY_UNFEATURE">Property Unfeature</option>
              <option value="PROPERTY_DELETE">Property Delete</option>
              <option value="PROPERTY_UPDATE">Property Update</option>
              <option value="SETTINGS_UPDATE">Settings Update</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Entity Type
            </label>
            <select
              value={filters.entityType}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Types</option>
              <option value="USER">User</option>
              <option value="PROPERTY">Property</option>
              <option value="SETTINGS">Settings</option>
              <option value="INQUIRY">Inquiry</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ action: '', entityType: '', adminId: '', search: '' });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      
      {/* Logs List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            {logs.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-neutral-900">No audit logs found</h3>
                <p className="text-neutral-500 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-neutral-50 transition-colors">
                    <div
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                      onClick={() => toggleExpand(log.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getActionColor(log.action)}`}>
                              {formatAction(log.action)}
                            </span>
                            <span className="text-sm text-neutral-500">
                              on {log.entityType.toLowerCase()}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600">
                            by <span className="font-medium">{log.admin.firstName} {log.admin.lastName}</span>
                            <span className="text-neutral-400"> ({log.admin.email})</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-neutral-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                        <svg
                          className={`w-5 h-5 text-neutral-400 transition-transform ${
                            expandedLogId === log.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {expandedLogId === log.id && (
                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-neutral-500 mb-1">Entity ID</p>
                            <p className="text-sm text-neutral-900 font-mono">{log.entityId}</p>
                          </div>
                          
                          {log.ipAddress && (
                            <div>
                              <p className="text-xs font-medium text-neutral-500 mb-1">IP Address</p>
                              <p className="text-sm text-neutral-900">{log.ipAddress}</p>
                            </div>
                          )}
                          
                          {log.oldValues && Object.keys(log.oldValues).length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-neutral-500 mb-1">Previous Values</p>
                              <pre className="text-xs bg-neutral-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.oldValues, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {log.newValues && Object.keys(log.newValues).length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-neutral-500 mb-1">New Values</p>
                              <pre className="text-xs bg-neutral-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.newValues, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {log.userAgent && (
                            <div className="md:col-span-2">
                              <p className="text-xs font-medium text-neutral-500 mb-1">User Agent</p>
                              <p className="text-xs text-neutral-600 truncate">{log.userAgent}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {logs.length > 0 && (
            <Pagination
              page={pagination.page}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              onLimitChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 1 }))}
            />
          )}
        </>
      )}
    </div>
  );
}
