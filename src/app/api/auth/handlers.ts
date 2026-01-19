/**
 * Zambia Property - Auth API Routes
 * 
 * Handles user authentication: login, register, logout, token refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { 
  generateTokenPair, 
  setAuthCookies, 
  clearAuthCookies,
  verifyToken,
  getRefreshToken 
} from '@/lib/auth';
import { loginSchema, registerSchema } from '@/lib/validations';
import { generateUniqueSlug } from '@/lib/utils';

/**
 * Helper to create error response
 */
function errorResponse(message: string, code: string, statusCode: number) {
  return NextResponse.json(
    { success: false, error: { message, code, statusCode } },
    { status: statusCode }
  );
}

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export async function loginHandler(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors[0].message,
        'VALIDATION_ERROR',
        400
      );
    }
    
    const { email, password } = validationResult.data;
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        status: true,
        emailVerified: true,
        isDeleted: true,
      },
    });
    
    if (!user || user.isDeleted) {
      return errorResponse('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }
    
    // Check if user has a password (OAuth users may not have one)
    if (!user.passwordHash) {
      return errorResponse('Please sign in with your Google account', 'OAUTH_ACCOUNT', 401);
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }
    
    // Check account status
    if (user.status === 'SUSPENDED') {
      return errorResponse('Your account has been suspended', 'ACCOUNT_SUSPENDED', 403);
    }
    
    if (user.status === 'PENDING_VERIFICATION') {
      return errorResponse('Your account is pending approval', 'ACCOUNT_PENDING', 403);
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });
    
    // Set cookies
    await setAuthCookies(accessToken, refreshToken);
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    
    // Return user data (exclude sensitive fields)
    const { passwordHash, isDeleted, ...safeUser } = user;
    
    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('An unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}

/**
 * POST /api/auth/register
 * Register new user account
 */
export async function registerHandler(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        validationResult.error.errors[0].message,
        'VALIDATION_ERROR',
        400
      );
    }
    
    const { email, password, firstName, lastName, phone, role, companyName } = validationResult.data;
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return errorResponse('Email is already registered', 'EMAIL_EXISTS', 409);
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        role,
        status: 'PENDING_VERIFICATION', // Require admin approval
        emailVerified: null,
        // Create agent profile if role is AGENT
        ...(role === 'AGENT' && {
          agentProfile: {
            create: {
              companyName: companyName || null,
              isVerified: false,
            },
          },
        }),
        // Create landlord profile if role is LANDLORD
        ...(role === 'LANDLORD' && {
          landlordProfile: {
            create: {
              companyName: companyName || null,
              isVerified: false,
            },
          },
        }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });
    
    // Set cookies
    await setAuthCookies(accessToken, refreshToken);
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE',
        entityType: 'User',
        entityId: user.id,
      },
    });
    
    return NextResponse.json({
      success: true,
      user,
      message: 'Registration successful. Your account is pending approval.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse('An unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}

/**
 * POST /api/auth/logout
 * Clear authentication cookies
 */
export async function logoutHandler() {
  try {
    await clearAuthCookies();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse('An unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function meHandler(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return errorResponse('Not authenticated', 'UNAUTHORIZED', 401);
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        agentProfile: {
          select: {
            id: true,
            companyName: true,
            bio: true,
            isVerified: true,
            totalListings: true,
          },
        },
        landlordProfile: {
          select: {
            id: true,
            companyName: true,
            isVerified: true,
          },
        },
      },
    });
    
    if (!user) {
      return errorResponse('User not found', 'NOT_FOUND', 404);
    }
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse('An unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function refreshHandler() {
  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      return errorResponse('No refresh token', 'UNAUTHORIZED', 401);
    }
    
    const payload = await verifyToken(refreshToken);
    
    if (!payload || payload.type !== 'refresh') {
      return errorResponse('Invalid refresh token', 'INVALID_TOKEN', 401);
    }
    
    // Get user to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isDeleted: true,
      },
    });
    
    if (!user || user.isDeleted || user.status !== 'ACTIVE') {
      await clearAuthCookies();
      return errorResponse('User not found or inactive', 'UNAUTHORIZED', 401);
    }
    
    // Generate new tokens
    const tokens = await generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });
    
    await setAuthCookies(tokens.accessToken, tokens.refreshToken);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token refresh error:', error);
    return errorResponse('An unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}
