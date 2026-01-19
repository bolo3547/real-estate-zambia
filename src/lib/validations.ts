/**
 * Zambia Property - Validation Schemas
 * 
 * Zod schemas for validating all user inputs.
 * Used in both client and server for consistent validation.
 */

import { z } from 'zod';

// ==============================
// COMMON SCHEMAS
// ==============================

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{9,15}$/, 'Please enter a valid phone number')
  .optional()
  .or(z.literal(''));

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .trim();

// ==============================
// AUTH SCHEMAS
// ==============================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  role: z.enum(['AGENT', 'LANDLORD'], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
  companyName: z.string().max(100).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ==============================
// PROPERTY SCHEMAS
// ==============================

export const propertyTypeSchema = z.enum(['HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'INDUSTRIAL', 'FARM']);

export const listingTypeSchema = z.enum(['SALE', 'RENT', 'LEASE']);

export const propertyStatusSchema = z.enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SOLD', 'RENTED', 'WITHDRAWN']);

export const createPropertySchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  
  propertyType: propertyTypeSchema,
  listingType: listingTypeSchema,
  
  price: z
    .number()
    .positive('Price must be greater than 0')
    .max(999999999, 'Price exceeds maximum limit'),
  
  currency: z.string().default('ZMW'),
  priceNegotiable: z.boolean().default(false),
  
  // Location
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must be less than 500 characters')
    .trim(),
  
  city: z
    .string()
    .min(2, 'City is required')
    .max(100)
    .trim(),
  
  province: z
    .string()
    .min(2, 'Province is required')
    .max(100)
    .trim(),
  
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  
  // Property Details (all optional as they vary by type)
  bedrooms: z.number().int().min(0).max(100).optional(),
  bathrooms: z.number().int().min(0).max(100).optional(),
  parkingSpaces: z.number().int().min(0).max(100).optional(),
  floorArea: z.number().positive().max(100000).optional(),
  landArea: z.number().positive().max(10000000).optional(),
  yearBuilt: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear() + 5)
    .optional(),
  
  // Features (flexible JSON)
  features: z.record(z.boolean()).optional(),
  amenities: z.record(z.boolean()).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyFilterSchema = z.object({
  propertyType: propertyTypeSchema.optional(),
  listingType: listingTypeSchema.optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minBedrooms: z.number().int().min(0).optional(),
  maxBedrooms: z.number().int().max(100).optional(),
  minArea: z.number().positive().optional(),
  maxArea: z.number().positive().optional(),
  features: z.array(z.string()).optional(),
  search: z.string().max(200).optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'popular']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// ==============================
// USER SCHEMAS
// ==============================

export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema,
  bio: z.string().max(1000).optional(),
  companyName: z.string().max(100).optional(),
  whatsappNumber: phoneSchema,
  serviceAreas: z.array(z.string()).max(20).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ==============================
// INQUIRY SCHEMAS
// ==============================

export const createInquirySchema = z.object({
  propertyId: z.string().cuid('Invalid property ID'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
});

export const replyInquirySchema = z.object({
  inquiryId: z.string().cuid('Invalid inquiry ID'),
  message: z
    .string()
    .min(1, 'Reply message is required')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
});

// ==============================
// ADMIN SCHEMAS
// ==============================

export const approveUserSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  action: z.enum(['approve', 'reject']),
  notes: z.string().max(500).optional(),
});

export const approvePropertySchema = z.object({
  propertyId: z.string().cuid('Invalid property ID'),
  action: z.enum(['approve', 'reject']),
  notes: z.string().max(500).optional(),
});

export const featurePropertySchema = z.object({
  propertyId: z.string().cuid('Invalid property ID'),
  featured: z.boolean(),
  featuredUntil: z.date().optional(),
});

// ==============================
// TYPE EXPORTS
// ==============================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyFilterInput = z.infer<typeof propertyFilterSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
