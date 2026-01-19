/**
 * Mobile Layout
 * Wrapper with bottom navigation for mobile-first experience
 */

import BottomNav from '@/components/mobile/BottomNav';

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      {children}
      <BottomNav />
    </div>
  );
}
