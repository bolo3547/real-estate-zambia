/**
 * Zambia Property - Property Images API
 * 
 * Handles image upload and management for properties
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadPropertyImages, deleteImage, validateImage } from '@/lib/cloudinary';

function errorResponse(message: string, code: string, statusCode: number) {
  return NextResponse.json(
    { success: false, error: { message, code, statusCode } },
    { status: statusCode }
  );
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/properties/[id]/images
 * Upload images to property
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }
    
    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    
    if (!property) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    if (property.ownerId !== userId) {
      return errorResponse('Not authorized', 'FORBIDDEN', 403);
    }
    
    const body = await request.json();
    const { images } = body; // Array of base64 images
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return errorResponse('No images provided', 'VALIDATION_ERROR', 400);
    }
    
    // Validate all images
    for (const image of images) {
      const validation = validateImage(image);
      if (!validation.isValid) {
        return errorResponse(validation.error || 'Invalid image', 'VALIDATION_ERROR', 400);
      }
    }
    
    // Check existing image count
    const existingCount = await prisma.propertyImage.count({
      where: { propertyId: id },
    });
    
    const maxImages = 20;
    if (existingCount + images.length > maxImages) {
      return errorResponse(
        `Cannot exceed ${maxImages} images per property`,
        'LIMIT_EXCEEDED',
        400
      );
    }
    
    // Upload to Cloudinary
    const uploadResults = await uploadPropertyImages(images, id);
    
    // Check if this is the first image (set as primary)
    const isFirstImage = existingCount === 0;
    
    // Save to database
    const createdImages = await prisma.propertyImage.createMany({
      data: uploadResults.map((result, index) => ({
        propertyId: id,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        publicId: result.publicId,
        isPrimary: isFirstImage && index === 0,
        sortOrder: existingCount + index,
        width: result.width,
        height: result.height,
        sizeBytes: result.bytes,
      })),
    });
    
    // Fetch and return created images
    const propertyImages = await prisma.propertyImage.findMany({
      where: { propertyId: id },
      orderBy: { sortOrder: 'asc' },
    });
    
    return NextResponse.json({
      success: true,
      data: propertyImages,
      message: `${uploadResults.length} image(s) uploaded successfully`,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload images error:', error);
    return errorResponse('Failed to upload images', 'INTERNAL_ERROR', 500);
  }
}

/**
 * DELETE /api/properties/[id]/images
 * Delete an image from property
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    
    if (!userId) {
      return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }
    
    if (!imageId) {
      return errorResponse('Image ID required', 'VALIDATION_ERROR', 400);
    }
    
    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    
    if (!property) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    if (property.ownerId !== userId) {
      return errorResponse('Not authorized', 'FORBIDDEN', 403);
    }
    
    // Find image
    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });
    
    if (!image || image.propertyId !== id) {
      return errorResponse('Image not found', 'NOT_FOUND', 404);
    }
    
    // Delete from Cloudinary - extract public ID from URL
    // Cloudinary URLs typically include the public_id in the path
    try {
      const urlParts = image.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const publicId = fileName.split('.')[0];
      if (publicId) {
        await deleteImage(publicId);
      }
    } catch (e) {
      console.error('Failed to delete from Cloudinary:', e);
      // Continue with database deletion even if Cloudinary fails
    }
    
    // Delete from database
    await prisma.propertyImage.delete({
      where: { id: imageId },
    });
    
    // If deleted image was primary, set next image as primary
    if (image.isPrimary) {
      const nextImage = await prisma.propertyImage.findFirst({
        where: { propertyId: id },
        orderBy: { sortOrder: 'asc' },
      });
      
      if (nextImage) {
        await prisma.propertyImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    return errorResponse('Failed to delete image', 'INTERNAL_ERROR', 500);
  }
}

/**
 * PATCH /api/properties/[id]/images
 * Reorder images or set primary
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }
    
    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    
    if (!property) {
      return errorResponse('Property not found', 'NOT_FOUND', 404);
    }
    
    if (property.ownerId !== userId) {
      return errorResponse('Not authorized', 'FORBIDDEN', 403);
    }
    
    const body = await request.json();
    const { imageIds, primaryId } = body;
    
    // Reorder images
    if (imageIds && Array.isArray(imageIds)) {
      await Promise.all(
        imageIds.map((imageId, index) =>
          prisma.propertyImage.updateMany({
            where: { id: imageId, propertyId: id },
            data: { sortOrder: index },
          })
        )
      );
    }
    
    // Set primary image
    if (primaryId) {
      // Remove primary from all
      await prisma.propertyImage.updateMany({
        where: { propertyId: id },
        data: { isPrimary: false },
      });
      
      // Set new primary
      await prisma.propertyImage.updateMany({
        where: { id: primaryId, propertyId: id },
        data: { isPrimary: true },
      });
    }
    
    // Return updated images
    const images = await prisma.propertyImage.findMany({
      where: { propertyId: id },
      orderBy: { sortOrder: 'asc' },
    });
    
    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error('Update images error:', error);
    return errorResponse('Failed to update images', 'INTERNAL_ERROR', 500);
  }
}
