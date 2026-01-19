/**
 * Zambia Property - Cloudinary Image Upload Utilities
 * 
 * Handles image upload, optimization, and management
 * using Cloudinary's SDK.
 */

import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Upload presets for different image types
const UPLOAD_PRESETS = {
  property: {
    folder: 'zambia-property/properties',
    transformation: [
      { width: 1920, height: 1280, crop: 'limit', quality: 'auto:best' },
    ],
    thumbnailTransformation: [
      { width: 400, height: 300, crop: 'fill', quality: 'auto:good' },
    ],
  },
  avatar: {
    folder: 'zambia-property/avatars',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto:good' },
    ],
  },
  document: {
    folder: 'zambia-property/documents',
    resource_type: 'raw' as const,
  },
};

/**
 * Upload result interface
 */
export interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload a property image
 * 
 * @param file - Base64 encoded image or file URL
 * @param propertyId - Property ID for organizing uploads
 * @returns Upload result with URLs
 */
export async function uploadPropertyImage(
  file: string,
  propertyId: string
): Promise<UploadResult> {
  const preset = UPLOAD_PRESETS.property;
  
  const result: UploadApiResponse = await cloudinary.uploader.upload(file, {
    folder: `${preset.folder}/${propertyId}`,
    transformation: preset.transformation,
    resource_type: 'image',
  });
  
  // Generate thumbnail URL
  const thumbnailUrl = cloudinary.url(result.public_id, {
    transformation: preset.thumbnailTransformation,
    secure: true,
  });
  
  return {
    url: result.secure_url,
    thumbnailUrl,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Upload multiple property images
 * 
 * @param files - Array of base64 encoded images
 * @param propertyId - Property ID
 * @returns Array of upload results
 */
export async function uploadPropertyImages(
  files: string[],
  propertyId: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadPropertyImage(file, propertyId));
  return Promise.all(uploadPromises);
}

/**
 * Upload user avatar
 * 
 * @param file - Base64 encoded image
 * @param userId - User ID
 * @returns Upload result
 */
export async function uploadAvatar(file: string, userId: string): Promise<UploadResult> {
  const preset = UPLOAD_PRESETS.avatar;
  
  const result: UploadApiResponse = await cloudinary.uploader.upload(file, {
    folder: preset.folder,
    public_id: `avatar_${userId}`,
    transformation: preset.transformation,
    resource_type: 'image',
    overwrite: true, // Replace existing avatar
  });
  
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Delete an image from Cloudinary
 * 
 * @param publicId - Cloudinary public ID
 * @returns True if deleted successfully
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
}

/**
 * Delete multiple images
 * 
 * @param publicIds - Array of Cloudinary public IDs
 * @returns Number of successfully deleted images
 */
export async function deleteImages(publicIds: string[]): Promise<number> {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return Object.values(result.deleted).filter(status => status === 'deleted').length;
  } catch (error) {
    console.error('Failed to delete images:', error);
    return 0;
  }
}

/**
 * Generate optimized image URL with transformations
 * 
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
        quality: options.quality || 'auto:good',
        format: options.format || 'auto',
      },
    ],
    secure: true,
  });
}

/**
 * Validate image file
 * 
 * @param base64 - Base64 encoded image
 * @returns Validation result
 */
export function validateImage(base64: string): { isValid: boolean; error?: string } {
  // Check if it's a valid base64 image
  if (!base64.startsWith('data:image/')) {
    return { isValid: false, error: 'Invalid image format' };
  }
  
  // Extract mime type
  const mimeMatch = base64.match(/data:image\/(\w+);base64/);
  if (!mimeMatch) {
    return { isValid: false, error: 'Could not determine image type' };
  }
  
  const mimeType = mimeMatch[1].toLowerCase();
  const allowedTypes = ['jpeg', 'jpg', 'png', 'webp'];
  
  if (!allowedTypes.includes(mimeType)) {
    return { isValid: false, error: 'Image must be JPEG, PNG, or WebP' };
  }
  
  // Check file size (max 10MB)
  const base64Data = base64.split(',')[1];
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (sizeInBytes > maxSize) {
    return { isValid: false, error: 'Image must be less than 10MB' };
  }
  
  return { isValid: true };
}

export default cloudinary;
