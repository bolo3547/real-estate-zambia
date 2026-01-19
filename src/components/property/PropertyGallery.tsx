'use client';

/**
 * Zambia Property - Property Image Gallery Component
 * 
 * Interactive image gallery with lightbox functionality
 */

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
}

interface PropertyGalleryProps {
  images: GalleryImage[];
  title?: string;
  className?: string;
}

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

export function PropertyGallery({
  images,
  title = 'Property Images',
  className = '',
}: PropertyGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);
  
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);
  
  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);
  
  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);
  
  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, closeLightbox, goToPrevious, goToNext]);
  
  if (images.length === 0) {
    return (
      <div className={`aspect-video bg-neutral-100 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center text-neutral-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No images available</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Gallery Grid */}
      <div className={`${className}`}>
        {images.length === 1 ? (
          // Single image layout
          <div
            className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={images[0].url}
              alt={title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              priority
              sizes="100vw"
            />
          </div>
        ) : images.length <= 3 ? (
          // 2-3 images layout
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer ${
                  images.length === 3 && index === 0 ? 'col-span-2' : ''
                }`}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.url}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
        ) : (
          // 4+ images layout - Featured layout
          <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px]">
            {/* Main Image */}
            <div
              className="relative col-span-2 row-span-2 rounded-l-2xl overflow-hidden cursor-pointer"
              onClick={() => openLightbox(0)}
            >
              <Image
                src={images[0].url}
                alt={`${title} - Main`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
                sizes="50vw"
              />
            </div>
            
            {/* Secondary Images */}
            {images.slice(1, 5).map((image, index) => (
              <div
                key={image.id}
                className={`relative overflow-hidden cursor-pointer ${
                  index === 1 ? 'rounded-tr-2xl' : ''
                } ${index === 3 ? 'rounded-br-2xl' : ''}`}
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={image.url}
                  alt={`${title} - Image ${index + 2}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="25vw"
                />
                
                {/* Show All Button */}
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-neutral-900 font-medium hover:bg-gold transition-colors">
                      <GridIcon />
                      +{images.length - 5} Photos
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* View All Button - for any layout */}
        {images.length > 1 && (
          <button
            onClick={() => openLightbox(0)}
            className="mt-4 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
          >
            <GridIcon />
            View all {images.length} photos
          </button>
        )}
      </div>
      
      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-white font-medium">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close gallery"
            >
              <CloseIcon />
            </button>
          </div>
          
          {/* Main Image */}
          <div className="absolute inset-0 flex items-center justify-center p-16">
            <div className="relative w-full h-full">
              <Image
                src={images[activeIndex].url}
                alt={images[activeIndex].caption || `${title} - Image ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex justify-center gap-2 overflow-x-auto py-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveIndex(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      index === activeIndex
                        ? 'ring-2 ring-gold'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image.thumbnailUrl || image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PropertyGallery;
