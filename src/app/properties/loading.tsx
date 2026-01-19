/**
 * Zambia Property - Properties Loading State
 */

export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-neutral-200 rounded-lg mb-4 animate-pulse" />
          <div className="h-6 w-48 bg-neutral-100 rounded animate-pulse" />
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-white rounded-full animate-pulse" />
          ))}
        </div>

        {/* Property grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-neutral-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse" />
                </div>
                <div className="h-6 w-24 bg-primary/20 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
