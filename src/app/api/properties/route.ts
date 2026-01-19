/**
 * Zambia Property - Property API Routes
 * 
 * Handles CRUD operations for properties
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createPropertySchema, propertyFilterSchema } from '@/lib/validations';
import { generateUniqueSlug } from '@/lib/utils';

/**
 * Helper to create error response
 */
function errorResponse(message: string, code: string, statusCode: number) {
  return NextResponse.json(
    { success: false, error: { message, code, statusCode } },
    { status: statusCode }
  );
}

/**
 * GET /api/properties
 * List properties with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const params = {
      propertyType: searchParams.get('propertyType') || undefined,
      listingType: searchParams.get('listingType') || undefined,
      city: searchParams.get('city') || undefined,
      province: searchParams.get('province') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minBedrooms: searchParams.get('minBedrooms') ? Number(searchParams.get('minBedrooms')) : undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      featured: searchParams.get('featured') === 'true',
    };
    
    // Build where clause
    const where: any = {
      isDeleted: false,
      status: 'APPROVED', // Only show approved properties publicly
    };
    
    if (params.propertyType) {
      where.propertyType = params.propertyType;
    }
    
    if (params.listingType) {
      where.listingType = params.listingType;
    }
    
    if (params.city) {
      where.city = { contains: params.city, mode: 'insensitive' };
    }
    
    if (params.province) {
      where.province = { contains: params.province, mode: 'insensitive' };
    }
    
    if (params.minPrice || params.maxPrice) {
      where.price = {};
      if (params.minPrice) where.price.gte = params.minPrice;
      if (params.maxPrice) where.price.lte = params.maxPrice;
    }
    
    if (params.minBedrooms) {
      where.bedrooms = { gte: params.minBedrooms };
    }
    
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { address: { contains: params.search, mode: 'insensitive' } },
        { city: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    
    if (params.featured) {
      where.isFeatured = true;
      where.featuredUntil = { gte: new Date() };
    }
    
    // Determine sort order
    let orderBy: any = { createdAt: 'desc' };
    switch (params.sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
    }
    
    // Calculate pagination
    const skip = (params.page - 1) * params.limit;
    
    // Execute queries in parallel
    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: params.limit,
        orderBy,
        select: {
          id: true,
          title: true,
          slug: true,
          propertyType: true,
          listingType: true,
          price: true,
          currency: true,
          address: true,
          city: true,
          province: true,
          bedrooms: true,
          bathrooms: true,
          floorArea: true,
          viewCount: true,
          createdAt: true,
          featured: {
            select: {
              tier: true,
              endDate: true,
            },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: {
              id: true,
              url: true,
              thumbnailUrl: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);
    
    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
        hasMore: skip + properties.length < total,
      },
    });
  } catch (error) {
    console.error('List properties error:', error);
    return errorResponse('Failed to fetch properties', 'INTERNAL_ERROR', 500);
  }
}

/**
 * POST /api/properties
 * Create a new property
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId) {
      return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }
    
    // Check authorization
    if (!['AGENT', 'LANDLORD', 'ADMIN'].includes(userRole || '')) {
      return errorResponse('You do not have permission to create properties', 'FORBIDDEN', 403);
    }
    
    const body = await request.json();
    
    // Validate input
    const validationResult = createPropertySchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors[0].message,
        'VALIDATION_ERROR',
        400
      );
    }
    
    const data = validationResult.data;
    
    // Generate unique slug
    const slug = generateUniqueSlug(data.title);
    
    // Create property
    const property = await prisma.property.create({
      data: {
        ...data,
        slug,
        ownerId: userId,
        status: 'PENDING_APPROVAL', // Require admin approval
        currency: data.currency || 'ZMW',
      },
      include: {
        images: true,
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE',
        entityType: 'Property',
        entityId: property.id,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: property,
      message: 'Property created successfully and is pending approval',
    }, { status: 201 });
  } catch (error) {
    console.error('Create property error:', error);
    return errorResponse('Failed to create property', 'INTERNAL_ERROR', 500);
  }
}
