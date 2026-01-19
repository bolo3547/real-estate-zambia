/**
 * Zambia Property - API Route for Inquiries
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { z } from 'zod';

const inquirySchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferPhone: z.boolean().optional(),
  preferEmail: z.boolean().optional(),
  preferredTime: z.string().optional(),
});

// POST: Create new inquiry
export async function POST(request: NextRequest) {
  try {
    // Verify authentication - inquiries require logged-in user
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please sign in to send inquiries' } },
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

    const body = await request.json();

    // Validate input
    const result = inquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: result.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { propertyId, subject, message, preferPhone, preferEmail, preferredTime } = result.data;

    // Check if property exists and get owner
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, ownerId: true },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Property not found' } },
        { status: 404 }
      );
    }

    // Create inquiry with sender and receiver
    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        senderId: payload.userId,
        receiverId: property.ownerId,
        subject,
        message,
        preferPhone: preferPhone ?? false,
        preferEmail: preferEmail ?? true,
        preferredTime,
      },
    });

    // Increment inquiry count on property
    await prisma.property.update({
      where: { id: propertyId },
      data: { inquiryCount: { increment: 1 } },
    });

    // TODO: Send email notification to property owner

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error('Create inquiry error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// GET: Get inquiries (for property owners)
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

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');

    // Build query
    const where: any = {};

    // For non-admin users, only show inquiries for their properties
    if (payload.role !== 'ADMIN') {
      const userProperties = await prisma.property.findMany({
        where: { ownerId: payload.userId },
        select: { id: true },
      });
      where.propertyId = { in: userProperties.map((p) => p.id) };
    }

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (status) {
      where.status = status;
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    console.error('Get inquiries error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
