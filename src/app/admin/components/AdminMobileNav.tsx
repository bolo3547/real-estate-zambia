'use client';

/**
 * Zambia Property - Admin Mobile Bottom Navigation
 * 
 * Fixed bottom navigation for mobile devices
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-gold' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    label: 'Dashboard',
    href: '/admin',
  },
  {
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-gold' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    label: 'Users',
    href: '/admin/users',
  },
  {
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-gold' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Approvals',
    href: '/admin/approvals',
  },
  {
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-gold' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    label: 'Properties',
    href: '/admin/properties',
  },
  {
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-gold' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
    label: 'More',
    href: '/admin/more',
  },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    if (href === '/admin/more') {
      return pathname.startsWith('/admin/analytics') || 
             pathname.startsWith('/admin/settings') || 
             pathname.startsWith('/admin/featured') ||
             pathname.startsWith('/admin/audit-logs');
    }
    return pathname.startsWith(href);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-primary-dark border-t border-white/10 lg:hidden z-50 safe-area-pb">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-gold' : 'text-white/70'
              }`}
            >
              {item.icon(active)}
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <span className="absolute top-0 w-8 h-1 bg-gold rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
