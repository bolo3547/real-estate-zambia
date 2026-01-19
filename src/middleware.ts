/**
 * Zambia Property - Next.js Middleware
 * 
 * Handles authentication and authorization at the edge.
 * Protects routes based on user roles.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// JWT secret for token verification
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'zambia-property-secret-key-change-in-production'
);

// Cookie name for access token
const ACCESS_TOKEN_COOKIE = 'zp_access_token';

// Route configurations
const PUBLIC_ROUTES = [
  '/',
  '/properties',
  '/property',
  '/agents',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/properties',
  '/api/agents',
];

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

const DASHBOARD_ROUTES = ['/dashboard'];

const ADMIN_ROUTES = ['/admin'];

/**
 * Check if a path matches any of the route patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

/**
 * Verify JWT token and extract payload
 */
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow static files and API health check
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/api/health'
  ) {
    return NextResponse.next();
  }
  
  // Get access token from cookie
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  
  // Verify token if present
  const user = accessToken ? await verifyToken(accessToken) : null;
  const isAuthenticated = !!user;
  const userRole = user?.role as string | undefined;
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && matchesRoute(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Protect dashboard routes - require authentication
  if (matchesRoute(pathname, DASHBOARD_ROUTES)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if user can access dashboard (Agent, Landlord, Admin)
    if (!['AGENT', 'LANDLORD', 'ADMIN'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Protect admin routes - require ADMIN role
  if (matchesRoute(pathname, ADMIN_ROUTES)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // Add user info to headers for API routes
  if (pathname.startsWith('/api/') && isAuthenticated && user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId as string);
    requestHeaders.set('x-user-email', user.email as string);
    requestHeaders.set('x-user-role', userRole || '');
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/health).*)',
  ],
};
