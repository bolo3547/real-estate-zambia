/**
 * Zambia Property - Admin Property Approvals API
 * 
 * Handles property approval/rejection by admins
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
 * PATCH /api/admin/properties/[id]/approve
 * Approve or reject property
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
    const { action, notes } = body;
    
    if (!['approve', 'reject'].includes(action)) {
      return errorResponse('Invalid action', 'VALIDATION_ERROR', 400);
    }
    
    const property = await prisma.property.findUnique({
      where: { id },
    });
    
    if (!property) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
    
    await prisma.property.update({
      where: { id },
      data: {
        status: newStatus,
        approvedAt: action === 'approve' ? new Date() : null,
        approvedBy: action === 'approve' ? adminId : null,
        rejectionReason: action === 'reject' ? notes : null,
        publishedAt: action === 'approve' ? new Date() : null,
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId!,
        action: action === 'approve' ? 'APPROVAL' : 'REJECTION',
        entityType: 'Property',
        entityId: id,
        targetUserId: property.ownerId,
        newValues: { status: newStatus, notes },
      },
    });
    
    // Create notification for property owner
    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        title: action === 'approve' ? 'Property Approved' : 'Property Rejected',
        message: action === 'approve'
          ? `Your property "${property.title}" has been approved and is now live.`
          : `Your property "${property.title}" was rejected. ${notes || ''}`,
        type: 'approval',
        data: { propertyId: id },
      },
    });
    
    return NextResponse.json({
      success: true,
      message: `Property ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error) {
    console.error('Property approval error:', error);
    return errorResponse('Failed to process approval', 'INTERNAL_ERROR', 500);
  }
}
