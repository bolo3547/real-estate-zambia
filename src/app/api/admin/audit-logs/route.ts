/**
 * Zambia Property - Admin Audit Logs API
 * 
 * Retrieve audit logs with filtering and pagination
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  requireAdmin,
  getPaginationParams,
  createPaginatedResponse,
  getSearchParams,
  errorResponse,
  successResponse,
} from '@/lib/admin';

/**
 * GET /api/admin/audit-logs
 * Get audit logs with pagination and filters
 */
export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  try {
    const params = getPaginationParams(request, 50);
    const searchParams = getSearchParams(request);
    
    // Build filters
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');
    const userId = searchParams.get('userId');
    const entityId = searchParams.get('entityId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    
    const where: Record<string, unknown> = {};
    
    if (action) {
      where.action = action;
    }
    
    if (entityType) {
      where.entityType = entityType;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (entityId) {
      where.entityId = entityId;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.createdAt as Record<string, Date>).lte = new Date(endDate);
      }
    }
    
    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive',
      };
    }
    
    // Get total count
    const total = await prisma.auditLog.count({ where });
    
    // Get logs
    const logs = await prisma.auditLog.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        oldValues: true,
        newValues: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
    
    return successResponse(createPaginatedResponse(logs, total, params));
  } catch (error) {
    console.error('Admin audit logs error:', error);
    return errorResponse('Failed to fetch audit logs', 'INTERNAL_ERROR', 500);
  }
}
