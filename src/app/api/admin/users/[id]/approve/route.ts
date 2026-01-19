/**
 * Zambia Property - Admin User Approvals API
 * 
 * Handles user approval/rejection by admins
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
 * PATCH /api/admin/users/[id]/approve
 * Approve or reject user
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
    const { action, notes } = body; // action: 'approve' | 'reject'
    
    if (!['approve', 'reject'].includes(action)) {
      return errorResponse('Invalid action', 'VALIDATION_ERROR', 400);
    }
    
    const user = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      return errorResponse('User not found', 'NOT_FOUND', 404);
    }
    
    const newStatus = action === 'approve' ? 'ACTIVE' : 'SUSPENDED';
    
    await prisma.user.update({
      where: { id },
      data: { status: newStatus },
    });
    
    // Update verification status for agent/landlord profiles
    if (action === 'approve') {
      if (user.role === 'AGENT') {
        await prisma.agentProfile.updateMany({
          where: { userId: id },
          data: { isVerified: true, verifiedAt: new Date() },
        });
      } else if (user.role === 'LANDLORD') {
        await prisma.landlordProfile.updateMany({
          where: { userId: id },
          data: { isVerified: true, verifiedAt: new Date() },
        });
      }
    }
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId!,
        action: action === 'approve' ? 'APPROVAL' : 'REJECTION',
        entityType: 'User',
        entityId: id,
        newValues: { status: newStatus, notes },
      },
    });
    
    return NextResponse.json({
      success: true,
      message: `User ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error) {
    console.error('User approval error:', error);
    return errorResponse('Failed to process approval', 'INTERNAL_ERROR', 500);
  }
}
