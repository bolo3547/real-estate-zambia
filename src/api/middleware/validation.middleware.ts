/**
 * Validation Middleware
 * Request validation using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

type RequestLocation = 'body' | 'query' | 'params';

/**
 * Validate request data against a Zod schema
 */
export const validateRequest = (
  schema: ZodSchema,
  location: RequestLocation = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[location];
      const validated = await schema.parseAsync(data);
      
      // Replace with validated/transformed data
      req[location] = validated;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        return next(new ValidationError('Validation failed', details));
      }
      
      next(error);
    }
  };
};

/**
 * Validate multiple locations
 */
export const validateMultiple = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: any[] = [];
      
      for (const [location, schema] of Object.entries(schemas)) {
        if (schema) {
          try {
            const validated = await schema.parseAsync(req[location as RequestLocation]);
            req[location as RequestLocation] = validated;
          } catch (error) {
            if (error instanceof ZodError) {
              errors.push(
                ...error.errors.map(err => ({
                  location,
                  field: err.path.join('.'),
                  message: err.message,
                  code: err.code,
                }))
              );
            }
          }
        }
      }
      
      if (errors.length > 0) {
        return next(new ValidationError('Validation failed', errors));
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Sanitize string inputs (basic XSS prevention)
 */
export const sanitizeInputs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  next();
};
