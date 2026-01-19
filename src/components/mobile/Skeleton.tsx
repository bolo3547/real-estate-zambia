'use client';

/**
 * Skeleton - Premium shimmer loading states
 * Luxury aesthetic with soft animations
 */

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-2xl',
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Property Card Skeleton
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <Skeleton variant="text" className="w-32 h-6" />
        
        {/* Title */}
        <Skeleton variant="text" className="w-full h-5" />
        <Skeleton variant="text" className="w-3/4 h-5" />
        
        {/* Location */}
        <Skeleton variant="text" className="w-1/2 h-4" />
        
        {/* Features */}
        <div className="flex gap-4 pt-2">
          <Skeleton variant="text" className="w-12 h-4" />
          <Skeleton variant="text" className="w-12 h-4" />
          <Skeleton variant="text" className="w-16 h-4" />
        </div>
      </div>
    </div>
  );
}

// Property Details Skeleton
export function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Image gallery skeleton */}
      <Skeleton className="aspect-[4/3] w-full" />
      
      <div className="px-5 py-6 space-y-6">
        {/* Price & badges */}
        <div className="flex items-center gap-2">
          <Skeleton variant="rounded" className="w-20 h-7" />
          <Skeleton variant="rounded" className="w-16 h-7" />
        </div>
        
        {/* Title */}
        <Skeleton variant="text" className="w-full h-7" />
        <Skeleton variant="text" className="w-2/3 h-5" />
        
        {/* Features grid */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" className="h-20" />
          ))}
        </div>
        
        {/* Description */}
        <Skeleton variant="rounded" className="w-full h-32" />
        
        {/* Amenities */}
        <Skeleton variant="rounded" className="w-full h-40" />
        
        {/* Agent */}
        <Skeleton variant="rounded" className="w-full h-24" />
      </div>
    </div>
  );
}

// Agent Card Skeleton
export function AgentCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Skeleton variant="rounded" className="w-16 h-16 flex-shrink-0" />
        
        {/* Info */}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-32 h-5" />
          <Skeleton variant="text" className="w-24 h-4" />
          <div className="flex gap-2">
            <Skeleton variant="rounded" className="w-12 h-4" />
            <Skeleton variant="rounded" className="w-16 h-4" />
          </div>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <Skeleton variant="rounded" className="flex-1 h-10" />
        <Skeleton variant="rounded" className="flex-1 h-10" />
      </div>
    </div>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="w-20 h-20" />
        <div className="space-y-2">
          <Skeleton variant="text" className="w-32 h-6" />
          <Skeleton variant="text" className="w-24 h-4" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" className="h-20" />
        ))}
      </div>
      
      {/* Actions */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" className="h-14" />
        ))}
      </div>
    </div>
  );
}
