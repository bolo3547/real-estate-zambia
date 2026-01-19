'use client';

/**
 * Zambia Property - Admin Dashboard
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, useRequireRole } from '@/contexts/AuthContext';

interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  pendingApprovals: number;
  totalInquiries: number;
  recentUsers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  recentProperties: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  href,
  color = 'primary',
}: {
  title: string;
  value: number | string;
  icon: React.FC;
  href?: string;
  color?: 'primary' | 'gold' | 'green' | 'blue';
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    gold: 'bg-gold/20 text-gold',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
  };
  
  const content = (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon />
        </div>
      </div>
    </div>
  );
  
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
};

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PropertiesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ApprovalsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InquiriesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isAuthorized, isLoading: authLoading } = useRequireRole(['ADMIN']);
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isAuthorized) {
      fetchStats();
    }
  }, [isAuthorized]);
  
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-600 mt-1">Overview of your platform</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={UsersIcon}
          href="/admin/users"
          color="primary"
        />
        <StatCard
          title="Total Properties"
          value={stats?.totalProperties || 0}
          icon={PropertiesIcon}
          href="/admin/properties"
          color="blue"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || 0}
          icon={ApprovalsIcon}
          href="/admin/approvals"
          color="gold"
        />
        <StatCard
          title="Total Inquiries"
          value={stats?.totalInquiries || 0}
          icon={InquiriesIcon}
          color="green"
        />
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Users</h2>
            <Link href="/admin/users" className="text-sm text-primary hover:underline">
              View All →
            </Link>
          </div>
          
          {stats?.recentUsers && stats.recentUsers.length > 0 ? (
            <div className="space-y-3">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-500 py-8">No recent users</p>
          )}
        </div>
        
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Properties</h2>
            <Link href="/admin/properties" className="text-sm text-primary hover:underline">
              View All →
            </Link>
          </div>
          
          {stats?.recentProperties && stats.recentProperties.length > 0 ? (
            <div className="space-y-3">
              {stats.recentProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{property.title}</p>
                    <p className="text-sm text-neutral-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    property.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : property.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {property.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-500 py-8">No recent properties</p>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/approvals"
            className="flex flex-col items-center p-4 bg-neutral-50 rounded-xl hover:bg-primary hover:text-white transition-colors group"
          >
            <svg className="w-8 h-8 text-primary group-hover:text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Review Approvals</span>
          </Link>
          
          <Link
            href="/admin/users"
            className="flex flex-col items-center p-4 bg-neutral-50 rounded-xl hover:bg-primary hover:text-white transition-colors group"
          >
            <svg className="w-8 h-8 text-primary group-hover:text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="text-sm font-medium">Manage Users</span>
          </Link>
          
          <Link
            href="/admin/properties"
            className="flex flex-col items-center p-4 bg-neutral-50 rounded-xl hover:bg-primary hover:text-white transition-colors group"
          >
            <svg className="w-8 h-8 text-primary group-hover:text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm font-medium">All Properties</span>
          </Link>
          
          <Link
            href="/admin/featured"
            className="flex flex-col items-center p-4 bg-neutral-50 rounded-xl hover:bg-primary hover:text-white transition-colors group"
          >
            <svg className="w-8 h-8 text-primary group-hover:text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-sm font-medium">Featured Listings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
