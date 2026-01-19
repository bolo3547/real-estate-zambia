/**
 * Zambia Property - Prisma Database Client
 * 
 * Singleton pattern to prevent multiple Prisma Client instances
 * in development due to hot reloading.
 */

import { PrismaClient } from '@prisma/client';

// Declare global type for Prisma client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Create Prisma client with logging in development
 */
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

/**
 * Singleton Prisma client instance
 * In production, always create new instance
 * In development, reuse existing instance to prevent connection pool exhaustion
 */
export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
