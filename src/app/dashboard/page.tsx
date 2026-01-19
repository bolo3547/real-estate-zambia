'use client';

/**
 * Zambia Property - Dashboard Home Page
 */

import { useAuth, useRequireAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  change?: { value: number; positive: boolean };
  icon: React.FC;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-neutral-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-neutral-900">{value}</p>
        {change && (
          <p
            className={`text-sm mt-2 flex items-center gap-1 ${
              change.positive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={change.positive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'}
              />
            </svg>
            {change.value}% from last month
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <Icon />
      </div>
    </div>
  </div>
);

const ListingsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ViewsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const InquiriesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const FavoritesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const { user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  const isListingUser = user.role === 'AGENT' || user.role === 'LANDLORD';
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-neutral-600 mt-1">
            Here's what's happening with your properties today.
          </p>
        </div>
        {isListingUser && (
          <Link
            href="/dashboard/listings/new"
            className="btn btn-primary hidden md:flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Property
          </Link>
        )}
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isListingUser ? (
          <>
            <StatsCard
              title="Total Listings"
              value={12}
              change={{ value: 8, positive: true }}
              icon={ListingsIcon}
            />
            <StatsCard
              title="Total Views"
              value="2,345"
              change={{ value: 12, positive: true }}
              icon={ViewsIcon}
            />
            <StatsCard
              title="Inquiries"
              value={28}
              change={{ value: 5, positive: true }}
              icon={InquiriesIcon}
            />
            <StatsCard
              title="Saved by Users"
              value={156}
              change={{ value: 3, positive: true }}
              icon={FavoritesIcon}
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Saved Properties"
              value={8}
              icon={FavoritesIcon}
            />
            <StatsCard
              title="Properties Viewed"
              value={45}
              icon={ViewsIcon}
            />
            <StatsCard
              title="Inquiries Sent"
              value={5}
              icon={InquiriesIcon}
            />
          </>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isListingUser && (
            <>
              <Link
                href="/dashboard/listings/new"
                className="flex flex-col items-center p-4 bg-cream rounded-xl hover:bg-primary hover:text-white transition-colors group"
              >
                <svg className="w-8 h-8 text-primary group-hover:text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium">Add Property</span>
              </Link>
              <Link
                href="/dashboard/listings"
                className="flex flex-col items-center p-4 bg-cream rounded-xl hover:bg-primary hover:text-white transition-colors group"
              >
                <svg className="w-8 h-8 text-primary group-hover:text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="text-sm font-medium">Manage Listings</span>
              </Link>
            </>
          )}
          <Link
            href="/dashboard/inquiries"
            className="flex flex-col items-center p-4 bg-cream rounded-xl hover:bg-primary hover:text-white transition-colors group"
          >
            <svg className="w-8 h-8 text-primary group-hover:text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">View Inquiries</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex flex-col items-center p-4 bg-cream rounded-xl hover:bg-primary hover:text-white transition-colors group"
          >
            <svg className="w-8 h-8 text-primary group-hover:text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium">Edit Profile</span>
          </Link>
          <Link
            href="/properties"
            className="flex flex-col items-center p-4 bg-cream rounded-xl hover:bg-primary hover:text-white transition-colors group"
          >
            <svg className="w-8 h-8 text-primary group-hover:text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm font-medium">Browse Properties</span>
          </Link>
        </div>
      </div>
      
      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-neutral-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No recent activity to show.</p>
          <p className="text-sm mt-1">Start by adding a property or browsing listings.</p>
        </div>
      </div>
    </div>
  );
}
