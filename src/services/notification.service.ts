/**
 * Notification Service
 * Handles in-app and email notifications
 */

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

interface NotificationInput {
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: any;
}

interface AdminNotificationInput {
  title: string;
  message: string;
  type: string;
  data?: any;
}

export class NotificationService {
  /**
   * Create a notification for a user
   */
  async create(input: NotificationInput) {
    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type,
        data: input.data,
      },
    });
    
    // TODO: Send push notification if enabled
    // TODO: Send email if enabled
    
    return notification;
  }
  
  /**
   * Notify all admins
   */
  async notifyAdmins(input: AdminNotificationInput) {
    const admins = await prisma.user.findMany({
      where: {
        role: UserRole.ADMIN,
        isDeleted: false,
      },
      select: { id: true },
    });
    
    const notifications = await Promise.all(
      admins.map(admin =>
        this.create({
          userId: admin.id,
          ...input,
        })
      )
    );
    
    return notifications;
  }
  
  /**
   * Get user's notifications
   */
  async getUserNotifications(
    userId: string,
    params: { unreadOnly?: boolean; page?: number; limit?: number }
  ) {
    const { unreadOnly = false, page = 1, limit = 20 } = params;
    
    const where = {
      userId,
      ...(unreadOnly && { isRead: false }),
    };
    
    const [total, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    
    return {
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  /**
   * Mark notification as read
   */
  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
  
  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
  
  /**
   * Delete old notifications (cleanup job)
   */
  async cleanupOld(daysOld: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    return prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true,
      },
    });
  }
}
