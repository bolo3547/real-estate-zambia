/**
 * Zambia Property - Admin Properties API
 * 
 * Property management endpoints with audit logging
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  requireAdmin,
  getAdminUserId,
  createAuditLog,
  getIpAddress,
  getUserAgent,
  getPaginationParams,
  createPaginatedResponse,
  getSearchParams,
  errorResponse,
  successResponse,
} from '@/lib/admin';

/**
 * GET /api/admin/properties
 * List all properties with pagination, search, and filters
 */
export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  try {
    const params = getPaginationParams(request);
    const searchParams = getSearchParams(request);
    
    // Build filters
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const listingType = searchParams.get('listingType');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const where: Record<string, unknown> = {
      isDeleted: false,
    };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (listingType) {
      where.listingType = listingType;
    }
    
    if (featured === 'true') {
      where.featuredProperty = { isNot: null };
    } else if (featured === 'false') {
      where.featuredProperty = null;
    }
    
    // Get total count
    const total = await prisma.property.count({ where });
    
    // Get properties
    const properties = await prisma.property.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        title: true,
        slug: true,
        propertyType: true,
        listingType: true,
        status: true,
        price: true,
        currency: true,
        city: true,
        province: true,
        bedrooms: true,
        bathrooms: true,
        approvalStatus: true,
        approvedAt: true,
        rejectionReason: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        images: {
          take: 1,
          select: {
            url: true,
            altText: true,
          },
        },
        featured: {
          select: {
            tier: true,
            startDate: true,
            endDate: true,
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
    
    return successResponse(createPaginatedResponse(properties, total, params));
  } catch (error) {
    console.error('Admin properties list error:', error);
    return errorResponse('Failed to fetch properties', 'INTERNAL_ERROR', 500);
  }
}

/**
 * PATCH /api/admin/properties
 * Bulk update properties (status, approval)
 */
export async function PATCH(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  const adminId = getAdminUserId(request);
  if (!adminId) {
    return errorResponse('Admin ID not found', 'UNAUTHORIZED', 401);
  }
  
  try {
    const body = await request.json();
    const { propertyIds, action, reason } = body;
    
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return errorResponse('Property IDs required', 'VALIDATION_ERROR', 400);
    }
    
    if (!action) {
      return errorResponse('Action required', 'VALIDATION_ERROR', 400);
    }
    
    const updateData: Record<string, unknown> = {};
    let auditAction: 'UPDATE' | 'APPROVAL' | 'REJECTION' = 'UPDATE';
    
    switch (action) {
      case 'approve':
        updateData.status = 'APPROVED';
        updateData.approvalStatus = 'APPROVED';
        updateData.approvedAt = new Date();
        updateData.approvedById = adminId;
        auditAction = 'APPROVAL';
        break;
      case 'reject':
        updateData.status = 'REJECTED';
        updateData.approvalStatus = 'REJECTED';
        updateData.rejectionReason = reason || 'Rejected by admin';
        auditAction = 'REJECTION';
        break;
      case 'requestRevision':
        updateData.approvalStatus = 'REVISION_REQUESTED';
        updateData.rejectionReason = reason || 'Revision requested';
        break;
      case 'unpublish':
        updateData.status = 'UNAVAILABLE';
        break;
      case 'publish':
        updateData.status = 'APPROVED';
        break;
      default:
        return errorResponse('Invalid action', 'VALIDATION_ERROR', 400);
    }
    
    // Get properties before update for audit
    const propertiesBefore = await prisma.property.findMany({
      where: { id: { in: propertyIds } },
      select: { id: true, title: true, status: true, approvalStatus: true },
    });
    
    // Update properties
    await prisma.property.updateMany({
      where: { id: { in: propertyIds } },
      data: updateData,
    });
    
    // Create audit logs
    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);
    
    for (const property of propertiesBefore) {
      await createAuditLog({
        userId: adminId,
        action: auditAction,
        entityType: 'Property',
        entityId: property.id,
        oldValues: { status: property.status, approvalStatus: property.approvalStatus },
        newValues: updateData,
        ipAddress,
        userAgent,
      });
    }
    
    return successResponse(
      { updated: propertyIds.length },
      `Successfully ${action}ed ${propertyIds.length} property(ies)`
    );
  } catch (error) {
    console.error('Admin properties update error:', error);
    return errorResponse('Failed to update properties', 'INTERNAL_ERROR', 500);
  }
}
