import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const bookings = await prisma.booking.findMany({
      where: { professionalId: params.id },
      include: {
        service: true,
        user: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch professional bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch professional bookings' }, { status: 500 });
  }
}
