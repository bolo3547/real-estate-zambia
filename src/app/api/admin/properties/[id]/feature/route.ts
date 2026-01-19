/**
 * Zambia Property - Admin Feature Property API
 * 
 * Handles featuring/unfeaturing properties
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
 * PATCH /api/admin/properties/[id]/feature
 * Feature or unfeature property
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'ADMIN') {
      return errorResponse('Admin access required', 'FORBIDDEN', 403);
    }
    
    const body = await request.json();
    const { featured, featuredUntil } = body;
    
    const property = await prisma.property.findUnique({
      where: { id },
    });
    
    if (!property) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    // Calculate featured end date (default 30 days)
    const endDate = featuredUntil 
      ? new Date(featuredUntil)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Handle featuring through FeaturedProperty model
    if (featured) {
      await prisma.featuredProperty.upsert({
        where: { propertyId: id },
        create: {
          propertyId: id,
          startDate: new Date(),
          endDate,
          amountPaid: 0,
        },
        update: {
          endDate,
        },
      });
    } else {
      await prisma.featuredProperty.deleteMany({
        where: { propertyId: id },
      });
    }
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId!,
        action: 'UPDATE',
        entityType: 'Property',
        entityId: id,
        newValues: { isFeatured: featured, featuredUntil: endDate },
      },
    });
    
    return NextResponse.json({
      success: true,
      message: featured 
        ? 'Property featured successfully' 
        : 'Property unfeatured successfully',
    });
  } catch (error) {
    console.error('Feature property error:', error);
    return errorResponse('Failed to update feature status', 'INTERNAL_ERROR', 500);
  }
}
