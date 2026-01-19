/**
 * Zambia Property - Admin Stats API
 * 
 * Dashboard statistics and recent activity
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin, errorResponse, successResponse } from '@/lib/admin';

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  try {
    const [
      // User counts
      totalUsers,
      totalAgents,
      totalLandlords,
      pendingUserApprovals,
      
      // Property counts
      totalProperties,
      pendingPropertyApprovals,
      featuredProperties,
      
      // Engagement
      totalInquiries,
      unreadInquiries,
      
      // Recent items
      recentUsers,
      recentProperties,
      recentActivity,
    ] = await Promise.all([
      // User counts
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.user.count({ where: { role: 'AGENT', isDeleted: false } }),
      prisma.user.count({ where: { role: 'LANDLORD', isDeleted: false } }),
      prisma.user.count({ where: { status: 'PENDING_VERIFICATION', isDeleted: false } }),
      
      // Property counts
      prisma.property.count({ where: { isDeleted: false } }),
      prisma.property.count({
        where: {
          OR: [
            { status: 'PENDING_APPROVAL' },
            { approvalStatus: 'SUBMITTED' },
          ],
          isDeleted: false,
        },
      }),
      prisma.featuredProperty.count({ 
        where: { 
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        } 
      }),
      
      // Engagement
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'NEW' } }),
      
      // Recent users
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: { isDeleted: false },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
      
      // Recent properties
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: { isDeleted: false },
        select: {
          id: true,
          title: true,
          status: true,
          approvalStatus: true,
          createdAt: true,
          owner: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      
      // Recent activity
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);
    
    return successResponse({
      totalUsers,
      totalAgents,
      totalLandlords,
      totalProperties,
      pendingApprovals: pendingUserApprovals + pendingPropertyApprovals,
      pendingUserApprovals,
      pendingPropertyApprovals,
      featuredProperties,
      totalInquiries,
      unreadInquiries,
      recentUsers,
      recentProperties,
      recentActivity,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return errorResponse('Failed to fetch stats', 'INTERNAL_ERROR', 500);
  }
}
