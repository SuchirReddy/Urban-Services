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

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const messages = await prisma.chatMessage.findMany({
      where: { bookingId: params.id },
      orderBy: { timestamp: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { senderId, senderType, content } = await request.json();

    if (!senderId || !senderType || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        bookingId: params.id,
        senderId,
        senderType,
        content
      }
    });

    // Trigger Pusher event
    try {
      await pusher.trigger(`chat-${params.id}`, 'new-message', message);
    } catch (e) {
      console.warn("Pusher trigger failed. (If you're using dummy keys, this is expected).", e);
    }

    // Simulate Professional Reply
    if (senderType === 'USER') {
      const booking = await prisma.booking.findUnique({ where: { id: params.id } });
      if (booking?.professionalId) {
        setTimeout(async () => {
          try {
            const replyContent = "I'm on my way! Should be there in a few minutes.";
            const reply = await prisma.chatMessage.create({
              data: {
                bookingId: params.id,
                senderId: booking.professionalId!,
                senderType: 'PROFESSIONAL',
                content: replyContent
              }
            });
            await pusher.trigger(`chat-${params.id}`, 'new-message', reply);
          } catch (e) {
            console.error("Failed to simulate pro reply", e);
          }
        }, 2500); // 2.5 second delay
      }
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Failed to post message:', error);
    return NextResponse.json({ error: 'Failed to post message' }, { status: 500 });
  }
}
