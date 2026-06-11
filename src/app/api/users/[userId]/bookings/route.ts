import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ userId: string }> }) {
  try {
    const params = await props.params;
    const bookings = await prisma.booking.findMany({
      where: { userId: params.userId },
      include: {
        service: true,
        professional: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch user bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch user bookings' }, { status: 500 });
  }
}
