'use client';

/**
 * Zambia Property - Property Search/Filter Component
 * 
 * Reusable search and filter component for property listings
 */

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchFilters {
  propertyType?: string;
  listingType?: string;
  city?: string;
  province?: string;
  minPrice?: string;
  maxPrice?: string;
  minBedrooms?: string;
  search?: string;
  sortBy?: string;
}

interface PropertySearchProps {
  variant?: 'hero' | 'sidebar' | 'inline';
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const propertyTypes = [
  { value: '', label: 'All Property Types' },
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'LAND', label: 'Land & Plots' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LODGE', label: 'Lodge/Hotel' },
];

const listingTypes = [
  { value: '', label: 'Buy or Rent' },
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
];

const mumbwaAreas = [
  { value: '', label: 'All Areas in Mumbwa' },
  { value: 'Mumbwa Town', label: 'Mumbwa Town' },
  { value: 'Nangoma', label: 'Nangoma' },
  { value: 'Kaindu', label: 'Kaindu' },
  { value: 'Kasip', label: 'Kasip' },
  { value: 'Muembe', label: 'Muembe' },
  { value: 'Shakumbila', label: 'Shakumbila' },
  { value: 'Myooye', label: 'Myooye' },
  { value: 'Banachewembwe', label: 'Banachewembwe' },
  { value: 'Namukumbo', label: 'Namukumbo' },
  { value: 'Luiri', label: 'Luiri' },
  { value: 'Blue Lagoon', label: 'Blue Lagoon' },
  { value: 'Chulwe', label: 'Chulwe' },
];

const priceRanges = [
  { value: '', label: 'Any Price' },
  { value: '0-500000', label: 'Under K500,000' },
  { value: '500000-1000000', label: 'K500,000 - K1,000,000' },
  { value: '1000000-2500000', label: 'K1,000,000 - K2,500,000' },
  { value: '2500000-5000000', label: 'K2,500,000 - K5,000,000' },
  { value: '5000000-', label: 'Over K5,000,000' },
];

const bedroomOptions = [
  { value: '', label: 'Any Bedrooms' },
  { value: '1', label: '1+ Bedroom' },
  { value: '2', label: '2+ Bedrooms' },
  { value: '3', label: '3+ Bedrooms' },
  { value: '4', label: '4+ Bedrooms' },
  { value: '5', label: '5+ Bedrooms' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export function PropertySearch({
  variant = 'hero',
  onSearch,
  className = '',
}: PropertySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: searchParams.get('propertyType') || '',
    listingType: searchParams.get('listingType') || '',
    city: searchParams.get('city') || '',
    province: searchParams.get('province') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBedrooms: searchParams.get('minBedrooms') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });
  
  const handleChange = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);
  
  const handlePriceRangeChange = useCallback((value: string) => {
    const [min, max] = value.split('-');
    setFilters((prev) => ({
      ...prev,
      minPrice: min || '',
      maxPrice: max || '',
    }));
  }, []);
  
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    if (onSearch) {
      onSearch(filters);
    } else {
      router.push(`/properties?${params.toString()}`);
    }
  }, [filters, onSearch, router]);
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);
  
  if (variant === 'hero') {
    return (
      <div className={`bg-white rounded-2xl shadow-premium p-6 ${className}`}>
        {/* Listing Type Tabs */}
        <div className="flex gap-4 mb-6">
          {['', 'SALE', 'RENT'].map((type) => (
            <button
              key={type}
              onClick={() => handleChange('listingType', type)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filters.listingType === type
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {type === '' ? 'All' : type === 'SALE' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>
        
        {/* Main Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search location, property name..."
                value={filters.search}
                onChange={(e) => handleChange('search', e.target.value)}
                onKeyPress={handleKeyPress}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Property Type */}
          <div>
            <select
              value={filters.propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              className="input w-full"
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Area */}
          <div>
            <select
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="input w-full"
            >
              {mumbwaAreas.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors"
          >
            <FilterIcon />
            <span className="text-sm font-medium">
              {showAdvanced ? 'Hide' : 'More'} Filters
            </span>
          </button>
          
          <button onClick={handleSearch} className="btn btn-primary px-8">
            Search Properties
          </button>
        </div>
        
        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm text-neutral-600 mb-1">Price Range</label>
              <select
                value={`${filters.minPrice}-${filters.maxPrice}`}
                onChange={(e) => handlePriceRangeChange(e.target.value)}
                className="input w-full"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 mb-1">Bedrooms</label>
              <select
                value={filters.minBedrooms}
                onChange={(e) => handleChange('minBedrooms', e.target.value)}
                className="input w-full"
              >
                {bedroomOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 mb-1">City</label>
              <input
                type="text"
                placeholder="Enter city name"
                value={filters.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`bg-white rounded-xl shadow-premium-sm p-6 ${className}`}>
        <h3 className="font-semibold text-lg text-neutral-900 mb-4">Filter Properties</h3>
        
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Property name or location"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              onKeyPress={handleKeyPress}
              className="input w-full"
            />
          </div>
          
          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Listing Type
            </label>
            <select
              value={filters.listingType}
              onChange={(e) => handleChange('listingType', e.target.value)}
              className="input w-full"
            >
              {listingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              className="input w-full"
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Area
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="input w-full"
            >
              {mumbwaAreas.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              City
            </label>
            <input
              type="text"
              placeholder="Enter city name"
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="input w-full"
            />
          </div>
          
          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Bedrooms
            </label>
            <select
              value={filters.minBedrooms}
              onChange={(e) => handleChange('minBedrooms', e.target.value)}
              className="input w-full"
            >
              {bedroomOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className="input w-full"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>
          
          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              className="input w-full"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Search Button */}
          <button onClick={handleSearch} className="btn btn-primary w-full">
            Apply Filters
          </button>
          
          {/* Reset Button */}
          <button
            onClick={() => {
              setFilters({
                propertyType: '',
                listingType: '',
                city: '',
                province: '',
                minPrice: '',
                maxPrice: '',
                minBedrooms: '',
                search: '',
                sortBy: 'newest',
              });
            }}
            className="btn btn-outline w-full"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }
  
  // Inline variant (for property list page header)
  return (
    <div className={`flex flex-wrap gap-4 items-center ${className}`}>
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search properties..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            onKeyPress={handleKeyPress}
            className="input pl-10 w-full"
          />
        </div>
      </div>
      
      <select
        value={filters.listingType}
        onChange={(e) => handleChange('listingType', e.target.value)}
        className="input"
      >
        {listingTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      
      <select
        value={filters.propertyType}
        onChange={(e) => handleChange('propertyType', e.target.value)}
        className="input"
      >
        {propertyTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      
      <select
        value={filters.sortBy}
        onChange={(e) => handleChange('sortBy', e.target.value)}
        className="input"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <button onClick={handleSearch} className="btn btn-primary">
        <SearchIcon />
        Search
      </button>
    </div>
  );
}

export default PropertySearch;
