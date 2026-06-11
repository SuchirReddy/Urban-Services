import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const servicesData = await prisma.service.findMany({
      include: {
        addOns: true,
        bookings: {
          include: {
            review: true
          }
        }
      }
    });

    const services = servicesData.map(s => {
      const reviews = s.bookings.map(b => b.review).filter(Boolean);
      const rating = reviews.length ? reviews.reduce((acc, r) => acc + (r?.rating || 0), 0) / reviews.length : 0;
      
      const { bookings, ...serviceWithoutBookings } = s;
      return { ...serviceWithoutBookings, rating };
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
