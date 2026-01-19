'use client';

/**
 * Zambia Property - Navigation Component
 * 
 * Airbnb-style navigation bar
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Icons as inline SVG for optimization
const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

export function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Hide center search on homepage since it has its own hero search
  const isHomePage = pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menu on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [pathname]);
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white border-b border-gray-200'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">ZP</span>
            </div>
            <span className="font-bold text-xl text-primary hidden sm:block">
              zambia property
            </span>
          </Link>
          
          {/* Center Search - Desktop only, hidden on homepage */}
          {!isHomePage && (
            <div className="hidden lg:flex items-center">
              <button className="flex items-center gap-4 border border-gray-200 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium">Anywhere</span>
                <span className="w-px h-6 bg-gray-200" />
                <span className="text-sm font-medium">Any type</span>
                <span className="w-px h-6 bg-gray-200" />
                <span className="text-sm text-gray-400">Add price</span>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </button>
            </div>
          )}
          
          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* List Property Link */}
            <Link 
              href="/auth/register?role=LANDLORD"
              className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              List your property
            </Link>
            
            {/* Globe Icon */}
            <button className="hidden md:flex w-10 h-10 items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <GlobeIcon />
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 border border-gray-200 rounded-full p-1 pl-3 hover:shadow-md transition-shadow"
              >
                <MenuIcon />
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white">
                  {user ? (
                    <span className="text-sm font-medium">
                      {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <UserIcon />
                  )}
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {!user ? (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          Log in
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Sign up
                        </Link>
                        <div className="border-t border-gray-100 my-2" />
                        <Link
                          href="/auth/register?role=LANDLORD"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          List your property
                        </Link>
                        <Link
                          href="/help"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Help Center
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/listings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My listings
                        </Link>
                        <Link
                          href="/saved"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Saved properties
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Account settings
                        </Link>
                        <div className="border-t border-gray-100 my-2" />
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Log out
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
