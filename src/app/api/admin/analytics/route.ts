/**
 * Zambia Property - Admin Analytics API
 * 
 * Platform analytics and statistics
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  requireAdmin,
  errorResponse,
  successResponse,
} from '@/lib/admin';

/**
 * GET /api/admin/analytics
 * Get comprehensive platform analytics
 */
export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const periodDays = parseInt(period, 10);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    
    // Run all queries in parallel
    const [
      // User stats
      totalUsers,
      activeUsers,
      pendingUsers,
      newUsersInPeriod,
      usersByRole,
      
      // Property stats
      totalProperties,
      approvedProperties,
      pendingProperties,
      newPropertiesInPeriod,
      propertiesByType,
      propertiesByListingType,
      propertiesByCity,
      featuredCount,
      
      // Engagement stats
      totalInquiries,
      newInquiriesInPeriod,
      totalFavorites,
      totalViews,
      
      // Revenue stats (if tracking featured listings revenue)
      recentActivity,
    ] = await Promise.all([
      // User queries
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.user.count({ where: { status: 'ACTIVE', isDeleted: false } }),
      prisma.user.count({ where: { status: 'PENDING_VERIFICATION', isDeleted: false } }),
      prisma.user.count({
        where: {
          createdAt: { gte: startDate },
          isDeleted: false,
        },
      }),
      prisma.user.groupBy({
        by: ['role'],
        where: { isDeleted: false },
        _count: { role: true },
      }),
      
      // Property queries
      prisma.property.count({ where: { isDeleted: false } }),
      prisma.property.count({ where: { status: 'APPROVED', isDeleted: false } }),
      prisma.property.count({
        where: {
          OR: [
            { status: 'PENDING_APPROVAL' },
            { approvalStatus: 'SUBMITTED' },
          ],
          isDeleted: false,
        },
      }),
      prisma.property.count({
        where: {
          createdAt: { gte: startDate },
          isDeleted: false,
        },
      }),
      prisma.property.groupBy({
        by: ['propertyType'],
        where: { isDeleted: false },
        _count: { propertyType: true },
      }),
      prisma.property.groupBy({
        by: ['listingType'],
        where: { isDeleted: false },
        _count: { listingType: true },
      }),
      prisma.property.groupBy({
        by: ['city'],
        where: { isDeleted: false },
        _count: { city: true },
        orderBy: { _count: { city: 'desc' } },
        take: 10,
      }),
      prisma.featuredProperty.count({ 
        where: { 
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        } 
      }),
      
      // Engagement queries
      prisma.inquiry.count(),
      prisma.inquiry.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.savedProperty.count(),
      prisma.property.aggregate({
        where: { isDeleted: false },
        _sum: { viewCount: true },
      }),
      
      // Recent activity
      prisma.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);
    
    // Calculate growth rates
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - periodDays);
    
    const [previousUsers, previousProperties, previousInquiries] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: { gte: previousStartDate, lt: startDate },
          isDeleted: false,
        },
      }),
      prisma.property.count({
        where: {
          createdAt: { gte: previousStartDate, lt: startDate },
          isDeleted: false,
        },
      }),
      prisma.inquiry.count({
        where: { createdAt: { gte: previousStartDate, lt: startDate } },
      }),
    ]);
    
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };
    
    // Daily stats for charts
    const dailyStats = await Promise.all(
      Array.from({ length: Math.min(periodDays, 30) }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        return Promise.all([
          prisma.user.count({
            where: {
              createdAt: { gte: date, lt: nextDate },
              isDeleted: false,
            },
          }),
          prisma.property.count({
            where: {
              createdAt: { gte: date, lt: nextDate },
              isDeleted: false,
            },
          }),
          prisma.inquiry.count({
            where: { createdAt: { gte: date, lt: nextDate } },
          }),
        ]).then(([users, properties, inquiries]) => ({
          date: date.toISOString().split('T')[0],
          users,
          properties,
          inquiries,
        }));
      })
    );
    
    return successResponse({
      overview: {
        users: {
          total: totalUsers,
          active: activeUsers,
          pending: pendingUsers,
          newInPeriod: newUsersInPeriod,
          growth: calculateGrowth(newUsersInPeriod, previousUsers),
        },
        properties: {
          total: totalProperties,
          approved: approvedProperties,
          pending: pendingProperties,
          newInPeriod: newPropertiesInPeriod,
          featured: featuredCount,
          growth: calculateGrowth(newPropertiesInPeriod, previousProperties),
        },
        engagement: {
          totalInquiries,
          newInquiriesInPeriod,
          inquiriesGrowth: calculateGrowth(newInquiriesInPeriod, previousInquiries),
          totalFavorites,
          totalViews: totalViews._sum.viewCount || 0,
        },
      },
      distributions: {
        usersByRole: usersByRole.map(r => ({
          role: r.role,
          count: r._count.role,
        })),
        propertiesByType: propertiesByType.map(p => ({
          type: p.propertyType,
          count: p._count.propertyType,
        })),
        propertiesByListingType: propertiesByListingType.map(p => ({
          listingType: p.listingType,
          count: p._count.listingType,
        })),
        propertiesByCity: propertiesByCity.map(p => ({
          city: p.city,
          count: p._count.city,
        })),
      },
      trends: dailyStats.reverse(),
      recentActivity,
      period: {
        days: periodDays,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return errorResponse('Failed to fetch analytics', 'INTERNAL_ERROR', 500);
  }
}
