/**
 * Zambia Property - Home Page
 * 
 * Airbnb-inspired landing page with clean, minimal design
 */

import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';
import { PropertyCard } from '@/components/property/PropertyCard';

// Category Icons - Airbnb style
const categories = [
  { 
    id: 'all', 
    label: 'All', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    id: 'houses', 
    label: 'Houses', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    id: 'apartments', 
    label: 'Apartments', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    id: 'land', 
    label: 'Land', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  { 
    id: 'commercial', 
    label: 'Commercial', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
      </svg>
    )
  },
  { 
    id: 'luxury', 
    label: 'Luxury', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
  { 
    id: 'new', 
    label: 'New builds', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )
  },
  { 
    id: 'farm', 
    label: 'Farms', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    )
  },
  { 
    id: 'lodge', 
    label: 'Lodges', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
      </svg>
    )
  },
];

// Location filters - Mumbwa District Areas
const locations = [
  { id: 'mumbwa-town', label: 'Mumbwa Town', count: 85 },
  { id: 'nangoma', label: 'Nangoma', count: 42 },
  { id: 'kaindu', label: 'Kaindu', count: 28 },
  { id: 'kasip', label: 'Kasip', count: 35 },
  { id: 'muembe', label: 'Muembe', count: 22 },
  { id: 'banachewembwe', label: 'Banachewembwe', count: 18 },
  { id: 'namukumbo', label: 'Namukumbo', count: 15 },
  { id: 'luiri', label: 'Luiri', count: 12 },
  { id: 'blue-lagoon', label: 'Blue Lagoon', count: 8 },
  { id: 'shakumbila', label: 'Shakumbila', count: 25 },
  { id: 'chulwe', label: 'Chulwe', count: 10 },
  { id: 'myooye', label: 'Myooye', count: 20 },
];

// Mock data for Mumbwa District properties
const mockProperties = [
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
  },
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
  },
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
  },
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
  },
  {
    id: '12',
    slug: 'gold-mine-land-luiri',
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
  },
  {
    id: '13',
    slug: 'rental-nangoma-2bed',
    title: '2-Bed House for Rent',
    propertyType: 'HOUSE',
    listingType: 'RENT',
    price: 2500,
    currency: 'ZMW',
    address: 'Nangoma Centre',
    city: 'Nangoma',
    province: 'Central',
    bedrooms: 2,
    bathrooms: 1,
    floorArea: 90,
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: true }],
    isFeatured: false,
  },
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
  },
];

async function getFeaturedProperties() {
  // Return mock data directly to avoid database connection issues
  return mockProperties.filter(p => p.isFeatured);
}

async function getRecentProperties() {
  // Return mock data directly to avoid database connection issues
  return mockProperties;
}

export default async function HomePage() {
  const [featuredProperties, recentProperties] = await Promise.all([
    getFeaturedProperties(),
    getRecentProperties(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Search Hero - Airbnb Style */}
        <section className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search Bar - Airbnb pill style */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                <button className="px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-full transition-colors">
                  Anywhere
                </button>
                <span className="w-px h-6 bg-gray-200" />
                <button className="px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-full transition-colors">
                  Any type
                </button>
                <span className="w-px h-6 bg-gray-200" />
                <button className="px-6 py-3 text-sm font-medium text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                  Price range
                </button>
                <button className="ml-2 p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Category Pills - Airbnb Style */}
            <div className="relative">
              <div className="flex items-center gap-8 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    className={`flex flex-col items-center gap-2 min-w-fit pb-3 border-b-2 transition-all ${
                      index === 0
                        ? 'border-gray-800 text-gray-800'
                        : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <span className="opacity-70">{category.icon}</span>
                    <span className="text-xs font-medium whitespace-nowrap">{category.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Filter Button */}
              <button className="absolute right-0 top-0 flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-800 transition-colors bg-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>
          </div>
        </section>

        {/* Properties Grid - Airbnb Style */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {recentProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentProperties.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    slug={property.slug}
                    title={property.title}
                    propertyType={property.propertyType}
                    listingType={property.listingType as 'SALE' | 'RENT'}
                    price={property.price}
                    currency={property.currency}
                    address={property.address || undefined}
                    city={property.city}
                    province={property.province || undefined}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    floorArea={property.floorArea}
                    images={property.images}
                    isFeatured={property.isFeatured}
                  />
                ))}
              </div>
            ) : (
              /* Empty State with Sample Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100" />
                      <button className="absolute top-3 right-3 p-2 text-gray-600 hover:text-red-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </button>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot === 1 ? 'bg-white' : 'bg-white/50'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">Lusaka, Zambia</h3>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm">4.9</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">3 bed · 2 bath · 150 m²</p>
                      <p className="text-gray-500 text-sm">Available now</p>
                      <p className="text-gray-900 font-medium mt-1">
                        <span className="font-semibold">K 850,000</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Show More Button */}
            <div className="text-center mt-12">
              <Link 
                href="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Show more properties
              </Link>
            </div>
          </div>
        </section>

        {/* Explore Locations - Airbnb Style */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Explore properties in Zambia
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {locations.map((location) => (
                <Link
                  key={location.id}
                  href={`/properties?province=${location.label}`}
                  className="group p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{location.label}</h3>
                  <p className="text-sm text-gray-500">{location.count.toLocaleString()} properties</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        {featuredProperties.length > 0 && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Featured properties</h2>
                <Link 
                  href="/properties?featured=true"
                  className="text-sm font-medium text-gray-800 underline hover:text-primary transition-colors"
                >
                  Show all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProperties.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    slug={property.slug}
                    title={property.title}
                    propertyType={property.propertyType}
                    listingType={property.listingType as 'SALE' | 'RENT'}
                    price={property.price}
                    currency={property.currency}
                    address={property.address || undefined}
                    city={property.city}
                    province={property.province || undefined}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    floorArea={property.floorArea}
                    images={property.images}
                    isFeatured={property.isFeatured}
                    viewCount={property.viewCount}
                    owner={property.owner}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Become a Host CTA - Airbnb Style */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative px-8 py-16 sm:px-16 sm:py-20">
                <div className="max-w-xl">
                  <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                    List your property on Zambia Property
                  </h2>
                  <p className="text-lg text-white/80 mb-8">
                    Join thousands of property owners who trust us to find the perfect tenants and buyers.
                  </p>
                  <Link
                    href="/auth/register?role=LANDLORD"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-dark rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get started
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section - Airbnb Style */}
        <section className="py-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center md:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified listings</h3>
                <p className="text-gray-500">All properties are verified for authenticity and accuracy by our team.</p>
              </div>
              <div className="text-center md:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert agents</h3>
                <p className="text-gray-500">Connect with experienced local agents who know your market.</p>
              </div>
              <div className="text-center md:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure transactions</h3>
                <p className="text-gray-500">Safe and transparent property transactions with full support.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
