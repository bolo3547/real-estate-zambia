/**
 * Zambia Property - Single Property API Routes
 * 
 * Handles operations on individual properties
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updatePropertySchema } from '@/lib/validations';

/**
 * Helper to create error response
 */
function errorResponse(message: string, code: string, statusCode: number) {
  return NextResponse.json(
    { success: false, error: { message, code, statusCode } },
    { status: statusCode }
  );
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/properties/[id]
 * Get single property by ID or slug
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Find property by ID or slug
    const property = await prisma.property.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
        isDeleted: false,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            agentProfile: {
              select: {
                id: true,
                companyName: true,
                bio: true,
                isVerified: true,
                averageRating: true,
                totalReviews: true,
              },
            },
            landlordProfile: {
              select: {
                id: true,
                companyName: true,
                isVerified: true,
              },
            },
          },
        },
      },
    });
    
    if (!property) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    // Check if property is visible (approved or owned by requester)
    const userId = request.headers.get('x-user-id');
    const isOwner = userId === property.ownerId;
    
    if (property.status !== 'APPROVED' && !isOwner) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    // Increment view count (only for approved properties, and not by owner)
    if (property.status === 'APPROVED' && !isOwner) {
      await prisma.property.update({
        where: { id: property.id },
        data: { viewCount: { increment: 1 } },
      });
      
      // Track view
      await prisma.propertyView.create({
        data: {
          propertyId: property.id,
          userId: userId || undefined,
          ipAddress: request.headers.get('x-forwarded-for') || undefined,
          userAgent: request.headers.get('user-agent') || undefined,
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Get property error:', error);
    return errorResponse('Failed to fetch property', 'INTERNAL_ERROR', 500);
  }
}

/**
 * PATCH /api/properties/[id]
 * Update property
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId) {
      return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }
    
    // Find existing property
    const existing = await prisma.property.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        ownerId: true,
        status: true,
      },
    });
    
    if (!existing) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    // Check authorization
    const isOwner = existing.ownerId === userId;
    const isAdmin = userRole === 'ADMIN';
    
    if (!isOwner && !isAdmin) {
      return errorResponse('You do not have permission to update this property', 'FORBIDDEN', 403);
    }
    
    const body = await request.json();
    
    // Validate input
    const validationResult = updatePropertySchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors[0].message,
        'VALIDATION_ERROR',
        400
      );
    }
    
    const data = validationResult.data;
    
    // If property was approved and significant changes made, reset to pending
    const requiresReapproval = 
      existing.status === 'APPROVED' &&
      (data.price !== undefined || data.address !== undefined || data.title !== undefined);
    
    // Update property
    const property = await prisma.property.update({
      where: { id },
      data: {
        ...data,
        ...(requiresReapproval && !isAdmin && { status: 'PENDING_APPROVAL' }),
        updatedAt: new Date(),
      },
      include: {
        images: true,
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE',
        entityType: 'Property',
        entityId: property.id,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: property,
      message: requiresReapproval && !isAdmin 
        ? 'Property updated and is pending re-approval'
        : 'Property updated successfully',
    });
  } catch (error) {
    console.error('Update property error:', error);
    return errorResponse('Failed to update property', 'INTERNAL_ERROR', 500);
  }
}

/**
 * DELETE /api/properties/[id]
 * Soft delete property
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId) {
      return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }
    
    // Find existing property
    const existing = await prisma.property.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,
      },
    });
    
    if (!existing) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    // Check authorization
    const isOwner = existing.ownerId === userId;
    const isAdmin = userRole === 'ADMIN';
    
    if (!isOwner && !isAdmin) {
      return errorResponse('You do not have permission to delete this property', 'FORBIDDEN', 403);
    }
    
    // Soft delete
    await prisma.property.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETE',
        entityType: 'Property',
        entityId: id,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Delete property error:', error);
    return errorResponse('Failed to delete property', 'INTERNAL_ERROR', 500);
  }
}
