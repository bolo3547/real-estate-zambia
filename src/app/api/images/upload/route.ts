/**
 * Zambia Property - Image Upload API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadPropertyImage, uploadAvatar, deleteImage } from '@/lib/cloudinary';
import { getCurrentUser } from '@/lib/auth';

function errorResponse(message: string, code: string, statusCode: number) {
  return NextResponse.json(
    { success: false, error: { message, code, statusCode } },
    { status: statusCode }
  );
}

/**
 * POST /api/images/upload
 * Upload an image to Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string || 'property';
    const propertyId = formData.get('propertyId') as string || 'temp';

    if (!file) {
      return errorResponse('No file provided', 'NO_FILE', 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Allowed: JPEG, PNG, WebP, GIF', 'INVALID_FILE_TYPE', 400);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse('File too large. Maximum size is 10MB', 'FILE_TOO_LARGE', 400);
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    let result;
    if (type === 'avatar') {
      result = await uploadAvatar(base64, user.userId);
    } else {
      result = await uploadPropertyImage(base64, propertyId);
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('Failed to upload image', 'UPLOAD_FAILED', 500);
  }
}

/**
 * DELETE /api/images/upload
 * Delete an image from Cloudinary
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return errorResponse('Public ID required', 'MISSING_PUBLIC_ID', 400);
    }

    await deleteImage(publicId);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return errorResponse('Failed to delete image', 'DELETE_FAILED', 500);
  }
}
