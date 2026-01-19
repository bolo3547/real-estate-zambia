/**
 * Zambia Property - Property Detail Page
 * Individual property view with gallery, details, and contact
 * Using MOCK DATA - No database required
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';
import { PropertyCard } from '@/components/property/PropertyCard';
import { formatPrice, formatArea, getWhatsAppLink, generateGoogleMapsUrl } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Mock property data for Mumbwa District
const allMockProperties = [
  {
    id: '1', slug: 'modern-house-mumbwa-town', title: 'Modern Family House',
    description: 'Beautiful modern family house located in the heart of Mumbwa Town. This property features spacious rooms, modern finishes, and a lovely garden. Perfect for a growing family looking for comfort and convenience.',
    propertyType: 'HOUSE', listingType: 'SALE', price: 450000, currency: 'ZMW',
    address: 'Mumbwa Town Centre', city: 'Mumbwa Town', province: 'Central',
    bedrooms: 4, bathrooms: 2, floorArea: 220, plotSize: 800,
    features: ['Garden', 'Garage', 'Security Wall', 'Borehole', 'Solar Backup'],
    images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', isPrimary: true }],
    isFeatured: true, isLuxury: false, isNew: true, viewCount: 245, createdAt: '2025-12-15',
    owner: { firstName: 'John', lastName: 'Mwanza', phone: '+260971234567' },
  },
  {
    id: '2', slug: 'rental-house-nangoma', title: '3-Bedroom House for Rent',
    description: 'Well-maintained 3-bedroom house available for rent in Nangoma. Features include tiled floors, modern bathroom fixtures, and a secure compound.',
    propertyType: 'HOUSE', listingType: 'RENT', price: 4500, currency: 'ZMW',
    address: 'Nangoma Area', city: 'Nangoma', province: 'Central',
    bedrooms: 3, bathrooms: 2, floorArea: 150, plotSize: 500,
    features: ['Tiled Floors', 'Security Wall', 'Water Tank'],
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: true }],
    isFeatured: false, isLuxury: false, isNew: false, viewCount: 128, createdAt: '2025-12-20',
    owner: { firstName: 'Mary', lastName: 'Banda', phone: '+260972345678' },
  },
  {
    id: '3', slug: 'farm-land-kaindu', title: 'Fertile Farm Land - 50 Hectares',
    description: 'Prime agricultural land located in Kaindu farming block. Ideal for cotton, maize, or mixed farming.',
    propertyType: 'FARM', listingType: 'SALE', price: 1800000, currency: 'ZMW',
    address: 'Kaindu Farming Block', city: 'Kaindu', province: 'Central',
    bedrooms: 0, bathrooms: 0, floorArea: 500000, plotSize: 500000,
    features: ['Title Deed', 'Road Access', 'Water Source', 'Fertile Soil'],
    images: [{ url: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800', isPrimary: true }],
    isFeatured: true, isLuxury: false, isNew: false, viewCount: 367, createdAt: '2025-11-10',
    owner: { firstName: 'Peter', lastName: 'Tembo', phone: '+260973456789' },
  },
  {
    id: '4', slug: 'commercial-plot-kasip', title: 'Prime Commercial Plot',
    description: 'Strategic commercial plot in Kasip trading area. High foot traffic location, perfect for retail.',
    propertyType: 'LAND', listingType: 'SALE', price: 350000, currency: 'ZMW',
    address: 'Kasip Trading Area', city: 'Kasip', province: 'Central',
    bedrooms: 0, bathrooms: 0, floorArea: 2500, plotSize: 2500,
    features: ['Title Deed', 'Road Frontage', 'Electricity', 'Water'],
    images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', isPrimary: true }],
    isFeatured: false, isLuxury: false, isNew: true, viewCount: 178, createdAt: '2025-12-01',
    owner: { firstName: 'Grace', lastName: 'Phiri', phone: '+260974567890' },
  },
  {
    id: '5', slug: 'lodge-blue-lagoon', title: 'Safari Lodge Near Blue Lagoon',
    description: 'Exceptional safari lodge opportunity near Blue Lagoon National Park. Features 8 en-suite chalets.',
    propertyType: 'COMMERCIAL', listingType: 'SALE', price: 2500000, currency: 'ZMW',
    address: 'Blue Lagoon National Park', city: 'Blue Lagoon', province: 'Central',
    bedrooms: 8, bathrooms: 8, floorArea: 600, plotSize: 50000,
    features: ['Swimming Pool', 'Restaurant', 'Game Viewing', 'Solar Power', 'Borehole'],
    images: [{ url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', isPrimary: true }],
    isFeatured: true, isLuxury: true, isNew: false, viewCount: 523, createdAt: '2025-10-15',
    owner: { firstName: 'David', lastName: 'Chanda', phone: '+260975678901' },
  },
  {
    id: '9', slug: 'executive-house-mumbwa', title: 'Executive 5-Bed House',
    description: 'Luxurious executive home in prime Mumbwa Town location. Features modern kitchen and spacious living.',
    propertyType: 'HOUSE', listingType: 'SALE', price: 680000, currency: 'ZMW',
    address: 'Mumbwa Town', city: 'Mumbwa Town', province: 'Central',
    bedrooms: 5, bathrooms: 3, floorArea: 320, plotSize: 1000,
    features: ['Modern Kitchen', 'En-suite Master', 'Garden', 'Garage', 'Security'],
    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', isPrimary: true }],
    isFeatured: true, isLuxury: true, isNew: true, viewCount: 312, createdAt: '2026-01-10',
    owner: { firstName: 'Robert', lastName: 'Lungu', phone: '+260979012345' },
  },
  {
    id: '14', slug: 'commercial-mumbwa-m9', title: 'Commercial Property on M9 Road',
    description: 'Prime commercial property on the busy M9 Highway in Mumbwa. High visibility location.',
    propertyType: 'COMMERCIAL', listingType: 'SALE', price: 950000, currency: 'ZMW',
    address: 'M9 Highway, Mumbwa', city: 'Mumbwa Town', province: 'Central',
    bedrooms: 0, bathrooms: 2, floorArea: 500, plotSize: 3000,
    features: ['Highway Frontage', 'High Traffic', 'Parking', 'Utilities'],
    images: [{ url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', isPrimary: true }],
    isFeatured: true, isLuxury: false, isNew: false, viewCount: 234, createdAt: '2025-12-05',
    owner: { firstName: 'Steven', lastName: 'Mulenga', phone: '+260971234568' },
  },
  {
    id: '16', slug: 'modern-apartment-mumbwa', title: 'Modern 2-Bed Apartment',
    description: 'Newly built modern apartment in Mumbwa Town Centre. Features open plan living and fitted kitchen.',
    propertyType: 'APARTMENT', listingType: 'RENT', price: 5500, currency: 'ZMW',
    address: 'Mumbwa Town Centre', city: 'Mumbwa Town', province: 'Central',
    bedrooms: 2, bathrooms: 1, floorArea: 75, plotSize: 0,
    features: ['Fitted Kitchen', 'Parking', 'Security', 'Water Included'],
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: true }],
    isFeatured: false, isLuxury: false, isNew: true, viewCount: 201, createdAt: '2026-01-08',
    owner: { firstName: 'Catherine', lastName: 'Bwalya', phone: '+260972345679' },
  },
  {
    id: '18', slug: 'luxury-apartment-mumbwa', title: 'Luxury 3-Bed Apartment',
    description: 'Premium luxury apartment with high-end finishes. Features granite counters and spacious balcony.',
    propertyType: 'APARTMENT', listingType: 'SALE', price: 380000, currency: 'ZMW',
    address: 'Mumbwa Town', city: 'Mumbwa Town', province: 'Central',
    bedrooms: 3, bathrooms: 2, floorArea: 120, plotSize: 0,
    features: ['Granite Counters', 'Balcony', 'Parking', 'Gym Access', 'Security'],
    images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isPrimary: true }],
    isFeatured: true, isLuxury: true, isNew: true, viewCount: 289, createdAt: '2026-01-02',
    owner: { firstName: 'Michael', lastName: 'Zimba', phone: '+260973456780' },
  },
  {
    id: '25', slug: 'luxury-villa-mumbwa', title: 'Luxury Villa Estate',
    description: 'Exceptional luxury villa with premium finishes. Features infinity pool, home cinema, and smart home technology.',
    propertyType: 'HOUSE', listingType: 'SALE', price: 1800000, currency: 'ZMW',
    address: 'Mumbwa Town Elite Area', city: 'Mumbwa Town', province: 'Central',
    bedrooms: 6, bathrooms: 5, floorArea: 500, plotSize: 2000,
    features: ['Infinity Pool', 'Home Cinema', 'Wine Cellar', 'Smart Home', 'Double Garage'],
    images: [{ url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', isPrimary: true }],
    isFeatured: true, isLuxury: true, isNew: true, viewCount: 567, createdAt: '2026-01-15',
    owner: { firstName: 'Charles', lastName: 'Mbewe', phone: '+260972233446' },
  },
];

const propertyTypeLabels: Record<string, string> = {
  HOUSE: 'House', APARTMENT: 'Apartment', LAND: 'Land', CONDO: 'Condo',
  COMMERCIAL: 'Commercial', TOWNHOUSE: 'Townhouse', FARM: 'Farm', INDUSTRIAL: 'Industrial',
};

function getProperty(slug: string) {
  return allMockProperties.find(p => p.slug === slug) || null;
}

function getSimilarProperties(property: any) {
  return allMockProperties
    .filter(p => p.id !== property.id && (p.propertyType === property.propertyType || p.city === property.city))
    .slice(0, 4);
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return { title: 'Property Not Found' };
  return {
    title: `${property.title} | Mumbwa Property`,
    description: property.description?.slice(0, 160),
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();
  
  const similarProperties = getSimilarProperties(property);
  const whatsappLink = getWhatsAppLink(property.owner.phone, `Hi, I'm interested in: ${property.title}`);
  const mapsUrl = generateGoogleMapsUrl(property.address, property.city, property.province);

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-gray-500">
              <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
              <li>/</li>
              <li><Link href="/properties" className="hover:text-gray-900">Properties</Link></li>
              <li>/</li>
              <li className="text-gray-900">{property.title}</li>
            </ol>
          </nav>

          {/* Image */}
          <div className="mb-8 rounded-2xl overflow-hidden bg-white">
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
              <Image src={property.images[0]?.url || '/placeholder.jpg'} alt={property.title} fill className="object-cover" priority />
              {property.isFeatured && <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full">Featured</span>}
              <span className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-full ${property.listingType === 'SALE' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}>
                For {property.listingType === 'SALE' ? 'Sale' : 'Rent'}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">{propertyTypeLabels[property.propertyType] || property.propertyType}</span>
                  {property.isLuxury && <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">Luxury</span>}
                  {property.isNew && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">New Build</span>}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{property.address}, {property.city}, {property.province}</span>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {formatPrice(property.price, property.currency)}
                  {property.listingType === 'RENT' && <span className="text-lg text-gray-500 font-normal">/month</span>}
                </div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms > 0 && <div className="text-center p-4 bg-gray-50 rounded-xl"><div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div><div className="text-sm text-gray-600">Bedrooms</div></div>}
                  {property.bathrooms > 0 && <div className="text-center p-4 bg-gray-50 rounded-xl"><div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div><div className="text-sm text-gray-600">Bathrooms</div></div>}
                  <div className="text-center p-4 bg-gray-50 rounded-xl"><div className="text-2xl font-bold text-gray-900">{formatArea(property.floorArea)}</div><div className="text-sm text-gray-600">Floor Area</div></div>
                  {property.plotSize > 0 && <div className="text-center p-4 bg-gray-50 rounded-xl"><div className="text-2xl font-bold text-gray-900">{formatArea(property.plotSize)}</div><div className="text-sm text-gray-600">Plot Size</div></div>}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                <p className="text-gray-600 mb-4">{property.address}, {property.city}, {property.province}, Zambia</p>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  View on Google Maps
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-28">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">{property.owner.firstName[0]}{property.owner.lastName[0]}</div>
                  <div><div className="font-semibold text-gray-900">{property.owner.firstName} {property.owner.lastName}</div><div className="text-sm text-gray-600">Property Agent</div></div>
                </div>
                <div className="space-y-3">
                  <a href={`tel:${property.owner.phone}`} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Call Now
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-full hover:bg-green-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    WhatsApp
                  </a>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100"><div className="flex items-center justify-between text-sm text-gray-500"><span>Views: {property.viewCount}</span><span>Listed: {property.createdAt}</span></div></div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProperties.map((p) => (
                  <PropertyCard key={p.id} id={p.id} slug={p.slug} title={p.title} propertyType={p.propertyType} listingType={p.listingType as 'SALE' | 'RENT'} price={p.price} currency={p.currency} address={p.address} city={p.city} province={p.province} bedrooms={p.bedrooms} bathrooms={p.bathrooms} floorArea={p.floorArea} images={p.images} isFeatured={p.isFeatured} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
