/**
 * Zambia Property - JWT Authentication Utilities
 * 
 * Handles token generation, verification, and management
 * using jose library for Edge Runtime compatibility.
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { type User, type UserRole } from '@/types';

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'zambia-property-secret-key-change-in-production'
);
const ACCESS_TOKEN_EXPIRY = '15m';  // Short-lived for security
const REFRESH_TOKEN_EXPIRY = '7d';  // Longer-lived for UX

// Cookie names
export const ACCESS_TOKEN_COOKIE = 'zp_access_token';
export const REFRESH_TOKEN_COOKIE = 'zp_refresh_token';

/**
 * JWT Token Payload
 */
export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
}

/**
 * Generate access token for authenticated user
 */
export async function generateAccessToken(user: Pick<User, 'id' | 'email' | 'role'>): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
  
  return token;
}

/**
 * Generate refresh token for token renewal
 */
export async function generateRefreshToken(user: Pick<User, 'id' | 'email' | 'role'>): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
  
  return token;
}

/**
 * Generate both access and refresh tokens
 */
export async function generateTokenPair(user: Pick<User, 'id' | 'email' | 'role'>) {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user),
  ]);
  
  return { accessToken, refreshToken };
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Verify specifically an access token (checks type)
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'access') {
    return null;
  }
  return payload;
}

/**
 * Set authentication cookies (Server Action / Route Handler)
 */
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  // Access token cookie - httpOnly, secure, sameSite
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minutes in seconds
  });
  
  // Refresh token cookie - longer expiry
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Clear authentication cookies (logout)
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * Get current user from cookies
 */
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  
  if (!accessToken) {
    return null;
  }
  
  return verifyToken(accessToken);
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user is admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'ADMIN';
}

/**
 * Check if user can manage properties (Agent, Landlord, Admin)
 */
export function canManageProperties(role: UserRole): boolean {
  return ['AGENT', 'LANDLORD', 'ADMIN'].includes(role);
}
