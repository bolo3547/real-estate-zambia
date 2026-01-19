'use client';

/**
 * Zambia Property - Dashboard Sidebar
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const InquiriesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const navItems = {
  AGENT: [
    { icon: DashboardIcon, label: 'Dashboard', href: '/dashboard' },
    { icon: ListingsIcon, label: 'My Listings', href: '/dashboard/listings' },
    { icon: AddIcon, label: 'Add Property', href: '/dashboard/listings/new' },
    { icon: InquiriesIcon, label: 'Inquiries', href: '/dashboard/inquiries' },
    { icon: AnalyticsIcon, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: ProfileIcon, label: 'Profile', href: '/dashboard/profile' },
    { icon: SettingsIcon, label: 'Settings', href: '/dashboard/settings' },
  ],
  LANDLORD: [
    { icon: DashboardIcon, label: 'Dashboard', href: '/dashboard' },
    { icon: ListingsIcon, label: 'My Properties', href: '/dashboard/listings' },
    { icon: AddIcon, label: 'Add Property', href: '/dashboard/listings/new' },
    { icon: InquiriesIcon, label: 'Inquiries', href: '/dashboard/inquiries' },
    { icon: ProfileIcon, label: 'Profile', href: '/dashboard/profile' },
    { icon: SettingsIcon, label: 'Settings', href: '/dashboard/settings' },
  ],
  PUBLIC: [
    { icon: DashboardIcon, label: 'Dashboard', href: '/dashboard' },
    { icon: InquiriesIcon, label: 'My Inquiries', href: '/dashboard/inquiries' },
    { icon: ProfileIcon, label: 'Profile', href: '/dashboard/profile' },
    { icon: SettingsIcon, label: 'Settings', href: '/dashboard/settings' },
  ],
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const role = user.role as keyof typeof navItems;
  const items = navItems[role] || navItems.PUBLIC;
  
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };
  
  return (
    <nav className="bg-white rounded-2xl shadow-premium-sm p-4">
      {/* User Info */}
      <div className="flex items-center gap-3 p-3 mb-4 bg-cream rounded-xl">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-primary">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900 truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-neutral-500">{user.role}</p>
        </div>
      </div>
      
      {/* Navigation Items */}
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-neutral-600 hover:bg-cream hover:text-neutral-900'
                }`}
              >
                <Icon />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
