/**
 * Zambia Property - Dashboard Loading State
 */

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar skeleton */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-100 p-4">
        <div className="h-10 bg-neutral-100 rounded-lg mb-8 animate-pulse" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="ml-64 p-8">
        <div className="h-8 w-48 bg-neutral-200 rounded-lg mb-8 animate-pulse" />
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="h-4 w-20 bg-neutral-100 rounded mb-4 animate-pulse" />
              <div className="h-8 w-32 bg-neutral-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Table skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="h-6 w-40 bg-neutral-200 rounded mb-6 animate-pulse" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
