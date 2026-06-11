import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        professional: { select: { name: true } },
        service: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch admin bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch admin bookings' }, { status: 500 });
  }
}
