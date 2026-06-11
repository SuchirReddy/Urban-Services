import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { userId, rating, comment } = await request.json();

    if (!userId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: params.id }
    });

    if (existingReview) {
      return NextResponse.json({ error: 'Review already exists for this booking' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        bookingId: params.id,
        rating,
        comment,
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Failed to post review:', error);
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
  }
}
