import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const serviceData = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        addOns: true,
        bookings: {
          include: {
            review: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!serviceData) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Process reviews
    const reviews = serviceData.bookings
      .map(b => b.review)
      .filter((r): r is NonNullable<typeof r> => r !== null);

    const totalReviews = reviews.length;
    const rating = totalReviews > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews 
      : 0;

    const { bookings, ...service } = serviceData;

    return NextResponse.json({ 
      ...service, 
      rating, 
      reviews: reviews.slice(0, 5), 
      reviewCount: totalReviews 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}
