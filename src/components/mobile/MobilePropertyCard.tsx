'use client';

/**
 * MobilePropertyCard - Premium property card for mobile
 * Large images, rounded cards, smooth animations
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CompactContactBar } from './StickyContactBar';

interface PropertyCardProps {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency?: string;
  listingType: 'SALE' | 'RENT';
  address?: string;
  city: string;
  province: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isSaved?: boolean;
  agentPhone?: string;
  agentWhatsapp?: string;
  onSaveToggle?: () => void;
}

export default function MobilePropertyCard({
  id,
  slug,
  title,
  price,
  currency = 'ZMW',
  listingType,
  address,
  city,
  province,
  bedrooms,
  bathrooms,
  area,
  images,
  isFeatured = false,
  isNew = false,
  isSaved = false,
  agentPhone,
  agentWhatsapp,
  onSaveToggle,
}: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [saved, setSaved] = useState(isSaved);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    onSaveToggle?.();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-premium transition-shadow duration-300"
    >
      <Link href={`/properties/${slug}`}>
        {/* Image Section */}
        <div className="relative aspect-[4/3] bg-gray-100">
          <Image
            src={imageError ? '/placeholder-property.jpg' : (images[currentImage] || '/placeholder-property.jpg')}
            alt={title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              listingType === 'SALE' 
                ? 'bg-primary text-white' 
                : 'bg-gold text-dark'
            }`}>
              For {listingType === 'SALE' ? 'Sale' : 'Rent'}
            </span>
            {isFeatured && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-gold text-dark rounded-full">
                Featured
              </span>
            )}
            {isNew && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-white text-primary rounded-full">
                New
              </span>
            )}
          </div>

          {/* Save Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleSave}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft"
          >
            <motion.svg
              animate={{ scale: saved ? [1, 1.3, 1] : 1 }}
              className={`w-5 h-5 ${saved ? 'text-red-500 fill-red-500' : 'text-dark'}`}
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </motion.svg>
          </motion.button>

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {images.slice(0, 5).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImage ? 'w-4 bg-white' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-bold text-primary">{formatPrice(price)}</span>
            {listingType === 'RENT' && (
              <span className="text-sm text-muted">/month</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-dark text-base leading-tight mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted text-sm mb-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="truncate">{city}, {province}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-muted pb-3 border-b border-gray-100">
            {bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{bedrooms} bed</span>
              </div>
            )}
            {bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6V2h12v4M4 6h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                </svg>
                <span>{bathrooms} bath</span>
              </div>
            )}
            {area > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{area} m²</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Contact Buttons */}
      {agentPhone && (
        <div className="px-4 pb-4">
          <CompactContactBar phone={agentPhone} whatsapp={agentWhatsapp} />
        </div>
      )}
    </motion.div>
  );
}
