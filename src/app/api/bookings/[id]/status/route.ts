import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "mock_app_id",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "mock_key",
  secret: process.env.PUSHER_SECRET || "mock_secret",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
  useTLS: true,
});

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    // Retrieve booking to check current total for commission calculation
    const currentBooking = await prisma.booking.findUnique({
      where: { id: params.id }
    });

    if (!currentBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const dataToUpdate: any = { status };

    // If completing the job, record the 20% commission
    if (status === 'COMPLETED') {
      dataToUpdate.commission = currentBooking.total * 0.20;
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: dataToUpdate
    });

    // Notify customer on status change
    try {
      await pusher.trigger(`booking-${params.id}`, 'status-update', { status: booking.status });
    } catch (e) {
      console.warn("Pusher trigger failed. (Expected if mock keys are used).", e);
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  // Alias POST to PATCH for backward compatibility with earlier demo shortcuts
  return PATCH(request, props);
}
