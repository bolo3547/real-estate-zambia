/**
 * Property Routes
 * Handles all property-related endpoints
 */

import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { rateLimiter } from '../middleware/rate-limiter.middleware';
import { 
  createPropertySchema, 
  updatePropertySchema,
  propertyQuerySchema,
  imageUploadSchema 
} from '../validators/property.validators';
import { UserRole } from '@prisma/client';

const router = Router();
const controller = new PropertyController();

/**
 * ==============================
 * PUBLIC ENDPOINTS
 * ==============================
 */

// List properties with filters
router.get(
  '/',
  optionalAuth,
  validateRequest(propertyQuerySchema, 'query'),
  controller.list
);

// Get featured properties
router.get(
  '/featured',
  rateLimiter({ windowMs: 60000, max: 100 }),
  controller.getFeatured
);

// Get property by ID or slug
router.get(
  '/:idOrSlug',
  optionalAuth,
  controller.getByIdOrSlug
);

// Track property view
router.post(
  '/:id/view',
  optionalAuth,
  rateLimiter({ windowMs: 60000, max: 30 }),
  controller.trackView
);

/**
 * ==============================
 * AUTHENTICATED ENDPOINTS
 * ==============================
 */

// Create property
router.post(
  '/',
  authenticate,
  authorize([UserRole.AGENT, UserRole.LANDLORD, UserRole.ADMIN]),
  validateRequest(createPropertySchema),
  controller.create
);

// Update property
router.patch(
  '/:id',
  authenticate,
  validateRequest(updatePropertySchema),
  controller.update
);

// Delete property (soft)
router.delete(
  '/:id',
  authenticate,
  controller.delete
);

// Submit for approval
router.post(
  '/:id/submit',
  authenticate,
  controller.submitForApproval
);

// Withdraw listing
router.post(
  '/:id/withdraw',
  authenticate,
  controller.withdraw
);

/**
 * ==============================
 * IMAGE MANAGEMENT
 * ==============================
 */

// Upload images
router.post(
  '/:id/images',
  authenticate,
  validateRequest(imageUploadSchema),
  controller.uploadImages
);

// Delete image
router.delete(
  '/:id/images/:imageId',
  authenticate,
  controller.deleteImage
);

// Reorder images
router.patch(
  '/:id/images/reorder',
  authenticate,
  controller.reorderImages
);

/**
 * ==============================
 * INQUIRY CREATION
 * ==============================
 */

// Create inquiry for property
router.post(
  '/:id/inquire',
  authenticate,
  rateLimiter({ windowMs: 3600000, max: 10 }),
  controller.createInquiry
);

export default router;
