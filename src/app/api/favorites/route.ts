/**
 * Zambia Property - API Route for Favorites (Saved Properties)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';

// GET: Get user's saved properties
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please sign in' } },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } },
        { status: 401 }
      );
    }

    const savedProperties = await prisma.savedProperty.findMany({
      where: { userId: payload.userId },
      include: {
        property: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: savedProperties.map((sp) => sp.property),
    });
  } catch (error) {
    console.error('Favorites fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// POST: Add property to saved properties
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please sign in' } },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Property ID is required' } },
        { status: 400 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: payload.userId,
          propertyId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'ALREADY_SAVED', message: 'Property already saved' } },
        { status: 400 }
      );
    }

    // Create saved property
    const savedProperty = await prisma.savedProperty.create({
      data: {
        userId: payload.userId,
        propertyId,
      },
    });

    // Increment save count
    await prisma.property.update({
      where: { id: propertyId },
      data: { saveCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: savedProperty }, { status: 201 });
  } catch (error) {
    console.error('Add saved property error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// DELETE: Remove property from saved properties
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please sign in' } },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Property ID is required' } },
        { status: 400 }
      );
    }

    // Delete saved property
    const deleted = await prisma.savedProperty.deleteMany({
      where: {
        userId: payload.userId,
        propertyId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Saved property not found' } },
        { status: 404 }
      );
    }

    // Decrement save count
    await prisma.property.update({
      where: { id: propertyId },
      data: { saveCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove saved property error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
