'use client';

/**
 * Zambia Property - Admin More Page
 * 
 * Additional navigation for mobile users
 */

import Link from 'next/link';
import { useRequireRole } from '@/contexts/AuthContext';

const menuItems = [
  {
    title: 'Analytics',
    description: 'View platform statistics and trends',
    href: '/admin/analytics',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Audit Logs',
    description: 'Track all administrative actions',
    href: '/admin/audit-logs',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Settings',
    description: 'Configure platform settings',
    href: '/admin/settings',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'bg-neutral-100 text-neutral-600',
  },
  {
    title: 'Pending Approvals',
    description: 'Review users and properties',
    href: '/admin/approvals',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-green-50 text-green-600',
  },
];

const quickActions = [
  {
    title: 'View Site',
    description: 'Open the public website',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    ),
  },
  {
    title: 'Support',
    description: 'Get help and documentation',
    href: '/help',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function AdminMorePage() {
  const { isAuthorized, isLoading: authLoading, user } = useRequireRole(['ADMIN']);
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthorized) return null;
  
  return (
    <div className="space-y-6 pb-20">
      {/* User Card */}
      <div className="bg-white rounded-xl border border-neutral-100 p-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-semibold text-primary">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-neutral-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
              Administrator
            </span>
          </div>
        </div>
      </div>
      
      {/* Menu Items */}
      <div>
        <h2 className="text-sm font-medium text-neutral-500 mb-3 px-1">ADMIN TOOLS</h2>
        <div className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 bg-white rounded-xl border border-neutral-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="font-medium text-neutral-900">{item.title}</p>
                <p className="text-sm text-neutral-500">{item.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-neutral-300 ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-medium text-neutral-500 mb-3 px-1">QUICK ACTIONS</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 bg-white rounded-xl border border-neutral-100 p-4 hover:shadow-md transition-shadow text-center"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{action.title}</p>
                <p className="text-xs text-neutral-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Version Info */}
      <div className="text-center py-4 text-xs text-neutral-400">
        <p>Zambia Property Admin v1.0.0</p>
        <p>© 2024 All rights reserved</p>
      </div>
    </div>
  );
}
