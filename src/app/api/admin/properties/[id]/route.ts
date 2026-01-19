/**
 * Zambia Property - Admin Single Property API
 * 
 * Individual property management with audit logging
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  requireAdmin,
  getAdminUserId,
  createAuditLog,
  getIpAddress,
  getUserAgent,
  errorResponse,
  successResponse,
  isValidUUID,
} from '@/lib/admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/properties/[id]
 * Get property details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  const { id } = await params;
  
  if (!isValidUUID(id)) {
    return errorResponse('Invalid property ID', 'VALIDATION_ERROR', 400);
  }
  
  try {
    const property = await prisma.property.findUnique({
      where: { id, isDeleted: false },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        images: true,
        featured: true,
        inquiries: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            message: true,
            status: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            inquiries: true,
            savedBy: true,
          },
        },
      },
    });
    
    if (!property) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    return successResponse(property);
  } catch (error) {
    console.error('Admin property get error:', error);
    return errorResponse('Failed to fetch property', 'INTERNAL_ERROR', 500);
  }
}

/**
 * PATCH /api/admin/properties/[id]
 * Update property status, approval, or feature
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  const { id } = await params;
  const adminId = getAdminUserId(request);
  
  if (!adminId) {
    return errorResponse('Admin ID not found', 'UNAUTHORIZED', 401);
  }
  
  if (!isValidUUID(id)) {
    return errorResponse('Invalid property ID', 'VALIDATION_ERROR', 400);
  }
  
  try {
    const body = await request.json();
    const { status, approvalStatus, rejectionReason, feature } = body;
    
    // Get property before update
    const propertyBefore = await prisma.property.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        title: true,
        status: true,
        approvalStatus: true,
      },
    });
    
    if (!propertyBefore) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    // Build update data
    const updateData: Record<string, unknown> = {};
    
    if (status !== undefined) {
      updateData.status = status;
    }
    
    if (approvalStatus !== undefined) {
      updateData.approvalStatus = approvalStatus;
      
      if (approvalStatus === 'APPROVED') {
        updateData.status = 'APPROVED';
        updateData.approvedAt = new Date();
        updateData.approvedById = adminId;
      } else if (approvalStatus === 'REJECTED') {
        updateData.status = 'REJECTED';
        updateData.rejectionReason = rejectionReason || 'Rejected by admin';
      } else if (approvalStatus === 'REVISION_REQUESTED') {
        updateData.rejectionReason = rejectionReason || 'Revision requested';
      }
    }
    
    // Handle featuring
    if (feature !== undefined) {
      if (feature.enabled) {
        // Create or update featured property
        await prisma.featuredProperty.upsert({
          where: { propertyId: id },
          create: {
            propertyId: id,
            tier: feature.tier || 1,
            startDate: feature.startDate ? new Date(feature.startDate) : new Date(),
            endDate: feature.endDate ? new Date(feature.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            amountPaid: 0,
            sortOrder: feature.displayOrder || 0,
          },
          update: {
            tier: feature.tier,
            startDate: feature.startDate ? new Date(feature.startDate) : undefined,
            endDate: feature.endDate ? new Date(feature.endDate) : undefined,
            sortOrder: feature.displayOrder,
          },
        });
      } else {
        // Remove featured status
        await prisma.featuredProperty.deleteMany({
          where: { propertyId: id },
        });
      }
    }
    
    // Update property if there are changes
    let updatedProperty = propertyBefore;
    if (Object.keys(updateData).length > 0) {
      updatedProperty = await prisma.property.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          title: true,
          status: true,
          approvalStatus: true,
          approvedAt: true,
          rejectionReason: true,
        },
      });
    }
    
    // Determine audit action type
    let auditAction: 'UPDATE' | 'APPROVAL' | 'REJECTION' = 'UPDATE';
    if (approvalStatus === 'APPROVED') {
      auditAction = 'APPROVAL';
    } else if (approvalStatus === 'REJECTED') {
      auditAction = 'REJECTION';
    }
    
    // Create audit log
    await createAuditLog({
      userId: adminId,
      action: auditAction,
      entityType: 'Property',
      entityId: id,
      oldValues: {
        status: propertyBefore.status,
        approvalStatus: propertyBefore.approvalStatus,
      },
      newValues: { ...updateData, feature },
      ipAddress: getIpAddress(request),
      userAgent: getUserAgent(request),
    });
    
    // Fetch full property with relations
    const fullProperty = await prisma.property.findUnique({
      where: { id },
      include: {
        featured: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    
    return successResponse(fullProperty, 'Property updated successfully');
  } catch (error) {
    console.error('Admin property update error:', error);
    return errorResponse('Failed to update property', 'INTERNAL_ERROR', 500);
  }
}

/**
 * DELETE /api/admin/properties/[id]
 * Soft delete property
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  const { id } = await params;
  const adminId = getAdminUserId(request);
  
  if (!adminId) {
    return errorResponse('Admin ID not found', 'UNAUTHORIZED', 401);
  }
  
  if (!isValidUUID(id)) {
    return errorResponse('Invalid property ID', 'VALIDATION_ERROR', 400);
  }
  
  try {
    // Get property before delete
    const property = await prisma.property.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        title: true,
        status: true,
      },
    });
    
    if (!property) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    // Soft delete property
    await prisma.property.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    
    // Remove featured status if exists
    await prisma.featuredProperty.deleteMany({
      where: { propertyId: id },
    });
    
    // Create audit log
    await createAuditLog({
      userId: adminId,
      action: 'DELETE',
      entityType: 'Property',
      entityId: id,
      oldValues: property,
      ipAddress: getIpAddress(request),
      userAgent: getUserAgent(request),
    });
    
    return successResponse({ deleted: true }, 'Property deleted successfully');
  } catch (error) {
    console.error('Admin property delete error:', error);
    return errorResponse('Failed to delete property', 'INTERNAL_ERROR', 500);
  }
}
