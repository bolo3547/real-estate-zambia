/**
 * Zambia Property - Admin Layout
 * 
 * Enterprise-grade admin layout with:
 * - Responsive sidebar (desktop)
 * - Mobile bottom navigation
 * - Collapsible menu
 */

import { Navigation } from '@/components/navigation/Navigation';
import AdminSidebar from './components/AdminSidebar';
import AdminMobileNav from './components/AdminMobileNav';
import AdminHeader from './components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <div className="pt-20 min-h-screen bg-neutral-50">
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="fixed w-64 h-[calc(100vh-5rem)] overflow-y-auto bg-primary-dark scrollbar-thin scrollbar-thumb-white/20">
              <AdminSidebar />
            </div>
          </aside>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-[calc(100vh-5rem)]">
            {/* Admin Header (Mobile) */}
            <AdminHeader />
            
            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
              {children}
            </main>
          </div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <AdminMobileNav />
      </div>
    </>
  );
}
