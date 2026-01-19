'use client';

/**
 * Home Search Bar Component
 * Airbnb-style search pill with functional search
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MUMBWA_AREAS, PROPERTY_TYPES } from '@/types';

interface HomeSearchBarProps {
  className?: string;
}

export function HomeSearchBar({ className = '' }: HomeSearchBarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<'location' | 'type' | 'price' | null>(null);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const priceRanges = [
    { label: 'Any price', value: '' },
    { label: 'Under K50,000', value: '0-50000' },
    { label: 'K50,000 - K100,000', value: '50000-100000' },
    { label: 'K100,000 - K250,000', value: '100000-250000' },
    { label: 'K250,000 - K500,000', value: '250000-500000' },
    { label: 'K500,000 - K1,000,000', value: '500000-1000000' },
    { label: 'Over K1,000,000', value: '1000000-999999999' },
    // Rent prices
    { label: 'Under K2,000/mo', value: '0-2000' },
    { label: 'K2,000 - K5,000/mo', value: '2000-5000' },
    { label: 'K5,000 - K10,000/mo', value: '5000-10000' },
    { label: 'Over K10,000/mo', value: '10000-999999' },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (location) {
      params.set('city', location);
    }
    if (propertyType) {
      params.set('propertyType', propertyType);
    }
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }

    const queryString = params.toString();
    router.push(`/properties${queryString ? `?${queryString}` : ''}`);
  };

  const getLocationLabel = () => {
    if (!location) return 'Anywhere';
    return location;
  };

  const getTypeLabel = () => {
    if (!propertyType) return 'Any type';
    const type = PROPERTY_TYPES.find(t => t.value === propertyType);
    return type?.label || propertyType;
  };

  const getPriceLabel = () => {
    if (!priceRange) return 'Price range';
    const range = priceRanges.find(r => r.value === priceRange);
    return range?.label || 'Price range';
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
        {/* Location Button */}
        <button
          onClick={() => setIsOpen(isOpen === 'location' ? null : 'location')}
          className={`px-6 py-3 text-sm font-medium rounded-full transition-colors ${
            isOpen === 'location' ? 'bg-gray-100' : 'hover:bg-gray-50'
          } ${location ? 'text-gray-800' : 'text-gray-600'}`}
        >
          {getLocationLabel()}
        </button>
        
        <span className="w-px h-6 bg-gray-200" />
        
        {/* Property Type Button */}
        <button
          onClick={() => setIsOpen(isOpen === 'type' ? null : 'type')}
          className={`px-6 py-3 text-sm font-medium rounded-full transition-colors ${
            isOpen === 'type' ? 'bg-gray-100' : 'hover:bg-gray-50'
          } ${propertyType ? 'text-gray-800' : 'text-gray-600'}`}
        >
          {getTypeLabel()}
        </button>
        
        <span className="w-px h-6 bg-gray-200" />
        
        {/* Price Range Button */}
        <button
          onClick={() => setIsOpen(isOpen === 'price' ? null : 'price')}
          className={`px-6 py-3 text-sm font-medium rounded-full transition-colors ${
            isOpen === 'price' ? 'bg-gray-100' : 'hover:bg-gray-50'
          } ${priceRange ? 'text-gray-800' : 'text-gray-400'}`}
        >
          {getPriceLabel()}
        </button>
        
        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="ml-2 p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Location Dropdown */}
      {isOpen === 'location' && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Location</h3>
          <div className="max-h-64 overflow-y-auto">
            <button
              onClick={() => { setLocation(''); setIsOpen(null); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !location ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
              }`}
            >
              Anywhere in Mumbwa
            </button>
            {MUMBWA_AREAS.map((area) => (
              <button
                key={area}
                onClick={() => { setLocation(area); setIsOpen(null); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  location === area ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Property Type Dropdown */}
      {isOpen === 'type' && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Property Type</h3>
          <div className="space-y-1">
            <button
              onClick={() => { setPropertyType(''); setIsOpen(null); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !propertyType ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
              }`}
            >
              Any type
            </button>
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => { setPropertyType(type.value); setIsOpen(null); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  propertyType === type.value ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Dropdown */}
      {isOpen === 'price' && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => { setPriceRange(range.value); setIsOpen(null); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  priceRange === range.value ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
