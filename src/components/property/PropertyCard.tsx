'use client';

/**
 * Zambia Property - Property Card Component
 * 
 * Airbnb-style card for displaying property listings
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatArea } from '@/lib/utils';

interface PropertyImage {
  id?: string;
  url: string;
  thumbnailUrl?: string;
  isPrimary?: boolean;
}

interface PropertyCardProps {
  id: string;
  slug: string;
  title: string;
  propertyType: string;
  listingType: 'SALE' | 'RENT';
  price: number;
  currency?: string;
  address?: string;
  city: string;
  province?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floorArea?: number | null;
  images: PropertyImage[];
  isFeatured?: boolean;
  viewCount?: number;
  owner?: {
    firstName: string;
    lastName: string;
  };
  className?: string;
}

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    className="w-6 h-6"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const propertyTypeLabels: Record<string, string> = {
  HOUSE: 'House',
  APARTMENT: 'Apartment',
  LAND: 'Land',
  COMMERCIAL: 'Commercial',
  LODGE: 'Lodge',
};

export function PropertyCard({
  slug,
  title,
  propertyType,
  listingType,
  price,
  currency = 'ZMW',
  city,
  province,
  bedrooms,
  bathrooms,
  floorArea,
  images,
  isFeatured,
  className = '',
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const primaryImage = images?.[currentImageIndex] || images?.[0];
  const imageUrl = imageError
    ? '/images/property-placeholder.jpg'
    : primaryImage?.thumbnailUrl || primaryImage?.url || '/images/property-placeholder.jpg';
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Generate a random rating between 4.5 and 5.0 for demo
  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  
  return (
    <Link
      href={`/properties/${slug}`}
      className={`group block ${className}`}
    >
      {/* Image Container - Square aspect ratio like Airbnb */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        
        {/* Image Navigation Arrows - Only show on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-1 transition-all hover:scale-110 ${
            isFavorite ? 'text-red-500' : 'text-white drop-shadow-md hover:text-red-400'
          }`}
        >
          <HeartIcon filled={isFavorite} />
        </button>
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white rounded-md text-xs font-medium text-gray-900">
            Guest favourite
          </div>
        )}
        
        {/* Listing Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
            listingType === 'SALE'
              ? 'bg-primary text-white'
              : 'bg-gold text-primary-dark'
          }`}>
            For {listingType === 'SALE' ? 'Sale' : 'Rent'}
          </span>
        </div>
        
        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Content - Minimal like Airbnb */}
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-gray-900 line-clamp-1">
            {city}{province ? `, ${province}` : ''}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm">{rating}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-1">{title}</p>
        
        <p className="text-gray-500 text-sm">
          {[
            bedrooms !== null && bedrooms !== undefined && `${bedrooms} bed`,
            bathrooms !== null && bathrooms !== undefined && `${bathrooms} bath`,
            floorArea !== null && floorArea !== undefined && formatArea(floorArea),
          ].filter(Boolean).join(' · ') || propertyTypeLabels[propertyType] || propertyType}
        </p>
        
        <p className="text-gray-900 pt-1">
          <span className="font-semibold">{formatPrice(price, currency)}</span>
          {listingType === 'RENT' && <span className="font-normal text-gray-500">/month</span>}
        </p>
      </div>
    </Link>
  );
}

export default PropertyCard;
