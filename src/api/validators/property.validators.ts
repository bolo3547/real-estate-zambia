/**
 * Property Validation Schemas
 * Using Zod for runtime validation
 */

import { z } from 'zod';
import { PropertyType, ListingType, PropertyStatus } from '@prisma/client';

/**
 * ==============================
 * REUSABLE SCHEMAS
 * ==============================
 */

const coordinateSchema = z.number().min(-180).max(180);

const priceSchema = z.number()
  .positive('Price must be positive')
  .max(999999999999, 'Price exceeds maximum');

export const slugSchema = z.string()
  .min(3)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

/**
 * ==============================
 * CREATE PROPERTY SCHEMA
 * ==============================
 */

export const createPropertySchema = z.object({
  // Basic info
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(10000, 'Description must not exceed 10000 characters')
    .trim(),
  
  propertyType: z.nativeEnum(PropertyType, {
    errorMap: () => ({ message: 'Invalid property type' })
  }),
  
  listingType: z.nativeEnum(ListingType, {
    errorMap: () => ({ message: 'Invalid listing type' })
  }),
  
  // Pricing
  price: priceSchema,
  currency: z.string().length(3).default('ZMW'),
  priceNegotiable: z.boolean().default(false),
  
  // Location
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must not exceed 500 characters')
    .trim(),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .trim(),
  
  province: z.string()
    .min(2, 'Province must be at least 2 characters')
    .max(100, 'Province must not exceed 100 characters')
    .trim(),
  
  country: z.string().default('Zambia'),
  
  postalCode: z.string().max(20).optional(),
  
  latitude: coordinateSchema.optional(),
  longitude: coordinateSchema.optional(),
  
  // Property Details
  bedrooms: z.number().int().min(0).max(100).optional(),
  bathrooms: z.number().int().min(0).max(100).optional(),
  parkingSpaces: z.number().int().min(0).max(100).optional(),
  floorArea: z.number().positive().max(1000000).optional(),
  landArea: z.number().positive().max(100000000).optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 5).optional(),
  floors: z.number().int().min(1).max(200).optional(),
  
  // Features & Amenities
  features: z.record(z.boolean()).optional(),
  amenities: z.record(z.boolean()).optional(),
  
  // Agent assignment (optional)
  agentId: z.string().cuid().optional(),
  
  // Availability
  availableFrom: z.string().datetime().optional(),
  
  // SEO
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
}).strict();

/**
 * ==============================
 * UPDATE PROPERTY SCHEMA
 * ==============================
 */

export const updatePropertySchema = createPropertySchema.partial().extend({
  // Allow status changes for specific transitions
  status: z.nativeEnum(PropertyStatus).optional(),
});

/**
 * ==============================
 * PROPERTY QUERY SCHEMA
 * ==============================
 */

export const propertyQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  
  // Sorting
  sortBy: z.enum([
    'createdAt',
    'price',
    'viewCount',
    'bedrooms',
    'floorArea'
  ]).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  
  // Filters
  status: z.nativeEnum(PropertyStatus).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  listingType: z.nativeEnum(ListingType).optional(),
  
  // Location filters
  city: z.string().optional(),
  province: z.string().optional(),
  
  // Price range
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  
  // Property details
  minBedrooms: z.coerce.number().int().min(0).optional(),
  maxBedrooms: z.coerce.number().int().max(100).optional(),
  minBathrooms: z.coerce.number().int().min(0).optional(),
  maxBathrooms: z.coerce.number().int().max(100).optional(),
  minArea: z.coerce.number().positive().optional(),
  maxArea: z.coerce.number().positive().optional(),
  
  // Geo search
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radius: z.coerce.number().positive().max(100).optional(), // km
  
  // Text search
  q: z.string().max(200).optional(),
  
  // Feature filters
  features: z.string().optional(), // Comma-separated
  
  // Owner/Agent filters (for authenticated)
  ownerId: z.string().cuid().optional(),
  agentId: z.string().cuid().optional(),
  
  // Featured only
  featured: z.coerce.boolean().optional(),
}).refine(
  data => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
  { message: 'minPrice must be less than or equal to maxPrice' }
).refine(
  data => !data.minBedrooms || !data.maxBedrooms || data.minBedrooms <= data.maxBedrooms,
  { message: 'minBedrooms must be less than or equal to maxBedrooms' }
);

/**
 * ==============================
 * IMAGE UPLOAD SCHEMA
 * ==============================
 */

export const imageUploadSchema = z.object({
  images: z.array(z.object({
    url: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
    altText: z.string().max(200).optional(),
    caption: z.string().max(500).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isPrimary: z.boolean().optional(),
  })).min(1).max(50),
});

/**
 * ==============================
 * IMAGE REORDER SCHEMA
 * ==============================
 */

export const imageReorderSchema = z.object({
  imageIds: z.array(z.string().cuid()).min(1),
});

/**
 * ==============================
 * INQUIRY SCHEMA
 * ==============================
 */

export const createInquirySchema = z.object({
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must not exceed 2000 characters')
    .trim(),
  
  subject: z.string()
    .max(200, 'Subject must not exceed 200 characters')
    .optional(),
  
  preferPhone: z.boolean().default(false),
  preferEmail: z.boolean().default(true),
  preferredTime: z.string().max(100).optional(),
});

/**
 * ==============================
 * TYPE EXPORTS
 * ==============================
 */

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyQueryInput = z.infer<typeof propertyQuerySchema>;
export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
