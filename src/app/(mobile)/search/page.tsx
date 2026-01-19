'use client';

/**
 * Premium Search Page
 * Advanced property search with filters - Mumbwa District
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, FadeInView, StaggerChildren, StaggerItem } from '@/components/mobile/PageTransition';
import { PropertyCardSkeleton } from '@/components/mobile/Skeleton';
import { SearchEmpty } from '@/components/mobile/EmptyState';
import MobilePropertyCard from '@/components/mobile/MobilePropertyCard';

// Alias for convenience
const PropertyCard = MobilePropertyCard;

// Mock properties - Mumbwa District Areas
const allProperties = [
  {
    id: '1',
    slug: 'modern-4-bedroom-house-mumbwa',
    title: 'Modern 4-Bedroom House',
    price: 550000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Plot 123, Main Street',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images: ['/properties/house-1.jpg'],
    isFeatured: true,
    propertyType: 'House',
  },
  {
    id: '2',
    slug: 'spacious-farm-house-nangoma',
    title: 'Spacious Farm House with Land',
    price: 850000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Nangoma Farming Area',
    city: 'Nangoma',
    province: 'Central',
    bedrooms: 4,
    bathrooms: 2,
    area: 200,
    images: ['/properties/farm-1.jpg'],
    isFeatured: true,
    propertyType: 'Farm',
  },
  {
    id: '3',
    slug: 'fertile-farm-land-kaindu',
    title: 'Fertile Farm Land - 50 Hectares',
    price: 1800000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Kaindu Farming Block',
    city: 'Kaindu',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 0,
    area: 500000,
    images: ['/properties/land-1.jpg'],
    isFeatured: true,
    propertyType: 'Farm',
  },
  {
    id: '4',
    slug: 'prime-commercial-plot-kasip',
    title: 'Prime Commercial Plot',
    price: 350000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Kasip Trading Area',
    city: 'Kasip',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 0,
    area: 2500,
    images: ['/properties/plot-1.jpg'],
    isFeatured: false,
    propertyType: 'Land',
  },
  {
    id: '5',
    slug: '3-bedroom-family-house-muembe',
    title: '3-Bedroom Family House',
    price: 280000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Muembe Area',
    city: 'Muembe',
    province: 'Central',
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    images: ['/properties/house-2.jpg'],
    isFeatured: false,
    propertyType: 'House',
  },
  {
    id: '6',
    slug: 'farm-land-20-hectares-banachewembwe',
    title: 'Farm Land - 20 Hectares',
    price: 650000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Banachewembwe Area',
    city: 'Banachewembwe',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 0,
    area: 200000,
    images: ['/properties/farm-2.jpg'],
    isFeatured: false,
    propertyType: 'Farm',
  },
  {
    id: '7',
    slug: '3-bedroom-house-rent-namukumbo',
    title: '3 Bedroom House for Rent',
    price: 2800,
    currency: 'ZMW',
    listingType: 'RENT' as const,
    address: 'Namukumbo Village',
    city: 'Namukumbo',
    province: 'Central',
    bedrooms: 3,
    bathrooms: 1,
    area: 110,
    images: ['/properties/house-3.jpg'],
    isFeatured: false,
    propertyType: 'House',
  },
  {
    id: '8',
    slug: 'small-farm-with-house-luiri',
    title: 'Small Farm with House',
    price: 320000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Luiri Farming Area',
    city: 'Luiri',
    province: 'Central',
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    images: ['/properties/farm-3.jpg'],
    isFeatured: false,
    propertyType: 'Farm',
  },
  {
    id: '9',
    slug: 'eco-lodge-blue-lagoon',
    title: 'Eco Lodge Near Blue Lagoon',
    price: 3800000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Blue Lagoon National Park Area',
    city: 'Blue Lagoon',
    province: 'Central',
    bedrooms: 12,
    bathrooms: 12,
    area: 600,
    images: ['/properties/lodge-1.jpg'],
    isFeatured: true,
    propertyType: 'Lodge',
  },
  {
    id: '10',
    slug: 'farm-with-house-shakumbila',
    title: 'Farm with House - Shakumbila',
    price: 580000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Shakumbila Area',
    city: 'Shakumbila',
    province: 'Central',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    images: ['/properties/farm-4.jpg'],
    isFeatured: false,
    propertyType: 'Farm',
  },
  {
    id: '11',
    slug: 'agricultural-land-chulwe',
    title: 'Agricultural Land - Chulwe',
    price: 420000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Chulwe Farming Area',
    city: 'Chulwe',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 0,
    area: 60000,
    images: ['/properties/land-2.jpg'],
    isFeatured: false,
    propertyType: 'Farm',
  },
  {
    id: '12',
    slug: 'large-farm-myooye',
    title: 'Large Farm in Myooye',
    price: 1500000,
    currency: 'ZMW',
    listingType: 'SALE' as const,
    address: 'Myooye Farming Block',
    city: 'Myooye',
    province: 'Central',
    bedrooms: 4,
    bathrooms: 2,
    area: 180,
    images: ['/properties/farm-5.jpg'],
    isFeatured: true,
    propertyType: 'Farm',
  },
];

const recentSearches = [
  'Mumbwa Town houses',
  'Farm land Kaindu',
  'Lodge Blue Lagoon',
  'Commercial property Kasip',
];

// Mumbwa District Areas
const popularLocations = [
  { name: 'Mumbwa Town', count: 85 },
  { name: 'Nangoma', count: 42 },
  { name: 'Kaindu', count: 28 },
  { name: 'Kasip', count: 35 },
  { name: 'Muembe', count: 22 },
  { name: 'Banachewembwe', count: 18 },
  { name: 'Namukumbo', count: 15 },
  { name: 'Luiri', count: 12 },
  { name: 'Blue Lagoon', count: 8 },
  { name: 'Shakumbila', count: 25 },
  { name: 'Chulwe', count: 10 },
  { name: 'Myooye', count: 20 },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof allProperties | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    listingType: 'all',
    propertyType: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'any',
  });

  // Simulate search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const results = allProperties.filter((property) => {
      const matchesQuery =
        property.title.toLowerCase().includes(query.toLowerCase()) ||
        property.city.toLowerCase().includes(query.toLowerCase()) ||
        property.propertyType.toLowerCase().includes(query.toLowerCase());

      const matchesListingType =
        filters.listingType === 'all' || property.listingType === filters.listingType;

      const matchesPropertyType =
        filters.propertyType === 'all' || property.propertyType === filters.propertyType;

      const matchesMinPrice =
        !filters.minPrice || property.price >= parseInt(filters.minPrice);

      const matchesMaxPrice =
        !filters.maxPrice || property.price <= parseInt(filters.maxPrice);

      const matchesBedrooms =
        filters.bedrooms === 'any' ||
        property.bedrooms >= parseInt(filters.bedrooms);

      return (
        matchesQuery &&
        matchesListingType &&
        matchesPropertyType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesBedrooms
      );
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setFilters({
      listingType: 'all',
      propertyType: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'any',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== 'all' && v !== 'any' && v !== ''
  ).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream pb-24">
        {/* Search Header */}
        <div className="bg-primary pt-12 pb-6 px-5 sticky top-0 z-20">
          <FadeInView>
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location, property type..."
                  className="w-full px-4 py-3.5 pl-12 bg-white rounded-2xl text-dark placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold shadow-soft"
                  autoFocus
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults(null);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(true)}
                className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft"
              >
                <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-dark text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </motion.button>
            </div>
          </FadeInView>
        </div>

        {/* Content */}
        <div className="px-5 pt-6">
          {!searchQuery && !searchResults ? (
            <>
              {/* Recent Searches */}
              <FadeInView>
                <div className="mb-6">
                  <h2 className="font-bold text-dark mb-3">Recent Searches</h2>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleQuickSearch(search)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm text-muted shadow-card hover:bg-primary/5 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </FadeInView>

              {/* Popular Locations */}
              <FadeInView delay={0.1}>
                <div>
                  <h2 className="font-bold text-dark mb-3">Popular Locations</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {popularLocations.map((location) => (
                      <button
                        key={location.name}
                        onClick={() => handleQuickSearch(location.name)}
                        className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-card hover:shadow-premium transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-dark">{location.name}</p>
                            <p className="text-xs text-muted">{location.count} properties</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </FadeInView>
            </>
          ) : isSearching ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <>
              <p className="text-sm text-muted mb-4">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </p>
              <StaggerChildren>
                <div className="space-y-4">
                  {searchResults.map((property) => (
                    <StaggerItem key={property.id}>
                      <PropertyCard
                        {...property}
                        isSaved={false}
                        onSaveToggle={() => {}}
                      />
                    </StaggerItem>
                  ))}
                </div>
              </StaggerChildren>
            </>
          ) : (
            <SearchEmpty />
          )}
        </div>

        {/* Filter Sheet */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-dark/50 z-40"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white px-5 pt-4 pb-3 border-b border-gray-100">
                  <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-dark">Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                <div className="px-5 py-6 space-y-6">
                  {/* Listing Type */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-3">Listing Type</label>
                    <div className="flex gap-2">
                      {['all', 'SALE', 'RENT'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilters((f) => ({ ...f, listingType: type }))}
                          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                            filters.listingType === type
                              ? 'bg-primary text-white'
                              : 'bg-cream text-muted'
                          }`}
                        >
                          {type === 'all' ? 'All' : type === 'SALE' ? 'For Sale' : 'For Rent'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-3">Property Type</label>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'House', 'Apartment', 'Land', 'Commercial'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilters((f) => ({ ...f, propertyType: type }))}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            filters.propertyType === type
                              ? 'bg-primary text-white'
                              : 'bg-cream text-muted'
                          }`}
                        >
                          {type === 'all' ? 'All Types' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-3">Price Range (ZMW)</label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                        placeholder="Min"
                        className="flex-1 px-4 py-3 bg-cream border border-gray-200 rounded-xl text-dark placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-muted self-center">to</span>
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                        placeholder="Max"
                        className="flex-1 px-4 py-3 bg-cream border border-gray-200 rounded-xl text-dark placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-3">Bedrooms</label>
                    <div className="flex gap-2">
                      {['any', '1', '2', '3', '4', '5'].map((num) => (
                        <button
                          key={num}
                          onClick={() => setFilters((f) => ({ ...f, bedrooms: num }))}
                          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                            filters.bedrooms === num
                              ? 'bg-primary text-white'
                              : 'bg-cream text-muted'
                          }`}
                        >
                          {num === 'any' ? 'Any' : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowFilters(false);
                      if (searchQuery) handleSearch(searchQuery);
                    }}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-semibold text-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
