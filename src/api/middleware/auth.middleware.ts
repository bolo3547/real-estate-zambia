/**
 * Authentication & Authorization Middleware
 * Handles JWT verification and role-based access control
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { AppError } from '../utils/errors';
import { config } from '../../config';

const prisma = new PrismaClient();

/**
 * Extended Request interface with user data
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  };
}

/**
 * JWT Payload interface
 */
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * ==============================
 * AUTHENTICATION MIDDLEWARE
 * ==============================
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new AppError('Invalid token format', 401, 'INVALID_TOKEN');
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isDeleted: true,
      },
    });
    
    if (!user || user.isDeleted) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }
    
    if (user.status === UserStatus.SUSPENDED) {
      throw new AppError('Account suspended', 403, 'ACCOUNT_SUSPENDED');
    }
    
    if (user.status === UserStatus.INACTIVE) {
      throw new AppError('Account inactive', 403, 'ACCOUNT_INACTIVE');
    }
    
    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
    } else {
      next(error);
    }
  }
};

/**
 * ==============================
 * OPTIONAL AUTHENTICATION
 * ==============================
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }
    
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isDeleted: true,
      },
    });
    
    if (user && !user.isDeleted && user.status === UserStatus.ACTIVE) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      };
    }
    
    next();
  } catch {
    // Silently ignore token errors for optional auth
    next();
  }
};

/**
 * ==============================
 * AUTHORIZATION MIDDLEWARE
 * ==============================
 * Checks if user has required role(s)
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
    }
    
    next();
  };
};

/**
 * ==============================
 * OWNERSHIP MIDDLEWARE
 * ==============================
 * Verifies resource ownership or admin access
 */
export const requireOwnership = (
  resourceType: 'property' | 'inquiry' | 'message'
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }
      
      const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      // Admins can access all resources
      if (req.user.role === UserRole.ADMIN) {
        return next();
      }
      
      let isOwner = false;
      
      switch (resourceType) {
        case 'property':
          const property = await prisma.property.findUnique({
            where: { id: resourceId },
            select: { ownerId: true, agentId: true },
          });
          
          if (!property) {
            throw new AppError('Property not found', 404, 'NOT_FOUND');
          }
          
          // Owner or assigned agent can access
          isOwner = property.ownerId === req.user.id;
          const isAgent = property.agentId && 
            (await prisma.agentProfile.findUnique({
              where: { id: property.agentId },
              select: { userId: true },
            }))?.userId === req.user.id;
          
          if (!isOwner && !isAgent) {
            throw new AppError('Access denied', 403, 'FORBIDDEN');
          }
          break;
          
        case 'inquiry':
          const inquiry = await prisma.inquiry.findUnique({
            where: { id: resourceId },
            select: { senderId: true, receiverId: true },
          });
          
          if (!inquiry) {
            throw new AppError('Inquiry not found', 404, 'NOT_FOUND');
          }
          
          isOwner = inquiry.senderId === req.user.id || 
                    inquiry.receiverId === req.user.id;
          
          if (!isOwner) {
            throw new AppError('Access denied', 403, 'FORBIDDEN');
          }
          break;
          
        case 'message':
          const message = await prisma.message.findUnique({
            where: { id: resourceId },
            select: { senderId: true, receiverId: true },
          });
          
          if (!message) {
            throw new AppError('Message not found', 404, 'NOT_FOUND');
          }
          
          isOwner = message.senderId === req.user.id || 
                    message.receiverId === req.user.id;
          
          if (!isOwner) {
            throw new AppError('Access denied', 403, 'FORBIDDEN');
          }
          break;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * ==============================
 * VERIFIED AGENT MIDDLEWARE
 * ==============================
 * Requires user to be a verified agent
 */
export const requireVerifiedAgent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }
    
    if (req.user.role !== UserRole.AGENT) {
      throw new AppError('Agent role required', 403, 'FORBIDDEN');
    }
    
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: req.user.id },
      select: { isVerified: true },
    });
    
    if (!agentProfile?.isVerified) {
      throw new AppError(
        'Agent verification required',
        403,
        'AGENT_NOT_VERIFIED'
      );
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * ==============================
 * SUBSCRIPTION CHECK MIDDLEWARE
 * ==============================
 * Verifies user has required subscription tier
 */
export const requireSubscription = (minTier: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }
      
      // Admins bypass subscription checks
      if (req.user.role === UserRole.ADMIN) {
        return next();
      }
      
      const subscription = await prisma.subscription.findUnique({
        where: { userId: req.user.id },
        select: { tier: true, status: true },
      });
      
      if (!subscription) {
        throw new AppError(
          'Subscription required',
          402,
          'SUBSCRIPTION_REQUIRED'
        );
      }
      
      if (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIAL') {
        throw new AppError(
          'Active subscription required',
          402,
          'SUBSCRIPTION_INACTIVE'
        );
      }
      
      if (!minTier.includes(subscription.tier)) {
        throw new AppError(
          'Upgrade subscription to access this feature',
          402,
          'SUBSCRIPTION_UPGRADE_REQUIRED'
        );
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
