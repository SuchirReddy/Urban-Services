import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, serviceId, address, date, timeSlot, total, addOns } = body;

    if (!userId || !serviceId || !address || !date || !timeSlot || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find a professional who provides this service
    const professional = await prisma.professional.findFirst({
      where: {
        services: {
          some: { id: serviceId }
        }
      }
    });

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        professionalId: professional?.id || null,
        address,
        date: new Date(date),
        timeSlot,
        status: 'PENDING',
        total,
        addOns: JSON.stringify(addOns || []),
      }
    });

    // Simulate Pusher event
    if (professional) {
      console.log(`[PUSHER SIMULATION] Event 'new-booking' on channel 'booking-${professional.id}'`);
      console.log(`Booking Data:`, booking);
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
