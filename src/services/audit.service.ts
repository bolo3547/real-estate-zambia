/**
 * Audit Service
 * Tracks all significant actions in the system
 */

import { PrismaClient, AuditAction } from '@prisma/client';

const prisma = new PrismaClient();

interface AuditLogInput {
  userId?: string;
  targetUserId?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

export class AuditService {
  /**
   * Create an audit log entry
   */
  async log(input: AuditLogInput) {
    return prisma.auditLog.create({
      data: {
        userId: input.userId,
        targetUserId: input.targetUserId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        oldValues: input.oldValues ? JSON.parse(JSON.stringify(input.oldValues)) : null,
        newValues: input.newValues ? JSON.parse(JSON.stringify(input.newValues)) : null,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        requestId: input.requestId,
      },
    });
  }
  
  /**
   * Get audit logs with filtering
   */
  async getLogs(params: {
    userId?: string;
    targetUserId?: string;
    action?: AuditAction;
    entityType?: string;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const {
      userId,
      targetUserId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = params;
    
    const where = {
      ...(userId && { userId }),
      ...(targetUserId && { targetUserId }),
      ...(action && { action }),
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
      ...(startDate && endDate && {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };
    
    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          targetUser: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);
    
    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  /**
   * Get audit trail for a specific entity
   */
  async getEntityHistory(entityType: string, entityId: string) {
    return prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
  
  /**
   * Get user activity summary
   */
  async getUserActivitySummary(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const activities = await prisma.auditLog.groupBy({
      by: ['action'],
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      _count: true,
    });
    
    return activities.map(a => ({
      action: a.action,
      count: a._count,
    }));
  }
}
