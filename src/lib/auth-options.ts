/**
 * NextAuth.js Configuration
 * Supports Google OAuth and Credentials authentication
 */

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { verifyPassword } from './password';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name || profile.name?.split(' ')[0] || '',
          lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || '',
          avatarUrl: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),
    
    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password');
        }
        
        if (user.isDeleted) {
          throw new Error('Account has been deleted');
        }
        
        if (user.status === 'SUSPENDED') {
          throw new Error('Your account has been suspended');
        }
        
        const isValid = await verifyPassword(credentials.password, user.passwordHash);
        
        if (!isValid) {
          throw new Error('Invalid email or password');
        }
        
        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth sign-ins, check if user exists or create new one
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        
        if (existingUser) {
          // Update avatar if not set
          if (!existingUser.avatarUrl && (user as any).avatarUrl) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { 
                avatarUrl: (user as any).avatarUrl,
                emailVerified: new Date(),
                lastLoginAt: new Date(),
              },
            });
          } else {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { lastLoginAt: new Date() },
            });
          }
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'BUYER';
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
      }
      
      // Fetch fresh user data on every token refresh
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
            status: true,
          },
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.avatarUrl = dbUser.avatarUrl;
          token.status = dbUser.status;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).avatarUrl = token.avatarUrl;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },
  
  events: {
    async createUser({ user }) {
      // When a new OAuth user is created, set default values
      await prisma.user.update({
        where: { id: user.id },
        data: {
          status: 'ACTIVE', // OAuth users are automatically verified
          emailVerified: new Date(),
        },
      });
    },
  },
  
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    newUser: '/auth/welcome',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};
