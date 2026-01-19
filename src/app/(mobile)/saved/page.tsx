'use client';

/**
 * Premium Saved Properties Page
 * User's favorite properties
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, FadeInView, StaggerChildren, StaggerItem } from '@/components/mobile/PageTransition';
import { NoSavedProperties } from '@/components/mobile/EmptyState';

// Mock saved properties
const initialSavedProperties = [
  {
    id: '1',
    title: 'Luxury 5-Bedroom Villa with Pool',
    price: 450000,
    listingType: 'SALE' as const,
    city: 'Kabulonga',
    province: 'Lusaka',
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Modern 3-Bed Apartment with City View',
    price: 1800,
    listingType: 'RENT' as const,
    city: 'Rhodespark',
    province: 'Lusaka',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Spacious Family Home in Quiet Neighborhood',
    price: 320000,
    listingType: 'SALE' as const,
    city: 'Woodlands',
    province: 'Lusaka',
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
  },
];

export default function SavedPage() {
  const [savedProperties, setSavedProperties] = useState(initialSavedProperties);
  const [filter, setFilter] = useState<'all' | 'SALE' | 'RENT'>('all');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setSavedProperties((prev) => prev.filter((p) => p.id !== id));
    setShowRemoveConfirm(null);
  };

  const filteredProperties = savedProperties.filter((property) => {
    if (filter === 'all') return true;
    return property.listingType === filter;
  });

  const saleCount = savedProperties.filter((p) => p.listingType === 'SALE').length;
  const rentCount = savedProperties.filter((p) => p.listingType === 'RENT').length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream pb-24">
        {/* Header */}
        <div className="bg-primary pt-12 pb-6 px-5">
          <FadeInView>
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/"
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">Saved Properties</h1>
                <p className="text-white/70 text-sm">{savedProperties.length} properties saved</p>
              </div>
            </div>
          </FadeInView>
        </div>

        {/* Filter Tabs */}
        {savedProperties.length > 0 && (
          <div className="px-5 py-4">
            <div className="flex bg-white rounded-2xl p-1 shadow-card">
              {[
                { key: 'all', label: 'All', count: savedProperties.length },
                { key: 'SALE', label: 'For Sale', count: saleCount },
                { key: 'RENT', label: 'For Rent', count: rentCount },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as typeof filter)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-1 ${
                    filter === tab.key
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-dark'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs ${filter === tab.key ? 'opacity-70' : ''}`}>
                    ({tab.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Properties List */}
        <div className="px-5">
          {filteredProperties.length > 0 ? (
            <StaggerChildren>
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredProperties.map((property) => (
                    <StaggerItem key={property.id}>
                      <motion.div
                        layout
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="relative"
                      >
                        {/* Property Card */}
                        <Link
                          href={`/properties/${property.id}`}
                          className="block bg-white rounded-3xl overflow-hidden shadow-soft"
                        >
                          <div className="flex">
                            <div className="relative w-32 h-28">
                              <Image
                                src={property.image}
                                alt={property.title}
                                fill
                                className="object-cover"
                              />
                              <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                                property.listingType === 'SALE' ? 'bg-primary text-white' : 'bg-gold text-dark'
                              }`}>
                                {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                              </span>
                            </div>
                            <div className="flex-1 p-3">
                              <h3 className="font-semibold text-dark text-sm line-clamp-1">{property.title}</h3>
                              <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {property.city}, {property.province}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                                <span>{property.bedrooms} beds</span>
                                <span>•</span>
                                <span>{property.bathrooms} baths</span>
                                <span>•</span>
                                <span>{property.area}m²</span>
                              </div>
                              <p className="text-primary font-bold text-sm mt-2">
                                ${property.price.toLocaleString()}
                                {property.listingType === 'RENT' && <span className="font-normal text-muted">/mo</span>}
                              </p>
                            </div>
                          </div>
                        </Link>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => setShowRemoveConfirm(property.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-soft"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>

                        {/* Remove Confirmation */}
                        <AnimatePresence>
                          {showRemoveConfirm === property.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-dark/90 backdrop-blur-sm rounded-3xl flex items-center justify-center p-4"
                            >
                              <div className="text-center">
                                <p className="text-white font-medium mb-4">
                                  Remove from saved?
                                </p>
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => setShowRemoveConfirm(null)}
                                    className="px-6 py-2 bg-white/20 text-white rounded-xl text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleRemove(property.id)}
                                    className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </AnimatePresence>
              </div>
            </StaggerChildren>
          ) : savedProperties.length === 0 ? (
            <div className="pt-8">
              <NoSavedProperties />
            </div>
          ) : (
            <div className="pt-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-muted">No {filter === 'SALE' ? 'sale' : 'rental'} properties saved</p>
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-primary font-medium"
              >
                View all saved
              </button>
            </div>
          )}
        </div>

        {/* Tip Card */}
        {savedProperties.length > 0 && (
          <div className="px-5 mt-8">
            <FadeInView>
              <div className="bg-gold/10 rounded-2xl p-5">
                <div className="flex gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-semibold text-dark mb-1">Pro Tip</p>
                    <p className="text-sm text-muted">
                      Set up search alerts to get notified when new properties matching your criteria are listed.
                    </p>
                    <Link
                      href="/alerts/create"
                      className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-2"
                    >
                      Create alert
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
