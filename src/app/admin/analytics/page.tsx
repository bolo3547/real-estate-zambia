'use client';

/**
 * Zambia Property - Admin Analytics Page
 * 
 * Platform analytics with charts and trends
 */

import { useState, useEffect, useCallback } from 'react';
import { useRequireRole } from '@/contexts/AuthContext';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalProperties: number;
    totalViews: number;
    totalInquiries: number;
    activeListings: number;
    featuredListings: number;
    pendingApprovals: number;
    platformRevenue: number;
  };
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  propertiesByType: Record<string, number>;
  propertiesByListingType: Record<string, number>;
  propertiesByStatus: Record<string, number>;
  propertiesByProvince: Record<string, number>;
  trends: {
    period: string;
    newUsers: number;
    newProperties: number;
    views: number;
    inquiries: number;
  }[];
  topPerforming: {
    mostViewedProperties: Array<{
      id: string;
      title: string;
      views: number;
      city: string;
    }>;
    mostActiveAgents: Array<{
      id: string;
      name: string;
      listings: number;
      inquiries: number;
    }>;
  };
  recentActivity: {
    newUsersLast7Days: number;
    newPropertiesLast7Days: number;
    newInquiriesLast7Days: number;
  };
}

type TimeRange = '7d' | '30d' | '90d' | '1y';

