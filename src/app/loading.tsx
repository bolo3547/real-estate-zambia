/**
 * Zambia Property - Loading Component
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
        <p className="text-neutral-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
