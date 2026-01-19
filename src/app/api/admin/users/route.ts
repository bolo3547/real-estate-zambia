/**
 * Zambia Property - Admin Users API
 * 
 * User management endpoints with audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
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
  sanitizeUsers,
  errorResponse,
  successResponse,
} from '@/lib/admin';

/**
 * GET /api/admin/users
 * List all users with pagination, search, and filters
 */
export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  try {
    const params = getPaginationParams(request);
    const searchParams = getSearchParams(request);
    
    // Build filters
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const where: Record<string, unknown> = {
      isDeleted: false,
    };
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role) {
      where.role = role;
    }
    
    if (status) {
      where.status = status;
    }
    
    // Get total count
    const total = await prisma.user.count({ where });
    
    // Get users
    const users = await prisma.user.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      orderBy: { [sortBy]: sortOrder },
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
        agentProfile: {
          select: {
            isVerified: true,
            companyName: true,
            licenseNumber: true,
          },
        },
        landlordProfile: {
          select: {
            isVerified: true,
            companyName: true,
          },
        },
        _count: {
          select: {
            properties: true,
            inquiriesSent: true,
          },
        },
      },
    });
    
    return successResponse(createPaginatedResponse(users, total, params));
  } catch (error) {
    console.error('Admin users list error:', error);
    return errorResponse('Failed to fetch users', 'INTERNAL_ERROR', 500);
  }
}

/**
 * PATCH /api/admin/users
 * Bulk update users (status, role)
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
    const { userIds, action, value, reason } = body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return errorResponse('User IDs required', 'VALIDATION_ERROR', 400);
    }
    
    if (!action) {
      return errorResponse('Action required', 'VALIDATION_ERROR', 400);
    }
    
    const updateData: Record<string, unknown> = {};
    let auditAction: 'UPDATE' | 'APPROVAL' | 'REJECTION' = 'UPDATE';
    
    switch (action) {
      case 'activate':
        updateData.status = 'ACTIVE';
        auditAction = 'APPROVAL';
        break;
      case 'suspend':
        updateData.status = 'SUSPENDED';
        auditAction = 'REJECTION';
        break;
      case 'deactivate':
        updateData.status = 'INACTIVE';
        break;
      case 'changeRole':
        if (!value) {
          return errorResponse('Role value required', 'VALIDATION_ERROR', 400);
        }
        updateData.role = value;
        break;
      case 'verifyEmail':
        updateData.isEmailVerified = true;
        break;
      default:
        return errorResponse('Invalid action', 'VALIDATION_ERROR', 400);
    }
    
    // Get users before update for audit
    const usersBefore = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, status: true, role: true, email: true },
    });
    
    // Update users
    await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: updateData,
    });
    
    // Create audit logs
    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);
    
    for (const user of usersBefore) {
      await createAuditLog({
        userId: adminId,
        action: auditAction,
        entityType: 'User',
        entityId: user.id,
        targetUserId: user.id,
        oldValues: { status: user.status, role: user.role },
        newValues: updateData,
        ipAddress,
        userAgent,
      });
    }
    
    return successResponse(
      { updated: userIds.length },
      `Successfully ${action}d ${userIds.length} user(s)`
    );
  } catch (error) {
    console.error('Admin users update error:', error);
    return errorResponse('Failed to update users', 'INTERNAL_ERROR', 500);
  }
}
