/**
 * Rate Limiting Middleware
 * Protects API from abuse
 */

import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../utils/errors';
import { CacheService } from '../../services/cache.service';

interface RateLimiterOptions {
  windowMs: number;      // Time window in milliseconds
  max: number;           // Max requests per window
  keyPrefix?: string;    // Cache key prefix
  keyGenerator?: (req: Request) => string;
  skipFailedRequests?: boolean;
  message?: string;
}

const cache = new CacheService();

/**
 * Default key generator using IP and user ID
 */
const defaultKeyGenerator = (req: Request): string => {
  const userId = (req as any).user?.id || 'anonymous';
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  return `${userId}:${ip}`;
};

/**
 * Rate limiter factory
 */
export const rateLimiter = (options: RateLimiterOptions) => {
  const {
    windowMs,
    max,
    keyPrefix = 'ratelimit',
    keyGenerator = defaultKeyGenerator,
    skipFailedRequests = false,
    message = 'Too many requests, please try again later',
  } = options;
  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `${keyPrefix}:${keyGenerator(req)}`;
      const windowSeconds = Math.ceil(windowMs / 1000);
      
      // Get current count
      const current = await cache.get<number>(key) || 0;
      
      // Check limit
      if (current >= max) {
        // Set retry header
        res.set('Retry-After', String(windowSeconds));
        res.set('X-RateLimit-Limit', String(max));
        res.set('X-RateLimit-Remaining', '0');
        res.set('X-RateLimit-Reset', String(Date.now() + windowMs));
        
        throw new RateLimitError(message);
      }
      
      // Increment counter
      const newCount = await cache.increment(key, windowSeconds);
      
      // Set headers
      res.set('X-RateLimit-Limit', String(max));
      res.set('X-RateLimit-Remaining', String(Math.max(0, max - newCount)));
      res.set('X-RateLimit-Reset', String(Date.now() + windowMs));
      
      // Optionally skip counting failed requests
      if (skipFailedRequests) {
        res.on('finish', async () => {
          if (res.statusCode >= 400) {
            // Decrement on failure (best effort)
            const currentVal = await cache.get<number>(key) || 0;
            if (currentVal > 0) {
              await cache.set(key, currentVal - 1, windowSeconds);
            }
          }
        });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Preset rate limiters
 */
export const rateLimiters = {
  // Standard API rate limit
  standard: rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    keyPrefix: 'rl:standard',
  }),
  
  // Authentication endpoints
  auth: rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    keyPrefix: 'rl:auth',
    message: 'Too many authentication attempts, please try again later',
  }),
  
  // Strict for sensitive operations
  strict: rateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    keyPrefix: 'rl:strict',
    message: 'Rate limit exceeded for this operation',
  }),
  
  // Search/listing endpoints
  search: rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    keyPrefix: 'rl:search',
  }),
  
  // File uploads
  upload: rateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50,
    keyPrefix: 'rl:upload',
  }),
};

/**
 * Sliding window rate limiter (more accurate)
 */
export const slidingWindowLimiter = (options: RateLimiterOptions) => {
  const {
    windowMs,
    max,
    keyPrefix = 'swrl',
    keyGenerator = defaultKeyGenerator,
    message = 'Too many requests',
  } = options;
  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `${keyPrefix}:${keyGenerator(req)}`;
      const now = Date.now();
      const windowStart = now - windowMs;
      
      // Get timestamps of requests
      const timestamps = await cache.get<number[]>(key) || [];
      
      // Filter to only requests within window
      const validTimestamps = timestamps.filter(t => t > windowStart);
      
      if (validTimestamps.length >= max) {
        const oldestValidRequest = Math.min(...validTimestamps);
        const retryAfter = Math.ceil((oldestValidRequest + windowMs - now) / 1000);
        
        res.set('Retry-After', String(retryAfter));
        throw new RateLimitError(message);
      }
      
      // Add current request
      validTimestamps.push(now);
      await cache.set(key, validTimestamps, Math.ceil(windowMs / 1000));
      
      res.set('X-RateLimit-Limit', String(max));
      res.set('X-RateLimit-Remaining', String(max - validTimestamps.length));
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
