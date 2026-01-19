/**
 * Cache Service
 * Memory-based caching with optional Redis support
 * Falls back gracefully when Redis is not available
 */

import { config } from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RedisClient = any;

export class CacheService {
  private redis: RedisClient | null = null;
  private memoryCache: Map<string, { value: unknown; expiry: number }> = new Map();
  
  constructor() {
    // Redis is optional - falls back to memory cache
    if (config.redis?.url) {
      try {
        // Dynamic import to avoid build errors when ioredis isn't installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Redis = require('ioredis');
        this.redis = new Redis(config.redis.url);
        
        this.redis.on('error', (err: Error) => {
          console.error('Redis connection error:', err);
          // Fall back to memory cache
          this.redis = null;
        });
      } catch {
        console.warn('Redis not available, using memory cache');
      }
    }
  }
  
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.redis) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
      }
      
      // Fallback to memory cache
      const cached = this.memoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return cached.value as T;
      }
      
      this.memoryCache.delete(key);
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  /**
   * Set value in cache
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
        return;
      }
      
      // Fallback to memory cache
      this.memoryCache.set(key, {
        value,
        expiry: Date.now() + ttlSeconds * 1000,
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.del(key);
        return;
      }
      
      this.memoryCache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
  
  /**
   * Delete keys matching pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      if (this.redis) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(keys);
        }
        return;
      }
      
      // Memory cache pattern matching
      const regex = new RegExp(pattern.replace('*', '.*'));
      for (const key of this.memoryCache.keys()) {
        if (regex.test(key)) {
          this.memoryCache.delete(key);
        }
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }
  
  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.flushdb();
        return;
      }
      
      this.memoryCache.clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
  
  /**
   * Get or set with callback
   */
  async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    
    const value = await callback();
    await this.set(key, value, ttlSeconds);
    return value;
  }
  
  /**
   * Increment counter
   */
  async increment(key: string, ttlSeconds?: number): Promise<number> {
    try {
      if (this.redis) {
        const value = await this.redis.incr(key);
        if (ttlSeconds) {
          await this.redis.expire(key, ttlSeconds);
        }
        return value;
      }
      
      // Memory cache increment
      const cached = this.memoryCache.get(key);
      const currentValue = typeof cached?.value === 'number' ? cached.value : 0;
      const newValue = currentValue + 1;
      this.memoryCache.set(key, {
        value: newValue,
        expiry: ttlSeconds ? Date.now() + ttlSeconds * 1000 : Infinity,
      });
      return newValue;
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }
}
