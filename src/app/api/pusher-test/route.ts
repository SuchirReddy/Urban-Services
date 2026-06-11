import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    await pusherServer.trigger('test-channel', 'test-event', { message });
    return NextResponse.json({ success: true, message: 'Event triggered' });
  } catch (error) {
    console.error('Pusher error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
