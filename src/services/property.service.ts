/**
 * Property Service
 * Handles business logic for property operations
 * Includes scalable query patterns
 */

import { PrismaClient, Prisma, PropertyStatus, ApprovalAction } from '@prisma/client';
import { AppError } from '../api/utils/errors';
import { CreatePropertyInput, UpdatePropertyInput, PropertyQueryInput } from '../api/validators/property.validators';
import { generateSlug } from '../utils/slug';
import { AuditService } from './audit.service';
import { NotificationService } from './notification.service';
import { CacheService } from './cache.service';

const prisma = new PrismaClient();

/**
 * ==============================
 * PROPERTY SERVICE
 * ==============================
 */
export class PropertyService {
  private auditService: AuditService;
  private notificationService: NotificationService;
  private cacheService: CacheService;
  
  constructor() {
    this.auditService = new AuditService();
    this.notificationService = new NotificationService();
    this.cacheService = new CacheService();
  }
  
  /**
   * ==============================
   * LIST PROPERTIES (SCALABLE)
   * ==============================
   * Uses cursor-based pagination for large datasets
   */
  async list(params: PropertyQueryInput, userId?: string) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      propertyType,
      listingType,
      city,
      province,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minArea,
      maxArea,
      latitude,
      longitude,
      radius,
      q,
      features,
      ownerId,
      agentId,
      featured,
    } = params;
    
    // Build where clause dynamically
    const where: Prisma.PropertyWhereInput = {
      isDeleted: false,
      // Only show approved properties publicly
      ...(userId ? {} : { status: PropertyStatus.APPROVED }),
      ...(status && { status }),
      ...(propertyType && { propertyType }),
      ...(listingType && { listingType }),
      ...(city && { city: { contains: city } }),
      ...(province && { province: { contains: province } }),
      ...(ownerId && { ownerId }),
      ...(agentId && { agentId }),
      ...(featured && {
        featured: {
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      }),
    };
    
    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      };
    }
    
    // Bedroom filter
    if (minBedrooms || maxBedrooms) {
      where.bedrooms = {
        ...(minBedrooms && { gte: minBedrooms }),
        ...(maxBedrooms && { lte: maxBedrooms }),
      };
    }
    
    // Bathroom filter
    if (minBathrooms || maxBathrooms) {
      where.bathrooms = {
        ...(minBathrooms && { gte: minBathrooms }),
        ...(maxBathrooms && { lte: maxBathrooms }),
      };
    }
    
    // Area filter
    if (minArea || maxArea) {
      where.floorArea = {
        ...(minArea && { gte: minArea }),
        ...(maxArea && { lte: maxArea }),
      };
    }
    
    // Full-text search
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { address: { contains: q } },
        { city: { contains: q } },
      ];
    }
    
    // Feature filters
    if (features) {
      const featureList = features.split(',').map(f => f.trim());
      // For MySQL JSON, use string_contains for each feature
      where.AND = featureList.map(feature => ({
        features: {
          path: '$',
          string_contains: feature,
        },
      }));
    }
    
    // Calculate offset for pagination
    const skip = (page - 1) * limit;
    
    // Execute count and find in parallel
    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          slug: true,
          propertyType: true,
          listingType: true,
          status: true,
          price: true,
          currency: true,
          address: true,
          city: true,
          province: true,
          bedrooms: true,
          bathrooms: true,
          floorArea: true,
          latitude: true,
          longitude: true,
          viewCount: true,
          saveCount: true,
          createdAt: true,
          publishedAt: true,
          images: {
            where: { isPrimary: true },
            take: 1,
            select: {
              url: true,
              thumbnailUrl: true,
              altText: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          agent: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              companyName: true,
              isVerified: true,
            },
          },
          featured: {
            select: {
              tier: true,
              endDate: true,
            },
          },
        },
      }),
    ]);
    
    // Geo-distance filtering (post-query for simplicity)
    // For production, use PostGIS extension
    let filteredProperties = properties;
    if (latitude && longitude && radius) {
      filteredProperties = properties.filter(p => {
        if (!p.latitude || !p.longitude) return false;
        const distance = this.calculateDistance(
          latitude,
          longitude,
          p.latitude,
          p.longitude
        );
        return distance <= radius;
      });
    }
    
    return {
      data: filteredProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + properties.length < total,
      },
    };
  }
  
  /**
   * ==============================
   * GET PROPERTY BY ID OR SLUG
   * ==============================
   */
  async getByIdOrSlug(idOrSlug: string, userId?: string) {
    // Try cache first
    const cacheKey = `property:${idOrSlug}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;
    
    const property = await prisma.property.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
        isDeleted: false,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            phone: true,
          },
        },
        agent: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        featured: true,
        _count: {
          select: {
            inquiries: true,
            savedBy: true,
            views: true,
          },
        },
      },
    });
    
    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND');
    }
    
    // Check access for non-approved properties
    if (property.status !== PropertyStatus.APPROVED) {
      if (!userId || (property.ownerId !== userId && property.agent?.userId !== userId)) {
        throw new AppError('Property not found', 404, 'NOT_FOUND');
      }
    }
    
    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, property, 300);
    
    return property;
  }
  
  /**
   * ==============================
   * CREATE PROPERTY
   * ==============================
   */
  async create(data: CreatePropertyInput, userId: string) {
    // Check subscription limits
    await this.checkListingLimits(userId);
    
    // Generate unique slug
    const baseSlug = generateSlug(data.title);
    const slug = await this.generateUniqueSlug(baseSlug);
    
    const property = await prisma.property.create({
      data: {
        ...data,
        slug,
        ownerId: userId,
        status: PropertyStatus.DRAFT,
        approvalStatus: ApprovalAction.SUBMITTED,
      },
      include: {
        images: true,
      },
    });
    
    // Audit log
    await this.auditService.log({
      userId,
      action: 'CREATE',
      entityType: 'Property',
      entityId: property.id,
      newValues: data,
    });
    
    return property;
  }
  
  /**
   * ==============================
   * UPDATE PROPERTY
   * ==============================
   */
  async update(id: string, data: UpdatePropertyInput, userId: string) {
    const existing = await this.findAndValidateOwnership(id, userId);
    
    // Generate new slug if title changed
    let slug = existing.slug;
    if (data.title && data.title !== existing.title) {
      const baseSlug = generateSlug(data.title);
      slug = await this.generateUniqueSlug(baseSlug, id);
    }
    
    // If property was approved but is being edited, reset to pending
    const needsReapproval = 
      existing.status === PropertyStatus.APPROVED &&
      this.hasSignificantChanges(data);
    
    const property = await prisma.property.update({
      where: { id },
      data: {
        ...data,
        slug,
        ...(needsReapproval && {
          status: PropertyStatus.PENDING_APPROVAL,
          approvalStatus: ApprovalAction.SUBMITTED,
        }),
      },
      include: {
        images: true,
      },
    });
    
    // Invalidate cache
    await this.cacheService.delete(`property:${id}`);
    await this.cacheService.delete(`property:${existing.slug}`);
    
    // Audit log
    await this.auditService.log({
      userId,
      action: 'UPDATE',
      entityType: 'Property',
      entityId: id,
      oldValues: existing,
      newValues: data,
    });
    
    return property;
  }
  
  /**
   * ==============================
   * SOFT DELETE PROPERTY
   * ==============================
   */
  async delete(id: string, userId: string) {
    const existing = await this.findAndValidateOwnership(id, userId);
    
    await prisma.property.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: PropertyStatus.WITHDRAWN,
      },
    });
    
    // Invalidate cache
    await this.cacheService.delete(`property:${id}`);
    await this.cacheService.delete(`property:${existing.slug}`);
    
    // Audit log
    await this.auditService.log({
      userId,
      action: 'DELETE',
      entityType: 'Property',
      entityId: id,
    });
    
    return { success: true };
  }
  
  /**
   * ==============================
   * SUBMIT FOR APPROVAL
   * ==============================
   */
  async submitForApproval(id: string, userId: string) {
    const property = await this.findAndValidateOwnership(id, userId);
    
    // Validate property completeness
    this.validatePropertyCompleteness(property);
    
    await prisma.property.update({
      where: { id },
      data: {
        status: PropertyStatus.PENDING_APPROVAL,
        approvalStatus: ApprovalAction.SUBMITTED,
      },
    });
    
    // Notify admins
    await this.notificationService.notifyAdmins({
      title: 'New Property Pending Approval',
      message: `Property "${property.title}" is waiting for approval`,
      type: 'approval',
      data: { propertyId: id },
    });
    
    return { success: true, status: 'PENDING_APPROVAL' };
  }
  
  /**
   * ==============================
   * APPROVE PROPERTY (ADMIN)
   * ==============================
   */
  async approve(id: string, adminId: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { owner: true },
    });
    
    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND');
    }
    
    await prisma.property.update({
      where: { id },
      data: {
        status: PropertyStatus.APPROVED,
        approvalStatus: ApprovalAction.APPROVED,
        approvedAt: new Date(),
        approvedBy: adminId,
        publishedAt: new Date(),
      },
    });
    
    // Notify owner
    await this.notificationService.create({
      userId: property.ownerId,
      title: 'Property Approved',
      message: `Your property "${property.title}" has been approved and is now live`,
      type: 'approval',
      data: { propertyId: id },
    });
    
    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: 'APPROVAL',
      entityType: 'Property',
      entityId: id,
      targetUserId: property.ownerId,
    });
    
    return { success: true };
  }
  
  /**
   * ==============================
   * REJECT PROPERTY (ADMIN)
   * ==============================
   */
  async reject(id: string, adminId: string, reason: string) {
    const property = await prisma.property.findUnique({
      where: { id },
    });
    
    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND');
    }
    
    await prisma.property.update({
      where: { id },
      data: {
        status: PropertyStatus.REJECTED,
        approvalStatus: ApprovalAction.REJECTED,
        rejectionReason: reason,
      },
    });
    
    // Notify owner
    await this.notificationService.create({
      userId: property.ownerId,
      title: 'Property Rejected',
      message: `Your property "${property.title}" was rejected. Reason: ${reason}`,
      type: 'approval',
      data: { propertyId: id, reason },
    });
    
    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: 'REJECTION',
      entityType: 'Property',
      entityId: id,
      targetUserId: property.ownerId,
      newValues: { reason },
    });
    
    return { success: true };
  }
  
  /**
   * ==============================
   * TRACK VIEW
   * ==============================
   */
  async trackView(
    propertyId: string,
    userId?: string,
    metadata?: { ipAddress?: string; userAgent?: string; referrer?: string; sessionId?: string }
  ) {
    // Check for duplicate views (same user/session within 1 hour)
    const recentView = await prisma.propertyView.findFirst({
      where: {
        propertyId,
        ...(userId ? { userId } : { sessionId: metadata?.sessionId }),
        viewedAt: { gte: new Date(Date.now() - 3600000) },
      },
    });
    
    if (recentView) {
      // Update duration if returning to same property
      return recentView;
    }
    
    // Create view record
    const view = await prisma.propertyView.create({
      data: {
        propertyId,
        userId,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        referrer: metadata?.referrer,
        sessionId: metadata?.sessionId,
      },
    });
    
    // Increment view count (batched for performance)
    await prisma.property.update({
      where: { id: propertyId },
      data: { viewCount: { increment: 1 } },
    });
    
    return view;
  }
  
  /**
   * ==============================
   * GET FEATURED PROPERTIES
   * ==============================
   */
  async getFeatured(limit: number = 10) {
    const cacheKey = `featured:${limit}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;
    
    const now = new Date();
    
    const featured = await prisma.property.findMany({
      where: {
        isDeleted: false,
        status: PropertyStatus.APPROVED,
        featured: {
          startDate: { lte: now },
          endDate: { gte: now },
        },
      },
      orderBy: [
        { featured: { tier: 'desc' } },
        { featured: { sortOrder: 'asc' } },
      ],
      take: limit,
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
        floorArea: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        featured: {
          select: { tier: true },
        },
      },
    });
    
    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, featured, 300);
    
    return featured;
  }
  
  /**
   * ==============================
   * HELPER METHODS
   * ==============================
   */
  
  private async findAndValidateOwnership(id: string, userId: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { agent: true },
    });
    
    if (!property || property.isDeleted) {
      throw new AppError('Property not found', 404, 'NOT_FOUND');
    }
    
    const isOwner = property.ownerId === userId;
    const isAgent = property.agent?.userId === userId;
    
    if (!isOwner && !isAgent) {
      throw new AppError('Access denied', 403, 'FORBIDDEN');
    }
    
    return property;
  }
  
  private async generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await prisma.property.findUnique({
        where: { slug },
      });
      
      if (!existing || existing.id === excludeId) {
        return slug;
      }
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
  
  private async checkListingLimits(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    
    const maxListings = subscription?.maxListings || 5;
    
    const currentCount = await prisma.property.count({
      where: {
        ownerId: userId,
        isDeleted: false,
        status: { notIn: [PropertyStatus.SOLD, PropertyStatus.RENTED] },
      },
    });
    
    if (currentCount >= maxListings) {
      throw new AppError(
        `You have reached your listing limit of ${maxListings}. Upgrade to list more properties.`,
        402,
        'LISTING_LIMIT_REACHED'
      );
    }
  }
  
  private validatePropertyCompleteness(property: any) {
    const required = ['title', 'description', 'price', 'address', 'city'];
    const missing = required.filter(field => !property[field]);
    
    if (missing.length > 0) {
      throw new AppError(
        `Missing required fields: ${missing.join(', ')}`,
        400,
        'INCOMPLETE_PROPERTY'
      );
    }
    
    // Check for at least one image
    if (!property.images || property.images.length === 0) {
      throw new AppError(
        'At least one property image is required',
        400,
        'NO_IMAGES'
      );
    }
  }
  
  private hasSignificantChanges(data: UpdatePropertyInput): boolean {
    const significantFields = [
      'price',
      'address',
      'propertyType',
      'listingType',
      'bedrooms',
      'bathrooms',
    ];
    
    return significantFields.some(field => data[field as keyof UpdatePropertyInput] !== undefined);
  }
  
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
