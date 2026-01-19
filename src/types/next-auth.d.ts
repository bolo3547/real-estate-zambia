/**
 * NextAuth.js Type Extensions
 * Extends the default NextAuth types to include custom user properties
 */

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

// Match Prisma schema enums
type UserRole = 'ADMIN' | 'AGENT' | 'LANDLORD' | 'TENANT' | 'BUYER';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
      status: UserStatus;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
    status?: UserStatus;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
    status?: UserStatus;
  }
}
