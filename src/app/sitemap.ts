/**
 * Zambia Property - Dynamic Sitemap Generator
 */

import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zambiaproperty.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
  
  // Property type pages
  const propertyTypes = ['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'FARM', 'LODGE'];
  const propertyTypePages: MetadataRoute.Sitemap = propertyTypes.map(type => ({
    url: `${baseUrl}/properties?propertyType=${type}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));
  
  // Dynamic property pages
  let propertyPages: MetadataRoute.Sitemap = [];
  
  try {
    const properties = await prisma.property.findMany({
      where: {
        status: 'APPROVED',
        isDeleted: false,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      take: 1000, // Limit for performance
    });
    
    propertyPages = properties.map(property => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: property.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
  }
  
  return [...staticPages, ...propertyTypePages, ...propertyPages];
}
