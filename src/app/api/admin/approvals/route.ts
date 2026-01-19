/**
 * Zambia Property - Admin Approvals API
 * 
 * Pending approvals endpoints for users and properties
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
 * GET /api/admin/approvals
 * Get all pending approvals (users and properties)
 */
export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  
  try {
    const params = getPaginationParams(request);
    const searchParams = getSearchParams(request);
    const type = searchParams.get('type'); // 'users', 'properties', or 'all'
    
    const results: {
      pendingUsers?: unknown[];
      pendingProperties?: unknown[];
      counts: {
        users: number;
        properties: number;
        total: number;
      };
    } = {
      counts: {
        users: 0,
        properties: 0,
        total: 0,
      },
    };
    
    // Get pending users
    if (!type || type === 'users' || type === 'all') {
      const pendingUsersCount = await prisma.user.count({
        where: {
          status: 'PENDING_VERIFICATION',
          isDeleted: false,
        },
      });
      
      results.counts.users = pendingUsersCount;
      
      if (type !== 'properties') {
        const pendingUsers = await prisma.user.findMany({
          where: {
            status: 'PENDING_VERIFICATION',
            isDeleted: false,
          },
          orderBy: { createdAt: 'asc' }, // Oldest first (FIFO)
          skip: type === 'users' ? params.skip : 0,
          take: type === 'users' ? params.limit : 10,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
            agentProfile: {
              select: {
                companyName: true,
                licenseNumber: true,
                specializations: true,
              },
            },
            landlordProfile: {
              select: {
                companyName: true,
                taxId: true,
              },
            },
          },
        });
        
        results.pendingUsers = pendingUsers;
      }
    }
    
    // Get pending properties
    if (!type || type === 'properties' || type === 'all') {
      const pendingPropertiesCount = await prisma.property.count({
        where: {
          OR: [
            { status: 'PENDING_APPROVAL' },
            { approvalStatus: 'SUBMITTED' },
          ],
          isDeleted: false,
        },
      });
      
      results.counts.properties = pendingPropertiesCount;
      
      if (type !== 'users') {
        const pendingProperties = await prisma.property.findMany({
          where: {
            OR: [
              { status: 'PENDING_APPROVAL' },
              { approvalStatus: 'SUBMITTED' },
            ],
            isDeleted: false,
          },
          orderBy: { createdAt: 'asc' }, // Oldest first (FIFO)
          skip: type === 'properties' ? params.skip : 0,
          take: type === 'properties' ? params.limit : 10,
          select: {
            id: true,
            title: true,
            slug: true,
            propertyType: true,
            listingType: true,
            price: true,
            currency: true,
            city: true,
            province: true,
            bedrooms: true,
            bathrooms: true,
            status: true,
            approvalStatus: true,
            createdAt: true,
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
          },
        });
        
        results.pendingProperties = pendingProperties;
      }
    }
    
    results.counts.total = results.counts.users + results.counts.properties;
    
    // If requesting specific type with pagination
    if (type === 'users') {
      return successResponse(
        createPaginatedResponse(results.pendingUsers || [], results.counts.users, params)
      );
    }
    
    if (type === 'properties') {
      return successResponse(
        createPaginatedResponse(results.pendingProperties || [], results.counts.properties, params)
      );
    }
    
    return successResponse(results);
  } catch (error) {
    console.error('Admin approvals list error:', error);
    return errorResponse('Failed to fetch approvals', 'INTERNAL_ERROR', 500);
  }
}
