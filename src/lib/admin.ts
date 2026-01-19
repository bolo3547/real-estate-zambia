/**
 * Zambia Property - Admin Utilities
 * 
 * Secure admin helper functions with audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { AuditAction } from '@prisma/client';

// ============================================================================
// ERROR RESPONSE HELPER
// ============================================================================

export function errorResponse(message: string, code: string, statusCode: number) {
  return NextResponse.json(
    { success: false, error: { message, code, statusCode } },
    { status: statusCode }
  );
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

// ============================================================================
// ADMIN VERIFICATION
// ============================================================================

/**
 * Verify admin role from request headers (set by middleware)
 * Returns error response if not admin, null if authorized
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const userRole = request.headers.get('x-user-role');
  const userId = request.headers.get('x-user-id');
  
  if (!userId || !userRole) {
    return errorResponse('Unauthorized access', 'UNAUTHORIZED', 401);
  }
  
  if (userRole !== 'ADMIN') {
    return errorResponse('Admin access required', 'FORBIDDEN', 403);
  }
  
  return null;
}

/**
 * Get admin user ID from request headers
 */
export function getAdminUserId(request: NextRequest): string | null {
  return request.headers.get('x-user-id');
}

/**
 * Get admin user details from request headers
 */
export function getAdminFromHeaders(request: NextRequest) {
  return {
    userId: request.headers.get('x-user-id'),
    email: request.headers.get('x-user-email'),
    role: request.headers.get('x-user-role'),
  };
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

interface AuditLogParams {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  targetUserId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog({
  userId,
  action,
  entityType,
  entityId,
  targetUserId,
  oldValues,
  newValues,
  ipAddress,
  userAgent,
  requestId,
}: AuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        targetUserId,
        oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : null,
        newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : null,
        ipAddress,
        userAgent,
        requestId,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging should not break the main operation
    return null;
  }
}

/**
 * Extract IP address from request
 */
export function getIpAddress(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPaginationParams(request: NextRequest, defaultLimit = 20): PaginationParams {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || String(defaultLimit), 10)));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / params.limit);
  
  return {
    items,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  };
}

// ============================================================================
// SEARCH & FILTER HELPERS
// ============================================================================

export function getSearchParam(request: NextRequest, key: string): string | null {
  const { searchParams } = new URL(request.url);
  return searchParams.get(key);
}

export function getSearchParams(request: NextRequest): URLSearchParams {
  const { searchParams } = new URL(request.url);
  return searchParams;
}

// ============================================================================
// DATA SANITIZATION
// ============================================================================

/**
 * Sanitize user data for API response (remove sensitive fields)
 */
export function sanitizeUser<T extends Record<string, unknown>>(user: T): Omit<T, 'passwordHash'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...sanitized } = user;
  return sanitized as Omit<T, 'passwordHash'>;
}

/**
 * Sanitize array of users
 */
export function sanitizeUsers<T extends Record<string, unknown>>(users: T[]): Omit<T, 'passwordHash'>[] {
  return users.map(sanitizeUser);
}

// ============================================================================
// STATUS HELPERS
// ============================================================================

export const USER_STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
  PENDING: 'Pending',
} as const;

export const USER_ROLE_LABELS = {
  ADMIN: 'Administrator',
  AGENT: 'Agent',
  LANDLORD: 'Landlord',
  TENANT: 'Tenant',
  BUYER: 'Buyer',
} as const;

export const PROPERTY_STATUS_LABELS = {
  DRAFT: 'Draft',
  PENDING: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SOLD: 'Sold',
  RENTED: 'Rented',
  UNAVAILABLE: 'Unavailable',
} as const;

export const APPROVAL_ACTION_LABELS = {
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  REVISION_REQUESTED: 'Revision Requested',
} as const;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): string | null {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return `Missing required field: ${String(field)}`;
    }
  }
  return null;
}
