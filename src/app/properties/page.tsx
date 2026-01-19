/**
 * Zambia Property - Properties Listing Page
 * 
 * Browse all properties with filtering - Mumbwa District Focus
 */

import { Suspense } from 'react';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertySearch } from '@/components/property/PropertySearch';
import Link from 'next/link';

interface SearchParams {
  propertyType?: string;
  listingType?: string;
  city?: string;
  province?: string;
  minPrice?: string;
  maxPrice?: string;
  minBedrooms?: string;
  search?: string;
  sortBy?: string;
  page?: string;
  featured?: string;
}

// Comprehensive mock data for all property types in Mumbwa District
const allMockProperties = [
  // HOUSES
  {
    id: '1',
    slug: 'modern-house-mumbwa-town',
    title: 'Modern Family House',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: 450000,
    currency: 'ZMW',
    address: 'Mumbwa Town Centre',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 4,
    bathrooms: 2,
    floorArea: 220,
    images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 245,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '2',
    slug: 'rental-house-nangoma',
    title: '3-Bedroom House for Rent',
    propertyType: 'HOUSE',
    listingType: 'RENT',
    price: 4500,
    currency: 'ZMW',
    address: 'Nangoma Area',
    city: 'Nangoma',
    province: 'Central',
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 150,
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 128,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '9',
    slug: 'executive-house-mumbwa',
    title: 'Executive 5-Bed House',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: 680000,
    currency: 'ZMW',
    address: 'Mumbwa Town',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 5,
    bathrooms: 3,
    floorArea: 320,
    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 312,
    isNew: true,
    isLuxury: true,
  },
  {
    id: '6',
    slug: 'house-muembe',
    title: 'Cozy 2-Bedroom House',
    propertyType: 'HOUSE',
    listingType: 'RENT',
    price: 3000,
    currency: 'ZMW',
    address: 'Muembe Settlement',
    city: 'Muembe',
    province: 'Central',
    bedrooms: 2,
    bathrooms: 1,
    floorArea: 85,
    images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 89,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '11',
    slug: 'house-namukumbo',
    title: 'Spacious Family Home',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: 320000,
    currency: 'ZMW',
    address: 'Namukumbo Settlement',
    city: 'Namukumbo',
    province: 'Central',
    bedrooms: 4,
    bathrooms: 2,
    floorArea: 180,
    images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 156,
    isNew: true,
    isLuxury: false,
  },
  // APARTMENTS
  {
    id: '16',
    slug: 'modern-apartment-mumbwa',
    title: 'Modern 2-Bed Apartment',
    propertyType: 'APARTMENT',
    listingType: 'RENT',
    price: 5500,
    currency: 'ZMW',
    address: 'Mumbwa Town Centre',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 2,
    bathrooms: 1,
    floorArea: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 201,
    isNew: true,
    isLuxury: false,
  },
  {
    id: '17',
    slug: 'studio-apartment-mumbwa',
    title: 'Studio Apartment for Rent',
    propertyType: 'APARTMENT',
    listingType: 'RENT',
    price: 2800,
    currency: 'ZMW',
    address: 'Near M9 Highway',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 1,
    bathrooms: 1,
    floorArea: 35,
    images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 145,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '18',
    slug: 'luxury-apartment-mumbwa',
    title: 'Luxury 3-Bed Apartment',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    price: 380000,
    currency: 'ZMW',
    address: 'Mumbwa Town',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 120,
    images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 289,
    isNew: true,
    isLuxury: true,
  },
  // LAND
  {
    id: '4',
    slug: 'commercial-plot-kasip',
    title: 'Prime Commercial Plot',
    propertyType: 'LAND',
    listingType: 'SALE',
    price: 350000,
    currency: 'ZMW',
    address: 'Kasip Trading Area',
    city: 'Kasip',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 0,
    floorArea: 2500,
    images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 178,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '8',
    slug: 'residential-plot-myooye',
    title: 'Residential Plot - 1 Acre',
    propertyType: 'LAND',
    listingType: 'SALE',
    price: 180000,
    currency: 'ZMW',
    address: 'Myooye Area',
    city: 'Myooye',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 0,
    floorArea: 4047,
    images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 134,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '12',
    slug: 'mining-land-luiri',
    title: 'Mining Land Near Luiri',
    propertyType: 'LAND',
    listingType: 'SALE',
    price: 5000000,
    currency: 'ZMW',
    address: 'Luiri Gold Mine Area',
    city: 'Luiri',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 0,
    floorArea: 100000,
    images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 456,
    isNew: false,
    isLuxury: true,
  },
  {
    id: '19',
    slug: 'land-nangoma-5-acres',
    title: '5-Acre Plot in Nangoma',
    propertyType: 'LAND',
    listingType: 'SALE',
    price: 420000,
    currency: 'ZMW',
    address: 'Nangoma',
    city: 'Nangoma',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 0,
    floorArea: 20235,
    images: [{ url: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 167,
    isNew: true,
    isLuxury: false,
  },
  // COMMERCIAL
  {
    id: '14',
    slug: 'commercial-mumbwa-m9',
    title: 'Commercial Property on M9 Road',
    propertyType: 'COMMERCIAL',
    listingType: 'SALE',
    price: 950000,
    currency: 'ZMW',
    address: 'M9 Highway, Mumbwa',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 2,
    floorArea: 500,
    images: [{ url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 234,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '20',
    slug: 'shop-mumbwa-centre',
    title: 'Shop Space for Rent',
    propertyType: 'COMMERCIAL',
    listingType: 'RENT',
    price: 8000,
    currency: 'ZMW',
    address: 'Mumbwa Town Centre',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 1,
    floorArea: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 189,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '21',
    slug: 'warehouse-kasip',
    title: 'Large Warehouse Space',
    propertyType: 'COMMERCIAL',
    listingType: 'SALE',
    price: 780000,
    currency: 'ZMW',
    address: 'Kasip Trading Area',
    city: 'Kasip',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 1,
    floorArea: 800,
    images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 145,
    isNew: true,
    isLuxury: false,
  },
  {
    id: '22',
    slug: 'office-building-mumbwa',
    title: 'Office Building for Sale',
    propertyType: 'COMMERCIAL',
    listingType: 'SALE',
    price: 1200000,
    currency: 'ZMW',
    address: 'Mumbwa Town',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 4,
    floorArea: 400,
    images: [{ url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 278,
    isNew: false,
    isLuxury: true,
  },
  // FARMS
  {
    id: '3',
    slug: 'farm-land-kaindu',
    title: 'Fertile Farm Land - 50 Hectares',
    propertyType: 'FARM',
    listingType: 'SALE',
    price: 1800000,
    currency: 'ZMW',
    address: 'Kaindu Farming Block',
    city: 'Kaindu',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 0,
    floorArea: 500000,
    images: [{ url: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 367,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '7',
    slug: 'cotton-farm-shakumbila',
    title: 'Cotton Farm with Farmhouse',
    propertyType: 'FARM',
    listingType: 'SALE',
    price: 3200000,
    currency: 'ZMW',
    address: 'Shakumbila Chiefdom',
    city: 'Shakumbila',
    province: 'Central',
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 800000,
    images: [{ url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 412,
    isNew: false,
    isLuxury: true,
  },
  {
    id: '15',
    slug: 'farm-banachewembwe',
    title: 'Mixed Farming Land - 30 Ha',
    propertyType: 'FARM',
    listingType: 'SALE',
    price: 1200000,
    currency: 'ZMW',
    address: 'Banachewembwe Area',
    city: 'Banachewembwe',
    province: 'Central',
    bedrooms: 2,
    bathrooms: 1,
    floorArea: 300000,
    images: [{ url: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 234,
    isNew: false,
    isLuxury: false,
  },
  {
    id: '23',
    slug: 'poultry-farm-myooye',
    title: 'Poultry Farm with Equipment',
    propertyType: 'FARM',
    listingType: 'SALE',
    price: 850000,
    currency: 'ZMW',
    address: 'Myooye Area',
    city: 'Myooye',
    province: 'Central',
    bedrooms: 2,
    bathrooms: 1,
    floorArea: 50000,
    images: [{ url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 189,
    isNew: true,
    isLuxury: false,
  },
  // LODGES
  {
    id: '5',
    slug: 'lodge-blue-lagoon',
    title: 'Safari Lodge Near Blue Lagoon',
    propertyType: 'LODGE',
    listingType: 'SALE',
    price: 2500000,
    currency: 'ZMW',
    address: 'Blue Lagoon National Park',
    city: 'Blue Lagoon',
    province: 'Central',
    bedrooms: 8,
    bathrooms: 8,
    floorArea: 600,
    images: [{ url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 523,
    isNew: false,
    isLuxury: true,
  },
  {
    id: '10',
    slug: 'fishing-camp-chulwe',
    title: 'Fishing Camp Property',
    propertyType: 'LODGE',
    listingType: 'SALE',
    price: 1500000,
    currency: 'ZMW',
    address: 'Chulwe Fishing Camp',
    city: 'Chulwe',
    province: 'Central',
    bedrooms: 6,
    bathrooms: 6,
    floorArea: 400,
    images: [{ url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 345,
    isNew: false,
    isLuxury: true,
  },
  {
    id: '24',
    slug: 'guesthouse-mumbwa',
    title: 'Guest House - 10 Rooms',
    propertyType: 'LODGE',
    listingType: 'SALE',
    price: 1800000,
    currency: 'ZMW',
    address: 'Mumbwa Town',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 10,
    bathrooms: 10,
    floorArea: 450,
    images: [{ url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 298,
    isNew: true,
    isLuxury: false,
  },
  {
    id: '25',
    slug: 'eco-lodge-kafue-river',
    title: 'Eco Lodge on Kafue River',
    propertyType: 'LODGE',
    listingType: 'SALE',
    price: 3500000,
    currency: 'ZMW',
    address: 'Kafue River Area',
    city: 'Blue Lagoon',
    province: 'Central',
    bedrooms: 12,
    bathrooms: 12,
    floorArea: 800,
    images: [{ url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 567,
    isNew: false,
    isLuxury: true,
  },
  // LUXURY PROPERTIES (Mixed types marked as luxury)
  {
    id: '26',
    slug: 'luxury-villa-mumbwa',
    title: 'Luxury Villa with Pool',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: 1500000,
    currency: 'ZMW',
    address: 'Mumbwa Town Premium Area',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 5,
    bathrooms: 4,
    floorArea: 450,
    images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 678,
    isNew: false,
    isLuxury: true,
  },
  {
    id: '27',
    slug: 'premium-penthouse-mumbwa',
    title: 'Premium Penthouse Suite',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    price: 890000,
    currency: 'ZMW',
    address: 'Mumbwa Town Centre',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 4,
    bathrooms: 3,
    floorArea: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isPrimary: true }],
    isFeatured: true,
    viewCount: 445,
    isNew: true,
    isLuxury: true,
  },
  // NEW BUILDS
  {
    id: '28',
    slug: 'new-townhouse-mumbwa',
    title: 'Brand New Townhouse',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: 520000,
    currency: 'ZMW',
    address: 'Mumbwa New Development',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 160,
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 234,
    isNew: true,
    isLuxury: false,
  },
  {
    id: '29',
    slug: 'new-apartments-complex',
    title: 'New Apartment Complex Unit',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    price: 280000,
    currency: 'ZMW',
    address: 'Mumbwa Modern Estate',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 2,
    bathrooms: 1,
    floorArea: 85,
    images: [{ url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 189,
    isNew: true,
    isLuxury: false,
  },
  {
    id: '30',
    slug: 'new-commercial-building',
    title: 'Newly Built Commercial Space',
    propertyType: 'COMMERCIAL',
    listingType: 'RENT',
    price: 12000,
    currency: 'ZMW',
    address: 'M9 Highway',
    city: 'Mumbwa Town',
    province: 'Central',
    bedrooms: 0,
    bathrooms: 2,
    floorArea: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', isPrimary: true }],
    isFeatured: false,
    viewCount: 156,
    isNew: true,
    isLuxury: false,
  },
];

function getProperties(searchParams: SearchParams) {
  let filtered = [...allMockProperties];

  // Filter by property type
  if (searchParams.propertyType) {
    if (searchParams.propertyType === 'LUXURY') {
      filtered = allMockProperties.filter(p => p.isLuxury);
    } else if (searchParams.propertyType === 'NEW_BUILD') {
      filtered = allMockProperties.filter(p => p.isNew);
    } else {
      filtered = filtered.filter(p => p.propertyType === searchParams.propertyType);
    }
  }

  // Filter by listing type
  if (searchParams.listingType) {
    filtered = filtered.filter(p => p.listingType === searchParams.listingType);
  }

  // Filter by city/area
  if (searchParams.city) {
    filtered = filtered.filter(p => 
      p.city.toLowerCase().includes(searchParams.city!.toLowerCase())
    );
  }

  // Filter by price
  if (searchParams.minPrice) {
    filtered = filtered.filter(p => p.price >= parseInt(searchParams.minPrice!));
  }
  if (searchParams.maxPrice) {
    filtered = filtered.filter(p => p.price <= parseInt(searchParams.maxPrice!));
  }

  // Filter by bedrooms
  if (searchParams.minBedrooms) {
    filtered = filtered.filter(p => p.bedrooms >= parseInt(searchParams.minBedrooms!));
  }

  // Filter by search term
  if (searchParams.search) {
    const term = searchParams.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(term) ||
      p.address.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term)
    );
  }

  // Filter featured
  if (searchParams.featured === 'true') {
    filtered = filtered.filter(p => p.isFeatured);
  }

  // Sort
  switch (searchParams.sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      filtered.sort((a, b) => b.viewCount - a.viewCount);
      break;
    default:
      // Default: featured first, then by viewCount
      filtered.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.viewCount - a.viewCount;
      });
  }

  // Pagination
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;
  const total = filtered.length;
  const paginatedProperties = filtered.slice(skip, skip + limit);

  return {
    properties: paginatedProperties,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

function PropertyListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-neutral-200" />
          <div className="p-5 space-y-3">
            <div className="h-6 bg-neutral-200 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
            <div className="h-4 bg-neutral-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { properties, pagination } = getProperties(params);

  // Build page title
  let pageTitle = 'All Properties in Mumbwa';
  if (params.featured === 'true') pageTitle = 'Featured Properties';
  else if (params.listingType === 'SALE') pageTitle = 'Properties for Sale';
  else if (params.listingType === 'RENT') pageTitle = 'Properties for Rent';
  else if (params.propertyType) {
    const typeLabels: Record<string, string> = {
      HOUSE: 'Houses',
      APARTMENT: 'Apartments',
      LAND: 'Land & Plots',
      COMMERCIAL: 'Commercial Properties',
      LODGE: 'Lodges & Hotels',
      FARM: 'Farms',
      LUXURY: 'Luxury Properties',
      NEW_BUILD: 'New Builds',
    };
    pageTitle = typeLabels[params.propertyType] || pageTitle;
  }

  return (
    <>
      <Navigation />

      <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {pageTitle}
            </h1>
            <p className="text-gray-600 mt-2">
              {pagination.total.toLocaleString()} properties found in Mumbwa District
            </p>
          </div>

          {/* Property Type Quick Filters */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !params.propertyType ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Properties
            </Link>
            <Link
              href="/properties?propertyType=HOUSE"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                params.propertyType === 'HOUSE' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏠 Houses
            </Link>
            <Link
              href="/properties?propertyType=APARTMENT"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                params.propertyType === 'APARTMENT' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏢 Apartments
            </Link>
            <Link
              href="/properties?propertyType=LAND"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                params.propertyType === 'LAND' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🌍 Land
            </Link>
            <Link
              href="/properties?propertyType=COMMERCIAL"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                params.propertyType === 'COMMERCIAL' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏪 Commercial
            </Link>
            <Link
              href="/properties?propertyType=LUXURY"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                params.propertyType === 'LUXURY' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              ✨ Luxury
            </Link>
            <Link
              href="/properties?propertyType=NEW_BUILD"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                params.propertyType === 'NEW_BUILD' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🆕 New Builds
            </Link>
            <Link
              href="/properties?propertyType=FARM"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                params.propertyType === 'FARM' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🌾 Farms
            </Link>
            <Link
              href="/properties?propertyType=LODGE"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                params.propertyType === 'LODGE' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏨 Lodges
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-80 flex-shrink-0">
              <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
                <PropertySearch variant="sidebar" />
              </Suspense>
            </aside>

            {/* Property List */}
            <div className="flex-1">
              {properties.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search filters to find more properties.
                  </p>
                  <Link href="/properties" className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                    Clear Filters
                  </Link>
                </div>
              ) : (
                <>
                  <Suspense fallback={<PropertyListSkeleton />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {properties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          id={property.id}
                          slug={property.slug}
                          title={property.title}
                          propertyType={property.propertyType}
                          listingType={property.listingType as 'SALE' | 'RENT'}
                          price={property.price}
                          currency={property.currency}
                          address={property.address}
                          city={property.city}
                          province={property.province}
                          bedrooms={property.bedrooms}
                          bathrooms={property.bathrooms}
                          floorArea={property.floorArea}
                          images={property.images}
                          isFeatured={property.isFeatured}
                          viewCount={property.viewCount}
                        />
                      ))}
                    </div>
                  </Suspense>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="flex items-center gap-2">
                        {/* Previous */}
                        <Link
                          href={{
                            pathname: '/properties',
                            query: { ...params, page: Math.max(1, pagination.page - 1) },
                          }}
                          className={`px-4 py-2 rounded-full ${
                            pagination.page === 1
                              ? 'bg-gray-100 text-gray-400 pointer-events-none'
                              : 'bg-white text-gray-600 hover:bg-gray-900 hover:text-white'
                          } transition-colors`}
                        >
                          Previous
                        </Link>

                        {/* Page Numbers */}
                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.page >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }

                          return (
                            <Link
                              key={pageNum}
                              href={{
                                pathname: '/properties',
                                query: { ...params, page: pageNum },
                              }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                pagination.page === pageNum
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-white text-gray-600 hover:bg-gray-900 hover:text-white'
                              } transition-colors`}
                            >
                              {pageNum}
                            </Link>
                          );
                        })}

                        {/* Next */}
                        <Link
                          href={{
                            pathname: '/properties',
                            query: { ...params, page: Math.min(pagination.totalPages, pagination.page + 1) },
                          }}
                          className={`px-4 py-2 rounded-full ${
                            pagination.page === pagination.totalPages
                              ? 'bg-gray-100 text-gray-400 pointer-events-none'
                              : 'bg-white text-gray-600 hover:bg-gray-900 hover:text-white'
                          } transition-colors`}
                        >
                          Next
                        </Link>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