export default function AdminAnalyticsPage() {
  const { isAuthorized, isLoading: authLoading } = useRequireRole(['ADMIN']);
  
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error?.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);
  
  useEffect(() => {
    if (isAuthorized) {
      fetchAnalytics();
    }
  }, [isAuthorized, fetchAnalytics]);
  
  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Calculate percentage for bar charts
  const getBarWidth = (value: number, max: number) => {
    return max > 0 ? Math.round((value / max) * 100) : 0;
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
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
          <p className="text-neutral-600">Platform performance and insights</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
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
      ) : data ? (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={formatNumber(data.overview.totalUsers)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              }
              color="blue"
              change={data.recentActivity.newUsersLast7Days}
              changeLabel="last 7 days"
            />
            <StatCard
              label="Total Properties"
              value={formatNumber(data.overview.totalProperties)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              color="green"
              change={data.recentActivity.newPropertiesLast7Days}
              changeLabel="last 7 days"
            />
            <StatCard
              label="Total Views"
              value={formatNumber(data.overview.totalViews)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              color="purple"
            />
            <StatCard
              label="Inquiries"
              value={formatNumber(data.overview.totalInquiries)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              color="orange"
              change={data.recentActivity.newInquiriesLast7Days}
              changeLabel="last 7 days"
            />
          </div>
          
          {/* Secondary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-neutral-100 p-4">
              <p className="text-sm text-neutral-500">Active Listings</p>
              <p className="text-xl font-bold text-neutral-900">{formatNumber(data.overview.activeListings)}</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-100 p-4">
              <p className="text-sm text-neutral-500">Featured Listings</p>
              <p className="text-xl font-bold text-amber-600">{formatNumber(data.overview.featuredListings)}</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-100 p-4">
              <p className="text-sm text-neutral-500">Pending Approvals</p>
              <p className="text-xl font-bold text-red-600">{formatNumber(data.overview.pendingApprovals)}</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-100 p-4">
              <p className="text-sm text-neutral-500">Est. Revenue</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(data.overview.platformRevenue)}</p>
            </div>
          </div>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Users by Role */}
            <ChartCard title="Users by Role">
              <BarChart
                data={Object.entries(data.usersByRole).map(([label, value]) => ({
                  label: label.replace('_', ' '),
                  value,
                }))}
                color="blue"
              />
            </ChartCard>
            
            {/* Users by Status */}
            <ChartCard title="Users by Status">
              <BarChart
                data={Object.entries(data.usersByStatus).map(([label, value]) => ({
                  label,
                  value,
                }))}
                color="green"
              />
            </ChartCard>
            
            {/* Properties by Type */}
            <ChartCard title="Properties by Type">
              <BarChart
                data={Object.entries(data.propertiesByType).map(([label, value]) => ({
                  label: label.replace(/_/g, ' '),
                  value,
                }))}
                color="purple"
              />
            </ChartCard>
            
            {/* Properties by Listing Type */}
            <ChartCard title="Properties by Listing Type">
              <BarChart
                data={Object.entries(data.propertiesByListingType).map(([label, value]) => ({
                  label,
                  value,
                }))}
                color="orange"
              />
            </ChartCard>
            
            {/* Properties by Province */}
            <ChartCard title="Properties by Province" className="md:col-span-2">
              <BarChart
                data={Object.entries(data.propertiesByProvince)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([label, value]) => ({
                    label,
                    value,
                  }))}
                color="teal"
              />
            </ChartCard>
          </div>
          
          {/* Trends */}
          {data.trends && data.trends.length > 0 && (
            <ChartCard title="Activity Trends">
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span>New Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span>New Properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-500" />
                    <span>Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-500" />
                    <span>Inquiries</span>
                  </div>
                </div>
                
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-100">
                        <th className="text-left py-2 font-medium text-neutral-600">Period</th>
                        <th className="text-right py-2 font-medium text-blue-600">Users</th>
                        <th className="text-right py-2 font-medium text-green-600">Properties</th>
                        <th className="text-right py-2 font-medium text-purple-600">Views</th>
                        <th className="text-right py-2 font-medium text-orange-600">Inquiries</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.trends.map((trend, idx) => (
                        <tr key={idx} className="border-b border-neutral-50">
                          <td className="py-2 text-neutral-900">{trend.period}</td>
                          <td className="text-right py-2 text-blue-600">{formatNumber(trend.newUsers)}</td>
                          <td className="text-right py-2 text-green-600">{formatNumber(trend.newProperties)}</td>
                          <td className="text-right py-2 text-purple-600">{formatNumber(trend.views)}</td>
                          <td className="text-right py-2 text-orange-600">{formatNumber(trend.inquiries)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ChartCard>
          )}
          
          {/* Top Performing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Viewed Properties */}
            <ChartCard title="Most Viewed Properties">
              <div className="space-y-3">
                {data.topPerforming.mostViewedProperties.length > 0 ? (
                  data.topPerforming.mostViewedProperties.map((property, idx) => (
                    <div key={property.id} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{property.title}</p>
                        <p className="text-xs text-neutral-500">{property.city}</p>
                      </div>
                      <span className="text-sm font-medium text-purple-600">{formatNumber(property.views)} views</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
                )}
              </div>
            </ChartCard>
            
            {/* Most Active Agents */}
            <ChartCard title="Most Active Agents">
              <div className="space-y-3">
                {data.topPerforming.mostActiveAgents.length > 0 ? (
                  data.topPerforming.mostActiveAgents.map((agent, idx) => (
                    <div key={agent.id} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">{agent.name}</p>
                        <p className="text-xs text-neutral-500">{agent.listings} listings • {agent.inquiries} inquiries</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
                )}
              </div>
            </ChartCard>
          </div>
        </>
      ) : null}
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon,
  color,
  change,
  changeLabel,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  change?: number;
  changeLabel?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  
  return (
    <div className="bg-white rounded-xl border border-neutral-100 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="text-xl font-bold text-neutral-900">{value}</p>
        </div>
      </div>
      {change !== undefined && (
        <p className="text-xs text-green-600 mt-2">
          +{change} {changeLabel}
        </p>
      )}
    </div>
  );
}

// Chart Card Component
function ChartCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-neutral-100 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Simple Bar Chart Component
function BarChart({
  data,
  color,
}: {
  data: { label: string; value: number }[];
  color: 'blue' | 'green' | 'purple' | 'orange' | 'teal';
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    teal: 'bg-teal-500',
  };
  
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-neutral-600 capitalize">{item.label.toLowerCase()}</span>
            <span className="text-neutral-900 font-medium">{item.value.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${colorClasses[color]} transition-all duration-500`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
