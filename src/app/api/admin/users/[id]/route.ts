/**
 * Zambia Property - Admin Single User API
 * 
 * Individual user management with audit logging
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
 * GET /api/admin/users/[id]
 * Get user details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  const { id } = await params;
  
  if (!isValidUUID(id)) {
    return errorResponse('Invalid user ID', 'VALIDATION_ERROR', 400);
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        agentProfile: true,
        landlordProfile: true,
        properties: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
        },
        inquiriesSent: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            message: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            properties: true,
            inquiriesSent: true,
            savedProperties: true,
          },
        },
      },
    });
    
    if (!user) {
      return errorResponse('User not found', 'NOT_FOUND', 404);
    }
    
    // Log view action
    const adminId = getAdminUserId(request);
    if (adminId) {
      await createAuditLog({
        userId: adminId,
        action: 'VIEW',
        entityType: 'User',
        entityId: id,
        targetUserId: id,
        ipAddress: getIpAddress(request),
        userAgent: getUserAgent(request),
      });
    }
    
    return successResponse(user);
  } catch (error) {
    console.error('Admin user get error:', error);
    return errorResponse('Failed to fetch user', 'INTERNAL_ERROR', 500);
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update user status, role, or verification
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
    return errorResponse('Invalid user ID', 'VALIDATION_ERROR', 400);
  }
  
  try {
    const body = await request.json();
    const { status, role, isEmailVerified, reason } = body;
    
    // Get user before update
    const userBefore = await prisma.user.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        email: true,
        status: true,
        role: true,
        emailVerified: true,
      },
    });
    
    if (!userBefore) {
      return errorResponse('User not found', 'NOT_FOUND', 404);
    }
    
    // Build update data
    const updateData: Record<string, unknown> = {};
    
    if (status !== undefined) {
      updateData.status = status;
    }
    
    if (role !== undefined) {
      updateData.role = role;
    }
    
    if (isEmailVerified !== undefined) {
      updateData.emailVerified = isEmailVerified ? new Date() : null;
    }
    
    if (Object.keys(updateData).length === 0) {
      return errorResponse('No update data provided', 'VALIDATION_ERROR', 400);
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        updatedAt: true,
      },
    });
    
    // Determine audit action type
    let auditAction: 'UPDATE' | 'APPROVAL' | 'REJECTION' = 'UPDATE';
    if (status === 'ACTIVE' && userBefore.status === 'PENDING_VERIFICATION') {
      auditAction = 'APPROVAL';
    } else if (status === 'SUSPENDED') {
      auditAction = 'REJECTION';
    }
    
    // Create audit log
    await createAuditLog({
      userId: adminId,
      action: auditAction,
      entityType: 'User',
      entityId: id,
      targetUserId: id,
      oldValues: {
        status: userBefore.status,
        role: userBefore.role,
        emailVerified: userBefore.emailVerified,
      },
      newValues: updateData,
      ipAddress: getIpAddress(request),
      userAgent: getUserAgent(request),
    });
    
    return successResponse(updatedUser, 'User updated successfully');
  } catch (error) {
    console.error('Admin user update error:', error);
    return errorResponse('Failed to update user', 'INTERNAL_ERROR', 500);
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Soft delete user
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
    return errorResponse('Invalid user ID', 'VALIDATION_ERROR', 400);
  }
  
  try {
    // Get user before delete
    const user = await prisma.user.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });
    
    if (!user) {
      return errorResponse('User not found', 'NOT_FOUND', 404);
    }
    
    // Prevent deleting admin users
    if (user.role === 'ADMIN') {
      return errorResponse('Cannot delete admin users', 'FORBIDDEN', 403);
    }
    
    // Soft delete user
    await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        email: `deleted_${Date.now()}_${user.email}`, // Anonymize email
      },
    });
    
    // Create audit log
    await createAuditLog({
      userId: adminId,
      action: 'DELETE',
      entityType: 'User',
      entityId: id,
      targetUserId: id,
      oldValues: user,
      ipAddress: getIpAddress(request),
      userAgent: getUserAgent(request),
    });
    
    return successResponse({ deleted: true }, 'User deleted successfully');
  } catch (error) {
    console.error('Admin user delete error:', error);
    return errorResponse('Failed to delete user', 'INTERNAL_ERROR', 500);
  }
}
